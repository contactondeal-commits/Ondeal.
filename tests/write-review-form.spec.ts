import { test, expect } from "@playwright/test";

/**
 * Mission "FORMULAIRE AVIS CLIENT" (17/08/2026) — voir
 * src/components/products/WriteReviewForm.tsx et
 * src/app/actions/reviews.ts pour le contexte complet.
 *
 * Volontairement, AUCUN de ces tests ne complète une soumission valide
 * jusqu'au bout : un avis soumis avec succès est publié immédiatement et
 * publiquement sur ce produit réel via l'API Judge.me (choix explicite du
 * client), et ne peut plus être supprimé via l'API ensuite (limite
 * documentée de Judge.me — seulement supprimable depuis le tableau de bord
 * marchand). Publier un faux avis de test sur un vrai produit, même
 * automatiquement, reviendrait à publier du contenu public au nom du
 * client sans son accord explicite au moment précis de l'action — ce que
 * cette session ne fait jamais (voir règles de permission explicite).
 * Cette suite couvre donc uniquement ce qui est vérifiable SANS publier de
 * contenu réel : affichage du formulaire, piège à robots, validation.
 */

const SLUG = "casque-gaming-blackfire-bfx-40-immersion-sonore-pour-gamers";

test.describe("WriteReviewForm — formulaire 'Laisser un avis'", () => {
  test("le bouton ouvre le formulaire avec tous les champs attendus", async ({ page }) => {
    await page.goto(`/product/${SLUG}`);
    const openBtn = page.getByRole("button", { name: "Laisser un avis" });
    await expect(openBtn).toBeVisible();
    await openBtn.click();

    await expect(page.getByRole("radiogroup", { name: "Note sur 5" })).toBeVisible();
    await expect(page.locator("#review-name")).toBeVisible();
    await expect(page.locator("#review-email")).toBeVisible();
    await expect(page.locator("#review-title")).toBeVisible();
    await expect(page.locator("#review-body")).toBeVisible();
    await expect(page.getByRole("button", { name: "Publier mon avis" })).toBeVisible();
  });

  test("le champ piège à robots (honeypot) est invisible et non atteignable au clavier", async ({ page }) => {
    await page.goto(`/product/${SLUG}`);
    await page.getByRole("button", { name: "Laisser un avis" }).click();

    const honeypot = page.locator("#review-website");
    // Présent dans le DOM — intentionnellement, pas en display:none (un
    // bot un peu sophistiqué ignore les champs display:none/visibility:
    // hidden ; la technique standard "visuellement masqué" — conteneur
    // clippé à 1×1px avec overflow:hidden — piège aussi ces bots-là). Le
    // champ lui-même garde sa taille naturelle de layout (c'est son
    // CONTENEUR qui le clippe visuellement à l'écran) : on vérifie donc la
    // taille réelle du conteneur, pas du champ.
    // Le nom de classe CSS Module est haché en prod (ex. `.honeypot__a1b2c`) —
    // on remonte donc au parent direct du champ plutôt que de dépendre du
    // nom exact généré par le build.
    const wrapper = honeypot.locator("xpath=..");
    const box = await wrapper.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(1);
    expect(box!.height).toBeLessThanOrEqual(1);
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
    // Jamais annoncé/atteignable par un lecteur d'écran : le conteneur est aria-hidden.
    await expect(wrapper).toHaveAttribute("aria-hidden", "true");
  });

  test("sélectionner une note remplit les étoiles correspondantes", async ({ page }) => {
    await page.goto(`/product/${SLUG}`);
    await page.getByRole("button", { name: "Laisser un avis" }).click();

    const fourthStar = page.getByRole("radio", { name: "4 étoiles" });
    await fourthStar.click();
    await expect(fourthStar).toHaveAttribute("aria-checked", "true");
    await expect(page.getByRole("radio", { name: "5 étoiles" })).toHaveAttribute("aria-checked", "false");
  });

  test("soumettre sans choisir de note affiche une erreur, sans jamais appeler Judge.me", async ({ page }) => {
    await page.goto(`/product/${SLUG}`);
    await page.getByRole("button", { name: "Laisser un avis" }).click();

    await page.locator("#review-name").fill("Test QA");
    await page.locator("#review-email").fill("test-qa@example.com");
    await page.locator("#review-body").fill("Contenu de test, jamais envoyé.");
    // Aucune note choisie : validation cliente doit bloquer avant tout appel serveur.
    await page.getByRole("button", { name: "Publier mon avis" }).click();

    await expect(page.getByText("Merci de choisir une note")).toBeVisible();
  });
});
