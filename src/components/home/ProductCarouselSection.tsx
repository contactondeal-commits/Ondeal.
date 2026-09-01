"use client";

/**
 * Mission "GAMME RENTRÉE — carrousels produits" (19/08/2026) — demande
 * explicite du client : les sections "Nouveautés" et "Rentrée" doivent
 * défiler (comme le carrousel CategoryBlocks), pas rester dans une grille
 * statique qui s'agrandit en hauteur. Réutilise la même mécanique de
 * défilement auto (rAF, pause au survol/glissé/tactile, flèches) déjà
 * validée dans CategoryBlocks.tsx, mais adaptée aux vraies ProductCard
 * (voir ProductGrid.tsx pour la version grille classique, toujours utilisée
 * ailleurs sur le site — ce composant ne la remplace pas, il s'y ajoute).
 *
 * Différence volontaire avec CategoryBlocks : pas de duplication de la
 * liste pour boucler à l'infini (ici jusqu'à 100 produits réels pour
 * "Nouveautés" — doubler le DOM à 200 cartes coûterait cher pour un gain
 * cosmétique). À la place, un simple retour au début (`scrollLeft = 0`)
 * une fois la fin atteinte pendant le défilement automatique.
 */

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import type { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import styles from "./ProductCarouselSection.module.css";

const AUTO_SCROLL_PX_PER_FRAME = 0.6;
const RESUME_DELAY_MS = 1400;

interface ProductCarouselSectionProps {
  title: string;
  products: Product[];
  seeAllHref?: string;
}

export default function ProductCarouselSection({ title, products, seeAllHref }: ProductCarouselSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const isVisibleRef = useRef(true);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pause = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }, []);

  const scheduleResume = useCallback((delay: number = RESUME_DELAY_MS) => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, delay);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(track);

    // Correctif perf (19/08/2026) — signalé en direct par le client :
    // défilement saccadé/latence sur les sections rentrée & nouveautés
    // (jusqu'à 100 cartes pour "Nouveautés"). Cause : `track.scrollWidth`
    // et `track.clientWidth` sont des propriétés dépendantes de la mise en
    // page — les lire à CHAQUE frame (60x/seconde) forçait le navigateur à
    // recalculer le layout de la piste et de ses ~100 enfants à chaque
    // frame (forced synchronous reflow), un coût qui grandit avec le
    // nombre de cartes. La largeur totale de la piste ne change en réalité
    // qu'au montage ou lors d'un redimensionnement (les cartes ont une
    // largeur fixe en CSS, voir --card-w) — elle est donc mesurée une seule
    // fois puis mise en cache, et seulement recalculée via ResizeObserver.
    let maxScroll = 0;
    const measureMaxScroll = () => {
      maxScroll = track.scrollWidth - track.clientWidth;
    };
    measureMaxScroll();
    const resizeObserver = new ResizeObserver(measureMaxScroll);
    resizeObserver.observe(track);

    let rafId: number;
    let lastTimestamp: number | null = null;

    const tick = (timestamp: number) => {
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const deltaFrames = (timestamp - lastTimestamp) / (1000 / 60);
      lastTimestamp = timestamp;

      if (!pausedRef.current && isVisibleRef.current && maxScroll > 0) {
        track.scrollLeft += AUTO_SCROLL_PX_PER_FRAME * deltaFrames;
        if (track.scrollLeft >= maxScroll) track.scrollLeft = 0;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      resizeObserver.disconnect();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const scrollByViewport = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      pause();
      track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
      scheduleResume();
    },
    [pause, scheduleResume]
  );

  if (products.length === 0) return null;

  return (
    <section className={`${styles.section} container`}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <div className={styles.controls}>
          {seeAllHref && (
            <Link href={seeAllHref} className={styles.seeAll}>
              Tout voir <ArrowRight size={15} />
            </Link>
          )}
          <button type="button" className={styles.arrowBtn} onClick={() => scrollByViewport(-1)} aria-label="Précédent">
            <ChevronLeft size={18} />
          </button>
          <button type="button" className={styles.arrowBtn} onClick={() => scrollByViewport(1)} aria-label="Suivant">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        onMouseEnter={pause}
        onMouseLeave={() => scheduleResume(200)}
        onTouchStart={pause}
        onTouchEnd={() => scheduleResume()}
      >
        {products.map((p) => (
          <div key={p.id} className={styles.item}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
