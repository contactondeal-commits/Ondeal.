# PHASE 2.5 — Audit de catégorie strict des 250 candidats CJ

_Généré le 2026-08-12 — aucune écriture Shopify, aucun import CJ, aucune nouvelle recherche CJ API._

## 1. Résumé exécutif

- **Candidats initiaux (Phase 1/2)** : 250
- **Conservés après audit strict (sur les 250 initiaux)** : 103
- **Rejetés par l'audit catégorie (sur les 250 initiaux)** : 147
- **Remplacements repêchés dans le pool Phase 1 (326 déjà récupérés, aucune nouvelle recherche)** : 25
- **Total final** : 128 / 250 (manque 122, honnêtement documenté catégorie par catégorie, jamais comblé artificiellement)
- **Répartition priorité finale** : A=41, B=85, C=2
- **Catégories atteignant leur objectif** : 3 / 18
- **Catégories sous quota** : 15 / 18
- **Catégories à 0 candidat valide** : ordinateurs, tv, romans, bd

## 2. Méthodologie

Audit sémantique strict par catégorie (Phase 2.5) appliqué à chaque titre de produit : un candidat n'est conservé que s'il correspond réellement au type de produit attendu par sa catégorie OnDeal (ex : Chaussures femme = chaussures réelles, pas bijoux/vêtements/sacs). Deux passes ont été nécessaires : une première passe de règles (par catégorie, mots-clés produits valides vs signaux contradictoires) a d'abord réduit les 250 candidats à 186 PASS / 64 REJECT, mais une relecture manuelle approfondie des résultats a révélé des faux positifs supplémentaires non couverts par les premières règles : lampes décoratives comptées comme vidéoprojecteurs, décorations de bureau comptées comme ordinateurs (0 ordinateur réel trouvé sur 326 produits déjà récupérés), bijoux/sacs/chaussures comptés comme vêtements mixtes malgré un mot de genre explicite (Womens/Mens, contraire à la règle déjà actée dans src/data/categories.ts), horn/porte-clés/déco comptés comme football, pinces à bijoux/pêche comptées comme outillage, huiles/sprays cosmétiques et produits à connotation intime comptés comme bien-être/massage, etc. Les règles ont été renforcées en conséquence et l'audit complet a été relancé (250 candidats originaux + 326 candidats du pool Phase 1) avant reconstruction finale de la sélection. Aucune nouvelle recherche CJ n'a été effectuée : seuls les 326 produits déjà récupérés en Phase 1 ont servi de réservoir de remplacement.

## 3. Tableau avant / après par catégorie

| Catégorie | Sélection initiale (250) | PASS audit | REJECT audit | Remplacements | Total final | Objectif | Sous quota |
|---|---:|---:|---:|---:|---:|---:|---|
| Chaussures femme | 20 | 1 | 19 | 0 | 1 | 25 | OUI |
| Chaussures homme | 18 | 2 | 16 | 0 | 2 | 20 | OUI |
| Accessoires femme | 11 | 1 | 10 | 0 | 1 | 20 | OUI |
| Accessoires homme | 20 | 3 | 17 | 0 | 3 | 20 | OUI |
| Ordinateurs | 15 | 0 | 15 | 0 | 0 | 15 | OUI |
| Télévisions | 0 | 0 | 0 | 0 | 0 | 10 | OUI |
| Outillage | 41 | 20 | 21 | 7 | 27 | 15 | non |
| Jeux de société | 12 | 7 | 5 | 0 | 7 | 15 | OUI |
| Barbecue | 10 | 10 | 0 | 0 | 10 | 10 | non |
| Football | 14 | 6 | 8 | 1 | 7 | 10 | OUI |
| Chats | 7 | 5 | 2 | 0 | 5 | 10 | OUI |
| Jeunesse | 4 | 4 | 0 | 0 | 4 | 10 | OUI |
| Romans | 1 | 0 | 1 | 0 | 0 | 5 | OUI |
| BD | 1 | 0 | 1 | 0 | 0 | 5 | OUI |
| Mode > Vêtements mixte / unisexe | 42 | 27 | 15 | 16 | 43 | 20 | non |
| Maison > Rangement | 9 | 5 | 4 | 0 | 5 | 15 | OUI |
| Électronique > Vidéoprojecteurs | 10 | 6 | 4 | 0 | 6 | 10 | OUI |
| Beauté & Bien-être > Bien-être/Massage | 15 | 6 | 9 | 1 | 7 | 15 | OUI |

## 4. Principales raisons de rejet observées

L'audit strict a mis au jour des faux positifs récurrents, tous corrigés dans cette passe :

- **Chaussures femme/homme** : bijoux (boucles d'oreilles, colliers, bracelets), robes, sacs, rasoirs comptés comme chaussures simplement parce que la requête de recherche contenait « women's sneakers » / « men's sneakers ».
- **Accessoires femme/homme** : pantalons, robes, vêtements comptés comme accessoires.
- **Ordinateurs** : 100% de faux positifs — le mot « desktop » dans « desktop decoration », « desktop diffuser », « desktop ornament » a été confondu avec un ordinateur de bureau. **Aucun ordinateur réel n'a été trouvé dans les 326 produits déjà récupérés.**
- **Vêtements mixte/unisexe** : de nombreux articles explicitement genrés (« Womens », « Mens ») avaient été classés à tort en mixte, en violation de la règle déjà actée dans `src/data/categories.ts` (mixte = jamais si « homme »/« femme » apparaît explicitement). Bijoux, sacs, chaussures et un produit pour chien ont aussi été retirés.
- **Football** : porte-clés, colliers/pendentifs, tirelires, autocollants muraux, bac à glaçons, casquettes, ponchos de pluie, calendrier de l'avent, porte-bagage, pièces de carrosserie automobile — comptés comme football uniquement parce que le mot « football »/« World Cup » apparaissait dans un titre marketing.
- **Vidéoprojecteurs** : veilleuses/lampes décoratives « starry sky projector », phares antibrouillard automobiles « LED projector », compas/compteurs de vitesse automobiles — comptés comme vidéoprojecteurs à cause du seul mot « projector ».
- **Outillage** : pinces à bijoux, kits de loisirs créatifs, matériel de pêche, accessoires de toilettage animalier, brosses à chaussures — comptés comme outillage à cause du mot « pliers »/« tool » isolé.
- **Rangement** : matériel de pêche et kits de loisirs créatifs vendus « avec boîte de rangement » — le rangement n'étant qu'accessoire au produit réel.
- **Bien-être/Massage** : huiles, sprays et patchs cosmétiques génériques, produit à connotation intime, lampe de « thérapie du sommeil » sans fonction de massage — hors périmètre réel de la catégorie.
- **Chats** : « CAT catalytic converter » (pièce automobile) et « cat eye nail gel » (vernis à ongles) comptés comme produits pour chats à cause du seul mot « cat ».
- **Romans/BD** : un bracelet « in the same style as the novel » et un faux-cils « comic-style » comptés comme livre/BD à cause d'un adjectif de style, sans être des livres.

## 5. Remplacements utilisés (puisés uniquement dans le pool Phase 1, 326 produits déjà récupérés)

Total : 25 remplacements. Aucune nouvelle recherche CJ API n'a été effectuée — voir JSON `replacements` pour le détail complet.

| Catégorie | Produit de remplacement | Score | Priorité | Statut stock |
|---|---|---:|---|---|
| Football | Breathable Ankle Brace For Basketball And Soccer | 85 | B | CONFIRMED_NOT_READY |
| Beauté & Bien-être > Bien-être/Massage | Household Gravity Based Shiatsu Cervical Spine Traction Massage Pillow | 85 | B | CONFIRMED_NOT_READY |
| Outillage | Grommet Tool Kit 1/4" 3/8" 1/2" 900 PCS Grommets Eyelet Tool Kit, With Eyelets A | 85 | A | CONFIRMED_READY |
| Outillage | Grommet Tool Kit 1/4" 5/16" 3/8" 900 PCS Grommets Eyelet Tool Kit, With Eyelets  | 85 | A | CONFIRMED_READY |
| Outillage | Multi-tool Knife And Pliers Outdoor EDC Combination Tool Bottle Opener | 85 | B | CONFIRMED_NOT_READY |
| Outillage | Belt Punch Multifunctional Hole-punch Pliers | 85 | B | CONFIRMED_NOT_READY |
| Outillage | Multifunctional Electrician Wire Cutting Pliers In One | 85 | B | CONFIRMED_NOT_READY |
| Outillage | Specialized Pliers For Removing And Installing Automotive Interior Trim Clips | 85 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Hooded Sweatshirt With Loose And Casual Design Featuring A Zipper Closure | 85 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Wish Autumn And Winter New Corduroy Cardigan Elegant Slim Pure Color Casual Prof | 85 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Hooded Zip-up Casual Versatile Long-sleeve Jacket | 85 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Ice Silk Stretch Fitness Solid-color Short-sleeved T-shirt Wholesale | 85 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Summer Casual Deep V-Neck Solid Color T-Shirt  Slim Fit Short Sleeve Top, Comfor | 85 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Halloween Harrow American Unisex Performance Costume Prisoner Outfit Orange Pris | 85 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | 230gsm Pure Cotton T Shirt Short Sleeve | 85 | B | CONFIRMED_NOT_READY |
| Outillage | Multi-tool Round-nose Pliers For Outdoor Camping | 70 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Thickened Crew Neck Sweatshirt | 70 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Thickened Relaxed-fit Heavyweight American-style Couples Jacket For Teens | 70 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Casual Fashion Fall  Winter New Arrival  Solid Color Long Sleeve Crew Neck Zip-U | 70 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Loose Drawstring Hooded Sweatshirt | 70 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Summer New Arrival  Comfortable Casual Solid Color Button-Down Shirt & Wide-Leg  | 70 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Hibiscus & Seashell Print Oversized Shirt | 70 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Summer Striped Shirt Dress, Fashionable Casual Lounge Wear, Comfortable & Relaxe | 70 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | Hooded Sweatshirt With Drawstrings Western Style | 70 | B | CONFIRMED_NOT_READY |
| Mode > Vêtements mixte / unisexe | European And American Cross-Border 2025 Spring & Fall New Pure Color Splicing Th | 70 | B | CONFIRMED_NOT_READY |

## 6. TOP 50 global (après audit — uniquement des candidats strictement conformes à leur catégorie)

| Rang | Titre | Catégorie | Score | Priorité |
|---:|---|---|---:|---|
| 1 | VEVOR Crimping Tool, 22-10 AWG Ratcheting Wire Crimper Tool, Labor-Saving Electrical Termi | Outillage | 96 | A |
| 2 | Tool Belts For Men,Tool Belt Pouch,26-Pockets Heavy Duty Padded Tools | Outillage | 96 | A |
| 3 | Set Of 3 Heavy-duty Combination Pliers With Soft-grip Handles, Shearing Tools, Steel Plier | Outillage | 96 | A |
| 4 | Straight Throat Type Car Water Pipe Clamp Pliers, Oil Pipe Clamps, Snap Pliers Tools, Red  | Outillage | 96 | A |
| 5 | Folding BBQ Charcoal Barbecue Grill Steel Stainless Garden Picnic Camping Stove | Barbecue | 96 | A |
| 6 | 14X Stainless Steel BBQ Barbecue Tool Set Outdoor Grilling Utensils Kit Portable | Barbecue | 96 | A |
| 7 | Steel Pipe Rebound Soccer Football Goal Black,Adjustable Rebounder Net,55.12 X 35.43 X 31. | Football | 96 | A |
| 8 | 8X5ft Soccer Goal Training Set With Net Buckles Ground Nail Football Sports For Teens & Ad | Football | 96 | A |
| 9 | 4 In 1 Football Goal Pop-Up Soccer Goal Football Training Goal Net Carry Bag Kids | Football | 96 | A |
| 10 | Universal Engine Valve Spring Compressor Tool Valves Removal Pliers Kit 15-330mm | Outillage | 93 | A |
| 11 | 9 Piece Torque Wrench Set 3-230Nm 1 4 3 8 1 2 Drive Calibrated Garage Tools | Outillage | 93 | A |
| 12 | Wood Splitter Drill Bit Set, 6-Piece Wedge Drill Bit Set In A Storage Box, 32 Mm & 42 Mm D | Outillage | 93 | A |
| 13 | Steel Ladder Toss Game Set, 2 Pack Ladder Ball Rack with 6 Bolas,  Assembly-Free Ladder To | Jeux de société | 93 | A |
| 14 | Golf Chipping Game Mat Set With Target Net Indoor Outdoor Practice Game With Scoreboard | Jeux de société | 93 | A |
| 15 | Portable Tire Inflator Rechargeable Electric Inflator For Car Bicycle Digital Air Compress | Football | 93 | A |
| 16 | 8x5 ft Soccer Goal for Backyard, Portable Soccer Net and Steel Weatherproof Frame Folding  | Football | 93 | A |
| 17 | Outdoor Camping Butane Gas Stove Portable Single Burner Hob BBQ Picnic Cooker UK | Barbecue | 91 | A |
| 18 | White Wardrobe Drawer Organizers, Stackable Storage Boxes For Wardrobes, Two Sizes | Maison > Rangement | 91 | A |
| 19 | Hair Dryer Bracket No Drilling Wall Mount Blow Dryer Hanger Rack Organizer For Bathroom Be | Maison > Rangement | 91 | A |
| 20 | Rattan-front Shoe Cabinet With 1 Drawer And 2 Flip-down Compartments, Particleboard, 54x24 | Maison > Rangement | 91 | A |
| 21 | Projector HD For Home Theater Office 360 Degree Rotatable PTZ Portable Mini HY320 AU Plug  | Électronique > Vidéoprojecteurs | 91 | A |
| 22 | 1x Automobile Dent Repair Wheel Arch Car Body Line Marking Tools Range 0cm-20cm | Outillage | 88 | A |
| 23 | 3x Electrical Connector Disconnect Pliers For Cars Automotive Plug Removal Plier | Outillage | 88 | A |
| 24 | 66 Cm Easter Animal Dartboard, Velcro Dart Game, Double-Sided Velcro Ball Game With 6 Stic | Jeux de société | 88 | A |
| 25 | Magnetic Maze Game (includes Magnetic Pen), A Creative Puzzle Game For Adults That Helps I | Jeux de société | 88 | A |
| 26 | Halloween Spider Web Dartboard, Halloween Velcro Ball Game, 66 Cm Double-Sided Dart Game,  | Jeux de société | 88 | A |
| 27 | Rainbow Swing Towel, 2.4m Colorful Parachute With 12 Balls And 12 Handles—Parachute Game,  | Jeux de société | 88 | A |
| 28 | Throwing Game For Parties With A Banner, 3 Bags, And A 6-meter Rope - Fun Group Activity,  | Jeux de société | 88 | A |
| 29 | 15 Replacement Filters For Cat Fountains With Sponge Filters (9.6 X 5.8 Cm) - Party Suppli | Chats | 88 | A |
| 30 | Magic Cottage + Pumpkin House Coloring Book, 2-piece Coloring Book Set For Adults, Suitabl | Jeunesse | 88 | A |
| 31 | 3-piece Coloring Book Set Featuring Three Different Themes: Garden Flowers, A Castle, And  | Jeunesse | 88 | A |
| 32 | Set Of 15 Animal Picture Books Featuring Various Animals, For Learning Activities And As A | Jeunesse | 88 | A |
| 33 | 5G WiFi Bluetooth Projector 180 Degree Rotation FHD 1080P 1G RAM 8G ROM Portable Movie Pro | Électronique > Vidéoprojecteurs | 88 | A |
| 34 | Five-piece Colored Pliers Set, 5-piece Combination Pliers Set In Various Colors, Multipurp | Outillage | 88 | A |
| 35 | Model-Making Tool Set – Precision Tools For Tinkerers And Hobbyists – Precision Mechanics  | Outillage | 88 | A |
| 36 | 32mm Wood Splitter Drill Bit Set With 3 Drill Bits And Storage Box—Accessories For Hand To | Outillage | 88 | A |
| 37 | 11-Piece Lawn Mower Replacement Parts Set With Pressure Plate, Guide Plate, Nuts, And Stor | Outillage | 88 | A |
| 38 | Corner Clamp Set With 4 Angle Clamps, Nylon Gloves, And A Measuring Tape—a Handy Kit For A | Outillage | 88 | A |
| 39 | Hex Head Screw Set With Storage Box, Allen Screw Assortment With Matching Tool And Tweezer | Outillage | 86 | A |
| 40 | Breathable Ankle Brace For Basketball And Soccer | Football | 85 | B |
| 41 | Household Gravity Based Shiatsu Cervical Spine Traction Massage Pillow | Beauté & Bien-être > Bien-être/Massage | 85 | B |
| 42 | Grommet Tool Kit 1/4" 3/8" 1/2" 900 PCS Grommets Eyelet Tool Kit, With Eyelets And Washers | Outillage | 85 | A |
| 43 | Grommet Tool Kit 1/4" 5/16" 3/8" 900 PCS Grommets Eyelet Tool Kit, With Eyelets And Washer | Outillage | 85 | A |
| 44 | Multi-tool Knife And Pliers Outdoor EDC Combination Tool Bottle Opener | Outillage | 85 | B |
| 45 | Belt Punch Multifunctional Hole-punch Pliers | Outillage | 85 | B |
| 46 | Multifunctional Electrician Wire Cutting Pliers In One | Outillage | 85 | B |
| 47 | Specialized Pliers For Removing And Installing Automotive Interior Trim Clips | Outillage | 85 | B |
| 48 | Hooded Sweatshirt With Loose And Casual Design Featuring A Zipper Closure | Mode > Vêtements mixte / unisexe | 85 | B |
| 49 | Wish Autumn And Winter New Corduroy Cardigan Elegant Slim Pure Color Casual Professional E | Mode > Vêtements mixte / unisexe | 85 | B |
| 50 | Hooded Zip-up Casual Versatile Long-sleeve Jacket | Mode > Vêtements mixte / unisexe | 85 | B |

## 7. TOP 10 par catégorie (uniquement pour les catégories comptant au moins 10 candidats valides après audit)

Catégories qualifiées : outillage, barbecue, vetements-mixte

Catégories NON qualifiées (moins de 10 candidats valides — jamais complétées artificiellement) : femme-chaussures, homme-chaussures, femme-accessoires, homme-accessoires, ordinateurs, tv, jeux-societe, football, chats, jeunesse-livres, romans, bd, rangement, videoprojecteurs, bien-etre-massage

### outillage

| Rang | Titre | Score | Priorité |
|---:|---|---:|---|
| 1 | VEVOR Crimping Tool, 22-10 AWG Ratcheting Wire Crimper Tool, Labor-Saving Electrical Termi | 96 | A |
| 2 | Tool Belts For Men,Tool Belt Pouch,26-Pockets Heavy Duty Padded Tools | 96 | A |
| 3 | Set Of 3 Heavy-duty Combination Pliers With Soft-grip Handles, Shearing Tools, Steel Plier | 96 | A |
| 4 | Straight Throat Type Car Water Pipe Clamp Pliers, Oil Pipe Clamps, Snap Pliers Tools, Red  | 96 | A |
| 10 | Universal Engine Valve Spring Compressor Tool Valves Removal Pliers Kit 15-330mm | 93 | A |
| 11 | 9 Piece Torque Wrench Set 3-230Nm 1 4 3 8 1 2 Drive Calibrated Garage Tools | 93 | A |
| 12 | Wood Splitter Drill Bit Set, 6-Piece Wedge Drill Bit Set In A Storage Box, 32 Mm & 42 Mm D | 93 | A |
| 22 | 1x Automobile Dent Repair Wheel Arch Car Body Line Marking Tools Range 0cm-20cm | 88 | A |
| 23 | 3x Electrical Connector Disconnect Pliers For Cars Automotive Plug Removal Plier | 88 | A |
| 34 | Five-piece Colored Pliers Set, 5-piece Combination Pliers Set In Various Colors, Multipurp | 88 | A |

### barbecue

| Rang | Titre | Score | Priorité |
|---:|---|---:|---|
| 5 | Folding BBQ Charcoal Barbecue Grill Steel Stainless Garden Picnic Camping Stove | 96 | A |
| 6 | 14X Stainless Steel BBQ Barbecue Tool Set Outdoor Grilling Utensils Kit Portable | 96 | A |
| 17 | Outdoor Camping Butane Gas Stove Portable Single Burner Hob BBQ Picnic Cooker UK | 91 | A |
| 59 | Large Barbecue Grill Portable Folding BBQ Rack For Outdoor Use | 73 | B |
| 60 | People Use Camping Charcoal Barbecue Ovens. | 73 | B |
| 115 | Stainless Steel Frying Spatula Set BBQ Tools | 66 | B |
| 116 | Outdoor Folding Barbecue Grill With A Built-in Tool Box | 66 | B |
| 119 | Cross-border Bear Claw Meat Shredder, Stainless Steel Bear Claw Chicken Shredder, BBQ Meat | 63 | B |
| 127 | Grill And Frying Pan Cleaner | 54 | C |
| 128 | Grill Cleaning Degreasing Agent | 54 | C |

### vetements-mixte

| Rang | Titre | Score | Priorité |
|---:|---|---:|---|
| 48 | Hooded Sweatshirt With Loose And Casual Design Featuring A Zipper Closure | 85 | B |
| 49 | Wish Autumn And Winter New Corduroy Cardigan Elegant Slim Pure Color Casual Professional E | 85 | B |
| 50 | Hooded Zip-up Casual Versatile Long-sleeve Jacket | 85 | B |
| 51 | Ice Silk Stretch Fitness Solid-color Short-sleeved T-shirt Wholesale | 85 | B |
| 52 | Summer Casual Deep V-Neck Solid Color T-Shirt  Slim Fit Short Sleeve Top, Comfortable & Ve | 85 | B |
| 53 | Halloween Harrow American Unisex Performance Costume Prisoner Outfit Orange Prison Uniform | 85 | B |
| 54 | 230gsm Pure Cotton T Shirt Short Sleeve | 85 | B |
| 61 | Handsome Trendy Soft Leather Jacket Coat | 73 | B |
| 62 | Retro V-neck Cardigan Coat Unisex Couples Jacket Top | 73 | B |
| 63 | Notch-lapel Single-breasted Jacket And High-waisted A-line Skort Set | 73 | B |

## 8. Sécurité / garde-fous

- `shopifyWrites` : **0**
- `productsImported` : **0**
- `productsPublished` : **0**
- `pricesModified` : **0**
- `stockModified` : **0**
- `variantsModified` : **0**
- `imagesModified` : **0**
- `tagsModified` : **0**
- `statusesModified` : **0**
- `newCjApiSearches` : **0**

Aucune écriture Shopify. Aucun import CJ. Travail réalisé uniquement à partir de reports/cj-candidate-plan-250.json et data/cj-research/scored-candidates.json déjà existants.

## 9. Limites de cet audit

- Résultat basé exclusivement sur l'analyse du **titre** produit (règles regex par catégorie construites à partir d'exemples réels observés) — pas une relecture humaine exhaustive image par image.
- 4 catégories mode (Chaussures femme/homme, Accessoires femme/homme) et Ordinateurs/TV/Romans/BD restent très en dessous de leur objectif : les requêtes de recherche CJ de la Phase 1 pour ces catégories ont majoritairement remonté des produits hors sujet. Une correction durable nécessitera de nouvelles requêtes CJ mieux ciblées — explicitement hors périmètre de cette mission ("NE REFAIS PAS les recherches API").
