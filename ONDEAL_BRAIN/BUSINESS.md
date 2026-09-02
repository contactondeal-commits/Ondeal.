# BUSINESS.md — Modèle économique OnDeal

*Voir `_LEGEND.md` pour les labels. Mise à jour : 02/09/2026.*

## Nature de l'activité

OnDeal (ondeal.fr) est un site e-commerce généraliste type marketplace/déstockage, opéré sur Shopify (boutique "Ondeal", domaine technique `shop.ondeal.fr`, plan Shopify, devise EUR, France) avec un frontend applicatif Next.js séparé consommant la Storefront API. **CONFIRMÉ.**

Le sourcing produit repose au moins en partie sur du dropshipping via deux fournisseurs : **CJdropshipping** (intégration documentée, clé API jamais configurée en session — voir DATA.md) et **Syncee** (mentionné dans la documentation historique, non audité en détail cette session). **CONFIRMÉ** pour l'existence de l'intégration CJ et son usage réel le 13/08/2026 (118 produits importés) ; **À VÉRIFIER** pour la part relative de Syncee dans le catalogue actuel.

## Taille et état du catalogue (temps réel, revérifié 2x le 02/09/2026)

| Indicateur | Valeur |
|---|---|
| Produits totaux | 1 715 |
| Actifs | 1 710 |
| Brouillons | 4 |
| Archivés | 1 |
| Collections | 40 |
| Ruptures de stock (au moins une variante) | 167 (≈9,8 % des actifs) |

**CONFIRMÉ** — requête `productsCount`/`collectionsCount` GraphQL exécutée deux fois à quelques minutes d'écart, résultat identique.

### ⚠️ Anomalie majeure non résolue — écart catalogue 8 487 vs 1 715

Le rapport `reports/cj-phase4-execution-final.md` (13/08/2026, CONFIRMÉ comme document existant et cohérent en interne) affirme que le catalogue Shopify est passé de **8 369 à 8 487 produits** après l'import CJ, avec un détail ACTIVE 893→970 / DRAFT 301→342 "vérifié par requête directe post-import".

Or le comptage réel de ce jour (02/09/2026) donne **1 715 produits au total**, dont 1 710 actifs. L'écart est d'environ **6 772 produits (-80 % du catalogue déclaré au 13/08)**.

Aucune cause n'a pu être établie cette session : aucune opération en masse (`currentBulkOperation`) n'est en cours ou trouvable via l'API, et aucun journal d'audit/suppression n'a été consulté (accès non disponible). Trois hypothèses non tranchées, à vérifier par l'utilisateur :
1. Une suppression en masse volontaire ou accidentelle a eu lieu entre le 13/08 et le 02/09 (nettoyage catalogue, script, erreur manuelle).
2. Le chiffre de 8 487 du 13/08 était lui-même erroné (bug de comptage, boutique de test confondue avec la boutique réelle).
3. Un changement de scope/boutique (le shop interrogé aujourd'hui est confirmé `Ondeal` / `shop.ondeal.fr` — CONFIRMÉ via `get-shop-info` — donc l'hypothèse d'un shop différent est peu probable mais pas formellement exclue pour le 13/08).

**Statut : À VÉRIFIER — priorité haute.** Voir RISKS.md et DECISIONS.md. Recommandation : demander à l'utilisateur s'il a lui-même supprimé des produits, ou consulter l'historique Shopify Admin (Paramètres > Notifications, ou contacter le support Shopify pour un journal d'activité) avant toute nouvelle campagne d'import.

#### Mise à jour 02/09/2026 (session suivante) — la piste "BigBuy archivé volontairement" est vérifiée et NE correspond PAS aux données réelles

Une instruction reçue ultérieurement affirmait que l'écart s'expliquait par ~8 000 produits BigBuy archivés volontairement (donc à ignorer, pas un bug). **Conformément à la règle "ne jamais résoudre silencieusement une contradiction", cette prémisse a été vérifiée avant d'être acceptée — et elle ne correspond pas à l'état réel du magasin :**

- `productsCount(query:"status:archived")` = **1** (pas ~8 000).
- `productsCount(query:"vendor:BigBuy")` = **0**. Idem pour plusieurs variantes de tag (`tag:bigbuy`, `tag:BigBuy`, `tag:bigbuy-dropshipping`, `tag:supplier-bigbuy`, `tag:fournisseur-bigbuy`) et de vendor (`vendor:'Big Buy'`) = **0** dans chaque cas.
- Le nom "BigBuy" existe bel et bien dans le code du projet, mais comme **fournisseur historique légitime** (mentionné aux côtés de "DSers" comme source d'import ayant posé le tag `cat-bureau-papeterie` sur environ 210 produits réels, toujours actifs) — **pas comme un lot de ~8 000 produits mis à l'écart.**

**Conclusion honnête : l'écart 8 487 → 1 715 reste non expliqué.** Ce n'est ni confirmé comme un bug, ni confirmé comme un choix volontaire documenté dans le magasin actuel — les deux hypothèses restent ouvertes, mais celle spécifiquement avancée (archivage BigBuy) est **infirmée par la donnée réelle**. Il est possible que l'information "8 000 produits BigBuy archivés" provienne d'une autre boutique, d'un système externe (ex. tableau fournisseur BigBuy lui-même, hors Shopify), ou d'un souvenir approximatif — seul l'utilisateur peut trancher. **Question directe à poser à l'utilisateur (voir DECISIONS.md) : à quoi faites-vous référence exactement avec "les ~8 000 produits BigBuy archivés" — un export BigBuy externe à Shopify, une autre boutique, ou autre chose ?**

## Répartition du catalogue par catégorie (tags `cat-*`, CONFIRMÉ via comptage GraphQL live)

| Catégorie | Produits actifs (tag) |
|---|---|
| Bijoux | 151 |
| Montres homme | 116 |
| Jouets | 107 |
| Cuisine | 97 |
| Outils de jardin | 85 |
| Soins du visage | 76 |
| Rangement | 49 |
| Téléphones | 12 |
| Tablettes | 8 |
| Claviers | 8 |
| Souris | 5 |
| Écrans | 7 |
| TV | 2 |
| PC portables | 4 |
| PC fixes | 1 |
| Ordinateurs (générique) | 0 |
| Romans | 0 |
| BD | 0 |

**Lecture business (PROBABLE, pas encore un fait établi)** : le catalogue réel est aujourd'hui structurellement orienté bijoux/montres/jouets/cuisine/jardin/beauté, malgré une arborescence de navigation (`src/data/categories.ts`, 11 catégories principales incluant Électronique/Informatique) qui laisse penser à un site généraliste équilibré. L'électronique et l'informatique — catégories à fort trafic de recherche généralement — sont quasiment vides. Ceci a un impact SEO/CRO direct (voir SEO.md, PRODUCT_STRATEGY.md).

## Répartition par prix (actifs, CONFIRMÉ)

| Tranche | Produits |
|---|---|
| < 20 € | 889 (52 %) |
| 20-50 € | 571 (33 %) |
| 50-100 € | 293 (17 %)* |
| 100-300 € | 197 (12 %)* |
| > 300 € | 31 (2 %) |

*Pourcentages arrondis sur 1 710 actifs ; les tranches se recoupent légèrement dans le calcul brut, à retraiter si un usage précis en % est nécessaire — **À VÉRIFIER** pour le detail exact des bornes (inclusif/exclusif) telles que formulées dans les requêtes GraphQL originales.

**Lecture** : le positionnement prix réel est très orienté petit budget (85 % du catalogue sous 50 €), cohérent avec un modèle dropshipping/déstockage à faible ticket moyen plutôt qu'un marketplace premium.

## Économie unitaire (dropshipping CJ, échantillon du 13/08/2026)

- Marge moyenne observée sur les 118 produits importés : **150 % / 73,70 € par produit** — **CONFIRMÉ comme chiffre rapporté dans `cj-phase4-execution-final.md`**, mais ce n'est qu'un échantillon de 118 produits sur les ~1 710 actifs actuels, pas une moyenne catalogue globale. Ne pas extrapoler sans le dire.
- Revenu potentiel cité (≈104 352 €) est explicitement une **projection** (stock initial × prix de vente), pas un revenu réalisé. **PROBABLE que ce chiffre soit désormais obsolète** compte tenu de l'anomalie catalogue ci-dessus.
- Aucune donnée de chiffre d'affaires réel, de commandes réelles ou de taux de conversion réel n'a été consultée cette session (l'accès `mcp__Shopify__list-orders` / `run-analytics-query` n'a pas été exploité pour cette mission — **À VÉRIFIER / à faire en priorité 30 jours**, voir ROADMAP.md).

## 🚨 Constat commercial prioritaire (ajouté 02/09/2026) — quasi-absence de ventes, CONFIRMÉ

**1 seule commande dans toute l'histoire du magasin** : `#1001`, créée le 04/08/2026, statut PAID, total 34,80 € — **CONFIRMÉ par `ordersCount` interrogé deux fois (total=1, payées=1) et par le détail de la commande elle-même.** Sur 1 710 produits actifs, un seul lot a donc généré une vente ; les 1 709 autres, zéro.

**Ce constat change radicalement la priorité de toute analyse produit/catalogue** : peu importe la qualité du merchandising ou la profondeur des catégories tant qu'il n'y a essentiellement aucun trafic qualifié atteignant le site, ou aucune confiance suffisante pour convertir ce trafic. Voir RISKS.md (nouveau risque prioritaire), et voir CLAIMS.md CLAIM-007 pour le détail de la vérification. Ce constat corrobore et rend plus urgent le point déjà documenté dans MARKETING.md/DATA.md sur l'absence de tracking analytique — sans lui, on ne sait même pas combien de visiteurs ont vu le site pour ne générer qu'une seule vente.

**Conséquence directe sur les priorités de cette mémoire** : tout effort futur d'enrichissement catalogue (voir CATALOG_GROWTH_ENGINE.md) doit être considéré comme secondaire tant que la cause de l'absence de trafic/conversion n'est pas au moins partiellement comprise.

## Statut de déploiement (CONFIRMÉ)

- Hébergement : Vercel, équipe `on-deal`, plan **Pro actif** (cycle 01/09-01/10/2026), moyen de paiement Visa débit valide jusqu'en 06/2030, aucune anomalie de facturation détectée.
- Domaines `ondeal.fr` et `www.ondeal.fr` correctement pointés sur le projet `ondeal-marketplace`.
- Un incident de disponibilité (page "déploiement suspendu") a été observé et confirmé résolu par l'utilisateur le 02/09/2026 vers 00h55 — cause racine non déterminée, piste possible : cluster de déploiements en erreur autour d'un revert "Accept-Language fr header Storefront API" ~5h avant l'incident. **À VÉRIFIER**, voir RISKS.md.
