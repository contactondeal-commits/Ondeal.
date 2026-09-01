"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { useCart, type CartLineDetail } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useLocation } from "@/context/LocationContext";
import styles from "./CartItem.module.css";

interface CartItemProps {
  item: CartLineDetail;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useLocation();
  const { lineId, productId, quantity, title, price, image, slug, variantLabel } = item;

  return (
    <div className={styles.row}>
      <Link href={`/product/${slug}`} className={styles.imageLink}>
        <PlaceholderImage seed={image} className={styles.image} label={title} />
      </Link>

      <div className={styles.details}>
        <Link href={`/product/${slug}`} className={styles.title}>
          {title}
        </Link>
        {variantLabel && <span className={styles.variantLabel}>{variantLabel}</span>}
        <div className={styles.mobilePrice}>{formatPrice(price)}</div>

        <div className={styles.rowActions}>
          <div className={styles.stepper}>
            <button
              type="button"
              aria-label="Diminuer la quantité"
              onClick={() => updateQuantity(lineId, quantity - 1)}
            >
              <Minus size={13} />
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              aria-label="Augmenter la quantité"
              onClick={() => updateQuantity(lineId, quantity + 1)}
            >
              <Plus size={13} />
            </button>
          </div>

          <button type="button" className={styles.iconBtn} onClick={() => removeFromCart(lineId)}>
            <Trash2 size={14} /> Supprimer
          </button>

          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => {
              addToWishlist(productId);
              removeFromCart(lineId);
            }}
          >
            <Heart size={14} fill={isInWishlist(productId) ? "currentColor" : "none"} /> Favoris
          </button>
        </div>
      </div>

      <div className={styles.priceCol}>{formatPrice(price)}</div>
      <div className={styles.subtotalCol}>{formatPrice(price * quantity)}</div>
    </div>
  );
}
