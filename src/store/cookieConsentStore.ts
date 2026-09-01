"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Mission "BANDEAU CONSENTEMENT COOKIES" (18/08/2026) — Google Analytics 4
 * et le Pixel Meta sont actifs en production (voir
 * src/components/analytics/AnalyticsScripts.tsx) dès que leurs identifiants
 * sont configurés côté Vercel, sans qu'aucun consentement ne soit demandé
 * au visiteur au préalable. Signalé par le client comme non conforme au
 * RGPD/ePrivacy (cookies de mesure d'audience et publicitaires soumis à
 * consentement préalable, contrairement aux cookies strictement
 * nécessaires comme le panier — voir CNIL, recommandation cookies 2020).
 *
 * Ce store est la source de vérité du consentement, persistée en
 * localStorage (pas dans un cookie — pas besoin qu'il soit lisible
 * serveur, et cohérent avec le choix déjà fait pour panier/favoris, voir
 * cartStore.ts/wishlistStore.ts). AnalyticsScripts.tsx ne charge GA4/Meta
 * Pixel QUE si `analytics`/`marketing` valent `true` ici — tant qu'aucun
 * choix n'a été fait (`hasChosen: false`), les deux restent bloqués.
 */
interface CookieConsentState {
  hasHydrated: boolean;
  hasChosen: boolean;
  analytics: boolean;
  marketing: boolean;
  bannerOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: { analytics: boolean; marketing: boolean }) => void;
  openPreferences: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useCookieConsentStore = create<CookieConsentState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      hasChosen: false,
      analytics: false,
      marketing: false,
      // Ouvert par défaut : tant que hasChosen est false (première visite,
      // avant hydratation localStorage), le bandeau doit s'afficher.
      bannerOpen: true,
      acceptAll: () => set({ analytics: true, marketing: true, hasChosen: true, bannerOpen: false }),
      rejectAll: () => set({ analytics: false, marketing: false, hasChosen: true, bannerOpen: false }),
      savePreferences: ({ analytics, marketing }) => set({ analytics, marketing, hasChosen: true, bannerOpen: false }),
      openPreferences: () => set({ bannerOpen: true }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "ondeal-cookie-consent",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
