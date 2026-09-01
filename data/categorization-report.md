# Rapport de catégorisation — catalogue ACTIVE Ondeal

Généré le 2026-08-12T16:27:12.827Z

## 1. État initial (sécurité)

- ACTIVE : 893 — confirmé via l'outil MCP `mcp__Shopify__graphql_query` plus tôt dans cette session (pagination complète `status:active`, 18 pages, 893 produits uniques récupérés — voir `data/raw-active-products/page-*.json`).
- ARCHIVED : 7175 (ignorés, non modifiés) — confirmé via l'outil MCP plus tôt dans cette session, **non re-vérifié en fin de script** pour économiser des appels API. L'API Shopify Admin `products` n'expose pas de champ de comptage exact direct (pas de `totalCount`) ; un comptage exact nécessiterait de paginer l'intégralité des 7175 produits ARCHIVED, ce qui n'apporterait aucune valeur pour cette mission (ils ne sont jamais lus ni modifiés).
- DRAFT : 301 (ignorés, non modifiés) — même remarque que ci-dessus.
- **Garantie principale** : ce script (`scripts/normalize-and-categorize.ts`) ne fait AUCUN appel réseau — il lit uniquement des fichiers JSON déjà sauvegardés sur disque. La récupération des données (script précédent de cette session, via l'outil MCP `graphql_query`) n'a utilisé QUE des requêtes en lecture (`query: "status:active"`), jamais `graphql_mutation`. 0 écriture Shopify, 0 produit ARCHIVED touché, 0 produit DRAFT publié.

## 2. Catégorisation

- Total analysé : 893
- Doublons d'id détectés et ignorés : 0
- HIGH : 374
- MEDIUM : 0
- LOW / À_REVOIR : 519
- Sans catégorie (proposedCategoryId=null) : 446

## 3. Répartition par catégorie

| Catégorie | Nombre de produits |
|---|---|
| homme-montres | 103 |
| audio | 49 |
| bebes | 30 |
| decoration | 28 |
| accessoires-electronique | 26 |
| femme-vetements | 26 |
| jouets | 26 |
| maquillage | 19 |
| cuisine | 18 |
| electromenager | 18 |
| photo | 16 |
| telephones | 12 |
| fitness | 11 |
| ecrans | 10 |
| soins-visage | 10 |
| homme-vetements | 7 |
| meubles | 6 |
| claviers | 6 |
| mobilier-jardin | 4 |
| outils-jardin | 4 |
| souris | 3 |
| jardin | 2 |
| tablettes | 2 |
| jeux-video | 2 |
| chiens | 2 |
| parfums | 2 |
| pc-portables | 1 |
| running | 1 |
| quincaillerie | 1 |
| pc-fixes | 1 |
| femme-sacs | 1 |

## 4. Catégories sous-représentées (< 20 produits)

- telephones (Téléphones) : 12
- tablettes (Tablettes) : 2
- ordinateurs (Ordinateurs) : 0
- tv (Télévisions) : 0
- photo (Photo) : 16
- pc-portables (PC portables) : 1
- pc-fixes (PC fixes) : 1
- ecrans (Écrans) : 10
- claviers (Claviers) : 6
- souris (Souris) : 3
- cuisine (Cuisine) : 18
- meubles (Meubles) : 6
- electromenager (Électroménager) : 18
- femme-chaussures (Chaussures) : 0
- femme-sacs (Sacs) : 1
- femme-accessoires (Accessoires) : 0
- homme-vetements (Vêtements) : 7
- homme-chaussures (Chaussures) : 0
- homme-accessoires (Accessoires) : 0
- filles (Filles) : 0
- garcons (Garçons) : 0
- soins-visage (Soins visage) : 10
- maquillage (Maquillage) : 19
- parfums (Parfums) : 2
- mobilier-jardin (Mobilier de jardin) : 4
- outils-jardin (Outils) : 4
- barbecue (Barbecue) : 0
- fitness (Fitness) : 11
- running (Running) : 1
- football (Football) : 0
- romans (Romans) : 0
- bd (BD) : 0
- jeunesse-livres (Jeunesse) : 0
- jeux-societe (Jeux de société) : 0
- jeux-video (Jeux vidéo) : 2
- outillage (Outillage) : 0
- quincaillerie (Quincaillerie) : 1
- chiens (Chiens) : 2
- chats (Chats) : 0

## 5. Catégories absentes (0 produit)

- ordinateurs (Ordinateurs)
- tv (Télévisions)
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

## 6. Objectif ~3000 (proposition à valider, méthode : proportionnelle au catalogue actuel catégorisé, plancher 30/catégorie)

| Catégorie | Actuels | Objectif | Manque |
|---|---|---|---|
| Téléphones | 12 | 81 | 69 |
| Tablettes | 2 | 30 | 28 |
| Ordinateurs | 0 | 30 | 30 |
| Télévisions | 0 | 30 | 30 |
| Audio | 49 | 329 | 280 |
| Photo | 16 | 107 | 91 |
| Accessoires | 26 | 174 | 148 |
| PC portables | 1 | 30 | 29 |
| PC fixes | 1 | 30 | 29 |
| Écrans | 10 | 67 | 57 |
| Claviers | 6 | 40 | 34 |
| Souris | 3 | 30 | 27 |
| Cuisine | 18 | 121 | 103 |
| Meubles | 6 | 40 | 34 |
| Décoration | 28 | 188 | 160 |
| Électroménager | 18 | 121 | 103 |
| Vêtements | 26 | 174 | 148 |
| Chaussures | 0 | 30 | 30 |
| Sacs | 1 | 30 | 29 |
| Accessoires | 0 | 30 | 30 |
| Vêtements | 7 | 47 | 40 |
| Chaussures | 0 | 30 | 30 |
| Montres | 103 | 691 | 588 |
| Accessoires | 0 | 30 | 30 |
| Bébés | 30 | 201 | 171 |
| Filles | 0 | 30 | 30 |
| Garçons | 0 | 30 | 30 |
| Soins visage | 10 | 67 | 57 |
| Maquillage | 19 | 128 | 109 |
| Parfums | 2 | 30 | 28 |
| Mobilier de jardin | 4 | 30 | 26 |
| Outils | 4 | 30 | 26 |
| Barbecue | 0 | 30 | 30 |
| Fitness | 11 | 74 | 63 |
| Running | 1 | 30 | 29 |
| Football | 0 | 30 | 30 |
| Romans | 0 | 30 | 30 |
| BD | 0 | 30 | 30 |
| Jeunesse | 0 | 30 | 30 |
| Jeux de société | 0 | 30 | 30 |
| Jouets | 26 | 174 | 148 |
| Jeux vidéo | 2 | 30 | 28 |
| Outillage | 0 | 30 | 30 |
| Quincaillerie | 1 | 30 | 29 |
| Chiens | 2 | 30 | 28 |
| Chats | 0 | 30 | 30 |

## 7. Sécurité

- ARCHIVED touchés : 0 (script en lecture seule sur fichiers disque, aucun appel réseau)
- DRAFT publiés : 0 (script en lecture seule sur fichiers disque, aucun appel réseau)
- Produits supprimés : 0
- Produits archivés : 0
- Produits modifiés dans Shopify : 0 (ce script ne fait aucune écriture, ni même aucun appel réseau)

## 8. Détail complet

Voir data/categorization-report.json (893 entrées, ID Shopify + titre + catégorie proposée + confiance + raison).

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
