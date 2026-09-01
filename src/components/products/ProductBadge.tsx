import type { Badge } from "@/types";
import styles from "./ProductBadge.module.css";

const BADGE_LABELS: Record<Badge, string> = {
  BESTSELLER: "Bestseller",
  NOUVEAU: "Nouveau",
  PROMOTION: "Promotion",
  TOP_VENTE: "Top vente",
  RECOMMANDE: "Recommandé",
  EXCLUSIVITE: "Exclusivité",
  RUPTURE_STOCK: "Rupture de stock",
};

export default function ProductBadge({ type }: { type: Badge }) {
  return <span className={`${styles.badge} ${styles[type]}`}>{BADGE_LABELS[type]}</span>;
}
