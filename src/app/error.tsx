"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import styles from "./state-page.module.css";

/**
 * Error boundary App Router — capture toute erreur non gérée levée pendant
 * le rendu d'une page (y compris une erreur Shopify Storefront API non
 * catchée, ex: `ShopifyStorefrontError` — voir src/lib/shopify/storefront.ts)
 * et affiche un message clair au lieu de l'écran d'erreur générique
 * Next.js. Ne révèle jamais le détail technique de l'erreur à
 * l'utilisateur final (uniquement en console serveur, via `console.error`).
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error.tsx] Erreur non gérée capturée par l'error boundary :", error);
  }, [error]);

  return (
    <div className={`${styles.page} container`}>
      <AlertTriangle size={48} strokeWidth={1.5} className={styles.icon} />
      <h1 className={styles.title}>Une erreur est survenue</h1>
      <p className={styles.description}>
        Nous n&apos;avons pas pu afficher cette page. Cela peut venir d&apos;un problème temporaire de connexion à
        notre catalogue. Réessayez dans quelques instants.
      </p>
      <div className={styles.actions}>
        <button type="button" onClick={reset} className={styles.primaryLink}>
          Réessayer
        </button>
        <Link href="/" className={styles.secondaryLink}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
