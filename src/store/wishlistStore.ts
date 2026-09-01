"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      addToWishlist: (productId) =>
        set((state) =>
          state.productIds.includes(productId) ? state : { productIds: [...state.productIds, productId] }
        ),
      removeFromWishlist: (productId) =>
        set((state) => ({ productIds: state.productIds.filter((id) => id !== productId) })),
      isInWishlist: (productId) => get().productIds.includes(productId),
      toggleWishlist: (productId) => {
        const inList = get().productIds.includes(productId);
        if (inList) get().removeFromWishlist(productId);
        else get().addToWishlist(productId);
      },
    }),
    { name: "ondeal-wishlist" }
  )
);
