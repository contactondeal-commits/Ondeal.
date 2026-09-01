"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, X } from "lucide-react";
import { useToastStore, type Toast } from "@/store/toastStore";
import styles from "./ToastContainer.module.css";

const AUTO_DISMISS_MS = 4500;

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const id = setTimeout(() => removeToast(toast.id), AUTO_DISMISS_MS);
    return () => clearTimeout(id);
  }, [toast.id, removeToast]);

  return (
    <div className={styles.toast}>
      <CheckCircle2 size={20} className={styles.icon} aria-hidden="true" />
      <div className={styles.body}>
        <p className={styles.title}>{toast.title}</p>
        <p className={styles.message}>{toast.message}</p>
        {toast.href && (
          <Link href={toast.href} className={styles.link} onClick={() => removeToast(toast.id)}>
            {toast.hrefLabel ?? "Voir"}
          </Link>
        )}
      </div>
      <button
        type="button"
        className={styles.closeBtn}
        aria-label="Fermer la notification"
        onClick={() => removeToast(toast.id)}
      >
        <X size={15} />
      </button>
    </div>
  );
}

/**
 * Mission CRO Phase 1 (2026-08-13) — P1-1. Monté une seule fois dans
 * `SiteLayout` (voir composant). `aria-live="polite"` + `role="status"`
 * pour une annonce accessible sans interrompre l'utilisateur (contrairement
 * à `assertive`), conformément aux pratiques WAI-ARIA pour les
 * notifications non bloquantes.
 */
export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.root} role="status" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
