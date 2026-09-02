# DATA.md — Infrastructure de données & mesure

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026.*

## Sources de données confirmées disponibles cette session

- **Shopify Admin GraphQL (MCP)** — accès réel en lecture (et écriture via `graphql_mutation`, non utilisée cette session sauf via les corrections de code déployées). Portée plus large que le token `.env` du projet (Storefront-only). Utilisé pour tous les chiffres de BUSINESS.md.
- **Code source du dépôt** (`/mnt/user-data/uploads/ondeal-work`, miroir en lecture seule du dossier connecté sur l'ordinateur de l'utilisateur).
- **Rapports historiques** (`reports/`, `ONDEAL_AUTONOMOUS/`) — traités comme un état de fait antérieur à ne pas refaire, conformément à la consigne explicite de l'utilisateur.
- **Navigateur authentifié** (Chrome, sessions déjà connectées sur `admin.shopify.com` et `vercel.com`) — utilisé pour vérifier le dashboard Vercel en lecture seule.

## Mise à jour 02/09/2026 — Klaviyo : source réelle, partiellement active

Un compte Klaviyo réel est connecté (compte `UdgN7u`, contact@ondeal.fr, intégration Shopify active depuis le 06/08/2026) — accessible via les outils `mcp__Klaviyo__*`. **Ce n'est PAS une source de trafic** (voir plus bas), mais c'est une vraie source de données transactionnelles :
- `Placed Order` = 1 événement en août 2026, cohérent avec `ordersCount` Shopify (validation croisée réussie, deux sources indépendantes).
- `Checkout Started` = 27 événements / 5 profils uniques en août 2026 — donnée réelle et nouvelle, voir RISKS.md R-0 et CLAIMS.md CLAIM-008.
- `Active on Site` et `Viewed Product` = **0 événement** sur toute la période mesurée — le tracking onsite (comportement avant checkout) n'est pas actif, malgré l'intégration existante. Ceci confirme et précise le point ci-dessous sur l'absence de tracking de trafic, plutôt que de le contredire.
- Un flow "Abandoned Checkout Reminder (Email & SMS)" est **actif** (live depuis le 19/08/2026) — c'est le seul flow existant, aucun flow de bienvenue ou post-achat.

## Sources demandées mais INACCESSIBLES cette session

- **Semrush** : quota d'unités API insuffisant.
- **Google Analytics 4 / Search Console** : aucun identifiant configuré (`NEXT_PUBLIC_GA4_MEASUREMENT_ID` absent) ni accès fourni — trafic, comportement, requêtes de recherche totalement invisibles actuellement. Le tracking onsite Klaviyo (ci-dessus) est dans le même état : connecté mais inactif pour cette catégorie de données précise.
- **Logs Vercel détaillés** (au-delà du statut "Ready"/"Error" visible dans le dashboard) — non consultés en détail.
- **Historique de suppression/modification produits Shopify** (journal d'audit) — non consulté, pertinent pour l'anomalie catalogue (voir BUSINESS.md, RISKS.md).

## Point de vigilance : quel code sert réellement `ondeal.fr` aujourd'hui ?

Un rapport du 14/08/2026 (`phase6-master-audit.md`) affirmait que `ondeal.fr` servait alors le thème Shopify **Dawn**, pas l'application Next.js de ce dépôt. Signal contraire observé cette session (**PROBABLE, pas formellement confirmé**) : après déploiement des corrections de cette session (dont le correctif du symbole `€` dans `LocationContext.tsx`, fichier Next.js), une nouvelle navigation live sur `ondeal.fr` a montré des prix avec le symbole `€` correctement affiché — ce qui suggère que le déploiement Next.js est bien servi en production actuellement. Ce n'est cependant pas confirmé par un marqueur DOM sans ambiguïté (ex. absence de la barre d'admin Shopify "Edit theme"). **À VÉRIFIER formellement avant tout nouvel audit visuel/UX approfondi** — un simple test consiste à naviguer sur une URL de collection Shopify native (`ondeal.fr/collections/...`) et regarder si la barre d'édition de thème Shopify apparaît.

## Recommandation

Traiter l'absence de tracking analytics (GA4/Search Console) comme le trou noir de données le plus prioritaire à combler — sans cela, CUSTOMER.md, MARKETING.md, CRO.md et SEO.md resteront structurellement basés sur des déductions plutôt que des faits mesurés. **REQUIRES_HUMAN_APPROVAL** (nécessite un identifiant/compte que seul l'utilisateur peut fournir).
