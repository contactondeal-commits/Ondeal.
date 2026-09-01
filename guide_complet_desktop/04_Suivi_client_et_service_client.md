# Suivi client et service client

## Où le client suit sa commande

Depuis le 15/08/2026, le compte client fonctionne via le **portail natif Shopify** (plus de mot de passe à gérer, plus d'ancien système "connexion" fait maison). Le client clique sur "Mon compte" sur le site → il est redirigé vers `shop.ondeal.fr/account` → Shopify lui envoie un code de connexion par email (sans mot de passe) → il voit ses commandes, son statut de livraison, son historique.

Tu n'as rien à configurer pour que ça marche — c'est déjà en place et fonctionnel pour tous les clients (existants et nouveaux).

## Répondre à une demande client

Toutes les commandes et informations client sont dans **Shopify Admin → Commandes** et **Shopify Admin → Clients**. Tu y trouves :
- l'historique de commandes d'un client
- son adresse email et de livraison
- le statut de paiement/expédition de chaque commande

Pour contacter un client par email directement depuis Shopify : ouvrir la commande → bouton **"..."** (ou icône email) en haut → "Envoyer un email au client", ou simplement lui répondre par email classique à l'adresse indiquée sur sa commande.

## Retours et remboursements

La politique actuelle affichée aux clients est : **retours acceptés sous 14 jours** (visible sur les fiches produits et pages d'aide du site).

Pour traiter un retour :
1. Le client te contacte (email, ou éventuellement un formulaire de contact du site)
2. Vérifier son numéro de commande dans Shopify Admin → Commandes
3. Si le retour est accepté : Shopify Admin → la commande → **Rembourser** (remboursement total ou partiel, avec ou sans frais de retour selon le cas)
4. Le remboursement suit le moyen de paiement d'origine (carte bancaire, etc.) — automatique une fois validé dans Shopify

⚠️ **Cas dropshipping** : comme les produits viennent de CJdropshipping ou BigBuy, pense à vérifier **la politique de retour du fournisseur** avant d'accepter un retour physique du produit (certains fournisseurs en dropshipping ne demandent pas toujours le renvoi du produit si le coût de retour dépasse sa valeur — ça se gère au cas par cas avec leur support).

## Avis clients

Les avis sont gérés par l'application **Judge.me**, installée sur la boutique Shopify (visible dans Admin → Applications → Judge.me). C'est là que tu peux :
- voir les avis laissés par les clients
- modérer/supprimer un avis inapproprié
- envoyer des emails automatiques de demande d'avis après achat (si configuré)

Les avis s'affichent automatiquement sur les fiches produits du site (widget produit) et dans le panier.

## Questions fréquentes (FAQ) affichées sur le site

Le contenu de la page d'aide/FAQ du site (`ondeal.fr/help`) est actuellement **écrit dans le code** (fichier `help-data.ts`), donc pour modifier son contenu (nouvelle question, texte différent), il faut me le demander — ce n'est pas encore éditable depuis Shopify Admin. Dis-moi simplement ce que tu veux changer/ajouter et je le fais.

## Résumé — qui fait quoi

| Besoin client | Où | Toi seule ? |
|---|---|---|
| Voir ses commandes | `shop.ondeal.fr/account` (déjà en place) | Automatique |
| Contacter un client | Shopify Admin → Commandes/Clients | Oui |
| Rembourser | Shopify Admin → la commande | Oui |
| Modérer un avis | App Judge.me | Oui |
| Modifier le texte de la FAQ | Code du site | Demande-moi |
