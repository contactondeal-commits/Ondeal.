"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ProductGrid from "./ProductGrid";
import FilterSidebar from "@/components/filters/FilterSidebar";
import FilterMobile from "@/components/filters/FilterMobile";
import SortSelect from "@/components/filters/SortSelect";
import Pagination from "@/components/ui/Pagination";
import { filterProducts, sortProducts } from "@/services/productService";
import type { FilterState, Product, SortOption } from "@/types";
import styles from "./ProductBrowser.module.css";

const PAGE_SIZE = 20;

interface ProductBrowserProps {
  products: Product[];
}

function parseFilters(params: URLSearchParams): FilterState {
  return {
    priceMin: params.get("min") ? Number(params.get("min")) : undefined,
    priceMax: params.get("max") ? Number(params.get("max")) : undefined,
    brands: params.get("brand") ? params.get("brand")!.split(",") : [],
    minRating: params.get("rating") ? Number(params.get("rating")) : undefined,
    inStockOnly: params.get("stock") === "1",
    fastDeliveryOnly: params.get("fast") === "1",
  };
}

/**
 * Composant partagé entre /category/[slug] et /search — gère filtres, tri et
 * pagination, tout en conservant l'état dans l'URL (query, filtres, tri, page).
 */
export default function ProductBrowser({ products }: ProductBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = parseFilters(searchParams);
  const sort = (searchParams.get("sort") as SortOption) ?? "relevance";
  const page = Number(searchParams.get("page") ?? "1");
  const [mobileFilters, setMobileFilters] = useState<FilterState>(filters);

  function updateParams(patch: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === undefined || value === "") params.delete(key);
      else params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleFilterChange(next: FilterState) {
    setMobileFilters(next);
    updateParams({
      min: next.priceMin?.toString(),
      max: next.priceMax?.toString(),
      brand: next.brands.length ? next.brands.join(",") : undefined,
      rating: next.minRating?.toString(),
      stock: next.inStockOnly ? "1" : undefined,
      fast: next.fastDeliveryOnly ? "1" : undefined,
      page: undefined,
    });
  }

  const filtered = useMemo(() => filterProducts(products, filters), [products, filters]);
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paged = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const availableBrands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);

  return (
    <div className={styles.layout}>
      <FilterSidebar filters={filters} onChange={handleFilterChange} availableBrands={availableBrands} />

      <div className={styles.main}>
        <h2 className="visually-hidden">Produits</h2>
        <div className={styles.toolbar}>
          <p className={styles.count}>
            {sorted.length.toLocaleString("fr-FR")} résultat{sorted.length > 1 ? "s" : ""}
          </p>
          <div className={styles.toolbarRight}>
            <FilterMobile filters={mobileFilters} onChange={handleFilterChange} resultCount={sorted.length} />
            <SortSelect value={sort} onChange={(v) => updateParams({ sort: v, page: undefined })} />
          </div>
        </div>

        <ProductGrid products={paged} />

        <Pagination page={currentPage} totalPages={totalPages} onChange={(p) => updateParams({ page: p === 1 ? undefined : p.toString() })} />
      </div>
    </div>
  );
}
