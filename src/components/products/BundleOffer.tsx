"use client";

import Link from "next/link";
import { Plus, ShoppingCart } from "lucide-react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types";
import styles from "./BundleOffer.module.css";

interface BundleOfferProps {
  mainProduct: Product;
  relatedProducts: Product[];
}

export default function BundleOffer({ mainProduct, relatedProducts }: BundleOfferProps) {
  const { addToCart } = useCart();
  if (relatedProducts.length === 0) return null;

  const bundle = [mainProduct, ...relatedProducts.slice(0, 2)];
  const total = bundle.reduce((sum, p) => sum + p.price, 0);
  const discount = Math.round(total * 0.08);
  const finalPrice = total - discount;

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Souvent achetés ensemble</h2>
      <div className={styles.products}>
        {bundle.map((p, i) => (
          <div key={p.id} className={styles.item}>
            {i > 0 && <Plus size={18} className={styles.plus} />}
            <Link href={`/product/${p.slug}`} className={styles.imgWrap}>
              <PlaceholderImage seed={p.images[0]} label={p.title} rounded={false} />
            </Link>
            <span className={styles.name}>{p.title}</span>
            <span className={styles.price}>{formatPrice(p.price)}</span>
          </div>
        ))}
      </div>
      <div className={styles.summary}>
        <div className={styles.priceInfo}>
          <span className={styles.total}>Total : <s>{formatPrice(total)}</s></span>
          <span className={styles.final}>Prix bundle : <strong>{formatPrice(finalPrice)}</strong></span>
          <span className={styles.saving}>Vous économisez {formatPrice(discount)} (8%)</span>
        </div>
        <button
          type="button"
          className={styles.btn}
          onClick={() => bundle.forEach((p) => addToCart(p))}
        >
          <ShoppingCart size={16} />
          Ajouter les 3 au panier
        </button>
      </div>
    </section>
  );
}
