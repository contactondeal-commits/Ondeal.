# POSITIONING.md — Positionnement

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026.*

## Ce qui est affiché (CONFIRMÉ via code/site)

Le nom de marque et les métadonnées globales (`src/app/layout.tsx`, corrigées le 01-02/09/2026) présentent OnDeal via `SITE_NAME`/`COMPANY_LEGAL_NAME`. Le site pratique la livraison gratuite dès 80 € (corrigé cette session dans `LocationContext.tsx`, qui affichait auparavant "gratuit des 80EUR" — bug de texte, pas de politique). Mentions légales : médiateur CM2C, plateforme ODR européenne — présence d'un cadre de conformité e-commerce français standard.

## Ce que le catalogue réel dit du positionnement (PROBABLE, déduit des données BUSINESS.md)

Malgré une arborescence affichée qui suggère un généraliste multi-univers (Électronique, Informatique, Maison, Mode, Beauté, Jardin, Sport, Livres, Jeux/jouets, Bricolage, Animalerie), le catalogue réel est concentré à plus de 30 % sur Bijoux + Montres homme (267 produits / 1 710, soit ~16 % à eux deux rien que sur ces deux tags), avec un poids fort de Jouets, Cuisine, Jardin, Beauté. L'Électronique/Informatique — segments à fort trafic recherche — représentent une fraction marginale (<3 % du catalogue actif tous tags confondus).

**Conséquence de positionnement (HYPOTHÈSE à tester)** : OnDeal se comporte aujourd'hui, dans les faits, plus comme un site "bijoux/montres/déco/jouets à petit prix" que comme le généraliste multi-catégories que son menu promet. Ce n'est ni bon ni mauvais en soi, mais un décalage entre promesse de navigation et réalité d'inventaire peut coûter cher en taux de rebond sur les catégories creuses (voir CRO.md, SEO.md).

## Ce qui manque pour un positionnement complet — À VÉRIFIER / INACCESSIBLE

- Aucune étude de perception de marque, aucun NPS, aucun retour client structuré consulté cette session.
- Aucune donnée Semrush disponible (quota API insuffisant — **INACCESSIBLE**) pour comparer le positionnement perçu vs celui des concurrents.
- Aucune définition écrite trouvée dans le dépôt d'un "pourquoi OnDeal plutôt qu'Amazon/Cdiscount/Vinted/AliExpress" — proposition de valeur différenciante non documentée. **À VÉRIFIER auprès de l'utilisateur : quelle est l'intention stratégique — bonnes affaires généralistes, spécialiste bijoux/montres, dropshipping tendance ?**

## Recommandation (PROBABLE, pas une décision prise)

Deux voies honnêtes s'offrent, mutuellement non exclusives à court terme : (a) assumer et renforcer le positionnement réel (bijoux/montres/déco/jouets à petit prix, où le catalogue est déjà fort), ou (b) réinvestir sourcing CJ/Syncee vers l'électronique/informatique pour honorer la promesse de navigation généraliste. Un choix explicite évite de disperser le budget d'acquisition sur des catégories vides (voir MARKETING.md, PRODUCT_STRATEGY.md).
