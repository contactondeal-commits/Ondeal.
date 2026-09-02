# RISKS.md — Registre des risques

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026.*

## R-0 — 🚨 Quasi-absence totale de ventes (le risque le plus élevé du registre, ajouté 02/09/2026, précisé le même jour)

**CONFIRMÉ** (voir CLAIMS.md CLAIM-007, CLAIM-008) : 1 seule commande dans toute l'histoire du magasin, sur 1 710 produits actifs. **Impact** : c'est un problème de trafic et/ou de confiance, pas de catalogue — ajouter des produits ou optimiser le merchandising a un effet quasi nul tant que ce point n'est pas adressé (diagnostic reçu de l'utilisateur, confirmé par cette vérification indépendante).

**Précision importante (CLAIM-008)** : le problème n'est pas *entièrement* invisible. Klaviyo (connecté via l'intégration Shopify) montre **27 "Checkout Started" pour 5 clients uniques en août 2026, contre 1 seule commande finalisée — soit ~80% d'abandon parmi les rares clients qui atteignent le checkout.** C'est une vraie donnée de funnel, pas une déduction. En revanche, "Active on Site" et "Viewed Product" (Klaviyo) affichent 0 événement sur toute la période — le tracking onsite (comportement avant le checkout) n'est pas actif, cohérent avec l'absence de GA4 déjà documentée (R-2). Donc : **on sait qu'il y a un problème d'abandon de panier réel et mesuré, mais on ne sait toujours pas combien de personnes visitent le site en amont.**

**Action recommandée, par ordre de coût croissant** : (1) investiguer les 4 abandons de panier sur 5 (frais de port affichés tardivement, méthodes de paiement disponibles, message de confiance au checkout, bug technique éventuel du tunnel) — lecture seule, faible risque ; (2) confirmer l'état des signaux de confiance déjà en place ou non (avis Judge.me, politique de retour, CGV visibles — non audités en détail cette session) ; (3) activer un tracking onsite réel (Klaviyo onsite et/ou GA4) pour enfin mesurer le trafic amont. **REQUIRES_HUMAN_APPROVAL** sur toute action ayant un coût (campagnes, outils payants) ; les vérifications listées sont exécutables en autonomie (lecture seule).

## R-10 — 🚨 Délai de livraison affiché FAUX pour tout le catalogue (confirmé dans le code, découvert 02/09/2026 lors du premier import CJ)

**CONFIRMÉ** (lecture directe du code, pas une supposition) : `src/context/LocationContext.tsx` contient une table `LOCATION_CONFIG` codée en dur qui associe à chaque pays un délai de livraison fixe (France : `"2-5 jours ouvrés"`, valeur par défaut identique) — **totalement indépendant du fournisseur réel, du produit, ou du délai d'expédition effectif.** Ce n'est pas une estimation dynamique : c'est une chaîne de caractères statique appliquée à los 1 710 produits actifs, quelle que soit leur origine (BigBuy, CJ, DSers, stock local le cas échéant).

**Preuve concrète** : lors de l'import réel de 2 produits cette session (voir `IMPORTS_LOG.md`), l'écran de configuration d'expédition CJ indiquait un délai réel Chine → France de **12 à 50 jours** et **12 à 20 jours** selon le produit — contre les **"2 à 5/7 jours ouvrés"** et la date précise **"Livré le vendredi [J+2]"** affichés sur la fiche produit ondeal.fr. L'écart n'est pas marginal : un facteur de 3 à 10 fois le délai annoncé.

**Portée** : s'applique à l'ensemble du catalogue, pas seulement aux 2 produits importés cette session — tout produit sourcé depuis l'étranger (la majorité probable du catalogue actuel selon BUSINESS.md) affiche vraisemblablement une promesse de délai irréaliste.

**Impact potentiel** : lien plausible (PROBABLE, pas prouvé) avec R-0 — un client qui commande en pensant recevoir sous 2-5 jours et attend en réalité plusieurs semaines est un facteur direct de perte de confiance, de demande de remboursement, de avis négatif, voire de contestation bancaire. C'est précisément le scénario que l'utilisateur a explicitement demandé d'éviter ("pour ne revenir déçu"). Le lien causal avec le taux d'abandon panier actuel (80%, R-0) n'est PAS établi — l'abandon a lieu avant la livraison, donc avant que ce mensonge soit découvert par le client — mais l'impact sur la satisfaction post-achat et la réputation (avis, bouche-à-oreille, service client) est direct et significatif dès la première commande honorée.

**Action recommandée** : (1) corriger `LOCATION_CONFIG` pour refléter un délai réaliste (soit un délai générique plus prudent type "10-25 jours ouvrés" en attendant une vraie donnée par fournisseur, soit — mieux — un système dynamique par produit/fournisseur si l'architecture le permet) ; (2) retirer ou rendre honnête la précision "Livré le [date exacte]" qui crée une fausse promesse de date ferme. **HUMAN_APPROVAL_REQUIRED** : modification d'un fichier partagé affectant l'affichage de tout le catalogue — risque de régression large si mal exécuté, et décision business sur le message à afficher (l'utilisateur peut préférer temporiser avec les fournisseurs plutôt que de baisser la promesse affichée).

## Risques critiques (impact business potentiel élevé, statut non résolu)

### R-1 — Écart catalogue inexpliqué (8 487 → 1 715 produits)
**Impact potentiel** : si une suppression accidentelle ou un bug a réellement effacé ~6 772 produits, c'est une perte de catalogue majeure (chiffre d'affaires potentiel, référencement SEO des fiches perdues, historique produit). **Probabilité** : inconnue — aucune preuve de cause, aucune exclusion possible cette session. **Action recommandée** : demander à l'utilisateur confirmation d'une suppression volontaire ; sinon, ouvrir un ticket support Shopify pour un journal d'audit avant tout nouvel import. **REQUIRES_HUMAN_APPROVAL** (pas d'action corrective possible sans comprendre la cause).

**Mise à jour 02/09/2026 — application du protocole de résolution de contradiction (voir `_LEGEND.md`).**

| Élément | Donnée | Source | Statut |
|---|---|---|---|
| A | "L'écart catalogue s'explique par ~8 000 produits BigBuy archivés volontairement" | Déclaré dans les instructions reçues de l'utilisateur | **USER_DECLARED** |
| B | `status:archived` = 1 ; `vendor:BigBuy` et 5 variantes de tag testées = 0 dans tous les cas | Requêtes GraphQL directes sur le magasin Shopify réel, cette session | **OBSERVED** |
| — | "BigBuy" est un fournisseur historique réel (~210 produits actifs, tag `cat-bureau-papeterie`), mais rien à voir avec un lot de 8 000 produits archivés | Lecture directe du code source (`category-mapping.ts`, `categories.ts`, `productService.ts`) | **OBSERVED** |

**A et B se contredisent directement.** Conformément au protocole, aucune n'est effacée : le statut net de "l'écart catalogue est expliqué par un archivage BigBuy volontaire" est **CONTRADICTED**, pas résolu, pas rejeté unilatéralement. B (OBSERVED, source primaire indépendante) ne remplace pas automatiquement A (USER_DECLARED) — elle appelle une clarification de l'utilisateur : soit il confirme que sa référence aux "8 000 BigBuy" vient d'un système externe à ce Shopify (auquel cas A devient hors-sujet pour R-1, qui reste **UNKNOWN** sur sa vraie cause), soit il précise une autre explication, soit B est erronée pour une raison à identifier (ex. mauvais shop interrogé — jugé peu probable, `get-shop-info` confirme `Ondeal`/`shop.ondeal.fr`, mais non totalement exclu).

**R-1 (cause réelle de l'écart 8 487→1 715) reste donc classé UNKNOWN**, avec la piste BigBuy spécifiquement en statut CONTRADICTED — à ne pas confondre avec "résolu". Ne pas accepter de nouvelle explication de cet écart sans la classer de la même façon (source + statut) avant de mettre à jour ce registre.

### R-2 — Absence totale de tracking analytics en production
**Impact** : toute décision marketing/CRO/SEO actuelle repose sur des déductions structurelles (catalogue) plutôt que sur un comportement réel mesuré. Risque d'investir (budget pub, temps de développement) sur de mauvaises priorités. **Action** : configurer GA4/Search Console — **REQUIRES_HUMAN_APPROVAL** (identifiants de compte).

### R-3 — Incident de disponibilité Vercel non expliqué
**Impact** : le site a été totalement indisponible (page "déploiement suspendu") pendant une fenêtre observée, résolu depuis. Cause racine non confirmée ; un cluster de déploiements en erreur (~5h avant l'incident, autour d'un revert "Accept-Language") est une piste plausible mais non vérifiée. **Action** : surveiller une récidive ; si elle se reproduit, consulter les logs de build détaillés de ce cluster de déploiements ou contacter le support Vercel.

### R-4 — Anomalie de stock `totalInventory` (jusqu'à 3,4M unités sur certains produits)
**Impact** : si ce chiffre est affiché tel quel côté client (à vérifier), cela peut nuire à la crédibilité du site. **Probabilité que ce soit un artefact d'agrégation fournisseur plutôt qu'un vrai stock** : PROBABLE, non confirmé. **Action** : vérifier l'affichage frontend réel sur un produit concerné, plafonner l'affichage si nécessaire (ex. "stock disponible" au lieu du chiffre brut au-delà d'un seuil) — correction de code à faible risque si confirmée nécessaire.

## Risques modérés

### R-5 — Formulaire partenaires resté cassé pendant une durée inconnue avant le 01-02/09/2026
**Impact** : perte de contacts partenaires potentiels non quantifiable rétroactivement. Déjà corrigé ; aucune action supplémentaire possible sur le passé.

### R-6 — Décalage entre navigation affichée (généraliste) et catalogue réel (concentré bijoux/montres/jouets/déco)
**Impact** : expérience client dégradée sur les catégories creuses (Téléphones, Informatique, Livres), risque de taux de rebond élevé et de mauvaise image si non traité. Voir PRODUCT_STRATEGY.md.

### R-7 — Concentration de 46,5 % du catalogue actif sous un seul tag "Nouveauté"
**Impact** : dilution de la valeur de ce filtre pour le client. Risque modéré, corrigible par code (fenêtre glissante).

## Risques faibles / surveillance

### R-8 — Aucune donnée concurrentielle chiffrée disponible (Semrush inaccessible)
**Impact** : décisions de positionnement/pricing prises sans repère marché externe. Risque faible à court terme, mais s'accumule si prolongé.

### R-9 — Aucun test de non-régression complet re-exécuté cette session sur le tunnel d'achat
**Impact** : les corrections de code de cette session (`layout.tsx`, `LocationContext.tsx`, formulaires, ISR) n'ont pas été suivies d'un nouveau passage `npm run build` / `playwright test` confirmé cette session-ci — À VÉRIFIER avant de considérer les corrections comme définitivement sans régression en production.
