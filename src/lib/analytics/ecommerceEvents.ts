/**
 * Owner (10/09/2026) — mandat "cible les plus intéressés" : impossible de
 * cibler qui que ce soit (retargeting, audience similaire aux acheteurs,
 * optimisation automatique de la diffusion) tant que GA4 et le Pixel Meta
 * ne reçoivent AUCUN signal d'intérêt réel. Audit du code fait ce jour-là :
 * `fireGoogleAdsConversion` (googleAds.ts) envoie bien des conversions
 * Google Ads (send_to: AW-.../label) pour addToCart/viewItem/beginCheckout/
 * search, mais ce sont des conversions Google Ads UNIQUEMENT — jamais un
 * événement e-commerce GA4 standard (`add_to_cart`, `view_item`,
 * `begin_checkout`), et le Pixel Meta (voir AnalyticsScripts.tsx) ne
 * déclenchait STRICTEMENT que `PageView`, aucun `AddToCart`/`InitiateCheckout`
 * nulle part dans le dépôt (vérifié par recherche exhaustive sur tout
 * `src/`). Résultat vérifié côté client (GA4 Reporting Hub, 28 jours) : 0
 * ajout au panier malgré du vrai trafic publicitaire payant — ce n'était
 * pas un bug d'un événement existant, l'événement n'existait tout
 * simplement pas.
 *
 * Ce module ajoute les événements e-commerce STANDARD (jamais un nom
 * inventé — ce sont exactement les noms attendus par GA4 Enhanced
 * Ecommerce et par le catalogue d'événements standard Meta Pixel, pour que
 * les deux plateformes les reconnaissent et puissent optimiser dessus),
 * appelés en plus de `fireGoogleAdsConversion` existant (jamais en
 * remplacement — les deux mécanismes sont indépendants et complémentaires :
 * conversions Google Ads d'un côté, événements e-commerce GA4/Meta de
 * l'autre). No-op silencieux si gtag/fbq ne sont pas chargés (ID absent,
 * ou consentement analytics/marketing non donné — voir
 * AnalyticsScripts.tsx) : jamais d'erreur visible pour l'acheteur.
 *
 * Portée volontairement limitée aux étapes qui se produisent réellement
 * dans CE dépôt Next.js (recherche, vue fiche produit, ajout panier, clic
 * "vers le paiement Shopify") — même limite documentée que
 * fireGoogleAdsConversion (googleAds.ts) : l'achat final se produit
 * entièrement sur le checkout hébergé par Shopify (shop.ondeal.fr), hors du
 * code de ce dépôt. Pour capter cet achat final côté GA4/Google Ads ET côté
 * Pixel Meta, il faut les applications officielles Shopify correspondantes
 * ("Google & YouTube" / "Facebook & Instagram" dans Shopify Admin →
 * Applications), qui injectent le tracking directement sur les pages de
 * checkout Shopify — décision Owner, hors périmètre code de ce chantier.
 */

export interface EcommerceItem {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const CURRENCY = "EUR";

function fireGA4Event(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, { currency: CURRENCY, ...params });
}

function fireMetaPixelEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", name, { currency: CURRENCY, ...params });
}

function toGA4Item(item: EcommerceItem) {
  return {
    item_id: item.id,
    item_name: item.name,
    price: item.price,
    quantity: item.quantity ?? 1,
    ...(item.category ? { item_category: item.category } : {}),
  };
}

/** Fiche produit consultée — GA4 `view_item` + Meta `ViewContent`. */
export function trackViewItem(item: EcommerceItem) {
  fireGA4Event("view_item", { value: item.price, items: [toGA4Item(item)] });
  fireMetaPixelEvent("ViewContent", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value: item.price,
  });
}

/** Ajout au panier — GA4 `add_to_cart` + Meta `AddToCart`. */
export function trackAddToCart(item: EcommerceItem) {
  const quantity = item.quantity ?? 1;
  const value = item.price * quantity;
  fireGA4Event("add_to_cart", { value, items: [toGA4Item(item)] });
  fireMetaPixelEvent("AddToCart", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value,
  });
}

/** Passage au paiement Shopify — GA4 `begin_checkout` + Meta `InitiateCheckout`. */
export function trackBeginCheckout(items: EcommerceItem[], value: number) {
  fireGA4Event("begin_checkout", { value, items: items.map(toGA4Item) });
  fireMetaPixelEvent("InitiateCheckout", {
    content_ids: items.map((i) => i.id),
    num_items: items.reduce((sum, i) => sum + (i.quantity ?? 1), 0),
    value,
  });
}

/** Recherche produit — GA4 `search` + Meta `Search`. */
export function trackSearch(searchTerm: string) {
  fireGA4Event("search", { search_term: searchTerm });
  fireMetaPixelEvent("Search", { search_string: searchTerm });
}
