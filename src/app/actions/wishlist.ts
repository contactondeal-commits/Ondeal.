"use server";

import { fetchProductsByIds } from "@/services/productService";
import type { Product } from "@/types";

// Mission "AUDIT PANIER/FAVORIS" (15/08/2026) — voir fetchShopifyProductsByIds
// dans src/lib/shopify/storefront.ts pour le détail complet du bug corrigé :
// /wishlist cherchait les produits favoris dans le jeu de données de
// démonstration au lieu du vrai catalogue Shopify, ce qui faisait toujours
// échouer silencieusement (page favoris vide quel que soit le nombre réel de
// favoris du client). Cette Server Action est le pont "use client" → Shopify,
// suivant le même modèle que shopify-checkout.ts et searchService.ts (le
// composant client /wishlist n'a jamais accès direct aux identifiants
// Shopify côté serveur).
//
// Validation défensive (même esprit que shopify-checkout.ts, section 17 de
// l'audit sécurité du 15/08/2026) : une Server Action est un point d'entrée
// public, appelable avec n'importe quelle donnée hors de l'UI normale. On
// borne donc la taille du tableau et on ne garde que des chaînes non vides —
// jamais bloquant pour un usage normal (le store wishlist local ne contient
// que des ids réels ajoutés via l'UI), uniquement un filet contre un appel
// malformé ou hostile.
const MAX_WISHLIST_IDS = 200;

export async function fetchWishlistProducts(ids: unknown): Promise<Product[]> {
  if (!Array.isArray(ids)) return [];
  const validIds = ids.filter((id): id is string => typeof id === "string" && id.length > 0).slice(0, MAX_WISHLIST_IDS);
  if (validIds.length === 0) return [];
  return fetchProductsByIds(validIds);
}
