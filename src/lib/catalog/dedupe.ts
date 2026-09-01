/**
 * Détection de doublons — voir mission "DOUBLONS" :
 * avant d'importer un produit CJ, comparer SKU / identifiant CJ / variante /
 * titre / handle / référence fournisseur (+ EAN/GTIN si disponible) contre le
 * catalogue Shopify existant. Ne jamais créer deux fois le même produit.
 *
 * IMPORTANT : l'index de référence ne doit contenir QUE les produits Shopify
 * ACTIVE + DRAFT (catalogue courant + imports CJ en attente de validation).
 * Les produits ARCHIVED (ancien BigBuy) ne sont jamais inclus dans cet index
 * — voir src/lib/catalog/archived-guard.ts.
 */

import type { ShopifyProductSummary } from "@/lib/shopify/admin";

export interface CJCandidate {
  cjProductId: string;
  sku: string;
  title: string;
  handle?: string;
  ean?: string;
}

export interface DuplicateIndex {
  byCJProductId: Map<string, ShopifyProductSummary>;
  bySku: Map<string, ShopifyProductSummary>;
  byHandle: Map<string, ShopifyProductSummary>;
  byNormalizedTitle: Map<string, ShopifyProductSummary>;
}

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // accents
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(title: string): string {
  return normalizeTitle(title).replace(/\s+/g, "-");
}

/**
 * Construit l'index de déduplication à partir des produits Shopify ACTIVE +
 * DRAFT (jamais ARCHIVED — voir en-tête de fichier).
 */
export function buildDuplicateIndex(products: ShopifyProductSummary[]): DuplicateIndex {
  const index: DuplicateIndex = {
    byCJProductId: new Map(),
    bySku: new Map(),
    byHandle: new Map(),
    byNormalizedTitle: new Map(),
  };

  for (const product of products) {
    if (product.cjProductId) index.byCJProductId.set(product.cjProductId, product);
    for (const sku of product.skus) index.bySku.set(sku.toLowerCase(), product);
    index.byHandle.set(product.handle, product);
    index.byNormalizedTitle.set(normalizeTitle(product.title), product);
  }

  return index;
}

export type DuplicateReason = "cj_product_id" | "sku" | "handle" | "exact_title" | "similar_title";

export interface DuplicateMatch {
  reason: DuplicateReason;
  existingProduct: ShopifyProductSummary;
  /** 0-1, pertinent uniquement pour "similar_title". */
  similarity?: number;
}

/** Similarité par chevauchement de tokens (Jaccard) — simple et suffisant pour un pré-filtrage, pas une preuve absolue. */
function titleSimilarity(a: string, b: string): number {
  const tokensA = new Set(normalizeTitle(a).split(" ").filter(Boolean));
  const tokensB = new Set(normalizeTitle(b).split(" ").filter(Boolean));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  const intersection = [...tokensA].filter((t) => tokensB.has(t)).length;
  const union = new Set([...tokensA, ...tokensB]).size;
  return intersection / union;
}

const SIMILAR_TITLE_THRESHOLD = 0.85;

/**
 * Retourne le premier motif de doublon trouvé (par ordre de fiabilité
 * décroissante), ou `null` si le produit CJ candidat semble bien nouveau.
 * Un résultat "similar_title" doit être traité comme un doute à vérifier
 * manuellement plutôt qu'un rejet automatique définitif (voir selection.ts).
 */
export function findDuplicate(candidate: CJCandidate, index: DuplicateIndex): DuplicateMatch | null {
  const byCJId = index.byCJProductId.get(candidate.cjProductId);
  if (byCJId) return { reason: "cj_product_id", existingProduct: byCJId };

  const bySku = index.bySku.get(candidate.sku.toLowerCase());
  if (bySku) return { reason: "sku", existingProduct: bySku };

  if (candidate.handle) {
    const byHandle = index.byHandle.get(candidate.handle);
    if (byHandle) return { reason: "handle", existingProduct: byHandle };
  }

  const normalized = normalizeTitle(candidate.title);
  const byExactTitle = index.byNormalizedTitle.get(normalized);
  if (byExactTitle) return { reason: "exact_title", existingProduct: byExactTitle };

  let bestMatch: DuplicateMatch | null = null;
  for (const existing of index.byNormalizedTitle.values()) {
    const similarity = titleSimilarity(candidate.title, existing.title);
    if (similarity >= SIMILAR_TITLE_THRESHOLD && (!bestMatch || similarity > (bestMatch.similarity ?? 0))) {
      bestMatch = { reason: "similar_title", existingProduct: existing, similarity };
    }
  }

  return bestMatch;
}
