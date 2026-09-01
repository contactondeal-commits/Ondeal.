import { ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site-config";
import styles from "./TrustBadges.module.css";

/**
 * Mission CRO Phase 1 (2026-08-13) — P1-4 : aucun signal de confiance
 * n'apparaissait près du CTA d'achat ni au checkout (voir
 * reports/ondeal-cro-audit.md P1-4). Chaque badge ci-dessous ne repose que
 * sur des informations déjà réelles et vérifiées dans le projet — aucune
 * certification ni logo de paiement non confirmé n'est affiché :
 * - "Paiement sécurisé (Shopify)" : le checkout Shopify réel a été vérifié
 *   fonctionnel de bout en bout le 13/08/2026
 *   (reports/shopify-storefront-revalidation.md — "SHOPIFY STOREFRONT API
 *   — READY", Checkout OK, redirection vers ondeal.fr confirmée).
 * - "Livraison offerte dès X €" : seuil importé de `@/lib/site-config`
 *   (`FREE_SHIPPING_THRESHOLD`), corrigé le 2026-08-14 (mission déploiement
 *   Vercel) pour refléter la vraie règle Shopify Admin (Réglages > Expédition
 *   et livraison), vérifiée live sur ondeal.fr — l'ancien chiffre de 39 €
 *   codé en dur ici (hérité d'une FAQ jamais recroisée avec Shopify) créait
 *   un seuil contradictoire avec `CartSummary.tsx` et `help-data.ts`.
 * - "Retours sous 14 jours" : délai réel déjà documenté dans la FAQ
 *   existante (`help-data.ts`, section "retours").
 */
const BADGES = [
  { icon: ShieldCheck, label: "Paiement sécurisé (Shopify)" },
  { icon: Truck, label: `Livraison offerte dès ${FREE_SHIPPING_THRESHOLD} €` },
  { icon: RotateCcw, label: "Retours sous 14 jours" },
];

export default function TrustBadges({ compact = false }: { compact?: boolean }) {
  return (
    <ul className={`${styles.root} ${compact ? styles.compact : ""}`}>
      {BADGES.map(({ icon: Icon, label }) => (
        <li key={label} className={styles.item}>
          <Icon size={18} />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
