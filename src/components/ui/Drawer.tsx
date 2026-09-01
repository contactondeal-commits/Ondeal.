"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import styles from "./Drawer.module.css";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "bottom";
  title?: string;
  children: React.ReactNode;
  widthClassName?: string;
}

// Mission UX/UI Phase 4 (2026-08-13) — P0 (focus trap) : sélecteur standard
// des éléments focusables au clavier, réutilisé pour calculer les bornes
// (premier/dernier) du piège de focus ci-dessous.
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

/**
 * Drawer accessible : Escape pour fermer, overlay cliquable, focus piégé
 * (Tab/Shift+Tab bouclent à l'intérieur tant qu'il est ouvert — voir
 * Mission UX/UI Phase 4 ci-dessous), focus renvoyé au déclencheur à la
 * fermeture, aria-modal.
 */
export default function Drawer({ open, onClose, side = "left", title, children }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      panelRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  /*
    Mission UX/UI Phase 4 (2026-08-13) — P0 : le rapport Phase 3 avait
    confirmé que `inert` empêche bien de tabuler VERS un drawer fermé, mais
    ne piège pas le focus DANS un drawer ouvert — rien ne marque le reste de
    la page comme inert quand le drawer est ouvert, donc Tab/Shift+Tab
    pouvaient en sortir librement. Piège de focus local, sans dépendance :
    - Tab depuis le dernier élément focusable → revient au premier ;
    - Shift+Tab depuis le premier élément focusable (ou depuis le panneau
      lui-même, qui reçoit le focus initial via tabIndex={-1} ci-dessous) →
      va au dernier ;
    - tout Tab/Shift+Tab "au milieu" n'est pas intercepté : le navigateur
      gère nativement le déplacement entre les éléments focusables du
      panneau, aucune régression du comportement existant ;
    - si le drawer ne contient aucun élément focusable (cas défensif, ne se
      produit pas actuellement en pratique — les 3 consommateurs passent
      toujours un `title`, donc un bouton de fermeture existe toujours),
      Tab/Shift+Tab sont simplement neutralisés pour ne pas s'échapper.
    N'utilise aucun tabindex positif, ne touche pas à `inert` (fermé) ni à
    `aria-hidden`, ni à Escape, ni au retour de focus au déclencheur.
  */
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = getFocusableElements(panel);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || active === panel) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    /*
      Mission UX/UI Phase 3 (2026-08-13) — P1 (audit accessibilité) : ajout
      de `inert` quand le drawer est fermé. Bug confirmé en navigateur réel
      (Tab répété depuis la home) : le bouton "Fermer" — et tout élément
      focusable du contenu — restait atteignable au clavier alors que le
      drawer est visuellement hors écran (`transform: translateX(-100%)`,
      `pointer-events: none`) ET marqué `aria-hidden="true"`. Un conteneur
      `aria-hidden="true"` qui contient un descendant focusable est une
      violation ARIA connue (le focus "fantôme" devient incohérent pour les
      technologies d'assistance). `inert` (supporté nativement par React 19
      / les navigateurs actuels) retire tout le sous-arbre de l'ordre de
      tabulation ET de l'arbre d'accessibilité tant que le drawer est fermé,
      sans toucher à la logique d'ouverture/fermeture, à Escape, ni au focus
      renvoyé au déclencheur.
    */
    <div className={`${styles.root} ${open ? styles.rootOpen : ""}`} aria-hidden={!open} inert={!open}>
      <div className={styles.overlay} onClick={onClose} />
      <div
        ref={panelRef}
        className={`${styles.panel} ${styles[side]}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        {title && (
          <div className={styles.header}>
            <h3>{title}</h3>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">
              <X size={20} />
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
