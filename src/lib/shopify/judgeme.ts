import type { ProductReview } from "@/types";

/**
 * BUG FIX (2026-08-17) — "l'avis client n'apparaît plus" (suite du correctif
 * NaN du 2026-08-16).
 *
 * Contexte : après la correction du NaN, le résumé (note moyenne + nombre
 * d'avis) s'affiche correctement, mais le contenu détaillé de l'avis
 * (auteur, texte) n'apparaissait jamais sur la fiche produit — parce qu'il
 * n'a JAMAIS été branché : les seuls metafields Shopify lus jusqu'ici
 * (`reviews.rating`, `reviews.rating_count`, voir storefront.ts) sont des
 * agrégats, pas le contenu individuel des avis.
 *
 * PISTE ABANDONNÉE (documentée pour éviter de la retenter) : Judge.me
 * synchronise aussi un metafield Shopify PAR PRODUIT contenant le détail
 * complet des avis (`judgeme.review_widget_data`, JSON), lisible uniquement
 * via l'API Admin Shopify (pas Storefront — vérifié par appel direct,
 * retourne `null` côté Storefront). Mais le token
 * `SHOPIFY_ADMIN_ACCESS_TOKEN` déjà configuré dans ce projet n'a PAS le
 * scope `read_products` ("Access denied for products field", vérifié le
 * 17/08/2026) — l'ajouter est un changement de configuration de compte qui
 * nécessite une confirmation explicite de l'utilisateur ; celui-ci a préféré
 * l'option ci-dessous.
 *
 * SOLUTION RETENUE : l'API REST officielle de Judge.me
 * (GET https://judge.me/api/v1/reviews), avec le jeton API PRIVÉ Judge.me
 * (récupéré par l'utilisateur lui-même dans Shopify Admin > Applications >
 * Judge.me Reviews > Paramètres > Général > Intégrations > "Voir les jetons
 * API" — jamais saisi par cette session). Le jeton PUBLIC a été testé en
 * premier et s'est révélé insuffisant pour cet endpoint ("You are using a
 * public token which does not have enough permissions").
 *
 * IMPORTANT (sécurité/vie privée) : la réponse de cette API contient des
 * données personnelles des clients (email, adresse IP du reviewer). Ce
 * module ne doit JAMAIS renvoyer ces champs — seuls
 * auteur/titre/texte/note/date/statut vérifié sont extraits et exposés.
 *
 * Filtrage : l'API ne supporte pas de filtre serveur fiable par produit
 * Shopify (paramètres `product_external_id`/`external_id` testés le
 * 17/08/2026 : silencieusement ignorés par Judge.me). Le filtrage par
 * produit (`product_external_id`) et par statut (`published: true`,
 * `curated: "ok"`) est donc fait ici, côté serveur Next.js, après
 * récupération. `published=true` est passé en paramètre de requête (marche
 * bien, vérifié) pour réduire le volume transféré, mais le filtrage définitif
 * reste fait dans ce code — jamais fait confiance à un filtre non vérifié.
 *
 * Si le token est absent, ou si la requête échoue pour quelque raison que ce
 * soit, cette fonction retourne un tableau vide plutôt que de faire échouer
 * le rendu de la fiche produit : le résumé (note/nombre d'avis, garanti par
 * l'API Storefront) reste correct indépendamment de cet appel. Aucun avis
 * n'est jamais inventé pour combler une absence de donnée.
 */

const JUDGEME_REVIEWS_ENDPOINT = "https://judge.me/api/v1/reviews";

// Sécurité anti-boucle infinie : 100 avis/page × 5 pages = 500 avis max
// parcourus par appel. Largement suffisant au 17/08/2026 (1 avis publié au
// total sur toute la boutique) — à augmenter si le volume d'avis explique un
// jour un avis manquant sur un produit à forte pagination.
const MAX_PAGES = 5;
const PER_PAGE = 100;

interface JudgemeReviewerRaw {
  name: string | null;
}

interface JudgemeReviewRaw {
  id: number;
  title: string | null;
  body: string | null;
  rating: number;
  product_external_id: number;
  reviewer: JudgemeReviewerRaw | null;
  published: boolean;
  curated: string;
  verified: string; // "verified-purchase" | "nothing" | ...
  created_at: string;
}

interface JudgemeReviewsResponse {
  reviews?: JudgemeReviewRaw[];
  error?: string;
}

function formatReviewDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Récupère les avis détaillés (auteur, texte, date) d'un produit Shopify
 * via l'API REST Judge.me. `shopifyProductId` doit être l'ID Shopify NUMÉRIQUE
 * du produit (ex: extrait du GID `gid://shopify/Product/16254393975119` →
 * `16254393975119`), car c'est ce que Judge.me stocke dans
 * `product_external_id`. Retourne toujours un tableau (vide en cas
 * d'absence/échec), jamais de donnée inventée.
 */
/**
 * Mission "FORMULAIRE AVIS CLIENT" (17/08/2026) — jusqu'ici, la fiche
 * produit affichait uniquement les avis EXISTANTS (lecture seule, voir
 * `fetchJudgemeProductReviews` ci-dessous) : aucun formulaire ne permettait
 * à un client de réellement poster un avis. Root cause : ce site est un
 * frontend headless Next.js, découplé du thème Shopify — le widget natif
 * Judge.me (qui inclut normalement un formulaire "Laisser un avis") n'est
 * jamais rendu ici, contrairement à une boutique Shopify classique.
 *
 * Contrairement à la lecture, la CRÉATION d'un avis via l'API Judge.me
 * (`POST /api/v1/reviews`) nécessite déjà le jeton PRIVÉ (pas de jeton
 * public distinct à demander à l'utilisateur) — confirmé dans la
 * documentation officielle Judge.me (judge.me/help : "Your Private API
 * Token: this private token grants read/write access... exclusively used
 * on the server-side"). Cet appel reste donc, comme la lecture, exécuté
 * uniquement côté serveur (Server Action `src/app/actions/reviews.ts`),
 * jamais depuis le navigateur.
 *
 * Limites documentées par Judge.me elles-mêmes (jamais contournées ici) :
 * un avis créé via cette API ne peut jamais être marqué "achat vérifié",
 * et ne peut plus être supprimé via l'API après coup (seulement depuis le
 * tableau de bord Judge.me côté marchand).
 */
export interface SubmitReviewInput {
  shopifyProductId: string | number;
  name: string;
  email: string;
  rating: number;
  title: string;
  body: string;
}

export type SubmitReviewResult = { ok: true } | { ok: false; error: string };

export async function submitJudgemeReview(input: SubmitReviewInput): Promise<SubmitReviewResult> {
  const token = process.env.JUDGEME_PRIVATE_API_TOKEN;
  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!token || !shopDomain) {
    return { ok: false, error: "config_missing" };
  }

  const targetId = Number(input.shopifyProductId);
  if (!Number.isFinite(targetId)) {
    return { ok: false, error: "invalid_product" };
  }

  try {
    const res = await fetch(JUDGEME_REVIEWS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shop_domain: shopDomain,
        platform: "shopify",
        api_token: token,
        id: targetId,
        name: input.name,
        email: input.email,
        rating: input.rating,
        title: input.title,
        body: input.body,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      // Judge.me renvoie parfois un détail utile (ex. limite atteinte) —
      // jamais renvoyé tel quel au client (pourrait exposer des détails
      // internes), juste loggé côté serveur pour diagnostic.
      const text = await res.text().catch(() => "");
      console.error("[DEBUG judgeme submit]", res.status, text);
      return { ok: false, error: "submit_failed" };
    }

    return { ok: true };
  } catch (err) {
    console.error("[DEBUG judgeme submit]", err);
    return { ok: false, error: "network_error" };
  }
}

export async function fetchJudgemeProductReviews(shopifyProductId: string | number): Promise<ProductReview[]> {
  const token = process.env.JUDGEME_PRIVATE_API_TOKEN;
  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!token || !shopDomain) return [];

  const targetId = Number(shopifyProductId);
  if (!Number.isFinite(targetId)) return [];

  try {
    const collected: ProductReview[] = [];

    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const url = new URL(JUDGEME_REVIEWS_ENDPOINT);
      url.searchParams.set("api_token", token);
      url.searchParams.set("shop_domain", shopDomain);
      url.searchParams.set("published", "true");
      url.searchParams.set("per_page", String(PER_PAGE));
      url.searchParams.set("page", String(page));

      const res = await fetch(url.toString(), {
        // Le contenu détaillé des avis change rarement — revalidation plus
        // espacée que le catalogue (60s, voir shopifyStorefrontGraphQL).
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(10_000),
      });

      if (!res.ok) break;

      const json = (await res.json()) as JudgemeReviewsResponse;
      if (json.error || !Array.isArray(json.reviews)) break;

      for (const r of json.reviews) {
        if (r.product_external_id !== targetId) continue;
        if (!r.published || r.curated !== "ok") continue;

        collected.push({
          id: String(r.id),
          author: r.reviewer?.name?.trim() || "Client vérifié",
          rating: Number.isFinite(r.rating) ? r.rating : 0,
          date: formatReviewDate(r.created_at),
          title: r.title ?? "",
          comment: r.body ?? "",
          verified: r.verified === "verified-purchase",
          // Non exposé par cet endpoint Judge.me — jamais inventé.
          helpful: 0,
        });
      }

      if (json.reviews.length < PER_PAGE) break; // dernière page atteinte
    }

    return collected;
  } catch (err) {
    console.error("[DEBUG judgeme]", err);
    return [];
  }
}
