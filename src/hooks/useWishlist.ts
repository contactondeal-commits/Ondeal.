"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { fetchWishlistProducts } from "@/app/actions/wishlist";
import type { Product } from "@/types";

/**
 * Mission "AUDIT PANIER/FAVORIS" (15/08/2026) — bug réel corrigé : cette
 * fonction reconstruisait `items` en cherchant chaque `productId` favori dans
 * le jeu de données FICTIF `@/data/products` (`prod-0`, `prod-1`...). Un
 * `productId` réel Shopify est un GID (`gid://shopify/Product/...`), qui ne
 * correspond à AUCUN id du jeu de données fictif — la recherche échouait donc
 * TOUJOURS en silence, quel que soit le nombre réel de favoris du client (voir
 * fetchShopifyProductsByIds dans src/lib/shopify/storefront.ts pour le détail
 * complet). Corrigé en récupérant les VRAIS produits Shopify via une Server
 * Action (fetchWishlistProducts), de façon asynchrone — `items`/`loading`
 * remplacent l'ancien retour synchrone.
 */
export function useWishlist() {
  const productIds = useWishlistStore((s) => s.productIds);
  const addToWishlist = useWishlistStore((s) => s.addToWishlist);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (productIds.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchWishlistProducts(productIds)
      .then((products) => {
        if (!cancelled) setItems(products);
      })
      .catch(() => {
        // Filet de sécurité : en cas d'erreur réseau/API, on affiche une
        // liste vide plutôt qu'un plantage — jamais de produit inventé.
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIds.join(",")]);

  return { items, count: productIds.length, loading, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist };
}
