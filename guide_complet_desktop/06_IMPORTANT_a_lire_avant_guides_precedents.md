# Important — ce qui a changé depuis les anciens guides

Le dossier `10_Guide_Comment_Tout_Refaire/` contient des guides écrits **avant** que le site ne devienne un site sur-mesure (Next.js). Deux d'entre eux ne sont **plus valables tels quels** :

## ❌ `06_SITE_Changer_le_logo_Shopify.md` — obsolète

Ce guide explique comment changer le logo via **l'éditeur de thème Shopify** ("Personnaliser" → réglages du thème). Ça ne fonctionne plus : le site public n'affiche plus le thème Shopify, donc changer le logo dans l'éditeur de thème **n'aura aucun effet visible** sur ondeal.fr.

**Aujourd'hui**, le logo est un fichier image intégré directement au code du site (`public/brand/ondeal-logo.png`, le logo officiel final). Pour le changer : demande-le-moi avec le nouveau fichier, c'est une modification rapide.

## ❌ `08_SITE_Corriger_le_bandeau_annonce.md` — obsolète

Même chose : ce guide parle de la "Barre d'annonce" du thème Shopify. Le site actuel n'a pas de bandeau de ce type venant de Shopify — s'il y a un bandeau à ajouter/modifier en haut du site, ça se fait aussi dans le code, sur demande.

## ✅ `07_SITE_Configurer_livraison_gratuite.md` — toujours valable

Celui-ci reste correct : la livraison offerte est bien configurée dans **Shopify Admin → Paramètres → Expédition et livraison**, et le site affiche automatiquement le bon seuil (actuellement **80€**, vérifié le 14/08/2026 — l'ancien chiffre de 39€ mentionné à l'origine dans ce guide n'est plus le seuil réel, une correction a déjà été appliquée dans le code pour refléter le vrai seuil Shopify).

## Pourquoi ce changement de fonctionnement ?

Le passage à un site sur-mesure (au lieu du thème Shopify standard) a été fait pour obtenir un site plus rapide, plus personnalisable et avec des fonctionnalités impossibles avec un thème standard (comme le sélecteur de taille/couleur intelligent). La contrepartie : les réglages visuels ne se font plus dans "Personnaliser le thème" mais par du code — d'où l'utilité de ce nouveau guide complet (dossier `13_Guide_Complet_2026/`) qui remplace la logique des anciens guides 06 et 08.

## En cas de doute

Si un ancien guide (`10_Guide_Comment_Tout_Refaire/`) te dit de faire quelque chose dans l'éditeur de thème Shopify pour changer un aspect **visuel** du site (logo, bandeau, mise en page), c'est probablement obsolète — demande-moi confirmation avant de chercher à comprendre pourquoi ça ne marche pas.
