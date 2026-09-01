import type { Metadata } from "next";
import { Suspense } from "react";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import ProductBrowser from "@/components/products/ProductBrowser";
import { fetchAllProducts, fetchBestsellers, fetchNewArrivals, fetchProductsByCategory } from "@/services/productService";
import { findCategoryBySlug, getAllCategoriesFlat } from "@/data/categories";
import type { Product } from "@/types";
import styles from "./page.module.css";

// Mission "SECTION VOIR LE CATALOGUE" (20/08/2026) — page demandée par
// l'utilisateur : accessible depuis la carte "Voir le catalogue" du
// carrousel d'accueil (2e position, juste après "Rentrée scolaire"), elle
// présente tout le catalogue via des sous-catégories cliquables.
//
// Correctif "CATALOGUE = VRAIMENT TOUS LES PRODUITS ACTIFS" (20/08/2026) —
// retour client explicite : le premier onglet ("Meilleures ventes") ne
// montrait que 60 produits triés par popularité, pas le catalogue complet.
// Ajout d'un onglet "Tous les produits" (nouveau tab par défaut), branché
// sur `fetchAllProducts()` — la même fonction déjà utilisée ailleurs sur le
// site pour lister VRAIMENT tous les produits ACTIVE de la boutique Shopify
// (paginée côté serveur, jamais tronquée à une page unique — voir
// productService.ts), avec pagination client 20/page déjà gérée par
// ProductBrowser. Les 8 onglets suivants restent inchangés : meilleures
// ventes/nouveautés (vues dynamiques déjà branchées Shopify) puis 6 vraies
// catégories existantes de src/data/categories.ts (aucune catégorie
// inventée).

type TabKey = "tous" | "meilleures-ventes" | "nouveautes" | "beaute" | "bricolage" | "maison" | "vetement" | "jouet" | "informatique";

interface TabDef {
  key: TabKey;
  label: string;
  /** Slug de catégorie réelle sous-jacente (undefined pour les vues dynamiques : tous/meilleures ventes/nouveautés). */
  categorySlug?: string;
}

const CATALOGUE_TABS: TabDef[] = [
  { key: "tous", label: "Tous les produits" },
  { key: "meilleures-ventes", label: "Meilleures ventes" },
  { key: "nouveautes", label: "Nouveautés" },
  { key: "beaute", label: "Beauté", categorySlug: "beaute" },
  { key: "bricolage", label: "Bricolage", categorySlug: "bricolage" },
  { key: "maison", label: "Maison", categorySlug: "maison" },
  { key: "vetement", label: "Vêtement", categorySlug: "mode" },
  { key: "jouet", label: "Jouet", categorySlug: "jeux-jouets" },
  { key: "informatique", label: "Informatique", categorySlug: "informatique" },
];

const DEFAULT_TAB: TabKey = "tous";
const TAB_COUNT = 60;

function resolveTab(value: string | undefined): TabDef {
  return CATALOGUE_TABS.find((t) => t.key === value) ?? CATALOGUE_TABS[0];
}

/** La catégorie ciblée + tous ses descendants (même logique que /category/[slug]). */
function collectCategoryIds(slug: string): string[] {
  const category = findCategoryBySlug(slug);
  if (!category) return [];
  return getAllCategoriesFlat([category]).map((c) => c.id);
}

async function fetchTabProducts(tab: TabDef): Promise<Product[]> {
  if (tab.key === "tous") return fetchAllProducts();
  if (tab.key === "meilleures-ventes") return fetchBestsellers(TAB_COUNT);
  if (tab.key === "nouveautes") return fetchNewArrivals(TAB_COUNT);
  if (tab.categorySlug) return fetchProductsByCategory(collectCategoryIds(tab.categorySlug));
  return [];
}

export async function generateMetadata(props: PageProps<"/catalogue">): Promise<Metadata> {
  const params = await props.searchParams;
  const tab = resolveTab(typeof params.tab === "string" ? params.tab : undefined);
  return {
    title: `Catalogue — ${tab.label}`,
    description: "Tout le catalogue OnDeal, par meilleures ventes, nouveautés et rayons.",
    alternates: { canonical: "/catalogue" },
  };
}

export default async function CataloguePage(props: PageProps<"/catalogue">) {
  const params = await props.searchParams;
  const activeTab = resolveTab(typeof params.tab === "string" ? params.tab : undefined);
  const tabProducts = await fetchTabProducts(activeTab);

  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Catalogue" }]} />

      <h1>Le catalogue OnDeal</h1>
      <p className={styles.intro}>Parcourez tout le catalogue par rayon, ou filtrez sur les meilleures ventes et les nouveautés.</p>

      <div className={styles.tabs} role="tablist" aria-label="Rayons du catalogue">
        {CATALOGUE_TABS.map((tab) => {
          const isActive = tab.key === activeTab.key;
          const href = tab.key === DEFAULT_TAB ? "/catalogue" : `/catalogue?tab=${tab.key}`;
          return (
            <a
              key={tab.key}
              href={href}
              role="tab"
              aria-selected={isActive}
              className={isActive ? styles.tabActive : styles.tab}
            >
              {tab.label}
            </a>
          );
        })}
      </div>

      <div className={styles.browserWrap}>
        <Suspense fallback={null}>
          <ProductBrowser products={tabProducts} />
        </Suspense>
      </div>
    </div>
  );
}
