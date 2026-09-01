import type { Product } from "@/types";
import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { PackageSearch } from "lucide-react";
import styles from "./ProductGrid.module.css";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function ProductGrid({ products, loading, emptyMessage = "Aucun produit ne correspond à votre recherche." }: ProductGridProps) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 10 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <PackageSearch size={40} strokeWidth={1.5} />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
