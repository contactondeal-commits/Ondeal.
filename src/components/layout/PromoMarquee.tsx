import styles from "./PromoMarquee.module.css";

// Bandeau carrousel animé (10/09/2026) — Owner : "on peut faire un truc
// sympa" → "on les dispatch" → "crouselle avec le mouvement et haut bas
// page aussi". Remplace le PromoBar texte par les visuels badges fournis
// par le client (5 paliers -20/-30/-40/-50/-60%), en boucle infinie,
// monté deux fois dans SiteLayout : au-dessus du Header et juste avant
// le Footer (`reverse` sur la seconde pour varier le sens de défilement).
const BADGES = [20, 30, 40, 50, 60] as const;
const BADGE_WIDTH: Record<(typeof BADGES)[number], number> = {
  20: 308,
  30: 308,
  40: 308,
  50: 308,
  60: 313,
};

interface PromoMarqueeProps {
  reverse?: boolean;
}

export default function PromoMarquee({ reverse = false }: PromoMarqueeProps) {
  // Liste dupliquée : la piste anime de 0 à -50% de sa largeur, donc la
  // deuxième moitié (identique à la première) prend le relais pile au bon
  // endroit et la boucle est invisible.
  const items = [...BADGES, ...BADGES];

  return (
    <section
      className={styles.wrap}
      aria-label="Promotions en cours : jusqu'à -60% sur toute la boutique"
    >
      <div
        className={`${styles.track} ${reverse ? styles.trackReverse : ""}`}
        aria-hidden="true"
      >
        {items.map((tier, i) => (
          <img
            key={`${tier}-${i}`}
            src={`/promo/promo-${tier}.png`}
            alt=""
            className={styles.badge}
            width={BADGE_WIDTH[tier]}
            height={180}
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
