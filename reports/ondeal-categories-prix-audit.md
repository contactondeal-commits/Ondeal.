# OnDeal — Audit catégories + prix + navigation catalogue

**Date :** 13/08/2026
**Périmètre :** Code frontend (`ondeal-marketplace`, Next.js) + lecture seule du catalogue Shopify réel (Storefront API, 970 produits publiés sur le canal Headless) et du menu de navigation du thème natif `ondeal.fr`. **Aucune mutation Shopify n'a été effectuée** (voir Section F).

---

## Résumé exécutif

Cette mission avait deux volets : un audit des catégories/navigation et un audit objectif des prix. Trois découvertes majeures :

1. **Le bug Femme/Homme signalé est réel et sa cause racine est identifiée avec certitude** — mais elle ne vit pas dans ce dépôt de code : c'est un lien mal configuré dans le **menu de navigation du thème Shopify natif** qui sert `ondeal.fr` aujourd'hui (`Vêtement pour Femmes` pointe vers `/collections/vetements-pour-hommes` au lieu de `/collections/vetements-pour-femmes`). Les collections Shopify elles-mêmes sont correctement peuplées (produits femme dans « Vêtements pour Femmes », produits homme dans « Vêtements pour Hommes »). Conformément à l'interdiction absolue de modifier Shopify, ce correctif n'a **pas** été appliqué — il est documenté précisément ci-dessous avec l'action exacte à effectuer manuellement dans Shopify Admin.

2. **Deux bugs techniques réels de mapping catégorie → tag ont été trouvés et corrigés dans le code** (aucune donnée Shopify modifiée) : les catégories locales `homme-montres` et `accessoires-electronique` interrogeaient un tag Shopify (`cat-homme-montres`, `cat-accessoires-electronique`) qui ne correspond à AUCUN produit réel, alors que 91 montres et 4 accessoires tech réels existent sous un tag historique différent (`cat-montres`, `cat-hightech-accessoires`). Corrigé en élargissant la requête de lecture à ces tags historiques validés — 95 produits réels, auparavant invisibles dans ces catégories, apparaissent désormais.

3. **La quasi-totalité des sous-catégories Mode (Femme/Homme/Enfants) sont vides dans l'application, mais pas parce qu'elles n'ont pas d'équivalent réel** : 118 vrais produits vêtements (robes, pantalons, costumes...) existent bien dans le flux catalogue lu, mais aucun ne porte de tag `cat-*` de catégorie. C'est un chantier de catégorisation Shopify déjà identifié et en cours ailleurs dans ce projet (tâche « Taguer les 15 catégories restantes via API — 7432 produits », toujours en cours) — pas un bug de code. Aucune catégorie n'a donc été retirée de la navigation : les retirer effacerait l'accès à des catégories qui devraient se peupler dès que le tagging Shopify sera complété, ce qui contredirait la consigne « ne pas conclure sans preuve ».

Un correctif technique supplémentaire, hors périmètre catégories mais découvert pendant l'audit prix (section 13 de la mission — affichage exact des prix) : tous les prix du site étaient affichés avec un **séparateur décimal anglo-saxon** (point, ex. "379.99 €") au lieu du séparateur français attendu (virgule, ex. "379,99 €"). Corrigé via un formateur centralisé (`src/lib/format.ts`) appliqué à tous les points d'affichage de prix du site. Aucun montant n'a été modifié — uniquement sa représentation textuelle.

Aucun prix Shopify n'a été modifié. Les prix élevés signalés dans la mission (Abri de jardin 1 399,99 €, Tours de rangement, Tablette Android, Mini projecteur) sont tous confirmés réels et exacts — voir Section C pour la classification objective.

`npx tsc --noEmit`, `npm run lint`, `npm run test` (26 tests Playwright) et `npm run build` sont tous verts sur l'état final du code.

---

## SECTION A — CATÉGORIES

### A.1 Source de vérité (section 23 de la mission)

Une seule source de vérité confirmée : `src/data/categories.ts`. `CategoryBlocks.tsx` (homepage), `MainNav.tsx` (desktop), `CategoryMenu.tsx` (drawer mobile), et les breadcrumbs de `category/[slug]/page.tsx` importent tous `categories`/`findCategoryBySlug`/`getAllCategoriesFlat` depuis ce même fichier. **Aucun mapping concurrent ou dupliqué trouvé.** Rien à corriger sur ce point.

### A.2 Mécanisme de mapping catégorie → produits Shopify

Chaque catégorie locale (`categoryId`) est interrogée via le tag Shopify `cat-<categoryId>` (voir `src/lib/catalog/category-mapping.ts`, `categoryTag()`). Une page catégorie interroge son propre id **et** tous les id de ses descendants (`collectCategoryIds`).

### A.3 Bug technique corrigé — MISSING_MAPPING (tags historiques)

Audit du catalogue réel (970 produits, lecture seule Storefront API) : deux tags `cat-*` réellement appliqués à des produits ne correspondaient à AUCUN id de `categories.ts` :

| Tag Shopify réel | Produits | Contenu vérifié manuellement | Catégorie locale visée |
|---|---|---|---|
| `cat-montres` | 91 | 100% montres/montres connectées, échantillon contrôlé | `homme-montres` (tag attendu : `cat-homme-montres`) |
| `cat-hightech-accessoires` | 4 | 100% accessoires audio/tech, échantillon contrôlé | `accessoires-electronique` (tag attendu : `cat-accessoires-electronique`) |

**Cause racine** : ces tags datent d'une catégorisation antérieure à une restructuration de `categories.ts` (imbrication de Mode > Homme > Montres, renommage `montres` → `homme-montres`) — les produits n'ont jamais été re-tagués avec le nouvel id.

**Correctif appliqué (code uniquement, aucune donnée Shopify touchée)** : `src/lib/catalog/category-mapping.ts` — nouvelle fonction `categoryTagsForQuery()` qui élargit la requête de lecture aux tags historiques validés, utilisée par `fetchProductsByCategory` et `fetchRelatedProducts` (`src/services/productService.ts`). Vérifié en navigateur réel : `/category/montres` et `/category/accessoires-electronique` affichent désormais les produits réels (auparavant 0 résultat sur les deux).

**Autres tags `cat-*` orphelins détectés — NON corrigés (contenu ambigu, corriger serait afficher de mauvais produits)** :

| Tag Shopify réel | Produits | Contenu échantillonné | Verdict |
|---|---|---|---|
| `cat-jouets-jeux` | 87 | Mélange hétérogène : vêtements enfant, jouets, kit bébé, rangement... | AMBIGU — pas de mapping fiable vers une seule catégorie locale |
| `cat-bricolage-outils` | 9 | Mélange hétérogène : rangement, mousquetons, alarme, jouet, kit bébé | AMBIGU |
| `cat-eclairage` | 2 | LED décoratives à thème (Naruto, One Piece) | Piste plausible vers `decoration`, non confirmée à 100% |
| `cat-epicerie-fine` | 1 | « Hamac Chaise XL » — aucun rapport avec le nom du tag | TAG MANIFESTEMENT ERRONÉ (anomalie Shopify à signaler, pas à corriger en code) |
| `cat-sports-plein-air` | 1 | Table de camping | Piste plausible vers `jardin`, produit unique, non concluant |
| `cat-autres` | 5 | Hamacs, gourdes, mousquetons | Tag générique « autres », comportement attendu |

Conformément à la consigne « ne pas conclure sans preuve », ces tags **n'ont pas** été mappés dans le code (contrairement à `cat-montres`/`cat-hightech-accessoires`, dont le contenu était sans exception). Ils sont documentés ici comme anomalie de tagging Shopify à corriger manuellement (hors périmètre code de cette mission).

### A.4 Anomalie de données Shopify — tags malformés (signalement uniquement)

Deux valeurs de tag contiennent des guillemets littéraux, probablement issus d'un import CSV mal échappé : `"jardin" et "terrasse"` et `"outdoor"` (portés par « Mini Projecteur LED portable pour cinéma maison »). Sans impact fonctionnel sur le mapping catégorie (ces tags ne suivent pas la convention `cat-*`), mais à signaler pour un nettoyage Shopify futur.

### A.5 Tableau des catégories (feuilles) — statut réel

| Nom | Slug | Tag interrogé | Produits | Statut |
|---|---|---|---|---|
| Téléphones | telephones | cat-telephones | 5 | VALID |
| Tablettes | tablettes | cat-tablettes | 1 | VALID |
| Ordinateurs | ordinateurs | cat-ordinateurs | 0 | EMPTY — tagging Shopify incomplet |
| Télévisions | televisions | cat-tv | 0 | EMPTY — tagging Shopify incomplet |
| Audio | audio | cat-audio | 0 | EMPTY — tagging Shopify incomplet |
| Photo | photo | cat-photo | 0 | EMPTY — tagging Shopify incomplet |
| Accessoires (Électronique) | accessoires-electronique | cat-accessoires-electronique **+ alias cat-hightech-accessoires** | 4 | **VALID (corrigé)** |
| Vidéoprojecteurs | videoprojecteurs | cat-videoprojecteurs | 3 | VALID |
| PC portables | pc-portables | cat-pc-portables | 0 | EMPTY — tagging Shopify incomplet |
| PC fixes | pc-fixes | cat-pc-fixes | 0 | EMPTY — tagging Shopify incomplet |
| Écrans | ecrans | cat-ecrans | 0 | EMPTY — tagging Shopify incomplet |
| Claviers | claviers | cat-claviers | 0 | EMPTY — tagging Shopify incomplet |
| Souris | souris | cat-souris | 1 | VALID |
| Cuisine | cuisine | cat-cuisine | 0 | EMPTY — tagging Shopify incomplet |
| Meubles | meubles | cat-meubles | 0 | EMPTY — tagging Shopify incomplet |
| Décoration | decoration | cat-decoration | 0 | EMPTY — tagging Shopify incomplet |
| Électroménager | electromenager | cat-electromenager | 0 | EMPTY — tagging Shopify incomplet |
| Rangement | rangement | cat-rangement | 27 | VALID |
| Femme > Vêtements/Chaussures/Sacs/Accessoires | vetements, chaussures, sacs, accessoires-femme | cat-femme-* | 0 (×4) | EMPTY — tagging Shopify incomplet (118 produits vêtements réels existent dans le catalogue, non tagués — voir A.6) |
| Homme > Vêtements/Chaussures/Accessoires | vetements-homme, chaussures-homme, accessoires-homme | cat-homme-* | 0 (×3) | EMPTY — tagging Shopify incomplet |
| Homme > Montres | montres | cat-homme-montres **+ alias cat-montres** | 91 | **VALID (corrigé)** |
| Enfants > Bébés/Filles/Garçons | bebes, filles, garcons | cat-bebes / cat-filles / cat-garcons | 0 (×3) | EMPTY — tagging Shopify incomplet |
| Vêtements mixte / unisexe | vetements-mixte | cat-vetements-mixte | 0 | EMPTY — tagging Shopify incomplet |
| Bijoux | bijoux | cat-bijoux | 147 | VALID |
| Soins visage / Maquillage / Bien-être | soins-visage, maquillage, bien-etre-massage | cat-* | 0 (×3) | EMPTY — tagging Shopify incomplet |
| Parfums | parfums | cat-parfums | 5 | VALID |
| Mobilier de jardin / Outils | mobilier-jardin, outils-jardin | cat-* | 0 (×2) | EMPTY — tagging Shopify incomplet |
| Barbecue | barbecue | cat-barbecue | 3 | VALID |
| Fitness / Running | fitness, running | cat-* | 0 (×2) | EMPTY — tagging Shopify incomplet |
| Football | football | cat-football | 4 | VALID |
| Romans / BD | romans, bd | cat-* | 0 (×2) | EMPTY — tagging Shopify incomplet |
| Jeunesse (Livres) | jeunesse | cat-jeunesse-livres | 3 | VALID |
| Jeux de société | jeux-de-societe | cat-jeux-societe | 7 | VALID |
| Jouets / Jeux vidéo | jouets, jeux-video | cat-* | 0 (×2) | EMPTY — tagging Shopify incomplet |
| Outillage | outillage | cat-outillage | 17 | VALID |
| Quincaillerie | quincaillerie | cat-quincaillerie | 0 | EMPTY — tagging Shopify incomplet |
| Chiens | chiens | cat-chiens | 0 | EMPTY — tagging Shopify incomplet |
| Chats | chats | cat-chats | 1 | VALID |

Aucun `BROKEN_LINK`, `WRONG_SLUG`, `DUPLICATE` ou `ORPHAN` trouvé — tous les slugs résolvent vers la bonne page, aucune route cassée, aucun doublon d'id/slug dans `categories.ts`. Les catégories parentes (Électronique, Mode, Maison, etc.) agrègent automatiquement leurs enfants via `collectCategoryIds` et ne sont donc vides que si TOUS leurs enfants le sont.

### A.6 Catégories vides — décision (section 5 de la mission)

**Aucune catégorie n'a été retirée de la navigation.** Justification : pour la quasi-totalité des catégories `EMPTY` ci-dessus, l'audit a trouvé des produits réels correspondant au thème dans le flux catalogue global (ex. 118 produits vêtements identifiables par titre — robes, pantalons, costumes, chemises — pour la branche Mode), mais sans tag `cat-*` de catégorie. Il s'agit d'un chantier de tagging déjà connu et en cours dans ce projet (« Taguer les 15 catégories restantes via API — 7432 produits »), pas de catégories fantômes sans équivalent réel. Les retirer de la navigation masquerait des catégories qui redeviendront pertinentes dès que ce tagging sera complété, et créerait un travail de re-création inutile. L'état vide actuel est déjà affiché honnêtement (voir Section D — état vide déjà géré correctement, aucun produit d'une autre catégorie n'est utilisé pour remplir la page).

**Recommandation (voir Section F / Phase 5)** : prioriser l'achèvement du tagging Shopify (tâche déjà existante) plutôt qu'une action de nettoyage de la navigation.

---

## SECTION B — FEMME / HOMME

**Femme → BUG CONFIRMÉ, cause racine identifiée, NON corrigé (Shopify)**
**Homme → OK (collection Shopify correcte ; lien de menu correct)**

### Diagnostic complet

1. **Collections Shopify** (lecture seule, Admin API, avant déconnexion du connecteur) :
   - `Vêtements pour Femmes` (handle `vetements-pour-femmes`, 24 produits, collection manuelle) — contenu vérifié : 100% produits féminins (robes, soutiens-gorge, leggings, jupes...).
   - `Vêtements pour Hommes` (handle `vetements-pour-hommes`, 41 produits, collection manuelle) — contenu vérifié : 100% produits masculins/mixtes (chemises, pantalons, blazers...).
   - **Les deux collections sont correctement peuplées — aucune donnée produit mal classée.**

2. **Menu de navigation du thème Shopify natif** (`ondeal.fr`, lecture seule via inspection du DOM en navigateur réel) :
   ```
   Vêtements pour Hommes  → href="/collections/vetements-pour-hommes"   (correct)
   Vêtement pour Femmes   → href="/collections/vetements-pour-hommes"   (INCORRECT — devrait être /collections/vetements-pour-femmes)
   ```
   **Cause racine confirmée avec certitude** : le lien de menu « Vêtement pour Femmes » a été configuré avec la MÊME URL que le lien « Vêtements pour Hommes ». C'est la cause exacte du bug rapporté (« clic Femme → page Homme »). Notez aussi l'incohérence de libellé déjà visible (« Vêtements » pluriel pour Hommes vs « Vêtement » singulier pour Femmes), signe supplémentaire d'une saisie manuelle non homogène de ce menu.

3. **Localisation du bug** : Shopify Admin → Boutique en ligne → Navigation → menu principal → lien « Vêtement pour Femmes » → champ URL. **Ce n'est pas un bug de code** (ni de ce dépôt Next.js — qui ne sert d'ailleurs pas `ondeal.fr` aujourd'hui, voir note ci-dessous — ni des collections Shopify elles-mêmes).

4. **Action corrective nécessaire (à effectuer manuellement dans Shopify Admin, hors périmètre de cette mission — modification Shopify strictement interdite ici)** : changer l'URL du lien de menu « Vêtement pour Femmes » de `/collections/vetements-pour-hommes` vers `/collections/vetements-pour-femmes`. Modification d'un seul champ, aucune donnée produit/collection à toucher.

**Note d'infrastructure importante** : `ondeal.fr` sert aujourd'hui le thème Shopify natif (Liquid), pas cette application Next.js — confirmé dans un rapport antérieur (`reports/marketplace-interface-connexion.md`, `reports/project-final-audit.md`). Les routes de cette application (`/category/femme`, `/category/homme`) sont donc distinctes des routes Shopify natives (`/collections/vetements-pour-femmes`, `/collections/vetements-pour-hommes`) testées ici — les deux ont été auditées séparément dans cette mission (Section A pour l'application Next.js, cette section pour le site natif réellement en ligne).

Dans cette application Next.js elle-même, `/category/femme` et `/category/homme` affichent chacune un état vide honnête (« Aucun produit... ») — comportement correct, pas de bug de permutation constaté ici (voir A.6).

---

## SECTION C — PRIX

**Aucun prix n'a été modifié.** Analyse basée sur les 970 produits réels lus (Storefront API, lecture seule). **Aucun `compareAtPrice` actif n'a été trouvé sur l'ensemble du catalogue** (0/970 produits ont une variante avec `compareAtPrice > 0`) — donc aucun faux rabais ni incohérence de prix barré possible actuellement ; rien à signaler sur ce point précis.

### Statistiques par catégorie (catégories avec échantillon suffisant, ≥3 produits)

| Catégorie | N | Min | Médiane | Max |
|---|---|---|---|---|
| Téléphones | 5 | 74,99 € | 174,99 € | 199,99 € |
| Vidéoprojecteurs | 3 | 123,99 € | 131,99 € | 152,99 € |
| Rangement | 27 | 13,99 € | 130,99 € | 1 677,99 € |
| Bijoux | 147 | 3,63 € | 89,56 € | 511,92 € |
| Parfums | 5 | 29,99 € | 38,99 € | 38,99 € |
| Barbecue | 3 | 41,99 € | 49,99 € | 79,99 € |
| Football | 4 | 55,99 € | 111,99 € | 138,99 € |
| Jeunesse (Livres) | 3 | 14,99 € | 15,99 € | 16,99 € |
| Jeux de société | 7 | 13,99 € | 23,99 € | 135,99 € |
| Outillage | 17 | 12,99 € | 27,99 € | 278,99 € |

### Produits signalés dans la mission — confirmés réels et exacts

| Produit | Catégorie | Prix réel Shopify | Médiane catégorie | Écart | Statut |
|---|---|---|---|---|---|
| Abri de jardin en résine et aluminium, portes verrouillables | Rangement | 1 399,99 € | 130,99 € | 10,7x | **B — ÉLEVÉ MAIS PLAUSIBLE** (mobilier de jardin de grande taille, catégorie « Rangement » très hétérogène — voir note) |
| Abri de jardin en acier galvanisé avec portes verrouillables | Rangement | 1 677,99 € | 130,99 € | 12,8x | **B — ÉLEVÉ MAIS PLAUSIBLE** |
| Tour de rangement 9 tiroirs pour jouets, meuble modulable | Rangement | 379,99 € | 130,99 € | 2,9x | **A — NORMAL** (dans l'ordre de grandeur de la catégorie) |
| Tour de rangement 3 tiroirs pour jouets, hauteur enfant | Rangement | 168,99 € | 130,99 € | 1,3x | **A — NORMAL** |
| Tour de rangement verticale à tiroirs pour jouets | Rangement | 258,99 € | 130,99 € | 2,0x | **A — NORMAL** |
| Tablette 10,1 pouces Android 12, 4 Go RAM, 4G | Tablettes | 262,99 € | — (1 seul produit tagué, pas de médiane calculable) | — | **E — NON VÉRIFIABLE** (échantillon catégorie insuffisant pour comparaison) |
| Mini projecteur portable Full HD/4K, WiFi 6, Bluetooth 5.4 | Vidéoprojecteurs | 152,99 € | 131,99 € | 1,16x | **A — NORMAL** |

**Note sur la catégorie « Rangement »** : elle regroupe, sous le même tag Shopify `cat-rangement`, à la fois du petit rangement (organiseurs à 13,99 €) et des abris de jardin en dur (jusqu'à 1 677,99 €) — deux familles de produits très différentes par nature et par prix. L'écart constaté pour les abris de jardin n'est donc pas nécessairement une erreur de prix : c'est plausiblement un effet du regroupement de produits hétérogènes sous une même catégorie (comparer un abri de jardin à une boîte de rangement plastique n'est pas pertinent). **Recommandation** : envisager une sous-catégorie dédiée « Abris de jardin » côté taxonomie (hors périmètre code de cette mission — nécessiterait un nouveau tag Shopify).

### Autres valeurs statistiquement extrêmes détectées (catégorie hébergeant les prix suspects)

| Produit | Catégorie | Prix | Médiane catégorie | Écart | Statut |
|---|---|---|---|---|---|
| Commode 8 tiroirs en bois pour chambre, noire | Rangement | 431,99 € | 130,99 € | 3,3x | C — SUSPECT À VÉRIFIER (mobilier vs petit rangement, même remarque que ci-dessus) |
| Commode 12 tiroirs en bois blanc, grand rangement chambre | Rangement | 620,99 € | 130,99 € | 4,7x | C — SUSPECT À VÉRIFIER |
| S925 Silver Vintage Ring For Men Adjustable And Trendy | Bijoux | 511,92 € | 89,56 € | 5,7x | B — ÉLEVÉ MAIS PLAUSIBLE (argent massif S925, bijouterie haut de gamme du catalogue) |
| S925 Sterling Silver 8ct Moissanite Ring... | Bijoux | 275,82 € | 89,56 € | 3,1x | B — ÉLEVÉ MAIS PLAUSIBLE (moissanite/argent massif — matériau explique l'écart) |
| Set de 3 clés dynamométriques 3-230 Nm, calibrées, atelier | Outillage | 139,99 € | 27,99 € | 5,0x | C — SUSPECT À VÉRIFIER |
| Kit œillets 900 pièces, tailles 1/4, 5/16 et 3/8 po | Outillage | 278,99 € | 27,99 € | 10,0x | C — SUSPECT À VÉRIFIER (écart important pour un kit de petites fournitures — à vérifier manuellement) |
| Jeu de lancer d'échelle en acier, 2 échelles et 6 balles | Jeux de société | 135,99 € | 23,99 € | 5,7x | B — ÉLEVÉ MAIS PLAUSIBLE (jeu extérieur en acier, format/matériau différent des jeux de société classiques) |

**Aucun prix n'a été modifié ni recommandé pour modification.** Les statuts « SUSPECT À VÉRIFIER » signalent un écart statistique important justifiant une vérification humaine du fournisseur/de la fiche produit — pas une conclusion d'erreur.

### Affichage du prix (section 13 de la mission) — bug technique trouvé et corrigé

**Problème** : tous les prix du site (ProductCard, PDP, MobileStickyCta, panier, checkout, suggestions de recherche, toast d'ajout au panier, page commandes) étaient formatés via `price.toFixed(2) + " €"`, ce qui produit un séparateur décimal **point** (`379.99 €`) au lieu du séparateur **virgule** attendu pour un site francophone (`379,99 €` — convention utilisée par la mission elle-même dans ses propres exemples).

**Correctif** : création de `src/lib/format.ts` (`formatPrice()`, basé sur `Intl.NumberFormat("fr-FR", ...)`), appliqué à tous les points d'affichage de prix recensés dans le code (10 fichiers). **Aucune valeur numérique modifiée** — uniquement le formatage textuel (le montant réel issu de Shopify reste strictement identique). Vérifié en navigateur réel avant/après : `379.99 €` → `379,99 €`.

Le reste de l'affichage (devise €, prix minimum/maximum via `priceRange`, disponibilité) reflète exactement les données Shopify — aucune transformation commerciale arbitraire trouvée.

---

## SECTION D — NAVIGATION

**Homepage → OK**
**Desktop → OK**
**Mobile → OK**
**Breadcrumbs → OK**
**Recherche → OK**

Détail :
- **Homepage (`CategoryBlocks`)** : chaque carte (image, titre, href) est générée depuis `categories.ts` — aucun lien ne pointe vers une mauvaise catégorie ; testé aux 3 largeurs (390/834/1440).
- **Header desktop (`MainNav`)** : liens du mega-menu (Électronique, Maison, Mode) et liens statiques testés — tous résolvent vers la bonne page catégorie ou de recherche.
- **Menu mobile (`CategoryMenu`)** : même source `categories.ts` que le desktop — pas de mapping dupliqué.
- **Breadcrumbs** : construits dynamiquement depuis la chaîne de catégories réelle (`findParentChain`) — jamais de fil d'Ariane incohérent (ex. une page Femme n'affiche jamais Homme, puisque le fil suit strictement l'arborescence réelle du `slug` demandé).
- **Recherche** : ne référence aucune catégorie propre (`searchService.ts` opère uniquement sur les produits) — pas de mapping catégorie concurrent à auditer/corriger ici.
- **État vide** : `/category/femme`, `/category/homme` et toute autre catégorie vide affichent un message honnête (« Aucun produit ne correspond... ») sans jamais afficher de produits d'une autre catégorie pour combler la page — comportement déjà correct, vérifié en navigateur réel, aucune modification nécessaire.
- **Filtres** : aucun filtre Note ni Livraison rapide présent (conforme à la consigne de ne pas les réintroduire).

---

## SECTION E — TESTS

```
tsc   → OK
lint  → OK
build → OK
test  → OK (26/26 tests Playwright, suite héritée de la mission Phase 4 UX/UI — aucune régression)
```

Responsive testé à 390×844 / 834×1100 / 1440×900 sur : Homepage, Femme, Homme, Électronique, Mode, Bijoux, Rangement, Montres (catégorie corrigée), Recherche, une fiche Produit, Panier — **aucun débordement horizontal détecté sur aucune combinaison**.

---

## Fichiers modifiés

| Fichier | Nature |
|---|---|
| `src/lib/catalog/category-mapping.ts` | Ajout de `categoryTagsForQuery()` + `LEGACY_TAG_ALIASES` (2 alias validés) |
| `src/services/productService.ts` | `fetchProductsByCategory`/`fetchRelatedProducts` utilisent `categoryTagsForQuery()` |
| `src/lib/format.ts` | Nouveau — `formatPrice()` centralisé (séparateur décimal français) |
| `src/components/products/ProductCard.tsx` | Utilise `formatPrice()` |
| `src/components/products/MobileStickyCta.tsx` | Utilise `formatPrice()` |
| `src/components/search/SearchSuggestions.tsx` | Utilise `formatPrice()` |
| `src/components/cart/CartSummary.tsx` | Utilise `formatPrice()` |
| `src/components/cart/CartItem.tsx` | Utilise `formatPrice()` |
| `src/app/product/[slug]/page.tsx` | Utilise `formatPrice()` |
| `src/app/checkout/page.tsx` | Utilise `formatPrice()` |
| `src/app/account/orders/page.tsx` | Utilise `formatPrice()` |
| `src/hooks/useCart.ts` | Message toast utilise `formatPrice()` |

Aucun script temporaire n'a été laissé dans le dépôt (scripts d'analyse écrits et exécutés hors dépôt, dans `/tmp/`, supprimés en fin de mission).

---

## SECTION F — SAFETY CHECK

```
CATÉGORIES AUDITÉES              → OUI (39 catégories/sous-catégories, comptage réel par tag Shopify)
LIENS CORRIGÉS                   → OUI (2 — mapping tag cat-montres / cat-hightech-accessoires, code uniquement)
CATÉGORIES VIDES TRAITÉES        → OUI (documentées ; aucune retirée — équivalents réels probables, tagging Shopify incomplet, voir A.6)
FEMME CORRIGÉE                   → NON (cause racine identifiée avec certitude — lien de menu Shopify natif — correction nécessite un accès Shopify Admin hors périmètre de cette mission)
HOMME VÉRIFIÉ                    → OUI (collection et lien corrects)
PRIX AUDITÉS                     → OUI (970 produits réels, statistiques par catégorie)
PRIX SUSPECTS IDENTIFIÉS         → OUI (documentés Section C — SUSPECT À VÉRIFIER / ÉLEVÉ MAIS PLAUSIBLE, jamais « FAUX »)
AUCUN PRIX MODIFIÉ               → OUI
SHOPIFY NON MODIFIÉ              → OUI (0 appel mutation ; get-collection/search_collections en lecture seule uniquement)
PRODUITS NON MODIFIÉS            → OUI
STOCK NON MODIFIÉ                → OUI
VARIANTES NON MODIFIÉES          → OUI
IMAGES NON MODIFIÉES             → OUI
TAGS NON MODIFIÉS                → OUI
STATUTS NON MODIFIÉS             → OUI
AUCUNE DONNÉE COMMERCIALE INVENTÉE → OUI
```

---

## Recommandations (suite)

1. **Priorité 1 — Shopify Admin (hors périmètre code)** : corriger le lien de menu « Vêtement pour Femmes » sur `ondeal.fr` (`/collections/vetements-pour-hommes` → `/collections/vetements-pour-femmes`). Un seul champ à modifier, cause racine déjà identifiée avec certitude (Section B).
2. **Priorité 2** : achever le tagging Shopify des catégories restantes (tâche déjà suivie dans ce projet, 7432 produits) — résoudrait la grande majorité des catégories `EMPTY` de la Section A sans aucun changement de code.
3. **Priorité 3** : faire vérifier manuellement par un opérateur les 5 produits marqués « SUSPECT À VÉRIFIER » (Section C) — écart statistique important, sans conclusion automatique d'erreur.
4. Envisager, côté taxonomie Shopify, une sous-catégorie dédiée pour les abris de jardin (actuellement mélangés avec le petit rangement sous `cat-rangement`), ce qui rendrait les futures comparaisons de prix par catégorie plus pertinentes.
5. Nettoyer les deux tags Shopify malformés relevés en A.4 (guillemets littéraux).
