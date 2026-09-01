import { test, expect } from "@playwright/test";

/**
 * Mission "PAGES FOOTER" (18/08/2026) — non-régression ciblée pour le
 * formulaire de contact (validation client, honeypot, pas d'appel réseau
 * pour un bot). Le déclenchement réel de mailto: (navigation hors page) ne
 * peut pas être vérifié de façon fiable dans Chromium headless — voir
 * ContactForm.tsx pour le détail du choix technique (pas de backend email
 * configuré dans le projet).
 */

test.describe("Formulaire de contact", () => {
  test("affiche tous les champs attendus", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByLabel("Nom")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Catégorie de votre demande")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();
  });

  test("le champ honeypot est invisible et non atteignable au clavier", async ({ page }) => {
    await page.goto("/contact");
    const wrapper = page.locator('label[for="contact-website"]').locator("..");
    const box = await wrapper.boundingBox();
    expect(box?.width ?? 0).toBeLessThanOrEqual(1);
    expect(box?.height ?? 0).toBeLessThanOrEqual(1);
    await expect(page.locator("#contact-website")).toHaveAttribute("tabindex", "-1");
  });

  test("soumettre un message trop court affiche une erreur", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Nom").fill("Marie");
    await page.getByLabel("Email").fill("marie@example.com");
    await page.getByLabel("Message").fill("Court");
    await page.getByRole("button", { name: "Envoyer le message" }).click();
    await expect(page.locator('p[role="alert"]')).toContainText("un peu court");
  });

  test("un email invalide affiche une erreur", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Nom").fill("Marie");
    await page.getByLabel("Email").fill("pas-un-email");
    await page.getByLabel("Message").fill("Ceci est un message suffisamment long pour passer la validation.");
    await page.getByRole("button", { name: "Envoyer le message" }).click();
    await expect(page.locator('p[role="alert"]')).toContainText("email valide");
  });
});
