# ONDEAL_BRAIN — Légende (Règle Zéro)

Ce dossier est la mémoire stratégique persistante d'OnDeal. Chaque affirmation factuelle porte un label. Ne jamais lire un chiffre sans son label.

- **CONFIRMÉ** — vérifié directement cette session ou une session antérieure documentée, via une source primaire (Shopify Admin GraphQL réel, code source lu, capture live du site, dashboard Vercel authentifié).
- **PROBABLE** — déduction raisonnable à partir de données confirmées, non vérifiée directement (ex. extrapolation, corrélation).
- **HYPOTHÈSE** — supposition de travail non testée, à valider par une expérience ou une donnée future.
- **À VÉRIFIER** — question ouverte, nécessite une action humaine ou un accès non disponible cette session pour être tranchée.
- **INACCESSIBLE** — donnée demandée mais impossible à obtenir cette session (ex. Semrush : quota API insuffisant ; Google Analytics/Search Console : aucun accès configuré ; historique Vercel : logs détaillés non consultés).

**Interdits absolus (toutes sessions)** : ne jamais inventer un chiffre d'affaires, un avis client, un niveau de stock, un prix concurrent, un taux de conversion, une donnée d'audience. Si la donnée n'existe pas, écrire "À VÉRIFIER" ou "INACCESSIBLE" — jamais une estimation présentée comme un fait.

## Protocole de résolution de contradiction (ajouté 02/09/2026)

Quand deux données se contredisent (DONNÉE A vs DONNÉE B), ne jamais choisir arbitrairement laquelle croire. Procédure obligatoire :

1. Identifier la source de chaque donnée.
2. Classer chaque donnée avec l'un des statuts suivants (distinct des labels d'incertitude ci-dessus, complémentaire) :
   - **CONFIRMED** — vérifié directement par une source primaire indépendante des deux données en conflit.
   - **USER_DECLARED** — affirmé par l'utilisateur (dans une instruction, un message), non vérifié indépendamment.
   - **OBSERVED** — mesuré directement cette session via un outil/API/code (ex. requête GraphQL réelle).
   - **INFERRED** — déduit logiquement d'autres données, non mesuré directement.
   - **CONTRADICTED** — statut d'une affirmation qui entre en conflit direct avec une autre donnée de statut égal ou supérieur, non encore réconcilié.
   - **UNKNOWN** — aucune donnée disponible dans un sens ou dans l'autre.
   - **STALE** — donnée qui était vraie à une date passée mais dont la validité actuelle n'est pas garantie (l'état du projet a pu changer depuis).
3. Ne jamais faire disparaître la contradiction en silence : si A et B se contredisent, les DEUX restent enregistrées avec leur statut, et le résultat net est marqué **CONTRADICTED** jusqu'à réconciliation explicite (nouvelle donnée OBSERVED/CONFIRMED qui tranche, ou confirmation de l'utilisateur qui requalifie une donnée en USER_DECLARED assumé).
4. Une donnée OBSERVED/CONFIRMED ne remplace pas automatiquement une donnée USER_DECLARED contradictoire — elle la met en état CONTRADICTED et appelle une clarification, sauf si l'utilisateur confirme explicitement laquelle prévaut.

## Format d'enregistrement d'une affirmation (ajouté 02/09/2026)

Aucune information ne doit être mémorisée seule. Chaque affirmation significative — pas seulement les contradictions — doit être enregistrée dans `CLAIMS.md` avec sa provenance, sa confiance, sa date et son dernier contrôle, sous ce format fixe :

```
CLAIM:
[l'affirmation exacte, aussi précise que possible]

SOURCE:
[Utilisateur | Rapport <nom/date> | Code source <fichier> | API <nom> | Navigation live | Déduction]

DATE:
[date à laquelle l'affirmation a été faite/observée]

STATUS:
[CONFIRMED | USER_DECLARED | OBSERVED | INFERRED | CONTRADICTED | UNKNOWN | STALE]

VERIFIED:
[YES | NO]

LAST_VERIFIED:
[date de la dernière vérification, ou "jamais" si VERIFIED: NO]

CONTRADICTORY_DATA:
[YES | NO — et si YES, référence à l'entrée contradictoire]

OBSERVED_DATA:
[ce qui a été mesuré directement, si applicable — préciser la source technique, ex. "Shopify: status:archived=1"]

ACTION:
[ce que cette incertitude interdit ou impose de faire en attendant, ex. "DO NOT MODIFY CATALOG"]

NEXT:
[l'action concrète qui permettrait de lever l'incertitude]
```

Chaque nouvelle session doit lire `CLAIMS.md` avant d'agir sur un sujet qui y est déjà enregistré, et ajouter une nouvelle entrée (jamais réécrire une entrée existante) si une affirmation significative apparaît.

**Dernière mise à jour** : 02/09/2026 — session "ONDEAL OMEGA".
**Sources primaires de cette mise à jour** : Shopify Admin GraphQL (MCP, accès réel), lecture directe du code source (`/mnt/user-data/uploads/ondeal-work`), rapports antérieurs dans `reports/` et `ONDEAL_AUTONOMOUS/`, navigation live sur ondeal.fr et vercel.com via navigateur authentifié.
