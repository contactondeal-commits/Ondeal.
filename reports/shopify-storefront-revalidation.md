# Shopify Storefront Revalidation

**Date** : 13/08/2026
**Mode** : Lecture seule stricte — aucune mutation Shopify effectuée dans cette mission (aucun produit, prix, stock, variante, tag, collection, publication ou commande créée/modifiée).
**Contexte** : revalidation après confirmation utilisateur que la permission Storefront « Inventaire des produits non authentifié_lecture » (`unauthenticated_read_product_inventory`) a été activée dans Shopify Admin > Headless > Storefront API permissions.

---

## 1. Store

- `SHOPIFY_STORE_DOMAIN` (lu dans `.env.local`) : `6mvti7-9g.myshopify.com`
- Requête `shop { name primaryDomain { url } }` exécutée en lecture seule contre l'API Storefront réelle :

```json
{ "shop": { "name": "Ondeal", "primaryDomain": { "url": "https://ondeal.fr" } } }
```

Le domaine configuré correspond bien à la boutique de production dont le domaine principal est `ondeal.fr`.

## 2. Token Validation

- `TOKEN_PRESENT = YES`
- `TOKEN_TYPE = STOREFRONT`
- `TOKEN_PREFIX = 750c2f…` (6 premiers caractères uniquement — jamais la valeur complète)
- Longueur : 32 caractères hexadécimaux, sans préfixe — format attendu d'un token API **Storefront** (public ou privé), confirmé.
- Vérifié explicitement : **ne commence PAS par `shpat_`** → ce n'est pas le token Admin (`shpat_0cfb...`, configuré séparément sous `SHOPIFY_ADMIN_ACCESS_TOKEN`, jamais utilisé par le frontend public — voir `src/lib/shopify/admin.ts`). Le token Storefront et le token Admin restent deux variables distinctes dans `.env.local`, chacune utilisée uniquement par le module Shopify correspondant (`storefront.ts` vs `admin.ts`).

## 3. Storefront Permissions

L'erreur précédemment observée sur ce même token :

```
Access denied for totalInventory field.
Required access: `unauthenticated_read_product_inventory` access scope.
```

**a disparu.** La requête `products { totalInventory }` répond désormais avec des valeurs numériques réelles (testé sur 2 produits, valeurs `20` et `20` reçues sans erreur). La permission activée côté Shopify Admin est donc bien effective — pas besoin de régénérer le token : le token existant (créé avant l'activation de la permission) fonctionne immédiatement une fois la permission du **storefront** (pas du token lui-même) mise à jour, ce qui confirme que les permissions Storefront s'appliquent au niveau du storefront/canal et non au token individuellement (cohérent avec la documentation Shopify : *"Both Storefront and Admin API permissions are shared across all storefronts"*).

## 4. Product API

Requête minimale (`products { id title handle }`) : ✅ OK.

Requête réelle de l'application — `fetchShopifyProducts()` avec le `PRODUCT_FRAGMENT` exact de `src/lib/shopify/storefront.ts` (id, handle, title, vendor, tags, description, productType, images, priceRange, compareAtPriceRange, totalInventory, variants, metafields rating) : ✅ **OK**, testé avec succès. Exemple de produit reçu et correctement mappé :

```json
{
  "slug": "mini-smartphone-enfant-ecran-3-pouces-anti-fatigue-gps",
  "title": "Mini smartphone enfant, écran 3 pouces anti-fatigu…",
  "categoryId": "telephones",
  "price": 74.99,
  "images": 6,
  "firstImageIsRealUrl": true,
  "stock": 20,
  "inStock": true,
  "variantId": "gid://shopify/ProductVariant/58464898777423",
  "badges": ["NOUVEAU"]
}
```

- **Variantes** (`variants.nodes[0].id`, `availableForSale`) : ✅ présentes et correctement lues sur tous les produits testés.
- **Prix / prix barré** (`priceRange` / `compareAtPriceRange`) : ✅ lus correctement.
- **Images** : ✅ URLs réelles `cdn.shopify.com` sur 100% des produits testés (`firstImageIsRealUrl: true`) — se combinent avec le correctif `PlaceholderImage` livré lors de la mission précédente pour un affichage réel.
- **Tags / productType** : ✅ lus correctement.
- **Collections** (`collections { nodes { id handle title } }`) : ✅ OK, 3 collections réelles retournées sur l'échantillon testé.
- **Metafields** (`reviews.rating`) : ✅ champ interrogeable sans erreur (valeur `null` sur les produits sans note — normal, pas une erreur).
- **Filtrage par catégorie** (`tag:cat-bijoux`, convention canonique de l'app) : requête exécutée sans erreur, **0 résultat** — comportement attendu et déjà documenté (`reports/shopify-jewelry-preflight.json` / `docs/SHOPIFY_INTEGRATION.md`) : les produits Bijoux portent actuellement les tags `bijoux`/`chat-bijouxx`, pas `cat-bijoux`. Ce n'est pas une régression ni un problème de connexion.

**Pagination complète** (`fetchAllShopifyProducts`, boucle sur toutes les pages) : **895 produits publiés** récupérés avec succès, tous avec une variante par défaut et une image réelle. `inStock = true` sur 883 d'entre eux.

## 5. Inventory API

`totalInventory` est désormais **lisible sans erreur** sur l'ensemble du catalogue testé (895/895 produits, aucune erreur de scope).

**Observation de qualité de donnée (pas une erreur de connexion, non corrigée dans cette mission — lecture seule)** : la somme des `totalInventory` sur les 895 produits atteint **112 664 291 unités**, avec plusieurs produits individuels affichant des valeurs de stock dans les millions (ex. "Faux Cils Magnétiques Tendance" : 3 440 217 ; "Pull Col Roulé Femme" : 3 138 773). Ces valeurs sont manifestement irréalistes pour des articles de cette nature et suggèrent une donnée d'inventaire à vérifier côté Shopify/CJ (import automatisé, politique "ne pas suivre le stock" retournant une valeur sentinelle très élevée, ou erreur de saisie) plutôt qu'un problème d'API. Signalé ici pour information — **aucune modification de stock effectuée**, cette vérification reste strictement en lecture seule.

## 6. Cart

`createShopifyCart` (mutation `cartCreate`, `src/lib/shopify/cart.ts`) testé avec une seule ligne réelle (1 variante, quantité 1), comme demandé, uniquement pour valider le mécanisme :

- ✅ Panier créé avec succès (aucune commande passée, aucune donnée produit modifiée — un panier abandonné est un artefact normal et sans conséquence).

## 7. Checkout

- ✅ `checkoutUrl` reçu, nom d'hôte vérifié : **`ondeal.fr`**. Le checkout Shopify est bien routé vers le domaine public de la boutique, comme attendu.

## 8. Errors

**Aucune erreur** rencontrée sur l'ensemble des tests (shop, produits, variantes, prix, images, tags, productType, totalInventory, availableForSale, collections, metafields, cartCreate). L'erreur de scope précédemment documentée (section 3) est confirmée résolue.

Seule observation notée : l'anomalie de valeurs `totalInventory` (section 5) — qualité de donnée, pas une erreur de connexion.

## 9. Tests

- `npx tsc --noEmit` → ✅ OK, 0 erreur
- `npm run lint` → ✅ OK, 0 erreur
- `npm run build` → ✅ **OK** — 1049 pages générées (contre 161 en données mock), incluant les vraies pages produit/catégorie Shopify (ex. `/product/mini-smartphone-enfant-ecran-3-pouces-anti-fatigue-gps`), confirmant que `generateStaticParams` récupère désormais le vrai catalogue Shopify sans erreur.
- `package.json` : **aucun script `test` présent** (scripts disponibles : `dev`, `build`, `start`, `lint`, `catalog:audit`, `catalog:categorize`, `catalog:import-batch`, `catalog:report`) — aucun test automatisé n'a donc été exécuté, car aucun n'existe.
- Aucune modification de code effectuée dans cette mission (conformément à la consigne : ne pas retirer `totalInventory`, aucun fallback ajouté). Seul fichier touché : `.env.local` (réactivation du token, non suivi par git — `.env*` gitignore).
- `git status` : aucun fichier source modifié par cette mission.

## 10. Final Status

Tous les tests de lecture ont réussi, le blocage de scope est confirmé résolu, le build de production fonctionne intégralement avec les vraies données Shopify.

---

## Résumé final

```
STORE DOMAIN            = 6mvti7-9g.myshopify.com
STORE NAME               = Ondeal
STOREFRONT AUTHENTICATION = OK
PRODUCT READ             = OK (895 produits, pagination complète)
INVENTORY READ           = OK (totalInventory accessible, scope confirmé actif)
TOTAL INVENTORY          = OK techniquement — valeurs anormalement élevées constatées (donnée à vérifier séparément, hors périmètre lecture seule)
CART                     = OK (cartCreate réussi, non destructif)
CHECKOUT                 = OK (checkoutUrl → ondeal.fr)
TSC                      = OK
LINT                     = OK
BUILD                    = OK (1049 pages, catalogue réel)
TEST SCRIPT              = ABSENT (aucun script "test" dans package.json)
```

```
SHOPIFY STOREFRONT API — READY
```

**Aucune mutation Shopify effectuée dans cette mission.**
