/**
 * Types pour l'API CJdropshipping (API 2.0).
 * Basés sur la documentation officielle : https://developers.cjdropshipping.cn/en/api/api2/api/product.html
 * et https://developers.cjdropshipping.cn/en/api/api2/api/auth.html
 *
 * NOTE : ces types couvrent les champs documentés utiles à Ondeal. L'API CJ peut
 * renvoyer davantage de champs — étendre au besoin une fois un accès réel disponible
 * pour valider la forme exacte des réponses (la doc publique ne liste pas toujours
 * 100% des champs de réponse).
 */

export interface CJTokenResponse {
  code: number;
  result: boolean;
  message: string;
  data: {
    accessToken: string;
    accessTokenExpiryDate: string;
    refreshToken: string;
    refreshTokenExpiryDate: string;
    createDate: string;
  } | null;
}

export interface CJCategoryLv3 {
  categoryId: string;
  categoryName: string;
}

export interface CJCategoryLv2 {
  categorySecondId: string;
  categorySecondName: string;
  categorySecondList: CJCategoryLv3[];
}

export interface CJCategoryLv1 {
  categoryFirstId: string;
  categoryFirstName: string;
  categoryFirstList: CJCategoryLv2[];
}

export interface CJCategoryResponse {
  code: number;
  result: boolean;
  message: string;
  data: CJCategoryLv1[] | null;
}

/** Paramètres de recherche produit (endpoint `product/list` ou `product/listV2`). */
export interface CJProductSearchParams {
  pageNum?: number;
  pageSize?: number;
  keyWord?: string;
  categoryId?: string;
  countryCode?: string;
  startSellPrice?: number;
  endSellPrice?: number;
  productType?: string;
  /** 0 = pertinence, 1 = nb de vues, 2 = prix, 3 = date, 4 = stock */
  orderBy?: number;
  sort?: "asc" | "desc";
}

export interface CJProductListItem {
  pid: string;
  productName: string;
  productNameEn?: string;
  productSku: string;
  productImage: string;
  sellPrice: string;
  categoryId?: string;
  categoryName?: string;
  productType?: string;
  listedNum?: number;
  createrTime?: string;
}

export interface CJProductListResponse {
  code: number;
  result: boolean;
  message: string;
  data: {
    pageNum: number;
    pageSize: number;
    total: number;
    list: CJProductListItem[];
  } | null;
}

export interface CJVariant {
  vid: string;
  pid: string;
  variantSku: string;
  variantName?: string | null;
  variantNameEn?: string;
  variantImage?: string;
  /** Prix numérique réel de LA variante (contrairement à `CJProductDetail.sellPrice`, qui est une fourchette texte) — vérifié contre une vraie réponse API le 12/08/2026. */
  variantSellPrice?: number;
  variantWeight?: number;
  variantStandard?: string;
  barcode?: string | null;
}

export interface CJProductDetail {
  pid: string;
  productName: string;
  productNameEn?: string;
  productSku: string;
  categoryId?: string;
  categoryName?: string;
  productImageSet?: string[];
  productWeight?: number;
  description?: string;
  /**
   * IMPORTANT (vérifié contre une vraie réponse API le 12/08/2026) : ce champ
   * est une FOURCHETTE TEXTE (ex: "8.68-9.20"), pas un nombre — `Number(sellPrice)`
   * renvoie NaN. Pour un prix exploitable, utiliser `variants[i].variantSellPrice`
   * (numérique, par variante) — voir `getMinVariantPrice` dans ce fichier.
   */
  sellPrice?: string;
  variants?: CJVariant[];
  materialNameEn?: string;
  productUnit?: string;
  sourceFrom?: string | number;
  supplierName?: string;
  listedNum?: number;
}

/** Prix minimum réel (numérique) parmi les variantes — à utiliser pour toute logique de tarification/sélection, jamais `CJProductDetail.sellPrice` (fourchette texte). */
export function getMinVariantPrice(detail: CJProductDetail): number {
  const prices = (detail.variants ?? [])
    .map((v) => v.variantSellPrice)
    .filter((p): p is number => typeof p === "number" && p > 0);
  if (prices.length > 0) return Math.min(...prices);
  // Repli : tenter de parser le premier nombre de la fourchette texte "sellPrice" si aucune variante n'a de prix exploitable.
  const match = detail.sellPrice?.match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

export interface CJProductDetailResponse {
  code: number;
  result: boolean;
  message: string;
  data: CJProductDetail | null;
}

export interface CJStockEntry {
  vid: string;
  countryCode: string;
  /** Stock total (entrepôt CJ prêt-à-expédier + capacité usine) — vérifié le 12/08/2026. */
  storageNum: number;
  /** Nom de l'entrepôt (ex: "China Warehouse") — vérifié le 12/08/2026, remplace le champ `warehouseName` initialement supposé. */
  areaEn?: string;
  areaId?: string;
  /**
   * IMPORTANT : `storageNum` mélange souvent stock prêt-à-expédier ET
   * capacité de production usine (voir `stock[].inventory` vs
   * `stock[].factoryInventory` dans la réponse brute). Un `storageNum` élevé
   * ne garantit donc pas une expédition immédiate — un produit dont le stock
   * ne provient QUE de `factoryInventory` implique généralement un délai de
   * fabrication avant expédition. Non affiné dans cette version : à
   * approfondir avant de scaler les imports si les délais de livraison
   * réels posent problème.
   */
  totalInventoryNum?: number;
  cjInventoryNum?: number;
  factoryInventoryNum?: number;
}

export interface CJStockResponse {
  code: number;
  result: boolean;
  message: string;
  data: CJStockEntry[] | null;
}

/**
 * Détermine si au moins une entrée de stock a du stock PRÊT À EXPÉDIER
 * immédiatement (entrepôt CJ, `cjInventoryNum`), par opposition à du stock
 * qui n'existe qu'en capacité usine (`factoryInventoryNum`, nécessitant une
 * fabrication avant expédition — délai supplémentaire).
 *
 * Vérifié sur une vraie réponse API le 12/08/2026 : un produit peut avoir
 * `storageNum` élevé (ex: 5377) alors que `cjInventoryNum` vaut 0 et que la
 * totalité provient de `factoryInventoryNum` — un `storageNum > 0` seul est
 * donc un FAUX POSITIF pour "prêt à expédier". Utiliser cette fonction (et
 * non `storageNum` brut) pour toute décision d'acceptation basée sur le
 * stock, sous peine d'accepter des produits qui impliquent en réalité un
 * délai de fabrication avant expédition.
 */
export function hasReadyToShipStock(entries: CJStockEntry[]): boolean {
  return entries.some((e) => {
    if (typeof e.cjInventoryNum === "number") return e.cjInventoryNum > 0;
    // Repli si l'API ne renvoie pas ce détail pour cette entrée : on ne peut
    // pas distinguer usine/entrepôt, donc on retombe sur storageNum brut
    // (moins fiable, mais mieux que de rejeter systématiquement).
    return e.storageNum > 0;
  });
}

export interface CJWarehouse {
  countryCode: string;
  countryName: string;
}

export interface CJWarehouseListResponse {
  code: number;
  result: boolean;
  message: string;
  data: CJWarehouse[] | null;
}
