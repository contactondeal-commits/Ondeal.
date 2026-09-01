/**
 * Logique de sélection des produits CJ — voir mission "NE PAS IMPORTER
 * AUTOMATIQUEMENT TOUT CJ". Un produit CJ n'est retenu que s'il satisfait un
 * ensemble de critères de qualité explicites. Ne jamais accepter un produit
 * uniquement pour atteindre le chiffre de 3000 (voir mission "OBJECTIF
 * CATALOGUE" : qualité + pertinence avant tout).
 */

import type { CJProductDetail, CJProductListItem } from "@/lib/cj/types";
import { getMinVariantPrice } from "@/lib/cj/types";
import { guessOndealCategoryId, UNCATEGORIZED } from "./category-mapping";

export interface SelectionCriteria {
  /** Prix fournisseur minimum/maximum acceptables (avant marge), en euros ou devise CJ native. */
  minSupplierPrice: number;
  maxSupplierPrice: number;
  /** Longueur minimale du titre pour être considéré "exploitable". */
  minTitleLength: number;
  /** Longueur minimale de la description pour être considérée "exploitable". */
  minDescriptionLength: number;
  /** Exiger qu'au moins une info de stock/entrepôt soit présente. */
  requireStockInfo: boolean;
}

export const DEFAULT_SELECTION_CRITERIA: SelectionCriteria = {
  minSupplierPrice: 1,
  maxSupplierPrice: 200,
  minTitleLength: 8,
  minDescriptionLength: 40,
  requireStockInfo: true,
};

export interface SelectionResult {
  cjProductId: string;
  accepted: boolean;
  score: number; // 0-100, indicatif — n'est PAS le seul critère d'acceptation
  reasons: string[]; // points positifs
  rejectionReasons: string[]; // raisons de rejet (vide si accepté)
  guessedCategoryId: string;
}

/**
 * Évalue un produit CJ (détail complet, avec variantes/stock si disponible)
 * selon les critères de la mission : catégorie pertinente, disponibilité,
 * images correctes, titre/description exploitables, prix acceptable,
 * potentiel commercial (ventes/tendance quand l'info existe).
 *
 * Le stock/l'expédition France-Europe doivent être vérifiés séparément via
 * `getCJVariantStock` / `getCJWarehouses` (src/lib/cj/products.ts) avant
 * acceptation finale — cette fonction évalue les champs déjà présents dans
 * le détail produit et ne fait pas d'appel réseau elle-même (pure, testable).
 */
export function evaluateCJProduct(
  detail: CJProductDetail,
  criteria: SelectionCriteria = DEFAULT_SELECTION_CRITERIA,
  hasConfirmedStock: boolean | null = null
): SelectionResult {
  const reasons: string[] = [];
  const rejectionReasons: string[] = [];
  let score = 0;

  const title = detail.productNameEn || detail.productName || "";
  const description = detail.description || "";
  // detail.sellPrice est une fourchette texte ("8.68-9.20"), pas un nombre —
  // voir getMinVariantPrice (src/lib/cj/types.ts), vérifié contre une vraie
  // réponse API le 12/08/2026.
  const price = getMinVariantPrice(detail);
  const images = detail.productImageSet ?? [];
  const guessedCategoryId = guessOndealCategoryId(`${title} ${detail.categoryName ?? ""}`);

  // --- Catégorie pertinente -------------------------------------------------
  if (guessedCategoryId !== UNCATEGORIZED) {
    reasons.push(`Catégorie identifiée : ${guessedCategoryId}`);
    score += 15;
  } else {
    rejectionReasons.push("Aucune catégorie Ondeal correspondante identifiée (à classer manuellement)");
  }

  // --- Titre exploitable -----------------------------------------------------
  if (title.trim().length >= criteria.minTitleLength) {
    reasons.push("Titre suffisamment descriptif");
    score += 15;
  } else {
    rejectionReasons.push(`Titre trop court ou vide (< ${criteria.minTitleLength} caractères)`);
  }

  // --- Description exploitable -----------------------------------------------
  if (description.trim().length >= criteria.minDescriptionLength) {
    reasons.push("Description suffisamment détaillée");
    score += 10;
  } else {
    rejectionReasons.push(`Description trop courte ou absente (< ${criteria.minDescriptionLength} caractères)`);
  }

  // --- Images ------------------------------------------------------------------
  if (images.length >= 1 && images.every((url) => /^https?:\/\//.test(url))) {
    reasons.push(`${images.length} image(s) fournisseur valide(s)`);
    score += 20;
  } else {
    rejectionReasons.push("Aucune image fournisseur valide (URL absente ou malformée)");
  }

  // --- Prix acceptable -----------------------------------------------------
  if (price > 0 && price >= criteria.minSupplierPrice && price <= criteria.maxSupplierPrice) {
    reasons.push(`Prix fournisseur dans la fourchette acceptable (${price})`);
    score += 15;
  } else {
    rejectionReasons.push(
      `Prix fournisseur hors fourchette [${criteria.minSupplierPrice}, ${criteria.maxSupplierPrice}] (valeur: ${price || "inconnue"})`
    );
  }

  // --- Variantes -----------------------------------------------------------
  if ((detail.variants?.length ?? 0) > 0) {
    reasons.push(`${detail.variants!.length} variante(s) disponible(s)`);
    score += 10;
  }

  // --- Stock / expédition (si vérifié en amont) -----------------------------
  if (criteria.requireStockInfo) {
    if (hasConfirmedStock === true) {
      reasons.push("Stock confirmé dans un entrepôt exploitable");
      score += 15;
    } else if (hasConfirmedStock === false) {
      rejectionReasons.push("Aucun stock confirmé dans un entrepôt exploitable (France/Europe)");
    } else {
      rejectionReasons.push("Stock non vérifié (appeler getCJVariantStock avant import définitif)");
    }
  }

  // --- Potentiel commercial (signal faible, bonus uniquement) ----------------
  if ((detail.listedNum ?? 0) > 50) {
    reasons.push(`Déjà listé par ${detail.listedNum} boutiques (signal de tendance)`);
    score = Math.min(100, score + 10);
  }

  // Un produit est accepté seulement s'il n'a AUCUNE raison de rejet critique.
  const accepted = rejectionReasons.length === 0;

  return {
    cjProductId: detail.pid,
    accepted,
    score,
    reasons,
    rejectionReasons,
    guessedCategoryId,
  };
}

/**
 * Filtre rapide de pré-sélection sur un résultat de liste CJ (moins de champs
 * que le détail complet) — utile pour écarter les candidats évidents avant
 * de dépenser un appel `product/query` (détail) par produit.
 */
export function quickPrefilter(item: CJProductListItem, criteria: SelectionCriteria = DEFAULT_SELECTION_CRITERIA): boolean {
  const title = item.productNameEn || item.productName || "";
  const price = Number(item.sellPrice || 0);
  const hasImage = Boolean(item.productImage) && /^https?:\/\//.test(item.productImage);
  return (
    title.trim().length >= criteria.minTitleLength &&
    hasImage &&
    price >= criteria.minSupplierPrice &&
    price <= criteria.maxSupplierPrice
  );
}
