import { createAdminApiClient } from "@shopify/admin-api-client";

const client = createAdminApiClient({
  storeDomain: "6mvti7-9g.myshopify.com",
  apiVersion: "2024-10",
  accessToken: process.env.SHOPIFY_ADMIN_TOKEN,
});

function parseFeatures(html) {
  if (!html) return [];
  const text = html
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/(Présentation|Points forts|Caractéristiques|Utilisation|Contenu)/g, "\n$1\n");
  return text.split("\n").map(l => l.trim())
    .filter(l => l.length > 5 && l.length < 120 && !l.includes("{"))
    .slice(0, 8);
}

function parseSpecs(html) {
  if (!html) return {};
  const text = html
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/(Matière|Type|Quantité|Couleur|Dimensions|Taille|Poids|Marque|Modèle|Origine)\s*:/g, "\n$1:");
  const out = {};
  for (const line of text.split("\n")) {
    const match = line.trim().match(/^([A-Za-z\u00C0-\u00FF][^:]{1,40})\s*:\s*(.{1,150})$/);
    if (match && !match[1].includes("{")) out[match[1].trim()] = match[2].trim();
    if (Object.keys(out).length >= 10) break;
  }
  return out;
}

async function run() {
  let cursor = null, processed = 0, updated = 0;
  do {
    const { data } = await client.request(`
      query($cursor: String) {
        products(first: 50, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          nodes {
            id title descriptionHtml
            featuresMeta: metafield(namespace: "custom", key: "ondeal_features") { value }
            specsMeta: metafield(namespace: "custom", key: "ondeal_specs") { value }
          }
        }
      }
    `, { variables: { cursor } });
    for (const p of data.products.nodes) {
      processed++;
      const metafields = [];
      const f = parseFeatures(p.descriptionHtml);
      if (f.length) metafields.push({ namespace: "custom", key: "ondeal_features", type: "list.single_line_text_field", value: JSON.stringify(f) })
      const s = parseSpecs(p.descriptionHtml);
      if (Object.keys(s).length) metafields.push({ namespace: "custom", key: "ondeal_specs", type: "json", value: JSON.stringify(s) });
      if (!metafields.length) continue;
      await client.request(`
        mutation($id: ID!, $metafields: [MetafieldInput!]!) {
          productUpdate(input: { id: $id, metafields: $metafields }) {
            userErrors { field message }
          }
        }
      `, { variables: { id: p.id, metafields } });
      updated++; console.log("✅", p.title);
    }
    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (cursor);
  console.log(`\nTerminé : ${processed} traités, ${updated} mis à jour.`);
}
run().catch(console.error);
