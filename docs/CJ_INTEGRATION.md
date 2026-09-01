# Intégration CJdropshipping

## Ce qui a été vérifié (documentation officielle)

Sources consultées le 12/08/2026 :
- [Authentication Overview](https://developers.cjdropshipping.cn/en/api/api2/api/auth.html)
- [Development Documentation](https://developers.cjdropshipping.cn/en/api/start/development.html)
- [Product API](https://developers.cjdropshipping.cn/en/api/api2/api/product.html)

## Obtenir un accès

1. Créer/utiliser un compte CJdropshipping.
2. Centre personnel > Réglages > API > installer l'app API.
3. Générer une clé API au format `CJUserNum@api@xxxxxxxxxxxx`.
4. Renseigner cette valeur dans `CJ_API_KEY` (`.env`).

Aucune autre information (Client ID/Secret séparés) n'est documentée publiquement pour l'API 2.0 — seule la clé API décrite ci-dessus est nécessaire pour obtenir un token d'accès.

## Authentification

- `POST https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken` avec `{ "apiKey": "..." }` → renvoie `accessToken` (15 jours) + `refreshToken` (180 jours).
- `POST .../authentication/refreshAccessToken` pour renouveler sans repasser par la clé API.
- Chaque appel authentifié suivant porte l'en-tête `CJ-Access-Token: <accessToken>`.
- Implémenté dans `src/lib/cj/client.ts` avec cache mémoire du token (à remplacer par un stockage partagé — Redis, table DB — en production multi-instance).

## Endpoints produits utilisés

Base : `https://developers.cjdropshipping.com/api2.0/v1/product/`

| Fonction (`src/lib/cj/products.ts`) | Endpoint | Usage |
|---|---|---|
| `getCJCategories` | `getCategory` | Arborescence catégories CJ (3 niveaux) |
| `searchCJProducts` | `list` | Recherche/filtre produits (mot-clé, catégorie, prix, tri) |
| `getCJProductDetail` | `query` | Détail complet + variantes |
| `getCJProductVariants` | `variant/query` | Variantes d'un produit |
| `getCJVariantStock` | `stock/queryByVid` | Stock par variante/entrepôt |
| `getCJWarehouses` | `globalWarehouseList` | Liste des entrepôts (filtrage France/Europe) |

## Ce qui n'a PAS été vérifié en conditions réelles

Aucun appel réel n'a pu être exécuté dans cette session : `CJ_API_KEY` n'est pas configurée. Le client (`src/lib/cj/client.ts`) et les fonctions produit (`src/lib/cj/products.ts`) utilisent les endpoints et le format d'authentification documentés officiellement, mais la forme exacte des champs de réponse (au-delà de ceux listés dans la doc publique) n'a pas pu être validée contre une vraie réponse API. **Avant le premier import réel**, exécuter un appel de test (`getCJCategories()` par exemple) et comparer la réponse aux types dans `src/lib/cj/types.ts` — ajuster si des champs diffèrent.

## Étapes suivantes une fois la clé fournie

1. `npx tsx -e "import('./src/lib/cj/products').then(m => m.getCJCategories().then(console.log))"` — valider la connexion et la forme des catégories.
2. Construire la table de correspondance catégorie-CJ-id → catégorie-Ondeal-id (voir `src/lib/catalog/category-mapping.ts`, actuellement heuristique par mots-clés).
3. Lancer un premier lot de test : `npm run catalog:import-batch -- --category=<id> --limit=20`.
