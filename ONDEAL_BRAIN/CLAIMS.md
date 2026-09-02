# CLAIMS.md — Registre des affirmations (provenance + confiance)

*Voir `_LEGEND.md` pour le format et le protocole de contradiction. Ajouter en tête à chaque session, ne jamais réécrire une entrée existante — si une affirmation est mise à jour, ajouter une nouvelle entrée qui référence l'ancienne.*

---

## CLAIM-020 — Vague 7 (PC fixes) : 2 produits importés via CJ, vérifiés sans logo/marque tierce, publiés ACTIVE

```
CLAIM:
"2 produits PC fixes importés via CJdropshipping vers le magasin Shopify 6mvti7-9g, suite à l'instruction utilisateur 'Juste me signaler, je déciderai plus tard' (CLAIM-018) autorisant la poursuite de Vague 6/7 sans attendre : (1) 'Kit de Nettoyage Multifonction 11 en 1 pour PC et Clavier' (SKU CJYD231771001AZ à 004DW, 4 coloris Bleu/Orange/Violet/Blanc, 9,90€, gid://shopify/Product/16304275358031) — un premier candidat ('Headphone Cleaning Pen', 8419 listings) écarté car la quasi-totalité des images étaient des vignettes vidéo marketing avec texte anglais en surimpression, pas de photos produit fiables ; remplacé par ce kit (882 listings) où seules les 4 images marketing avec texte ont été désélectionnées à l'import, les vraies photos produit conservées ; (2) 'Boîte de Rangement pour Câbles et Multiprise Anti-Poussière' (SKU CJJT129362901AZ à 903CX, 3 coloris Bleu/Rose/Blanc, 22,90€, gid://shopify/Product/16304305111375) — prix calibré sur des frais d'expédition élevés ($10,45-13,44) relativement au coût produit ($2,47, poids 714g), 2 coloris vérifiés par zoom sans logo tiers (uniquement cotes de dimension). Les deux produits sont ACTIVE, tag cat-pc-fixes (corrigé après import — le premier avait été enregistré par erreur sous cat-claviers/cat-jouets), descriptions réécrites en français avec accents via l'API, couleurs de variantes traduites."

SOURCE:
Navigation CJdropshipping (recherche 'earbuds cleaning kit' puis 'desk cable organizer' triées par Listes décroissant), zoom manuel sur les coloris avant import, puis mcp__Shopify__graphql_mutation (productUpdate pour les tags) et mcp__Shopify__update-product (titre, description, variantes) pour la correction post-import.

DATE: 02/09/2026
STATUS: CONFIRMED
VERIFIED: true (vérifié en direct sur ondeal.fr/product/kit-de-nettoyage-multifonction-11-en-1-pour-pc-et-clavier et ondeal.fr/product/boite-de-rangement-pour-cables-et-multiprise-anti-poussiere — titres, prix, fil d'Ariane "PC fixes" et couleurs corrects pour les 2 produits)
LAST_VERIFIED: 02/09/2026
CONTRADICTORY_DATA: aucune.
OBSERVED_DATA: réponses graphql_query (productUpdate, update-product) et captures d'écran ondeal.fr confirmant titre/prix/breadcrumb/couleurs pour les 2 produits.
ACTION: Import + publication ACTIVE + correction tags/description/variantes, tel que pour toutes les vagues précédentes.
NEXT: Vague 7 (PC fixes) terminée. Toutes les catégories CRITICAL/HIGH du gap initial sont désormais comblées (par ce travail ou par le processus parallèle) — un nouveau relevé complet par tag Shopify serait nécessaire avant toute Vague 8, pour identifier une cible réelle sans travail redondant.
```

---

## CLAIM-019 — Vague 6 (Quincaillerie) : 2 produits importés via CJ, vérifiés sans logo/marque tierce, publiés ACTIVE

```
CLAIM:
"2 produits Quincaillerie importés via CJdropshipping vers le magasin Shopify 6mvti7-9g : (1) 'Coffret d'Outils 43 Pieces pour Maison et Voiture' (SKU CJQT115178501AZ, variante unique Orange, 69,90€, gid://shopify/Product/16304239018319) — coffret complet acier carbone (mètre ruban, clés Allen, cutter, tournevis, testeur de tension, marteau, douilles, pince, lampe torche), mallette rigide 35,8×26,8×7cm ; prix plus élevé que la moyenne du catalogue, calibré sur le poids/volume réel qui augmente fortement les frais d'expédition ; (2) 'Kit Tournevis de Precision 135 en 1' (SKU CJGJ110756801AZ, 8 variantes couleur × 135/138 pièces, 27,90€, gid://shopify/Product/16304252387663) — acier chrome vanadium, embouts antidérapants, mallette de rangement compacte. Les deux produits sont ACTIVE, tag cat-quincaillerie, descriptions réécrites en français avec accents et listes à puces, aucun logo tiers détecté sur les photos vérifiées."

SOURCE:
Navigation CJdropshipping (recherche outils/tournevis triée par Listes décroissant), vérification visuelle des photos avant import, puis mcp__Shopify__graphql_query pour confirmation post-import (tags, prix, variantes déjà corrects dès l'import pour cette vague, pas de correctif API supplémentaire nécessaire sur ces deux produits au-delà du protocole standard).

DATE: 02/09/2026
STATUS: CONFIRMED
VERIFIED: true (vérifié via mcp__Shopify__graphql_query — tags cat-quincaillerie, prix, variantes confirmés pour les 2 produits ; vérification live individuelle sur ondeal.fr non ré-effectuée pour cette vague spécifique, protocole /product/ singulier déjà validé aux vagues précédentes)
LAST_VERIFIED: 02/09/2026
CONTRADICTORY_DATA: aucune.
OBSERVED_DATA: réponse graphql_query listant titre, tags, prix, variantes pour les 2 produits.
ACTION: Import + publication ACTIVE, tel que pour toutes les vagues précédentes.
NEXT: Vague 6 (Quincaillerie) terminée. Voir CLAIM-020 pour la suite (Vague 7, PC fixes).
```

---

## CLAIM-018 — Contrefaçon/IP confirmée en direct sur ondeal.fr : au moins 4 produits sous licence/marque déposée publiés par le processus parallèle non identifié

```
CLAIM:
"4 produits ACTIFS sur ondeal.fr, publiés par le processus parallèle non identifié (pas par Claude), présentent un risque de contrefaçon/propriété intellectuelle manifeste : (1) 'LEGO Marvel 76314 — Scène de Combat Captain America Civil War', 119,00€, double licence LEGO+Marvel ; (2) 'Lampe LED 3D Emblème Mugiwara — One Piece', 96,85€, badge PROMOTION, 4,6★ (5 avis) — le même personnage One Piece déjà identifié et purgé de la liste Syncee (CLAIM-015) est publié quand même via une autre voie ; (3) 'PLAYMOBIL 72072 — Soigneur d'Animaux avec Véhicule', 45,90€, marque déposée ; (4) 'Cartable Snoopy 26 x 34 x 11 cm', 43,85€, personnage sous licence Peanuts. Observé directement sur la page d'accueil (sections Meilleures ventes / Nouveautés / Recommandé pour vous) le 02/09/2026 pendant la Vague 5."

SOURCE:
get_page_text sur https://ondeal.fr/ (page d'accueil), lecture directe des titres, prix et badges affichés. Pas de vérification GraphQL supplémentaire jugée nécessaire — les titres seuls suffisent à établir le risque IP.

DATE: 02/09/2026
STATUS: OBSERVED — décision utilisateur requise, aucune action prise
VERIFIED: true (observation directe du site public, pas une inférence)
LAST_VERIFIED: 02/09/2026
CONTRADICTORY_DATA: aucune. Distinct du précédent arbitrage Hasbro/Makita (CLAIM antérieure, non renumérotée ici) où l'utilisateur avait confirmé que ces ajouts de marque étaient légitimes et à laisser tels quels — ici il s'agit de personnages sous licence et de marques déposées à risque juridique nettement plus élevé (LEGO/Marvel et One Piece/Shueisha-Toei sont des ayants droit connus pour leur activité anti-contrefaçon), pas de simple revente de marque.
OBSERVED_DATA: texte de page brut listant les 4 titres, prix et badges.
ACTION: Aucune action prise sur ces produits (ne relèvent pas des imports Claude). Signalé à l'utilisateur en priorité, avant la poursuite de Vague 6/7.
NEXT: Attendre la décision de l'utilisateur — dépublier/archiver ces 4 produits, ou les laisser (avec la justification explicite de l'utilisateur si c'est le choix retenu).
```

---

## CLAIM-017 — Vague 5 (Running) : 2 produits importés via CJ, vérifiés sans logo/marque tierce, publiés ACTIVE

```
CLAIM:
"2 produits Running importés via CJdropshipping vers le magasin Shopify 6mvti7-9g : (1) 'Brassard Porte-Téléphone Réglable pour Course à Pied' (SKU CJNS103990001AZ/002BY/003CX, 3 coloris Noir/Vert/Rose, 14,90€, gid://shopify/Product/16304163062095) — un premier candidat concurrent (armband 'COTEO', 170 listings) a été écarté après zoom : logo/wordmark imprimé visible sur le tissu, marque non identifiée mais traitée avec la même tolérance zéro qu'une marque connue ; (2) 'Sac Banane de Sport Multifonction avec Poche Bouteille' (SKU CJYDYDYD00479, 11 coloris, 19,90€, gid://shopify/Product/16304188260687) — un premier candidat (1858 listings) écarté pour photos non fiables (vignettes vidéo noires, stock non affiché), remplacé par une alternative à 396 listings avec vraies photos vérifiées sans logo. Les deux produits sont ACTIVE, tag cat-running, descriptions réécrites en français avec accents via l'API après import, couleurs de variantes traduites, titres corrigés avec accents complets."

SOURCE:
Navigation CJdropshipping (recherche 'running phone armband' puis 'running waist belt bag' triées par Listes décroissant), zoom manuel sur chaque coloris avant import, puis mcp__Shopify__graphql_query / graphql_mutation / update-product pour la correction des tags, prix, variantes et description.

DATE: 02/09/2026
STATUS: CONFIRMED
VERIFIED: true (vérifié en direct sur ondeal.fr/product/... — titre, prix, couleurs corrects pour les 2 produits ; piège de test noté : ondeal.fr/products/... au pluriel donne un faux 404, le préfixe correct est /product/ singulier)
LAST_VERIFIED: 02/09/2026
CONTRADICTORY_DATA: aucune
OBSERVED_DATA: captures d'écran zoomées de chaque coloris avant import ; captures des pages produit live confirmant titre/prix/couleurs/stock.
ACTION: Aucune action supplémentaire requise sur ces 2 produits.
NEXT: Vague 5 (Running) terminée à 2 produits. cat-quincaillerie et cat-pc-fixes re-vérifiés à 1 produit chacun (CRITICAL) — cibles valides pour Vague 6/7, en attente de la décision utilisateur sur CLAIM-018 avant de poursuivre.
```

---

## CLAIM-016 — Vague 4 (Chaussures Femme) : 2 produits importés via CJ, vérifiés sans logo/marque tierce, publiés ACTIVE

```
CLAIM:
"2 produits Chaussures Femme importés via CJdropshipping vers le magasin Shopify 6mvti7-9g, chacun vérifié sur les 4 (ou 2) couleurs disponibles pour absence de logo de marque tierce ou de personnage sous licence avant import : (1) 'Sneakers Femme à Lacets avec Rivets Dorés' (SKU base CJNS1545804, 4 coloris Noir/Doré/Rose Gold/Blanc, tailles 35-43, 24,90€, gid://shopify/Product/16304098902351) ; (2) 'Sneakers Femme en Maille Respirante Blanche' (SKU base CJNS107637701AZ, 2 coloris Noir/Rose — texte décoratif générique 'SPORT' présent sur le talon, pas une marque, tailles 35-40, 22,90€, gid://shopify/Product/16304120267087). Les deux produits sont ACTIVE, tags corrigés (cat-chaussures-femme, nouveaute, supplier:cj), descriptions réécrites en français avec accents via l'API après import (contournement du bug d'édition CJ qui rejette le texte accentué tapé directement + gras par défaut de l'éditeur CJ)."

SOURCE:
Navigation CJdropshipping (recherche 'women sneakers casual shoes' triée par Listes décroissant pour le produit 1, 'womens flat shoes' triée par Listes décroissant pour le produit 2), zoom manuel sur chaque couleur avant import, puis mcp__Shopify__graphql_query / graphql_mutation / update-product pour la création, la correction des tags, la traduction des variantes et la réécriture de la description.

DATE: 02/09/2026
STATUS: CONFIRMED
VERIFIED: true (vérifié en direct sur ondeal.fr — titre, prix, couleurs et tailles corrects pour les 2 produits)
LAST_VERIFIED: 02/09/2026
CONTRADICTORY_DATA: aucune
OBSERVED_DATA: captures d'écran zoomées de chaque coloris avant import (aucun logo visible) ; réponses GraphQL confirmant tags/prix/variantes après correction.
ACTION: Aucune action supplémentaire requise sur ces 2 produits.
NEXT: Vague 4 (Chaussures Femme) terminée à 2 produits, conforme au principe "vague contrôlée". Prochaine catégorie à sourcer à déterminer (voir note sur les duplicats cat-pc-portables et sur Romans/BD non résolus).
```

---

## CLAIM-015 — Liste d'import Syncee (25 produits auto-ajoutés) contient au moins 2 articles à risque de contrefaçon majeur (Naruto/One Piece) — jamais publiés

```
CLAIM:
"La 'Default import list' de l'app Syncee AI Dropship (magasin ondeal-5513) contient 25 produits marqués 'Produits importés' (importés dans la liste Syncee, PAS dans Shopify — vérifié 0 nouveau produit côté Shopify Admin API au-delà des 5 produits déjà connus des Vagues 1-3). Ces 25 produits n'ont pas été sélectionnés par Claude — ils portent les signes d'un ajout automatique par l'agent IA de Syncee/Sidekick (mix incohérent : cordes décoratives de hamac, autocuiseur titane KEITH, ET deux produits dérivés sous licence tierce non vérifiée : 'Naruto Shippūden 3D LED' et 'Mugiwara Crew Flag Emblem 3D' — logo Chapeau de Paille de One Piece). Aucun de ces 25 produits n'a été poussé vers Shopify."

SOURCE:
Navigation directe dans /apps/syncee-1/import-list/881651 (capture d'écran + tableau visible : Titre/Marque/Fournisseur/Prix de revient/Prix de détail/Approuvé), croisé avec mcp__Shopify__graphql_query (products créés aujourd'hui = toujours 5, aucun nouveau).

DATE: 02/09/2026
STATUS: CONFIRMED (présence des 2 articles à risque et statut non-publié), HUMAN_APPROVAL_REQUIRED (décision de nettoyage/poussée en attente)
VERIFIED: true (capture d'écran directe de la liste + requête GraphQL croisée)
LAST_VERIFIED: 02/09/2026
CONTRADICTORY_DATA: Le panneau Sidekick affichait le texte "25 produits importés" pouvant laisser croire à une publication réelle — contredit par la vérification GraphQL (0 nouveau produit Shopify). Sidekick a également proposé un plan non sollicité de 10 000 produits (3000 Électronique/2000 Maison/2000 Mode/1000 Animaux/1000 Sport/500 Jouets/500 Jardin) — non exécuté, non validé par l'utilisateur dans cette conversation.
OBSERVED_DATA: Capture d'écran du tableau Syncee (25 lignes, dont Naruto Shippūden 3D LED à 58,93€/73,61€ et Mugiwara Crew Flag Emblem 3D à 38,55€/48,16€, fournisseur MAOKEI).
ACTION: Ne jamais pousser ces 2 articles vers Shopify. Ne pousser aucun produit de cette liste sans nettoyage/validation explicite de l'utilisateur.
NEXT: Demander à l'utilisateur comment traiter la liste (nettoyer et pousser le reste, ou vider et resélectionner manuellement par catégorie prioritaire comme pour CJ).

MISE À JOUR 02/09/2026 (même session, plus tard) : utilisateur consulté via AskUserQuestion, a choisi "Vide la liste, je resource ciblé". **Les 25 produits ont été supprimés de la Default import list Syncee (confirmé visuellement : liste vide, "Vos produits seront affichés ici")**, y compris les 2 articles Naruto/Mugiwara. Aucun impact sur Shopify (rien n'avait été poussé). Prochaine étape : sourcing manuel ciblé via Syncee sur les catégories prioritaires, par petits lots vérifiés (pas 100 d'un coup), avec le même screening contrefaçon que pour CJ.
```

---

## CLAIM-014 — Abonnement Syncee Business activé (99,99$/mois après essai) sur demande explicite de l'utilisateur

```
CLAIM:
"Suite à la demande utilisateur de traiter les imports par lots de 100 produits (texte identifié comme probablement relayé depuis une suggestion de Shopify Sidekick), Claude a exploré Matrixify (CSV seul, pas de catalogue propre) et Syncee (catalogue fournisseur réel, mais import en masse verrouillé derrière un forfait payant). Un abonnement Syncee Business a failli être validé par erreur lors de la fermeture d'une fenêtre modale — annulé avant confirmation via le bouton 'Annuler' de la page Shopify RecurringApplicationCharge, aucun prélèvement. L'utilisateur a ensuite explicitement choisi 'Approuver Syncee Business (99,99$/mois)' via AskUserQuestion, puis a lui-même activé l'essai côté Shopify (message utilisateur 'jai upgrad'), confirmé visible sur /settings/apps ('Syncee AI Dropship — Essai gratuit') et sur la page de gestion de l'app ('Essai gratuit, 3 jours restant(s), 1$/mois après l'essai')."

SOURCE:
Navigation directe Shopify Admin (/settings/apps, /apps/syncee-1/dashboard, page de facturation de l'app), AskUserQuestion (réponse utilisateur explicite), message utilisateur "jai upgrad".

DATE: 02/09/2026
STATUS: CONFIRMED
VERIFIED: true
LAST_VERIFIED: 02/09/2026
CONTRADICTORY_DATA: aucune
OBSERVED_DATA: Page /settings/apps affichant "Syncee AI Dropship — Essai gratuit" ; page /apps/syncee-1/settings/apps/app_installations affichant "Facturation — Essai gratuit, 3 jours restant(s), 1$/mois après l'essai".
ACTION: Coût récurrent réel désormais engagé (99,99$/mois après le premier cycle à 1$, sauf annulation) — à suivre dans les décisions de rentabilité futures.
NEXT: Surveiller la facturation Shopify ; informer l'utilisateur si le catalogue Syncee ne s'avère pas rentable pour justifier ce coût.
```

---

## CLAIM-012 — Vague 2 (Souris) démarrée : premier produit importé et publié + garde-fou marque tierce ajouté au protocole

```
CLAIM:
"Un produit 'Souris Verticale Ergonomique Sans Fil pour Bureau' a été importé via CJ et publié en statut ACTIVE sur ondeal.fr (19,90€, tag cat-souris, 2 variantes Version rechargeable/Version pile). Pendant la recherche de candidats pour cette même vague, plusieurs résultats CJ affichaient la marque Logitech visible sur les photos produit — ces annonces ont été explicitement écartées de la sélection (risque de contrefaçon/marque tierce, distinct des vérifications d'honnêteté déjà appliquées en Vague 1)."

SOURCE:
Import direct via navigateur (interface CJ 'Manual Listing'), vérification croisée via mcp__Shopify__graphql_query/graphql_mutation (statut, tags, prix, traduction variantes) et navigation live sur ondeal.fr.

DATE:
02/09/2026

STATUS:
CONFIRMED

VERIFIED:
YES

LAST_VERIFIED:
02/09/2026

CONTRADICTORY_DATA:
Aucune.

OBSERVED_DATA:
Shopify Admin GraphQL confirme : gid://shopify/Product/16303656567119, statut ACTIVE, tags cat-souris/nouveaute/supplier:cj, prix 19.90€, 2 variantes (Version rechargeable / Version pile, SKUs CJBG112806402BY/CJBG112806401AZ). Page live ondeal.fr confirme : fil d'Ariane 'Accueil > Souris', prix, description français basée sur les specs réelles CJ (1600 dpi, USB 2,4GHz, 6 boutons), délai affiché '2 à 7 jours ouvrés' (même écart déjà documenté R-10 — délai réel CJ constaté au moment de l'import : 12-20 jours, méthode CJPacket Euro Sensitive). L'utilisateur a lui-même partagé une capture de ondeal.fr/category/ordinateurs montrant '0 résultat' pendant cette vague — confirmation visuelle indépendante d'un gap déjà documenté dans CATALOG_GROWTH_ENGINE.md (Ordinateurs, CRITICAL GAP, 0 produit) plutôt qu'une donnée nouvelle.

ACTION:
Import exécuté conformément à la demande explicite ('importe et publie en francais tjr pour ne revenir decu', puis 'continue'). Règle de vérification marque tierce ajoutée à CATALOG_GROWTH_ENGINE.md pour tous les imports futurs (CJ et DSers) : rejeter systématiquement toute annonce affichant un logo/marque tierce visible sur les photos.

NEXT:
Vague 2 terminée (2 produits, voir CLAIM-013). Évaluer avec l'utilisateur si la priorité suivante est Ordinateurs (CRITICAL GAP, 0 produit, maintenant débloqué côté accès fournisseur) ou une autre catégorie du gap.
```

---

## CLAIM-013 — Vague 2 (Souris) terminée : second produit importé et publié (clavier+souris)

```
CLAIM:
"Un second produit 'Clavier et Souris Sans Fil Portable pour Ordinateur' a été importé via CJ et publié en statut ACTIVE sur ondeal.fr (19,90€, tags cat-souris + cat-claviers, 3 variantes Noir/Or/Argent). Ceci clôture la Vague 2 (2 produits, catégorie Souris/Informatique)."

SOURCE:
Import direct via navigateur (interface CJ 'Manual Listing'), vérification croisée via mcp__Shopify__graphql_query/graphql_mutation et navigation live sur ondeal.fr.

DATE:
02/09/2026

STATUS:
CONFIRMED

VERIFIED:
YES

LAST_VERIFIED:
02/09/2026

CONTRADICTORY_DATA:
Aucune.

OBSERVED_DATA:
Shopify Admin GraphQL confirme : gid://shopify/Product/16303816245583, statut ACTIVE, tags cat-souris/cat-claviers/nouveaute/supplier:cj, prix 19.90€, 3 variantes (Noir/Or/Argent, SKUs CJBG111051703CX/701AZ/702BY). Page live ondeal.fr confirme : fil d'Ariane 'Accueil > Claviers', prix, description français basée sur les specs réelles CJ (2,4GHz, récepteur USB unique, 283x122x10mm, 375g), délai affiché '2 à 7 jours ouvrés' (écart R-10 déjà documenté — délai réel CJ constaté au moment de l'import : 8-18 jours, méthode CJPacket Ordinary I).

ACTION:
Import exécuté conformément à la demande explicite. Vague 2 (Souris) close avec 2 produits, conforme au principe 'vague contrôlée'. Documentation complète dans IMPORTS_LOG.md.

NEXT:
Demander à l'utilisateur la priorité de la Vague 3 : Ordinateurs (CRITICAL GAP, 0 produit, débloqué), ou une autre catégorie du gap (Accessoires Homme a déjà 2 produits mais reste CRITICAL au seuil ; Romans/BD à 0 également).
```

---

## CLAIM-011 — Premier import produit réel exécuté (2 produits, Accessoires Homme) + écart délai livraison découvert

```
CLAIM:
"2 produits ont été importés via CJ (Store API, magasin OndealMarketplace=ondeal.fr) et publiés en statut ACTIVE sur ondeal.fr, sur demande explicite de l'utilisateur : 'Portefeuille Court Homme en Cuir PU Style Classique' (17,90€) et 'Porte-Cartes Homme Anti-RFID avec Emplacement AirTag' (16,90€). Les deux sont vérifiés visibles et achetables en direct sur le site (page produit, page d'accueil, fil d'Ariane catégorie). Un écart a été observé entre le délai de livraison affiché sur la fiche produit ('2 à 7 jours ouvrés') et le délai réel fournisseur CJ au moment de l'import (12 à 50 jours / 12 à 20 jours selon le produit)."

SOURCE:
Import direct via navigateur (interface CJ 'Manual Listing'), vérification croisée via mcp__Shopify__graphql_query (statut, tags, prix) et navigation live sur ondeal.fr (mcp__claude-in-chrome__get_page_text).

DATE:
02/09/2026

STATUS:
CONFIRMED (import et publication) / OBSERVED (écart délai livraison, portée non déterminée — voir RISKS.md R-10)

VERIFIED:
YES

LAST_VERIFIED:
02/09/2026

CONTRADICTORY_DATA:
Aucune sur l'import lui-même. Sur le délai : la fiche produit ondeal.fr et l'écran de configuration CJ affichent des délais très différents pour les mêmes produits — CONTRADICTION non résolue, cause non déterminée (texte codé en dur possible vs donnée dynamique mal alimentée).

OBSERVED_DATA:
Shopify Admin GraphQL confirme : statut ACTIVE, tags cat-homme-accessoires, prix 17.90€/16.90€, 7 canaux de publication incluant 'Boutique en ligne'. Page live ondeal.fr confirme : titre, prix, description français, fil d'Ariane 'Accueil > Accessoires', présence en page d'accueil (Meilleures ventes, Nouveautés), délai affiché '2 à 7 jours ouvrés'. Écran CJ (au moment de l'import) : délai réel 12-50 jours (CJPacket Eub) et 12-20 jours (CJPacket Euro Sensitive).

ACTION:
Import exécuté conformément à la demande explicite. Documentation complète dans IMPORTS_LOG.md. Écart de délai signalé comme nouveau risque R-10, non corrigé cette session (nécessite d'identifier la source du texte affiché dans le code, HUMAN_APPROVAL_REQUIRED pour toute modification de composant partagé).

NEXT:
Vérifier si le message de délai est codé en dur pour tout le catalogue ou dynamique. Poursuivre l'import sur les autres catégories du gap si l'utilisateur le souhaite, catégorie par catégorie (vagues contrôlées).
```

---

## CLAIM-010 — 🔄 CORRECTION de CLAIM-009 : DSers EST bien connecté à ondeal.fr (la lecture précédente était erronée)

```
CLAIM:
"DSers a bien un magasin Shopify connecté et actif : nom '6mvti7-9g', domaine 'shop.ondeal.fr', Store ID 2090425805789265920, statut 'Connecté'. Ce domaine correspond exactement au domaine Shopify d'OnDeal confirmé indépendamment via l'API Admin Shopify (mcp__Shopify__get-shop-info → domain: 'shop.ondeal.fr'). Les 570 produits DSers ('Mes Produits') et 372 ('Liste d'import') sont donc bien rattachés au magasin ondeal.fr et exploitables sans étape de connexion OAuth supplémentaire."

SOURCE:
Navigation directe DSers (Gestion de l'application > Sales channel), section "Shopify" pleinement défilée/visible (screenshot), croisée avec mcp__Shopify__get-shop-info (API Admin Shopify, indépendante du navigateur).

DATE:
02/09/2026

STATUS:
CONFIRMED

VERIFIED:
YES (deux sources indépendantes convergentes : capture DSers + API Shopify Admin)

LAST_VERIFIED:
02/09/2026

CONTRADICTORY_DATA:
Contredit directement CLAIM-009 (même session, quelques minutes plus tôt), qui affirmait "AUCUN magasin Shopify n'est actuellement connecté à ce compte DSers" sur la base d'un premier `get_page_text` de l'écran "Gestion de l'application > Sales channel". Cause probable (PROBABLE, pas confirmée avec certitude) : ce premier passage a capturé une vue partielle/mal chargée de la page (le bouton "+ Ajoute des magasins" est un bouton d'ajout toujours visible en haut de la section, indépendant de la présence d'un magasin déjà connecté juste en dessous ; un `get_page_text` précédent avait aussi échoué une fois avec une erreur de contexte d'onglet sur ce même tab, signe possible d'un état de page instable au moment de la première lecture). **CLAIM-009 est donc marquée STALE/superseded — la donnée qu'elle contenait sur DSers était incorrecte, pas la contradiction habituelle "deux vérités concurrentes".**

OBSERVED_DATA:
Screenshot DSers (défilement jusqu'à la section Sales channel) : bloc "Shopify" avec une ligne magasin "6mvti7-9g", "Domain:shop.ondeal.fr", "Store ID: 2090425805789265920", badge vert "Connecté". `mcp__Shopify__get-shop-info` (API Shopify Admin, indépendante) : `{"name":"Ondeal","domain":"shop.ondeal.fr",...}` — correspondance exacte du domaine.

ACTION:
Correction de CLAIMS.md (cette entrée) + de CATALOG_GROWTH_ENGINE.md (statut DSers). **DSers est en fait immédiatement exploitable au même titre que CJ** — les deux fournisseurs sont réellement connectés à ondeal.fr. Aucune autorisation OAuth supplémentaire n'est nécessaire pour DSers. Aucun import n'a été exécuté (reste HUMAN_APPROVAL_REQUIRED pour toute publication, indépendamment de l'accès technique).

NEXT:
Traiter CJ et DSers comme deux sources de recherche produit également valides pour les catégories en gap (voir CATEGORY_GAP_MATRIX.json / CATALOG_GROWTH_ENGINE.md). Informer l'utilisateur de cette correction (le message précédent affirmant "DSers nécessite une autorisation OAuth" était erroné).
```

---

## CLAIM-009 — ⚠️ SUPERSEDED par CLAIM-010 (donnée DSers incorrecte, voir ci-dessus) — accès fournisseur réellement disponible via navigateur (débloque partiellement DATA_REQUIRED)

```
CLAIM:
"CJdropshipping a un magasin API 'OndealMarketplace' autorisé et activé (02/09/2026, 01:43:44). DSers est connecté avec un compte réel contenant déjà 570 produits dans 'Mes Produits' et 372 dans 'Liste d'import'."

SOURCE:
Navigation directe dans le navigateur de l'utilisateur (Claude in Chrome), sessions déjà authentifiées ouvertes par l'utilisateur — CJ : cjdropshipping.com/my.html#/authorize/APIStores ; DSers : dsers.com (compte "contact")

DATE:
02/09/2026

STATUS:
OBSERVED

VERIFIED:
YES

LAST_VERIFIED:
02/09/2026

CONTRADICTORY_DATA:
Nuance, pas une contradiction frontale : `docs/CJ_INTEGRATION.md` affirme que `CJ_API_KEY` (la clé développeur utilisée par le code custom `src/lib/cj/client.ts`) n'a jamais été configurée — cela reste probablement vrai, c'est un point différent. Ce qui est nouveau ici : CJ propose une intégration "Store API" au niveau de l'application (magasin "OndealMarketplace" autorisé), séparée de la clé développeur — un chemin d'import possible sans toucher au code custom. À ne pas confondre les deux mécanismes.

OBSERVED_DATA:
CJ : table "API Stores(1)" montrant un unique magasin "OndealMarketplace", type "Default store", statut "Authorized"/"Activated", mis à jour le 02/09/2026 à 01:43:44 (aujourd'hui) — **utilisateur a confirmé que ce magasin est bien ondeal.fr** (CONFIRMED, USER_DECLARED validant l'OBSERVED). DSers : compte connecté, "Mes Produits" = 570, "Liste d'import" = 372. **Mise à jour : Gestion de l'application > Sales channel > Shopify affiche "+ Ajoute des magasins" — AUCUN magasin Shopify n'est actuellement connecté à ce compte DSers.** Les 570 produits existent dans la bibliothèque DSers mais ne sont reliés à aucune boutique Shopify, ondeal.fr ou autre.

ACTION:
Ne rien importer/publier automatiquement. CJ est le chemin réellement utilisable immédiatement (Store API déjà autorisée sur ondeal.fr) ; DSers nécessite une étape de connexion Shopify (autorisation OAuth) avant de pouvoir servir à quoi que ce soit — **cette connexion n'a PAS été initiée** (elle relève de "Explicit permission required" : octroi de permissions OAuth), à faire uniquement sur demande explicite de l'utilisateur.

NEXT:
Prioriser la recherche produit côté CJ (chemin déjà actif) pour les catégories en gap. Demander à l'utilisateur s'il souhaite connecter DSers à ondeal.fr (implique une autorisation OAuth côté Shopify) avant d'exploiter les 570 produits déjà présents là-bas.
```

---

## CLAIM-008 — 🚨 précise CLAIM-007 : un vrai funnel est mesurable, partiellement

```
CLAIM:
"Un compte Klaviyo réel est connecté (intégration Shopify active depuis le 06/08/2026). Il ne mesure PAS le trafic/les vues produit (tracking onsite absent ou inactif), mais il mesure réellement les checkouts et commandes via les webhooks Shopify : 27 'Checkout Started' (5 clients uniques) en août 2026, contre 1 seule commande passée. Soit un abandon de panier d'environ 80% parmi les rares clients qui atteignent le checkout."

SOURCE:
API Klaviyo (mcp__Klaviyo__*), compte UdgN7u, contact@ondeal.fr

DATE:
02/09/2026 (données couvrant août-septembre 2026)

STATUS:
CONFIRMED

VERIFIED:
YES

LAST_VERIFIED:
02/09/2026 — query_metric_aggregates sur 4 métriques (Active on Site, Viewed Product, Checkout Started, Placed Order), filtre 01/08/2026-02/09/2026

CONTRADICTORY_DATA:
Corrige une affirmation antérieure de cette même session (DATA.md/MARKETING.md) qui disait "aucun tracking analytique actif" — c'était incomplet, pas faux sur le fond (pas de vue trafic top-of-funnel), mais il existe bien un tracking partiel côté transactionnel.

OBSERVED_DATA:
Klaviyo query_metric_aggregates, août 2026 : "Active on Site" = 0 événement, "Viewed Product" = 0 événement (sur tout le mois, malgré des checkouts réels — signe que le script de tracking onsite Klaviyo n'est pas installé/actif sur le site, cohérent avec l'absence de GA4 déjà documentée). "Checkout Started" = 27 événements / 5 profils uniques. "Placed Order" = 1 événement / 1 profil unique — cohérent avec `ordersCount` Shopify (source indépendante, même résultat : validation croisée réussie).

ACTION:
Prioriser l'installation d'un tracking onsite réel (Klaviyo onsite JS et/ou GA4) ET investiguer pourquoi 4 clients sur 5 abandonnent après avoir démarré un checkout (frais de port affichés tardivement, méthodes de paiement, confiance, bug technique) — action à faible risque, lecture/diagnostic d'abord, aucune promesse de résultat chiffré sans plus de volume de données.

NEXT:
Voir TRAFFIC_TRUST_PLAN.md pour le plan d'action détaillé.
```

---

## CLAIM-007 — 🚨 la plus importante de tout le registre à ce jour

```
CLAIM:
"1 seule commande dans toute l'histoire du magasin (août 2026), payée, ~29,90-34,80 €. 1 709 produits sur 1 710 n'ont généré aucune vente."

SOURCE:
Utilisateur (document d'audit collé), puis vérifié indépendamment

DATE:
02/09/2026 (commande elle-même datée du 04/08/2026)

STATUS:
CONFIRMED

VERIFIED:
YES

LAST_VERIFIED:
02/09/2026 — requête directe `ordersCount` (total=1, payées=1) + détail de la commande #1001

CONTRADICTORY_DATA:
Léger écart sur le montant exact : utilisateur a déclaré 29,90 €, donnée observée = 34,80 € (`currentTotalPriceSet`, EUR, commande #1001 du 04/08/2026, statut PAID). Le fait central ("1 seule commande, ever") est CONFIRMED ; le montant précis reste à réconcilier (frais de port/taxes possiblement inclus différemment).

OBSERVED_DATA:
Shopify GraphQL, 02/09/2026 : ordersCount (toutes) = 1, ordersCount(financial_status:paid) = 1. Une seule commande existe dans le magasin : #1001, créée le 2026-08-04T19:53:47Z, statut PAID, total 34,80 EUR.

ACTION:
Traiter ceci comme LE constat prioritaire de tout l'audit — au-dessus de toute question de structure catalogue. Voir RISKS.md (nouveau risque le plus élevé) et BUSINESS.md.

NEXT:
Réconcilier l'écart de montant (29,90 € vs 34,80 €) si pertinent (mineur). Prioriser un plan trafic/confiance (SEO, preuve sociale, email, quick wins CRO) avant tout nouvel effort catalogue — c'est cohérent avec le diagnostic reçu de l'utilisateur, que cette vérification confirme dans son fond.
```

---

## CLAIM-006

```
CLAIM:
"53 collections. Collection 'Nouveautés' (handle: petits-budget) contient 1 710 produits (bug smart collection). Doublons : Bijoux ×2 (bijoux + bijoux-collection), Auto & Moto ×2 (auto-moto + auto-moto-1). Overlap Montres + Montres Hommes."

SOURCE:
Utilisateur (document d'audit collé)

DATE:
02/09/2026

STATUS:
CONTRADICTED

VERIFIED:
YES (vérification a produit un résultat différent sur plusieurs points)

LAST_VERIFIED:
02/09/2026 — `collectionsCount` + liste complète des 40 collections (`search_collections`, pagination confirmée complète : hasNextPage=false)

CONTRADICTORY_DATA:
YES, sur plusieurs points précis :
- Nombre de collections : OBSERVED = 40 (mesuré deux fois à des moments différents de la session, cohérent). Le chiffre de 53 ne correspond pas.
- "Nouveautés"/petits-budget = 1 710 produits : OBSERVED — la collection réelle s'appelle "Nouveauté" (handle "nouveaute", pas "petits-budget"), et compte 796 produits (tag new-arrivals-2026), pas 1 710. Aucune collection dans la liste complète des 40 ne contient 1 710 produits. Aucune collection avec le handle "petits-budget" n'existe actuellement.
- Bijoux ×2 : OBSERVED — aucune collection native Shopify nommée "Bijoux" n'existe dans la liste complète des 40 (le tag cat-bijoux existe avec 151 produits, mais sans objet Collection dédié). Zéro doublon trouvé car zéro collection Bijoux trouvée.
- Auto & Moto ×2 : OBSERVED — une seule collection "Auto & Moto" existe (handle auto-moto-1, 19 produits). Pas de second "auto-moto".
- Montres + Montres Hommes : OBSERVED — une seule collection "Montres" existe (handle montres, 92 produits, tag cat-montres). Pas de "Montres Hommes" distincte.

À l'inverse, une large partie des chiffres de collections individuelles du même document CORRESPOND exactement à l'observation directe (ex. Beauté & Soin 158, Bureau & Papeterie 160, Cuisine & Ustensiles 97, Fêtes & Déguisements 72, Épicerie fine 1, Souris 5, Barbecue 6, Écrans 7, Tablettes 8, Football 9, Chaussures Femme 9, Jeux de Société 10, Meubles 11, Parfums 11, Téléphones 12, Chaussures Homme 13, Sacs Femme 14, Décoration Maison 6, Caméras & Surveillance 8, Lunettes 8) — donc la source de la contradiction n'est probablement pas une erreur totale, mais une confusion partielle (collections renommées/supprimées entre la génération du document et cette vérification, ou mélange avec une autre source de données).

OBSERVED_DATA:
Liste complète des 40 collections avec productsCount, obtenue par pagination confirmée exhaustive (search_collections, hasNextPage=false), 02/09/2026.

ACTION:
DO NOT exécuter les fusions/suppressions demandées (AXE 1 : corriger "Nouveautés", fusionner Bijoux, fusionner Auto & Moto) telles que décrites — les objets qu'elles ciblent ne correspondent pas à l'état réel observé. Aucune mutation de collection effectuée.

NEXT:
Demander à l'utilisateur la source de son document d'audit (outil, export, date exacte) pour comprendre l'origine des écarts, avant toute action structurelle sur les collections.
```

---

## CLAIM-004

```
CLAIM:
"Les produits 'Instruments de musique' portent le tag Shopify 'instru-musique'."

SOURCE:
Commentaire de code, src/data/categories.ts, daté 19/08/2026

DATE:
19/08/2026

STATUS:
STALE

VERIFIED:
YES (vérification a produit un résultat différent de l'affirmation)

LAST_VERIFIED:
02/09/2026

CONTRADICTORY_DATA:
YES

OBSERVED_DATA:
Shopify (02/09/2026) : tag:instru-musique = 1 produit ; tag:cat-instruments-musique (convention standard cat-<id>) = 27 produits — soit exactement le nombre annoncé par le commentaire (27), mais sous le tag conventionnel, pas celui écrit dans le commentaire.

ACTION:
Aucune conséquence fonctionnelle identifiée (le mapping applicatif réel semble utiliser la bonne convention). Ne pas se fier au nom de tag écrit dans ce commentaire pour une requête manuelle future.

NEXT:
Corriger le commentaire dans le code si l'occasion se présente (mineur, faible priorité, pas une action isolée à planifier).
```

---

## CLAIM-003

```
CLAIM:
"ondeal.fr sert actuellement le thème Shopify 'Dawn' (Online Store), pas l'application Next.js du dépôt."

SOURCE:
Rapport reports/phase6-master-audit.md, 14/08/2026 (barre d'admin "Edit theme" observée en navigation live à cette date)

DATE:
14/08/2026

STATUS:
STALE

VERIFIED:
NO

LAST_VERIFIED:
Jamais reconfirmé formellement depuis le 14/08/2026

CONTRADICTORY_DATA:
YES — voir OBSERVED_DATA

OBSERVED_DATA:
02/09/2026 : après déploiement des corrections de cette session (dont le correctif du symbole "€" dans LocationContext.tsx, fichier Next.js), une navigation live sur ondeal.fr a montré le symbole "€" correctement affiché — signal indirect que le déploiement Next.js est servi. Pas de vérification directe par marqueur DOM (absence de la barre "Edit theme" non testée explicitement).

ACTION:
DO NOT lancer d'audit visuel/UX/accessibilité approfondi sur le code Next.js sans confirmer d'abord quel code est réellement servi.

NEXT:
Naviguer sur une URL de collection Shopify native (ondeal.fr/collections/...) et vérifier l'absence/présence de la barre d'édition de thème Shopify.
```

---

## CLAIM-002

```
CLAIM:
"Le catalogue Shopify est passé de 8 369 à 8 487 produits après l'import CJ (ACTIVE 893→970, DRAFT 301→342), vérifié par requête directe post-import."

SOURCE:
Rapport reports/cj-phase4-execution-final.md, 13/08/2026

DATE:
13/08/2026

STATUS:
STALE

VERIFIED:
NO (non re-vérifié à la date d'origine par cette session — seule la valeur actuelle a été mesurée)

LAST_VERIFIED:
Jamais — aucun accès à un journal historique Shopify pour confirmer que 8 487 était exact au 13/08/2026

CONTRADICTORY_DATA:
YES — voir OBSERVED_DATA

OBSERVED_DATA:
02/09/2026, mesuré deux fois à quelques minutes d'écart : productsCount total = 1 715 (actifs 1 710, brouillons 4, archivés 1). Écart de ~6 772 produits par rapport à la valeur déclarée du 13/08/2026.

ACTION:
DO NOT MODIFY CATALOG (aucun nouvel import, aucune suppression) tant que la cause de l'écart n'est pas identifiée.

NEXT:
Voir CLAIM-001 — la piste avancée pour expliquer cet écart (BigBuy) est elle-même en CONTRADICTED. Demander à l'utilisateur s'il a lui-même supprimé des produits entre le 13/08 et le 02/09, ou consulter un journal d'audit Shopify (support Shopify) si ce n'est pas le cas.
```

---

## CLAIM-001

```
CLAIM:
"Environ 8 000 produits BigBuy sont archivés volontairement."

SOURCE:
Utilisateur

DATE:
02/09/2026

STATUS:
USER_DECLARED

VERIFIED:
NO

LAST_VERIFIED:
02/09/2026 — tentative de vérification effectuée, a produit une CONTRADICTION plutôt qu'une confirmation (voir OBSERVED_DATA)

CONTRADICTORY_DATA:
YES

OBSERVED_DATA:
Shopify (requêtes GraphQL directes, 02/09/2026) :
- status:archived = 1 (pas ~8 000)
- vendor:BigBuy = 0
- tag:bigbuy / tag:BigBuy / tag:bigbuy-dropshipping / tag:supplier-bigbuy / tag:fournisseur-bigbuy = 0 dans chaque cas
- Code source (category-mapping.ts, categories.ts, productService.ts) : "BigBuy" existe comme fournisseur historique légitime, associé à ~210 produits actifs sur le tag cat-bureau-papeterie — pas à un lot de produits archivés.

ACTION:
DO NOT MODIFY CATALOG. Ne pas exclure les produits BigBuy des recommandations en assumant qu'ils sont archivés — aucun produit identifiable comme "BigBuy archivé" n'existe dans ce magasin à ce jour. Ne pas non plus supprimer ou réactiver quoi que ce soit sur cette base.

NEXT:
Identifier la source réelle du chiffre de 8 000 produits — système externe à ce Shopify (ex. tableau fournisseur BigBuy lui-même), autre boutique, ou état antérieur non retrouvable. Question posée à l'utilisateur, réponse en attente.
```
