/**
 * Audit + catégorisation READ-ONLY des produits Shopify ACTIVE — voir mission
 * "MISSION PRIORITAIRE — CATÉGORISER LE CATALOGUE ACTUEL ONDEAL" (12/08/2026).
 *
 * NE MODIFIE RIEN dans Shopify. Ce script :
 *  1. Compte ACTIVE / ARCHIVED / DRAFT (les deux derniers ne sont jamais
 *     traités, seulement comptés pour le rapport de sécurité).
 *  2. Récupère TOUS les produits ACTIVE (titre, description, tags,
 *     productType, vendor, SKU, metafield CJ).
 *  3. Propose une catégorie Ondeal pour chacun via
 *     src/lib/catalog/product-categorizer.ts (HIGH/MEDIUM/LOW).
 *  4. Écrit un rapport JSON + Markdown dans data/ — jamais d'écriture Shopify.
 *
 * Une étape ULTÉRIEURE et SÉPARÉE (script distinct, à écrire seulement après
 * validation humaine de ce rapport) appliquera les corrections retenues
 * (tags `cat-*`, `productType`) uniquement aux IDs explicitement validés —
 * voir mission "IMPORTANT — NE PAS SUPPRIMER LES PRODUITS" / "SÉCURITÉ".
 *
 * Usage :
 *   npx tsx scripts/categorize-active-catalog.ts
 *
 * Requiert (.env) : SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_ACCESS_TOKEN.
 */
import "dotenv/config";
import { mkdirSync, writeFileSync } from "node:fs";
import { countProductsByStatus, listProductsByStatus } from "../src/lib/shopify/admin";
import { isShopifyAdminConfigured } from "../src/lib/shopify/config";
import { rejectArchived } from "../src/lib/catalog/archived-guard";
import { categorizeProduct, summarizeCategorization, type CategorizationResult } from "../src/lib/catalog/product-categorizer";
import { getAllCategoriesFlat } from "../src/data/categories";

const OUT_JSON = "data/categorization-report.json";
const OUT_MD = "data/categorization-report.md";

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function main() {
  if (!isShopifyAdminConfigured()) {
    console.error("SHOPIFY_STORE_DOMAIN et/ou SHOPIFY_ADMIN_ACCESS_TOKEN manquants — arrêt.");
    console.error("Voir .env.example et docs/SHOPIFY_INTEGRATION.md.");
    process.exit(1);
  }

  console.log("=== Audit de sécurité (avant) ===");
  const [activeBefore, archivedBefore, draftBefore] = await Promise.all([
    countProductsByStatus("ACTIVE"),
    countProductsByStatus("ARCHIVED"),
    countProductsByStatus("DRAFT"),
  ]);
  console.log(`ACTIVE=${activeBefore}  ARCHIVED=${archivedBefore} (ignorés)  DRAFT=${draftBefore} (ignorés)`);

  console.log("\n=== Récupération des produits ACTIVE (lecture seule) ===");
  const activeProducts = [];
  let cursor: string | null = null;
  do {
    const page = await listProductsByStatus("ACTIVE", cursor);
    // Garde-fou défensif — voir archived-guard.ts : même si on n'a demandé
    // que status:active, on revérifie explicitement avant tout traitement.
    activeProducts.push(...rejectArchived(page.products));
    cursor = page.hasNextPage ? page.endCursor : null;
    console.log(`  ${activeProducts.length} produits récupérés jusqu'ici...`);
  } while (cursor);
  console.log(`Total ACTIVE récupéré : ${activeProducts.length}`);

  console.log("\n=== Catégorisation (analyse pure, aucune écriture Shopify) ===");
  const results: CategorizationResult[] = activeProducts.map((p) =>
    categorizeProduct({
      id: p.id,
      title: p.title,
      description: stripHtml(p.description || ""),
      tags: p.tags,
      productType: p.productType,
      vendor: p.vendor,
      skus: p.skus,
      cjProductId: p.cjProductId,
    })
  );

  const summary = summarizeCategorization(results);

  // --- Catégories sous-représentées / absentes --------------------------
  const leafCategories = getAllCategoriesFlat().filter((c) => c.children.length === 0);
  const UNDERCOVERED_THRESHOLD = 20;
  const undercovered = leafCategories.filter((c) => (summary.byCategory[c.id] ?? 0) < UNDERCOVERED_THRESHOLD);
  const absent = leafCategories.filter((c) => !(summary.byCategory[c.id] > 0));

  // --- Table Objectif — méthode explicite, pas de chiffres inventés -----
  // Objectif proportionnel au poids actuel de chaque catégorie dans le
  // catalogue déjà catégorisé (HIGH+MEDIUM), avec un plancher de 30 produits
  // par catégorie feuille pour éviter les catégories quasi vides une fois à
  // 3000. Ceci est une PROPOSITION de départ, explicitement présentée comme
  // telle — à ajuster avec l'utilisateur, pas une vérité calculée.
  const categorizedTotal = Object.values(summary.byCategory).reduce((a, b) => a + b, 0) || 1;
  const TARGET_TOTAL = 3000;
  const FLOOR_PER_CATEGORY = 30;
  const objectiveTable = leafCategories.map((c) => {
    const current = summary.byCategory[c.id] ?? 0;
    const proportional = Math.round((current / categorizedTotal) * TARGET_TOTAL);
    const objective = Math.max(FLOOR_PER_CATEGORY, proportional);
    return { categoryId: c.id, name: c.name, current, objective, gap: Math.max(0, objective - current) };
  });

  // --- Écriture des rapports ----------------------------------------------
  mkdirSync("data", { recursive: true });
  writeFileSync(
    OUT_JSON,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        safety: { activeBefore, archivedBefore, draftBefore },
        summary,
        objectiveTable,
        undercoveredCategoryIds: undercovered.map((c) => c.id),
        absentCategoryIds: absent.map((c) => c.id),
        results,
      },
      null,
      2
    ),
    "utf-8"
  );

  const md: string[] = [];
  md.push("# Rapport de catégorisation — catalogue ACTIVE Ondeal\n");
  md.push(`Généré le ${new Date().toISOString()}\n`);
  md.push("## 1. État initial (sécurité)\n");
  md.push(`- ACTIVE : ${activeBefore}`);
  md.push(`- ARCHIVED : ${archivedBefore} (ignorés, non modifiés)`);
  md.push(`- DRAFT : ${draftBefore} (ignorés, non modifiés)\n`);
  md.push("## 2. Catégorisation\n");
  md.push(`- Total analysé : ${summary.total}`);
  md.push(`- HIGH : ${summary.byConfidence.HIGH}`);
  md.push(`- MEDIUM : ${summary.byConfidence.MEDIUM}`);
  md.push(`- LOW / À_REVOIR : ${summary.byConfidence.LOW}`);
  md.push(`- Sans catégorie (proposedCategoryId=null) : ${summary.uncategorized}\n`);
  md.push("## 3. Répartition par catégorie\n");
  md.push("| Catégorie | Nombre de produits |");
  md.push("|---|---|");
  Object.entries(summary.byCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([id, count]) => md.push(`| ${id} | ${count} |`));
  md.push("");
  md.push("## 4. Catégories sous-représentées (< 20 produits)\n");
  undercovered.forEach((c) => md.push(`- ${c.id} (${c.name}) : ${summary.byCategory[c.id] ?? 0}`));
  md.push("");
  md.push("## 5. Catégories absentes (0 produit)\n");
  absent.forEach((c) => md.push(`- ${c.id} (${c.name})`));
  md.push("");
  md.push("## 6. Objectif ~3000 (proposition à valider, méthode : proportionnelle au catalogue actuel catégorisé, plancher 30/catégorie)\n");
  md.push("| Catégorie | Actuels | Objectif | Manque |");
  md.push("|---|---|---|---|");
  objectiveTable.forEach((o) => md.push(`| ${o.name} | ${o.current} | ${o.objective} | ${o.gap} |`));
  md.push("");
  md.push(`## 7. Sécurité\n`);
  md.push(`- ARCHIVED BigBuy touchés : 0 (script en lecture seule)`);
  md.push(`- DRAFT BigBuy publiés : 0 (script en lecture seule)`);
  md.push(`- Produits supprimés : 0`);
  md.push(`- Produits archivés : 0`);
  md.push(`- Produits modifiés dans Shopify : 0 (ce script ne fait aucune écriture)\n`);
  md.push(`## 8. Détail complet\n`);
  md.push(`Voir ${OUT_JSON} (${results.length} entrées, ID Shopify + titre + catégorie proposée + confiance + raison).`);

  writeFileSync(OUT_MD, md.join("\n"), "utf-8");

  console.log(`\nRapport écrit : ${OUT_JSON} et ${OUT_MD}`);
  console.log("\n=== Résumé ===");
  console.log(`HIGH=${summary.byConfidence.HIGH}  MEDIUM=${summary.byConfidence.MEDIUM}  LOW=${summary.byConfidence.LOW}  sans-categorie=${summary.uncategorized}`);
  console.log(`Catégories sous-représentées : ${undercovered.length}`);
  console.log(`Catégories absentes : ${absent.length}`);
  console.log("\nAUCUNE écriture Shopify n'a été effectuée par ce script (lecture seule).");
}

main().catch((err) => {
  console.error("Échec de l'audit de catégorisation :", err);
  process.exit(1);
});
