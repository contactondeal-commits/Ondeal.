# TRAFFIC_TRUST_PLAN.md — Plan trafic & confiance (AXE 3)

*Voir `_LEGEND.md`, CLAIMS.md (CLAIM-007, CLAIM-008), RISKS.md (R-0). Créé : 02/09/2026. Ce plan répond directement au diagnostic reçu : "le problème n'est pas le catalogue, c'est le trafic et la confiance" — diagnostic confirmé par vérification indépendante.*

## Ce qu'on sait réellement (résumé, tout CONFIRMED)

- 1 seule commande dans toute l'histoire du magasin (04/08/2026, 34,80 €).
- 27 "Checkout Started" / 5 clients uniques en août 2026 → **~80 % d'abandon de panier parmi les rares clients qui atteignent le checkout.** C'est un vrai signal, mesuré, pas une supposition.
- 0 événement "Active on Site" / "Viewed Product" sur toute la période → le trafic en amont du checkout est totalement invisible (pas de tracking onsite actif, ni Klaviyo ni GA4).
- Un flow email "Abandoned Checkout Reminder" est **actif** (Klaviyo, live depuis le 19/08/2026) — donc les 4 abandons potentiels d'août, s'ils ont eu lieu après cette date, ont dû recevoir une relance automatique. Sur les 27 checkouts (répartition exacte par date non vérifiée dans le détail cette session), une partie a pu précéder l'activation du flow.
- Un système d'avis client existe dans le code (`ReviewsList.tsx`, `WriteReviewForm.tsx`), fonctionnel depuis le 17/08/2026 (le formulaire "laisser un avis" reste visible même sans avis existant). **Le volume réel d'avis n'a pas été vérifié cette session** (nécessiterait une requête sur les produits pour lire `reviewsCount`/`rating` réels) — À VÉRIFIER.

## Priorité 1 — comprendre l'abandon de panier (le signal le plus fort et le plus actionnable)

C'est la piste la plus rentable identifiée cette session : 5 clients sur toute l'histoire du site sont arrivés jusqu'au checkout — un trafic qualifié existe donc, au moins un peu, contrairement à l'hypothèse "zéro trafic". Le problème se situe (au moins en partie) **après** l'arrivée sur le site, au moment de payer.

Actions à faible risque, exécutables en lecture seule dès que souhaité :
1. Vérifier le tunnel de checkout Shopify en conditions réelles (frais de port affichés à quel moment, méthodes de paiement proposées, messages d'erreur éventuels).
2. Vérifier si des frais de livraison ou une exigence de compte apparaissent tardivement dans le tunnel (cause n°1 classique d'abandon).
3. Vérifier la présence de badges de confiance/réassurance au moment du paiement (sécurité, retours, contact).

## Priorité 2 — activer un tracking onsite minimal

Sans lui, impossible de savoir si le vrai problème est "personne ne visite le site" ou "des visiteurs arrivent mais ne cliquent pas vers un produit". Deux options concrètes, aucune n'exigeant un développement lourd :
- **Klaviyo onsite** : le compte Klaviyo est déjà connecté (voir DATA.md) — il manque uniquement le script de tracking onsite sur le site Next.js pour que "Active on Site"/"Viewed Product" cessent d'être à zéro.
- **GA4** : toujours non configuré (voir MARKETING.md/DATA.md), utile en complément pour les sources de trafic (SEO, social, direct) que Klaviyo ne couvre pas nativement de la même façon.

**REQUIRES_HUMAN_APPROVAL** : les deux nécessitent une décision/un identifiant de la part de l'utilisateur (quel compte GA4, activer le script Klaviyo onsite).

## Priorité 3 — preuve sociale (avis)

Vérifier le volume réel d'avis existants avant de lancer une campagne de collecte (pour ne pas dupliquer un système déjà actif). Une fois confirmé : le flow Klaviyo existant (Abandoned Checkout) pourrait être complété par un flow post-achat de demande d'avis — mais avec une seule commande all-time, le volume ne justifie pas encore un tel flow ; à réévaluer une fois plus de commandes réelles.

## Priorité 4 — SEO on-page (déjà partiellement fait, voir SEO.md)

Les corrections de la session précédente (métadonnées globales, JSON-LD Organization, ISR) restent valides. Ce qui manque encore : JSON-LD Product par fiche, et surtout un accès Search Console pour savoir si le site est même indexé correctement — sans lui, le SEO reste un travail à l'aveugle.

## Priorité 5 — contenu sur les catégories fortes (TikTok/Instagram)

Cohérent avec CONTENT.md : Bijoux (151 produits), Montres Homme (116/92 selon tag vs collection), Beauté & Soin (158) sont les catégories les plus "démontrables" visuellement. **Reste une piste (HYPOTHÈSE), pas un plan chiffré** — aucune donnée de coût/ressource confirmée pour l'exécuter, et surtout : tant que 4 clients sur 5 abandonnent au checkout, générer plus de trafic sans corriger la Priorité 1 revient à remplir un seau percé.

## Ce que ce plan ne fait pas

Il ne propose aucune campagne payante, aucun budget, aucun engagement chiffré — ce sont des décisions **REQUIRES_HUMAN_APPROVAL**. Il ordonne les priorités par ce qui est déjà mesuré (l'abandon de panier) vers ce qui reste à mesurer (le trafic amont), plutôt que l'inverse.
