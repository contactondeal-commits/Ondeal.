/**
 * Script d'audit — voir mission étapes 2 et 3 : compter précisément les
 * produits Shopify ACTIVE (catalogue Ondeal actuel) et ARCHIVED (ancien
 * BigBuy, à ignorer totalement).
 *
 * Usage :
 *   npx tsx scripts/audit-shopify-catalog.ts
 *
 * Requiert (.env) : SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_ACCESS_TOKEN.
 * Ne modifie aucune donnée — lecture seule.
 */
import "dotenv/config";
import { countProductsByStatus, listProductsByStatus } from "../src/lib/shopify/admin";
import { isShopifyAdminConfigured } from "../src/lib/shopify/config";
import { rejectArchived } from "../src/lib/catalog/archived-guard";
import { parseCategoryTag, categoryTag, UNCATEGORIZED } from "../src/lib/catalog/category-mapping";

async function main() {
  if (!isShopifyAdminConfigured()) {
    console.error(
      "SHOPIFY_STORE_DOMAIN et/ou SHOPIFY_ADMIN_ACCESS_TOKEN manquants. " +
        "Voir .env.example et docs/SHOPIFY_INTEGRATION.md."
    );
    process.exit(1);
  }

  console.log("Audit du catalogue Shopify — comptage par statut...\n");

  const [active, archived, draft] = await Promise.all([
    countProductsByStatus("ACTIVE"),
    countProductsByStatus("ARCHIVED"),
    countProductsByStatus("DRAFT"),
  ]);

  console.log(`Produits ACTIVE  (catalogue Ondeal actuel) : ${active}`);
  console.log(`Produits ARCHIVED (ancien BigBuy — IGNORÉS) : ${archived}`);
  console.log(`Produits DRAFT    (imports CJ en attente)   : ${draft}`);
  console.log(`\nObjectif final : ~3000 produits ACTIVE.`);
  console.log(`Restant estimé à ajouter via CJ : ${Math.max(0, 3000 - active)}`);

  // Répartition par catégorie (sur les seuls produits ACTIVE) — pagination complète.
  console.log("\nRécupération de la répartition par catégorie (produits ACTIVE)...");
  const categoryCounts: Record<string, number> = {};
  let cursor: string | null = null;
  let total = 0;
  do {
    const page = await listProductsByStatus("ACTIVE", cursor);
    const safeProducts = rejectArchived(page.products); // garde-fou défensif, cf. archived-guard.ts
    total += safeProducts.length;
    for (const p of safeProducts) {
      // Convention réelle vérifiée le 12/08/2026 : préfixe `cat-` (tiret),
      // jamais `cat:` — voir category-mapping.ts.
      const foundTag = p.tags.find((t) => parseCategoryTag(t) !== null) ?? categoryTag(UNCATEGORIZED);
      categoryCounts[foundTag] = (categoryCounts[foundTag] ?? 0) + 1;
    }
    cursor = page.hasNextPage ? page.endCursor : null;
  } while (cursor);

  console.log(`\n${total} produits ACTIVE parcourus.`);
  console.log("\nRépartition par tag catégorie :");
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([tag, count]) => console.log(`  ${tag} : ${count}`));
}

main().catch((err) => {
  console.error("Échec de l'audit :", err);
  process.exit(1);
});
