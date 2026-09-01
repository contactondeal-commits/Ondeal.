"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductVariant } from "@/types";

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariant?: ProductVariant) => void;
  removeFromCart: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

// Mission "SÉLECTION DE TAILLE" (15/08/2026) — une ligne panier est identifiée
// par productId + variante choisie (voir types/index.ts `CartItem.lineId`) :
// deux tailles du même produit sont deux lignes distinctes.
function computeLineId(productId: string, variantId: string | undefined): string {
  return variantId ? `${productId}::${variantId}` : productId;
}

// Persistance localStorage pour le prototype (à remplacer par une synchronisation
// serveur/API une fois le backend connecté). Le panier stocke un instantané
// dénormalisé de chaque produit (voir types/index.ts `CartItem.snapshot`) afin
// de fonctionner indifféremment avec les données mock ou le catalogue Shopify.
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, quantity = 1, selectedVariant) =>
        set((state) => {
          const variantId = selectedVariant?.id ?? product.shopifyDefaultVariantId;
          const lineId = computeLineId(product.id, variantId);
          const existing = state.items.find((i) => i.lineId === lineId);
          if (existing) {
            return {
              items: state.items.map((i) => (i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i)),
            };
          }
          const variantLabel = selectedVariant?.selectedOptions.length
            ? selectedVariant.selectedOptions.map((o) => `${o.name} : ${o.value}`).join(" / ")
            : undefined;
          const item: CartItem = {
            lineId,
            productId: product.id,
            quantity,
            snapshot: {
              title: product.title,
              // Prix réel de LA VARIANTE choisie quand il diffère du prix
              // affiché sur la carte produit (min du priceRange) — jamais
              // un prix recalculé/deviné.
              price: selectedVariant?.price ?? product.price,
              image: selectedVariant?.image ?? product.images[0] ?? "",
              slug: product.slug,
              shopifyVariantId: variantId,
              variantLabel,
            },
          };
          return { items: [...state.items, item] };
        }),
      removeFromCart: (lineId) => set((state) => ({ items: state.items.filter((i) => i.lineId !== lineId) })),
      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.lineId !== lineId)
              : state.items.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
      getCartTotal: () => get().items.reduce((sum, item) => sum + item.snapshot.price * item.quantity, 0),
      getCartCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "ondeal-cart",
      // v1 → v2 (mission "SÉLECTION DE TAILLE") : les lignes panier existantes
      // (avant l'introduction de `lineId`) n'ont pas ce champ — reconstruit à
      // l'identique de leur ancien comportement (une ligne = un productId,
      // sans distinction de variante), pour ne pas vider le panier des
      // acheteurs en cours de navigation lors du déploiement.
      version: 2,
      migrate: (persisted) => {
        const state = persisted as { items?: Array<Partial<CartItem> & { productId: string }> };
        return {
          items: (state.items ?? []).map((i) => ({
            ...i,
            lineId: i.lineId ?? i.productId,
          })),
        };
      },
    }
  )
);
