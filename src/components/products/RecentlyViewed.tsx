"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types";
import styles from "./RecentlyViewed.module.css";

const KEY = "ondeal_recently_viewed";
const MAX = 6;

export function trackRecentlyViewed(product: Product) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(KEY);
  const list: Product[] = raw ? JSON.parse(raw) : [];
  const filtered = list.filter((p) => p.id !== product.id);
  localStorage.setItem(KEY, JSON.stringify([product, ...filtered].slice(0, MAX)));
}

export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const list: Product[] = JSON.parse(raw);
    setProducts(list.filter((p) => p.id !== excludeId).slice(0, 4));
  }, [excludeId]);

  if (products.length === 0) return null;

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>Récemment consultés</h2>
      <div className={styles.grid}>
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.slug}`} className={styles.card}>
            <div className={styles.img}>
              <PlaceholderImage seed={p.images[0]} label={p.title} rounded={false} />
            </div>
            <span className={styles.name}>{p.title}</span>
            <span className={styles.price}>{formatPrice(p.price)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
