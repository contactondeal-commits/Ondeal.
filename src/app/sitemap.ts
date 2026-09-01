import type { MetadataRoute } from "next";
import { fetchAllProducts } from "@/services/productService";
import { getAllCategoriesFlat } from "@/data/categories";
import { SITE_URL } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/help`, changeFrequency: "monthly", priority: 0.3 },
    // Pages légales publiées le 18/08/2026 (mission "MENTIONS LÉGALES") —
    // contenu réel désormais disponible (voir src/lib/company-info.ts),
    // donc indexables et incluses dans le sitemap comme le reste du site.
    { url: `${SITE_URL}/legal/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/legal/cgv`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/legal/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/legal/cookies`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/legal/garantie`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/legal/livraison`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/legal/retours`, changeFrequency: "monthly", priority: 0.3 },
    // Pages footer publiées le 18/08/2026 (mission "PAGES FOOTER") — ne
    // pointaient plus vers /help, chacune a désormais son propre contenu.
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/careers`, changeFrequency: "monthly", priority: 0.1 },
    { url: `${SITE_URL}/press`, changeFrequency: "monthly", priority: 0.1 },
    { url: `${SITE_URL}/sell`, changeFrequency: "monthly", priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = getAllCategoriesFlat().map((category) => ({
    url: `${SITE_URL}/category/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Passe par productService : reflète automatiquement le vrai catalogue
  // Shopify (produits publiés uniquement) dès que Shopify est configuré,
  // sinon les données de démonstration.
  const allProducts = await fetchAllProducts();
  const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: `${SITE_URL}/product/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
