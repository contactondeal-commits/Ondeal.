"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Heart, ShoppingCart, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useProductSelection } from "./ProductSelectionProvider";
import VariantSelector from "./VariantSelector";
import type { Product } from "@/types";
import styles from "./AddToCartPanel.module.css";

export default function AddToCartPanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const router = useRouter();
  const inWishlist = isInWishlist(product.id);
  // Mission "SÉLECTION DE TAILLE" (15/08/2026) — voir ProductSelectionProvider :
  // tant qu'un produit à variantes (taille, couleur…) n'a pas de sélection
  // complète, on n'ajoute JAMAIS une variante arbitraire au panier.
  const { requiresSelection, isSelectionComplete, selectedVariant } = useProductSelection();
  // BUG FIX (02/09/2026) — voir mapStorefrontProduct (storefront.ts) pour la
  // cause racine corrigée côté `product.inStock` (n'utilisait que la 1ère
  // variante). Correctif complémentaire ici : une fois une variante précise
  // résolue (`selectedVariant`, via ProductSelectionProvider), c'est SA
  // propre disponibilité qui doit décider — jamais l'agrégat produit. Sans
  // ce correctif, un produit avec au moins une variante en stock aurait
  // `product.inStock === true`, ce qui aurait permis d'ajouter au panier
  // une variante précisément sélectionnée mais elle-même épuisée. Ne se
  // rabat sur `product.inStock` que si aucune variante n'est encore
  // résolue (ex. produit sans variante réelle du tout).
  const canAddToCart = isSelectionComplete && (selectedVariant ? selectedVariant.availableForSale : product.inStock);

  function handleBuyNow() {
    if (!isSelectionComplete) return;
    // BUG FIX (02/09/2026) — garde de sécurité en profondeur, même logique
    // que `canAddToCart` ci-dessus : n'achète jamais une variante résolue
    // mais elle-même non disponible.
    if (selectedVariant ? !selectedVariant.availableForSale : !product.inStock) return;
    addToCart(product, quantity, selectedVariant);
    router.push("/cart");
  }

  return (
    <div className={styles.root}>
      <VariantSelector />

      {requiresSelection && !isSelectionComplete && (
        <p className={styles.selectionHint} role="status">
          Choisissez {product.options?.map((o) => o.name.toLowerCase()).join(" et ")} avant d&rsquo;ajouter au panier.
        </p>
      )}

      <div className={styles.quantityRow}>
        <span>Quantité</span>
        <div className={styles.stepper}>
          <button
            type="button"
            aria-label="Diminuer la quantité"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Minus size={14} />
          </button>
          <span aria-live="polite">{quantity}</span>
          <button
            type="button"
            aria-label="Augmenter la quantité"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          disabled={!canAddToCart}
          onClick={() => addToCart(product, quantity, selectedVariant)}
        >
          <ShoppingCart size={18} /> Ajouter au panier
        </Button>
        <Button variant="primary" size="lg" fullWidth disabled={!canAddToCart} onClick={handleBuyNow}>
          <Zap size={18} /> Acheter maintenant
        </Button>
      </div>

      <button
        type="button"
        className={`${styles.wishlistLink} ${inWishlist ? styles.wishlistActive : ""}`}
        onClick={() => toggleWishlist(product.id)}
        aria-pressed={inWishlist}
      >
        <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
        {inWishlist ? "Retiré des favoris" : "Ajouter aux favoris"}
      </button>
    </div>
  );
}
