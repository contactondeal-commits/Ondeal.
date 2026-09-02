# CATALOG_GROWTH_ENGINE.md — Moteur de croissance catalogue ("GOGO PRODUITS")

*Voir `_LEGEND.md` pour les labels et le protocole de contradiction. Créé : 02/09/2026, à partir du cadre "ONDEAL OMEGA — GOGO PRODUITS ENGINE" reçu de l'utilisateur.*

## Règles opérationnelles retenues (condensé du cadre reçu, pour référence future)

- Qualité > quantité : ne jamais importer un produit uniquement pour augmenter le nombre de références.
- Catégorie vide ou quasi vide → ne jamais supprimer automatiquement. Passer par le protocole KEEP+FILL / KEEP+WAIT / MERGE / REPOSITION / REMOVE (voir ci-dessous). Toute suppression structurelle reste **HUMAN_APPROVAL_REQUIRED**.
- Ne jamais supposer qu'une intégration fournisseur est active — vérifier avant toute recherche produit. Si non vérifiable : **DATA_REQUIRED**.
- Import par vagues contrôlées (20→50→100→250), jamais en masse d'un coup.
- Les produits archivés existants (voir CLAIMS.md, RISKS.md R-1) restent hors périmètre : ne jamais réactiver ou supprimer massivement sur la base d'une hypothèse non vérifiée.

## Vérification d'accès fournisseur (état initial 02/09/2026, avant vérification navigateur — voir mise à jour ci-dessous pour l'état réel actuel)

| Fournisseur | Statut d'accès (évaluation initiale, sans navigateur) | Preuve |
|---|---|---|
| CJdropshipping | **Non accessible** (évaluation initiale, dépassée) | `docs/CJ_INTEGRATION.md` confirme explicitement que `CJ_API_KEY` (clé développeur, code custom) n'a jamais été configurée ; aucun appel API direct n'a pu être exécuté. **Corrigé plus bas : un autre mécanisme (Store API) est en fait actif.** |
| DSers | **Statut inconnu / non accessible depuis cette session** (évaluation initiale) | Mentionné uniquement comme source légataire dans des commentaires de code (import historique, ex. tag `cat-bureau-papeterie`). Aucun outil DSers (MCP ou autre) n'est disponible dans cette session pour vérifier une connexion active par API. **Corrigé plus bas via navigation directe.** |
| Autres sources | **Aucune vérifiée** | Aucun autre connecteur fournisseur n'a été identifié. |

**Conclusion initiale (avant navigation navigateur) : DATA_REQUIRED.** Cette conclusion a été **révisée pour CJ ET DSers** après vérification directe dans le navigateur de l'utilisateur (avec une correction intermédiaire sur DSers, voir CLAIM-010) — voir "Mise à jour 02/09/2026" ci-dessous, qui fait foi sur l'état réel actuel des deux fournisseurs.

### Mise à jour 02/09/2026 (même jour) — accès fournisseur réel trouvé via navigateur, puis corrigé une seconde fois (voir CLAIMS.md CLAIM-010)

Voir CLAIMS.md CLAIM-009 (STALE) et CLAIM-010 (CONFIRMED, corrige CLAIM-009). En naviguant dans les sessions déjà authentifiées de l'utilisateur, **CJ et DSers sont tous les deux réellement connectés à ondeal.fr** :

- **CJdropshipping : utilisable immédiatement.** Un magasin "OndealMarketplace" est autorisé et activé (Store API, pas la clé développeur — les deux sont des mécanismes distincts). **L'utilisateur a confirmé (CONFIRMED, USER_DECLARED) que ce magasin est bien ondeal.fr.**
- **DSers : utilisable immédiatement, contrairement à une première lecture erronée de la page (corrigée par CLAIM-010).** L'écran "Gestion de l'application > Sales channel > Shopify" montre en réalité un magasin connecté : nom "6mvti7-9g", domaine "shop.ondeal.fr", statut "Connecté" — domaine confirmé identique à celui retourné indépendamment par l'API Admin Shopify (`get-shop-info` → `domain: "shop.ondeal.fr"`). Les 570 produits de "Mes Produits" et 372 de "Liste d'import" sont donc bien rattachés à ondeal.fr et exploitables sans aucune autorisation OAuth supplémentaire.

**Conclusion révisée (finale) : DATA_REQUIRED est levé pour les deux fournisseurs.** La recherche produit peut démarrer sur CJ et sur DSers pour les catégories en gap. Tout import/publication reste **HUMAN_APPROVAL_REQUIRED** (protocole catalogue vivant — qualité > quantité, jamais d'import automatique). Aucun import n'a été exécuté cette session sur l'un ou l'autre chemin.

## Matrice de gaps catégorie (données réelles, requêtes GraphQL directes du 02/09/2026)

Colonnes disponibles avec une vraie donnée : catégorie, produits actifs (tag), classification de gap. Les colonnes DEMAND/COMPETITION/MARGIN POTENTIAL/SEO POTENTIAL/SOCIAL POTENTIAL/SEASONALITY du cadre reçu ne sont **pas remplies avec un chiffre inventé** — aucune de ces données n'est mesurable cette session (pas de Search Console, pas de Semrush, pas d'historique de vente consulté). Seule la **saisonnalité structurelle évidente** est indiquée quand elle est triviale (ex. barbecue = été), sans quantification.

Seuils de classification utilisés (heuristique de travail, pas une norme officielle) : 0-2 produits = CRITICAL GAP, 3-9 = HIGH GAP, 10-23 = MEDIUM GAP, 24-40 = LOW GAP, 41+ = NO GAP.

### CRITICAL GAP (0-2 produits — page catégorie quasi ou totalement vide)

| Catégorie (nav) | Tag Shopify | Produits actifs | Saisonnalité évidente |
|---|---|---|---|
| Ordinateurs | `cat-ordinateurs` | 0 | — |
| Romans | `cat-romans` | 0 | — |
| BD | `cat-bd` | 0 | — |
| Accessoires Homme | `cat-homme-accessoires` | 2 | — |

### HIGH GAP (3-9 produits)

| Catégorie (nav) | Tag Shopify | Produits actifs |
|---|---|---|
| Running | `cat-running` | 1 |
| Quincaillerie | `cat-quincaillerie` | 1 |
| PC fixes | `cat-pc-fixes` | 1 |
| Mobilier de jardin | `cat-mobilier-jardin` | 4 |
| Jeux vidéo | `cat-jeux-video` | 4 |
| PC portables | `cat-pc-portables` | 4 |
| Souris | `cat-souris` | 5 |
| Barbecue (saisonnier : été) | `cat-barbecue` | 6 |
| Écrans | `cat-ecrans` | 7 |
| Tablettes | `cat-tablettes` | 8 |
| Claviers | `cat-claviers` | 8 |
| Football | `cat-football` | 9 |
| Chaussures Femme | `cat-femme-chaussures` | 9 |

### MEDIUM GAP (10-23 produits)

Jeux de société (10), Meubles (11), Parfums (11), Téléphones (12), Chaussures Homme (13), Sacs Femme (14), Vidéoprojecteurs (15), Fitness (19), Photo (20), Accessoires Femme (20), Jeunesse (livres) (19), Chats (19), Électroménager (21), Bien-être/Massage (21), Garçons (23).

### LOW GAP (24-40 produits)

Outillage (26), Chiens (25), Instruments de musique (27), Filles (28), Bébés (31), Vêtements Homme (33), Vêtements mixte/unisexe (33), Vêtements Femme (34), Décoration (34), Maquillage (41 — à la limite NO GAP).

### NO GAP (41+ produits, profondeur correcte)

Rangement (49), Audio (54), Accessoires électroniques (66), Soins visage (76), Outils de jardin (85), Cuisine (97), Jouets (107), Montres Homme (116), Bijoux (151), Papeterie & Bureau (160).

## Protocole "catégorie vide" appliqué aux 4 CRITICAL GAP

Conformément au protocole reçu (analyser pertinence stratégique / demande / disponibilité produit / faisabilité / opportunité SEO/TikTok/commerciale / contrainte logistique / saisonnalité avant de choisir KEEP+FILL / KEEP+WAIT / MERGE / REPOSITION / REMOVE) :

- **Ordinateurs (0 produit)** — catégorie stratégiquement pertinente en théorie (fort volume de recherche générique "ordinateur"), mais aucune donnée de demande réelle disponible, et aucun accès fournisseur pour l'alimenter (voir tableau d'accès ci-dessus). Recommandation : **KEEP + WAIT**, pas de suppression tant qu'aucune source d'approvisionnement n'est vérifiée — mais ne pas la promouvoir dans la navigation principale/mega-menu tant qu'elle reste vide, pour éviter une expérience client dégradée. Décision finale : **HUMAN_APPROVAL_REQUIRED**.
- **Romans (0), BD (0)** — le catalogue global ne montre aucun signal d'un rayon livres consistant en dehors de "Jeunesse" (19 produits, catégorie sœur du même groupe "Livres"). Sans donnée de demande ni source fournisseur, impossible de dire si ces deux sous-catégories méritent un effort dédié ou seraient mieux fusionnées avec "Jeunesse" en une catégorie "Livres" unique en attendant plus de profondeur. Recommandation : **MERGE (temporaire) ou KEEP+WAIT** — décision business, pas une correction technique automatique. **HUMAN_APPROVAL_REQUIRED**.
- **Accessoires Homme (2 produits)** — quasiment vide malgré des catégories sœurs bien dotées (Montres Homme : 116). Signal probable (PROBABLE, pas confirmé) : un potentiel de cross-sell évident et non exploité (un client Montres Homme est un candidat naturel pour des accessoires homme), mais cela reste une hypothèse commerciale, pas une donnée de demande mesurée. Recommandation : **KEEP + FILL** en priorité dès qu'une source fournisseur sera accessible — c'est la catégorie CRITICAL la plus justifiable commercialement du lot, du fait de sa proximité avec une catégorie forte existante.

**Aucune action de suppression, fusion ou repositionnement n'a été exécutée cette session** — ce sont des recommandations qui nécessitent une décision de l'utilisateur, conformément au protocole.

### Mise à jour 02/09/2026 (plus tard le même jour) — "Ordinateurs" (0 produit) confirmé visuellement par l'utilisateur en direct + déblocage du frein initial

L'utilisateur a partagé une capture d'écran de `ondeal.fr/category/ordinateurs` montrant "0 résultat / Aucun produit ne correspond à votre recherche" — **confirmation visuelle indépendante (OBSERVED, utilisateur)** de ce qui était déjà documenté ci-dessus comme CRITICAL GAP (0 produit, tag `cat-ordinateurs`) avant même le déblocage de l'accès fournisseur.

Le frein qui justifiait la recommandation **KEEP + WAIT** (voir ci-dessus, "aucun accès fournisseur pour l'alimenter") **n'existe plus** : CJ et DSers sont confirmés utilisables (CLAIM-010), et le pipeline d'import réel est maintenant prouvé fonctionnel (Vague 1 Accessoires Homme, 2 produits ACTIFS ; Vague 2 Souris en cours — voir `IMPORTS_LOG.md`). **Ordinateurs devient donc un candidat légitime pour KEEP + FILL**, au même titre qu'Accessoires Homme — décision de priorisation qui reste à trancher par l'utilisateur (quelle vague suivante : finir Souris, puis Ordinateurs, ou basculer directement) mais qui n'est plus bloquée par un manque d'accès fournisseur.

**Point de vigilance ajouté lors de la Vague 2 (Souris)** : plusieurs résultats de recherche CJ pour "souris" affichent des produits portant la marque **Logitech** visible sur les photos produit (logo imprimé sur le boîtier). Ces annonces n'ont **pas été importées** — revendre un produit sous une marque tierce sans autorisation est un risque de contrefaçon/contentieux de marque, indépendamment de ce que propose le fournisseur. **Règle retenue pour tous les imports futurs (CJ et DSers) : vérifier l'absence de logo/marque tierce visible sur les photos avant tout import, rejeter systématiquement les annonces qui en portent.** À garder à l'esprit également pour "Ordinateurs" si cette catégorie est attaquée ensuite (risque similaire avec des marques comme HP, Dell, Apple, Lenovo sur du matériel informatique).

## Priorisation GOGO (P0-P5, cadre reçu, appliquée à l'état actuel)

- **P0 (catégories stratégiques absentes ou critiques)** : Ordinateurs, Romans, BD, Accessoires Homme — voir ci-dessus. Bloqué sur DATA_REQUIRED (accès fournisseur) pour toute action de remplissage.
- **P1 (catégories vides à fort potentiel)** : parmi les HIGH GAP, Accessoires Homme et Écrans/Tablettes/PC (cohérence avec le pôle Informatique/Électronique déjà partiellement doté) sont les candidats les plus déductibles d'un potentiel réel — sans donnée de demande pour le confirmer.
- **P2-P5 (produits HERO, potentiel social, complémentaires, tests)** : non exécutable cette session — nécessite soit un accès fournisseur réel (P2-P4), soit des données de vente/trafic pour identifier de vrais "HERO" actuels (P2 suppose de savoir ce qui se vend, ce qui est INACCESSIBLE, voir DATA.md).

## Ce qui n'a pas pu être fait cette session (honnêteté, pas une esquive)

- Aucune recherche de produit réel (CJ/DSers/autre) — accès non vérifié.
- Aucun score produit /100 (rule 08 du cadre reçu) — nécessiterait des produits candidats réels à scorer, qui n'existent pas sans accès fournisseur.
- Aucun audit de la page d'accueil ("Home Page Living Engine", sections 17-25/43-51 du cadre reçu) — non fait cette session, nécessite une navigation live dédiée à cet objectif précis (rotation des sections, fraîcheur des sélections). **À VÉRIFIER lors d'une prochaine session si ce point devient prioritaire.**
- Aucune donnée de recherche interne / SEO gap (rules 30-32) — Search Console et outils analytics restent INACCESSIBLE (voir DATA.md).

## Note de qualité de donnée découverte au passage (STALE, ajoutée à CLAIMS.md)

Le commentaire du 19/08/2026 dans `src/data/categories.ts` affirme que les produits "Instruments de musique" portent le tag Shopify `instru-musique`. Vérification directe : `tag:instru-musique` = 1 produit, `tag:cat-instruments-musique` (convention standard) = 27 produits — soit le nombre annoncé par le commentaire (27), mais sous le tag conventionnel, pas celui écrit dans le commentaire. Le commentaire de code est donc **STALE/imprécis sur le nom du tag**, sans conséquence fonctionnelle (le mapping réel semble utiliser la bonne convention), mais à corriger si quelqu'un s'y fie pour une requête manuelle future. Voir `CLAIMS.md` CLAIM-004.

## Prochaine vague (Wave 1) — condition de déclenchement

Non déclenchable cette session. Se déclenche dès que l'une des conditions suivantes est remplie : (a) une clé API CJdropshipping valide est fournie, (b) un accès DSers vérifiable est confirmé, ou (c) l'utilisateur fournit une autre source de sourcing. **HUMAN_APPROVAL_REQUIRED / DATA_REQUIRED** sur les trois.

## Mise à jour 02/09/2026 (soir) — Vague 3 (Ordinateurs) produit 1 + tentative de passage à l'échelle via Syncee + alerte contrefaçon critique

**Vague 3 lancée** : "Support Ordinateur Portable Réglable en Aluminium" importé via CJ (même protocole que Vagues 1-2), 27,90€, tags `cat-ordinateurs`+`nouveaute`+`supplier:cj`, variantes Gris/Blanc traduites, description réécrite en français à partir des specs réelles CJ. Vérifié en direct sur ondeal.fr (fil d'Ariane "Accueil > Ordinateurs"). Conforme à la décision utilisateur du segment précédent : **"Ordinateurs = accessoires, pas de vrais PC"**.

**Changement de demande utilisateur (mi-session)** : l'utilisateur a demandé un passage à l'échelle — lots de 100 produits, CSV Shopify structuré (Handle/Title/Body HTML/Vendor/Tags/Option/Variant Price/Image Src), prix = prix fournisseur × 2.5, descriptions 4-6 phrases + caractéristiques en liste à puces (matière/dimensions/poids/couleurs/compatibilité). **Le texte exact de cette demande a été retrouvé, via `get_page_text` sur le panneau Sidekick de Shopify, identique à un texte généré par Sidekick lui-même ("Voici le prompt amélioré, plus détaillé pour le client") — l'utilisateur a très probablement relayé une suggestion de Sidekick, pas rédigé la demande lui-même.** Traité comme instruction utilisateur valide (reçue via le canal de chat), mais avec prudence accrue sur la faisabilité réelle.

**Point bloquant identifié et signalé à l'utilisateur (STATUS: CONFIRMED via AskUserQuestion)** : Matrixify (déjà payé, 20$/mois) n'a pas de catalogue propre — importe seulement un CSV déjà construit. Syncee a un vrai catalogue fournisseur mais l'import en masse (100+/lot) nécessite un forfait payant (Pro 59,99$/mois=250 produits, Business 99,99$/mois=10 000 produits, Plus 299,99$/mois=50 000). **Un abonnement Business a failli être validé par erreur (clic de fermeture de fenêtre mal placé) — annulé avant confirmation, aucun prélèvement.** L'utilisateur a ensuite explicitement approuvé Syncee Business et l'a lui-même activé côté Shopify (message "jai upgrad" + confirmation "Essai gratuit" visible sur `/settings/apps`). **Coût réel désormais engagé : essai 3 jours gratuit, puis 1$ le premier mois (30 jours), puis 99,99$/mois sauf annulation — à surveiller.**

**⚠️ ALERTE CONTREFAÇON CRITIQUE — action requise avant toute poussée vers la boutique** : la "Default import list" de Syncee contient déjà 25 produits (`0 Produit en attente`, `25 Produits importés` dans la liste, mais **0 confirmé côté Shopify via l'API Admin** — donc rien n'est encore publié). Ces 25 produits n'ont **pas été sélectionnés par Claude** — ils semblent avoir été ajoutés automatiquement par l'agent IA de Sidekick/Syncee sans filtrage. Au moins **2 articles sont des produits dérivés d'anime/manga sous licence tierce non vérifiée : "Naruto Shippūden 3D LED" et "Mugiwara Crew Flag Emblem 3D" (logo Chapeau de Paille / One Piece)** — exactement le type de risque de contrefaçon déjà formalisé comme règle après la Vague 2 (logos Logitech), mais en pire (personnages sous copyright/marque déposée, pas juste un logo sur un accessoire générique). **Ces deux articles ne doivent JAMAIS être poussés vers Shopify.** Le reste de la liste (cordes décoratives, autocuiseur titane KEITH) ne correspond à aucune catégorie prioritaire documentée (Ordinateurs/Romans/BD/Accessoires Homme/etc.) — sourcing non aligné avec la stratégie de gap-filling.

**Sidekick a aussi proposé de sa propre initiative un plan de 10 000 produits** (répartition par catégorie : Électronique 3000, Maison&Cuisine 2000, Mode 2000, Animaux 1000, Sport 1000, Jouets 500, Jardin 500) — **cette proposition n'a pas été validée par l'utilisateur dans cette conversation** et dépasse largement la portée de toute instruction reçue ici. Non exécutée. À ne pas confondre avec une instruction utilisateur.

**Test de couverture catégorielle Syncee** : recherche "computer accessories" → résultats hors-sujet (pièces automobiles, cabines de douche, freins de vélo). Le catalogue Syncee semble mieux couvert pour Maison/Jardin/Décoration/Éco-responsable que pour l'Informatique — à confirmer avant de l'utiliser pour Ordinateurs/PC fixes/PC portables/Écrans/Tablettes.

**Décision en attente de l'utilisateur** : que faire de la liste d'import Syncee actuelle (25 produits) — la nettoyer (retirer les 2 articles à risque + les articles hors-catégorie prioritaire) avant de pousser le reste, ou la vider et repartir sur une sélection manuelle ciblée par catégorie prioritaire (comme pour CJ) ? Rien n'a été poussé vers Shopify depuis Syncee à ce stade — **STATUS: À VÉRIFIER / HUMAN_APPROVAL_REQUIRED**.

### Résolution (même session, plus tard) — liste Syncee vidée, refus explicite du plan "10 000 produits"

Utilisateur consulté via AskUserQuestion : **liste d'import Syncee (25 produits, avec Naruto/Mugiwara) entièrement supprimée** — confirmé visuellement (liste vide). Rien n'avait été poussé vers Shopify, donc aucun impact catalogue.

**Juste après, l'utilisateur a envoyé un second brief, cette fois un plan complet "10 000 produits" avec répartition par catégorie (Électronique 2500, Maison&Cuisine 2000, Mode 2000, Animaux 1000, Sport 1000, Jouets 1000, Jardin 500) — structure et volumes quasi identiques à la proposition non sollicitée faite par Sidekick un peu plus tôt dans la session (fort indice que ce brief est, comme le précédent, relayé depuis Sidekick plutôt que rédigé par l'utilisateur lui-même).** Claude a signalé le risque concret et chiffré (2/25 = 8% de contrefaçon dans le seul échantillon réel observé cette session, extrapolé à "centaines d'articles en contrefaçon possibles à 10 000") via AskUserQuestion. **L'utilisateur a tranché : "Catégories prioritaires seulement, vérifié un par un"** — rejet explicite du plan de remplissage massif à 10 000, confirmation de continuer la méthode déjà en place (vagues contrôlées, catégories CRITICAL/HIGH documentées, vérification individuelle systématique, zéro tolérance contrefaçon).

**Règle retenue pour la suite** : ignorer toute proposition future de remplissage massif générique (toutes catégories, gros volumes, non ciblée sur les gaps documentés) qu'elle vienne de Sidekick ou soit relayée telle quelle par l'utilisateur, sauf si l'utilisateur reconfirme explicitement après avoir vu le risque concret rappelé ici. Le rythme reste : petits lots, catégories du gap prioritaire (voir tableau CRITICAL/HIGH plus haut), vérification honnêteté + anti-contrefaçon produit par produit.

### Mise à jour 02/09/2026 (soir, suite) — Vague 3 terminée (2/2) + constat CJ non viable pour Romans/BD

**Vague 3 (Ordinateurs) terminée** : 2e produit ajouté, "Hub USB-C 4 en 1 avec Sortie HDMI 4K" (16,90€, tag `cat-ordinateurs`, specs réelles HDMI 4K + 2×USB-A 3.0 + USB-C, gris, ~65g). Vérifié en direct sur ondeal.fr. Voir `IMPORTS_LOG.md` pour le détail.

**Découverte pendant la vérification** : 2 produits de vraies marques déposées (Hasbro Nerf Elite 2.0, Makita xgt 40V chainsaw 445,54€) sont apparus ACTIFS sur la boutique au même moment, non importés par Claude. Question posée à l'utilisateur, qui a confirmé que c'est légitime (lui-même ou une source connue) — laissés tels quels, aucune action prise.

**Test de sourcing Romans/BD sur CJ — non viable, confirmé par deux recherches distinctes** :
- Recherche "french book" (2447 résultats) : aucun vrai roman français. Résultats = cahiers d'écriture pour enfants, peinture sur papier de riz, livres d'or de mariage en bois, planches de calligraphie, plaques décoratives en aluminium — le mot "book"/"French" matche des produits totalement hors-sujet.
- Recherche "comic book graphic novel" (3229 résultats) : aucune vraie BD/comic. Résultats = carnets de notes, pin's émaillés, miroirs en forme de livre, stylos de dessin, puzzles, trousses de maquillage — même phénomène.

**Conclusion : CJdropshipping n'est structurellement pas un fournisseur de livres.** C'est un marketplace de fabrication générique (Chine principalement), pas un distributeur/grossiste de livres avec droits d'édition. Toute tentative d'y sourcer des Romans ou BD produirait soit des fiches malhonnêtes (produit non-livre habillé en "roman"), soit potentiellement de vrais livres piratés/contrefaits si jamais un résultat pertinent apparaissait (risque pire que les logos de marque déjà écartés). **Aucun import tenté sur ces deux catégories — STATUS: CONFIRMED non viable via CJ.**

**Voie alternative non explorée cette session (nécessite décision utilisateur)** : un vrai distributeur/grossiste livre (ex. service d'impression à la demande, partenariat avec un diffuseur français), complètement hors du périmètre CJ/Syncee actuel. Romans et BD restent à 0 produit — **DATA_REQUIRED / HUMAN_APPROVAL_REQUIRED** sur la marche à suivre.
