# OnDeal Intelligence — ÉTAPE 1 : synchronisation READ-ONLY de la boutique réelle + audit post-sync (03/09/2026)

Règle absolue respectée : aucune mutation Shopify (prix, stock, publication, suppression), aucune action commerciale, aucun test destructif. Seules des lectures ont été faites sur la boutique `6mvti7-9g.myshopify.com`. Aucune modification de la Phase 3 (ActionItem, Decision Workspace, snapshot, moteur de recommandations). Aucun Learning Engine, aucun ML.

## 1. Méthode (et ce qu'elle implique)

Le connecteur live d'OnDeal exige un jeton Admin API saisi par le marchand dans Settings › Intégrations. Je ne manipule jamais de jeton, et l'application tourne dans un environnement que l'utilisateur ne peut pas atteindre pour le saisir lui-même. La validation a donc été faite ainsi :

1. Connecteur corrigé (`src/lib/integrations/shopify.ts`) ; ses requêtes GraphQL validées contre le schéma Shopify réel (`validate_graphql_codeblocks`) et exécutées sur une petite page réelle (2 produits, 5 commandes) pour confirmer la forme des données (dont `inventoryItem.unitCost`, `variant { id }` sur les lignes).
2. Export complet en lecture seule par **bulk operations** Shopify (le mécanisme recommandé par Shopify pour les gros catalogues) : produits+variantes (18 137 objets, 6,06 Mo, 19 s côté Shopify), commandes+lignes (2 objets). Les deux jobs ont été approuvés dans l'interface.
3. Ingestion par `scripts/ingest-shopify-bulk.ts`, qui réutilise **exactement** l'étape STORE de la sync live (`src/lib/sync/shopifyStore.ts`) : même normalisation, mêmes upserts, mêmes clés d'unicité.

Conséquence honnête : la boucle FETCH live (jeton) n'a pas été exécutée à plein volume. Le code de pagination des variantes au-delà de 100 (`PRODUCT_VARIANTS_QUERY`) et des lignes au-delà de 100 (`ORDER_LINES_QUERY`) est écrit, validé en schéma et typé, mais n'a pas tourné en conditions réelles : dans l'export bulk, Shopify fournit lui-même toutes les variantes (dont les 12 produits à plus de 100 variantes). Dans OnDeal, l'intégration Shopify de la boutique réelle reste affichée « Non connecté » — c'est la vérité tant qu'aucun jeton n'a été saisi par le marchand.

## 2. Changements de code (uniquement ce qui était nécessaire)

- **Schéma Prisma** (`prisma db push`, non destructif, données existantes intactes) : `Variant.unitCost` / `unitCostCurrency` (coût réel Shopify, distinct des `CostAssumption`), modèles `Order` et `OrderLine` (annulation, statut financier, total, remboursé ; ligne → produit/variante, quantité, quantité courante, montant avant/après remises), `SyncRun.statsJson`.
- **Connecteur** : `variants(first: 25)` → `first: 100` + continuation paginée par produit ; `lineItems(first: 50)` → `first: 100` + continuation paginée par commande ; `inventoryItem.unitCost` ; `variant { id }`, `cancelledAt`, `displayFinancialStatus`, `currentTotalPriceSet`, `totalRefundedSet`, `currentQuantity`, `discountedTotalSet` ; fenêtre de commandes 30 → 90 jours ; compteurs de pages.
- **Pipeline** : étape STORE extraite dans `shopifyStore.ts` (produits par lot transactionnel, commandes, `rebuildSalesSnapshots`) ; refus explicite de synchroniser une boutique `isDemo` ; `SalesSnapshot` désormais dérivé des lignes de commande (annulées exclues, remboursements non déduits) ; distinction dans `SyncRun` entre **erreurs** (donnée non stockée) et **signalements qualité** (donnée stockée telle quelle mais incohérente).
- **Normalisation** : `unitCost` (null reste null, négatif → null signalé, 0 conservé et signalé) ; `compareAtPrice` = 0 → null signalé (Shopify n'a pas de prix barré « 0 ») ; `compareAtPrice` ≤ prix → **conservé tel quel** et signalé (pas une promotion, souvent un coût importé au mauvais endroit). Aucune donnée Shopify altérée arbitrairement.
- **Dashboard** : « Chiffre d'affaires (30j) » renommé « Ventes brutes (30j, hors annulations) », « Commandes / unités vendues » → « Unités vendues (30j) » (le nombre de commandes n'y était pas).
- **Tests** : +10 (normalisation `unitCost`/`compareAtPrice`, mappers commande/ligne sur la forme réelle observée). Total **105/105**.
- **Docs** : `docs/INTEGRATIONS.md` (section import bulk).

## 3. Résultat de la synchronisation (SyncRun `cmtm2xjki00017djlj07zujhh`, `triggeredBy: bulk_import`, statut `success`)

| Mesure | Shopify | OnDeal |
|---|---|---|
| Produits | 1 730 (`productsCount`) | **1 730** |
| Variantes | 16 407 (`productVariantsCount`, précision EXACT) | **16 407** |
| Variantes avec `unitCost` | — | **15 450** (94,2 %), toutes en EUR (0 écart de devise) |
| Variantes sans `unitCost` | — | **957** (5,8 %), réparties sur 219 produits (947 chez le vendor « Ondeal ») |
| Commandes (365 j) | 1 (`ordersCount`) | **1** (#1001, 04/08/2026, PAID, 34,80 € port inclus, 0 remboursé, non annulée) |
| Lignes de commande | 1 | **1** |
| Lignes avec `variantId` | 1 | **1** (résolue vers la variante OnDeal) |
| Produits/variantes rejetés | — | 0 |
| Doublons (produit, variante) | — | 0 / 0 |
| Variantes orphelines dans l'export | — | 0 |
| `supplierStock` non nul sur la boutique réelle | — | 0 (jamais écrit par la sync — mock démo uniquement) |
| `SalesSnapshot` | — | 1 ligne (produit × jour) |
| Recommandations OPEN générées | — | 1 730 « Aucun avis », 1 645 « Rupture de stock » (variantes à 0), 79 « Produit actif publié sans stock » |

Durée : **17,1 s** au premier import (parse JSONL 0,1 s ; 1 730 produits + 16 407 variantes stockés en 12,3 s ; commandes 8 ms ; recalcul intelligence 4,7 s), 16,0 s aux deux suivants. Export côté Shopify : 19 s.

**Idempotence** : trois imports successifs → comptes identiques, **empreinte SHA-256 des 16 407 variantes identique** (`967daaedc6071ec1`), 0 doublon. Seul `ScoreSnapshot` croît (1 730 lignes par recalcul, par conception d'historique — 5 190 lignes après 3 imports, à surveiller).

**Données tronquées** : aucune. Pour mémoire, l'ancienne requête `variants(first: 25)` aurait tronqué **142 produits** (8,2 % du catalogue), dont 12 à plus de 100 variantes (maximum : 250).

**Signalements qualité** (stockés tels quels, tracés dans `SyncRun.statsJson` et un échantillon dans `errorSample`) : 6 936 variantes avec `compareAtPrice` ≤ prix (valeur = coût importé, pas une promotion), 103 avec `compareAtPrice` = 0,00 → null. Deux produits distincts portent exactement le même titre (« Ll-Yk1 Halloween Cardigan… », 250 variantes chacun) — doublon probable côté Shopify, non modifié.

**Erreurs** : 0.

## 4. Vérification d'intégrité

Boutique démo intacte (4 produits, 9 ActionItems, 10 recommandations, `supplierStock` fictif inchangé, `unitCost` null), toujours accessible. Boutique réelle : statut produits 1 729 `active` + 1 `archived` ; stock : 1 645 variantes à 0, 615 entre 1 et 20, 1 116 entre 21 et 1 000, 13 031 au-delà de 1 000 (quantités = flux fournisseur). Aucun `unitCost` ≥ prix. Distribution de la marge brute (prix − coût, **avant** transport et frais de paiement) sur les 15 450 variantes costées : 94 sous 30 %, 44 entre 30 et 50 %, 15 312 à 50 % ou plus.

## 5. Cinq exemples réels (produit → variante → prix → coût → stock → marge)

Marge indiquée = prix − `unitCost` Shopify, **avant** transport et frais de paiement (aucune `CostAssumption` n'existe sur la boutique réelle : le taux complet n'est pas encore calculable).

1. Table de Camping Pro Garden 50 × 43 × 43 cm — 1 variante — 18,99 € — coût 7,54 € — stock 10 — marge brute 11,45 € (60,3 %).
2. Military Tactical Dog Harness — 72 variantes — « Red Harness / M (15-30KG) » — 109,98 € — coût 87,98 € — stock 1 850 — marge brute 22,00 € (20,0 %) : candidat réaliste à « marge faible » une fois transport et frais intégrés.
3. Thermos Alimentaire BRA Efficient Inox — 1 variante — 28,99 € — **coût absent côté Shopify** — stock 20 — marge **non calculable** (jamais estimée).
4. Gourdes de Sport en Titane — 5 variantes — « TI3530 Gourde Titane 700 ml Édition Limitée » — 139,99 € — coût 55,99 € — **stock 0** — marge brute 84,00 € (60,0 %) : recommandation « Rupture » réelle.
5. Casque Gaming Blackfire BFX-40 — 1 variante — prix actuel 33,99 € — **coût absent** — stock 19 — **c'est la seule variante vendue** (#1001 : 1 unité à 29,90 €, le 04/08/2026). Le prix a donc changé depuis la vente (29,90 → 33,99) et OnDeal ne peut pas dater ce changement : l'absence d'historique des prix est confirmée sur un cas réel.

## 6. Performances

Sync : satisfaisante (17 s pour 1 730 produits / 16 407 variantes en SQLite, transactions par lot). **Interface** : toutes les pages répondent 200 sur la boutique réelle, mais trois pages rendent le catalogue entier sans pagination : `/pricing` **51 s et 27 Mo de HTML** (16 407 lignes, chacune avec un formulaire d'hypothèses), `/products` 6 s / 2,6 Mo, `/stock` 4,5–6 s / 2,1 Mo, `/intelligence` 3 s / 8,9 Mo (3 454 recommandations). Non corrigé ici (hors périmètre de l'étape 1) — à traiter dans le vertical slice, qui touche de toute façon `/pricing`. Le dashboard reste à 0,6–1 s.

## 7. Après cette sync, qu'est-ce qu'OnDeal peut considérer comme PRODUCTION-REAL ?

**PRODUCTION-REAL, vérifié contre Shopify** : le catalogue complet (1 730 produits : identité, statut, type, vendor, image) ; les 16 407 variantes (titre, SKU, prix courant, prix barré tel quel, stock courant) ; le **coût unitaire réel Shopify** sur 15 450 variantes (null, jamais estimé, sur les 957 autres) ; la commande #1001 et sa ligne rattachée à sa variante ; le `SalesSnapshot` dérivé de cette ligne ; l'historique des `SyncRun` avec statistiques complètes.

**Réel mais à sémantique limitée** : le stock est celui du flux fournisseur (import dropshipping), pas un stock détenu ; les montants de vente sont bruts après remises, hors annulations, **remboursements non déduits** (aucun chiffre « net » n'est présenté) ; `compareAtPrice` est réel mais incohérent sur 6 936 variantes (signalé, pas corrigé).

**Toujours pas production-real** : la connexion live (aucun jeton saisi : « Non connecté » affiché à juste titre) ; les marges complètes (0 `CostAssumption` sur la boutique réelle : transport et frais de paiement inconnus — la marge brute prix − coût est réelle, le taux de marge du moteur reste non calculable) ; toute métrique fondée sur le volume de ventes (1 commande sur 365 jours) ; l'historique des prix et du stock (inexistant — confirmé sur le cas #1001) ; `supplierStock` (null sur la boutique réelle, correct) ; les 3 454 recommandations OPEN (réelles par construction, mais 1 645 « Rupture » sur un flux fournisseur à 0 et 1 730 « Aucun avis » sans Judge.me connecté : exactes, pas encore hiérarchisées).

## 8. Points restant à trancher pour le vertical slice

- Où intégrer `unitCost` dans `analyzeMargin` : coût fournisseur = `Variant.unitCost` (réel, par variante) avec `CostAssumption.supplierCost` (par produit) en repli/override explicite ; transport et frais de paiement restent à saisir (une hypothèse par boutique serait plus réaliste qu'une par produit sur 1 730 produits).
- Pagination/filtrage des pages `/pricing`, `/products`, `/stock`, `/intelligence`.
- Plan STARTER : `maxStores: 1` (l'organisation de test a maintenant 2 boutiques, créées par script hors contrôle de plan) et `maxProducts: 1000`, jamais appliqué à la sync — à décider.
- `ScoreSnapshot` : 1 730 lignes par recalcul, sans purge.

## 9. Validation réelle (sortie exacte)

- `npm test` → 12 fichiers, **105/105 tests passés**.
- `npm run typecheck` → 0 erreur.
- `npm run lint` → 0 erreur/warning.
- `npm run build` → build de production réussi (31 routes).

Sauvegarde de la base avant l'étape : `/root/dev.db.backup-before-real-sync-1788472824` (conteneur de session). Fichiers d'export : `/root/shopify-bulk/products.jsonl` (6,06 Mo), `orders.jsonl`.
