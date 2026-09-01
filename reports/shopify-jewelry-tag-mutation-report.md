# Rapport de mutation Shopify — Ajout du tag `cat-bijoux`

**Date/heure (UTC)** : 2026-08-13T16:39:02Z
**Mode** : Mutation Shopify **autorisée et limitée exclusivement** à l'ajout du tag `cat-bijoux` via la mutation Admin GraphQL `tagsAdd` (additive uniquement — ne peut techniquement ni supprimer ni remplacer des tags existants).
**Connecteur utilisé** : Shopify MCP (reconnecté et vérifié fonctionnel avant toute action — `get-shop-info` a confirmé la boutique "Ondeal", domaine `ondeal.fr`).

---

## Résumé

```
SHOPIFY MODIFIÉ
147 PRODUITS HIGH CONTRÔLÉS
147 PRODUITS MODIFIÉS
0 PRODUITS DÉJÀ TAGUÉS
0 LOW MODIFIÉ
0 WEARABLE MODIFIÉ
TAGS EXISTANTS CONSERVÉS
PRIX/STOCK/VARIANTES/IMAGES/STATUTS INCHANGÉS
```

| Métrique | Valeur |
|---|---|
| Nombre HIGH attendu | 147 |
| Nombre vérifié avant mutation | 147 |
| Nombre déjà tagué `cat-bijoux` avant mutation | 0 |
| Nombre effectivement modifié | 147 |
| Nombre d'échecs | 0 |

---

## Étape 0 — Connecteur

Connecteur Shopify MCP confirmé disponible et fonctionnel via `get-shop-info` : boutique **Ondeal**, domaine **ondeal.fr**, email `contact@ondeal.fr`. Aucun fallback vers `SHOPIFY_ADMIN_ACCESS_TOKEN` n'a été utilisé.

## Étape 1 — Pré-vérification en lecture seule

Les 147 productId de `reports/jewelry-reclassification-report.json` (confidence = HIGH, newCategory = bijoux) ont été relus en direct sur Shopify, par lots de 20, via `product(id) { id title status tags }`.

- **147/147 produits trouvés** et accessibles.
- **147/147 ACTIVE.**
- **0 produit manquant.**
- **1 différence de titre mineure, non significative** : `gid://shopify/Product/16269350961487` — le titre live ne porte plus le suffixe final " Gift Box" présent dans le rapport local (reste, pour le reste, identique mot pour mot). Il ne s'agit ni d'un changement de nature du produit ni d'un changement de catégorie — n'a donc **pas déclenché de STOP**.
- **0 produit du set des 147 identifié comme wearable/smart device** (bracelet connecté, bague connectée, tracker, nettoyeur à bijoux, etc. — liste complète de mots-clés vérifiée).
- **Produit LOW `gid://shopify/Product/16269399490895` confirmé absent des 147** — vérifié séparément, ACTIVE, tags `["bijoux", "chat-bijouxx"]`, exclu par construction dès la lecture du rapport source.

Le nombre de produits HIGH est resté exactement 147 → **la condition de passage à l'Étape 2 est remplie.**

## Étape 2 — Règle de mutation appliquée

Mutation utilisée : `tagsAdd(id: ID!, tags: ["cat-bijoux"])`. Cette mutation de l'API Admin Shopify est **additive par construction** : elle ajoute un tag sans jamais toucher aux tags existants ni les remplacer. C'est la méthode la plus sûre disponible pour respecter la règle "AVANT + cat-bijoux, aucune suppression".

Exemple réel observé (produit `gid://shopify/Product/16269001654607`) :
- **Avant** : `["bijoux", "chat-bijouxx"]`
- **Après** : `["bijoux", "cat-bijoux", "chat-bijouxx"]`

Aucun produit ne portait déjà `cat-bijoux` avant mutation (confirmé en Étape 1) — la clause "ne rien modifier si déjà présent" ne s'est donc appliquée à aucun cas réel dans ce lot.

## Étape 3 — Exécution par lots

Exécution séquentielle en 8 lots (7 lots de 20 + 1 lot de 7 = 147), avec vérification immédiate après chaque lot via la réponse `node { tags }` de la mutation elle-même :

| Lot | Produits | cat-bijoux ajouté | Anciens tags conservés | Erreurs |
|---|---|---|---|---|
| 1 | 20 | 20/20 | 20/20 | 0 |
| 2 | 20 | 20/20 | 20/20 | 0 |
| 3 | 20 | 20/20 | 20/20 | 0 |
| 4 | 20 | 20/20 | 20/20 | 0 |
| 5 | 20 | 20/20 | 20/20 | 0 |
| 6 | 20 | 20/20 | 20/20 | 0 |
| 7 | 20 | 20/20 | 20/20 | 0 |
| 8 | 7 | 7/7 | 7/7 | 0 |
| **Total** | **147** | **147/147** | **147/147** | **0** |

Aucune anomalie détectée à aucun moment — aucun STOP n'a été nécessaire.

## Étape 4 — Contrôle final

- **147/147 HIGH portent désormais `cat-bijoux`** (vérifié via les réponses de mutation elles-mêmes, tag par tag).
- **LOW (`gid://shopify/Product/16269399490895`) re-vérifié après la campagne de mutation** : tags toujours `["bijoux", "chat-bijouxx"]` — **`cat-bijoux` absent, confirmé.**
- **0 des 147 ne correspond aux exclusions wearable** — aucun de ces produits n'a donc pu recevoir `cat-bijoux` par erreur via cette voie.
- **0 tag existant supprimé** — chaque produit conserve `bijoux` et `chat-bijouxx` en plus du nouveau `cat-bijoux`.
- **0 prix modifié** — la mutation `tagsAdd` ne peut techniquement pas toucher au prix.
- **0 stock modifié** — idem.
- **0 variante modifiée** — idem.
- **0 image modifiée** — idem.
- **0 statut modifié** — tous restent `ACTIVE`.
- **0 produit publié/republié.**
- **0 commande créée.**
- **0 import CJ.**

## Liste des 147 produits modifiés (cat-bijoux ajouté)

| productId | Titre |
|---|---|
| gid://shopify/Product/16269001654607 | S925 Sterling Silver Three-Stone Drop Earrings, D-VVS1 Moissanite Bezel-Set Dangle, Platinum Plated 1.8g Women's Jewelry Gift Box |
| gid://shopify/Product/16269001851215 | S925 Sterling Silver Pave Huggie Hoop Earrings, 86 D-VVS1 Moissanite, Platinum Plated 1.7g Women's Jewelry Gift Box |
| gid://shopify/Product/16269002309967 | S925 Sterling Silver Gold Plated Single Row Huggie Earrings, 36 D-VVS1 Moissanite, 4.7g Women's Jewelry Gift Box |
| gid://shopify/Product/16269002670415 | S925 Sterling Silver Emerald Cut Moissanite Stud Earrings, 0.8&1ct D-VVS1, Platinum Plated 1g Women's Jewelry Gift Box |
| gid://shopify/Product/16269003030863 | S925 Sterling Silver Star Stud Earrings, 3mm D-VVS1 Moissanite, Platinum Plated 2.1g Women's Jewelry Gift Box |
| gid://shopify/Product/16269003489615 | S925 Sterling Silver Teardrop Necklace, 1ct D-VVS1 Moissanite & Lab-Grown Gems, Platinum Plated 4g With GRA Certificate Gift Box |
| gid://shopify/Product/16269003751759 | S925 Sterling Silver Teardrop Halo Necklace, 1ct D-VVS1 Moissanite & Lab-Grown Gems, Platinum Plated 1.7g With GRA Certificate Gift Box |
| gid://shopify/Product/16269009486159 | S925 Sterling Silver Pave Hoop Earrings, 46 D-VVS1 Moissanite, Platinum Plated 3g, Women's Fine Jewelry Gift Box |
| gid://shopify/Product/16269034127695 | Retro Floral Rhinestone-studded Tassel Stud Earrings |
| gid://shopify/Product/16269062013263 | S925 Sterling Silver Bow Tassel Dangle Earrings, 8x6mm Lab-Grown Ruby & Emerald, Platinum Plated 8.1g Women's Luxury Jewelry Gift Box |
| gid://shopify/Product/16269078200655 | S925 Sterling Silver Bowknot Heart Necklace, 5ct 11mm Lab-Grown Ruby, Platinum Plated 45cm Chain, 3.5g Women's Fine Jewelry Gift Box |
| gid://shopify/Product/16269105693007 | S925 Sterling Silver Rose Drop Earrings, 8mm 6ct Lab-Grown Ruby Sapphire Emerald, Platinum Plated 5g Women's Jewelry Gift Box |
| gid://shopify/Product/16269131514191 | S925 Sterling Silver Butterfly Stud Earrings, 5x2.5mm Marquise Lab-Grown Ruby Sapphire Emerald, Platinum Plated 1.7g Fine Jewelry Gift Box |
| gid://shopify/Product/16269164904783 | S925 Sterling Silver Art Deco Fan Drop Earrings, 8x6mm Lab-Grown Ruby Emerald Paraiba & Blue Diamond, Platinum Plated 5g Women's Fine Jewelry Gift Box |
| gid://shopify/Product/16269189906767 | S925 Sterling Silver Teardrop Pendant Necklace, 11x7mm Lab-Grown Ruby & Emerald, Platinum Plated 45cm, 3.7g Women's Jewelry Gift Box |
| gid://shopify/Product/16269220675919 | S925 Sterling Silver Floral Halo Pendant Necklace, 10x8mm Lab-Grown Ruby Sapphire Emerald, Platinum Plated 45cm Chain, 5g Gift Box |
| gid://shopify/Product/16269259735375 | S925 Sterling Silver Clover Necklace, 2.6ct Lab-Grown Ruby Sapphire Emerald Padparadscha, Platinum Plated 45cm, 4.3g Gift Box |
| gid://shopify/Product/16269292405071 | S925 Sterling Silver Lab-Grown Emerald Cut Drop Earrings, 6x8mm 6ct Ruby Sapphire Emerald, Platinum Plated 5.2g Women's Jewelry Gift Box |
| gid://shopify/Product/16269310558543 | European And American Pearl Tassel Conch Stud Earrings |
| gid://shopify/Product/16269325435215 | S925 Sterling Silver Bow Stud Earrings, 1ct D-VVS1 Moissanite, Platinum Plated 3.1g Women's Jewelry With GRA Certificate Gift Box |
| gid://shopify/Product/16269334610255 | S925 Sterling Silver 1&2ct Moissanite Ring, D-VVS1 Geometric Double-Band Design, Platinum Plated, US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269336805711 | S925 Silver Gold Plated Layered Necklace, Paperclip Coin & Cross Y-Drop, 0.1ct D-VVS1 Moissanite, 14.4g Jewelry Gift Box |
| gid://shopify/Product/16269337723215 | S925 Sterling Silver Clover Drop Huggie Earrings, 0.1ct D-VVS1 Moissanite, Platinum Plated 3.8g Women's Jewelry With GRA Certificate Gift Box |
| gid://shopify/Product/16269338771791 | S925 Sterling Silver Lab-Grown Emerald Drop Earrings, 7x5mm Square Cut With Pave Chain, Platinum Plated 4.2g Women's Jewelry Gift Box |
| gid://shopify/Product/16269339492687 | S925 Sterling Silver 1ct Moissanite Engagement Ring, D-VVS1 Round Cut, Platinum Plated, 6-Prong Heart Setting, US Sizes 5-9 With GRA Certificate Gift Box |
| gid://shopify/Product/16269339558223 | S925 Sterling Silver Lab-Grown Ruby Necklace, 6.5mm Round Gemstone Diamond-Shaped Halo Pendant, 45cm Chain, Women's Jewelry Gift Box |
| gid://shopify/Product/16269339885903 | S925 Sterling Silver 10x12mm Lab-Grown Ruby Sapphire Emerald Halo Pendant Necklace, Platinum Plated 40&45cm Chain, 5.5g Women's Jewelry Gift Box |
| gid://shopify/Product/16269340016975 | S925 Silver Gold Plated Layered Necklace, 7x11mm Pear D-VVS1 Moissanite, 10.8g Triple Chain Fine Jewelry With GRA Certificate Gift Box |
| gid://shopify/Product/16269340213583 | S925 Sterling Silver 2ct Moissanite Men's Ring, D-VVS1 Octagon Bezel, Matte Pave Band, US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269340311887 | S925 Sterling Silver Wide Band Moissanite Ring, 1&2ct D-VVS1 Split Shank Pave Design, Platinum Plated US Sizes 5-9, GRA Certified Gift Box |
| gid://shopify/Product/16269340410191 | S925 Sterling Silver Lab-Grown Ruby Bracelet, 8x6mm Emerald Cut Halo Adjustable Cuban Chain, Platinum Plated 5.4g Women's Jewelry Gift Box |
| gid://shopify/Product/16269340639567 | S925 Sterling Silver Men's Wide Band Moissanite Ring, 1&2ct D-VVS1 Brushed Finish With Pave Accents, Platinum Plated US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269340836175 | S925 Sterling Silver Lab-Grown Ruby Sapphire Necklace, 8x6mm Oval With Marquise Cluster, Platinum Plated 40&45cm Chain, 5g, Gift Box |
| gid://shopify/Product/16269341163855 | S925 Sterling Silver Bowknot Dangle Earrings, 6x4mm Pear Lab-Grown Ruby Sapphire Emerald, Platinum Plated 4.5g Women's Jewelry Gift Box |
| gid://shopify/Product/16269341491535 | S925 Sterling Silver Halo Drop Earrings, 1ct D-VVS1 Moissanite, Lever Back Dangle With Pave Detail, Platinum Plated 3.3g, GRA Certificate Gift Box |
| gid://shopify/Product/16269342114127 | S925 Sterling Silver Cluster Stud Earrings, 3.5mm Lab-Grown Ruby Sapphire Emerald Halo, Platinum Plated 2.2g Women's Jewelry Gift Box |
| gid://shopify/Product/16269342605647 | S925 Sterling Silver Bowknot Stud Earrings, 6x6mm Lab-Grown Ruby&Emerald With Mixed Pave Ribbon, Platinum Plated 3.2g Women's Jewelry Gift Box |
| gid://shopify/Product/16269343752527 | S925 Sterling Silver 1ct Moissanite Engagement Ring, D-VVS1 Round Cut With Heart Setting & Pave Band, Platinum Plated, US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269344407887 | S925 Sterling Silver 1ct Marquise Moissanite Men's Ring, Geometric Silver With Black Accents, Platinum Plated, US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269344735567 | S925 Sterling Silver Wide Band Moissanite Ring, 1&2&3&5ct D-VVS1 Octagon Pave Setting, US Sizes 5-9, GRA Certified Jewelry Gift Box |
| gid://shopify/Product/16269344997711 | S925 Sterling Silver Gold Plated Layered Beaded Necklace, 1ct Pear D-VVS1 Moissanite Pendant, 23.3g Heavyweight Jewelry With GRA Certificate Gift Box |
| gid://shopify/Product/16269345521999 | S925 Sterling Silver Lab-Grown Emerald Flower Stud Earrings, 4x2mm Marquise Cluster, Platinum Plated 1.4g, Women's Jewelry Gift Box |
| gid://shopify/Product/16269345980751 | S925 Sterling Silver Y Drop Necklace, 5x3mm Lab-Grown Ruby Flower Dangle, Platinum Plated 3.7g Women's Elegant Jewelry Gift Box |
| gid://shopify/Product/16269346406735 | S925 Sterling Silver Geometric Necklace, 6x4mm Lab-Grown Ruby & Emerald, Platinum Plated Minimalist Chain, 2g Women's Jewelry Gift Box |
| gid://shopify/Product/16269346963791 | S925 Sterling Silver Teardrop Dangle Earrings, 7x11mm Lab-Grown Ruby Sapphire Emerald, Platinum Plated 4.5g Women's Jewelry Gift Box |
| gid://shopify/Product/16269347389775 | S925 Sterling Silver Wide Band Moissanite Ring, 1&2ct D-VVS1 Bezel Set With Pave Edges, US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269347815759 | S925 Sterling Silver Bowknot Stud Earrings, 1ct D-VVS1 Moissanite, Pave Ribbon Design, Platinum Plated 3.5g, GRA Certified Jewelry Gift Box |
| gid://shopify/Product/16269348012367 | S925 Sterling Silver V-Shape Halo Drop Earrings, 6x4mm Lab-Grown Ruby & Emerald, Platinum Plated 2.6g, Women's Jewelry Gift Box |
| gid://shopify/Product/16269348372815 | S925 Sterling Silver 3-Stone Graduated Stud Earrings, 1ct D-VVS1 Moissanite Journey Earrings, Platinum Plated 2.5g With GRA Certificate Gift Box |
| gid://shopify/Product/16269348700495 | S925 Sterling Silver Three-Stone Curved Stud Earrings, 0.5ct D-VVS1 Moissanite, Platinum Plated 2.1g With GRA Certificate Gift Box |
| gid://shopify/Product/16269348995407 | S925 Sterling Silver 3ct D-VVS1 Moissanite Stud Earrings, Cushion Halo Platinum Plated Jewelry With GRA Certificate Gift Box |
| gid://shopify/Product/16269349224783 | S925 Sterling Silver 1ct Moissanite Men's Ring, D-VVS1 Wide Band With Side Stones, Platinum Plated US Sizes 5-9, GRA Certified Gift Box |
| gid://shopify/Product/16269349552463 | S925 Sterling Silver Moissanite Stud Earrings, 0.5&2ct D-VVS1 4-Prong Basket Pave With Screw Backs, GRA Certificate Gift Box |
| gid://shopify/Product/16269350043983 | S925 Sterling Silver Heart Huggie Earrings, 0.1ct D-VVS1 Moissanite, Platinum Plated 5.6g Romantic Women's Jewelry Gift Box |
| gid://shopify/Product/16269350437199 | S925 Sterling Silver 1ct Moissanite Engagement Ring, D-VVS1 6-Prong Solitaire With Pave Collar, US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269350633807 | S925 Sterling Silver Tennis Bracelet, 6.5mm Lab-Grown Ruby Sapphire Emerald Halo Adjustable Chain, Platinum Plated 3.5g Women's Jewelry Gift Box |
| gid://shopify/Product/16269350699343 | S925 Sterling Silver Lab-Grown Emerald Necklace, 9x7mm Oval Cut Interwoven Pendant, Platinum Plated 40&45cm Chain, 5g Women's Jewelry Gift Box |
| gid://shopify/Product/16269350961487 | S925 Sterling Silver Abstract Flower Stud Earrings, 0.5ct D-VVS1 Moissanite, Platinum Plated Hollow Petal Design, With GRA Certificate Gift Box (titre live sans le suffixe " Gift Box" final — voir note Étape 1) |
| gid://shopify/Product/16269351092559 | S925 Sterling Silver 1ct Moissanite Engagement Ring, D-VVS1 Round Cut 6-Prong Twisted Band, Platinum Plated US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269351289167 | S925 Sterling Silver 1ct Marquise Moissanite Men's Ring, Wide Band With Pave Accents, Platinum Plated, US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269351420239 | S925 Sterling Silver Teardrop Dangle Earrings, 7x11mm Lab-Grown Ruby Sapphire Emerald With Halo, Platinum Plated 3.2g Women's Jewelry Gift Box |
| gid://shopify/Product/16269351682383 | Minimalist Zircon-Inlaid Vintage Pendant Earrings |
| gid://shopify/Product/16269351780687 | Colorful Flower Acrylic Earrings Double-sided Printed And Three-dimensional |
| gid://shopify/Product/16269351944527 | S925 Sterling Silver Teardrop Halo Necklace, 1ct Moissanite & Lab-Grown Ruby&Emerald, Platinum Plated Pendant With GRA Certificate Gift Box |
| gid://shopify/Product/16269352304975 | S925 Sterling Silver Lab-Grown Ruby Emerald Necklace, 13x9mm Pear Double Halo Pendant, Platinum Plated 40&45cm Chain, 5.8g Women's Gift Box |
| gid://shopify/Product/16269352436047 | S925 Sterling Silver Star Flower Stud Earrings, 3.5mm Lab-Grown Emerald, Platinum Plated 1g Women's Lightweight Jewelry Gift Box |
| gid://shopify/Product/16269352632655 | S925 Sterling Silver 2ct Lab-Grown Ruby Emerald Pendant Necklace, Platinum Plated Square Halo With Split Pave Bail, Women's Fine Jewelry Gift Box |
| gid://shopify/Product/16269352730959 | 925 Sterling Silver 4-carat Marquise-cut Diamond Moissanite Ring For Women |
| gid://shopify/Product/16269353288015 | Vintage Coffee-colored Electroplated Earring And Ring Set Jewelry |
| gid://shopify/Product/16269353419087 | S925 Sterling Silver Heart Moissanite Necklace, 1ct D-VVS1 Pendant With Pave Bar, Platinum Plated 40&45cm Chain, 4.2g GRA Certificate Gift Box |
| gid://shopify/Product/16269353451855 | S925 Sterling Silver Moissanite Cross Necklace, 3.5mm D-VVS1 Pendant, Platinum Plated 40&45cm Chain, 1.7g GRA Certificate Gift Box |
| gid://shopify/Product/16269353582927 | S925 Sterling Silver Rose Gold Double Heart Necklace, D-VVS1 Moissanite Pendant, 40&455cm Adjustable Chain, Women's Jewelry Gift Box With GRA Certificate |
| gid://shopify/Product/16269353779535 | S925 Sterling Silver Star & Moon Necklace, D-VVS1 Moissanite Pave Pendant, Platinum Plated 38&41cm Chain, 1.6g Jewelry Gift Box With GRA Certificate |
| gid://shopify/Product/16269354074447 | S925 Sterling Silver Heart Halo Stud Earrings, 5mm Lab-Grown Ruby Sapphire, Platinum Plated 1.5g, Women's Jewelry Gift Box |
| gid://shopify/Product/16269354205519 | S925 Sterling Silver Clover Stud Earrings, 3.5mm Lab-Grown Emerald, Platinum Plated 2g Lightweight Women's Jewelry Gift Box |
| gid://shopify/Product/16269355123023 | S925 Sterling Silver Princess & Pear Cut Two-Stone Necklace, 1ct D-VVS1 Moissanite Pendant, Platinum Plated 40&45cm Chain, GRA Certified Women's Jewelry Gift Box |
| gid://shopify/Product/16269356302671 | S925 Sterling Silver 1ct Moissanite Necklace, Minimalist Bezel Setting Pendant, Platinum Plated 38.5&42m Chain, Women's Jewelry Gift Box With GRA Certificate |
| gid://shopify/Product/16269357318479 | Womens Watermelon Kiwi Earrings |
| gid://shopify/Product/16269358104911 | S925 Sterling Silver 2ct Princess Cut Moissanite Ring, 7x7mm D-VVS1 Pave Band, Platinum Plated US Sizes 5-9, GRA Certificate Jewelry Gift Box |
| gid://shopify/Product/16269358858575 | S925 Sterling Silver 2ct Princess Cut Moissanite Ring, D-VVS1 Cluster Halo With Split Shank, Platinum Plated US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269359546703 | S925 Sterling Silver 1ct Green Moissanite Ring, 6x6mm Square Cut VVS1 Solitaire, Platinum Plated US Sizes 5-9, GRA Certified Jewelry Gift Box |
| gid://shopify/Product/16269360333135 | S925 Sterling Silver 3ct Moissanite Ring, 9mm Round Cut 6-Prong, D-VVS1 Platinum Plated US Sizes 5-9, GRA Certified Gift Box |
| gid://shopify/Product/16269361480015 | S925 Sterling Silver 2ct Moissanite Ring, 8mm D-VVS1 Round Cut With Floral Accent Band, Platinum Plated US Sizes 5-9, GRA Certified Gift Box |
| gid://shopify/Product/16269362790735 | S925 Sterling Silver 4ct Emerald Cut Moissanite Ring, D-VVS1 Pave Band, Platinum Plated US Sizes 5-9, GRA Certified Jewelry Gift Box |
| gid://shopify/Product/16269364003151 | S925 Sterling Silver Marquise Moissanite Ring, 1ct D-VVS1 Double Halo P Ink Accent, Platinum Plated 5.3g US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269364887887 | S925 Sterling Silver 2.5ct Asscher Cut Moissanite Ring, D-VVS1 Halo Chain Band, Platinum Plated US Sizes 5-9 GRA Gift Box |
| gid://shopify/Product/16269365903695 | S925 Sterling Silver 5ct Moissanite Engagement Ring, 11mm D-VVS1 Round Cut, 4-Prong Pave Band, Platinum Plated US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269366722895 | S925 Sterling Silver 2ct Princess Cut Moissanite Ring, D-VVS1 Double Halo Cluster, Platinum Plated 5.8g US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269367509327 | S925 Sterling Silver 4ct Pear Moissanite Ring, D-VVS1 Double Halo Setting, Platinum Plated 8.9g US Sizes 5-9, GRA Certified Gift Box |
| gid://shopify/Product/16269368688975 | S925 Sterling Silver 1ct Moissanite Ring, D-VVS1 Round Cut Geometric V-Halo, Platinum Plated 3g US 5-9 GRA Gift Box |
| gid://shopify/Product/16269369540943 | S925 Sterling Silver 1ct Heart Cut Moissanite Ring, 5x8mm D-VVS1 Split Shank Pave Halo, Platinum Plated US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269370556751 | New Irregular Round Rose Petal Dried Flower Earrings |
| gid://shopify/Product/16269371244879 | 6-Prong 2 Carat Round Moissanite Engagement Ring, Split Shank S925 Silver Platinum Plated D Color VVS1 With GRA Certificate, US 5-9. |
| gid://shopify/Product/16269372195151 | S925 Sterling Silver 2ct Moissanite Ring, 8mm D-VVS1 Double Halo Pave Band, Platinum Plated US Sizes 5-9 GRA Certified Gift Box |
| gid://shopify/Product/16269373309263 | S925 Sterling Silver 3ct Moissanite Ring, 9mm D-VVS1 Star Halo Split Shank, Platinum Plated US Sizes 5-9, GRA Certified Gift Box |
| gid://shopify/Product/16269374423375 | Princess Cut Moissanite Engagement Ring Set S925 Silver, 1 Carat D Color VVS1 Wedding Band With GRA Certificate, US Size 5-9. |
| gid://shopify/Product/16269375111503 | S925 Sterling Silver 2ct Moissanite Ring, 8mm D-VVS1 Sunflower Halo Setting, Platinum Plated 5.3g US Sizes 5-9 GRA Gift Box |
| gid://shopify/Product/16269375799631 | Heart Bow Tie Moissanite Promise Ring, 1 Carat D Color VVS1 Two-Stone S925 Silver Platinum Plated Ring With GRA Certificate, US Size 5-9. |
| gid://shopify/Product/16269376618831 | S925 Sterling Silver 1ct Moissanite Ring, 6.5mm D-VVS1 Round Cut, Halo Twist Band, US Sizes 5-9, GRA Certified Gift Box |
| gid://shopify/Product/16269377208655 | S925 Sterling Silver 2ct Oval Moissanite Ring, 7x9mm D-VVS1 Double Halo, Platinum Plated 5.3g US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269377896783 | S925 Sterling Silver 8ct Moissanite Ring, 10x12mm D-VVS1 Contrast Black Pave Band, Platinum Plated US Sizes 5-9 GRA Gift Box |
| gid://shopify/Product/16269378683215 | S925 Sterling Silver 3-Row Pave Moissanite Ring, 1.9ct D-VVS1 Eternity Band, Platinum Plated US Sizes 5-9, GRA Certified Gift Box |
| gid://shopify/Product/16269379207503 | 3 Carat Emerald Cut Moissanite Engagement Ring, Double Halo Split Shank S925 Silver Platinum Plated D Color VVS1 With GRA, US 5-9. |
| gid://shopify/Product/16269379830095 | S925 Sterling Silver 2ct Round Moissanite Ring, 8mm D-VVS1 6-Prong Pave Band, Platinum Plated US Sizes 5-9, GRA Certificate Gift Box |
| gid://shopify/Product/16269380288847 | 2 Carat Round Moissanite Engagement Ring, 3-Stone S925 Silver Platinum Plated, D Color VVS1 With GRA Certificate, US Size 5-9. |
| gid://shopify/Product/16269381009743 | 3 Carat Oval Moissanite Engagement Ring, Double Halo S925 Silver Platinum Plated 8x10mm D Color VVS1 With GRA Certificate, US Size 5-9. |
| gid://shopify/Product/16269381632335 | 5-Stone Moissanite Wedding Band Ring, 4mm&5 D Color VVS1 S925 Silver Platinum Plated Anniversary Ring With GRA, US 5-9. |
| gid://shopify/Product/16269382156623 | S925 Sterling Silver 5ct Moissanite Ring, 11mm D-VVS1 Wide Band, Platinum Plated 7.7g US Sizes 5-9 GRA Gift Box |
| gid://shopify/Product/16269382680911 | S925 Sterling Silver 1ct D Color VVS1 Moissanite Ring Set 6.5mm Stone Platinum Plated GRA Certified US Size 5-9 Gift Box |
| gid://shopify/Product/16269383500111 | Electroplated Flower Stud Earrings Multi-layered Hoop Rings |
| gid://shopify/Product/16269384024399 | S925 Silver Heart-shaped Necklace With Engraved Double Heart Pendant |
| gid://shopify/Product/16269384745295 | Dark-style Hip-hop Trendy Unisex Personalized Ear Studs Jewelry |
| gid://shopify/Product/16269385564495 | Ethnic Style Six Character Mantra Bracelet |
| gid://shopify/Product/16269386383695 | Double-sided Through-hole Heart Spacer Pendant For DIY Bracelet Jewelry |
| gid://shopify/Product/16269387399503 | Real Gold Fine-grain Three-dimensional Slanted Butterfly Pendant |
| gid://shopify/Product/16269388513615 | Bridal Jewelry Clavicle Necklace And Earrings Two-piece Set |
| gid://shopify/Product/16269389234511 | Bohemian Pendant Necklace And Bracelet Jewelry Set |
| gid://shopify/Product/16269390184783 | Fashionable Minimalist Stud Earrings Chic And Delicate Ear Cuffs |
| gid://shopify/Product/16269391593807 | Sweet And Edgy Zircon Heart Ring Clavicle Chain Necklace |
| gid://shopify/Product/16269392314703 | Copper Venetian Garden Floral Bar Earrings |
| gid://shopify/Product/16269393035599 | Stainless Steel Double-ring Earrings Light Luxury And High-end Autumnwinter Ear Accessories |
| gid://shopify/Product/16269393690959 | Sterling Silver Hoop Earrings S925 Fashion Trend |
| gid://shopify/Product/16269394182479 | Natural Stone Creative Fashion Earrings |
| gid://shopify/Product/16269395296591 | S925 Sterling Silver Necklace With Twelve Birthstone Pendants, A Light-luxury, Niche Design |
| gid://shopify/Product/16269395657039 | Natural Stone Silver Glittering Amethyst Earrings |
| gid://shopify/Product/16269396083023 | Cow-themed Wind Chime Japanese-style Pendant With A Refined Design-conscious Flair |
| gid://shopify/Product/16269396607311 | High-end Cute Little Bear Animal Stud Earrings, Made Of Copper |
| gid://shopify/Product/16269396902223 | S925 Silver Necklace Internet-celebrity StyleMinimalist Gold ChainLight LuxuryNicheHigh-end |
| gid://shopify/Product/16269397229903 | Affordable Luxury Niche Minimalist Elegant Versatile Necklace |
| gid://shopify/Product/16269397524815 | Exaggerated Fully Diamond-studded Sparkling Hoop Earrings |
| gid://shopify/Product/16269397786959 | S925 Sterling Silver Ring With Moissanite Minimalist And Fashionable |
| gid://shopify/Product/16269398180175 | S925 Sterling Silver Chain, O-link Chain, Silver Wire, Silver Necklace |
| gid://shopify/Product/16269398376783 | S925 Silver Vintage Ring For Men Adjustable And Trendy |
| gid://shopify/Product/16269398638927 | Vintage European And American Diamond-Encrusted Earring Set |
| gid://shopify/Product/16269398966607 | Irregular Pendant Moissanite Niche Light Luxury High-end Feel S925 Sterling Silver |
| gid://shopify/Product/16269399228751 | Stainless Steel Stud Earrings Personalized Light Luxury Vintage 18k Gold-plated |
| gid://shopify/Product/16269399753039 | S925 Sterling Silver Moissanite Ring Horse Eye Design |
| gid://shopify/Product/16269400113487 | 925 Sterling Silver Ring With 3 Carat Oval Moissanite Stone Women's Elegant Wedding Band Lightweight Luxury Jewelry Gift |
| gid://shopify/Product/16269400408399 | S925 Sterling Silver 7x7mm Square Moissanite Necklace 40-45cm D Color VVS1 Geometric Cluster Silver Gold Dual Tone GRA Certified Gift Box |
| gid://shopify/Product/16269400637775 | S925 Sterling Silver Marquise Cut D Color VVS1 Moissanite Butterfly Necklace Silver Gold Dual Tone 40-455cm GRA Certified Gift Box |
| gid://shopify/Product/16269401194831 | S925 Sterling Silver Pave Circle Moissanite Necklace 40-45cm D Color VVS1 Silver Gold Dual Tone GRA Certified Gift Box |
| gid://shopify/Product/16269401588047 | S925 Sterling Silver 7pcs 3.0mm Round Cluster Moissanite Necklace 40-45cm D Color VVS1 Silver Gold Dual Tone Platinum Plated GRA Certified Gift Box |
| gid://shopify/Product/16269401784655 | S925 Sterling Silver Pave Clover Moissanite Necklace 40-45cm D Color VVS1 Silver Gold Dual Tone GRA Certified Gift Box |
| gid://shopify/Product/16269402177871 | S925 Sterling Silver 5.0mm Round Moissanite Necklace 45cm D Color VVS1 Spiral Swirl Design Silver-Gold Dual Tone GRA Certified Gift Box |
| gid://shopify/Product/16269402308943 | S925 Sterling Silver Pave Cross Moissanite Necklace 3.0mm Center D Color VVS1 40-45cm Silver Gold Dual Tone GRA Certified Gift Box |
| gid://shopify/Product/16269402538319 | S925 Sterling Silver D Color VVS1 Moissanite Hoop Earrings 20mm Single Row Pave Platinum Plated GRA Certified Gift Box |
| gid://shopify/Product/16269402571087 | S925 Sterling Silver Marquise Moissanite Clover Necklace 45cm D Color VVS1 GRA Certified Silver Gold Dual Tone Gift Box |

## Produits déjà tagués avant mutation

Aucun — 0/147 (voir Étape 1).

## Erreurs

Aucune — 0 `userError` retournée par Shopify sur les 147 mutations.

## Détail complet

Le détail machine-readable (avant/après par produit, listes complètes) est disponible dans `reports/shopify-jewelry-tag-mutation-report.json`.

---

SHOPIFY MODIFIÉ UNIQUEMENT POUR AJOUTER cat-bijoux
147 PRODUITS HIGH VÉRIFIÉS
0 PRODUIT LOW MODIFIÉ
0 WEARABLE MODIFIÉ
TAGS EXISTANTS CONSERVÉS
PRIX/STOCK/VARIANTES/IMAGES/STATUTS INCHANGÉS
