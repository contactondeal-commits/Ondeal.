# PHASE 1 — Recherche CJ réelle (Plan V2)

_Généré le 2026-08-12 suite à la validation utilisateur : « Je valide le plan V2. Lance la Phase 1 de recherche CJ réelle sur les 700 candidats selon la répartition du rapport. Aucun import Shopify, aucune publication et aucune modification du catalogue sans mon autorisation ultérieure. »_

## 1. Résumé

- **Objectif total à rechercher** : 700
- **Total réellement collecté (recherche CJ réelle + filtre de pertinence strict)** : 578
- **Manque** : 122 (documenté catégorie par catégorie ci-dessous, jamais comblé artificiellement)
- **8 catégories sur 14 ont atteint 100% de leur objectif** ; 6 restent sous objectif (voir tableau).

## 2. Méthodologie

Recherche réelle via l'API CJdropshipping (product/list), une requête à la fois, respectant la limite de débit (1 requête / 1.1s min, avec retry automatique sur 429). Chaque résultat brut est passé par un filtre de pertinence sémantique strict par catégorie (inclusion = vrai terme produit du bon type, exclusion = signaux contradictoires connus) construit à partir des enseignements de l'audit Phase 2.5 (les mots-clés seuls, sans validation sémantique, produisent énormément de faux positifs : ex. 'mouse' remonte des pièges à souris, 'tablet' remonte des comprimés/médicaments, 'monitor' remonte des moniteurs de tension artérielle, 'mobile'/'phone' remontent des climatiseurs mobiles et des coques de téléphone, 'screen' remonte des moustiquaires de porte, etc.). Seuls les produits passant ce filtre sont conservés dans le pool RECHERCHÉ. Dédoublonnage par CJ productId et par titre normalisé. Recherche arrêtée par catégorie dès l'objectif atteint, ou après épuisement raisonnable des requêtes/pages disponibles (jamais de fabrication de candidats).

Ceci est la couche RECHERCHÉ uniquement (produits à examiner/comparer), pas encore SÉLECTIONNÉ ni IMPORTÉ (voir regleRechercheVsSelectionVsImport dans le plan V2). Certaines catégories (Téléphones, Vidéoprojecteurs, Écrans, Tablettes, Chaussures homme, Accessoires femme) restent sous leur objectif malgré des requêtes multiples et des pages épuisées : le catalogue CJ réellement accessible par mot-clé pour ces familles de produits est plus restreint que l'objectif fixé dans le plan V2, ou la recherche CJ elle-même renvoie une majorité de résultats hors-sujet (moteur de recherche CJ approximatif, confirmé empiriquement le 12/08/2026 : la recherche ne fait pas de correspondance exacte de phrase et mélange des résultats peu pertinents même pour des requêtes ciblées).

## 3. Résultat par catégorie

| Catégorie | Objectif (RECHERCHÉ) | Collecté | Manque | Requêtes utilisées |
|---|---:|---:|---:|---|
| Chaussures (femme) | 110 | 110 | 0 | women's sneakers shoes, women's sandals shoes, women's boots shoes, women's flat shoes, women's slippers shoes, women's loafers shoes |
| Chaussures (homme) | 100 | 87 | 13 | men's sneakers shoes, men's sandals shoes, men's boots shoes, men's casual shoes, men's slippers shoes, men's loafers shoes |
| Tablettes | 35 | 21 | 14 | android tablet, tablet pc, kids tablet |
| Téléphones | 30 | 6 | 24 | smartphone unlocked, mobile phone unlocked, rugged phone |
| Vidéoprojecteurs | 60 | 14 | 46 | mini projector 1080p, portable home theater projector, led video projector, smart wifi projector |
| Rangement | 90 | 90 | 0 | closet storage organizer box, drawer organizer storage, wardrobe storage box, storage rack shelf, underbed storage bag |
| Vêtements mixte / unisexe | 70 | 70 | 0 | unisex hoodie, unisex sweatshirt, unisex t-shirt, unisex jacket |
| Bijoux (catégorie proposée) | 50 | 50 | 0 | stainless steel fashion jewelry, fashion costume jewelry set, minimalist jewelry set |
| Accessoires (femme) | 40 | 24 | 16 | women belt fashion, women scarf fashion, women sunglasses fashion, women wallet fashion |
| Accessoires (homme) | 30 | 30 | 0 | men belt fashion, men wallet fashion, men sunglasses fashion, men baseball cap |
| Sacs (femme) | 30 | 30 | 0 | women handbag, women tote bag, women crossbody bag |
| Parfums | 20 | 20 | 0 | unisex eau de parfum, fragrance perfume spray generic |
| Écrans | 20 | 11 | 9 | monitor, portable monitor, usb c monitor |
| Souris | 15 | 15 | 0 | wireless mouse, ergonomic gaming mouse |

## 4. Catégories sous objectif — explication

- **Téléphones (6/30)** : le moteur de recherche CJ renvoie majoritairement des accessoires (coques, gimbals, chargeurs, cartes SD, gadgets « compatibles smartphone ») plutôt que de vrais téléphones lorsqu'on cherche « smartphone »/« mobile phone ». Les vrais téléphones génériques trouvés respectent la consigne du plan V2 (pas de flagship, pas de nom imitant Apple/Samsung — les fiches au nommage type « 16 Pro Max »/« Ultra » ont été volontairement écartées car elles imitent le nommage iPhone/Samsung, risque de contrefaçon).
- **Vidéoprojecteurs (14/60)** : confirme le constat déjà fait en Phase 2.5 — CJ vend surtout des veilleuses/lampes décoratives « starry sky projector », des feux antibrouillard automobiles « LED projector » et des enceintes de type Anycast sous le mot « projector ». Le nombre de vrais vidéoprojecteurs (image/vidéo) identifiables reste limité malgré plusieurs requêtes.
- **Écrans (11/20)** : le mot « monitor »/« screen » est extrêmement ambigu chez CJ (moniteur de tension artérielle, écran de porte anti-moustique, écran de vélo d'appartement, etc.). Seuls les vrais moniteurs portables USB-C (marque UPERFECT en tête) ont été retenus.
- **Tablettes (21/35)** : le mot « tablet » est très majoritairement utilisé pour des comprimés/pastilles (médicaments, produits ménagers) chez CJ plutôt que des tablettes tactiles.
- **Chaussures homme (87/100)** et **Accessoires femme (24/40)** : recherche exhaustée après de nombreuses pages ; la marge restante correspond à du contenu réellement hors sujet (chaussures femme classées par erreur sous les requêtes homme, bijoux/vêtements classés comme accessoires) qui a été rejeté par le filtre de pertinence plutôt que conservé pour atteindre le chiffre.

## 5. Sécurité / garde-fous

- `shopifyWrites` : **0**
- `productsImported` : **0**
- `productsPublished` : **0**
- `catalogModified` : **0**
- `newCjWritesOrOrders` : **0**

Recherche CJ en lecture seule uniquement (product/list). Aucune écriture Shopify, aucune publication, aucune modification du catalogue — conforme à l'instruction explicite de l'utilisateur.

## 6. Prochaine étape (non lancée)

Phase 2 (non lancée, en attente d'autorisation) : évaluation détaillée de chaque candidat RECHERCHÉ (fiche produit complète, variantes, stock réel par entrepôt, prix, marge, images) puis SÉLECTION du meilleur sous-ensemble par catégorie (voir toSelectImport dans phase1CJ du plan V2 — total 308 à sélectionner sur les 700 recherchés). L'IMPORT en DRAFT Shopify ne pourra intervenir qu'après cette sélection ET une nouvelle autorisation explicite de l'utilisateur.

## 7. Détail des candidats

Voir `reports/cj-phase1-recherche-v2.json` (champ `candidates`) pour la liste complète des 578 candidats (pid CJ, sku, titre, catégorie, requête source). Aucune fiche détaillée (description complète, variantes, stock, prix) n'a encore été récupérée à ce stade — c'est l'objet de la Phase 2 (évaluation + sélection), non lancée.
