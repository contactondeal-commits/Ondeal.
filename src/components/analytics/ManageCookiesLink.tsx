"use client";

import { useCookieConsentStore } from "@/store/cookieConsentStore";

/**
 * Mission "BANDEAU CONSENTEMENT COOKIES" (18/08/2026) — permet de rouvrir le
 * bandeau de consentement à tout moment (footer + page /legal/cookies) pour
 * changer d'avis après un premier choix, comme l'exige la CNIL (le retrait
 * du consentement doit être aussi simple que son octroi).
 */
export default function ManageCookiesLink({ className }: { className?: string }) {
  const openPreferences = useCookieConsentStore((s) => s.openPreferences);

  return (
    <button type="button" className={className} onClick={openPreferences}>
      Gérer les cookies
    </button>
  );
}
