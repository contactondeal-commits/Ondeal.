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

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 7.2s-.2-1.6-.9-2.4c-.9-1-1.9-1-2.3-1C17.4 3.5 12 3.5 12 3.5s-5.4 0-8.3.3c-.4 0-1.4 0-2.3 1-.7.8-.9 2.4-.9 2.4S.2 9.1.2 11v1.9c0 1.9.3 3.8.3 3.8s.2 1.6.9 2.4c.9 1 2.1.9 2.6 1 1.9.2 8 .3 8 .3s5.4 0 8.3-.3c.4 0 1.4 0 2.3-1 .7-.8.9-2.4.9-2.4s.3-1.9.3-3.8V11c0-1.9-.3-3.8-.3-3.8zM9.7 15V8.4l6.4 3.3-6.4 3.3z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.2-2 0-2.9.2-.8 1.3-5.4 1.3-5.4s-.3-.7-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.6 0 1-.6 2.4-.9 3.7-.3 1.1.5 2 1.6 2 1.9 0 3.4-2 3.4-5 0-2.6-1.9-4.4-4.6-4.4-3.1 0-5 2.3-5 4.8 0 .9.3 1.5.7 2 .2.2.2.3.1.5l-.3 1c-.1.3-.3.4-.6.2-1.3-.5-1.9-2-1.9-3.6 0-2.7 2.3-6 6.8-6 3.6 0 6 2.6 6 5.4 0 3.7-2.1 6.5-5.1 6.5-1 0-2-.5-2.3-1.1l-.6 2.4c-.2.9-.7 1.9-1.1 2.6.8.2 1.7.4 2.6.4 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
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
          {SOCIAL_LINKS.facebook && (
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Ondeal sur Facebook" className={styles.socialIcon}>
              <FacebookIcon />
            </a>
          )}
          {SOCIAL_LINKS.youtube && (
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label="Ondeal sur YouTube" className={styles.socialIcon}>
              <YouTubeIcon />
            </a>
          )}
          {SOCIAL_LINKS.pinterest && (
            <a href={SOCIAL_LINKS.pinterest} target="_blank" rel="noopener noreferrer" aria-label="Ondeal sur Pinterest" className={styles.socialIcon}>
              <PinterestIcon />
            </a>
          )}
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
