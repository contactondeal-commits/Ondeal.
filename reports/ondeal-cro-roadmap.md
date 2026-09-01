# Stratégie CRO & Backlog Expérimental — Ondeal

**Date** : 13/08/2026
**Mode** : Document de préparation stratégique uniquement — **aucune modification de code ou de Shopify effectuée**. Ce document ne fait que planifier des tests futurs à partir des opportunités identifiées dans `reports/ondeal-cro-audit.md`.
**Contrainte respectée** : aucun taux de conversion précis n'est promis ou inventé nulle part dans ce document — aucun outil d'analytics n'était disponible pendant cette mission (NOT AVAILABLE). Les KPI et critères de succès ci-dessous sont exprimés en métriques à mesurer, pas en valeurs cibles chiffrées inventées.

---

## 1. Objectifs de la stratégie CRO

À partir des 13 opportunités documentées dans `reports/ondeal-cro-audit.md` (4 P0, 4 P1, 5 P2), la stratégie vise :

- **Augmenter le taux d'ajout au panier** (Add-to-Cart rate)
- **Augmenter le taux d'initiation de checkout** (Checkout Initiation)
- **Augmenter le taux de conversion final** (Purchase Conversion Rate)
- **Réduire l'abandon de panier**
- **Augmenter le panier moyen** (AOV)
- **Renforcer la confiance** (trust) à chaque étape du tunnel
- **Améliorer la conversion mobile**

Aucune valeur cible chiffrée n'est fixée ici en l'absence de données analytics réelles — chaque test ci-dessous précise la métrique à instrumenter et à observer une fois un outil d'analytics connecté (ex. GA4, Shopify Analytics natif).

## 2. Priorisation

Les 10 tests retenus couvrent, dans l'ordre, les 4 opportunités P0 (impact attendu le plus élevé, preuve la plus solide dans le code), puis les 4 opportunités P1, puis les 2 opportunités P2 jugées les plus impactantes sur le tunnel d'achat direct (progression panier visuelle, urgence CTA mobile) parmi les 5 P2 documentées. Les 3 P2 restantes (Hero data-driven, disponibilité sur CategoryBlocks, requête search dédoublée) sont volontairement laissées hors du top 10 — elles restent documentées dans `reports/ondeal-cro-audit.md` comme backlog secondaire.

---

## 3. Backlog des 10 tests CRO

### TEST CRO #1 — Affichage conditionnel des avis produit
**Hypothèse** : Le module Avis/Notation étant actuellement toujours vide (0 produit sur les 970 analysés ne possède de metafield `reviews.rating` ou `reviews.rating_count` renseigné — voir `storefront.ts:167`, `ReviewsList.tsx:7-9`, `ProductRating.tsx:12-13`), afficher un composant "avis" vide ou à 0 peut nuire à la confiance perçue plutôt que la renforcer.
**Variable** : Visibilité conditionnelle du bloc avis/notation sur la fiche produit.
**Control** : Bloc avis affiché tel quel actuellement (état vide/0 visible).
**Variant** : Bloc avis masqué tant qu'aucune donnée réelle n'est présente (fallback propre), remplacé par un signal de confiance alternatif déjà disponible (ex. badge "Livraison rapide" si donnée fiable, ou simple absence de bloc).
**KPI principal** : Taux d'ajout au panier depuis la fiche produit.
**KPI secondaires** : Taux de rebond fiche produit, temps passé sur la fiche produit.
**Durée recommandée** : NOT AVAILABLE — à définir selon le volume de trafic réel une fois analytics connecté (généralement 2 à 4 semaines pour atteindre une significativité statistique sur ce type de test).
**Critère de succès** : Amélioration mesurable du taux d'ajout au panier sur le variant par rapport au contrôle, sans dégradation du taux de rebond. Aucun seuil chiffré fixé a priori (NOT AVAILABLE sans historique analytics).
**Rollback** : Réactivation immédiate du bloc avis d'origine (flag de configuration, aucune dépendance Shopify).

---

### TEST CRO #2 — Correction du mécanisme de prix barré / promotion
**Hypothèse** : Le mécanisme de prix barré (`compareAtPrice`) et le tag `promotion` n'affectent aujourd'hui aucun produit visible en pratique (0/970 avec `compareAtPrice > price` ; tag `promotion` présent sur 1/970 seulement — voir `page.tsx:27`, `storefront.ts:111-118`). Rendre ce signal réellement actif sur une sélection de produits pertinents devrait augmenter la perception d'urgence/valeur et le taux de clic vers la fiche produit.
**Variable** : Présence effective d'un prix barré cohérent (`compareAtPrice`) sur un échantillon de produits à fort potentiel (nécessite une action Shopify humaine hors périmètre de cette mission — ce test ne peut être lancé qu'après validation humaine des prix).
**Control** : Produits sans `compareAtPrice` (état actuel).
**Variant** : Même produits avec `compareAtPrice` renseigné, cohérent et vérifiable.
**KPI principal** : Taux de clic (CTR) carte produit → fiche produit.
**KPI secondaires** : Taux d'ajout au panier, AOV sur les produits concernés.
**Durée recommandée** : NOT AVAILABLE — dépend du volume de trafic sur les produits sélectionnés.
**Critère de succès** : Hausse mesurable du CTR et du taux d'ajout au panier sur les produits variant vs. un groupe témoin comparable.
**Rollback** : Retrait du `compareAtPrice` sur les produits concernés (action Shopify réversible, à ne réaliser qu'après validation humaine explicite — hors périmètre de la présente mission en lecture seule).

---

### TEST CRO #3 — Refonte des pages de confiance (CGV, Livraison, Retours, Garantie)
**Hypothèse** : Tous les liens légaux/confiance du footer (CGV, Confidentialité, Cookies, Mentions légales, Livraison, Retours, Garantie) pointent aujourd'hui vers la même page FAQ générique `/help`, avec un numéro de téléphone visiblement factice (`01 00 00 00 00` — voir `Footer.tsx:9-46`, `help/page.tsx:48`). Des pages dédiées et un contact réel devraient réduire l'hésitation à l'achat, en particulier au moment du checkout.
**Variable** : Existence de pages de confiance dédiées et d'un contact réel.
**Control** : Liens actuels vers `/help` générique + numéro factice.
**Variant** : Pages dédiées (CGV, Livraison, Retours, Garantie) + coordonnées de contact réelles.
**KPI principal** : Taux d'initiation de checkout (Checkout Initiation).
**KPI secondaires** : Taux d'abandon panier, taux de clic sur les liens de confiance.
**Durée recommandée** : NOT AVAILABLE — recommandé de laisser tourner au moins un cycle commercial complet (ex. 4 semaines) pour capter l'effet sur l'abandon de panier.
**Critère de succès** : Réduction mesurable du taux d'abandon panier et hausse du taux d'initiation de checkout sur le variant.
**Rollback** : Réintégration des liens vers `/help` (changement de code réversible, aucune dépendance Shopify).

---

### TEST CRO #4 — Correction des filtres "Note" et "Livraison rapide"
**Hypothèse** : Les filtres catégorie "Note" et "Livraison rapide" retournent aujourd'hui systématiquement 0 résultat sur données réelles (liés à l'absence de notation — voir TEST #1 — et à l'absence du tag `livraison-rapide` sur le catalogue ; voir `FilterSidebar.tsx:60-96`). Un filtre qui ne retourne jamais rien peut faire perdre confiance dans l'outil de recherche/filtrage dans son ensemble.
**Variable** : Présence de filtres fonctionnels retournant des résultats réels, ou masquage des filtres non alimentés.
**Control** : Filtres "Note" et "Livraison rapide" visibles mais retournant 0 résultat (état actuel).
**Variant** : Filtres masqués tant qu'aucune donnée fiable ne les alimente (dépend de TEST #1 pour "Note" ; nécessite un tagging `livraison-rapide` réel et validé humainement pour l'autre).
**KPI principal** : Taux d'utilisation des filtres restants / taux de conversion depuis la page catégorie.
**KPI secondaires** : Taux de rebond page catégorie, nombre de pages vues par session sur les pages catégorie.
**Durée recommandée** : NOT AVAILABLE.
**Critère de succès** : Pas de dégradation du taux d'utilisation des filtres restants ; idéalement légère hausse du taux de conversion catégorie → fiche produit.
**Rollback** : Réaffichage des filtres d'origine (changement de code réversible).

---

### TEST CRO #5 — Confirmation visuelle d'ajout au panier
**Hypothèse** : Aucune confirmation visuelle (toast/snackbar) n'apparaît actuellement après un ajout au panier, ni depuis la fiche produit ni depuis la carte produit en "ajout rapide" (confirmé par recherche exhaustive dans le code — 0 occurrence de toast/snackbar/notification ; voir `AddToCartPanel.tsx:55`, `ProductCard.tsx:74`). Une confirmation claire devrait réduire les ajouts multiples accidentels et rassurer l'utilisateur sur l'action effectuée.
**Variable** : Présence d'une confirmation visuelle immédiate après ajout au panier.
**Control** : Aucune confirmation visuelle (état actuel — seul le badge du panier dans le header change).
**Variant** : Toast/snackbar de confirmation ("Produit ajouté au panier") avec lien direct vers le panier.
**KPI principal** : Taux de poursuite vers le panier après un ajout (clic sur le badge panier ou sur la confirmation).
**KPI secondaires** : Taux d'ajouts multiples accidentels (double-clic), taux de rebond après ajout.
**Durée recommandée** : NOT AVAILABLE — test relativement rapide à interpréter (2 semaines généralement suffisantes pour ce type de micro-interaction à fort volume).
**Critère de succès** : Hausse mesurable du taux de poursuite vers le panier après ajout, sans hausse du taux de rebond.
**Rollback** : Suppression du composant toast (changement de code réversible, isolé).

---

### TEST CRO #6 — Barre d'ajout au panier sticky sur mobile
**Hypothèse** : Aucune barre CTA sticky n'existe sur mobile pour l'ajout au panier (seule occurrence de `position:sticky` dans tout le code se trouve dans le résumé desktop du checkout, `checkout/page.module.css`) — sur une fiche produit longue, le bouton d'ajout au panier peut sortir du viewport après scroll, ce qui est un frein classique à la conversion mobile.
**Variable** : Présence d'une barre CTA sticky (prix + bouton "Ajouter au panier") en bas d'écran sur mobile lors du scroll sur la fiche produit.
**Control** : Bouton d'ajout au panier uniquement dans le flux normal de la page (état actuel).
**Variant** : Barre sticky mobile apparaissant après que le CTA principal sort du viewport.
**KPI principal** : Taux d'ajout au panier sur mobile (fiche produit).
**KPI secondaires** : Taux de conversion mobile global, temps avant premier ajout au panier.
**Durée recommandée** : NOT AVAILABLE — recommandé un minimum de 2-3 semaines pour couvrir la variabilité du trafic mobile.
**Critère de succès** : Hausse mesurable du taux d'ajout au panier mobile sur le variant vs. contrôle.
**Rollback** : Suppression du composant sticky (changement de code réversible, CSS/JS isolé).

---

### TEST CRO #7 — Signaux de confiance près du CTA et au checkout
**Hypothèse** : Aucun badge de confiance (paiement sécurisé, livraison, retours) n'apparaît près du bouton d'ajout au panier ni sur le résumé panier/checkout (voir `AddToCartPanel.tsx`, `CartSummary.tsx`, `checkout/page.tsx:74-82`). Ces badges sont un levier CRO classique pour réduire l'hésitation au moment critique de la décision d'achat.
**Variable** : Présence de badges de confiance (paiement sécurisé, retours, livraison) au plus près du CTA principal et du résumé de commande.
**Control** : Aucun badge de confiance visible à ces emplacements (état actuel).
**Variant** : Badges de confiance ajoutés près du CTA fiche produit et dans le résumé panier/checkout.
**KPI principal** : Taux d'initiation de checkout.
**KPI secondaires** : Taux de conversion finale (Purchase Conversion Rate), taux d'abandon panier.
**Durée recommandée** : NOT AVAILABLE.
**Critère de succès** : Hausse mesurable du taux d'initiation de checkout et/ou réduction de l'abandon panier sur le variant.
**Rollback** : Retrait des badges (changement de code réversible, purement visuel).

---

### TEST CRO #8 — Barre de progression visuelle pour la livraison gratuite
**Hypothèse** : Le message de progression vers la livraison gratuite est actuellement uniquement textuel dans le panier (`CartSummary.tsx:22-26`), sans représentation visuelle (barre de progression). Une barre visuelle est un pattern CRO éprouvé pour inciter à l'augmentation du panier moyen.
**Variable** : Présence d'une barre de progression visuelle en complément du message textuel existant.
**Control** : Message textuel seul (état actuel).
**Variant** : Message textuel + barre de progression visuelle vers le seuil de livraison gratuite.
**KPI principal** : Panier moyen (AOV).
**KPI secondaires** : Taux d'ajout d'un article supplémentaire après affichage du message, taux d'atteinte du seuil de livraison gratuite.
**Durée recommandée** : NOT AVAILABLE — recommandé un cycle d'au moins 3-4 semaines pour capter l'effet sur l'AOV.
**Critère de succès** : Hausse mesurable de l'AOV et/ou du taux d'atteinte du seuil de livraison gratuite sur le variant.
**Rollback** : Retrait de la barre visuelle, conservation du message textuel seul (changement de code réversible).

---

### TEST CRO #9 — Messagerie d'urgence / disponibilité sur la fiche produit
**Hypothèse** : `product.stock` est disponible dans le code mais n'est actuellement pas exploité pour afficher un message d'urgence/disponibilité sur la fiche produit (voir `product/[slug]/page.tsx:103-105`). **Réserve explicite** : ce test ne doit être lancé qu'après validation humaine de la fiabilité des données de stock — l'audit stock de cette même mission (`reports/shopify-live-catalog-audit.md`, section 2) a identifié des valeurs de `totalInventory` anormalement élevées sur 858/970 produits, dont l'origine exacte reste **NOT AVAILABLE / HUMAN VALIDATION REQUIRED**. Afficher un message d'urgence basé sur un stock non fiable serait contre-productif (perte de confiance si le message s'avère faux).
**Variable** : Présence d'un message d'urgence/disponibilité ("Plus que X en stock", "Disponible") sur la fiche produit, pour les produits dont le stock est confirmé fiable après validation humaine.
**Control** : Aucun message de disponibilité (état actuel).
**Variant** : Message de disponibilité affiché uniquement sur le sous-ensemble de produits à stock validé fiable.
**KPI principal** : Taux d'ajout au panier sur les produits concernés.
**KPI secondaires** : Délai avant achat (time-to-purchase), taux de conversion sur ces produits.
**Durée recommandée** : NOT AVAILABLE — ne peut démarrer qu'après la validation humaine préalable du stock (prérequis bloquant, hors délai de test lui-même).
**Critère de succès** : Hausse mesurable du taux d'ajout au panier sur les produits variant, sans qu'aucun message ne s'avère incorrect en pratique.
**Rollback** : Retrait immédiat du message si une incohérence de stock est détectée (changement de code réversible + dépendance forte à la fiabilité de la donnée source).

---

### TEST CRO #10 — Rationalisation de la recherche par catégorie
**Hypothèse** : La page `/search` avec un paramètre de catégorie effectue actuellement deux requêtes Shopify distinctes puis les croise côté client (`search/page.tsx:22-29`), ce qui ralentit potentiellement l'affichage des résultats sur mobile en particulier. Une requête unique optimisée devrait réduire le temps de chargement perçu.
**Variable** : Méthode de récupération des résultats de recherche filtrés par catégorie (requête unique vs. double requête + intersection client).
**Control** : Double requête + intersection client (état actuel).
**Variant** : Requête unique combinant recherche et filtre catégorie côté serveur.
**KPI principal** : Temps de chargement perçu de la page de résultats de recherche (proxy technique, pas un KPI business direct).
**KPI secondaires** : Taux d'abandon sur la page de résultats de recherche, taux de clic vers une fiche produit depuis les résultats.
**Durée recommandée** : NOT AVAILABLE — test technique, peut être validé rapidement via mesure de performance (quelques jours) avant d'observer l'effet business sur 2-3 semaines.
**Critère de succès** : Réduction mesurable du temps de chargement sans régression sur le taux de clic vers les fiches produit.
**Rollback** : Retour à la double requête d'origine (changement de code réversible, isolé à `search/page.tsx`).

---

## 4. Backlog secondaire (hors top 10)

Documenté pour mémoire dans `reports/ondeal-cro-audit.md`, non détaillé ici en format de test — à reprioriser lors d'une prochaine itération :

- Hero carousel data-driven plutôt que statique (`Hero.tsx:17-42`).
- Signal de disponibilité réelle sur `CategoryBlocks.tsx`.
- (Le troisième item P2 restant — requête search dédoublée — est en réalité couvert par le TEST CRO #10 ci-dessus.)

## 5. Rappel méthodologique

Aucun de ces 10 tests n'a été implémenté, lancé ou déployé pendant cette mission. Ce document est une préparation stratégique en lecture seule, dérivée exclusivement des preuves de code réelles documentées dans `reports/ondeal-cro-audit.md` et des données Shopify réelles documentées dans `reports/shopify-live-catalog-audit.md`. Aucun taux de conversion, aucune durée de test, aucun seuil de succès chiffré n'a été inventé — chaque zone dépendant de données analytics absentes est explicitement marquée **NOT AVAILABLE**.
