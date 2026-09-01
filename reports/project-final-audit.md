# Ondeal Final Project Audit

**Date** : 13/08/2026 — **Mode** : audit lecture seule, aucune écriture Shopify effectuée.
**Portée** : projet `ondeal-marketplace` (Next.js) + boutique Shopify Ondeal (`6mvti7-9g.myshopify.com`, domaine public `ondeal.fr`).

---

## 1. Executive Summary

Le projet contient une **application Next.js unique et déjà mature** (pas d'ancienne interface parallèle) avec une intégration Shopify Storefront API réellement câblée au niveau code, une intégration CJdropshipping fonctionnelle et vérifiée en conditions réelles (connexion API confirmée dans cet audit), et une architecture panier/checkout honnête (bascule automatique entre mode démo et paiement Shopify réel, sans jamais simuler un faux succès). `tsc`, `lint` et `build` sont tous les trois propres.

Cependant, cet audit révèle **deux blocages critiques**, non identifiés lors des audits précédents, qui empêcheraient la marketplace de fonctionner correctement même une fois le jeton Storefront API configuré :

1. **Aucune image produit réelle ne s'affiche jamais**, nulle part dans l'application — un composant `PlaceholderImage` explicitement documenté comme provisoire (« pas d'image réelle ») est utilisé à la place d'un vrai `<img>`/`next/image` sur les 5 emplacements où des images produit apparaissent (fiche produit, cartes produit, panier, suggestions de recherche, historique de commandes).
2. **La taxonomie de catégories de l'application (`src/data/categories.ts`) ne correspond pas aux tags réellement utilisés sur la majorité du catalogue ACTIVE existant.** Seuls ~164 des 970 produits ACTIVE (17 %) portent un tag `cat-*` reconnu par la taxonomie actuelle ; au moins 231 produits (24 %) utilisent des tags de catégorie hérités et incompatibles (`cat-montres`, `jardin-terrasse`, `cat-eclairage`, `cat-bagages-voyage`, `cat-epicerie-fine`, `cat-hightech-accessoires`, `cat-bricolage-outils`) ; les ~575 restants (59 %) n'ont, dans l'échantillon examiné, aucun tag de catégorie exploitable.

Par ailleurs, le site public `ondeal.fr` n'est actuellement **pas** servi par cette application Next.js : le domaine pointe vers l'infrastructure Shopify native (thème Liquid), et aucun déploiement Vercel n'existe encore pour ce projet (voir rapport précédent `marketplace-interface-connexion.md`).

**Conclusion générale** : le socle technique est solide et honnête (aucune fonctionnalité ne ment sur son propre état), mais le projet n'est **pas prêt pour une mise en ligne** en l'état — voir section 17.

---

## 2. Architecture

- **Un seul projet, une seule interface** : Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Zustand pour l'état client, aucune trace d'une « ancienne » interface séparée (un seul commit Git initial, un seul dossier `src/app`).
- **Routes** (`src/app/*`) : accueil, `category/[slug]`, `product/[slug]`, `search`, `cart`, `checkout`, `account/*` (compte, commandes, profil, wishlist), `help`, `robots.ts`, `sitemap.ts`. **Aucune route API custom** (`route.ts`) — l'application utilise exclusivement des Server Components et une Server Action (`shopify-checkout.ts`) pour tout accès serveur, ce qui est un choix d'architecture cohérent, pas un manque.
- **Composants** (`src/components/*`, 61 fichiers) : home, produits, navigation, filtres, recherche, panier, layout, UI génériques — bien découpés, réutilisés de façon cohérente entre pages mock et pages Shopify.
- **Couche service unique** (`src/services/productService.ts`) : point d'entrée unique pour toutes les pages, bascule automatique mock ↔ Shopify selon `isShopifyPublicConfigured()` — aucune logique dupliquée entre les deux modes.
- **Couche Shopify** (`src/lib/shopify/{config,storefront,cart,admin}.ts`) : Storefront API (public, catalogue), Admin API (scripts d'administration uniquement, jamais côté frontend), Cart API (panier/checkout réel). Aucun secret n'est exposé côté client — confirmé : aucun fichier de `src/lib/shopify` ou `src/lib/cj` ne porte la directive `"use client"`, et les variables sensibles ne sont pas préfixées `NEXT_PUBLIC_`.
- **Couche catalogue/catégorisation** (`src/lib/catalog/*`) : `category-mapping.ts` (convention de tag `cat-<id>`), `archived-guard.ts` (garde-fou anti-BigBuy, voir section 13), `dedupe.ts` (déduplication import CJ), `pricing.ts`, `selection.ts`, `text-cleanup.ts`, `report.ts` — infrastructure riche, déjà utilisée en conditions réelles lors des imports CJ précédents (118 produits importés).
- **CJdropshipping** (`src/lib/cj/*`, `scripts/cj-import-batch.ts`) : voir section 4.
- **Scripts d'administration** (`scripts/*.ts`, exécutés via `tsx`, hors bundle Next.js) : audit catalogue, catégorisation, import CJ, rapports — cohérents avec la couche `lib/`.
- **Rapports existants** (`reports/*.md`, `data/*`) : historique complet et cohérent des missions précédentes (recherche/évaluation/import CJ, reclassification bijoux, connexion Marketplace) — aucune contradiction trouvée avec l'état actuel du code, à l'exception des points documentés en section 15.

---

## 3. Shopify

- **Connexion actuelle** : Storefront API câblée dans le code (`src/lib/shopify/storefront.ts`) mais **non active en runtime** — `SHOPIFY_STOREFRONT_ACCESS_TOKEN` toujours absent de l'environnement au moment de cet audit (en cours de transmission par l'utilisateur dans le fil de discussion précédent). `SHOPIFY_STORE_DOMAIN=6mvti7-9g.myshopify.com` est déjà configuré (`.env.local`).
- **Admin API** : disponible via le connecteur MCP Shopify utilisé pour cet audit (app « Shopify Claude Connector App », lecture seule dans cette mission — aucune mutation exécutée).
- **Domaine** : `myshopifyDomain` = `6mvti7-9g.myshopify.com` ; `primaryDomain.host` = `ondeal.fr` (confirmé).
- **Canal Headless « OnDeal »** (`gid://shopify/Channel/358618530127`, app « Headless ») : confirmé comme le canal destiné au storefront personnalisé — voir rapport précédent pour le détail de la procédure de récupération du jeton.
- **Statuts produits** (comptages exacts, requêtes `productsCount` en lecture seule) :

| Statut | Nombre |
|---|---|
| ACTIVE | 970 |
| DRAFT | 342 |
| ARCHIVED (ancien BigBuy) | 7 175 |

- **Collections** : 27 collections actives trouvées. 19 correspondent exactement aux catégories importées lors de la Phase 4 CJ (convention `cat-*` correcte). 3 sont des collections manuelles sans règle de tag (« Vêtements pour Femmes », « Vêtements pour Hommes », « Beauté & Soin »). 5 utilisent des tags de catégorie qui **n'existent pas** dans `src/data/categories.ts` (« Montres » → `cat-montres`, « Jardin » → `jardin-terrasse`, « Éclairage » → `cat-eclairage`, « Bagages & Voyage » → `cat-bagages-voyage`, « Épicerie fine » → `cat-epicerie-fine`) — voir section 6.
- **Canaux/publications** : 7 canaux au total (Boutique en ligne, Point de vente, Shop, Microsoft Copilot, Google & YouTube, Amazon Channel - CED, OnDeal). Les 118 produits importés en Phase 4 sont publiés sur les 6 canaux disposant d'un objet `Publication` (Microsoft Copilot n'en a pas).
- **Variantes/prix/stock** : aucun produit ACTIVE à prix ≤ 0 (0/970). 17 produits ACTIVE conservent le libellé de variante anglais par défaut « Default Title » au lieu du libellé français attendu (« Défaut ») — reliquat du catalogue pré-existant, distinct du correctif déjà appliqué aux 118 produits CJ de la Phase 4.

Aucune mutation Shopify n'a été exécutée pendant cet audit.

---

## 4. CJdropshipping

**L'intégration CJdropshipping existe déjà, est complète et a été vérifiée en conditions réelles dans cet audit** (appel de lecture seule, aucun import) :

- **Client bas niveau** (`src/lib/cj/client.ts`) : authentification (`authentication/getAccessToken`), cache de token en mémoire, limitation de débit avec file d'attente sérialisée et réessai automatique sur HTTP 429 (comportement découvert empiriquement et documenté).
- **Fonctions produit** (`src/lib/cj/products.ts`) : `getCJCategories`, `searchCJProducts`, `getCJProductDetail`, `getCJProductVariants`, `getCJVariantStock`, `getCJWarehouses` — toutes basées sur des endpoints documentés officiellement (`docs/CJ_INTEGRATION.md`), aucun endpoint inventé.
- **Pipeline d'import complet** (`scripts/cj-import-batch.ts`) : recherche → pré-filtre → détail/variantes/stock → évaluation qualité → déduplication contre Shopify (ACTIVE+DRAFT) → calcul de prix → création Shopify en DRAFT par défaut. Ce pipeline est celui qui a servi à l'import réel de 118 produits en Phase 4.
- **Variable d'environnement** : `CJ_API_KEY` est présente et valide dans `.env`/`.env.local`.
- **Test de connectivité réel effectué dans cet audit** (lecture seule, `getCJCategories()`, aucun import) : **succès** — 14 catégories de premier niveau reçues (ex. « Women's Clothing », avec sous-arborescence à 3 niveaux réelle). Ceci confirme que la clé API est valide et que le format de réponse correspond aux types attendus (`src/lib/cj/types.ts`).

**Ce qui manque encore** pour un usage en production à l'échelle visée (~3000 produits) :
- La table de correspondance `cjCategoryId → ondealCategoryId` reste heuristique (mots-clés), pas basée sur la vraie arborescence CJ obtenue ci-dessus — étape recommandée avant un import à grande échelle.
- Le cache de token est en mémoire process-local (non partagé) — à revoir si le pipeline d'import tourne un jour en plusieurs instances.
- Aucun import CJ n'a été lancé dans cet audit, conformément à la consigne.

---

## 5. Catalog

| Indicateur | Valeur |
|---|---|
| ACTIVE | 970 |
| DRAFT | 342 |
| ARCHIVED (BigBuy, ignorés) | 7 175 |
| Produits ACTIVE à prix ≤ 0 | 0 |
| Produits ACTIVE avec variante « Default Title » non traduite | 17 |
| Produits ACTIVE correspondant à la taxonomie actuelle (`cat-<id>` reconnu) | ~164 (17 %) |
| Produits ACTIVE avec tag de catégorie hérité/incompatible | ≥ 231 (24 %) |
| Produits ACTIVE sans tag de catégorie exploitable (estimation résiduelle) | ~575 (59 %) |

**Doublons potentiels** : le mécanisme de déduplication existant (`src/lib/catalog/dedupe.ts`) ne couvre que la détection de doublons **lors d'un import CJ** (contre `cj_product_id`/SKU/titre) — aucun scan de doublons n'a été effectué sur l'ensemble du catalogue ACTIVE/DRAFT existant dans cet audit (hors périmètre du temps imparti ; l'infrastructure de `dedupe.ts` pourrait être réutilisée pour un tel scan si demandé).

**Produits sans image** : sur l'échantillon de ~30 produits ACTIVE examinés (les plus anciens et un lot du milieu du catalogue), tous avaient une image `featuredMedia` renseignée côté Shopify — aucune preuve de produits sans image dans l'échantillon, mais un recensement exhaustif des 970 produits n'a pas été fait.

**Produits incomplets** : voir section 6 pour le détail de la catégorisation manquante, qui constitue la principale forme d'« incomplétude » détectée.

---

## 6. Categories

La taxonomie de `src/data/categories.ts` (11 catégories principales, ~51 sous-catégories feuilles, convention de tag `cat-<id>`) est cohérente et bien structurée **en tant que telle**, et documentée dans `docs/CATEGORIES.md`.

**Le problème n'est pas la taxonomie elle-même, mais son adéquation avec les tags réellement présents sur le catalogue Shopify ACTIVE existant.** Comptage exact par requête `productsCount(status:active AND tag:cat-<id>)` pour chacune des ~51 catégories feuilles :

- **~164 produits** portent un tag correspondant exactement à un id de `categories.ts` (ex. `cat-rangement` : 27, `cat-jouets` : 87, `cat-outillage` : 17, `cat-telephones` : 5, `cat-parfums` : 5, etc. — dont la quasi-totalité provient de l'import CJ Phase 4 et de la catégorie `jouets` pré-existante).
- **Au moins 231 produits** portent un tag de catégorie « orphelin » — reconnaissable comme une intention de catégorisation, mais dont l'id **n'existe pas** dans `categories.ts` :
  - `cat-montres` (91 produits) — la taxonomie actuelle a `homme-montres`, pas `montres`. `docs/CATEGORIES.md` cite d'ailleurs par erreur `cat-montres` comme exemple, ce qui confirme que cette incohérence est déjà ancienne et documentée par erreur.
  - `jardin-terrasse` (124 produits) — ne suit même pas la convention `cat-` (pas de préfixe), et ne correspond à aucun id existant (le plus proche serait `jardin`, `mobilier-jardin`, `outils-jardin` ou `barbecue`).
  - `cat-eclairage` (2 en ACTIVE, mais 943 tous statuts confondus dans la collection Shopify « Éclairage ») — aucune catégorie « Éclairage » n'existe dans `categories.ts`.
  - `cat-bagages-voyage`, `cat-epicerie-fine`, `cat-hightech-accessoires`, `cat-bricolage-outils` — idem, aucune catégorie correspondante.
- **Le reste (~575 produits, ~59 %)** : sur les échantillons examinés (produits ACTIVE les plus anciens, vendeurs tiers tels que Intex, Pro Garden, Hamac de Sol, Keith Titanium Europe, MAOKEI), les tags observés sont soit absents (`"tags":[]`), soit purement commerciaux/non catégoriels (`"sport"`, `"produit-appel"`, `"promo-accueil"`), soit un amas de dizaines de mots-clés multilingues issus d'un flux fournisseur brut (y compris en néerlandais : « Direct leverbaar », « Huis en Tuin ») — clairement un flux d'import fournisseur non retravaillé, sans lien avec la taxonomie Ondeal actuelle.

**Conséquence concrète** : même une fois le jeton Storefront configuré, les pages `/category/*` de l'application ne montreront correctement que ~17 % du catalogue ACTIVE réel — la grande majorité des produits existants restera invisible dans la navigation par catégorie tant que ce désalignement n'est pas corrigé (par retaggage Shopify et/ou extension de la taxonomie).

**Sous-catégorie « Bijoux »** (`mode > bijoux`) : confirmée présente dans `categories.ts`, comme demandé — mais aucun produit ACTIVE ne porte le tag `cat-bijoux` à ce jour (0 résultat), cohérent avec le rapport Phase 4 (catégorie non encore alimentée par import).

---

## 7. Product Pages

Architecture vérifiée dans `src/app/product/[slug]/page.tsx` : métadonnées SEO dynamiques, JSON-LD `Product` (prix, disponibilité, notation), fil d'Ariane, galerie, badges, bloc prix/stock, description/caractéristiques/spécifications, avis, produits similaires et « achetés ensemble » — tout est fonctionnellement câblé à `productService.ts` et fonctionne déjà correctement en mode démonstration (confirmé par le build : 79+ pages produit générées).

**Bug critique confirmé** : la galerie produit (`ProductGallery.tsx`) et toutes les cartes produit utilisent `PlaceholderImage`, qui ignore l'URL réelle transmise et affiche systématiquement un bloc coloré générique avec une icône « image cassée » — voir section 15. Cela reste vrai que la source de données soit le mock ou Shopify réel : **aucune vraie photo produit ne s'affichera jamais tant que ce composant n'est pas remplacé**.

---

## 8. Cart

`src/store/cartStore.ts` (Zustand + persistance `localStorage`) : panier basé sur un instantané dénormalisé par article (titre, prix, image, slug, `shopifyVariantId`) — fonctionne indifféremment avec données mock ou Shopify réelles, sans code dupliqué. Logique d'ajout/retrait/quantité correcte et testée par la lecture de code (pas de bug identifié). Persistance uniquement locale au navigateur (pas de synchronisation serveur/multi-appareil) — attendu à ce stade, pas un bug.

---

## 9. Checkout

`src/app/checkout/page.tsx` + `src/lib/shopify/cart.ts` + `src/app/actions/shopify-checkout.ts` : architecture honnête à deux chemins, vérifiés par lecture de code :

1. **Chemin réel** (si Shopify configuré ET tous les articles du panier portent un `shopifyVariantId`) : création d'un panier Shopify réel (`cartCreate`) côté serveur, redirection vers le `checkoutUrl` Shopify officiel — le paiement est intégralement géré par Shopify, jamais par du code Ondeal, jamais de collecte de carte bancaire côté application.
2. **Chemin démonstration** (sinon) : simulateur d'étapes (livraison/paiement/confirmation) avec mention explicite « Simulation — aucun paiement réel n'est effectué » — **aucune tromperie détectée**, l'état réel est toujours communiqué à l'utilisateur.

Non vérifié dans cet audit (nécessite le jeton Storefront actif) : le comportement réel de bout en bout une fois connecté à de vraies variantes Shopify.

---

## 10. SEO

- Métadonnées par page (`generateMetadata`), canonical, Open Graph sur les fiches produit.
- JSON-LD `BreadcrumbList` (catégories) et `Product` (fiches produit) présents et corrects.
- `sitemap.ts` : dynamique, inclut routes statiques + toutes les catégories + tous les produits (reflète automatiquement le vrai catalogue une fois Shopify connecté).
- `robots.ts` : correct, exclut `/account`, `/cart`, `/checkout`, `/search` de l'indexation.
- **Manque identifié** : aucune page légale trouvée (mentions légales, CGV, politique de confidentialité, politique de retour) — absence significative pour un site e-commerce français en production.

---

## 11. Mobile

- Filtres mobiles dédiés (`FilterMobile.tsx`, tiroir/`Drawer` en bas d'écran) — pattern mobile correct et distinct de la version desktop (`FilterSidebar.tsx`).
- Règles `@media` présentes dans les CSS modules de navigation/layout (`Header.module.css` : 2, `MegaMenu.module.css` : 1, `MainNav.module.css` : 1) et dans 21 des 41 modules CSS de composants au total.
- **Non vérifié** : aucun test visuel réel (captures d'écran multi-résolutions) n'a été effectué dans cet audit — évaluation basée uniquement sur la lecture du code CSS, pas sur un rendu observé. À faire une fois le catalogue réel connecté.

---

## 12. Security

- Aucun secret (`CJ_API_KEY`, futurs tokens Shopify) importé dans un fichier `"use client"` — confirmé par recherche exhaustive.
- Variables sensibles non préfixées `NEXT_PUBLIC_`, donc absentes de tout bundle navigateur par construction Next.js.
- Paiement entièrement délégué à Shopify Checkout (aucune donnée de carte bancaire ne transite par le code Ondeal).
- **Manque** : `next.config.ts` ne définit aucun en-tête de sécurité personnalisé (CSP, HSTS, X-Frame-Options) et aucun `middleware.ts` n'existe — à examiner avant mise en production (Vercel applique certains en-têtes par défaut, mais pas de CSP applicative).
- Jeton Storefront API : transmission en cours via le canal Headless « OnDeal » de Shopify Admin, destiné à rester exclusivement côté serveur (variable d'environnement, jamais dans le code source ni Git) — conforme aux bonnes pratiques.

---

## 13. BigBuy Archived Products

- **7 175 produits ARCHIVED** confirmés dans Shopify — l'ancien catalogue fournisseur BigBuy, comme indiqué par l'utilisateur.
- **Garde-fou actif et vérifié dans le code** : `src/lib/catalog/archived-guard.ts` (`rejectArchived`, `assertNoArchived`) lève une erreur explicite (« Règle absolue violée ») si un produit ARCHIVED entrait dans un flux d'import/déduplication — utilisé par `dedupe.ts` et le pipeline d'import CJ.
- **Aucun produit ARCHIVED n'a été réactivé, modifié ou exposé** dans cet audit — confirmé, aucune mutation exécutée.
- **Point de vigilance signalé, non tranché** : l'échantillon de produits **ACTIVE** les plus anciens (vendeurs Intex, Pro Garden, Hamac de Sol, Keith Titanium Europe, MAOKEI — voir section 6) présente exactement le même profil de données brutes multi-fournisseurs, multi-langues, que ce qu'on attend d'un flux BigBuy non retravaillé. Je ne peux **pas confirmer avec certitude** que ce sous-ensemble ACTIVE provient bien de BigBuy plutôt que d'un autre agrégateur — à clarifier avec vous avant de décider s'il doit être retravaillé, archivé, ou conservé tel quel comme « catalogue actuel ».

---

## 14. Missing Features

- Affichage des vraies images produit (actuellement systématiquement remplacées par un placeholder — section 15).
- Pages légales (mentions légales, CGV, politique de confidentialité/retour).
- Historique de commandes réel (`src/app/account/orders/page.tsx` utilise `mockOrders`, aucune connexion à l'API Orders Shopify).
- Pagination au-delà de 250 produits par requête catégorie (`fetchProductsByCategory`) — pertinent à l'échelle de ~3000 produits visée.
- En-têtes de sécurité applicatifs (CSP/HSTS) et `middleware.ts`.
- Pages 404/erreur personnalisées (aucun `not-found.tsx`/`error.tsx` custom trouvé — Next.js utilise ses pages par défaut).
- Suite de tests automatisés (`package.json` ne définit aucun script `test`).
- Table de correspondance `cjCategoryId → ondealCategoryId` basée sur la vraie arborescence CJ (actuellement heuristique par mots-clés uniquement).

---

## 15. Bugs

| # | Sévérité | Bug |
|---|---|---|
| 1 | **Critique** | `PlaceholderImage` (5 emplacements : fiche produit, cartes produit, panier, suggestions de recherche, commandes) affiche toujours un bloc coloré générique, jamais l'image réelle — documenté dans le code même comme provisoire mais jamais remplacé. |
| 2 | **Critique** | Désalignement massif entre `categories.ts` et les tags Shopify réels : ~83 % du catalogue ACTIVE ne remontera pas correctement sur les pages catégories (section 6). |
| 3 | Moyenne | `fetchProductsByCategory`/`fetchAllProducts` plafonnés à 250/first sans pagination — une catégorie ou le catalogue complet dépassant ce nombre sera tronqué silencieusement. |
| 4 | Faible | 17 produits ACTIVE conservent la variante « Default Title » (anglais) au lieu de « Défaut ». |
| 5 | Faible | `docs/SHOPIFY_INTEGRATION.md` décrit encore un filtrage par metafield (obsolète, le code utilise les tags) et un domaine boutique erroné (`ondeal-5513` au lieu de `6mvti7-9g`) — corrigé dans le code mais pas dans la doc. |
| 6 | À vérifier | Le filtre Shopify `out_of_stock:true` a renvoyé 970/970 produits ACTIVE dans un test, ce qui contredit les niveaux de stock observés par ailleurs (produits avec `totalInventory` > 0) — sémantique du filtre non confirmée, à ne pas utiliser sans vérification préalable. |

---

## 16. Recommended Fixes

Par ordre de priorité :

1. Remplacer `PlaceholderImage` par un vrai composant d'image (idéalement `next/image` avec `remotePatterns` configuré pour `cdn.shopify.com`) sur les 5 emplacements identifiés — condition bloquante pour tout lancement.
2. Décider d'une stratégie de résolution du désalignement de catégories : soit retagger en masse les produits Shopify existants vers la convention `cat-<id>` actuelle (nécessite votre autorisation explicite pour les mutations de tags), soit étendre `categories.ts` pour couvrir les catégories orphelines déjà en usage (Montres, Éclairage, Bagages & Voyage, Épicerie fine, Jardin/Terrasse) — les deux impliquent des décisions produit qui vous reviennent.
3. Ajouter les pages légales manquantes avant toute mise en ligne publique.
4. Ajouter la pagination sur les requêtes catalogue Shopify (au-delà de 250 résultats), en prévision de la montée à ~3000 produits.
5. Connecter `account/orders` à l'API Orders Shopify réelle (ou clarifier que ce n'est pas prioritaire pour le lancement).
6. Corriger la documentation obsolète (`docs/SHOPIFY_INTEGRATION.md`).
7. Ajouter des en-têtes de sécurité applicatifs et des pages d'erreur personnalisées.
8. Mettre à jour la table de correspondance CJ → Ondeal à partir de la vraie arborescence CJ obtenue dans cet audit.

---

## 17. Final Readiness

**Le projet n'est pas prêt pour une mise en ligne publique en l'état**, même une fois le jeton Storefront API configuré, pour trois raisons indépendantes et cumulatives :

1. **Techniques, bloquantes** : le bug d'images (section 15, #1) rendrait chaque page du site visuellement cassée (aucune photo produit nulle part) ; le désalignement de catégories (section 15, #2) rendrait la navigation par catégorie incomplète pour ~83 % du catalogue actuel.
2. **Infrastructure** : `ondeal.fr` ne sert actuellement pas cette application (thème Shopify natif en production, aucun déploiement Vercel existant) — un déploiement complet reste à faire, avec bascule DNS à valider avec vous séparément (voir rapport précédent).
3. **Décisions produit en attente de vous** : stratégie de retaggage/catégorisation (point 2 ci-dessus), sort du segment ACTIVE potentiellement lié à BigBuy (section 13), pages légales à rédiger.

**Ce qui est prêt et fiable dès maintenant** : l'architecture Next.js, la couche service catalogue, l'intégration Shopify Storefront/Cart (au niveau code), l'intégration CJdropshipping (vérifiée en conditions réelles), le panier, et la logique de checkout honnête à deux chemins.

**Tests techniques** : `npx tsc --noEmit` ✅, `npm run lint` ✅, `npm run build` ✅ (161 pages générées), aucun script `test` défini dans `package.json`.

---

SHOPIFY NON MODIFIÉ
