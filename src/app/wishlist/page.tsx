"use client";

import { Heart } from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";
import { useWishlist } from "@/hooks/useWishlist";
import styles from "./page.module.css";

// Déplacé le 15/08/2026 depuis /account/wishlist (mission "CONNEXION
// CLIENT") : les favoris sont stockés localement (voir useWishlist /
// wishlistStore, aucun lien avec le compte client Shopify), donc ils
// n'ont jamais eu besoin d'être derrière la connexion — ils se
// retrouvaient là uniquement parce que /account/* était le seul endroit
// où ce genre de page existait. Maintenant que /account/* redirige vers
// le portail natif Shopify (voir SHOPIFY_ACCOUNT_URL, site-config.ts), les
// favoris ont leur propre route top-level, accessible sans connexion,
// comme avant.
export default function WishlistPage() {
  const { items, loading } = useWishlist();

  return (
    <div className={`${styles.page} container`}>
      <h1>Mes favoris</h1>
      {!loading && items.length === 0 ? (
        <div className={styles.empty}>
          <Heart size={44} strokeWidth={1.4} />
          <p>Vous n&apos;avez pas encore ajouté de favoris.</p>
        </div>
      ) : (
        <ProductGrid products={items} loading={loading} />
      )}
    </div>
  );
}
