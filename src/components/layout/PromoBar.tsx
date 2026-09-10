import Link from "next/link";
import styles from "./PromoBar.module.css";

// Bannière promo pleine largeur (10/09/2026) — Owner : "vu que toute la
// boutique est à moins 50% presque ça vaudrait le coup d'afficher la promo
// sur la boutique" → "tu un gros coup de comme GRAND PROMO ect". Les prix
// barrés (compare-at-price) existent déjà côté Shopify (~50-60% de remise
// sur la quasi-totalité du catalogue) ; cette bannière rend la promo visible
// dès l'arrivée sur le site, sur toutes les pages (montée dans SiteLayout,
// au-dessus du Header).
export default function PromoBar() {
  return (
    <Link href="/catalogue" className={styles.bar} aria-label="Voir toute la promo, jusqu'à -60% sur la boutique">
      <span className={styles.text}>
        <strong>GRANDE PROMO</strong> — Jusqu&apos;à <strong>-60%</strong> sur toute la boutique, en ce moment
      </span>
    </Link>
  );
}
