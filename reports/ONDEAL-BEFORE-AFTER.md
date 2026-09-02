# AVANT / APRÈS — Session du 02/09/2026

| ID | Problème | Avant | Correction | Après | Validation |
|---|---|---|---|---|---|
| OND-001 | Prix affichés "25.10 EUR" au lieu de "25,10 €" | `currency_symbol: "EUR"` dans `LOCATION_CONFIG` (zone euro) | `currency_symbol: "€"` + virgule française dans `shipping_rate` | Prix affichés "25,10 €" une fois déployé | CONFIRMÉ en live (bug reproduit sur ondeal.fr avant fix) ; fix non déployé |
| OND-002 | Formulaire /partenaires : 100% d'échec (405, pas de handler POST) | `api/partenaires/route.ts` contenait le code du flux Google Shopping | Handler POST restauré (Resend + validation + honeypot) | Formulaire fonctionnel | PROBABLE — code relu, non testé en soumission réelle (pas d'accès terminal) |
| OND-003 | Aucune metadata globale / JSON-LD Organization | `layout.tsx` : uniquement les scripts Google Ads | `metadata`, `viewport`, JSON-LD Organization ajoutés | `<title>`, meta description, OG, JSON-LD présents | CONFIRMÉ que c'était absent en live (`<title>` vide constaté) ; fix non déployé |
| OND-004 | Injection HTML possible dans l'email de `/api/ask-question` | `${question}` interpolé sans échappement | `escapeHtml()` appliqué à tous les champs | Email texte affiché tel quel, pas exécutable | PROBABLE — code relu, non testé en envoi réel |
| OND-005 | Pages produit/catégorie en SSG pur, jamais rafraîchies sans redéploiement | Pas de `revalidate` | `export const revalidate = 3600` | Stock/prix rafraîchis toutes les heures max | PROBABLE — un vrai test nécessite un déploiement |
| OND-006 | Flux Google Shopping sans sale_price séparé ni images additionnelles | `feed/google-shopping.xml/route.ts` version simple | Champs enrichis récupérés depuis le code égaré | Flux XML plus complet pour Merchant Center | À VÉRIFIER — nécessite un contrôle dans Google Merchant Center après déploiement |
| OND-007 | `next.config.ts` : en-tête `X-Powered-By: Next.js` visible | Pas de `poweredByHeader` | `poweredByHeader: false` | En-tête masqué | PROBABLE — non testé en requête réelle |
