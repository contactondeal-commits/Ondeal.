# EXPERIMENTS.md — Expérimentations

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026.*

## État actuel

Aucun outil d'A/B testing, aucune expérimentation en cours ou passée n'a été identifié dans le dépôt ou les rapports historiques. **CONFIRMÉ par absence constatée.**

## Pourquoi ce fichier reste volontairement vide de "résultats"

Sans tracking analytique actif (voir DATA.md), aucune expérimentation ne peut être mesurée correctement aujourd'hui. Lancer des tests A/B avant d'avoir un socle de mesure serait produire des conclusions non fiables. Ordre recommandé : (1) combler le trou de tracking, (2) définir 2-3 métriques de référence stables (voir KPI.md), (3) seulement ensuite lancer des expérimentations mesurables.

## Backlog d'expérimentations candidates (HYPOTHÈSE, à valider une fois le tracking en place)

1. Réduire la taille de la collection "Nouveauté" (actuellement 796 produits / ~46,5 % du catalogue) à une fenêtre glissante de 30 jours, et mesurer l'effet sur le taux de clic depuis la page d'accueil.
2. Tester l'affichage du format de prix (virgule vs point décimal) pour vérifier s'il a un effet mesurable sur la conversion.
3. Tester le retrait des catégories de navigation quasi vides (Ordinateurs, Romans, BD) vs leur maintien, sur le taux de rebond.

Ces trois pistes sont des candidats raisonnables déduits des données disponibles, pas des recommandations à exécuter immédiatement sans mesure.
