# Bilan OnDeal — 03/09/2026

*Vue d'ensemble consolidée : administratif, marketing, site & catalogue. Statuts au moment de la rédaction.*

---

## Résumé exécutif

| Volet | État global |
|---|---|
| Administratif / conformité | 🟡 Presque clos — 1 signature de ta part à faire (INPI) |
| Marketing / tracking Google Ads | 🟢 Terminé et en ligne |
| Marketing / Pinterest | 🟢 Terminé |
| Marketing / GA4 e-commerce | 🔴 Non fonctionnel — décision à prendre |
| Site — inventaire/checkout | 🟡 Fix appliqué, à revérifier |
| Catalogue — 4 chantiers structurés | 🟢 Terminés (0 échec) |
| Catalogue — sujets en attente de ta décision | 🔴 Plusieurs, listés en bas |

Le point le plus urgent : **signer la formalité INPI J00277542650** — c'est la seule chose qui bloque encore le changement d'adresse officielle d'OnDeal. Le reste de ce document détaille tout, dans l'ordre.

---

## 1. Administratif & conformité

### 1.1 Amazon Seller Identity Verification (SIV) — probablement terminé, à confirmer

- Mission : lever les erreurs de vérification d'identité Amazon Seller Central (champ "Nom commercial" ne correspondant pas au KBIS).
- Valeur correcte identifiée à partir de l'attestation de domiciliation KANDBAZ : **"ALEX BROU - ONDEAL.FR"**.
- Deux photos de ta carte d'identité (HEIC) converties en JPEG et livrées, pour le format accepté par Amazon.
- Tu as rempli et soumis le formulaire toi-même. L'onglet Amazon a évolué vers l'URL `.../verification-in-progress/render`, ce qui indique une soumission réussie.
- **À confirmer par toi** : est-ce que tout est bien passé de ton côté ? Si oui, il ne reste qu'à attendre la décision d'Amazon (généralement quelques jours).

### 1.2 INPI — Changement d'adresse OnDeal — action requise de ta part

- Ancienne adresse officielle (établissement principal, publique) : 35 Avenue Colonel Fabien, 78210 Saint-Cyr-l'École — **c'était ton adresse personnelle**, exposée publiquement sur le registre.
- Nouvelle adresse à faire apparaître : **231 rue Saint-Honoré, 75001 Paris** (domiciliation KANDBAZ, dénomination "ALEX BROU - ONDEAL.FR").
- Une première formalité (J00274284967, déposée le 22/08) existait déjà mais était **restée bloquée "en attente de signature"** depuis 2 semaines, et il lui manquait en plus un document obligatoire (l'attestation de domiciliation n'avait jamais été jointe — seule la carte d'identité l'était).
- **Corrigé aujourd'hui** :
  - Attestation de domiciliation KANDBAZ ajoutée au dossier.
  - Copie de carte d'identité remplacée par une version recto/verso plus nette (recadrée, redressée).
  - Dossier redéposé sous la nouvelle référence **J00277542650** (70,00 €), avec 3 pièces jointes désormais complètes.
- **🔴 Action requise de ta part, maintenant** : cliquer sur **"Signer la formalité"** sur la page du dossier (FranceConnect+ ou certificat qualifié selon ton mode de connexion) — je ne peux pas signer à ta place, c'est un acte personnel.
- Une fois signée, la formalité suit : paiement (70 €) → validation INSEE → validation Tribunal de Commerce de Paris → adresse publique mise à jour.
- **Bonus repéré au passage** : 2 autres formalités à toi (Y00274281229 du 22/08, et J00268710779 du 31/07, gratuite) sont elles aussi bloquées "en attente de signature" depuis longtemps. À vérifier si elles sont encore utiles ou à supprimer, quand tu te connectes pour signer celle-ci.

---

## 2. Marketing & acquisition

### 2.1 Google Ads — tracking conversions — ✅ Terminé, en ligne

- Nouveau tag `AW-18380483895` (remplace l'ancien, mort). Diagnostic : la variable Vercel était obsolète + les 4 libellés de conversion codés en dur pointaient vers l'ancien tag.
- 4 signaux corrigés et actifs, réglés en **secondaire** (n'influencent pas les enchères, seul l'Achat reste l'objectif principal) : ajout panier, paiement initié, vue produit, recherche.
- Code mis à jour dans le dépôt, variable Vercel corrigée, redéploiement production réussi, `.env.local` mis à jour par toi en local. **Rien à faire de plus ici.**
- Limite connue (pas un bug) : le signal "recherche" n'a pas encore de point d'appel réel dans le code actuellement disponible (la page de recherche semble absente de la copie fournie) — restera inactif tant que ce code n'existe pas.
- 6 liens annexes ("sitelinks") créés sur la campagne Performance Max, en cours d'examen par Google au moment de leur création.

### 2.2 Pinterest — ✅ Terminé

- Instagram connecté, 5 domaines revendiqués, app Shopify Pinterest connectée avec accès complet : déjà optimal avant intervention.
- 5 mots-clés d'exclusion ajoutés (`sponsorisé`, `partenariat`, `AD`, `publicité`, `code promo`) pour éviter la republication automatique de posts Instagram sponsorisés sur Pinterest.
- "Vitrine Amazon" : ce n'est pas un lien de compte simple, ça redirige vers une candidature au **Programme Influenceurs Amazon**, pour lequel le compte Pinterest n'est pas éligible (audience insuffisante). Ce n'est pas un bug technique, c'est une contrainte Amazon — décision business à prendre plus tard si tu veux tenter via un autre réseau social.

### 2.3 GA4 — mesure e-commerce — 🔴 Non fonctionnel, décision à prendre

- Constat (session du 02/09) : **0 ajout panier, 0 achat, 0 € de revenu enregistré dans GA4** sur la période 1 janv.–1 sept. 2026, alors que du trafic réel existe (sessions directes, organic, social, referral, paid search) et qu'une commande réelle a bien été payée (#1001, 34,80 €, 04/08/2026).
- Cause : dans les pixels natifs Shopify (Réglages → Événements clients), aucun pixel Google Analytics / GA4 n'est connecté (seulement Parcel Panel, Judge.me, Klaviyo, Microsoft Clarity, Pinterest, Smart Pricing).
- Conséquence directe : impossible aujourd'hui de mesurer objectivement l'effet de n'importe quel correctif marketing ou CRO sans aller vérifier manuellement dans Shopify.
- **Décision à prendre** : connecter un pixel Google Analytics / app "Google & YouTube" dans Shopify (ID de mesure GA4 `a404641760p550064079` déjà identifié), ou étendre un pixel web personnalisé pour émettre les événements standards (`add_to_cart`, `begin_checkout`, `purchase`).

---

## 3. Site — technique, inventaire, checkout

### 3.1 Bug critique inventaire/checkout — 🟡 Fix appliqué, à reconfirmer

- Cause trouvée du taux de conversion quasi nul : sur les 15 688 variantes du catalogue, le stock existait seulement aux emplacements des fournisseurs (CJ, DSers, Syncee, etc.), jamais à l'emplacement boutique utilisé par Shopify pour valider un achat. Résultat : produits affichés "en stock" mais **impossibles à acheter réellement** (redirection vers une erreur au moment de payer).
- 14 785 variantes concernées (stock > 0). 400 corrigées manuellement en direct (vérifiées, 0 erreur), puis les 14 385 restantes lancées via un import Matrixify (job `738112804`).
- **État à la fin de la dernière session sur ce point : import en cours (411/1414 lots traités, 0 échec)** — pas encore confirmé terminé à 100 %.
- **🔴 À faire dans une prochaine session** : vérifier l'achèvement du job Matrixify `738112804` et refaire un test d'achat réel sur une variante auparavant bloquée.

### 3.2 Identité visuelle du checkout — ✅ Terminé

- Palette, couleurs de fond, typographie (Inter) alignées avec le site principal, appliquées et vérifiées dans l'éditeur Shopify (l'API de branding avancée n'étant pas disponible sur ce plan Shopify).

### 3.3 Catalogue — 4 chantiers structurés (session du 02/09) — ✅ Tous terminés, 0 échec

| Chantier | Résultat |
|---|---|
| Repricing variantes sans coût fournisseur (arrondi ,99) | 28/28 mis à jour |
| Traduction descriptions (titre FR / description EN) | 251/258 candidats traduits (7 hors périmètre, titre pas en français) |
| Nettoyage handles non-ASCII | 1/1 corrigé |
| `product_type` manquant/incohérent (1610 produits) | 1610/1610 mis à jour |

---

## 4. Sujets en attente de ta décision (hérités, non résolus)

Ces points reviennent dans plusieurs sessions précédentes et nécessitent une décision de ta part avant que j'agisse :

1. **Écart catalogue non expliqué** : 8 487 produits déclarés le 13/08 vs 1 715–1 753 mesurés depuis — à élucider (suppression volontaire ? erreur de comptage antérieure ?).
2. **110 produits sans aucune catégorie `cat-XXXX`** (donc invisibles dans les rayons du site) : 70 propositions claires de catégorie rédigées, 30 ambiguës, 10 bloquées — en attente de validation avant tout import.
3. **Alerte contrefaçon potentielle** : produits LEGO / One Piece / Playmobil / Snoopy / PAW Patrol repérés — décision toujours en attente de ta part.
4. **Positionnement stratégique** : le site affiche une navigation généraliste (11 catégories) alors que le catalogue réel est concentré sur bijoux, montres homme, jouets, cuisine, jardin, beauté — à trancher.
5. **Catégories vides dans la navigation** (Ordinateurs, Romans, BD, etc.) : à confirmer si elles peuvent être retirées.
6. Fichier `AGENTS.md`/`CLAUDE.md` à la racine du dépôt contenant un texte suspect ressemblant à une tentative d'injection de prompt (pas suivi, pas exécuté) — à vérifier avec l'historique git.

---

## 5. Ce qu'il te reste à faire, dans l'ordre

1. **Maintenant** : signer la formalité INPI J00277542650 (bouton "Signer la formalité").
2. Confirmer que la vérification d'identité Amazon (SIV) s'est bien terminée de ton côté.
3. Décider comment reconnecter un pixel GA4 fonctionnel sur Shopify (app officielle vs pixel personnalisé).
4. Dans une prochaine session : vérifier la fin du job Matrixify d'activation de stock (738112804) et retester un achat réel.
5. Trancher les 5 sujets catalogue/stratégie listés en section 4, quand tu auras le temps — aucun n'est urgent, mais ils bloquent chacun un chantier en attente.

---

*Document généré à partir des sessions du 02/09 et 03/09/2026. Détail complet de chaque sujet disponible dans les documents de session correspondants du projet.*
