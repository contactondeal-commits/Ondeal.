import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import ProductBrowser from "@/components/products/ProductBrowser";
import { fetchProductsByCategory, searchProductsService } from "@/services/productService";
import { getAllCategoriesFlat } from "@/data/categories";
import styles from "./page.module.css";

export async function generateMetadata(props: PageProps<"/search">): Promise<Metadata> {
  const params = await props.searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  return {
    title: q ? `Résultats pour « ${q} »` : "Recherche",
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage(props: PageProps<"/search">) {
  const params = await props.searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const categorySlug = typeof params.category === "string" ? params.category : undefined;

  let results = await searchProductsService(q);

  if (categorySlug) {
    const cat = getAllCategoriesFlat().find((c) => c.slug === categorySlug);
    if (cat) {
      const categoryResults = await fetchProductsByCategory(cat.id);
      const categoryIds = new Set(categoryResults.map((p) => p.id));
      results = results.filter((p) => categoryIds.has(p.id));
    }
  }

  const relevantCategories = Array.from(new Set(results.map((p) => p.subcategoryId ?? p.categoryId)))
    .map((id) => getAllCategoriesFlat().find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => !!c)
    .slice(0, 6);

  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: q ? `Résultats pour « ${q} »` : "Recherche" }]} />

      <h1>{q ? `Résultats pour « ${q} »` : "Recherche"}</h1>

      {relevantCategories.length > 0 && (
        <div className={styles.subcats}>
          {relevantCategories.map((c) => (
            <a key={c.id} href={`/category/${c.slug}`} className={styles.chip}>
              {c.name}
            </a>
          ))}
        </div>
      )}

      <Suspense fallback={null}>
        <ProductBrowser products={results} />
      </Suspense>
    </div>
  );
}
