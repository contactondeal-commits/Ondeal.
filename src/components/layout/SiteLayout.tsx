"use client";

import { useState } from "react";
import Header from "./Header";
import MainNav from "./MainNav";
import Footer from "./Footer";
import CategoryMenu from "@/components/navigation/CategoryMenu";
import ToastContainer from "@/components/ui/ToastContainer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <a href="#main-content" className="visually-hidden">
        Aller au contenu principal
      </a>
      <Header onOpenCategoryMenu={() => setMenuOpen(true)} />
      <MainNav onOpenCategoryMenu={() => setMenuOpen(true)} />
      <CategoryMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main id="main-content">{children}</main>
      <Footer />
      {/* Mission CRO Phase 1 (2026-08-13) — P1-1 : monté une seule fois,
          globalement, pour que la confirmation d'ajout au panier fonctionne
          depuis n'importe quelle page (grille produit, fiche produit). */}
      <ToastContainer />
    </>
  );
}
