// Couche service — point d'intégration unique entre les pages Next.js et le
// catalogue produit. Utilise Shopify Storefront API quand la boutique est
// configurée (SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN), et
// retombe sur les données de démonstration sinon — ce qui permet au projet
// de continuer à fonctionner en aperçu/développement sans credentials, tout
// en devenant automatiquement "branché Shopify" dès que les variables
// d'environnement sont renseignées (aucun changement de code nécessaire).

import {
  products,
  getProductBySlug,
  getBestsellers,
  getNewArrivals,
  getDeals,
  getRelatedProducts,
} from "@/data/products";
import type { FilterState, Product, SortOption } from "@/types";
import { isShopifyPublicConfigured } from "@/lib/shopify/config";
import {
  fetchAllShopifyProducts,
  fetchShopifyProductByHandle,
  fetchShopifyProductRecommendations,
  fetchShopifyProducts,
  fetchShopifyProductsByIds,
} from "@/lib/shopify/storefront";
import { categoryTagsForQuery } from "@/lib/catalog/category-mapping";

const MOCK_LATENCY_MS = 0;
const USE_SHOPIFY = isShopifyPublicConfigured();

function delay<T>(value: T): Promise<T> {
  return MOCK_LATENCY_MS > 0 ? new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS)) : Promise.resolve(value);
}

/** Recherche plein texte — utilisée par /search (Server Component). */
export async function searchProductsService(query: string): Promise<Product[]> {
  if (!query.trim()) return fetchAllProducts();
  if (USE_SHOPIFY) {
    const { products: shopifyProducts } = await fetchShopifyProducts({ first: 100, query });
    return shopifyProducts;
  }
  const q = query
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return delay(products.filter((p) => normalize(p.title).includes(q) || normalize(p.brand).includes(q) || normalize(p.description).includes(q)));
}

export async function fetchAllProducts(): Promise<Product[]> {
  if (USE_SHOPIFY) {
    // Paginé (corrigé le 13/08/2026) : une seule page de 250 tronquait
    // silencieusement le catalogue réel dès qu'il dépassait cette taille.
    return fetchAllShopifyProducts();
  }
  return delay(products);
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  if (USE_SHOPIFY) {
    const product = await fetchShopifyProductByHandle(slug);
    return product ?? undefined;
  }
  return delay(getProductBySlug(slug));
}

/**
 * Mission "AUDIT PANIER/FAVORIS" (15/08/2026) — voir fetchShopifyProductsByIds
 * dans storefront.ts pour le détail du bug corrigé. Utilisé par la page
 * /wishlist (via une Server Action) pour récupérer les VRAIS produits
 * correspondant aux ids favoris stockés côté client, au lieu de les chercher
 * (en vain) dans le jeu de données de démonstration.
 */
export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  if (USE_SHOPIFY) {
    return fetchShopifyProductsByIds(ids);
  }
  return delay(products.filter((p) => ids.includes(p.id)));
}

/**
 * `categoryIds` : la catégorie ciblée + éventuellement toutes ses
 * sous-catégories (pour une page catégorie parente qui doit afficher les
 * produits de toute la branche).
 */
export async function fetchProductsByCategory(categoryIds: string | string[]): Promise<Product[]> {
  const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
  if (USE_SHOPIFY) {
    // IMPORTANT (corrigé le 12/08/2026) : ce code interrogeait un metafield
    // `custom.ondeal_category_id` qui n'existe sur AUCUN produit réel — les
    // produits déjà catégorisés dans la vraie boutique Shopify utilisent un
    // tag `cat-<id>` (voir src/lib/catalog/category-mapping.ts, convention
    // vérifiée par lecture réelle de produits, ex: `cat-montres`). Avec
    // l'ancienne requête, TOUTE page catégorie serait revenue vide sur de
    // vraies données Shopify. Utilise désormais le même tag `cat-*` que le
    // reste du pipeline (import CJ, audit, catégorisation) — une seule
    // convention, jamais deux systèmes concurrents (voir mission
    // catégorisation, section "TAGS SHOPIFY").
    //
    // Mission "ONDEAL — PHASE 3 : Audit + correction catégories + audit prix
    // + navigation catalogue" (13/08/2026) : `categoryTagsForQuery` élargit
    // cette requête à des tags Shopify historiques validés (ex: "cat-montres"
    // pour la catégorie "homme-montres") — voir
    // src/lib/catalog/category-mapping.ts pour le détail et la justification.
    const expectedTags = ids.flatMap((id) => categoryTagsForQuery(id));
    const query = expectedTags.map((tag) => `tag:${tag}`).join(" OR ");
    // Paginé (corrigé le 13/08/2026) : voir fetchAllProducts ci-dessus — une
    // catégorie large (ex: Bijoux, 147 produits) ne doit jamais être tronquée
    // silencieusement au-delà d'une seule page de 250.
    const results = await fetchAllShopifyProducts({ query });
    // IMPORTANT (corrigé le 19/08/2026, bug remonté par l'utilisateur : des
    // chaussures bébé apparaissaient sous "Chaussures Homme") : la recherche
    // Shopify Storefront pour `tag:X` fait un matching par PRÉFIXE sur les
    // tags composés, pas une égalité stricte — ex. `tag:cat-jouets` renvoie
    // AUSSI les produits tagués uniquement `cat-jouets-jeux` (un vieux tag
    // orphelin sans rapport, voir LEGACY_TAG_ALIASES dans
    // category-mapping.ts pour le contexte). Vérifié le 19/08/2026 en
    // isolant les résultats de `tag:cat-jouets` : 56 des 90 produits
    // retournés n'avaient PAS le tag exact `cat-jouets` dans leur tableau
    // `tags` réel. Sans ce filtre, une page catégorie affiche des produits
    // qui n'ont jamais reçu le tag canonique demandé. Le filtre ci-dessous
    // revérifie l'égalité EXACTE sur le tableau `tags` brut de chaque
    // produit (voir `tags` dans src/types/index.ts) plutôt que de faire
    // confiance à la recherche Shopify seule.
    const expectedTagSet = new Set(expectedTags);
    return results.filter((p) => p.tags?.some((t) => expectedTagSet.has(t)));
  }
  return delay(products.filter((p) => ids.includes(p.categoryId) || (p.subcategoryId && ids.includes(p.subcategoryId))));
}

/**
 * Mission "CORRECTIF CTA RENTRÉE" (20/08/2026) — récupère les produits par un
 * tag Shopify brut plutôt que par une catégorie de src/data/categories.ts.
 * Utilisé pour "cat-bureau-papeterie" (fournitures scolaires & bureau), qui
 * n'a jamais été une vraie catégorie de navigation (voir home page.tsx) —
 * uniquement un tag `cat-*` appliqué aux produits (import CJ + BigBuy legacy
 * + DSers), comme documenté dans fetchProductsByCategory ci-dessus. Même
 * garde-fou anti faux-positif (matching par préfixe de `tag:X` côté Shopify
 * Storefront) : on revérifie l'égalité EXACTE sur le tableau `tags` réel de
 * chaque produit avant de le garder.
 */
export async function fetchProductsByTag(tag: string, count?: number): Promise<Product[]> {
  if (USE_SHOPIFY) {
    const results = await fetchAllShopifyProducts({ query: `tag:${tag}` });
    const exact = results.filter((p) => p.tags?.includes(tag));
    return typeof count === "number" ? exact.slice(0, count) : exact;
  }
  const exact = products.filter((p) => p.tags?.includes(tag));
  return delay(typeof count === "number" ? exact.slice(0, count) : exact);
}

export async function fetchBestsellers(count = 10): Promise<Product[]> {
  if (USE_SHOPIFY) {
    const { products: shopifyProducts } = await fetchShopifyProducts({ first: count, sortKey: "BEST_SELLING" });
    return shopifyProducts;
  }
  return delay(getBestsellers(count));
}

export async function fetchNewArrivals(count = 10): Promise<Product[]> {
  if (USE_SHOPIFY) {
    const { products: shopifyProducts } = await fetchShopifyProducts({ first: count, sortKey: "CREATED_AT", reverse: true });
    return shopifyProducts;
  }
  return delay(getNewArrivals(count));
}

export async function fetchDeals(count = 10): Promise<Product[]> {
  if (USE_SHOPIFY) {
    const { products: shopifyProducts } = await fetchShopifyProducts({ first: count, query: "tag:promotion" });
    return shopifyProducts;
  }
  return delay(getDeals(count));
}

// Mission "BRANCHER SEARCH & DISCOVERY" (15/08/2026) — enrichit la requête
// par tag de catégorie (fiable, garantie topiquement cohérente) avec le vrai
// moteur de recommandation Shopify (`productRecommendations`, piloté par
// l'app "Search & Discovery" déjà installée), utilisé UNIQUEMENT en
// complément et filtré à la même catégorie que le produit consulté.
//
// Testé en conditions réelles le 15/08/2026 : `productRecommendations` seul
// (intent RELATED) renvoyait par moments des produits sans aucun rapport
// (ex. laisses pour chien / griffoir pour chat sous "Chaussons de bain") —
// la boutique étant encore jeune, l'algorithme Shopify (basé en partie sur
// l'historique de ventes) n'a pas encore assez de données pour être fiable
// seul. Le filtrage par catégorie réelle du produit reste donc la source
// principale et garantie ; Shopify ne sert qu'à compléter si elle ne suffit
// pas à remplir `count` résultats, jamais à remplacer un item pertinent par
// un item hors-sujet.
export async function fetchRelatedProducts(product: Product, count = 6): Promise<Product[]> {
  if (USE_SHOPIFY) {
    const expectedTags = categoryTagsForQuery(product.categoryId);
    const relatedQuery = expectedTags.map((tag) => `tag:${tag}`).join(" OR ");
    const { products: shopifyProducts } = await fetchShopifyProducts({
      first: count + 1,
      query: relatedQuery,
    });
    // Même correctif que fetchProductsByCategory ci-dessus (matching par
    // préfixe de la recherche Shopify sur les tags composés) — sans lui, des
    // produits "similaires" totalement hors sujet pourraient être suggérés.
    const expectedTagSet = new Set(expectedTags);
    const exactMatches = shopifyProducts.filter((p) => p.tags?.some((t) => expectedTagSet.has(t)));
    const sameCategoryResults = exactMatches.filter((p) => p.id !== product.id).slice(0, count);
    if (sameCategoryResults.length >= count) return sameCategoryResults;

    // Complément (pas remplacement) : recommandations Shopify réelles,
    // limitées à la même catégorie que le produit consulté, en évitant les
    // doublons déjà trouvés par tag.
    const recommended = await fetchShopifyProductRecommendations(product.id, "RELATED");
    const seenIds = new Set(sameCategoryResults.map((p) => p.id));
    const backfill = recommended.filter(
      (p) => p.id !== product.id && !seenIds.has(p.id) && p.categoryId === product.categoryId
    );
    return [...sameCategoryResults, ...backfill].slice(0, count);
  }
  return delay(getRelatedProducts(product, count));
}

/**
 * "Produits fréquemment achetés ensemble" — remplace l'ancien
 * `allProducts.filter(...).slice(0, 4)` (les 4 produits les plus récents du
 * catalogue ENTIER, sans aucun rapport réel avec le produit consulté — un
 * intitulé trompeur pour le client, et un appel inutile chargeant tout le
 * catalogue rien que pour ça) par le vrai signal Shopify "complémentaire".
 * Filet de sécurité : liste vide si Shopify n'a rien à proposer (la section
 * ne s'affiche alors pas, jamais de contenu inventé pour la remplir).
 */
export async function fetchBoughtTogetherProducts(product: Product, count = 4): Promise<Product[]> {
  if (!USE_SHOPIFY) return [];
  const recommended = await fetchShopifyProductRecommendations(product.id, "COMPLEMENTARY");
  return recommended.filter((p) => p.id !== product.id).slice(0, count);
}

export function sortProducts(list: Product[], sort: SortOption): Product[] {
  const copy = [...list];
  switch (sort) {
    case "price_asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price_desc":
      return copy.sort((a, b) => b.price - a.price);
    case "bestselling":
      return copy.sort((a, b) => b.salesCount - a.salesCount);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    case "newest":
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    default:
      return copy;
  }
}

export function filterProducts(list: Product[], filters: Partial<FilterState>): Product[] {
  return list.filter((p) => {
    if (filters.priceMin !== undefined && p.price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && p.price > filters.priceMax) return false;
    if (filters.brands && filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
    if (filters.minRating !== undefined && p.rating < filters.minRating) return false;
    if (filters.inStockOnly && !p.inStock) return false;
    if (filters.fastDeliveryOnly && !p.delivery.fast) return false;
    return true;
  });
}
