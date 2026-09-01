"use client";

import type { FilterState } from "@/types";
import styles from "./FilterSidebar.module.css";

const PRICE_RANGES: { label: string; min?: number; max?: number }[] = [
  { label: "0 - 50 €", min: 0, max: 50 },
  { label: "50 - 100 €", min: 50, max: 100 },
  { label: "100 - 250 €", min: 100, max: 250 },
  { label: "250 - 500 €", min: 250, max: 500 },
  { label: "500 €+", min: 500, max: undefined },
];

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableBrands?: string[];
}

export default function FilterSidebar({ filters, onChange, availableBrands }: FilterSidebarProps) {
  // Mission déploiement Vercel (2026-08-14) — l'ancien repli sur
  // src/data/brands.ts (12 noms de marque entièrement fictifs, jamais
  // vendus sur le catalogue réel) a été retiré : sans liste réelle fournie
  // par l'appelant, on n'affiche simplement aucune marque plutôt que d'en
  // inventer.
  const brandList = availableBrands ?? [];

  function toggleBrand(name: string) {
    const has = filters.brands.includes(name);
    onChange({ ...filters, brands: has ? filters.brands.filter((b) => b !== name) : [...filters.brands, name] });
  }

  function setPriceRange(min?: number, max?: number) {
    const isActive = filters.priceMin === min && filters.priceMax === max;
    onChange({ ...filters, priceMin: isActive ? undefined : min, priceMax: isActive ? undefined : max });
  }

  return (
    <aside className={styles.root} aria-label="Filtres produits">
      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Prix</h3>
        {PRICE_RANGES.map((r) => (
          <label key={r.label} className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={filters.priceMin === r.min && filters.priceMax === r.max}
              onChange={() => setPriceRange(r.min, r.max)}
            />
            {r.label}
          </label>
        ))}
      </div>

      {brandList.length > 0 && (
        <div className={styles.group}>
          <h3 className={styles.groupTitle}>Marque</h3>
          {brandList.map((name) => (
            <label key={name} className={styles.checkboxRow}>
              <input type="checkbox" checked={filters.brands.includes(name)} onChange={() => toggleBrand(name)} />
              {name}
            </label>
          ))}
        </div>
      )}

      {/*
        Mission CRO Phase 1 (2026-08-13) — P0-4 : les filtres "Note" et
        "Livraison rapide" ont été retirés (et non simplement masqués en
        CSS) car ils retournaient systématiquement 0 résultat sur le
        catalogue réel :
        - "Note" : reviewsCount est à 0 sur la quasi-totalité du catalogue
          (voir P0-1, reports/shopify-live-catalog-audit.json) — donc
          rating = 0 partout, aucun produit ne peut jamais correspondre à
          "3 étoiles et +" ou "4 étoiles et +".
        - "Livraison rapide" : le tag Shopify `livraison-rapide` est
          présent sur 0 produit du catalogue réel (idem source).
        Un filtre visible qui renvoie toujours 0 résultat est perçu comme un
        site cassé (voir reports/ondeal-cro-audit.md P0-4). Ils pourront être
        réintroduits dès que ces données existeront réellement sur le
        catalogue Shopify (avis collectés, tag `livraison-rapide` peuplé).
        `FilterState.minRating` et `.fastDeliveryOnly` restent dans le type
        et dans `filterProducts()` pour ne pas casser l'état d'URL existant
        (`?rating=`/`?fast=`) ni la logique de filtrage — seule l'UI qui
        permettait de les activer est retirée.
      */}

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Disponibilité</h3>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
          />
          En stock
        </label>
      </div>

      <button
        type="button"
        className={styles.resetBtn}
        onClick={() => onChange({ brands: [], inStockOnly: false, fastDeliveryOnly: false })}
      >
        Réinitialiser les filtres
      </button>
    </aside>
  );
}
