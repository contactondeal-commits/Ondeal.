/**
 * Configuration Shopify partagée (Admin + Storefront).
 *
 * Version d'API utilisée : 2026-07 (stable au 12/08/2026 — voir
 * https://shopify.dev/docs/api/usage/versioning). À faire évoluer tous les
 * ~12 mois en suivant le calendrier trimestriel de Shopify.
 */

export const SHOPIFY_API_VERSION = "2026-07";

export function getShopifyDomain(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  if (!domain) {
    throw new Error(
      "SHOPIFY_STORE_DOMAIN manquant (ex: votre-boutique.myshopify.com). Voir .env.example et docs/SHOPIFY_INTEGRATION.md."
    );
  }
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function isShopifyPublicConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);
}

export function isShopifyAdminConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_ADMIN_ACCESS_TOKEN);
}
