import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import ProductGrid from "@/components/products/ProductGrid";
import styles from "./ProductSection.module.css";

interface ProductSectionProps {
  title: string;
  products: Product[];
  seeAllHref?: string;
}

export default function ProductSection({ title, products, seeAllHref }: ProductSectionProps) {
  return (
    <section className={`${styles.section} container`}>
      <div className={styles.header}>
        <h2>{title}</h2>
        {seeAllHref && (
          <Link href={seeAllHref} className={styles.seeAll}>
            Tout voir <ArrowRight size={15} />
          </Link>
        )}
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
