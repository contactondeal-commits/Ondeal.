# Gamme "Rentrée" — Note de stratégie commerciale

**Site :** ondeal.fr
**Date :** 19 août 2026
**Auteur :** Claude (Cowork), en tant que responsable marketing produit sur cette mission

## 1. Contexte et mission

Fin août est la période de vente la plus dense de l'année pour les cartables, trousses et fournitures scolaires — la fenêtre utile se compte en jours, pas en semaines. La demande du client était claire : construire une gamme "Rentrée" mise en avant sur ondeal.fr, en s'inspirant des codes des plus grandes enseignes, sans toucher au reste des chantiers en cours sur le site.

L'objectif n'était pas de créer une bannière promotionnelle isolée, mais une véritable mise en avant marchande : un slide d'accueil qui capte l'attention, deux rayons dédiés avec de vrais produits, de vrais prix et un vrai stock — rien d'inventé, rien de placeholder.

## 2. Sources d'inspiration

La mise en avant s'inspire des standards observés chez les grandes enseignes généralistes et spécialisées pendant la période de rentrée :

- **Une hero banner dédiée**, avec un code couleur distinct du reste du site (ici un vert "tableau d'école", volontairement différent des dégradés navy/teal/violet des autres slides) pour signaler immédiatement "c'est la rentrée" sans confusion avec les autres opérations commerciales.
- **Un CTA direct vers la sélection**, plutôt qu'un simple visuel — le bouton renvoie droit vers les rayons produits, pas vers une page d'atterrissage générique.
- **Un découpage par besoin plutôt que par marque** : cartables d'un côté, trousses et papeterie de l'autre — c'est la façon dont un parent pense sa liste de rentrée, pas la façon dont un fournisseur pense son catalogue.
- **Des marques reconnaissables** (Jurassic World, Snoopy, Real Madrid C.F., Kappa, Kelme...) mises en avant en priorité, parce que la reconnaissance de marque accélère la décision d'achat sur ce type de produit.

## 3. Méthodologie de sélection

Aucun produit n'a été inventé ou déplacé artificiellement. La sélection a été construite à partir du vrai catalogue Shopify d'Ondeal, avec deux filtres cumulatifs :

1. **Pertinence rentrée** : uniquement des cartables, sacs à dos, trousses, carnets, reliures et fourre-tout — les catégories qui composent une vraie liste de fournitures.
2. **Disponibilité réelle** : plusieurs produits pertinents étaient archivés dans Shopify (donc invisibles sur le site). Ils ont été audités puis réactivés un par un, avec vérification du statut à chaque étape, pour qu'aucun produit affiché ne pointe vers une fiche indisponible.

Résultat : **22 produits actifs**, répartis en deux rayons :

- **Rentrée — sacs à dos & cartables** (12 produits) : cartables Jurassic World, Snoopy, Vicky Martín Berrocal, BlackFit8, Safta, Kappa, Munich, Real Madrid C.F., Kelme, Harper & Neyer.
- **Rentrée — trousses & papeterie** (10 produits) : carnets et reliures Snoopy et Vicky Martín Berrocal, trousse scolaire avec accessoires, fourre-tout Jurassic World et Snoopy en plusieurs formats.

## 4. Actions concrètes réalisées

1. **Audit et réactivation catalogue** : 22 produits identifiés comme pertinents pour la rentrée mais partiellement archivés dans Shopify ont été repassés en statut Actif, avec vérification individuelle (rechargement de la fiche et contrôle du badge de statut) pour fiabiliser l'affichage.
2. **Construction du slide d'accueil "C'est la rentrée !"** : nouveau slide en tête de carrousel, avec message, sous-titre et CTA dédiés, pointant vers l'ancre `#rentree` de la page d'accueil.
3. **Construction des deux sections marchandes** sur la page d'accueil, alimentées directement par les identifiants produits Shopify réels (aucune donnée statique ou fictive).
4. **Validation technique complète** : vérification des types (`tsc`), build de production (`next build`) et déploiement en production (`vercel deploy --prod`).
5. **Vérification live sur ondeal.fr** : contrôle visuel du slide, navigation vers l'ancre `#rentree`, et vérification que les 22 produits s'affichent avec prix et statut de stock corrects sur le domaine de production.

## 5. État actuel

La gamme Rentrée est **en ligne sur ondeal.fr**, visible dès l'arrivée sur le site via le premier slide du carrousel d'accueil, avec accès direct aux deux rayons dédiés.

## 6. Recommandations pour la suite

- **Suivre les ventes de ces 22 références** sur les 10 prochains jours pour identifier les meilleures performances et éventuellement renforcer le stock ou la mise en avant des best-sellers.
- **Envisager un compte à rebours ou une date de fin** sur le slide, pour créer un sentiment d'urgence cohérent avec la fenêtre de vente réelle (rentrée = fin août/début septembre).
- **Étendre la sélection** si d'autres produits pertinents (cahiers, stylos, calculatrices) sont disponibles et actifs dans le catalogue Shopify, en appliquant la même méthodologie de vérification.
- **Prévoir le retrait ou la bascule du slide** après la période de rentrée pour ne pas laisser une mise en avant obsolète en ligne.
