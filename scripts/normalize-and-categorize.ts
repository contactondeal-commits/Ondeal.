/**
 * Normalise + catégorise le catalogue ACTIVE Ondeal — voir mission
 * "MISSION PRIORITAIRE — CATÉGORISER LE CATALOGUE ACTUEL ONDEAL" (12/08/2026),
 * suite de la session ayant récupéré `data/raw-active-products/page-*.json`
 * via l'outil MCP `mcp__Shopify__graphql_query` (lecture seule, aucune
 * mutation Shopify n'a été effectuée pendant cette récupération).
 *
 * Ce script :
 *  1. Lit `data/raw-active-products/page-01.json` (déjà aplati) et tous les
 *     `page-NN-raw.json` (format brut GraphQL `{nodes, pageInfo}`).
 *  2. Normalise chaque produit vers `ProductForCategorization` (moteur pur,
 *     inchangé, voir src/lib/catalog/product-categorizer.ts).
 *  3. Déduplique par id (garde la première occurrence, log un avertissement
 *     s'il y a doublon).
 *  4. Exécute `categorizeProduct` / `summarizeCategorization` — AUCUNE
 *     écriture Shopify, ce script est un outil d'analyse pure.
 *  5. Calcule les catégories sous-représentées/absentes et une table
 *     objectif ~3000 (même méthode que scripts/categorize-active-catalog.ts).
 *  6. Détecte les tags `cat-*` présents dans les données brutes qui ne
 *     correspondent à aucun id valide de la taxonomie (doublons/synonymes).
 *  7. Écrit data/categorization-report.json et data/categorization-report.md.
 *
 * Usage : npx tsx scripts/normalize-and-categorize.ts
 *
 * IMPORTANT — sécurité : ce script ne fait AUCUN appel réseau, ne touche à
 * aucun produit ARCHIVED/DRAFT, et n'importe ni n'exécute aucune mutation
 * Shopify. Les comptes ACTIVE=893 / ARCHIVED=7175 / DRAFT=301 utilisés en
 * section 1 du rapport sont ceux confirmés via l'outil MCP Shopify plus tôt
 * dans cette session (pas de nouvel appel ici pour économiser les requêtes —
 * voir section 1 du rapport Markdown pour le détail de cette décision).
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  categorizeProduct,
  summarizeCategorization,
  type CategorizationResult,
  type ProductForCategorization,
} from "../src/lib/catalog/product-categorizer";
import { getAllCategoriesFlat } from "../src/data/categories";
import { parseCategoryTag } from "../src/lib/catalog/category-mapping";

const RAW_DIR = "data/raw-active-products";
const OUT_JSON = "data/categorization-report.json";
const OUT_MD = "data/categorization-report.md";

// Comptes de sécurité confirmés via l'outil MCP Shopify plus tôt dans cette
// session (avant le début de ce script) — voir section 1 du rapport pour le
// détail de la méthode et la limite assumée (pas de re-vérification live
// ARCHIVED/DRAFT ici, pour économiser des appels ; la garantie principale
// est que ce script entier ne fait AUCUN appel réseau, donc AUCUNE mutation
// Shopify possible).
const SAFETY_COUNTS = { activeBefore: 893, archivedBefore: 7175, draftBefore: 301 };

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// --- Formats bruts rencontrés dans data/raw-active-products ----------------

interface FlatPage1Product {
  id: string;
  title: string;
  tags: string[];
  productType: string;
  vendor: string;
  skus: (string | null)[];
  cjProductId?: string | null;
}

interface RawVariantNode {
  sku: string | null;
}

interface RawProductNode {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  productType: string;
  vendor: string;
  variants: { nodes: RawVariantNode[] };
  metafield: { value: string } | null;
}

interface RawPage {
  nodes: RawProductNode[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

function isRawPage(data: unknown): data is RawPage {
  return typeof data === "object" && data !== null && "nodes" in data;
}

function normalizeFlatProduct(p: FlatPage1Product): ProductForCategorization {
  return {
    id: p.id,
    title: p.title,
    description: "",
    tags: p.tags,
    productType: p.productType,
    vendor: p.vendor,
    skus: p.skus.filter((s): s is string => s !== null),
    cjProductId: p.cjProductId ?? null,
  };
}

function normalizeRawProduct(p: RawProductNode): ProductForCategorization {
  return {
    id: p.id,
    title: p.title,
    description: stripHtml(p.description ?? ""),
    tags: p.tags,
    productType: p.productType,
    vendor: p.vendor,
    skus: p.variants.nodes.map((v) => v.sku).filter((s): s is string => s !== null),
    cjProductId: p.metafield?.value ?? null,
  };
}

function main() {
  if (!existsSync(RAW_DIR)) {
    console.error(`Répertoire introuvable : ${RAW_DIR}. Arrêt — aucune donnée fabriquée.`);
    process.exit(1);
  }

  const files = readdirSync(RAW_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();
  if (files.length === 0) {
    console.error(`Aucun fichier .json dans ${RAW_DIR}. Arrêt — aucune donnée fabriquée.`);
    process.exit(1);
  }

  console.log(`=== Lecture de ${files.length} fichier(s) dans ${RAW_DIR} ===`);

  const byId = new Map<string, ProductForCategorization>();
  let duplicateCount = 0;
  // Tags `cat-*` bruts observés (avant filtrage sur validité) — pour la
  // section 9 du rapport (doublons/synonymes de catégories).
  const rawCategoryTagCounts = new Map<string, number>();

  for (const file of files) {
    const fullPath = join(RAW_DIR, file);
    const raw = readFileSync(fullPath, "utf-8");
    const data: unknown = JSON.parse(raw);

    let normalized: ProductForCategorization[];
    let sourceTags: string[][];

    if (Array.isArray(data)) {
      // Format aplati (page-01.json)
      const products = data as FlatPage1Product[];
      normalized = products.map(normalizeFlatProduct);
      sourceTags = products.map((p) => p.tags);
    } else if (isRawPage(data)) {
      normalized = data.nodes.map(normalizeRawProduct);
      sourceTags = data.nodes.map((n) => n.tags);
    } else {
      console.warn(`  ${file} : format non reconnu, ignoré.`);
      continue;
    }

    for (const tags of sourceTags) {
      for (const tag of tags) {
        if (tag.startsWith("cat-")) {
          rawCategoryTagCounts.set(tag, (rawCategoryTagCounts.get(tag) ?? 0) + 1);
        }
      }
    }

    for (const product of normalized) {
      if (byId.has(product.id)) {
        duplicateCount++;
        console.warn(`  AVERTISSEMENT : id en double détecté (${product.id}) dans ${file} — première occurrence conservée.`);
        continue;
      }
      byId.set(product.id, product);
    }

    console.log(`  ${file} : ${normalized.length} produits lus.`);
  }

  const allProducts = [...byId.values()];
  console.log(`\nTotal normalisé (après dédoublonnage) : ${allProducts.length}`);
  if (duplicateCount > 0) {
    console.warn(`AVERTISSEMENT : ${duplicateCount} doublon(s) d'id détecté(s) et ignoré(s).`);
  }
  if (Math.abs(allProducts.length - 893) > 20) {
    console.warn(
      `AVERTISSEMENT EXPLICITE : le total normalisé (${allProducts.length}) s'écarte significativement de la cible attendue (~893 produits ACTIVE). Vérifier la pagination avant de faire confiance au rapport.`
    );
  }

  console.log("\n=== Catégorisation (analyse pure, aucune écriture Shopify) ===");
  const results: CategorizationResult[] = allProducts.map((p) => categorizeProduct(p));
  const summary = summarizeCategorization(results);

  // --- Catégories sous-représentées / absentes --------------------------
  const leafCategories = getAllCategoriesFlat().filter((c) => c.children.length === 0);
  const UNDERCOVERED_THRESHOLD = 20;
  const undercovered = leafCategories.filter((c) => (summary.byCategory[c.id] ?? 0) < UNDERCOVERED_THRESHOLD);
  const absent = leafCategories.filter((c) => !(summary.byCategory[c.id] > 0));

  // --- Table Objectif — méthode identique à scripts/categorize-active-catalog.ts ---
  const categorizedTotal = Object.values(summary.byCategory).reduce((a, b) => a + b, 0) || 1;
  const TARGET_TOTAL = 3000;
  const FLOOR_PER_CATEGORY = 30;
  const objectiveTable = leafCategories.map((c) => {
    const current = summary.byCategory[c.id] ?? 0;
    const proportional = Math.round((current / categorizedTotal) * TARGET_TOTAL);
    const objective = Math.max(FLOOR_PER_CATEGORY, proportional);
    return { categoryId: c.id, name: c.name, current, objective, gap: Math.max(0, objective - current) };
  });

  // --- Tags cat-* invalides (doublons/synonymes) sur les données réelles --
  const validIds = new Set(getAllCategoriesFlat().map((c) => c.id));
  const invalidCategoryTags = [...rawCategoryTagCounts.entries()]
    .filter(([tag]) => {
      const id = parseCategoryTag(tag);
      return id === null || !validIds.has(id);
    })
    .sort((a, b) => b[1] - a[1]);

  // --- Écriture des rapports ----------------------------------------------
  mkdirSync("data", { recursive: true });
  writeFileSync(
    OUT_JSON,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        safety: SAFETY_COUNTS,
        totalNormalized: allProducts.length,
        duplicateIdsSkipped: duplicateCount,
        summary,
        objectiveTable,
        undercoveredCategoryIds: undercovered.map((c) => c.id),
        absentCategoryIds: absent.map((c) => c.id),
        invalidCategoryTags: invalidCategoryTags.map(([tag, count]) => ({ tag, count })),
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
  md.push(
    `- ACTIVE : ${SAFETY_COUNTS.activeBefore} — confirmé via l'outil MCP \`mcp__Shopify__graphql_query\` plus tôt dans cette session (pagination complète \`status:active\`, 18 pages, 893 produits uniques récupérés — voir \`data/raw-active-products/page-*.json\`).`
  );
  md.push(
    `- ARCHIVED : ${SAFETY_COUNTS.archivedBefore} (ignorés, non modifiés) — confirmé via l'outil MCP plus tôt dans cette session, **non re-vérifié en fin de script** pour économiser des appels API. L'API Shopify Admin \`products\` n'expose pas de champ de comptage exact direct (pas de \`totalCount\`) ; un comptage exact nécessiterait de paginer l'intégralité des ${SAFETY_COUNTS.archivedBefore} produits ARCHIVED, ce qui n'apporterait aucune valeur pour cette mission (ils ne sont jamais lus ni modifiés).`
  );
  md.push(`- DRAFT : ${SAFETY_COUNTS.draftBefore} (ignorés, non modifiés) — même remarque que ci-dessus.`);
  md.push(
    `- **Garantie principale** : ce script (\`scripts/normalize-and-categorize.ts\`) ne fait AUCUN appel réseau — il lit uniquement des fichiers JSON déjà sauvegardés sur disque. La récupération des données (script précédent de cette session, via l'outil MCP \`graphql_query\`) n'a utilisé QUE des requêtes en lecture (\`query: "status:active"\`), jamais \`graphql_mutation\`. 0 écriture Shopify, 0 produit ARCHIVED touché, 0 produit DRAFT publié.\n`
  );
  md.push("## 2. Catégorisation\n");
  md.push(`- Total analysé : ${summary.total}`);
  md.push(`- Doublons d'id détectés et ignorés : ${duplicateCount}`);
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
  md.push(
    "## 6. Objectif ~3000 (proposition à valider, méthode : proportionnelle au catalogue actuel catégorisé, plancher 30/catégorie)\n"
  );
  md.push("| Catégorie | Actuels | Objectif | Manque |");
  md.push("|---|---|---|---|");
  objectiveTable.forEach((o) => md.push(`| ${o.name} | ${o.current} | ${o.objective} | ${o.gap} |`));
  md.push("");
  md.push(`## 7. Sécurité\n`);
  md.push(`- ARCHIVED touchés : 0 (script en lecture seule sur fichiers disque, aucun appel réseau)`);
  md.push(`- DRAFT publiés : 0 (script en lecture seule sur fichiers disque, aucun appel réseau)`);
  md.push(`- Produits supprimés : 0`);
  md.push(`- Produits archivés : 0`);
  md.push(`- Produits modifiés dans Shopify : 0 (ce script ne fait aucune écriture, ni même aucun appel réseau)\n`);
  md.push(`## 8. Détail complet\n`);
  md.push(`Voir ${OUT_JSON} (${results.length} entrées, ID Shopify + titre + catégorie proposée + confiance + raison).\n`);
  md.push(`## 9. Catégories synonymes/doublons détectées sur les données réelles\n`);
  md.push(
    `Tags \`cat-*\` rencontrés dans les données brutes Shopify qui ne correspondent PAS à un id valide de \`getAllCategoriesFlat()\` (\`src/data/categories.ts\`) — c'est-à-dire soit un synonyme/doublon d'une catégorie existante sous un autre nom, soit une catégorie totalement absente de la taxonomie Ondeal actuelle. Nombre de produits concernés par tag :\n`
  );
  if (invalidCategoryTags.length === 0) {
    md.push(`Aucun tag \`cat-*\` invalide détecté.`);
  } else {
    md.push("| Tag `cat-*` invalide | Nombre de produits |");
    md.push("|---|---|");
    invalidCategoryTags.forEach(([tag, count]) => md.push(`| ${tag} | ${count} |`));
  }
  md.push("");

  writeFileSync(OUT_MD, md.join("\n"), "utf-8");

  console.log(`\nRapport écrit : ${OUT_JSON} et ${OUT_MD}`);
  console.log("\n=== Résumé ===");
  console.log(
    `HIGH=${summary.byConfidence.HIGH}  MEDIUM=${summary.byConfidence.MEDIUM}  LOW=${summary.byConfidence.LOW}  sans-categorie=${summary.uncategorized}`
  );
  console.log(`Catégories sous-représentées : ${undercovered.length}`);
  console.log(`Catégories absentes : ${absent.length}`);
  console.log(`Tags cat-* invalides détectés : ${invalidCategoryTags.length}`);
  console.log("\nAUCUNE écriture Shopify, AUCUN appel réseau n'a été effectué par ce script.");
}

main();
