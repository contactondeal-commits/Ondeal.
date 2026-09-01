"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import Button from "@/components/ui/Button";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/hooks/useCart";
import styles from "./page.module.css";

export default function CartPage() {
  const { items, count, subtotal } = useCart();

  return (
    <div className={`${styles.page} container`}>
      <h1>Votre panier</h1>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <ShoppingCart size={44} strokeWidth={1.4} />
          <p>Votre panier est vide.</p>
          <Link href="/">
            <Button variant="primary">Continuer mes achats</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.layout}>
          <div className={styles.list}>
            <div className={styles.listHeader}>
              <span>Produit</span>
              <span className={styles.hideMobile}>Prix</span>
              <span className={styles.hideMobile}>Sous-total</span>
            </div>
            {items.map((item) => (
              <CartItem key={item.lineId} item={item} />
            ))}
          </div>

          <CartSummary subtotal={subtotal} itemCount={count} />
        </div>
      )}
    </div>
  );
}
