"use client";

import { useEffect, useState, useCallback, type MouseEvent } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import styles from "./Hero.module.css";

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bg: string;
  /** Optionnel — badge code promo cliquable (copie dans le presse-papiers), voir slide "rentree" ci-dessous. */
  promoCode?: string;
  promoLabel?: string;
  /**
   * Optionnel — visuel plein cadre (déjà designé avec son propre texte/CTA
   * intégrés à l'image) : quand présent, le titre/sous-titre/CTA texte ne
   * sont PAS ré-affichés par-dessus (ils resteraient dans le DOM pour
   * l'accessibilité/SEO mais visuellement masqués) — toute la diapositive
   * devient un unique lien cliquable vers `href`. Voir Owner (10/09/2026).
   */
  image?: string;
}

// Owner (10/09/2026) — remplacement complet des 3 diapositives génériques
// (dégradés + texte) par la bannière "GRANDE PROMO -60%" fournie par le
// client : "une carrosselle deja" → "Oui, remplace les 3 diapos actuelles".
// L'ancienne campagne "Rentrée" (code RENTREE20, expiré côté Shopify le
// 07/09/2026) avait déjà été retirée pour ne laisser aucun code mort
// affiché ; les 2 diapositives restantes ("high-tech" / "mode") sont
// retirées ici à la demande explicite du client, au profit d'une diapo
// unique, plus impactante, cohérente avec le carrousel de badges
// (PromoMarquee, voir SiteLayout.tsx) ajouté au même moment.
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "grande-promo",
    title: "Grande Promo — Jusqu'à -60% sur toute la boutique",
    subtitle: "Économisez aujourd'hui sur le high-tech, la mode, la maison, la beauté, le sport et bien plus.",
    cta: "J'en profite maintenant",
    href: "/catalogue",
    // Dégradé de secours (visible si l'image n'a pas encore chargé, ou en
    // transparence si jamais elle échoue à charger) — mêmes teintes de
    // marque que l'ancienne diapo "s1".
    bg: "linear-gradient(120deg, #0c1f32, #1e1b4b)",
    image: "/promo/hero-grande-promo.jpg",
  },
];

interface HeroProps {
  slides?: HeroSlide[];
  autoplayMs?: number;
}

export default function Hero({ slides = DEFAULT_SLIDES, autoplayMs = 6000 }: HeroProps) {
  const [index, setIndex] = useState(0);
  // Retour visuel "Copié !" après clic sur le badge de code promo (restauré
  // avec la diapositive "rentree" — voir mission 20/08/2026 ci-dessus).
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    // Owner (10/09/2026) : diapositive unique désormais par défaut — pas
    // d'intervalle inutile à ré-armer toutes les 6s pour revenir sur la
    // même diapo (et les flèches/pastilles de pagination ci-dessous sont
    // masquées dans le même esprit quand il n'y a qu'une seule diapo).
    if (!autoplayMs || slides.length <= 1) return;
    const id = setInterval(next, autoplayMs);
    return () => clearInterval(id);
  }, [next, autoplayMs, slides.length]);

  useEffect(() => {
    if (!copiedCode) return;
    const id = setTimeout(() => setCopiedCode(null), 2000);
    return () => clearTimeout(id);
  }, [copiedCode]);

  const handleCopyPromoCode = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
    } catch {
      // Presse-papiers indisponible (permissions, contexte non sécurisé…) —
      // échec silencieux, le code reste affiché et copiable manuellement.
    }
  }, []);

  // CTA de la diapositive "rentree" pointe vers une ancre de la même page
  // (/#rentree) : un vrai scroll fluide vaut mieux qu'une navigation Link
  // complète pour une ancre locale.
  const handleCtaClick = useCallback((event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("/#")) return;
    const targetId = href.slice(2);
    const target = document.getElementById(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", href);
    }
  }, []);

  const slide = slides[index];

  const hasImage = Boolean(slide.image);
  const background = hasImage
    ? `url(${slide.image}) center / cover no-repeat, ${slide.bg}`
    : slide.bg;

  return (
    <section className={styles.root} aria-roledescription="carousel" aria-label="Mises en avant">
      <div className={styles.slide} style={{ background }}>
        {hasImage ? (
          // Owner (10/09/2026) : le visuel intègre déjà tout le texte/CTA
          // ("GRANDE PROMO -60%", bouton "J'EN PROFITE MAINTENANT") — pas
          // de doublon par-dessus. Toute la diapositive devient un seul
          // lien cliquable ; titre/sous-titre restent dans le DOM pour les
          // lecteurs d'écran (image purement décorative visuellement).
          <Link
            href={slide.href}
            className={styles.imageLink}
            aria-label={`${slide.title} — ${slide.subtitle}`}
            onClick={(e) => handleCtaClick(e, slide.href)}
          />
        ) : (
          <div className={`${styles.content} container`}>
            {slide.promoCode && (
              <button
                type="button"
                className={styles.promoBadge}
                onClick={() => handleCopyPromoCode(slide.promoCode!)}
                aria-label={`Copier le code promo ${slide.promoCode}${slide.promoLabel ? `, ${slide.promoLabel}` : ""}`}
              >
                {slide.promoLabel && <span className={styles.promoLabel}>{slide.promoLabel}</span>}
                <span className={styles.promoCodeChip}>
                  <span className={styles.promoCodeText}>{slide.promoCode}</span>
                  {copiedCode === slide.promoCode ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                </span>
                <span className={styles.promoHint}>{copiedCode === slide.promoCode ? "Copié !" : "Cliquer pour copier"}</span>
              </button>
            )}
            <h1 className={styles.title}>{slide.title}</h1>
            <p className={styles.subtitle}>{slide.subtitle}</p>
            <Link href={slide.href} className={styles.cta} onClick={(e) => handleCtaClick(e, slide.href)}>
              {slide.cta}
            </Link>
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button className={`${styles.nav} ${styles.navPrev}`} onClick={prev} aria-label="Diapositive précédente">
            <ChevronLeft size={22} />
          </button>
          <button className={`${styles.nav} ${styles.navNext}`} onClick={next} aria-label="Diapositive suivante">
            <ChevronRight size={22} />
          </button>

          <div className={styles.indicators} role="tablist" aria-label="Choisir une diapositive">
            {slides.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={i === index}
                aria-label={`Diapositive ${i + 1}`}
                className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
