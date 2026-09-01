# OnDeal — Rapport UX/UI Phase 3

Généré le : 2026-08-13
Mode : implémentation + validation visuelle et fonctionnelle
Périmètre : UX/UI, accessibilité, conversion frontend
Shopify : lecture seule — **aucune mutation**

---

## 1. Résumé exécutif

Cette Phase 3 a traité les quatre points laissés ouverts par le rapport Phase 2, et a étendu l'audit d'accessibilité ciblé demandé (header, PDP, drawers, panier) aux éléments réellement concernés par ces points.

Le résultat le plus significatif est la découverte et la correction d'un **bug P0 réel et à fort impact sur `MobileStickyCta`** : sur un échantillon de 60 produits réels du catalogue, la barre CTA sticky mobile ne s'affichait **jamais** pour 27 d'entre eux (45%), quel que soit le scroll — un défaut de calcul géométrique, pas le bug de détection déjà corrigé en Phase 1. Corrigé avec un diff minimal (un seul seuil numérique changé), revérifié : 0/60 produits en échec après correction.

L'incohérence `ProductRating` (texte visible vs `aria-label`) signalée en Phase 2 a été confirmée et corrigée. La réclamation sur l'ordre de tabulation mobile ("recherche avant menu") n'a **pas été reproduite telle quelle** — l'ordre réel est cohérent avec la structure visuelle. En revanche, l'audit a mis au jour et corrigé trois problèmes d'accessibilité réels et vérifiés en navigateur : deux liens du header sans nom accessible sur mobile/tablette, un lien d'évitement ("skip link") invisible au focus, une fuite de focus clavier dans les drawers fermés, et une superposition plein écran de galerie PDP sans support de la touche Escape.

Aucune donnée commerciale n'a été inventée. Aucun appel Shopify n'a été effectué. `tsc`, `lint` et `build` passent tous sans erreur.

---

## 2. État initial

Avant toute modification, le code des zones concernées a été lu intégralement (`MobileStickyCta.tsx`, `MobileStickyCta.module.css`, `product/[slug]/page.tsx`, `ProductRating.tsx`, `Header.tsx`, `Header.module.css`, `Drawer.tsx`, `ProductGallery.tsx`, `CartItem.tsx`, `AddToCartPanel.tsx`, `globals.css`) pour confirmer l'état réel avant d'agir, conformément à la règle de prudence de la mission.

`git status` a été vérifié avant modification : l'essentiel du dépôt (`src/components/`, `src/app/product/`, `src/app/cart/`, etc.) apparaît en `??` (non suivi par git) — état préexistant du projet, non lié à cette mission, non modifié par elle.

---

## 3. Diagnostic MobileStickyCta

**Méthode** : lecture complète du code, puis reproduction en navigateur réel (Playwright/Chromium, build de production) sur des fiches produit réelles, à 390×844.

Le composant contient déjà (depuis la mission UX/UI Phase 1 du 2026-08-13) le correctif du bug de détection par `IntersectionObserver` : la détection utilise `getBoundingClientRect()` sur `scroll`/`resize`, limitée par `requestAnimationFrame` — ce mécanisme a été revérifié et fonctionne correctement (testé sur un balayage complet de positions de scroll avec hystérésis, apparition/disparition cohérente à chaque franchissement de seuil).

**Nouveau bug découvert et confirmé** (différent de celui de la Phase 1) : la condition de masquage `reachedEndBoundary` comparait la position du repère de fin (`#sticky-cta-end-boundary`) à `window.innerHeight` (un plein écran, ~844px en mobile). Sur un produit dont le contenu entre le panneau d'achat initial et la zone "produits liés" est plus court qu'un écran — ce qui est fréquent, car `reviewsCount` est à 0 sur la quasi-totalité du catalogue réel (aucune section avis à afficher) et les fiches produit à caractéristiques courtes sont nombreuses — la fenêtre de scroll où la barre devrait être visible devenait nulle ou **négative**, ce qui signifie que la barre **ne s'affichait jamais**, quel que soit le scroll.

**Mesure sur 60 produits réels** (script Playwright, calcul géométrique `endBoundaryTop - sentinelTop - 844`) :

| Résultat | Nombre |
|---|---|
| Fenêtre positive (barre fonctionnelle) | 33 / 60 |
| Fenêtre nulle ou négative (barre jamais visible) | **27 / 60 (45%)** |

Exemples de produits concernés : montres (`van-gogh-mens-quartz-wrist-watch-3d-printed`, fenêtre = -289px), bijoux (`s925-sterling-silver-2ct-moissanite-ring...`, -8px), outils de jardin, vêtements — sans lien avec une catégorie particulière, simplement des fiches au contenu descriptif court.

---

## 4. Correction MobileStickyCta

**Problème** : condition `endBoundary.getBoundingClientRect().top < window.innerHeight` — marge d'un écran entier, disproportionnée par rapport à son objectif réel (éviter que la barre ne recouvre le bouton "Ajouter au panier" d'un produit de la grille "produits similaires").

**Cause** : la barre elle-même ne mesure que ~68px de haut (confirmé via `--sticky-cta-height`). Il n'y a donc besoin que d'une marge de sécurité proche de cette hauteur, pas d'un écran complet.

**Solution** : remplacement de `window.innerHeight` par une constante `STICKY_BAR_SAFE_MARGIN_PX = 80` (hauteur réelle de la barre + petite marge). Un seul seuil numérique modifié, aucune autre logique touchée.

**Fichier** : `src/components/products/MobileStickyCta.tsx`.

**Risque** : faible — la logique de déclenchement (sentinel, hystérésis, `requestAnimationFrame`) est inchangée ; seul le seuil de la marge de fin change.

**Validation après correction** :
- Nouveau balayage des 60 mêmes produits : **0/60** en fenêtre nulle/négative (min. 475px, max. 1110px, moyenne 808px).
- Test de scroll réel (pas seulement géométrique) sur les 3 produits les plus critiques (dont le pire cas à -289px) : la barre apparaît et disparaît correctement à chaque seuil, dans les deux sens de scroll.
- Capture d'écran au moment précis où la barre doit disparaître : confirmé qu'elle se masque **avant** que les boutons "Ajouter au panier" de la grille "Produits similaires" ne soient visibles — l'objectif anti-recouvrement d'origine reste respecté.
- Vérifié aux 3 largeurs (390/834/1440) : la barre n'apparaît que sur mobile (≤640px), jamais sur tablette ni desktop.
- Aucun débordement horizontal introduit.
- Aucun élément interactif recouvert par l'empreinte de la barre pendant son affichage (vérifié programmatiquement + visuellement).
- Produit en stock : ajout au panier depuis la barre sticky fonctionne (`useCart().addToCart` inchangé), le compteur panier passe de 0 à 1, le toast de confirmation s'affiche correctement au-dessus de la barre (positionnement `--sticky-cta-height` inchangé et toujours correct), le bouton passe en "Ajouté ✓" désactivé (garde anti-double-tap inchangée).
- Produit hors stock réel trouvé dans le catalogue (`cat-eye-gel-magnetic-pen-for-nails`) : la barre affiche "Rupture de stock", bouton désactivé — `product.inStock` toujours respecté, aucune fausse disponibilité.

---

## 5. ProductRating / accessibilité

**Problème signalé (Phase 2)** : texte visible `rating.toFixed(1)` (ex. "3.0") vs `aria-label` utilisant la valeur brute `rating` (ex. "Note 3 sur 5").

**Statut** : confirmé toujours présent par lecture du code actuel.

**Correction** : `aria-label` aligné sur la même représentation (`rating.toFixed(1)`), ex. `"Note 3.0 sur 5, 12 avis"`. Aucune autre valeur touchée : `reviewsCount`, `hideWhenEmpty` et le rendu des étoiles (logique métier plein/vide, couleurs de marque de la Phase 2) restent strictement inchangés.

**Fichier** : `src/components/products/ProductRating.tsx`.

**Validation** : testé via une page de rendu isolée temporaire (composant réel, aucune donnée Shopify modifiée, page supprimée après vérification — voir section 14) : `aria-label` confirmé cohérent avec le texte visible pour plusieurs valeurs de note (3, 4.5, 0).

---

## 6. Ordre de tabulation

**Réclamation initiale (Phase 2)** : "le premier Tab depuis le haut de la page arrive sur le champ de recherche avant le bouton menu."

**Reproduction réelle** (Playwright, trace complète des 8 premiers arrêts de tabulation sur la home mobile 390px) :

| # | Élément |
|---|---|
| 1 | Lien d'évitement "Aller au contenu principal" |
| 2 | Bouton menu hamburger |
| 3 | Logo (lien accueil) |
| 4 | Lien "Mon compte" |
| 5 | Lien "Mes commandes" |
| 6 | Lien panier |
| 7 | Champ de recherche (ligne de recherche mobile, 2ᵉ rangée du header) |
| 8 | Bouton "Lancer la recherche" |

**Conclusion : réclamation NON REPRODUITE telle quelle.** Le bouton menu arrive en position 2 (juste après le lien d'évitement), bien avant la recherche en position 7. L'ordre suit la structure visuelle réelle : rangée d'icônes du header (menu → logo → compte → commandes → panier) puis, en dessous, la rangée de recherche mobile pleine largeur — ce qui est cohérent, pas incohérent. Conformément à la règle de prudence, **aucun changement d'ordre DOM n'a été appliqué** (pas de `tabindex` positif, aucune restructuration).

En revanche, cet audit a révélé deux problèmes d'accessibilité réels et distincts de la réclamation initiale — traités en section 7.

---

## 7. Autres corrections UX réellement nécessaires

Chaque point ci-dessous a été confirmé par reproduction en navigateur avant correction (arbre d'accessibilité, focus clavier réel), conformément à la règle de prudence.

### 7.1 Liens "Compte"/"Commandes" sans nom accessible (≤991px)

- **Problème** : `getComputedTextContent` = "BonjourCompte" / "VosCommandes", mais `page.accessibility.snapshot()` retournait un nom **vide (`''`)** pour ces deux liens à largeur mobile/tablette.
- **Cause** : leur seul texte visible (`.actionText`) est masqué en CSS (`display: none`) dès ≤991px — exclu du calcul du nom accessible — sans `aria-label` de compensation (contrairement à `.cartBtn`, qui en avait déjà un).
- **Impact** : un utilisateur de lecteur d'écran sur mobile/tablette entendait "lien" sans aucune indication de destination pour ces deux liens.
- **Solution** : ajout de `aria-label="Mon compte"` et `aria-label="Mes commandes"` — libellés **repris tels quels** des pages de destination (`src/app/account/page.tsx`, `src/app/account/orders/page.tsx`), aucun texte inventé.
- **Fichier** : `src/components/layout/Header.tsx`.
- **Risque** : nul — ajout d'attribut, aucun changement visuel ni comportemental.
- **Validation** : arbre d'accessibilité revérifié après correction — noms "Mon compte" et "Mes commandes" confirmés présents.

### 7.2 Lien d'évitement invisible au focus

- **Problème** : le lien "Aller au contenu principal" (`SiteLayout.tsx`) utilise `.visually-hidden` (`clip: rect(0,0,0,0)`), sans règle `:focus` pour redevenir visible.
- **Cause** : le style de focus générique du site (`a:focus-visible { outline... }`) s'applique bien, mais reste invisible car `clip` masque aussi le contour.
- **Impact** : un utilisateur clavier voyant ne recevait **aucun retour visuel** sur le tout premier Tab de chaque page.
- **Solution** : ajout d'une règle `.visually-hidden:focus` standard ("skip link") qui rend le lien visible et positionné en haut de page au focus, avec les couleurs de marque existantes (fond `#0C1F32`, texte blanc) — aucune nouvelle couleur introduite.
- **Fichier** : `src/app/globals.css`. Seul consommateur de `.visually-hidden` dans le projet (vérifié par recherche exhaustive) : la correction ne touche donc aucun autre élément.
- **Validation** : capture d'écran après correction — le lien apparaît clairement en haut à gauche au focus, lisible, sans chevauchement bloquant.

### 7.3 Fuite de focus clavier dans les drawers fermés

- **Problème** : en tabulant depuis le haut de la page, le focus finissait par atteindre le bouton "Fermer" du drawer "Toutes les catégories" **alors que ce drawer est fermé**.
- **Cause** : le drawer fermé est `aria-hidden="true"` mais reste dans le DOM avec ses éléments interactifs à `tabIndex={0}` — un conteneur `aria-hidden="true"` contenant un descendant focusable est une violation ARIA connue (focus "fantôme", incohérent pour les technologies d'assistance).
- **Solution** : ajout de `inert={!open}` sur la racine du `Drawer` (composant partagé par `CategoryMenu`, `FilterMobile`, `MegaMenuMobile`) — retire tout le sous-arbre de l'ordre de tabulation et de l'arbre d'accessibilité tant qu'il est fermé, sans toucher à Escape, à l'ouverture/fermeture, ni au focus déjà correctement rendu au déclencheur.
- **Fichier** : `src/components/ui/Drawer.tsx`.
- **Risque** : faible — `inert` est supporté nativement par React 19 et les navigateurs actuels (confirmé par `tsc` et par le test Chromium/Playwright utilisé pour toute cette mission).
- **Validation** : test de 20 tabulations consécutives depuis le haut de la home — plus aucun focus détecté à l'intérieur d'un conteneur `aria-hidden`/`inert` (0 occurrence, contre 1 avant correction).

### 7.4 Superposition plein écran de la galerie PDP sans Escape

- **Problème** : la superposition "voir en plein écran" de `ProductGallery` est déclarée `role="dialog" aria-modal="true"`, mais la touche Escape n'avait aucun effet, et le focus n'était ni déplacé à l'ouverture ni rendu au déclencheur à la fermeture.
- **Reproduction confirmée** : ouverture du plein écran, appui sur Escape → superposition toujours présente.
- **Solution** : alignement sur le pattern déjà existant et éprouvé de `Drawer.tsx` dans ce même projet (aucun nouveau pattern introduit) — écouteur Escape ajouté, focus déplacé vers le bouton "Fermer" à l'ouverture, focus rendu au bouton déclencheur ("Voir en plein écran") à la fermeture (avec garde contre le vol de focus au chargement initial de la page).
- **Fichier** : `src/components/products/ProductGallery.tsx`.
- **Risque** : faible — comportement additif, aucune modification de la navigation par flèches ni des miniatures.
- **Validation** : Escape referme désormais la superposition (confirmé après correction, avant/après comparés).

---

## 8. Validation mobile (390×844)

| Vérification | Résultat |
|---|---|
| `scrollWidth === clientWidth` (accueil, PDP, panier) | OK (390 = 390 partout) |
| Header intact | OK (capture d'écran vérifiée) |
| Recherche | OK — recherche réelle testée (saisie "smartphone" → navigation `/search?q=smartphone`) |
| Menu hamburger | OK (44×44px, hérité de la Phase 2, non re-régressé) |
| PDP (galerie, CTA, disponibilité, ProductRating) | OK — galerie testée (swipe non re-testé, hors périmètre ; plein écran + Escape testés), CTA "Ajouter au panier"/"Acheter maintenant" inchangés |
| CTA sticky | OK — voir sections 3 et 4, corrigé et revérifié sur produits réels |
| Panier | OK — ajout, quantités, suppression : code relu, aucun changement, aucune régression détectée |
| Aucun bouton sous 44×44px sur les nouvelles zones interactives | OK — aucune nouvelle zone tactile introduite en Phase 3 (uniquement des `aria-label`, `inert`, Escape, et un seuil numérique) |
| Aucun chevauchement / débordement | OK |

---

## 9. Validation tablette (834×1100)

| Vérification | Résultat |
|---|---|
| `scrollWidth === clientWidth` (accueil, PDP, panier) | OK (834 = 834 partout) |
| CTA sticky absent (>640px) | OK — confirmé absent après scroll dans la zone où il apparaîtrait en mobile |
| Header intact | OK (capture d'écran vérifiée) |
| PDP intacte | OK (capture d'écran vérifiée) |

---

## 10. Validation desktop (1440×900)

| Vérification | Résultat |
|---|---|
| `scrollWidth === clientWidth` (accueil, PDP, panier) | OK (1440 = 1440 partout) |
| CTA sticky absent | OK |
| Header intact, logo non déformé | OK (capture d'écran vérifiée) |
| PDP intacte (CTA principal, prix, disponibilité) | OK (capture d'écran vérifiée) |
| Lien d'évitement visible au focus | OK (testé également en desktop) |

---

## 11. Tests techniques

- **`npx tsc --noEmit`** : succès, aucune erreur.
- **`npm run lint`** : succès, aucune erreur ni avertissement.
- **`npm run build`** : succès — build de production Next.js 16.3.0 (Turbopack), 1032 pages générées, aucune erreur.
- **Script `test`** : **NO TEST SCRIPT PRESENT IN PACKAGE.JSON** — confirmé par lecture de `package.json` (scripts disponibles : `dev`, `build`, `start`, `lint`, `catalog:*`). Aucune suite de tests créée dans cette mission (aucune nécessité technique évidente ne le justifiait).

---

## 12. Contrôle Shopify

- **Zéro appel** aux outils `mcp__Shopify__*` effectué à aucun moment de cette mission.
- Aucun produit, prix, stock, variante, image, tag, collection, publication, statut modifié ; aucune commande créée ; aucun catalogue importé ; aucune configuration Shopify touchée.
- Les six fichiers modifiés sont exclusivement des composants d'affichage React/TSX et des fichiers CSS ne faisant aucun appel réseau. `src/services/`, `storefront.ts`, `src/app/actions/shopify-checkout.ts` et toute autre couche de données Shopify **n'ont pas été touchés**.
- Les données réelles utilisées pour les tests (produits en stock/hors stock, `reviewsCount`) ont été **lues**, jamais modifiées, exactement comme prescrit.

**SHOPIFY NON MODIFIÉ.**

---

## 13. Fichiers modifiés

1. `src/components/products/MobileStickyCta.tsx` — correction du seuil de masquage (bug P0, section 3-4).
2. `src/components/products/ProductRating.tsx` — cohérence `aria-label`/texte visible (section 5).
3. `src/components/layout/Header.tsx` — `aria-label` sur les liens "Compte"/"Commandes" (section 7.1).
4. `src/app/globals.css` — visibilité au focus du lien d'évitement (section 7.2).
5. `src/components/ui/Drawer.tsx` — `inert` sur drawer fermé (section 7.3).
6. `src/components/products/ProductGallery.tsx` — Escape + gestion du focus sur la superposition plein écran (section 7.4).

Aucun autre fichier modifié. Aucun fichier temporaire, route de debug ou asset résiduel laissé dans le dépôt (vérifié via `git status` avant livraison — voir section 14 pour la page de test temporaire créée puis supprimée pendant la vérification).

---

## 14. Problèmes non corrigés

- **Checkout depuis le panier — faux positif de test corrigé, aucun bug réel** : un premier test automatisé (Playwright) laissait penser que le clic sur "Passer la commande" ne naviguait pas vers `/checkout`. Reproduit avec une méthode de test fiable (`page.wait_for_url`) : la navigation fonctionne correctement à chaque essai. **Non reproduit** comme bug réel — c'était une course (race condition) dans le script de test lui-même (vérification de l'URL trop tôt après un clic sur une navigation client-side), pas dans le code du site. Documenté ici pour transparence, aucun changement de code effectué.
- **Focus trap partiel dans les drawers** : le commentaire du composant `Drawer.tsx` indique lui-même "focus piégé au minimum" — Tab peut sortir du drawer ouvert vers le reste de la page pendant qu'il est affiché (pas de vrai piège de focus modal). Comportement préexistant, non signalé par les phases précédentes, non corrigé ici : une implémentation de piège de focus complet serait un changement plus large que le périmètre "correction minimale" de cette mission ; recommandé pour la Phase 4 (voir section 15).
- **Catalogue réel sans avis** : confirmé à nouveau (comme en Phase 2) que la quasi-totalité des produits réels ont `reviewsCount = 0`. Pour vérifier visuellement le rendu de `ProductRating` (section 5), une route de test temporaire (`/qa-star-preview-temp`-style, non liée depuis le site), a été créée uniquement le temps de la capture d'écran puis **supprimée** avant la fin de la mission — jamais livrée dans l'état final du code.

---

## 15. Recommandations Phase 4

- **Piège de focus complet dans `Drawer.tsx`** : implémenter un vrai focus trap (Tab/Shift+Tab bouclant à l'intérieur du drawer ouvert) pour une conformité modale complète — actuellement seul le focus initial et le retour au déclencheur sont gérés.
- **Revue systématique des accessibles-names sur icônes seules** : l'audit de cette phase a trouvé 2 liens du header sans nom accessible en largeur réduite ; une revue exhaustive de tous les boutons/liens icône-seule du site (au-delà du header) pourrait révéler des cas similaires ailleurs (ex. filtres, tri, pagination).
- **`MobileStickyCta` — tests de non-régression automatisés** : étant donné qu'un bug à fort impact (45% du catalogue) est resté indétecté jusqu'à cette phase malgré un correctif partiel en Phase 1, un test automatisé simple (vérifier que la barre s'affiche pour un produit à contenu court ET pour un produit à contenu long) éviterait une régression silencieuse future — actuellement aucune suite de tests n'existe dans le projet (voir section 11).
- **Considérer l'ajout d'un vrai script `test`** dans `package.json`, même minimal, si le projet continue de croître en complexité UX/UI.

---

## Conclusion

Un bug P0 réel (barre CTA sticky invisible sur 45% du catalogue réel) a été découvert, corrigé avec un diff minimal et revérifié. Les points P1 signalés en Phase 2 ont été traités : l'incohérence `ProductRating` est corrigée, la réclamation sur l'ordre de tabulation n'a pas été reproduite mais l'audit qu'elle a motivé a révélé et corrigé trois problèmes d'accessibilité réels et vérifiés. Aucune donnée commerciale inventée, aucune mutation Shopify, aucun refactoring hors périmètre.
