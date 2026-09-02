# MARKETING.md — Acquisition & marketing

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026.*

## Ce qui est en place (CONFIRMÉ, code + changelog historique)

- Liens réseaux sociaux réels intégrés (au lieu de placeholders), Google Shopping feed actif et enrichi (cette session : ajout `g:sale_price` séparé de `g:price`, `g:additional_image_link`, `g:item_group_id`, `g:custom_label_0`, `g:google_product_category`, `g:shipping_label` — pertinent pour éviter les rejets Merchant Center pour "présentation trompeuse").
- Flow email d'abandon de panier actif (Resend), selon `ONDEAL_AUTONOMOUS/CHANGELOG.md` du 15/08/2026.
- GA4/Meta Pixel : le code prévoit une intégration conditionnelle, mais **aucun identifiant `NEXT_PUBLIC_GA4_MEASUREMENT_ID` n'est configuré** — donc, concrètement, **aucun tracking analytics n'est actif en production actuellement**. C'est un vrai trou noir pour toute décision d'acquisition (voir CUSTOMER.md, DATA.md, RISKS.md).

## Ce qui n'a pas pu être évalué — INACCESSIBLE

- Aucune donnée de campagne Google Ads réelle (mentionnée dans le contexte projet mais non consultée cette session — aucun connecteur Google Ads/Supermetrics/Windsor.ai n'a été mobilisé pour cette mission).
- Aucune donnée Semrush (trafic organique, mots-clés, position) — quota insuffisant.
- Aucune performance email réelle (taux d'ouverture, de clic du flow abandon panier).

## Lecture stratégique (PROBABLE, déduite du catalogue)

Investir un budget d'acquisition (Ads, social) sur des catégories vides ou quasi vides (Téléphones, Informatique, Livres) produirait un gaspillage quasi certain — le trafic atterrirait sur des pages pauvres en choix, avec un taux de rebond élevé attendu. À l'inverse, les catégories fortes (Bijoux, Montres homme, Jouets, Cuisine, Jardin) sont celles où un budget d'acquisition a le plus de chances d'être rentable dans l'état actuel du catalogue. **Ceci reste une déduction structurelle, pas une recommandation budgétaire chiffrée** — aucune donnée de coût d'acquisition réel n'est disponible pour la valider.

## Recommandations

1. **Priorité 7 jours, zéro risque** : configurer un identifiant GA4 (ou équivalent) pour cesser de piloter à l'aveugle. Décision utilisateur requise (créer/fournir l'identifiant) — **REQUIRES_HUMAN_APPROVAL** (identifiants).
2. **Priorité 30 jours** : aligner le budget d'acquisition (si un connecteur Ads est branché) sur les catégories à stock suffisant, en excluant les catégories quasi vides tant qu'elles ne sont pas réapprovisionnées.
3. Revenir sur Semrush dès que le quota est rétabli pour objectiver la comparaison concurrentielle avant toute décision budgétaire importante.
