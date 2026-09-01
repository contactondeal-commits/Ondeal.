# OnDeal — Phase 6 : Audit + Correction + Optimisation globale

**Date :** 14/08/2026
**Mode :** Mutation complète autorisée
**Périmètre couvert dans cette session :** navigation & collections Shopify (bugs de catégorisation réels), audit prix (conclusion), audit compareAtPrice, validation technique complète. Le détail des sections non traitées et pourquoi se trouve en fin de document.

---

## 1. Constat préalable important : domaine live vs. code applicatif

Avant de détailler les corrections, un point structurel doit être signalé clairement car il conditionne la portée réelle de tout travail futur sur le frontend/UX/accessibilité/performance/SEO :

**`ondeal.fr` sert actuellement le thème Shopify « Dawn » (Online Store), pas l'application Next.js présente dans ce dépôt.** Cela a été confirmé en navigant sur `https://ondeal.fr/collections/bricolage-outillage` : la barre d'administration Shopify (« Edit theme », sélecteur de thème « Dawn - Conversion ») apparaît, ce qui ne se produit que lorsque le domaine est réellement servi par le thème Shopify natif. Le fichier `.env.local` confirme également explicitement, dans un commentaire daté du 13/08/2026, que le token Storefront de l'app Next.js n'est « JAMAIS utilisé par le frontend public ondeal.fr ».

**Conséquence concrète :**
- Toutes les mutations Shopify (navigation, tags, collections, prix) de cette session sont **immédiatement visibles pour de vrais visiteurs sur ondeal.fr**, car elles modifient les données partagées par Shopify, indépendamment du thème qui les affiche.
- En revanche, **tout le travail de code réalisé dans ce dépôt Next.js (accessibilité des drawers, sticky CTA mobile, focus trap, corrections UX antérieures des phases 3-4, etc.) n'est pas actuellement visible par les vrais visiteurs**, puisque `ondeal.fr` ne sert pas cette application. Ce code fonctionne et passe tous les tests (voir section 5), mais nécessite un déploiement (ex. Vercel) pointé sur le domaine pour devenir effectif.

Ce point doit être tranché par l'utilisateur : soit l'app Next.js doit être déployée et connectée au domaine, soit l'audit visuel/UX/accessibilité/performance/SEO doit en réalité porter sur le thème Shopify Dawn tel qu'il est configuré dans l'Admin (ce qui est un travail différent, non commencé ici).

---

## 2. Corrections de navigation et de catégorisation Shopify (vérifiées en production)

Toutes les corrections ci-dessous ont été appliquées via l'interface Shopify Admin (aucun accès Admin API en écriture disponible cette session — voir section 6) et **vérifiées après coup par lecture directe de la Storefront API**, jamais par simple capture d'écran. Détail complet dans `reports/phase6-shopify-mutations.json`.

| Élément | Avant | Après | Statut |
|---|---|---|---|
| Menu « Vêtements pour Femmes » | pointait vers la collection Hommes | pointe vers Femmes (24 produits) | ✅ Vérifié live |
| Menu « Petits Budgets » | pointait vers une collection à 300-1700€ | pointe vers la collection réellement < 20€ (427 produits) | ✅ Vérifié live |
| Collection « Bricolage & Outillage » | 0 produit (règle cassée : Type de produit inexistant) | 17 produits réels (pinces, clés, ceintures à outils…) | ✅ Vérifié live |
| Collection « Maison & Organisation » | 5 produits | 32 produits (27 meubles/rangement ajoutés) | ✅ Vérifié live |
| Collection « Éclairage » | 2 produits | 16 produits (14 lampes/veilleuses/projecteurs ajoutés) | ✅ Vérifié live |
| Collection « Auto & Moto » | 0-1 produit | 9 produits (8 accessoires auto ajoutés) | ✅ Vérifié live |
| Tag `cat-homme-montres` | 0 produit | 89 produits (2 exclus : montre enfant, montre femme) | ✅ Vérifié live |
| Tag `cat-accessoires-electronique` | 0 produit | 4 produits | ✅ Vérifié live |

**Méthode de correction technique notable :** l'éditeur de conditions de collection intelligente de Shopify Admin (champ « Taper » / Type de produit) s'est montré instable sous automatisation navigateur — sélections qui ne se validaient pas, coches fantômes apparaissant sur des éléments non cliqués. Un rendu erroné a même temporairement affiché « village » à la place de « outillage » dans une colonne de la liste produits ; vérifié comme un artefact d'affichage pur via lecture Storefront API (aucune donnée réelle affectée). Contournement fiable utilisé : sélection des produits via recherche par tag (`tag:cat-outillage`, `tag:cat-rangement`, etc.) puis action groupée « Ajouter aux collections », qui produit le même résultat fonctionnel sans dépendre du composant défaillant.

### Catégories quasi vides non corrigées (décision documentée)

| Collection | Produits | Décision |
|---|---|---|
| Bagages & Voyage | 0 | Pas d'inventaire réel identifiable dans le catalogue (recherche par mots-clés sur les 970 produits). Conservée dans la nav (précédent établi en session antérieure), aucun produit inventé ni retagué artificiellement. |
| Épicerie fine | 1 (« Hamac Chaise XL ») | Ce seul produit membre est en réalité mal taggé (un hamac n'est pas de l'épicerie fine) — signalé mais non modifié, car retirer le tag laisserait la collection totalement vide sans alternative de contenu réel. |
| Sports & Plein air | 1 | Idem — inventaire réel insuffisant pour une expansion crédible. |

---

## 3. Audit des prix (conclusion)

Détail complet et par-produit dans `reports/phase6-price-changes.json`.

- **compareAtPrice :** 0 produit sur 970 n'a de prix barré actif → **aucune fausse promotion** dans le catalogue. Rien à corriger.
- **15 produits > 300 €** ont été examinés individuellement (médianes de catégorie, cohérence interne, tentative de recherche concurrentielle réelle).
- **Aucune mutation de prix n'a été appliquée.** La règle absolue de la mission interdit d'inventer un prix concurrent, et les recherches web menées sur les deux exemples cités explicitement par la mission (tour de rangement 9 tiroirs à 379,99 €, abri de jardin à 1399,99 €) n'ont renvoyé que des pages de catégorie génériques, pas de fiche produit suffisamment comparable (même référence/dimensions/matériaux) pour agir avec confiance.
- Un seul produit a été classé **D (suspect)** sans action : une bague argent S925 à 511,92 € nettement au-dessus de la médiane de sa catégorie sans caractéristique visible justifiant l'écart — recommandation de vérification manuelle du poids/matériau réel avant toute décision de prix.
- Le cas « Petits Budgets » cité par la mission (tour de rangement 9 tiroirs présentée comme « petit budget ») est **déjà résolu structurellement** : ce produit n'appartient plus à la collection Petits Budgets depuis la correction de navigation de la section 2 (qui pointe désormais vers la vraie collection < 20€).
- Aucune donnée de stock, délai, avis client ou statistique n'a été inventée, conformément à la règle absolue de la mission.

---

## 4. Corrections antérieures confirmées toujours actives (héritées d'une session précédente, mission Phase 3)

- Correction de tags fournisseur Bijoux (rapport séparé : `shopify-jewelry-tag-mutation-report.md`)
- Connexion Shopify Storefront API réelle (pagination corrigée sur `fetchAllProducts`/`fetchProductsByCategory`, voir commentaires datés du 13/08/2026 dans `src/services/productService.ts`)

---

## 5. Validation technique

| Vérification | Résultat |
|---|---|
| `npx tsc --noEmit` | ✅ Aucune erreur |
| `npm run lint` | ✅ Aucune erreur |
| `npm run build` | ✅ Build réussi, 1060 pages générées (SSG produits + catégories) |
| `npx playwright test` | ✅ 26/26 tests passés (focus trap drawers, sticky CTA mobile, overlay galerie produit) |

Aucune régression détectée sur le code applicatif. Rappel : ce code n'est actuellement pas servi par `ondeal.fr` (voir section 1).

---

## 6. Contrainte technique constante de la session

Aucun accès en écriture à l'API Admin Shopify GraphQL n'a été disponible (le token configuré ne porte que des scopes Storefront `unauthenticated_*`). Toutes les mutations ont donc été réalisées via l'interface web Shopify Admin, pilotée par navigateur automatisé, avec vérification systématique post-mutation via lecture Storefront API (source de vérité, jamais la capture d'écran seule — un artefact de rendu a été détecté et neutralisé grâce à cette discipline, voir section 2).

---

## 7. Sections de la mission Phase 6 non traitées dans cette session, et pourquoi

La mission originale comporte 34 sections couvrant, au-delà de ce qui précède : audit visuel exhaustif de chaque type d'écran, optimisation header/footer, tests multi-résolution 390/834/1440px, accessibilité complète, performance, SEO technique, UX commerciale, filtres, recherche. Compte tenu de :

1. la découverte de la section 1 (le code Next.js audité en profondeur lors des phases 3-4 précédentes n'est pas le code servi en production sur `ondeal.fr`), qui rend un nouvel audit visuel/UX/accessibilité de ce code de portée incertaine tant que la question du déploiement n'est pas tranchée ;
2. la priorité donnée par la mission elle-même aux corrections de catalogue à forte confiance (navigation, catégorisation, prix) — traitées en premier et vérifiées bout en bout ;
3. le volume de travail déjà réalisé sur le frontend Next.js lors des phases précédentes (rapports `ondeal-ux-ui-audit.md` à `ondeal-ux-ui-phase4.md`, `ondeal-cro-*`) qui couvre déjà une bonne partie des points 4-9 et 16-26 de la mission pour ce code ;

...cette session s'est concentrée sur les corrections Shopify à forte valeur et haute confiance, entièrement vérifiées, plutôt que de produire un audit superficiel des 34 sections. Recommandation pour la suite : trancher la question du déploiement (section 1), puis relancer un audit ciblé sur le thème réellement servi (Dawn ou Next.js selon la décision).
