"use client";

import { useState } from "react";
import Header from "./Header";
import MainNav from "./MainNav";
import Footer from "./Footer";
import PromoMarquee from "./PromoMarquee";
import CategoryMenu from "@/components/navigation/CategoryMenu";
import ToastContainer from "@/components/ui/ToastContainer";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <a href="#main-content" className="visually-hidden">
        Aller au contenu principal
      </a>
      {/* Owner (10/09/2026) : "vu que toute la boutique est à moins 50%
          presque ça vaudrait le coup d'afficher la promo" → "on peut faire
          un truc sympa" → "on les dispatch" → "crouselle avec le mouvement
          et haut bas page aussi" — remplace l'ancien PromoBar (texte) par
          le carrousel animé des badges -20/-30/-40/-50/-60% fournis par le
          client, monté deux fois : ici en haut, et une seconde fois juste
          avant le Footer (sens inversé), pour être visible sur toutes les
          pages sans dépendre du scroll. */}
      <PromoMarquee />
      <Header onOpenCategoryMenu={() => setMenuOpen(true)} />
      <MainNav onOpenCategoryMenu={() => setMenuOpen(true)} />
      <CategoryMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main id="main-content">{children}</main>
      <PromoMarquee reverse />
      <Footer />
      {/* Mission CRO Phase 1 (2026-08-13) — P1-1 : monté une seule fois,
          globalement, pour que la confirmation d'ajout au panier fonctionne
          depuis n'importe quelle page (grille produit, fiche produit). */}
      <ToastContainer />
      {/* Fix 02-09-2026 : le composant ScrollToTop existait déjà mais n'était
          jamais monté nulle part dans l'arbre — le bouton "retour en haut"
          était donc invisible sur tout le site alors que sa logique de
          visibilité au scroll (scrollY > 400) fonctionnait très bien. */}
      <ScrollToTop />
    </>
  );
}
