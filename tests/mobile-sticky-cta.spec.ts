import { test, expect } from "@playwright/test";

/**
 * Mission UX/UI Phase 4 (2026-08-13) — section 7/8 : couverture de
 * non-régression pour `MobileStickyCta`, suite au bug P0 corrigé en
 * Phase 3 (la barre ne s'affichait JAMAIS sur 27/60 produits réels du
 * catalogue — voir reports/ondeal-ux-ui-phase3.md sections 3-4). Ces tests
 * utilisent de vrais produits du catalogue (lecture seule, aucune mutation
 * Shopify) choisis pour représenter les deux profils de contenu qui
 * avaient révélé le bug :
 *  - contenu court  → "van-gogh-mens-quartz-wrist-watch-3d-printed"
 *    (fenêtre mesurée à -289px AVANT le correctif Phase 3 : pire cas)
 *  - contenu long   → "mini-smartphone-enfant-ecran-3-pouces-anti-fatigue-gps"
 *  - hors stock réel → "cat-eye-gel-magnetic-pen-for-nails"
 * Ces trois produits sont des données réelles lues sur le catalogue actuel
 * (aucune donnée inventée) — s'ils venaient à changer de stock/contenu
 * suite à une synchronisation Shopify future, ces tests devront être
 * repointés vers d'autres produits représentatifs des mêmes profils.
 */

const SHORT_CONTENT_SLUG = "van-gogh-mens-quartz-wrist-watch-3d-printed";
const LONG_CONTENT_SLUG = "mini-smartphone-enfant-ecran-3-pouces-anti-fatigue-gps";
const OUT_OF_STOCK_SLUG = "cat-eye-gel-magnetic-pen-for-nails";

const CTA_REGION = '[role="region"][aria-label="Ajout rapide au panier"]';

async function getSectionOffsets(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const sentinel = document.getElementById("add-to-cart-sentinel");
    const endBoundary = document.getElementById("sticky-cta-end-boundary");
    if (!sentinel || !endBoundary) return null;
    return {
      sentinelTop: sentinel.getBoundingClientRect().top + window.scrollY,
      endBoundaryTop: endBoundary.getBoundingClientRect().top + window.scrollY,
      bodyHeight: document.body.scrollHeight,
    };
  });
}

test.describe("MobileStickyCta — non-régression (bug P0 Phase 3)", () => {
  test("CAS A — contenu PDP court : la barre apparaît puis disparaît avant la zone produits similaires", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/product/${SHORT_CONTENT_SLUG}`, { waitUntil: "load" });

    const offsets = await getSectionOffsets(page);
    expect(offsets).not.toBeNull();
    const { sentinelTop, endBoundaryTop } = offsets!;

    // Avant que le bloc d'achat initial ne sorte du viewport : absente.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);
    await expect(page.locator(CTA_REGION)).toHaveCount(0);

    // Juste après la sortie du bloc d'achat initial : présente. C'est
    // exactement le scénario qui échouait avant le correctif Phase 3 pour
    // ce produit (fenêtre alors négative → jamais visible).
    await page.evaluate((y) => window.scrollTo(0, y), sentinelTop + 60);
    await page.waitForTimeout(250);
    await expect(page.locator(CTA_REGION)).toHaveCount(1);

    // Juste avant la zone "produits similaires" : doit avoir disparu, pour
    // ne pas recouvrir le CTA d'un autre produit dans la grille.
    await page.evaluate((y) => window.scrollTo(0, y), endBoundaryTop + 50);
    await page.waitForTimeout(250);
    await expect(page.locator(CTA_REGION)).toHaveCount(0);
  });

  test("CAS B — contenu PDP long : même comportement attendu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/product/${LONG_CONTENT_SLUG}`, { waitUntil: "load" });

    const offsets = await getSectionOffsets(page);
    expect(offsets).not.toBeNull();
    const { sentinelTop, endBoundaryTop } = offsets!;

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);
    await expect(page.locator(CTA_REGION)).toHaveCount(0);

    await page.evaluate((y) => window.scrollTo(0, y), sentinelTop + 60);
    await page.waitForTimeout(250);
    await expect(page.locator(CTA_REGION)).toHaveCount(1);

    // Milieu de la fenêtre : doit rester visible pendant tout le scroll
    // intermédiaire, pas seulement à l'instant de l'apparition.
    await page.evaluate(
      (y) => window.scrollTo(0, y),
      (sentinelTop + endBoundaryTop) / 2
    );
    await page.waitForTimeout(250);
    await expect(page.locator(CTA_REGION)).toHaveCount(1);

    await page.evaluate((y) => window.scrollTo(0, y), endBoundaryTop + 50);
    await page.waitForTimeout(250);
    await expect(page.locator(CTA_REGION)).toHaveCount(0);
  });

  test("CAS C — produit hors stock : état honnête, bouton désactivé, aucune fausse disponibilité", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/product/${OUT_OF_STOCK_SLUG}`, { waitUntil: "load" });

    const offsets = await getSectionOffsets(page);
    expect(offsets).not.toBeNull();
    await page.evaluate((y) => window.scrollTo(0, y), offsets!.sentinelTop + 60);
    await page.waitForTimeout(250);

    const cta = page.locator(CTA_REGION);
    await expect(cta).toHaveCount(1);
    const button = cta.locator("button");
    await expect(button).toBeDisabled();
    await expect(button).toContainText("Rupture de stock");
    // Aucune fausse disponibilité : le texte ne doit jamais afficher "Ajouter au panier".
    await expect(button).not.toContainText("Ajouter au panier");
  });

  test("CAS D — produit en stock : le clic ajoute réellement au panier, anti double-soumission, toast conservé", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/product/${LONG_CONTENT_SLUG}`, { waitUntil: "load" });

    const offsets = await getSectionOffsets(page);
    await page.evaluate((y) => window.scrollTo(0, y), offsets!.sentinelTop + 60);
    await page.waitForTimeout(250);

    const cartLink = page.locator('a[aria-label^="Panier"]');
    await expect(cartLink).toHaveAttribute("aria-label", "Panier, 0 article(s)");

    // Mission "SÉLECTION DE TAILLE" (15/08/2026, re-fusionnée le 17/08/2026)
    // — ce produit expose de vraies options de variante (taille/couleur...) :
    // la barre sticky refuse désormais, à raison, un ajout tant que le choix
    // n'est pas complet (voir MobileStickyCta.tsx, `needsSelection`), pour
    // ne jamais ajouter une variante arbitraire au panier. Un vrai acheteur
    // choisirait donc une valeur par groupe d'option avant de pouvoir
    // ajouter au panier — reproduit ici plutôt que de contourner ce garde-fou.
    const optionGroups = page.locator('[role="group"][aria-label]').filter({ has: page.locator("button") });
    const groupCount = await optionGroups.count();
    for (let i = 0; i < groupCount; i += 1) {
      const firstAvailable = optionGroups.nth(i).locator('button:not([aria-label*="indisponible"])').first();
      if (await firstAvailable.count()) {
        await firstAvailable.click();
      }
    }

    // Choisir une option peut changer l'image affichée (variante ↔ image
    // associée) et donc la hauteur du contenu au-dessus du viewport ; Chrome
    // ajuste alors le scroll (ancrage de défilement natif) pour compenser,
    // ce qui peut repasser le sentinel dans le viewport et masquer
    // momentanément la barre. Comportement navigateur normal, pas un bug de
    // cette mission : on re-scroll après sélection, comme le ferait un vrai
    // acheteur, plutôt que de figer une position de scroll obsolète.
    const offsetsAfterSelection = await getSectionOffsets(page);
    await page.evaluate((y) => window.scrollTo(0, y), offsetsAfterSelection!.sentinelTop + 60);
    await expect(page.locator(CTA_REGION)).toHaveCount(1);

    const button = page.locator(CTA_REGION).locator("button");
    await expect(button).toBeEnabled();
    await button.click();

    // Le vrai mécanisme du panier (useCart().addToCart) doit être appelé :
    // le compteur du header, alimenté par le même store, doit refléter
    // l'ajout réel — pas un mock local à MobileStickyCta.
    await expect(cartLink).toHaveAttribute("aria-label", "Panier, 1 article(s)", { timeout: 3000 });

    // Feedback "Ajouté ✓" + anti double-tap : le bouton se désactive.
    await expect(button).toContainText("Ajouté");
    await expect(button).toBeDisabled();

    // Toast de confirmation conservé (P1-1, non régressé par cette mission).
    await expect(page.getByText("Ajouté au panier")).toBeVisible();

    // Un second clic pendant la garde ne doit pas être possible (bouton désactivé).
    await expect(button).toBeDisabled();
  });

  test("CAS E — desktop/tablette : la barre sticky est toujours absente au-dessus de 640px", async ({ page }) => {
    for (const viewport of [
      { width: 834, height: 1100 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(`/product/${LONG_CONTENT_SLUG}`, { waitUntil: "load" });
      const offsets = await getSectionOffsets(page);
      await page.evaluate((y) => window.scrollTo(0, y), offsets!.sentinelTop + 60);
      await page.waitForTimeout(250);
      await expect(page.locator(CTA_REGION), `absente à ${viewport.width}px`).toHaveCount(0);
    }
  });

  test("CAS F — resize mobile → desktop → mobile : aucun état incohérent", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/product/${LONG_CONTENT_SLUG}`, { waitUntil: "load" });

    const offsets = await getSectionOffsets(page);
    await page.evaluate((y) => window.scrollTo(0, y), offsets!.sentinelTop + 60);
    await page.waitForTimeout(250);
    await expect(page.locator(CTA_REGION)).toHaveCount(1);

    // Passage en desktop, toujours à la même position de scroll : la barre
    // doit disparaître (masquée en CSS ET le composant recalcule mql.matches).
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(300);
    await expect(page.locator(CTA_REGION)).toHaveCount(0);

    // Retour en mobile, toujours à la même position de scroll logique : la
    // barre doit réapparaître sans avoir besoin de re-scroller.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    await expect(page.locator(CTA_REGION)).toHaveCount(1);
  });
});
