/**
 * Rapport cumulé de progression vers l'objectif de 3000 produits actifs —
 * voir mission "OBJECTIF 3000". Combine :
 *  - un audit Shopify frais (ACTIVE / ARCHIVED / DRAFT) ;
 *  - le cumul de tous les lots d'import CJ déjà exécutés
 *    (data/catalog-import-log.jsonl, alimenté par scripts/cj-import-batch.ts).
 *
 * Usage : npx tsx scripts/catalog-report.ts
 * Requiert (.env) : SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_ACCESS_TOKEN.
 */
import "dotenv/config";
import { existsSync, readFileSync } from "node:fs";
import { countProductsByStatus } from "../src/lib/shopify/admin";
import { isShopifyAdminConfigured } from "../src/lib/shopify/config";
import { buildCatalogReport, formatCatalogReport, type CatalogReport } from "../src/lib/catalog/report";

const IMPORT_LOG_PATH = "data/catalog-import-log.jsonl";

function readImportLog(): CatalogReport[] {
  if (!existsSync(IMPORT_LOG_PATH)) return [];
  return readFileSync(IMPORT_LOG_PATH, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as CatalogReport);
}

async function main() {
  if (!isShopifyAdminConfigured()) {
    console.error("SHOPIFY_STORE_DOMAIN et/ou SHOPIFY_ADMIN_ACCESS_TOKEN manquants — arrêt.");
    process.exit(1);
  }

  const [active, archived] = await Promise.all([
    countProductsByStatus("ACTIVE"),
    countProductsByStatus("ARCHIVED"),
  ]);

  const logs = readImportLog();
  const cumulative = logs.reduce(
    (acc, log) => ({
      cjFound: acc.cjFound + log.cjFound,
      cjSelected: acc.cjSelected + log.cjSelected,
      cjImported: acc.cjImported + log.cjImported,
      cjRejected: acc.cjRejected + log.cjRejected,
      cjErrors: acc.cjErrors + log.cjErrors,
      duplicatesDetected: acc.duplicatesDetected + log.duplicatesDetected,
    }),
    { cjFound: 0, cjSelected: 0, cjImported: 0, cjRejected: 0, cjErrors: 0, duplicatesDetected: 0 }
  );

  const report = buildCatalogReport({
    shopifyActiveAtStart: active,
    archivedIgnored: archived,
    ...cumulative,
    generatedAt: new Date().toISOString(),
  });

  console.log(`Rapport cumulé — ${logs.length} lot(s) d'import exécuté(s).\n`);
  console.log(formatCatalogReport(report));
}

main().catch((err) => {
  console.error("Échec du rapport :", err);
  process.exit(1);
});
