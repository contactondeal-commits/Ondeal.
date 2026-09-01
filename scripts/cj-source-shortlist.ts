/**
 * Script temporaire (mission "REMPLIR LES COLLECTIONS PEU FOURNIES",
 * 20/08/2026) — variante en LECTURE SEULE CJ de cj-import-batch.ts.
 *
 * Le token Shopify Admin local (.env.local) n'a pas le scope read_products
 * (confirmé : "Access denied for products field" sur une requête GraphQL
 * directe) — l'écriture Shopify se fait donc via les outils MCP Shopify
 * (déjà utilisés avec succès tout au long de la session), pas via
 * src/lib/shopify/admin.ts. Ce script ne fait QUE la partie CJ (recherche +
 * évaluation qualité + prix) et imprime un shortlist JSON exploitable
 * manuellement, sans toucher à Shopify.
 *
 * Usage : npx tsx scripts/cj-source-shortlist.ts --keyword="..." --limit=30 --want=6
 */
import "dotenv/config";
import { searchCJProducts, getCJProductDetail, getCJVariantStock } from "../src/lib/cj/products";
import { hasReadyToShipStock, getMinVariantPrice } from "../src/lib/cj/types";
import { quickPrefilter, evaluateCJProduct, DEFAULT_SELECTION_CRITERIA } from "../src/lib/catalog/selection";
import { computeOndealPrice } from "../src/lib/catalog/pricing";

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
  return {
    keyword: get("keyword"),
    category: get("category"),
    limit: Number(get("limit") ?? "30"),
    want: Number(get("want") ?? "6"),
  };
}

async function main() {
  const { keyword, category, limit, want } = parseArgs();
  const { items, total } = await searchCJProducts({ keyWord: keyword, categoryId: category, pageSize: Math.min(limit, 100), orderBy: 3, sort: "desc" });
  console.error(`[info] ${items.length} items sur cette page (total CJ: ${total})`);

  const shortlist: unknown[] = [];
  for (const item of items) {
    if (shortlist.length >= want) break;
    if (!quickPrefilter(item)) continue;
    const detail = await getCJProductDetail(item.pid);
    if (!detail) continue;

    let hasConfirmedStock: boolean | null = null;
    if (detail.variants && detail.variants.length > 0) {
      const stockEntries = await getCJVariantStock(detail.variants[0].vid);
      hasConfirmedStock = hasReadyToShipStock(stockEntries);
    }

    const evaluation = evaluateCJProduct(detail, DEFAULT_SELECTION_CRITERIA, hasConfirmedStock);
    if (!evaluation.accepted) {
      console.error(`[rejeté] ${detail.productNameEn || detail.productName} — ${evaluation.rejectionReasons.join("; ")}`);
      continue;
    }

    const referencePrice = getMinVariantPrice(detail);
    const pricing = computeOndealPrice({ supplierPrice: referencePrice });

    shortlist.push({
      pid: detail.pid,
      titleEn: detail.productNameEn || detail.productName,
      guessedCategoryId: evaluation.guessedCategoryId,
      score: evaluation.score,
      images: detail.productImageSet ?? [],
      descriptionRaw: detail.description || "",
      sku: detail.productSku,
      vendor: detail.supplierName || "Ondeal",
      cjCategoryName: detail.categoryName,
      referencePrice,
      ondealPrice: pricing.ondealPrice,
      variants: (detail.variants ?? []).map((v) => ({
        vid: v.vid,
        nameEn: v.variantNameEn || v.variantName,
        sku: v.variantSku,
        sellPrice: v.variantSellPrice,
      })),
      hasConfirmedStock,
    });
    console.error(`[accepté] ${detail.productNameEn || detail.productName} (score ${evaluation.score}, cat=${evaluation.guessedCategoryId})`);
  }

  console.log(JSON.stringify(shortlist, null, 2));
}

main().catch((e) => {
  console.error("ERROR", e);
  process.exit(1);
});
