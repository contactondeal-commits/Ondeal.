// Pas de "server-only" ici — voir la note dans ./client.ts (module aussi
// exécuté en Node pur par les scripts CLI, hors bundler Next.js).
import { cjGet } from "./client";
import type {
  CJCategoryResponse,
  CJProductDetail,
  CJProductDetailResponse,
  CJProductListItem,
  CJProductListResponse,
  CJProductSearchParams,
  CJStockEntry,
  CJStockResponse,
  CJVariant,
  CJWarehouse,
  CJWarehouseListResponse,
} from "./types";

/** Récupère l'arborescence complète des catégories CJ (3 niveaux). */
export async function getCJCategories() {
  const res = await cjGet<CJCategoryResponse>("product/getCategory");
  return res.data ?? [];
}

/** Recherche de produits CJ selon des critères (catégorie, prix, mot-clé, tri...). */
export async function searchCJProducts(params: CJProductSearchParams): Promise<{
  items: CJProductListItem[];
  total: number;
  pageNum: number;
  pageSize: number;
}> {
  const res = await cjGet<CJProductListResponse>("product/list", {
    pageNum: params.pageNum ?? 1,
    pageSize: Math.min(params.pageSize ?? 50, 100),
    // IMPORTANT (vérifié contre l'API réelle le 12/08/2026) : le paramètre
    // documenté/supposé "keyWord" est silencieusement ignoré par
    // `product/list` (renvoie ~1.5M résultats non filtrés). Le vrai
    // paramètre de filtrage par mot-clé est `productNameEn`. On garde
    // `keyWord` comme nom de champ public (CJProductSearchParams) pour ne
    // pas casser les appelants, et on le mappe ici vers le vrai paramètre.
    productNameEn: params.keyWord,
    categoryId: params.categoryId,
    countryCode: params.countryCode,
    startSellPrice: params.startSellPrice,
    endSellPrice: params.endSellPrice,
    productType: params.productType,
    orderBy: params.orderBy,
    sort: params.sort,
  });

  return {
    items: res.data?.list ?? [],
    total: res.data?.total ?? 0,
    pageNum: res.data?.pageNum ?? params.pageNum ?? 1,
    pageSize: res.data?.pageSize ?? params.pageSize ?? 50,
  };
}

/** Détail complet d'un produit CJ (incluant variantes) par son PID. */
export async function getCJProductDetail(pid: string): Promise<CJProductDetail | null> {
  const res = await cjGet<CJProductDetailResponse>("product/query", { pid });
  return res.data ?? null;
}

/** Liste des variantes d'un produit CJ. */
export async function getCJProductVariants(pid: string): Promise<CJVariant[]> {
  const res = await cjGet<{ code: number; result: boolean; message: string; data: CJVariant[] | null }>(
    "product/variant/query",
    { pid }
  );
  return res.data ?? [];
}

/** Stock disponible pour une variante donnée, par entrepôt/pays. */
export async function getCJVariantStock(vid: string): Promise<CJStockEntry[]> {
  const res = await cjGet<CJStockResponse>("product/stock/queryByVid", { vid });
  return res.data ?? [];
}

/** Liste des entrepôts CJ disponibles (utile pour filtrer l'expédition France/Europe). */
export async function getCJWarehouses(): Promise<CJWarehouse[]> {
  const res = await cjGet<CJWarehouseListResponse>("product/globalWarehouseList");
  return res.data ?? [];
}
