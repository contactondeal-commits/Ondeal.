import Link from "next/link";
import { SearchX } from "lucide-react";
import styles from "./state-page.module.css";

export const metadata = {
  title: "Page introuvable",
};

/**
 * Page 404 personnalisée (App Router) — remplace la page d'erreur générique
 * Next.js pour toute route inexistante (ex: `notFound()` déclenché par une
 * page produit/catégorie introuvable, ou toute URL non gérée).
 */
export default function NotFound() {
  return (
    <div className={`${styles.page} container`}>
      <SearchX size={48} strokeWidth={1.5} className={styles.icon} />
      <h1 className={styles.title}>Page introuvable</h1>
      <p className={styles.description}>
        Ce produit, cette catégorie ou cette page n&apos;existe pas ou n&apos;est plus disponible.
      </p>
      <div className={styles.actions}>
        <Link href="/" className={styles.primaryLink}>
          Retour à l&apos;accueil
        </Link>
        <Link href="/search" className={styles.secondaryLink}>
          Rechercher un produit
        </Link>
      </div>
    </div>
  );
}
