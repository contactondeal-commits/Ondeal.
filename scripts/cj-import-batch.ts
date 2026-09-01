/**
 * Import par lots CJdropshipping → Shopify — voir mission "IMPORT PAR LOTS"
 * et "ORDRE D'IMPLÉMENTATION" (étapes 7 à 15).
 *
 * Pipeline pour CHAQUE produit candidat :
 *   1. Recherche CJ (par catégorie/mot-clé)
 *   2. Pré-filtre rapide (quickPrefilter)
 *   3. Détail complet + variantes + stock (getCJProductDetail, getCJVariantStock)
 *   4. Évaluation qualité (evaluateCJProduct) → accepté / rejeté
 *   5. Détection de doublon contre Shopify ACTIVE+DRAFT (findDuplicate)
 *   6. Calcul du prix Ondeal (computeOndealPrice)
 *   7. Création Shopify en statut DRAFT par défaut (AUTO_PUBLISH_CJ_PRODUCTS=false)
 *      avec metafields fournisseur (supplier, cj_product_id, supplier_sku, ...)
 *
 * Import IDEMPOTENT : un produit déjà importé (même cj_product_id) n'est
 * jamais recréé (voir dedupe.ts → reason "cj_product_id").
 *
 * Usage :
 *   npx tsx scripts/cj-import-batch.ts --category=<CJ categoryId> --limit=100
 *
 * Requiert (.env) :
 *   CJ_API_KEY
 *   SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_ACCESS_TOKEN
 * Optionnel : DEFAULT_MARGIN_PERCENT (défaut 40), AUTO_PUBLISH_CJ_PRODUCTS (défaut false)
 */
import "dotenv/config";
import { appendFileSync, mkdirSync } from "node:fs";
import { isCJConfigured } from "../src/lib/cj/client";
import { searchCJProducts, getCJProductDetail, getCJVariantStock } from "../src/lib/cj/products";
import { getMinVariantPrice, hasReadyToShipStock } from "../src/lib/cj/types";
import { listProductsByStatus, createProductFromCJ } from "../src/lib/shopify/admin";
import { isShopifyAdminConfigured } from "../src/lib/shopify/config";
import { rejectArchived } from "../src/lib/catalog/archived-guard";
import { buildDuplicateIndex, findDuplicate } from "../src/lib/catalog/dedupe";
import { quickPrefilter, evaluateCJProduct, DEFAULT_SELECTION_CRITERIA } from "../src/lib/catalog/selection";
import { categoryTag } from "../src/lib/catalog/category-mapping";
import { cleanSupplierDescription, cleanSupplierTitle } from "../src/lib/catalog/text-cleanup";
import { computeOndealPrice } from "../src/lib/catalog/pricing";
import { buildCatalogReport, formatCatalogReport } from "../src/lib/catalog/report";

const IMPORT_LOG_PATH = "data/catalog-import-log.jsonl";

function appendToImportLog(entry: Record<string, unknown>) {
  mkdirSync("data", { recursive: true });
  appendFileSync(IMPORT_LOG_PATH, JSON.stringify(entry) + "\n", "utf-8");
}

interface CliArgs {
  category?: string;
  keyword?: string;
  limit: number;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const get = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
  return {
    category: get("category"),
    keyword: get("keyword"),
    limit: Number(get("limit") ?? "100"),
  };
}

async function main() {
  if (!isCJConfigured()) {
    console.error("CJ_API_KEY manquante — arrêt. Voir .env.example et docs/CJ_INTEGRATION.md.");
    console.error("Fournir précisément : CJ_API_KEY (format CJUserNum@api@xxxxxxxx).");
    process.exit(1);
  }
  if (!isShopifyAdminConfigured()) {
    console.error("SHOPIFY_STORE_DOMAIN et/ou SHOPIFY_ADMIN_ACCESS_TOKEN manquants — arrêt.");
    console.error("Voir .env.example et docs/SHOPIFY_INTEGRATION.md pour la procédure de génération du token.");
    process.exit(1);
  }

  const { category, keyword, limit } = parseArgs();
  const autoPublish = process.env.AUTO_PUBLISH_CJ_PRODUCTS === "true"; // false par défaut, explicite
  console.log(`AUTO_PUBLISH_CJ_PRODUCTS=${autoPublish} (statut Shopify des nouveaux produits : ${autoPublish ? "ACTIVE" : "DRAFT"})`);

  // --- 1. Index de déduplication (Shopify ACTIVE + DRAFT, jamais ARCHIVED) ---
  console.log("\nConstruction de l'index de déduplication (Shopify ACTIVE + DRAFT)...");
  const existingProducts = [];
  for (const status of ["ACTIVE", "DRAFT"] as const) {
    let cursor: string | null = null;
    do {
      const page = await listProductsByStatus(status, cursor);
      existingProducts.push(...rejectArchived(page.products));
      cursor = page.hasNextPage ? page.endCursor : null;
    } while (cursor);
  }
  const dupIndex = buildDuplicateIndex(existingProducts);
  console.log(`Index construit : ${existingProducts.length} produits Shopify existants (ACTIVE+DRAFT) indexés.`);

  // --- 2. Recherche CJ ---------------------------------------------------
  console.log(`\nRecherche CJ (catégorie=${category ?? "toutes"}, mot-clé=${keyword ?? "aucun"}, limite=${limit})...`);
  const { items, total } = await searchCJProducts({
    categoryId: category,
    keyWord: keyword,
    pageSize: Math.min(limit, 100),
    orderBy: 3, // tri par date (nouveautés en priorité)
    sort: "desc",
  });
  console.log(`${items.length} produits trouvés sur cette page (total disponible côté CJ : ${total}).`);

  let selected = 0;
  let imported = 0;
  let rejected = 0;
  let errors = 0;
  let duplicates = 0;

  for (const item of items.slice(0, limit)) {
    if (!quickPrefilter(item)) {
      rejected++;
      continue;
    }

    try {
      const detail = await getCJProductDetail(item.pid);
      if (!detail) {
        errors++;
        continue;
      }

      // Vérification stock réelle — voir hasReadyToShipStock (src/lib/cj/types.ts) :
      // on exige du stock PRÊT À EXPÉDIER (cjInventoryNum), pas seulement
      // storageNum brut qui peut n'être que de la capacité usine (délai de
      // fabrication supplémentaire avant expédition, incompatible avec une
      // promesse de livraison rapide).
      let hasConfirmedStock: boolean | null = null;
      if (detail.variants && detail.variants.length > 0) {
        const stockEntries = await getCJVariantStock(detail.variants[0].vid);
        hasConfirmedStock = hasReadyToShipStock(stockEntries);
      }

      const evaluation = evaluateCJProduct(detail, DEFAULT_SELECTION_CRITERIA, hasConfirmedStock);
      if (!evaluation.accepted) {
        rejected++;
        console.log(`  [rejeté] ${detail.productName} — ${evaluation.rejectionReasons.join("; ")}`);
        continue;
      }
      selected++;

      // Déduplication.
      const duplicate = findDuplicate(
        { cjProductId: detail.pid, sku: detail.productSku, title: detail.productName },
        dupIndex
      );
      if (duplicate) {
        duplicates++;
        console.log(`  [doublon] ${detail.productName} — déjà présent (${duplicate.reason})`);
        continue;
      }

      // Prix — voir getMinVariantPrice (src/lib/cj/types.ts) : `sellPrice` est
      // une fourchette texte ("8.68-9.20"), jamais un nombre direct.
      const referencePrice = getMinVariantPrice(detail);
      const pricing = computeOndealPrice({ supplierPrice: referencePrice });

      // Import Shopify (DRAFT par défaut).
      const cleanTitle = cleanSupplierTitle(detail.productNameEn || detail.productName);
      const cleanDescription = cleanSupplierDescription(detail.description || "");

      // Mappe les VRAIES variantes CJ (couleur/taille/etc.) vers des variantes
      // Shopify — jamais une seule variante plate si CJ en fournit plusieurs
      // (voir mission : ne jamais appauvrir les données fournisseur réelles).
      // Chaque variante a son propre prix Ondeal calculé depuis son propre
      // `variantSellPrice` réel.
      const cjVariants = detail.variants && detail.variants.length > 0 ? detail.variants : null;
      const shopifyVariants = cjVariants
        ? cjVariants.map((v) => {
            const variantPricing = computeOndealPrice({
              supplierPrice: typeof v.variantSellPrice === "number" && v.variantSellPrice > 0 ? v.variantSellPrice : referencePrice,
            });
            // Libellé de variante affiché au client : préférer le vrai nom
            // CJ (variantNameEn/variantName). Ne JAMAIS retomber sur
            // `variantStandard` (chaîne technique brute type
            // "long=510,width=510,height=330", vérifiée illisible côté
            // client le 12/08/2026) ni sur le SKU interne. S'il n'y a qu'une
            // seule variante et aucun nom exploitable, "Défaut" (convention
            // Shopify habituelle pour un produit à variante unique).
            const optionLabel =
              v.variantNameEn || v.variantName || (cjVariants!.length === 1 ? "Défaut" : v.variantSku);
            return {
              optionValues: [{ optionName: "Variante", name: optionLabel }],
              price: variantPricing.ondealPrice.toFixed(2),
              sku: v.variantSku,
              inventoryQuantity: hasConfirmedStock ? 10 : 0, // conservateur tant que la sync stock temps réel n'est pas branchée par variante
            };
          })
        : [
            {
              optionValues: [{ optionName: "Variante", name: "Standard" }],
              price: pricing.ondealPrice.toFixed(2),
              sku: detail.productSku,
              inventoryQuantity: hasConfirmedStock ? 10 : 0,
            },
          ];

      const created = await createProductFromCJ({
        title: cleanTitle,
        descriptionHtml: cleanDescription,
        vendor: detail.supplierName || "Ondeal",
        productType: detail.categoryName || "Non catégorisé",
        tags: [categoryTag(evaluation.guessedCategoryId), "supplier:cj", "nouveau"],
        status: autoPublish ? "ACTIVE" : "DRAFT",
        images: (detail.productImageSet ?? []).map((src) => ({ src, altText: cleanTitle })),
        variants: shopifyVariants,
        supplierMetafields: {
          supplier: "CJdropshipping",
          cjProductId: detail.pid,
          cjVariantId: detail.variants?.[0]?.vid,
          supplierSku: detail.productSku,
          supplierPrice: String(detail.sellPrice ?? ""),
          lastSync: new Date().toISOString(),
        },
      });

      imported++;
      console.log(`  [importé] ${cleanTitle} → ${created.handle} (${shopifyVariants.length} variante(s), à partir de ${pricing.ondealPrice.toFixed(2)} €, statut ${autoPublish ? "ACTIVE" : "DRAFT"})`);
    } catch (err) {
      errors++;
      console.error(`  [erreur] ${item.productName} — ${err instanceof Error ? err.message : err}`);
    }
  }

  const report = buildCatalogReport({
    shopifyActiveAtStart: existingProducts.filter((p) => p.status === "ACTIVE").length,
    archivedIgnored: 0, // non recompté ici — voir scripts/audit-shopify-catalog.ts pour le chiffre exact
    cjFound: items.length,
    cjSelected: selected,
    cjImported: imported,
    cjRejected: rejected,
    cjErrors: errors,
    duplicatesDetected: duplicates,
    generatedAt: new Date().toISOString(),
  });

  console.log("\n=== RAPPORT DE LOT ===");
  console.log(formatCatalogReport(report));

  appendToImportLog({
    ...report,
    category,
    keyword,
    limit,
    autoPublish,
  });
  console.log(`\nRapport de lot ajouté à ${IMPORT_LOG_PATH} (voir "npm run catalog:report" pour le cumul).`);
}

main().catch((err) => {
  console.error("Échec du script d'import :", err);
  process.exit(1);
});
