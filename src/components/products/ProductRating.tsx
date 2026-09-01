import { Star } from "lucide-react";
import styles from "./ProductRating.module.css";

interface ProductRatingProps {
  rating: number;
  reviewsCount: number;
  size?: number;
  showCount?: boolean;
  /**
   * Mission CRO Phase 1 (2026-08-13) — P0-1 : `reviewsCount` est à 0 sur la
   * quasi-totalité du catalogue réel (aucun avis Shopify n'est actuellement
   * collecté, voir reports/ondeal-cro-audit.md P0-1). Répéter "Aucun avis"
   * sur CHAQUE carte produit d'une grille crée un bruit visuel répétitif à
   * faible valeur. Sur la fiche produit (page dédiée), le message reste
   * affiché : c'est le bon endroit pour être honnête sur l'absence d'avis.
   * Ne JAMAIS afficher de note ou de nombre d'avis inventé — seul le mode
   * d'affichage change ici, jamais la donnée.
   */
  hideWhenEmpty?: boolean;
}

export default function ProductRating({
  rating,
  reviewsCount,
  size = 14,
  showCount = true,
  hideWhenEmpty = false,
}: ProductRatingProps) {
  if (reviewsCount === 0) {
    if (hideWhenEmpty) return null;
    return <span className={styles.noReviews}>Aucun avis</span>;
  }

  return (
    <div
      className={styles.root}
      /* Mission UX/UI Phase 3 (2026-08-13) — P1 : l'aria-label utilisait la
         valeur brute de `rating` (ex. "Note 3 sur 5") alors que le texte
         visible affiche `rating.toFixed(1)` (ex. "3.0") — incohérence
         signalée dans reports/ondeal-ux-ui-phase2.md section 13. Alignement
         sur la même représentation (`rating.toFixed(1)`) pour les deux,
         sans toucher `reviewsCount`, `hideWhenEmpty`, ni le rendu métier des
         étoiles. Aucune donnée inventée : uniquement un format de texte. */
      aria-label={`Note ${rating.toFixed(1)} sur 5, ${reviewsCount} avis`}
    >
      <div className={styles.stars}>
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <Star
              key={i}
              size={size}
              fill={filled ? "var(--color-rating)" : "none"}
              /* Mission UX/UI Phase 2 (2026-08-13) — P2-2 : le contour (stroke)
                 passe de l'orange de marque (--color-rating, #F3A023) au bleu
                 de marque (--color-primary, #0C1F32) pour améliorer la
                 définition visuelle des étoiles (contraste mesuré 2,13:1 sous
                 le seuil WCAG 1.4.11 de 3:1 — voir reports/ondeal-ux-ui-
                 roadmap.md P2-2). Le remplissage orange reste inchangé et
                 dominant sur les étoiles pleines ; les étoiles vides
                 gagnent aussi un contour bleu discret au lieu d'un contour
                 orange à très faible contraste. Couleur de marque officielle
                 non altérée, aucune nouvelle donnée inventée. */
              color="var(--color-primary)"
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      <span className={styles.value}>{rating.toFixed(1)}</span>
      {showCount && <span className={styles.count}>({reviewsCount.toLocaleString("fr-FR")})</span>}
    </div>
  );
}
