# Gérer les produits, prix, stock et catégories toi-même

Tout se passe dans **Shopify Admin** (`admin.shopify.com/store/ondeal-5513`) → menu **Produits**. Aucun code, aucune intervention de ma part n'est nécessaire pour tout ce qui suit.

⏱️ Toute modification apparaît sur ondeal.fr **automatiquement, en moins d'une minute**.

## Changer un prix

1. Produits → ouvrir la fiche du produit
2. Champ **Prix** → nouveau prix → Enregistrer
3. (Optionnel) Champ **Prix comparé à** = ancien prix, pour afficher une réduction barrée (ex: "~~49,90€~~ 34,90€ -30%") — c'est automatique sur le site dès que ce champ est rempli.

Pour changer beaucoup de prix d'un coup : Produits → cocher plusieurs produits → **Modifier en masse**.

## Changer le stock / marquer en rupture

1. Produits → ouvrir la fiche → section **Inventaire**
2. Modifier la quantité disponible
3. Pour marquer "rupture de stock" volontairement : mettre la quantité à 0 (le site affichera "Rupture de stock" et désactivera le bouton d'achat automatiquement)

## Ajouter un nouveau produit

1. Produits → **Ajouter un produit**
2. Renseigner : titre, description, images, prix, stock
3. Si le produit a des tailles/couleurs : section **Variantes** → ajouter les options (ex: "Taille" avec valeurs S/M/L, ou "Couleur"). Le sélecteur sur la fiche produit du site les affichera automatiquement — rien d'autre à faire.
4. **Important : ajouter la bonne catégorie** (voir section suivante) avant d'enregistrer, sinon le produit reste invisible dans les rayons du site.
5. Statut du produit : bien mettre **Actif** (sinon il n'apparaît jamais sur le site, même avec le bon tag).

## La catégorie d'un produit — la seule chose à ne pas oublier

Le site **n'utilise pas** les "Collections" Shopify pour classer les produits. La catégorie est déterminée **uniquement par une étiquette (tag)** sur la fiche produit, au format :

```
cat-XXXX
```

**Exemple** : pour qu'un produit apparaisse dans "Femme → Chaussures", ajoute le tag `cat-femme-chaussures` dans le champ **Étiquettes** de la fiche produit, puis Enregistrer.

- Un produit peut avoir **plusieurs** tags `cat-...` s'il doit apparaître dans plusieurs rayons.
- Le tag doit être écrit **exactement** comme dans la liste ci-dessous (minuscules, tirets) — une faute de frappe rend le produit invisible dans les catégories (il reste trouvable par la recherche uniquement).

### Liste complète des catégories et de leur tag

| Rayon | Sous-catégorie | Tag à utiliser |
|---|---|---|
| Électronique | Téléphones | `cat-telephones` |
| Électronique | Tablettes | `cat-tablettes` |
| Électronique | Ordinateurs | `cat-ordinateurs` |
| Électronique | Télévisions | `cat-tv` |
| Électronique | Audio | `cat-audio` |
| Électronique | Photo | `cat-photo` |
| Électronique | Accessoires | `cat-accessoires-electronique` |
| Électronique | Vidéoprojecteurs | `cat-videoprojecteurs` |
| Informatique | PC portables | `cat-pc-portables` |
| Informatique | PC fixes | `cat-pc-fixes` |
| Informatique | Écrans | `cat-ecrans` |
| Informatique | Claviers | `cat-claviers` |
| Informatique | Souris | `cat-souris` |
| Maison | Cuisine | `cat-cuisine` |
| Maison | Meubles | `cat-meubles` |
| Maison | Décoration | `cat-decoration` |
| Maison | Électroménager | `cat-electromenager` |
| Maison | Rangement | `cat-rangement` |
| Mode → Femme | Vêtements | `cat-femme-vetements` |
| Mode → Femme | Chaussures | `cat-femme-chaussures` |
| Mode → Femme | Sacs | `cat-femme-sacs` |
| Mode → Femme | Accessoires | `cat-femme-accessoires` |
| Mode → Homme | Vêtements | `cat-homme-vetements` |
| Mode → Homme | Chaussures | `cat-homme-chaussures` |
| Mode → Homme | Montres | `cat-homme-montres` |
| Mode → Homme | Accessoires | `cat-homme-accessoires` |
| Mode → Enfants | Bébés | `cat-bebes` |
| Mode → Enfants | Filles | `cat-filles` |
| Mode → Enfants | Garçons | `cat-garcons` |
| Mode | Vêtements mixte/unisexe | `cat-vetements-mixte` |
| Mode | Bijoux | `cat-bijoux` |
| Beauté & Bien-être | Soins visage | `cat-soins-visage` |
| Beauté & Bien-être | Maquillage | `cat-maquillage` |
| Beauté & Bien-être | Parfums | `cat-parfums` |
| Beauté & Bien-être | Bien-être / Massage | `cat-bien-etre-massage` |
| Jardin | Mobilier de jardin | `cat-mobilier-jardin` |
| Jardin | Outils | `cat-outils-jardin` |
| Jardin | Barbecue | `cat-barbecue` |
| Sport | Fitness | `cat-fitness` |
| Sport | Running | `cat-running` |
| Sport | Football | `cat-football` |
| Livres | Romans | `cat-romans` |
| Livres | BD | `cat-bd` |
| Livres | Jeunesse | `cat-jeunesse-livres` |
| Jeux et jouets | Jeux de société | `cat-jeux-societe` |
| Jeux et jouets | Jouets | `cat-jouets` |
| Jeux et jouets | Jeux vidéo | `cat-jeux-video` |
| Bricolage | Outillage | `cat-outillage` |
| Bricolage | Quincaillerie | `cat-quincaillerie` |
| Animalerie | Chiens | `cat-chiens` |
| Animalerie | Chats | `cat-chats` |

Besoin d'une catégorie qui n'est pas dans cette liste (nouveau rayon complet) ? Ça nécessite mon intervention : je dois créer la catégorie dans le code du site avant qu'un tag puisse la cibler.

⚠️ **Piège connu** : les ~148 produits Bijoux du catalogue portent aujourd'hui les tags `bijoux` et `chat-bijouxx` (fautes historiques) au lieu de `cat-bijoux` — ils sont donc actuellement **invisibles** dans le rayon Bijoux du site. Si tu veux que je corrige ça en une fois pour tous ces produits, dis-le-moi.

## Le sélecteur de taille/couleur (nouveauté du 15/08/2026)

Depuis peu, les clients doivent choisir une taille/couleur avant de pouvoir ajouter un produit à variantes au panier (avant, le site ajoutait une taille au hasard — corrigé). Ça fonctionne automatiquement dès que tu configures des **Variantes** sur un produit dans Shopify — rien à faire de plus de ton côté.

## Ce qui NE nécessite PAS mon intervention (résumé)

- Prix, stock, rupture de stock
- Ajouter / modifier / supprimer un produit
- Catégorie d'un produit (tag `cat-...`)
- Variantes (tailles, couleurs)
- Photos et description produit
- Codes promo, remises (app "Smart Discounts")

## Ce qui NÉCESSITE mon intervention (code)

- Le design du site, l'ajout de nouvelles sections
- Une nouvelle fonctionnalité (comme le sélecteur de taille)
- Une toute nouvelle catégorie qui n'existe pas dans la liste ci-dessus
- Un bug ou un problème d'affichage
