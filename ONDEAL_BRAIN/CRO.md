# CRO.md — Conversion & expérience d'achat

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026.*

## Bugs corrigés cette session (CONFIRMÉ, impact direct sur la conversion)

- **Symbole de devise cassé** : `LocationContext.tsx` affichait `currency_symbol: "EUR"` au lieu de `"€"` pour toutes les zones euro — bug live affectant l'affichage de chaque prix du site avant correction. Impact CRO potentiellement significatif (un prix mal formaté peut réduire la confiance à l'achat), non quantifiable rétroactivement faute de données analytics.
- **Formulaire partenaires 100 % cassé** (405 sur toute soumission, endpoint POST manquant) — corrigé. Tout partenaire ayant tenté de contacter OnDeal avant cette correction n'a jamais reçu de réponse.
- **Faille d'injection HTML** dans l'email de la fonctionnalité "poser une question" — corrigée (échappement + honeypot anti-spam). Sans lien direct avec la conversion, mais un risque de sécurité/réputation réel qui aurait pu être exploité.

## Ce qui reste non audité en détail cette session

- Tunnel d'achat complet (panier → checkout Shopify) : non re-testé en navigation live cette session (le rapport `phase6-master-audit.md` du 14/08/2026 avait testé le drawer panier, le focus trap, le CTA sticky mobile côté code Next.js, mais avait aussi noté que `ondeal.fr` servait alors le thème Shopify Dawn et non l'app Next.js — **statut actuel du déploiement réel non re-confirmé page par page cette session au-delà de la page d'accueil**, voir DATA.md).
- Format d'affichage des prix : une vérification live de la page d'accueil ce 02/09/2026 a montré des prix au format "25.10 €" (symbole € présent, mais séparateur décimal point plutôt que virgule française) — **À VÉRIFIER** si ce format est intentionnel ou un résidu du bug de devise, et si le séparateur décimal français serait attendu par les visiteurs.
- Aucune donnée de taux de conversion, taux d'abandon panier réel, ou heatmap consultée — **INACCESSIBLE** (pas d'outil analytics branché).

## Recommandations

1. **Vérifier le format d'affichage des prix (virgule vs point décimal)** sur un échantillon de pages produit réelles — faible risque, correction de code simple si confirmé nécessaire.
2. **Re-tester le tunnel d'achat complet** (ajout panier → checkout) en navigation live pour confirmer qu'aucune régression n'existe suite aux corrections de cette session.
3. Ne pas prioriser de refonte CRO ambitieuse tant qu'aucune donnée comportementale réelle n'est disponible — le risque est d'optimiser à l'aveugle.
