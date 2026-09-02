# DECISIONS.md — Journal des décisions

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026. Ce journal est cumulatif — ne pas effacer les entrées antérieures aux prochaines sessions, ajouter en tête.*

## 02/09/2026 (suite) — Session ONDEAL OMEGA EVOLUTION

| # | Décision / constat | Statut | Label |
|---|---|---|---|
| D-7 | Hypothèse "8 000 produits BigBuy archivés volontairement" reçue comme explication de D-1 | **CONTRADICTED** (protocole formel appliqué, voir RISKS.md R-1) : donnée A = USER_DECLARED (l'affirmation reçue), donnée B = OBSERVED (archived=1, vendor/tag BigBuy=0 sur Shopify réel). Ni l'une ni l'autre n'est effacée ; la cause réelle de l'écart catalogue reste **UNKNOWN**. Question posée à l'utilisateur : à quoi correspond exactement cette référence aux "8 000 produits BigBuy" (export externe, autre boutique, autre système) ? | CONTRADICTED — en attente de réconciliation par l'utilisateur |

## 02/09/2026 — Session ONDEAL OMEGA

| # | Décision / constat | Statut | Label |
|---|---|---|---|
| D-1 | Écart catalogue 8 487 (13/08) → 1 715 (02/09) non expliqué | **Signalé, non résolu** — nécessite réponse utilisateur ou investigation Shopify (journal d'audit) | CRITIQUE / À VÉRIFIER |
| D-2 | Incident de disponibilité Vercel (~00h40-00h55) — cause racine non déterminée, piste "revert Accept-Language" en erreur ~5h avant | **Signalé à l'utilisateur, résolu de lui-même** ("c'est rétabli") | À VÉRIFIER si récurrent |
| D-3 | Aucune donnée analytics (GA4/Search Console) active en production | **Signalé comme lacune prioritaire**, action requise de l'utilisateur | REQUIRES_HUMAN_APPROVAL |
| D-4 | Accès Semrush et Shopify accessible mais Semrush inaccessible (quota) | Utilisation de Shopify Admin GraphQL réel comme source de données catalogue à la place | INACCESSIBLE (Semrush uniquement) |
| D-5 | Positionnement réel (bijoux/montres/jouets/déco petit prix) vs positionnement affiché (généraliste 11 catégories) | **Décalage documenté, choix stratégique non tranché** | À VÉRIFIER auprès de l'utilisateur |
| D-6 | Aucune mutation de prix, stock, commande, client ou identifiant effectuée cette session | Conforme à la règle absolue de la mission | — |

## Historique antérieur (résumé, sessions précédentes — voir rapports source pour le détail complet)

- 13/08/2026 — Import CJ réel de 118 produits (voir `reports/cj-phase4-execution-final.md`).
- 14/08/2026 — Corrections de navigation/catégorisation Shopify + audit prix (voir `reports/phase6-master-audit.md`) ; constat que `ondeal.fr` servait alors le thème Dawn plutôt que l'app Next.js.
- 15/08/2026 — Décision de conserver le login client natif Shopify (pas de compte custom) ; activation du flow email d'abandon de panier ; expansion multilingue explicitement non démarrée.
- 01-02/09/2026 (session précédente à celle-ci) — Correction de l'endpoint partenaires (405 cassé), du bug de symbole devise, ajout métadonnées SEO globales, ISR produit/catégorie, durcissement sécurité formulaires.
