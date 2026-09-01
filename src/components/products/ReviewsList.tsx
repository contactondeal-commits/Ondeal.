import { BadgeCheck } from "lucide-react";
import ProductRating from "./ProductRating";
import WriteReviewForm from "./WriteReviewForm";
import type { Product } from "@/types";
import styles from "./ReviewsList.module.css";

/**
 * Mission "FORMULAIRE AVIS CLIENT" (17/08/2026) — le formulaire "Laisser un
 * avis" doit rester visible que le produit ait déjà des avis ou non (avant
 * ce correctif, l'état "aucun avis" retournait tôt, sans jamais afficher le
 * formulaire — un client ne pouvait donc poster le tout premier avis d'un
 * produit). `shopifyProductId` est absent uniquement sur les produits de
 * démonstration (données mock, voir types/index.ts) : dans ce cas précis,
 * pas de vrai produit Shopify à rattacher, formulaire masqué plutôt que
 * d'envoyer un avis orphelin.
 */
export default function ReviewsList({ product }: { product: Product }) {
  const writeForm = product.shopifyProductId ? (
    <WriteReviewForm slug={product.slug} shopifyProductId={product.shopifyProductId} />
  ) : null;

  if (!product.reviews || product.reviews.length === 0) {
    return (
      <div>
        <p className={styles.empty}>Aucun avis pour ce produit pour le moment.</p>
        {writeForm}
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.summary}>
        <span className={styles.avgRating}>{product.rating.toFixed(1)}</span>
        <div>
          <ProductRating rating={product.rating} reviewsCount={product.reviewsCount} showCount={false} size={16} />
          {/*
            BUG FIX (2026-08-16, re-appliqué le 17/08/2026 après fusion de la
            sauvegarde du 15/08) — "évaluations" ne correspond à aucun texte
            utilisé ailleurs sur la fiche produit (voir ProductRating.tsx :
            aria-label "... avis") ; "avis" est invariable en français
            (1 avis, 2 avis), donc un seul libellé convient au singulier
            comme au pluriel — jamais de "avis" au pluriel fautif ("avis s").
          */}
          <p className={styles.summaryCount}>{product.reviewsCount.toLocaleString("fr-FR")} avis</p>
        </div>
      </div>

      <ul className={styles.list}>
        {product.reviews.map((r) => (
          <li key={r.id} className={styles.review}>
            <div className={styles.reviewHeader}>
              <span className={styles.author}>{r.author}</span>
              {r.verified && (
                <span className={styles.verified}>
                  <BadgeCheck size={13} /> Achat vérifié
                </span>
              )}
              <span className={styles.date}>{r.date}</span>
            </div>
            <ProductRating rating={r.rating} reviewsCount={1} showCount={false} size={13} />
            <p className={styles.reviewTitle}>{r.title}</p>
            <p className={styles.reviewComment}>{r.comment}</p>
            <p className={styles.helpful}>{r.helpful} personnes ont trouvé cet avis utile</p>
          </li>
        ))}
      </ul>

      {writeForm}
    </div>
  );
}
