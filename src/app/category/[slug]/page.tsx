import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { findCategoryBySlug, categories, getAllCategoriesFlat } from "@/data/categories";
import type { Category } from "@/types";
import { fetchProductsByCategory } from "@/services/productService";
import { CATEGORY_ID_UNIONS } from "@/lib/catalog/category-mapping";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import ProductBrowser from "@/components/products/ProductBrowser";
import { getIcon } from "@/lib/icon-map";
import { safeJsonLdString } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-config";
import styles from "./page.module.css";

export async function generateStaticParams() {
  return getAllCategoriesFlat(categories).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const category = findCategoryBySlug(slug);
  if (!category) return { title: "Catégorie introuvable" };
  return {
    title: category.name,
    description: category.description ?? `Découvrez notre sélection ${category.name} au meilleur prix.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

function findParentChain(slug: string, list = categories, chain: typeof categories = []): typeof categories | null {
  for (const cat of list) {
    if (cat.slug === slug) return [...chain, cat];
    const found = findParentChain(slug, cat.children, [...chain, cat]);
    if (found) return found;
  }
  return null;
}

/**
 * L'id de la catégorie elle-même + tous ses descendants (pour une page
 * catégorie parente), plus — le cas échéant — les catégories "unionnées"
 * (voir CATEGORY_ID_UNIONS, category-mapping.ts : ex. "Rentrée scolaire"
 * réunit aussi tout le rayon "Informatique" sans le déplacer dans l'arbre).
 */
function collectCategoryIds(category: Category): string[] {
  const ownIds = getAllCategoriesFlat([category]).map((c) => c.id);
  const unionedRootIds = CATEGORY_ID_UNIONS[category.id] ?? [];
  const allCategoriesFlat = getAllCategoriesFlat(categories);
  const unionedIds = unionedRootIds.flatMap((id) => {
    const node = allCategoriesFlat.find((c) => c.id === id);
    return node ? getAllCategoriesFlat([node]).map((c) => c.id) : [];
  });
  return [...ownIds, ...unionedIds];
}

export default async function CategoryPage(props: PageProps<"/category/[slug]">) {
  const { slug } = await props.params;
  const category = findCategoryBySlug(slug);
  if (!category) notFound();

  const chain = findParentChain(slug) ?? [category];
  const categoryProducts = await fetchProductsByCategory(collectCategoryIds(category));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    // `item` doit être une URL absolue (recommandation Schema.org / Google
    // Rich Results) — corrigé le 13/08/2026, la version précédente utilisait
    // des chemins relatifs ("/", "/category/...").
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      ...chain.map((c, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: c.name,
        item: `${SITE_URL}/category/${c.slug}`,
      })),
    ],
  };

  return (
    <div className={`${styles.page} container`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdString(jsonLd) }} />

      <Breadcrumbs
        items={[
          { label: "Accueil", href: "/" },
          ...chain.map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
        ]}
      />

      <h1>{category.name}</h1>
      {category.description && <p className={styles.description}>{category.description}</p>}

      {category.children.length > 0 && (
        <div className={styles.subcats}>
          {category.children.map((child) => {
            const Icon = getIcon(child.icon);
            return (
              <Link key={child.id} href={`/category/${child.slug}`} className={styles.subcatChip}>
                <Icon size={15} /> {child.name}
              </Link>
            );
          })}
        </div>
      )}

      <div className={styles.browserWrap}>
        <Suspense fallback={null}>
          <ProductBrowser products={categoryProducts} />
        </Suspense>
      </div>
    </div>
  );
}
