import type { Metadata, Viewport } from "next";
import Script from "next/script";
import SiteLayout from "@/components/layout/SiteLayout";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/site-config";
import { COMPANY_LEGAL_NAME, COMPANY_EMAIL } from "@/lib/company-info";
import { safeJsonLdString } from "@/lib/seo";
import "./globals.css";

/**
 * Phase 1 SEO (mission audit 2026-09-02) — metadata globale + JSON-LD
 * Organization, absentes jusqu'ici de la racine du site.
 *
 * GA4 : aucun identifiant de mesure (G-XXXXXXX) n'a été trouvé ni dans
 * .env.local ni ailleurs dans le projet — seul Google Ads (AW-18380483895)
 * est câblé. Le script ci-dessous ne s'active QUE si
 * NEXT_PUBLIC_GA4_MEASUREMENT_ID est défini, pour ne jamais injecter un ID
 * inventé. Ajouter cette variable dans .env.local (et sur Vercel) pour
 * activer GA4 sans autre modification de code.
 */
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["boutique en ligne", "acheter en ligne", "électronique", "mode", "maison", "france"],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_TAGLINE,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

// Largeur/échelle par défaut de Next.js déjà correctes ; on fixe seulement
// la couleur de thème sur le violet de marque (--color-primary, globals.css).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  legalName: COMPANY_LEGAL_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  email: COMPANY_EMAIL,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: COMPANY_EMAIL,
    availableLanguage: "French",
  },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    name: "Médiateur de la consommation CM2C",
    url: "https://www.cm2c.net",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(organizationJsonLd) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18380483895"
          strategy="afterInteractive"
        />
        <Script id="google-ads-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18380483895');
          `}
        </Script>
        {GA4_MEASUREMENT_ID && (
          <Script id="ga4-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('config', '${GA4_MEASUREMENT_ID}');
            `}
          </Script>
        )}
      </head>
      <body>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
