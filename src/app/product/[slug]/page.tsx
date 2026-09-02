import RecentlyViewed from "@/components/products/RecentlyViewed";
import DeliveryEstimator from "@/components/products/DeliveryEstimator";
import LiveVisitors from "@/components/products/LiveVisitors";
import QuestionForm from "@/components/products/QuestionForm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchAllProducts, fetchBoughtTogetherProducts, fetchProductBySlug, fetchRelatedProducts } from "@/services/productService";
import { getAllCategoriesFlat } from "@/data/categories";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import ProductGallery from "@/components/products/ProductGallery";
import ProductRating from "@/components/products/ProductRating";
import ProductBadge from "@/components/products/ProductBadge";
import AddToCartPanel from "@/components/products/AddToCartPanel";
import { ProductSelectionProvider } from "@/components/products/ProductSelectionProvider";
import ReviewsList from "@/components/products/ReviewsList";
import ProductGrid from "@/components/products/ProductGrid";
import MobileStickyCta from "@/components/products/MobileStickyCta";
import TrustBadges from "@/components/products/TrustBadges";
import StockCountdown from "@/components/products/StockCountdown";
import ProductPrice from "@/components/products/ProductPrice";
import { Truck, ShieldCheck } from "lucide-react";
import { safeJsonLdString } from "@/lib/seo";
import { SITE_URL } from "@/lib/site-config";
import styles from "./page.module.css";

export async function generateStaticParams() {
  const allProducts = await fetchAllProducts();
  return allProducts.map((p) => ({ slug: p.slug }));
}

// Audit performance 2026-09-02 — pages générées en SSG (generateStaticParams)
// mais sans revalidation : sans redéploiement, un changement de stock/prix
// côté Shopify ne se reflétait jamais. ISR toutes les heures, cohérent avec
// la fréquence déjà utilisée pour le flux Google Shopping (voir
// src/app/feed/google-shopping.xml/route.ts).
export const revalidate = 3600;

export async function generateMetadata(props: PageProps<"/product/[slug]">): Promise<Metadata> {
  // BUG FIX (02/09/2026) — voir commentaire détaillé sur ProductPage
  // ci-dessous : ce try/catch avalait aussi les erreurs réseau/Shopify
  // (timeout, throttling, erreur GraphQL transitoire) et les transformait en
  // "Produit introuvable", identique à un vrai produit absent. Seul le cas
  // "produit réellement introuvable" (product === null) doit produire ce
  // titre ; toute autre erreur doit remonter à error.tsx (voir storefront.ts).
  const { slug } = await props.params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      type: "website",
    },
  };
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  // BUG FIX (02/09/2026) — Audit conversion : cette page enveloppait TOUT
  // (fetch Shopify + rendu) dans un try/catch qui appelait notFound() sur
  // n'importe quelle exception — pas seulement "produit absent". Un timeout
  // réseau Shopify, une erreur GraphQL transitoire (throttling, incident
  // Storefront API) ou tout bug de rendu produisaient donc TOUS la même page
  // "Produit introuvable" (HTTP 200, indiscernable d'un vrai 404). Pire :
  // cette page factice était ensuite mise en cache ISR pour `revalidate`
  // (3600s, voir plus bas) — une panne réseau de quelques secondes pouvait
  // ainsi rendre un produit parfaitement valide invisible pendant 1h, sans
  // laisser aucune trace exploitable. `src/lib/shopify/storefront.ts`
  // documente pourtant explicitement que ces erreurs doivent remonter à
  // src/app/error.tsx — jamais être avalées ici. Correctif : `notFound()`
  // n'est plus appelé que si `product` est réellement `null` (produit
  // confirmé absent du catalogue Shopify) ; toute exception se propage
  // normalement vers error.tsx, et n'écrase jamais un rendu ISR déjà valide
  // en cache (comportement standard de revalidation Next.js : en cas
  // d'erreur pendant la régénération, l'ancienne version en cache continue
  // d'être servie).
  const { slug } = await props.params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

    const category = getAllCategoriesFlat().find((c) => c.id === (product.subcategoryId ?? product.categoryId));
    const [related, boughtTogether] = await Promise.all([
      fetchRelatedProducts(product, 6),
      fetchBoughtTogetherProducts(product, 4),
    ]);

    const realImages = product.images.filter((img) => /^https?:\/\//i.test(img));

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        ...(category ? [{ "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/category/${category.slug}` }] : []),
        { "@type": "ListItem", position: category ? 3 : 2, name: product.title, item: `${SITE_URL}/product/${product.slug}` },
      ],
    };

    const faqJsonLd = product.features.length >= 3 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: `Quelles sont les caractéristiques de ${product.title} ?`, acceptedAnswer: { "@type": "Answer", text: product.features.slice(0, 5).join(". ") } },
        { "@type": "Question", name: `${product.title} est-il disponible ?`, acceptedAnswer: { "@type": "Answer", text: product.inStock ? "Oui, ce produit est en stock et disponible à la commande." : "Ce produit est actuellement en rupture de stock." } },
        { "@type": "Question", name: `Quelle est la livraison pour ${product.title} ?`, acceptedAnswer: { "@type": "Answer", text: product.delivery.freeShipping ? "La livraison est offerte pour ce produit." : `Livraison : ${product.delivery.estimate}.` } },
      ],
    } : null;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      url: `${SITE_URL}/product/${product.slug}`,
      ...(realImages.length > 0 ? { image: realImages } : {}),
      brand: { "@type": "Brand", name: product.brand },
      description: product.description,
      sku: product.id,
      aggregateRating:
        product.reviewsCount > 0
          ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewsCount }
          : undefined,
      offers: {
        "@type": "Offer",
        priceCurrency: "EUR",
        price: product.price,
        availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    };

    return (
      <div className={`${styles.page} container`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdString(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdString(breadcrumbJsonLd) }} />
        {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdString(faqJsonLd) }} />}

        <Breadcrumbs
          items={[
            { label: "Accueil", href: "/" },
            ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
            { label: product.title },
          ]}
        />

        <ProductSelectionProvider product={product}>
          <div className={styles.top}>
            <ProductGallery images={product.images} title={product.title} />

            <div className={styles.info}>
              <span className={styles.brand}>{product.brand}</span>
              <h1 className={styles.title}>{product.title}</h1>
              <ProductRating rating={product.rating} reviewsCount={product.reviewsCount} size={16} />

              {product.badges.length > 0 && (
                <div className={styles.badges}>
                  {product.badges.map((b) => (
                    <ProductBadge key={b} type={b} />
                  ))}
                </div>
              )}

              <ProductPrice
                price={product.price}
                oldPrice={product.oldPrice}
                discount={product.discount}
              />

              <div className={styles.deliveryInfo}>
                <p>
                  <Truck size={15} /> {product.delivery.estimate}
                  {product.delivery.freeShipping && " — Livraison offerte"}
                </p>
                <p className={product.inStock ? styles.inStock : styles.outStock}>
                  <ShieldCheck size={15} /> {product.inStock ? "En stock" : "Rupture de stock"}
                </p>
              </div>

              <hr className={styles.divider} />

              <AddToCartPanel product={product} />
              <span id="add-to-cart-sentinel" aria-hidden="true" />

              <StockCountdown stock={product.stock ?? 0} />
              <TrustBadges />
              <DeliveryEstimator cutoffHour={16} />
              <LiveVisitors baseCount={9} />

              <p className={styles.seller}>{product.seller}</p>
            </div>
          </div>

          <MobileStickyCta product={product} />
        </ProductSelectionProvider>

        <div className={styles.tabsGrid}>
          <section aria-labelledby="description-heading">
            <h2 id="description-heading">Description</h2>
            <p className={styles.descriptionText}>{product.description}</p>
          </section>

          {product.features.length > 0 && (
            <section aria-labelledby="features-heading">
              <h2 id="features-heading">Caractéristiques</h2>
              <ul className={styles.featureList}>
                {product.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>
          )}

          {Object.keys(product.specifications).length > 0 && (
            <section aria-labelledby="specs-heading">
              <h2 id="specs-heading">Informations techniques</h2>
              <table className={styles.specsTable}>
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <th scope="row">{key}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          <section aria-labelledby="reviews-heading">
            <h2 id="reviews-heading">Avis clients</h2>
            <ReviewsList product={product} />
          </section>

          <section aria-labelledby="qa-heading">
            <h2 id="qa-heading">Questions / réponses</h2>
            <p className={styles.qaEmpty}>Aucune question pour le moment. Soyez le premier à en poser une.</p>
            <QuestionForm productTitle={product.title} productSlug={product.slug} />
          </section>
        </div>

        <span id="sticky-cta-end-boundary" aria-hidden="true" />

        {related.length > 0 && (
          <section className={styles.relatedSection} aria-labelledby="related-heading">
            <h2 id="related-heading">Produits similaires</h2>
            <ProductGrid products={related} />
          </section>
        )}

        {boughtTogether.length > 0 && (
          <section className={styles.relatedSection} aria-labelledby="together-heading">
            <h2 id="together-heading">Produits fréquemment achetés ensemble</h2>
            <ProductGrid products={boughtTogether} />
          </section>
        )}

        <RecentlyViewed excludeId={product.id} />
      </div>
    );
}
