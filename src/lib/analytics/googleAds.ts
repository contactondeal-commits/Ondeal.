/**
 * Mission "GOOGLE ADS — REPARTIR PROPREMENT" (21/08/2026) — le compte
 * Google Ads avait 8 actions de conversion configurées côté Google Ads
 * (catégories Purchase, Begin Checkout, Add To Cart, Page View, View Item,
 * Search, Add Payment Info), toutes rattachées au tag `AW-18367168377`.
 * Vérification faite ce jour-là : ce tag n'apparaissait NULLE PART dans le
 * code du site (aucun fichier ne le référence, aucune variable d'env
 * NEXT_PUBLIC_GOOGLE_ADS_* n'existait). Les anciennes campagnes tournaient
 * donc sans aucun signal de conversion réel — ce qui explique la valeur de
 * conversion à 0,00 vue côté client, indépendamment des ventes réelles.
 *
 * L'ID de tag et les libellés de conversion ci-dessous sont recopiés tels
 * quels depuis Google Ads (lus via le connecteur Supermetrics,
 * resource_type=conversions, le 21/08/2026) — aucun n'est inventé.
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
  addToCart: "IuvtCKWo29ocEPn-krZE",
  search: "SRh-CK6o29ocEPn-krZE",
  viewItem: "2eD0CKuo29ocEPn-krZE",
  beginCheckout: "cJVdCKKo29ocEPn-krZE",
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
