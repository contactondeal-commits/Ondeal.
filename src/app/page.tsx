import ReassuranceBar from "@/components/home/ReassuranceBar";
import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import CategoryBlocks from "@/components/home/CategoryBlocks";
import ProductSection from "@/components/home/ProductSection";
import { categories, getAllCategoriesFlat } from "@/data/categories";
import type { Product } from "@/types";
import { fetchAllProducts, fetchBestsellers, fetchDeals, fetchNewArrivals, fetchProductsByCategory, fetchProductsByTag, sortProducts } from "@/services/productService";

// Mission autonome (15/08/2026) — audit SEO réel : la balise title de la
// page d'accueil (la page la plus stratégique du site pour le SEO) était
// littéralement "Accueil" (vérifié dans le HTML servi : `Accueil`,
// sans le nom de marque ni mot-clé) — le title.template du layout racine
// ("%s | Ondeal") ne s'applique pas ici pour une raison propre à cette
// version de Next.js (voir AGENTS.md : "breaking changes" par rapport aux
// conventions habituelles). Plutôt que de dépendre d'un mécanisme de
// template qui ne se comporte pas comme attendu sur la page la plus
// importante du site, on retire `title` ici : la page hérite alors
// directement du `default` du layout racine
// ("Ondeal — Votre marketplace au meilleur prix", src/app/layout.tsx) —
// déjà rédigé avec la marque et la proposition de valeur, déjà réutilisé
// pour Open Graph/Twitter, donc cohérent partout.
export const metadata: Metadata = {
  description: "Des milliers de produits high-tech, maison, mode, sport et plus, livrés rapidement au meilleur prix.",
  alternates: { canonical: "/" },
};

/**
 * Mission CRO Phase 1 (2026-08-13) — P0-2 : le tag Shopify `promotion` n'est
 * réellement présent que sur 1 produit / 970 (reports/shopify-live-catalog-audit.json).
 * Afficher une section "Offres du moment" avec seulement 1 (ou 0) produit
 * réel nuit à la crédibilité perçue dès la page d'accueil (promesse non
 * tenue). Tant qu'aucune vraie politique de prix barrés n'est en place côté
 * Shopify, la section reste masquée en dessous de ce seuil plutôt que
 * d'afficher un nombre de produits non crédible. Aucune donnée n'est
 * inventée : on choisit seulement de ne pas afficher une section
 * quasi-vide sous un intitulé qui promet une sélection.
 */
const MIN_DEALS_TO_SHOW_SECTION = 4;

/**
 * Mission "REFONTE CIBLÉE DU BLOC DÉCOUVREZ NOS CATÉGORIES" (14/08/2026) —
 * un produit "vitrine" réel par catégorie de premier niveau, pour le
 * carrousel merchandising de la homepage (voir CategoryBlocks.tsx).
 *
 * Règle absolue de la mission : ne jamais inventer de promotion/prix/remise.
 * `oldPrice`/`discount` viennent uniquement de `compareAtPriceRange` réel
 * Shopify (voir src/lib/shopify/storefront.ts, `hasDiscount = compareAt >
 * price`) — jamais calculés ou simulés ici. Sélection, par catégorie, parmi
 * les 6 meilleurs candidats (remise réelle d'abord, puis popularité/note) :
 *   1. le produit avec la plus forte remise RÉELLE, s'il en existe une ;
 *   2. sinon le produit le plus vendu (puis le mieux noté).
 *
 * Exclusions manuelles (vérification visuelle faite pendant cette mission,
 * voir CategoryBlocks.tsx) : certaines photos produit réelles portent du
 * texte publicitaire fournisseur incrusté qui nuit fortement au rendu
 * ("Amélioré...", bandeaux promo, montages multi-vignettes, infographie en
 * allemand avec références SKU). Dans ce cas, le candidat suivant (une autre
 * vraie photo d'un autre vrai produit de la même catégorie) est utilisé à la
 * place — jamais une image retouchée ou inventée. `HERO_IMAGE_EXCLUDED_SLUGS`
 * liste les seuls produits ainsi écartés, avec la raison constatée.
 */
const HERO_IMAGE_EXCLUDED_SLUGS = new Set([
  // Texte publicitaire fournisseur incrusté dans la photo ("Upgraded ...").
  "industry-gaming-keyboard-glowing-usb-cable-gaming-keyboard",
  // Texte publicitaire fournisseur incrusté ("Gaming Keyboard Mouse Set").
  "gtx300-gaming-cf-lol-gaming-keyboard-mouse-glowing-set",
  // Texte publicitaire fournisseur incrusté ("GAME KEY FREELY SET").
  "gaming-keyboard-throne-one-mouse-set",
  // Texte publicitaire fournisseur incrusté ("4D Stereo Sound", logo marque).
  "compatible-with-apple-4d-computer-speaker-bar-stereo-sound-subwoofer-bluetooth-speaker-for-macbook-laptop-notebook-pc-music-player-wired-loudspeaker",
  // Montage/collage multi-vignettes peu lisible en grand format carrousel.
  "kit-dassemblage-3-en-1-serre-joints-dangle-gants-et-metre",
  // Montage multi-panneaux peu lisible en grand format carrousel.
  "parachute-de-jeu-arc-en-ciel-2-4-m-avec-12-balles",
  // Montage multi-panneaux peu lisible en grand format carrousel.
  "coffret-3-livres-de-coloriage-fleurs-chateau-et-vase",
  // Infographie en allemand avec références SKU, inexploitable en carrousel.
  "lot-de-15-filtres-de-rechange-pour-fontaine-a-eau-chat",
]);

async function fetchCategoryHeroProducts(): Promise<Record<string, Product | null>> {
  const entries = await Promise.all(
    categories.map(async (cat) => {
      const ids = getAllCategoriesFlat([cat]).map((c) => c.id);
      const catProducts = await fetchProductsByCategory(ids);
      if (catProducts.length === 0) return [cat.id, null] as const;

      const discounted = catProducts
        .filter((p) => typeof p.discount === "number" && p.discount > 0)
        .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
      const byPopularity = [...catProducts].sort(
        (a, b) => b.salesCount - a.salesCount || b.rating - a.rating
      );
      const ranked = [...discounted, ...byPopularity.filter((p) => !discounted.includes(p))];

      // Premier candidat, dans l'ordre de pertinence commerciale ci-dessus,
      // dont l'image n'a pas été manuellement écartée pour texte publicitaire
      // incrusté / montage illisible (voir HERO_IMAGE_EXCLUDED_SLUGS).
      const usable = ranked.find((p) => !HERO_IMAGE_EXCLUDED_SLUGS.has(p.slug));
      return [cat.id, usable ?? null] as const;
    })
  );
  return Object.fromEntries(entries);
}

/**
 * Mission "PLAN MARKETING" (15/08/2026), section 3 du plan — Bijoux est la
 * catégorie recommandée en priorité : catalogue profond (149 produits, voir
 * le plan) ET fraîchement remis en visibilité (correctif du bug de tags
 * Shopify, voir CHANGELOG). "Bijoux" est une sous-catégorie (rattachée à
 * "Mode"), donc absente du carrousel CategoryBlocks (qui ne couvre que les
 * catégories de premier niveau) — mise en avant dédiée ici plutôt que
 * d'attendre qu'elle apparaisse noyée dans "Mode".
 */
const FEATURED_CATEGORY_ID = "bijoux";
const FEATURED_CATEGORY_TITLE = "Bijoux — à découvrir";
const FEATURED_CATEGORY_HREF = "/category/bijoux";

/**
 * Mission "RESTAURATION CAMPAGNE RENTRÉE" (20/08/2026) — section "Sélection
 * Rentrée" (ancre /#rentree, ciblée par le CTA du slide Hero et la carte
 * "Rentrée scolaire" de CategoryBlocks) disparue du site suite à un
 * déploiement Vercel effectué depuis une copie locale de travail incomplète
 * (voir CHANGELOG / rapport d'incident). Restaurée initialement avec 11 vrais
 * produits Shopify figés par id (uniquement des cartables).
 *
 * Mission "CORRECTIF CTA RENTRÉE" (20/08/2026) — retour client explicite :
 * cliquer sur la carte/section "Rentrée scolaire" ne devait pas amener
 * uniquement des sacs. La section couvre maintenant TOUT le rayon fournitures
 * scolaires & bureau réellement en boutique, récupéré EN LIVE par le tag
 * Shopify `cat-bureau-papeterie` (voir fetchProductsByTag,
 * productService.ts — même tag que le pipeline d'import CJ/BigBuy/DSers,
 * 160 produits actifs vérifiés le 20/08/2026 : cartables, trousses,
 * classeurs, cahiers, étiquettes, calculatrices, etc.) plutôt qu'une liste
 * figée de 11 ids ne représentant qu'un seul type de produit. Toujours du
 * live Shopify (prix/stock à jour, jamais une valeur figée) — un produit
 * dépublié/archivé disparaît simplement de la sélection, sans erreur ni
 * donnée inventée (même comportement que la page /wishlist, voir
 * productService.ts).
 *
 * Mission "CATÉGORIE RENTRÉE SCOLAIRE DÉDIÉE" (20/08/2026) — retour client :
 * le lien "Tout voir" pointait vers une recherche plein texte
 * ("/search?q=fournitures scolaires bureau") qui ne retrouvait quasiment
 * aucun des 210 produits réels du rayon (la recherche Shopify ne fait PAS de
 * correspondance par tag) — un seul résultat en pratique, signalé comme bug
 * par le client. "Rentrée scolaire" est désormais une vraie catégorie
 * (src/data/categories.ts, id "rentree-scolaire") qui réunit papeterie/
 * bureau ET informatique via CATEGORY_ID_UNIONS (category-mapping.ts) — le
 * lien pointe maintenant vers cette page catégorie, garantie de retrouver
 * exactement les mêmes produits que cette section.
 */
const RENTREE_TITLE = "Rentrée — fournitures scolaires & bureau (code RENTREE20 : -20% sur la commande)";
const RENTREE_SEE_ALL_HREF = "/category/rentree-scolaire";
const RENTREE_TAG = "cat-bureau-papeterie";
const RENTREE_PRODUCT_COUNT = 12;

export default async function HomePage() {
  const [bestsellers, deals, newArrivals, allProducts, categoryHeroProducts, featuredCategoryProducts, rentreeProducts] = await Promise.all([
    fetchBestsellers(10),
    fetchDeals(10),
    fetchNewArrivals(10),
    fetchAllProducts(),
    fetchCategoryHeroProducts(),
    fetchProductsByCategory([FEATURED_CATEGORY_ID]),
    fetchProductsByTag(RENTREE_TAG, RENTREE_PRODUCT_COUNT),
  ]);
  const recommendations = sortProducts(allProducts, "rating").slice(0, 10);
  const showDeals = deals.length >= MIN_DEALS_TO_SHOW_SECTION;
  const featuredCategoryTop = sortProducts(featuredCategoryProducts, "rating").slice(0, 10);

  return (
    <>
      <Hero />
      <ReassuranceBar />
      <CategoryBlocks heroProducts={categoryHeroProducts} />
      {rentreeProducts.length > 0 && (
        <div id="rentree">
          <ProductSection title={RENTREE_TITLE} products={rentreeProducts} seeAllHref={RENTREE_SEE_ALL_HREF} />
        </div>
      )}
      {featuredCategoryTop.length > 0 && (
        <ProductSection title={FEATURED_CATEGORY_TITLE} products={featuredCategoryTop} seeAllHref={FEATURED_CATEGORY_HREF} />
      )}
      {showDeals && (
        <ProductSection title="Offres du moment" products={deals} seeAllHref="/search?q=&sort=price_asc" />
      )}
      <ProductSection title="Meilleures ventes" products={bestsellers} seeAllHref="/search?q=&sort=bestselling" />
      <ProductSection title="Nouveautés" products={newArrivals} seeAllHref="/search?q=&sort=newest" />
      <ProductSection title="Recommandé pour vous" products={recommendations} seeAllHref="/search?q=&sort=rating" />
      {/* Pas de section "Nos marques" : le composant BrandsRow affichait 12 noms
          de marque entièrement fictifs (src/data/brands.ts, jamais vendus sur le
          catalogue réel — voir mission déploiement Vercel, 14/08/2026). Retiré
          plutôt que remplacé par une donnée inventée. */}
    </>
  );
}
