import { defineConfig, devices } from "@playwright/test";

/**
 * Mission UX/UI Phase 4 (2026-08-13) — section 4/7/13 : le projet ne
 * disposait d'aucun script `test` (confirmé en Phase 2 et Phase 3 :
 * "NO TEST SCRIPT PRESENT IN PACKAGE.JSON"). Cette mission exige une
 * couverture de non-régression réelle pour deux comportements qui ne
 * peuvent être vérifiés fiablement qu'en navigateur réel — pas en DOM
 * simulé (jsdom) :
 *  - le piège de focus (Tab/Shift+Tab) des drawers (section 3) ;
 *  - la logique de visibilité géométrique de MobileStickyCta au scroll
 *    (bug P0 corrigé en Phase 3 — voir reports/ondeal-ux-ui-phase3.md).
 * jsdom n'implémente pas la navigation Tab réelle ni les calculs de layout
 * (`getBoundingClientRect`) dont dépend MobileStickyCta — un test unitaire
 * avec un framework comme Vitest+jsdom ne pourrait donc PAS vérifier ces
 * deux comportements de façon fiable. Playwright Test est déjà utilisé
 * comme outil de vérification manuelle dans toutes les phases précédentes
 * de ce projet (voir reports/ondeal-ux-ui-phase2.md, phase3.md) et
 * Chromium est déjà pré-installé dans cet environnement — c'est donc le
 * choix minimal justifié, sans nouvelle dépendance lourde.
 *
 * `webServer` démarre automatiquement `npm run build && npm run start`
 * (build de production, cohérent avec la façon dont ce projet a toujours
 * été vérifié dans les phases précédentes) avant les tests, et le réutilise
 * s'il tourne déjà (utile en local/CI répétés).
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3457",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          executablePath: "/opt/pw-browsers/chromium",
        },
      },
    },
  ],
  webServer: {
    command: "npm run build && npm run start -- -p 3457",
    url: "http://localhost:3457",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
