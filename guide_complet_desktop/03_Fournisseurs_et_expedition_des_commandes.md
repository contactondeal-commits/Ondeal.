# Fournisseurs et traitement des commandes (dropshipping)

Ondeal fonctionne en **dropshipping** : tu ne touches jamais physiquement les produits. Le fournisseur les fabrique/prépare et les expédie **directement chez le client**. Ton rôle est de faire le lien entre "commande reçue sur Shopify" et "commande passée chez le fournisseur", puis de communiquer le suivi au client.

## Les deux fournisseurs

| Fournisseur | Statut | Où se connecter |
|---|---|---|
| **CJdropshipping** | ✅ Actif — fournisseur actuel de la quasi-totalité du catalogue en ligne (~890 produits) | cjdropshipping.com |
| **BigBuy** | ⚠️ Ancien fournisseur — plus utilisé pour les nouveaux produits, mais peut encore concerner une commande en cours si elle porte sur un produit importé avant le changement | my.bigbuy.eu |

**Comment savoir de quel fournisseur vient un produit ?** Ouvre la fiche du produit concerné dans Shopify Admin :
- S'il porte le tag **`supplier:cj`** → c'est un produit CJdropshipping.
- Sinon (pas de ce tag) → il s'agit probablement d'un produit historique BigBuy — vérifie sur my.bigbuy.eu.

## Étapes pour traiter une commande, du début à la fin

### 1. Une commande arrive

Shopify Admin → **Commandes** (menu de gauche). Une nouvelle commande payée apparaît avec le statut paiement "Payée" et le statut de traitement "Non exécutée" (ou "En attente").

Tu reçois aussi normalement un email de notification à chaque nouvelle commande (adresse configurée dans Shopify Admin → Paramètres → Notifications).

### 2. Identifier le(s) produit(s) et le fournisseur

Ouvre la commande → regarde chaque produit commandé → vérifie son tag (`supplier:cj` ou non, voir ci-dessus) pour savoir sur quelle plateforme fournisseur tu dois passer la commande.

### 3. Passer la commande chez le fournisseur

**Si CJdropshipping :**
1. Se connecter sur cjdropshipping.com
2. Retrouver le produit exact (utilise le nom du produit ou son SKU visible dans Shopify)
3. Passer commande côté CJ avec l'adresse de livraison **du client final** (pas la tienne) — copie l'adresse exactement depuis la commande Shopify
4. Payer la commande côté CJ (c'est toi qui règles le fournisseur — c'est ta marge qui se calcule sur la différence entre ce que le client a payé et ce que tu paies à CJ)

**Si BigBuy :**
1. Se connecter sur my.bigbuy.eu → "Mes commandes"
2. Même logique : retrouver/passer la commande avec l'adresse du client final

### 4. Récupérer le numéro de suivi

Une fois que le fournisseur expédie (généralement quelques jours), il fournit un **numéro de suivi** — visible dans ton espace CJ ou BigBuy, et souvent aussi envoyé par email.

### 5. Finaliser côté Shopify

Retourne sur la commande dans Shopify Admin → bouton **"Exécuter la commande" / "Marquer comme expédiée"** → coller le numéro de suivi et choisir le transporteur si demandé → Valider.

➡️ Cette action envoie **automatiquement** un email au client avec son numéro de suivi — tu n'as rien d'autre à faire.

### 6. Suivre les commandes en attente

Shopify Admin → Commandes → filtrer par statut "Non exécutée" pour voir d'un coup d'œil toutes les commandes qui attendent encore d'être transmises au fournisseur ou en attente de suivi.

## Exemple réel déjà traité (pour référence)

Une commande (#1001, cliente Emilie Peraudeau, casque gaming, 34,80€) était en attente du numéro de suivi BigBuy — le détail complet est dans `09_Commande_1001_BigBuy/NOTE_commande_1001.md` si tu veux voir un exemple concret déjà documenté.

## Ta marge

Ta marge = prix payé par le client sur Ondeal − prix payé au fournisseur (CJ ou BigBuy) − frais éventuels. Le prix affiché sur Ondeal doit donc toujours rester **supérieur** au prix fournisseur — pense à vérifier ça avant de baisser un prix (section "Changer un prix" du fichier 02).

## Ce qui n'est PAS automatisé aujourd'hui

Il n'existe **aucune synchronisation automatique** entre les commandes Shopify et les fournisseurs (CJ ou BigBuy) — chaque commande doit être passée **manuellement** par toi côté fournisseur, comme décrit ci-dessus. Une automatisation est techniquement possible (CJdropshipping propose une API pour ça) mais n'a pas encore été mise en place. Si tu veux qu'on l'automatise, dis-le-moi — c'est un vrai chantier technique (connexion API + logique de synchronisation) qu'on peut planifier ensemble.
