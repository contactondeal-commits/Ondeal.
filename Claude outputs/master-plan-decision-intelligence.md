# OnDeal Intelligence → Plateforme de Décision — Master Implementation Plan

**Date** : 05/09/2026 · **Base** : commit `71a352c` (lot 5, dernier livré)
**Contexte** : réponse à la mission "transforme OnDeal Intelligence en THE DECISION INTELLIGENCE PLATFORM FOR COMMERCE". Ce document est la Phase 0 demandée : audit complet du dépôt, puis plan priorisé. Aucun code n'a été modifié pour produire ce plan.

---

## 1. Ce qui existe déjà (et qu'il ne faut PAS reconstruire)

Point important avant toute chose : une bonne partie de la vision décrite dans la mission **existe déjà**, sous une forme solide mais peu mise en scène. Le travail principal n'est donc pas de "créer" ces briques, mais de les **révéler, relier et mettre en valeur** — exactement ce que la mission demande ("réutiliser, ne pas dupliquer").

Confirmé par lecture directe du code :

- **Moteur de décision** (`src/lib/intelligence/decision.ts`, `simulate.ts`, `prediction.ts`, `recommendations.ts`, `group.ts`, `reliability.ts`, `snapshot.ts`, `score.ts`) — machine d'état `signal → confirm → ready-execute → done-success/done-failed/stale`, anti-doublon, détection de simulation obsolète (`stale_simulation`). C'est un vrai moteur de décision, pas une maquette.
- **Cycle de vie des actions** (`ActionItem` : `PENDING_VALIDATION → CONFIRMED → EXECUTED/FAILED`, `sensitivity SAFE/SENSITIVE`, `AuditLog` complet, `criticalTargetKey` anti-doublon) — c'est déjà "Trust Layer" + confirmation humaine pour le sensible, tel que demandé.
- **Composants de décision réutilisables** : `DecisionCard`, `DecisionStepper`, `EvidencePanel`, `SimulationPanel`, `ResultPanel`, `PriceScenarioTable`, `ActionKindBadge` (`src/components/decision/`).
- **Command Bar globale** (⌘K, `src/components/CommandBar.tsx`) — navigation + actions + point d'entrée Copilot, déjà branchée sur `/api/assistant/query`.
- **Sidebar contextuelle** avec compteurs **réels** (jamais décoratifs) par section, groupes repliables, plan/usage réel.
- **Dashboard** (541 lignes) : regroupement de recommandations par sévérité (`group.ts`, `severity.tsx`), fil d'activité réel (`AuditLog`), anneau de santé (`HealthRing`), déjà proche d'un "Command Center".
- **Assistant IA contextuel** (`assistant.ts`, `/api/assistant/query`, `AssistantChat.tsx`) — pas un chatbot générique, déjà branché sur les données réelles boutique.
- **Multi-tenant strict** (`User → Organization → Store`), **billing Shopify réel** (webhooks `app_subscriptions/update`, jamais de statut deviné), **3 connecteurs catalogue** (Shopify/WooCommerce/PrestaShop) + **CJdropshipping** en lecture stock fournisseur, **31 routes API**, **27 fichiers de tests** (254 tests passants), design tokens + `lucide-react` déjà en place (zéro emoji détecté dans les composants audités).
- **Intelligence produit partielle** : `margin.ts`, `costs.ts`, `bulkPricing.ts`, `marketing.ts`, `reviews.ts`, `stockEvidence.ts` — les briques de "Sales/Margin/Inventory/Review Intelligence" existent déjà séparément, mais **pas encore reliées entre elles** au niveau d'une entité produit unique (pas de "Business Entity Intelligence" transversale aujourd'hui).

**Conclusion d'audit** : ce n'est pas un MVP fragile à refondre, c'est un produit de fond solide, sous-exploité visuellement et pas encore relié en une expérience narrative unique. La mission a donc raison de dire "ne construis pas de système parallèle" — la priorité réelle est **intégration + narration + polish**, pas réécriture.

## 2. Écarts réels vs la vision demandée

Ce qui manque véritablement :

1. **Pas de vue "Qu'est-ce qui a changé"** (comparaison 7/30/90 jours) — les snapshots existent (`ScoreSnapshot`, `MarginSnapshot`) mais ne sont pas exploités en delta temporel dans l'UI.
2. **Pas d'entité "Produit" transversale** — marge, stock, avis, prix, ventes d'un même produit sont visibles sur des pages séparées (`/stock`, `/reviews`, `/pricing`), jamais réunis sur une fiche unique.
3. **Pas de "Decision Workspace" dédié** — la décision se vit aujourd'hui inline dans le dashboard/les listes, pas dans un espace dédié avec fil complet OBSERVE→EXPLAIN→SIMULATE→DECIDE.
4. **Pas de traitement en tâche de fond** — déjà identifié et sciemment reporté cette session (voir doc lot 5) : tout est un appel HTTP bloquant. C'est un vrai chantier d'infrastructure (queue), pas un simple ajustement.
5. **Pas de synchronisation multi-boutique groupée** — également déjà identifié et reporté.
6. **Pas de "Commerce Graph" ni de "Missions"** — n'existent pas du tout aujourd'hui ; à évaluer si un vrai besoin utilisateur les justifie avant de les construire (risque de complexité gratuite pour un produit piloté par un seul utilisateur actuellement).
7. **Pas de couche "Impact réel vs estimé"** — les décisions exécutées ne comparent pas leur résultat réel mesuré à la simulation initiale.

## 3. Principes retenus pour la suite (non négociables)

- **Réutiliser, jamais dupliquer** : toute nouvelle vue s'appuie sur `decision.ts`/`simulate.ts`/`group.ts`/`snapshot.ts`/`DecisionCard`/`CommandBar`/`AppShell` existants.
- **Aucune donnée fictive en chemin de production.** Mode Démo (`isDemo`) reste strictement isolé, comme aujourd'hui.
- **Ne jamais simuler un système qui n'existe pas** : pas de "ML" maquillé, pas de fausse file d'attente qui prétend traiter en tâche de fond alors qu'elle bloque toujours.
- **Confirmation humaine obligatoire** pour toute action `SENSITIVE` — déjà le comportement, à préserver strictement dans toute nouvelle surface.
- **Qualité > couverture** : 3 expériences vraiment abouties plutôt que 8 esquissées, conformément à l'instruction explicite de la mission.
- **QA visuelle réelle à chaque lot** (serveur réel, clics réels, console/réseau vérifiés) — pas seulement `build` vert, comme pour les lots 1 à 5 de cette session.
- **Livraison par lots** via le circuit déjà rodé (bundle git → `ondeal-intelligence-deploy` → fetch/merge/push par vous) — aucun changement de méthode.

## 4. Priorisation — 3 expériences phares (conforme à la mission)

Plutôt que suivre les 21 phases dans l'ordre littéral (ce qui donnerait une V1 large mais superficielle), l'effort se concentre sur 3 expériences réellement abouties, dans cet ordre :

1. **Command Center** (le dashboard existant, densifié) — ajoute la comparaison temporelle "Qu'est-ce qui a changé" (7/30/90 j) au-dessus de l'existant. Impact immédiat, risque faible, aucune nouvelle table nécessaire (les snapshots existent déjà).
2. **Decision Workspace** — un espace dédié par décision qui assemble linéairement les composants déjà existants (`EvidencePanel` → `SimulationPanel` → `DecisionStepper` → `ResultPanel`) au lieu de leur affichage inline actuel, avec ajout de la couche "Impact réel vs estimé" une fois l'action exécutée.
3. **Product Intelligence** — la fiche produit transversale (demande/conversion/marge/stock/avis/prix réunis), qui relie enfin les moteurs déjà existants (`margin.ts`, `stock.ts`, `reviews.ts`, `bulkPricing.ts`) sur une seule page par produit.

Les chantiers d'infrastructure lourde (tâches de fond, sync multi-boutique groupée, Commerce Graph, Missions) sont **volontairement après** ces 3 expériences : les construire avant risquerait de retarder la valeur visible, et deux d'entre eux (tâche de fond, sync groupée) ont déjà été explicitement mis en attente par vous cette semaine.

## 5. Plan par lots

| Lot | Contenu | Risque | Nouvelle table Prisma ? |
|---|---|---|---|
| **6** | Command Center — bloc "Qu'est-ce qui a changé" (7/30/90j) sur le dashboard, à partir de `ScoreSnapshot`/`MarginSnapshot` existants | Faible | Non |
| **7** | Decision Workspace — page dédiée `/actions/[id]` (ou équivalent) qui assemble les composants existants en fil narratif complet | Faible | Non |
| **8** | Impact réel vs estimé — après exécution d'une action, comparer le résultat mesuré (vente, marge, stock réel) à la simulation d'origine | Moyen (dépend de la fraîcheur des données post-action) | Probablement une colonne `measuredResultJson` sur `ActionItem`, ou une table dédiée si le besoin de requêtage l'exige |
| **9** | Product Intelligence — fiche produit transversale reliant marge/stock/avis/prix/ventes | Moyen (agrégation de plusieurs moteurs sur une seule page, perf à surveiller sur gros catalogue) | Non a priori |
| **10** | Copilot contextuel renforcé — le rendre conscient de la page courante (déjà partiellement le cas via `/api/assistant/query`), capable d'expliquer/comparer/simuler depuis n'importe quelle page | Faible-moyen | Non |
| **11** | Design system — passe de durcissement (tokens sémantiques, unification des composants restants, vérif zéro emoji/icônes cohérentes) | Faible | Non |
| **12+** | Chantiers d'infrastructure (tâches de fond, sync multi-boutique groupée) — repris comme chantiers séparés déjà annoncés, **après** les 3 expériences phares | Élevé (vrai changement d'architecture) | Oui (probable table `Job`) |
| **Plus tard, sur besoin avéré** | Commerce Graph, Missions | — | À ne construire QUE si un besoin utilisateur concret apparaît — pas par anticipation |

Chaque lot suit le processus déjà utilisé cette session : inspection ciblée → implémentation → `tsc --noEmit` → `vitest run` → `next build` → QA visuelle sur serveur réel (Claude in Chrome) → bundle git → livraison.

## 6. Ce qui ne sera explicitement PAS fait (et pourquoi)

- **Pas de "Learning"/ML simulé** : aucun système d'apprentissage automatique ne sera présenté comme actif tant qu'aucune vraie boucle d'apprentissage n'existe. On peut en revanche exposer honnêtement les données déjà collectées (résultats réels vs estimés du lot 8) comme fondation pour un futur système, sans prétendre qu'il apprend déjà.
- **Pas de file d'attente de jobs simulée** : tant que le lot d'infrastructure (tâches de fond) n'est pas fait, aucune UI ne prétendra qu'un traitement continue "en arrière-plan" — le comportement actuel (traitement par lots avec bouton "Continuer") reste affiché tel qu'il est réellement.
- **Pas de Commerce Graph/Missions par anticipation** : complexité non justifiée tant qu'aucun besoin utilisateur concret ne les réclame.

## 7. Prochaine étape immédiate

Lot 6 (Command Center — "Qu'est-ce qui a changé") démarre directement, selon le principe déjà validé par vous : pas de validation requise pour les décisions non destructives, arrêt uniquement si une décision devient irréversible ou risquée pour les données — ce qui n'est pas le cas ici (lecture seule de snapshots existants, aucune écriture, aucune migration).
