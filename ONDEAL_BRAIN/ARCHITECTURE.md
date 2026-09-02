# ARCHITECTURE.md — Mémoire d'architecture technique

*Voir `_LEGEND.md`. Créé : 02/09/2026.*

## Stack confirmée

- **Frontend** : Next.js (App Router), TypeScript, CSS Modules. Le fichier `AGENTS.md` du dépôt avertit explicitement que la version de Next.js utilisée diffère significativement des versions connues et qu'il faut lire la documentation locale (`node_modules/next/dist/docs`) avant d'écrire du code — **CONFIRMÉ comme instruction présente dans le dépôt**, à respecter dans toute session future.
- **Données produit** : Shopify comme source de vérité (catalogue, prix, stock, collections), consommé côté frontend via **Shopify Storefront API** (`src/services/productService.ts`), avec un token `.env` à portée Storefront uniquement (pas d'écriture Admin depuis l'app elle-même).
- **Catégorisation** : convention par tag Shopify `cat-<id>` (voir `src/lib/catalog/category-mapping.ts`), avec un système d'alias legacy validés (`LEGACY_TAG_ALIASES`) pour absorber les incohérences héritées d'imports successifs (CJ, DSers, BigBuy legacy).
- **Emails transactionnels** : Resend (formulaire question produit, formulaire partenaires, flow abandon de panier).
- **Avis** : Judge.me (intégration mentionnée dans la stack documentée, contenu non audité en détail cette session).
- **Hébergement** : Vercel, équipe `on-deal`, plan Pro.

## Décisions architecturales significatives (historique, à ne pas défaire sans raison)

- **15/08/2026** : décision de conserver le login client natif Shopify plutôt qu'un système de compte custom.
- **12/08/2026** : correction pour utiliser exclusivement le tag Shopify `cat-<id>` comme convention de catégorisation, après qu'un premier brouillon avait introduit un metafield `custom.ondeal_category_id` jamais réellement porté par aucun produit — **ne pas réintroduire ce metafield**.
- **13/08/2026** : `fetchAllProducts`/`fetchProductsByCategory` corrigés pour une pagination Storefront API réelle (bug de pagination antérieur).
- Le point de vigilance non tranché : **quel code sert réellement `ondeal.fr` en production aujourd'hui** (l'app Next.js de ce dépôt, ou le thème Shopify Dawn natif) — voir DATA.md. Toute intervention future sur le frontend doit commencer par confirmer ce point.

## Dépendances à connaître avant de modifier le code

- `src/lib/catalog/category-mapping.ts` centralise la logique de catégorisation (`categoryTag()`, `parseCategoryTag()`, `categoryTagsForQuery()`, `findUndercoveredCategories()`) — toute modification de catégorie doit passer par ce fichier, pas par un mapping ad hoc ailleurs.
- `src/data/categories.ts` définit l'arborescence de navigation affichée (11 catégories principales) — distincte des tags Shopify réels, source du décalage documenté dans PRODUCT_STRATEGY.md.
- Aucune suite de tests automatisés définie dans `package.json` au-delà de Playwright (tests E2E ciblés sur l'accessibilité/UX des drawers, pas une couverture unitaire large) — confirmé dans `reports/cj-phase4-execution-final.md` ("aucun script de test défini").

## Ce qui reste à documenter (À VÉRIFIER, non fait cette session)

Schéma de données complet (metafields utilisés le cas échéant), liste exhaustive des routes API internes (`src/app/api/*`), diagramme de dépendances entre services. Non prioritaire tant que les questions business (positionnement, écart catalogue, tracking) ne sont pas tranchées.
