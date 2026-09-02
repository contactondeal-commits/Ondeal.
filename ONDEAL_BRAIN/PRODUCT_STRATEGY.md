# PRODUCT_STRATEGY.md — Stratégie produit & merchandising

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026.*

## Constat catalogue (CONFIRMÉ, voir BUSINESS.md pour le détail chiffré)

Catégories fortes (>75 produits actifs) : Bijoux (151), Montres homme (116), Jouets (107), Cuisine (97), Outils de jardin (85), Soins du visage (76).
Catégories quasi mortes (0 produit, tags existants mais vides) : Ordinateurs, Romans, BD.
Catégories très sous-dotées (<15 produits) : Téléphones (12), Tablettes (8), Claviers (8), Écrans (7), Souris (5), TV (2), PC portables (4), PC fixes (1).

## Décalage navigation vs inventaire (CONFIRMÉ, croisement collections Shopify natives / tags applicatifs)

Plusieurs collections Shopify natives affichent des effectifs très inférieurs aux tags applicatifs correspondants : la collection "Jardin" (tag non-standard `jardin-terrasse`) ne compte que 15 produits alors que le tag canonique `cat-outils-jardin` en compte 85 ; la collection "Jouets & Enfants" (tag `cat-jouets-enfants`) n'en compte que 14 contre 107 sur le tag `cat-jouets`. **À VÉRIFIER** : ce décalage concerne les objets Collection natifs de Shopify — dont l'usage réel côté frontend Next.js n'est pas confirmé (les pages `/category/[slug]` semblent lire les tags canoniques directement d'après `category-mapping.ts`, donc ce décalage n'est pas forcément visible des vrais visiteurs, mais ce n'est pas vérifié en navigation live catégorie par catégorie). Ne pas traiter comme un bug client confirmé tant que ce n'est pas testé page par page.

La collection "Nouveauté" concentre à elle seule **796 produits, soit ≈46,5 % du catalogue actif**, taggés `new-arrivals-2026` — à un tel volume, "Nouveauté" perd sa valeur de filtre pour le client (CONFIRMÉ comme fait chiffré ; l'impact CRO est une déduction PROBABLE).

## Anomalie de stock héritée (CONFIRMÉ comme documentée dans `ONDEAL_AUTONOMOUS/KNOWN_LIMITATIONS.md`, non re-vérifiée cette session)

`totalInventory` atteignant jusqu'à 3,4 millions d'unités sur certains produits CJ/Syncee — quasi certainement un artefact d'agrégation multi-entrepôts côté fournisseur plutôt qu'un stock réel, mais non corrigé. Impact potentiel : affichage de disponibilité trompeur si ce chiffre est montré tel quel côté frontend. **À VÉRIFIER en priorité** (voir RISKS.md).

## Recommandations (priorisées par confiance, pas par supposition)

1. **Zéro risque, forte confiance** : retirer ou fusionner les tags `cat-*` à 0 produit (Ordinateurs, Romans, BD) de toute navigation visible, pour éviter des pages catégorie vides indexées par Google (mauvais pour SEO et CRO). Action de code, réversible.
2. **Confiance moyenne** : renforcer le sourcing CJ/Syncee sur Téléphones/Tablettes/Écrans/Informatique si la décision de POSITIONING.md est de rester généraliste ; sinon, retirer ces catégories de la navigation principale plutôt que de les laisser quasi vides.
3. **À trancher par l'utilisateur** : plafonner ou segmenter le tag `new-arrivals-2026` (ex. limiter aux produits ajoutés dans les 30 derniers jours glissants) pour restaurer sa valeur de filtre.
4. **Urgent, à vérifier avant toute action** : la cause de l'écart catalogue 8 487 → 1 715 (voir BUSINESS.md) doit être comprise avant tout nouvel import CJ, pour ne pas répéter une perte de catalogue non expliquée.
