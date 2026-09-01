
import { fetchAllProducts } from "@/services/productService";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST } from "@/lib/site-config";
import type { Product } from "@/types";

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
  const shippingPrice = product.price >= FREE_SHIPPING_THRESHOLD ? "0.00 EUR" : `${STANDARD_SHIPPING_COST.toFixed(2)} EUR`;

  // Images additionnelles (max 10 pour GMC)
  const additionalImages = (product.images || [])
    .filter((img) => /^https?:\/\//i.test(img))
    .slice(1, 10)
    .map((img) => `    <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
    .join("\n");

  // Prix barré si disponible
  const salePriceXml = product.oldPrice && product.oldPrice > product.price
    ? `    <g:sale_price>${product.price.toFixed(2)} EUR</g:sale_price>
    <g:price>${product.oldPrice.toFixed(2)} EUR</g:price>`
    : `    <g:price>${product.price.toFixed(2)} EUR</g:price>`;

  // Titre nettoyé et en français si possible (max 150 chars)
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
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
