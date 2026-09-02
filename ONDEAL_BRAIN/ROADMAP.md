# ROADMAP.md — Feuille de route 7 / 30 / 90 / 365 jours

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026. Chaque item renvoie à OPPORTUNITIES.md (numéro) et précise s'il est exécutable en autonomie ou nécessite l'utilisateur.*

## 7 jours — clarifier les fondations

| Action | Type | Réf. |
|---|---|---|
| Obtenir réponse utilisateur sur l'écart catalogue 8 487→1 715 | REQUIRES_HUMAN_APPROVAL | Opp. 1 |
| Décider du positionnement réel (généraliste vs spécialiste) | REQUIRES_HUMAN_APPROVAL | Opp. 2 |
| Configurer GA4/Search Console | REQUIRES_HUMAN_APPROVAL (identifiants) | Opp. 6, 17 |
| Retirer les tags catégorie à 0 produit de la navigation | Autonome, faible risque | Opp. 4 |
| Vérifier le format d'affichage des prix (virgule/point) | Autonome, faible risque (vérification) | Opp. 11 |
| Re-tester le tunnel d'achat en live post-corrections | Autonome, faible risque (lecture seule) | Opp. 12 |
| Confirmer quel code sert réellement `ondeal.fr` | Autonome, faible risque (vérification) | Opp. 14 |

## 30 jours — instrumenter et recentrer

| Action | Type | Réf. |
|---|---|---|
| Recalculer une marge moyenne catalogue actuelle (échantillon large) | Nécessite accès commandes/coûts | Opp. 5 |
| Relancer l'analyse concurrentielle dès quota Semrush rétabli | Autonome dès accès rétabli | Opp. 8 |
| Segmenter la collection "Nouveauté" (fenêtre glissante) | Autonome, faible risque | Opp. 10 |
| Ajouter JSON-LD Product/BreadcrumbList si absent | Autonome, faible risque | Opp. 15 |
| Documenter une procédure de vérification post-import catalogue | Autonome | Opp. 19 |
| Plafonner l'affichage `totalInventory` si confirmé nécessaire | Autonome, faible risque | Opp. 13 |

## 90 jours — construire sur des données réelles

| Action | Type | Réf. |
|---|---|---|
| Réallouer le sourcing CJ/Syncee selon le positionnement tranché | Nécessite décision + budget | Opp. 3 |
| Recentrer le budget d'acquisition sur les catégories fortes | Nécessite données Ads réelles | Opp. 7 |
| Auditer le maillage interne SEO | Autonome | Opp. 16 |
| Lancer les premières expérimentations mesurables (EXPERIMENTS.md) | Autonome une fois tracking en place | — |

## 365 jours — pérenniser

| Action | Type | Réf. |
|---|---|---|
| Explorer une intégration CJ API réelle et fiable | Nécessite décision + clé API | Opp. 20 |
| Envisager un canal contenu (TikTok/Reels) si le positionnement le justifie | Nécessite décision + ressources | Opp. 9 |
| Ajouter un smoke test post-déploiement automatisé | Autonome, technique | Opp. 18 |
| Réévaluer l'ensemble d'ONDEAL_BRAIN avec des données analytics réelles disponibles | Autonome | — |

## Vue continue NOW / NEXT / LATER / WATCH (mise à jour 02/09/2026, session Evolution)

Cette vue est destinée à être réévaluée à chaque session, contrairement aux horizons fixes 7/30/90/365 ci-dessus qui restent la référence de fond.

- **NOW** (bloqué sur une réponse utilisateur, aucune tâche sûre supplémentaire identifiée) : obtenir la source exacte de "8 000 produits BigBuy archivés" (D-7/R-1) ; obtenir la décision de positionnement (D-2 dans les décisions historiques) ; obtenir un identifiant GA4/Search Console.
- **NEXT** (dès qu'une réponse arrive) : agir sur R-1 selon la réponse (rien à faire si expliqué de façon bénigne ; investigation Shopify si suppression non volontaire suspectée) ; recentrer le sourcing/budget selon le positionnement tranché.
- **LATER** : expérimentations mesurables une fois le tracking en place ; intégration CJ API réelle ; piste contenu (TikTok/Reels) si ressources confirmées.
- **WATCH** (surveillance passive, pas d'action requise sauf changement) : récidive éventuelle de l'incident de disponibilité Vercel ; rétablissement du quota Semrush ; évolution du nombre de produits actifs à chaque session future (pour détecter toute nouvelle variation brutale comme celle de R-1).

## Ce que cette feuille de route ne fait pas

Elle ne fixe aucune date calendaire précise ni aucun objectif chiffré (ex. "+20 % de trafic") — aucune base de mesure actuelle ne permettrait de garantir un tel chiffre honnêtement. Les échéances (7/30/90/365 jours) sont des horizons de priorisation, pas des engagements de résultat.
