"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/types";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import ProductBadge from "./ProductBadge";
import ProductRating from "./ProductRating";
import StockCountdown from "./StockCountdown";
import LiveVisitors from "./LiveVisitors";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useLocation } from "@/context/LocationContext";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  showLiveVisitors?: boolean;
}

export default function ProductCard({ product, showLiveVisitors = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { location, formatPrice } = useLocation();
  const inWishlist = isInWishlist(product.id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Avant hydratation → ne masque aucun produit
  if (mounted && !location.ships_to) return null;

  const displayPrice = (p: number) =>
    mounted ? formatPrice(p) : `${p.toFixed(2)} €`;

  return (
    <div className={styles.card}>
      <Link href={`/product/${product.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          <PlaceholderImage seed={product.images[0]} label={product.title} rounded={false} />
          <div className={styles.badges}>
            {product.badges.slice(0, 2).map((b) => (
              <ProductBadge key={b} type={b} />
            ))}
          </div>
        </div>
      </Link>

      <button
        type="button"
        className={`${styles.wishlistBtn} ${inWishlist ? styles.wishlistActive : ""}`}
        aria-label={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
        aria-pressed={inWishlist}
        onClick={() => toggleWishlist(product.id)}
      >
        <Heart size={17} fill={inWishlist ? "currentColor" : "none"} />
      </button>

      <div className={styles.body}>
        <span className={styles.brand}>{product.brand}</span>
        <Link href={`/product/${product.slug}`} className={styles.title}>
          {product.title}
        </Link>

        <ProductRating rating={product.rating} reviewsCount={product.reviewsCount} hideWhenEmpty />

        <div className={styles.priceRow}>
          <span className={styles.price}>{displayPrice(product.price)}</span>
          {product.oldPrice && (
            <span className={styles.oldPrice}>{displayPrice(product.oldPrice)}</span>
          )}
          {product.discount && product.discount > 0 && (
            <span className={styles.discount}>-{product.discount}%</span>
          )}
        </div>

        {mounted && location.currency !== "EUR" && (
          <p style={{ fontSize: 11, color: "#888", margin: "-4px 0 4px" }}>
            Prix converti · taux indicatif
          </p>
        )}

        {typeof product.stock === "number" && (
          <StockCountdown stock={product.stock} />
        )}

        <div className={styles.deliveryRow}>
          {product.delivery.freeShipping && (
            <span className={styles.deliveryFree}>
              <Truck size={13} /> Livraison offerte
            </span>
          )}
          <span className={product.inStock ? styles.inStock : styles.outStock}>
            {product.inStock ? "Disponible" : "Rupture de stock"}
          </span>
        </div>

        {showLiveVisitors && product.inStock && (
          <LiveVisitors baseCount={Math.floor(Math.random() * 10) + 5} />
        )}

        {product.options && product.options.length > 0 ? (
          <Link href={`/product/${product.slug}`} className={styles.addBtn}>
            <ShoppingCart size={16} />
            Choisir les options
          </Link>
        ) : (
          <button
            type="button"
            className={styles.addBtn}
            disabled={!product.inStock}
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={16} />
            Ajouter au panier
          </button>
        )}
      </div>
    </div>
  );
}
