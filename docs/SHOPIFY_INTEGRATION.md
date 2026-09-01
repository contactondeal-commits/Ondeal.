# Intégration Shopify

## Boutique concernée

`admin.shopify.com/store/6mvti7-9g` — domaine boutique `*.myshopify.com` réel, vérifié via l'API Shopify (`shop { myshopifyDomain }`) le 13/08/2026 :

```
SHOPIFY_STORE_DOMAIN=6mvti7-9g.myshopify.com
```

À renseigner exactement ainsi dans `.env.local` (pas le domaine personnalisé `ondeal.fr`). Cette valeur est déjà présente dans `.env.local` du projet.

Le domaine public `ondeal.fr` pointe aujourd'hui (vérifié par résolution DNS le 13/08/2026) directement vers l'infrastructure Shopify (thème natif Shopify), **pas** vers ce projet Next.js — voir `reports/marketplace-interface-connexion.md` pour le détail de cette vérification et ce qu'implique un futur basculement.

## Générer les credentials (app privée / custom app)

1. Shopify Admin > Paramètres > Apps et canaux de vente > Développer des apps.
2. Créer une app (ex : "Ondeal Marketplace Sync").
3. Configurer l'API Admin : activer les scopes `read_products`, `write_products` (et `read_inventory`/`write_inventory` si la synchronisation stock est activée plus tard).
4. Configurer l'API Storefront : activer les scopes de lecture catalogue (produits, collections).
5. Installer l'app sur la boutique.
6. Révéler puis copier :
   - le **token API Admin** → `SHOPIFY_ADMIN_ACCESS_TOKEN` (secret, jamais exposé au navigateur — voir `src/lib/shopify/admin.ts`, `import "server-only"`).
   - le **token API Storefront** → `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
7. Récupérer l'ID de l'emplacement (location) pour l'inventaire : Admin GraphQL `query { locations(first: 5) { nodes { id name } } }` → `SHOPIFY_LOCATION_ID`.

**Cas particulier constaté sur cette boutique** : le storefront public `ondeal.fr` est destiné à passer par le canal de vente **Headless** nommé "OnDeal". Un token API Storefront créé via une app tierce générique (par ex. via une mutation `storefrontAccessTokenCreate` exécutée par un outil d'administration externe) **n'est pas automatiquement associé à ce canal Headless** — Shopify n'expose la création/consultation des tokens Storefront d'un canal Headless que depuis l'interface Admin propre à ce canal (Admin > Canaux de vente > Headless > [storefront] > carte "Storefront API tokens"). C'est cette voie qui doit être utilisée pour obtenir le token utilisé par ce projet, pas une mutation Admin API générique.

## Version d'API

`2026-07` (stable au 12/08/2026, source : [shopify.dev/docs/api/usage/versioning](https://shopify.dev/docs/api/usage/versioning)). Centralisée dans `src/lib/shopify/config.ts` (`SHOPIFY_API_VERSION`) — à faire évoluer tous les ~12 mois.

## Architecture appliquée

- **Storefront API** (`src/lib/shopify/storefront.ts`) : seule source pour le catalogue public affiché sur ondeal.fr. Ne retourne jamais les produits ARCHIVED/DRAFT par construction (canal "Online Store"). Requêtes paginées (`fetchAllShopifyProducts`, jusqu'à 2500 produits par sécurité) — jamais limitées silencieusement à une seule page de 250.
- **Admin API** (`src/lib/shopify/admin.ts`) : réservée aux scripts d'administration (audit, import, synchronisation). Jamais appelée depuis le frontend public.
- **Cart API** (`src/lib/shopify/cart.ts`) : création d'un panier Shopify réel au moment du passage en caisse (`/checkout`), redirection vers le `checkoutUrl` officiel Shopify — le paiement est intégralement géré par Shopify, jamais par du code maison.

## Règle ACTIVE / ARCHIVED

Toute fonction qui liste des produits Shopify pour la logique catalogue doit filtrer explicitement par statut (`status:active` ou `status:draft` dans la requête GraphQL). Le garde-fou centralisé `src/lib/catalog/archived-guard.ts` (`rejectArchived`, `assertNoArchived`) doit être appliqué en défense supplémentaire partout où une liste de produits Shopify est manipulée par la logique d'import/synchronisation.

## Catégorisation du catalogue — convention réelle (tags, PAS metafields)

**Corrigé le 12/08/2026** — une première version de ce document (et du code) décrivait un filtrage par metafield `custom.ondeal_category_id`. Ce metafield n'existe sur **aucun** produit réel de la boutique. La convention effectivement utilisée par les produits déjà en catalogue est un **tag Shopify** au format `cat-<id-catégorie-ondeal>`, par exemple `cat-montres`, `cat-bijoux`.

- `src/lib/catalog/category-mapping.ts` : source unique de la convention (`categoryTag()`, `parseCategoryTag()`, `CATEGORY_TAG_PREFIX = "cat-"`).
- `src/services/productService.ts` (`fetchProductsByCategory`, `fetchRelatedProducts`) : interroge Shopify via `tag:cat-<id>`, jamais via metafield.
- `src/lib/shopify/storefront.ts` (`mapStorefrontProduct`) : lit `categoryId` depuis le premier tag produit qui matche `cat-*`.

Métafields `custom.*` (voir tableau ci-dessous) : toujours utilisés pour les métadonnées fournisseur/import (traçabilité CJdropshipping), **pas** pour la catégorisation affichée côté storefront.

### Écart de convention constaté sur le catalogue Bijoux (13/08/2026)

Vérification en lecture seule (`reports/shopify-jewelry-preflight.json`) : les 148 produits candidats à la catégorie Bijoux portent déjà en production les tags `bijoux` et `chat-bijouxx` — ni l'un ni l'autre ne correspond à la convention canonique `cat-bijoux`. Ces produits ne sont donc **pas** actuellement remontés par `fetchProductsByCategory(["bijoux"])`. Aucune correction de tag n'a été appliquée (mission read-only) — un retag `cat-bijoux` reste une action Shopify distincte nécessitant une autorisation explicite séparée.

## Métafields fournisseur

Namespace `custom` sur chaque produit importé depuis CJ :

| Clé | Contenu |
|---|---|
| `custom.supplier` | `"CJdropshipping"` |
| `custom.cj_product_id` | PID CJ — clé d'idempotence de l'import |
| `custom.cj_variant_id` | VID de la variante par défaut |
| `custom.supplier_sku` | SKU CJ |
| `custom.supplier_price` | Prix fournisseur au moment de l'import |
| `custom.warehouse` | Entrepôt d'expédition si connu |
| `custom.last_sync` | Horodatage de la dernière synchronisation |

Ces métafields ne sont pas exposés au client par défaut — usage interne (dédoublonnage, synchronisation, administration).

## État vérifié du catalogue (dernière vérification réelle)

- **~893 produits ACTIVE** dans le catalogue au 12-13/08/2026 (vérifié via MCP Shopify — voir `reports/project-final-audit.md` et `reports/jewelry-reclassification-report.json`).
- ~7175 produits **ARCHIVED** (ancien fournisseur BigBuy) — jamais réactivés, jamais affichés côté storefront (filtrage natif Shopify côté Storefront API, qui n'expose que les produits publiés).
- Répartition détaillée par catégorie / conventions de tags orphelins : voir `reports/project-final-audit.md`, section 15.

Pour ré-obtenir un compte exact à jour :

```bash
npm run catalog:audit
```

(nécessite `SHOPIFY_ADMIN_ACCESS_TOKEN`).

## Ce qu'il reste à faire pour le storefront public

`SHOPIFY_STOREFRONT_ACCESS_TOKEN` n'est pas encore configuré dans l'environnement (`.env.local` ne contient que `SHOPIFY_STORE_DOMAIN`) — tant que cette variable est absente, `isShopifyPublicConfigured()` renvoie `false` et le site sert les données de démonstration (`src/data/products.ts`), jamais de données inventées présentées comme réelles. Voir la section "Cas particulier" ci-dessus pour la procédure d'obtention correcte de ce token (canal Headless "OnDeal").
