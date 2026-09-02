# KPI.md — Indicateurs de pilotage

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026.*

## Indicateurs mesurables aujourd'hui (via Shopify Admin, sans outil analytics)

| Indicateur | Valeur actuelle (CONFIRMÉ, 02/09/2026) | Comment le re-mesurer |
|---|---|---|
| Produits actifs | 1 710 | `productsCount(query:"status:active")` |
| Produits en rupture (≥1 variante) | 167 (≈9,8 %) | `productsCount(query:"status:active AND out_of_stock_somewhere:true")` |
| Collections | 40 | `collectionsCount` |
| Répartition < 20 € | 889 (52 %) | requête prix par tranche |
| Répartition > 300 € | 31 (2 %) | idem |
| **Commandes all-time** | **1** (payée, 34,80 €, 04/08/2026) | `ordersCount` |
| **Produits ayant généré ≥1 vente** | **1 sur 1 710** (≈0,06 %) | déduit de la commande unique |
| **Taux de conversion catalogue** | Non calculable sans données de trafic — seul le numérateur (1 vente) est connu, le dénominateur (visites) est INACCESSIBLE | nécessite GA4/Search Console |

## Indicateurs actuellement invisibles — à instrumenter en priorité (INACCESSIBLE aujourd'hui)

- Sessions / visiteurs uniques, taux de rebond, sources d'acquisition — nécessite GA4 ou équivalent.
- Taux de conversion réel (visite → commande).
- Panier moyen réel, LTV client.
- Taux d'ouverture/clic du flow email abandon de panier.
- Position moyenne / impressions Search Console par requête.

## North Star Metric — proposition, non validée

**Proposition (HYPOTHÈSE, à valider avec l'utilisateur)** : chiffre d'affaires net mensuel par catégorie active, croisé avec la marge moyenne observée (150 % sur l'échantillon CJ du 13/08 — à confirmer sur un échantillon plus large et plus récent). Une North Star Metric à base de "revenu potentiel" projeté (comme le chiffre 104 352 € du 13/08) est déconseillée car elle n'est pas un revenu réalisé — le brief de l'utilisateur interdit explicitement de présenter une projection comme un résultat. **Recommandation** : ne fixer de North Star Metric définitive qu'une fois le tracking analytique (R-2 dans RISKS.md) en place, pour pouvoir la mesurer réellement plutôt que l'estimer.

## Suivi du score OMEGA (delta entre sessions)

Score global au 02/09/2026 (session "ONDEAL OMEGA") : **3,8/10**, détail par axe dans `reports/ONDEAL-OMEGA-STATE.md` §2.
Session "ONDEAL OMEGA EVOLUTION" (même jour, quelques minutes plus tard) : **score inchangé — aucune nouvelle donnée mesurable n'est arrivée** (pas de nouvel accès analytics/Semrush, pas de mutation catalogue). Le seul changement est epistémique : la piste "BigBuy archivé" pour expliquer R-1 a été testée et infirmée (voir RISKS.md, DECISIONS.md D-7). Conformément à la consigne de ne pas chercher à faire évoluer artificiellement le score, il n'est pas recalculé sans donnée nouvelle.

## Fréquence de mise à jour recommandée

Ce fichier devrait être régénéré à chaque session d'audit/stratégie future à partir de requêtes Shopify Admin GraphQL réelles (jamais recopié sans re-vérification), en particulier tant que l'anomalie catalogue (R-1) n'est pas résolue.
