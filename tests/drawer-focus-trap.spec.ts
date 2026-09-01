import { test, expect, type Page } from "@playwright/test";
import { getOpenDialogHandle, FOCUSABLE_SELECTOR } from "./helpers";

/**
 * Mission UX/UI Phase 4 (2026-08-13) — section 3/4 : couverture du piège de
 * focus de `Drawer.tsx`, testée sur ses 3 consommateurs réels
 * (`CategoryMenu`, `FilterMobile`, `MegaMenuMobile`), conformément à la
 * consigne de la mission. Aucune donnée Shopify modifiée : ces tests
 * naviguent uniquement sur des pages déjà publiques du site (lecture
 * seule).
 */

const VIEWPORT = { width: 390, height: 844 };

interface DrawerScenario {
  label: string;
  path: string;
  /** Ouvre le drawer et retourne le locator du déclencheur (pour vérifier le retour du focus). */
  open: (page: Page) => Promise<import("@playwright/test").Locator>;
}

const SCENARIOS: DrawerScenario[] = [
  {
    label: "CategoryMenu",
    path: "/",
    open: async (page) => {
      const trigger = page.getByRole("button", { name: "Ouvrir le menu des catégories" });
      await trigger.click();
      return trigger;
    },
  },
  {
    label: "FilterMobile",
    path: "/category/electronique",
    open: async (page) => {
      const trigger = page.getByRole("button", { name: "Filtres", exact: true });
      await trigger.click();
      return trigger;
    },
  },
  {
    label: "MegaMenuMobile",
    path: "/",
    open: async (page) => {
      const trigger = page
        .getByRole("navigation", { name: "Navigation principale" })
        .getByRole("link", { name: "Électronique", exact: true });
      await trigger.click();
      return trigger;
    },
  },
];

for (const scenario of SCENARIOS) {
  test.describe(`Drawer focus trap — ${scenario.label}`, () => {
    test.use({ viewport: VIEWPORT });

    test("fermé : aucun élément interne n'est tabbable", async ({ page }) => {
      await page.goto(scenario.path, { waitUntil: "networkidle" });
      // Balaye un grand nombre de Tab depuis le début de la page : le focus
      // ne doit jamais atterrir sur un élément dont un ancêtre est
      // aria-hidden="true" (drawer fermé) — comportement déjà vérifié en
      // Phase 3 (inert), revérifié ici pour non-régression.
      for (let i = 0; i < 30; i++) {
        await page.keyboard.press("Tab");
        const insideHiddenDrawer = await page.evaluate(() => {
          let el: Element | null = document.activeElement;
          while (el) {
            if (el.getAttribute && el.getAttribute("aria-hidden") === "true") return true;
            el = el.parentElement;
          }
          return false;
        });
        expect(insideHiddenDrawer, `Tab #${i + 1} ne doit pas entrer dans un drawer fermé`).toBe(false);
      }
    });

    test("ouverture : le focus arrive sur le drawer", async ({ page }) => {
      await page.goto(scenario.path, { waitUntil: "networkidle" });
      await scenario.open(page);
      await page.waitForTimeout(300);
      const panel = await getOpenDialogHandle(page);
      const activeIsInPanel = await page.evaluate(
        ([panelEl]) => !!panelEl && panelEl.contains(document.activeElement),
        [panel]
      );
      expect(activeIsInPanel).toBe(true);
    });

    test("Tab boucle : dernier élément → premier élément", async ({ page }) => {
      await page.goto(scenario.path, { waitUntil: "networkidle" });
      await scenario.open(page);
      await page.waitForTimeout(300);

      const count = await page.evaluate(
        ([sel]) => {
          const panels = Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]'));
          const panel = panels.find((p) => {
            const root = p.closest("[aria-hidden]");
            return root && root.getAttribute("aria-hidden") === "false";
          });
          return panel ? panel.querySelectorAll(sel).length : 0;
        },
        [FOCUSABLE_SELECTOR]
      );
      expect(count, "le drawer doit contenir au moins un élément focusable").toBeGreaterThan(0);

      // Tab jusqu'au dernier élément focusable (focus initial = le panneau
      // lui-même, donc `count` Tab suffisent pour atteindre le dernier).
      for (let i = 0; i < count; i++) {
        await page.keyboard.press("Tab");
      }
      const lastText = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.textContent?.trim());

      // Un Tab de plus doit boucler vers le PREMIER élément focusable, pas
      // sortir du drawer.
      await page.keyboard.press("Tab");
      const panel = await getOpenDialogHandle(page);
      const stillInPanel = await page.evaluate(
        ([panelEl]) => !!panelEl && panelEl.contains(document.activeElement),
        [panel]
      );
      expect(stillInPanel, `après le dernier élément (${lastText}), Tab doit boucler dans le drawer`).toBe(true);

      const firstText = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.textContent?.trim());
      // Le premier élément focusable est toujours le bouton "Fermer" dans ce projet.
      expect(firstText).toBe("Fermer");
    });

    test("Shift+Tab boucle : premier élément (ou focus initial) → dernier élément", async ({ page }) => {
      await page.goto(scenario.path, { waitUntil: "networkidle" });
      await scenario.open(page);
      await page.waitForTimeout(300);

      // Focus initial = le panneau lui-même (tabIndex=-1). Shift+Tab doit
      // boucler directement vers le DERNIER élément focusable, jamais
      // sortir vers le reste de la page.
      await page.keyboard.press("Shift+Tab");
      const panel = await getOpenDialogHandle(page);
      const stillInPanel = await page.evaluate(
        ([panelEl]) => !!panelEl && panelEl.contains(document.activeElement),
        [panel]
      );
      expect(stillInPanel, "Shift+Tab depuis le focus initial ne doit pas sortir du drawer").toBe(true);
    });

    test("Escape ferme le drawer", async ({ page }) => {
      await page.goto(scenario.path, { waitUntil: "networkidle" });
      await scenario.open(page);
      await page.waitForTimeout(300);
      let panel = await getOpenDialogHandle(page);
      expect(await panel.evaluate((el) => !!el)).toBe(true);

      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      panel = await getOpenDialogHandle(page);
      expect(await panel.evaluate((el) => !!el), "aucun drawer ne doit rester ouvert après Escape").toBe(false);
    });

    test("le focus revient au déclencheur après fermeture", async ({ page }) => {
      await page.goto(scenario.path, { waitUntil: "networkidle" });
      const trigger = await scenario.open(page);
      await page.waitForTimeout(300);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(300);
      await expect(trigger).toBeFocused();
    });
  });
}
