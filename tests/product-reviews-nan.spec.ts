import { test, expect } from "@playwright/test";

/**
 * BUG FIX (2026-08-16) — non-régression ciblée pour le bug NaN des avis
 * clients. Cause racine : le metafield Shopify `reviews.rating` (créé par
 * Judge.me, type natif "rating") stocke sa valeur en JSON
 * (`{"scale_min":"1.0","scale_max":"5.0","value":"5.0"}`), pas en nombre
 * brut — `Number()` appliqué directement à cette chaîne renvoyait NaN.
 * Corrigé dans src/lib/shopify/storefront.ts (parseShopifyRatingMetafieldValue)
 * + filets de sécurité dans ProductRating.tsx et ReviewsList.tsx.
 *
 * Produit utilisé : "Casque Gaming Blackfire BFX-40" — seul produit connu
 * avec un avis Judge.me réel (1 avis, note 5/5) au moment de ce correctif.
 */
test("fiche produit avec 1 avis réel (5/5) — pas de NaN, note correcte, pluriel correct", async ({ page }) => {
  await page.goto("/product/casque-gaming-blackfire-bfx-40-immersion-sonore-pour-gamers");

  const reviewsSection = page.locator("#reviews-heading").locator("..");
  await expect(reviewsSection).toBeVisible();

  const sectionText = await reviewsSection.textContent();

  // Le cœur du bug : "NaN" ne doit plus jamais apparaître dans la section avis.
  expect(sectionText).not.toContain("NaN");

  // La note moyenne réelle (5/5) doit s'afficher correctement.
  expect(sectionText).toContain("5.0");

  // "avis" (invariable en français), plus l'ancien libellé incorrect "évaluations"
  // ne doit plus apparaître.
  expect(sectionText).toContain("avis");
  expect(sectionText).not.toContain("évaluations");
});

/**
 * BUG FIX (2026-08-17) — non-régression ciblée : le contenu détaillé de
 * l'avis (auteur + texte réel du client) doit s'afficher, pas seulement le
 * résumé (note/nombre). Root cause : metafield Shopify `judgeme.review_
 * widget_data` (contenu détaillé) non exposé à l'API Storefront, seulement
 * à l'API Admin — voir src/lib/shopify/judgeme.ts. Donnée réelle vérifiée
 * via l'API Admin Shopify (Emilie, "Bon produit") — jamais inventée.
 */
test("fiche produit avec 1 avis réel — le contenu détaillé (auteur, texte) s'affiche", async ({ page }) => {
  await page.goto("/product/casque-gaming-blackfire-bfx-40-immersion-sonore-pour-gamers");

  const reviewsSection = page.locator("#reviews-heading").locator("..");
  await expect(reviewsSection).toBeVisible();

  const sectionText = await reviewsSection.textContent();

  expect(sectionText).toContain("Emilie");
  expect(sectionText).toContain("Bon produit");
  expect(sectionText).toContain("Réception nickel");
});
