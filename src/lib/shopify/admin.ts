import { SHOPIFY_API_VERSION, getShopifyDomain } from "./config";

/**
 * Client Admin GraphQL Shopify — réservé aux opérations d'administration
 * (import/synchronisation catalogue CJ → Shopify, audit ACTIVE/ARCHIVED).
 *
 * JAMAIS utilisé pour le catalogue public — le frontend public passe
 * exclusivement par src/lib/shopify/storefront.ts (Storefront API). Ce
 * module n'est importé nulle part sous src/app/ ou src/components/ — voir
 * scripts/*.ts pour ses seuls appelants.
 *
 * CREDENTIAL REQUIS : SHOPIFY_ADMIN_ACCESS_TOKEN (token d'app privée/custom
 * app Shopify avec les scopes `read_products`, `write_products`).
 * À générer depuis : Shopify Admin > Paramètres > Apps et canaux de vente >
 * Développer des apps > créer une app > Configurer l'API Admin > scopes
 * read_products/write_products > Installer l'app > "Révéler le token".
 *
 * Ce module a un accès complet en écriture au catalogue et ne doit jamais
 * atteindre le navigateur. Pas de marqueur `import "server-only"` ici
 * volontairement : ce module est aussi exécuté en Node pur via `tsx` par les
 * scripts CLI (npm run catalog:*), hors du bundler Next.js où `server-only`
 * fonctionne. La protection réelle reste native à Next.js : ce token n'est
 * jamais préfixé `NEXT_PUBLIC_`, donc il vaut `undefined` dans tout bundle
 * client, quel que soit le fichier qui l'importerait par erreur.
 */

export class ShopifyAdminError extends Error {
  constructor(
    message: string,
    public readonly errors?: unknown
  ) {
    super(message);
  }
}

function getAdminToken(): string {
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "SHOPIFY_ADMIN_ACCESS_TOKEN manquant. Voir .env.example et docs/SHOPIFY_INTEGRATION.md " +
        "pour la procédure de génération du token (app privée Shopify)."
    );
  }
  return token;
}

export async function shopifyAdminGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const domain = getShopifyDomain();
  const token = getAdminToken();

  const res = await fetch(`https://${domain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ShopifyAdminError(`Requête Admin GraphQL échouée (HTTP ${res.status}): ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new ShopifyAdminError("Erreurs GraphQL Admin Shopify", json.errors);
  }
  return json.data as T;
}

// ---------------------------------------------------------------------------
// Audit ACTIVE vs ARCHIVED
// ---------------------------------------------------------------------------

interface ProductCountResponse {
  productsCount: { count: number };
}

/** Nombre de produits ayant le statut donné ("ACTIVE", "ARCHIVED", "DRAFT"). */
export async function countProductsByStatus(status: "ACTIVE" | "ARCHIVED" | "DRAFT"): Promise<number> {
  const data = await shopifyAdminGraphQL<ProductCountResponse>(
    `query CountByStatus($query: String!) {
      productsCount(query: $query) { count }
    }`,
    { query: `status:${status.toLowerCase()}` }
  );
  return data.productsCount.count;
}

interface ProductPageResponse {
  products: {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
    nodes: Array<{
      id: string;
      handle: string;
      title: string;
      status: string;
      tags: string[];
      productType: string;
      vendor: string;
      description: string;
      variants: { nodes: Array<{ sku: string | null }> };
      metafield: { value: string } | null;
    }>;
  };
}

export interface ShopifyProductSummary {
  id: string;
  handle: string;
  title: string;
  status: string;
  tags: string[];
  /** Champ Shopify "Type de produit" — souvent "0" ou vide sur le catalogue legacy, voir mission catégorisation. */
  productType: string;
  vendor: string;
  /** Description en texte brut (HTML dépouillé côté API `description`, pas `descriptionHtml`). */
  description: string;
  skus: string[];
  cjProductId: string | null;
}

/**
 * Liste paginée des produits Shopify filtrés par statut, avec leur metafield
 * `custom.cj_product_id` (utilisé pour la détection de doublons CJ → Shopify)
 * et les champs nécessaires à la catégorisation multi-signaux (titre,
 * description, tags, productType, vendor, SKU — voir mission catégorisation
 * et src/lib/catalog/product-categorizer.ts).
 * IMPORTANT : appeler explicitement avec status:"ACTIVE" pour toute logique
 * catalogue — ne jamais requêter/traiter les produits "ARCHIVED" en dehors de
 * l'audit en lecture seule (task #67 / rapport #73).
 */
export async function listProductsByStatus(
  status: "ACTIVE" | "ARCHIVED" | "DRAFT",
  cursor: string | null = null
): Promise<{ products: ShopifyProductSummary[]; hasNextPage: boolean; endCursor: string | null }> {
  const data = await shopifyAdminGraphQL<ProductPageResponse>(
    `query ProductsByStatus($query: String!, $cursor: String) {
      products(first: 100, after: $cursor, query: $query) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          handle
          title
          status
          tags
          productType
          vendor
          description
          variants(first: 25) { nodes { sku } }
          metafield(namespace: "custom", key: "cj_product_id") { value }
        }
      }
    }`,
    { query: `status:${status.toLowerCase()}`, cursor }
  );

  return {
    products: data.products.nodes.map((p) => ({
      id: p.id,
      handle: p.handle,
      title: p.title,
      status: p.status,
      tags: p.tags,
      productType: p.productType,
      vendor: p.vendor,
      description: p.description,
      skus: p.variants.nodes.map((v) => v.sku).filter((s): s is string => Boolean(s)),
      cjProductId: p.metafield?.value ?? null,
    })),
    hasNextPage: data.products.pageInfo.hasNextPage,
    endCursor: data.products.pageInfo.endCursor,
  };
}

// ---------------------------------------------------------------------------
// Création / mise à jour produit (import CJ → Shopify)
// ---------------------------------------------------------------------------

export interface NewShopifyVariantInput {
  /**
   * Valeurs d'option identifiant cette variante, ex: [{ optionName: "Variante", name: "Rouge / L" }].
   * Doit couvrir toutes les options déclarées côté produit (voir `productOptions` généré
   * automatiquement à partir de l'union de ces valeurs dans `createProductFromCJ`).
   */
  optionValues: { optionName: string; name: string }[];
  price: string;
  sku: string;
  compareAtPrice?: string;
  barcode?: string;
  inventoryQuantity?: number;
}

export interface NewShopifyProductInput {
  title: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  status: "DRAFT" | "ACTIVE";
  images: { src: string; altText?: string }[];
  variants: NewShopifyVariantInput[];
  /** Métadonnées fournisseur — voir mission "MÉTADONNÉES FOURNISSEUR". Stockées en metafields, non affichées au client. */
  supplierMetafields: {
    supplier: "CJdropshipping";
    cjProductId: string;
    cjVariantId?: string;
    supplierSku: string;
    supplierPrice: string;
    warehouse?: string;
    shippingInformation?: string;
    lastSync: string;
  };
}

interface ProductSetResponse {
  productSet: {
    product: { id: string; handle: string } | null;
    userErrors: { field: string[]; message: string }[];
  };
}

/**
 * Crée un produit Shopify à partir d'une sélection CJ, par défaut en statut
 * DRAFT (voir AUTO_PUBLISH_CJ_PRODUCTS dans .env.example — false par défaut).
 * Les infos fournisseur (cj_product_id, etc.) sont stockées en metafields
 * `custom.*`, invisibles côté storefront public sauf exposition explicite.
 *
 * IMPORTANT (vérifié le 12/08/2026 via introspection réelle du schéma Admin
 * GraphQL 2026-07 + doc officielle shopify.dev) : `productCreate` avec un
 * champ `variants` imbriqué dans `ProductInput` ne fonctionne plus dans cette
 * version de l'API. La mutation correcte pour créer un produit AVEC ses
 * options et variantes en un seul appel est `productSet`, avec
 * `ProductSetInput.productOptions` (déclaration des options) et
 * `ProductSetInput.variants[].optionValues` (rattachement de chaque variante
 * à une combinaison de valeurs d'option). Les images passent par
 * `ProductSetInput.files` (FileSetInput.originalSource = URL externe).
 */
export function buildProductSetInput(input: NewShopifyProductInput): Record<string, unknown> {
  if (input.variants.length === 0) {
    throw new ShopifyAdminError("createProductFromCJ appelé sans variante — au moins une variante est requise.");
  }

  // Déduit dynamiquement les options du produit (nom + valeurs uniques,
  // dans l'ordre d'apparition) à partir des `optionValues` fournis par
  // chaque variante — jamais codé en dur, s'adapte au nombre réel d'options
  // CJ (ex: une seule option "Variante", ou "Couleur" + "Taille").
  const optionOrder: string[] = [];
  const optionValuesByName = new Map<string, string[]>();
  for (const variant of input.variants) {
    for (const ov of variant.optionValues) {
      if (!optionValuesByName.has(ov.optionName)) {
        optionOrder.push(ov.optionName);
        optionValuesByName.set(ov.optionName, []);
      }
      const values = optionValuesByName.get(ov.optionName)!;
      if (!values.includes(ov.name)) values.push(ov.name);
    }
  }
  const productOptions = optionOrder.map((name, position) => ({
    name,
    position: position + 1,
    values: optionValuesByName.get(name)!.map((v) => ({ name: v })),
  }));

  const locationId = process.env.SHOPIFY_LOCATION_ID;

  return {
    title: input.title,
    descriptionHtml: input.descriptionHtml,
    vendor: input.vendor,
    productType: input.productType,
    tags: input.tags,
    status: input.status,
    productOptions,
    files: input.images.map((img) => ({
      originalSource: img.src,
      alt: img.altText,
      contentType: "IMAGE",
    })),
    variants: input.variants.map((v) => ({
      optionValues: v.optionValues.map((ov) => ({ optionName: ov.optionName, name: ov.name })),
      price: v.price,
      sku: v.sku,
      compareAtPrice: v.compareAtPrice,
      barcode: v.barcode,
      inventoryQuantities:
        v.inventoryQuantity !== undefined && locationId
          ? [{ locationId, name: "available", quantity: v.inventoryQuantity }]
          : undefined,
    })),
    metafields: [
      { namespace: "custom", key: "supplier", type: "single_line_text_field", value: input.supplierMetafields.supplier },
      { namespace: "custom", key: "cj_product_id", type: "single_line_text_field", value: input.supplierMetafields.cjProductId },
      input.supplierMetafields.cjVariantId
        ? { namespace: "custom", key: "cj_variant_id", type: "single_line_text_field", value: input.supplierMetafields.cjVariantId }
        : null,
      { namespace: "custom", key: "supplier_sku", type: "single_line_text_field", value: input.supplierMetafields.supplierSku },
      { namespace: "custom", key: "supplier_price", type: "single_line_text_field", value: input.supplierMetafields.supplierPrice },
      input.supplierMetafields.warehouse
        ? { namespace: "custom", key: "warehouse", type: "single_line_text_field", value: input.supplierMetafields.warehouse }
        : null,
      input.supplierMetafields.shippingInformation
        ? { namespace: "custom", key: "shipping_information", type: "multi_line_text_field", value: input.supplierMetafields.shippingInformation }
        : null,
      { namespace: "custom", key: "last_sync", type: "date_time", value: input.supplierMetafields.lastSync },
    ].filter(Boolean),
  };
}

/**
 * Crée un produit Shopify à partir d'une sélection CJ, par défaut en statut
 * DRAFT (voir AUTO_PUBLISH_CJ_PRODUCTS dans .env.example — false par défaut).
 * Les infos fournisseur (cj_product_id, etc.) sont stockées en metafields
 * `custom.*`, invisibles côté storefront public sauf exposition explicite.
 *
 * IMPORTANT (vérifié le 12/08/2026 via introspection réelle du schéma Admin
 * GraphQL 2026-07 + doc officielle shopify.dev) : `productCreate` avec un
 * champ `variants` imbriqué dans `ProductInput` ne fonctionne plus dans cette
 * version de l'API. La mutation correcte pour créer un produit AVEC ses
 * options et variantes en un seul appel est `productSet`, avec
 * `ProductSetInput.productOptions` (déclaration des options) et
 * `ProductSetInput.variants[].optionValues` (rattachement de chaque variante
 * à une combinaison de valeurs d'option). Les images passent par
 * `ProductSetInput.files` (FileSetInput.originalSource = URL externe).
 */
export async function createProductFromCJ(input: NewShopifyProductInput): Promise<{ id: string; handle: string }> {
  const data = await shopifyAdminGraphQL<ProductSetResponse>(
    `mutation SetProduct($input: ProductSetInput!, $synchronous: Boolean!) {
      productSet(input: $input, synchronous: $synchronous) {
        product { id handle }
        userErrors { field message }
      }
    }`,
    {
      synchronous: true,
      input: buildProductSetInput(input),
    }
  );

  const { product, userErrors } = data.productSet;
  if (userErrors.length > 0 || !product) {
    throw new ShopifyAdminError(`Échec de création produit Shopify : ${userErrors.map((e) => e.message).join(", ")}`, userErrors);
  }
  return product;
}

/**
 * Recherche un produit Shopify existant par son identifiant CJ (metafield
 * `custom.cj_product_id`) — utilisé pour l'idempotence de la synchronisation
 * (ne jamais recréer un produit déjà importé).
 */
export async function findProductByCJId(cjProductId: string): Promise<{ id: string; handle: string } | null> {
  const data = await shopifyAdminGraphQL<{
    products: { nodes: { id: string; handle: string }[] };
  }>(
    `query FindByCJId($query: String!) {
      products(first: 1, query: $query) { nodes { id handle } }
    }`,
    { query: `metafield:custom.cj_product_id:${cjProductId}` }
  );
  return data.products.nodes[0] ?? null;
}

interface ProductUpdateResponse {
  productUpdate: {
    product: { id: string } | null;
    userErrors: { field: string[]; message: string }[];
  };
}

/** Met à jour un produit existant (stock/prix/statut) — synchronisation idempotente CJ → Shopify. */
export async function updateProductSync(
  productId: string,
  patch: { status?: "DRAFT" | "ACTIVE"; tags?: string[] }
): Promise<void> {
  const data = await shopifyAdminGraphQL<ProductUpdateResponse>(
    `mutation UpdateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product { id }
        userErrors { field message }
      }
    }`,
    { input: { id: productId, ...patch } }
  );
  if (data.productUpdate.userErrors.length > 0) {
    throw new ShopifyAdminError(
      `Échec de mise à jour produit Shopify : ${data.productUpdate.userErrors.map((e) => e.message).join(", ")}`
    );
  }
}
