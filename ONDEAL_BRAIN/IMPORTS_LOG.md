# IMPORTS_LOG.md — Journal des imports produits réels (avec import + publication)

*Voir `_LEGEND.md`, `CATALOG_GROWTH_ENGINE.md`, `SOURCING_CANDIDATES.md`. Créé : 02/09/2026. Premier import réel exécuté sur demande explicite de l'utilisateur ("importe et publie en francais tjr pour ne revenir decu").*

## Vague 1 — Accessoires Homme (02/09/2026)

Import réel via CJdropshipping (Store API, magasin "OndealMarketplace" = ondeal.fr), publication immédiate (statut ACTIVE), fiches réécrites en français, prix fixés manuellement, tags corrigés après import (le champ tag de l'interface CJ tronque silencieusement à 20 caractères — `cat-homme-accessoires` passait à `cat-homme-accessoire` sans le "s" final ; corrigé via l'API Shopify Admin directement après chaque import).

| Produit | URL live | Prix | Statut Shopify | Notes |
|---|---|---|---|---|
| Portefeuille Court Homme en Cuir PU Style Classique | https://ondeal.fr/product/portefeuille-court-homme-en-cuir-pu-style-classique | 17,90 € | ACTIVE, tag `cat-homme-accessoires` | Cuir PU (similicuir) explicitement précisé dans le titre et la description — pas "cuir" seul, pour ne pas induire en erreur sur la matière. 2 variantes (Noir, Coffee/marron). |
| Porte-Cartes Homme Anti-RFID avec Emplacement AirTag | https://ondeal.fr/product/porte-cartes-homme-anti-rfid-avec-emplacement-airtag | 16,90 € | ACTIVE, tag `cat-homme-accessoires` | Description précise que le traceur AirTag n'est PAS inclus (juste l'emplacement), pour éviter toute confusion. Variantes nettoyées : le fournisseur avait dupliqué chaque couleur en version "Opp X" (packaging OPP) créant 8 "couleurs" au lieu de 4 réelles — les 4 doublons ont été supprimés et les 4 couleurs restantes traduites en français (Noir, Marron, Marron Foncé, Beige). |

Les deux produits sont vérifiés visibles et achetables sur ondeal.fr (page produit, page d'accueil sections "Meilleures ventes" et "Nouveautés", page catégorie via le fil d'Ariane "Accueil > Accessoires").

## ⚠️ Point de vigilance découvert pendant cet import (à traiter, voir RISKS.md)

La page produit affiche un délai de livraison **"2 à 7 jours ouvrés"** et un message **"Livré le vendredi 4 septembre"** (2 jours) — ce message semble être un texte générique du thème/site, indépendant du délai réel du fournisseur. Or l'écran de configuration d'expédition CJ, au moment de l'import, indiquait un délai réel de **12 à 50 jours** pour le portefeuille (méthode CJPacket Eub) et **12 à 20 jours** pour le porte-cartes (méthode CJPacket Euro Sensitive), Chine → France. C'est un écart important entre la promesse affichée au client et le délai réel probable d'expédition. Ceci n'est pas vérifié comme un bug généralisé à tout le catalogue (peut-être une donnée codée en dur pour tous les produits, peu importe le fournisseur réel) — mais pour ces 2 nouveaux produits spécifiquement, l'écart est réel et mesuré au moment de l'import. **STATUS: OBSERVED, à corriger ou à faire trancher par l'utilisateur — un client qui commande en pensant recevoir en 2-7 jours et attend 12-50 jours est exactement le scénario "revenir déçu" que la consigne de l'utilisateur voulait éviter.**

## Vague 2 — Souris (02/09/2026)

Import réel via CJdropshipping (Store API, magasin "6mvti7-9g" = shop.ondeal.fr / ondeal.fr), publication immédiate (statut ACTIVE), fiches réécrites en français, prix fixés manuellement, tags corrigés après import (même limitation de troncature à 20 caractères que Vague 1 — champ laissé vide côté CJ, corrigé via l'API Shopify Admin).

**Point de vigilance nouveau cette vague, appliqué en amont (avant import, pas en correctif après coup)** : plusieurs résultats de recherche CJ pour "souris" affichaient la marque **Logitech** visible sur les photos produit. Ces annonces ont été explicitement écartées de la sélection — revendre sous une marque tierce sans autorisation est un risque de contrefaçon, pas seulement une question d'honnêteté produit. Voir `CATALOG_GROWTH_ENGINE.md` pour la règle retenue pour tous les imports futurs.

| Produit | URL live | Prix | Statut Shopify | Notes |
|---|---|---|---|---|
| Souris Verticale Ergonomique Sans Fil pour Bureau | https://ondeal.fr/product/souris-verticale-ergonomique-sans-fil-pour-bureau | 19,90 € | ACTIVE, tag `cat-souris` | Fiche honnête basée sur les specs réelles CJ (1600 dpi réglable 3 niveaux, USB 2,4 GHz, 6 boutons, molette 4 directions, portée 10 m) — explicitement précisé que ce n'est PAS un modèle gaming, pour ne pas induire en erreur sur l'usage. 2 variantes : Version rechargeable / Version pile (les deux options d'alimentation réelles du fournisseur, traduites en français). |

Délai de livraison réel constaté au moment de l'import (méthode CJPacket Euro Sensitive, Chine → France) : **12 à 20 jours** — cohérent avec l'écart déjà documenté en RISKS.md R-10 (le site affiche uniformément "2 à 7 jours ouvrés" pour tout le catalogue, indépendamment du fournisseur réel). Ce nouveau produit est donc un cas supplémentaire concret du même problème, pas un nouveau problème.

| Clavier et Souris Sans Fil Portable pour Ordinateur | https://ondeal.fr/product/clavier-et-souris-sans-fil-portable-pour-ordinateur | 19,90 € | ACTIVE, tags `cat-souris` + `cat-claviers` | Ensemble clavier+souris — candidat choisi après avoir explicitement écarté deux autres résultats CJ pour "souris" portant la marque Logitech visible sur les photos (risque de contrefaçon, voir CATALOG_GROWTH_ENGINE.md). Fiche honnête basée sur les specs réelles CJ (2,4 GHz, récepteur USB unique, dimensions/poids réels). 3 variantes couleur (Noir/Or/Argent, traduites). Tagué sur les deux catégories Souris et Claviers car le produit couvre les deux — vérifié en direct : la page catégorie "Claviers" route bien vers ce produit. |

Délai de livraison réel constaté au moment de l'import (méthode CJPacket Ordinary I, Chine → France) : **8 à 18 jours** — même écart déjà documenté en RISKS.md R-10 (affichage uniforme "2 à 7 jours ouvrés" indépendant du fournisseur réel).

## Vague 3 — Ordinateurs (Électronique) (02/09/2026)

| Produit | URL live | Prix | Statut Shopify | Notes |
|---|---|---|---|---|
| Support Ordinateur Portable Réglable en Aluminium | https://ondeal.fr/product/support-ordinateur-portable-reglable-en-aluminium | 27,90 € | ACTIVE, tag `cat-ordinateurs` | Import CJ, protocole identique aux Vagues 1-2. Description réécrite en français à partir des specs réelles (alliage d'aluminium, 251×240×40mm, compatible ordinateurs portables/tablettes jusqu'à 15 pouces, structure ajourée, angle réglable, pliable, patins silicone). 2 variantes couleur (Gris/Blanc) traduites. Conforme à la décision utilisateur "Ordinateurs = accessoires, pas de vrais PC". Vérifié en direct (fil d'Ariane Accueil > Ordinateurs). |

Délai réel non re-vérifié individuellement pour ce produit (même écart déjà documenté R-10).

| Hub USB-C 4 en 1 avec Sortie HDMI 4K | https://ondeal.fr/product/hub-usb-c-4-en-1-avec-sortie-hdmi-4k | 16,90 € | ACTIVE, tag `cat-ordinateurs` | Import CJ. Specs réelles (1 port HDMI 4K, 2 ports USB-A 3.0, 1 port USB-C d'alimentation, gris, ~65g, alimenté via le port USB-C hôte). Image marketing "Slim & Portable" avec silhouette de smartphone et texte anglais écartée de la sélection (pas représentative, pas de photo produit réelle). Variante unique (Gris/USB-C) traduite. Vague 3 terminée (2 produits). |

**Vague 3 (Ordinateurs) terminée — 2 produits.**

⚠️ **Note découverte pendant la vérification** : deux produits ("Hasbro Nerf Elite 2.0 Flipshots Flip-8 Nerf Gun", vendor Hasbro ; "Makita uc003gz xgt 40V Max top handle chainsaw 30cm", 445,54€, marque Makita) sont apparus ACTIFS sur la boutique, créés dans la même minute que l'import ci-dessus, mais **pas importés par Claude**. Question posée à l'utilisateur — réponse : ce sont des ajouts légitimes (lui-même ou une autre source connue), à laisser tels quels. Aucune action prise dessus.

## ⚠️ Tentative de passage à l'échelle (Syncee) — 02/09/2026, en pause, voir CATALOG_GROWTH_ENGINE.md

Suite à une demande utilisateur de lots de 100 produits, abonnement Syncee Business activé (99,99$/mois après essai). La "Default import list" Syncee contient 25 produits ajoutés automatiquement par l'agent IA de Syncee/Sidekick (pas par Claude) — **dont 2 produits dérivés Naruto/One Piece à risque de contrefaçon majeur, jamais poussés vers Shopify**. Rien n'a été publié depuis Syncee (vérifié via API Admin : 0 nouveau produit hors les 5 déjà connus). Décision utilisateur en attente sur le nettoyage de cette liste avant toute publication.

## Vague 4 — Chaussures Femme (02/09/2026)

Suite à un relevé systématique par tag Shopify (GraphQL), la plupart des catégories CRITICAL/HIGH précédemment documentées comme vides (Accessoires Homme, Jardin, Écrans, PC portables, Football, Running, Quincaillerie, PC fixes, Barbecue, Jeux vidéo, Tablettes) se sont révélées déjà remplies par un processus parallèle non identifié (pas Claude — voir note ci-dessous). Romans et BD confirmés non viables via CJ (aucun résultat pertinent sur deux recherches ciblées, CJ n'est structurellement pas un fournisseur de livres). **Chaussures Femme** était la seule catégorie CRITICAL/HIGH encore réellement vide et sourçable honnêtement via CJ — sélectionnée comme cible de la Vague 4.

| Produit | URL live | Prix | Statut Shopify | Notes |
|---|---|---|---|---|
| Sneakers Femme à Lacets avec Rivets Dorés | https://ondeal.fr/product/sneakers-femme-a-lacets-avec-rivets-dores | 24,90 € | ACTIVE, tag `cat-chaussures-femme` | Import CJ (SKU CJNS1545804, 1854 listings — signal fournisseur fiable). 4 coloris vérifiés un par un par zoom (Noir/Doré/Rose Gold/Blanc) : aucun logo de marque ni personnage sous licence visible. Specs réelles (dessus PU, semelle polyuréthane, talon 3-5cm). 36 variantes (4 couleurs × 9 tailles 35-43) traduites en français via l'API. |
| Sneakers Femme en Maille Respirante Blanche | https://ondeal.fr/product/sneakers-femme-en-maille-respirante-blanche | 22,90 € | ACTIVE, tag `cat-chaussures-femme` | Import CJ (SKU CJNS107637701AZ, 2705 listings). 2 coloris vérifiés (accents Noir/Rose sur base blanche) : texte décoratif "SPORT" présent sur le talon — mot générique, pas une marque déposée, jugé sans risque. Aucun logo tiers. 12 variantes (2 couleurs × 6 tailles 35-40) traduites en français via l'API. |

**Vague 4 (Chaussures Femme) terminée — 2 produits.**

⚠️ **Point non résolu, à signaler à l'utilisateur** : la catégorie `cat-pc-portables` contient désormais 3 supports d'ordinateur portable aux titres quasi-identiques (le mien + 2 autres issus du processus parallèle non identifié) — doublon potentiel à trancher (fusionner, désactiver les doublons, ou laisser tel quel).

## Vague 5 — Running (02/09/2026)

Suite à l'instruction utilisateur "enchaine et remplie la boutique", re-relevé par tag Shopify avant de choisir la cible (pour éviter le travail redondant contre le processus parallèle) : `cat-running` était encore à 1 produit CRITICAL au moment du lancement de la vague (rempli entre-temps par le processus parallèle avec un 3e produit, un "T-shirt de Sport", pendant que cette vague était en cours — non touché, pas de mon fait).

Chaussures de course écartées d'emblée (risque élevé de contrefaçon de marques sportives sur CJ) au profit d'accessoires de course, angle plus sûr.

| Produit | URL live | Prix | Statut Shopify | Notes |
|---|---|---|---|---|
| Brassard Porte-Téléphone Réglable pour Course à Pied | https://ondeal.fr/product/brassard-porte-telephone-reglable-pour-course-a-pied | 14,90 € | ACTIVE, tag `cat-running` | Premier candidat ("Outdoor Sports Phone Arm Holder", 170 listings) écarté après zoom : logo/wordmark imprimé "COTEO" visible sur le tissu (marque non identifiée mais traitée comme toute marque tierce — tolérance zéro même pour une marque obscure). Pivot vers un support téléphone en silicone rigide sans branding. Support rotatif 180°, sangle élastique 12-24cm, 3,5 à 6 pouces. 3 coloris (Noir/Vert/Rose) vérifiés sans logo, traduits en français. |
| Sac Banane de Sport Multifonction avec Poche Bouteille | https://ondeal.fr/product/sac-banane-de-sport-multifonction-avec-poche-bouteille | 19,90 € | ACTIVE, tag `cat-running` | Premier candidat (sac banane running, 1858 listings) écarté : photos non fiables (vignette vidéo noire sur tous les emplacements image, stock non affiché). Pivot vers alternative suivante (396 listings) avec vraies photos statiques. 11 coloris vérifiés par zoom (dont photo lifestyle cycliste) : aucun logo tiers. Nylon résistant, poche filet + porte-bouteille, bretelle réglable. 11 variantes traduites en français. |

**Vague 5 (Running) terminée — 2 produits.** Titres, descriptions (accents complets + liste à puces) et couleurs de variantes corrigés via l'API après import, comme pour toutes les vagues précédentes. Les deux vérifiés en direct sur `ondeal.fr/product/...` (le préfixe correct est `/product/` singulier — vérification par `/products/` pluriel donne un faux 404, piège de test à ne pas reproduire).

## ⚠️ Alerte contrefaçon / IP confirmée en direct sur le catalogue (02/09/2026, pendant Vague 5)

En vérifiant la page d'accueil, plusieurs produits **publiés par le processus parallèle non identifié** (pas par Claude) sont ACTIFS sur `ondeal.fr` et présentent un risque de contrefaçon/propriété intellectuelle manifeste, dans la même catégorie de risque que les 2 produits Naruto/One Piece déjà purgés de la liste Syncee (voir plus haut) :
- **"LEGO Marvel 76314 — Scène de Combat Captain America Civil War"** — 119,00 € — LEGO + Marvel/Captain America, double licence.
- **"Lampe LED 3D Emblème Mugiwara — One Piece"** — 96,85 € — le même personnage One Piece déjà écarté de Syncee, ici publié quand même via une autre voie, avec badge "PROMOTION" et 4,6★ (5 avis).
- **"PLAYMOBIL 72072 — Soigneur d'Animaux avec Véhicule"** — 45,90 € — marque déposée Playmobil.
- **"Cartable Snoopy 26 x 34 x 11 cm"** — 43,85 € — personnage sous licence Peanuts/Snoopy.

**STATUS : OBSERVED, non traité — décision utilisateur nécessaire.** La consigne précédente était de ne pas toucher au processus parallèle (cas Hasbro/Makita, jugés légitimes), mais ces 4 produits sont d'une autre nature : personnages sous licence / marques déposées à haut risque juridique, pas de simples produits de marque revendus. Signalé à l'utilisateur en priorité avant de poursuivre Vague 6/7.

## Vague 6 — Quincaillerie (02/09/2026)

Suite à l'instruction utilisateur "Juste me signaler, je déciderai plus tard" concernant l'alerte contrefaçon (Vague 5 ci-dessus) : Vague 6 lancée immédiatement sans attendre, sans toucher aux 4 produits signalés. `cat-quincaillerie` re-vérifié à 1 produit CRITICAL au lancement (le préexistant "Pistolet Pulvérisateur Tout Métal — Outil de Jardin", pas de mon fait).

| Produit | URL live | Prix | Statut Shopify | Notes |
|---|---|---|---|---|
| Coffret d'Outils 43 Pieces pour Maison et Voiture | https://ondeal.fr/product/coffret-doutils-43-pieces-pour-maison-et-voiture | 69,90 € | ACTIVE, tag `cat-quincaillerie` | Import CJ (SKU CJQT115178501AZ). Coffret complet acier carbone (mètre ruban 3m, clés Allen, cutter, tournevis, testeur de tension, marteau, douilles, pince, lampe torche), mallette rigide 35,8×26,8×7cm incluse. Prix plus élevé que la moyenne du catalogue, calibré sur le poids/volume réel (frais d'expédition nettement supérieurs à un petit accessoire). Variante unique (Orange). Aucun logo tiers sur les photos vérifiées. |
| Kit Tournevis de Precision 135 en 1 | https://ondeal.fr/product/kit-tournevis-de-precision-135-en-1 | 27,90 € | ACTIVE, tag `cat-quincaillerie` | Import CJ (SKU CJGJ110756801AZ). Acier chrome vanadium, embouts antidérapants, mallette de rangement compacte, nombreuses tailles/formes d'embouts. 8 variantes (couleur × 135/138 pièces) traduites en français. Aucun logo tiers. |

**Vague 6 (Quincaillerie) terminée — 2 produits.** Les deux vérifiés via l'API Shopify (tags, prix, variantes) ; vérification live sur `ondeal.fr/product/...` non ré-effectuée individuellement pour cette vague (protocole `/product/` singulier déjà validé aux vagues précédentes).

## Vague 7 — PC fixes (02/09/2026)

Dernière catégorie CRITICAL/HIGH du gap encore réellement vide et sourçable honnêtement via CJ à ce stade. `cat-pc-fixes` re-vérifié à 1 produit CRITICAL au lancement (le préexistant "Graveur DVD externe portable pour ordinateur", pas de mon fait).

Premier candidat écarté : "Headphone Cleaning Pen" (8419 listings, 2,71$) — la quasi-totalité des images étaient des vignettes de vidéo marketing avec texte anglais en surimpression ("Are you still using dirty earbuds?"), pas de vraies photos produit statiques fiables. Pivot vers un kit de nettoyage plus polyvalent avec un mélange d'images marketing et de vraies photos produit — dans ce cas, seules les 4 images marketing avec texte ont été désélectionnées à l'import (checkbox décochées), les photos produit réelles conservées, cohérent avec le précédent du Hub USB-C (Vague 3) : exclure les images non représentatives plutôt que le produit entier quand une alternative fiable existe.

| Produit | URL live | Prix | Statut Shopify | Notes |
|---|---|---|---|---|
| Kit de Nettoyage Multifonction 11 en 1 pour PC et Clavier | https://ondeal.fr/product/kit-de-nettoyage-multifonction-11-en-1-pour-pc-et-clavier | 9,90 € | ACTIVE, tag `cat-pc-fixes` | Import CJ (SKU CJYD231771004DW, 882 listings). Brosse rétractable pour clavier, spatule de nettoyage, outil pour ports/prises, chiffon microfibre. 4 images marketing avec texte anglais désélectionnées à l'import, photos produit réelles conservées. 4 coloris (Bleu/Orange/Violet/Blanc) traduits en français via l'API après import. Tags corrigés après import (le champ CJ avait initialement enregistré `cat-claviers`/`cat-jouets` par erreur de sélection de collection — corrigé vers `cat-pc-fixes` via l'API Shopify Admin). |
| Boîte de Rangement pour Câbles et Multiprise Anti-Poussière | https://ondeal.fr/product/boite-de-rangement-pour-cables-et-multiprise-anti-poussiere | 22,90 € | ACTIVE, tag `cat-pc-fixes` | Import CJ (SKU CJJT129362901AZ, 7536 listings). Boîtier anti-poussière pour dissimuler multiprise et câbles, fente téléphone, passe-câbles au fond, double fermoir. Prix calibré sur frais d'expédition réels ($10,45-13,44, poids 714g) — plus élevé que le coût produit seul ($2,47) ne le suggérerait. 3 coloris (Bleu/Rose/Blanc) traduits en français. Aucun logo tiers sur les 2 coloris vérifiés par zoom (uniquement cotes de dimension 141mm/143mm). |

**Vague 7 (PC fixes) terminée — 2 produits.** Titres, descriptions (accents complets) et couleurs de variantes corrigés via l'API après import. Les deux vérifiés en direct sur `ondeal.fr/product/...` (fil d'Ariane "Accueil > PC fixes" correct sur les deux).

## Ce qui reste à faire (autres catégories du gap)

Vague 1 : Accessoires Homme (2 produits). Vague 2 : Souris (2 produits). Vague 3 : Ordinateurs (2 produits). Vague 4 : Chaussures Femme (2 produits). Vague 5 : Running (2 produits). Vague 6 : Quincaillerie (2 produits). Vague 7 : PC fixes (2 produits). Toutes terminées. Romans et BD restent à 0, confirmés non viables via CJ (nécessiterait un fournisseur livre/POD dédié, décision utilisateur en attente). Les 4 produits sous licence/marque déposée signalés en CLAIM-018 (LEGO Marvel, One Piece, Playmobil, Snoopy) restent non traités — décision utilisateur en attente ("je déciderai plus tard"). Les 3 supports d'ordinateur portable quasi-identiques dans `cat-pc-portables` restent non tranchés. Toutes les catégories CRITICAL/HIGH précédemment identifiées comme vides sont désormais comblées (par ce travail ou par le processus parallèle non identifié) ; un nouveau relevé complet par tag serait nécessaire avant de lancer une Vague 8, pour identifier la prochaine cible réelle sans travail redondant.
