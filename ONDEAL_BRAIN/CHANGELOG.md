# CHANGELOG.md — Journal des changements (cumulatif)

*Voir `_LEGEND.md`. Ajouter en tête à chaque session, ne jamais réécrire l'historique. Format : DATE / CHANGE / WHY / EXPECTED IMPACT / RISK / TEST / RESULT / NEXT STEP.*

## 02/09/2026 — Session "GOGO PRODUITS ENGINE" (analyse de gaps, aucun import)

- **CHANGE** : construction de `ONDEAL_BRAIN/CATALOG_GROWTH_ENGINE.md` — vérification d'accès fournisseur (CJ : clé API jamais configurée, confirmé ; DSers : aucun outil disponible pour vérifier), matrice de gaps sur les 45 catégories feuilles réelles (comptage direct Shopify), protocole "catégorie vide" appliqué aux 4 CRITICAL GAP (Ordinateurs, Romans, BD, Accessoires Homme).
- **WHY** : cadre reçu de l'utilisateur ("GOGO PRODUITS ENGINE") demandant une analyse de gaps catégorie avant tout import.
- **RISK** : aucun — lecture seule, aucune mutation catalogue, aucun import exécuté (bloqué sur DATA_REQUIRED, aucun accès fournisseur vérifié).
- **RESULT** : matrice complète livrée ; mode import complet ("GOGO" au sens strict) non déclenchable cette session faute d'accès fournisseur réel.
- **NEXT STEP** : fournir une clé CJdropshipping valide, un accès DSers vérifiable, ou une autre source de sourcing pour débloquer la Vague 1.
- Découverte annexe : commentaire de code obsolète sur le tag "instru-musique" (voir CLAIMS.md CLAIM-004), sans conséquence fonctionnelle.

## 02/09/2026 — Session "ONDEAL OMEGA EVOLUTION" (delta)

- **CHANGE** : vérification de la prémisse "8 000 produits BigBuy archivés volontairement" reçue en instruction.
- **WHY** : la règle de la mission elle-même interdit de résoudre silencieusement une contradiction entre une affirmation reçue et les données réelles.
- **EXPECTED IMPACT** : soit confirmer et clore R-1 (RISKS.md), soit le maintenir ouvert avec une explication écartée.
- **RISK** : aucun (lecture seule, requêtes GraphQL `productsCount`).
- **TEST** : 6 requêtes `productsCount` (statut archivé, vendor BigBuy, 4 variantes de tag) + recherche du terme "BigBuy" dans le code source.
- **RESULT** : hypothèse **infirmée**. `status:archived` = 1 (pas ~8 000), aucune correspondance vendor/tag BigBuy. "BigBuy" existe dans le code comme fournisseur historique légitime (~210 produits actifs sur le tag `cat-bureau-papeterie`), pas comme lot de produits archivés.
- **NEXT STEP** : demander à l'utilisateur la source exacte de "8 000 produits BigBuy archivés" (système externe ? autre boutique ?) avant de considérer R-1 comme expliqué.
- **CHANGE** : ajout de `ARCHITECTURE.md` et de ce `CHANGELOG.md` à `ONDEAL_BRAIN/`, conformément à la structure demandée dans cette session.
- **RISK** : aucun (fichiers de mémoire uniquement, aucun code applicatif touché).

## 01-02/09/2026 — Session "ONDEAL OMEGA" (résumé, détail complet dans `reports/ONDEAL-OMEGA-STATE.md`)

- **CHANGE** : construction complète d'`ONDEAL_BRAIN/` (18 fichiers), collecte de données catalogue réelles via Shopify Admin GraphQL, analyse Red Team/Blue Team, score OMEGA par axe, roadmap 7/30/90/365.
- **RESULT** : écart catalogue 8 487→1 715 découvert et documenté comme non résolu (R-1) ; absence totale de tracking analytics confirmée comme lacune n°1.
- **NEXT STEP** : obtenir réponses de l'utilisateur sur les 7 décisions listées dans `reports/ONDEAL-OMEGA-STATE.md` §6.

## 01-02/09/2026 — Session "ONDEAL — MODE AUTONOME" (corrections de code, résumé)

- **CHANGE** : `layout.tsx` (métadonnées SEO globales + JSON-LD Organization), `LocationContext.tsx` (bug symbole devise "EUR"→"€"), `next.config.ts` (`poweredByHeader: false`), `api/ask-question/route.ts` + `QuestionForm.tsx` (échappement HTML + honeypot), `api/partenaires/route.ts` (endpoint POST manquant recréé — formulaire partenaires était cassé à 100 %), `partenaires/page.tsx` (honeypot + typage), `feed/google-shopping.xml/route.ts` (champs GMC enrichis), `product/[slug]/page.tsx` + `category/[slug]/page.tsx` (`revalidate = 3600` ajouté, absent auparavant).
- **RISK** : faible, tous réversibles par revert git, aucune donnée sensible touchée.
- **TEST** : non re-confirmé par un nouveau `npm run build`/`playwright test` dans cette session précise — voir RISKS.md R-9.
- **RESULT** : corrections commitées et livrées à l'utilisateur.

## Sessions antérieures (résumé, voir rapports source pour le détail)

- **15/08/2026** : décision login client natif Shopify, activation flow email abandon panier, liens sociaux réels, feed Google Shopping actif.
- **14/08/2026** : corrections navigation/catégorisation Shopify (constat Dawn vs Next.js), audit prix (0 fausse promotion sur 970 produits).
- **13/08/2026** : import réel de 118 produits CJdropshipping (marge moyenne 150 % sur l'échantillon), catalogue déclaré 8 369→8 487 (chiffre aujourd'hui en contradiction non résolue avec l'état réel du 02/09, voir R-1).
- **12/08/2026** : correction de la convention de catégorisation (tag `cat-*` au lieu d'un metafield jamais utilisé).
