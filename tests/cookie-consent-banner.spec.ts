import { test, expect } from "@playwright/test";

/**
 * Mission "BANDEAU CONSENTEMENT COOKIES" (18/08/2026) — non-régression
 * ciblée : GA4/Meta Pixel ne doivent jamais se charger avant un
 * consentement explicite, le bandeau doit rester rouvrable, et les 3 choix
 * (Tout accepter / Tout refuser / Personnaliser) doivent fonctionner et
 * persister (localStorage, clé "ondeal-cookie-consent").
 */

test.describe("Bandeau de consentement cookies", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("le bandeau s'affiche à la première visite", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("dialog", { name: "Gestion des cookies" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Tout accepter" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Tout refuser" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Personnaliser" })).toBeVisible();
  });

  test("« Tout accepter » ferme le bandeau et enregistre le consentement", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Tout accepter" }).click();
    await expect(page.getByRole("dialog", { name: "Gestion des cookies" })).toBeHidden();

    const stored = await page.evaluate(() => localStorage.getItem("ondeal-cookie-consent"));
    const parsed = JSON.parse(stored!);
    expect(parsed.state.analytics).toBe(true);
    expect(parsed.state.marketing).toBe(true);
    expect(parsed.state.hasChosen).toBe(true);
  });

  test("« Tout refuser » ferme le bandeau et enregistre le refus", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Tout refuser" }).click();
    await expect(page.getByRole("dialog", { name: "Gestion des cookies" })).toBeHidden();

    const stored = await page.evaluate(() => localStorage.getItem("ondeal-cookie-consent"));
    const parsed = JSON.parse(stored!);
    expect(parsed.state.analytics).toBe(false);
    expect(parsed.state.marketing).toBe(false);
    expect(parsed.state.hasChosen).toBe(true);
  });

  test("« Personnaliser » permet un choix granulaire (analytics oui, marketing non)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Personnaliser" }).click();

    await expect(page.getByText("Personnaliser les cookies")).toBeVisible();

    const analyticsToggle = page.getByLabel("Autoriser les cookies de mesure d'audience");
    const marketingToggle = page.getByLabel("Autoriser les cookies publicitaires");

    await analyticsToggle.check();
    await marketingToggle.uncheck();
    await page.getByRole("button", { name: "Enregistrer mes choix" }).click();

    await expect(page.getByRole("dialog", { name: "Gestion des cookies" })).toBeHidden();

    const stored = await page.evaluate(() => localStorage.getItem("ondeal-cookie-consent"));
    const parsed = JSON.parse(stored!);
    expect(parsed.state.analytics).toBe(true);
    expect(parsed.state.marketing).toBe(false);
  });

  test("le choix persiste après rechargement — le bandeau ne se rouvre pas", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Tout accepter" }).click();
    await expect(page.getByRole("dialog", { name: "Gestion des cookies" })).toBeHidden();

    await page.reload();
    await expect(page.getByRole("dialog", { name: "Gestion des cookies" })).toBeHidden();
  });

  test("« Gérer les cookies » dans le footer rouvre le bandeau après un premier choix", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Tout refuser" }).click();
    await expect(page.getByRole("dialog", { name: "Gestion des cookies" })).toBeHidden();

    await page.getByRole("button", { name: "Gérer les cookies" }).click();
    await expect(page.getByRole("dialog", { name: "Gestion des cookies" })).toBeVisible();
  });

  test("aucun script GA4/Meta n'est injecté avant consentement", async ({ page }) => {
    await page.goto("/");
    // Le bandeau doit être visible (aucun choix fait) et aucun script gtag/fbevents ne doit être présent.
    await expect(page.getByRole("dialog", { name: "Gestion des cookies" })).toBeVisible();
    const scripts = await page.evaluate(() => Array.from(document.scripts).map((s) => s.src));
    expect(scripts.some((s) => s.includes("googletagmanager.com"))).toBe(false);
    expect(scripts.some((s) => s.includes("fbevents.js"))).toBe(false);
  });
});
