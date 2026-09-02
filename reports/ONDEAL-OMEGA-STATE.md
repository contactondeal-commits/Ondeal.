# ONDEAL OMEGA — État stratégique

**Date :** 02/09/2026
**Mode :** Intelligence stratégique autonome — lecture seule sur le catalogue/commandes/comptes, corrections de code uniquement là où déjà validées en session précédente.
**Règle Zéro appliquée strictement** : voir `ONDEAL_BRAIN/_LEGEND.md` pour les labels utilisés dans tout ce document. Aucun chiffre d'affaires, avis, stock ou résultat concurrentiel n'a été inventé.

---

## 1. Carte d'intelligence OMEGA — synthèse

OnDeal est une boutique Shopify + frontend Next.js headless, avec un catalogue réel aujourd'hui de **1 715 produits (1 710 actifs), 40 collections**, structurellement concentré sur Bijoux, Montres homme, Jouets, Cuisine, Jardin et Beauté — malgré une navigation affichée qui promet un site généraliste à 11 catégories. Le site ne dispose d'**aucun tracking analytique actif** (GA4/Search Console absents), ce qui rend toute décision marketing/CRO actuelle dépendante de déductions structurelles plutôt que de données comportementales réelles. Un **écart catalogue majeur et non expliqué** (8 487 produits déclarés le 13/08/2026 vs 1 715 mesurés et revérifiés ce jour) constitue le signal le plus préoccupant de cette session et doit être élucidé avant toute nouvelle décision de sourcing. Le détail complet, par domaine, est dans les 18 fichiers de `ONDEAL_BRAIN/`.

Cette session a par ailleurs confirmé que le compte Shopify MCP donne un accès en lecture temps réel fiable au catalogue (utilisé pour tous les chiffres ci-dessus), que Semrush est actuellement inutilisable (quota épuisé), et qu'un incident de disponibilité Vercel s'est produit puis résolu de lui-même pendant la session, sans cause confirmée.

---

## 2. Score OMEGA par axe (justifié, pas un chiffre arbitraire)

Barème : 0-2 Critique / 3-4 Faible / 5-6 Moyen / 7-8 Bon / 9-10 Excellent. Chaque score s'appuie sur les constats des fichiers `ONDEAL_BRAIN/` correspondants — voir la justification, pas seulement le chiffre.

| Axe | Score /10 | Justification courte |
|---|---|---|
| Business model & catalogue | **4/10** | Catalogue réel cohérent et rentable sur l'échantillon mesuré (marge 150 % sur 118 produits CJ), mais écart non expliqué de -80 % vs le chiffre du 13/08 : impossible de noter plus haut tant que ce point n'est pas résolu (voir RISKS R-1). |
| Positionnement | **4/10** | Décalage réel entre navigation affichée (généraliste) et catalogue réel (concentré bijoux/montres/déco) — non tranché stratégiquement. |
| Connaissance client | **2/10** | Aucune donnée comportementale réelle disponible ; hypothèses de profil client non vérifiées. |
| Concurrence | **1/10** | Aucune donnée externe accessible cette session (Semrush hors quota) ; note basse par manque de visibilité, pas par mauvaise performance réelle. |
| Produit / merchandising | **5/10** | Catégories fortes bien dotées ; catégories vides ou creuses encore présentes dans la navigation (risque SEO/CRO identifié et corrigeable). |
| Marketing / acquisition | **3/10** | Fondations propres (feed Shopping enrichi, flow email actif, liens sociaux réels) mais pilotage à l'aveugle sans tracking. |
| Contenu | **2/10** | Aucun contenu éditorial identifié ; site 100 % transactionnel. |
| SEO | **5/10** | Corrections structurelles solides apportées cette session-ci et la précédente (métadonnées, ISR, JSON-LD Organization) ; lacunes restantes connues et documentées (JSON-LD Product, pages vides indexables potentielles). |
| CRO / conversion | **5/10** | Plusieurs bugs bloquants réels corrigés (devise, formulaire partenaires, injection HTML) ; tunnel d'achat non re-testé en live cette session. |
| Marque | **3/10** | Éléments visuels cohérents, aucune stratégie de marque écrite ou validée. |
| Architecture technique | **7/10** | Stack moderne (Next.js/TypeScript/CSS Modules), headers de sécurité corrects, ISR ajouté ; incident de disponibilité récent non expliqué pèse sur la note. |
| Sécurité | **7/10** | Faille d'injection HTML corrigée, honeypots ajoutés, headers de sécurité complets ; pas d'audit de pénétration réalisé. |
| Gouvernance des données / mesure | **1/10** | Aucun tracking actif ; c'est le point le plus faible de l'ensemble et un prérequis pour améliorer presque tous les autres axes. |

**Score global OMEGA (moyenne simple, indicatif)** : **3,8/10**. Ce chiffre reflète surtout l'absence de mesure (axe le plus bas) plutôt qu'un mauvais état du produit ou du code — les axes techniques (architecture, sécurité) sont nettement au-dessus de la moyenne.

---

## 3. Red Team — attaque de la stratégie

Un examen critique délibéré des conclusions ci-dessus, pour éviter tout excès de confiance :

- **"La concentration catalogue sur bijoux/montres/jouets est une force"** — pas nécessairement vrai : sans donnée de marge/rotation par catégorie au-delà de l'échantillon CJ du 13/08, on ne sait pas si ces catégories fortes sont aussi les plus rentables, ou seulement les plus faciles à sourcer.
- **"Le tracking analytics est LE prérequis n°1"** — objection : sans même GA4, le catalogue et le pricing sont déjà exploitables pour des décisions structurelles (retirer des catégories vides, par exemple) ; sur-prioriser le tracking pourrait retarder des actions à faible risque et fort impact déjà identifiées.
- **"L'écart catalogue 8 487→1 715 est forcément un problème"** — objection : il est également possible que ce soit une correction assumée par l'utilisateur (nettoyage volontaire de doublons ou de produits non conformes) que cette session ignore simplement faute de contexte. Traiter ce point comme une alarme sans savoir sa cause réelle risque de créer une inquiétude disproportionnée si la réponse est bénigne.
- **"Le format prix avec un point plutôt qu'une virgule est un problème"** — non confirmé comme un problème réel, seulement une observation ; peut être un choix delibéré (lisibilité internationale) et non une erreur.
- **Biais de disponibilité** : cette analyse s'appuie fortement sur ce qui est mesurable via Shopify Admin GraphQL (catalogue, prix, stock) simplement parce que c'est la source accessible — pas parce que c'est nécessairement le facteur le plus déterminant du succès business d'OnDeal. Le marketing, la marque et le contenu, invisibles faute d'outils, pourraient en réalité peser davantage.

## 4. Version défendable (Blue Team)

Compte tenu des objections ci-dessus, la version défendable de la priorisation est la suivante, non comme certitude mais comme meilleur compromis avec l'information disponible : (1) élucider l'écart catalogue avant tout nouveau sourcing, car le coût de vérifier est faible et le coût de ne pas savoir est potentiellement élevé ; (2) traiter en parallèle, sans attendre le tracking, les corrections à faible risque et forte confiance déjà identifiées (catégories vides en nav, format prix, segmentation "Nouveauté") car elles ne dépendent d'aucune donnée manquante ; (3) placer la mise en place du tracking analytique en tête des demandes à l'utilisateur, non comme un blocage total du reste, mais comme le prérequis de toute décision budgétaire (Ads, sourcing) à venir.

---

## 5. Roadmap 7 / 30 / 90 / 365 jours

Voir `ONDEAL_BRAIN/ROADMAP.md` pour le détail complet et les références croisées vers `OPPORTUNITIES.md`. Résumé :

- **7 jours** : clarifier l'écart catalogue, trancher le positionnement, configurer le tracking, corriger les catégories vides en navigation, vérifier le format prix et le code réellement servi en production.
- **30 jours** : recalculer la marge catalogue actuelle, relancer Semrush, segmenter "Nouveauté", compléter le JSON-LD SEO.
- **90 jours** : réallouer le sourcing selon le positionnement tranché, recentrer le budget d'acquisition, lancer les premières expérimentations mesurables.
- **365 jours** : intégration CJ API réelle, éventuel canal contenu, smoke tests automatisés, réévaluation complète d'ONDEAL_BRAIN avec des données réelles.

---

## 6. Décisions nécessitant une intervention humaine (liste exhaustive de cette session)

1. **Confirmer ou infirmer une suppression volontaire de produits** expliquant l'écart 8 487 → 1 715 (ou lancer une vérification côté support Shopify si non volontaire).
2. **Trancher le positionnement stratégique** : généraliste (11 catégories, à réinvestir en sourcing électronique/informatique) vs spécialiste assumé (bijoux/montres/déco/jouets petit prix).
3. **Fournir un identifiant GA4 / accès Search Console** pour activer le tracking analytique.
4. **Confirmer si les catégories de navigation vides** (Ordinateurs, Romans, BD — confirmé présentes dans `src/data/categories.ts`) peuvent être retirées de la navigation, ou doivent être conservées en l'état (décision produit/contenu, non exécutée automatiquement cette session par prudence, bien que techniquement à faible risque).
5. **Indiquer les concurrents directs à surveiller**, pour accélérer une analyse concurrentielle manuelle en attendant le rétablissement du quota Semrush.
6. **Préciser le budget/ressources disponibles** pour toute piste contenu (TikTok/Reels) avant qu'un plan concret soit proposé.
7. **Surveiller une éventuelle récidive de l'incident de disponibilité Vercel** ; si cela se reproduit, autoriser un accès plus profond aux logs de build ou contacter le support Vercel.

---

## 7. Ce qui n'a pas été fait cette session, et pourquoi

Le brief original (76 sections) demande une couverture allant au-delà de ce qui peut être établi de façon fiable avec les accès réellement disponibles cette session (pas d'Analytics, Semrush hors quota, pas d'accès aux commandes/clients explorés pour cette mission). Plutôt que de produire une couverture complète mais partiellement fabriquée des 76 sections, cette session a privilégié une base `ONDEAL_BRAIN/` plus courte mais entièrement traçable à des sources réelles, avec des lacunes explicitement marquées **À VÉRIFIER**/**INACCESSIBLE** plutôt que comblées par supposition. C'est un choix délibéré, conforme à la Règle Zéro explicitement exigée par l'utilisateur, qui prime sur l'exhaustivité formelle du plan en 76 sections.

**Fichiers produits cette session** : `ONDEAL_BRAIN/_LEGEND.md`, `BUSINESS.md`, `POSITIONING.md`, `CUSTOMER.md`, `COMPETITION.md`, `PRODUCT_STRATEGY.md`, `MARKETING.md`, `CONTENT.md`, `SEO.md`, `CRO.md`, `BRAND.md`, `DESIGN_SYSTEM.md`, `DATA.md`, `EXPERIMENTS.md`, `DECISIONS.md`, `RISKS.md`, `OPPORTUNITIES.md`, `KPI.md`, `ROADMAP.md`, et ce rapport `reports/ONDEAL-OMEGA-STATE.md`.
