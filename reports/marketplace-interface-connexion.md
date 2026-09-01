# CONNEXION DE L'INTERFACE MARKETPLACE À ONDEAL.FR — RAPPORT D'ÉTAT DES LIEUX

**Boutique** : Ondeal (ondeal.fr) — **Date** : 13/08/2026
**Mode** : analyse d'architecture + connexion en LECTURE SEULE — **aucune mutation Shopify exécutée**
**Statut** : interface déjà connectée au niveau code ; connexion aux données réelles bloquée par un identifiant manquant (détail point 6 et point 8)

---

## 1. Ce que j'ai trouvé

Le projet ne contient **qu'une seule interface** — il n'existe pas de "nouvelle interface Marketplace" séparée de l'existant :

- L'historique Git ne contient qu'un seul commit ("Initial commit from Create Next App") : impossible de distinguer une version "ancienne" d'une version "nouvelle" par l'historique — tout le code applicatif (storefront, intégration Shopify, pipeline CJ) est un unique état de travail non commité.
- Une recherche exhaustive du mot "marketplace" et des fichiers récemment modifiés ne révèle aucune arborescence de composants ou de routes parallèle : un seul dossier `src/app/*` (17 routes), un seul dossier `src/components/*` (61 fichiers).
- Cette arborescence unique contient déjà une intégration Shopify **complète et bien architecturée** : client Storefront API (`src/lib/shopify/storefront.ts`), couche de service (`src/services/productService.ts`), panier + checkout réels (`src/lib/shopify/cart.ts`, `src/app/actions/shopify-checkout.ts`), convention de catégorisation par tag Shopify (`cat-*`, `src/lib/catalog/category-mapping.ts`) déjà alignée avec les imports CJ réalisés dans les phases précédentes de cette mission.

**Conclusion** : il n'y a pas de "deuxième architecture" à créer ni à fusionner. Le travail demandé — connecter l'interface au catalogue réel — est un **écart de configuration (identifiants Shopify)**, pas un écart architectural. Le code applicatif était déjà prêt à fonctionner avec de vraies données avant même le début de cette tâche.

## 2. Où se trouve l'interface Marketplace

- **Toutes les pages publiques** : `src/app/page.tsx` (accueil), `src/app/category/[slug]/page.tsx` (pages catégorie), `src/app/product/[slug]/page.tsx` (fiches produit), `src/app/search/page.tsx`, `src/app/cart/page.tsx`, `src/app/checkout/page.tsx`, `src/app/account/*`, `src/app/help/*`.
- **Composants** : `src/components/{home,products,navigation,filters,search,cart,layout,ui}/*` (61 fichiers) — cartes produit, grille, galerie, panier latéral, mega-menu, fil d'Ariane, etc.
- **Couche catalogue** : `src/services/productService.ts` — point d'entrée unique utilisé par toutes les pages ci-dessus pour lire les produits (best-sellers, nouveautés, promotions, produits par catégorie, recherche).
- **Couche Shopify** : `src/lib/shopify/{config,storefront,cart}.ts`.

## 3. Comment elle est maintenant connectée au catalogue

**Mécanisme déjà en place (aucune réécriture nécessaire)** :

`productService.ts` teste `isShopifyPublicConfigured()` (présence de `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_ACCESS_TOKEN`). Si vrai → toutes les fonctions (`fetchAllProducts`, `fetchProductsByCategory`, `fetchBestsellers`, `fetchNewArrivals`, `fetchDeals`, `fetchRelatedProducts`) interrogent réellement Shopify via l'API Storefront et convertissent chaque produit au format interne (`mapStorefrontProduct`). Si faux → repli automatique sur des données de démonstration locales (`src/data/products.ts`), **sans aucune différence de code pour les pages ou composants**.

Ce que j'ai vérifié/complété dans cette tâche :

- **Domaine boutique réel obtenu en lecture seule** : `SHOPIFY_STORE_DOMAIN=6mvti7-9g.myshopify.com` (interrogé via `shop { myshopifyDomain }`). Cette valeur diffère de celle supposée dans `docs/SHOPIFY_INTEGRATION.md` (`ondeal-5513.myshopify.com`, qui était une estimation non vérifiée) — **ajoutée à `.env.local`**, seule modification de fichier de cette tâche.
- **Confirmation que `ondeal.fr` est bien le domaine primaire de cette boutique** (`shop.primaryDomain.host = "ondeal.fr"`) : élimine toute ambiguïté sur "quelle boutique Shopify alimente le site".
- **Distinction ACTIVE/DRAFT déjà gérée nativement par Shopify**, pas par du code applicatif à écrire : l'API Storefront ne retourne jamais les produits DRAFT/ARCHIVED (limitation native de l'API, pas un filtre custom) — un produit DRAFT ne peut donc pas apparaître "disponible" côté public, par construction.
- **Disponibilité/stock** : `mapStorefrontProduct()` calcule `inStock` à partir de `variants[0].availableForSale` (repli sur `totalInventory`) et ajoute un badge `RUPTURE_STOCK` si indisponible — déjà correct, aucune correction nécessaire.
- **Catégories** : la convention de tag `cat-<id>` utilisée par `fetchProductsByCategory` correspond exactement à celle utilisée par les collections Shopify existantes (vérifié : 27 collections actives, la plupart en règle automatique `TAG EQUALS cat-*`, cohérente avec `category-mapping.ts`).

**Ce qui reste bloqué** : sans `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `isShopifyPublicConfigured()` reste `false` et le site continue d'afficher les données de démonstration — confirmé par le build (`npm run build`) qui génère encore des slugs de produits mock (ex. `/product/solenne-smartphone-ecran-6-7-128go-0`). Voir point 6 et point 8 pour le détail et la marche à suivre.

## 4. Fichiers modifiés

**Un seul fichier modifié**, aucune ligne de code applicatif touchée :

| Fichier | Modification |
|---|---|
| `.env.local` | Ajout de `SHOPIFY_STORE_DOMAIN=6mvti7-9g.myshopify.com` (valeur non secrète, obtenue en lecture seule, sans mutation Shopify) + commentaire explicatif |

Aucun fichier `src/`, `scripts/`, ou de configuration n'a été modifié : la revue de code des routes (`page.tsx`, `category/[slug]/page.tsx`, `product/[slug]/page.tsx`), de la couche service (`productService.ts`) et de la couche Shopify (`storefront.ts`, `cart.ts`, `shopify-checkout.ts`) n'a révélé **aucun bug fonctionnel** dans le mécanisme de connexion au catalogue — le code était déjà correct.

## 5. Fonctionnalités désormais opérationnelles

Techniquement opérationnelles **dès que le jeton Storefront sera fourni** (aucun redéploiement de code requis, uniquement une variable d'environnement) :

- Produits réels affichés sur l'accueil, les catégories, la recherche et les fiches produit.
- Correspondance catégories Ondeal ↔ tags Shopify (`cat-*`), alignée avec les 118 produits importés en Phase 4 et les ~970 produits ACTIVE existants.
- Distinction ACTIVE (affiché) / DRAFT (jamais affiché) : native à l'API Storefront, sans risque d'affichage accidentel.
- Indicateur de rupture de stock basé sur les données réelles de variante/inventaire.
- Panier local instantané + création d'un panier Shopify réel et redirection vers le `checkoutUrl` officiel au moment du paiement (`createShopifyCheckout`), déjà câblé et navigable de bout en bout.
- URLs propres et stables (`/category/<slug>`, `/product/<handle>`), génération de métadonnées SEO et JSON-LD par page.

Opérationnel **dès maintenant, indépendamment du jeton** :
- `npx tsc --noEmit`, `npm run lint`, `npm run build` passent tous sans erreur (161 pages générées).
- Le domaine boutique réel est désormais correctement configuré dans l'environnement.

## 6. Problèmes / points restants identifiés

1. **Blocant principal** — `SHOPIFY_STOREFRONT_ACCESS_TOKEN` absent de l'environnement (`.env`/`.env.local`). Sans lui, le site reste en mode démonstration quel que soit le reste de la configuration. Voir point 8 pour la marche à suivre — la génération de ce jeton nécessite une action Shopify hors périmètre "lecture seule" de cette tâche.
2. **Canal probable identifié : "OnDeal"**. En listant les canaux (lecture seule), le canal nommé "OnDeal" (`gid://shopify/Channel/358618530127`) est de type **application "Headless"** — c'est le type de canal Shopify spécifiquement conçu pour un storefront personnalisé (comme ce projet Next.js) utilisant l'API Storefront, par opposition au canal "Boutique en ligne" (thème Shopify classique). C'est un signal fort que ce canal est celui destiné à ondeal.fr, mais je n'ai **pas pu confirmer à 100 %** qu'un jeton Storefront existe déjà pour ce canal : la requête `shop.storefrontAccessTokens` a été refusée ("Access denied") par les permissions actuelles de la connexion Shopify utilisée dans cette session. Il est possible qu'un jeton existe déjà côté Shopify Admin sans que je puisse le vérifier ici.
3. **Documentation interne obsolète** — `docs/SHOPIFY_INTEGRATION.md` indique encore que `fetchProductsByCategory` filtre par `metafield:custom.ondeal_category_id`. Ce n'est plus exact : le code actuel de `productService.ts` filtre par tag (`tag:cat-<id>`), corrigé lors d'une session précédente (12/08/2026). Recommandation : mettre à jour ce fichier de documentation pour éviter toute confusion future (non fait ici, changement de documentation seulement, à faire sur validation).
4. **Domaine boutique erroné dans la documentation** — `docs/SHOPIFY_INTEGRATION.md` mentionne `ondeal-5513.myshopify.com` comme exemple ; le domaine réel vérifié est `6mvti7-9g.myshopify.com`. À corriger dans la documentation en même temps que le point précédent.
5. **QA responsive approfondie non réalisée dans cette tâche** — la structure CSS existante contient des règles `@media` dans 21 des 41 modules CSS de composants, cohérent avec une approche responsive déjà en place. Je n'ai pas effectué de test visuel écran par écran (mobile/tablette/desktop) sur données réelles, car cela dépend du jeton Storefront manquant (point 1) ; le rendu actuel (données mock) utilise exactement les mêmes composants et n'a montré aucune anomalie de compilation. Recommandation : QA visuelle dédiée une fois les données réelles connectées.
6. **Produits DRAFT anciens sans tag `cat-*`** — un échantillon de produits DRAFT préexistants (ex. linge de maison, vendeur "Ondeal") ne porte pas de tag `cat-*` (ex. tag unique observé : `"textile maison"`). Sans impact actuel car ces produits sont DRAFT (jamais affichés publiquement par construction de l'API Storefront), mais à garder en tête si certains sont un jour passés en ACTIVE sans re-catégorisation.

## 7. Résultats des tests

| Commande | Résultat |
|---|---|
| `npx tsc --noEmit` | ✅ Réussi, aucune erreur |
| `npm run lint` | ✅ Réussi, aucune erreur |
| `npm run build` | ✅ Réussi — 161 pages générées, aucune régression |
| `npm test` | Aucun script `test` défini dans `package.json` (inchangé depuis les phases précédentes) |

## 8. Actions nécessitant votre autorisation explicite

Aucune mutation Shopify n'a été exécutée dans cette tâche, conformément à la consigne. Les actions suivantes restent à valider séparément avant de pouvoir afficher les vraies données sur ondeal.fr :

1. **Créer/récupérer un jeton d'accès API Storefront** — c'est l'action bloquante. Deux options :
   - **Option recommandée, sans passer par une mutation Shopify de ma part** : ouvrir dans Shopify Admin le canal **"OnDeal"** (Paramètres → Applications et canaux de vente → OnDeal → gérer les accès Storefront API), et y créer/copier un jeton d'accès Storefront depuis l'interface Shopify elle-même. Vous me transmettez ensuite ce jeton pour que je le place dans `.env.local` (variable serveur uniquement, jamais exposée au navigateur).
   - **Option alternative** : m'autoriser explicitement à exécuter la mutation Admin `storefrontAccessTokenCreate` pour générer ce jeton directement — c'est une mutation Shopify, donc hors périmètre de cette tâche sans votre accord explicite.
2. **Mettre à jour `docs/SHOPIFY_INTEGRATION.md`** pour corriger le domaine boutique et la méthode de filtrage par catégorie (changement de documentation uniquement, aucun impact fonctionnel) — je peux le faire dès votre accord.
3. **Redéploiement du site live** — une fois le jeton fourni et testé en local, les pages catégorie/produit étant générées statiquement (`generateStaticParams`) avec revalidation toutes les 60 secondes, un nouveau build/déploiement du site sera nécessaire pour que ondeal.fr affiche les données réelles au-delà de la revalidation automatique.
4. **QA responsive dédiée sur données réelles** (mobile/tablette/desktop) — à mener une fois le jeton actif ; je peux la conduire dès que vous le souhaitez.

---

INTERFACE MARKETPLACE ANALYSÉE — AUCUNE ARCHITECTURE PARALLÈLE
CONNEXION AU CATALOGUE PRÊTE CÔTÉ CODE — EN ATTENTE DU JETON STOREFRONT
AUCUNE MUTATION SHOPIFY EXÉCUTÉE
TESTS TECHNIQUES RÉUSSIS (tsc / lint / build)
STOP avant toute modification Shopify — en attente de votre autorisation (point 8).
