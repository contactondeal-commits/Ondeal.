# Audit CRO — Ondeal.fr

**Date** : 13/08/2026
**Méthode** : lecture exhaustive du code source réel (aucune modification effectuée), croisée avec les données Shopify réelles vérifiées le même jour (`reports/shopify-live-catalog-audit.json`). Chaque opportunité cite un fichier/ligne précis comme preuve — aucune ne repose sur une supposition non vérifiée.
**Données analytics** : NOT AVAILABLE — aucun accès à Google Analytics / Shopify Analytics / outil de tracking n'a été fourni à cette session. Tous les impacts attendus ci-dessous sont qualitatifs (fondés sur des principes CRO documentés et sur la donnée catalogue réelle), **jamais chiffrés en taux de conversion précis**.

---

## Parcours analysé

Accueil → Catégorie → Produit → Ajout panier → Panier → Checkout Shopify, en couvrant : homepage, product cards, pages catégorie, page produit, panier, checkout, navigation, recherche, UX mobile, CTA, signaux de confiance, livraison/retours, disponibilité, prix barrés, badges, recommandations/cross-sell/upsell.

## Ce qui fonctionne déjà bien (à préserver)

- Le checkout réel Shopify est fonctionnel de bout en bout (vérifié le jour même — `reports/shopify-storefront-revalidation.md`), avec redirection propre vers `ondeal.fr`.
- `src/components/cart/CartSummary.tsx` affiche un message de progression vers la livraison offerte ("Plus que X € pour la livraison offerte !") — mécanique AOV éprouvée, déjà en place.
- `ProductCard.tsx` permet l'ajout au panier directement depuis la grille (pas besoin d'ouvrir la fiche produit) — réduit la friction.
- Le panier affiche un badge de comptage en temps réel dans le header (`Header.tsx` ligne 60).
- La recherche a des suggestions instantanées avec historique (`SearchBar.tsx`).

---

## Opportunités CRO classées

### P0 — Impact potentiel très élevé

**P0-1 — Aucune preuve sociale n'est jamais affichée (avis/notes toujours vides sur données réelles)**
- **Problème** : chaque fiche produit devrait afficher note + avis clients, mécanique de confiance majeure en e-commerce.
- **Preuve dans le code** : `src/lib/shopify/storefront.ts` ligne 167, `reviewsCount: node.ratingCount ? Number(node.ratingCount.value) : 0` — le metafield `reviews.rating_count` n'est renseigné sur aucun produit réel testé (`ratingValue: null` confirmé en test live le 13/08/2026). `ReviewsList.tsx` ligne 7-9 affiche alors systématiquement "Aucun avis pour ce produit pour le moment." et `ProductRating.tsx` ligne 12-13 affiche "Aucun avis" au lieu d'étoiles. Le champ `product.reviews` (`types/index.ts` ligne 42) n'est d'ailleurs jamais peuplé par le mapping Shopify.
- **Impact attendu** : la preuve sociale est l'un des leviers de confiance les plus documentés en e-commerce — son absence totale et systématique pénalise particulièrement les nouveaux visiteurs sans confiance préétablie dans la marque.
- **Risque** : faible à intégrer (ajout, pas de suppression) ; risque si de faux avis étaient generés — à proscrire absolument.
- **Effort** : élevé (nécessite une vraie source d'avis — app Shopify dédiée, ou import) ou moyen (import initial + widget de collecte post-achat).
- **Recommandation** : connecter une app d'avis Shopify (native ou tierce) et peupler le metafield `reviews.rating`/`rating_count`, en commençant par les produits à plus fort trafic.
- **Métrique à mesurer** : taux de conversion PDP → Ajout panier avant/après apparition des avis. NOT AVAILABLE tant qu'aucun outil analytics n'est connecté.

**P0-2 — Le mécanisme de prix barré / promotion ne se déclenche jamais sur les données réelles**
- **Problème** : aucun produit du catalogue réel n'affiche de prix barré ni de badge "Promotion", alors que le code le supporte pleinement.
- **Preuve dans le code** : `reports/shopify-live-catalog-audit.json` → 0/970 produits ont `compareAtPrice > price` (vérifié en direct sur l'API réelle) ; le tag `promotion` n'est présent que sur **1 seul produit** sur 970 (`TAG_TO_BADGE` dans `storefront.ts` ligne 111-118). La section homepage "Offres du moment" (`src/app/page.tsx` ligne 27, `fetchDeals` interrogeant `tag:promotion`) ne peut donc afficher qu'un seul produit réel sous un intitulé qui promet une sélection de bonnes affaires.
- **Impact attendu** : l'ancrage par prix barré est l'un des déclencheurs d'urgence/valeur perçue les plus efficaces ; son absence totale prive le site d'un levier majeur, et la section "Offres du moment" quasi-vide nuit à la crédibilité perçue dès la page d'accueil.
- **Risque** : moyen — nécessite une vraie politique de prix promotionnels (decision business, pas juste technique) ; ne pas afficher de faux prix barrés.
- **Effort** : élevé (politique tarifaire) mais le code applicatif est déjà prêt à l'exploiter sans modification.
- **Recommandation** : définir une politique de prix barrés réels sur une sélection de produits (via `compare_at_price` Shopify), et/ou masquer la section "Offres du moment" tant qu'elle ne contient pas un nombre crédible de produits réellement en promotion.
- **Métrique** : nombre de produits avec promotion active ; taux de clic sur la section "Offres du moment".

**P0-3 — Pages légales/confiance toutes redirigées vers une simple FAQ générique**
- **Problème** : dans le footer, "CGV", "Confidentialité", "Cookies", "Mentions légales", "Livraison", "Retours", "Garantie" pointent tous vers la même page `/help`, qui n'est qu'un accordéon FAQ — aucune de ces pages n'existe réellement.
- **Preuve dans le code** : `src/components/layout/Footer.tsx` lignes 9-46, chaque `href` de ces liens vaut `"/help"`. `src/app/help/page.tsx` confirme qu'il s'agit d'une simple FAQ, pas de textes légaux. Le numéro de téléphone affiché (`src/app/help/page.tsx` ligne 48, `01 00 00 00 00`) est un numéro factice non fonctionnel.
- **Impact attendu** : absence de CGV/Politique de confidentialité/Mentions légales = frein de confiance direct au moment du paiement (le visiteur cherchant ces informations avant de payer ne les trouve pas), en plus d'un risque de non-conformité légale française (obligations LCEN/RGPD pour tout site marchand).
- **Risque** : faible techniquement (ajout de pages) ; risque business/juridique à ne PAS corriger.
- **Effort** : moyen (rédaction de contenu légal réel + pages dédiées).
- **Recommandation** : créer des pages CGV, Politique de confidentialité, Mentions légales et Politique de retours dédiées et à jour ; remplacer le numéro de téléphone factice par un vrai contact.
- **Métrique** : taux d'abandon au moment du checkout (avant/après) — NOT AVAILABLE sans analytics.

**P0-4 — Filtres catégorie "Note" et "Livraison rapide" mènent systématiquement à 0 résultat sur données réelles**
- **Problème** : sur la page catégorie, cocher "4 étoiles et +", "3 étoiles et +" ou "Livraison rapide" retourne quasi-systématiquement zéro produit.
- **Preuve dans le code** : `src/components/filters/FilterSidebar.tsx` lignes 60-96 exposent ces filtres. Or `reviewsCount` est à 0 partout (voir P0-1, donc `rating` toujours à 0 également) et le tag `livraison-rapide` (`storefront.ts` ligne 158) est présent sur **0 produit** du catalogue réel (`shopify-live-catalog-audit.json`).
- **Impact attendu** : un filtre qui renvoie toujours "aucun résultat" est perçu comme un site cassé ou un catalogue vide — abandon quasi certain de l'utilisateur qui l'utilise.
- **Risque** : faible à corriger.
- **Effort** : faible (masquer temporairement le filtre) à moyen (peupler réellement les données sous-jacentes).
- **Recommandation** : masquer les filtres "Note" et "Livraison rapide" tant que la donnée sous-jacente n'existe pas réellement sur le catalogue, ou peupler ces attributs.
- **Métrique** : taux d'utilisation des filtres suivi d'un résultat à 0 produit.

### P1 — Impact élevé

**P1-1 — Aucune confirmation visuelle lors de l'ajout au panier**
- **Problème** : cliquer "Ajouter au panier" (fiche produit ou grille) ne déclenche aucun toast, aucune animation, aucune mini-fenêtre de confirmation — seul le badge du header change silencieusement.
- **Preuve dans le code** : recherche exhaustive de "toast"/"snackbar"/"notification" dans `src/` → aucune occurrence. `AddToCartPanel.tsx` ligne 55 et `ProductCard.tsx` ligne 74 appellent `addToCart` sans aucun retour visuel local.
- **Impact attendu** : incertitude utilisateur ("est-ce que ça a marché ?"), risque de clics répétés ou d'abandon silencieux, opportunité manquée de proposer un cross-sell immédiat.
- **Risque** : très faible.
- **Effort** : faible à moyen (composant toast + déclenchement).
- **Recommandation** : ajouter un toast de confirmation ("Ajouté au panier") avec lien direct vers le panier, éventuellement une mini-preview du panier.
- **Métrique** : taux d'ajouts multiples du même produit en succession rapide (proxy d'incertitude) ; taux de clic panier après ajout.

**P1-2 — Pas de barre d'ajout au panier persistante (sticky) sur mobile**
- **Problème** : sur la page produit, le bouton "Ajouter au panier"/"Acheter maintenant" défile hors champ dès que l'utilisateur lit la description, les caractéristiques ou les avis.
- **Preuve dans le code** : recherche de `position: sticky`/`position: fixed` dans tous les `*.module.css` du projet → un seul résultat, dans `checkout/page.module.css` (résumé desktop). Aucune règle correspondante dans `AddToCartPanel.module.css` ni `product/[slug]/page.module.css`.
- **Impact attendu** : sur mobile (trafic e-commerce majoritaire), l'utilisateur doit remonter en haut de page pour acheter — friction connue et largement documentée dans les études UX mobile.
- **Risque** : faible.
- **Effort** : faible à moyen.
- **Recommandation** : ajouter une barre CTA fixe en bas d'écran sur mobile (prix + bouton "Ajouter au panier") dès que le bloc d'achat initial sort du viewport.
- **Métrique** : taux d'ajout au panier sur mobile avant/après.

**P1-3 — Aucun signal de rareté/urgence malgré une donnée de stock disponible**
- **Problème** : `product.stock` est disponible mais jamais utilisé pour créer une urgence d'achat (type "Plus que X en stock").
- **Preuve dans le code** : `src/app/product/[slug]/page.tsx` lignes 103-105 affichent uniquement "En stock (X disponibles)" ou "Rupture de stock" en texte neutre, sans mise en avant visuelle en cas de stock faible.
- **Impact attendu** : les messages de rareté augmentent le taux de conversion en créant un sentiment d'urgence légitime — actuellement non exploité. **Attention** : cette recommandation dépend de la fiabilité de `totalInventory` (voir section stock de `shopify-live-catalog-audit.md` — valeurs suspectes sur la majorité du catalogue) ; à activer uniquement sur les produits dont le stock semble crédible.
- **Risque** : moyen — afficher une fausse urgence sur un stock erroné (ex. "3.4 millions en stock" ne posant pas de souci, mais un stock réellement faible mal calculé pourrait tromper).
- **Effort** : faible.
- **Recommandation** : afficher un badge "Plus que X en stock" uniquement lorsque le stock est sous un seuil crédible (ex. < 50) et vérifié fiable.
- **Métrique** : taux de conversion des produits à stock faible affichant le message vs sans.

**P1-4 — Aucun signal de confiance visible près du bouton d'achat ou au checkout**
- **Problème** : ni la fiche produit, ni le panier, ni le checkout n'affichent de badges de réassurance (paiement sécurisé, retours gratuits, livraison estimée à proximité du CTA).
- **Preuve dans le code** : `AddToCartPanel.tsx` (aucun élément de réassurance), `CartSummary.tsx` (aucun badge), `checkout/page.tsx` ligne 74-82 mentionne "Paiement sécurisé Shopify" en texte seul, sans badges visuels (cadenas, logos moyens de paiement).
- **Impact attendu** : les badges de confiance à proximité immédiate du CTA réduisent l'anxiété d'achat, en particulier pour de nouveaux visiteurs sans historique avec la marque.
- **Risque** : très faible.
- **Effort** : faible.
- **Recommandation** : ajouter des badges (paiement sécurisé, retours sous X jours, livraison estimée) directement dans `AddToCartPanel` et `CartSummary`.
- **Métrique** : taux d'abandon panier avant/après.

### P2 — Amélioration secondaire

**P2-1 — Bandeau d'accueil (Hero) générique et statique, non connecté aux données réelles**
- **Problème** : `src/components/home/Hero.tsx` lignes 17-42 utilise 3 diapositives codées en dur, en rotation automatique (banner blindness documentée), sans lien avec les vraies promotions/nouveautés du catalogue.
- **Impact attendu** : opportunité manquée de mettre en avant du contenu réellement pertinent (nouveaux arrivages, meilleures ventes réelles) plutôt qu'un message générique.
- **Risque** : faible. **Effort** : moyen.
- **Recommandation** : connecter le Hero aux données réelles (ex. mettre en avant les vraies nouveautés `fetchNewArrivals`) une fois la politique de contenu définie.
- **Métrique** : taux de clic sur le Hero.

**P2-2 — Barre de progression livraison offerte en texte seul**
- **Problème** : `CartSummary.tsx` ligne 22-26 affiche le montant restant en texte simple, sans barre de progression visuelle.
- **Impact attendu** : une barre visuelle renforce généralement l'effet de progression déjà présent (mécanique déjà en place, amélioration incrémentale).
- **Risque** : très faible. **Effort** : faible.
- **Recommandation** : ajouter une barre de progression visuelle sous le message existant.
- **Métrique** : AOV moyen avant/après.

**P2-3 — CategoryBlocks affiche toutes les catégories sans signal de disponibilité réelle**
- **Problème** : `src/components/home/CategoryBlocks.tsx` liste toutes les catégories de `categories.ts` sans indiquer si elles contiennent réellement des produits sur Shopify (risque accru par le désalignement de tags déjà documenté dans `reports/project-final-audit.md`).
- **Impact attendu** : redirection possible vers des catégories vides ou quasi vides, mauvaise première impression.
- **Risque** : faible. **Effort** : moyen (nécessite de connaître le nombre réel de produits par catégorie).
- **Recommandation** : n'afficher en avant que les catégories avec un nombre significatif de produits réellement taggés, une fois la correction de taxonomie effectuée séparément.
- **Métrique** : taux de rebond par catégorie.

**P2-4 — Recherche par catégorie effectue deux requêtes Shopify distinctes puis une intersection côté serveur**
- **Problème** : `src/app/search/page.tsx` lignes 22-29 appelle `searchProductsService` puis `fetchProductsByCategory`, puis calcule l'intersection en JavaScript — fonctionnellement correct mais redondant en appels réseau.
- **Impact attendu** : impact principalement performance (temps de réponse), effet CRO indirect (vitesse de page).
- **Risque** : faible. **Effort** : moyen (nécessiterait une requête Storefront combinant texte + tag).
- **Recommandation** : à optimiser dans une mission technique dédiée, pas prioritaire CRO.
- **Métrique** : temps de réponse de `/search` avec paramètre catégorie.

---

## Synthèse

Sur 13 opportunités identifiées et étayées par du code réel et des données Shopify réelles : **4 en P0**, **4 en P1**, **5 en P2** (dont une redondante avec un point déjà documenté dans l'audit technique précédent). Toutes les preuves citées sont vérifiables directement dans le dépôt et dans `reports/shopify-live-catalog-audit.json`. Aucune donnée analytics n'étant disponible, aucun taux de conversion n'a été estimé ou inventé — chaque impact est qualifié, jamais chiffré.
