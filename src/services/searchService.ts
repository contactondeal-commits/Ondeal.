"use server";

// Corrigé le 15/08/2026 : ce fichier est importé et appelé directement depuis
// SearchBar.tsx, un Client Component — sans "use server", il était packagé
// TEL QUEL dans le bundle navigateur. `isShopifyPublicConfigured()` et
// `fetchShopifyPredictiveSearchProducts()` dépendent de variables
// d'environnement serveur (jamais définies côté navigateur) : exécutées dans
// le navigateur, `isShopifyPublicConfigured()` renvoyait donc silencieusement
// `false`, et la recherche retombait sur le petit jeu de données fictif
// @/data/products SANS AUCUNE ERREUR VISIBLE — un client tapant "sandale"
// (produit bien réel du catalogue, vérifié) voyait "Aucun résultat", alors
// que le vrai catalogue Shopify en contient plusieurs. `"use server"` force
// désormais ces fonctions à s'exécuter comme de vraies Server Actions
// (même mécanisme que createShopifyCheckout, voir shopify-checkout.ts) :
// le code ne quitte jamais le serveur, les variables d'environnement sont
// donc toujours correctement disponibles.

import { products } from "@/data/products";
import { getAllCategoriesFlat } from "@/data/categories";
import { fetchShopifyPredictiveSearchProducts } from "@/lib/shopify/storefront";
import { isShopifyPublicConfigured } from "@/lib/shopify/config";
import type { Product, SearchSuggestion } from "@/types";

const USE_SHOPIFY = isShopifyPublicConfigured();

const POPULAR_SEARCHES = [
  "smartphone", "casque bluetooth", "chaussures running", "canapé d'angle",
  "pc portable", "montre connectée", "jeux de société", "sac à main cuir",
];

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = normalize(query.trim());
  if (!q) return [];
  if (USE_SHOPIFY) {
    return fetchShopifyPredictiveSearchProducts(query, 24);
  }
  return products.filter(
    (p) => normalize(p.title).includes(q) || normalize(p.brand).includes(q) || normalize(p.description).includes(q)
  );
}

// Mission "BRANCHER SEARCH & DISCOVERY" (15/08/2026) — ces suggestions
// (dropdown affiché pendant la frappe dans la barre de recherche) filtraient
// auparavant TOUJOURS le jeu de données fictif @/data/products, y compris en
// production avec le vrai catalogue Shopify branché : un client tapant le nom
// d'un vrai produit ne le voyait donc jamais apparaître dans les suggestions
// (seul /search, la page de résultats après validation, utilisait déjà le
// vrai catalogue). Utilise maintenant `predictiveSearch`, le vrai moteur de
// suggestion Shopify (piloté par l'app "Search & Discovery" déjà installée :
// synonymes, boosts, exclusions configurés côté Shopify Admin s'appliquent
// ici automatiquement).
export async function searchSuggestions(query: string): Promise<SearchSuggestion> {
  const q = normalize(query.trim());
  if (!q) {
    return { products: [], categories: [], popularSearches: POPULAR_SEARCHES.slice(0, 5) };
  }

  const matchedCategories = getAllCategoriesFlat()
    .filter((c) => normalize(c.name).includes(q))
    .slice(0, 4)
    .map(({ id, name, slug }) => ({ id, name, slug }));

  const popularSearches = POPULAR_SEARCHES.filter((s) => normalize(s).includes(q)).slice(0, 4);

  let matchedProducts: SearchSuggestion["products"];
  if (USE_SHOPIFY) {
    const shopifyProducts = await fetchShopifyPredictiveSearchProducts(query.trim(), 6);
    matchedProducts = shopifyProducts.map(({ id, slug, title, images, price }) => ({ id, slug, title, images, price }));
  } else {
    matchedProducts = products
      .filter((p) => normalize(p.title).includes(q) || normalize(p.brand).includes(q))
      .slice(0, 6)
      .map(({ id, slug, title, images, price }) => ({ id, slug, title, images, price }));
  }

  return { products: matchedProducts, categories: matchedCategories, popularSearches };
}
