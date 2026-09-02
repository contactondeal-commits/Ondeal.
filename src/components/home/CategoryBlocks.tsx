"use client";

/**
 * Mission "REFONTE CIBLÉE DU BLOC DÉCOUVREZ NOS CATÉGORIES" (14/08/2026) —
 * évolution du carrousel de catégories vers un carrousel merchandising :
 * vraie photo produit OnDeal quand disponible et visuellement propre (repli
 * sur la photo d'ambiance de catégorie sinon), vrai titre produit, vrai prix
 * (et ancien prix/remise UNIQUEMENT si une remise réelle existe côté
 * Shopify — `Product.discount`, dérivé de `compareAtPriceRange`, voir
 * page.tsx `fetchCategoryHeroProducts` et src/lib/shopify/storefront.ts).
 * Aucune promotion, prix, pourcentage, stock ou libellé commercial n'est
 * jamais inventé — règle explicite de la mission.
 *
 * Mission "MERCHANDISING — vrais produits OnDeal" (15/08/2026) : le design/
 * les mécaniques du carrousel validées précédemment sont la BASE, non
 * retouchée ici (auto-scroll, boucle, flèches, pagination, pause survol/
 * tactile, responsive, accessibilité, prefers-reduced-motion — inchangés).
 * Seul le contenu merchandising de chaque carte change :
 *   - image : vraie photo du produit vitrine (`hero.images[0]`) quand ce
 *     produit existe et que son image a été vérifiée visuellement comme
 *     exploitable (voir page.tsx, `HERO_IMAGE_EXCLUDED_SLUGS` — écarte les
 *     photos avec texte publicitaire fournisseur incrusté ou montages
 *     illisibles) ; repli sur la photo d'ambiance de catégorie sinon
 *     (`cat.image`, seul cas restant : Animalerie, qui n'a qu'un seul
 *     produit disponible et son unique photo est une infographie
 *     inexploitable).
 *   - accroche commerciale : bandeau promo réel ("Offre du moment") si et
 *     seulement si `hero.discount` est réel et positif ; sinon accroche
 *     honnête (jamais de fausse urgence/rareté), choisie parmi une liste
 *     validée et assignée de façon stable par catégorie (pas de hasard —
 *     éviterait un mismatch d'hydratation SSR/client).
 *   - prix : `formatPrice(hero.price)` + `hero.oldPrice` barré uniquement
 *     si remise réelle. Aucun prix affiché si aucun produit vitrine
 *     disponible pour la catégorie.
 *
 * Toujours strictement local à ce composant : mêmes catégories, mêmes
 * routes /category/:slug, même palette/typo (variables CSS globales
 * existantes réutilisées telles quelles).
 */

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, Sparkles, Tag } from "lucide-react";
import { categories } from "@/data/categories";
import type { Category, Product } from "@/types";
import { formatPrice } from "@/lib/format";
import styles from "./CategoryBlocks.module.css";

const AUTO_SCROLL_PX_PER_FRAME = 0.55;
const RESUME_DELAY_MS = 1400;

/**
 * Mission "RESTAURATION CAMPAGNE RENTRÉE" (20/08/2026) — cette carte "Rentrée
 * scolaire" (première position du carrousel, ruban + code promo RENTREE20)
 * avait disparu du site suite à un déploiement Vercel effectué depuis une
 * copie locale de travail incomplète (voir CHANGELOG / rapport d'incident).
 * Restaurée à l'identique (mêmes textes, mêmes valeurs) à partir du HTML/JS
 * réellement servi par le dernier déploiement de production sain, jamais
 * réinventée.
 *
 * Mission "CATÉGORIE RENTRÉE SCOLAIRE DÉDIÉE" (20/08/2026) — demande client
 * explicite : cliquer sur cette carte doit désormais amener vers une vraie
 * catégorie du site (papeterie + bureau + informatique réunis, 228 produits
 * réels), pas seulement faire défiler la page d'accueil vers un aperçu.
 * "Rentrée scolaire" est maintenant une vraie catégorie de
 * src/data/categories.ts (id "rentree-scolaire") au lieu d'un objet
 * purement local — récupérée ici depuis `categories` plutôt que redéfinie,
 * pour ne jamais avoir deux sources de vérité différentes sur le même id.
 * Seuls le ruban et le code promo restent un traitement visuel propre à
 * cette carte (constantes ci-dessous, indépendantes de la catégorie).
 */
const RENTREE_CATEGORY_ID = "rentree-scolaire";
const RENTREE_PROMO_CODE = "RENTREE20";
const RENTREE_PROMO_LABEL = "-20% sur la commande";

/**
 * Mission "SECTION VOIR LE CATALOGUE" (20/08/2026) — carte "Voir le
 * catalogue" demandée explicitement par le client en 2e position du
 * carrousel, juste après "Rentrée scolaire". Objet purement local à ce
 * composant, contrairement à "Rentrée scolaire" (voir plus haut) : elle
 * pointe vers la page dédiée /catalogue (src/app/catalogue/page.tsx, qui
 * présente vraiment tous les produits actifs + les rayons), pas vers
 * /category/<slug> — volontairement absente de src/data/categories.ts pour
 * cette raison (mais bien ajoutée manuellement au menu "Toutes les
 * catégories", voir CategoryMenu.tsx). Utilise le visuel de campagne fourni
 * par le client le 20/08/2026 (identité de marque OnDeal), jamais
 * généré/inventé.
 */
const CATALOGUE_CATEGORY_ID = "voir-catalogue";
const CATALOGUE_CATEGORY: Category = {
  id: CATALOGUE_CATEGORY_ID,
  name: "Voir le catalogue",
  slug: "catalogue",
  icon: "LayoutGrid",
  image: "",
  description: "Meilleures ventes, nouveautés, beauté, bricolage, maison, vêtement, jouet, informatique.",
  children: [],
};

// Catégories réellement affichées dans le carrousel : la carte "Rentrée
// scolaire" en 1re position, "Voir le catalogue" en 2e position (voir
// missions ci-dessus), puis toutes les autres vraies catégories de
// navigation. "Rentrée scolaire" étant maintenant une vraie catégorie de
// `categories` (voir ci-dessus), on l'en extrait pour la mettre en tête
// plutôt que de la lister à sa position naturelle dans le tableau.
const rentreeCategory = categories.find((c) => c.id === RENTREE_CATEGORY_ID);
const otherCategories = categories.filter((c) => c.id !== RENTREE_CATEGORY_ID);
const CATEGORIES_WITH_RENTREE: Category[] = [
  ...(rentreeCategory ? [rentreeCategory] : []),
  CATALOGUE_CATEGORY,
  ...otherCategories,
];

// Accroches honnêtes utilisées quand aucune remise réelle n'existe sur le
// produit vitrine de la catégorie — jamais de "-X%"/urgence inventée.
// Liste validée explicitement par la mission (15/08/2026).
const HONEST_HOOKS = [
  "Sélection OnDeal",
  "Les incontournables",
  "À découvrir",
  "Nos favoris",
  "Nos bonnes affaires",
];

interface CategoryBlocksProps {
  /** Un vrai produit "vitrine" par catégorie de premier niveau — voir page.tsx. Peut être absent/null (catégorie sans produit disponible). */
  heroProducts?: Record<string, Product | null | undefined>;
}

export default function CategoryBlocks({ heroProducts = {} }: CategoryBlocksProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const isVisibleRef = useRef(true);
  const isPointerDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  // Corrigé le 15/08/2026 (bug urgent signalé par le client : clic sur une
  // catégorie sans effet sur PC/souris). `didDragRef` distingue un vrai
  // glissé d'un simple clic — voir handlePointerDown/Move/Click ci-dessous.
  const didDragRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef = useRef(0); // largeur carte + gap, mesurée dynamiquement
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

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

  // --- Auto-scroll (rAF) + pause hors-viewport + index actif ------------
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mission autonome (15/08/2026) — audit Lighthouse réel : le carrousel
    // démarrait son défilement automatique immédiatement au montage, avant
    // même la fin du chargement de la page. Ça déplace la 1ère carte (le
    // vrai élément LCP, voir plus haut) pendant que le navigateur mesure
    // encore la performance de chargement, et ça laisse zéro instant au
    // visiteur pour voir la rangée avant qu'elle bouge. Réutilise le
    // mécanisme pause/reprise déjà en place (inchangé) pour un simple délai
    // de démarrage — ni le comportement du défilement, ni les interactions
    // (survol/glissé/tactile/clic) ne sont modifiés.
    if (!prefersReducedMotion) {
      pause();
      scheduleResume(1200);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(track);

    const measureStep = () => {
      const first = track.children[0] as HTMLElement | undefined;
      const second = track.children[1] as HTMLElement | undefined;
      if (first && second) {
        stepRef.current = second.offsetLeft - first.offsetLeft;
      }
    };
    measureStep();
    const resizeObserver = new ResizeObserver(measureStep);
    resizeObserver.observe(track);

    const updateActiveIndex = () => {
      if (!stepRef.current) return;
      const newIndex = Math.round(track.scrollLeft / stepRef.current) % CATEGORIES_WITH_RENTREE.length;
      if (newIndex !== activeIndexRef.current) {
        activeIndexRef.current = newIndex;
        setActiveIndex(newIndex);
      }
    };

    if (prefersReducedMotion) {
      // Pas d'auto-scroll, mais l'index actif suit toujours le scroll manuel.
      const onScroll = () => updateActiveIndex();
      track.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        track.removeEventListener("scroll", onScroll);
        observer.disconnect();
        resizeObserver.disconnect();
        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      };
    }

    let rafId: number;
    let lastTimestamp: number | null = null;

    const tick = (timestamp: number) => {
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const deltaFrames = (timestamp - lastTimestamp) / (1000 / 60);
      lastTimestamp = timestamp;

      if (!pausedRef.current && isVisibleRef.current && !isPointerDraggingRef.current) {
        const halfWidth = track.scrollWidth / 2;
        track.scrollLeft += AUTO_SCROLL_PX_PER_FRAME * deltaFrames;
        if (track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth;
        }
      }
      // Toujours recalculé, même en pause (survol, glissé, tactile, clic sur
      // une flèche/un point) — sinon le point actif reste figé sur l'ancienne
      // position pendant toute interaction manuelle (bug constaté en test :
      // clic sur un point de pagination sans mise à jour visuelle du point actif).
      updateActiveIndex();
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      resizeObserver.disconnect();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
    // `pause`/`scheduleResume` sont des useCallback à dépendances vides
    // (référence stable) — les inclure ici ne change rien au comportement
    // (toujours un effet "montage uniquement"), juste satisfait la règle
    // exhaustive-deps depuis leur ajout dans cet effet (délai de démarrage).
  }, [pause, scheduleResume]);

  // --- Glissé à la souris (desktop) — le tactile utilise le scroll natif ---
  //
  // Bug corrigé le 15/08/2026 (urgent, signalé en direct par le client :
  // "quand je clique sur une catégorie via le PC rien ne s'ouvre, ça reste
  // sur la même page" — reproduit : chaque clic déclenchait
  // `track.setPointerCapture()` immédiatement au mousedown, même pour un
  // simple clic sans aucun déplacement de souris. Une fois le pointeur
  // capturé par le conteneur, le clic natif du <Link> enfant sous le
  // curseur n'était plus toujours délivré normalement par le navigateur
  // (comportement de capture inter-navigateurs peu fiable pour un clic pur
  // sans glissé) — résultat : aucune navigation, quel que soit l'endroit
  // cliqué dans le carrousel.
  //
  // Le glissé n'est maintenant réellement activé (et le pointeur capturé)
  // qu'après un déplacement dépassant un petit seuil (DRAG_THRESHOLD_PX) —
  // un simple clic sans déplacement ne capture jamais le pointeur et laisse
  // le <Link> réagir normalement. `didDragRef` empêche en plus qu'un vrai
  // glissé ne déclenche accidentellement une navigation au relâchement (voir
  // le gestionnaire onClickCapture posé sur le track).
  //
  // BUG FIX (02/09/2026) — le correctif du 15/08/2026 ci-dessus n'a
  // supprimé qu'UNE cause de clics cassés (capture systématique du
  // pointeur). Il en restait une seconde, plus insidieuse : signalé à
  // nouveau par le client le 02/09/2026 ("si un client clique sur une
  // catégorie, ça revient sur la première image, il ne peut pas cliquer"),
  // reproduit en conditions réelles sur ondeal.fr (simulation d'un clic
  // souris avec ~8px de tremblement entre mousedown et mouseup, tout à fait
  // normal pour un vrai visiteur — trackpad, léger mouvement de la main).
  // Avec l'ancien seuil (6px), ce tremblement dépassait DRAG_THRESHOLD_PX :
  // le clic était donc classé comme un glissé, `handleTrackClickCapture`
  // annulait alors la navigation (preventDefault/stopPropagation), ET
  // `handlePointerMove` déplaçait quand même `track.scrollLeft` du delta
  // mesuré — décalant le carrousel vers l'arrière à chaque tentative de clic
  // ratée. Répété plusieurs fois par un visiteur qui essaie de cliquer sans
  // succès, ce petit décalage cumulé donne l'impression que le carrousel
  // "revient sur la première image" au lieu de s'ouvrir. 6px est en dessous
  // du tremblement normal de la main lors d'un clic (constaté même avec une
  // souris standard, a fortiori au trackpad) : remonté à 20px, une valeur
  // usuelle pour ce genre de distinction clic/glissé (ex. Swiper.js), très
  // largement sous la distance d'un vrai geste de glissement intentionnel
  // (plusieurs dizaines de pixels) mais confortablement au-dessus du
  // tremblement accidentel d'un simple clic.
  const DRAG_THRESHOLD_PX = 20;

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const track = trackRef.current;
    if (!track) return;
    // Pas de capture ni de pause ici : on attend une vraie intention de
    // glisser (voir handlePointerMove) pour ne jamais interférer avec un
    // simple clic sur une carte.
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = track.scrollLeft;
    didDragRef.current = false;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const track = trackRef.current;
      if (!track) return;
      const delta = e.clientX - dragStartXRef.current;

      if (!isPointerDraggingRef.current) {
        // Pas encore en glissé : n'active le mode glissé (et ne capture le
        // pointeur) que si le déplacement dépasse le seuil — sinon un clic
        // normal continue son cours sans jamais passer par ce chemin.
        if (e.pointerType !== "mouse" || Math.abs(delta) < DRAG_THRESHOLD_PX) return;
        isPointerDraggingRef.current = true;
        didDragRef.current = true;
        pause();
        track.setPointerCapture(e.pointerId);
      }

      track.scrollLeft = dragStartScrollRef.current - delta;
    },
    [pause]
  );

  const endPointerDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse") return;
      if (isPointerDraggingRef.current) {
        isPointerDraggingRef.current = false;
        scheduleResume();
      }
    },
    [scheduleResume]
  );

  // Empêche un vrai glissé (didDragRef) de déclencher une navigation au
  // relâchement du clic, tout en laissant un clic pur (sans glissé) intact.
  const handleTrackClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (didDragRef.current) {
      e.preventDefault();
      e.stopPropagation();
      didDragRef.current = false;
    }
  }, []);

  const scrollByCards = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track || !stepRef.current) return;
      pause();
      track.scrollBy({ left: direction * stepRef.current, behavior: "smooth" });
      scheduleResume();
    },
    [pause, scheduleResume]
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track || !stepRef.current) return;
      pause();
      track.scrollTo({ left: index * stepRef.current, behavior: "smooth" });
      scheduleResume();
    },
    [pause, scheduleResume]
  );

  const loopedCategories = [...CATEGORIES_WITH_RENTREE, ...CATEGORIES_WITH_RENTREE];

  return (
    <section className={`${styles.section} container`} aria-labelledby="categories-heading">
      <div className={styles.headerRow}>
        <h2 id="categories-heading" className={styles.heading}>
          Découvrez nos catégories
        </h2>
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrowBtn}
            onClick={() => scrollByCards(-1)}
            aria-label="Catégorie précédente"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className={styles.arrowBtn}
            onClick={() => scrollByCards(1)}
            aria-label="Catégorie suivante"
          >
            <ChevronRight size={20} />
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
        onFocus={pause}
        onBlur={() => scheduleResume(200)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onPointerLeave={endPointerDrag}
        onClickCapture={handleTrackClickCapture}
      >
        {loopedCategories.map((cat, catIndex) => {
          const isClone = catIndex >= CATEGORIES_WITH_RENTREE.length;
          const isRentree = cat.id === RENTREE_CATEGORY_ID;
          const isCatalogue = cat.id === CATALOGUE_CATEGORY_ID;
          const hero = heroProducts[cat.id];

          // Image : la carte "Rentrée scolaire" et la carte "Voir le
          // catalogue" utilisent chacune leur propre photo de campagne
          // (jamais la photo d'ambiance générique "Mode" pourtant présente
          // dans `cat.image` — restaurée à l'identique pour Rentrée, voir
          // mission ci-dessus). Visuel "Voir le catalogue" fourni directement
          // par le client (identité de marque OnDeal) le 20/08/2026 — jamais
          // généré/inventé. Sinon, vraie photo du produit vitrine si un
          // produit exploitable a été retenu pour cette catégorie (voir
          // page.tsx, HERO_IMAGE_EXCLUDED_SLUGS), sinon repli sur la photo
          // d'ambiance de catégorie (cas Animalerie notamment).
          const imageSrc = isRentree
            ? "/campaigns/rentree-scolaire.jpg"
            : isCatalogue
              ? "/campaigns/catalogue.jpg"
              : hero?.images?.[0] || cat.image;
          const hasRealDiscount = typeof hero?.discount === "number" && (hero?.discount ?? 0) > 0;

          // Accroche stable par catégorie (index dans la liste source, pas
          // dans la liste dupliquée) — pas de Math.random() pour éviter tout
          // mismatch d'hydratation serveur/client.
          const sourceIndex = catIndex % CATEGORIES_WITH_RENTREE.length;
          const honestHook = HONEST_HOOKS[sourceIndex % HONEST_HOOKS.length];

          return (
            <Link
              key={`${cat.id}-${catIndex}`}
              href={isCatalogue ? "/catalogue" : `/category/${cat.slug}`}
              className={styles.card}
              aria-hidden={isClone || undefined}
              tabIndex={isClone ? -1 : undefined}
              draggable={false}
            >
              <span className={styles.imageWrap}>
                {imageSrc && (
                  <Image
                    src={imageSrc}
                    alt={
                      isRentree
                        ? "Rentrée scolaire — fournitures et accessoires OnDeal"
                        : isCatalogue
                          ? "Voir le catalogue OnDeal"
                          : hero
                            ? `${hero.title} — ${cat.name} OnDeal`
                            : `${cat.name} OnDeal`
                    }
                    fill
                    sizes="(max-width: 599px) 74vw, (max-width: 767px) 55vw, (max-width: 1023px) 34vw, (max-width: 1279px) 24vw, 21vw"
                    className={styles.image}
                    // Mission autonome (15/08/2026) — audit Lighthouse réel :
                    // cette image (première carte, catIndex 0) est le
                    // véritable élément LCP de la page d'accueil (confirmé
                    // par l'audit : `lcp-discovery-insight` signalait
                    // l'absence de fetchpriority=high). ATTENTION : `priority`
                    // est DÉPRÉCIÉ depuis Next.js 16 (voir
                    // node_modules/next/dist/docs/.../image.md, lu avant ce
                    // correctif conformément à AGENTS.md) — remplacé par
                    // `preload` pour le <link> seul, MAIS la doc précise
                    // explicitement d'utiliser `fetchPriority="high"` +
                    // `loading="eager"` plutôt que `preload` seul dès qu'on
                    // veut le vrai signal fetchpriority=high (ce que `preload`
                    // seul n'ajoute PAS). Réservé au seul vrai candidat LCP
                    // (catIndex 0) — pas aux 3 premières cartes, sinon la
                    // priorité se dilue entre plusieurs images.
                    fetchPriority={catIndex === 0 ? "high" : undefined}
                    loading={catIndex === 0 ? "eager" : isClone ? "lazy" : catIndex < 3 ? "eager" : "lazy"}
                    draggable={false}
                  />
                )}
                <span className={styles.overlay} aria-hidden="true" />
                {isRentree && <span className={styles.rentreeOverlay} aria-hidden="true" />}
              </span>

              {isRentree ? (
                <span className={styles.rentreeRibbon}>
                  <Sparkles size={12} aria-hidden="true" /> Rentrée scolaire
                </span>
              ) : isCatalogue ? (
                <span className={styles.catalogueRibbon}>
                  <LayoutGrid size={12} aria-hidden="true" /> Tout le catalogue
                </span>
              ) : (
                <span className={hasRealDiscount ? styles.badge : styles.hookBadge}>
                  {hasRealDiscount ? (
                    <>Jusqu&rsquo;à -{hero!.discount}%</>
                  ) : (
                    <>
                      <Sparkles size={12} aria-hidden="true" /> {honestHook}
                    </>
                  )}
                </span>
              )}

              <span className={styles.textBlock}>
                <span className={isRentree || isCatalogue ? styles.rentreeLabel : styles.label}>{cat.name}</span>
                <span className={styles.subtitle}>{isRentree || isCatalogue ? cat.description : hero ? hero.title : cat.description}</span>

                {isRentree && (
                  <span className={styles.rentreePromoRow}>
                    <Tag size={13} aria-hidden="true" />
                    <span className={styles.rentreePromoCode}>{RENTREE_PROMO_CODE}</span>
                    <span className={styles.rentreePromoLabel}>{RENTREE_PROMO_LABEL}</span>
                  </span>
                )}
                {!isRentree && !isCatalogue && hero && (
                  <span className={styles.priceRow}>
                    <span className={styles.price}>{formatPrice(hero.price)}</span>
                    {hasRealDiscount && hero.oldPrice && (
                      <span className={styles.oldPrice}>{formatPrice(hero.oldPrice)}</span>
                    )}
                  </span>
                )}

                <span className={isRentree || isCatalogue ? styles.rentreeCta : styles.cta}>
                  {isRentree
                    ? "Découvrir la sélection"
                    : isCatalogue
                      ? "Explorer le catalogue"
                      : hero
                        ? "Découvrir l'offre"
                        : "Découvrir la catégorie"}{" "}
                  <span aria-hidden="true">→</span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className={styles.dots} role="tablist" aria-label="Aller à une catégorie">
        {CATEGORIES_WITH_RENTREE.map((cat, i) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={i === activeIndex}
            aria-label={cat.name}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
            onClick={() => scrollToIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
