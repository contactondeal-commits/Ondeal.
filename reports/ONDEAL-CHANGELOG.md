# CHANGELOG — Session du 02/09/2026

| Date | Fichier | Modification | Raison | Impact | Validation |
|---|---|---|---|---|---|
| 02/09/2026 | `src/app/layout.tsx` | Ajout `metadata`, `viewport`, JSON-LD `Organization` | Phase 1 SEO du brief — absent du fichier réel malgré le récap du 01/09 | SEO, confiance | Non déployé |
| 02/09/2026 | `src/context/LocationContext.tsx` | `currency_symbol: "EUR"` → `"€"` (zone euro), "des 80EUR" → "dès 80 €" | Bug confirmé en live : prix affichés sans symbole € ni virgule française | Conversion, image premium | Non déployé |
| 02/09/2026 | `src/app/api/partenaires/route.ts` | Handler POST restauré (contenait par erreur le flux Google Shopping) | Formulaire partenaires cassé à 100% | Acquisition partenaires | Non déployé |
| 02/09/2026 | `src/app/partenaires/page.tsx` | Honeypot anti-spam, typage `React.FormEvent` | Cohérence avec le fix de la route API | Sécurité, qualité code | Non déployé |
| 02/09/2026 | `src/app/api/ask-question/route.ts` | Échappement HTML, honeypot, limites de longueur | Injection HTML possible dans l'email envoyé à l'équipe support | Sécurité | Non déployé |
| 02/09/2026 | `src/components/products/QuestionForm.tsx` | Champ honeypot ajouté | Cohérence avec le fix de la route API | Sécurité | Non déployé |
| 02/09/2026 | `src/app/feed/google-shopping.xml/route.ts` | g:sale_price séparé de g:price, images additionnelles, item_group_id, custom_label_0 | Priorité "fix misrepresentation" du récap du 01/09 ; code retrouvé égaré dans api/partenaires/route.ts | Acquisition Google Shopping | Non déployé |
| 02/09/2026 | `src/app/product/[slug]/page.tsx` | `export const revalidate = 3600` | Pages en SSG pur, jamais rafraîchies sans redéploiement complet | Fraîcheur stock/prix | Non déployé |
| 02/09/2026 | `src/app/category/[slug]/page.tsx` | `export const revalidate = 3600` | Idem | Fraîcheur stock/prix | Non déployé |
| 02/09/2026 | `next.config.ts` | `poweredByHeader: false` | Durcissement mineur (masque l'en-tête X-Powered-By) | Sécurité (mineur) | Non déployé |

Aucun fichier n'a été supprimé. Aucune donnée Shopify (prix, stock,
produits, collections), aucune donnée client, aucun paramètre de compte
n'a été modifié. Toutes les modifications sont sur des fichiers de code
source, écrites en local sur l'ordinateur de l'utilisateur — rien n'a été
commité dans Git ni déployé sur Vercel.
