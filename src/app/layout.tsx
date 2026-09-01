import ScrollToTop from "@/components/ui/ScrollToTop";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteLayout from "@/components/layout/SiteLayout";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import CookieConsentBanner from "@/components/analytics/CookieConsentBanner";
import { LocationProvider } from "@/context/LocationContext";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Boutique en Ligne`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  appleWebApp: {
    title: SITE_NAME,
    capable: true,
    statusBarStyle: "default",
  },
  openGraph: {
    title: `${SITE_NAME} — Boutique en Ligne`,
    description: "Des milliers de produits, une navigation rapide, une expérience fiable.",
    siteName: SITE_NAME,
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Boutique en Ligne`,
    description: "Des milliers de produits, une navigation rapide, une expérience fiable.",
  },
  other: {
    "p:domain_verify": "e291ffa51c68b8cddb997760e291ae41",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c1f32",
};

export default function RootLayout(props: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>
        <LocationProvider>
          <SiteLayout>{props.children}</SiteLayout>
          <ScrollToTop />
          <AnalyticsScripts />
          <CookieConsentBanner />
        </LocationProvider>
      </body>
    </html>
  );
}
