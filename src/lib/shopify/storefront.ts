import { SHOPIFY_API_VERSION, getShopifyDomain, isShopifyPublicConfigured } from "./config";
import type { Product } from "@/types";
import { parseCategoryTag, UNCATEGORIZED } from "@/lib/catalog/category-mapping";
import { fetchJudgemeProductReviews } from "./judgeme";

/**
 * Client Storefront GraphQL Shopify Ң��a����� seule source de v����rit���� pour le
 * catalogue affich���� publiquement sur ondeal.fr (voir mission : "Ne jamais
 * faire Next.js Ң��������� CJ directement pour afficher le catalogue public").
 *
 * Le Storefront API ne retourne jamais les produits ARCHIVED ou DRAFT : par
 * construction, il n'expose que les produits publi����s sur le canal de vente
 * "Online Store". Aucun filtrage manuel du statut n'est donc n����cessaire c����t����
 * Next.js pour respecter la r����gle "jamais afficher les produits archiv����s" Ң��a�����
 * c'est Shopify qui l'applique nativement ���� ce niveau.
 *
 * CREDENTIALS REQUIS : SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN
 * (Shopify Admin > Apps > D����velopper des apps > votre app > API Storefront >
 * scopes de lecture catalogue > Installer > "Token API Storefront").
 */

export class ShopifyStorefrontError extends Error {
  constructor(
    message: string,
    public readonly errors?: unknown
  ) {
    super(message);
  }
}

function getStorefrontToken(): string {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!token) {
    throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN manquant. Voir .env.example.");
  }
  return token;
}

export async function shopifyStorefrontGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: { noStore?: boolean } = {}
): Promise<T> {
  const domain = getShopifyDomain();
  const token = getStorefrontToken();

  let res: Response;
  try {
    res = await fetch(`https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
        // BUG FIX (02/09/2026) — Audit conversion : le français est déjà la
        // langue PAR DÉFAUT de la boutique (confirmé côté Admin : le champ
        // `title` brut, sans locale précisée, est déjà en français sur les
        // produits corrigés). Cet en-tête "Accept-Language: fr" faisait
        // pourtant appliquer par l'API Storefront une traduction "fr"
        // enregistrée séparément sur certains produits — traductions
        // parasites, restées en ANGLAIS depuis un ancien import/traduction
        // jamais nettoyé, qui écrasaient donc le contenu principal
        // (correctement français) par ce vieux texte anglais. Vérifié
        // directement le 02/09/2026 sur un produit concret (id
        // 16293943935311, "Sac à Dos Enfant Polyvalent...") : `title` par
        // défaut = français correct, mais `translations(locale:"fr")` =
        // ancien titre anglais. Sans cet en-tête, l'API Storefront renvoie
        // directement le contenu par défaut (déjà français), sans passer par
        // cette couche de traduction parasite. Explique la persistance de
        // contenu anglais malgré plusieurs purges de cache + rebuilds
        // complets (ce n'était pas un problème de cache Vercel).
      },
      body: JSON.stringify({ query, variables }),
      // Le catalogue public est raisonnablement stable : revalidation toutes
      // les 60s. En revanche, tout appel portant des donn����es PERSONNELLES
      // (compte client : connexion, profil, commandes, adresses Ң��a����� voir
      // src/lib/shopify/customer.ts) passe options.noStore=true pour ne
      // JAMAIS ����tre mis en cache Ң��a����� des donn����es d'un client ne doivent
      // jamais pouvoir ����tre servies ���� un autre.
      ...(options.noStore ? { cache: "no-store" as const } : { next: { revalidate: 60 } }),
      // ������vite qu'une requ����te Shopify qui ne r����pond jamais (incident r����seau/
      // CDN) ne bloque ind����finiment le rendu d'une page Next.js Ң��a����� voir
      // src/app/error.tsx pour la page affich����e si ce d����lai est d����pass����.
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new ShopifyStorefrontError("Requ����te Storefront Shopify expir����e apr����s 10s (timeout r����seau).");
    }
    throw new ShopifyStorefrontError(
      `Impossible de joindre l'API Storefront Shopify : ${err instanceof Error ? err.message : "erreur r����seau inconnue"}`
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ShopifyStorefrontError(`Requ����te Storefront GraphQL ����chou����e (HTTP ${res.status}): ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new ShopifyStorefrontError("Erreurs GraphQL Storefront Shopify", json.errors);
  }
  return json.data as T;
}

// ---------------------------------------------------------------------------
// Fragment produit + mapping vers le type interne `Product`
// ---------------------------------------------------------------------------

// Mission "S������LECTION DE TAILLE" (15/08/2026) Ң��a����� champs communs ���� toutes les
// requ����tes catalogue (liste, recherche, recommandations) SANS la liste
// compl����te des variantes : charger jusqu'���� 250 variantes par produit sur une
// grille de 24 ���� 250 produits serait inutile (une grille n'affiche que
// `inStock`) et co����teux c����t���� quota API Shopify. `options` reste ici (l����ger :
// juste noms/valeurs, pas les variantes elles-m����mes) pour rester disponible
// partout sans co����t significatif.
const PRODUCT_FIELDS_BASE = `
  fragment ProductFieldsBase on Product {
    id
    handle
    title
    vendor
    tags
    description
    createdAt
    productType
    images(first: 8) { nodes { url altText } }
    priceRange { minVariantPrice { amount } }
    compareAtPriceRange { minVariantPrice { amount } }
    totalInventory
    options { name values }
    ratingValue: metafield(namespace: "reviews", key: "rating") { value }
    ratingCount: metafield(namespace: "reviews", key: "rating_count") { value }
    featuresMeta: metafield(namespace: "custom", key: "ondeal_features") { value }
    specsMeta: metafield(namespace: "custom", key: "ondeal_specs") { value }
  }
`;

// Fragment "l����ger" (grilles/listes/recherche/recommandations) : seule la
// premi����re variante est charg����e, uniquement pour d����river `inStock`.
const PRODUCT_FRAGMENT = `
  ${PRODUCT_FIELDS_BASE}
  fragment ProductFields on Product {
    ...ProductFieldsBase
    variants(first: 1) { nodes { id availableForSale } }
  }
`;

// Fragment "d����taill����" (fiche produit uniquement) : toutes les variantes avec
// leurs options s����lectionn����es, prix et disponibilit���� r����els Ң��a����� n����cessaire pour
// construire le s����lecteur de taille/couleur et r����soudre le bon
// `shopifyVariantId` ���� ajouter au panier. 250 = maximum autoris���� par
// connexion Shopify Storefront (catalogue r����el observ���� : jusqu'���� ~100+
// variantes sur certains produits couleur ����� taille, voir DECISIONS.md).
const PRODUCT_FRAGMENT_DETAILED = `
  ${PRODUCT_FIELDS_BASE}
  fragment ProductFieldsDetailed on Product {
    ...ProductFieldsBase
    variants(first: 250) {
      nodes {
        id
        title
        availableForSale
        price { amount }
        selectedOptions { name value }
        image { url }
      }
    }
  }
`;

interface StorefrontProductNode {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  tags: string[];
  description: string;
  descriptionHtml: string;
  createdAt: string;
  productType: string;
  images: { nodes: { url: string; altText: string | null }[] };
  priceRange: { minVariantPrice: { amount: string } };
  compareAtPriceRange: { minVariantPrice: { amount: string } };
  totalInventory: number | null;
  options: { name: string; values: string[] }[];
  variants: {
    nodes: {
      id: string;
      availableForSale: boolean;
      title?: string;
      price?: { amount: string };
      selectedOptions?: { name: string; value: string }[];
      image?: { url: string } | null;
    }[];
  };
  ratingValue: { value: string } | null;
  ratingCount: { value: string } | null;
  featuresMeta: { value: string } | null;
  specsMeta: { value: string } | null;
}

/**
 * Mission "FICHE PRODUIT Ң��a����� ONGLETS CARACT������RISTIQUES/INFOS TECHNIQUES"
 * (26/08/2026) : featuresMeta/specsMeta ci-dessus (metafields Admin API,
 * custom.ondeal_features / custom.ondeal_specs, storefront access
 * PUBLIC_READ) sont la vraie source des onglets "Caract����ristiques" et
 * "Informations techniques" de la fiche produit. Avant cette mission, ces
 * deux champs ����taient cod����s en dur ���� vide (aucune source de donn����es), ce qui
 * affichait ces deux sections syst����matiquement vides sur TOUS les produits.
 * Parsing d����fensif : jamais de crash rendu si une valeur est absente,
 * malform����e, ou d'un type inattendu Ң��a����� repli silencieux sur [] / {} (aucune
 * r����gression sur les produits dont les metafields n'ont pas encore ����t����
 * renseign����s).
 */
function parseFeatures(raw: string | null | undefined, descriptionHtml?: string | null): string[] {
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
      }
    } catch (_e) {}
  }
  if (!descriptionHtml) return [];
  const text = descriptionHtml.replace(/<h[1-6][^>]*>/gi,"\n").replace(/<\/h[1-6]>/gi,"\n").replace(/<br\s*\/?>/gi,"\n").replace(/<\/p>/gi,"\n").replace(/<\/li>/gi,"\n").replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ");
  return text.split("\n").map(l => l.trim()).filter(l => l.length > 3 && l.length < 120 && !l.includes("{")).slice(0, 8);
}

function parseSpecs(raw: string | null | undefined, descriptionHtml?: string | null): Record<string, string> {
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const out: Record<string, string> = {};
        for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
          if (typeof value === "string" && value.trim().length > 0) out[key] = value;
        }
        if (Object.keys(out).length > 0) return out;
      }
    } catch (_e) {}
  }
  if (!descriptionHtml) return {};
  const text = descriptionHtml.replace(/<h[1-6][^>]*>/gi,"\n").replace(/<\/h[1-6]>/gi,"\n").replace(/<br\s*\/?>/gi,"\n").replace(/<\/p>/gi,"\n").replace(/<\/li>/gi,"\n").replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ");
  const out: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    const match = trimmed.match(/^([A-Za-z\u00C0-\u00FF][^:]{1,40})\s*:\s*(.{1,150})$/);
    if (match && !match[1].includes("{") && match[2].trim().length > 0) out[match[1].trim()] = match[2].trim();
    if (Object.keys(out).length >= 10) break;
  }
  return out;
}

function parseShopifyRatingMetafieldValue(raw: string | undefined | null): number {
  if (!raw) return 0;
  try {
    const parsed = JSON.parse(raw);
    const value = Number(parsed?.value);
    return Number.isFinite(value) ? value : 0;
  } catch (_e) {
    const value = Number(raw);
    return Number.isFinite(value) ? value : 0;
  }
}

const TAG_TO_BADGE: Record<string, Product["badges"][number]> = {
  bestseller: "BESTSELLER",
  nouveau: "NOUVEAU",
  promotion: "PROMOTION",
  "top-vente": "TOP_VENTE",
  recommande: "RECOMMANDE",
  exclusivite: "EXCLUSIVITE",
};

/**
 * Convertit un produit Storefront Shopify vers le type `Product` interne
 * utilis���� par tous les composants existants (ProductCard, ProductGrid, etc.)
 * Ң��a����� permet de brancher Shopify sans r��������crire la couche d'affichage.
 */
function mapStorefrontProduct(node: StorefrontProductNode): Product {
  const price = Number(node.priceRange.minVariantPrice.amount);
  const compareAt = Number(node.compareAtPriceRange.minVariantPrice.amount || 0);
  const hasDiscount = compareAt > price;
  const inStock = node.variants.nodes[0]?.availableForSale ?? (node.totalInventory ?? 0) > 0;

  const badges = node.tags
    .map((tag) => TAG_TO_BADGE[tag.toLowerCase()])
    .filter((b): b is Product["badges"][number] => Boolean(b));
  if (!inStock) badges.push("RUPTURE_STOCK");

  return {
    id: node.id,
    slug: node.handle,
    title: node.title,
    // Le champ Shopify `vendor` contient, pour une grande partie du
    // catalogue, le nom du FOURNISSEUR d'approvisionnement r����el (ex.
    // "CJdropshipping", "SHENZHEN CANGYUAN TRADING CO., LTD.") plut����t qu'une
    // vraie marque produit Ң��a����� confidentiel, ne doit jamais appara����tre c����t����
    // client (r����gle explicite du fournisseur). "Ondeal" est utilis���� partout
    // ���� la place, quelle que soit la valeur r����elle de `vendor`.
    brand: "Ondeal",
    // categoryId provient du tag Shopify `cat-<id>` (voir
    // src/lib/catalog/category-mapping.ts Ң��a����� convention r����elle v����rifi����e sur
    // les produits d����j���� en catalogue le 12/08/2026 ; corrig���� depuis un
    // premier brouillon qui lisait ���� tort un metafield inexistant sur les
    // vraies donn����es, `custom.ondeal_category_id`, ce qui aurait rendu
    // TOUTE cat����gorisation invisible c����t���� storefront public).
    categoryId: node.tags.map(parseCategoryTag).find((id): id is string => id !== null) ?? UNCATEGORIZED,
    images: node.images.nodes.map((img) => img.url),
    price,
    oldPrice: hasDiscount ? compareAt : undefined,
    discount: hasDiscount ? Math.round(((compareAt - price) / compareAt) * 100) : undefined,
    rating: parseShopifyRatingMetafieldValue(node.ratingValue?.value),
    reviewsCount: node.ratingCount ? Number(node.ratingCount.value) : 0,
    stock: node.totalInventory ?? 0,
    inStock,
    badges,
    delivery: {
      fast: node.tags.includes("livraison-rapide"),
      freeShipping: node.tags.includes("livraison-offerte"),
      estimate: "2 à 7 jours ouvrés",
    },
    // M����me r����gle que `brand` ci-dessus : jamais le fournisseur r����el.
    seller: "Ondeal",
    description: node.description,
    features: parseFeatures(node.featuresMeta?.value, node.descriptionHtml),
    specifications: parseSpecs(node.specsMeta?.value, node.descriptionHtml),

    createdAt: node.createdAt,
    salesCount: 0,
    shopifyProductId: node.id,
    shopifyDefaultVariantId: node.variants.nodes[0]?.id,
    // Mission "S������LECTION DE TAILLE" (15/08/2026) Ң��a����� `node.options` inclut
    // syst����matiquement une option "Title"/"Default Title" sur les produits
    // Shopify sans variante r����elle (une seule variante implicite) : filtr����e
    // ici (jamais un vrai choix pour l'acheteur), le reste est conserv���� tel
    // quel, sans renommer/traduire les noms d'option r����els.
    options: node.options.filter((o) => o.name.toLowerCase() !== "title" && o.values.length > 1),
    // Seule la requ����te d����taill����e (fetchShopifyProductByHandle) demande
    // `selectedOptions`/`price`/`image` par variante Ң��a����� sur les autres
    // requ����tes (grilles), `node.variants.nodes[0].selectedOptions` est
    // `undefined` et `variants` reste absent du Product retourn���� (voir
    // filtre ci-dessous), pour ne jamais construire un s����lecteur de taille
    // avec des donn����es de variante incompl����tes.
    variants: node.variants.nodes[0]?.selectedOptions
      ? node.variants.nodes.map((v) => ({
          id: v.id,
          title: v.title ?? "",
          price: v.price ? Number(v.price.amount) : price,
          availableForSale: v.availableForSale,
          selectedOptions: v.selectedOptions ?? [],
          image: v.image?.url,
        }))
      : undefined,
    // Voir commentaire sur `tags` dans src/types/index.ts.
    tags: node.tags,
  };
}

// ---------------------------------------------------------------------------
// Requ����tes catalogue
// ---------------------------------------------------------------------------

interface ProductsQueryResponse {
  products: { nodes: StorefrontProductNode[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
}

export async function fetchShopifyProducts(options: {
  first?: number;
  after?: string | null;
  query?: string;
  sortKey?: "RELEVANCE" | "PRICE" | "BEST_SELLING" | "CREATED_AT";
  reverse?: boolean;
} = {}): Promise<{ products: Product[]; hasNextPage: boolean; endCursor: string | null }> {
  const data = await shopifyStorefrontGraphQL<ProductsQueryResponse>(
    `${PRODUCT_FRAGMENT}
    query Products($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
      products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
        nodes { ...ProductFields }
        pageInfo { hasNextPage endCursor }
      }
    }`,
    {
      first: options.first ?? 24,
      after: options.after ?? null,
      query: options.query,
      sortKey: options.sortKey ?? "RELEVANCE",
      reverse: options.reverse ?? false,
    }
  );

  return {
    products: data.products.nodes.map(mapStorefrontProduct),
    hasNextPage: data.products.pageInfo.hasNextPage,
    endCursor: data.products.pageInfo.endCursor,
  };
}

// Nombre maximal de pages (250 produits/page) r����cup����r����es par
// `fetchAllShopifyProducts` avant d'arr����ter la pagination par s����curit����
// (����vite une boucle de r����cup����ration illimit����e en cas de catalogue anormal).
// Relev���� le 15/08/2026 (mission "FINALISATION") : le catalogue r����el est
// pass���� de 1037 ���� 1192+ produits ACTIVE en quelques minutes pendant cette
// session (import fournisseur en cours) Ң��a����� 10 pages (2500) laissait une marge
// trop faible vu la trajectoire annonc����e (+1500 produits). Relev���� ���� 20 pages
// (5000 produits) pour absorber la croissance pr����vue sans troncature
// silencieuse.
const MAX_PAGINATION_PAGES = 20;

/**
 * R����cup����re TOUS les produits correspondant aux crit����res, en paginant tant
 * que Shopify indique `hasNextPage`, au lieu de se limiter ���� une seule page
 * de 250 (limite corrig����e le 13/08/2026 Ң��a����� voir reports/project-final-audit.md
 * section 15 #3 : les pages cat����gorie/catalogue tronquaient silencieusement
 * au-del���� de 250 produits).
 *
 * Correctif "FINALISATION" (15/08/2026) : sans `sortKey` explicite, Shopify
 * trie par d����faut par pertinence Ң��a����� un ordre pouvant se r����organiser entre deux
 * pages si le catalogue est modifi���� PENDANT la pagination (import fournisseur
 * en cours, observ���� r����ellement dans cette session : m����mes produits renvoy����s
 * deux fois sur deux pages diff����rentes). Un tri stable et monotone
 * (`CREATED_AT`, plus r����cent d'abord) ����vite ce r����ordonnancement en cours de
 * pagination ; les nouveaux produits cr��������s pendant l'appel apparaissent en
 * t����te (avant la page d����j���� r����cup����r����e) plut����t que de d����caler des produits d����j����
 * lus vers une autre page. Un d����doublonnage par id est conserv���� en filet de
 * s����curit����, y compris quand un `sortKey` explicite est fourni par l'appelant.
 */
export async function fetchAllShopifyProducts(options: {
  query?: string;
  sortKey?: "RELEVANCE" | "PRICE" | "BEST_SELLING" | "CREATED_AT";
  reverse?: boolean;
} = {}): Promise<Product[]> {
  const sortKey = options.sortKey ?? "CREATED_AT";
  const reverse = options.sortKey ? options.reverse : true;

  const all: Product[] = [];
  const seenIds = new Set<string>();
  let after: string | null = null;
  let page = 0;

  while (page < MAX_PAGINATION_PAGES) {
    const result: { products: Product[]; hasNextPage: boolean; endCursor: string | null } = await fetchShopifyProducts({
      first: 250,
      after,
      query: options.query,
      sortKey,
      reverse,
    });
    for (const product of result.products) {
      if (seenIds.has(product.id)) continue; // filet de s����curit���� anti-doublon
      seenIds.add(product.id);
      all.push(product);
    }
    page += 1;
    if (!result.hasNextPage) return all;
    after = result.endCursor;
  }

  console.warn(
    `[shopify/storefront] fetchAllShopifyProducts a atteint la limite de s����curit���� de ${MAX_PAGINATION_PAGES} pages ` +
      `(${all.length} produits) sans avoir ����puis���� le catalogue Shopify Ң��a����� des produits suppl����mentaires existent ` +
      `peut-����tre et ne sont pas retourn����s. Augmenter MAX_PAGINATION_PAGES si le catalogue a r����ellement d����pass���� cette taille.`
  );
  return all;
}

interface ProductByHandleResponse {
  product: StorefrontProductNode | null;
}

export async function fetchShopifyProductByHandle(handle: string): Promise<Product | null> {
  const data = await shopifyStorefrontGraphQL<ProductByHandleResponse>(
    `${PRODUCT_FRAGMENT_DETAILED}
    query ProductByHandle($handle: String!) {
      product(handle: $handle) { ...ProductFieldsDetailed }
    }`,
    { handle }
  );
  if (!data.product) return null;

  const product = mapStorefrontProduct(data.product);

  // BUG FIX (17/08/2026) Ң��a����� voir judgeme.ts pour le contexte complet : le
  // r����sum���� (note/nombre d'avis) vient du metafield agr����g���� Shopify, mais le
  // CONTENU d����taill���� des avis (auteur, texte) n'est disponible que via
  // l'API Judge.me. Uniquement sur la fiche produit d����taill����e (jamais sur
  // une grille) et uniquement si reviewsCount > 0 (����vite un appel r����seau
  // inutile sur les ~centaines de produits sans aucun avis publi����).
  if (product.reviewsCount > 0) {
    const numericId = product.shopifyProductId?.split("/").pop();
    if (numericId) {
      product.reviews = await fetchJudgemeProductReviews(numericId);
    }
  }

  return product;
}

interface ProductsByIdsResponse {
  nodes: (StorefrontProductNode | null)[];
}

/**
 * Mission "AUDIT PANIER/FAVORIS" (15/08/2026) Ң��a����� bug r����el d����couvert : la page
 * /wishlist reconstruisait ses produits en cherchant chaque `productId`
 * favori dans le jeu de donn����es fictif `@/data/products` (voir
 * useWishlist.ts, avant correction). Un `productId` r����el Shopify est un GID
 * (`gid://shopify/Product/...`), qui ne correspond ���� AUCUN id du jeu de
 * donn����es fictif (`prod-0`, `prod-1`...) Ң��a����� la recherche ����chouait donc
 * TOUJOURS en silence : un client ayant r����ellement ajout���� des favoris sur le
 * vrai catalogue voyait syst����matiquement "Vous n'avez pas encore ajout���� de
 * favoris", quel que soit le nombre d'articles r����ellement mis en favori
 * (confirm���� en inspectant le format des ids g����n����r����s par mapStorefrontProduct
 * ci-dessus vs celui de products.ts). Cette fonction r����cup����re les VRAIS
 * produits Shopify correspondant aux ids stock����s, en un seul appel API
 * (`nodes`), quel que soit leur nombre Ң��a����� jamais de re-fabrication de donn����es
 * produit ���� partir d'un simple id.
 */
export async function fetchShopifyProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const data = await shopifyStorefrontGraphQL<ProductsByIdsResponse>(
    `${PRODUCT_FRAGMENT}
    query ProductsByIds($ids: [ID!]!) {
      nodes(ids: $ids) { ...ProductFields }
    }`,
    { ids }
  );
  // Un id qui ne correspond plus ���� un produit publi���� (supprim����/d����publi����
  // depuis l'ajout aux favoris) renvoie `null` Ң��a����� filtr���� silencieusement,
  // jamais affich���� comme une erreur (comportement attendu, pas un bug).
  return data.nodes
    .filter((n): n is StorefrontProductNode => n !== null && "id" in n)
    .map(mapStorefrontProduct);
}

// Mission "BRANCHER SEARCH & DISCOVERY" (15/08/2026) Ң��a����� demande explicite du
// client de vraiment relier l'app Shopify "Search & Discovery" (d����j����
// install����e) au site. Deux usages concrets de la Storefront API, tous deux
// pilot����s par la configuration r����elle de cette app c����t���� Shopify Admin
// (synonymes, boosts, exclusions) :
// 1. `predictiveSearch` pour les suggestions de la barre de recherche
//    (remplace searchSuggestions() qui filtrait un jeu de donn����es fictif
//    @/data/products Ң��a����� jamais de vrais produits Shopify, voir searchService.ts).
// 2. `productRecommendations` pour les sections "Produits similaires" /
//    "Achet����s ensemble" de la fiche produit (remplace une requ����te par tag de
//    cat����gorie approximative par le vrai moteur de recommandation Shopify).

interface PredictiveSearchResponse {
  predictiveSearch: { products: StorefrontProductNode[] } | null;
}

/** Suggestions de recherche en temps r����el Ң��a����� vrai moteur Shopify (Search & Discovery), jamais de donn����es fictives. */
export async function fetchShopifyPredictiveSearchProducts(query: string, limit = 6): Promise<Product[]> {
  if (!query.trim()) return [];
  const data = await shopifyStorefrontGraphQL<PredictiveSearchResponse>(
    `${PRODUCT_FRAGMENT}
    query PredictiveSearchProducts($query: String!, $limit: Int!) {
      predictiveSearch(query: $query, limit: $limit, types: [PRODUCT]) {
        products { ...ProductFields }
      }
    }`,
    { query, limit }
    // Pas de noStore ici : donn����es catalogue publiques (comme fetchShopifyProducts),
    // pas personnelles Ң��a����� le cache 60s par d����faut de shopifyStorefrontGraphQL s'applique.
  );
  return (data.predictiveSearch?.products ?? []).map(mapStorefrontProduct);
}

interface ProductRecommendationsResponse {
  productRecommendations: StorefrontProductNode[] | null;
}

/** Recommandations r����elles Shopify ("Search & Discovery") pour une fiche produit. */
export async function fetchShopifyProductRecommendations(
  productId: string,
  intent: "RELATED" | "COMPLEMENTARY" = "RELATED"
): Promise<Product[]> {
  const data = await shopifyStorefrontGraphQL<ProductRecommendationsResponse>(
    `${PRODUCT_FRAGMENT}
    query ProductRecommendations($productId: ID!, $intent: ProductRecommendationIntent!) {
      productRecommendations(productId: $productId, intent: $intent) { ...ProductFields }
    }`,
    { productId, intent }
    // Pas de noStore : donn����es catalogue publiques, cache 60s par d����faut.
  );
  return (data.productRecommendations ?? []).map(mapStorefrontProduct);
}

export { isShopifyPublicConfigured };

