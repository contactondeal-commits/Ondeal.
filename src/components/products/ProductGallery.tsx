"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import styles from "./ProductGallery.module.css";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

// Mission UX/UI Phase 4 (2026-08-13) — P1 (audit dialogues/overlays,
// section 6) : même sélecteur que src/components/ui/Drawer.tsx, dupliqué
// localement à dessein (implémentation simple et locale, sans nouvelle
// dépendance ni abstraction partagée — cohérent avec la consigne de la
// mission pour le piège de focus des drawers).
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const zoomTriggerRef = useRef<HTMLButtonElement>(null);
  const fullscreenCloseRef = useRef<HTMLButtonElement>(null);
  const fullscreenPanelRef = useRef<HTMLDivElement>(null);

  /*
    Mission UX/UI Phase 3 (2026-08-13) — P1 (audit accessibilité, galerie
    PDP) : la superposition plein écran est déclarée role="dialog"
    aria-modal="true" mais n'avait ni gestion de la touche Escape, ni focus
    déplacé vers elle à l'ouverture, ni focus rendu au déclencheur à la
    fermeture — confirmé en navigateur réel (Escape n'avait aucun effet).
    Alignement sur le même pattern déjà utilisé et éprouvé par
    src/components/ui/Drawer.tsx dans ce projet (aucun nouveau pattern
    introduit).
  */
  const wasFullscreenRef = useRef(false);

  useEffect(() => {
    if (fullscreen) {
      fullscreenCloseRef.current?.focus();
      wasFullscreenRef.current = true;
      function onKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") setFullscreen(false);
      }
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }
    // Ne rend le focus au déclencheur que si le plein écran vient réellement
    // de se fermer — évite de voler le focus au chargement initial de page
    // (fullscreen démarre à false, aucune fermeture n'a encore eu lieu).
    if (wasFullscreenRef.current) {
      zoomTriggerRef.current?.focus();
      wasFullscreenRef.current = false;
    }
  }, [fullscreen]);

  /*
    Mission UX/UI Phase 4 (2026-08-13) — P1 (section 6, audit des
    dialogues/overlays) : `role="dialog" aria-modal="true"` implique un
    piège de focus, mais aucun n'existait — confirmé en navigateur réel
    (Tab depuis le bouton "Fermer" du plein écran sortait vers les boutons
    "Ajouter au panier"/"Acheter maintenant" du panneau d'achat sous la
    superposition). Même logique que le piège de focus ajouté à
    src/components/ui/Drawer.tsx dans cette même mission (voir ce fichier
    pour le détail du raisonnement) : Tab/Shift+Tab bouclent à l'intérieur
    du plein écran tant qu'il est affiché, sans tabindex positif.
  */
  useEffect(() => {
    if (!fullscreen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const panel = fullscreenPanelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [fullscreen]);

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function onTouchStart(e: React.TouchEvent) {
    (e.currentTarget as HTMLElement).dataset.touchStartX = String(e.touches[0].clientX);
  }
  function onTouchEnd(e: React.TouchEvent) {
    const startX = Number((e.currentTarget as HTMLElement).dataset.touchStartX ?? 0);
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 40) next();
    else if (endX - startX > 40) prev();
  }

  return (
    <div className={styles.root}>
      <div
        className={styles.mainImage}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <PlaceholderImage seed={images[index]} label={`${title} — image ${index + 1}`} rounded />
        {images.length > 1 && (
          <>
            <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={prev} aria-label="Image précédente">
              <ChevronLeft size={20} />
            </button>
            <button className={`${styles.navBtn} ${styles.navNext}`} onClick={next} aria-label="Image suivante">
              <ChevronRight size={20} />
            </button>
          </>
        )}
        <button
          ref={zoomTriggerRef}
          className={styles.zoomBtn}
          onClick={() => setFullscreen(true)}
          aria-label="Voir en plein écran"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {images.length > 1 && (
        <div className={styles.thumbs} role="tablist" aria-label="Miniatures produit">
          {images.map((img, i) => (
            <button
              key={img + i}
              role="tab"
              aria-selected={i === index}
              className={`${styles.thumb} ${i === index ? styles.thumbActive : ""}`}
              onClick={() => setIndex(i)}
            >
              <PlaceholderImage seed={img} label={`Miniature ${i + 1}`} rounded />
            </button>
          ))}
        </div>
      )}

      {fullscreen && (
        <div
          ref={fullscreenPanelRef}
          className={styles.fullscreenOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Image en plein écran"
        >
          <button
            ref={fullscreenCloseRef}
            className={styles.closeBtn}
            onClick={() => setFullscreen(false)}
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
          <div className={styles.fullscreenImage}>
            <PlaceholderImage seed={images[index]} label={title} rounded={false} />
          </div>
          {images.length > 1 && (
            <>
              <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={prev} aria-label="Image précédente">
                <ChevronLeft size={24} />
              </button>
              <button className={`${styles.navBtn} ${styles.navNext}`} onClick={next} aria-label="Image suivante">
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
