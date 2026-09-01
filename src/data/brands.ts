import type { Brand } from "@/types";

/**
 * Mission déploiement Vercel (2026-08-14) — cette liste de marques FICTIVES
 * est réservée exclusivement au générateur de catalogue de démonstration
 * (src/data/products.ts), utilisé uniquement en repli quand Shopify n'est
 * pas configuré (voir productService.ts). Elle a été retirée de tout
 * composant visible par un vrai visiteur (ancien BrandsRow sur l'accueil,
 * repli par défaut de FilterSidebar) car aucune de ces marques ne
 * correspond à un vendor réel du catalogue Shopify — les présenter comme
 * réelles aurait violé la règle absolue de véracité de la mission.
 * Ne pas réimporter ce fichier depuis un composant qui affiche des données
 * au visiteur final sans passer par le catalogue Shopify réel.
 */
export const brands: Brand[] = [
  { id: "aurex", name: "Aurex" },
  { id: "novatek", name: "Novatek" },
  { id: "lumea", name: "Lumea" },
  { id: "kestrel", name: "Kestrel" },
  { id: "vantiq", name: "Vantiq" },
  { id: "brisora", name: "Brisora" },
  { id: "polarn", name: "Polarn" },
  { id: "domora", name: "Domora" },
  { id: "fytek", name: "Fytek" },
  { id: "solenne", name: "Solenne" },
  { id: "orbix", name: "Orbix" },
  { id: "maevora", name: "Maevora" },
];
