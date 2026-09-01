"use client";

import { useState, useEffect, type FormEvent } from "react";
import { subscribeToNewsletter, isNewsletterEnabled } from "@/app/actions/newsletter";
import styles from "./NewsletterForm.module.css";

/**
 * Mission "PLAN MARKETING" (15/08/2026) — capture d'email réelle, connectée
 * à Shopify (voir src/lib/shopify/marketing-consent.ts). Pas une fausse UI :
 * un email soumis ici devient un vrai abonné marketing dans Shopify Admin >
 * Clients (une fois SHOPIFY_MARKETING_ADMIN_TOKEN configuré côté serveur).
 *
 * La vérification "est-ce configuré ?" se fait ici (Client Component, via
 * useEffect) plutôt que dans Footer.tsx : Footer.tsx est importé par
 * SiteLayout.tsx ("use client"), donc compilé côté client — un composant
 * client ne peut pas être `async`. La Server Action reste sûre à appeler
 * depuis un Client Component (aucun secret n'y transite jamais, voir le
 * fichier de l'action).
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"checking" | "idle" | "loading" | "success" | "error" | "invalid" | "unavailable">("checking");

  useEffect(() => {
    let cancelled = false;
    isNewsletterEnabled().then((enabled) => {
      if (!cancelled) setStatus(enabled ? "idle" : "unavailable");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    const result = await subscribeToNewsletter(email);
    if (result.ok) {
      setStatus("success");
      setEmail("");
    } else if (result.reason === "invalid_email") {
      setStatus("invalid");
    } else if (result.reason === "not_configured") {
      setStatus("unavailable");
    } else {
      setStatus("error");
    }
  }

  // "checking" : rien pendant l'instant de la vérification serveur, évite un
  // flash de formulaire avant de savoir si l'inscription est réellement
  // active. "unavailable" au premier chargement : le token dédié n'est pas
  // encore configuré — message honnête plutôt qu'un formulaire qui
  // échouerait à chaque soumission (voir en-tête du fichier).
  if (status === "checking") return null;

  if (status === "success") {
    return <p className={styles.message}>Merci ! Vérifiez vos futurs emails pour vos réductions et nouveautés.</p>;
  }

  if (status === "unavailable") {
    return <p className={styles.newsletterFallback}>Inscription newsletter bientôt disponible.</p>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email" className={styles.label}>
        Recevez -10% sur votre première commande
      </label>
      <div className={styles.row}>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="Votre adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button} disabled={status === "loading"}>
          {status === "loading" ? "..." : "S'inscrire"}
        </button>
      </div>
      {status === "invalid" && <p className={styles.error}>Adresse email invalide.</p>}
      {status === "error" && <p className={styles.error}>Une erreur est survenue, réessayez plus tard.</p>}
    </form>
  );
}
