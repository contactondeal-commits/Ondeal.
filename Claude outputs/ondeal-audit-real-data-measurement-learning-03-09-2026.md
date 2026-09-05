# OnDeal Intelligence — AUDIT « REAL DATA → SIMULATION → ACTION → MEASUREMENT → LEARNING » (03/09/2026)

Audit factuel, sans aucune modification de fichier. Sources : lecture du code (`prisma/schema.prisma`, `src/lib/sync/pipeline.ts`, `src/lib/integrations/shopify.ts`, `src/lib/intelligence/*`, routes `/api/*`, `src/lib/demo/seedDemoStore.ts`), inspection de la base SQLite de dev, et trois lectures **en lecture seule** de la vraie boutique Shopify (`6mvti7-9g.myshopify.com`) via le connecteur Shopify de cette session pour situer le volume réel de données.

## 0. Deux constats préalables qui conditionnent tout le reste

1. **Dans cet environnement, aucune vraie boutique n'a jamais été connectée à OnDeal.** La base contient une seule boutique (`isDemo: true`, 4 produits), 0 `Integration`, 0 `SyncRun`. Le chemin Shopify réel de l'application (`fetchAllProducts`, `fetchRecentOrders`, `updateVariantPrice`, `updateProductStatus`) n'a **jamais été exécuté** contre la vraie boutique depuis OnDeal. Tout ce qui est « REAL » ci-dessous l'est *par construction du code*, pas par observation d'une exécution réelle.
2. **La vraie boutique n'a aujourd'hui presque aucun signal transactionnel.** Sur 90 jours : 1 commande (29,90 €). Sur 30 jours : 11 992 sessions, taux de conversion ≈ 0,008 %, dont 10 983 sessions atterrissant sur `/` avec 8 ajouts panier ; les pages produit les plus visitées font 25 à 40 sessions/30 j. Le catalogue, lui, est volumineux : 1 730 produits, souvent 16 à 72 variantes, **coût unitaire (`inventoryItem.unitCost`) renseigné par variante**, inventaire suivi (quantités = flux fournisseur, ex. 517 831 unités).

Conséquence directe : toute mesure de valeur fondée sur commandes / CA / conversion est **statistiquement impossible aujourd'hui**, quelle que soit la qualité du code. La seule donnée réelle, volumineuse et fiable disponible maintenant est **l'état du catalogue (prix, coût, stock) et ses variations**.

## 1. DONNÉES RÉELLES — classification

| Donnée | Statut dans OnDeal | Détail |
|---|---|---|
| Produits | REAL (si sync) | id, handle, titre, statut, type, vendor, image, createdAt. Absents : description, tags, collections, SEO. |
| Variantes | REAL mais **tronquées** | `variants(first: 25)` dans `PRODUCTS_QUERY` : un produit à 72 variantes n'en remonte que 25. Constaté sur la vraie boutique (72, 69, 31 variantes sur les 8 premiers produits échantillonnés). |
| Prix (variante) | REAL — valeur courante uniquement | `price`, `compareAtPrice`. Écrasé à chaque sync, aucun historique. |
| Coûts | ESTIMÉE (saisie manuelle) | `CostAssumption` **par produit** (pas par variante), saisi à la main : supplierCost, shippingCost, paymentFeesRate, otherFixedCost. `otherFixedCost` null ⇒ traité comme 0. Sur la vraie boutique : 0 hypothèse saisie (rien n'est calculable). |
| Coût unitaire Shopify | INDISPONIBLE dans OnDeal / REAL à la source | `inventoryItem.unitCost` existe par variante sur la vraie boutique et n'est **pas** récupéré par le connecteur. |
| Stock boutique | REAL — valeur courante uniquement | `inventoryQuantity`. Sémantique réelle : quantité du flux fournisseur (import dropshipping), pas un stock détenu. Aucun historique. |
| Stock fournisseur | MOCK | `Variant.supplierStock` n'est écrit que par `seedDemoStore.ts`. Aucun connecteur ne le renseigne. |
| Commandes | INDISPONIBLE | Aucun modèle `Order`. Les commandes des 30 derniers jours sont lues à chaque sync puis **agrégées et jetées**. Le nombre de commandes n'est stocké nulle part (la carte « Commandes / unités vendues (30j) » affiche des unités). |
| Lignes de commande | INDISPONIBLE | Idem. Agrégation produit/jour seulement ; l'id de variante n'est pas demandé dans `ORDERS_QUERY` (`lineItems(first: 50)` : lignes tronquées au-delà de 50). |
| Chiffre d'affaires | CALCULÉE (brute) | `SalesSnapshot.revenue` = somme de `originalTotalSet` (montant ligne avant remises, sans exclusion des commandes annulées/remboursées, sans distinction TTC/HT). |
| Marges | CALCULÉE à partir d'ESTIMÉES | `analyzeMargin` : formule réelle, mais inputs coûts manuels. Marge unitaire seulement, jamais un montant de marge réalisée. |
| Historique des prix | INDISPONIBLE | Seule trace : `simulationSnapshot` + `before/applied/verified` dans `ActionItem` pour les prix modifiés **par OnDeal**. |
| Historique du stock | INDISPONIBLE | Seule trace : `simulationSnapshot` (stock, vélocité) des missions `review_supplier`. |
| Données fournisseurs | INDISPONIBLE | `vendor` (chaîne) uniquement. |
| Données clients | INDISPONIBLE | Non lues, aucun modèle. |
| Analytics (sessions, vues produit, panier) | INDISPONIBLE dans OnDeal / REAL à la source | Shopify expose sessions, ajouts panier, checkout par `landing_page_path` (ShopifyQL) ; GA4 est en place sur le site (sessions précédentes). Rien n'est intégré. |
| Avis | REAL si Judge.me connecté (0 ici) ; MOCK en démo | `Review` réel, `TestReview` explicitement fictif et isolé. |
| Score OnDeal | CALCULÉE, historisée | `ScoreSnapshot` à chaque recalcul. Facteur `salesTrend` **toujours null** (jamais alimenté). |
| Confiance des recommandations | PSEUDO-DONNÉE | Constantes codées en dur (95, 90, 88, 85, 75, 70, 65, 60, 55). Pas une mesure. |
| Impact des recommandations | TEXTE QUALITATIF | Jamais un montant. |

## 2. HISTORIQUE — ce qui est réellement conservé

Conservé en base : `SalesSnapshot` (produit × jour, uniquement les jours avec vente, réécrit pour les 30 derniers jours à chaque sync, jamais purgé — donc un historique long **peut** s'accumuler, mais uniquement si des syncs ont lieu : **il n'existe aucun planificateur**, la sync est manuelle via `/api/sync`) ; `ScoreSnapshot` (un par produit et par recalcul) ; `Recommendation` en statut ACTIONED/DISMISSED (les OPEN sont **supprimées** à chaque recalcul : une recommandation qui disparaît parce que le problème s'est résolu ne laisse aucune trace) ; `ActionItem` (tous statuts, `payloadJson` avec snapshot, `resultJson`) ; `AuditLog` ; `SyncRun`.

Non conservé : série temporelle prix/stock par variante ; commandes ; note moyenne dans le temps (`ratingTrend` toujours null).

Deux défauts de fidélité dans l'usage de l'historique existant : `salesSnapshots: take: 30` prend les 30 **dernières lignes**, pas les 30 derniers jours (avec des jours sans vente, 30 lignes couvrent plus de 30 jours et la vélocité `/30` est surestimée) ; la vélocité est calculée **au niveau produit** puis attribuée telle quelle à **chaque variante** (`pipeline.ts`), donc surestimée pour tout produit multi-variantes. En démo, `SalesSnapshot` est une seule ligne datée du jour contenant 30 jours d'unités.

**Peut-on reconstruire BEFORE → ACTION → AFTER pour une action réelle ?**

- `update_price` : BEFORE = oui (snapshot prix + coûts à la confirmation, `before` dans `resultJson`). ACTION = oui (`applied`, `verified` relu de Shopify, `executedAt`). AFTER = **non** au-delà de l'écho immédiat : aucune fenêtre de référence, ventes au niveau produit seulement (pas variante), rien ne relie une commande postérieure à l'action. La **prédiction** (marge simulée « après ») **n'est pas persistée** : seul `newPrice` est stocké, pas le `deltaMargin` affiché à l'utilisateur.
- `review_supplier` : BEFORE = oui (stock, vélocité). ACTION = déclaration humaine. AFTER = non.
- `unpublish_product` : BEFORE = `product.status`. ACTION = statut relu. AFTER = non.

## 3. ACTIONS — par type

| Type | Donnée modifiée | Snapshot | Résultat réel | Avant | Après | Impact mesurable ? | Limites |
|---|---|---|---|---|---|---|---|
| `update_price` | `Variant.price` (mutation Shopify réelle) | Oui (prix + 4 coûts) | Oui (prix relu) | Oui | Non | **Non** — marge unitaire structurelle seulement ; aucune vente attribuable | Coûts manuels ; prédiction non persistée ; jamais exécuté contre la vraie boutique |
| `unpublish_product` | `Product.status` (mutation réelle) | Non (pas de snapshot dédié) | Oui (statut relu) | Oui | Non | Non | Pas de re-publication ; pas de mesure trafic/vente |
| `review_supplier` | Rien (mission manuelle) | Oui (stock + vélocité) | Déclaration | Oui | Non | Non | `supplierStock` jamais réel ; branche `supplierMismatch` ne se déclenche qu'en démo |
| `promote_product` | Rien | Non | Déclaration | Non | Non | Non | Aucun lien avec un canal ou une campagne |
| `request_reviews` | Rien | Non | Déclaration | Non | Non | Non | Aucun envoi réel |
| `edit_product_data` | Rien | Non | Déclaration | Non | Non | Non | — |
| `update_stock`, `publish_product` | — | — | — | — | — | — | Listés dans `SENSITIVE_ACTION_TYPES`, jamais générés ni exécutables |

## 4. SIMULATION — réelle ou estimation ?

- `simulatePriceChange` : réutilise `analyzeMargin` sur le prix réel et les coûts **manuels**. C'est un **recalcul comptable unitaire déterministe** : correct par construction sur ses inputs, mais aveugle sur le volume (pas d'élasticité, pas de projection de ventes ni de marge réalisée). Classification : **ESTIMATION** (formule réelle, inputs partiellement estimés, aucune dimension prédictive).
- `simulateRestock` : réutilise `analyzeStock` sur stock réel + vélocité (calculée depuis vraies commandes si sync ; mock en démo). Projette des jours de stock ; ignore délai fournisseur, commande réelle. Classification : **ESTIMATION**.
- Aucune simulation n'existe pour `unpublish_product`, `promote_product`, `request_reviews`, `edit_product_data`.

Aucune simulation d'OnDeal n'est aujourd'hui « réelle » au sens « prédit un résultat business observable » : ce sont des recalculs d'état, pas des prédictions. Leur qualité principale, à conserver, est d'être **la même formule que l'analyse** (ANALYSE = SIMULATION).

## 5. MEASUREMENT — « Cette action a-t-elle réellement amélioré le business ? »

**Non, OnDeal ne peut pas y répondre aujourd'hui.** Manquent : (1) une fenêtre de référence persistée avant l'action et une fenêtre d'observation après ; (2) des ventes au niveau **variante** (l'action prix vit sur la variante, les ventes sont agrégées par produit) ; (3) des entités commande (annulations, remboursements, remises, nombre de commandes) ; (4) un signal comportemental (vues produit, ajouts panier) pour les produits sans vente ; (5) un point de comparaison (période précédente, produits non touchés) ; (6) surtout, **du volume** : avec 1 commande / 90 j sur la vraie boutique, aucune fenêtre avant/après n'aura de signification avant longtemps.

## 6. LEARNING — ce qui existe

- Prédiction : **partiellement** — le contexte (snapshot) et la valeur candidate (`newPrice`) sont persistés, mais pas la prédiction elle-même (`deltaMargin`, marge « après » simulée, statut stock projeté).
- Action : oui (`ActionItem`, `AuditLog`).
- Résultat : oui, immédiat seulement (`resultJson` : `before/applied/verified`).
- Écart prédiction / réalité : **inexistant** — aucune structure, aucun calcul, aucune comparaison ; `AuditLog` est du texte libre.

Verdict fondations DATA : **insuffisantes pour un apprentissage** ; suffisantes pour commencer à *enregistrer* prédiction + résultat immédiat (ce qui est le préalable, pas du ML).

## 7. VALEUR BUSINESS — métriques utilisables

| Métrique | Disponible dans OnDeal | Fiable ? | À la source (vraie boutique) |
|---|---|---|---|
| Commandes | Non (non stocké) | — | Oui, mais 1 / 90 j |
| CA | Calculé, brut, produit/jour | Partiel (ni remises, ni annulations, ni net) | Oui (ShopifyQL net/gross) |
| Marge | Estimée (coûts manuels), unitaire | Dépend de la saisie ; 0 saisie sur la vraie boutique | **Oui : `unitCost` par variante** |
| Conversion | Non | — | Oui (sessions, panier, checkout) |
| Panier moyen | Non | — | Oui |
| Stock | Oui, courant | Oui (flux fournisseur) | Oui |
| Vitesse d'écoulement | Calculée (produit, 30 j) | Biais (take 30 lignes ; produit → variante) | ≈ 0 aujourd'hui |
| Note moyenne avis | Oui si Judge.me | Oui | — |
| Trafic produit | Non | — | Oui (faible : 25–40 sessions/produit/30 j) |

## 8. MOCKS, DÉMO ET RACCOURCIS — frontière DEMO / PRODUCTION-REAL

1. Boutique de démonstration (`seedDemoStore.ts`) : 4 produits, avis fictifs, `supplierStock` fictif, un seul `SalesSnapshot` daté du jour. C'est **la seule boutique** de cet environnement.
2. `Variant.supplierStock` : mock pur — jamais alimenté hors démo. La recommandation `data_quality` « stock 0 mais fournisseur disponible » n'existe qu'en démo.
3. `confidence` codée en dur ; `impact` textuel.
4. `salesTrend` (25 % du score) et `ratingTrend` : toujours null.
5. `TestReview` / page test-mode : fictif, correctement isolé.
6. Marketing : génération par gabarits (pas d'IA) ; la route passe `marginRate: null` et `daysOfStock: null` même quand ils sont calculables.
7. Assistant : intentions déterministes ; l'intention « baisse des ventes » ne peut jamais répondre (pas d'historique).
8. Aucun planificateur de sync : l'historique `SalesSnapshot` ne s'accumule que si quelqu'un clique.
9. Connecteur Shopify jamais exécuté contre la vraie boutique ; `variants(first: 25)` et `lineItems(first: 50)` tronquent ; pas de filtre annulations/remboursements ; `unitCost` non lu ; 1 730 produits upsertés séquentiellement en SQLite (performance non éprouvée).
10. Qualité des données réelles non traitée : `compareAtPrice` = `0.00` ou inférieur au prix (valeur = coût) sur de nombreuses variantes — non signalé par `normalize.ts`.
11. `update_stock` / `publish_product` : types déclarés sensibles, sans existence réelle.
12. SQLite en dev (limite de concurrence constatée : timeouts P1008 sous 5 requêtes simultanées).

## 9. PREMIER VERTICAL SLICE (proposition unique)

**« Marge réelle par variante — boucle prix mesurée »**

- **Donnée réelle** : importer `inventoryItem.unitCost` par variante depuis Shopify lors de la sync (champ nullable `Variant.unitCost` — une colonne, pas une architecture). `CostAssumption` reste la source des frais d'expédition / paiement et un éventuel override. Corriger au passage la troncature `variants(first: 25)` (pagination des variantes), sinon l'import est partiel.
- **Signal** : `analyzeMargin` existant, alimenté par `unitCost` réel → « marge négative / faible » calculable sur 1 730 produits au lieu de 4 produits démo. Aucune nouvelle règle.
- **Simulation** : `simulatePriceChange` existant, et **persistance de la prédiction** dans `payloadJson` à la confirmation (marge et taux « après » simulés) — aucune migration.
- **Action** : `update_price` existant (snapshot, revalidation, mutation, vérification) — première exécution réelle contre la vraie boutique.
- **Mesure du résultat** : deux niveaux, honnêtes. (a) Immédiat et réel : marge unitaire vérifiée (prix relu Shopify − coût réel) comparée à la marge prédite → premier enregistrement PRÉDICTION / RÉSULTAT / ÉCART, structurel, disponible dès la première exécution. (b) Différé : agrégation `SalesSnapshot` **par variante** (`lineItems` exposent `variant { id }`, colonne `variantId` nullable), avec fenêtres avant/après fixes et un affichage « données insuffisantes » tant que le volume n'existe pas — la boucle est prête sans prétendre mesurer ce qu'elle ne peut pas encore mesurer.

Pourquoi ce cas : c'est le seul type d'action **réellement automatisé** ; le coût réel existe déjà à la source pour tout le catalogue ; il ne demande aucune nouvelle formule ; il fait passer le moteur de marge de « démo » à « production-réel » en une seule boucle ; et la mesure structurelle est réelle immédiatement, sans dépendre de ventes qui n'existent pas encore. Écartés : boucle stock (stock = flux fournisseur, action manuelle, `supplierStock` mock) ; boucle trafic/conversion (nouvelle intégration analytics, volume produit trop faible) ; boucles avis/marketing (aucune action réelle).

**Préalable non négociable** : connecter la vraie boutique dans OnDeal (Settings › Intégrations) et exécuter une première sync réelle — le connecteur n'a jamais tourné en conditions réelles et révélera probablement des points à corriger (volume, troncatures, qualité `compareAtPrice`).

## 10. CONTRAINTES respectées

Aucun fichier modifié. Aucune donnée fabriquée. Estimations et mocks explicitement étiquetés. Aucune proposition ML. Réutilisation des primitives existantes (`analyzeMargin`, `simulatePriceChange`, `ActionItem.payloadJson/resultJson`, snapshot, sync pipeline).
