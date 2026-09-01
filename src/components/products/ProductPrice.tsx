"use client";
import { useEffect, useState } from "react";
import { useLocation } from "@/context/LocationContext";
import styles from "@/app/product/[slug]/page.module.css";

interface ProductPriceProps {
  price: number;
  oldPrice?: number;
  discount?: number;
}

export default function ProductPrice({ price, oldPrice, discount }: ProductPriceProps) {
  const { formatPrice, location } = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Avant hydratation → affiche EUR par défaut (cohérent avec SSG)
  if (!mounted) {
    return (
      <div className={styles.priceBlock}>
        <span className={styles.price}>{price.toFixed(2)} €</span>
        {oldPrice && <span className={styles.oldPrice}>{oldPrice.toFixed(2)} €</span>}
        {discount ? <span className={styles.discount}>-{discount}%</span> : null}
      </div>
    );
  }

  return (
    <div className={styles.priceBlock}>
      <span className={styles.price}>{formatPrice(price)}</span>
      {oldPrice && <span className={styles.oldPrice}>{formatPrice(oldPrice)}</span>}
      {discount ? <span className={styles.discount}>-{discount}%</span> : null}
      {location.currency !== "EUR" && (
        <span style={{ fontSize: 11, color: "#888", display: "block", marginTop: 2 }}>
          Prix converti · taux indicatif
        </span>
      )}
    </div>
  );
}
