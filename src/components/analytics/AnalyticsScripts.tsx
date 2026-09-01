"use client";

import Script from "next/script";
import { useCookieConsentStore } from "@/store/cookieConsentStore";

/**
 * Mission "PLAN MARKETING" (15/08/2026) — audit du site : aucun outil de
 * mesure n'était installé (ni Google Analytics, ni Meta Pixel), rendant
 * toute pub payante impossible à optimiser ou même à mesurer. Ce composant
 * charge ces deux outils UNIQUEMENT si leurs identifiants sont réellement
 * configurés (NEXT_PUBLIC_GA4_MEASUREMENT_ID / NEXT_PUBLIC_META_PIXEL_ID) —
 * jamais d'ID inventé, jamais de script chargé "au cas où". Tant que ces
 * variables sont vides, ce composant ne rend rien : comportement actuel du
 * site inchangé.
 *
 * Ces identifiants sont volontairement préfixés NEXT_PUBLIC_ : contrairement
 * aux tokens Shopify, un ID de mesure GA4/Pixel n'est pas un secret — il est
 * de toute façon visible en clair dans le code source de n'importe quel site
 * qui l'utilise (c'est un identifiant public, pas une clé d'accès).
 *
 * Mission "BANDEAU CONSENTEMENT COOKIES" (18/08/2026) — passage en Client
 * Component : ces deux identifiants étant configurés en production sans
 * qu'aucun consentement ne soit demandé, ce composant se branche désormais
 * sur useCookieConsentStore (voir ce fichier) et ne charge GA4 que si
 * `analytics === true`, le Pixel Meta que si `marketing === true`. Avant la
 * première réponse au bandeau (hasChosen === false) ou après un refus, les
 * deux scripts restent bloqués — conforme à l'exigence RGPD/ePrivacy de
 * consentement préalable pour les cookies non essentiels.
 */
export default function AnalyticsScripts() {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

  const hasHydrated = useCookieConsentStore((s) => s.hasHydrated);
  const analyticsAllowed = useCookieConsentStore((s) => s.analytics);
  const marketingAllowed = useCookieConsentStore((s) => s.marketing);

  // Avant hydratation localStorage, on ne sait pas encore si le visiteur a
  // déjà consenti lors d'une visite précédente — mieux vaut ne rien charger
  // une fraction de seconde de trop que charger un traceur sans certitude
  // de consentement.
  if (!hasHydrated) return null;

  return (
    <>
      {ga4Id && analyticsAllowed && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}');`}
          </Script>
        </>
      )}

      {googleAdsId && marketingAllowed && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`} strategy="afterInteractive" />
          <Script id="google-ads-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAdsId}');`}
          </Script>
        </>
      )}

      {metaPixelId && marketingAllowed && (
        <>
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');`}
          </Script>
          {/* pixel de secours obligatoire hors-JS (noscript) — ne peut pas être un composant next/image optimisé */}
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
}
