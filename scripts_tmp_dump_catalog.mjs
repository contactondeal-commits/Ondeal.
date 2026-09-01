import dotenv from "dotenv";
import fs from "fs";
dotenv.config({ path: ".env.local" });

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const QUERY = `
query Products($cursor: String) {
  products(first: 250, after: $cursor) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id
      handle
      title
      vendor
      tags
      productType
      status: onlineStoreUrl
      totalInventory
      priceRange { minVariantPrice { amount } maxVariantPrice { amount } }
      compareAtPriceRange { minVariantPrice { amount } maxVariantPrice { amount } }
      variants(first: 10) { nodes { id title price { amount } compareAtPrice { amount } availableForSale sku } }
    }
  }
}`;

async function main() {
  let cursor = null;
  let all = [];
  let page = 0;
  while (true) {
    page++;
    const res = await fetch(`https://${domain}/api/2026-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: QUERY, variables: { cursor } }),
    });
    const json = await res.json();
    if (json.errors) {
      console.error(JSON.stringify(json.errors, null, 2));
      process.exit(1);
    }
    const data = json.data.products;
    all = all.concat(data.nodes);
    console.error(`page ${page}: +${data.nodes.length} (total ${all.length})`);
    if (!data.pageInfo.hasNextPage) break;
    cursor = data.pageInfo.endCursor;
  }
  fs.writeFileSync("/tmp/catalog_dump.json", JSON.stringify(all, null, 2));
  console.error(`DONE: ${all.length} products written to /tmp/catalog_dump.json`);
}

main();
