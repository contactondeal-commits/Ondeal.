# Ondeal CRO Implementation Report

Généré le : 2026-08-13
Mission : OPTIMISATION CRO ONDEAL.FR — PHASE 1
Périmètre : code + UX locale uniquement. Aucune mutation Shopify effectuée pendant cette mission.

---

## 1. Executive Summary

Cette phase a traité l'intégralité des 4 problèmes P0 et des 4 problèmes P1 identifiés dans `reports/ondeal-cro-audit.md`, en re-vérifiant chacun directement dans le code actuel avant toute correction (conformément à la section 1 de la mission — les conclusions de l'audit initial n'ont pas été supposées toujours exactes).

Chaque correction suit la même règle : ne jamais afficher de donnée commerciale inventée (avis, note, stock, remise, délai, garantie, certification). Quand une donnée réelle manque, l'élément concerné est soit masqué proprement, soit remplacé par un état honnête ("Aucun avis pour le moment", "NOT AVAILABLE"), soit reconstruit à partir d'une donnée déjà réelle et existante dans le projet (FAQ `help-data.ts`, seuil de livraison gratuite déjà codé, etc.).

8/8 problèmes P0+P1 traités. 3 améliorations P2 supplémentaires implémentées (gating de la section promotions, badges de confiance étendus au panier/checkout, barre de progression livraison gratuite). Le reste des P2 (Hero data-driven, signal de disponibilité par catégorie, optimisation de la double requête de recherche) est documenté comme opportunité future non implémentée, conformément à la priorisation demandée ("P2 seulement après validation des P0/P1").

Aucun produit, prix, stock, variante, tag, image ou statut de publication Shopify n'a été modifié. Aucune commande n'a été créée. `npx tsc --noEmit`, `npm run lint` et `npm run build` passent tous les trois sans erreur.

---

## 2. Méthodologie appliquée

Pour chaque problème traité : reproduction dans le code actuel → identification de la cause exacte (fichier/ligne/logique) → proposition de correctif → implémentation locale si sûre → test (tsc/lint/build + vérification fonctionnelle des routes concernées) → documentation avant/après ci-dessous. Aucun changement n'a été fait pour des raisons purement esthétiques sans compréhension de la cause racine.

---

## 3. P0-1 — Avis clients jamais peuplés

**Avant** : `ProductRating` affichait "Aucun avis" en toutes lettres sur chaque `ProductCard`, y compris pour les 969/970 produits sans avis réel (`reviewsCount = 0`, dérivé honnêtement des metafields Shopify `reviews.rating`/`reviews.rating_count` dans `mapStorefrontProduct` — donnée déjà correcte à la source, seul l'affichage était problématique). Répéter "Aucun avis" sur la quasi-totalité du catalogue nuit à la crédibilité perçue et n'apporte aucune information utile en vue liste.

**Cause exacte** : `ProductRating.tsx` ne proposait pas de mode "masqué si vide" ; `ProductCard.tsx` l'appelait donc systématiquement en clair.

**Correctif** : ajout d'une prop `hideWhenEmpty?: boolean` à `ProductRating` — retourne `null` quand `reviewsCount === 0` et que la prop est active. `ProductCard` l'active désormais. La page produit (PDP), elle, continue d'afficher l'état "Aucun avis pour le moment" explicite (comportement inchangé, pertinent en contexte détaillé) via `ReviewsList`.

**Fichiers** : `src/components/products/ProductRating.tsx`, `src/components/products/ProductCard.tsx`

**Donnée inventée** : aucune. Aucune note ni nombre d'avis n'a été fabriqué.

---

## 4. P0-2 — Prix barré / promotion jamais actifs

**Avant/vérification** : re-lecture de `mapStorefrontProduct` (`src/lib/shopify/storefront.ts`) : `oldPrice` et `discount` ne sont déjà positionnés que lorsque `compareAtPrice > price` (donnée Shopify réelle). Aucune fausse promotion n'était générée par le code. Le problème réel constaté est différent de ce que l'audit initial supposait : la section homepage "Offres du moment" agrégeait les quelques produits tagués `promotion`, mais seul **1 produit sur 970** porte ce tag — une section entière "Offres" pour un seul article donne une impression de site peu actif ou de promo trompeuse ("Offres du moment" au pluriel pour 1 seul produit).

**Cause exacte** : `src/app/page.tsx` rendait la section dès que `deals.length > 0`, sans seuil minimal de crédibilité.

**Correctif** : ajout de `MIN_DEALS_TO_SHOW_SECTION = 4` — la section "Offres du moment" ne s'affiche que si au moins 4 produits réels qualifient. Vérifié fonctionnellement : la section n'apparaît plus sur la homepage buildée (1 seul produit disponible actuellement). Aucune modification de la logique de calcul du prix barré elle-même : elle était déjà correcte et n'a pas été touchée.

**Fichiers** : `src/app/page.tsx`

**Donnée inventée** : aucune. Aucun `compareAtPrice` ni seuil de promotion n'a été inventé.

---

## 5. P0-3 — Footer / confiance générique avec numéro de téléphone factice

**Avant** : `src/app/help/page.tsx` affichait un lien `tel:+33100000000` ("01 00 00 00 00") — numéro manifestement factice, jamais confirmé comme un vrai canal de support. Le footer renvoyait vers une page `/help` générique pour CGV, confidentialité, livraison, retours, mentions légales — aucune de ces pages n'existait réellement avec un contenu dédié.

**Cause exacte** : `help/page.tsx` contenait un numéro codé en dur sans source de données réelle ; `Footer.tsx` ne liait aucune page légale dédiée.

**Correctif** :
- Suppression du lien téléphonique factice dans `help/page.tsx` (remplacé par un commentaire expliquant la suppression) ; le contact réel confirmé (`mailto:contact@ondeal.fr`) est conservé.
- Création de 9 pages sous `/legal/*` :
  - `/legal/livraison` et `/legal/retours` : contenu réel, réutilisé depuis `HELP_SECTIONS` dans `src/app/help/help-data.ts` (aucune donnée nouvelle inventée — uniquement restructuration de contenu déjà existant et validé dans le projet).
  - `/legal/cgv`, `/legal/confidentialite`, `/legal/cookies`, `/legal/mentions-legales`, `/legal/garantie` : contenu juridique **non disponible** dans le projet (raison sociale, SIRET, adresse légale, hébergeur, etc. absents des données du projet) — inventer ce contenu créerait un risque juridique et de confiance pire que son absence. Ces pages affichent donc un état honnête "Contenu en cours de finalisation — NOT AVAILABLE" via le composant partagé `LegalPendingPage`, avec le seul canal de contact réel confirmé, plutôt qu'un texte juridique fabriqué. Marquées `robots: noindex, follow`.
- `Footer.tsx` : les liens "Service client" et "Informations" pointent désormais vers ces pages dédiées au lieu de tous rediriger vers `/help`.

**Fichiers** : `src/app/help/page.tsx`, `src/components/layout/Footer.tsx`, `src/app/legal/legal.module.css`, `src/app/legal/LegalPendingPage.tsx`, `src/app/legal/{cgv,confidentialite,cookies,mentions-legales,garantie,livraison,retours}/page.tsx`

**Donnée inventée** : aucune. Le contenu juridique non disponible est explicitement marqué comme tel plutôt que fabriqué.

---

## 6. P0-4 — Filtres Note / Livraison rapide retournant systématiquement 0 résultat

**Avant/vérification** : re-lecture de `FilterSidebar.tsx` et de `filterProducts()` : les filtres "Note minimum" et "Livraison rapide" existaient dans l'UI mais reposaient sur des champs (`minRating`, `fastDeliveryOnly`) sans source de données Shopify fiable et cohérente sur le catalogue actuel — un filtre visuellement fonctionnel qui ne peut jamais retourner de résultat correct trompe l'utilisateur (il croit qu'aucun produit ne correspond, alors que le filtre lui-même est cassé).

**Cause exacte** : absence de donnée réelle exploitable en amont pour ces deux critères sur l'ensemble du catalogue (confirmé par la même investigation que l'audit initial, re-vérifiée sur le code actuel).

**Correctif** : suppression complète des groupes de filtres UI "Note" et "Livraison rapide" dans `FilterSidebar.tsx` (remplacés par un commentaire citant P0-4 et l'évidence de données). Un filtre qui ment systématiquement sur les résultats a été retiré plutôt que laissé en place. Les types `FilterState.minRating`/`.fastDeliveryOnly` et la logique de `filterProducts()` n'ont pas été supprimés (aucune régression sur le reste du filtrage), seule l'UI qui les exposait a été retirée.

**Fichiers** : `src/components/filters/FilterSidebar.tsx`

**Donnée inventée** : aucune.

---

## 7. P1-1 — Aucune confirmation visuelle après ajout au panier

**Avant** : `addToCart` (dans `useCart.ts`) appelait directement le store Zustand sans aucun retour visuel — l'utilisateur n'avait aucune confirmation que l'ajout avait fonctionné.

**Correctif** : création d'un système de toast complet et éphémère (non persisté, volontairement — un état de confirmation ne doit pas survivre à un rechargement) :
- `src/store/toastStore.ts` : store Zustand dédié.
- `src/components/ui/ToastContainer.tsx` + `.module.css` : rendu des toasts, auto-dismiss à 4500 ms, bouton de fermeture, CTA optionnel, `role="status" aria-live="polite"` pour l'accessibilité.
- Monté une seule fois globalement dans `SiteLayout.tsx`.
- `useCart.ts` : `addToCart` déclenche désormais un toast (titre produit, quantité, prix réel calculé, lien "Voir le panier") en plus de l'appel existant au store — la logique Shopify Cart API sous-jacente n'a pas été touchée, aucun site d'appel n'a dû être modifié.

Le toast n'étant pas bloquant et n'entraînant aucune navigation forcée, l'utilisateur reste sur la page produit et peut naturellement continuer ses achats — ce qui couvre l'exigence "possibilité de continuer ses achats" de la section 8 sans composant additionnel. Un second CTA "Commander" dans le toast a été volontairement écarté : il court-circuiterait la relecture du panier avant paiement, ce qui n'est pas cohérent avec un parcours d'achat sain — décision documentée ici plutôt qu'implémentée.

**Fichiers** : `src/store/toastStore.ts`, `src/components/ui/ToastContainer.tsx`, `src/components/ui/ToastContainer.module.css`, `src/components/layout/SiteLayout.tsx`, `src/hooks/useCart.ts`

**Donnée inventée** : aucune — le prix et la quantité affichés dans le toast sont ceux réellement ajoutés.

---

## 8. P1-2 — Absence de CTA sticky mobile

**Avant** : aucune barre d'action persistante sur mobile ; seule occurrence de `position: sticky`/`fixed` dans tout le projet avant cette mission était le résumé desktop du checkout.

**Correctif** : `MobileStickyCta.tsx` — barre fixe bas d'écran, visible uniquement sur mobile (`window.matchMedia("(max-width: 640px)")`), qui n'apparaît qu'une fois le bloc d'achat initial (`#add-to-cart-sentinel`, ajouté dans `product/[slug]/page.tsx`) sorti du viewport (via `IntersectionObserver`). Respecte l'état réel `product.inStock` (bouton désactivé si rupture de stock). Utilise le même `useCart().addToCart` que le reste du site (la confirmation toast P1-1 s'affiche donc automatiquement). N'occulte aucune information ni ne bloque le scroll. Coordination CSS avec `ToastContainer` via la variable `--sticky-cta-height` (les deux composants ne sont pas ancêtre/descendant l'un de l'autre dans le DOM).

**Fichiers** : `src/components/products/MobileStickyCta.tsx`, `src/components/products/MobileStickyCta.module.css`, `src/app/product/[slug]/page.tsx`

**Donnée inventée** : aucune.

---

## 9. P1-3 — Signal de disponibilité peu clair / stock anormal

**Avant/vérification** : la page produit affichait `En stock (${product.stock} disponibles)`, où `product.stock` provient directement de `totalInventory` Shopify. L'audit catalogue du 13/08/2026 (`reports/shopify-live-catalog-audit.md`) a confirmé que **858/970 produits** ont une valeur `totalInventory` manifestement anormale (jusqu'à 3 440 217 unités) — cause exacte NOT AVAILABLE, nécessite une validation humaine côté Shopify. Afficher ce chiffre brut nuit gravement à la crédibilité ("En stock (3440217 disponibles)").

**Cause exacte** : affichage direct du champ `stock` numérique sans garde-fou, dans `product/[slug]/page.tsx`.

**Correctif** : remplacement par un signal strictement binaire — "En stock" / "Rupture de stock" — dérivé de `product.inStock` (lui-même dérivé en priorité de `availableForSale`, avec `totalInventory` uniquement en repli, voir `mapStorefrontProduct`). Aucun chiffre de stock, aucun compte à rebours, aucune fausse urgence ("plus que 3 en stock") n'est affiché nulle part dans le code, conformément à l'interdiction explicite de la mission (section 10) compte tenu de l'anomalie de stock confirmée.

**Fichiers** : `src/app/product/[slug]/page.tsx`

**Donnée inventée** : aucune — au contraire, une donnée non fiable a été volontairement neutralisée plutôt qu'affichée telle quelle.

---

## 10. P1-4 — Absence de badges de confiance près du CTA

**Avant** : aucun signal de réassurance (paiement sécurisé, livraison, retours) n'apparaissait près du bouton d'achat, ni sur la PDP ni au panier/checkout.

**Correctif** : `TrustBadges.tsx` — 3 badges, chacun adossé à une donnée réelle et citée en commentaire dans le code :
- "Paiement sécurisé (Shopify)" — checkout Shopify réel vérifié fonctionnel de bout en bout (`reports/shopify-storefront-revalidation.md`).
- "Livraison offerte dès 39 €" — seuil réel déjà utilisé dans `CartSummary.tsx` (`FREE_SHIPPING_THRESHOLD`) et dans la FAQ existante (`help-data.ts`).
- "Retours sous 14 jours" — délai réel déjà documenté dans la FAQ existante.

Aucun logo de paiement non confirmé, aucune certification, aucun avis n'est affiché. Intégré sur la PDP (juste après `AddToCartPanel`), dans `CartSummary` (variante `compact`) et dans la vue checkout Shopify réel (`checkout/page.tsx`, variante `compact`).

**Fichiers** : `src/components/products/TrustBadges.tsx`, `src/components/products/TrustBadges.module.css`, `src/app/product/[slug]/page.tsx`, `src/components/cart/CartSummary.tsx`, `src/app/checkout/page.tsx`

**Donnée inventée** : aucune.

---

## 11. P2 — Améliorations complémentaires implémentées

- **Barre de progression livraison gratuite** (section 12 de la mission, TEST CRO #8 du roadmap) : `CartSummary.tsx` affichait déjà un message texte "Plus que X € pour la livraison offerte" basé sur le seuil réel `FREE_SHIPPING_THRESHOLD = 39` (déjà présent avant cette mission). Amélioré avec une barre de progression visuelle (`role="progressbar"`, pourcentage réel = sous-total réel / seuil réel), plus un état "Livraison offerte débloquée ✓" une fois le seuil atteint. Aucun seuil inventé — c'est la même constante déjà utilisée ailleurs dans le projet (`checkout/page.tsx`, `TrustBadges.tsx`).
- **Gating de la section "Offres du moment"** — voir section 4 ci-dessus (classé P0 dans l'audit, techniquement une amélioration de seuil d'affichage).
- **Badges de confiance étendus au panier et au checkout** — voir section 10 ci-dessus.

## 12. P2 — Non implémenté dans cette phase (documenté, priorisation respectée)

Conformément à la règle "P2 seulement après validation des P0/P1" et à la section 4 du roadmap existant (`reports/ondeal-cro-roadmap.md`), les éléments suivants restent des opportunités documentées, non implémentées dans cette phase :
- **Hero homepage data-driven** (section 13) : le Hero actuel (`Hero.tsx`) est statique. Le rendre dynamique nécessiterait de définir une source de vérité produit/catégorie sans invention de promesse commerciale — à traiter en Phase 2.
- **Signal de disponibilité par catégorie** (`CategoryBlocks.tsx`) — nécessite le même garde-fou anti-donnée-brute que P1-3, à étendre en Phase 2.
- **Optimisation de la double requête de recherche** (`search/page.tsx`) — optimisation de performance, sans impact CRO direct visible ; reportée pour ne pas mélanger un changement de performance non trivial avec cette phase orientée conversion.

---

## 13. Performance, SEO, SSR/SSG, accessibilité

Aucun changement n'introduit de composant client lourd inutile : `MobileStickyCta` et `ToastContainer` sont de petits composants clients ciblés (déjà nécessaires pour l'interactivité), aucun appel API supplémentaire n'a été ajouté (le toast et la barre sticky réutilisent les données déjà chargées côté serveur). Aucune image ajoutée. Aucune animation lourde (transition CSS simple sur la barre de progression et le slide-up mobile). `npm run build` confirme que les 1056 routes (homepage, ~65 catégories, ~970 produits, pages légales, recherche) se génèrent toujours correctement en SSG/ISR (`revalidate: 1m`) sans erreur, préservant le comportement Shopify Storefront API existant. Les nouveaux éléments interactifs (toast, CTA sticky, barre de progression) utilisent `aria-live`, `role="status"`/`role="progressbar"`, `aria-label` et respectent la navigation clavier standard des éléments HTML natifs utilisés (`button`, `Link`).

---

## 14. Analytics

**Constat (vérifié par recherche exhaustive dans `src/`, motifs `gtag|dataLayer|fbq|GA_MEASUREMENT|analytics|Analytics|pixel|Pixel|GTM|trackEvent`)** : **NOT AVAILABLE** — aucun tracking GA4, Meta Pixel, événement Shopify (AddToCart/BeginCheckout/Purchase) ni analytics interne n'existe dans le code source à ce jour. Aucune statistique de conversion, de taux d'ajout au panier ou de comportement utilisateur n'est donc mesurable actuellement, et aucune n'a été inventée dans ce rapport ou ailleurs.

Cette absence est documentée comme un manque à combler avant tout lancement de test A/B mesurable (voir section suivante) — sans instrumentation, aucun des 6 tests proposés ne pourra produire de KPI réel.

---

## 15. Roadmap de tests A/B — 6 tests prioritaires

Aucun test n'a été lancé ni implémenté en variantes multiples pendant cette phase — uniquement la roadmap ci-dessous, conformément à la section 16 de la mission. Aucun gain de conversion n'est annoncé : toutes les valeurs de KPI seront à mesurer une fois l'instrumentation analytics (section 14) mise en place.

### Test 1 — Confirmation AddToCart
- **Hypothèse** : une confirmation visuelle immédiate après ajout au panier réduit l'abandon perçu et augmente le taux de poursuite vers le panier.
- **Élément testé** : présence/absence du toast de confirmation (`ToastContainer` + `useCart`).
- **KPI principal** : taux de clic sur "Voir le panier" depuis la confirmation.
- **Variante A (contrôle)** : aucun retour visuel après ajout (comportement pré-mission).
- **Variante B** : toast actuel avec titre, quantité, prix, CTA "Voir le panier".
- **Risque** : faible — additif, ne modifie pas la logique panier.
- **Méthode de mesure** : événement analytics `toast_shown` + `toast_cta_click` (NOT AVAILABLE tant que l'analytics section 14 n'est pas implémentée).

### Test 2 — CTA sticky mobile
- **Hypothèse** : une barre CTA persistante sur mobile augmente le taux d'ajout au panier sur PDP mobile.
- **Élément testé** : présence/absence de `MobileStickyCta`.
- **KPI principal** : taux d'ajout au panier mobile (PDP).
- **Variante A (contrôle)** : pas de barre sticky (comportement pré-mission).
- **Variante B** : barre sticky actuelle (visible après sortie du viewport du bloc d'achat initial).
- **Risque** : faible-moyen — surveiller le recouvrement avec d'autres éléments fixes en bas d'écran sur petits écrans.
- **Méthode de mesure** : événement `sticky_cta_add_to_cart` vs `pdp_add_to_cart` total.

### Test 3 — Badges de confiance
- **Hypothèse** : la présence de badges de confiance (paiement sécurisé, livraison, retours) près du CTA augmente le taux de conversion PDP → panier et panier → checkout.
- **Élément testé** : présence/absence de `TrustBadges`.
- **KPI principal** : taux d'ajout au panier (PDP) et taux de passage au paiement (panier).
- **Variante A (contrôle)** : aucun badge (comportement pré-mission).
- **Variante B** : badges actuels (PDP, panier, checkout).
- **Risque** : faible — purement informatif, aucune donnée non vérifiée affichée.
- **Méthode de mesure** : comparaison des taux de conversion par cohorte avec/sans badges visibles.

### Test 4 — Affichage prix barré réel
- **Hypothèse** : afficher un prix barré uniquement quand une vraie remise Shopify existe (déjà le cas) plutôt que de façon plus visible/moins visible influence le taux de clic.
- **Élément testé** : mise en avant visuelle du bloc `oldPrice`/`discount` (déjà 100 % basé sur `compareAtPrice` réel — aucune invention).
- **KPI principal** : taux de clic sur les produits avec remise réelle vs sans.
- **Variante A (contrôle)** : style actuel du bloc prix.
- **Variante B** : mise en avant renforcée (à définir) du badge de réduction réelle uniquement.
- **Risque** : faible — ne touche jamais au calcul du prix, seulement au style d'affichage d'une donnée déjà réelle.
- **Méthode de mesure** : taux de clic produit (liste → PDP) segmenté par présence de remise réelle.

### Test 5 — Reviews réelles
- **Hypothèse** : masquer complètement le bloc avis en liste produit (plutôt que d'afficher "Aucun avis") améliore la perception de fiabilité du catalogue, sans qu'aucune note ne soit jamais inventée.
- **Élément testé** : `ProductRating` avec/sans `hideWhenEmpty`.
- **KPI principal** : taux de clic liste → PDP pour les produits sans avis.
- **Variante A (contrôle)** : "Aucun avis" affiché sur chaque carte (comportement pré-mission).
- **Variante B** : masqué si `reviewsCount === 0` (comportement actuel).
- **Risque** : faible — n'affecte jamais la PDP, où l'état honnête reste visible.
- **Méthode de mesure** : comparaison du taux de clic par cohorte.

### Test 6 — Progression livraison gratuite (si seuil confirmé)
- **Hypothèse** : une barre de progression visuelle vers le seuil de livraison gratuite (39 €, seuil réel confirmé) augmente le panier moyen.
- **Élément testé** : présence/absence de la barre de progression dans `CartSummary`.
- **KPI principal** : panier moyen (AOV) et taux d'atteinte du seuil de 39 €.
- **Variante A (contrôle)** : message texte seul, sans barre visuelle (comportement pré-mission).
- **Variante B** : barre de progression visuelle actuelle + message dynamique.
- **Risque** : faible — seuil déjà réel et déjà utilisé ailleurs, aucune invention.
- **Méthode de mesure** : AOV moyen par cohorte + `% de paniers atteignant 39 €`.

---

## 16. Contrôle Shopify — zéro mutation

Voir la checklist complète en section 17. Résumé : aucun appel `mcp__Shopify__*` de type mutation (`graphql_mutation`, `update-product`, `bulk-update-product-status`, `set-inventory`, `create-product`, `create-collection`, `update-collection`, `add-to-collection`, `create-discount`) n'a été effectué pendant cette mission. Seule la lecture (`get-shop-info`, en tout début de mission précédente pour vérifier la connexion) a été utilisée dans l'historique global de la session — aucune lecture ni écriture Shopify n'a eu lieu durant cette Phase 1 CRO. Les 147 produits Bijoux HIGH tagués `cat-bijoux`, le produit LOW exclu, et les exclusions wearables restent strictement dans l'état laissé par la mission de tag précédente — non retouchés ici.

---

## 17. Conclusion

Les 4 problèmes P0 et les 4 problèmes P1 de l'audit CRO ont été traités avec une méthode systématique (reproduction → cause → correctif → test → documentation), en corrigeant au passage un écart entre l'audit initial et l'état réel du code (le calcul du prix barré était déjà correct ; le vrai problème P0-2 était le seuil d'affichage de la section promotions). Trois améliorations P2 supplémentaires à faible risque ont été ajoutées. Aucune donnée commerciale (avis, note, stock, remise, délai, garantie, certification, contact) n'a été inventée à aucun moment — chaque affichage repose soit sur une donnée Shopify réelle, soit sur une donnée déjà existante dans le projet, soit sur un état honnête "non disponible". Zéro mutation Shopify. `tsc`, `lint` et `build` passent sans erreur. La Phase 2 pourra s'appuyer sur l'instrumentation analytics (actuellement absente) pour mesurer réellement les 6 tests A/B proposés, et traiter les éléments P2 restants (Hero, disponibilité par catégorie, recherche).
