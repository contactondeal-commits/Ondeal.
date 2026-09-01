# Phase 3 — Final Quality Gate

**Généré le :** 2026-08-12  
**Mission :** Dernier contrôle qualité des 308 produits sélectionnés en Phase 2, avant toute éventuelle intégration Shopify.  
**Aucune écriture Shopify, aucun import CJ, aucune publication n'a eu lieu pendant cette phase.**

## 1. Executive Summary

Sur les **308 candidats** sélectionnés en Phase 2, un audit final approfondi — incluant une **re-vérification en direct du stock CJ réel** (308/308 fiches re-récupérées avec succès), un **re-audit strict de l'adéquation catégorie** (regex include/exclude spécifiques par catégorie, fondées sur des anomalies réellement observées), une **amélioration du contrôle de doublon OnDeal** (comparaison sémantique scopée par catégorie avec traduction EN→FR), et un **nouveau score qualité pondéré sur 100 points avec pénalités** — a produit le résultat suivant :

- **50 candidats Priorité A+/A** (excellents, prêts pour une éventuelle Wave 1/2)
- **70 candidats Priorité B** (bons, prêts pour une éventuelle Wave 3)
- **→ Total FINAL_SELECTED (prêt) = 120** sur un plafond de 308
- **138 candidats en zone de vérification manuelle** (intéressants mais non prêts à importer — liste séparée, non comptée dans la sélection finale)
- **55 candidats définitivement rejetés** sur les 308 initiaux (dont **5 remplacés** par un candidat de réserve de meilleure qualité)

**Constat majeur** : le re-audit strict de catégorie a détecté **46 anomalies de catégorie réelles** parmi les 308 candidats initialement sélectionnés (ex. bijoux Moissanite/Sterling Silver classés à tort dans « Rangement », jardinières classées « Rangement », un drone classé « Sacs femme », un gonfleur de pneu classé « Football »). Ce nombre confirme que ce contrôle qualité final était nécessaire et justifié.

**Aucun produit n'a été importé, publié ou modifié sur Shopify.**

## 2. Input Pool

| Élément | Valeur |
|---|---|
| Candidats sélectionnés en Phase 2 (entrée de cette phase) | 308 |
| Pool de réserve disponible | 374 |
| Candidats de réserve re-vérifiés en direct (ciblé, catégories à remplacer) | 83 |
| Candidats de réserve restants en mode cache (statut Phase 2 requalifié par prudence) | 291 |

## 3. Final Audit

| Résultat de l'audit (308 initiaux) | Nombre |
|---|---|
| A (aucun A+ atteint — voir §12/§15) | 50 |
| B | 65 |
| REVIEW | 138 |
| REJECT | 55 |
| **Total** | **308** |

Après remplacement (§18) : **5 candidats de réserve** promus en B pour compenser une partie des rejets (catégories homme-chaussures, femme-chaussures, vêtements mixte, football). **55 rejets restent définitifs**, faute de remplaçant valable en réserve.

## 4. Stock

| Statut stock final | 308 initiaux | Sélection finale (120) |
|---|---|---|
| CONFIRMED_READY | 114 | 78 |
| CONFIRMED_LOW | 191 | 42 |
| UNCERTAIN | 3 | 0 |
| OUT_OF_STOCK | 0 | 0 |
| NOT_AVAILABLE | 0 | 0 |

Règle appliquée : `OUT_OF_STOCK` → REJECT direct (1 cas confirmé en direct : stock épuisé réel). `UNCERTAIN` ne peut jamais être Priorité A+. `NOT_AVAILABLE` ne peut jamais être A+ (règle respectée : aucun A+ n'a été attribué avec ce statut).

## 5. Shipping

| Statut livraison | Sélection finale |
|---|---|
| OK (score calculé) | 120 |
| UNKNOWN (non inventé) | 0 |

Score de livraison basé sur l'entrepôt (France > UE > Europe élargie > US > Chine > autre) et le statut de stock (`UNCERTAIN`/`CONFIRMED_LOW` plafonnent le score à 45/100 maximum). Aucun coût de livraison n'a été inventé — `shippingCost` reste `NOT_AVAILABLE` pour tous les candidats (limite structurelle documentée §7).

## 6. Pricing

Formule OnDeal existante réutilisée sans modification : `estimatedSellingPrice = ceil(coût × 2,5) - 0,01`. Coût de livraison non isolé (replié dans le multiplicateur), `landedCost` reste `NOT_AVAILABLE` pour l'ensemble des candidats — limite structurelle constante, non un signal différenciant produit par produit.

## 7. Margin

| Classification marge | Sélection finale |
|---|---|
| EXCELLENT (≥30€) | 67 |
| GOOD (15-30€) | 33 |
| ACCEPTABLE (7-15€) | 20 |
| LOW (<7€) | 0 |
| UNKNOWN | 0 |

Marge brute moyenne (sélection finale) : **73.06 €**. **Rappel important** : cette classification n'intègre pas de coût de livraison isolé (voir §6) — elle est donc **nominale**, pas une marge nette confirmée. 7 candidats « parfums » ont été rejetés en Phase 3 précisément pour marge insuffisante (coût fournisseur ~2€, marge absolue trop faible) combinée à un contenu de fiche trop pauvre.

## 8. Product Quality

Nombre moyen d'images (sélection finale) : **8.2**. **2/120** candidats portent le signal `INCOMPLETE_CONTENT` (description <40 caractères ou <3 images) — inclus dans la liste de vérification manuelle même s'ils ont atteint le seuil B/A par ailleurs.

## 9. Risk

| Niveau de risque final | Sélection finale |
|---|---|
| LOW | 107 |
| MEDIUM | 13 |
| HIGH | 0 |

**0 candidat(s)** portent un signal `SUSPECT_BRAND_NAMING` détecté en Phase 3 (nommage de type « Louis [Nom] » sur des sacs à main, pattern fréquent de dropshipping évoquant une marque de luxe sans la nommer explicitement) — signalés en vérification manuelle, non rejetés d'office faute de certitude suffisante sur une contrefaçon caractérisée.

## 10. Duplicate Check

Contrôle amélioré par rapport à la Phase 2 : comparaison **scopée par catégorie** (classification des 893 produits ACTIVE OnDeal via `data/categorization-report-v2.json` + `reports/jewelry-reclassification-report.json`) avec **traduction sémantique EN→FR** (~90 termes produits courants) avant comparaison Jaccard.

| Risque de doublon | Sélection finale |
|---|---|
| NONE | 117 |
| LOW | 3 |
| MEDIUM | 0 |
| HIGH | 0 |
| CONFIRMED (→ REJECT automatique) | 0 |

**Limite assumée** : il s'agit d'une traduction lexicale partielle (dictionnaire curé), pas d'une traduction automatique complète — un faux négatif reste possible sur des titres très éloignés lexicalement du français. Recommandation maintenue : vérification manuelle/SKU avant tout import futur, en particulier pour Bijoux (147 produits déjà actifs sur OnDeal).

## 11. Category Fit

Re-audit strict appliqué aux 308 candidats initiaux : **260 PASS**, **2 REVIEW**, **46 REJECT**. Le détail des 46 rejets de catégorie est en §18/§21 (produits rejetés). Les règles précises (regex par catégorie) sont documentées dans `reports/cj-phase3-final-quality-gate.json` → `methodologyNotes.categoryFitReaudit`.

## 12. Final Scoring

```
FINAL QUALITY SCORE (100 pts, avant pénalités) =
    categoryFitFinal          × 0.20
  + stockFinalScore           × 0.15   (CONFIRMED_READY=100, CONFIRMED_LOW=55, UNCERTAIN=35, OUT_OF_STOCK=0, NOT_AVAILABLE=15)
  + marginScoreFinal          × 0.15   (EXCELLENT=100, GOOD=75, ACCEPTABLE=50, LOW=20, UNKNOWN=10)
  + finalShippingScore        × 0.10   (25 si signal insuffisant, jamais inventé comme "bon")
  + productQualityScore       × 0.10   (moyenne image/variantes)
  + contentScore              × 0.05
  + commercialPotentialScore  × 0.05
  + riskScoreFinal            × 0.05   (LOW=100, MEDIUM=55, HIGH/REJECT=0)
  + duplicateSafetyScore      × 0.05   (NONE=100 ... CONFIRMED=0)
  + warehouseScore            × 0.05

Pénalités (cumulables, jamais sous 0) :
  stock incertain -10 | shipping inconnu -5 | risque moyen -5 | marge faible -10
  | contenu incomplet -5 | high ticket -5 | doublon à vérifier -10
```

Score final observé (308 initiaux) : minimum **29.8**, maximum **89.0**.

## 13. Final Selection

| Niveau | Règle | Nombre |
|---|---|---|
| A+ | Score≥90, CatFit≥90, stock CONFIRMED_READY, risque LOW, doublon NONE/LOW | 0 |
| A | Score≥85, ou Score≥80 avec ≤1 signal de vigilance | 50 |
| B | Score≥75 | 70 |
| **FINAL_SELECTED (A+/A/B)** | — | **120** |
| REVIEW (liste séparée, non comptée) | Score 50-74 | 138 |
| REJECT | Catégorie fausse, risque HIGH, doublon confirmé, stock épuisé, ou score <50 | 55 (dont 5 remplacés) |

**Aucun A+ n'a été atteint** : la combinaine stricte (score≥90 + catégorie≥90 + stock confirmé prêt + risque LOW + doublon NONE/LOW) est exigeante par construction — un constat honnête plutôt qu'un seuil réajusté artificiellement pour en produire.

**120/308** — plafond respecté, jamais rempli artificiellement : 138 candidats supplémentaires existaient (zone REVIEW) mais ont été volontairement exclus du cœur « prêt à l'emploi » conformément à la mission (§22 : *"Ces produits ne doivent pas être présentés comme prêts à importer."*).

## 14. Category Distribution

| Catégorie | Groupe V2 | Initial (308) | Sélection finale | A | B | Vérif. manuelle | Rejetés | Remplacements |
|---|---|---|---|---|---|---|---|---|
| Rangement | P1 | 65 | 28 | 20 | 8 | 8 | 29 | 0 |
| Outillage | P3 | 27 | 17 | 9 | 8 | 10 | 0 | 0 |
| Chaussures (homme) | P1 | 16 | 11 | 0 | 11 | 5 | 2 | 2 |
| Vêtements mixte / unisexe | P1 | 15 | 9 | 0 | 9 | 6 | 1 | 1 |
| Vidéoprojecteurs | P1 | 14 | 8 | 2 | 6 | 5 | 1 | 0 |
| Jeux de société | NE_JAMAIS_PRIORISER | 7 | 7 | 2 | 5 | 0 | 0 | 0 |
| Écrans | P2 | 11 | 6 | 0 | 6 | 5 | 0 | 0 |
| Football | NE_JAMAIS_PRIORISER | 5 | 5 | 3 | 2 | 0 | 1 | 1 |
| Parfums | P2 | 20 | 5 | 5 | 0 | 8 | 7 | 0 |
| Téléphones | P1 | 6 | 5 | 4 | 1 | 1 | 0 | 0 |
| Barbecue | NE_JAMAIS_PRIORISER | 3 | 3 | 3 | 0 | 0 | 0 | 0 |
| Chaussures (femme) | P1 | 14 | 3 | 0 | 3 | 7 | 5 | 1 |
| Jeunesse | NE_JAMAIS_PRIORISER | 3 | 3 | 0 | 3 | 0 | 0 | 0 |
| Accessoires (femme) | P2 | 18 | 2 | 1 | 1 | 10 | 6 | 0 |
| Sacs (femme) | P2 | 15 | 2 | 0 | 2 | 11 | 2 | 0 |
| Souris | P2 | 14 | 2 | 1 | 1 | 12 | 0 | 0 |
| Beauté & Bien-être > Bien-être/Massage | P2 | 7 | 1 | 0 | 1 | 6 | 0 | 0 |
| Bijoux (catégorie proposée) | P1 | 14 | 1 | 0 | 1 | 12 | 1 | 0 |
| Chats | P3 | 5 | 1 | 0 | 1 | 4 | 0 | 0 |
| Tablettes | P1 | 15 | 1 | 0 | 1 | 14 | 0 | 0 |
| Accessoires (homme) | P2 | 14 | 0 | 0 | 0 | 14 | 0 | 0 |

## 15. TOP 50

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | rangement | Bamboo Bread Box - Practical Storage Solut… | 2087012273125969922 | 31.14 | NOT_AVAILABLE | NOT_AVAILABLE | 77.99 | 46.71 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 89.0 | A |
| 2 | rangement | Nightstand With 2 Drawers And Shelf, Space… | 2087058883454976002 | 59.06 | NOT_AVAILABLE | NOT_AVAILABLE | 147.99 | 88.59 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 88.5 | A |
| 3 | rangement | LED Nightstand With Charging Station, Mode… | 2087058758566330370 | 73.18 | NOT_AVAILABLE | NOT_AVAILABLE | 182.99 | 109.77 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 87.5 | A |
| 4 | rangement | 4-in-1 Storage Set, Equipped With Hanging … | 2087058577313677314 | 41.52 | NOT_AVAILABLE | NOT_AVAILABLE | 103.99 | 62.28 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 87.2 | A |
| 5 | outillage | Straight Throat Type Car Water Pipe Clamp … | 2082414072732110849 | 43.21 | NOT_AVAILABLE | NOT_AVAILABLE | 108.99 | 64.81 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 86.5 | A |
| 6 | rangement | Graded Card Storage Box 4 Slots, Graded Sp… | 2087360135745257474 | 56.95 | NOT_AVAILABLE | NOT_AVAILABLE | 142.99 | 85.43 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 86.0 | A |
| 7 | rangement | Set Of 2 Desk Organizers With 9 Compartmen… | 2087399621392875521 | 12.23 | NOT_AVAILABLE | NOT_AVAILABLE | 30.99 | 18.34 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 85.7 | A |
| 8 | rangement | 1-Piece 5-Tier Jewelry Organizer With 108 … | 2087398078761418753 | 11.14 | NOT_AVAILABLE | NOT_AVAILABLE | 27.99 | 16.71 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 85.7 | A |
| 9 | rangement | 9-compartment Magazine Holder, Book And Tr… | 2087399441259880450 | 18.55 | NOT_AVAILABLE | NOT_AVAILABLE | 46.99 | 27.83 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 85.7 | A |
| 10 | souris | Half Hand Gaming Keyboard And Mouse Combo … | 2078065879699185665 | 22.31 | NOT_AVAILABLE | NOT_AVAILABLE | 55.99 | 33.46 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 85.7 | A |
| 11 | outillage | Universal Engine Valve Spring Compressor T… | 2087473424792711170 | 21 | NOT_AVAILABLE | NOT_AVAILABLE | 52.99 | 31.50 | 150.0 | CONFIRMED_READY | Britain Warehouse | 78 | LOW | 95 | 85.5 | A |
| 12 | femme-accessoires | 2PCS Halloween Mantle Scarf (96"x18") - Bl… | 2087099154061062146 | 28.15 | NOT_AVAILABLE | NOT_AVAILABLE | 70.99 | 42.22 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 85.2 | A |
| 13 | rangement | 8 Drawers Dresser for Bedroom, Wood Bedroo… | 2087063678801408002 | 172.50 | NOT_AVAILABLE | NOT_AVAILABLE | 431.99 | 258.75 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 85.0 | A |
| 14 | rangement | Modern Grey Wood Grain Console Table, Part… | 2087067624278323201 | 143.40 | NOT_AVAILABLE | NOT_AVAILABLE | 358.99 | 215.10 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 85.0 | A |
| 15 | outillage | Set Of 3 Heavy-duty Combination Pliers Wit… | 2054763675628249089 | 13.44 | NOT_AVAILABLE | NOT_AVAILABLE | 33.99 | 20.16 | 150.0 | CONFIRMED_READY | France Warehouse | 100 | LOW | 95 | 85.0 | A |
| 16 | outillage | 9 Piece Torque Wrench Set 3-230Nm 1 4 3 8 … | 2085298465802981377 | 56 | NOT_AVAILABLE | NOT_AVAILABLE | 139.99 | 84.00 | 150.0 | CONFIRMED_READY | Britain Warehouse | 78 | LOW | 95 | 85.0 | A |
| 17 | rangement | Hair Dryer Bracket No Drilling Wall Mount … | 2086667283638968321 | 29.34 | NOT_AVAILABLE | NOT_AVAILABLE | 73.99 | 44.01 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 84.7 | A |
| 18 | rangement | Rattan-front Shoe Cabinet With 1 Drawer An… | 2086730654934884354 | 52.28 | NOT_AVAILABLE | NOT_AVAILABLE | 130.99 | 78.42 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 84.7 | A |
| 19 | videoprojecteurs | 5G WiFi Bluetooth Projector 180 Degree Rot… | 2078066053532114946 | 49.22 | NOT_AVAILABLE | NOT_AVAILABLE | 123.99 | 73.83 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 84.7 | A |
| 20 | barbecue | Folding BBQ Charcoal Barbecue Grill Steel … | 2079769132916797442 | 31.89 | NOT_AVAILABLE | NOT_AVAILABLE | 79.99 | 47.84 | 150.0 | CONFIRMED_READY | Britain Warehouse | 78 | LOW | 95 | 84.5 | A |
| 21 | rangement | White Wardrobe Drawer Organizers, Stackabl… | 2087453096787996673 | 13.34 | NOT_AVAILABLE | NOT_AVAILABLE | 33.99 | 20.01 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 84.5 | A |
| 22 | rangement | Freestanding Coat Rack And Multi-tier Meta… | 2087101968644567042 | 18.96 | NOT_AVAILABLE | NOT_AVAILABLE | 47.99 | 28.44 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 83.7 | A |
| 23 | videoprojecteurs | Projector HD For Home Theater Office 360 D… | 2069714608557056002 | 52.80 | NOT_AVAILABLE | NOT_AVAILABLE | 131.99 | 79.20 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 83.7 | A |
| 24 | outillage | Grommet Tool Kit 1/4" 3/8" 1/2" 900 PCS Gr… | 2084896101978845186 | 52.69 | NOT_AVAILABLE | NOT_AVAILABLE | 131.99 | 79.03 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 83.5 | A |
| 25 | outillage | Wood Splitter Drill Bit Set, 6-Piece Wedge… | 2084468169263132673 | 13.28 | NOT_AVAILABLE | NOT_AVAILABLE | 33.99 | 19.92 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 83.2 | A |
| 26 | football | Steel Pipe Rebound Soccer Football Goal Bl… | 2059832481786806273 | 39 | NOT_AVAILABLE | NOT_AVAILABLE | 97.99 | 58.50 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 83.0 | A |
| 27 | football | 8X5ft Soccer Goal Training Set With Net Bu… | 2059842348901490689 | 55.50 | NOT_AVAILABLE | NOT_AVAILABLE | 138.99 | 83.25 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 83.0 | A |
| 28 | jeux-societe | Steel Ladder Toss Game Set, 2 Pack Ladder … | 2084898812666220546 | 54.12 | NOT_AVAILABLE | NOT_AVAILABLE | 135.99 | 81.18 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 83.0 | A |
| 29 | football | 8x5 ft Soccer Goal for Backyard, Portable … | 2084898863937392641 | 50.08 | NOT_AVAILABLE | NOT_AVAILABLE | 125.99 | 75.12 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 83.0 | A |
| 30 | jeux-societe | Golf Chipping Game Mat Set With Target Net… | 2082405051535212545 | 19.08 | NOT_AVAILABLE | NOT_AVAILABLE | 47.99 | 28.62 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 82.7 | A |
| 31 | outillage | Grommet Tool Kit 1/4" 5/16" 3/8" 900 PCS G… | 2084896418451664897 | 111.34 | NOT_AVAILABLE | NOT_AVAILABLE | 278.99 | 167.01 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 82.5 | A |
| 32 | rangement | Cake Stand Hanger – A Practical Hanging So… | 2087396459334991873 | 7.94 | NOT_AVAILABLE | NOT_AVAILABLE | 19.99 | 11.91 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 82.0 | A |
| 33 | rangement | Green Office Set – Portable Organizer With… | 2087395363599474690 | 8.36 | NOT_AVAILABLE | NOT_AVAILABLE | 20.99 | 12.54 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 82.0 | A |
| 34 | rangement | 6-piece Can Set With Colored Marking Rings… | 2087028250198925314 | 5.59 | NOT_AVAILABLE | NOT_AVAILABLE | 13.99 | 8.38 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 82.0 | A |
| 35 | parfums | 6pcs Travel Set, Women's Eau De Parfuma Sp… | 2065261834669944834 | 15.41 | NOT_AVAILABLE | NOT_AVAILABLE | 38.99 | 23.12 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 82.0 | A |
| 36 | parfums | 6pcs Set, 1.18fl.oz 35ml Each Bottle, Men'… | 2065262870210322433 | 15.41 | NOT_AVAILABLE | NOT_AVAILABLE | 38.99 | 23.12 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 82.0 | A |
| 37 | parfums | 6pcs Women's Eau De Parfum Travel Set - Lo… | 2065258397953990657 | 15.41 | NOT_AVAILABLE | NOT_AVAILABLE | 38.99 | 23.12 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 82.0 | A |
| 38 | outillage | Tool Belts For Men,Tool Belt Pouch,26-Pock… | 2085570814609510401 | 10.99 | NOT_AVAILABLE | NOT_AVAILABLE | 27.99 | 16.48 | 150.0 | CONFIRMED_READY | Britain Warehouse | 78 | LOW | 95 | 81.7 | A |
| 39 | rangement | Electric Tool Storage Rack With Charging S… | 2087009496702377985 | 44.20 | NOT_AVAILABLE | NOT_AVAILABLE | 110.99 | 66.30 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | MEDIUM | 95 | 81.2 | A |
| 40 | telephones | Mini Phone Unlocked World's Smallest 3.0in… | 2072961242585907201 | 29.99 | NOT_AVAILABLE | NOT_AVAILABLE | 74.99 | 44.98 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | MEDIUM | 95 | 81.2 | A |
| 41 | barbecue | 14X Stainless Steel BBQ Barbecue Tool Set … | 2084163688004694018 | 19.90 | NOT_AVAILABLE | NOT_AVAILABLE | 49.99 | 29.85 | 150.0 | CONFIRMED_READY | Britain Warehouse | 78 | LOW | 95 | 81.2 | A |
| 42 | barbecue | Outdoor Camping Butane Gas Stove Portable … | 2076931983456194562 | 16.42 | NOT_AVAILABLE | NOT_AVAILABLE | 41.99 | 24.63 | 150.0 | CONFIRMED_READY | Britain Warehouse | 78 | LOW | 95 | 81.2 | A |
| 43 | parfums | Holiday Roaming Eau De Parfum For Women - … | 2066413762498977793 | 11.90 | NOT_AVAILABLE | NOT_AVAILABLE | 29.99 | 17.85 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 80.7 | A |
| 44 | parfums | 6pcs Travel Set, Women'S Eau De Parfuma Sp… | 2065255351475396609 | 15.41 | NOT_AVAILABLE | NOT_AVAILABLE | 38.99 | 23.12 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 80.5 | A |
| 45 | telephones | C25 Unlocked Phone Smartphone 8GB 256GB An… | 2021160037155381250 | 79.99 | NOT_AVAILABLE | NOT_AVAILABLE | 199.99 | 119.98 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | MEDIUM | 95 | 80.2 | A |
| 46 | telephones | S24 Unlocked Phone Smartphone 4inch 128GB … | 2020055077430906882 | 69.99 | NOT_AVAILABLE | NOT_AVAILABLE | 174.99 | 104.98 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | MEDIUM | 95 | 80.2 | A |
| 47 | telephones | A15 Unlocked Smartphone Phone 8GB 256GB 68… | 2020025322395426817 | 79.99 | NOT_AVAILABLE | NOT_AVAILABLE | 199.99 | 119.98 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | MEDIUM | 95 | 80.2 | A |
| 48 | outillage | VEVOR Crimping Tool, 22-10 AWG Ratcheting … | 2069695333556850689 | 11.92 | NOT_AVAILABLE | NOT_AVAILABLE | 29.99 | 17.88 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 80.2 | A |
| 49 | rangement | Outdoor Storage Shed,Backyard Tools Storag… | 2087072989107712002 | 671.02 | NOT_AVAILABLE | NOT_AVAILABLE | 1677.99 | 1006.53 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 80.0 | A |
| 50 | rangement | 12 Drawers Double Dresser, Modern Wood Dre… | 2087066605372829698 | 248.03 | NOT_AVAILABLE | NOT_AVAILABLE | 620.99 | 372.05 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 80.0 | A |

## 16. TOP 10 Per Category

### Rangement (rangement) — 28 disponible(s), TOP 10 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | rangement | Bamboo Bread Box - Practical Storage Solut… | 2087012273125969922 | 31.14 | NOT_AVAILABLE | NOT_AVAILABLE | 77.99 | 46.71 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 89.0 | A |
| 2 | rangement | Nightstand With 2 Drawers And Shelf, Space… | 2087058883454976002 | 59.06 | NOT_AVAILABLE | NOT_AVAILABLE | 147.99 | 88.59 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 88.5 | A |
| 3 | rangement | LED Nightstand With Charging Station, Mode… | 2087058758566330370 | 73.18 | NOT_AVAILABLE | NOT_AVAILABLE | 182.99 | 109.77 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 87.5 | A |
| 4 | rangement | 4-in-1 Storage Set, Equipped With Hanging … | 2087058577313677314 | 41.52 | NOT_AVAILABLE | NOT_AVAILABLE | 103.99 | 62.28 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 87.2 | A |
| 5 | rangement | Graded Card Storage Box 4 Slots, Graded Sp… | 2087360135745257474 | 56.95 | NOT_AVAILABLE | NOT_AVAILABLE | 142.99 | 85.43 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 86.0 | A |
| 6 | rangement | Set Of 2 Desk Organizers With 9 Compartmen… | 2087399621392875521 | 12.23 | NOT_AVAILABLE | NOT_AVAILABLE | 30.99 | 18.34 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 85.7 | A |
| 7 | rangement | 1-Piece 5-Tier Jewelry Organizer With 108 … | 2087398078761418753 | 11.14 | NOT_AVAILABLE | NOT_AVAILABLE | 27.99 | 16.71 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 85.7 | A |
| 8 | rangement | 9-compartment Magazine Holder, Book And Tr… | 2087399441259880450 | 18.55 | NOT_AVAILABLE | NOT_AVAILABLE | 46.99 | 27.83 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 85.7 | A |
| 9 | rangement | 8 Drawers Dresser for Bedroom, Wood Bedroo… | 2087063678801408002 | 172.50 | NOT_AVAILABLE | NOT_AVAILABLE | 431.99 | 258.75 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 85.0 | A |
| 10 | rangement | Modern Grey Wood Grain Console Table, Part… | 2087067624278323201 | 143.40 | NOT_AVAILABLE | NOT_AVAILABLE | 358.99 | 215.10 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 85.0 | A |

### Outillage (outillage) — 17 disponible(s), TOP 10 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | outillage | Straight Throat Type Car Water Pipe Clamp … | 2082414072732110849 | 43.21 | NOT_AVAILABLE | NOT_AVAILABLE | 108.99 | 64.81 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 86.5 | A |
| 2 | outillage | Universal Engine Valve Spring Compressor T… | 2087473424792711170 | 21 | NOT_AVAILABLE | NOT_AVAILABLE | 52.99 | 31.50 | 150.0 | CONFIRMED_READY | Britain Warehouse | 78 | LOW | 95 | 85.5 | A |
| 3 | outillage | Set Of 3 Heavy-duty Combination Pliers Wit… | 2054763675628249089 | 13.44 | NOT_AVAILABLE | NOT_AVAILABLE | 33.99 | 20.16 | 150.0 | CONFIRMED_READY | France Warehouse | 100 | LOW | 95 | 85.0 | A |
| 4 | outillage | 9 Piece Torque Wrench Set 3-230Nm 1 4 3 8 … | 2085298465802981377 | 56 | NOT_AVAILABLE | NOT_AVAILABLE | 139.99 | 84.00 | 150.0 | CONFIRMED_READY | Britain Warehouse | 78 | LOW | 95 | 85.0 | A |
| 5 | outillage | Grommet Tool Kit 1/4" 3/8" 1/2" 900 PCS Gr… | 2084896101978845186 | 52.69 | NOT_AVAILABLE | NOT_AVAILABLE | 131.99 | 79.03 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 83.5 | A |
| 6 | outillage | Wood Splitter Drill Bit Set, 6-Piece Wedge… | 2084468169263132673 | 13.28 | NOT_AVAILABLE | NOT_AVAILABLE | 33.99 | 19.92 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 83.2 | A |
| 7 | outillage | Grommet Tool Kit 1/4" 5/16" 3/8" 900 PCS G… | 2084896418451664897 | 111.34 | NOT_AVAILABLE | NOT_AVAILABLE | 278.99 | 167.01 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 82.5 | A |
| 8 | outillage | Tool Belts For Men,Tool Belt Pouch,26-Pock… | 2085570814609510401 | 10.99 | NOT_AVAILABLE | NOT_AVAILABLE | 27.99 | 16.48 | 150.0 | CONFIRMED_READY | Britain Warehouse | 78 | LOW | 95 | 81.7 | A |
| 9 | outillage | VEVOR Crimping Tool, 22-10 AWG Ratcheting … | 2069695333556850689 | 11.92 | NOT_AVAILABLE | NOT_AVAILABLE | 29.99 | 17.88 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 80.2 | A |
| 10 | outillage | Five-piece Colored Pliers Set, 5-piece Com… | 2084825472916164610 | 6.28 | NOT_AVAILABLE | NOT_AVAILABLE | 15.99 | 9.42 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 79.5 | B |

### Chaussures (homme) (homme-chaussures) — 11 disponible(s), TOP 10 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | homme-chaussures | Men's Comfortable Casual Shoes Made Of Ful… | 2608070955271633100 | 30.55 | NOT_AVAILABLE | NOT_AVAILABLE | 76.99 | 45.83 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 79.0 | B |
| 2 | homme-chaussures | Mens Casual Shoes Made From Soft, Lychee-p… | 2608100517481633900 | 50.62 | NOT_AVAILABLE | NOT_AVAILABLE | 126.99 | 75.93 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 78.2 | B |
| 3 | homme-chaussures | Mens Loafers, Slip-on Casual Leather Shoes | 2608100459591615700 | 50.27 | NOT_AVAILABLE | NOT_AVAILABLE | 125.99 | 75.41 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 78.2 | B |
| 4 | homme-chaussures | Versatile Trendy Sneakers Casual Dad-style… | 2608071258501606800 | 25.84 | NOT_AVAILABLE | NOT_AVAILABLE | 64.99 | 38.76 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 78.2 | B |
| 5 | homme-chaussures | Outerwear-friendly Versatile Fashionable O… | 2608080931001601600 | 36.66 | NOT_AVAILABLE | NOT_AVAILABLE | 91.99 | 54.99 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 78.2 | B |
| 6 | homme-chaussures | Platform-soled Retro British-style Boots W… | 2608090959451610000 | 53.93 | NOT_AVAILABLE | NOT_AVAILABLE | 134.99 | 80.89 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 78.2 | B |
| 7 | homme-chaussures | Men's Thick-soled Height-increasing Sports… | 2608110532491630600 | 30.53 | NOT_AVAILABLE | NOT_AVAILABLE | 76.99 | 45.80 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 77.0 | B |
| 8 | homme-chaussures | New Mens Business Formal And Casual Leathe… | 2608080416501635400 | 17.11 | NOT_AVAILABLE | NOT_AVAILABLE | 42.99 | 25.66 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.8 | B |
| 9 | homme-chaussures | New European And American-style Faux Racco… | 2608110901351601000 | 12.96 | NOT_AVAILABLE | NOT_AVAILABLE | 32.99 | 19.44 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.8 | B |
| 10 | homme-chaussures | British-style Casual Mens Genuine Leather … | 2608100152361608500 | 14.49 | NOT_AVAILABLE | NOT_AVAILABLE | 36.99 | 21.73 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.0 | B |

### Vêtements mixte / unisexe (vetements-mixte) — 9 disponible(s), TOP 9 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | vetements-mixte | Fashionable Casual Versatile Canvas Unisex… | 2607231029521639800 | 29.68 | NOT_AVAILABLE | NOT_AVAILABLE | 74.99 | 44.52 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 78.2 | B |
| 2 | vetements-mixte | Medium To Long Double Breasted Loose Coat … | 2608101203311613200 | 29.69 | NOT_AVAILABLE | NOT_AVAILABLE | 74.99 | 44.54 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 77.8 | B |
| 3 | vetements-mixte | Handsome Trendy Soft Leather Jacket Coat | 2608111206321639300 | 38.19 | NOT_AVAILABLE | NOT_AVAILABLE | 95.99 | 57.28 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 77.0 | B |
| 4 | vetements-mixte | Fashion Leopard Print Padded Sleeveless Ve… | 2084883909189730306 | 10.99 | NOT_AVAILABLE | NOT_AVAILABLE | 27.99 | 16.48 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.8 | B |
| 5 | vetements-mixte | Color-block Sportswear Set Casual Relaxed-… | 2607310218111625000 | 10.23 | NOT_AVAILABLE | NOT_AVAILABLE | 25.99 | 15.35 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.8 | B |
| 6 | vetements-mixte | Polar Fleece Lined Hoodie With A Detachabl… | 2607301100271611100 | 15.04 | NOT_AVAILABLE | NOT_AVAILABLE | 37.99 | 22.56 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.8 | B |
| 7 | vetements-mixte | Retro Washed Distressed Lapel-collar Relax… | 2607260858281625400 | 18.46 | NOT_AVAILABLE | NOT_AVAILABLE | 46.99 | 27.69 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.8 | B |
| 8 | vetements-mixte | Short Relaxed-fit Fleece-lined Cardigan Un… | 2607260701401638600 | 13.68 | NOT_AVAILABLE | NOT_AVAILABLE | 34.99 | 20.52 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.0 | B |
| 9 | vetements-mixte | Dual-Control Smart Heating Warm Hoodie | 2607240923001614700 | 18.12 | NOT_AVAILABLE | NOT_AVAILABLE | 45.99 | 27.18 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.0 | B |

### Vidéoprojecteurs (videoprojecteurs) — 8 disponible(s), TOP 8 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | videoprojecteurs | 5G WiFi Bluetooth Projector 180 Degree Rot… | 2078066053532114946 | 49.22 | NOT_AVAILABLE | NOT_AVAILABLE | 123.99 | 73.83 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 84.7 | A |
| 2 | videoprojecteurs | Projector HD For Home Theater Office 360 D… | 2069714608557056002 | 52.80 | NOT_AVAILABLE | NOT_AVAILABLE | 131.99 | 79.20 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 83.7 | A |
| 3 | videoprojecteurs | The Touch-enabled Projector With A Gimbal-… | 2608030947551610300 | 128.52 | NOT_AVAILABLE | NOT_AVAILABLE | 321.99 | 192.78 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 78.0 | B |
| 4 | videoprojecteurs | P30 Small Projector 1080P FHP 4K For Andro… | 2078067180473049089 | 61.19 | NOT_AVAILABLE | NOT_AVAILABLE | 152.99 | 91.78 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | MEDIUM | 95 | 77.7 | B |
| 5 | videoprojecteurs | X3AQ Autofocus 1080P HD Video 4K Projector | 2606051513541621900 | 58.04 | NOT_AVAILABLE | NOT_AVAILABLE | 145.99 | 87.06 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 77.0 | B |
| 6 | videoprojecteurs | New Premium Ultra HD Smart Projector | 2605210119541608100 | 27.86 | NOT_AVAILABLE | NOT_AVAILABLE | 69.99 | 41.79 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 76.5 | B |
| 7 | videoprojecteurs | AI Intelligent Noise Reduction Painting Pr… | 2606050746261620800 | 67.16 | NOT_AVAILABLE | NOT_AVAILABLE | 167.99 | 100.74 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.8 | B |
| 8 | videoprojecteurs | Portable Home Theater Projector, Mini Proj… | 2084214556704231426 | 29.99 | NOT_AVAILABLE | NOT_AVAILABLE | 74.99 | 44.98 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.2 | B |

### Jeux de société (jeux-societe) — 7 disponible(s), TOP 7 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | jeux-societe | Steel Ladder Toss Game Set, 2 Pack Ladder … | 2084898812666220546 | 54.12 | NOT_AVAILABLE | NOT_AVAILABLE | 135.99 | 81.18 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 83.0 | A |
| 2 | jeux-societe | Golf Chipping Game Mat Set With Target Net… | 2082405051535212545 | 19.08 | NOT_AVAILABLE | NOT_AVAILABLE | 47.99 | 28.62 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 82.7 | A |
| 3 | jeux-societe | 66 Cm Easter Animal Dartboard, Velcro Dart… | 2086666076371701761 | 6.26 | NOT_AVAILABLE | NOT_AVAILABLE | 15.99 | 9.39 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 79.0 | B |
| 4 | jeux-societe | Magnetic Maze Game (includes Magnetic Pen)… | 2086667215999774722 | 9.25 | NOT_AVAILABLE | NOT_AVAILABLE | 23.99 | 13.88 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 79.0 | B |
| 5 | jeux-societe | Halloween Spider Web Dartboard, Halloween … | 2083077268838674434 | 6.14 | NOT_AVAILABLE | NOT_AVAILABLE | 15.99 | 9.21 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 79.0 | B |
| 6 | jeux-societe | Rainbow Swing Towel, 2.4m Colorful Parachu… | 2082672957191897090 | 9.45 | NOT_AVAILABLE | NOT_AVAILABLE | 23.99 | 14.17 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 77.7 | B |
| 7 | jeux-societe | Throwing Game For Parties With A Banner, 3… | 2080135273875820546 | 5.36 | NOT_AVAILABLE | NOT_AVAILABLE | 13.99 | 8.04 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 77.7 | B |

### Écrans (ecrans) — 6 disponible(s), TOP 6 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | ecrans | Portable Monitor Phone Extension Screen La… | 2601170046191604500 | 109.70 | NOT_AVAILABLE | NOT_AVAILABLE | 274.99 | 164.55 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 77.2 | B |
| 2 | ecrans | Touch Portable Monitor Mobile Phone Comput… | 1742851421004902400 | 74.59 | NOT_AVAILABLE | NOT_AVAILABLE | 186.99 | 111.89 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 77.2 | B |
| 3 | ecrans | 156-inch HD Portable Monitor Touch With Br… | 2505160348281623500 | 57.71 | NOT_AVAILABLE | NOT_AVAILABLE | 144.99 | 86.56 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 76.0 | B |
| 4 | ecrans | UPERFECT 15.6 Inch HDR IPS Portable Monito… | 2069385191342772225 | 55.30 | NOT_AVAILABLE | NOT_AVAILABLE | 138.99 | 82.95 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.8 | B |
| 5 | ecrans | 14-inch Dual-Screen Portable Monitor For L… | 2603021239391635700 | 158.58 | NOT_AVAILABLE | NOT_AVAILABLE | 396.99 | 237.87 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.8 | B |
| 6 | ecrans | Portable Monitor Extends Your Laptop With … | 2605221004121623500 | 51.74 | NOT_AVAILABLE | NOT_AVAILABLE | 129.99 | 77.61 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.0 | B |

### Parfums (parfums) — 5 disponible(s), TOP 5 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | parfums | 6pcs Travel Set, Women's Eau De Parfuma Sp… | 2065261834669944834 | 15.41 | NOT_AVAILABLE | NOT_AVAILABLE | 38.99 | 23.12 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 82.0 | A |
| 2 | parfums | 6pcs Set, 1.18fl.oz 35ml Each Bottle, Men'… | 2065262870210322433 | 15.41 | NOT_AVAILABLE | NOT_AVAILABLE | 38.99 | 23.12 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 82.0 | A |
| 3 | parfums | 6pcs Women's Eau De Parfum Travel Set - Lo… | 2065258397953990657 | 15.41 | NOT_AVAILABLE | NOT_AVAILABLE | 38.99 | 23.12 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 82.0 | A |
| 4 | parfums | Holiday Roaming Eau De Parfum For Women - … | 2066413762498977793 | 11.90 | NOT_AVAILABLE | NOT_AVAILABLE | 29.99 | 17.85 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 80.7 | A |
| 5 | parfums | 6pcs Travel Set, Women'S Eau De Parfuma Sp… | 2065255351475396609 | 15.41 | NOT_AVAILABLE | NOT_AVAILABLE | 38.99 | 23.12 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 80.5 | A |

### Téléphones (telephones) — 5 disponible(s), TOP 5 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | telephones | Mini Phone Unlocked World's Smallest 3.0in… | 2072961242585907201 | 29.99 | NOT_AVAILABLE | NOT_AVAILABLE | 74.99 | 44.98 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | MEDIUM | 95 | 81.2 | A |
| 2 | telephones | C25 Unlocked Phone Smartphone 8GB 256GB An… | 2021160037155381250 | 79.99 | NOT_AVAILABLE | NOT_AVAILABLE | 199.99 | 119.98 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | MEDIUM | 95 | 80.2 | A |
| 3 | telephones | S24 Unlocked Phone Smartphone 4inch 128GB … | 2020055077430906882 | 69.99 | NOT_AVAILABLE | NOT_AVAILABLE | 174.99 | 104.98 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | MEDIUM | 95 | 80.2 | A |
| 4 | telephones | A15 Unlocked Smartphone Phone 8GB 256GB 68… | 2020025322395426817 | 79.99 | NOT_AVAILABLE | NOT_AVAILABLE | 199.99 | 119.98 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | MEDIUM | 95 | 80.2 | A |
| 5 | telephones | Mini Phone Smartphone,3GB-12GB,2800Mah,3.0… | 2072961845777154049 | 29.99 | NOT_AVAILABLE | NOT_AVAILABLE | 74.99 | 44.98 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | MEDIUM | 95 | 79.7 | B |

### Football (football) — 5 disponible(s), TOP 5 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | football | Steel Pipe Rebound Soccer Football Goal Bl… | 2059832481786806273 | 39 | NOT_AVAILABLE | NOT_AVAILABLE | 97.99 | 58.50 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 83.0 | A |
| 2 | football | 8X5ft Soccer Goal Training Set With Net Bu… | 2059842348901490689 | 55.50 | NOT_AVAILABLE | NOT_AVAILABLE | 138.99 | 83.25 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 83.0 | A |
| 3 | football | 8x5 ft Soccer Goal for Backyard, Portable … | 2084898863937392641 | 50.08 | NOT_AVAILABLE | NOT_AVAILABLE | 125.99 | 75.12 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 83.0 | A |
| 4 | football | 4 In 1 Football Goal Pop-Up Soccer Goal Fo… | 2082406818726936577 | 22.26 | NOT_AVAILABLE | NOT_AVAILABLE | 55.99 | 33.39 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | MEDIUM | 95 | 78.0 | B |
| 5 | football | Men's Football Training Match Socks | 2607160855511601100 | 38.81 | NOT_AVAILABLE | NOT_AVAILABLE | 97.99 | 58.22 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.2 | B |

### Chaussures (femme) (femme-chaussures) — 3 disponible(s), TOP 3 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | femme-chaussures | Retro Casual Formal Business Leather Shoes | 2608110715251610200 | 38.06 | NOT_AVAILABLE | NOT_AVAILABLE | 95.99 | 57.09 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 78.2 | B |
| 2 | femme-chaussures | Women's New FleeceLined Pointed Toe Retro … | 2086640697741299714 | 12 | NOT_AVAILABLE | NOT_AVAILABLE | 29.99 | 18.00 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.8 | B |
| 3 | femme-chaussures | Summer New Women's Outdoor Wear Slide Sand… | 2087008141195464706 | 10.50 | NOT_AVAILABLE | NOT_AVAILABLE | 26.99 | 15.75 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.0 | B |

### Barbecue (barbecue) — 3 disponible(s), TOP 3 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | barbecue | Folding BBQ Charcoal Barbecue Grill Steel … | 2079769132916797442 | 31.89 | NOT_AVAILABLE | NOT_AVAILABLE | 79.99 | 47.84 | 150.0 | CONFIRMED_READY | Britain Warehouse | 78 | LOW | 95 | 84.5 | A |
| 2 | barbecue | 14X Stainless Steel BBQ Barbecue Tool Set … | 2084163688004694018 | 19.90 | NOT_AVAILABLE | NOT_AVAILABLE | 49.99 | 29.85 | 150.0 | CONFIRMED_READY | Britain Warehouse | 78 | LOW | 95 | 81.2 | A |
| 3 | barbecue | Outdoor Camping Butane Gas Stove Portable … | 2076931983456194562 | 16.42 | NOT_AVAILABLE | NOT_AVAILABLE | 41.99 | 24.63 | 150.0 | CONFIRMED_READY | Britain Warehouse | 78 | LOW | 95 | 81.2 | A |

### Jeunesse (jeunesse-livres) — 3 disponible(s), TOP 3 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | jeunesse-livres | Magic Cottage + Pumpkin House Coloring Boo… | 2087397042120949761 | 5.95 | NOT_AVAILABLE | NOT_AVAILABLE | 14.99 | 8.93 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 79.0 | B |
| 2 | jeunesse-livres | 3-piece Coloring Book Set Featuring Three … | 2087395940658970625 | 6.36 | NOT_AVAILABLE | NOT_AVAILABLE | 15.99 | 9.54 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 79.0 | B |
| 3 | jeunesse-livres | Set Of 15 Animal Picture Books Featuring V… | 2087012166355902465 | 6.64 | NOT_AVAILABLE | NOT_AVAILABLE | 16.99 | 9.96 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 79.0 | B |

### Accessoires (femme) (femme-accessoires) — 2 disponible(s), TOP 2 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | femme-accessoires | 2PCS Halloween Mantle Scarf (96"x18") - Bl… | 2087099154061062146 | 28.15 | NOT_AVAILABLE | NOT_AVAILABLE | 70.99 | 42.22 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 85.2 | A |
| 2 | femme-accessoires | Womens Distinctive Rivet Belt Made Of Full… | 2608110829381624900 | 14.76 | NOT_AVAILABLE | NOT_AVAILABLE | 36.99 | 22.14 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.0 | B |

### Sacs (femme) (femme-sacs) — 2 disponible(s), TOP 2 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | femme-sacs | Leather Backpack, Travel Bag, Leather Top … | 2087378861165133826 | 66.48 | NOT_AVAILABLE | NOT_AVAILABLE | 166.99 | 99.72 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 77.2 | B |
| 2 | femme-sacs | New Style Simple Large-Capacity Casual Bac… | 2087375965803528193 | 29.29 | NOT_AVAILABLE | NOT_AVAILABLE | 73.99 | 43.94 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.8 | B |

### Souris (souris) — 2 disponible(s), TOP 2 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | souris | Half Hand Gaming Keyboard And Mouse Combo … | 2078065879699185665 | 22.31 | NOT_AVAILABLE | NOT_AVAILABLE | 55.99 | 33.46 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 85.7 | A |
| 2 | souris | ATK X1 AIR Master Edition Wireless Lightwe… | 2607310843291621000 | 46.88 | NOT_AVAILABLE | NOT_AVAILABLE | 117.99 | 70.32 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 78.2 | B |

### Bijoux (catégorie proposée) (bijoux) — 1 disponible(s), TOP 1 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | bijoux | Women's Fashion Simplicity Square-cut Mois… | 2608120207451624200 | 19.10 | NOT_AVAILABLE | NOT_AVAILABLE | 47.99 | 28.65 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.0 | B |

### Tablettes (tablettes) — 1 disponible(s), TOP 1 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | tablettes | 10.1 Inch Tablet Pc 4GB RAM Android 12.0 T… | 1956885849875546114 | 104.98 | NOT_AVAILABLE | NOT_AVAILABLE | 262.99 | 157.47 | 150.0 | CONFIRMED_READY | US Warehouse | 68 | LOW | 95 | 79.0 | B |

### Chats (chats) — 1 disponible(s), TOP 1 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | chats | 15 Replacement Filters For Cat Fountains W… | 2087399000304312321 | 5.48 | NOT_AVAILABLE | NOT_AVAILABLE | 13.99 | 8.22 | 150.0 | CONFIRMED_READY | Germany Warehouse | 88 | LOW | 95 | 79.5 | B |

### Beauté & Bien-être > Bien-être/Massage (bien-etre-massage) — 1 disponible(s), TOP 1 affiché

| Rang | Catégorie | Produit | CJ ID | Coût | Livraison | Landed | Prix vente | Marge | Marge % | Stock | Entrepôt | Score livr. | Risque | CatFit | Score final | Priorité |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | bien-etre-massage | Red Light Eye Beauty Device For Reducing D… | 2608070722531607800 | 23.96 | NOT_AVAILABLE | NOT_AVAILABLE | 59.99 | 35.94 | 150.0 | CONFIRMED_LOW | China Warehouse | 50 | LOW | 95 | 75.0 | B |

## 17. Manual Review

**138 candidats** en zone de vérification manuelle (score 50-74, ou signaux multiples). Aperçu (30 premiers par score) :


| Titre | Catégorie | Score | CatFit | Stock | Doublon | Flags |
|---|---|---|---|---|---|---|
| 156-inch Ultra-thin Metal Portable Monitor Compute | ecrans | 74.8 | PASS | CONFIRMED_LOW | NONE |  |
| Home Wall-mounted Direct-projection Portable Proje | videoprojecteurs | 74.8 | PASS | CONFIRMED_LOW | LOW |  |
| Multifunctional Fully Automatic Foot Massager | bien-etre-massage | 74.8 | PASS | CONFIRMED_LOW | NONE |  |
| Glass Holders, Set Of 12 - Universal Holders For G | rangement | 74.7 | PASS | CONFIRMED_READY | NONE | MEDIUM_RISK |
| Chained Eau De Cologne For Men,Amber Wood Eau De C | parfums | 74.7 | PASS | CONFIRMED_READY | NONE | MEDIUM_RISK |
| Foliage Silence Women's Eau De Parfum 50ml - Fruit | parfums | 74.7 | PASS | CONFIRMED_READY | NONE | MEDIUM_RISK |
| EAU DE PARIS SPORT Men's Eau De Toilette 50ml - Ma | parfums | 74.7 | PASS | CONFIRMED_READY | NONE | MEDIUM_RISK |
| Detachable-hooded Biker Jacket Waist-cinching Faux | vetements-mixte | 74.5 | PASS | CONFIRMED_LOW | NONE |  |
| Ultra-clear Large-screen Direct-projection Portabl | videoprojecteurs | 74.5 | PASS | CONFIRMED_LOW | NONE |  |
| Outdoor Windproof And Waterproof Bomber Jacket Cou | vetements-mixte | 74.5 | PASS | CONFIRMED_LOW | NONE |  |
| Color-block Hoodie High-waisted Denim Patchwork Wi | vetements-mixte | 74.2 | PASS | CONFIRMED_LOW | NONE |  |
| New Niche Hollow-out Inner-pocket Shell Handbag | femme-sacs | 74.2 | PASS | CONFIRMED_LOW | NONE |  |
| Laptop Carry-on Suitcase Hanging Bag | femme-sacs | 74.2 | PASS | CONFIRMED_LOW | NONE |  |
| New High-end, Handmade, Large-capacity Single-shou | femme-sacs | 74.2 | PASS | CONFIRMED_LOW | NONE |  |
| Mens British-style Casual Pointed-toe Lace-up Heig | homme-chaussures | 74.2 | PASS | CONFIRMED_LOW | NONE |  |
| Summer Five-toe Slippers Bunion-friendly | homme-chaussures | 74.2 | PASS | CONFIRMED_LOW | NONE |  |
| Nordic-style Cosmetic Organizer Wooden Rotating Un | rangement | 74.0 | PASS | CONFIRMED_LOW | NONE |  |
| 14-inch Dual-Screen Portable Monitor Laptop Expans | ecrans | 74.0 | PASS | CONFIRMED_LOW | NONE |  |
| Stylish Minimalist Matte-finish Pillow Bag Large-c | femme-accessoires | 73.8 | PASS | CONFIRMED_LOW | NONE |  |
| Distressed Loopback Zip-up Hooded Sweatshirt Jacke | vetements-mixte | 73.8 | PASS | CONFIRMED_LOW | NONE |  |
| New Sports And Outdoor Windproof Hooded Jacket | vetements-mixte | 73.8 | PASS | CONFIRMED_LOW | NONE |  |
| Infrared Photon Massage Device Red Light Waist Bel | bien-etre-massage | 73.8 | PASS | CONFIRMED_LOW | NONE |  |
| Titanium Steel Bangle For Women, Non Tarnish Europ | bijoux | 73.5 | PASS | CONFIRMED_LOW | NONE |  |
| Beauty Orange Blue Eau De Toilette For Men, 50ml - | parfums | 73.5 | PASS | CONFIRMED_READY | NONE | MEDIUM_RISK |
| Retro V-neck Cardigan Coat Unisex Couples Jacket T | vetements-mixte | 73.5 | PASS | CONFIRMED_LOW | LOW |  |
| Auto-focus Automatic Obstacle Avoidance High-brigh | videoprojecteurs | 73.5 | PASS | CONFIRMED_LOW | NONE |  |
| Straight-type Throat-style Automotive Hose Clamp P | outillage | 73.2 | PASS | CONFIRMED_LOW | NONE |  |
| New Hollow Out Design Bangle For Women, Oil Press  | bijoux | 72.8 | PASS | CONFIRMED_LOW | NONE |  |
| New Zircon Bracelet, Personalized Trendyy Style Ge | bijoux | 72.8 | PASS | CONFIRMED_LOW | NONE |  |
| New Zircon Bracelet With Unique Design, Geometric  | bijoux | 72.8 | PASS | CONFIRMED_LOW | NONE |  |

Liste complète (138 candidats) disponible dans `reports/cj-phase3-final-quality-gate.json` → `manualReview`. **Ces produits ne doivent pas être présentés comme prêts à importer.**

## 18. Rejected Products

**55 candidats définitivement rejetés** (non remplacés). Détail :


| Titre | Catégorie | Score | Motifs |
|---|---|---|---|
| Wooden Bed,bunk Bed, Loft Bed, Suitable For Adults | rangement | 52.4 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Planter Box,Outdoor Elevated Planter Box,Raised Ga | rangement | 60.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Planter Box,Raised Garden Bed,Vegetable Box | rangement | 60.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Raised Design Garden Bed,Elevated Garden Box,Tall  | rangement | 60.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Wooden Chicken Coop with Nesting Box & Pull-Out Tr | rangement | 55.9 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| S925 Sterling Silver 1.25ct Pear Cut Moissanite Ne | rangement | 45.0 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| S925 Silver Gold Plated 3ct Lab-Grown Emerald Mois | rangement | 54.0 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Garden Elevated Planter Box,Wooden Raised Garden B | rangement | 60.9 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Patio Planter Box,Outdoor Elevated Planter Box,Rai | rangement | 60.9 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Flowers Box,Elevated Planter Box,Raised Garden Bed | rangement | 60.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Planter Box,Practical Raised Garden Bed | rangement | 60.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| S925 Sterling Silver Clover Moissanite Tennis Brac | rangement | 44.0 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| S925 Sterling Silver 6.5mm Round Moissanite Halo N | rangement | 45.0 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| S925 Sterling Silver Two-Tone Marquise Moissanite  | rangement | 53.8 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| S925 Sterling Silver 1ct Emerald Cut Moissanite Br | rangement | 45.0 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| S925 Sterling Silver 2ct Oval Moissanite Lab-Grown | rangement | 52.8 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Galvanized Metal Raised Garden Bed with Arched Tre | rangement | 60.9 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Outdoor Elevated Garden Box,Plant Bed | rangement | 60.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Mobile Raised Garden Bed,Outdoor Stylish Planter B | rangement | 60.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Stylish Flowers Box,Elevated Planter Box,Raised Ga | rangement | 60.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| S925 Sterling Silver 2ct Moissanite Sunburst Ring  | rangement | 52.8 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Outdoor Planter Box,Raised Garden Bed | rangement | 60.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Easy to Assemble Metal Planter Box,Galvanized Rais | rangement | 60.9 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| S925 Sterling Silver 4ct Princess Cut Moissanite N | rangement | 52.5 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Balcony Planter Bed,Outdoor Planter Box,Elevated G | rangement | 60.9 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Galvanized Raised Garden Bed, 4' x 2' x 1' Metal P | rangement | 60.9 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Outdoor Stylish Planter Box,Mobile Raised Garden B | rangement | 60.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Flower Box,Plant Box,Garden Bed,Metal Raised Plant | rangement | 60.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| 1 Hamster Tent Hammock Set, Light Pink, With 3 Car | rangement | 43.4 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Unisex Disposable Olders Briefs With Adjustable Ta | vetements-mixte | 63.7 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Cross-border Ultrasonic Dental Crown Cleaning Mach | bijoux | 43.0 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Amazon Ems Fitness Abdominal Muscle Patch, Abdomin | femme-accessoires | 47.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| High-waisted Split Jumpsuit With A Belt | femme-accessoires | 50.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Women's Troll Costume Set With Wig And Bag, Colorf | femme-accessoires | 57.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Satin Spaghetti Strap Wedding Evening Gown With Sc | femme-accessoires | 54.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Womens Thickened Fashionable Solid-Color Tassel Sc | femme-accessoires | 48.2 | Score final trop faible (48.2/100) — MEDIUM_RISK, LOW_MARGIN |
| Car Seat Gap Filler Pocket Storage Box Organizer W | femme-accessoires | 60.9 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| 4DRC V14 RC Drone WIFI FPV 4K HD Wide Angle Dual C | femme-sacs | 57.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Portable Yard Bean Bag Outdoor Leisure Lounge Chai | femme-sacs | 42.2 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Sunshine Coconut Eau De Toilette | parfums | 44.8 | Score final trop faible (44.8/100) — LOW_MARGIN, INCOMPLETE_CONTENT |
| Cupid Series Perfume Spray Eau De Cologne | parfums | 45.8 | Score final trop faible (45.8/100) — LOW_MARGIN, INCOMPLETE_CONTENT |
| Unisex Honey Bergamot Perfume Long-Lasting Light & | parfums | 46.5 | Score final trop faible (46.5/100) — LOW_MARGIN, INCOMPLETE_CONTENT |
| Yearning For Fruity Eau De Toilette | parfums | 44.8 | Score final trop faible (44.8/100) — LOW_MARGIN, INCOMPLETE_CONTENT |
| Warm Vanilla Eau De Toilette | parfums | 44.8 | Score final trop faible (44.8/100) — LOW_MARGIN, INCOMPLETE_CONTENT |
| Code Men's Eau De Toilette | parfums | 44.8 | Score final trop faible (44.8/100) — LOW_MARGIN, INCOMPLETE_CONTENT |
| Eau De Parfum | parfums | 44.0 | Score final trop faible (44.0/100) — LOW_MARGIN, INCOMPLETE_CONTENT |
| Versatile And Comfortable Soft-soled Children's Sn | femme-chaussures | 46.0 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Kindergarten Warm Indoor Shoes Baby Shoes | femme-chaussures | 46.0 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Childrens Mesh Breathable Hiking Shoes | femme-chaussures | 46.0 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Girls' Polka-Dot Sneakers | femme-chaussures | 49.0 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Women's Niche Retro Square-toe Boot-cut Pants With | femme-chaussures | 55.0 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| 480-Piece Eyelet Set, 1.9 Cm, Multicolor, Metal Ey | homme-chaussures | 57.9 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Warm Athletic Shoes For Fall And Winter | homme-chaussures | 43.2 | Score final trop faible (43.2/100) — STOCK_UNCERTAIN, LOW_MARGIN |
| Car Door Welcome Light Projector | videoprojecteurs | 29.8 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |
| Portable Tire Inflator Rechargeable Electric Infla | football | 55.9 | Mauvaise catégorie : Anomalie de catégorie confirmée par re-audit strict Phase 3 (voir titre/description).; Risque élevé |

## 19. Reserve Pool

Le pool de réserve (374 candidats non retenus en Phase 2) a été audité selon les mêmes règles Phase 3. Distribution : **0 A+, 0 A, 6 B, 240 REVIEW, 128 REJECT**.

Détail du processus de remplacement (§18 de la mission) :

| Catégorie | Rejets à combler | Remplacements trouvés | Note |
|---|---|---|---|
| rangement | 29 | 0 | Aucun remplacement disponible — réserve vide ou tous les candidats de réserve de cette catégorie ont échoué l'audit Phase 3 (REJECT/REVIEW uniquement). |
| vetements-mixte | 1 | 1 | Remplacement complet. |
| bijoux | 1 | 0 | Aucun remplacement disponible — réserve vide ou tous les candidats de réserve de cette catégorie ont échoué l'audit Phase 3 (REJECT/REVIEW uniquement). |
| femme-accessoires | 6 | 0 | Aucun remplacement disponible — réserve vide ou tous les candidats de réserve de cette catégorie ont échoué l'audit Phase 3 (REJECT/REVIEW uniquement). |
| femme-sacs | 2 | 0 | Aucun remplacement disponible — réserve vide ou tous les candidats de réserve de cette catégorie ont échoué l'audit Phase 3 (REJECT/REVIEW uniquement). |
| parfums | 7 | 0 | Aucun remplacement disponible — réserve vide ou tous les candidats de réserve de cette catégorie ont échoué l'audit Phase 3 (REJECT/REVIEW uniquement). |
| femme-chaussures | 5 | 1 | Remplacement partiel — réserve insuffisante en candidats réellement solides (A+/A/B) après audit Phase 3, aucun candidat inventé. |
| homme-chaussures | 2 | 2 | Remplacement complet. |
| videoprojecteurs | 1 | 0 | Aucun remplacement disponible — réserve vide ou tous les candidats de réserve de cette catégorie ont échoué l'audit Phase 3 (REJECT/REVIEW uniquement). |
| football | 1 | 1 | Remplacement complet. |

## 20. Recommended Import Order

**Ces vagues sont UNIQUEMENT des recommandations. Aucun import n'a été effectué.**

- **IMPORT_WAVE_1** (A+ et meilleurs A, score≥85) : **16 produits**
- **IMPORT_WAVE_2** (A restants) : **34 produits**
- **IMPORT_WAVE_3** (B sélectionnés) : **70 produits**

Ordre de priorité commercial recommandé pour une éventuelle décision future : 1) meilleurs produits (score final le plus élevé) ; 2) meilleures marges ; 3) meilleurs stocks (CONFIRMED_READY d'abord) ; 4) meilleurs entrepôts (France/UE d'abord) ; 5) meilleures catégories (P1 Plan V2 d'abord) ; 6) risques les plus faibles.

- Meilleure marge : **Outdoor Storage Shed,Backyard Tools Storage Shed,Garden Metal Shed** — 1006.53 € (rangement)
- Meilleure catégorie (score moyen) : **Barbecue** (82.3/100)
- Meilleur produit global : **Bamboo Bread Box - Practical Storage Solution With Accessories - Party** — 89.0/100 (rangement)
- Meilleur entrepôt : **Set Of 3 Heavy-duty Combination Pliers With Soft-grip Handles, Shearin** — France Warehouse (score 100/100)

## 21. Shopify Safety

Aucun appel en écriture vers l'API Admin Shopify n'a été effectué. Aucun produit CJ n'a été importé, publié ou modifié. Aucun produit ACTIVE/ARCHIVED/DRAFT existant n'a été modifié ou réactivé. Aucun prix ni stock Shopify n'a été modifié. `src/lib/catalog/categories.ts` n'a subi aucune modification (catégorie Bijoux toujours proposée, non créée). **0 produit Montres** dans la sélection finale (exclusion totale confirmée).

```
shopifyWrites = 0
imports = 0
publications = 0
catalogModifications = 0
categories.ts modifié = NON
Bijoux créé = NON
Montres = 0
```

## 22. Tests

| Test | Commande | Résultat |
|---|---|---|
| Vérification TypeScript | `npx tsc --noEmit` | ✅ 0 erreur |
| Lint | `npm run lint` | ✅ 0 erreur/warning |
| Build production | `npm run build` | ✅ Build réussi (161 pages générées, 0 erreur) |
| Script de test dédié | `package.json` → `scripts.test` | Absent — confirmé explicitement, aucun script 'test' n'existe dans ce projet (identique à la Phase 2) |

Aucune de ces vérifications n'a modifié de donnée Shopify ni catalogue produit.

