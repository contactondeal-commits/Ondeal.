"use client";

import { Heart } from "lucide-react";
import ProductGrid from "@/components/products/ProductGrid";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div>
      <h1>Mes favoris</h1>
      {items.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "60px 20px", color: "var(--color-text-muted)", textAlign: "center" }}>
          <Heart size={40} strokeWidth={1.4} />
          <p>Vous n&apos;avez pas encore ajouté de favoris.</p>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  );
}
