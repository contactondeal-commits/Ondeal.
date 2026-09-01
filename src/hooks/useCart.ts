"use client";

import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import type { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/lib/format";
import { fireGoogleAdsConversion } from "@/lib/analytics/googleAds";

export interface CartLineDetail {
  lineId: string;
  productId: string;
  quantity: number;
  title: string;
  price: number;
  image: string;
  slug: string;
  shopifyVariantId?: string;
  variantLabel?: string;
}

export function useCart() {
  const items = useCartStore((s) => s.items);
  const storeAddToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const addToast = useToastStore((s) => s.addToast);

  /**
   * Mission CRO Phase 1 (2026-08-13) — P1-1 : `addToCart` déclenche
   * désormais une confirmation visuelle (toast) en plus d'ajouter le
   * produit au panier. La logique Shopify Cart API (`shopifyVariantId`,
   * checkout) n'est pas modifiée — seul un retour visuel local est ajouté
   * autour de l'appel existant.
   */
  function addToCart(product: Product, quantity = 1, selectedVariant?: ProductVariant) {
    storeAddToCart(product, quantity, selectedVariant);
    const price = selectedVariant?.price ?? product.price;
    addToast({
      title: "Ajouté au panier",
      message: `${product.title} × ${quantity} — ${formatPrice(price * quantity)}`,
      href: "/cart",
      hrefLabel: "Voir le panier",
    });
    fireGoogleAdsConversion("addToCart", { value: price * quantity });
  }

  const detailedItems: CartLineDetail[] = items.map((item) => ({
    lineId: item.lineId,
    productId: item.productId,
    quantity: item.quantity,
    title: item.snapshot.title,
    price: item.snapshot.price,
    image: item.snapshot.image,
    slug: item.snapshot.slug,
    shopifyVariantId: item.snapshot.shopifyVariantId,
    variantLabel: item.snapshot.variantLabel,
  }));

  const subtotal = detailedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items: detailedItems, count, subtotal, addToCart, removeFromCart, updateQuantity, clearCart };
}
