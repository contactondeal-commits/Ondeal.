"use client";

import { create } from "zustand";

/**
 * Mission CRO Phase 1 (2026-08-13) — P1-1 : jusqu'ici, aucun retour visuel
 * n'existait après un ajout au panier (voir reports/ondeal-cro-audit.md
 * P1-1 — recherche exhaustive de "toast"/"snackbar" dans src/ : 0
 * résultat, reconfirmé au début de cette mission). Ce store ne fait que
 * gérer l'affichage de messages de confirmation locaux — aucune donnée
 * Shopify, aucune mutation, aucune dépendance sur le panier réel au-delà
 * des informations déjà connues au moment de l'ajout (titre, prix,
 * quantité — les mêmes que celles déjà stockées dans `CartItem.snapshot`).
 */
export interface Toast {
  id: string;
  title: string;
  message: string;
  href?: string;
  hrefLabel?: string;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

let counter = 0;
function nextId(): string {
  counter += 1;
  return `toast-${counter}-${Math.floor(Math.random() * 1_000_000)}`;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: nextId() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
