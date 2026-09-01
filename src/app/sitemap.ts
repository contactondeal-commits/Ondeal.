import type { MetadataRoute } from "next";
import { fetchAllProducts } from "@/services/productService";
import { getAllCategoriesFlat } from "@/data/categories";
import { SITE_URL } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/help`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/legal/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/legal/cgv`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/legal/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/legal/cookies`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/legal/garantie`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/legal/livraison`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/legal/retours`, changeFrequency: "monthly", priority: 0.3 },
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

  const allProducts = await fetchAllProducts();
  const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => {
    const images = (product.images ?? [])
      .filter((img) => /^https?:\/\//i.test(img))
      .slice(0, 10)
      .map((img) => ({
        url: img,
        title: product.title,
      }));

    return {
      url: `${SITE_URL}/product/${product.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      // @ts-ignore — Next.js 16 supporte images dans sitemap (expérimental)
      images: images.length > 0 ? images : undefined,
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
