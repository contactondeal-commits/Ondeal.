"use server";

import { revalidatePath } from "next/cache";
import { submitJudgemeReview } from "@/lib/shopify/judgeme";

/**
 * Mission "FORMULAIRE AVIS CLIENT" (17/08/2026) — voir judgeme.ts pour le
 * contexte complet. Pont "use client" → Judge.me, suivant le même modèle
 * que les autres Server Actions de ce projet (shopify-checkout.ts,
 * wishlist.ts, newsletter.ts) : le jeton privé Judge.me ne quitte jamais
 * le serveur.
 *
 * Validation défensive (même esprit que shopify-checkout.ts, section 17 de
 * l'audit sécurité du 15/08/2026) : une Server Action est un point d'entrée
 * public, appelable avec n'importe quelle donnée hors de l'UI normale.
 * Bornes larges, jamais bloquantes pour un usage normal depuis le
 * formulaire — uniquement un filet contre un envoi malformé ou hostile.
 */

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 320;
const MAX_TITLE_LENGTH = 150;
const MAX_BODY_LENGTH = 5000;
const MIN_BODY_LENGTH = 3;
// Grossier mais suffisant pour rejeter une saisie clairement invalide côté
// serveur — jamais utilisé comme validation d'email "définitive" (Judge.me
// fait sa propre vérification côté serveur de toute façon).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SubmitReviewFormResult {
  ok: boolean;
  error?: "invalid_input" | "config_missing" | "invalid_product" | "submit_failed" | "network_error" | "honeypot";
}

export async function submitProductReview(input: unknown): Promise<SubmitReviewFormResult> {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "invalid_input" };
  }
  const data = input as Record<string, unknown>;

  // Piège à robots : champ jamais visible/rempli par un vrai visiteur (voir
  // WriteReviewForm.tsx, style visually-hidden). Un bot qui remplit tous
  // les champs d'un formulaire trouvé dans le HTML le remplira aussi —
  // aucun visiteur humain normal ne peut le faire. Échec silencieux (même
  // erreur générique qu'une entrée invalide) plutôt que de révéler au bot
  // que son remplissage a été détecté.
  if (typeof data.honeypot === "string" && data.honeypot.length > 0) {
    return { ok: false, error: "honeypot" };
  }

  const slug = typeof data.slug === "string" ? data.slug : "";
  const shopifyProductId = typeof data.shopifyProductId === "string" ? data.shopifyProductId : "";
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const rating = typeof data.rating === "number" ? data.rating : Number(data.rating);
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const body = typeof data.body === "string" ? data.body.trim() : "";

  if (
    !slug ||
    !shopifyProductId ||
    !name ||
    name.length > MAX_NAME_LENGTH ||
    !email ||
    email.length > MAX_EMAIL_LENGTH ||
    !EMAIL_PATTERN.test(email) ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    title.length > MAX_TITLE_LENGTH ||
    body.length < MIN_BODY_LENGTH ||
    body.length > MAX_BODY_LENGTH
  ) {
    return { ok: false, error: "invalid_input" };
  }

  const numericProductId = shopifyProductId.split("/").pop() ?? "";

  const result = await submitJudgemeReview({
    shopifyProductId: numericProductId,
    name,
    email,
    rating,
    title,
    body,
  });

  if (!result.ok) {
    return { ok: false, error: result.error as SubmitReviewFormResult["error"] };
  }

  // Publication immédiate demandée explicitement par le client (plutôt
  // qu'une file de validation manuelle) : on invalide immédiatement le
  // cache de LA fiche produit concernée, pour que le nouvel avis soit
  // visible dès le prochain chargement — sans attendre la revalidation
  // automatique de 300s (voir fetchJudgemeProductReviews) ni impacter le
  // cache des autres pages.
  revalidatePath(`/product/${slug}`);

  return { ok: true };
}
