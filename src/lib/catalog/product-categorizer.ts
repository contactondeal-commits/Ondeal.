/**
 * Moteur de catégorisation multi-signaux pour les produits Shopify ACTIVE —
 * voir mission "MISSION PRIORITAIRE — CATÉGORISER LE CATALOGUE ACTUEL ONDEAL"
 * (12/08/2026).
 *
 * Fonction PURE, sans appel réseau : reçoit des données produit déjà
 * récupérées (voir scripts/categorize-active-catalog.ts pour la récupération
 * réelle via Shopify Admin API) et retourne une proposition de catégorie
 * avec un niveau de confiance explicite. Ne catégorise QUE les produits
 * ACTIVE — voir la garde `archived-guard.ts` appliquée en amont par
 * l'appelant, jamais dans ce module.
 *
 * Règles de la mission respectées ici :
 *  - Réutilise l'unique table de mots-clés (`getKeywordMap`) et la taxonomie
 *    Ondeal existante (`@/data/categories`) — ne duplique ni n'invente de
 *    nouvelle catégorie.
 *  - Analyse plusieurs sources (titre, description, tags, productType,
 *    vendor, SKU, metafield CJ) au lieu du seul `productType` (souvent "0"
 *    ou vide sur le catalogue legacy — voir audit précédent).
 *  - Ne force jamais une catégorie : si aucun signal fiable, ou si plusieurs
 *    catégories sont à égalité, le produit est classé LOW avec une raison
 *    explicite plutôt qu'une catégorie inventée.
 */

import { getAllCategoriesFlat } from "@/data/categories";
import {
  COMPATIBILITY_SENSITIVE_CATEGORIES,
  getKeywordMap,
  isCompatibilityMention,
  keywordMatches,
  parseCategoryTag,
  stripDiacritics,
} from "./category-mapping";

export type CategorizationConfidence = "HIGH" | "MEDIUM" | "LOW";

export interface ProductForCategorization {
  id: string;
  title: string;
  /** Texte brut (HTML dépouillé) — voir ShopifyProductSummary.description. */
  description: string;
  tags: string[];
  productType: string;
  vendor: string;
  skus: string[];
  cjProductId?: string | null;
}

export interface CategorizationResult {
  productId: string;
  title: string;
  /** null si aucune catégorie fiable — voir `confidence: "LOW"` et `reason`. */
  proposedCategoryId: string | null;
  confidence: CategorizationConfidence;
  /** Signaux ayant contribué à la décision, dans l'ordre de poids décroissant — pour audit humain. */
  matchedSignals: string[];
  /** Explication lisible, en particulier pour justifier un classement LOW/À_REVOIR. */
  reason: string;
  /** Autres catégories candidates avec un score proche (utile pour arbitrage humain sur les cas ambigus). */
  alternativeCategoryIds: string[];
}

// Poids par source — le titre est le signal le plus fiable, le SKU/vendor
// les moins fiables (souvent génériques côté fournisseur).
const SIGNAL_WEIGHTS = {
  existingCategoryTag: 100, // tag `cat-*` déjà présent et valide → confiance quasi certaine
  title: 5,
  productType: 3,
  description: 2,
  vendor: 1,
  sku: 1,
} as const;

function scoreText(text: string, weight: number, scores: Map<string, number>, signals: Map<string, string[]>) {
  if (!text) return;
  const keywordMap = getKeywordMap();
  const validIds = new Set(getAllCategoriesFlat().map((c) => c.id));
  for (const [categoryId, keywords] of Object.entries(keywordMap)) {
    if (!validIds.has(categoryId)) continue;
    const matched = keywords.filter((kw) => {
      if (!keywordMatches(text, kw)) return false;
      // Mission "SECONDE PASSE" (12/08/2026) : une mention de compatibilité
      // ("compatible smartphone", "avec support téléphone") ne doit jamais
      // faire basculer le produit vers `telephones`/`ecrans` — voir
      // isCompatibilityMention/COMPATIBILITY_SENSITIVE_CATEGORIES.
      if (COMPATIBILITY_SENSITIVE_CATEGORIES.has(categoryId) && isCompatibilityMention(text, kw)) return false;
      return true;
    });
    if (matched.length > 0) {
      scores.set(categoryId, (scores.get(categoryId) ?? 0) + weight * matched.length);
      const list = signals.get(categoryId) ?? [];
      list.push(...matched);
      signals.set(categoryId, list);
    }
  }
}

/**
 * Position (index de mot, 0 = premier mot du titre) de la première occurrence
 * de l'un des mots-clés donnés dans le titre — sert d'approximation du
 * "produit principal" quand deux catégories ont un score proche (voir mission
 * "SECONDE PASSE" section 9 : "priorité au produit principal... ne jamais
 * choisir uniquement en fonction du nombre de mots-clés"). Retourne -1 si
 * aucun des mots-clés n'apparaît dans le titre lui-même (ex: signal venant
 * uniquement de la description/vendor/SKU).
 */
function firstTitleKeywordPosition(title: string, keywords: string[]): number {
  const words = stripDiacritics(title.toLowerCase()).match(/[a-z0-9]+/g) ?? [];
  let best = -1;
  for (const kw of keywords) {
    const kwWords = stripDiacritics(kw.toLowerCase()).split(/\s+/);
    const firstKwWord = kwWords[0];
    for (let i = 0; i < words.length; i++) {
      const maxSuffix = firstKwWord.length >= 4 ? 2 : 0;
      if (words[i].startsWith(firstKwWord) && words[i].length - firstKwWord.length <= maxSuffix) {
        if (best === -1 || i < best) best = i;
        break;
      }
    }
  }
  return best;
}

/**
 * Réaffecte le score de `vetements-mixte` vers `femme-vetements` ou
 * `homme-vetements` quand le titre contient explicitement "femme" ou
 * "homme" — voir mission "SECONDE PASSE" section 2 : "Pull homme" → Vêtements
 * homme, "Pull oversize unisexe" → Vêtements mixte/unisexe. N'agit QUE si
 * `vetements-mixte` a déjà un score (un mot-clé vêtement générique a été
 * trouvé) : ne matche jamais "homme"/"femme" seuls ailleurs, pour éviter la
 * contamination déjà constatée en session (ex: "parfum homme", "montre
 * homme" ne doivent pas devenir des vêtements).
 */
function resolveClothingGender(product: ProductForCategorization, scores: Map<string, number>, signals: Map<string, string[]>) {
  const mixteScore = scores.get("vetements-mixte");
  if (!mixteScore) return;

  const text = `${product.title} ${product.description}`;
  const hasHomme = keywordMatches(text, "homme");
  const hasFemme = keywordMatches(text, "femme");
  const hasUnisexe = keywordMatches(text, "unisexe") || keywordMatches(text, "mixte");
  if (hasUnisexe || (hasHomme && hasFemme) || (!hasHomme && !hasFemme)) return; // reste en vetements-mixte

  const target = hasHomme ? "homme-vetements" : "femme-vetements";
  scores.set(target, (scores.get(target) ?? 0) + mixteScore);
  scores.delete("vetements-mixte");
  const mixteSignals = signals.get("vetements-mixte") ?? [];
  const targetSignals = signals.get(target) ?? [];
  signals.set(target, [...targetSignals, ...mixteSignals, hasHomme ? "homme (titre/description)" : "femme (titre/description)"]);
  signals.delete("vetements-mixte");
}

/**
 * Priorité au "jouet" — voir mission "SECONDE PASSE" section 9 (priorité au
 * produit principal). Un produit dont le titre contient "jouet"/"jouets" est
 * TOUJOURS un jouet avant d'être autre chose : "Cuisine Jouet Enfant" est un
 * jouet, pas du matériel de cuisine ; "Chien Robot Électronique Jouet
 * Interactif" est un jouet, pas un produit pour animaux. Trouvé en
 * inspectant les résultats réels de cette seconde passe (12/08/2026) : 5
 * produits contenant "jouet" étaient classés dans une catégorie littérale
 * (meubles, cuisine, chiens, tablettes) simplement parce que ce mot-clé y
 * apparaissait, sans tenir compte du qualificatif "jouet" qui redéfinit le
 * produit réellement vendu. N'agit que si `jouets` a déjà un score (le mot
 * "jouet"/"jouets" est bien présent) — ne force jamais cette catégorie sans
 * signal réel.
 */
function resolveToyOverride(scores: Map<string, number>, signals: Map<string, string[]>) {
  const toyScore = scores.get("jouets");
  if (!toyScore) return;
  const maxOther = Math.max(0, ...[...scores.entries()].filter(([id]) => id !== "jouets").map(([, s]) => s));
  if (toyScore <= maxOther) {
    // Marge large (pas juste +1) : le seuil d'ambiguïté du bloc suivant est
    // 80% du score gagnant — un simple +1 resterait "ambigu" et laisserait
    // le départage par position (voir plus bas) annuler cette priorité.
    scores.set("jouets", maxOther * 2 + 1);
    const list = signals.get("jouets") ?? [];
    signals.set("jouets", [...list, "jouet/jouets (priorité produit-jouet)"]);
  }
}

/**
 * Propose une catégorie Ondeal pour un produit Shopify ACTIVE, avec un
 * niveau de confiance. Ne modifie rien — pure fonction d'analyse.
 */
export function categorizeProduct(product: ProductForCategorization): CategorizationResult {
  // --- 1. Tag existant `cat-*` déjà valide : confiance quasi certaine ------
  // Voir mission "TAGS SHOPIFY" : réutiliser la convention existante plutôt
  // que de recatégoriser en ignorant ce qui a déjà été fait manuellement ou
  // lors d'un import précédent.
  // IMPORTANT (corrigé 12/08/2026, mission "SECONDE PASSE" section 12) :
  // n'accepter que des tags pointant vers une catégorie FEUILLE. Un tag
  // `cat-jardin` (catégorie parente, sans produit affecté directement) était
  // accepté tel quel avant ce correctif — 2 produits réels se retrouvaient
  // ainsi classés "jardin" au lieu d'une vraie sous-catégorie
  // (mobilier-jardin/outils-jardin/barbecue). Un tag pointant vers une
  // catégorie parente retombe désormais sur l'analyse multi-signaux normale.
  const leafIds = new Set(getAllCategoriesFlat().filter((c) => c.children.length === 0).map((c) => c.id));
  const existingTag = product.tags.map(parseCategoryTag).find((id) => id !== null && leafIds.has(id));
  if (existingTag) {
    return {
      productId: product.id,
      title: product.title,
      proposedCategoryId: existingTag,
      confidence: "HIGH",
      matchedSignals: [`tag existant: cat-${existingTag}`],
      reason: `Le produit a déjà un tag de catégorie valide (cat-${existingTag}), conservé tel quel.`,
      alternativeCategoryIds: [],
    };
  }

  // --- 2. Score multi-signaux (titre > productType > description > vendor/sku) ---
  const scores = new Map<string, number>();
  const signals = new Map<string, string[]>();

  // productType est ignoré comme signal quand c'est une valeur "0" ou un
  // simple entier (ex: "4", "5") — ce ne sont pas des libellés de catégorie
  // réels mais des index/placeholders observés sur une partie du catalogue
  // (voir mission — trouvé en analysant les vraies données le 12/08/2026).
  const usableProductType = product.productType && !/^\d+$/.test(product.productType.trim()) ? product.productType : "";
  scoreText(product.title, SIGNAL_WEIGHTS.title, scores, signals);
  scoreText(usableProductType, SIGNAL_WEIGHTS.productType, scores, signals);
  scoreText(product.description, SIGNAL_WEIGHTS.description, scores, signals);
  scoreText(product.vendor, SIGNAL_WEIGHTS.vendor, scores, signals);
  for (const sku of product.skus) scoreText(sku, SIGNAL_WEIGHTS.sku, scores, signals);

  resolveClothingGender(product, scores, signals);
  resolveToyOverride(scores, signals);

  if (scores.size === 0) {
    return {
      productId: product.id,
      title: product.title,
      proposedCategoryId: null,
      confidence: "LOW",
      matchedSignals: [],
      reason: "Aucun mot-clé de la taxonomie Ondeal ne correspond au titre, à la description, au productType, au vendor ou aux SKU. Catégorie potentiellement absente de la taxonomie actuelle — à examiner manuellement.",
      alternativeCategoryIds: [],
    };
  }

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const [topCategoryId, topScore] = ranked[0];
  const runnerUp = ranked[1];
  const matchedInTitle = (signals.get(topCategoryId) ?? []).some((kw) => keywordMatches(product.title, kw));

  // Ambiguïté : deuxième catégorie avec un score proche (≥ 80% du score
  // gagnant) → ne pas trancher automatiquement, laisser à la revue humaine.
  const isAmbiguous = Boolean(runnerUp) && runnerUp[1] >= topScore * 0.8;

  if (isAmbiguous) {
    // Mission "SECONDE PASSE" section 9 : "priorité au produit principal...
    // ne jamais choisir uniquement en fonction du nombre de mots-clés". Avant
    // de déclasser en LOW, on regarde laquelle des deux catégories candidates
    // est mentionnée EN PREMIER dans le titre — meilleure approximation
    // disponible du "produit principal" sans comprendre la sémantique. Si les
    // deux catégories n'ont pas de mot-clé dans le titre lui-même (ex: signal
    // uniquement via description/SKU), ou si elles apparaissent à la même
    // position, on reste prudent et on déclasse en LOW comme avant.
    const topPos = firstTitleKeywordPosition(product.title, signals.get(topCategoryId) ?? []);
    const runnerPos = firstTitleKeywordPosition(product.title, signals.get(runnerUp[0]) ?? []);

    if (topPos !== -1 && (runnerPos === -1 || topPos < runnerPos)) {
      // "topCategoryId" apparaît en premier dans le titre — traité comme le
      // produit principal malgré le score proche : on continue le calcul
      // normal ci-dessous (pas de retour LOW ici).
    } else if (runnerPos !== -1 && (topPos === -1 || runnerPos < topPos)) {
      return {
        productId: product.id,
        title: product.title,
        proposedCategoryId: runnerUp[0],
        confidence: "MEDIUM", // décidé par position dans le titre, pas par un score dominant — prudence
        matchedSignals: signals.get(runnerUp[0]) ?? [],
        reason: `"${runnerUp[0]}" apparaît avant "${topCategoryId}" dans le titre (priorité au produit principal), malgré un score légèrement inférieur (${runnerUp[1]} vs ${topScore}).`,
        alternativeCategoryIds: [topCategoryId],
      };
    } else {
      return {
        productId: product.id,
        title: product.title,
        proposedCategoryId: topCategoryId,
        confidence: "LOW",
        matchedSignals: signals.get(topCategoryId) ?? [],
        reason: `Score ambigu entre "${topCategoryId}" (${topScore}) et "${runnerUp[0]}" (${runnerUp[1]}) — écart insuffisant pour trancher automatiquement, et aucun des deux mots-clés n'apparaît dans le titre à une position permettant de départager.`,
        alternativeCategoryIds: [runnerUp[0]],
      };
    }
  }

  const confidence: CategorizationConfidence = matchedInTitle ? "HIGH" : topScore >= SIGNAL_WEIGHTS.productType ? "MEDIUM" : "LOW";

  return {
    productId: product.id,
    title: product.title,
    proposedCategoryId: topCategoryId,
    confidence,
    matchedSignals: signals.get(topCategoryId) ?? [],
    reason:
      confidence === "HIGH"
        ? `Correspondance trouvée directement dans le titre (mots-clés : ${(signals.get(topCategoryId) ?? []).join(", ")}).`
        : `Correspondance trouvée uniquement hors titre (productType/description/vendor/SKU) — à confirmer.`,
    alternativeCategoryIds: runnerUp ? [runnerUp[0]] : [],
  };
}

export interface CategorizationSummary {
  total: number;
  byConfidence: Record<CategorizationConfidence, number>;
  byCategory: Record<string, number>;
  uncategorized: number;
  toReview: CategorizationResult[]; // LOW confidence + proposedCategoryId === null
}

/** Agrège une liste de résultats de catégorisation en synthèse pour le rapport (voir mission "RAPPORT À PRODUIRE"). */
export function summarizeCategorization(results: CategorizationResult[]): CategorizationSummary {
  const byConfidence: Record<CategorizationConfidence, number> = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  const byCategory: Record<string, number> = {};
  let uncategorized = 0;
  const toReview: CategorizationResult[] = [];

  for (const r of results) {
    byConfidence[r.confidence]++;
    if (r.proposedCategoryId) {
      byCategory[r.proposedCategoryId] = (byCategory[r.proposedCategoryId] ?? 0) + 1;
    } else {
      uncategorized++;
    }
    if (r.confidence === "LOW") toReview.push(r);
  }

  return { total: results.length, byConfidence, byCategory, uncategorized, toReview };
}
