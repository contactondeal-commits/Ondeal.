import type { Page } from "@playwright/test";

/**
 * Mission UX/UI Phase 4 (2026-08-13) — helper partagé. `CategoryMenu` est
 * monté globalement dans `SiteLayout` (toujours présent dans le DOM, même
 * fermé). Sur les pages qui ouvrent un AUTRE Drawer (FilterMobile,
 * MegaMenuMobile), `document.querySelector('[role="dialog"]')` seul
 * risquerait de cibler le mauvais Drawer (le CategoryMenu fermé) plutôt que
 * celui réellement ouvert. Ce helper ne retient que le panneau dont
 * l'ancêtre `[aria-hidden]` vaut `"false"` (donc réellement ouvert et non
 * `inert`).
 */
export async function getOpenDialogHandle(page: Page) {
  return page.evaluateHandle(() => {
    const panels = Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]'));
    return (
      panels.find((p) => {
        const root = p.closest("[aria-hidden]");
        return root && root.getAttribute("aria-hidden") === "false";
      }) ?? null
    );
  });
}

export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
