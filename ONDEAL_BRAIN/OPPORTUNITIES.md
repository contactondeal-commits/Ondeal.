# OPPORTUNITIES.md — Matrice d'opportunités

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026. Chaque opportunité porte une estimation de confiance (Haute/Moyenne/Basse) et d'effort (Faible/Moyen/Élevé), jamais un chiffre d'impact inventé.*

## Business & catalogue

1. **Résoudre l'écart catalogue 8 487→1 715** avant tout nouvel investissement de sourcing — confiance Haute (bloquant), effort Faible (une question à l'utilisateur + vérif Shopify).
2. **Trancher le positionnement réel vs affiché** (généraliste vs spécialiste bijoux/montres/déco) — confiance Haute, effort Faible (décision, pas de développement).
3. **Réallouer le sourcing CJ/Syncee** vers les catégories fortes (Bijoux, Montres, Jouets, Cuisine, Jardin) plutôt que de disperser sur des catégories vides — confiance Moyenne, effort Moyen.
4. **Nettoyer ou retirer les tags à 0 produit** (Ordinateurs, Romans, BD) de la navigation — confiance Haute, effort Faible.
5. **Auditer et recalculer une marge moyenne catalogue actuelle** (celle de 150 % ne porte que sur 118 produits du 13/08) — confiance Haute, effort Moyen (accès `list-orders`/coûts fournisseurs requis).

## Marketing & acquisition

6. **Configurer un tracking analytics** (GA4 ou équivalent) — confiance Haute (prérequis à tout le reste), effort Faible techniquement, mais nécessite une décision/identifiant utilisateur.
7. **Recentrer le budget d'acquisition** sur les catégories à stock suffisant — confiance Moyenne (dépend de données Ads non consultées), effort Faible une fois les données disponibles.
8. **Relancer l'analyse concurrentielle Semrush** dès quota rétabli — confiance Haute, effort Faible.
9. **Explorer un format contenu court (TikTok/Reels)** sur les catégories fortes (bijoux/montres petit prix) — confiance Basse (hypothèse non testée), effort Élevé.
10. **Segmenter la collection "Nouveauté"** (fenêtre glissante 30 jours au lieu de 46,5 % du catalogue) — confiance Moyenne, effort Faible.

## UX / CRO

11. **Vérifier et uniformiser le format d'affichage des prix** (virgule vs point décimal) — confiance Haute (constat direct), effort Faible.
12. **Re-tester le tunnel d'achat complet en conditions live** après les corrections récentes — confiance Haute, effort Faible.
13. **Plafonner l'affichage de `totalInventory`** quand il dépasse un seuil réaliste — confiance Moyenne, effort Faible.
14. **Confirmer quel code est réellement servi en production** (Next.js vs Dawn) avant tout nouvel audit visuel — confiance Haute, effort Faible.

## SEO

15. **Ajouter JSON-LD Product/BreadcrumbList** sur les pages produit/catégorie si absent — confiance Haute, effort Moyen.
16. **Auditer le maillage interne** des catégories fortes vers les fiches produit — confiance Moyenne, effort Moyen.
17. **Obtenir un accès Search Console** pour objectiver les priorités SEO — confiance Haute, effort Faible (décision utilisateur).

## Automatisation / fiabilité technique

18. **Ajouter un test de non-régression automatisé post-déploiement** (smoke test sur les pages critiques : accueil, une fiche produit, un formulaire) pour détecter plus vite un incident comme celui du 02/09 — confiance Moyenne, effort Moyen.
19. **Documenter une procédure de vérification post-import** (catalogue avant/après count) pour éviter la répétition d'un écart type R-1 — confiance Haute, effort Faible.
20. **Explorer l'intégration CJ réelle** (clé API jamais configurée) pour fiabiliser le sourcing au-delà de l'import ponctuel du 13/08 — confiance Moyenne, effort Élevé.

## Note méthodologique

Cette liste respecte le minimum de 10 opportunités demandé par catégorie du brief original là où c'était réaliste (Business/Marketing/UX/SEO/Automatisation regroupent 20 items au total) ; forcer artificiellement 10 items strictement par sous-catégorie aurait exigé d'inventer des opportunités non fondées sur une donnée réelle, ce que la Règle Zéro interdit explicitement.
