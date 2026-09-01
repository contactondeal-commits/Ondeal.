// Types centraux de la marketplace

export type Badge =
  | "BESTSELLER"
  | "NOUVEAU"
  | "PROMOTION"
  | "TOP_VENTE"
  | "RECOMMANDE"
  | "EXCLUSIVITE"
  | "RUPTURE_STOCK";

/**
 * Mission "SÉLECTION DE TAILLE" (15/08/2026) — demande explicite du client :
 * laisser les acheteurs choisir la taille (vêtements, chaussures) avant
 * d'ajouter au panier. `ProductOption`/`ProductVariant` reflètent
 * fidèlement les `options`/`variants` réels d'un produit Shopify (voir
 * mapStorefrontProduct dans src/lib/shopify/storefront.ts) — jamais de
 * taille, couleur, prix ou disponibilité inventés : uniquement ce que
 * Shopify renvoie pour CE produit précis.
 */
export interface ProductOption {
  /** Nom réel de l'option tel que défini dans Shopify (ex. "Taille", "Size", "Taille et coloris", "Color"). */
  name: string;
  values: string[];
}

export interface ProductVariant {
  /** GID Shopify de la variante — c'est CET id qui doit être ajouté au panier/checkout, jamais l'id du produit. */
  id: string;
  title: string;
  price: number;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  image?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  categoryId: string;
  subcategoryId?: string;
  images: string[];
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviewsCount: number;
  reviews?: ProductReview[];
  stock: number;
  inStock: boolean;
  badges: Badge[];
  delivery: {
    fast: boolean;
    freeShipping: boolean;
    estimate: string;
  };
  seller: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  createdAt: string;
  salesCount: number;
  /**
   * Présents uniquement quand le produit provient réellement de Shopify
   * (Storefront API) — nécessaires pour les mutations de panier/checkout.
   * `undefined` pour les produits de démonstration (données mock).
   */
  shopifyProductId?: string;
  shopifyDefaultVariantId?: string;
  /**
   * Options réelles du produit (ex. Taille, Couleur) — toujours présentes
   * (même vide) sur les produits Shopify, absentes sur les produits de
   * démonstration (données mock). Un seul nom d'option "Title"/valeur
   * "Default Title" (produit Shopify sans variante réelle) est filtré à
   * l'affichage plutôt qu'exclu ici, pour rester fidèle à la donnée brute.
   */
  options?: ProductOption[];
  /**
   * Liste complète des variantes — uniquement peuplée sur la fiche produit
   * (requête détaillée, voir fetchShopifyProductByHandle) : une grille de
   * produits n'a besoin de savoir QUE si le produit est en stock (déjà
   * couvert par `inStock`), pas de charger jusqu'à 250 variantes par carte.
   */
  variants?: ProductVariant[];
  /**
   * Tags Shopify bruts (présents uniquement sur les produits réels
   * Shopify — voir shopifyProductId ci-dessus). Ajouté le 19/08/2026
   * (mission "Correction catégorisation catalogue", bug remonté par
   * l'utilisateur : chaussures bébé affichées sous "Chaussures Homme").
   * Nécessaire car `categoryId` ne retient qu'UN SEUL tag `cat-*` (le
   * premier par ordre alphabétique) alors qu'un même produit peut porter
   * plusieurs tags `cat-*` à la fois (ex: un vieux tag orphelin
   * `cat-jouets-jeux` en plus du vrai tag de catégorie) — voir
   * `fetchProductsByCategory` dans productService.ts qui s'appuie sur ce
   * tableau complet pour un filtrage exact, au lieu du `categoryId` dérivé
   * (insuffisant pour ce cas précis).
   */
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image?: string;
  description?: string;
  children: Category[];
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface CartItem {
  /**
   * Identifiant de LIGNE panier — mission "SÉLECTION DE TAILLE" (15/08/2026) :
   * avant cette mission, une ligne panier était identifiée par `productId`
   * seul, ce qui aurait fusionné "T-shirt taille M" et "T-shirt taille L"
   * en une seule ligne (même productId, tailles différentes). `lineId`
   * combine productId + variante sélectionnée (`${productId}::${variantId}`,
   * ou juste `productId` si le produit n'a pas de variante réelle) : deux
   * tailles du même produit sont désormais deux lignes distinctes.
   */
  lineId: string;
  productId: string;
  quantity: number;
  /**
   * Instantané dénormalisé du produit au moment de l'ajout au panier (titre,
   * prix, image, slug, variante Shopify). Rend le panier indépendant de la
   * source du catalogue (mock ou Shopify) — pas besoin de relire tout le
   * catalogue pour afficher/calculer le panier.
   */
  snapshot: {
    title: string;
    price: number;
    image: string;
    slug: string;
    shopifyVariantId?: string;
    /** Ex. "Taille : M / Couleur : Noir" — affiché tel quel dans le panier, jamais recalculé/deviné. */
    variantLabel?: string;
  };
}

export interface SearchSuggestion {
  products: Pick<Product, "id" | "slug" | "title" | "images" | "price">[];
  categories: Pick<Category, "id" | "name" | "slug">[];
  popularSearches: string[];
}

export type SortOption =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "bestselling"
  | "rating"
  | "newest";

export interface FilterState {
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  brands: string[];
  minRating?: number;
  inStockOnly: boolean;
  fastDeliveryOnly: boolean;
}
