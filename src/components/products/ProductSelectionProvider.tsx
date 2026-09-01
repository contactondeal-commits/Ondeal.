"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fireGoogleAdsConversion } from "@/lib/analytics/googleAds";
import type { Product, ProductVariant } from "@/types";

/**
 * Mission "SÉLECTION DE TAILLE" (15/08/2026) — demande explicite du client :
 * laisser les acheteurs choisir la taille (vêtements, chaussures) — et plus
 * généralement toute option réelle (couleur, etc.) — avant d'ajouter au
 * panier, au lieu d'ajouter silencieusement une variante arbitraire
 * (`shopifyDefaultVariantId`, la première renvoyée par Shopify, sans lien
 * avec ce que l'acheteur voulait vraiment).
 *
 * `AddToCartPanel` (formulaire d'achat) et `MobileStickyCta` (barre sticky
 * mobile) sont deux composants distincts, rendus à des endroits différents
 * de la fiche produit (voir product/[slug]/page.tsx), mais doivent refléter
 * LA MÊME sélection en cours (ex. la barre sticky doit rester désactivée
 * tant qu'aucune taille n'est choisie, et ajouter la bonne taille si elle
 * l'est). Un Context React scopé à la fiche produit — plutôt qu'un store
 * global — est le bon niveau : il se réinitialise naturellement à chaque
 * navigation vers un autre produit (contrairement à un store Zustand
 * global, qu'il aurait fallu réinitialiser manuellement).
 */
interface ProductSelectionContextValue {
  product: Product;
  /** Options réelles nécessitant un choix (Title/valeur unique déjà filtrées, voir mapStorefrontProduct). */
  options: { name: string; values: string[] }[];
  selectedOptions: Record<string, string>;
  setOption: (name: string, value: string) => void;
  /** true si le produit a plus d'une variante réelle : un choix est nécessaire avant l'ajout au panier. */
  requiresSelection: boolean;
  /** Variante résolue correspondant à la sélection actuelle — undefined tant que la sélection est incomplète. */
  selectedVariant: ProductVariant | undefined;
  /** true si aucun choix n'est requis, ou si la sélection actuelle résout une variante valide. */
  isSelectionComplete: boolean;
  /**
   * Pour un nom d'option + valeur donnés : existe-t-il une variante
   * disponible (`availableForSale`) combinant cette valeur avec le reste de
   * la sélection actuelle ? Permet de griser les tailles/couleurs
   * indisponibles sans jamais inventer un stock fictif — dérivé uniquement
   * des variantes réelles renvoyées par Shopify.
   */
  isValueAvailable: (optionName: string, value: string) => boolean;
}

const ProductSelectionContext = createContext<ProductSelectionContextValue | null>(null);

export function ProductSelectionProvider({ product, children }: { product: Product; children: ReactNode }) {
  const options = useMemo(() => product.options ?? [], [product.options]);
  const variants = useMemo(() => product.variants ?? [], [product.variants]);
  const requiresSelection = options.length > 0 && variants.length > 1;

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    fireGoogleAdsConversion("viewItem", { value: product.price });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  function setOption(name: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  }

  const selectedVariant = useMemo(() => {
    if (variants.length === 0) return undefined;
    if (!requiresSelection) return variants[0];
    if (options.some((o) => !selectedOptions[o.name])) return undefined;
    return variants.find((v) => v.selectedOptions.every((so) => selectedOptions[so.name] === so.value));
  }, [variants, requiresSelection, options, selectedOptions]);

  function isValueAvailable(optionName: string, value: string): boolean {
    return variants.some((v) => {
      const matchesThisValue = v.selectedOptions.some((so) => so.name === optionName && so.value === value);
      if (!matchesThisValue) return false;
      const matchesOtherSelections = v.selectedOptions.every((so) => {
        if (so.name === optionName) return true;
        const chosen = selectedOptions[so.name];
        return !chosen || chosen === so.value;
      });
      return matchesOtherSelections && v.availableForSale;
    });
  }

  const isSelectionComplete = !requiresSelection || Boolean(selectedVariant);

  return (
    <ProductSelectionContext.Provider
      value={{
        product,
        options,
        selectedOptions,
        setOption,
        requiresSelection,
        selectedVariant,
        isSelectionComplete,
        isValueAvailable,
      }}
    >
      {children}
    </ProductSelectionContext.Provider>
  );
}

export function useProductSelection(): ProductSelectionContextValue {
  const ctx = useContext(ProductSelectionContext);
  if (!ctx) {
    throw new Error("useProductSelection doit être utilisé à l'intérieur de ProductSelectionProvider");
  }
  return ctx;
}
