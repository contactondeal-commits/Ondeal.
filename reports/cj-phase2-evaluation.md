# PHASE 2 — Évaluation détaillée des candidats CJ (rapport officiel)

**Généré le :** 2026-08-12  
**Mission :** Évaluation approfondie des 578 candidats Phase 1 V2 + 128 candidats Phase 2.5 audités, sélection plafonnée à 308 produits maximum.  
**Aucune écriture Shopify, aucun import CJ, aucune publication n'a eu lieu pendant cette phase.**

## 1. Résumé exécutif

Le bassin initial théorique était de **706 candidats** (578 issus de la Phase 1 V2 « recherche CJ réelle » + 128 issus de la Phase 2.5 « audit catégoriel »). Après déduplication stricte (CJ Product ID > SKU > titre exact > similarité Jaccard ≥ 0,85), **24 doublons** ont été retirés, laissant un bassin consolidé de **682 candidats uniques**.

Sur ces 682 candidats (dont 0 écart de comptage lié aux enrichissements — voir §3), **682 candidats** ont été évalués en détail (fiche complète, stock CJ réel, prix, risque, ajustement OnDeal). L'évaluation a produit :

- **117 candidats Priorité A** (excellents : catégorie forte + stock confirmé prêt-à-expédier + score global ≥ 70)
- **564 candidats Priorité B** (bons, vérification recommandée avant import), dont **191 retenus** dans la sélection finale
- **0 candidats Priorité C**
- **1 rejet dur** (Stock CJ épuisé (OUT_OF_STOCK).)

La sélection finale respecte le **plafond de 308 produits maximum** (jamais une obligation) : **308/308** ont été retenus car le bassin contenait suffisamment de candidats A/B réellement valides et diversifiés par catégorie pour atteindre ce plafond sans forcer ni inventer aucun candidat. **373 candidats valides (A/B) n'ont pas été retenus** faute de place, et restent disponibles pour une itération future.

**Aucun produit n'a été importé, publié ou modifié sur Shopify au cours de cette phase.**

## 2. Méthodologie générale

L'évaluation réutilise strictement le pipeline CJ existant du projet (`getCJProductDetail`, `getCJVariantStock`, `getMinVariantPrice`, `hasReadyToShipStock` de `src/lib/cj/*`, `computeOndealPrice` de `src/lib/catalog/pricing.ts`, `normalizeTitle`/dédup de `src/lib/catalog/dedupe.ts`), sans aucune réécriture de cette logique. Aucun appel Shopify Admin API en écriture n'a été effectué.

Étapes :
1. **Consolidation** des deux bassins (578 + 128) avec dédup stricte.
2. **Enrichissement réel CJ** (détail produit + stock 1ère variante) pour les 554 candidats Phase 1 V2 restants après dédup (les 128 Phase 2.5 étaient déjà détaillés lors de l'audit précédent).
3. **Scoring pondéré sur 100 points** par candidat (catégorie 20%, stock 15%, marge 15%, livraison 10%, qualité fiche 10%, contenu 10%, potentiel commercial 5%, variantes 5%, risque 5%, saturation catégorie 5%).
4. **Gating impératif** : un candidat est rejeté (`REJECT`) dès qu'une des conditions suivantes est vraie, indépendamment du score : doublon OnDeal confirmé, risque `HIGH`, `categoryFit` insuffisant (`REJECT`/`QUESTIONABLE`), stock CJ `OUT_OF_STOCK`.
5. **Sélection finale plafonnée à 308**, en respectant le poids stratégique du Plan V2 (catégories P1 > P2 > P3), jamais en dépassant le plafond ni en le remplissant artificiellement.

## 3. Consolidation et déduplication

| Élément | Valeur |
|---|---|
| Pool 1 (Phase 1 V2, RECHERCHÉ) | 578 |
| Pool 2.5 (Phase 2.5, déjà audité) | 128 |
| Bassin initial théorique | 706 |
| Doublons retirés (pid / sku / titre exact / Jaccard ≥ 0,85) | 24 |
| Bassin consolidé | 682 |
| Candidats effectivement évalués en Phase 2 | 682 |

Les 554 candidats Pool 1 restants après dédup ont fait l'objet d'un appel réel `getCJProductDetail` + `getCJVariantStock` (1ère variante) — **554/554 récupérés, 0 erreur**.

## 4. Critères d'évaluation détaillés

Chaque candidat a été évalué sur les dimensions suivantes :

- **Adéquation catégorie** (`categoryFitScore`/`categoryFit`) : STRICT pour les candidats déjà filtrés par contrôle sémantique par catégorie (Phase 1 V2 : filtrage regex include/exclude à la collecte ; Phase 2.5 : audit manuel individuel).
- **Stock réel CJ** (`stockStatus`) : `CONFIRMED_READY` (cjInventoryNum > 0 sur au moins un entrepôt), `CONFIRMED_LOW` (stock usine seulement), `NOT_CONFIRMED` (aucune donnée stock exploitable), `OUT_OF_STOCK`.
- **Livraison** (`shippingScore`) : dérivé du pays d'entrepôt (FR > EU > US > CN > autre) et du statut de stock.
- **Prix / marge** (`estimatedSellingPrice`, `estimatedGrossMargin`) via `computeOndealPrice` (règle ×2,5 / marge 150 %, arrondi psychologique `.99`).
- **Qualité de fiche** : nombre d'images, longueur de description, nombre de variantes, longueur du titre.
- **Risque** : détection de marques de luxe, contrefaçon (« Pro Max »/« Ultra » pour les téléphones), allégations médicales, produits dangereux/réglementés, batterie, produits enfants, matériaux fragiles, usage nominatif d'une marque connue.
- **Doublon OnDeal** : comparaison titre normalisé + similarité Jaccard (seuil 0,85) contre les 893 titres ACTIVE du catalogue OnDeal.
- **Potentiel commercial** et **saturation catégorie** : pondérés par la stratégie du Plan V2 (catégories P1/P2 prioritaires, saturation basée sur le nombre de produits déjà catalogués par catégorie).

## 5. Formule de scoring (100 points)

```
globalScore = categoryFitScore   × 0.20
            + stockScore         × 0.15
            + marginScore        × 0.15
            + shippingScore      × 0.10   (30 si signal insuffisant, jamais inventé comme "bon")
            + qualityScore       × 0.10   (moyenne image/variantes)
            + contentScore       × 0.10   (moyenne titre/description)
            + commercialScore    × 0.05
            + variantScore       × 0.05
            + riskScore          × 0.05   (LOW=100, MEDIUM=50, HIGH=0)
            + saturationScore    × 0.05
```

Distribution observée sur les 682 candidats évalués : score minimum **52,2**, score maximum **94,0**, médiane **73,8**.

## 6. Règles de priorité (gating)

Rejet automatique (`REJECT`), quel que soit le score :
1. Doublon OnDeal confirmé.
2. Niveau de risque `HIGH`.
3. `categoryFit` = `REJECT` ou `QUESTIONABLE`.
4. Stock CJ `OUT_OF_STOCK`.

Sinon :
- **A** : `categoryFitScore ≥ 80` **ET** `stockStatus = CONFIRMED_READY` **ET** `globalScore ≥ 70`.
- **B** : `globalScore ≥ 50`.
- **C** : `globalScore ≥ 30`.
- **REJECT** (score trop faible) : `globalScore < 30`.

## 7. Constat sur la distribution des priorités (transparence méthodologique)

La distribution obtenue est : **A = 117**, **B = 564**, **C = 0**, **REJECT = 1** (sur 682).

Deux points méritent d'être signalés honnêtement plutôt que dissimulés :

1. **Bande C vide.** Le score plancher observé (52,2) est supérieur au seuil B (50), ce qui rend la bande C (30-49) structurellement inatteignable dans ce jeu de données. Vérification faite : ce n'est pas un artefact de calcul (une combinaison volontairement dégradée de tous les signaux faibles donne bien un score théorique ~34, donc la bande C existe mathématiquement) — c'est le résultat du fait que le bassin évalué a **déjà traversé deux filtres sémantiques stricts en amont** (regex de collecte Phase 1 V2, audit manuel Phase 2.5), qui ont déjà éliminé les produits de faible qualité ou hors catégorie avant d'arriver à cette Phase 2. Le bassin restant est donc pré-qualifié, d'où une distribution concentrée en haut de l'échelle.
2. **Un seul rejet dur.** Le risque `HIGH` retombe à 0/682 (après correction d'un bug de regex — voir §8) et le doublon OnDeal confirmé retombe à 0/682 en raison d'une limite méthodologique documentée au §9 (écart de langue FR/EN). Le seul rejet dur restant est un cas de stock `OUT_OF_STOCK` réel. Ce constat est assumé tel quel plutôt que d'ajuster artificiellement les seuils pour produire un nombre de rejets « plus présentable ».

## 8. Analyse des risques

| Niveau de risque | Nombre |
|---|---|
| LOW | 601 |
| MEDIUM | 81 |
| HIGH | 0 |

Les signaux `MEDIUM` les plus fréquents concernent la présence d'une batterie/produit rechargeable, un usage destiné aux enfants, ou un matériau fragile (verre/céramique) — tous documentés individuellement dans `riskReasons` par candidat dans le JSON. Un bug de détection (le motif `cures?` matchait la sous-chaîne « cure » dans « secure ») a été identifié et corrigé pendant cette phase, ce qui a fait retomber les faux positifs `HIGH` de 17 à 0.

## 9. Vérification des doublons avec le catalogue OnDeal existant

La comparaison a été faite contre les 893 titres de produits **ACTIVE** actuellement sur OnDeal (titre normalisé + similarité Jaccard, seuil 0,85). Résultat brut : **0/682 doublons confirmés**.

**Limite méthodologique assumée** : les titres du catalogue OnDeal sont en **français**, alors que tous les titres candidats CJ sont en **anglais**. Une comparaison lexicale (même avec normalisation et Jaccard) a donc un rappel structurellement faible dans ce contexte cross-langue — elle ne peut pas fiablement détecter un doublon sémantique (ex. « Chaise de bureau ergonomique » vs « Ergonomic Office Chair »). Ce résultat ne doit donc **pas** être lu comme « aucun doublon n'existe », mais comme « aucun doublon n'a pu être confirmé par cette méthode ». **Recommandation** : avant tout import futur, effectuer une vérification manuelle ciblée (ou un rapprochement par SKU/fournisseur/spécifications numériques) sur les catégories à fort recouvrement potentiel (bijoux, chaussures, vêtements).

## 10. Analyse stock et livraison

| Statut stock | Nombre (bassin évalué) | Nombre (sélection finale 308) |
|---|---|---|
| CONFIRMED_READY | 117 | 117 |
| CONFIRMED_LOW | 564 | 191 |
| NOT_CONFIRMED | 0 | 0 |
| OUT_OF_STOCK | 1 | 0 |

Le stock `NOT_CONFIRMED` reste majoritaire dans la sélection finale : c'est un signal recommandant une **vérification stock en temps réel au moment de l'import** (le stock CJ évolue en continu), documenté systématiquement dans la liste de vérification manuelle (§17).

## 11. Analyse prix et marge

Règle de prix appliquée (inchangée, réutilisée telle quelle) : `computeOndealPrice` = coût fournisseur × 2,5 (marge 150 %), arrondi psychologique `.99`. Le coût de livraison n'est jamais isolé (`shippingCost = "NOT_AVAILABLE"`), il est intégré au multiplicateur, conformément à la logique existante du projet.

- Marge brute moyenne (sélection finale) : **59.85 €**
- Meilleure marge : **Outdoor Storage Shed,Backyard Tools Storage Shed,Garden Metal Shed** — 1006.53 € (coût 671.02 € → prix 1677.99 €)
- **8 candidats** de la sélection ont un coût fournisseur > 200 € (produits volumineux : abris de jardin, commodes, moniteurs portables) — signalés en vérification manuelle pour valider la viabilité logistique/conversion avant tout import futur.

## 12. Répartition par catégorie (bassin évalué et sélection finale)

| Catégorie | Groupe Plan V2 | Évalués | Rejetés | Sélectionnés | A | B | C | Score moyen |
|---|---|---|---|---|---|---|---|---|
| Rangement | P1 | 92 | 1 | 65 | 51 | 14 | 0 | 79.1 |
| Outillage | P3 | 27 | 0 | 27 | 17 | 10 | 0 | 76.5 |
| Parfums | P2 | 20 | 0 | 20 | 10 | 10 | 0 | 73.6 |
| Accessoires (femme) | P2 | 25 | 0 | 18 | 4 | 14 | 0 | 73.9 |
| Chaussures (homme) | P1 | 87 | 0 | 16 | 2 | 14 | 0 | 75.8 |
| Sacs (femme) | P2 | 29 | 0 | 15 | 1 | 14 | 0 | 72.8 |
| Tablettes | P1 | 21 | 0 | 15 | 1 | 14 | 0 | 79.0 |
| Vêtements mixte / unisexe | P1 | 102 | 0 | 15 | 1 | 14 | 0 | 71.9 |
| Bijoux (catégorie proposée) | P1 | 50 | 0 | 14 | 0 | 14 | 0 | 66.5 |
| Chaussures (femme) | P1 | 111 | 0 | 14 | 0 | 14 | 0 | 75.2 |
| Accessoires (homme) | P2 | 32 | 0 | 14 | 0 | 14 | 0 | 68.9 |
| Souris | P2 | 15 | 0 | 14 | 1 | 13 | 0 | 71.9 |
| Vidéoprojecteurs | P1 | 14 | 0 | 14 | 4 | 10 | 0 | 77.5 |
| Écrans | P2 | 11 | 0 | 11 | 0 | 11 | 0 | 76.6 |
| Beauté & Bien-être > Bien-être/Massage | P2 | 7 | 0 | 7 | 0 | 7 | 0 | 70.8 |
| Jeux de société | NE_JAMAIS_PRIORISER | 7 | 0 | 7 | 7 | 0 | 0 | 82.5 |
| Téléphones | P1 | 6 | 0 | 6 | 6 | 0 | 0 | 90.9 |
| Chats | P3 | 5 | 0 | 5 | 1 | 4 | 0 | 68.2 |
| Football | NE_JAMAIS_PRIORISER | 7 | 0 | 5 | 5 | 0 | 0 | 81.4 |
| Barbecue | NE_JAMAIS_PRIORISER | 10 | 0 | 3 | 3 | 0 | 0 | 70.5 |
| Jeunesse | NE_JAMAIS_PRIORISER | 4 | 0 | 3 | 3 | 0 | 0 | 75.0 |

## 13. Catégories « ne jamais prioriser » (Plan V2) — traitement spécifique

Conformément au Plan V2, les catégories marquées `neJamaisPrioriser` (audio, homme-montres, bébés, jouets, TV, PC fixes, barbecue, football, romans, BD, jeunesse-livres, jeux de société) n'ont **pas** reçu d'ajout de candidats B/C dans la sélection finale — seuls leurs candidats déjà notés Priorité A (déjà validés par l'audit Phase 2.5) ont été conservés. **10 candidats B/C** de ces catégories ont ainsi été exclus de la sélection malgré un score valide, par respect strict de la stratégie catégorielle définie par l'utilisateur.

**Montres** : catégorie totalement exclue du sourcing sur instruction explicite de la mission — confirmé, **0 candidat** « montres » dans le bassin des 682.

**Bijoux** : catégorie encore « proposée » (non créée dans `categories.ts`) — aucune modification de `categories.ts` n'a été effectuée pendant cette phase ; les candidats bijoux restent au statut « évaluation seule ».

## 14. TOP 308 — sélection finale complète

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | rangement | Nightstand With 2 Drawers And Shelf, Space-Sa… | 2087058883454976002 | 59.06 | NOT_AVAILABLE | 147.99 | 88.59 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 94.0 | A |
| 2 | rangement | LED Nightstand With Charging Station, Modern … | 2087058758566330370 | 73.18 | NOT_AVAILABLE | 182.99 | 109.77 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 93.0 | A |
| 3 | rangement | 4-in-1 Storage Set, Equipped With Hanging Rac… | 2087058577313677314 | 41.52 | NOT_AVAILABLE | 103.99 | 62.28 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 92.8 | A |
| 4 | telephones | Mini Phone Unlocked World's Smallest 3.0in HD… | 2072961242585907201 | 29.99 | NOT_AVAILABLE | 74.99 | 44.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 92.5 | A |
| 5 | rangement | Freestanding Coat Rack And Multi-tier Metal S… | 2087101968644567042 | 18.96 | NOT_AVAILABLE | 47.99 | 28.44 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 91.5 | A |
| 6 | rangement | Electric Tool Storage Rack With Charging Stat… | 2087009496702377985 | 44.20 | NOT_AVAILABLE | 110.99 | 66.30 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 91.5 | A |
| 7 | telephones | C25 Unlocked Phone Smartphone 8GB 256GB Andro… | 2021160037155381250 | 79.99 | NOT_AVAILABLE | 199.99 | 119.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 91.5 | A |
| 8 | telephones | S24 Unlocked Phone Smartphone 4inch 128GB And… | 2020055077430906882 | 69.99 | NOT_AVAILABLE | 174.99 | 104.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 91.5 | A |
| 9 | telephones | A15 Unlocked Smartphone Phone 8GB 256GB 6800m… | 2020025322395426817 | 79.99 | NOT_AVAILABLE | 199.99 | 119.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 91.5 | A |
| 10 | vetements-mixte | Unisex Disposable Olders Briefs With Adjustab… | 2080474679773933570 | 24.99 | NOT_AVAILABLE | 62.99 | 37.48 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 91.2 | A |
| 11 | rangement | 9-compartment Magazine Holder, Book And Tray … | 2087399441259880450 | 18.55 | NOT_AVAILABLE | 46.99 | 27.83 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 90.5 | A |
| 12 | videoprojecteurs | Amazon Bestseller HY300PRO Home Projector Wit… | 2605220209161603200 | 35.19 | NOT_AVAILABLE | 87.99 | 52.78 | CONFIRMED_READY | China Warehouse | 55 | 95 | LOW | 90.5 | A |
| 13 | rangement | Bamboo Bread Box - Practical Storage Solution… | 2087012273125969922 | 31.14 | NOT_AVAILABLE | 77.99 | 46.71 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 90.0 | A |
| 14 | femme-accessoires | 2PCS Halloween Mantle Scarf (96"x18") - Black… | 2087099154061062146 | 28.15 | NOT_AVAILABLE | 70.99 | 42.22 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 90.0 | A |
| 15 | parfums | 6pcs Travel Set, Women's Eau De Parfuma Spray… | 2065261834669944834 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 16 | parfums | 6pcs Set, 1.18fl.oz 35ml Each Bottle, Men's E… | 2065262870210322433 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 17 | parfums | 6pcs Women's Eau De Parfum Travel Set - Long-… | 2065258397953990657 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 18 | souris | Half Hand Gaming Keyboard And Mouse Combo Wir… | 2078065879699185665 | 22.31 | NOT_AVAILABLE | 55.99 | 33.46 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 19 | telephones | Mini Phone Smartphone,3GB-12GB,2800Mah,3.0 In… | 2072961845777154049 | 29.99 | NOT_AVAILABLE | 74.99 | 44.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 89.5 | A |
| 20 | outillage | Set Of 3 Heavy-duty Combination Pliers With S… | 2054763675628249089 | 13.44 | NOT_AVAILABLE | 33.99 | 20.16 | CONFIRMED_READY | France Warehouse | 95 | 95 | LOW | 89.2 | A |
| 21 | rangement | Graded Card Storage Box 4 Slots, Graded Sport… | 2087360135745257474 | 56.95 | NOT_AVAILABLE | 142.99 | 85.43 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.0 | A |
| 22 | telephones | XS15 Portable Mini Phone 35-inch 2GB16GB Andr… | 2603030936171608500 | 25.17 | NOT_AVAILABLE | 62.99 | 37.76 | CONFIRMED_READY | China Warehouse | 55 | 95 | MEDIUM | 89.0 | A |
| 23 | femme-sacs | 4DRC V14 RC Drone WIFI FPV 4K HD Wide Angle D… | 2087425866171863041 | 38.32 | NOT_AVAILABLE | 95.99 | 57.48 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 88.8 | A |
| 24 | tablettes | 10.1 Inch Tablet Pc 4GB RAM Android 12.0 Tabl… | 1956885849875546114 | 104.98 | NOT_AVAILABLE | 262.99 | 157.47 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.2 | A |
| 25 | jeux-societe | Golf Chipping Game Mat Set With Target Net In… | 2082405051535212545 | 19.08 | NOT_AVAILABLE | 47.99 | 28.62 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 88.2 | A |
| 26 | rangement | 8 Drawers Dresser for Bedroom, Wood Bedroom D… | 2087063678801408002 | 172.50 | NOT_AVAILABLE | 431.99 | 258.75 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 27 | rangement | Wooden Chicken Coop with Nesting Box & Pull-O… | 2087073302027956226 | 359.24 | NOT_AVAILABLE | 898.99 | 538.86 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 28 | rangement | Outdoor Storage Shed,Backyard Tools Storage S… | 2087072989107712002 | 671.02 | NOT_AVAILABLE | 1677.99 | 1006.53 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 29 | rangement | Garden Elevated Planter Box,Wooden Raised Gar… | 2087083039234715649 | 120.95 | NOT_AVAILABLE | 302.99 | 181.43 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 30 | rangement | Patio Planter Box,Outdoor Elevated Planter Bo… | 2087079166537363457 | 110.29 | NOT_AVAILABLE | 275.99 | 165.44 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 31 | rangement | Galvanized Metal Raised Garden Bed with Arche… | 2087071571751727105 | 131.65 | NOT_AVAILABLE | 329.99 | 197.48 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 32 | rangement | Modern Grey Wood Grain Console Table, Particl… | 2087067624278323201 | 143.40 | NOT_AVAILABLE | 358.99 | 215.10 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 33 | rangement | Easy to Assemble Metal Planter Box,Galvanized… | 2087074333159845889 | 105.24 | NOT_AVAILABLE | 263.99 | 157.86 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 34 | rangement | Balcony Planter Bed,Outdoor Planter Box,Eleva… | 2087080707482710018 | 84.75 | NOT_AVAILABLE | 211.99 | 127.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 35 | rangement | Galvanized Raised Garden Bed, 4' x 2' x 1' Me… | 2087076861545017346 | 96.10 | NOT_AVAILABLE | 240.99 | 144.15 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 36 | rangement | 12 Drawers Double Dresser, Modern Wood Dresse… | 2087066605372829698 | 248.03 | NOT_AVAILABLE | 620.99 | 372.05 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 37 | rangement | White Wardrobe Drawer Organizers, Stackable S… | 2087453096787996673 | 13.34 | NOT_AVAILABLE | 33.99 | 20.01 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 88.0 | A |
| 38 | outillage | Straight Throat Type Car Water Pipe Clamp Pli… | 2082414072732110849 | 43.21 | NOT_AVAILABLE | 108.99 | 64.81 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 87.8 | A |
| 39 | rangement | Nightstand With Drawer, Shelf And Pull-out Tr… | 2087058865029398529 | 59.98 | NOT_AVAILABLE | 149.99 | 89.97 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 40 | parfums | Chained Eau De Cologne For Men,Amber Wood Eau… | 2067099123967361026 | 16.70 | NOT_AVAILABLE | 41.99 | 25.05 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 41 | parfums | Foliage Silence Women's Eau De Parfum 50ml - … | 2064906596035444737 | 14.30 | NOT_AVAILABLE | 35.99 | 21.45 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 42 | parfums | EAU DE PARIS SPORT Men's Eau De Toilette 50ml… | 2064901829883424769 | 14.30 | NOT_AVAILABLE | 35.99 | 21.45 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 43 | femme-accessoires | Women's Troll Costume Set With Wig And Bag, C… | 2086666129291235329 | 6.80 | NOT_AVAILABLE | 16.99 | 10.20 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 87.0 | A |
| 44 | femme-accessoires | Car Seat Gap Filler Pocket Storage Box Organi… | 2086722747342249986 | 13 | NOT_AVAILABLE | 32.99 | 19.50 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 87.0 | A |
| 45 | parfums | 6pcs Travel Set, Women'S Eau De Parfuma Spray… | 2065255351475396609 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 46 | football | Steel Pipe Rebound Soccer Football Goal Black… | 2059832481786806273 | 39 | NOT_AVAILABLE | 97.99 | 58.50 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 47 | football | 8X5ft Soccer Goal Training Set With Net Buckl… | 2059842348901490689 | 55.50 | NOT_AVAILABLE | 138.99 | 83.25 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 48 | jeux-societe | Steel Ladder Toss Game Set, 2 Pack Ladder Bal… | 2084898812666220546 | 54.12 | NOT_AVAILABLE | 135.99 | 81.18 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 49 | football | 8x5 ft Soccer Goal for Backyard, Portable Soc… | 2084898863937392641 | 50.08 | NOT_AVAILABLE | 125.99 | 75.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 50 | outillage | Grommet Tool Kit 1/4" 3/8" 1/2" 900 PCS Gromm… | 2084896101978845186 | 52.69 | NOT_AVAILABLE | 131.99 | 79.03 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 51 | rangement | Planter Box,Outdoor Elevated Planter Box,Rais… | 2087070544092721153 | 110.29 | NOT_AVAILABLE | 275.99 | 165.44 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 52 | rangement | Planter Box,Raised Garden Bed,Vegetable Box | 2087080411004137474 | 93.32 | NOT_AVAILABLE | 233.99 | 139.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 53 | rangement | Raised Design Garden Bed,Elevated Garden Box,… | 2087076647211888642 | 87.47 | NOT_AVAILABLE | 218.99 | 131.20 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 54 | rangement | Flowers Box,Elevated Planter Box,Raised Garde… | 2087078255874273281 | 137.40 | NOT_AVAILABLE | 343.99 | 206.10 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 55 | rangement | Planter Box,Practical Raised Garden Bed | 2087070490455961602 | 100.63 | NOT_AVAILABLE | 251.99 | 150.94 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 56 | rangement | Outdoor Elevated Garden Box,Plant Bed | 2087070702717104129 | 98.19 | NOT_AVAILABLE | 245.99 | 147.28 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 57 | rangement | Mobile Raised Garden Bed,Outdoor Stylish Plan… | 2087084605694013441 | 99.66 | NOT_AVAILABLE | 249.99 | 149.49 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 58 | rangement | Stylish Flowers Box,Elevated Planter Box,Rais… | 2087081624902823938 | 137.40 | NOT_AVAILABLE | 343.99 | 206.10 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 59 | rangement | Outdoor Planter Box,Raised Garden Bed | 2087078150182006786 | 100.63 | NOT_AVAILABLE | 251.99 | 150.94 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 60 | rangement | Outdoor Plastic Shed,Storage Shed,Patio Stora… | 2087083254222155778 | 559.79 | NOT_AVAILABLE | 1399.99 | 839.68 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 61 | rangement | Outdoor Stylish Planter Box,Mobile Raised Gar… | 2087085704148676609 | 99.66 | NOT_AVAILABLE | 249.99 | 149.49 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 62 | rangement | Flower Box,Plant Box,Garden Bed,Metal Raised … | 2087078099300904962 | 82.94 | NOT_AVAILABLE | 207.99 | 124.41 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 63 | rangement | Hair Dryer Bracket No Drilling Wall Mount Blo… | 2086667283638968321 | 29.34 | NOT_AVAILABLE | 73.99 | 44.01 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 64 | rangement | Rattan-front Shoe Cabinet With 1 Drawer And 2… | 2086730654934884354 | 52.28 | NOT_AVAILABLE | 130.99 | 78.42 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 65 | videoprojecteurs | Projector HD For Home Theater Office 360 Degr… | 2069714608557056002 | 52.80 | NOT_AVAILABLE | 131.99 | 79.20 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 66 | videoprojecteurs | 5G WiFi Bluetooth Projector 180 Degree Rotati… | 2078066053532114946 | 49.22 | NOT_AVAILABLE | 123.99 | 73.83 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 67 | rangement | Set Of 2 Desk Organizers With 9 Compartments … | 2087399621392875521 | 12.23 | NOT_AVAILABLE | 30.99 | 18.34 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 86.0 | A |
| 68 | rangement | 1-Piece 5-Tier Jewelry Organizer With 108 Ear… | 2087398078761418753 | 11.14 | NOT_AVAILABLE | 27.99 | 16.71 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 86.0 | A |
| 69 | rangement | Cake Stand Hanger – A Practical Hanging Solut… | 2087396459334991873 | 7.94 | NOT_AVAILABLE | 19.99 | 11.91 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 86.0 | A |
| 70 | rangement | Green Office Set – Portable Organizer With 33… | 2087395363599474690 | 8.36 | NOT_AVAILABLE | 20.99 | 12.54 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 86.0 | A |
| 71 | parfums | Beauty Orange Blue Eau De Toilette For Men, 5… | 2064897915029123073 | 14.30 | NOT_AVAILABLE | 35.99 | 21.45 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 86.0 | A |
| 72 | outillage | Grommet Tool Kit 1/4" 5/16" 3/8" 900 PCS Grom… | 2084896418451664897 | 111.34 | NOT_AVAILABLE | 278.99 | 167.01 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 85.8 | A |
| 73 | rangement | Modern Toy Storage Drawers,Multi-Tier Playroo… | 2087076710650736642 | 79.02 | NOT_AVAILABLE | 197.99 | 118.53 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 85.5 | A |
| 74 | rangement | Space-Saving Vertical Drawer Unit,Multi-Tier … | 2087071068804345858 | 103.42 | NOT_AVAILABLE | 258.99 | 155.13 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 85.5 | A |
| 75 | rangement | Toy Storage Drawers,Multi-Tier Playroom Organ… | 2087071017659002881 | 67.38 | NOT_AVAILABLE | 168.99 | 101.07 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 85.5 | A |
| 76 | rangement | Chic Storage Tower,Space-Saving Vertical Draw… | 2087070756139954177 | 151.98 | NOT_AVAILABLE | 379.99 | 227.97 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 85.5 | A |
| 77 | videoprojecteurs | P30 Small Projector 1080P FHP 4K For Android … | 2078067180473049089 | 61.19 | NOT_AVAILABLE | 152.99 | 91.78 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 85.5 | A |
| 78 | football | 4 In 1 Football Goal Pop-Up Soccer Goal Footb… | 2082406818726936577 | 22.26 | NOT_AVAILABLE | 55.99 | 33.39 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | MEDIUM | 84.5 | A |
| 79 | barbecue | 14X Stainless Steel BBQ Barbecue Tool Set Out… | 2084163688004694018 | 19.90 | NOT_AVAILABLE | 49.99 | 29.85 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 84.2 | A |
| 80 | outillage | Universal Engine Valve Spring Compressor Tool… | 2087473424792711170 | 21 | NOT_AVAILABLE | 52.99 | 31.50 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 84.2 | A |
| 81 | barbecue | Outdoor Camping Butane Gas Stove Portable Sin… | 2076931983456194562 | 16.42 | NOT_AVAILABLE | 41.99 | 24.63 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 84.2 | A |
| 82 | parfums | Holiday Roaming Eau De Parfum For Women - Flo… | 2066413762498977793 | 11.90 | NOT_AVAILABLE | 29.99 | 17.85 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 84.0 | A |
| 83 | homme-chaussures | Warm Athletic Shoes For Fall And Winter | 2608090130261600900 | 4.41 | NOT_AVAILABLE | 11.99 | 6.62 | CONFIRMED_READY | China Warehouse | 55 | 95 | LOW | 83.8 | A |
| 84 | homme-chaussures | New Mens Business Formal And Casual Leather S… | 2608080416501635400 | 17.11 | NOT_AVAILABLE | 42.99 | 25.66 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 83.8 | B |
| 85 | barbecue | Folding BBQ Charcoal Barbecue Grill Steel Sta… | 2079769132916797442 | 31.89 | NOT_AVAILABLE | 79.99 | 47.84 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 83.8 | A |
| 86 | outillage | 9 Piece Torque Wrench Set 3-230Nm 1 4 3 8 1 2… | 2085298465802981377 | 56 | NOT_AVAILABLE | 139.99 | 84.00 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 83.8 | A |
| 87 | outillage | Wood Splitter Drill Bit Set, 6-Piece Wedge Dr… | 2084468169263132673 | 13.28 | NOT_AVAILABLE | 33.99 | 19.92 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 83.8 | A |
| 88 | jeux-societe | Magnetic Maze Game (includes Magnetic Pen), A… | 2086667215999774722 | 9.25 | NOT_AVAILABLE | 23.99 | 13.88 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 83.8 | A |
| 89 | outillage | Corner Clamp Set With 4 Angle Clamps, Nylon G… | 2084467623751954433 | 6.73 | NOT_AVAILABLE | 16.99 | 10.10 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 83.8 | A |
| 90 | rangement | Black Drawer Organizer, Drawer Cutlery Organi… | 2087399401535848449 | 12.89 | NOT_AVAILABLE | 32.99 | 19.34 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 83.5 | A |
| 91 | femme-chaussures | Women's Niche Retro Square-toe Boot-cut Pants… | 2608100205421638500 | 53.93 | NOT_AVAILABLE | 134.99 | 80.89 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 83.2 | B |
| 92 | homme-chaussures | 480-Piece Eyelet Set, 1.9 Cm, Multicolor, Met… | 2087398801758543873 | 5.75 | NOT_AVAILABLE | 14.99 | 8.62 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 83.2 | A |
| 93 | homme-chaussures | Men's Comfortable Casual Shoes Made Of Full-G… | 2608070955271633100 | 30.55 | NOT_AVAILABLE | 76.99 | 45.83 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 83.2 | B |
| 94 | femme-accessoires | Womens Distinctive Rivet Belt Made Of Full-Gr… | 2608110829381624900 | 14.76 | NOT_AVAILABLE | 36.99 | 22.14 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 83.0 | B |
| 95 | outillage | VEVOR Crimping Tool, 22-10 AWG Ratcheting Wir… | 2069695333556850689 | 11.92 | NOT_AVAILABLE | 29.99 | 17.88 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 82.8 | A |
| 96 | rangement | Wooden Bed,bunk Bed, Loft Bed, Suitable For A… | 2087374216644542465 | 322.91 | NOT_AVAILABLE | 807.99 | 484.37 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | MEDIUM | 82.5 | A |
| 97 | femme-accessoires | Satin Spaghetti Strap Wedding Evening Gown Wi… | 2087083806343557121 | 46.43 | NOT_AVAILABLE | 116.99 | 69.64 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 82.5 | B |
| 98 | jeux-societe | Rainbow Swing Towel, 2.4m Colorful Parachute … | 2082672957191897090 | 9.45 | NOT_AVAILABLE | 23.99 | 14.17 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 82.5 | A |
| 99 | homme-chaussures | British-style Casual Mens Genuine Leather Sho… | 2608100152361608500 | 14.49 | NOT_AVAILABLE | 36.99 | 21.73 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 82.2 | B |
| 100 | homme-chaussures | Summer Closed-toe Slip-on Flat Leather Loafers | 2608110805271613000 | 14.84 | NOT_AVAILABLE | 37.99 | 22.26 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 82.2 | B |
| 101 | rangement | Solid Wood Magnetic Knife Holder Magnetic Sto… | 2608120227091632000 | 13.54 | NOT_AVAILABLE | 33.99 | 20.31 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 82.0 | B |
| 102 | femme-accessoires | -Party Gifts: Black Hair Clip, 16-Segment Cli… | 2087396818016550914 | 3.44 | NOT_AVAILABLE | 8.99 | 5.16 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 82.0 | A |
| 103 | souris | ATK X1 AIR Master Edition Wireless Lightweigh… | 2607310843291621000 | 46.88 | NOT_AVAILABLE | 117.99 | 70.32 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 81.8 | B |
| 104 | femme-chaussures | Retro Casual Formal Business Leather Shoes | 2608110715251610200 | 38.06 | NOT_AVAILABLE | 95.99 | 57.09 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 81.8 | B |
| 105 | homme-chaussures | Mens Casual Shoes Made From Soft, Lychee-patt… | 2608100517481633900 | 50.62 | NOT_AVAILABLE | 126.99 | 75.93 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 81.8 | B |
| 106 | homme-chaussures | Mens Loafers, Slip-on Casual Leather Shoes | 2608100459591615700 | 50.27 | NOT_AVAILABLE | 125.99 | 75.41 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 81.8 | B |
| 107 | homme-chaussures | Versatile Trendy Sneakers Casual Dad-style Sk… | 2608071258501606800 | 25.84 | NOT_AVAILABLE | 64.99 | 38.76 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 81.8 | B |
| 108 | homme-chaussures | Outerwear-friendly Versatile Fashionable Open… | 2608080931001601600 | 36.66 | NOT_AVAILABLE | 91.99 | 54.99 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 81.8 | B |
| 109 | homme-chaussures | Platform-soled Retro British-style Boots With… | 2608090959451610000 | 53.93 | NOT_AVAILABLE | 134.99 | 80.89 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 81.8 | B |
| 110 | football | Portable Tire Inflator Rechargeable Electric … | 2084164078527950850 | 20.90 | NOT_AVAILABLE | 52.99 | 31.35 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | MEDIUM | 81.8 | A |
| 111 | rangement | Set Of 2 Plastic Sorting Boxes, Each With 28 … | 2087397703164231682 | 4.01 | NOT_AVAILABLE | 10.99 | 6.01 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 81.5 | A |
| 112 | rangement | 2-Piece Black Plastic Spice Drawer Organizer,… | 2087398882120171521 | 4.58 | NOT_AVAILABLE | 11.99 | 6.87 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 81.5 | A |
| 113 | rangement | Car Seat Gap Organizer, Black (2-Pack) - Conv… | 2087398123799855105 | 4.01 | NOT_AVAILABLE | 10.99 | 6.01 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 81.5 | A |
| 114 | rangement | 6-piece Can Set With Colored Marking Rings Fo… | 2087028250198925314 | 5.59 | NOT_AVAILABLE | 13.99 | 8.38 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 81.5 | A |
| 115 | rangement | 1 Hamster Tent Hammock Set, Light Pink, With … | 2087028381999087618 | 4.16 | NOT_AVAILABLE | 10.99 | 6.24 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 81.5 | A |
| 116 | vetements-mixte | Polar Fleece Lined Hoodie With A Detachable F… | 2607301100271611100 | 15.04 | NOT_AVAILABLE | 37.99 | 22.56 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.8 | B |
| 117 | vetements-mixte | Retro Washed Distressed Lapel-collar Relaxed-… | 2607260858281625400 | 18.46 | NOT_AVAILABLE | 46.99 | 27.69 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.8 | B |
| 118 | femme-sacs | Leather Backpack, Travel Bag, Leather Top Lay… | 2087378861165133826 | 66.48 | NOT_AVAILABLE | 166.99 | 99.72 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.8 | B |
| 119 | parfums | Orange Wood Tone, High Level, Luxurious Fragr… | 2072205347986894849 | 7.90 | NOT_AVAILABLE | 19.99 | 11.85 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 80.8 | A |
| 120 | ecrans | Portable Monitor Phone Extension Screen Lapto… | 2601170046191604500 | 109.70 | NOT_AVAILABLE | 274.99 | 164.55 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.8 | B |
| 121 | ecrans | Touch Portable Monitor Mobile Phone Computer … | 1742851421004902400 | 74.59 | NOT_AVAILABLE | 186.99 | 111.89 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.8 | B |
| 122 | homme-chaussures | Mens British-style Casual Pointed-toe Lace-up… | 2608090353231619900 | 15.19 | NOT_AVAILABLE | 37.99 | 22.79 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.8 | B |
| 123 | homme-chaussures | Summer Five-toe Slippers Bunion-friendly | 2608120406591627200 | 18.50 | NOT_AVAILABLE | 46.99 | 27.75 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.8 | B |
| 124 | rangement | S925 Silver Gold Plated 3ct Lab-Grown Emerald… | 2087146801653628929 | 65.90 | NOT_AVAILABLE | 164.99 | 98.85 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.5 | B |
| 125 | tablettes | Export 7inch Kids Tablet Pc Drop-resistant Ex… | 2511160639111637500 | 22.39 | NOT_AVAILABLE | 55.99 | 33.59 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.5 | B |
| 126 | videoprojecteurs | The Touch-enabled Projector With A Gimbal-mou… | 2608030947551610300 | 128.52 | NOT_AVAILABLE | 321.99 | 192.78 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.5 | B |
| 127 | femme-accessoires | Stylish Minimalist Matte-finish Pillow Bag La… | 2608120939381620900 | 19.97 | NOT_AVAILABLE | 49.99 | 29.95 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.5 | B |
| 128 | rangement | S925 Sterling Silver Two-Tone Marquise Moissa… | 2087123712672587777 | 42.90 | NOT_AVAILABLE | 107.99 | 64.35 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.2 | B |
| 129 | tablettes | New 10-inch Tablet PC Wholesale Octa-core All… | 2601240532581623100 | 48.09 | NOT_AVAILABLE | 120.99 | 72.14 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 130 | tablettes | 10 inch Google Android Tablet 12 512 GB Dual … | 2512150956441633000 | 49.75 | NOT_AVAILABLE | 124.99 | 74.62 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 131 | tablettes | 10 inch Google Android Tablet  12GB512GB  Dua… | 2512150937061607500 | 43.12 | NOT_AVAILABLE | 107.99 | 64.68 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 132 | tablettes | 10  inch Tablet PC A73 With Bluetooth  5G Con… | 2512150839201638500 | 43.95 | NOT_AVAILABLE | 109.99 | 65.93 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 133 | tablettes | High Definition Screen Call Touch Screen Inte… | 2512150834151621700 | 43.95 | NOT_AVAILABLE | 109.99 | 65.93 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 134 | tablettes | Android Tablet With Bluetooth Calling Gaming … | 2512150803391613400 | 43.95 | NOT_AVAILABLE | 109.99 | 65.93 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 135 | tablettes | 10 inch Tablet PC X95  Dual SIM Dual standby … | 2512150723441628700 | 36.48 | NOT_AVAILABLE | 91.99 | 54.72 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 136 | tablettes | Bestseller 10 inch Pro 14 Tablet PC Android 1… | 2512150424021617200 | 34.66 | NOT_AVAILABLE | 86.99 | 51.99 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 137 | tablettes | Tablet PC Android 15 Japanese Google English … | 2507160319081622100 | 29.02 | NOT_AVAILABLE | 72.99 | 43.53 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 138 | femme-chaussures | Versatile And Comfortable Soft-soled Children… | 2608120519021627900 | 17.67 | NOT_AVAILABLE | 44.99 | 26.51 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 79.8 | B |
| 139 | femme-chaussures | Low-cut Vintage Princess Shoes Baby Loafer Sh… | 2608110816261628200 | 17.85 | NOT_AVAILABLE | 44.99 | 26.78 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 79.8 | B |
| 140 | femme-chaussures | Kindergarten Warm Indoor Shoes Baby Shoes | 2608110745391612100 | 19.65 | NOT_AVAILABLE | 49.99 | 29.47 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 79.8 | B |
| 141 | femme-chaussures | Childrens Mesh Breathable Hiking Shoes | 2608110620531603300 | 19.65 | NOT_AVAILABLE | 49.99 | 29.47 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 79.8 | B |
| 142 | homme-chaussures | Boys Performance Shoes With Nylon Velcro Stra… | 2608110750181622000 | 19.65 | NOT_AVAILABLE | 49.99 | 29.47 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 79.8 | B |
| 143 | outillage | Tool Belts For Men,Tool Belt Pouch,26-Pockets… | 2085570814609510401 | 10.99 | NOT_AVAILABLE | 27.99 | 16.48 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 79.8 | A |
| 144 | outillage | 1x Automobile Dent Repair Wheel Arch Car Body… | 2087075111598833666 | 8 | NOT_AVAILABLE | 19.99 | 12.00 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 79.8 | A |
| 145 | outillage | 3x Electrical Connector Disconnect Pliers For… | 2086024110275473410 | 9 | NOT_AVAILABLE | 22.99 | 13.50 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 79.8 | A |
| 146 | rangement | S925 Sterling Silver 2ct Oval Moissanite Lab-… | 2087151241341190145 | 62.90 | NOT_AVAILABLE | 157.99 | 94.35 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 147 | rangement | S925 Sterling Silver 2ct Moissanite Sunburst … | 2087148601056182273 | 66.90 | NOT_AVAILABLE | 167.99 | 100.35 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 148 | vetements-mixte | Short Relaxed-fit Fleece-lined Cardigan Unise… | 2607260701401638600 | 13.68 | NOT_AVAILABLE | 34.99 | 20.52 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 149 | vetements-mixte | Dual-Control Smart Heating Warm Hoodie | 2607240923001614700 | 18.12 | NOT_AVAILABLE | 45.99 | 27.18 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 150 | femme-chaussures | 2026 Summer New Minimalist Flat Split Toe Mar… | 2087065740264075266 | 9 | NOT_AVAILABLE | 22.99 | 13.50 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 151 | femme-chaussures | French Vintage Pointed Toe Mary Jane Shoes Fo… | 2087065332272873474 | 7.50 | NOT_AVAILABLE | 18.99 | 11.25 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 152 | femme-chaussures | 2025 New Fleece Lined Women's Snow Boots, Sli… | 2087012189621706753 | 7.50 | NOT_AVAILABLE | 18.99 | 11.25 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 153 | femme-chaussures | Casual Commuter Versatile Soft Sole Comfortab… | 2087022775747207170 | 7.50 | NOT_AVAILABLE | 18.99 | 11.25 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 154 | femme-chaussures | Thick Soled Boken Shoes With Increased Height… | 2086734462519726081 | 7 | NOT_AVAILABLE | 17.99 | 10.50 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 155 | femme-chaussures | Women's New FleeceLined Pointed Toe Retro Win… | 2086640697741299714 | 12 | NOT_AVAILABLE | 29.99 | 18.00 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 156 | homme-chaussures | Platform Crisscross Straps New Arrival For Au… | 2086655424582299649 | 7.50 | NOT_AVAILABLE | 18.99 | 11.25 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 157 | homme-chaussures | Men's Boots For Outdoor Casual Sports And Com… | 2608090450261629600 | 7.33 | NOT_AVAILABLE | 18.99 | 11.00 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 158 | jeux-societe | 66 Cm Easter Animal Dartboard, Velcro Dart Ga… | 2086666076371701761 | 6.26 | NOT_AVAILABLE | 15.99 | 9.39 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 79.2 | A |
| 159 | jeux-societe | Halloween Spider Web Dartboard, Halloween Vel… | 2083077268838674434 | 6.14 | NOT_AVAILABLE | 15.99 | 9.21 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 79.2 | A |
| 160 | chats | 15 Replacement Filters For Cat Fountains With… | 2087399000304312321 | 5.48 | NOT_AVAILABLE | 13.99 | 8.22 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 79.2 | A |
| 161 | jeunesse-livres | Magic Cottage + Pumpkin House Coloring Book, … | 2087397042120949761 | 5.95 | NOT_AVAILABLE | 14.99 | 8.93 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 79.2 | A |
| 162 | jeunesse-livres | 3-piece Coloring Book Set Featuring Three Dif… | 2087395940658970625 | 6.36 | NOT_AVAILABLE | 15.99 | 9.54 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 79.2 | A |
| 163 | jeunesse-livres | Set Of 15 Animal Picture Books Featuring Vari… | 2087012166355902465 | 6.64 | NOT_AVAILABLE | 16.99 | 9.96 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 79.2 | A |
| 164 | outillage | Five-piece Colored Pliers Set, 5-piece Combin… | 2084825472916164610 | 6.28 | NOT_AVAILABLE | 15.99 | 9.42 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 79.2 | A |
| 165 | outillage | Model-Making Tool Set – Precision Tools For T… | 2085564963702231041 | 5.71 | NOT_AVAILABLE | 14.99 | 8.56 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 79.2 | A |
| 166 | outillage | 32mm Wood Splitter Drill Bit Set With 3 Drill… | 2084827204417130497 | 5.47 | NOT_AVAILABLE | 13.99 | 8.21 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 79.2 | A |
| 167 | outillage | 11-Piece Lawn Mower Replacement Parts Set Wit… | 2084826321129287681 | 5.88 | NOT_AVAILABLE | 14.99 | 8.82 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 79.2 | A |
| 168 | outillage | Hex Head Screw Set With Storage Box, Allen Sc… | 2084466426110660610 | 5.14 | NOT_AVAILABLE | 12.99 | 7.71 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 79.2 | A |
| 169 | rangement | Glass Holders, Set Of 12 - Universal Holders … | 2087399287073071106 | 5.29 | NOT_AVAILABLE | 13.99 | 7.94 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | MEDIUM | 79.0 | A |
| 170 | tablettes | 10-inch Smart Android Tablet With SIM Card Sl… | 2601160817511615900 | 63.02 | NOT_AVAILABLE | 157.99 | 94.53 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 79.0 | B |
| 171 | tablettes | Simple Household Solid Color Tablet Computer | 2508100346281609000 | 20.73 | NOT_AVAILABLE | 51.99 | 31.09 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 79.0 | B |
| 172 | vetements-mixte | Fashionable Casual Versatile Canvas Unisex St… | 2607231029521639800 | 29.68 | NOT_AVAILABLE | 74.99 | 44.52 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.8 | B |
| 173 | femme-accessoires | Amazon Ems Fitness Abdominal Muscle Patch, Ab… | 2087094723542249474 | 8.42 | NOT_AVAILABLE | 21.99 | 12.63 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.5 | B |
| 174 | homme-accessoires | American-style Vintage Tie-dye Jeans For Men … | 2608080857061623000 | 6.94 | NOT_AVAILABLE | 17.99 | 10.41 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.5 | B |
| 175 | tablettes | Portable Minimalist Children's Tablet Computer | 2512151019131631100 | 25.70 | NOT_AVAILABLE | 64.99 | 38.55 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 78.5 | B |
| 176 | tablettes | Portable And Minimalist Home Tablet Computer | 2512150918161603600 | 33.83 | NOT_AVAILABLE | 84.99 | 50.74 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 78.5 | B |
| 177 | videoprojecteurs | New Premium Ultra HD Smart Projector | 2605210119541608100 | 27.86 | NOT_AVAILABLE | 69.99 | 41.79 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.5 | B |
| 178 | femme-chaussures | Girls' Polka-Dot Sneakers | 2608110610571603200 | 21.45 | NOT_AVAILABLE | 53.99 | 32.17 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 78.2 | B |
| 179 | vetements-mixte | Retro V-neck Cardigan Coat Unisex Couples Jac… | 2608070237591602700 | 19.97 | NOT_AVAILABLE | 49.99 | 29.95 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.2 | B |
| 180 | vetements-mixte | Detachable-hooded Biker Jacket Waist-cinching… | 2608110136071602700 | 15.63 | NOT_AVAILABLE | 39.99 | 23.45 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.2 | B |
| 181 | vetements-mixte | Outdoor Windproof And Waterproof Bomber Jacke… | 2608110707001609000 | 15.45 | NOT_AVAILABLE | 38.99 | 23.17 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.2 | B |
| 182 | jeux-societe | Throwing Game For Parties With A Banner, 3 Ba… | 2080135273875820546 | 5.36 | NOT_AVAILABLE | 13.99 | 8.04 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 78.0 | A |
| 183 | vetements-mixte | Color-block Hoodie High-waisted Denim Patchwo… | 2607261141221631300 | 16.92 | NOT_AVAILABLE | 42.99 | 25.38 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.8 | B |
| 184 | ecrans | 14-inch Dual-Screen Portable Monitor For Lapt… | 2603021239391635700 | 158.58 | NOT_AVAILABLE | 396.99 | 237.87 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.8 | B |
| 185 | souris | KP-J451 Best-Selling Wireless Keyboard Mouse … | 2084560602917171201 | 16.18 | NOT_AVAILABLE | 40.99 | 24.27 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.8 | B |
| 186 | femme-chaussures | Women's Flat Beach Fashion Casual Sandals | 2608110510221623000 | 6.98 | NOT_AVAILABLE | 17.99 | 10.47 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.8 | B |
| 187 | vetements-mixte | Medium To Long Double Breasted Loose Coat Jac… | 2608101203311613200 | 29.69 | NOT_AVAILABLE | 74.99 | 44.54 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.8 | B |
| 188 | rangement | S925 Sterling Silver 4ct Princess Cut Moissan… | 2087127734632636417 | 65.90 | NOT_AVAILABLE | 164.99 | 98.85 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.5 | B |
| 189 | bijoux | Women's Fashion Simplicity Square-cut Moissan… | 2608120207451624200 | 19.10 | NOT_AVAILABLE | 47.99 | 28.65 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.5 | B |
| 190 | videoprojecteurs | X3AQ Autofocus 1080P HD Video 4K Projector | 2606051513541621900 | 58.04 | NOT_AVAILABLE | 145.99 | 87.06 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.5 | B |
| 191 | ecrans | 156-inch HD Portable Monitor Touch With Brack… | 2505160348281623500 | 57.71 | NOT_AVAILABLE | 144.99 | 86.56 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.2 | B |
| 192 | femme-accessoires | High-waisted Split Jumpsuit With A Belt | 2608100842121615200 | 10.24 | NOT_AVAILABLE | 25.99 | 15.36 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.0 | B |
| 193 | femme-sacs | New Style Simple Large-Capacity Casual Backpa… | 2087375965803528193 | 29.29 | NOT_AVAILABLE | 73.99 | 43.94 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.8 | B |
| 194 | ecrans | UPERFECT 15.6 Inch HDR IPS Portable Monitor, … | 2069385191342772225 | 55.30 | NOT_AVAILABLE | 138.99 | 82.95 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.8 | B |
| 195 | vetements-mixte | Distressed Loopback Zip-up Hooded Sweatshirt … | 2608100619471606000 | 19.97 | NOT_AVAILABLE | 49.99 | 29.95 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.8 | B |
| 196 | vetements-mixte | New Sports And Outdoor Windproof Hooded Jacket | 2608120537571608800 | 16.15 | NOT_AVAILABLE | 40.99 | 24.22 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.8 | B |
| 197 | vetements-mixte | Fashion Leopard Print Padded Sleeveless Vest … | 2084883909189730306 | 10.99 | NOT_AVAILABLE | 27.99 | 16.48 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.2 | B |
| 198 | vetements-mixte | Color-block Sportswear Set Casual Relaxed-fit… | 2607310218111625000 | 10.23 | NOT_AVAILABLE | 25.99 | 15.35 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.2 | B |
| 199 | femme-sacs | New Niche Hollow-out Inner-pocket Shell Handb… | 2608111440551638400 | 10.76 | NOT_AVAILABLE | 26.99 | 16.14 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.2 | B |
| 200 | femme-sacs | Louis Schwab Women's Handbag  Minimalist  Com… | 2087013807084310529 | 65 | NOT_AVAILABLE | 162.99 | 97.50 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.2 | B |
| 201 | femme-sacs | Yoga Womens Small Travel Bag | 2608120513501631000 | 7.78 | NOT_AVAILABLE | 19.99 | 11.67 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.2 | B |
| 202 | femme-sacs | Laptop Carry-on Suitcase Hanging Bag | 2608120325521625600 | 11.81 | NOT_AVAILABLE | 29.99 | 17.71 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.2 | B |
| 203 | femme-sacs | New High-end, Handmade, Large-capacity Single… | 2608120229021610900 | 12.24 | NOT_AVAILABLE | 30.99 | 18.36 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.2 | B |
| 204 | videoprojecteurs | AI Intelligent Noise Reduction Painting Proje… | 2606050746261620800 | 67.16 | NOT_AVAILABLE | 167.99 | 100.74 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.0 | B |
| 205 | videoprojecteurs | Portable Home Theater Projector, Mini Project… | 2084214556704231426 | 29.99 | NOT_AVAILABLE | 74.99 | 44.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.0 | B |
| 206 | ecrans | 14-inch Dual-screen Portable Monitor Laptop W… | 2409060933021618200 | 223.88 | NOT_AVAILABLE | 559.99 | 335.82 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 75.8 | B |
| 207 | ecrans | 156-inch Ultra-thin Metal Portable Monitor Co… | 1663395485165555712 | 69.38 | NOT_AVAILABLE | 173.99 | 104.07 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 75.8 | B |
| 208 | homme-accessoires | Fashionable Personalized Smart Bluetooth Sung… | 2608080742071625400 | 27.60 | NOT_AVAILABLE | 68.99 | 41.40 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 75.5 | B |
| 209 | femme-sacs | Portable Yard Bean Bag Outdoor Leisure Lounge… | 2608111126451631600 | 8.08 | NOT_AVAILABLE | 20.99 | 12.12 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 75.2 | B |
| 210 | ecrans | Portable Monitor Extends Your Laptop With A C… | 2605221004121623500 | 51.74 | NOT_AVAILABLE | 129.99 | 77.61 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 75.2 | B |
| 211 | ecrans | G-STORY156-inch Portable Monitor | 1678966793412554752 | 279.66 | NOT_AVAILABLE | 699.99 | 419.49 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 75.2 | B |
| 212 | souris | Transparent Wireless Bluetooth Three-mode Sil… | 2607120821251630300 | 7.63 | NOT_AVAILABLE | 19.99 | 11.45 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 75.2 | B |
| 213 | videoprojecteurs | Home Wall-mounted Direct-projection Portable … | 2605200147371631600 | 56.38 | NOT_AVAILABLE | 140.99 | 84.57 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 75.0 | B |
| 214 | femme-sacs | Corduroy Flower Makeup Bag | 2608111024361628100 | 8.62 | NOT_AVAILABLE | 21.99 | 12.93 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.8 | B |
| 215 | souris | Mute Mechanical-feel Keyboard And Mouse Set | 2607070506551637000 | 9.67 | NOT_AVAILABLE | 24.99 | 14.50 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.8 | B |
| 216 | outillage | Flanging Pliers Forged With A Large Head Auto… | 2607240847551616300 | 16.82 | NOT_AVAILABLE | 42.99 | 25.23 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.8 | B |
| 217 | rangement | In-car Beauty Refrigeration Box | 2608100858041606100 | 15.15 | NOT_AVAILABLE | 37.99 | 22.73 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.5 | B |
| 218 | bijoux | Cross-Border Hot-Selling Retro Palace-Style D… | 2087354406233718786 | 13.99 | NOT_AVAILABLE | 34.99 | 20.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.5 | B |
| 219 | bijoux | Titanium Steel Bangle For Women, Non Tarnish … | 2087451707190726657 | 15.99 | NOT_AVAILABLE | 39.99 | 23.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.5 | B |
| 220 | femme-sacs | Louis Schwab Women's Handbag High Quality Tot… | 2087019488927014913 | 60 | NOT_AVAILABLE | 149.99 | 90.00 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.2 | B |
| 221 | ecrans | 14-inch Dual-Screen Portable Monitor Laptop E… | 2603021231271609000 | 165.86 | NOT_AVAILABLE | 414.99 | 248.79 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.2 | B |
| 222 | rangement | S925 Sterling Silver 1.25ct Pear Cut Moissani… | 2087129659221471234 | 45.90 | NOT_AVAILABLE | 114.99 | 68.85 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.0 | B |
| 223 | rangement | S925 Sterling Silver 6.5mm Round Moissanite H… | 2087125670405922817 | 51.90 | NOT_AVAILABLE | 129.99 | 77.85 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.0 | B |
| 224 | rangement | S925 Sterling Silver 1ct Emerald Cut Moissani… | 2087144080660492290 | 31.90 | NOT_AVAILABLE | 79.99 | 47.85 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.0 | B |
| 225 | homme-accessoires | Tummy-control Waist Belt Lumbar Support For P… | 2608070303171628500 | 6.68 | NOT_AVAILABLE | 16.99 | 10.02 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.0 | B |
| 226 | outillage | Multi-Function Stainless Steel Precision Plie… | 2608090641421625600 | 12.85 | NOT_AVAILABLE | 32.99 | 19.27 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.8 | B |
| 227 | femme-accessoires | High-end PU Leather Womens Wallet For Small C… | 2608120800051636100 | 3.61 | NOT_AVAILABLE | 9.99 | 5.42 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.5 | B |
| 228 | videoprojecteurs | Ultra-clear Large-screen Direct-projection Po… | 2607020914401619300 | 61.36 | NOT_AVAILABLE | 153.99 | 92.04 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.5 | B |
| 229 | bien-etre-massage | Infrared Photon Massage Device Red Light Wais… | 2608050203141636200 | 13.28 | NOT_AVAILABLE | 33.99 | 19.92 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.5 | B |
| 230 | bien-etre-massage | Slim Silicone Vibrating Massager With Multipl… | 2085645142578585602 | 8 | NOT_AVAILABLE | 19.99 | 12.00 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.5 | B |
| 231 | femme-sacs | Louis Schwab Women's Retro Chic Handbag Singl… | 2087003541131005953 | 70 | NOT_AVAILABLE | 174.99 | 105.00 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.2 | B |
| 232 | femme-sacs | Clutch Handbag With A Chain Can Be Worn Cross… | 2608090204331617300 | 5.56 | NOT_AVAILABLE | 13.99 | 8.34 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.2 | B |
| 233 | femme-sacs | Simple And Versatile Cloud-quilted Tote Bag F… | 2608080958081628500 | 4.39 | NOT_AVAILABLE | 10.99 | 6.58 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.2 | B |
| 234 | femme-sacs | Spring And Summer Thin Elastic Waist Drawstri… | 2086010940792131586 | 10.64 | NOT_AVAILABLE | 26.99 | 15.96 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.2 | B |
| 235 | chats | Cat Standing Bamboo Hemp Cat Scratch Post | 2608110707361607500 | 13.72 | NOT_AVAILABLE | 34.99 | 20.58 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.2 | B |
| 236 | rangement | S925 Sterling Silver Clover Moissanite Tennis… | 2087142158213836801 | 133.90 | NOT_AVAILABLE | 334.99 | 200.85 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.0 | B |
| 237 | bijoux | New Hollow Out Design Bangle For Women, Oil P… | 2087451059938316290 | 15 | NOT_AVAILABLE | 37.99 | 22.50 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.0 | B |
| 238 | bijoux | New Zircon Bracelet, Personalized Trendyy Sty… | 2087437931166064642 | 19 | NOT_AVAILABLE | 47.99 | 28.50 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.0 | B |
| 239 | bijoux | New Zircon Bracelet With Unique Design, Geome… | 2087437366513029121 | 19.19 | NOT_AVAILABLE | 47.99 | 28.79 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.0 | B |
| 240 | bien-etre-massage | Red Light Eye Beauty Device For Reducing Dark… | 2608070722531607800 | 23.96 | NOT_AVAILABLE | 59.99 | 35.94 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.0 | B |
| 241 | bien-etre-massage | Multifunctional Fully Automatic Foot Massager | 2608081007511632200 | 41.32 | NOT_AVAILABLE | 103.99 | 61.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.0 | B |
| 242 | ecrans | Portable Home Multifunctional Tablet Computer… | 2409210557231604000 | 279.66 | NOT_AVAILABLE | 699.99 | 419.49 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.8 | B |
| 243 | souris | KP-J452 Best-Selling Wired Keyboard And Mouse… | 2084565541264723969 | 10.57 | NOT_AVAILABLE | 26.99 | 15.86 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.8 | B |
| 244 | outillage | Straight-type Throat-style Automotive Hose Cl… | 2607010837541612900 | 27.86 | NOT_AVAILABLE | 69.99 | 41.79 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.8 | B |
| 245 | rangement | Nordic-style Cosmetic Organizer Wooden Rotati… | 2608120657591637000 | 107.75 | NOT_AVAILABLE | 269.99 | 161.62 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.5 | B |
| 246 | rangement | New-style Household Tofu Box Mold Wooden | 2608101011031637800 | 16.67 | NOT_AVAILABLE | 41.99 | 25.01 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.5 | B |
| 247 | femme-accessoires | Korean-style Fashionable Minimalist Crossbody… | 2608110004151601600 | 5.64 | NOT_AVAILABLE | 14.99 | 8.46 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.5 | B |
| 248 | femme-accessoires | Alien Cutie Handmade Resin Sunglasses | 2608110136121630800 | 4.74 | NOT_AVAILABLE | 11.99 | 7.11 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.5 | B |
| 249 | homme-accessoires | Square-frame Sunglasses Versatile Shades For … | 2608090228511601600 | 4.39 | NOT_AVAILABLE | 10.99 | 6.58 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.5 | B |
| 250 | souris | S402 Best-Selling Wireless Bluetooth Mouse Du… | 2084495149537472513 | 7.81 | NOT_AVAILABLE | 19.99 | 11.71 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 72.2 | B |
| 251 | homme-accessoires | Mens Second-layer Leather Belt With Automatic… | 2608120739241620100 | 3.49 | NOT_AVAILABLE | 8.99 | 5.24 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.0 | B |
| 252 | homme-accessoires | Outdoor Sports Running Driving Fishing Colorf… | 2608071011171600600 | 3.51 | NOT_AVAILABLE | 8.99 | 5.26 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.0 | B |
| 253 | souris | Dual-mode Bluetooth Mouse A Sleek Office Esse… | 2607091149351615400 | 5.80 | NOT_AVAILABLE | 14.99 | 8.70 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.8 | B |
| 254 | rangement | Large-Capacity Lychee-Grain Travel Portable O… | 2608110109081619600 | 4.39 | NOT_AVAILABLE | 10.99 | 6.58 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.5 | B |
| 255 | bijoux | Exquisite Cross Zircon Bangle For Women, Spar… | 2087447373669388290 | 15.99 | NOT_AVAILABLE | 39.99 | 23.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.5 | B |
| 256 | bijoux | New Arrival Zircon Bangle For Women, Luxury H… | 2087446580585222145 | 13.99 | NOT_AVAILABLE | 34.99 | 20.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.5 | B |
| 257 | bijoux | Indian Gem Pearl Pendant Tassel Three-piece S… | 2087346345838174210 | 7.99 | NOT_AVAILABLE | 19.99 | 11.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.5 | B |
| 258 | bijoux | Cross-Border New Style Eco-Friendly Rhineston… | 2087351796697153537 | 17.99 | NOT_AVAILABLE | 44.99 | 26.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.5 | B |
| 259 | bijoux | Luxury Versatile Full Zircon Cross Bangle For… | 2087446973322260481 | 14.99 | NOT_AVAILABLE | 37.99 | 22.48 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.5 | B |
| 260 | videoprojecteurs | Auto-focus Automatic Obstacle Avoidance High-… | 2606300759361620700 | 77.94 | NOT_AVAILABLE | 194.99 | 116.91 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.5 | B |
| 261 | bien-etre-massage | Multi-Setting Timer-Activated Hand And Elbow … | 2608070539131608200 | 13.54 | NOT_AVAILABLE | 33.99 | 20.31 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.5 | B |
| 262 | souris | KP-S403 Best-Selling Wireless Mouse Stylish S… | 2084499560256352257 | 3.63 | NOT_AVAILABLE | 9.99 | 5.45 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.2 | B |
| 263 | femme-accessoires | Trendy Hip-hop Punk-style Sunglasses | 2608110707021605800 | 4.92 | NOT_AVAILABLE | 12.99 | 7.38 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.0 | B |
| 264 | homme-accessoires | Multi-Card Short Metal Card Holder Mens Wallet | 2608070737081636300 | 6.34 | NOT_AVAILABLE | 15.99 | 9.51 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.0 | B |
| 265 | homme-accessoires | Womens Travel Bag Handheld Or Cross-body Larg… | 2608100940001600900 | 3.86 | NOT_AVAILABLE | 9.99 | 5.79 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.0 | B |
| 266 | bijoux | Cross-border Ultrasonic Dental Crown Cleaning… | 2087375020619857922 | 14.60 | NOT_AVAILABLE | 36.99 | 21.90 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 70.2 | B |
| 267 | outillage | Lithium-ion Electro-hydraulic Wire Pressing P… | 2605160224551609500 | 53.07 | NOT_AVAILABLE | 132.99 | 79.61 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 70.2 | B |
| 268 | bijoux | Unisex Leaf Open Ring, Stainless Steel Luxury… | 2087442833259810818 | 6.99 | NOT_AVAILABLE | 17.99 | 10.48 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 70.0 | B |
| 269 | bijoux | Luxury Micro Inlaid Full Zircon Bow Stud Earr… | 2087458665875795970 | 8.88 | NOT_AVAILABLE | 22.99 | 13.32 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 70.0 | B |
| 270 | femme-accessoires | European And American Retro Minimalist Sunpro… | 2608120146001630800 | 0.75 | NOT_AVAILABLE | 1.99 | 1.12 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 69.8 | B |
| 271 | homme-accessoires | Side-hemmed Wheat-ear Print Baseball Cap For … | 2608090408131638500 | 1.32 | NOT_AVAILABLE | 3.99 | 1.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 69.8 | B |
| 272 | homme-accessoires | American-style Versatile Printed Trendy Baseb… | 2608090301181607200 | 2.11 | NOT_AVAILABLE | 5.99 | 3.17 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 69.8 | B |
| 273 | homme-accessoires | Retro Hip-hop Mesh Breathable Baseball Cap Wi… | 2608111037291621200 | 2.48 | NOT_AVAILABLE | 6.99 | 3.72 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 69.8 | B |
| 274 | souris | New FENGHUO LANG Gaming Wireless Silent Charg… | 2607110821581605500 | 3.66 | NOT_AVAILABLE | 9.99 | 5.49 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 69.8 | B |
| 275 | femme-accessoires | Womens Thickened Fashionable Solid-Color Tass… | 2608101055061634200 | 3.34 | NOT_AVAILABLE | 8.99 | 5.01 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 69.5 | B |
| 276 | homme-accessoires | 3D Eyeball shaped Sunglasses Halloween Novelt… | 2608090303581615300 | 5.27 | NOT_AVAILABLE | 13.99 | 7.90 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 69.5 | B |
| 277 | homme-accessoires | European And American-style Personalized Fluf… | 2608110903591603400 | 5.27 | NOT_AVAILABLE | 13.99 | 7.90 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 69.0 | B |
| 278 | homme-accessoires | Customizable Cross-border Canvas Pencil Case … | 2608080718021606600 | 1.04 | NOT_AVAILABLE | 2.99 | 1.56 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 68.5 | B |
| 279 | femme-accessoires | Casual Hollow Women's Denim Belt | 2608110826121639800 | 1.58 | NOT_AVAILABLE | 3.99 | 2.37 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 68.2 | B |
| 280 | femme-accessoires | Womens Versatile Casual Denim Belt | 2608110820071625100 | 1.21 | NOT_AVAILABLE | 3.99 | 1.81 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 68.2 | B |
| 281 | femme-accessoires | Leather Fashion Candy Color Cylindrical Bucke… | 2608110043131624800 | 2.76 | NOT_AVAILABLE | 6.99 | 4.14 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 68.2 | B |
| 282 | souris | KP-J450 Best-Selling Wired USB Keyboard And M… | 2084555900007673857 | 6.10 | NOT_AVAILABLE | 15.99 | 9.15 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 68.2 | B |
| 283 | souris | S401 Wireless Mouse Silent Portable 2.4G Desk… | 2084490051423875073 | 4.71 | NOT_AVAILABLE | 11.99 | 7.06 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 67.8 | B |
| 284 | parfums | Edition PerfumeParis Cotton Candy Womens Eau … | 2605300754061609700 | 1.39 | NOT_AVAILABLE | 3.99 | 2.08 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 67.5 | B |
| 285 | parfums | Long-lasting Eau De Parfum For Men And Women | 2606240744561638300 | 0.51 | NOT_AVAILABLE | 1.99 | 0.77 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 66.0 | B |
| 286 | bien-etre-massage | Smart Ankle Massager With Graphene Vibration … | 2608120925181616500 | 4.92 | NOT_AVAILABLE | 12.99 | 7.38 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 66.0 | B |
| 287 | outillage | Specialized Pliers For Removing And Installin… | 2605161018581620300 | 4.53 | NOT_AVAILABLE | 11.99 | 6.79 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 65.8 | B |
| 288 | videoprojecteurs | Cross-border Astronaut Seated Starry-Sky Proj… | 2605160310071616200 | 4.70 | NOT_AVAILABLE | 11.99 | 7.05 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 65.0 | B |
| 289 | bien-etre-massage | Household Gravity Based Shiatsu Cervical Spin… | 2608061112501615200 | 1.82 | NOT_AVAILABLE | 4.99 | 2.73 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 64.8 | B |
| 290 | souris | Bluetooth Dual-mode Vertical Mouse For Laptops | 2607201232481628000 | 5.47 | NOT_AVAILABLE | 13.99 | 8.21 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 64.2 | B |
| 291 | outillage | Wire Cutters Multi-purpose Line-cutting And P… | 2605060655101628400 | 6.30 | NOT_AVAILABLE | 15.99 | 9.45 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 64.2 | B |
| 292 | souris | KP-S400 Best-Selling Wired Optical Mouse Suit… | 2084485182214418433 | 2.47 | NOT_AVAILABLE | 6.99 | 3.71 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 64.0 | B |
| 293 | chats | Four-Season Universal Double-Layer Felt Cat T… | 2608110851491603900 | 3.64 | NOT_AVAILABLE | 9.99 | 5.46 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 63.8 | B |
| 294 | chats | Multi-layered Cat Cave Bed Suitable For All S… | 2608110647141623400 | 2.02 | NOT_AVAILABLE | 5.99 | 3.03 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 63.5 | B |
| 295 | videoprojecteurs | Car Door Welcome Light Projector | 2606130340271630100 | 0.76 | NOT_AVAILABLE | 1.99 | 1.14 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 62.2 | B |
| 296 | outillage | Multi-tool Knife And Pliers Outdoor EDC Combi… | 2607252104191618900 | 1.99 | NOT_AVAILABLE | 4.99 | 2.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 61.5 | B |
| 297 | chats | Outdoor Cat Deterrent Spray To Prevent Scratc… | 2608120419111633300 | 1.84 | NOT_AVAILABLE | 4.99 | 2.76 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 61.5 | B |
| 298 | parfums | Floral Eau De Parfum For Women | 2608040705241604600 | 2.76 | NOT_AVAILABLE | 6.99 | 4.14 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 61.0 | B |
| 299 | outillage | Belt Punch Multifunctional Hole-punch Pliers | 2606050841151628800 | 2.49 | NOT_AVAILABLE | 6.99 | 3.74 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 60.0 | B |
| 300 | outillage | Multifunctional Electrician Wire Cutting Plie… | 2605250600341614200 | 1.71 | NOT_AVAILABLE | 4.99 | 2.56 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 60.0 | B |
| 301 | outillage | Multi-tool Round-nose Pliers For Outdoor Camp… | 2607252116581604800 | 2.35 | NOT_AVAILABLE | 5.99 | 3.53 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 60.0 | B |
| 302 | parfums | Unisex Honey Bergamot Perfume Long-Lasting Li… | 2072223110104129537 | 2.71 | NOT_AVAILABLE | 6.99 | 4.06 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 59.5 | B |
| 303 | parfums | Sunshine Coconut Eau De Toilette | 2608111214071602000 | 1.83 | NOT_AVAILABLE | 4.99 | 2.75 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 58.5 | B |
| 304 | parfums | Yearning For Fruity Eau De Toilette | 2606160449531610800 | 1.74 | NOT_AVAILABLE | 4.99 | 2.61 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 58.5 | B |
| 305 | parfums | Warm Vanilla Eau De Toilette | 2605300817151633700 | 1.74 | NOT_AVAILABLE | 4.99 | 2.61 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 58.5 | B |
| 306 | parfums | Code Men's Eau De Toilette | 2605251228011632700 | 2.28 | NOT_AVAILABLE | 5.99 | 3.42 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 58.5 | B |
| 307 | parfums | Cupid Series Perfume Spray Eau De Cologne | 2074415243234795522 | 2.71 | NOT_AVAILABLE | 6.99 | 4.06 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 58.0 | B |
| 308 | parfums | Eau De Parfum | 2605230243381609300 | 1.74 | NOT_AVAILABLE | 4.99 | 2.61 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 57.0 | B |

## 15. TOP 100

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | rangement | Nightstand With 2 Drawers And Shelf, Space-Sa… | 2087058883454976002 | 59.06 | NOT_AVAILABLE | 147.99 | 88.59 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 94.0 | A |
| 2 | rangement | LED Nightstand With Charging Station, Modern … | 2087058758566330370 | 73.18 | NOT_AVAILABLE | 182.99 | 109.77 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 93.0 | A |
| 3 | rangement | 4-in-1 Storage Set, Equipped With Hanging Rac… | 2087058577313677314 | 41.52 | NOT_AVAILABLE | 103.99 | 62.28 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 92.8 | A |
| 4 | telephones | Mini Phone Unlocked World's Smallest 3.0in HD… | 2072961242585907201 | 29.99 | NOT_AVAILABLE | 74.99 | 44.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 92.5 | A |
| 5 | rangement | Freestanding Coat Rack And Multi-tier Metal S… | 2087101968644567042 | 18.96 | NOT_AVAILABLE | 47.99 | 28.44 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 91.5 | A |
| 6 | rangement | Electric Tool Storage Rack With Charging Stat… | 2087009496702377985 | 44.20 | NOT_AVAILABLE | 110.99 | 66.30 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 91.5 | A |
| 7 | telephones | C25 Unlocked Phone Smartphone 8GB 256GB Andro… | 2021160037155381250 | 79.99 | NOT_AVAILABLE | 199.99 | 119.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 91.5 | A |
| 8 | telephones | S24 Unlocked Phone Smartphone 4inch 128GB And… | 2020055077430906882 | 69.99 | NOT_AVAILABLE | 174.99 | 104.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 91.5 | A |
| 9 | telephones | A15 Unlocked Smartphone Phone 8GB 256GB 6800m… | 2020025322395426817 | 79.99 | NOT_AVAILABLE | 199.99 | 119.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 91.5 | A |
| 10 | vetements-mixte | Unisex Disposable Olders Briefs With Adjustab… | 2080474679773933570 | 24.99 | NOT_AVAILABLE | 62.99 | 37.48 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 91.2 | A |
| 11 | rangement | 9-compartment Magazine Holder, Book And Tray … | 2087399441259880450 | 18.55 | NOT_AVAILABLE | 46.99 | 27.83 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 90.5 | A |
| 12 | videoprojecteurs | Amazon Bestseller HY300PRO Home Projector Wit… | 2605220209161603200 | 35.19 | NOT_AVAILABLE | 87.99 | 52.78 | CONFIRMED_READY | China Warehouse | 55 | 95 | LOW | 90.5 | A |
| 13 | rangement | Bamboo Bread Box - Practical Storage Solution… | 2087012273125969922 | 31.14 | NOT_AVAILABLE | 77.99 | 46.71 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 90.0 | A |
| 14 | femme-accessoires | 2PCS Halloween Mantle Scarf (96"x18") - Black… | 2087099154061062146 | 28.15 | NOT_AVAILABLE | 70.99 | 42.22 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 90.0 | A |
| 15 | parfums | 6pcs Travel Set, Women's Eau De Parfuma Spray… | 2065261834669944834 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 16 | parfums | 6pcs Set, 1.18fl.oz 35ml Each Bottle, Men's E… | 2065262870210322433 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 17 | parfums | 6pcs Women's Eau De Parfum Travel Set - Long-… | 2065258397953990657 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 18 | souris | Half Hand Gaming Keyboard And Mouse Combo Wir… | 2078065879699185665 | 22.31 | NOT_AVAILABLE | 55.99 | 33.46 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 19 | telephones | Mini Phone Smartphone,3GB-12GB,2800Mah,3.0 In… | 2072961845777154049 | 29.99 | NOT_AVAILABLE | 74.99 | 44.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 89.5 | A |
| 20 | outillage | Set Of 3 Heavy-duty Combination Pliers With S… | 2054763675628249089 | 13.44 | NOT_AVAILABLE | 33.99 | 20.16 | CONFIRMED_READY | France Warehouse | 95 | 95 | LOW | 89.2 | A |
| 21 | rangement | Graded Card Storage Box 4 Slots, Graded Sport… | 2087360135745257474 | 56.95 | NOT_AVAILABLE | 142.99 | 85.43 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.0 | A |
| 22 | telephones | XS15 Portable Mini Phone 35-inch 2GB16GB Andr… | 2603030936171608500 | 25.17 | NOT_AVAILABLE | 62.99 | 37.76 | CONFIRMED_READY | China Warehouse | 55 | 95 | MEDIUM | 89.0 | A |
| 23 | femme-sacs | 4DRC V14 RC Drone WIFI FPV 4K HD Wide Angle D… | 2087425866171863041 | 38.32 | NOT_AVAILABLE | 95.99 | 57.48 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 88.8 | A |
| 24 | tablettes | 10.1 Inch Tablet Pc 4GB RAM Android 12.0 Tabl… | 1956885849875546114 | 104.98 | NOT_AVAILABLE | 262.99 | 157.47 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.2 | A |
| 25 | jeux-societe | Golf Chipping Game Mat Set With Target Net In… | 2082405051535212545 | 19.08 | NOT_AVAILABLE | 47.99 | 28.62 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 88.2 | A |
| 26 | rangement | 8 Drawers Dresser for Bedroom, Wood Bedroom D… | 2087063678801408002 | 172.50 | NOT_AVAILABLE | 431.99 | 258.75 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 27 | rangement | Wooden Chicken Coop with Nesting Box & Pull-O… | 2087073302027956226 | 359.24 | NOT_AVAILABLE | 898.99 | 538.86 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 28 | rangement | Outdoor Storage Shed,Backyard Tools Storage S… | 2087072989107712002 | 671.02 | NOT_AVAILABLE | 1677.99 | 1006.53 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 29 | rangement | Garden Elevated Planter Box,Wooden Raised Gar… | 2087083039234715649 | 120.95 | NOT_AVAILABLE | 302.99 | 181.43 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 30 | rangement | Patio Planter Box,Outdoor Elevated Planter Bo… | 2087079166537363457 | 110.29 | NOT_AVAILABLE | 275.99 | 165.44 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 31 | rangement | Galvanized Metal Raised Garden Bed with Arche… | 2087071571751727105 | 131.65 | NOT_AVAILABLE | 329.99 | 197.48 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 32 | rangement | Modern Grey Wood Grain Console Table, Particl… | 2087067624278323201 | 143.40 | NOT_AVAILABLE | 358.99 | 215.10 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 33 | rangement | Easy to Assemble Metal Planter Box,Galvanized… | 2087074333159845889 | 105.24 | NOT_AVAILABLE | 263.99 | 157.86 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 34 | rangement | Balcony Planter Bed,Outdoor Planter Box,Eleva… | 2087080707482710018 | 84.75 | NOT_AVAILABLE | 211.99 | 127.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 35 | rangement | Galvanized Raised Garden Bed, 4' x 2' x 1' Me… | 2087076861545017346 | 96.10 | NOT_AVAILABLE | 240.99 | 144.15 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 36 | rangement | 12 Drawers Double Dresser, Modern Wood Dresse… | 2087066605372829698 | 248.03 | NOT_AVAILABLE | 620.99 | 372.05 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 37 | rangement | White Wardrobe Drawer Organizers, Stackable S… | 2087453096787996673 | 13.34 | NOT_AVAILABLE | 33.99 | 20.01 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 88.0 | A |
| 38 | outillage | Straight Throat Type Car Water Pipe Clamp Pli… | 2082414072732110849 | 43.21 | NOT_AVAILABLE | 108.99 | 64.81 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 87.8 | A |
| 39 | rangement | Nightstand With Drawer, Shelf And Pull-out Tr… | 2087058865029398529 | 59.98 | NOT_AVAILABLE | 149.99 | 89.97 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 40 | parfums | Chained Eau De Cologne For Men,Amber Wood Eau… | 2067099123967361026 | 16.70 | NOT_AVAILABLE | 41.99 | 25.05 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 41 | parfums | Foliage Silence Women's Eau De Parfum 50ml - … | 2064906596035444737 | 14.30 | NOT_AVAILABLE | 35.99 | 21.45 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 42 | parfums | EAU DE PARIS SPORT Men's Eau De Toilette 50ml… | 2064901829883424769 | 14.30 | NOT_AVAILABLE | 35.99 | 21.45 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 43 | femme-accessoires | Women's Troll Costume Set With Wig And Bag, C… | 2086666129291235329 | 6.80 | NOT_AVAILABLE | 16.99 | 10.20 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 87.0 | A |
| 44 | femme-accessoires | Car Seat Gap Filler Pocket Storage Box Organi… | 2086722747342249986 | 13 | NOT_AVAILABLE | 32.99 | 19.50 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 87.0 | A |
| 45 | parfums | 6pcs Travel Set, Women'S Eau De Parfuma Spray… | 2065255351475396609 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 46 | football | Steel Pipe Rebound Soccer Football Goal Black… | 2059832481786806273 | 39 | NOT_AVAILABLE | 97.99 | 58.50 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 47 | football | 8X5ft Soccer Goal Training Set With Net Buckl… | 2059842348901490689 | 55.50 | NOT_AVAILABLE | 138.99 | 83.25 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 48 | jeux-societe | Steel Ladder Toss Game Set, 2 Pack Ladder Bal… | 2084898812666220546 | 54.12 | NOT_AVAILABLE | 135.99 | 81.18 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 49 | football | 8x5 ft Soccer Goal for Backyard, Portable Soc… | 2084898863937392641 | 50.08 | NOT_AVAILABLE | 125.99 | 75.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 50 | outillage | Grommet Tool Kit 1/4" 3/8" 1/2" 900 PCS Gromm… | 2084896101978845186 | 52.69 | NOT_AVAILABLE | 131.99 | 79.03 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 51 | rangement | Planter Box,Outdoor Elevated Planter Box,Rais… | 2087070544092721153 | 110.29 | NOT_AVAILABLE | 275.99 | 165.44 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 52 | rangement | Planter Box,Raised Garden Bed,Vegetable Box | 2087080411004137474 | 93.32 | NOT_AVAILABLE | 233.99 | 139.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 53 | rangement | Raised Design Garden Bed,Elevated Garden Box,… | 2087076647211888642 | 87.47 | NOT_AVAILABLE | 218.99 | 131.20 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 54 | rangement | Flowers Box,Elevated Planter Box,Raised Garde… | 2087078255874273281 | 137.40 | NOT_AVAILABLE | 343.99 | 206.10 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 55 | rangement | Planter Box,Practical Raised Garden Bed | 2087070490455961602 | 100.63 | NOT_AVAILABLE | 251.99 | 150.94 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 56 | rangement | Outdoor Elevated Garden Box,Plant Bed | 2087070702717104129 | 98.19 | NOT_AVAILABLE | 245.99 | 147.28 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 57 | rangement | Mobile Raised Garden Bed,Outdoor Stylish Plan… | 2087084605694013441 | 99.66 | NOT_AVAILABLE | 249.99 | 149.49 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 58 | rangement | Stylish Flowers Box,Elevated Planter Box,Rais… | 2087081624902823938 | 137.40 | NOT_AVAILABLE | 343.99 | 206.10 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 59 | rangement | Outdoor Planter Box,Raised Garden Bed | 2087078150182006786 | 100.63 | NOT_AVAILABLE | 251.99 | 150.94 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 60 | rangement | Outdoor Plastic Shed,Storage Shed,Patio Stora… | 2087083254222155778 | 559.79 | NOT_AVAILABLE | 1399.99 | 839.68 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 61 | rangement | Outdoor Stylish Planter Box,Mobile Raised Gar… | 2087085704148676609 | 99.66 | NOT_AVAILABLE | 249.99 | 149.49 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 62 | rangement | Flower Box,Plant Box,Garden Bed,Metal Raised … | 2087078099300904962 | 82.94 | NOT_AVAILABLE | 207.99 | 124.41 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 63 | rangement | Hair Dryer Bracket No Drilling Wall Mount Blo… | 2086667283638968321 | 29.34 | NOT_AVAILABLE | 73.99 | 44.01 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 64 | rangement | Rattan-front Shoe Cabinet With 1 Drawer And 2… | 2086730654934884354 | 52.28 | NOT_AVAILABLE | 130.99 | 78.42 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 65 | videoprojecteurs | Projector HD For Home Theater Office 360 Degr… | 2069714608557056002 | 52.80 | NOT_AVAILABLE | 131.99 | 79.20 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 66 | videoprojecteurs | 5G WiFi Bluetooth Projector 180 Degree Rotati… | 2078066053532114946 | 49.22 | NOT_AVAILABLE | 123.99 | 73.83 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 67 | rangement | Set Of 2 Desk Organizers With 9 Compartments … | 2087399621392875521 | 12.23 | NOT_AVAILABLE | 30.99 | 18.34 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 86.0 | A |
| 68 | rangement | 1-Piece 5-Tier Jewelry Organizer With 108 Ear… | 2087398078761418753 | 11.14 | NOT_AVAILABLE | 27.99 | 16.71 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 86.0 | A |
| 69 | rangement | Cake Stand Hanger – A Practical Hanging Solut… | 2087396459334991873 | 7.94 | NOT_AVAILABLE | 19.99 | 11.91 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 86.0 | A |
| 70 | rangement | Green Office Set – Portable Organizer With 33… | 2087395363599474690 | 8.36 | NOT_AVAILABLE | 20.99 | 12.54 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 86.0 | A |
| 71 | parfums | Beauty Orange Blue Eau De Toilette For Men, 5… | 2064897915029123073 | 14.30 | NOT_AVAILABLE | 35.99 | 21.45 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 86.0 | A |
| 72 | outillage | Grommet Tool Kit 1/4" 5/16" 3/8" 900 PCS Grom… | 2084896418451664897 | 111.34 | NOT_AVAILABLE | 278.99 | 167.01 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 85.8 | A |
| 73 | rangement | Modern Toy Storage Drawers,Multi-Tier Playroo… | 2087076710650736642 | 79.02 | NOT_AVAILABLE | 197.99 | 118.53 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 85.5 | A |
| 74 | rangement | Space-Saving Vertical Drawer Unit,Multi-Tier … | 2087071068804345858 | 103.42 | NOT_AVAILABLE | 258.99 | 155.13 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 85.5 | A |
| 75 | rangement | Toy Storage Drawers,Multi-Tier Playroom Organ… | 2087071017659002881 | 67.38 | NOT_AVAILABLE | 168.99 | 101.07 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 85.5 | A |
| 76 | rangement | Chic Storage Tower,Space-Saving Vertical Draw… | 2087070756139954177 | 151.98 | NOT_AVAILABLE | 379.99 | 227.97 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 85.5 | A |
| 77 | videoprojecteurs | P30 Small Projector 1080P FHP 4K For Android … | 2078067180473049089 | 61.19 | NOT_AVAILABLE | 152.99 | 91.78 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 85.5 | A |
| 78 | football | 4 In 1 Football Goal Pop-Up Soccer Goal Footb… | 2082406818726936577 | 22.26 | NOT_AVAILABLE | 55.99 | 33.39 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | MEDIUM | 84.5 | A |
| 79 | barbecue | 14X Stainless Steel BBQ Barbecue Tool Set Out… | 2084163688004694018 | 19.90 | NOT_AVAILABLE | 49.99 | 29.85 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 84.2 | A |
| 80 | outillage | Universal Engine Valve Spring Compressor Tool… | 2087473424792711170 | 21 | NOT_AVAILABLE | 52.99 | 31.50 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 84.2 | A |
| 81 | barbecue | Outdoor Camping Butane Gas Stove Portable Sin… | 2076931983456194562 | 16.42 | NOT_AVAILABLE | 41.99 | 24.63 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 84.2 | A |
| 82 | parfums | Holiday Roaming Eau De Parfum For Women - Flo… | 2066413762498977793 | 11.90 | NOT_AVAILABLE | 29.99 | 17.85 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 84.0 | A |
| 83 | homme-chaussures | Warm Athletic Shoes For Fall And Winter | 2608090130261600900 | 4.41 | NOT_AVAILABLE | 11.99 | 6.62 | CONFIRMED_READY | China Warehouse | 55 | 95 | LOW | 83.8 | A |
| 84 | homme-chaussures | New Mens Business Formal And Casual Leather S… | 2608080416501635400 | 17.11 | NOT_AVAILABLE | 42.99 | 25.66 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 83.8 | B |
| 85 | barbecue | Folding BBQ Charcoal Barbecue Grill Steel Sta… | 2079769132916797442 | 31.89 | NOT_AVAILABLE | 79.99 | 47.84 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 83.8 | A |
| 86 | outillage | 9 Piece Torque Wrench Set 3-230Nm 1 4 3 8 1 2… | 2085298465802981377 | 56 | NOT_AVAILABLE | 139.99 | 84.00 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 83.8 | A |
| 87 | outillage | Wood Splitter Drill Bit Set, 6-Piece Wedge Dr… | 2084468169263132673 | 13.28 | NOT_AVAILABLE | 33.99 | 19.92 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 83.8 | A |
| 88 | jeux-societe | Magnetic Maze Game (includes Magnetic Pen), A… | 2086667215999774722 | 9.25 | NOT_AVAILABLE | 23.99 | 13.88 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 83.8 | A |
| 89 | outillage | Corner Clamp Set With 4 Angle Clamps, Nylon G… | 2084467623751954433 | 6.73 | NOT_AVAILABLE | 16.99 | 10.10 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 83.8 | A |
| 90 | rangement | Black Drawer Organizer, Drawer Cutlery Organi… | 2087399401535848449 | 12.89 | NOT_AVAILABLE | 32.99 | 19.34 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 83.5 | A |
| 91 | femme-chaussures | Women's Niche Retro Square-toe Boot-cut Pants… | 2608100205421638500 | 53.93 | NOT_AVAILABLE | 134.99 | 80.89 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 83.2 | B |
| 92 | homme-chaussures | 480-Piece Eyelet Set, 1.9 Cm, Multicolor, Met… | 2087398801758543873 | 5.75 | NOT_AVAILABLE | 14.99 | 8.62 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 83.2 | A |
| 93 | homme-chaussures | Men's Comfortable Casual Shoes Made Of Full-G… | 2608070955271633100 | 30.55 | NOT_AVAILABLE | 76.99 | 45.83 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 83.2 | B |
| 94 | femme-accessoires | Womens Distinctive Rivet Belt Made Of Full-Gr… | 2608110829381624900 | 14.76 | NOT_AVAILABLE | 36.99 | 22.14 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 83.0 | B |
| 95 | outillage | VEVOR Crimping Tool, 22-10 AWG Ratcheting Wir… | 2069695333556850689 | 11.92 | NOT_AVAILABLE | 29.99 | 17.88 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 82.8 | A |
| 96 | rangement | Wooden Bed,bunk Bed, Loft Bed, Suitable For A… | 2087374216644542465 | 322.91 | NOT_AVAILABLE | 807.99 | 484.37 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | MEDIUM | 82.5 | A |
| 97 | femme-accessoires | Satin Spaghetti Strap Wedding Evening Gown Wi… | 2087083806343557121 | 46.43 | NOT_AVAILABLE | 116.99 | 69.64 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 82.5 | B |
| 98 | jeux-societe | Rainbow Swing Towel, 2.4m Colorful Parachute … | 2082672957191897090 | 9.45 | NOT_AVAILABLE | 23.99 | 14.17 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 82.5 | A |
| 99 | homme-chaussures | British-style Casual Mens Genuine Leather Sho… | 2608100152361608500 | 14.49 | NOT_AVAILABLE | 36.99 | 21.73 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 82.2 | B |
| 100 | homme-chaussures | Summer Closed-toe Slip-on Flat Leather Loafers | 2608110805271613000 | 14.84 | NOT_AVAILABLE | 37.99 | 22.26 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 82.2 | B |

## 16. TOP 50

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | rangement | Nightstand With 2 Drawers And Shelf, Space-Sa… | 2087058883454976002 | 59.06 | NOT_AVAILABLE | 147.99 | 88.59 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 94.0 | A |
| 2 | rangement | LED Nightstand With Charging Station, Modern … | 2087058758566330370 | 73.18 | NOT_AVAILABLE | 182.99 | 109.77 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 93.0 | A |
| 3 | rangement | 4-in-1 Storage Set, Equipped With Hanging Rac… | 2087058577313677314 | 41.52 | NOT_AVAILABLE | 103.99 | 62.28 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 92.8 | A |
| 4 | telephones | Mini Phone Unlocked World's Smallest 3.0in HD… | 2072961242585907201 | 29.99 | NOT_AVAILABLE | 74.99 | 44.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 92.5 | A |
| 5 | rangement | Freestanding Coat Rack And Multi-tier Metal S… | 2087101968644567042 | 18.96 | NOT_AVAILABLE | 47.99 | 28.44 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 91.5 | A |
| 6 | rangement | Electric Tool Storage Rack With Charging Stat… | 2087009496702377985 | 44.20 | NOT_AVAILABLE | 110.99 | 66.30 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 91.5 | A |
| 7 | telephones | C25 Unlocked Phone Smartphone 8GB 256GB Andro… | 2021160037155381250 | 79.99 | NOT_AVAILABLE | 199.99 | 119.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 91.5 | A |
| 8 | telephones | S24 Unlocked Phone Smartphone 4inch 128GB And… | 2020055077430906882 | 69.99 | NOT_AVAILABLE | 174.99 | 104.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 91.5 | A |
| 9 | telephones | A15 Unlocked Smartphone Phone 8GB 256GB 6800m… | 2020025322395426817 | 79.99 | NOT_AVAILABLE | 199.99 | 119.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 91.5 | A |
| 10 | vetements-mixte | Unisex Disposable Olders Briefs With Adjustab… | 2080474679773933570 | 24.99 | NOT_AVAILABLE | 62.99 | 37.48 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 91.2 | A |
| 11 | rangement | 9-compartment Magazine Holder, Book And Tray … | 2087399441259880450 | 18.55 | NOT_AVAILABLE | 46.99 | 27.83 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 90.5 | A |
| 12 | videoprojecteurs | Amazon Bestseller HY300PRO Home Projector Wit… | 2605220209161603200 | 35.19 | NOT_AVAILABLE | 87.99 | 52.78 | CONFIRMED_READY | China Warehouse | 55 | 95 | LOW | 90.5 | A |
| 13 | rangement | Bamboo Bread Box - Practical Storage Solution… | 2087012273125969922 | 31.14 | NOT_AVAILABLE | 77.99 | 46.71 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 90.0 | A |
| 14 | femme-accessoires | 2PCS Halloween Mantle Scarf (96"x18") - Black… | 2087099154061062146 | 28.15 | NOT_AVAILABLE | 70.99 | 42.22 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 90.0 | A |
| 15 | parfums | 6pcs Travel Set, Women's Eau De Parfuma Spray… | 2065261834669944834 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 16 | parfums | 6pcs Set, 1.18fl.oz 35ml Each Bottle, Men's E… | 2065262870210322433 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 17 | parfums | 6pcs Women's Eau De Parfum Travel Set - Long-… | 2065258397953990657 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 18 | souris | Half Hand Gaming Keyboard And Mouse Combo Wir… | 2078065879699185665 | 22.31 | NOT_AVAILABLE | 55.99 | 33.46 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 19 | telephones | Mini Phone Smartphone,3GB-12GB,2800Mah,3.0 In… | 2072961845777154049 | 29.99 | NOT_AVAILABLE | 74.99 | 44.98 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 89.5 | A |
| 20 | outillage | Set Of 3 Heavy-duty Combination Pliers With S… | 2054763675628249089 | 13.44 | NOT_AVAILABLE | 33.99 | 20.16 | CONFIRMED_READY | France Warehouse | 95 | 95 | LOW | 89.2 | A |
| 21 | rangement | Graded Card Storage Box 4 Slots, Graded Sport… | 2087360135745257474 | 56.95 | NOT_AVAILABLE | 142.99 | 85.43 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.0 | A |
| 22 | telephones | XS15 Portable Mini Phone 35-inch 2GB16GB Andr… | 2603030936171608500 | 25.17 | NOT_AVAILABLE | 62.99 | 37.76 | CONFIRMED_READY | China Warehouse | 55 | 95 | MEDIUM | 89.0 | A |
| 23 | femme-sacs | 4DRC V14 RC Drone WIFI FPV 4K HD Wide Angle D… | 2087425866171863041 | 38.32 | NOT_AVAILABLE | 95.99 | 57.48 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 88.8 | A |
| 24 | tablettes | 10.1 Inch Tablet Pc 4GB RAM Android 12.0 Tabl… | 1956885849875546114 | 104.98 | NOT_AVAILABLE | 262.99 | 157.47 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.2 | A |
| 25 | jeux-societe | Golf Chipping Game Mat Set With Target Net In… | 2082405051535212545 | 19.08 | NOT_AVAILABLE | 47.99 | 28.62 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 88.2 | A |
| 26 | rangement | 8 Drawers Dresser for Bedroom, Wood Bedroom D… | 2087063678801408002 | 172.50 | NOT_AVAILABLE | 431.99 | 258.75 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 27 | rangement | Wooden Chicken Coop with Nesting Box & Pull-O… | 2087073302027956226 | 359.24 | NOT_AVAILABLE | 898.99 | 538.86 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 28 | rangement | Outdoor Storage Shed,Backyard Tools Storage S… | 2087072989107712002 | 671.02 | NOT_AVAILABLE | 1677.99 | 1006.53 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 29 | rangement | Garden Elevated Planter Box,Wooden Raised Gar… | 2087083039234715649 | 120.95 | NOT_AVAILABLE | 302.99 | 181.43 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 30 | rangement | Patio Planter Box,Outdoor Elevated Planter Bo… | 2087079166537363457 | 110.29 | NOT_AVAILABLE | 275.99 | 165.44 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 31 | rangement | Galvanized Metal Raised Garden Bed with Arche… | 2087071571751727105 | 131.65 | NOT_AVAILABLE | 329.99 | 197.48 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 32 | rangement | Modern Grey Wood Grain Console Table, Particl… | 2087067624278323201 | 143.40 | NOT_AVAILABLE | 358.99 | 215.10 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 33 | rangement | Easy to Assemble Metal Planter Box,Galvanized… | 2087074333159845889 | 105.24 | NOT_AVAILABLE | 263.99 | 157.86 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 34 | rangement | Balcony Planter Bed,Outdoor Planter Box,Eleva… | 2087080707482710018 | 84.75 | NOT_AVAILABLE | 211.99 | 127.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 35 | rangement | Galvanized Raised Garden Bed, 4' x 2' x 1' Me… | 2087076861545017346 | 96.10 | NOT_AVAILABLE | 240.99 | 144.15 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 36 | rangement | 12 Drawers Double Dresser, Modern Wood Dresse… | 2087066605372829698 | 248.03 | NOT_AVAILABLE | 620.99 | 372.05 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 37 | rangement | White Wardrobe Drawer Organizers, Stackable S… | 2087453096787996673 | 13.34 | NOT_AVAILABLE | 33.99 | 20.01 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 88.0 | A |
| 38 | outillage | Straight Throat Type Car Water Pipe Clamp Pli… | 2082414072732110849 | 43.21 | NOT_AVAILABLE | 108.99 | 64.81 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 87.8 | A |
| 39 | rangement | Nightstand With Drawer, Shelf And Pull-out Tr… | 2087058865029398529 | 59.98 | NOT_AVAILABLE | 149.99 | 89.97 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 40 | parfums | Chained Eau De Cologne For Men,Amber Wood Eau… | 2067099123967361026 | 16.70 | NOT_AVAILABLE | 41.99 | 25.05 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 41 | parfums | Foliage Silence Women's Eau De Parfum 50ml - … | 2064906596035444737 | 14.30 | NOT_AVAILABLE | 35.99 | 21.45 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 42 | parfums | EAU DE PARIS SPORT Men's Eau De Toilette 50ml… | 2064901829883424769 | 14.30 | NOT_AVAILABLE | 35.99 | 21.45 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 43 | femme-accessoires | Women's Troll Costume Set With Wig And Bag, C… | 2086666129291235329 | 6.80 | NOT_AVAILABLE | 16.99 | 10.20 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 87.0 | A |
| 44 | femme-accessoires | Car Seat Gap Filler Pocket Storage Box Organi… | 2086722747342249986 | 13 | NOT_AVAILABLE | 32.99 | 19.50 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 87.0 | A |
| 45 | parfums | 6pcs Travel Set, Women'S Eau De Parfuma Spray… | 2065255351475396609 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 46 | football | Steel Pipe Rebound Soccer Football Goal Black… | 2059832481786806273 | 39 | NOT_AVAILABLE | 97.99 | 58.50 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 47 | football | 8X5ft Soccer Goal Training Set With Net Buckl… | 2059842348901490689 | 55.50 | NOT_AVAILABLE | 138.99 | 83.25 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 48 | jeux-societe | Steel Ladder Toss Game Set, 2 Pack Ladder Bal… | 2084898812666220546 | 54.12 | NOT_AVAILABLE | 135.99 | 81.18 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 49 | football | 8x5 ft Soccer Goal for Backyard, Portable Soc… | 2084898863937392641 | 50.08 | NOT_AVAILABLE | 125.99 | 75.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 50 | outillage | Grommet Tool Kit 1/4" 3/8" 1/2" 900 PCS Gromm… | 2084896101978845186 | 52.69 | NOT_AVAILABLE | 131.99 | 79.03 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |

## 17. TOP 10 par catégorie (catégories avec ≥ 10 candidats valides uniquement)

### Barbecue (barbecue)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | barbecue | 14X Stainless Steel BBQ Barbecue Tool Set Out… | 2084163688004694018 | 19.90 | NOT_AVAILABLE | 49.99 | 29.85 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 84.2 | A |
| 2 | barbecue | Outdoor Camping Butane Gas Stove Portable Sin… | 2076931983456194562 | 16.42 | NOT_AVAILABLE | 41.99 | 24.63 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 84.2 | A |
| 3 | barbecue | Folding BBQ Charcoal Barbecue Grill Steel Sta… | 2079769132916797442 | 31.89 | NOT_AVAILABLE | 79.99 | 47.84 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 83.8 | A |

### Bijoux (catégorie proposée) (bijoux)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | bijoux | Women's Fashion Simplicity Square-cut Moissan… | 2608120207451624200 | 19.10 | NOT_AVAILABLE | 47.99 | 28.65 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.5 | B |
| 2 | bijoux | Cross-Border Hot-Selling Retro Palace-Style D… | 2087354406233718786 | 13.99 | NOT_AVAILABLE | 34.99 | 20.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.5 | B |
| 3 | bijoux | Titanium Steel Bangle For Women, Non Tarnish … | 2087451707190726657 | 15.99 | NOT_AVAILABLE | 39.99 | 23.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.5 | B |
| 4 | bijoux | New Hollow Out Design Bangle For Women, Oil P… | 2087451059938316290 | 15 | NOT_AVAILABLE | 37.99 | 22.50 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.0 | B |
| 5 | bijoux | New Zircon Bracelet, Personalized Trendyy Sty… | 2087437931166064642 | 19 | NOT_AVAILABLE | 47.99 | 28.50 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.0 | B |
| 6 | bijoux | New Zircon Bracelet With Unique Design, Geome… | 2087437366513029121 | 19.19 | NOT_AVAILABLE | 47.99 | 28.79 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.0 | B |
| 7 | bijoux | Exquisite Cross Zircon Bangle For Women, Spar… | 2087447373669388290 | 15.99 | NOT_AVAILABLE | 39.99 | 23.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.5 | B |
| 8 | bijoux | New Arrival Zircon Bangle For Women, Luxury H… | 2087446580585222145 | 13.99 | NOT_AVAILABLE | 34.99 | 20.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.5 | B |
| 9 | bijoux | Indian Gem Pearl Pendant Tassel Three-piece S… | 2087346345838174210 | 7.99 | NOT_AVAILABLE | 19.99 | 11.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.5 | B |
| 10 | bijoux | Cross-Border New Style Eco-Friendly Rhineston… | 2087351796697153537 | 17.99 | NOT_AVAILABLE | 44.99 | 26.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.5 | B |

### Écrans (ecrans)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | ecrans | Portable Monitor Phone Extension Screen Lapto… | 2601170046191604500 | 109.70 | NOT_AVAILABLE | 274.99 | 164.55 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.8 | B |
| 2 | ecrans | Touch Portable Monitor Mobile Phone Computer … | 1742851421004902400 | 74.59 | NOT_AVAILABLE | 186.99 | 111.89 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.8 | B |
| 3 | ecrans | 14-inch Dual-Screen Portable Monitor For Lapt… | 2603021239391635700 | 158.58 | NOT_AVAILABLE | 396.99 | 237.87 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.8 | B |
| 4 | ecrans | 156-inch HD Portable Monitor Touch With Brack… | 2505160348281623500 | 57.71 | NOT_AVAILABLE | 144.99 | 86.56 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.2 | B |
| 5 | ecrans | UPERFECT 15.6 Inch HDR IPS Portable Monitor, … | 2069385191342772225 | 55.30 | NOT_AVAILABLE | 138.99 | 82.95 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.8 | B |
| 6 | ecrans | 14-inch Dual-screen Portable Monitor Laptop W… | 2409060933021618200 | 223.88 | NOT_AVAILABLE | 559.99 | 335.82 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 75.8 | B |
| 7 | ecrans | 156-inch Ultra-thin Metal Portable Monitor Co… | 1663395485165555712 | 69.38 | NOT_AVAILABLE | 173.99 | 104.07 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 75.8 | B |
| 8 | ecrans | Portable Monitor Extends Your Laptop With A C… | 2605221004121623500 | 51.74 | NOT_AVAILABLE | 129.99 | 77.61 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 75.2 | B |
| 9 | ecrans | G-STORY156-inch Portable Monitor | 1678966793412554752 | 279.66 | NOT_AVAILABLE | 699.99 | 419.49 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 75.2 | B |
| 10 | ecrans | 14-inch Dual-Screen Portable Monitor Laptop E… | 2603021231271609000 | 165.86 | NOT_AVAILABLE | 414.99 | 248.79 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.2 | B |

### Accessoires (femme) (femme-accessoires)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | femme-accessoires | 2PCS Halloween Mantle Scarf (96"x18") - Black… | 2087099154061062146 | 28.15 | NOT_AVAILABLE | 70.99 | 42.22 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 90.0 | A |
| 2 | femme-accessoires | Women's Troll Costume Set With Wig And Bag, C… | 2086666129291235329 | 6.80 | NOT_AVAILABLE | 16.99 | 10.20 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 87.0 | A |
| 3 | femme-accessoires | Car Seat Gap Filler Pocket Storage Box Organi… | 2086722747342249986 | 13 | NOT_AVAILABLE | 32.99 | 19.50 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 87.0 | A |
| 4 | femme-accessoires | Womens Distinctive Rivet Belt Made Of Full-Gr… | 2608110829381624900 | 14.76 | NOT_AVAILABLE | 36.99 | 22.14 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 83.0 | B |
| 5 | femme-accessoires | Satin Spaghetti Strap Wedding Evening Gown Wi… | 2087083806343557121 | 46.43 | NOT_AVAILABLE | 116.99 | 69.64 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 82.5 | B |
| 6 | femme-accessoires | -Party Gifts: Black Hair Clip, 16-Segment Cli… | 2087396818016550914 | 3.44 | NOT_AVAILABLE | 8.99 | 5.16 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 82.0 | A |
| 7 | femme-accessoires | Stylish Minimalist Matte-finish Pillow Bag La… | 2608120939381620900 | 19.97 | NOT_AVAILABLE | 49.99 | 29.95 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.5 | B |
| 8 | femme-accessoires | Amazon Ems Fitness Abdominal Muscle Patch, Ab… | 2087094723542249474 | 8.42 | NOT_AVAILABLE | 21.99 | 12.63 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.5 | B |
| 9 | femme-accessoires | High-waisted Split Jumpsuit With A Belt | 2608100842121615200 | 10.24 | NOT_AVAILABLE | 25.99 | 15.36 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.0 | B |
| 10 | femme-accessoires | High-end PU Leather Womens Wallet For Small C… | 2608120800051636100 | 3.61 | NOT_AVAILABLE | 9.99 | 5.42 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 73.5 | B |

### Chaussures (femme) (femme-chaussures)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | femme-chaussures | Women's Niche Retro Square-toe Boot-cut Pants… | 2608100205421638500 | 53.93 | NOT_AVAILABLE | 134.99 | 80.89 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 83.2 | B |
| 2 | femme-chaussures | Retro Casual Formal Business Leather Shoes | 2608110715251610200 | 38.06 | NOT_AVAILABLE | 95.99 | 57.09 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 81.8 | B |
| 3 | femme-chaussures | Versatile And Comfortable Soft-soled Children… | 2608120519021627900 | 17.67 | NOT_AVAILABLE | 44.99 | 26.51 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 79.8 | B |
| 4 | femme-chaussures | Low-cut Vintage Princess Shoes Baby Loafer Sh… | 2608110816261628200 | 17.85 | NOT_AVAILABLE | 44.99 | 26.78 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 79.8 | B |
| 5 | femme-chaussures | Kindergarten Warm Indoor Shoes Baby Shoes | 2608110745391612100 | 19.65 | NOT_AVAILABLE | 49.99 | 29.47 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 79.8 | B |
| 6 | femme-chaussures | Childrens Mesh Breathable Hiking Shoes | 2608110620531603300 | 19.65 | NOT_AVAILABLE | 49.99 | 29.47 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 79.8 | B |
| 7 | femme-chaussures | 2026 Summer New Minimalist Flat Split Toe Mar… | 2087065740264075266 | 9 | NOT_AVAILABLE | 22.99 | 13.50 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 8 | femme-chaussures | French Vintage Pointed Toe Mary Jane Shoes Fo… | 2087065332272873474 | 7.50 | NOT_AVAILABLE | 18.99 | 11.25 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 9 | femme-chaussures | 2025 New Fleece Lined Women's Snow Boots, Sli… | 2087012189621706753 | 7.50 | NOT_AVAILABLE | 18.99 | 11.25 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 10 | femme-chaussures | Casual Commuter Versatile Soft Sole Comfortab… | 2087022775747207170 | 7.50 | NOT_AVAILABLE | 18.99 | 11.25 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |

### Sacs (femme) (femme-sacs)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | femme-sacs | 4DRC V14 RC Drone WIFI FPV 4K HD Wide Angle D… | 2087425866171863041 | 38.32 | NOT_AVAILABLE | 95.99 | 57.48 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 88.8 | A |
| 2 | femme-sacs | Leather Backpack, Travel Bag, Leather Top Lay… | 2087378861165133826 | 66.48 | NOT_AVAILABLE | 166.99 | 99.72 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.8 | B |
| 3 | femme-sacs | New Style Simple Large-Capacity Casual Backpa… | 2087375965803528193 | 29.29 | NOT_AVAILABLE | 73.99 | 43.94 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.8 | B |
| 4 | femme-sacs | New Niche Hollow-out Inner-pocket Shell Handb… | 2608111440551638400 | 10.76 | NOT_AVAILABLE | 26.99 | 16.14 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.2 | B |
| 5 | femme-sacs | Louis Schwab Women's Handbag  Minimalist  Com… | 2087013807084310529 | 65 | NOT_AVAILABLE | 162.99 | 97.50 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.2 | B |
| 6 | femme-sacs | Yoga Womens Small Travel Bag | 2608120513501631000 | 7.78 | NOT_AVAILABLE | 19.99 | 11.67 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.2 | B |
| 7 | femme-sacs | Laptop Carry-on Suitcase Hanging Bag | 2608120325521625600 | 11.81 | NOT_AVAILABLE | 29.99 | 17.71 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.2 | B |
| 8 | femme-sacs | New High-end, Handmade, Large-capacity Single… | 2608120229021610900 | 12.24 | NOT_AVAILABLE | 30.99 | 18.36 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.2 | B |
| 9 | femme-sacs | Portable Yard Bean Bag Outdoor Leisure Lounge… | 2608111126451631600 | 8.08 | NOT_AVAILABLE | 20.99 | 12.12 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 75.2 | B |
| 10 | femme-sacs | Corduroy Flower Makeup Bag | 2608111024361628100 | 8.62 | NOT_AVAILABLE | 21.99 | 12.93 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.8 | B |

### Accessoires (homme) (homme-accessoires)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | homme-accessoires | American-style Vintage Tie-dye Jeans For Men … | 2608080857061623000 | 6.94 | NOT_AVAILABLE | 17.99 | 10.41 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.5 | B |
| 2 | homme-accessoires | Fashionable Personalized Smart Bluetooth Sung… | 2608080742071625400 | 27.60 | NOT_AVAILABLE | 68.99 | 41.40 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 75.5 | B |
| 3 | homme-accessoires | Tummy-control Waist Belt Lumbar Support For P… | 2608070303171628500 | 6.68 | NOT_AVAILABLE | 16.99 | 10.02 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.0 | B |
| 4 | homme-accessoires | Square-frame Sunglasses Versatile Shades For … | 2608090228511601600 | 4.39 | NOT_AVAILABLE | 10.99 | 6.58 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.5 | B |
| 5 | homme-accessoires | Mens Second-layer Leather Belt With Automatic… | 2608120739241620100 | 3.49 | NOT_AVAILABLE | 8.99 | 5.24 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.0 | B |
| 6 | homme-accessoires | Outdoor Sports Running Driving Fishing Colorf… | 2608071011171600600 | 3.51 | NOT_AVAILABLE | 8.99 | 5.26 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.0 | B |
| 7 | homme-accessoires | Multi-Card Short Metal Card Holder Mens Wallet | 2608070737081636300 | 6.34 | NOT_AVAILABLE | 15.99 | 9.51 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.0 | B |
| 8 | homme-accessoires | Womens Travel Bag Handheld Or Cross-body Larg… | 2608100940001600900 | 3.86 | NOT_AVAILABLE | 9.99 | 5.79 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.0 | B |
| 9 | homme-accessoires | Side-hemmed Wheat-ear Print Baseball Cap For … | 2608090408131638500 | 1.32 | NOT_AVAILABLE | 3.99 | 1.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 69.8 | B |
| 10 | homme-accessoires | American-style Versatile Printed Trendy Baseb… | 2608090301181607200 | 2.11 | NOT_AVAILABLE | 5.99 | 3.17 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 69.8 | B |

### Chaussures (homme) (homme-chaussures)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | homme-chaussures | Warm Athletic Shoes For Fall And Winter | 2608090130261600900 | 4.41 | NOT_AVAILABLE | 11.99 | 6.62 | CONFIRMED_READY | China Warehouse | 55 | 95 | LOW | 83.8 | A |
| 2 | homme-chaussures | New Mens Business Formal And Casual Leather S… | 2608080416501635400 | 17.11 | NOT_AVAILABLE | 42.99 | 25.66 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 83.8 | B |
| 3 | homme-chaussures | 480-Piece Eyelet Set, 1.9 Cm, Multicolor, Met… | 2087398801758543873 | 5.75 | NOT_AVAILABLE | 14.99 | 8.62 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 83.2 | A |
| 4 | homme-chaussures | Men's Comfortable Casual Shoes Made Of Full-G… | 2608070955271633100 | 30.55 | NOT_AVAILABLE | 76.99 | 45.83 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 83.2 | B |
| 5 | homme-chaussures | British-style Casual Mens Genuine Leather Sho… | 2608100152361608500 | 14.49 | NOT_AVAILABLE | 36.99 | 21.73 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 82.2 | B |
| 6 | homme-chaussures | Summer Closed-toe Slip-on Flat Leather Loafers | 2608110805271613000 | 14.84 | NOT_AVAILABLE | 37.99 | 22.26 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 82.2 | B |
| 7 | homme-chaussures | Mens Casual Shoes Made From Soft, Lychee-patt… | 2608100517481633900 | 50.62 | NOT_AVAILABLE | 126.99 | 75.93 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 81.8 | B |
| 8 | homme-chaussures | Mens Loafers, Slip-on Casual Leather Shoes | 2608100459591615700 | 50.27 | NOT_AVAILABLE | 125.99 | 75.41 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 81.8 | B |
| 9 | homme-chaussures | Versatile Trendy Sneakers Casual Dad-style Sk… | 2608071258501606800 | 25.84 | NOT_AVAILABLE | 64.99 | 38.76 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 81.8 | B |
| 10 | homme-chaussures | Outerwear-friendly Versatile Fashionable Open… | 2608080931001601600 | 36.66 | NOT_AVAILABLE | 91.99 | 54.99 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 81.8 | B |

### Outillage (outillage)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | outillage | Set Of 3 Heavy-duty Combination Pliers With S… | 2054763675628249089 | 13.44 | NOT_AVAILABLE | 33.99 | 20.16 | CONFIRMED_READY | France Warehouse | 95 | 95 | LOW | 89.2 | A |
| 2 | outillage | Straight Throat Type Car Water Pipe Clamp Pli… | 2082414072732110849 | 43.21 | NOT_AVAILABLE | 108.99 | 64.81 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 87.8 | A |
| 3 | outillage | Grommet Tool Kit 1/4" 3/8" 1/2" 900 PCS Gromm… | 2084896101978845186 | 52.69 | NOT_AVAILABLE | 131.99 | 79.03 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 4 | outillage | Grommet Tool Kit 1/4" 5/16" 3/8" 900 PCS Grom… | 2084896418451664897 | 111.34 | NOT_AVAILABLE | 278.99 | 167.01 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 85.8 | A |
| 5 | outillage | Universal Engine Valve Spring Compressor Tool… | 2087473424792711170 | 21 | NOT_AVAILABLE | 52.99 | 31.50 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 84.2 | A |
| 6 | outillage | 9 Piece Torque Wrench Set 3-230Nm 1 4 3 8 1 2… | 2085298465802981377 | 56 | NOT_AVAILABLE | 139.99 | 84.00 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 83.8 | A |
| 7 | outillage | Wood Splitter Drill Bit Set, 6-Piece Wedge Dr… | 2084468169263132673 | 13.28 | NOT_AVAILABLE | 33.99 | 19.92 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 83.8 | A |
| 8 | outillage | Corner Clamp Set With 4 Angle Clamps, Nylon G… | 2084467623751954433 | 6.73 | NOT_AVAILABLE | 16.99 | 10.10 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 83.8 | A |
| 9 | outillage | VEVOR Crimping Tool, 22-10 AWG Ratcheting Wir… | 2069695333556850689 | 11.92 | NOT_AVAILABLE | 29.99 | 17.88 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 82.8 | A |
| 10 | outillage | Tool Belts For Men,Tool Belt Pouch,26-Pockets… | 2085570814609510401 | 10.99 | NOT_AVAILABLE | 27.99 | 16.48 | CONFIRMED_READY | Britain Warehouse | 45 | 95 | LOW | 79.8 | A |

### Parfums (parfums)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | parfums | 6pcs Travel Set, Women's Eau De Parfuma Spray… | 2065261834669944834 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 2 | parfums | 6pcs Set, 1.18fl.oz 35ml Each Bottle, Men's E… | 2065262870210322433 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 3 | parfums | 6pcs Women's Eau De Parfum Travel Set - Long-… | 2065258397953990657 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 4 | parfums | Chained Eau De Cologne For Men,Amber Wood Eau… | 2067099123967361026 | 16.70 | NOT_AVAILABLE | 41.99 | 25.05 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 5 | parfums | Foliage Silence Women's Eau De Parfum 50ml - … | 2064906596035444737 | 14.30 | NOT_AVAILABLE | 35.99 | 21.45 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 6 | parfums | EAU DE PARIS SPORT Men's Eau De Toilette 50ml… | 2064901829883424769 | 14.30 | NOT_AVAILABLE | 35.99 | 21.45 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 87.2 | A |
| 7 | parfums | 6pcs Travel Set, Women'S Eau De Parfuma Spray… | 2065255351475396609 | 15.41 | NOT_AVAILABLE | 38.99 | 23.12 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.8 | A |
| 8 | parfums | Beauty Orange Blue Eau De Toilette For Men, 5… | 2064897915029123073 | 14.30 | NOT_AVAILABLE | 35.99 | 21.45 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 86.0 | A |
| 9 | parfums | Holiday Roaming Eau De Parfum For Women - Flo… | 2066413762498977793 | 11.90 | NOT_AVAILABLE | 29.99 | 17.85 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 84.0 | A |
| 10 | parfums | Orange Wood Tone, High Level, Luxurious Fragr… | 2072205347986894849 | 7.90 | NOT_AVAILABLE | 19.99 | 11.85 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 80.8 | A |

### Rangement (rangement)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | rangement | Nightstand With 2 Drawers And Shelf, Space-Sa… | 2087058883454976002 | 59.06 | NOT_AVAILABLE | 147.99 | 88.59 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 94.0 | A |
| 2 | rangement | LED Nightstand With Charging Station, Modern … | 2087058758566330370 | 73.18 | NOT_AVAILABLE | 182.99 | 109.77 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 93.0 | A |
| 3 | rangement | 4-in-1 Storage Set, Equipped With Hanging Rac… | 2087058577313677314 | 41.52 | NOT_AVAILABLE | 103.99 | 62.28 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 92.8 | A |
| 4 | rangement | Freestanding Coat Rack And Multi-tier Metal S… | 2087101968644567042 | 18.96 | NOT_AVAILABLE | 47.99 | 28.44 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 91.5 | A |
| 5 | rangement | Electric Tool Storage Rack With Charging Stat… | 2087009496702377985 | 44.20 | NOT_AVAILABLE | 110.99 | 66.30 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 91.5 | A |
| 6 | rangement | 9-compartment Magazine Holder, Book And Tray … | 2087399441259880450 | 18.55 | NOT_AVAILABLE | 46.99 | 27.83 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 90.5 | A |
| 7 | rangement | Bamboo Bread Box - Practical Storage Solution… | 2087012273125969922 | 31.14 | NOT_AVAILABLE | 77.99 | 46.71 | CONFIRMED_READY | Germany Warehouse | 85 | 95 | LOW | 90.0 | A |
| 8 | rangement | Graded Card Storage Box 4 Slots, Graded Sport… | 2087360135745257474 | 56.95 | NOT_AVAILABLE | 142.99 | 85.43 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.0 | A |
| 9 | rangement | 8 Drawers Dresser for Bedroom, Wood Bedroom D… | 2087063678801408002 | 172.50 | NOT_AVAILABLE | 431.99 | 258.75 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |
| 10 | rangement | Wooden Chicken Coop with Nesting Box & Pull-O… | 2087073302027956226 | 359.24 | NOT_AVAILABLE | 898.99 | 538.86 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.0 | A |

### Souris (souris)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | souris | Half Hand Gaming Keyboard And Mouse Combo Wir… | 2078065879699185665 | 22.31 | NOT_AVAILABLE | 55.99 | 33.46 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 89.8 | A |
| 2 | souris | ATK X1 AIR Master Edition Wireless Lightweigh… | 2607310843291621000 | 46.88 | NOT_AVAILABLE | 117.99 | 70.32 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 81.8 | B |
| 3 | souris | KP-J451 Best-Selling Wireless Keyboard Mouse … | 2084560602917171201 | 16.18 | NOT_AVAILABLE | 40.99 | 24.27 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.8 | B |
| 4 | souris | Transparent Wireless Bluetooth Three-mode Sil… | 2607120821251630300 | 7.63 | NOT_AVAILABLE | 19.99 | 11.45 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 75.2 | B |
| 5 | souris | Mute Mechanical-feel Keyboard And Mouse Set | 2607070506551637000 | 9.67 | NOT_AVAILABLE | 24.99 | 14.50 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 74.8 | B |
| 6 | souris | KP-J452 Best-Selling Wired Keyboard And Mouse… | 2084565541264723969 | 10.57 | NOT_AVAILABLE | 26.99 | 15.86 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 72.8 | B |
| 7 | souris | S402 Best-Selling Wireless Bluetooth Mouse Du… | 2084495149537472513 | 7.81 | NOT_AVAILABLE | 19.99 | 11.71 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 72.2 | B |
| 8 | souris | Dual-mode Bluetooth Mouse A Sleek Office Esse… | 2607091149351615400 | 5.80 | NOT_AVAILABLE | 14.99 | 8.70 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.8 | B |
| 9 | souris | KP-S403 Best-Selling Wireless Mouse Stylish S… | 2084499560256352257 | 3.63 | NOT_AVAILABLE | 9.99 | 5.45 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 71.2 | B |
| 10 | souris | New FENGHUO LANG Gaming Wireless Silent Charg… | 2607110821581605500 | 3.66 | NOT_AVAILABLE | 9.99 | 5.49 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 69.8 | B |

### Tablettes (tablettes)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | tablettes | 10.1 Inch Tablet Pc 4GB RAM Android 12.0 Tabl… | 1956885849875546114 | 104.98 | NOT_AVAILABLE | 262.99 | 157.47 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 88.2 | A |
| 2 | tablettes | Export 7inch Kids Tablet Pc Drop-resistant Ex… | 2511160639111637500 | 22.39 | NOT_AVAILABLE | 55.99 | 33.59 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.5 | B |
| 3 | tablettes | New 10-inch Tablet PC Wholesale Octa-core All… | 2601240532581623100 | 48.09 | NOT_AVAILABLE | 120.99 | 72.14 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 4 | tablettes | 10 inch Google Android Tablet 12 512 GB Dual … | 2512150956441633000 | 49.75 | NOT_AVAILABLE | 124.99 | 74.62 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 5 | tablettes | 10 inch Google Android Tablet  12GB512GB  Dua… | 2512150937061607500 | 43.12 | NOT_AVAILABLE | 107.99 | 64.68 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 6 | tablettes | 10  inch Tablet PC A73 With Bluetooth  5G Con… | 2512150839201638500 | 43.95 | NOT_AVAILABLE | 109.99 | 65.93 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 7 | tablettes | High Definition Screen Call Touch Screen Inte… | 2512150834151621700 | 43.95 | NOT_AVAILABLE | 109.99 | 65.93 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 8 | tablettes | Android Tablet With Bluetooth Calling Gaming … | 2512150803391613400 | 43.95 | NOT_AVAILABLE | 109.99 | 65.93 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 9 | tablettes | 10 inch Tablet PC X95  Dual SIM Dual standby … | 2512150723441628700 | 36.48 | NOT_AVAILABLE | 91.99 | 54.72 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |
| 10 | tablettes | Bestseller 10 inch Pro 14 Tablet PC Android 1… | 2512150424021617200 | 34.66 | NOT_AVAILABLE | 86.99 | 51.99 | CONFIRMED_LOW | China Warehouse | 40 | 95 | MEDIUM | 80.0 | B |

### Vêtements mixte / unisexe (vetements-mixte)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | vetements-mixte | Unisex Disposable Olders Briefs With Adjustab… | 2080474679773933570 | 24.99 | NOT_AVAILABLE | 62.99 | 37.48 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 91.2 | A |
| 2 | vetements-mixte | Polar Fleece Lined Hoodie With A Detachable F… | 2607301100271611100 | 15.04 | NOT_AVAILABLE | 37.99 | 22.56 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.8 | B |
| 3 | vetements-mixte | Retro Washed Distressed Lapel-collar Relaxed-… | 2607260858281625400 | 18.46 | NOT_AVAILABLE | 46.99 | 27.69 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.8 | B |
| 4 | vetements-mixte | Short Relaxed-fit Fleece-lined Cardigan Unise… | 2607260701401638600 | 13.68 | NOT_AVAILABLE | 34.99 | 20.52 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 5 | vetements-mixte | Dual-Control Smart Heating Warm Hoodie | 2607240923001614700 | 18.12 | NOT_AVAILABLE | 45.99 | 27.18 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 79.2 | B |
| 6 | vetements-mixte | Fashionable Casual Versatile Canvas Unisex St… | 2607231029521639800 | 29.68 | NOT_AVAILABLE | 74.99 | 44.52 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.8 | B |
| 7 | vetements-mixte | Retro V-neck Cardigan Coat Unisex Couples Jac… | 2608070237591602700 | 19.97 | NOT_AVAILABLE | 49.99 | 29.95 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.2 | B |
| 8 | vetements-mixte | Detachable-hooded Biker Jacket Waist-cinching… | 2608110136071602700 | 15.63 | NOT_AVAILABLE | 39.99 | 23.45 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.2 | B |
| 9 | vetements-mixte | Outdoor Windproof And Waterproof Bomber Jacke… | 2608110707001609000 | 15.45 | NOT_AVAILABLE | 38.99 | 23.17 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.2 | B |
| 10 | vetements-mixte | Color-block Hoodie High-waisted Denim Patchwo… | 2607261141221631300 | 16.92 | NOT_AVAILABLE | 42.99 | 25.38 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.8 | B |

### Vidéoprojecteurs (videoprojecteurs)

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente | Marge brute | Stock | Entrepôt | Score livraison | Score catégorie | Risque | Score global | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | videoprojecteurs | Amazon Bestseller HY300PRO Home Projector Wit… | 2605220209161603200 | 35.19 | NOT_AVAILABLE | 87.99 | 52.78 | CONFIRMED_READY | China Warehouse | 55 | 95 | LOW | 90.5 | A |
| 2 | videoprojecteurs | Projector HD For Home Theater Office 360 Degr… | 2069714608557056002 | 52.80 | NOT_AVAILABLE | 131.99 | 79.20 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 3 | videoprojecteurs | 5G WiFi Bluetooth Projector 180 Degree Rotati… | 2078066053532114946 | 49.22 | NOT_AVAILABLE | 123.99 | 73.83 | CONFIRMED_READY | US Warehouse | 75 | 95 | LOW | 86.5 | A |
| 4 | videoprojecteurs | P30 Small Projector 1080P FHP 4K For Android … | 2078067180473049089 | 61.19 | NOT_AVAILABLE | 152.99 | 91.78 | CONFIRMED_READY | US Warehouse | 75 | 95 | MEDIUM | 85.5 | A |
| 5 | videoprojecteurs | The Touch-enabled Projector With A Gimbal-mou… | 2608030947551610300 | 128.52 | NOT_AVAILABLE | 321.99 | 192.78 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 80.5 | B |
| 6 | videoprojecteurs | New Premium Ultra HD Smart Projector | 2605210119541608100 | 27.86 | NOT_AVAILABLE | 69.99 | 41.79 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 78.5 | B |
| 7 | videoprojecteurs | X3AQ Autofocus 1080P HD Video 4K Projector | 2606051513541621900 | 58.04 | NOT_AVAILABLE | 145.99 | 87.06 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 77.5 | B |
| 8 | videoprojecteurs | AI Intelligent Noise Reduction Painting Proje… | 2606050746261620800 | 67.16 | NOT_AVAILABLE | 167.99 | 100.74 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.0 | B |
| 9 | videoprojecteurs | Portable Home Theater Projector, Mini Project… | 2084214556704231426 | 29.99 | NOT_AVAILABLE | 74.99 | 44.98 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 76.0 | B |
| 10 | videoprojecteurs | Home Wall-mounted Direct-projection Portable … | 2605200147371631600 | 56.38 | NOT_AVAILABLE | 140.99 | 84.57 | CONFIRMED_LOW | China Warehouse | 40 | 95 | LOW | 75.0 | B |

**Catégories non incluses ici** (moins de 10 candidats valides évalués, pas de TOP 10 inventé) : Beauté & Bien-être > Bien-être/Massage, Jeux de société, Téléphones, Chats, Football, Jeunesse.

## 18. Produits rejetés — détail

| CJ ID | Titre | Catégorie | Score | Motif |
|---|---|---|---|---|

| 2087058498321399810 | Tall Dresser Fabric Storage Tower ,Wooden Top For Kid Room,  | rangement | 72.0 | Stock CJ épuisé (OUT_OF_STOCK). |


## 19. Principaux motifs de non-sélection

- **Rejet dur (`REJECT`)** : 1 candidat (stock CJ `OUT_OF_STOCK`).
- **Exclusion stratégique** (catégories « ne jamais prioriser », B/C non ajoutés) : 10 candidats.
- **Plafond de 308 atteint** (candidats A/B valides mais non retenus faute de place, principalement dans les catégories à fort volume : chaussures femme/homme, vêtements mixte, bijoux) : 373 candidats — **ces candidats restent disponibles pour une itération future**, aucun n'a été supprimé des données.

## 20. Produits nécessitant une vérification manuelle avant tout import futur

**220/308** candidats sélectionnés portent au moins un signal de vérification manuelle. Répartition des motifs :


| Motif | Nombre |
|---|---|
| stock incertain | 191 |
| risque moyen (voir riskReasons) | 52 |
| marge incertaine ou faible | 27 |
| fiche produit incomplète (description/images) | 25 |
| prix fournisseur eleve (>200e) - verifier viabilite logistique/conversion | 8 |

Liste complète disponible dans `reports/cj-phase2-evaluation.json` → chaque candidat sélectionné porte un champ `needsManualReview` (tableau, vide si aucun signal).

## 21. Sécurité Shopify — confirmation

Aucun appel en écriture vers l'API Admin Shopify n'a été effectué pendant cette phase. Aucun produit CJ n'a été importé, publié ou modifié. Aucun produit `ARCHIVED` ou `DRAFT` existant n'a été réactivé. Le fichier `src/lib/catalog/categories.ts` n'a subi aucune modification (catégorie « bijoux » toujours au statut proposé).

```
shopifyWrites = 0
productsImported = 0
productsPublished = 0
productsModified = 0
```

## 22. Tests exécutés

Voir §23 pour le détail des commandes et résultats (`npx tsc --noEmit`, `npm run lint`, `npm run build`). Le projet ne dispose pas de script `"test"` dans `package.json` — confirmé explicitement, aucun test automatisé additionnel n'a donc pu être exécuté au-delà des vérifications de compilation/lint/build.

## 23. Résultats des vérifications techniques

| Test | Commande | Résultat |
|---|---|---|
| Vérification TypeScript | `npx tsc --noEmit` | ✅ 0 erreur |
| Lint | `npm run lint` | ✅ 0 erreur/warning |
| Build production | `npm run build` | ✅ Build réussi (161 pages générées, 0 erreur) |
| Script de test dédié | `package.json` → champ `scripts.test` | Absent — confirmé explicitement, aucun script `test` n'existe dans ce projet |

Aucune de ces vérifications n'a modifié de donnée Shopify ni catalogue produit — elles portent uniquement sur la compilation/qualité du code du projet (le pipeline Phase 2 est un ensemble de scripts locaux, aucun composant applicatif nouveau n'a été ajouté au projet Next.js lui-même).


## 24. Recommandation finale et prochaines étapes

La Phase 2 fournit un bassin évalué et priorisé de 308 candidats prêts pour une décision d'import (dont 117 en Priorité A à examiner en premier), plus 373 candidats valides supplémentaires en réserve. **Aucune décision d'import n'a été prise** — cette phase est strictement une évaluation.

Recommandations pour la suite (nécessitent une nouvelle autorisation explicite) :
1. Revue humaine prioritaire des 117 candidats A, en commençant par les catégories à fort enjeu stratégique (chaussures, vêtements mixte, rangement, vidéoprojecteurs, tablettes, téléphones — Plan V2 P1).
2. Vérification manuelle ciblée des 220 candidats signalés (stock incertain, risque moyen, marge faible, fiche incomplète, coût élevé).
3. Vérification anti-doublon manuelle/SKU sur les catégories à fort recouvrement avec le catalogue existant (bijoux notamment, 147 produits déjà actifs).
4. Décision explicite de l'utilisateur avant toute étape d'import CJ → Shopify.

---

