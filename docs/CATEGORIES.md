# Catégories Ondeal

## Structure actuelle

11 catégories principales, définies dans `src/data/categories.ts` :
Électronique, Informatique, Maison, Mode (Femme/Homme/Enfants), Beauté, Jardin, Sport, Livres, Jeux et jouets, Bricolage, Animalerie — chacune avec 3 à 7 sous-catégories.

Cette structure existante doit être réutilisée en priorité (voir mission : "Avant de créer une nouvelle catégorie, vérifier si une catégorie existante peut être utilisée"). **Aucune nouvelle catégorie n'a été créée dans cette session.**

## Mappage CJ → Ondeal

`src/lib/catalog/category-mapping.ts` fournit une correspondance heuristique (mots-clés français/anglais → id de catégorie Ondeal), utilisable dès la première synchronisation. Elle n'utilise aucun identifiant de catégorie CJ réel (non obtenus faute d'accès API — voir `docs/CJ_INTEGRATION.md`).

**Étape à faire une fois l'API CJ accessible** : appeler `getCJCategories()`, obtenir la vraie arborescence à 3 niveaux, et construire une table `cjCategoryId → ondealCategoryId` validée manuellement plutôt que de se reposer uniquement sur la correspondance par mots-clés (qui reste un filet de sécurité raisonnable mais imparfait).

## Convention de stockage côté Shopify

La catégorie Ondeal d'un produit est encodée par un **tag Shopify** au format `cat-<id>` (ex: `cat-montres`, `cat-decoration`) — voir `CATEGORY_TAG_PREFIX`/`categoryTag()`/`parseCategoryTag()` dans `src/lib/catalog/category-mapping.ts`. C'est la SEULE convention à utiliser (pas de metafield `custom.ondeal_category_id` : un premier brouillon avait introduit ce metafield côté frontend sans qu'aucun produit réel ne le porte jamais — corrigé le 12/08/2026 pour utiliser le tag, seule convention réellement présente sur le catalogue existant).

## Identifier les catégories sous-représentées

`findUndercoveredCategories()` (même fichier) compare le nombre de produits ACTIVE par catégorie à un seuil (20 par défaut) et retourne la liste des catégories feuilles à renforcer en priorité via CJ. Ce comptage nécessite l'audit Shopify réel (`npm run catalog:audit`) pour être fiable — non exécuté dans cette session faute de credentials.
