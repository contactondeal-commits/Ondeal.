"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import TrustBadges from "@/components/products/TrustBadges";
import { useLocation } from "@/context/LocationContext";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site-config";
import styles from "./CartSummary.module.css";

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
}

function parseShippingRate(rate: string): number {
  try {
    // Extrait le premier nombre décimal ex: "19,90€" → 19.90
    const match = rate.match(/(\d+)[,.](\d+)/);
    if (match) return parseFloat(`${match[1]}.${match[2]}`);
    const simple = rate.match(/(\d+)/);
    if (simple) return parseFloat(simple[1]);
    return 4.99;
  } catch {
    return 4.99;
  }
}

export default function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const { formatPrice, location } = useLocation();

  const isFR = location.country_code === "FR";
  const shippingCost = parseShippingRate(location.shipping_rate ?? "4,99€");

  const shipping =
    subtotal === 0
      ? 0
      : isFR && subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : shippingCost;

  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className={styles.root}>
      <h2>Resume</h2>

      {subtotal > 0 && isFR && (
        <div className={styles.freeShippingProgress}>
          {remainingForFreeShipping > 0 ? (
            <p className={styles.freeShippingNote}>
              Encore {formatPrice(remainingForFreeShipping)} pour la livraison offerte !
            </p>
          ) : (
            <p className={styles.freeShippingNoteDone}>Livraison offerte debloquee</p>
          )}
        </div>
      )}

      <div className={styles.row}>
        <span>Sous-total ({itemCount} article{itemCount > 1 ? "s" : ""})</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className={styles.row}>
        <span>Livraison</span>
        <span>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</span>
      </div>
      <div className={`${styles.row} ${styles.total}`}>
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      {!isFR && location.shipping_rate && (
        <p style={{ fontSize: 11, color: "#888", margin: "-8px 0 8px", textAlign: "center" }}>
          {location.shipping_rate} - {location.delivery_days}
        </p>
      )}

      <Link href="/checkout">
        <Button variant="primary" size="lg" fullWidth disabled={itemCount === 0}>
          Passer la commande
        </Button>
      </Link>

      <TrustBadges compact />
    </div>
  );
}

