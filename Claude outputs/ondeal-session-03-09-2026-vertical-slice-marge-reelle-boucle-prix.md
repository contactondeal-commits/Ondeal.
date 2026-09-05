# OnDeal Intelligence — VERTICAL SLICE « Marge réelle par variante → boucle prix mesurée » (03/09/2026)

Rapport de fin de slice. Règles respectées : aucune mutation Shopify réelle (prix, stock, publication), Phase 3 non refondue (ActionItem, Decision Workspace, snapshot, revalidation, confirmation humaine, retry, vérification Shopify réutilisés tels quels), aucun ML, aucune prédiction de ventes, aucune donnée inventée. Chaque modification a suivi AUDIT → MODIFICATION CIBLÉE → TEST → MESURE.

## 1. Fichiers modifiés / créés

**Moteur (source de vérité, marge, simulation, prédiction, mesure)**
- `src/lib/intelligence/costs.ts` (nouveau) — `resolveCostInputs` : `Variant.unitCost` Shopify prioritaire, `CostAssumption.supplierCost` en repli explicite, transport/frais = hypothèses produit puis boutique, sinon indisponible ; chaque valeur porte sa source.
- `src/lib/intelligence/margin.ts` — `analyzeMargin` étendu (additif) : `grossMargin`, `grossMarginRate`, `supplierCostSource`, `status` REAL / CALCULATED / ESTIMATED / UNAVAILABLE par valeur ; `summarizeGrossMargin`. Formules inchangées.
- `src/types/index.ts` — `DataStatus`, champs additifs sur `MarginAnalysis`.
- `src/lib/intelligence/simulate.ts` — `simulatePriceChange` disponible sur la marge brute quand transport/frais manquent (`fullMarginAvailable`, `fullMarginUnavailableReason`, `deltaGrossMargin`, `deltaGrossMarginRate`). ANALYSE = SIMULATION conservé (mêmes fonctions).
- `src/lib/intelligence/prediction.ts` (nouveau) — `buildPricePrediction` (PREDICTION SNAPSHOT), `measurePriceOutcome` (RESULT → GAP structurel), `assessDeferredMeasurement` (mesure commerciale : « données insuffisantes » sous 30 unités par fenêtre de 14 jours).
- `src/lib/intelligence/recommendations.ts` — signaux « Marge brute négative / faible » (coût réel, avant frais) quand la marge complète n'est pas calculable ; « Forte marge » désormais réservée aux produits qui vendent (sinon 10 579 recommandations de promotion sans aucune vente sur la boutique réelle).
- `src/lib/intelligence/pipeline.ts` — branché sur `resolveCostInputs` + hypothèses boutique ; fenêtre de vélocité = 30 jours calendaires.
- `src/lib/intelligence/salesWindow.ts` (nouveau) — définition unique de la fenêtre de vélocité (corrige le « 30 dernières lignes ≠ 30 derniers jours » relevé par l'audit) ; utilisée par `pipeline.ts`, `stockEvidence.ts`, page Stock.
- `src/lib/intelligence/stockEvidence.ts` — même fenêtre (cohérence capture/comparaison du snapshot stock).
- `src/lib/intelligence/actionKind.ts` — `ExecutionOutcome.measurement?` (additif).
- `prisma/schema.prisma` — `Store.defaultShippingCost`, `Store.defaultPaymentFeesRate` (hypothèses boutique, nullables ; `db push` non destructif).

**Phase 3 — touches techniques minimales, sans refonte**
- `src/app/api/actions/[id]/confirm/route.ts` — le snapshot prix utilise la même résolution de coût que l'analyse (sinon il comparait une autre source) ; persiste `payload.prediction` (PREDICTION SNAPSHOT) à la validation humaine.
- `src/app/api/actions/[id]/execute/route.ts` — même résolution de coût pour la revalidation ; après mutation vérifiée, `measurement` (prédit vs observé) ajouté au résultat.
- `src/components/DecisionCard.tsx` — transmet `supplierCostSource` à la simulation, étiquette « Coût réel Shopify » / « hypothèse », « Confiance de la règle » (au lieu de « Confiance OnDeal »), conserve la prédiction reçue de `/confirm`, n'affiche en expansion que les items transportés en entier.
- `src/components/decision/SimulationPanel.tsx`, `PriceScenarioTable.tsx` (nouveau) — tableau ÉTAT ACTUEL → SCÉNARIO → VARIATION (prix, coût réel, marge brute, taux, transport+frais, marge complète, deltas absolus et relatifs) avec étiquettes de fiabilité.
- `src/components/decision/ResultPanel.tsx` — PRÉVU / OBSERVÉ / ÉCART / prochaine mesure (`MeasurementBlock`), prédiction affichée même en cas d'échec, bouton « Réessayer (nouvelle décision) » sur un échec ordinaire (absent auparavant).

**Performance et écrans**
- `src/lib/pagination.ts`, `src/components/ui/Pagination.tsx`, `src/components/ui/TableControls.tsx`, `src/components/ui/DataTag.tsx` (nouveaux).
- `src/lib/pricing/query.ts` (nouveau) — pagination, recherche, filtres, tri en SQL ; valeurs affichées calculées par `analyzeMargin`.
- `src/app/(app)/pricing/page.tsx` (réécrit), `src/app/(app)/pricing/[variantId]/page.tsx` (nouveau — Decision Workspace), `src/components/pricing/StoreCostDefaultsForm.tsx`, `PriceSimulator.tsx` (nouveaux), `src/app/api/stores/cost-defaults/route.ts` (nouveau).
- `src/app/(app)/dashboard/page.tsx` (réécrit — Command Center), `products/page.tsx`, `stock/page.tsx`, `intelligence/page.tsx` (paginés), `src/lib/intelligence/groupTransport.ts` (nouveau — allègement des groupes transmis au client).
- `src/app/globals.css` — section « Decision Intelligence » (étiquettes, tuiles, cockpit, tables compactes, workspace, scénario, mesure).
- Emojis retirés des pages avis, test-mode, audit-log, paramètres, marketing, produits, stock (règle zéro emoji).

**Tests** : `tests/costs.test.ts` (10), `tests/prediction.test.ts` (9), `tests/recommendations.test.ts` (+2). Total **126/126**.

## 2. Architecture de la boucle

```
Shopify (bulk export lecture seule)  ──►  Variant.price / unitCost / inventoryQuantity        [REAL]
Store.defaultShippingCost / defaultPaymentFeesRate, CostAssumption                             [ESTIMATED]
        │
        ▼  resolveCostInputs (costs.ts) — source explicite par valeur
analyzeMargin (margin.ts) ── grossMargin [CALCULATED] / margin [CALCULATED sur ESTIMATED]
        │
        ▼  generateRecommendations — SIGNAL « marge brute faible / négative », « marge négative / faible »
Command Center / Prix & Marge ── OPPORTUNITY / RISK ── /pricing/[variantId] (Decision Workspace)
        │
        ▼  simulatePriceChange (simulate.ts) — SIMULATION comptable (même fonction que l'analyse)
POST /api/actions (Phase 3, inchangé) ── DECISION (ActionItem)
POST /confirm ── VALIDATION HUMAINE ── simulationSnapshot (Phase 3) + prediction (prediction.ts)
POST /execute ── REVALIDATION (snapshot, Phase 3) ── mutation Shopify ── VERIFICATION (prix relu)
        │
        ▼  measurePriceOutcome — RESULT structurel + GAP ; assessDeferredMeasurement — ventes : « données insuffisantes »
ResultPanel — PRÉVU / APPLIQUÉ / VÉRIFIÉ / ÉCART / prochaine mesure
```

Aucune nouvelle architecture : une fonction de résolution, des champs additifs, deux modules purs (prédiction, fenêtre de ventes), une couche d'accès paginée.

## 3. Données réellement utilisées (REAL)

Prix de vente, coût unitaire Shopify (15 450 variantes sur 16 407), stock, catalogue (1 730 produits), la commande #1001 et sa ligne, l'historique `SyncRun`, les `ActionItem` et leurs payloads (snapshot, prédiction), le prix relu de Shopify après mutation (chemin codé et testé, non exécuté en direct — voir § 8).

## 4. Données encore estimées / indisponibles

- **ESTIMATED** : transport par unité et taux de frais de paiement (hypothèses boutique ou produit). Pour la démonstration j'ai saisi, via le formulaire du produit, **2,50 € et 2,9 %** sur la boutique réelle : ce sont des valeurs de démonstration, étiquetées « estimé » partout, à remplacer par tes vraies valeurs. Le modèle applique le transport **par unité vendue** (pas par commande) — simplification héritée du moteur, documentée dans l'interface.
- **ESTIMATED (repli)** : `CostAssumption.supplierCost` pour les 957 variantes sans coût Shopify (0 saisie aujourd'hui → marge indisponible, jamais estimée).
- **UNAVAILABLE** : volume de ventes après changement de prix, chiffre d'affaires et marge réalisée (aucun modèle de demande ; 1 commande / 365 jours) ; mesure commerciale différée (statut « données insuffisantes » tant que < 30 unités dans chaque fenêtre de 14 jours) ; historique des prix ; connexion live Shopify.
- **Constante de règle** : la « confiance » des recommandations reste un poids fixe du moteur (95/90/70…), affichée comme « Confiance de la règle » — pas une mesure. Le Decision Workspace affiche en plus un niveau de confiance **dérivé des sources** (Élevé / Partiel / Insuffisant).

## 5. Tests

`npm test` → 14 fichiers, **126/126** (dont 21 nouveaux : résolution de coût, marge brute vs complète, simulation sur marge brute, ANALYSE = SIMULATION, prédiction, mesure prédiction/résultat, seuil de mesure différée, signaux de marge brute, gating « forte marge »). `npm run typecheck` → 0 erreur. `npm run lint` → 0 erreur. `npm run build` → réussi (32 routes, dont `/pricing/[variantId]` et `/api/stores/cost-defaults`).

Test navigateur réel (Playwright, boutique réelle) : Réessayer → Décider → saisie 114,99 € → Confirmer → prédiction persistée → exécution → échec honnête, panneau résultat avec prédiction et bouton de reprise. Aucune erreur JavaScript (seul un 404 sur `/favicon.ico`, absent depuis l'origine).

## 6. Performances avant / après (boutique réelle, 1 730 produits, 16 407 variantes, serveur dev, à chaud)

| Page | Avant | Après |
|---|---|---|
| `/pricing` | **51,1 s / 26,9 Mo** (16 407 lignes + 16 407 formulaires) | **0,35–0,44 s / 0,20 Mo** (50 lignes, SQL) |
| `/products` | 6,0 s / 2,6 Mo | 0,28 s / 0,14 Mo |
| `/stock` | 4,5–6,1 s / 2,1 Mo | 0,38–0,44 s / 0,12 Mo |
| `/intelligence` | 2,9 s / 8,9 Mo (3 454 recos) | 0,20–0,33 s / 0,43–0,64 Mo (7 424 recos, 25 groupes/page) |
| `/dashboard` | 0,6–1,0 s / 1,1 Mo | 0,22–0,48 s / 0,28–0,35 Mo (deux fois plus de recommandations) |

Corrections notables : dernier score par produit calculé en SQL avec `storeId` dans la sous-requête (1 754 ms → 32 ms ; tri produits 973 ms → 4 ms) au lieu des « 500 dernières lignes » (qui faussaient le score moyen du Command Center sur 166 produits au lieu de 1 730) ; groupes de recommandations allégés avant transport au client (un groupe de 250 variantes : ~100 Ko → quelques Ko). Recalcul de l'intelligence : 4,7 s → 9 s avec les signaux de marge (7 424 recommandations), acceptable, à surveiller (`ScoreSnapshot` : 1 730 lignes par recalcul, sans purge).

## 7. Nouveaux écrans (captures jointes)

- **Command Center** (`01-command-center.png`, `07-command-center-decisions.png`) : en-tête cockpit (nom, résumé des signaux, dernière synchronisation étiquetée, complétude, état Shopify, anneau de santé), six tuiles de décision (risques urgents, opportunités, signaux de marge, décisions en attente, exécutées 7 j, à reprendre) et quatre tuiles de données (ventes 30 j, unités, ruptures, note) toutes étiquetées REAL / CALCULATED / UNAVAILABLE ; « Prochaine action » (Decision Card complète), « Priorités suivantes », colonne « Décisions » (statut réel de chaque ActionItem, prédiction résumée), « Pourquoi ce score ».
- **Prix & Marge** (`08-pricing-v4.png`) : légende de fiabilité, cinq tuiles (variantes, coût réel, marge brute négative, marge brute < 15 %, marge complète calculable), formulaire des hypothèses boutique (étiqueté Estimé), table compacte paginée (50/329 pages) avec recherche, filtres coût / marge brute, tri, colonnes Prix [Réel] · Coût [Réel/Estimé] · Marge brute (taux) [Calculé] · Marge complète [Estimé] · Stock [Réel] · Décision (« Décider » si signal ouvert, « Simuler » sinon).
- **Decision Workspace** (`03-workspace-harness.png`, `11-workspace-confirm-step.png`) : fil d'Ariane, « État actuel » (7 valeurs étiquetées avec leur source), « Données utilisées et confiance » (niveau dérivé des sources, liste des sources, hypothèses produit), « Décision » (Decision Card Phase 3 : signal, pourquoi, tableau de scénario État actuel → Scénario → Variation, validation, exécution).
- **Résultat** (`12-workspace-after-retry-execute.png`) : état FAILED honnête, bloc « Prévu à la validation » (prix, marge brute, marge complète), bouton de reprise ; en cas de succès : Avant / Appliqué / Vérifié puis tableau Prévu / Observé / Écart et ligne « Effet sur les ventes : données insuffisantes… ».
- **Stock**, **Product Intelligence**, **Centre d'intelligence** : mêmes composants (tuiles, table compacte, contrôles, pagination), sans emoji.

## 8. Démonstration de la boucle (variante réelle)

Variante : **Military Tactical Dog Harness — Red Harness / M (15-30KG)** (`cmtm2ty910rpj7d664ej9aym0`), prix 109,98 €, coût réel Shopify 87,98 €, stock 1 850.

1. REAL SHOPIFY DATA → REAL UNIT COST → REAL MARGIN : marge brute 22,00 € (20,0 %) [calculé sur réel] ; marge complète 16,31 € (14,8 %) [avec hypothèses 2,50 € + 2,9 %].
2. SIGNAL : recommandation « Marge faible » (14,8 % < 15 %), `update_price`, payload avec `supplierCostSource: shopify_unit_cost`.
3. DECISION : `POST /api/actions` → ActionItem `cmtm482cj08eh7duc841hvois` (PENDING_VALIDATION).
4. SIMULATION → HUMAN VALIDATION : `POST /confirm` avec 119,98 € → CONFIRMED.
5. PREDICTION SNAPSHOT (persisté dans `payloadJson`) : prix 109,98 → 119,98 ; coût 87,98 (Shopify) ; marge brute 22,00 → 32,00 (+10,00 €, +45,5 %) ; marge complète 16,31 → 26,02 (+9,71 €) ; hypothèses et leurs sources ; horodatage ; liste explicite de ce qui n'est pas prédit (volume, CA, marge réalisée). `simulationSnapshot` Phase 3 également capturé.
6. REAL PRICE ACTION → REVALIDATION : `POST /execute` → snapshot comparé aux données réelles (aucun écart) → appel Shopify → **« Shopify n'est pas connecté pour cette boutique »** → FAILED, prix en base inchangé (109,98 €), résultat et prédiction conservés.
7. RETRY (navigateur réel) : Réessayer → nouvelle décision `cmtm4ah8u08ep7duckzj9u8r5` avec 114,99 € → prédiction 22,00 → 27,01 € persistée → même échec honnête.

**Ce qui n'a PAS pu être démontré en direct** : SHOPIFY VERIFICATION → RESULT → PREDICTION VS RESULT. Cause unique : aucun jeton Admin API dans OnDeal (je ne manipule pas de jeton ; l'application tourne dans un environnement que tu ne peux pas atteindre pour le saisir). Ces trois étapes sont codées (`executeUpdatePrice` : prix relu de Shopify, `measurePriceOutcome`), couvertes par 6 tests unitaires (résultat conforme, écart de prix/coût, mesure différée insuffisante) et affichées par `ResultPanel`. Pour les exécuter réellement : lancer l'application avec ta base, saisir toi-même le jeton dans Settings › Intégrations (scopes `read_products, read_inventory, read_orders, write_products`), ouvrir `/pricing/<variantId>` et exécuter la décision — le prix sera modifié sur ta boutique.

## 9. Risques restants

1. **Mutation réelle jamais exécutée depuis OnDeal** : `updateVariantPrice` (productVariantsBulkUpdate) n'a jamais tourné en conditions réelles ; le premier essai doit se faire sur une variante à faible enjeu.
2. **Hypothèses de frais** : la marge complète dépend de deux valeurs saisies ; le transport est appliqué par unité, pas par commande. Avec 2,50 € + 2,9 %, 2 322 variantes passent en « marge négative » (articles à moins de 5 €) — signal réel, mais dépendant entièrement de l'hypothèse de transport.
3. **Volume de ventes nul** : la mesure commerciale restera « données insuffisantes » tant que la boutique ne vend pas ; aucune conclusion business ne pourra être tirée d'un changement de prix avant longtemps.
4. **Recommandations en masse** : 7 424 OPEN (1 645 ruptures sur flux fournisseur, 1 730 « aucun avis », 2 849 marge, 1 121 fiche). Groupées par produit, mais la hiérarchisation reste par règles fixes.
5. **`ScoreSnapshot` sans purge** et recalcul de 9 s à chaque sync / changement d'hypothèse ; SQLite (concurrence limitée) pour un catalogue de cette taille.
6. **Plan** : l'organisation de test a été passée de STARTER à PRO pour rendre « Prix & Marge » visible (fonctionnalité PRO) ; `maxProducts` n'est toujours pas appliqué à la sync.
7. **Pas de favicon**, pas d'historique de prix (le cas #1001 vendu à 29,90 € contre 33,99 € aujourd'hui reste inexplicable).

## 10. Verdict

**GO conditionnel** pour l'industrialisation finale. Les neuf premières étapes de la boucle sont réelles, vérifiées sur une vraie variante avec un vrai coût Shopify, avec prédiction persistée, revalidation et reprise fonctionnelles, sur une interface paginée et étiquetée de bout en bout. Les trois dernières (mutation Shopify vérifiée → résultat → prédiction vs résultat) sont codées et testées mais non démontrées en direct, faute de jeton — condition de levée : une première exécution réelle par toi, avec ton jeton, sur une variante à faible enjeu. Je ne passe pas à la phase finale sans ton GO explicite.

État laissé en base : boutique réelle avec hypothèses de démonstration (2,50 € / 2,9 %), deux ActionItems FAILED sur la variante Harness (historique conservé), organisation de test en plan PRO, boutique démo intacte.
