# AUDIT ONDEAL — Session du 02/09/2026

Mode : autonomie complète (validé par l'utilisateur). Ce rapport ne couvre
que ce qui a été **réellement inspecté** dans cette session : le code source
(échantillon large, pas exhaustif sur les ~150+ fichiers de `src/`), le
site public ondeal.fr (accueil, panier), et les rapports laissés par les
sessions précédentes (01/09/2026, dans `reports/` et `ONDEAL_AUTONOMOUS/`).
Chaque affirmation est marquée **CONFIRMÉ** (vérifié directement),
**PROBABLE** (déduit, non testé en conditions réelles) ou **À VÉRIFIER**
(pas d'accès depuis cette session — Shopify Admin, Vercel, Google Merchant
Center, Search Console).

Aucun accès n'était disponible à un terminal sur l'ordinateur de
l'utilisateur (pas d'outil `device_bash` dans cette session) : toutes les
corrections ont été faites en rapatriant les fichiers un par un dans un
espace de travail cloud, puis réécrites sur l'ordinateur. Aucune commande
`npm run build` n'a donc pu être lancée pour valider les corrections —
voir "À valider avant déploiement" en fin de rapport.

## Résumé exécutif

Le projet est dans un état nettement plus avancé que ce que le brief
initial laissait supposer : la Phase 2 (médiateur CM2C), l'essentiel de la
Phase 5 (headers de sécurité + CSP complète) et une large partie de la
Phase 7 (CRO — StockCountdown, LiveVisitors, TrustBadges, DeliveryEstimator,
RecentlyViewed, "fréquemment achetés ensemble", MobileStickyCta,
formulaire "Poser une question") étaient déjà en place, issues de sessions
de travail précédentes très soignées (commentaires de code détaillés,
constantes centralisées, historique des décisions dans `company-info.ts`
et `site-config.ts`).

Le vrai travail de cette session a été de vérifier ce qui restait vraiment
à faire plutôt que de tout refaire, et de trouver deux bugs réels non
mentionnés dans le brief :

1. **Bug critique confirmé** : le formulaire "Devenir partenaire"
   (`/partenaires`) était cassé à 100 % — son API ne contenait par erreur
   aucun handler POST (du code du flux Google Shopping avait été collé au
   mauvais endroit). Toute candidature partenaire échouait silencieusement.
2. **Bug visuel confirmé en live sur ondeal.fr** : tous les prix du site
   (accueil, panier, et très probablement fiche produit/checkout) affichent
   `"25.10 EUR"` au lieu de `"25,10 €"` — texte "EUR" et point décimal au
   lieu du symbole € et de la virgule française. Constaté en navigant sur
   le site en production, dans la grille produits de l'accueil ET dans le
   panier.

Les deux sont corrigés dans le code local (voir "Corrections appliquées").
**Rien n'a été déployé** — ces fixes ne sont pas encore en ligne, voir la
section finale.

## Score global (estimation, échantillon partiel)

| Axe | Note | Base |
|---|---|---|
| SEO technique | 65/100 | metadata globale + JSON-LD Organization absents (corrigé), mais JSON-LD Product/Breadcrumb/FAQ déjà excellents sur les fiches produit |
| Sécurité | 80/100 | Headers + CSP déjà complets ; formulaires sans échappement HTML corrigé ; rate limiting distribué absent (infra à ajouter) |
| Confiance / branding | 70/100 | Mentions légales, CGV, médiateur déjà conformes ; bug d'affichage des prix nuit à l'image "premium" (corrigé, à déployer) |
| Performance (déclaratif) | 70/100 | loading.tsx et formats AVIF/WebP déjà en place ; ISR absent sur produit/catégorie (corrigé) |
| Accessibilité | 70/100 | Skip-link et aria-label déjà présents sur l'échantillon vérifié ; pas d'audit exhaustif de tous les composants |
| CRO / UX | 80/100 | La quasi-totalité des composants demandés en Phase 7 existent déjà et sont utilisés sur la fiche produit |

Pas de "ONDEAL SCORE" unique calculé : la méthodologie du brief (moyenne de
12 sous-scores, dont plusieurs — mobile, merchandising, acquisition —
n'ont pas pu être mesurés cette session) donnerait un chiffre à fausse
précision. Les six axes ci-dessus sont ceux réellement évalués.

## Corrections appliquées cette session (code local, à déployer)

1. **`src/app/layout.tsx`** — ajout de `metadata` globale (title template,
   description, OpenGraph, Twitter, robots, canonical), `viewport`, et
   JSON-LD `Organization` (avec médiateur CM2C). GA4 non ajouté en dur —
   aucun identifiant `G-XXXXXXX` trouvé dans le projet ; un bloc
   conditionnel est prêt, il s'active dès que
   `NEXT_PUBLIC_GA4_MEASUREMENT_ID` est défini.
2. **`src/context/LocationContext.tsx`** — bug de devise corrigé
   (`currency_symbol: "EUR"` → `"€"` pour la zone euro, cohérent avec le
   reste du code qui utilisait déjà "€"). Coquille "gratuit **des** 80EUR"
   corrigée en "gratuit **dès** 80 €".
3. **`src/app/api/partenaires/route.ts`** — handler POST restauré (le
   fichier contenait par erreur le code du flux Google Shopping). Formulaire
   partenaires à nouveau fonctionnel.
4. **`src/app/partenaires/page.tsx`** — honeypot anti-spam ajouté, typage
   de l'event du formulaire corrigé (`any` implicite → `React.FormEvent`).
5. **`src/app/api/ask-question/route.ts`** — échappement HTML des champs
   avant interpolation dans l'email (faille d'injection HTML corrigée),
   honeypot anti-spam, limites de longueur.
6. **`src/components/products/QuestionForm.tsx`** — champ honeypot ajouté
   (invisible pour un humain).
7. **`src/app/feed/google-shopping.xml/route.ts`** — enrichi avec les
   champs qui avaient été écrits par erreur dans `api/partenaires/route.ts`
   (g:sale_price séparé de g:price, images additionnelles, item_group_id,
   custom_label_0) : correspond exactement à la priorité "Google Merchant
   Center : fix misrepresentation" notée dans le récap du 01/09.
8. **`src/app/product/[slug]/page.tsx`** et
   **`src/app/category/[slug]/page.tsx`** — `export const revalidate = 3600`
   ajouté (ISR). Ces pages étaient en SSG pur : sans ce correctif, un
   changement de stock ou de prix côté Shopify n'apparaissait jamais sans
   redéploiement complet.
9. **`next.config.ts`** — `poweredByHeader: false` ajouté (masque l'en-tête
   `X-Powered-By: Next.js`). Les 5 headers de sécurité demandés dans le
   brief initial (X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
   Permissions-Policy, HSTS) étaient déjà tous présents, avec en plus une
   CSP complète — rien à ajouter là-dessus.

## Vérifié sans modification nécessaire (déjà conforme)

- CGV Article 12 (médiateur CM2C) — déjà exactement conforme au brief,
  daté du 02/09/2026, probablement fait plus tôt dans la journée.
- `src/context/LocationContext.tsx` — plus aucun caractère d'encodage
  cassé (â‚‚, Ã©...) mentionné dans le brief initial ; le fichier a été
  réécrit le 01/09.
- Headers de sécurité + CSP dans `next.config.ts`.
- `loading.tsx` présent sur `product/[slug]` et `category/[slug]`.
- Skip-link ("Aller au contenu principal") dans `SiteLayout.tsx`.
- `aria-label` sur le bouton favoris (icône seule) de `ProductCard.tsx`.
- Contraste violet de marque (`#4f46e5`) sur fond blanc : ratio ≈ 5,1:1,
  conforme WCAG AA texte normal (CONFIRMÉ par calcul, pas d'outil
  Lighthouse disponible pour un audit exhaustif).
- Aucune variable `SHOPIFY_ADMIN_ACCESS_TOKEN` exposée côté client :
  utilisée uniquement dans `src/lib/shopify/admin.ts` (fichier serveur,
  pas de directive `"use client"`), jamais préfixée `NEXT_PUBLIC_`.
- JSON-LD `Product`, `BreadcrumbList` et `FAQPage` déjà complets et bien
  faits sur la fiche produit.
- Aucune erreur console détectée sur l'accueil ni le panier (CONFIRMÉ en
  navigant sur ondeal.fr en production).

## REQUIRES_HUMAN_APPROVAL — décisions à prendre, non modifiées

1. **Identité légale incohérente avec le brief.** Le brief fourni indique
   "Société : Ondeal" sans forme juridique. Le vrai `company-info.ts`
   (source de vérité du projet, alimentée par de vrais documents de
   domiciliation Kandbaz) indique une **entreprise individuelle
   (auto-entrepreneur)**, `COMPANY_LEGAL_NAME = "Alex Brou - OnDeal.fr"`.
   Je n'ai rien changé — mais si le brief reflète une intention de
   transformer OnDeal en société (SAS/SARL), c'est une décision business
   et juridique qui vous appartient entièrement, pas un simple correctif
   de code.
2. **Rate limiting distribué absent.** Un honeypot a été ajouté sur les
   deux formulaires publics (`/partenaires`, question produit), mais un
   vrai rate limiting (par IP, distribué) demande une dépendance externe
   non installée (Vercel KV ou Upstash Redis) — décision d'infra/coût à
   valider avant ajout.
3. **GA4 non activé.** Aucun identifiant de mesure GA4 trouvé nulle part
   dans le projet (ni `.env.local`, ni le code) alors que le récap du
   01/09 indiquait "GA4 + Google Ads" comme opérationnel. Le code est prêt
   côté `layout.tsx` (voir plus haut) — il suffit d'ajouter
   `NEXT_PUBLIC_GA4_MEASUREMENT_ID` dans `.env.local` et sur Vercel.

## Nettoyage — fichiers parasites (suppression manuelle nécessaire)

Cette session n'a pas d'outil pour supprimer des fichiers sur votre
ordinateur (pas d'accès terminal). Les fichiers suivants, à la racine du
projet, sont visiblement des résidus de commandes shell cassées d'une
session précédente (fichiers vides, noms invalides pour du code) — vous
pouvez les supprimer sans risque depuis l'explorateur de fichiers :

```
(
({
(echo
{
0
c.id
e.message)
Get-ChildItem
npx
powershell
setTimeout(r
type
```

Vous avez aussi 6 fichiers Excel très proches à la racine
(`products.xlsx`, `products.xlsx.xlsx`, `products2.xlsx`, `products_fr.xlsx`,
`products_final.xlsx`, `products_final2.xlsx`, `products_new.xlsx` — 7 en
tout, ~1 à 1,3 Mo chacun) : je n'ai pas ouvert leur contenu pour savoir
lequel est le bon, donc je ne recommande pas de suppression automatique
ici — à trier vous-même, ou dites-moi lequel faire autorité et je peux
comparer les autres avec.

## À valider avant déploiement

Aucune de ces corrections n'a été testée avec `npm run dev` ou
`npm run build` (pas d'accès terminal dans cette session). Le fichier
`next.config.ts` a `typescript: { ignoreBuildErrors: true }`, donc une
erreur de type ne bloquerait pas le build — mais une erreur de syntaxe le
bloquerait. Merci de lancer `npm run dev` en local et de vérifier au
minimum : la page d'accueil, une fiche produit, le panier, et
`/partenaires` (soumettre le formulaire pour de vrai), avant tout
`git push` / déploiement Vercel — conformément à votre propre règle de
travail.

## Ce qui n'a pas été fait cette session (hors budget d'une session)

Le brief "MODE AUTONOME" (25 phases) et la Phase 6 "catalogue CSV" du
premier brief demandent un travail d'une tout autre ampleur : audit
produit par produit sur ~1150-1700 fiches, retraitement de pricing/titres/
descriptions par lots de 150 lignes (aucun CSV n'a été fourni cette
session), crawl complet du site (mentions légales, retours, garantie,
livraison, FAQ, blog...), mesure réelle des Core Web Vitals (LCP/CLS/INP —
nécessite Lighthouse ou PageSpeed Insights, non disponible ici), et audit
exhaustif de l'accessibilité sur tous les composants. Rien de tout cela
n'est marqué "fait" dans ce rapport — voir `ONDEAL-BACKLOG.json` pour ce
qui reste, avec priorité et effort estimés.
