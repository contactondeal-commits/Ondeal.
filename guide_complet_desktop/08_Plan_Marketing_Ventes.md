# Plan marketing OnDeal — générer des ventes avec un budget serré

Document préparé le 15/08/2026. Basé sur un audit réel du catalogue Shopify d'ondeal.fr (pas de chiffres inventés — tout est vérifiable dans Shopify Admin) au moment de la rédaction. À ajuster au fil des semaines selon les résultats réels.

**Point de départ que tu m'as donné** : budget très serré (0-200€/mois), objectif à la fois des ventes rapides et une marque qui dure, réseaux sociaux déjà créés mais peu utilisés, et tu veux que ça inclue de la pub (pas seulement du gratuit).

---

## 1. Ce que l'audit du site a révélé (à corriger avant de dépenser un euro en pub)

Avant tout plan marketing, trois trous techniques rendraient toute pub payante inefficace ou impossible à mesurer. Je peux les corriger moi-même côté code — dis-le-moi et je m'en occupe pendant que tu avances sur le reste.

### 1.1 Aucun pixel de tracking installé (critique)

Le site n'a **aucun** outil de mesure branché : ni Google Analytics, ni Meta Pixel (Facebook/Instagram), ni TikTok Pixel. Concrètement, ça veut dire que même si tu lances une pub demain, ni toi ni Meta/TikTok/Google ne peuvent savoir qui achète, ce qui marche, ni optimiser automatiquement vers les bons visiteurs. C'est la cause n°1 d'argent gaspillé en pub pour les petites boutiques. **À faire avant toute campagne payante** : je peux installer Google Analytics 4 et le Meta Pixel en quelques minutes une fois que tu as créé les comptes (gratuits) — voir étape 1 du calendrier plus bas.

### 1.2 Aucune capture d'email sur le site

Il n'y a nulle part sur ondeal.fr un moyen de récupérer l'email d'un visiteur qui n'achète pas tout de suite (pas de pop-up, pas de champ newsletter en pied de page). Résultat : chaque visiteur qui repart sans acheter est perdu définitivement, alors que dans l'e-commerce, la majorité des ventes viennent de visiteurs qui reviennent — pas du premier passage. C'est un manque à gagner gratuit à combler.

### 1.3 Les prix moyens du catalogue rendent le seuil de livraison gratuite peu atteint

Vérifié sur les 15 meilleures ventes réelles de la boutique : prix moyen **21,98€**, la moitié des articles sous 20€. Le seuil de livraison offerte est à 80€ et la livraison standard coûte 14,90€ — sur un panier à 15-20€, les frais de port représentent parfois plus de 70% du prix de l'article, ce qui est un frein d'achat énorme et une cause fréquente d'abandon de panier. Deux pistes (à discuter, ce sont des décisions commerciales, pas juste techniques) : encourager le multi-achat ("ajoute 1 article pour la livraison offerte", déjà affichable techniquement) ou revoir ce seuil/tarif pour les petits paniers.

---

## 2. Ce qui se vend déjà — partir de la réalité, pas de suppositions

J'ai interrogé directement Shopify pour voir ce qui se vend réellement (pas une intuition) :

**Top ventes actuelles** : chaussures femme/homme bon marché (sandales, baskets, chaussons — 12€ à 21€), petits sacs à main femme (3€ à 20€), un casque gaming (29,90€), des tablettes (56€ à 83€).

**Où est la profondeur du catalogue** (nombre de produits par catégorie) :

| Catégorie | Produits actifs | Constat |
|---|---|---|
| Bijoux | 149 | Catalogue profond, **et le bug qui les rendait invisibles vient d'être corrigé** (voir CHANGELOG) — opportunité immédiate, quasiment neuve |
| Soins visage | 75 | Bonne profondeur, catégorie porteuse en publicité (beauté = très visuel) |
| Audio | 53 | Bonne profondeur |
| Maquillage | 37 | Correct |
| Vêtements femme | 34 | Correct |
| Vêtements homme | 29 | Correct |
| Décoration | 27 | Correct |
| Fitness | 13 | Faible |
| Chaussures femme | 4 | **Meilleures ventes du site mais catalogue minuscule** |
| Chaussures homme | 4 | **Meilleures ventes du site mais catalogue minuscule** |
| Sacs femme | 5 | Meilleures ventes mais catalogue minuscule |
| Tablettes | 4 | Faible mais bon panier moyen |

**Conclusion actionnable** : les chaussures et sacs femme sont ce qui se vend le mieux mais tu n'as presque rien à vendre dans ces catégories (4-5 produits) — c'est la priorité n°1 côté approvisionnement (via CJdropshipping, voir fichier 03) avant même de faire de la pub dessus, sinon tu vas payer pour amener du trafic sur un choix trop pauvre. En parallèle, **Bijoux** est prêt à être poussé dès maintenant : gros catalogue, visuel, et vient d'être réparé.

---

## 3. Pourquoi ne pas tout promouvoir en même temps

OnDeal est une marketplace généraliste (électronique, maison, mode, beauté, jardin, sport...). C'est un vrai atout pour le site (large choix), mais un piège en communication : avec un budget de 0-200€/mois, un message "on vend de tout" ne marque personne et coûte cher à tester sur toutes les audiences à la fois. La règle pour ce budget : **communiquer chaque mois sur 1 à 2 catégories/produits vedettes**, pas sur tout le catalogue. Le site reste généraliste, mais la communication, elle, doit être ciblée.

**Recommandation de départ** : Bijoux (catalogue profond + fraîchement réparé) et un ou deux produits chocs des meilleures ventes actuelles (ex. le casque gaming à 29,90€ ou les sandales) comme produits d'appel pour attirer du trafic à bas prix.

---

## 4. Plan d'action — 30 premiers jours

### Semaine 1 — Fondations (0€, indispensable avant de dépenser en pub)

1. Créer un compte Google Analytics 4 (gratuit) et un compte Meta Business (gratuit) si pas déjà fait → me donner les identifiants/accès pour que j'installe les pixels sur le site (10-15 min de mon côté).
2. Créer un compte Google Merchant Center (gratuit) et connecter le flux produits Shopify → permet d'apparaître **gratuitement** dans l'onglet Shopping de Google, sans payer un centime de pub (voir section 5.1). Je peux t'accompagner techniquement pour le flux produits.
3. Demande-moi d'ajouter un champ "Recevez 10% de réduction sur votre 1ère commande" en pied de page + une pop-up discrète (une seule fois par visiteur, pas agressive) — capture d'email gratuite, corrige le trou de la section 1.2.
4. Reprendre en main les réseaux sociaux existants (Instagram/TikTok/Facebook, à préciser lesquels) : mettre une bio claire, un lien vers ondeal.fr, une photo de profil cohérente avec le logo.

### Semaine 2 — Premier contenu organique (0€)

5. Publier 3 à 4 posts/reels sur les réseaux mettant en scène **un seul produit vedette par publication** (pas un carrousel de 10 produits) — priorité aux Bijoux et aux meilleures ventes réelles listées en section 2. Format qui marche en 2026 pour ce type de produit : vidéo courte "avant/après" ou "unboxing", pas juste une photo produit.
6. Répondre à chaque commentaire/message sous 24h — Instagram et TikTok poussent davantage les comptes qui interagissent vite.
7. Ajouter les liens Instagram/TikTok/Facebook dans le footer du site (actuellement absents) — dis-le-moi avec les liens exacts et je les ajoute.

### Semaine 3 — Premiers euros de pub, une seule audience à la fois

8. Lancer **une seule** campagne Meta Ads (Facebook + Instagram) sur les Bijoux ou le produit d'appel choisi, budget **5 à 7€/jour** (≈150-210€/mois, dans ton enveloppe). Ne pas viser plus large : une seule audience, un seul visuel, pour que l'algorithme ait une chance d'apprendre (voir section 5.2 pour le pourquoi).
9. Laisser tourner sans y toucher pendant au moins 4-5 jours avant de juger les résultats — couper ou changer une pub trop tôt empêche Meta d'apprendre et fait perdre l'argent déjà dépensé.

### Semaine 4 — Mesurer et ajuster

10. Regarder dans Meta Ads Manager : coût par clic, coût par achat, et dans Google Analytics : combien de visiteurs venant de la pub ont acheté.
11. Couper ce qui ne marche pas, doubler (progressivement, pas d'un coup) ce qui marche.
12. Envoyer un premier email à la liste commencée en semaine 1 (même si elle est petite) — une vraie relation commence dès les 10-20 premiers emails collectés.

---

## 5. Le volet publicité payante, expliqué simplement

Tu m'as dit qu'il fallait de la pub — voici comment le faire sans brûler un budget de 200€/mois.

### 5.1 Ce qui est gratuit et à faire en premier

**Google Merchant Center — listings gratuits.** Depuis quelques années, Google affiche des fiches produits gratuites (pas de la pub payante) dans l'onglet Shopping, la recherche Google et Google Images, à partir du flux produits Shopify — aucun budget requis, seulement des fiches produits complètes et bien renseignées ([feedops.com](https://feedops.com/feedops/google-shopping-free-listings/)). Pour un budget serré, c'est la meilleure première étape avant même la pub payante : zéro coût, visibilité réelle sur Google.

**Réseaux sociaux organiques (contenu, pas pub).** Avec des comptes déjà créés mais peu actifs, republier 3-4 fois par semaine avec du contenu produit ciblé (voir section 4) ne coûte rien et construit la marque sur la durée — c'est la partie "marque durable" de ta demande.

### 5.2 Ce qui vaut la peine de payer, avec ton budget

**Meta Ads (Facebook + Instagram) — recommandé en priorité.** C'est la plateforme la plus adaptée à un petit budget : un budget de test réaliste pour l'e-commerce tourne autour de 10 à 50€/jour selon les guides spécialisés ([j7media.com](https://www.j7media.com/quel-budget-pour-demarrer-sur-facebook-ads/)) — en dessous de 10€/jour ça reste possible mais l'algorithme apprend plus lentement et il ne faut tester qu'une seule audience/publicité à la fois pour ne pas diluer l'apprentissage. Avec 200€/mois, viser 5 à 7€/jour est réaliste et cohérent avec cette recommandation.

**TikTok Ads — pas encore, à revoir plus tard.** Le budget minimum officiel de TikTok est de 50€/jour par campagne, et les guides spécialisés recommandent en pratique 500 à 1000€/mois pour obtenir des résultats exploitables ([roads.social](https://www.roads.social/ressource/blog-prix-publicite-tiktok-ads)) — largement au-dessus de l'enveloppe actuelle. **Le contenu organique TikTok (gratuit), lui, reste totalement pertinent dès maintenant** — seule la pub payante TikTok est à mettre de côté pour l'instant, à reconsidérer si le budget grandit ou si les ventes générées par Meta permettent de réinvestir.

**Récapitulatif budget mensuel réaliste (≈200€) :**

| Poste | Coût | Fréquence |
|---|---|---|
| Google Merchant Center (listings gratuits) | 0€ | Une fois, puis mise à jour continue automatique |
| Contenu organique réseaux sociaux | 0€ (ton temps) | 3-4 publications/semaine |
| Email (capture + envois) | 0€ (Shopify Email gratuit jusqu'à un certain volume) | 1-2 envois/mois pour commencer |
| Meta Ads (Facebook + Instagram) | ≈150-200€ | 5-7€/jour, en continu sur 1 seule campagne |

---

## 6. Trajectoire 3-6 mois

- **Mois 1** : fondations techniques (pixels, email, Merchant Center) + 1ère campagne Meta Ads sur Bijoux, mesure des premiers résultats.
- **Mois 2** : si les premières ventes Meta Ads sont rentables, augmenter progressivement le budget (jamais doubler d'un coup) ; sinon, tester une 2e audience ou un 2e produit d'appel avec le même budget. Commencer les emails réguliers (relance panier abandonné, nouveautés).
- **Mois 3** : réapprovisionner en priorité Chaussures et Sacs femme (meilleures ventes, catalogue trop pauvre actuellement — voir section 2) puis les mettre en avant à leur tour.
- **Mois 4-6** : construire une routine de contenu (calendrier éditorial simple, 1 catégorie mise en avant par mois), envisager les avis clients (Judge.me, déjà en place selon le guide fournisseurs) comme preuve sociale dans les publicités, réévaluer si un budget TikTok Ads devient réaliste.

**Fil conducteur** : chaque mois, une seule priorité produit/catégorie claire en communication, jamais "tout le catalogue" — c'est ce qui permet de construire une marque reconnaissable avec un petit budget, plutôt que de se disperser.

---

## 7. Indicateurs à suivre (simple, sans outil payant)

- **Visiteurs du site** → Google Analytics 4 (gratuit, à installer en semaine 1).
- **Coût par clic / coût par achat sur Meta** → directement dans Meta Ads Manager (gratuit, inclus).
- **Taux de conversion** (visiteurs → acheteurs) → Google Analytics 4, objectif réaliste à discuter après les premières semaines de données réelles (pas de chiffre à inventer avant d'avoir des données).
- **Emails collectés** → tableau de bord Shopify Email ou l'outil choisi.
- **Panier moyen** → déjà visible dans Shopify Admin → Analyses.

Ne pas juger une campagne avant au moins 5-7 jours de données — c'est le temps nécessaire aux algorithmes (Meta, Google) pour apprendre qui cibler.

---

## 8. Ce que je peux faire pour toi dès maintenant

Dis-moi simplement lesquelles de ces actions tu veux que je fasse, et je m'en occupe :

- Installer Google Analytics 4 et le Meta Pixel sur le site (j'ai besoin des identifiants une fois tes comptes créés).
- Ajouter un champ de capture d'email (newsletter / code promo bienvenue) en pied de page ou en pop-up.
- Ajouter tes liens réseaux sociaux dans le footer du site.
- Connecter le flux produits Shopify à Google Merchant Center techniquement.
- Mettre en avant visuellement la catégorie Bijoux sur la page d'accueil (bannière, mise en avant).
- Configurer une relance automatique de panier abandonné (email, si tu as un outil email connecté).

Tout le reste (créer les comptes pub, choisir/valider les visuels, écrire les légendes, publier sur les réseaux, lancer et surveiller le budget des campagnes) reste de ton côté — je peux te guider étape par étape si besoin, comme on l'a fait pour GitHub.
