"use client";

import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useProductSelection } from "./ProductSelectionProvider";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import styles from "./MobileStickyCta.module.css";

// Combien de temps le bouton reste désactivé après un tap, pour absorber un
// double-tap accidentel (mission UX/UI 2026-08-13, ÉTAPE 2 — "absence de
// double ajout"). Purement une protection anti double-soumission locale,
// aucun lien avec Shopify.
const DOUBLE_TAP_GUARD_MS = 700;

// Mission UX/UI Phase 3 (2026-08-13) — P0 : marge de sécurité utilisée pour
// masquer la barre AVANT que le sentinel de fin (#sticky-cta-end-boundary)
// ne soit recouvert par la barre elle-même. Correspond à la hauteur réelle
// de la barre (~68px, voir --sticky-cta-height ci-dessous et
// MobileStickyCta.module.css) + une petite marge de sécurité. Remplace
// l'ancienne marge de `window.innerHeight` (un plein écran), qui masquait la
// barre bien trop tôt : sur ~45% des produits réels testés (catalogue avec
// peu/pas de caractéristiques, pas d'avis puisque reviewsCount est à 0 sur
// la quasi-totalité du catalogue — voir P2-2), la distance entre le bloc
// d'achat initial et la zone "produits liés" est plus courte qu'un écran
// mobile, ce qui rendait la fenêtre d'affichage nulle ou négative : la barre
// ne s'affichait alors JAMAIS, quel que soit le scroll (bug confirmé et
// reproduit en navigateur réel, voir reports/ondeal-ux-ui-phase3.md
// section 3).
const STICKY_BAR_SAFE_MARGIN_PX = 80;

/**
 * Mission CRO Phase 1 (2026-08-13) — P1-2 : aucune barre CTA sticky
 * n'existait sur mobile (voir reports/ondeal-cro-audit.md P1-2 — seule
 * occurrence de `position: sticky`/`fixed` dans tout le projet : le résumé
 * desktop du checkout). Cette barre :
 * - n'apparaît que sur mobile (masquée en CSS au-delà de 640px) ;
 * - ne s'affiche qu'une fois le bloc d'achat initial (`#add-to-cart-sentinel`,
 *   voir product/[slug]/page.tsx) sorti du viewport ;
 * - se masque à nouveau avant la zone "produits liés"/footer
 *   (`#sticky-cta-end-boundary`) pour ne jamais recouvrir le bouton
 *   "Ajouter au panier" d'un AUTRE produit (bug confirmé et corrigé le
 *   2026-08-13, voir reports/ondeal-ux-ui-audit.md ÉTAPE 2) ;
 * - respecte `product.inStock` réel (bouton désactivé si rupture de stock,
 *   jamais de fausse disponibilité) ;
 * - ajoute 1 unité (quantité par défaut, cohérent avec le pattern CTA
 *   sticky standard) via le même `useCart().addToCart` que le reste du
 *   site — la confirmation toast (P1-1) s'affiche donc automatiquement ;
 * - ne modifie ni ne contourne la logique Shopify Cart API existante.
 *
 * Détection de visibilité (corrigée le 2026-08-13) : l'implémentation
 * précédente utilisait uniquement `IntersectionObserver` à seuil 0. Bug
 * confirmé en conditions réelles de navigateur (voir
 * reports/ondeal-ux-ui-audit.md ÉTAPE 2) : un saut de scroll instantané en
 * un seul mouvement (ancre `#hash`, `scrollIntoView` non animé, certains
 * flings rapides mobile) fait passer le sentinel de "sous le viewport" à
 * "au-dessus du viewport" SANS qu'aucun échantillon intermédiaire ne le
 * capture comme intersectant — `IntersectionObserver` ne déclenche alors
 * aucun callback et la barre reste bloquée invisible. Remplacé par un calcul
 * de position direct (`getBoundingClientRect`) sur chaque `scroll`/`resize`,
 * limité à une fois par frame (`requestAnimationFrame`) : fiable quel que
 * soit le type de scroll, coût négligible (un seul calcul de rect par
 * frame, uniquement pendant un scroll actif).
 */
export default function MobileStickyCta({ product }: { product: Product }) {
  const [visible, setVisible] = useState(false);
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const guardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Mission "SÉLECTION DE TAILLE" (15/08/2026) — même sélection que le
  // panneau d'achat principal (ProductSelectionProvider, scopé à la fiche
  // produit) : la barre sticky ne doit jamais ajouter une taille/couleur
  // arbitraire si l'acheteur n'a pas encore choisi la sienne plus haut sur
  // la page.
  const { requiresSelection, isSelectionComplete, selectedVariant } = useProductSelection();

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    let ticking = false;

    function computeVisibility() {
      ticking = false;
      const sentinel = document.getElementById("add-to-cart-sentinel");
      const endBoundary = document.getElementById("sticky-cta-end-boundary");
      if (!sentinel || !mql.matches) {
        setVisible(false);
        return;
      }
      const pastInitialPanel = sentinel.getBoundingClientRect().top < 0;
      // Masquée seulement quand la zone "produits liés"/footer arrive dans
      // l'empreinte réelle de la barre (bas du viewport, ~68px), pour ne
      // jamais se superposer au CTA d'un autre produit — sans pour autant
      // masquer la barre un écran entier à l'avance (voir
      // STICKY_BAR_SAFE_MARGIN_PX ci-dessus).
      const reachedEndBoundary = endBoundary
        ? endBoundary.getBoundingClientRect().top < STICKY_BAR_SAFE_MARGIN_PX
        : false;
      setVisible(pastInitialPanel && !reachedEndBoundary);
    }

    function onScrollOrResize() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(computeVisibility);
    }

    computeVisibility(); // état initial (ex: page ouverte déjà scrollée via ancre)
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    mql.addEventListener("change", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      mql.removeEventListener("change", onScrollOrResize);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--sticky-cta-height", visible ? "68px" : "0px");
    return () => {
      document.documentElement.style.setProperty("--sticky-cta-height", "0px");
    };
  }, [visible]);

  useEffect(() => {
    return () => {
      if (guardTimeoutRef.current) clearTimeout(guardTimeoutRef.current);
    };
  }, []);

  if (!visible) return null;

  function handleAdd() {
    if (justAdded || !isSelectionComplete) return; // anti double-tap + jamais sans sélection complète
    // BUG FIX (02/09/2026) — garde de sécurité en profondeur : n'ajoute
    // jamais une variante résolue mais elle-même non disponible (voir
    // `selectedAvailable` plus bas, même logique).
    if (selectedVariant ? !selectedVariant.availableForSale : !product.inStock) return;
    addToCart(product, 1, selectedVariant);
    setJustAdded(true);
    guardTimeoutRef.current = setTimeout(() => setJustAdded(false), DOUBLE_TAP_GUARD_MS);
  }

  const needsSelection = requiresSelection && !isSelectionComplete;
  // BUG FIX (02/09/2026) — même correctif que AddToCartPanel.tsx : une fois
  // une variante précise résolue, c'est SA disponibilité réelle qui compte,
  // jamais l'agrégat `product.inStock` seul (voir mapStorefrontProduct dans
  // storefront.ts pour la cause racine côté `inStock`).
  const selectedAvailable = selectedVariant ? selectedVariant.availableForSale : product.inStock;

  return (
    <div className={styles.root} role="region" aria-label="Ajout rapide au panier">
      <div className={styles.info}>
        <span className={styles.title}>{product.title}</span>
        <span className={styles.price}>{formatPrice(selectedVariant?.price ?? product.price)}</span>
      </div>
      <button
        type="button"
        className={styles.cta}
        onClick={handleAdd}
        disabled={!selectedAvailable || justAdded || needsSelection}
      >
        <ShoppingCart size={17} />
        {!selectedAvailable
          ? "Rupture de stock"
          : needsSelection
            ? "Choisir une option ↑"
            : justAdded
              ? "Ajouté ✓"
              : "Ajouter au panier"}
      </button>
    </div>
  );
}
