/**
 * Mission "GOOGLE ADS — REPARTIR PROPREMENT #2" (02/09/2026) — le tag Google
 * Ads AW-18367168377 (et ses libellés) a été intégralement remplacé par un
 * nouveau tag AW-18380483895 côté Google Ads. Les 4 libellés ci-dessous
 * étaient encore ceux de l'ANCIEN tag : ils ne correspondaient plus à aucune
 * action de conversion existante, donc `fireGoogleAdsConversion()` envoyait
 * des événements vers des libellés morts. De plus, `NEXT_PUBLIC_GOOGLE_ADS_ID`
 * n'était défini nulle part (ni .env.local, ni Vercel) : la fonction faisait
 * un no-op silencieux à chaque appel, quel que soit le libellé.
 *
 * Correction du 02/09/2026 : nouveaux libellés lus directement dans Google
 * Ads (Objectifs → Actions de conversion → Sources de données → Gérer →
 * Configurer avec une balise Google → Afficher l'extrait d'événement), tous
 * rattachés au tag AW-18380483895 :
 *   - addToCart / beginCheckout : réutilisent les actions de conversion
 *     créées par l'app Shopify "Google & YouTube" ("Google Shopping App Add
 *     To Cart" / "Google Shopping App Begin Checkout") — mêmes événements,
 *     pas de doublon créé.
 *   - viewItem / search : aucune action Shopify ne correspondait précisément
 *     à ces deux signaux (uniquement "Page vue" générique), donc deux
 *     actions dédiées ont été créées dans Google Ads ("Site — Vue produit",
 *     "Site — Recherche"), catégorie "Page vue", réglées en action
 *     SECONDAIRE (observation) pour ne pas diluer le signal d'enchère
 *     principal — seul "Achat" doit rester l'objectif d'optimisation.
 *
 * Couverture actuelle : uniquement les étapes qui se produisent réellement
 * sur ce site Next.js (recherche, ajout panier, vue fiche produit, clic
 * "vers le paiement Shopify"). Achat et "Add Payment Info" se produisent
 * entièrement sur le checkout hébergé par Shopify (shop.ondeal.fr), hors du
 * code de ce dépôt — voir la note dans AnalyticsScripts.tsx pour la
 * recommandation (app officielle "Google & YouTube" côté Shopify Admin).
 */
export const GOOGLE_ADS_CONVERSION_ID_ENV_KEY = "NEXT_PUBLIC_GOOGLE_ADS_ID";

export const GOOGLE_ADS_CONVERSION_LABELS = {
  addToCart: "BhI5CI7q-OwcELfav7xE",
  search: "pKPbCPnE-uwcELfav7xE",
  viewItem: "IeeHCKuCh-0cELfav7xE",
  beginCheckout: "51CsCIvq-OwcELfav7xE",
} as const;

export type GoogleAdsConversionKey = keyof typeof GOOGLE_ADS_CONVERSION_LABELS;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Envoie un événement de conversion Google Ads — no-op silencieux si le
 * script gtag Google Ads n'est pas chargé (ID absent, ou consentement
 * marketing non donné — voir AnalyticsScripts.tsx). Jamais d'erreur visible
 * pour l'acheteur si le tracking est indisponible.
 */
export function fireGoogleAdsConversion(key: GoogleAdsConversionKey, extra?: { value?: number; currency?: string }) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (!conversionId) return;
  window.gtag("event", "conversion", {
    send_to: `${conversionId}/${GOOGLE_ADS_CONVERSION_LABELS[key]}`,
    value: extra?.value ?? 1.0,
    currency: extra?.currency ?? "EUR",
  });
}
