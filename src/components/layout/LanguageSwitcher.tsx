"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Globe } from "lucide-react";
import styles from "./Header.module.css";

/*
  Mission "TRADUCTION MULTILINGUE" (2026-08-20) — restauration en urgence du
  sélecteur de langue. Constat (voir reports/ondeal-ecosystem-cartography-
  2026-08-17.md §"apps de traduction") : la boutique Shopify avait 6 apps de
  traduction installées côté thème Liquid (G|translate, Translate & Adapt,
  etc.), mais le site tourne désormais sur ce frontend Next.js headless — ces
  apps n'injectent rien ici, d'où le bouton "FR" resté décoratif (aucun
  onClick) constaté dans Header.tsx.

  Choix technique : le widget "Google Website Translator" (Google Translate
  Element), gratuit, sans clé API, sans configuration serveur — piloté via le
  cookie standard `googtrans`. Couvre nativement les 5 langues demandées
  (fr, en, de, zh-CN, ja) plus toutes les langues Google Translate si besoin
  d'étendre plus tard. Aucune traduction n'est inventée ou codée en dur :
  c'est un vrai moteur de traduction qui traite le DOM réel de chaque page.
*/

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (options: Record<string, unknown>, elementId: string) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

/*
  Mission "BAISSE FRAIS DE PORT — SUISSE/ALLEMAGNE/BELGIQUE" (26/08/2026) —
  demande explicite d'ajouter Suisse, Allemagne, Belgique au sélecteur, en
  écho à l'ouverture de ces zones à 4,99 € de livraison. Le sélecteur pilote
  une LANGUE (pas un pays) : l'allemand ("de") couvrait déjà l'Allemagne et
  la Suisse alémanique, le français par défaut couvrait déjà la Suisse
  romande et une partie de la Belgique. Pour représenter fidèlement ces 3
  pays sans doublon inutile, ajout du néerlandais ("nl" — langue principale
  en Belgique, à parts avec le français) et de l'italien ("it" — 3e langue
  officielle suisse) : les deux seules langues officielles de ces pays qui
  n'étaient pas déjà couvertes.
*/
const LANGUAGES = [
  { code: "fr", label: "Français", flag: "FR" },
  { code: "en", label: "English", flag: "EN" },
  { code: "de", label: "Deutsch", flag: "DE" },
  { code: "nl", label: "Nederlands", flag: "NL" },
  { code: "it", label: "Italiano", flag: "IT" },
  { code: "zh-CN", label: "中文", flag: "ZH" },
  { code: "ja", label: "日本語", flag: "JA" },
];

const GOOGTRANS_RE = /googtrans=\/fr\/([a-zA-Z-]+)/;

function getCurrentLangFromCookie(): string {
  if (typeof document === "undefined") return "fr";
  const match = document.cookie.match(GOOGTRANS_RE);
  return match ? match[1] : "fr";
}

// Lecture du cookie `googtrans` via useSyncExternalStore plutôt qu'un
// useEffect + setState : le cookie est un vrai "external store" (aucun
// événement de changement disponible, d'où un subscribe no-op), ce qui
// évite les rendus en cascade et garde le rendu serveur ("fr" par défaut,
// voir getServerSnapshot) cohérent avec l'hydratation client.
function subscribeNoop() {
  return () => {};
}

function getServerLang(): string {
  return "fr";
}

function setGoogleTranslateCookie(langCode: string) {
  const host = window.location.hostname;
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  // On efface d'abord toutes les variantes possibles du cookie (host-only,
  // domaine exact, domaine avec point) pour éviter qu'une ancienne valeur
  // ne prenne le pas sur la nouvelle sélection.
  document.cookie = `googtrans=; ${expire}; path=/;`;
  document.cookie = `googtrans=; ${expire}; path=/; domain=${host};`;
  document.cookie = `googtrans=; ${expire}; path=/; domain=.${host};`;

  if (langCode !== "fr") {
    const value = `/fr/${langCode}`;
    document.cookie = `googtrans=${value}; path=/;`;
    document.cookie = `googtrans=${value}; path=/; domain=${host};`;
  }
}

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const currentLang = useSyncExternalStore(subscribeNoop, getCurrentLangFromCookie, getServerLang);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function ensureWidgetLoaded() {
    if (window.google?.translate || document.getElementById("google-translate-script")) {
      return;
    }
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "fr",
          includedLanguages: "fr,en,de,nl,it,zh-CN,ja",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }

  // Bug corrigé (2026-08-20) : le script Google Translate n'était chargé
  // qu'au clic sur le bouton FR (ensureWidgetLoaded appelé uniquement dans
  // handleToggle). Après handleSelect -> reload(), le cookie `googtrans`
  // était bien posé mais plus aucun script Google n'était présent pour le
  // lire : la page se rechargeait donc toujours en français. Le widget doit
  // être chargé au montage, sur CHAQUE page, pour que le cookie soit
  // effectivement appliqué après le rechargement.
  useEffect(() => {
    ensureWidgetLoaded();
  }, []);

  function handleToggle() {
    ensureWidgetLoaded();
    setOpen((value) => !value);
  }

  function handleSelect(langCode: string) {
    setOpen(false);
    setGoogleTranslateCookie(langCode);
    // Le widget Google Translate lit le cookie `googtrans` au chargement de
    // la page : un rechargement complet est le moyen le plus fiable de
    // déclencher la traduction (et de la garder active en navigant
    // ensuite, le cookie persistant sur tout le domaine).
    window.location.reload();
  }

  const currentFlag = LANGUAGES.find((lang) => lang.code === currentLang)?.flag ?? "FR";

  return (
    // Bug corrigé (2026-08-20) : sans exclusion explicite, Google Translate
    // traduisait aussi le texte de CE composant (ex. le badge "EN" — lu comme
    // le mot français "en" — devenait "In" une fois la page traduite vers
    // l'anglais). `translate="no"` + classe `notranslate` (les deux signaux
    // reconnus par le widget) protègent tout le sélecteur, y compris son
    // propre menu déroulant.
    <div className={`${styles.langWrap} notranslate`} translate="no" ref={wrapRef}>
      <button
        type="button"
        className={styles.langBtn}
        aria-label="Changer de langue"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={handleToggle}
      >
        <Globe size={18} />
        <span className={styles.actionLabel}>{currentFlag}</span>
      </button>

      {open && (
        <ul className={styles.langMenu} role="menu">
          {LANGUAGES.map((lang) => (
            <li key={lang.code} role="none">
              <button
                type="button"
                role="menuitem"
                className={styles.langOption}
                aria-current={lang.code === currentLang}
                onClick={() => handleSelect(lang.code)}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Conteneur requis par le widget Google — jamais affiché : on pilote
          la langue nous-mêmes via le menu ci-dessus + le cookie googtrans. */}
      <div id="google_translate_element" className={styles.googleTranslateHost} />
    </div>
  );
}
