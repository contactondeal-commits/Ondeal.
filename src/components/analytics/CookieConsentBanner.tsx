"use client";

import { useState } from "react";
import { useCookieConsentStore } from "@/store/cookieConsentStore";
import styles from "./CookieConsentBanner.module.css";

/**
 * Mission "BANDEAU CONSENTEMENT COOKIES" (18/08/2026) — voir
 * useCookieConsentStore pour le contexte complet (GA4 et Meta Pixel actifs
 * en prod sans consentement préalable, non conforme RGPD/ePrivacy).
 *
 * Ce bandeau s'affiche tant que `bannerOpen` est vrai dans le store — soit
 * à la première visite (avant tout choix), soit après un clic sur
 * "Gérer les cookies" (footer, page /legal/cookies) pour revenir modifier
 * ses préférences. Trois choix, dans cet ordre (recommandation CNIL :
 * accepter et refuser doivent être à égalité de mise en avant) :
 * "Tout refuser", "Personnaliser", "Tout accepter".
 *
 * N'affiche rien tant que le store n'est pas hydraté depuis localStorage
 * (évite un flash du bandeau pour un visiteur ayant déjà répondu).
 */
export default function CookieConsentBanner() {
  const hasHydrated = useCookieConsentStore((s) => s.hasHydrated);
  const bannerOpen = useCookieConsentStore((s) => s.bannerOpen);
  const analytics = useCookieConsentStore((s) => s.analytics);
  const marketing = useCookieConsentStore((s) => s.marketing);
  const acceptAll = useCookieConsentStore((s) => s.acceptAll);
  const rejectAll = useCookieConsentStore((s) => s.rejectAll);
  const savePreferences = useCookieConsentStore((s) => s.savePreferences);

  const [customizing, setCustomizing] = useState(false);
  const [draftAnalytics, setDraftAnalytics] = useState(analytics);
  const [draftMarketing, setDraftMarketing] = useState(marketing);

  if (!hasHydrated || !bannerOpen) return null;

  function openCustomize() {
    setDraftAnalytics(analytics);
    setDraftMarketing(marketing);
    setCustomizing(true);
  }

  return (
    <div className={styles.root} role="dialog" aria-modal="false" aria-labelledby="cookie-consent-heading">
      <div className={styles.card}>
        {!customizing ? (
          <>
            <div className={styles.text}>
              <h2 id="cookie-consent-heading" className={styles.heading}>
                Gestion des cookies
              </h2>
              <p>
                Nous utilisons des cookies essentiels au fonctionnement du site, ainsi que des cookies de mesure
                d&apos;audience (Google Analytics) et publicitaires (Meta) soumis à votre accord. Voir notre{" "}
                <a href="/legal/cookies">politique de cookies</a>.
              </p>
            </div>
            <div className={styles.actions}>
              <button type="button" className={styles.secondaryButton} onClick={rejectAll}>
                Tout refuser
              </button>
              <button type="button" className={styles.secondaryButton} onClick={openCustomize}>
                Personnaliser
              </button>
              <button type="button" className={styles.primaryButton} onClick={acceptAll}>
                Tout accepter
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.text}>
              <h2 id="cookie-consent-heading" className={styles.heading}>
                Personnaliser les cookies
              </h2>
              <ul className={styles.prefList}>
                <li className={styles.prefRow}>
                  <div>
                    <strong>Essentiels</strong>
                    <p>Nécessaires au fonctionnement du site (panier, favoris). Toujours actifs.</p>
                  </div>
                  <input type="checkbox" checked disabled aria-label="Cookies essentiels (toujours actifs)" />
                </li>
                <li className={styles.prefRow}>
                  <div>
                    <strong>Mesure d&apos;audience</strong>
                    <p>Google Analytics — statistiques de fréquentation.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draftAnalytics}
                    onChange={(e) => setDraftAnalytics(e.target.checked)}
                    aria-label="Autoriser les cookies de mesure d'audience"
                  />
                </li>
                <li className={styles.prefRow}>
                  <div>
                    <strong>Publicité</strong>
                    <p>Pixel Meta — mesure et personnalisation des publicités.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draftMarketing}
                    onChange={(e) => setDraftMarketing(e.target.checked)}
                    aria-label="Autoriser les cookies publicitaires"
                  />
                </li>
              </ul>
            </div>
            <div className={styles.actions}>
              <button type="button" className={styles.secondaryButton} onClick={() => setCustomizing(false)}>
                Retour
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => savePreferences({ analytics: draftAnalytics, marketing: draftMarketing })}
              >
                Enregistrer mes choix
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
