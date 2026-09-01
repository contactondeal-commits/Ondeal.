import { test, expect } from "@playwright/test";

/**
 * Mission UX/UI Phase 4 (2026-08-13) — section 6 (audit dialogues/overlays).
 * Bug réel confirmé et corrigé pendant cette mission : la superposition
 * plein écran de la galerie PDP (role="dialog" aria-modal="true") n'avait
 * pas de piège de focus — Tab s'échappait vers le panneau d'achat sous la
 * superposition. Voir src/components/products/ProductGallery.tsx.
 */

const SLUG = "mini-smartphone-enfant-ecran-3-pouces-anti-fatigue-gps";

test.describe("ProductGallery — superposition plein écran", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Tab reste piégé dans la superposition plein écran", async ({ page }) => {
    await page.goto(`/product/${SLUG}`, { waitUntil: "load" });
    await page.getByRole("button", { name: "Voir en plein écran" }).click();
    await page.waitForTimeout(300);

    const panel = page.locator('[role="dialog"][aria-label="Image en plein écran"]');
    await expect(panel).toBeVisible();

    const count = await panel.locator("button, a[href]").count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count + 2; i++) {
      await page.keyboard.press("Tab");
      const inPanel = await page.evaluate(() => {
        const p = document.querySelector('[role="dialog"][aria-label="Image en plein écran"]');
        return !!p && p.contains(document.activeElement);
      });
      expect(inPanel, `Tab #${i + 1} ne doit pas sortir de la superposition`).toBe(true);
    }
  });

  test("Escape ferme la superposition et le focus revient au déclencheur", async ({ page }) => {
    await page.goto(`/product/${SLUG}`, { waitUntil: "load" });
    const trigger = page.getByRole("button", { name: "Voir en plein écran" });
    await trigger.click();
    await page.waitForTimeout(300);

    await expect(page.locator('[role="dialog"][aria-label="Image en plein écran"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    await expect(page.locator('[role="dialog"][aria-label="Image en plein écran"]')).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
});
