# CJ Candidate Plan — 250 Products

Généré le 12/08/2026 — mission « CONSTRUCTION DU PREMIER LOT DE 250 CANDIDATS CJ DROPSHIPPING ».

**Recherche et qualification uniquement. Aucun import CJ, aucune écriture Shopify.**

---

## 1. Executive Summary

- Appels API CJ réels effectués : 78 recherches + 326 fiches détail + 326 vérifications de stock = **730 appels réels** à l'API CJdropshipping (clé `CJ_API_KEY` du projet).
- Résultats CJ bruts récupérés : **3120** (avant tout filtre)
- Survivants après pré-filtre qualité rapide (`quickPrefilter`) : **2596**
- Survivants après filtre de pertinence/déduplication/anti-contrefaçon/anti-doublon OnDeal : **326**
- Candidats retenus (quota final) : **250 / 250**
- Priorité A : **78** · B : **168** · C : **4**
- Total écarté : **875** (840 hors-catégorie/doublon/marque en amont + 35 pour qualité/stock insuffisants après analyse détaillée)

## 2. Catalogue V2 Reference

- 893 produits ACTIVE analysés en V2 : HIGH 462 · MEDIUM 24 · LOW 407 · sans catégorie 387.
- 4 catégories V2 nouvellement créées : Vêtements mixte/unisexe, Rangement, Vidéoprojecteurs, Bien-être/Massage.
- Comparaison locale de déduplication effectuée contre les **893 produits ACTIVE réels** (fichiers `data/raw-active-products/`), pas d'appel Shopify live.

## 3. CJ Strategy

- **P1** : Catégories à 0 produit ACTIVE mais commercialement intéressantes pour un catalogue généraliste (chaussures femme/homme, accessoires femme/homme, ordinateurs [mini-PC/accessoires], télévisions, outillage, jeux de société, barbecue, football, chats, jeunesse, romans, BD).
- **P2** : Nouvelles catégories validées en V2 ou catégories stratégiques déjà en croissance (Vêtements mixte/unisexe, Rangement, Vidéoprojecteurs, Bien-être/Massage).
- **P3** : Non applicable à cette mission (pas de P3 explicitement demandé dans la répartition initiale) — voir data/cj-category-plan-v2.json pour les catégories P3/P4 de la stratégie globale.
- **Exclu de la priorisation** : Montres

## 4. Category Targets

| Catégorie | Actuels (OnDeal) | Objectif | Retenus | Écart |
|---|---|---|---|---|
| Chaussures femme | 0 | 25 | 20 | 5 |
| Chaussures homme | 0 | 20 | 18 | 2 |
| Accessoires femme | 0 | 20 | 11 | 9 |
| Accessoires homme | 0 | 20 | 20 | 0 |
| Ordinateurs | 0 | 15 | 15 | 0 |
| Télévisions | 0 | 10 | 0 | 10 |
| Outillage | 0 | 15 | 41 | -26 |
| Jeux de société | 0 | 15 | 12 | 3 |
| Barbecue | 0 | 10 | 10 | 0 |
| Football | 0 | 10 | 14 | -4 |
| Chats | 0 | 10 | 7 | 3 |
| Jeunesse | 0 | 10 | 4 | 6 |
| Romans | 0 | 5 | 1 | 4 |
| BD | 0 | 5 | 1 | 4 |
| Mode > Vêtements mixte / unisexe | 29 | 20 | 42 | -22 |
| Maison > Rangement | 8 | 15 | 9 | 6 |
| Électronique > Vidéoprojecteurs | 8 | 10 | 10 | 0 |
| Beauté & Bien-être > Bien-être/Massage | 12 | 15 | 15 | 0 |

## 5. Priority 1 Categories

| Catégorie | Actuels | Objectif | Retenus | Écart |
|---|---|---|---|---|
| Chaussures femme | 0 | 25 | 20 | 5 |
| Chaussures homme | 0 | 20 | 18 | 2 |
| Accessoires femme | 0 | 20 | 11 | 9 |
| Accessoires homme | 0 | 20 | 20 | 0 |
| Ordinateurs | 0 | 15 | 15 | 0 |
| Télévisions | 0 | 10 | 0 | 10 |
| Outillage | 0 | 15 | 41 | -26 |
| Jeux de société | 0 | 15 | 12 | 3 |
| Barbecue | 0 | 10 | 10 | 0 |
| Football | 0 | 10 | 14 | -4 |
| Chats | 0 | 10 | 7 | 3 |
| Jeunesse | 0 | 10 | 4 | 6 |
| Romans | 0 | 5 | 1 | 4 |
| BD | 0 | 5 | 1 | 4 |

## 6. Priority 2 Categories

| Catégorie | Actuels | Objectif | Retenus | Écart |
|---|---|---|---|---|
| Mode > Vêtements mixte / unisexe | 29 | 20 | 42 | -22 |
| Maison > Rangement | 8 | 15 | 9 | 6 |
| Électronique > Vidéoprojecteurs | 8 | 10 | 10 | 0 |
| Beauté & Bien-être > Bien-être/Massage | 12 | 15 | 15 | 0 |

## 7. Candidate Ranking

Les 250 candidats retenus sont classés par score (0-100) — voir liste complète en section 14 (Top 50) et le fichier JSON (`reports/cj-candidate-plan-250.json`) pour les 250.

| Tranche de score | Nombre de candidats |
|---|---|
| 90-99 | 37 |
| 80-89 | 41 |
| 70-79 | 73 |
| 60-69 | 83 |
| 50-59 | 16 |

## 8. Stock & Shipping Analysis

| Statut de stock | Nombre |
|---|---|
| CONFIRMED_READY | 78 |
| CONFIRMED_NOT_READY | 172 |

`CONFIRMED_READY` = stock prêt à expédier confirmé par `getCJVariantStock`/`hasReadyToShipStock` (donnée API réelle). `CONFIRMED_NOT_READY` = stock vérifié mais uniquement en capacité usine (fabrication requise avant expédition). `NOT_CONFIRMED` = vérification impossible (échec API pour ce produit). **Aucun produit en `CONFIRMED_NOT_READY` ou `NOT_CONFIRMED` n'a été classé priorité A**, conformément à la règle de la mission.

Entrepôt confirmé avec stock disponible pour **250/250** candidats retenus (le reste : NOT_AVAILABLE, donnée API non exploitable pour ce produit précis).

## 9. Margin Analysis

- Marge brute estimée moyenne (règle ×2,5 du projet, `computeOndealPrice`) : **20.78€**
- Marge minimale : 1.81€ · Marge maximale : 121.78€
- Candidats sans prix fournisseur exploitable (marge NOT_AVAILABLE) : 0
- **Note importante** : `shippingCost` = NOT_AVAILABLE pour tous les candidats — l'API CJ (`product/list`, `product/query`) n'expose pas de frais de port distinct à ce niveau ; la règle métier du projet (×2,5, voir `src/lib/catalog/pricing.ts`) inclut délibérément la livraison dans le multiplicateur plutôt que de l'exposer séparément.

## 10. Rejected Candidates

Total écarté : **875** (liste complète dans `reports/cj-candidate-plan-250.json`, champ `rejectedCandidates`).

| Étape | Nombre |
|---|---|
| phase2_relevance_dedup_brand | 840 |
| phase4_quality_stock_scoring | 35 |

| Classification | Nombre |
|---|---|
| OUT_OF_CATEGORY | 840 |
| QUALITY_REJECTED | 35 |

### Échantillon représentatif (10 par motif)

**OUT_OF_CATEGORY** :

| Titre | Catégorie | Motif |
|---|---|---|
| Men's And Women's Hollowed-Out Breathable Sneakers | femme-chaussures | Hors périmètre de la catégorie (titre non pertinent après vérification contextuelle) |
| Versatile And Comfortable Soft-soled Children's Sneakers | femme-chaussures | Hors périmètre de la catégorie (titre non pertinent après vérification contextuelle) |
| Knitted Skirt Summer Knitted Camisole Skirt Women's Elegant Sleeveless Short Top Pleated Skirt Suit | femme-chaussures | Hors périmètre de la catégorie (titre non pertinent après vérification contextuelle) |
| Five Pocket Running Shorts Summer Men's And Women's Sports Fitness Yoga Breathable Perspiration Quick-drying Anti-walkin | femme-chaussures | Hors périmètre de la catégorie (titre non pertinent après vérification contextuelle) |
| Cross-Border New European And American Women's Loose Sports Pants Running Training Leggings Pocket Casual Quick-Drying F | femme-chaussures | Hors périmètre de la catégorie (titre non pertinent après vérification contextuelle) |
| 80s Retro Fluorescent Lip Print Off-Shoulder T-Shirt, Off-Shoulder Top, Halloween Women's Wear | femme-chaussures | Hors périmètre de la catégorie (titre non pertinent après vérification contextuelle) |
| Amazon Women's Patch Pocket Pants Cropped Slim-Fit Stretch Yoga Pants Fitness Sports Running Tights | femme-chaussures | Hors périmètre de la catégorie (titre non pertinent après vérification contextuelle) |
| European And American Fashion New Jewelry Exquisite Luxury Flash Diamond Roman Crystal Bracelet Women's Simple Diamond F | femme-chaussures | Hors périmètre de la catégorie (titre non pertinent après vérification contextuelle) |
| Women's Summer V-Neck T-Shirt, Casual Loose Fit Solid Color Short Sleeve Versatile Top | femme-chaussures | Hors périmètre de la catégorie (titre non pertinent après vérification contextuelle) |
| Women's Hoodie Autumn And Winter Padded Hoodie, Women's Zipper Hoodie, Ladies' Jacket Cardigan | femme-chaussures | Hors périmètre de la catégorie (titre non pertinent après vérification contextuelle) |

**QUALITY_REJECTED** :

| Titre | Catégorie | Motif |
|---|---|---|
| 2026 Autumn Winter New Cross Border Trade European And American Women's Fashion Independent Brand Solid Color High Neck  | femme-chaussures | Aucune catégorie Ondeal correspondante identifiée (à classer manuellement); Aucun stock confirmé dans un entrepôt exploi |
| Cross-Border European And American 2026 Amazon Spring And Summer New Women's Casual Loose Fashion Cotton And Linen V-Nec | femme-chaussures | Aucune catégorie Ondeal correspondante identifiée (à classer manuellement); Aucun stock confirmé dans un entrepôt exploi |
| Summer European And American New Women's Clothing Solid Color Casual Suit Cross-Border V-Neck Women's Top Set | femme-chaussures | Aucune catégorie Ondeal correspondante identifiée (à classer manuellement); Aucun stock confirmé dans un entrepôt exploi |
| A-Line Skirt Long  European And American Cross-Border Floral Skirt Autumn And Summer High-End Splicing Women's Umbrella  | femme-chaussures | Aucune catégorie Ondeal correspondante identifiée (à classer manuellement); Aucun stock confirmé dans un entrepôt exploi |
| Men's Fashion Cargo Pants, Loose Fit Outdoor Hiking And Travel Pants For Spring And Autumn | homme-chaussures | Aucune catégorie Ondeal correspondante identifiée (à classer manuellement); Aucun stock confirmé dans un entrepôt exploi |
| Cross-border Amazon New Foreign Trade Autumn And Winter Men's V-neck Pit T-shirt Solid Color Casual Fashion Men's Long S | homme-chaussures | Aucune catégorie Ondeal correspondante identifiée (à classer manuellement); Aucun stock confirmé dans un entrepôt exploi |
| In Stock Amazon Summer New Men's Overalls European And American Independent Station Foreign Trade Drawstring Multi-pocke | homme-chaussures | Aucune catégorie Ondeal correspondante identifiée (à classer manuellement); Aucun stock confirmé dans un entrepôt exploi |
| Cross-Border European And American Men's 3D Printed Casual Round-Neck Long-Sleeved Spring And Autumn Casual Sports T-Shi | homme-chaussures | Aucune catégorie Ondeal correspondante identifiée (à classer manuellement); Aucun stock confirmé dans un entrepôt exploi |
| Women Waffle Hooded Zip Up Cardigan | femme-accessoires | Aucun stock confirmé dans un entrepôt exploitable (France/Europe) |
| Women Solid Cargo Capri Pants Button Waistband With Belt Loops Roll Up Cuff Hem Cropped Trousers | femme-accessoires | Aucune catégorie Ondeal correspondante identifiée (à classer manuellement); Aucun stock confirmé dans un entrepôt exploi |

## 11. Quota Redistributions

| Catégorie source (surplus) | Candidats transférés | Raison |
|---|---|---|
| Outillage | 26 | Surplus de candidats qualifiés (score élevé) au-delà de l'objectif initial de 15 — redistribué vers le quota global de 2 |
| Football | 4 | Surplus de candidats qualifiés (score élevé) au-delà de l'objectif initial de 10 — redistribué vers le quota global de 2 |
| Mode > Vêtements mixte / unisexe | 22 | Surplus de candidats qualifiés (score élevé) au-delà de l'objectif initial de 20 — redistribué vers le quota global de 2 |

## 12. Categories Not Prioritized

Montres (voir section 13). Aucune autre catégorie n'a été volontairement exclue de la recherche — toutes les 18 catégories demandées ont fait l'objet d'une recherche CJ réelle.

## 13. Watches Exclusion

Conformément à la mission : **aucune recherche CJ n'a été effectuée pour la catégorie Montres**, déjà largement représentée (108 produits ACTIVE). Aucune requête, aucun candidat, aucun produit lié aux montres dans ce lot.

## 14. Final Top Candidates — TOP 50

| Rank | Catégorie | Produit | CJ ID | Coût | Livraison | Prix vente est. | Marge est. | Stock | Entrepôt | Score | Priorité | Raison |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Football | 4pcs Football Cheering Horn,World Cup Supporter Horn, Match Day Accessory, Party Favor,  2026 World Cup, World Cup Suppo | 2058713586934145025 | 14.3 | NOT_AVAILABLE | 35.99 | 21.45 | CONFIRMED_READY | US Warehouse | 98 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 2 | Outillage | VEVOR Crimping Tool, 22-10 AWG Ratcheting Wire Crimper Tool, Labor-Saving Electrical Terminal Crimp Pliers With Clear Me | 2069695333556850689 | 11.92 | NOT_AVAILABLE | 29.99 | 17.88 | CONFIRMED_READY | US Warehouse | 96 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 3 | Outillage | Tool Belts For Men,Tool Belt Pouch,26-Pockets Heavy Duty Padded Tools | 2085570814609510401 | 10.99 | NOT_AVAILABLE | 27.99 | 16.48 | CONFIRMED_READY | Britain Warehouse | 96 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 4 | Outillage | Set Of 3 Heavy-duty Combination Pliers With Soft-grip Handles, Shearing Tools, Steel Pliers | 2054763675628249089 | 13.44 | NOT_AVAILABLE | 33.99 | 20.16 | CONFIRMED_READY | France Warehouse | 96 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 5 | Outillage | Straight Throat Type Car Water Pipe Clamp Pliers, Oil Pipe Clamps, Snap Pliers Tools, Red Set | 2082414072732110849 | 43.21 | NOT_AVAILABLE | 108.99 | 64.81 | CONFIRMED_READY | Germany Warehouse | 96 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 6 | Outillage | 17515 Rigid Molle Panels For Vehicles Truck Mount Rack Panel Tactical Seat Back Organizer with 2 Organizer Storage Bag,  | 2079862810078855169 | 81.19 | NOT_AVAILABLE | 202.99 | 121.78 | CONFIRMED_READY | US Warehouse | 96 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 7 | Barbecue | Folding BBQ Charcoal Barbecue Grill Steel Stainless Garden Picnic Camping Stove | 2079769132916797442 | 31.89 | NOT_AVAILABLE | 79.99 | 47.84 | CONFIRMED_READY | Britain Warehouse | 96 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 8 | Barbecue | 14X Stainless Steel BBQ Barbecue Tool Set Outdoor Grilling Utensils Kit Portable | 2084163688004694018 | 19.9 | NOT_AVAILABLE | 49.99 | 29.85 | CONFIRMED_READY | Britain Warehouse | 96 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 9 | Football | 13mm Width Football Pendant Necklace,Number 23 Chain Iced Out Pendant Necklace, 3D Diamond Gold Zinc Alloy Stainless Ste | 2058800217647665153 | 26.7 | NOT_AVAILABLE | 66.99 | 40.05 | CONFIRMED_READY | US Warehouse | 96 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 10 | Football | Steel Pipe Rebound Soccer Football Goal Black,Adjustable Rebounder Net,55.12 X 35.43 X 31.50, For Soccer, Football,Lacro | 2059832481786806273 | 39 | NOT_AVAILABLE | 97.99 | 58.5 | CONFIRMED_READY | US Warehouse | 96 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 11 | Football | 8X5ft Soccer Goal Training Set With Net Buckles Ground Nail Football Sports For Teens & Adults Training | 2059842348901490689 | 55.5 | NOT_AVAILABLE | 138.99 | 83.25 | CONFIRMED_READY | US Warehouse | 96 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 12 | Football | 4 In 1 Football Goal Pop-Up Soccer Goal Football Training Goal Net Carry Bag Kids | 2082406818726936577 | 22.26 | NOT_AVAILABLE | 55.99 | 33.39 | CONFIRMED_READY | Germany Warehouse | 96 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 13 | Chats | UNIVERSAL SPORTS CAT CATALYTIC CONVERTER HIGH FLOW 400 CELL STAINLESS 2 Inch | 2087092546091409409 | 13 | NOT_AVAILABLE | 32.99 | 19.5 | CONFIRMED_READY | Britain Warehouse | 96 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 14 | Accessoires femme | 3in1 Women Shaving Razor, Portable Ladies Multifunctional Shaver With Moisturizing Soap & Spray Bottle, Travel Friendly  | 2087441789850382338 | 13 | NOT_AVAILABLE | 32.99 | 19.5 | CONFIRMED_READY | US Warehouse | 93 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 15 | Outillage | Universal Engine Valve Spring Compressor Tool Valves Removal Pliers Kit 15-330mm | 2087473424792711170 | 21 | NOT_AVAILABLE | 52.99 | 31.5 | CONFIRMED_READY | Britain Warehouse | 93 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 16 | Outillage | Engine Cylinder Head Component Repairing Organiser Valves Standing Tools | 2085677205571690497 | 26 | NOT_AVAILABLE | 64.99 | 39 | CONFIRMED_READY | Britain Warehouse | 93 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 17 | Outillage | 9 Piece Torque Wrench Set 3-230Nm 1 4 3 8 1 2 Drive Calibrated Garage Tools | 2085298465802981377 | 56 | NOT_AVAILABLE | 139.99 | 84 | CONFIRMED_READY | Britain Warehouse | 93 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 18 | Outillage | Wood Splitter Drill Bit Set, 6-Piece Wedge Drill Bit Set In A Storage Box, 32 Mm & 42 Mm Diameter, Professional Forestry | 2084468169263132673 | 13.28 | NOT_AVAILABLE | 33.99 | 19.92 | CONFIRMED_READY | Germany Warehouse | 93 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 19 | Jeux de société | Steel Ladder Toss Game Set, 2 Pack Ladder Ball Rack with 6 Bolas,  Assembly-Free Ladder Toss Includes Scorekeeper | 2084898812666220546 | 54.12 | NOT_AVAILABLE | 135.99 | 81.18 | CONFIRMED_READY | US Warehouse | 93 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 20 | Jeux de société | Golf Chipping Game Mat Set With Target Net Indoor Outdoor Practice Game With Scoreboard | 2082405051535212545 | 19.08 | NOT_AVAILABLE | 47.99 | 28.62 | CONFIRMED_READY | Germany Warehouse | 93 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 21 | Football | Portable Tire Inflator Rechargeable Electric Inflator For Car Bicycle Digital Air Compressor Football Ball Inflator Pump | 2084164078527950850 | 20.9 | NOT_AVAILABLE | 52.99 | 31.35 | CONFIRMED_READY | Britain Warehouse | 93 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 22 | Football | For 05-07 Mercury Mariner Front Bumper Bracket Football Cover Retainer Clip | 2062454671707119618 | 14.3 | NOT_AVAILABLE | 35.99 | 21.45 | CONFIRMED_READY | US Warehouse | 93 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 23 | Football | 8x5 ft Soccer Goal for Backyard, Portable Soccer Net and Steel Weatherproof Frame Folding Goal for Adults Youth Outdoor  | 2084898863937392641 | 50.08 | NOT_AVAILABLE | 125.99 | 75.12 | CONFIRMED_READY | US Warehouse | 93 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 24 | Outillage | 3-piece Fishing Fish Killer Set 24.5 Cm Aluminum Fish Killer Includes Fishing Pliers And Hook Remover Fishing Accessorie | 2074743488482361346 | 6.72 | NOT_AVAILABLE | 16.99 | 10.08 | CONFIRMED_READY | Germany Warehouse | 91 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 25 | Outillage | Screwdriver Holder Wall Mounted Screwdriver Pliers Organizer Garage Storage-Rack | 2077407430399004673 | 9.9 | NOT_AVAILABLE | 24.99 | 14.85 | CONFIRMED_READY | Britain Warehouse | 91 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 26 | Outillage | 5-Piece Jewelry Pliers Set With Storage Pouch, Professional Jewelry Tools For Fine Work, Versatile Pliers Set For Creati | 2074404938479984642 | 6.84 | NOT_AVAILABLE | 17.99 | 10.26 | CONFIRMED_READY | Germany Warehouse | 91 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 27 | Barbecue | Outdoor Camping Butane Gas Stove Portable Single Burner Hob BBQ Picnic Cooker UK | 2076931983456194562 | 16.42 | NOT_AVAILABLE | 41.99 | 24.63 | CONFIRMED_READY | Britain Warehouse | 91 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 28 | Football | Basketball Ball Storage Rack Football Volleyball Basket Stand Holder Organizer | 2060980584477249537 | 9.9 | NOT_AVAILABLE | 24.99 | 14.85 | CONFIRMED_READY | Britain Warehouse | 91 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 29 | Football | 2 Balls Random Colours,Disposable Raincoat Adults Hood Poncho Ball Rain Coat Waterproof,World Cup Portable Raincoat For  | 2059150392405020674 | 9.5 | NOT_AVAILABLE | 23.99 | 14.25 | CONFIRMED_READY | US Warehouse | 91 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 30 | Maison > Rangement | White Wardrobe Drawer Organizers, Stackable Storage Boxes For Wardrobes, Two Sizes | 2087453096787996673 | 13.34 | NOT_AVAILABLE | 33.99 | 20.01 | CONFIRMED_READY | Germany Warehouse | 91 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 31 | Maison > Rangement | Hair Dryer Bracket No Drilling Wall Mount Blow Dryer Hanger Rack Organizer For Bathroom Bedroom | 2086667283638968321 | 29.34 | NOT_AVAILABLE | 73.99 | 44.01 | CONFIRMED_READY | US Warehouse | 91 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 32 | Maison > Rangement | Rattan-front Shoe Cabinet With 1 Drawer And 2 Flip-down Compartments, Particleboard, 54x24x110cm, White | 2086730654934884354 | 52.28 | NOT_AVAILABLE | 130.99 | 78.42 | CONFIRMED_READY | US Warehouse | 91 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 33 | Électronique > Vidéoprojecteurs | Projector HD For Home Theater Office 360 Degree Rotatable PTZ Portable Mini HY320 AU Plug 110‑220V Black | 2069714608557056002 | 52.8 | NOT_AVAILABLE | 131.99 | 79.2 | CONFIRMED_READY | US Warehouse | 91 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 34 | Électronique > Vidéoprojecteurs | 1pc Portable Foldable NOn Crease White Projector Curtain Projection Screen 4:3 (100inch) | 2078067707086135298 | 14.05 | NOT_AVAILABLE | 35.99 | 21.08 | CONFIRMED_READY | US Warehouse | 91 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 35 | Électronique > Vidéoprojecteurs | 3D Hologram Fan 16.5in 2000x224 WiFi 3D Projector With 224 LED Light Beads For Business Store Advertising 100‑240V US Pl | 2078065307112804354 | 31.37 | NOT_AVAILABLE | 78.99 | 47.05 | CONFIRMED_READY | US Warehouse | 91 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 36 | Ordinateurs | Turn Signal S Witch For 2001-2005 BMW 325i With Trip Computer Controls | 2087377049840910337 | 45.42 | NOT_AVAILABLE | 113.99 | 68.13 | CONFIRMED_READY | US Warehouse | 90 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 37 | Ordinateurs | 1-Piece 5-Tier Jewelry Organizer With 108 Earring Holes, Necklace Rack & Ring/Bracelet Holders - Desktop Storage Stand F | 2087398078761418753 | 11.14 | NOT_AVAILABLE | 27.99 | 16.71 | CONFIRMED_READY | Germany Warehouse | 90 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 38 | Maison > Rangement | 601-Piece Writing Set, Organizer Set With Sticky Notes, Pens, Highlighters, Correction Rolls, And Labels For Office & Sc | 2085183217114599426 | 8.82 | NOT_AVAILABLE | 22.99 | 13.23 | CONFIRMED_READY | Germany Warehouse | 89 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 39 | Accessoires homme | Valentine's Day Gifts For Her And Him, Anniversary Gifts For Her, “I Love You” Gifts For Women And Men, Personalized Pen | 2086666836790628354 | 8.26 | NOT_AVAILABLE | 20.99 | 12.39 | CONFIRMED_READY | Germany Warehouse | 88 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 40 | Outillage | 1x Automobile Dent Repair Wheel Arch Car Body Line Marking Tools Range 0cm-20cm | 2087075111598833666 | 8 | NOT_AVAILABLE | 19.99 | 12 | CONFIRMED_READY | Britain Warehouse | 88 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 41 | Outillage | 5-Piece Shoe Brush Set For Effective Shoe Care And Cleaning - Versatile Hand-Held Brush Tools | 2087011765069926402 | 5.74 | NOT_AVAILABLE | 14.99 | 8.61 | CONFIRMED_READY | Germany Warehouse | 88 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 42 | Outillage | 3x Electrical Connector Disconnect Pliers For Cars Automotive Plug Removal Plier | 2086024110275473410 | 9 | NOT_AVAILABLE | 22.99 | 13.5 | CONFIRMED_READY | Britain Warehouse | 88 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 43 | Jeux de société | 66 Cm Easter Animal Dartboard, Velcro Dart Game, Double-Sided Velcro Ball Game With 6 Sticky Balls, 6 Darts, Throwing Ga | 2086666076371701761 | 6.26 | NOT_AVAILABLE | 15.99 | 9.39 | CONFIRMED_READY | Germany Warehouse | 88 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 44 | Jeux de société | Magnetic Maze Game (includes Magnetic Pen), A Creative Puzzle Game For Adults That Helps Improve Concentration – Party G | 2086667215999774722 | 9.25 | NOT_AVAILABLE | 23.99 | 13.88 | CONFIRMED_READY | Germany Warehouse | 88 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 45 | Jeux de société | Wedding Heart Cutout 200 X 180 Cm Wedding Arch With 2 Scissors Bed Sheet With Heart Wedding Game Wedding Banner Love Pho | 2085559410689216513 | 6.98 | NOT_AVAILABLE | 17.99 | 10.47 | CONFIRMED_READY | Germany Warehouse | 88 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 46 | Jeux de société | Party Gifts----Engineer Forklift Transport Game | 2083077713946198017 | 9.32 | NOT_AVAILABLE | 23.99 | 13.98 | CONFIRMED_READY | Germany Warehouse | 88 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 47 | Jeux de société | Halloween Spider Web Dartboard, Halloween Velcro Ball Game, 66 Cm Double-Sided Dart Game, Foldable Bat Throwing Game, In | 2083077268838674434 | 6.14 | NOT_AVAILABLE | 15.99 | 9.21 | CONFIRMED_READY | Germany Warehouse | 88 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 48 | Jeux de société | Rainbow Swing Towel, 2.4m Colorful Parachute With 12 Balls And 12 Handles—Parachute Game, Cooperative Movement Game, Spo | 2082672957191897090 | 9.45 | NOT_AVAILABLE | 23.99 | 14.17 | CONFIRMED_READY | Germany Warehouse | 88 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 49 | Jeux de société | Throwing Game For Parties With A Banner, 3 Bags, And A 6-meter Rope - Fun Group Activity, Event, And Party Supplies | 2080135273875820546 | 5.36 | NOT_AVAILABLE | 13.99 | 8.04 | CONFIRMED_READY | Germany Warehouse | 88 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |
| 50 | Chats | 15 Replacement Filters For Cat Fountains With Sponge Filters (9.6 X 5.8 Cm) - Party Supplies Set | 2087399000304312321 | 5.48 | NOT_AVAILABLE | 13.99 | 8.22 | CONFIRMED_READY | Germany Warehouse | 88 | A | +20 pertinence catégorie (validée en amont, hors-sujet déjà écartés) ; +15 stock confirmé prêt-à-expédier (API réelle) ; |

## 15. Safety Checks

```
shopifyWrites : 0
productsImported : 0
productsPublished : 0
pricesModified : 0
stockModified : 0
variantsModified : 0
imagesModified : 0
tagsModified : 0
statusesModified : 0
archivedTouched : 0
draftReactivated : 0
```

## 16. Validation

- [x] Maximum 250 candidats retenus : OUI (250)
- [x] Objectif de 250 atteint : OUI (redistribution documentée section 11)
- [x] Aucun doublon CJ (pid) dans la sélection finale : OUI (dédoublonnage par pid en phase 2)
- [x] Aucun doublon évident avec OnDeal (similarité titre ≥85%) dans la sélection finale : OUI (exclus en phase 2, voir rejectedCandidates classification=DUPLICATE)
- [x] Aucun produit hors catégorie dans la sélection finale : OUI (filtre de pertinence phase 2)
- [x] Aucun produit inventé : OUI — toutes les données proviennent d'appels réels à l'API CJ (clé CJ_API_KEY du projet)
- [x] Aucun produit sans identification CJ (pid réel) : OUI
- [x] Stock vérifié lorsque possible : OUI (326/326 candidats analysés, appel réel getCJVariantStock)
- [x] Livraison vérifiée lorsque possible : PARTIEL (entrepôt réel quand stock confirmé ; NOT_AVAILABLE sinon, aucune donnée inventée)
- [x] Marge calculée lorsque possible : OUI (computeOndealPrice réel, ×2,5)
- [x] Score présent : OUI (0-100, explicable, voir reason/scoreNotes)
- [x] Priorité présente : OUI (A/B/C/REJECTED)
- [x] Raisons présentes : OUI
- [x] Catégories respectées : OUI (taxonomie V2 existante, aucune création)
- [x] Montres exclues de la priorité : OUI (aucune recherche)
- [x] Aucun import CJ : OUI
- [x] Aucun write Shopify : OUI
- [x] Aucun produit publié : OUI
- [x] Aucun prix modifié : OUI
- [x] Aucun stock modifié : OUI
- [x] Aucun statut modifié : OUI
- [x] Aucun tag Shopify ajouté : OUI
- [x] ARCHIVED intouchables : OUI (jamais consultés ni modifiés)
- [x] DRAFT intouchables : OUI (jamais consultés ni modifiés)

## Annexe — TOP 10 par catégorie

Conformément à la mission : affiché uniquement pour les catégories ayant au moins 10 candidats valides retenus. Les catégories avec moins de 10 candidats affichent leur liste complète sans compléter artificiellement.

### Accessoires femme — TOP 10 (sur 11 retenus)

| Rank | Produit | CJ ID | Score | Priorité | Stock | Prix vente est. | Marge est. |
|---|---|---|---|---|---|---|---|
| 14 | 3in1 Women Shaving Razor, Portable Ladies Multifunctional Shaver With Moisturizing Soap & Spray Bottle, Travel Friendly  | 2087441789850382338 | 93 | A | CONFIRMED_READY | 32.99 | 19.5 |
| 69 | “You Can Do It” Gift, Encouraging Gift – Acrylic Good Luck Charm Decoration For Times Of Illness And Challenges, Uplifti | 2087395728973684737 | 83 | A | CONFIRMED_READY | 11.99 | 6.86 |
| 79 | Fitted-waist Single-breasted Multi-button Top And Trousers Set For Women | 2608120554151630000 | 78 | B | CONFIRMED_NOT_READY | 33.99 | 20.05 |
| 80 | Stylish Minimalist Matte-finish Pillow Bag Large-capacity Commuter Tote For Women | 2608120939381620900 | 78 | B | CONFIRMED_NOT_READY | 49.99 | 29.95 |
| 81 | Summer Yellow Puff-sleeve Dress For Women | 2608120638431634600 | 78 | B | CONFIRMED_NOT_READY | 64.99 | 38.8 |
| 82 | Retro Handmade Sequin Dress For Women | 2608120150411617900 | 78 | B | CONFIRMED_NOT_READY | 26.99 | 15.63 |
| 85 | Exquisitely Beautiful Elegant Waist-cinching And Figure-flattering Long Dress For Women | 2608120639081633700 | 75 | B | CONFIRMED_NOT_READY | 37.99 | 22.74 |
| 86 | Three-dimensional Floral Patchwork Slimming Denim Skirt For Women | 2608120507591636500 | 75 | B | CONFIRMED_NOT_READY | 31.99 | 19.0 |
| 97 | Polka-dot Dress For Women Summer Long Style With A Fitted Waist | 2608120740351635500 | 73 | B | CONFIRMED_NOT_READY | 20.99 | 12.5 |
| 98 | UV-protective Driving Glasses For Men And Women | 2608120207041624400 | 73 | B | CONFIRMED_NOT_READY | 16.99 | 9.9 |

### Accessoires homme — TOP 10 (sur 20 retenus)

| Rank | Produit | CJ ID | Score | Priorité | Stock | Prix vente est. | Marge est. |
|---|---|---|---|---|---|---|---|
| 39 | Valentine's Day Gifts For Her And Him, Anniversary Gifts For Her, “I Love You” Gifts For Women And Men, Personalized Pen | 2086666836790628354 | 88 | A | CONFIRMED_READY | 20.99 | 12.39 |
| 70 | 60 Inflatable Picture Frames, “Happy Birthday” Selfie Frame, Black Photo Frame, 60th Photo Booth, Birthday Decorations F | 2086664585210671105 | 83 | A | CONFIRMED_READY | 10.99 | 6.54 |
| 83 | Retro Washed Jacket For Men And Women | 2608110437111614900 | 78 | B | CONFIRMED_NOT_READY | 39.99 | 23.96 |
| 87 | Outdoor Vest For Women Hiking, Mountaineering, Fishing, Stand-Up Collar For Men, Quick-Drying, Volunteer Work, Camping S | 2087469607519703042 | 75 | B | CONFIRMED_NOT_READY | 25.99 | 15.46 |
| 88 | Retro Short-sleeve Summer T-shirt For Men | 2608111136311608400 | 75 | B | CONFIRMED_NOT_READY | 32.99 | 19.79 |
| 89 | Casual American-style Retro Pure Cotton Workwear Pants Wide-leg For Men | 2608110039451602200 | 75 | B | CONFIRMED_NOT_READY | 32.99 | 19.79 |
| 99 | Retro Loose Bootcut Wide-leg Denim Jeans For Men | 2608100252431602900 | 73 | B | CONFIRMED_NOT_READY | 23.99 | 14.07 |
| 100 | Outdoor Sports Tops For Men And Women | 2608100750291621300 | 73 | B | CONFIRMED_NOT_READY | 19.99 | 11.46 |
| 101 | Lightweight Quick Dry Long Sleeve Crew Neck Shirts For Men, Breathable Athletic Tee For Fitness, Running, Travel, Hiking | 2087207194819031041 | 73 | B | CONFIRMED_NOT_READY | 24.99 | 14.98 |
| 102 | Waterproof Jacket For Men And Women | 2608101109531618900 | 73 | B | CONFIRMED_NOT_READY | 20.99 | 12.5 |

### BD — 1 candidat(s) retenu(s) (< 10, liste complète, pas de TOP 10)

| Rank | Produit | CJ ID | Score | Priorité | Stock |
|---|---|---|---|---|---|
| 234 | Narrow-plate Comic-style False Eyelashesno Brushing Required | 2607300112251638500 | 60 | B | CONFIRMED_NOT_READY |

### Barbecue — TOP 10 (sur 10 retenus)

| Rank | Produit | CJ ID | Score | Priorité | Stock | Prix vente est. | Marge est. |
|---|---|---|---|---|---|---|---|
| 7 | Folding BBQ Charcoal Barbecue Grill Steel Stainless Garden Picnic Camping Stove | 2079769132916797442 | 96 | A | CONFIRMED_READY | 79.99 | 47.84 |
| 8 | 14X Stainless Steel BBQ Barbecue Tool Set Outdoor Grilling Utensils Kit Portable | 2084163688004694018 | 96 | A | CONFIRMED_READY | 49.99 | 29.85 |
| 27 | Outdoor Camping Butane Gas Stove Portable Single Burner Hob BBQ Picnic Cooker UK | 2076931983456194562 | 91 | A | CONFIRMED_READY | 41.99 | 24.63 |
| 103 | Large Barbecue Grill Portable Folding BBQ Rack For Outdoor Use | 2607260656111610700 | 73 | B | CONFIRMED_NOT_READY | 34.99 | 20.52 |
| 104 | People Use Camping Charcoal Barbecue Ovens. | 2608071251421605500 | 73 | B | CONFIRMED_NOT_READY | 82.99 | 49.48 |
| 196 | Stainless Steel Frying Spatula Set BBQ Tools | 2607180010031618700 | 66 | B | CONFIRMED_NOT_READY | 6.99 | 3.63 |
| 197 | Outdoor Folding Barbecue Grill With A Built-in Tool Box | 2608110935001604500 | 66 | B | CONFIRMED_NOT_READY | 15.99 | 9.12 |
| 211 | Cross-border Bear Claw Meat Shredder, Stainless Steel Bear Claw Chicken Shredder, BBQ Meat Shredder, Cooked Food, Turkey | 2075853920058511361 | 63 | B | CONFIRMED_NOT_READY | 11.99 | 6.87 |
| 249 | Grill And Frying Pan Cleaner | 2607301149051637900 | 54 | C | CONFIRMED_NOT_READY | 4.99 | 2.7 |
| 250 | Grill Cleaning Degreasing Agent | 2607180419041616600 | 54 | C | CONFIRMED_NOT_READY | 4.99 | 2.7 |

### Beauté & Bien-être > Bien-être/Massage — TOP 10 (sur 15 retenus)

| Rank | Produit | CJ ID | Score | Priorité | Stock | Prix vente est. | Marge est. |
|---|---|---|---|---|---|---|---|
| 137 | Red Light Eye Beauty Device For Reducing Dark Circles And Puffiness Eye Massager | 2608070722531607800 | 71 | B | CONFIRMED_NOT_READY | 59.99 | 35.94 |
| 138 | Multifunctional Fully Automatic Foot Massager | 2608081007511632200 | 71 | B | CONFIRMED_NOT_READY | 103.99 | 61.98 |
| 150 | Infrared Photon Massage Device Red Light Waist Belt | 2608050203141636200 | 70 | B | CONFIRMED_NOT_READY | 33.99 | 19.92 |
| 166 | Slim Silicone Vibrating Massager With Multiple Modes - Portable Personal Wellness Device | 2085645142578585602 | 68 | B | CONFIRMED_NOT_READY | 19.99 | 12 |
| 167 | Multi-Setting Timer-Activated Hand And Elbow Massager | 2608070539131608200 | 68 | B | CONFIRMED_NOT_READY | 33.99 | 20.31 |
| 199 | Male Training Device With Vibration Massage Function & Sensitivity Reduction Electric Trainer | 2085647998846164994 | 66 | B | CONFIRMED_NOT_READY | 19.99 | 11.55 |
| 216 | Cross Border Hot Selling Charging Model Kneading Breast Massager Breast Massager Breast Constant Temperature Hot Compres | 2087087552369844225 | 63 | B | CONFIRMED_NOT_READY | 15.99 | 9.02 |
| 217 | Silicone Couples Massager Ring With Vibration And Flexible Design | 2085269049511043074 | 63 | B | CONFIRMED_NOT_READY | 16.99 | 9.75 |
| 225 | Red Sleep-Improving Therapy Lamp Meditation Relaxation LED Night Light | 2608060318261635800 | 62 | B | CONFIRMED_NOT_READY | 19.99 | 11.56 |
| 240 | Body Nourishing Massage Oil 1 0 0 Ml-box | 2085643117322231809 | 58 | B | CONFIRMED_NOT_READY | 6.99 | 3.65 |

### Chats — 7 candidat(s) retenu(s) (< 10, liste complète, pas de TOP 10)

| Rank | Produit | CJ ID | Score | Priorité | Stock |
|---|---|---|---|---|---|
| 13 | UNIVERSAL SPORTS CAT CATALYTIC CONVERTER HIGH FLOW 400 CELL STAINLESS 2 Inch | 2087092546091409409 | 96 | A | CONFIRMED_READY |
| 50 | 15 Replacement Filters For Cat Fountains With Sponge Filters (9.6 X 5.8 Cm) - Party Supplies Set | 2087399000304312321 | 88 | A | CONFIRMED_READY |
| 71 | MS RAINBOW AURORA CAT EYE GEL 01 12ML Lake Blue Shimmer Crystal Cat Eye UV Nail Gel Easy Magnetic Attraction DIY Manicur | 2087421956313112578 | 83 | A | CONFIRMED_READY |
| 161 | Cat Standing Bamboo Hemp Cat Scratch Post | 2608110707361607500 | 68 | B | CONFIRMED_NOT_READY |
| 212 | Four-Season Universal Double-Layer Felt Cat Tunnel Bed | 2608110851491603900 | 63 | B | CONFIRMED_NOT_READY |
| 213 | Multi-layered Cat Cave Bed Suitable For All Seasons | 2608110647141623400 | 63 | B | CONFIRMED_NOT_READY |
| 239 | Outdoor Cat Deterrent Spray To Prevent Scratching And Biting | 2608120419111633300 | 58 | B | CONFIRMED_NOT_READY |

### Chaussures femme — TOP 10 (sur 20 retenus)

| Rank | Produit | CJ ID | Score | Priorité | Stock | Prix vente est. | Marge est. |
|---|---|---|---|---|---|---|---|
| 91 | Women's High-neck Coat With Horn-button Closure | 2608120939291638400 | 74 | B | CONFIRMED_NOT_READY | 138.99 | 83.34 |
| 92 | Women's High-end Color Suit Jacket For Petite Figures | 2608120746211629100 | 74 | B | CONFIRMED_NOT_READY | 31.99 | 18.75 |
| 93 | Women's Double-layered Waist-cinching Dress | 2608110913011619700 | 74 | B | CONFIRMED_NOT_READY | 54.99 | 32.55 |
| 123 | New Style Simple Large-Capacity Casual Backpack, Versatile Women's Backpack, Denim Travel Bag, Multi-Functional School B | 2087375965803528193 | 72 | B | CONFIRMED_NOT_READY | 73.99 | 43.94 |
| 129 | Women's Waist Tight Tummy Hiding Slimming Gentle Dress | 2608120527521613100 | 71 | B | CONFIRMED_NOT_READY | 30.99 | 18.2 |
| 152 | Autumn New Cross-Border Women's Fashion Temperament Long-Sleeved Suit Straight-Leg Pants Suit | 2087384806737854465 | 69 | B | CONFIRMED_NOT_READY | 42.99 | 25.58 |
| 153 | Relaxed-fit Casual Office Wear Elegant Two Piece Suit For Women | 2608120356251608900 | 69 | B | CONFIRMED_NOT_READY | 19.99 | 11.71 |
| 154 | Fashionable And Minimalist Chunky-heel Sandals For Women | 2608110933341602000 | 69 | B | CONFIRMED_NOT_READY | 16.99 | 9.93 |
| 193 | Women's Batwing-sleeve V-neck French-style Split Dress | 2608110859411627000 | 66 | B | CONFIRMED_NOT_READY | 14.99 | 8.65 |
| 204 | 2026 European And American Amazon Cross-Border Autum Work Clothing Double-Breasted Shawl Cape Pure Color Suit Dress Wome | 2087438799789780993 | 64 | B | CONFIRMED_NOT_READY | 16.99 | 9.86 |

### Chaussures homme — TOP 10 (sur 18 retenus)

| Rank | Produit | CJ ID | Score | Priorité | Stock | Prix vente est. | Marge est. |
|---|---|---|---|---|---|---|---|
| 94 | Men's Thick-soled Height-increasing Sports And Casual Shoes | 2608110532491630600 | 74 | B | CONFIRMED_NOT_READY | 76.99 | 45.8 |
| 95 | Men's Casual Shoes Outdoor Breathable Trendy Soft | 2608111116401631500 | 74 | B | CONFIRMED_NOT_READY | 25.99 | 15.18 |
| 96 | Men's Crew Neck Long Sleeve T-Shirt, High Stretch Seamless Functional Base Layer Top, Versatile Athletic Undershirt For  | 2087210965575155714 | 74 | B | CONFIRMED_NOT_READY | 31.99 | 18.75 |
| 124 | Leather Men's Computer Backpack, Leather Large Capacity Men's Business Travel Bag, Cowhide Backpack | 2087374638180261890 | 72 | B | CONFIRMED_NOT_READY | 139.99 | 83.45 |
| 125 | New Outdoor Travel Backpack Men's Backpack Genuine Leather Men's Bag Business Leisure Crazy Horse Leather Backpack | 2087371311236120577 | 72 | B | CONFIRMED_NOT_READY | 127.99 | 76.47 |
| 126 | First-Layer Cowhide Retro Genuine Leather Chest Bag, Simple And High-End Men's Casual Crossbody Bag, Multi-Functional Ba | 2087108579623755778 | 72 | B | CONFIRMED_NOT_READY | 42.99 | 25.34 |
| 130 | Men's Vintage Washed Zip Up Hoodie Oversized Drop Shoulder Design | 2608120356571632300 | 71 | B | CONFIRMED_NOT_READY | 29.99 | 17.71 |
| 155 | Men's Fashionable V-Neck Contrasting Color Casual All-Match Vest | 2608110356141620400 | 69 | B | CONFIRMED_NOT_READY | 17.99 | 10.41 |
| 191 | Men's High-End Brand Custom Suede Fleece Baseball Cap With 3D Embroidered Logo, CE Certified | 2608110929301625100 | 67 | B | CONFIRMED_NOT_READY | 16.99 | 9.9 |
| 194 | Men's Denim Casual Fashion Wide Leg Pants | 2608110512401635300 | 66 | B | CONFIRMED_NOT_READY | 18.99 | 10.94 |

### Football — TOP 10 (sur 14 retenus)

| Rank | Produit | CJ ID | Score | Priorité | Stock | Prix vente est. | Marge est. |
|---|---|---|---|---|---|---|---|
| 1 | 4pcs Football Cheering Horn,World Cup Supporter Horn, Match Day Accessory, Party Favor,  2026 World Cup, World Cup Suppo | 2058713586934145025 | 98 | A | CONFIRMED_READY | 35.99 | 21.45 |
| 9 | 13mm Width Football Pendant Necklace,Number 23 Chain Iced Out Pendant Necklace, 3D Diamond Gold Zinc Alloy Stainless Ste | 2058800217647665153 | 96 | A | CONFIRMED_READY | 66.99 | 40.05 |
| 10 | Steel Pipe Rebound Soccer Football Goal Black,Adjustable Rebounder Net,55.12 X 35.43 X 31.50, For Soccer, Football,Lacro | 2059832481786806273 | 96 | A | CONFIRMED_READY | 97.99 | 58.5 |
| 11 | 8X5ft Soccer Goal Training Set With Net Buckles Ground Nail Football Sports For Teens & Adults Training | 2059842348901490689 | 96 | A | CONFIRMED_READY | 138.99 | 83.25 |
| 12 | 4 In 1 Football Goal Pop-Up Soccer Goal Football Training Goal Net Carry Bag Kids | 2082406818726936577 | 96 | A | CONFIRMED_READY | 55.99 | 33.39 |
| 21 | Portable Tire Inflator Rechargeable Electric Inflator For Car Bicycle Digital Air Compressor Football Ball Inflator Pump | 2084164078527950850 | 93 | A | CONFIRMED_READY | 52.99 | 31.35 |
| 22 | For 05-07 Mercury Mariner Front Bumper Bracket Football Cover Retainer Clip | 2062454671707119618 | 93 | A | CONFIRMED_READY | 35.99 | 21.45 |
| 23 | 8x5 ft Soccer Goal for Backyard, Portable Soccer Net and Steel Weatherproof Frame Folding Goal for Adults Youth Outdoor  | 2084898863937392641 | 93 | A | CONFIRMED_READY | 125.99 | 75.12 |
| 28 | Basketball Ball Storage Rack Football Volleyball Basket Stand Holder Organizer | 2060980584477249537 | 91 | A | CONFIRMED_READY | 24.99 | 14.85 |
| 29 | 2 Balls Random Colours,Disposable Raincoat Adults Hood Poncho Ball Rain Coat Waterproof,World Cup Portable Raincoat For  | 2059150392405020674 | 91 | A | CONFIRMED_READY | 23.99 | 14.25 |

### Jeunesse — 4 candidat(s) retenu(s) (< 10, liste complète, pas de TOP 10)

| Rank | Produit | CJ ID | Score | Priorité | Stock |
|---|---|---|---|---|---|
| 51 | Magic Cottage + Pumpkin House Coloring Book, 2-piece Coloring Book Set For Adults, Suitable For Adults, Single-sided Col | 2087397042120949761 | 88 | A | CONFIRMED_READY |
| 52 | 3-piece Coloring Book Set Featuring Three Different Themes: Garden Flowers, A Castle, And Flowers In A Vase. DIY Colorin | 2087395940658970625 | 88 | A | CONFIRMED_READY |
| 53 | Set Of 15 Animal Picture Books Featuring Various Animals, For Learning Activities And As A Gift Idea Or Party Accessory  | 2087012166355902465 | 88 | A | CONFIRMED_READY |
| 233 | Animal Simple-Style Coloring Book For Kids | 2608100254161619500 | 60 | B | CONFIRMED_NOT_READY |

### Jeux de société — TOP 10 (sur 12 retenus)

| Rank | Produit | CJ ID | Score | Priorité | Stock | Prix vente est. | Marge est. |
|---|---|---|---|---|---|---|---|
| 19 | Steel Ladder Toss Game Set, 2 Pack Ladder Ball Rack with 6 Bolas,  Assembly-Free Ladder Toss Includes Scorekeeper | 2084898812666220546 | 93 | A | CONFIRMED_READY | 135.99 | 81.18 |
| 20 | Golf Chipping Game Mat Set With Target Net Indoor Outdoor Practice Game With Scoreboard | 2082405051535212545 | 93 | A | CONFIRMED_READY | 47.99 | 28.62 |
| 43 | 66 Cm Easter Animal Dartboard, Velcro Dart Game, Double-Sided Velcro Ball Game With 6 Sticky Balls, 6 Darts, Throwing Ga | 2086666076371701761 | 88 | A | CONFIRMED_READY | 15.99 | 9.39 |
| 44 | Magnetic Maze Game (includes Magnetic Pen), A Creative Puzzle Game For Adults That Helps Improve Concentration – Party G | 2086667215999774722 | 88 | A | CONFIRMED_READY | 23.99 | 13.88 |
| 45 | Wedding Heart Cutout 200 X 180 Cm Wedding Arch With 2 Scissors Bed Sheet With Heart Wedding Game Wedding Banner Love Pho | 2085559410689216513 | 88 | A | CONFIRMED_READY | 17.99 | 10.47 |
| 46 | Party Gifts----Engineer Forklift Transport Game | 2083077713946198017 | 88 | A | CONFIRMED_READY | 23.99 | 13.98 |
| 47 | Halloween Spider Web Dartboard, Halloween Velcro Ball Game, 66 Cm Double-Sided Dart Game, Foldable Bat Throwing Game, In | 2083077268838674434 | 88 | A | CONFIRMED_READY | 15.99 | 9.21 |
| 48 | Rainbow Swing Towel, 2.4m Colorful Parachute With 12 Balls And 12 Handles—Parachute Game, Cooperative Movement Game, Spo | 2082672957191897090 | 88 | A | CONFIRMED_READY | 23.99 | 14.17 |
| 49 | Throwing Game For Parties With A Banner, 3 Bags, And A 6-meter Rope - Fun Group Activity, Event, And Party Supplies | 2080135273875820546 | 88 | A | CONFIRMED_READY | 13.99 | 8.04 |
| 131 | The Manufacturer's PS4 Game Controller Features A Six-axis Gyroscope With Dual Vibration Motion Sensing, A PC Computer,  | 2080470750906601474 | 71 | B | CONFIRMED_NOT_READY | 23.99 | 14.17 |

### Maison > Rangement — 9 candidat(s) retenu(s) (< 10, liste complète, pas de TOP 10)

| Rank | Produit | CJ ID | Score | Priorité | Stock |
|---|---|---|---|---|---|
| 30 | White Wardrobe Drawer Organizers, Stackable Storage Boxes For Wardrobes, Two Sizes | 2087453096787996673 | 91 | A | CONFIRMED_READY |
| 31 | Hair Dryer Bracket No Drilling Wall Mount Blow Dryer Hanger Rack Organizer For Bathroom Bedroom | 2086667283638968321 | 91 | A | CONFIRMED_READY |
| 32 | Rattan-front Shoe Cabinet With 1 Drawer And 2 Flip-down Compartments, Particleboard, 54x24x110cm, White | 2086730654934884354 | 91 | A | CONFIRMED_READY |
| 38 | 601-Piece Writing Set, Organizer Set With Sticky Notes, Pens, Highlighters, Correction Rolls, And Labels For Office & Sc | 2085183217114599426 | 89 | A | CONFIRMED_READY |
| 64 | Set Of 52 Lead Fishing Weights With Storage Box, 2g To 20g, For Precision Fishing Tool Kits | 2087398329327681538 | 86 | A | CONFIRMED_READY |
| 65 | 480-Piece Eyelet Set, 1.9 Cm, Multicolor, Metal Eyelet Set With Transparent Storage Box For Bags, Shoes, Clothing, Leath | 2087398801758543873 | 86 | A | CONFIRMED_READY |
| 78 | 230-piece Fishing Tackle Set, Carbon Steel Swivels, Fishing Swivels, Includes Storage Box, Suitable For Saltwater Fishin | 2087398035815940097 | 81 | A | CONFIRMED_READY |
| 209 | Multifunctional Folding Bag Travel Layered Organizer | 2608060538491634400 | 64 | B | CONFIRMED_NOT_READY |
| 214 | Light-luxury Gold And Jewelry Storage Album Jewelry Organizer Bag | 2608120239071632000 | 63 | B | CONFIRMED_NOT_READY |

### Mode > Vêtements mixte / unisexe — TOP 10 (sur 42 retenus)

| Rank | Produit | CJ ID | Score | Priorité | Stock | Prix vente est. | Marge est. |
|---|---|---|---|---|---|---|---|
| 105 | Mens Fleece-lined Loose-fit Casual Hoodie And Pants Set | 2608080035021607700 | 73 | B | CONFIRMED_NOT_READY | 29.99 | 17.71 |
| 106 | Handsome Trendy Soft Leather Jacket Coat | 2608111206321639300 | 73 | B | CONFIRMED_NOT_READY | 95.99 | 57.28 |
| 107 | Retro V-neck Cardigan Coat Unisex Couples Jacket Top | 2608070237591602700 | 73 | B | CONFIRMED_NOT_READY | 49.99 | 29.95 |
| 108 | Notch-lapel Single-breasted Jacket And High-waisted A-line Skort Set | 2608110143431621900 | 73 | B | CONFIRMED_NOT_READY | 29.99 | 17.71 |
| 109 | Mens Casual Loose-fit Hoodie And Pants Set | 2608081548141632300 | 73 | B | CONFIRMED_NOT_READY | 28.99 | 17.19 |
| 110 | New Style Casual Solid-Color Long-Sleeve Sweatshirt And Lace-Up Wide-Leg Pants Set For Europe And America | 2608110152151621200 | 73 | B | CONFIRMED_NOT_READY | 28.99 | 16.92 |
| 111 | Solid-color Digital Letter-embossed Print Hooded Sweatshirt With Pockets | 2608100952231624000 | 73 | B | CONFIRMED_NOT_READY | 29.99 | 17.71 |
| 112 | Retro Crew-neck Long-sleeve Shirt With An Elegant Long Skirt | 2608120526131605700 | 73 | B | CONFIRMED_NOT_READY | 28.99 | 17.19 |
| 113 | New FallWinter Outdoor Thermal Fleece Hoodie | 2608110826171619800 | 73 | B | CONFIRMED_NOT_READY | 28.99 | 17.19 |
| 114 | Distressed Loopback Zip-up Hooded Sweatshirt Jacket | 2608100619471606000 | 73 | B | CONFIRMED_NOT_READY | 49.99 | 29.95 |

### Ordinateurs — TOP 10 (sur 15 retenus)

| Rank | Produit | CJ ID | Score | Priorité | Stock | Prix vente est. | Marge est. |
|---|---|---|---|---|---|---|---|
| 36 | Turn Signal S Witch For 2001-2005 BMW 325i With Trip Computer Controls | 2087377049840910337 | 90 | A | CONFIRMED_READY | 113.99 | 68.13 |
| 37 | 1-Piece 5-Tier Jewelry Organizer With 108 Earring Holes, Necklace Rack & Ring/Bracelet Holders - Desktop Storage Stand F | 2087398078761418753 | 90 | A | CONFIRMED_READY | 27.99 | 16.71 |
| 127 | Vinyl Record Player, Gramophone, Built-In Dual Speaker Speaker, Desktop Acrylic Dust Cover, Bluetooth Connection | 2087446708229664770 | 72 | B | CONFIRMED_NOT_READY | 139.99 | 83.79 |
| 128 | Spot Retro Vinyl Record Player Audio Desktop Double Speaker Acrylic Cover Vinyl Gramophone Cross-Border Wholesale | 2087434354163896322 | 72 | B | CONFIRMED_NOT_READY | 142.99 | 85.3 |
| 144 | Best-selling 5V Mini Train Aroma Diffuser, Special Diffuser For Essential Oils, Desktop, Retro Decorative Item, Humidifi | 2087084350286065666 | 70 | B | CONFIRMED_NOT_READY | 44.99 | 26.47 |
| 145 | Desktop Household And Dormitory Floor-standing Electric Fan | 2608120417071601000 | 70 | B | CONFIRMED_NOT_READY | 85.99 | 51.47 |
| 146 | Desktop Usb Plug-in Heavy Fog Humidifier USB Desktop Diffuser With Large Mist Essential Oil Compatible 7-Color LED Light | 2608120223581626000 | 70 | B | CONFIRMED_NOT_READY | 35.99 | 21.27 |
| 192 | Christmas Decorations, Luminous Candle Lights, Desktop Decorations, Water-Filled Interior Scenes, Holiday Props, Creativ | 2087410971342856193 | 67 | B | CONFIRMED_NOT_READY | 14.99 | 8.6 |
| 203 | New Dual-spray Wireless Humidifier, Portable Home Desktop Air Replenishment Night Light Atomization Humidifier, Cross-bo | 2087371060833435650 | 65 | B | CONFIRMED_NOT_READY | 23.99 | 14.4 |
| 220 | New Mini Luminous Bird Christmas Tree Christmas Decorations Desktop Ornaments Creative Christmas Gifts Night Light | 2087413314019786754 | 62 | B | CONFIRMED_NOT_READY | 8.99 | 4.83 |

### Outillage — TOP 10 (sur 41 retenus)

| Rank | Produit | CJ ID | Score | Priorité | Stock | Prix vente est. | Marge est. |
|---|---|---|---|---|---|---|---|
| 2 | VEVOR Crimping Tool, 22-10 AWG Ratcheting Wire Crimper Tool, Labor-Saving Electrical Terminal Crimp Pliers With Clear Me | 2069695333556850689 | 96 | A | CONFIRMED_READY | 29.99 | 17.88 |
| 3 | Tool Belts For Men,Tool Belt Pouch,26-Pockets Heavy Duty Padded Tools | 2085570814609510401 | 96 | A | CONFIRMED_READY | 27.99 | 16.48 |
| 4 | Set Of 3 Heavy-duty Combination Pliers With Soft-grip Handles, Shearing Tools, Steel Pliers | 2054763675628249089 | 96 | A | CONFIRMED_READY | 33.99 | 20.16 |
| 5 | Straight Throat Type Car Water Pipe Clamp Pliers, Oil Pipe Clamps, Snap Pliers Tools, Red Set | 2082414072732110849 | 96 | A | CONFIRMED_READY | 108.99 | 64.81 |
| 6 | 17515 Rigid Molle Panels For Vehicles Truck Mount Rack Panel Tactical Seat Back Organizer with 2 Organizer Storage Bag,  | 2079862810078855169 | 96 | A | CONFIRMED_READY | 202.99 | 121.78 |
| 15 | Universal Engine Valve Spring Compressor Tool Valves Removal Pliers Kit 15-330mm | 2087473424792711170 | 93 | A | CONFIRMED_READY | 52.99 | 31.5 |
| 16 | Engine Cylinder Head Component Repairing Organiser Valves Standing Tools | 2085677205571690497 | 93 | A | CONFIRMED_READY | 64.99 | 39 |
| 17 | 9 Piece Torque Wrench Set 3-230Nm 1 4 3 8 1 2 Drive Calibrated Garage Tools | 2085298465802981377 | 93 | A | CONFIRMED_READY | 139.99 | 84 |
| 18 | Wood Splitter Drill Bit Set, 6-Piece Wedge Drill Bit Set In A Storage Box, 32 Mm & 42 Mm Diameter, Professional Forestry | 2084468169263132673 | 93 | A | CONFIRMED_READY | 33.99 | 19.92 |
| 24 | 3-piece Fishing Fish Killer Set 24.5 Cm Aluminum Fish Killer Includes Fishing Pliers And Hook Remover Fishing Accessorie | 2074743488482361346 | 91 | A | CONFIRMED_READY | 16.99 | 10.08 |

### Romans — 1 candidat(s) retenu(s) (< 10, liste complète, pas de TOP 10)

| Rank | Produit | CJ ID | Score | Priorité | Stock |
|---|---|---|---|---|---|
| 198 | Beaded Bracelet For Women In The Same Style As The Novel, Niche Design, High Aesthetic Value, Unique And Non-Cliche, Ver | 2083740102706450434 | 66 | B | CONFIRMED_NOT_READY |

### Électronique > Vidéoprojecteurs — TOP 10 (sur 10 retenus)

| Rank | Produit | CJ ID | Score | Priorité | Stock | Prix vente est. | Marge est. |
|---|---|---|---|---|---|---|---|
| 33 | Projector HD For Home Theater Office 360 Degree Rotatable PTZ Portable Mini HY320 AU Plug 110‑220V Black | 2069714608557056002 | 91 | A | CONFIRMED_READY | 131.99 | 79.2 |
| 34 | 1pc Portable Foldable NOn Crease White Projector Curtain Projection Screen 4:3 (100inch) | 2078067707086135298 | 91 | A | CONFIRMED_READY | 35.99 | 21.08 |
| 35 | 3D Hologram Fan 16.5in 2000x224 WiFi 3D Projector With 224 LED Light Beads For Business Store Advertising 100‑240V US Pl | 2078065307112804354 | 91 | A | CONFIRMED_READY | 78.99 | 47.05 |
| 54 | 5G WiFi Bluetooth Projector 180 Degree Rotation FHD 1080P 1G RAM 8G ROM Portable Movie Projector For Android 11.0 100‑24 | 2078066053532114946 | 88 | A | CONFIRMED_READY | 123.99 | 73.83 |
| 117 | X3AQ Autofocus 1080P HD Video 4K Projector | 2606051513541621900 | 73 | B | CONFIRMED_NOT_READY | 145.99 | 87.06 |
| 134 | Auto-focus Automatic Obstacle Avoidance High-brightness Projector | 2606300759361620700 | 71 | B | CONFIRMED_NOT_READY | 194.99 | 116.91 |
| 135 | Portable Home Theater Projector, Mini Projector For Bedroom Gaming Movies | 2084214556704231426 | 71 | B | CONFIRMED_NOT_READY | 74.99 | 44.98 |
| 136 | Ultra-clear Large-screen Direct-projection Portable Projector | 2607020914401619300 | 71 | B | CONFIRMED_NOT_READY | 153.99 | 92.04 |
| 165 | Universal Speedometer Compass Projector For All Cars | 2607110748021624400 | 68 | B | CONFIRMED_NOT_READY | 41.99 | 24.63 |
| 215 | Focusing Starry Sky Ceiling Projector Night Light Eye Protective Bedside Lamp With USB | 2606200235311610800 | 63 | B | CONFIRMED_NOT_READY | 12.99 | 7.41 |

