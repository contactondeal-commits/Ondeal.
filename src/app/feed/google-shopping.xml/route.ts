import { fetchAllProducts } from "@/services/productService";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST } from "@/lib/site-config";
import type { Product } from "@/types";

/**
 * Mission "PLAN MARKETING" (15/08/2026) — flux produits Google Merchant
 * Center ("free listings"), format RSS 2.0 + namespace g: (spécification
 * officielle Google Shopping). Zéro coût : ce sont des fiches produits
 * organiques, pas de la pub payante — seule condition pour apparaître dans
 * l'onglet Shopping/Recherche/Images de Google, une fois le flux connecté
 * dans Merchant Center (voir guide_complet_desktop/08_Plan_Marketing_Ventes.md
 * section 5.1).
 *
 * Chaque champ vient directement du vrai catalogue (fetchAllProducts, la
 * même fonction que le reste du site) — jamais de donnée inventée. Un
 * produit sans image ou sans prix positif est exclu du flux plutôt que
 * publié avec un champ vide (Google rejette de toute façon ces fiches).
 *
 * Enrichi (audit 2026-09-02) — une version plus complète de ce flux
 * (g:sale_price séparé de g:price, g:additional_image_link, g:item_group_id,
 * g:custom_label_0) avait été écrite par erreur dans
 * src/app/api/partenaires/route.ts au lieu d'ici (voir rapport d'audit,
 * "bug critique formulaire partenaires"). Elle correspond exactement à la
 * priorité "Google Merchant Center : fix misrepresentation" notée dans le
 * récap du 01/09 : Google considère que republier le prix promo comme
 * unique g:price, sans le prix de référence, est de la "misrepresentation"
 * — séparer g:price (prix de référence) et g:sale_price (prix promo)
 * résout ce point. Récupérée et déplacée dans le bon fichier.
 */

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * `product.id` est le GID Shopify complet (`gid://shopify/Product/123...`)
 * — Google Merchant Center attend un identifiant court et stable (g:id, max
 * 50 caractères). On en extrait le numéro final, largement suffisant pour
 * rester unique par produit, plutôt que de tronquer l'URL GID à l'aveugle.
 */
function shortProductId(id: string): string {
  const match = id.match(/(\d+)$/);
  return match ? match[1] : id.slice(0, 50);
}

function productItemXml(product: Product): string | null {
  const image = product.images?.[0];
  if (!image || !(product.price > 0)) return null;

  // Exclure images placeholder/non-HTTP
  if (!/^https?:\/\//i.test(image)) return null;

  const link = `${SITE_URL}/product/${product.slug}`;
  const description = stripHtml(product.description || product.title).slice(0, 5000);
  const availability = product.inStock ? "in_stock" : "out_of_stock";
  // Frais de port réels du site (voir site-config.ts) — évite que Google
  // affiche un montant deviné/incorrect à côté du prix produit.
  const shippingPrice = product.price >= FREE_SHIPPING_THRESHOLD ? "0.00 EUR" : `${STANDARD_SHIPPING_COST.toFixed(2)} EUR`;

  // Images additionnelles (max 10 pour GMC)
  const additionalImages = (product.images || [])
    .filter((img) => /^https?:\/\//i.test(img))
    .slice(1, 10)
    .map((img) => `    <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
    .join("\n");

  // g:price = prix de référence, g:sale_price = prix promo actif — évite le
  // signalement "misrepresentation" de Google (republier le prix promo seul
  // comme prix normal).
  const salePriceXml = product.oldPrice && product.oldPrice > product.price
    ? `    <g:sale_price>${product.price.toFixed(2)} EUR</g:sale_price>
    <g:price>${product.oldPrice.toFixed(2)} EUR</g:price>`
    : `    <g:price>${product.price.toFixed(2)} EUR</g:price>`;

  // Titre nettoyé (max 150 chars, limite Google)
  const title = escapeXml(product.title.slice(0, 150));

  return `
  <item>
    <g:id>${escapeXml(shortProductId(product.id))}</g:id>
    <title>${title}</title>
    <description><![CDATA[${description}]]></description>
    <link>${escapeXml(link)}</link>
    <g:image_link>${escapeXml(image)}</g:image_link>
${additionalImages}
    <g:availability>${availability}</g:availability>
${salePriceXml}
    <g:brand>${escapeXml((product.brand || SITE_NAME).slice(0, 70))}</g:brand>
    <g:condition>new</g:condition>
    <g:identifier_exists>false</g:identifier_exists>
    <g:google_product_category>632</g:google_product_category>
    <g:item_group_id>${escapeXml(shortProductId(product.id))}</g:item_group_id>
    <g:shipping>
      <g:country>FR</g:country>
      <g:service>Standard</g:service>
      <g:price>${shippingPrice}</g:price>
    </g:shipping>
    <g:shipping_label>standard</g:shipping_label>
    <g:custom_label_0>${escapeXml(product.inStock ? "en-stock" : "rupture")}</g:custom_label_0>
  </item>`;
}

export async function GET() {
  const products = await fetchAllProducts();
  const items = products
    .map(productItemXml)
    .filter((x): x is string => x !== null)
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>${escapeXml(SITE_NAME)} — Catalogue produits</title>
  <link>${escapeXml(SITE_URL)}</link>
  <description>${escapeXml(SITE_DESCRIPTION)}</description>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Régénéré au plus toutes les heures — Merchant Center ne relit le
      // flux que quelques fois par jour de toute façon.
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
