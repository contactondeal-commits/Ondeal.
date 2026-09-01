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
}

// Mission "RESTAURATION CAMPAGNE RENTRÉE" (20/08/2026) — cette diapositive
// avait disparu du site suite à un déploiement Vercel effectué depuis une
// copie locale de travail incomplète (voir CHANGELOG / rapport d'incident).
// Restaurée à l'identique (mêmes textes, mêmes valeurs, même code promo
// RENTREE20 déjà actif côté remises Shopify) à partir du HTML/JS réellement
// servi par le dernier déploiement de production sain, jamais réinventée.
const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "rentree",
    title: "C'est la rentrée !",
    subtitle: "Cartables, trousses et fournitures des plus grandes marques, prêts à partir.",
    cta: "Voir la sélection rentrée",
    href: "/#rentree",
    bg: "linear-gradient(120deg, #4f46e5, #312e81)",
    promoCode: "RENTREE20",
    promoLabel: "-20% sur toute la commande",
  },
  {
    id: "s1",
    title: "Découvrez nos meilleures offres",
    subtitle: "Les produits que vous recherchez au meilleur prix.",
    cta: "Découvrir maintenant",
    href: "/search?q=&sort=price_asc",
    // Mission IDENTITÉ VISUELLE (2026-08-13) — ancien dégradé bleu vif
    // générique (#1a56db, placeholder pré-mission) remplacé par le vrai
    // bleu foncé de marque échantillonné depuis le logo officiel (#0c1f32).
    // Le CTA orange (styles.cta → var(--color-secondary)) reste inchangé et
    // ressort naturellement sur ce fond navy.
    bg: "linear-gradient(120deg, #3730a3, #1e1b4b)",
  },
  {
    id: "s2",
    title: "La rentrée high-tech commence ici",
    subtitle: "Smartphones, ordinateurs et accessoires sélectionnés pour vous.",
    cta: "Voir la sélection",
    href: "/category/electronique",
    bg: "linear-gradient(120deg, #4f46e5, #312e81)",
  },
  {
    id: "s3",
    title: "Nouveautés mode de la semaine",
    subtitle: "Les dernières tendances pour toute la famille.",
    cta: "Explorer la mode",
    href: "/category/mode",
    bg: "linear-gradient(120deg, #2563eb, #1d4ed8)",
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
    if (!autoplayMs) return;
    const id = setInterval(next, autoplayMs);
    return () => clearInterval(id);
  }, [next, autoplayMs]);

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

  return (
    <section className={styles.root} aria-roledescription="carousel" aria-label="Mises en avant">
      <div className={styles.slide} style={{ background: slide.bg }}>
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
      </div>

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
    </section>
  );
}
