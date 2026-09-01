# Comment le projet OnDeal fonctionne — vue d'ensemble

## Les 4 briques du projet

```
   Clients                Toi (la marchande)
      │                          │
      ▼                          ▼
┌─────────────┐          ┌──────────────┐
│  ondeal.fr  │◄────────►│ Shopify Admin│  ← tu gères produits, prix,
│ (le site)   │  produits │ (back-office)│    stock, commandes, ICI
└─────────────┘  en temps └──────────────┘
      │            réel          │
      ▼                          ▼
┌─────────────┐          ┌──────────────┐
│   Vercel    │          │ CJdropshipping│  ← le fournisseur qui
│ (hébergeur) │          │ (fournisseur) │    fabrique/expédie les
└─────────────┘          └──────────────┘    produits
```

### 1. Le site public — ondeal.fr

Ce n'est **pas** un site Shopify classique (le thème "Dawn" que tu vois parfois dans l'éditeur Shopify n'est plus utilisé et peut même afficher une erreur — c'est normal, ignore-le, voir fichier 06).

C'est un site **sur-mesure**, construit avec une technologie appelée **Next.js**, qui a été codé spécifiquement pour Ondeal. Ce site va chercher automatiquement les produits, prix, stock et photos dans Shopify à chaque visite — Shopify sert uniquement de "base de données produits", pas d'affichage.

Avantage : plus rapide, plus personnalisable, plus professionnel qu'un thème Shopify standard. Inconvénient : toute modification du **design ou des fonctionnalités** (pas juste du contenu) demande de modifier du code — ça, c'est mon travail (ou celui d'un développeur), pas un truc à faire toi-même dans une interface.

### 2. L'hébergeur — Vercel

Le code du site est stocké et exécuté chez un hébergeur appelé **Vercel** (vercel.com). C'est lui qui fait tourner le site 24h/24 à l'adresse ondeal.fr. Tu n'as normalement jamais besoin d'y aller toi-même — c'est un outil technique dont je m'occupe.

⚠️ **Point de vigilance actuel** : le code du site n'est aujourd'hui sauvegardé nulle part ailleurs que sur Vercel (pas de copie sur GitHub par exemple). Si tu veux qu'on mette en place une sauvegarde supplémentaire (recommandé), dis-le-moi et je m'en occupe — ça demande de créer un compte GitHub (gratuit) que tu devras valider.

### 3. Shopify Admin — ton back-office produits/commandes

C'est **là que tu passes le plus clair de ton temps au quotidien**. Adresse : `admin.shopify.com/store/ondeal-5513`.

C'est ici que tu :
- ajoutes/modifies/supprimes des produits, prix, stock (voir fichier 02) ;
- vois et traites les commandes clients (voir fichier 03) ;
- configures la livraison, les taxes, les moyens de paiement ;
- vois les avis clients (via l'app Judge.me installée).

Toute modification faite ici apparaît sur ondeal.fr **automatiquement, en moins d'une minute**, sans rien faire de plus.

### 4. Le fournisseur — CJdropshipping (+ historique BigBuy)

Ondeal fonctionne en **dropshipping** : tu ne stockes aucun produit toi-même. Quand un client achète, c'est le fournisseur qui fabrique/prépare et expédie directement chez le client.

- **Fournisseur actuellement actif** : **CJdropshipping** (cjdropshipping.com / plateforme pro `cjdropshipping.com`). La quasi-totalité du catalogue actuellement visible sur le site (~890 produits actifs) a été importée depuis CJdropshipping. Ces produits portent un tag discret `supplier:cj` dans Shopify (visible dans la fiche produit, section "Étiquettes").
- **Ancien fournisseur : BigBuy** (bigbuy.eu). Utilisé avant le passage à CJdropshipping. Les anciens produits BigBuy ont été désactivés dans Shopify (statut "Archivé") et ne sont plus visibles sur le site — mais **certaines commandes en cours peuvent encore concerner un produit BigBuy** si la commande a été passée avant ce changement. Vérifie toujours de quel fournisseur vient le produit d'une commande avant de savoir où aller chercher le suivi (détail dans le fichier 03).

## Et l'application mobile ?

Il existe aussi une application mobile Ondeal (React Native), un projet **séparé** du site web, stocké dans un autre dossier sur ton PC (`ondeal-app`). Elle a son propre guide dans `10_Guide_Comment_Tout_Refaire/`. Elle affiche en gros le même catalogue Shopify, mais le code est différent de celui du site.

## Résumé — qui fait quoi

| Élément | Rôle | Tu y touches ? |
|---|---|---|
| **ondeal.fr** | Le site que voient les clients | Non — c'est du code |
| **Vercel** | Fait tourner le site | Non — outil technique |
| **Shopify Admin** | Produits, stock, prix, commandes | **Oui — au quotidien** |
| **CJdropshipping** | Fabrique/expédie les produits | **Oui — pour traiter les commandes** |
| **Application mobile** | Version app du catalogue | Non — projet séparé, code |
