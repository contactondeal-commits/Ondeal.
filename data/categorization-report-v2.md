# Rapport de catégorisation V2 — catalogue ACTIVE Ondeal

Généré le 2026-08-12T16:55:38.782Z

Seconde passe : intègre les 4 nouvelles catégories validées (Vêtements mixte/unisexe, Rangement, Vidéoprojecteurs, Bien-être/Massage) et des correctifs de précision (compatibilité, priorité au produit principal, désambiguïsation de genre pour les vêtements).

## 1. État initial (sécurité)

- ACTIVE : 893 — confirmé via l'outil MCP `mcp__Shopify__graphql_query` plus tôt dans cette session (pagination complète `status:active`, 18 pages, 893 produits uniques récupérés — voir `data/raw-active-products/page-*.json`).
- ARCHIVED : 7175 (ignorés, non modifiés) — confirmé via l'outil MCP plus tôt dans cette session, **non re-vérifié en fin de script** pour économiser des appels API. L'API Shopify Admin `products` n'expose pas de champ de comptage exact direct (pas de `totalCount`) ; un comptage exact nécessiterait de paginer l'intégralité des 7175 produits ARCHIVED, ce qui n'apporterait aucune valeur pour cette mission (ils ne sont jamais lus ni modifiés).
- DRAFT : 301 (ignorés, non modifiés) — même remarque que ci-dessus.
- **Garantie principale** : ce script (`scripts/normalize-and-categorize.ts`) ne fait AUCUN appel réseau — il lit uniquement des fichiers JSON déjà sauvegardés sur disque. La récupération des données (script précédent de cette session, via l'outil MCP `graphql_query`) n'a utilisé QUE des requêtes en lecture (`query: "status:active"`), jamais `graphql_mutation`. 0 écriture Shopify, 0 produit ARCHIVED touché, 0 produit DRAFT publié.

## 2. Catégorisation

- Total analysé : 893
- Doublons d'id détectés et ignorés : 0
- HIGH : 462
- MEDIUM : 24
- LOW / À_REVOIR : 407
- Sans catégorie (proposedCategoryId=null) : 387

- **Classés grâce aux 4 nouvelles catégories** (vetements-mixte, rangement, videoprojecteurs, bien-etre-massage) : 57

## 2bis. Comparaison V1 → V2

| Indicateur | V1 | V2 | Δ |
|---|---|---|---|
| HIGH | 374 | 462 | +88 |
| MEDIUM | 0 | 24 | +24 |
| LOW | 519 | 407 | -112 |
| Sans catégorie | 446 | 387 | -59 |

## 3. Répartition par catégorie (V2, avec variation vs V1 pour les catégories déjà existantes)

| Catégorie | Nombre de produits | Nouvelle en V2 ? |
|---|---|---|
| homme-montres | 108 | — |
| audio | 54 | — |
| jouets | 33 | — |
| vetements-mixte | 29 | ✅ nouvelle catégorie |
| decoration | 28 | — |
| bebes | 27 | — |
| femme-vetements | 26 | — |
| accessoires-electronique | 22 | — |
| homme-vetements | 22 | — |
| maquillage | 20 | — |
| electromenager | 19 | — |
| photo | 16 | — |
| cuisine | 14 | — |
| bien-etre-massage | 12 | ✅ nouvelle catégorie |
| fitness | 10 | — |
| soins-visage | 10 | — |
| claviers | 9 | — |
| rangement | 8 | ✅ nouvelle catégorie |
| videoprojecteurs | 8 | ✅ nouvelle catégorie |
| mobilier-jardin | 5 | — |
| meubles | 4 | — |
| souris | 3 | — |
| jeux-video | 3 | — |
| ecrans | 3 | — |
| outils-jardin | 3 | — |
| telephones | 2 | — |
| parfums | 2 | — |
| pc-portables | 1 | — |
| tablettes | 1 | — |
| chiens | 1 | — |
| running | 1 | — |
| quincaillerie | 1 | — |
| femme-sacs | 1 | — |

## 4. Catégories sous-représentées (< 20 produits)

- telephones (Téléphones) : 2
- tablettes (Tablettes) : 1
- ordinateurs (Ordinateurs) : 0
- tv (Télévisions) : 0
- photo (Photo) : 16
- videoprojecteurs (Vidéoprojecteurs) : 8
- pc-portables (PC portables) : 1
- pc-fixes (PC fixes) : 0
- ecrans (Écrans) : 3
- claviers (Claviers) : 9
- souris (Souris) : 3
- cuisine (Cuisine) : 14
- meubles (Meubles) : 4
- electromenager (Électroménager) : 19
- rangement (Rangement) : 8
- femme-chaussures (Chaussures) : 0
- femme-sacs (Sacs) : 1
- femme-accessoires (Accessoires) : 0
- homme-chaussures (Chaussures) : 0
- homme-accessoires (Accessoires) : 0
- filles (Filles) : 0
- garcons (Garçons) : 0
- soins-visage (Soins visage) : 10
- parfums (Parfums) : 2
- bien-etre-massage (Bien-être / Massage) : 12
- mobilier-jardin (Mobilier de jardin) : 5
- outils-jardin (Outils) : 3
- barbecue (Barbecue) : 0
- fitness (Fitness) : 10
- running (Running) : 1
- football (Football) : 0
- romans (Romans) : 0
- bd (BD) : 0
- jeunesse-livres (Jeunesse) : 0
- jeux-societe (Jeux de société) : 0
- jeux-video (Jeux vidéo) : 3
- outillage (Outillage) : 0
- quincaillerie (Quincaillerie) : 1
- chiens (Chiens) : 1
- chats (Chats) : 0

## 5. Catégories absentes (0 produit)

- ordinateurs (Ordinateurs)
- tv (Télévisions)
- pc-fixes (PC fixes)
- femme-chaussures (Chaussures)
- femme-accessoires (Accessoires)
- homme-chaussures (Chaussures)
- homme-accessoires (Accessoires)
- filles (Filles)
- garcons (Garçons)
- barbecue (Barbecue)
- football (Football)
- romans (Romans)
- bd (BD)
- jeunesse-livres (Jeunesse)
- jeux-societe (Jeux de société)
- outillage (Outillage)
- chats (Chats)

## 6. Objectif ~3000 — méthode proportionnelle (INDICATIVE UNIQUEMENT, voir limite ci-dessous)

⚠️ Cette table utilise la méthode proportionnelle simple (déjà critiquée en V1 : elle gonfle artificiellement les catégories déjà en excédent, ex. Montres). **Ne pas l'utiliser pour décider du sourcing CJ — voir section 19/20 (table de priorités qualitative) à la place.**

| Catégorie | Actuels | Objectif (proportionnel) | Manque |
|---|---|---|---|
| Téléphones | 2 | 30 | 28 |
| Tablettes | 1 | 30 | 29 |
| Ordinateurs | 0 | 30 | 30 |
| Télévisions | 0 | 30 | 30 |
| Audio | 54 | 320 | 266 |
| Photo | 16 | 95 | 79 |
| Accessoires | 22 | 130 | 108 |
| Vidéoprojecteurs | 8 | 47 | 39 |
| PC portables | 1 | 30 | 29 |
| PC fixes | 0 | 30 | 30 |
| Écrans | 3 | 30 | 27 |
| Claviers | 9 | 53 | 44 |
| Souris | 3 | 30 | 27 |
| Cuisine | 14 | 83 | 69 |
| Meubles | 4 | 30 | 26 |
| Décoration | 28 | 166 | 138 |
| Électroménager | 19 | 113 | 94 |
| Rangement | 8 | 47 | 39 |
| Vêtements | 26 | 154 | 128 |
| Chaussures | 0 | 30 | 30 |
| Sacs | 1 | 30 | 29 |
| Accessoires | 0 | 30 | 30 |
| Vêtements | 22 | 130 | 108 |
| Chaussures | 0 | 30 | 30 |
| Montres | 108 | 640 | 532 |
| Accessoires | 0 | 30 | 30 |
| Bébés | 27 | 160 | 133 |
| Filles | 0 | 30 | 30 |
| Garçons | 0 | 30 | 30 |
| Vêtements mixte / unisexe | 29 | 172 | 143 |
| Soins visage | 10 | 59 | 49 |
| Maquillage | 20 | 119 | 99 |
| Parfums | 2 | 30 | 28 |
| Bien-être / Massage | 12 | 71 | 59 |
| Mobilier de jardin | 5 | 30 | 25 |
| Outils | 3 | 30 | 27 |
| Barbecue | 0 | 30 | 30 |
| Fitness | 10 | 59 | 49 |
| Running | 1 | 30 | 29 |
| Football | 0 | 30 | 30 |
| Romans | 0 | 30 | 30 |
| BD | 0 | 30 | 30 |
| Jeunesse | 0 | 30 | 30 |
| Jeux de société | 0 | 30 | 30 |
| Jouets | 33 | 196 | 163 |
| Jeux vidéo | 3 | 30 | 27 |
| Outillage | 0 | 30 | 30 |
| Quincaillerie | 1 | 30 | 29 |
| Chiens | 1 | 30 | 29 |
| Chats | 0 | 30 | 30 |

## 7. Sécurité

- ARCHIVED touchés : 0 (script en lecture seule sur fichiers disque, aucun appel réseau)
- DRAFT publiés : 0 (script en lecture seule sur fichiers disque, aucun appel réseau)
- Produits supprimés : 0
- Produits archivés : 0
- Produits modifiés dans Shopify : 0 (ce script ne fait aucune écriture, ni même aucun appel réseau)

## 8. Détail complet

Voir data/categorization-report-v2.json (893 entrées, ID Shopify + titre + catégorie proposée + confiance + raison).

## 9. Catégories synonymes/doublons détectées sur les données réelles

Tags `cat-*` rencontrés dans les données brutes Shopify qui ne correspondent PAS à un id valide de `getAllCategoriesFlat()` (`src/data/categories.ts`) — c'est-à-dire soit un synonyme/doublon d'une catégorie existante sous un autre nom, soit une catégorie totalement absente de la taxonomie Ondeal actuelle. Nombre de produits concernés par tag :

| Tag `cat-*` invalide | Nombre de produits |
|---|---|
| cat-montres | 91 |
| cat-jouets-jeux | 87 |
| cat-bricolage-outils | 9 |
| cat-autres | 5 |
| cat-hightech-accessoires | 4 |
| cat-eclairage | 2 |
| cat-sports-plein-air | 1 |
| cat-epicerie-fine | 1 |

## 10. Priorités de sourcing CJ (méthode qualitative — PAS de recherche CJ lancée)

Classification manuelle documentée (voir `PRIORITY_OVERRIDES` dans `scripts/normalize-and-categorize-v2.ts`), volontairement différente d'une simple règle proportionnelle. P1 = catégories structurantes pour une marketplace généraliste actuellement quasi absentes. P2 = intéressantes, couverture faible mais non critique. P3 = déjà correctement couvertes, complément modéré. NONE = déjà bien représentées OU hors positionnement commercial actuel du catalogue (livres, jeux de société, sport de balle...).

| Priorité | Catégorie | Actuels | Objectif proposé | À rechercher CJ |
|---|---|---|---|---|
| P1 | Ordinateurs | 0 | 80 | 80 |
| P1 | Télévisions | 0 | 80 | 80 |
| P1 | Chaussures | 0 | 80 | 80 |
| P1 | Chaussures | 0 | 80 | 80 |
| P1 | Tablettes | 1 | 80 | 79 |
| P1 | Téléphones | 2 | 80 | 78 |
| P1 | Vidéoprojecteurs | 8 | 80 | 72 |
| P1 | Rangement | 8 | 80 | 72 |
| P1 | Vêtements mixte / unisexe | 29 | 80 | 51 |
| P2 | PC fixes | 0 | 50 | 50 |
| P2 | Accessoires | 0 | 50 | 50 |
| P2 | Accessoires | 0 | 50 | 50 |
| P2 | PC portables | 1 | 50 | 49 |
| P2 | Sacs | 1 | 50 | 49 |
| P2 | Running | 1 | 50 | 49 |
| P2 | Parfums | 2 | 50 | 48 |
| P2 | Écrans | 3 | 50 | 47 |
| P2 | Souris | 3 | 50 | 47 |
| P2 | Outils | 3 | 50 | 47 |
| P2 | Jeux vidéo | 3 | 50 | 47 |
| P2 | Meubles | 4 | 50 | 46 |
| P2 | Mobilier de jardin | 5 | 50 | 45 |
| P2 | Claviers | 9 | 50 | 41 |
| P2 | Soins visage | 10 | 50 | 40 |
| P2 | Fitness | 10 | 50 | 40 |
| P2 | Bien-être / Massage | 12 | 50 | 38 |
| P2 | Cuisine | 14 | 50 | 36 |
| P2 | Électroménager | 19 | 50 | 31 |
| P3 | Chats | 0 | 30 | 30 |
| P3 | Quincaillerie | 1 | 30 | 29 |
| P3 | Chiens | 1 | 30 | 29 |
| P3 | Photo | 16 | 30 | 14 |
| P3 | Maquillage | 20 | 30 | 10 |
| P3 | Accessoires | 22 | 30 | 8 |
| P3 | Vêtements | 22 | 30 | 8 |
| P3 | Vêtements | 26 | 30 | 4 |
| P3 | Décoration | 28 | 30 | 2 |

### Catégories à ne PAS prioriser pour le sourcing CJ

- Audio (54 produits actuels)
- Montres (108 produits actuels)
- Bébés (27 produits actuels)
- Filles (0 produits actuels)
- Garçons (0 produits actuels)
- Barbecue (0 produits actuels)
- Football (0 produits actuels)
- Romans (0 produits actuels)
- BD (0 produits actuels)
- Jeunesse (0 produits actuels)
- Jeux de société (0 produits actuels)
- Jouets (33 produits actuels)
- Outillage (0 produits actuels)

**Rappel : aucune recherche CJ n'a été lancée. Ceci est une proposition de stratégie en attente de validation.**
