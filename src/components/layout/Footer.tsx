import Link from "next/link";
import Image from "next/image";
import { SITE_NAME, SHOPIFY_ACCOUNT_URL, SOCIAL_LINKS } from "@/lib/site-config";
import NewsletterForm from "./NewsletterForm";
import ManageCookiesLink from "@/components/analytics/ManageCookiesLink";
import TrustBadge from "@/components/ui/TrustBadge";
import styles from "./Footer.module.css";

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.4 2.2 1.9 3.7 4.1 4v2.9c-1.5 0-2.9-.4-4.1-1.3v6.6c0 3.3-2.7 5.8-6 5.8s-6-2.5-6-5.8 2.7-5.8 6-5.8c.4 0 .8 0 1.2.1v3c-.4-.1-.8-.2-1.2-.2-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9 3-1.3 3-3V3h3z" />
    </svg>
  );
}

const COLUMNS = [
  {
    title: "À propos",
    links: [
      { label: "À propos de nous", href: "/about" },
      { label: "Carrières", href: "/careers" },
      { label: "Presse", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Service client",
    links: [
      { label: "Aide", href: "/help" },
      { label: "Livraison", href: "/legal/livraison" },
      { label: "Retours", href: "/legal/retours" },
      { label: "Garantie", href: "/legal/garantie" },
    ],
  },
  {
    title: "Compte",
    links: [
      { label: "Votre compte", href: SHOPIFY_ACCOUNT_URL },
      { label: "Vos commandes", href: SHOPIFY_ACCOUNT_URL },
      { label: "Favoris", href: "/wishlist" },
    ],
  },
  {
    title: "Partenaires",
    links: [
      { label: "Devenir partenaire", href: "/partenaires" },
      { label: "Nos partenaires", href: "/partenaires" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: "CGV", href: "/legal/cgv" },
      { label: "Confidentialité", href: "/legal/confidentialite" },
      { label: "Cookies", href: "/legal/cookies" },
      { label: "Mentions légales", href: "/legal/mentions-legales" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.brandRow} container`}>
        <Link href="/" className={styles.logoChip} aria-label={`${SITE_NAME} — Retour à l'accueil`}>
          <Image src="/brand/ondeal-logo.png" alt={SITE_NAME} width={1524} height={511} className={styles.logoImg} />
        </Link>

        {/* Badge de confiance Judge.me */}
        <div className={styles.trustBadgeWrap}>
          <TrustBadge rating={4.61} reviewsCount={259} />
        </div>

        <div className={styles.socialLinks}>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Ondeal sur Instagram" className={styles.socialIcon}>
            <InstagramIcon />
          </a>
          <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" aria-label="Ondeal sur TikTok" className={styles.socialIcon}>
            <TikTokIcon />
          </a>
        </div>
      </div>

      <div className={`${styles.newsletterRow} container`}>
        <NewsletterForm />
      </div>

      <div className={`${styles.grid} container`}>
        {COLUMNS.map((col) => (
          <div key={col.title} className={styles.column}>
            <h3 className={styles.title}>{col.title}</h3>
            <ul>
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              {col.title === "Informations" && (
                <li>
                  <ManageCookiesLink className={styles.cookiesButton} />
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className={styles.bottom}>
        <div className="container">© 2026 {SITE_NAME} — Tous droits réservés.</div>
      </div>
    </footer>
  );
}
