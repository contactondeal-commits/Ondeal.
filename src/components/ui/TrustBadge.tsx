"use client";
import styles from "./TrustBadge.module.css";

interface TrustBadgeProps {
  rating?: number;
  reviewsCount?: number;
}

export default function TrustBadge({ rating = 4.6, reviewsCount = 259 }: TrustBadgeProps) {
  return (
    <div className={styles.circle}>
      <div className={styles.ratingNumber}>{rating.toFixed(1)}<span className={styles.ratingMax}>/5</span></div>
      <div className={styles.count}>{reviewsCount.toLocaleString("fr-FR")} avis clients</div>
      <div className={styles.stars}>
        <span className={styles.star}>★</span>
        <span className={styles.star}>★</span>
        <span className={styles.star}>★</span>
        <span className={styles.star}>★</span>
        <span className={styles.starHalf}>★</span>
      </div>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>✦</span>
        <span className={styles.brandText}>Avis<br/>Vérifiés</span>
      </div>
    </div>
  );
}
