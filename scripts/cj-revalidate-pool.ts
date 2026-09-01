/**
 * Mission "AJOUTER 1000 PRODUITS" (20/08/2026) — revalidation EN DIRECT
 * d'un pool de candidats CJ déjà pré-recherchés/évalués par une session
 * précédente (reports/cj-candidate-plan-250-audited.json).
 *
 * IMPORTANT : un rapport antérieur (reports/cj-phase4-execution-final.md)
 * prétendait que 118 de ces candidats étaient déjà importés sur Shopify —
 * vérifié FAUX en direct (aucun des SKU cités n'existe sur la boutique).
 * On ne fait donc AUCUNE confiance aux prix/stock/statuts de ce fichier :
 * chaque candidat est revérifié en direct auprès de CJ (détail produit +
 * stock par variante) avant tout import, exactement comme pour les
 * recherches par mot-clé de cj-source-shortlist.ts.
 *
 * Usage : npx tsx scripts/cj-revalidate-pool.ts --offset=0 --limit=30
 */
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { getCJProductDetail, getCJVariantStock } from "../src/lib/cj/products";
import { hasReadyToShipStock, getMinVariantPrice } from "../src/lib/cj/types";
import { evaluateCJProduct, DEFAULT_SELECTION_CRITERIA } from "../src/lib/catalog/selection";
import { computeOndealPrice } from "../src/lib/catalog/pricing";

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
  return {
    offset: Number(get("offset") ?? "0"),
    limit: Number(get("limit") ?? "30"),
  };
}

async function main() {
  const { offset, limit } = parseArgs();
  const poolPath = path.join(__dirname, "..", "reports", "cj-candidate-plan-250-audited.json");
  const pool = JSON.parse(fs.readFileSync(poolPath, "utf-8"));
  const candidates = pool.candidates as Array<{ cjProductId: string; category: string; categoryId: string; title: string; priority: string }>;

  const slice = candidates.slice(offset, offset + limit);
  console.error(`[info] Revalidation de ${slice.length} candidats (offset=${offset}, pool total=${candidates.length})`);

  const shortlist: unknown[] = [];
  for (const c of slice) {
    const detail = await getCJProductDetail(c.cjProductId);
    if (!detail) {
      console.error(`[rejeté] ${c.title.slice(0, 60)} — produit CJ introuvable (retiré/expiré)`);
      continue;
    }

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
      poolCategory: c.category,
      poolCategoryId: c.categoryId,
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
