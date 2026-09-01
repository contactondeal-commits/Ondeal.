# Shopify Live Catalog Audit — Ondeal

**Date** : 13/08/2026
**Mode** : Lecture seule stricte — aucune mutation Shopify (aucun produit, prix, stock, variante, tag, collection, statut ou publication modifié ; aucune commande créée).
**Source des données** : Storefront API réelle (produits, tags, prix, images, variantes, stock) + Admin API réelle en lecture seule via le connecteur MCP (statut/tags des 148 candidats Bijoux uniquement).

---

## 1. Catalogue Shopify réel

**970 produits publiés** récupérés via pagination complète de l'API Storefront (4 pages de 250, aucune troncature — voir le correctif de pagination livré lors de la mission précédente).

Note sur l'écart avec le chiffre précédemment communiqué (895, revalidation du même jour) : la différence (+75) reflète très probablement une évolution normale du catalogue entre les deux vérifications (nouvelles publications) plutôt qu'une erreur de méthode — les deux mesures utilisent la même pagination complète. Aucune donnée n'a été inventée pour combler cet écart ; il est signalé tel quel.

**Statut** : non exposé par l'API Storefront (par construction, elle ne retourne que les produits publiés sur le canal Online Store — équivalent fonctionnel à ACTIVE). Pour un statut détaillé ACTIVE/DRAFT/ARCHIVED exact, seule l'API Admin le permet (utilisée ici uniquement pour les 148 candidats Bijoux, voir section 3).

Chaque produit a été analysé sur : productId, title, handle, vendor, productType, tags, variantes (nombre + `availableForSale`), totalInventory, prix, compareAtPrice, nombre d'images. Détail complet des 970 produits : `reports/shopify-live-catalog-audit.json` (clé `catalog.products`).

## 2. Audit stock

| Seuil | Nombre de produits |
|---|---|
| stock > 1 000 | **858** / 970 |
| stock > 10 000 | **777** / 970 |
| stock > 100 000 | **264** / 970 |
| stock > 1 000 000 | **17** / 970 |
| Maximum | **3 440 217** (Faux Cils Magnétiques Tendance — Regard Intense Sans Colle) |
| Moyenne | **125 610,29** |
| Médiane | **40 656** |
| Total cumulé | **121 841 979** |
| Valeurs négatives | 0 |
| `totalInventory` NOT AVAILABLE (null) | 0 |

### Analyse — réel, sentinelle, non suivi, lié à CJ, lié à un import, ou indéterminé ?

Une corrélation nette a été observée et est rapportée factuellement :

- **Tous** les 264 produits avec stock > 100 000 ont pour `vendor` la valeur **"Ondeal"** (le nom générique de la boutique, pas une marque réelle) — cohérent avec des produits importés en masse (pipeline CJdropshipping ou import bulk), où le champ vendeur n'est pas renseigné individuellement.
- À l'inverse, les produits avec un `vendor` réel et spécifique (ex. "InnovaGoods", "Sony", "Energy Sistem", "Intex") affichent systématiquement un stock **faible et plausible** (4 à 32 unités) — cohérent avec un import manuel/curaté plus ancien, distinct du pipeline en masse.
- Aucune corrélation avec le nombre de variantes n'explique l'ampleur des valeurs (un produit à 10 variantes affiche 1 140 896 en cumulé, soit ~114 000/variante — toujours irréaliste).

**Conclusion** : ces valeurs ne semblent **pas réelles** au sens d'un inventaire physique. Elles sont **le plus probablement liées à un import automatisé (pipeline CJdropshipping/bulk)** — hypothèse la mieux étayée par la donnée observée (corrélation quasi-parfaite avec `vendor = "Ondeal"`) — sans qu'il soit possible de conclure avec certitude absolue s'il s'agit d'une valeur "non suivie" (sentinelle Shopify), d'un chiffre remonté tel quel depuis l'API fournisseur CJ (qui agrège parfois un stock disponible à la commande très large, plutôt qu'un stock physique local), ou d'une autre cause. **NOT AVAILABLE / HUMAN VALIDATION REQUIRED** pour la cause exacte — voir `reports/shopify-live-catalog-audit.json` (clé `stock.top20`) pour les 20 valeurs les plus élevées avec leur productId. **Aucun stock n'a été corrigé** dans cette mission.

## 3. Audit Bijoux (148 candidats)

Les 148 productId de `reports/jewelry-reclassification-report.json` (147 HIGH + 1 LOW) ont été revérifiés en lecture seule (Admin API, `product(id) { id title status tags }`, batchée en 8 requêtes) — ce fichier de référence n'a pas été modifié.

```
JEWELRY_MATCHED     = 148
JEWELRY_MISSING     = 0
JEWELRY_CHANGED     = 0
JEWELRY_NOT_ACTIVE  = 0
JEWELRY_HIGH        = 147
JEWELRY_LOW         = 1
```

- **148/148 produits existent toujours** et sont accessibles.
- **148/148 sont ACTIVE.**
- **148/148 titres identiques** au titre stocké dans le rapport local — aucun changement détecté.
- Le produit **LOW** (`gid://shopify/Product/16269399490895`, *"Creative Design Handbag Chain Tassel Earrings"*) a été identifié séparément, confirmé ACTIVE et inchangé, et **reste exclu de toute préparation automatique** — non modifié, non retaggé.

## 4. Tags Bijoux — comptage précis

| Tag | Occurrences sur le catalogue complet (970) |
|---|---|
| `cat-bijoux` (convention canonique de l'app) | **0** |
| `bijoux` | **148** |
| `chat-bijouxx` | **198** |

- **0 produit** porte le tag canonique `cat-bijoux` sur l'ensemble du catalogue — confirmé, aucun changement depuis les vérifications précédentes.
- Parmi les 148 candidats du rapport : **148/148 portent `bijoux`**, **148/148 portent `chat-bijouxx`**, **0/148 ne portent aucun des trois tags**.
- **Observation additionnelle importante** : le tag `chat-bijouxx` est présent sur **50 produits supplémentaires** en dehors des 148 candidats du rapport (ex. compléments alimentaires collagène, kits de maquillage, gummies beauté) — ce tag n'est donc **pas un indicateur fiable "ceci est un bijou"**, contrairement à `bijoux` qui correspond exactement 1:1 aux 148 candidats. À prendre en compte pour toute future décision de retag : `chat-bijouxx` seul ne doit pas servir de critère de sélection.

**Aucun tag n'a été ajouté, retiré ou modifié.**

## 5. Exclusions — contrôle des faux positifs

Scan des titres **Shopify réels actuels** des 147 produits HIGH pour les mots-clés suivants : smart bracelet, smart band, fitness tracker, activity tracker, health tracker, smartwatch bracelet, Xiaomi/Huawei/Garmin/Fitbit, connected bracelet, smart ring, intelligent ring, health monitoring ring, fitness ring, sleep tracking ring, NFC smart ring, Bluetooth ring, connected ring, ultrasonic jewelry cleaner, jewelry box, jewelry organizer, jewelry tools.

**Résultat : 0 correspondance.** Aucun des 147 produits HIGH n'est un bracelet/bague connecté(e), un tracker d'activité, ou un nettoyeur/organisateur à bijoux. Confirmé sur les titres Shopify actuels (pas uniquement ceux stockés dans l'ancien rapport).

## 6. Sécurité — confirmation

Aucune mutation Shopify d'aucune sorte n'a été effectuée pendant cette mission. Seuls des outils de lecture ont été utilisés : `shopifyStorefrontGraphQL` (code applicatif réel, requêtes `query` uniquement) et le connecteur Shopify MCP en mode `graphql_query` (lecture uniquement — jamais `graphql_mutation`).
