# OnDeal Branding & Visual Identity Audit

Généré le : 2026-08-13
Mission : INTÉGRATION IDENTITÉ VISUELLE OFFICIELLE ONDEAL
Périmètre : UI, branding, identité visuelle uniquement. Aucune mutation Shopify effectuée pendant cette mission.

---

## 1. Executive Summary

L'identité visuelle officielle OnDeal (logo réel, bleu foncé `#0C1F32` et orange `#F3A023` échantillonnés directement dans les fichiers fournis par le client) a été intégrée dans l'interface publique du projet `ondeal-marketplace` : header, footer, favicon/icônes d'application, image de partage (Open Graph), manifest web, et système de couleurs (design tokens).

Le seul résidu d'identité générique trouvé (`MonSite`, dans une donnée de démonstration locale) a été remplacé. Le seul autre résidu de l'ancienne couleur bleue générique (`#1a56db`, dégradé du Hero homepage) a été remplacé par le vrai bleu foncé de marque. Aucune donnée commerciale n'a été inventée (aucun faux avis, aucun faux nombre de clients, aucune fausse promotion, aucune fausse urgence, aucun faux stock, aucune fausse garantie, aucune fausse statistique).

16 fichiers ont été créés ou modifiés, tous côté code/actifs statiques. `npx tsc --noEmit`, `npm run lint` et `npm run build` passent tous les trois sans erreur. Le responsive a été vérifié à 3 largeurs (mobile 390px, tablette 834px, desktop 1440px) : aucun débordement horizontal, logo jamais coupé ni déformé.

Une observation hors périmètre a été notée sans être corrigée (voir section 9) : un bug pré-existant (mission CRO précédente, non lié au branding) empêchant la barre CTA sticky mobile de s'afficher au scroll a été détecté pendant les tests responsive de cette mission. Il n'a pas été corrigé ici car il ne relève pas de l'identité visuelle — signalé pour un traitement séparé.

---

## 2. Existing Branding — recherche initiale

Recherche exhaustive dans tout le projet (`src/`, `public/`) avant toute modification :

| Élément recherché | Résultat |
| --- | --- |
| "MONSITE" | 0 occurrence en majuscules ; 1 occurrence "MonSite" trouvée dans `src/data/products.ts` (champ `seller` des données de démonstration mock, jamais affichée en production car Shopify est configuré — voir `productService.ts`, `USE_SHOPIFY`) |
| Logo existant | Aucun fichier logo dans `public/` (seulement les SVG par défaut de Create Next App : `next.svg`, `vercel.svg`, etc.) |
| Anciennes marques / anciens noms de boutique | Aucune autre marque trouvée. `SITE_NAME` (`src/lib/site-config.ts`) était déjà correctement défini à `"Ondeal"` |
| Placeholders | `Header.tsx` affichait le texte `{SITE_NAME}` dans un encadré à bordure pointillée blanche — signature visuelle typique d'un placeholder de développement, jamais remplacé par le vrai logo |
| Favicon | `src/app/favicon.ico` = favicon par défaut de Next.js (cercle noir, triangle blanc) — jamais remplacé |
| Metadata / title / OpenGraph | Title et description déjà corrects (`SITE_NAME`) ; aucune image Open Graph, aucune métadonnée Twitter/X, pas de `applicationName` |
| Manifest | Aucun fichier `manifest.ts`/`manifest.json` n'existait |
| Splash screen | Non applicable (application web, pas d'app native dans ce projet) — les fichiers `splash-icon.png` fournis ont été réutilisés pour la génération de l'image Open Graph et du logo horizontal |
| Composants Header / Footer / navigation mobile | `Header.tsx` : placeholder texte (voir ci-dessus). `Footer.tsx` : nom déjà correct (`SITE_NAME`), aucune ancienne marque. `CategoryMenu.tsx` (menu mobile) : aucune référence de marque incorrecte |
| Login / compte | `src/app/account/*` : aucune référence de marque générique trouvée |
| Checkout UI locale | `src/app/checkout/page.tsx` : aucune référence de marque générique trouvée |
| Couleur bleue générique `#1a56db` | Utilisée comme `--color-primary` dans `globals.css` (couleur de travail temporaire, le commentaire du fichier disait explicitement "à remplacer par l'identité graphique définitive") et en dur dans le dégradé du premier slide du Hero homepage (`Hero.tsx`) |

---

## 3. Official Logo Integration

Fichiers de référence officiels fournis par le client (dossier `ondeal-app/assets`, confirmés identiques aux fichiers reçus dans la conversation) : `android-icon-foreground.png` (1024×1024, transparent), `icon.png` (1024×1024), `splash-icon.png` (1200×800, transparent).

Aucun logo n'a été recréé graphiquement avec du texte : les fichiers officiels ont été uniquement **recadrés** (suppression des marges transparentes/blanches excédentaires) pour produire des variantes exploitables dans l'interface web, sans aucune déformation (recadrage uniquement, aucun redimensionnement non proportionnel), sans changement de couleur, sans ombre ni effet ajouté :

| Asset généré | Source officielle | Traitement | Usage |
| --- | --- | --- | --- |
| `public/brand/ondeal-logo.png` (704×281, transparent) | `splash-icon.png` | Recadrage sur le contenu réel (marges transparentes retirées) | Header, Footer |
| `src/app/icon.png` (512×512) | `android-icon-foreground.png` | Recadrage centré + fond blanc opaque (nécessaire : le fichier source est transparent, un favicon a besoin d'un fond) | Favicon moderne (`<link rel="icon">`) |
| `src/app/apple-icon.png` (180×180) | `android-icon-foreground.png` | Idem, taille Apple standard | `apple-touch-icon` (iOS) |
| `src/app/favicon.ico` (16/32/48 multi-résolution) | `android-icon-foreground.png` | Idem, format `.ico` multi-taille | Favicon legacy (navigateurs anciens) |
| `public/brand/ondeal-icon-192.png`, `ondeal-icon-512.png` | `android-icon-foreground.png` | Idem | Icônes du `manifest.ts` |
| `src/app/opengraph-image.png` (1200×630) | `ondeal-logo.png` (dérivé de `splash-icon.png`) | Logo centré sur fond blanc + texte réel `SITE_TAGLINE` déjà existant dans le projet, aucun texte inventé | Image de partage réseaux sociaux |

Note factuelle : le fichier source `android-icon-foreground.png` contient un très fin cercle gris quasi invisible (probablement un repère de zone de sécurité laissé par l'outil d'export d'icône adaptative Android) intégré dans le fichier officiel lui-même. Il n'a pas été retiré (aucune retouche du contenu du logo autre que le recadrage n'a été effectuée, conformément à la consigne "ne pas modifier le logo") ; à la taille d'affichage réelle (favicon 16-32px), il est imperceptible.

Proportions respectées à 100 % (aucun redimensionnement non proportionnel), couleurs non modifiées, aucun effet ajouté.

---

## 4. Header

**Avant** : `Header.tsx` affichait le texte `{SITE_NAME}` dans un `<Link>` avec `border: 1px dashed rgba(255,255,255,.35)` — un placeholder de développement resté en production.

**Après** : le logo officiel (`public/brand/ondeal-logo.png`) est affiché via `next/image`, dans un chip blanc arrondi (`background: #fff`, `border-radius: var(--radius-md)`). Le fond blanc est nécessaire car le header reste en bleu foncé de marque (`var(--header-bg)`) : le logo officiel, dont le texte est bleu foncé, serait invisible posé directement sur un fond bleu foncé identique — la seule alternative aurait été de changer la couleur du logo lui-même, explicitement interdit par la mission.

Résultat vérifié (voir section 12) :
- Lisible desktop (hauteur 32px) et mobile (hauteur 26px) ;
- Cliquable vers l'accueil (`<Link href="/">`), `aria-label` explicite ;
- Proportions conservées (`width`/`height` du composant `next/image` respectent le ratio réel 704:281) ;
- Hauteur du header (`var(--header-height)`, 64px) inchangée.

---

## 5. Footer

**Vérification du nom affiché** : `SITE_NAME` = `"Ondeal"` (déjà correct avant cette mission, cohérent avec la graphie réelle du logo officiel, qui rend visuellement "Ondeal" — un seul "O" majuscule). Aucune référence résiduelle à une ancienne marque ou à "MONSITE" trouvée dans `Footer.tsx`.

**Ajout** : un logo (même traitement chip blanc que le Header, pour la même raison de contraste sur fond bleu foncé) a été ajouté en haut du footer, au-dessus des colonnes de liens, pour renforcer la présence de l'identité visuelle réelle en plus du texte déjà correct.

Aucune information commerciale n'a été inventée (adresse, téléphone, etc. — non ajoutés, cohérent avec le traitement déjà appliqué à ces pages lors de la mission CRO précédente).

---

## 6. Mobile

Testé à 390×844 (mobile), 834×1100 (tablette), 1440×900 (desktop) via Playwright/Chromium, sur homepage, fiche produit et panier :

- Aucun débordement horizontal détecté (`document.documentElement.scrollWidth === clientWidth`) sur les 3 largeurs et les 3 pages testées.
- Le logo ne dépasse jamais du header, n'est jamais coupé, n'est jamais déformé (dimensions `next/image` proportionnelles, `object-fit` implicite par le recadrage source).
- Header mobile : menu hamburger, logo compact (chip réduit), icônes panier/compte conservées, barre de recherche repliée sous le header (comportement pré-existant inchangé).
- Footer mobile : colonnes empilées en 2 colonnes (comportement CSS pré-existant inchangé), logo chip lisible.

**Observation hors périmètre (non corrigée)** : en testant le scroll mobile sur une fiche produit, la barre CTA sticky (`MobileStickyCta`, construite lors de la mission CRO Phase 1 précédente) ne devient jamais visible malgré un scroll dépassant le sentinel (`--sticky-cta-height` reste à `0px` après scroll, vérifié en conditions réelles de navigateur). Ce composant n'a pas été touché par cette mission de branding et le bug ne provient d'aucun changement effectué ici (vérifié : le comportement est identique avant et après les changements de cette mission). Il est signalé ici pour traitement dans une mission dédiée, conformément au périmètre strict "UI, branding, identité visuelle uniquement" de cette mission.

---

## 7. Design System

Couleurs de marque échantillonnées directement (script Python/Pillow, comptage des pixels les plus fréquents) dans les fichiers officiels fournis par le client :
- Bleu foncé OnDeal : `#0C1F32` (échantillonné dans `icon.png`)
- Orange OnDeal : `#F3A023` (échantillonné dans `icon.png`)

Tokens mis à jour dans `src/app/globals.css` (le commentaire du fichier indiquait explicitement "à remplacer par l'identité graphique définitive") :

| Token | Avant | Après | Usage |
| --- | --- | --- | --- |
| `--color-primary` | `#1a56db` (bleu vif générique) | `#0c1f32` (bleu foncé de marque) | Navigation, CTA principal, éléments de marque |
| `--color-primary-hover` | `#1544ad` | `#304151` (dérivé mathématiquement : navy + 15% blanc) | Hover des éléments primaires |
| `--color-primary-light` | `#e8f0fe` | `#dbdde0` (navy + 85% blanc) | Fonds légers (badges, dropdown actif, icônes catégories) |
| `--color-secondary` | `#f5a623` | `#f3a023` (orange de marque exact) | Accents, promotions, badges |
| `--color-secondary-hover` | `#d88f13` | `#c7831d` (dérivé : orange − 18% noir) | Hover des éléments secondaires |
| `--color-rating` | `#f5a623` | `#f3a023` | Étoiles de notation |
| `--color-badge-new` | `#1a56db` | `#0c1f32` | Badge "Nouveau" (élément de marque) |
| `--header-bg` | `#14213d` | `#0c1f32` (aligné exactement sur le bleu de marque) | Fond header/footer |
| `--header-bg-secondary` | `#1c2c50` | `#293a4b` (dérivé : navy + 12% blanc) | Fond sous-navigation |

**Respect explicite de la consigne "ne pas transformer toute l'interface en bleu/orange"** :
- Les fonds de page, cartes, bordures (`--color-background`, `--color-surface`, `--color-border`) restent blancs/gris clairs, inchangés.
- Les couleurs sémantiques distinctes (succès, alerte, danger, badges "Meilleure vente" ambre, "Promotion" rouge, "Exclusivité" violet) restent inchangées — ce sont des couleurs de statut, pas des éléments de marque.
- La palette de couleurs des images placeholder produit (`src/lib/placeholder.ts`, 8 teintes variées utilisées pour des vignettes mock) n'a volontairement pas été touchée : ce n'est pas de l'identité de marque, c'est une variété décorative arbitraire pour des images de démonstration.
- Seul le dégradé du premier slide du Hero homepage (`Hero.tsx`), qui utilisait encore l'ancien bleu générique `#1a56db` en dur, a été aligné sur le vrai bleu de marque `#0c1f32` — corrigé car c'est un résidu direct de l'ancienne identité, pas une nouvelle recoloration étendue.

Résultat visuel vérifié par capture d'écran (desktop/tablette/mobile, homepage/PDP/panier) : esthétique cohérente, header et footer bleu foncé de marque, CTA "Découvrir maintenant" et boutons "Ajouter au panier" en bleu foncé (navigation/CTA), CTA Hero en orange (accent), icônes de catégories en bleu foncé sur fond bleu très clair, badges de confiance et éléments de succès restés verts (sémantique inchangée).

---

## 8. Metadata

| Élément | Avant | Après |
| --- | --- | --- |
| `title` | `"Ondeal — Votre marketplace au meilleur prix"` | Inchangé (déjà correct) |
| `description` | `SITE_DESCRIPTION` (réelle) | Inchangé (déjà correct) |
| `applicationName` | Absent | Ajouté (`SITE_NAME`, donnée déjà réelle du projet) |
| `appleWebApp.title` | Absent | Ajouté (`SITE_NAME`) |
| `favicon` | Favicon par défaut Next.js (cercle noir / triangle blanc) | Logo officiel OnDeal (`src/app/favicon.ico`, multi-résolution 16/32/48) |
| `icon` | Absent (fallback favicon uniquement) | `src/app/icon.png` (512×512, détecté automatiquement par convention Next.js) |
| `apple-icon` | Absent | `src/app/apple-icon.png` (180×180, détecté automatiquement) |
| OpenGraph | `title`/`description`/`siteName` définis, **aucune image** | Ajout de `src/app/opengraph-image.png` (1200×630, détecté automatiquement par convention Next.js) |
| Twitter/X | Absent | Ajouté `twitter: { card: "summary_large_image", title, description }` (l'image retombe automatiquement sur `opengraph-image.png` par convention Next.js, aucune image dupliquée créée) |
| `manifest` | Absent | `src/app/manifest.ts` créé — `name`/`short_name`/`description` à partir de `SITE_NAME`/`SITE_DESCRIPTION` déjà réels, icônes officielles, `theme_color`/`background_color` alignés sur la charte |
| `theme-color` (meta viewport) | Absent | Ajouté (`#0c1f32`) via `export const viewport` |

Aucun slogan définitif n'a été inventé : `SITE_TAGLINE` ("Votre marketplace au meilleur prix") était déjà défini dans `src/lib/site-config.ts` avant cette mission et est réutilisé tel quel (image Open Graph, title).

---

## 9. CRO/UI Improvements

Conformément à la consigne "améliorer uniquement les éléments UI qui bénéficient directement du branding", les seules améliorations apportées sont directement liées à l'intégration de l'identité visuelle :
- CTA principal cohérent : les boutons `primary` (Ajouter au panier, Passer commande, etc.) utilisent désormais le vrai bleu foncé de marque au lieu du bleu générique.
- Le CTA Hero ("Découvrir maintenant") ressort maintenant en orange de marque sur un fond bleu foncé de marque (au lieu d'un bleu vif générique sur bleu vif générique, contraste plus faible).
- Badges ("Nouveau") et éléments de marque alignés sur le bleu foncé réel.
- Header/Footer avec présence de marque réelle (logo) au lieu d'un placeholder texte.

Aucune donnée commerciale n'a été inventée à l'occasion de ces changements : aucun faux avis, aucun faux nombre de clients, aucune fausse promotion, aucune fausse urgence, aucun faux stock, aucune fausse garantie, aucune fausse statistique. Le seul texte ajouté (tagline de l'image Open Graph) est une donnée déjà existante et réelle du projet (`SITE_TAGLINE`).

Bug hors périmètre détecté et documenté sans être corrigé : voir section 6 (barre CTA sticky mobile).

---

## 10. Files Modified

**Créés (8)** :
- `public/brand/ondeal-logo.png`
- `public/brand/ondeal-icon-192.png`
- `public/brand/ondeal-icon-512.png`
- `src/app/icon.png`
- `src/app/apple-icon.png`
- `src/app/opengraph-image.png`
- `src/app/manifest.ts`
- `reports/ondeal-branding-audit.md` (ce rapport)

**Modifiés (8)** :
- `src/app/favicon.ico` (remplacé — était le favicon par défaut Next.js)
- `src/app/globals.css` (tokens de couleur de marque)
- `src/app/layout.tsx` (metadata : `applicationName`, `appleWebApp`, `twitter`, `viewport.themeColor`)
- `src/components/layout/Header.tsx` (logo image au lieu du placeholder texte)
- `src/components/layout/Header.module.css` (styles du chip logo)
- `src/components/layout/Footer.tsx` (ajout du logo image)
- `src/components/layout/Footer.module.css` (styles du chip logo)
- `src/components/home/Hero.tsx` (dégradé bleu générique → bleu de marque)
- `src/data/products.ts` (texte "MonSite" → `SITE_NAME`, donnée de démonstration locale uniquement)

Total : 16 fichiers créés ou modifiés.

---

## 11. Safety Checks

- [x] Shopify non modifié
- [x] produits non modifiés
- [x] prix non modifiés
- [x] stock non modifié
- [x] variantes non modifiées
- [x] tags non modifiés
- [x] statuts non modifiés
- [x] catalogue non modifié
- [x] connexion Shopify non modifiée
- [x] aucun produit publié
- [x] aucune commande créée
- [x] aucune donnée inventée
- [x] logo officiel utilisé (fichiers fournis par le client, recadrés sans déformation ni changement de couleur)
- [x] MONSITE supprimé de l'interface publique (seule occurrence restante : un commentaire de code documentant la correction, non visible par l'utilisateur)
- [x] responsive vérifié (mobile 390px / tablette 834px / desktop 1440px, aucun débordement horizontal)
- [x] tsc OK
- [x] lint OK
- [x] build OK

Aucun appel à un outil `mcp__Shopify__*` (lecture ou écriture) n'a été effectué à aucun moment de cette mission — seuls les outils Read/Edit/Write/Bash et un script Python local (Pillow) ont été utilisés pour traiter les images fournies.

---

## 12. Validation

- `npx tsc --noEmit` → **OK**, aucune erreur.
- `npm run lint` → **OK**, aucune erreur.
- `npm run build` → **OK**, build de production réussi (983 routes générées : homepage, ~65 catégories, ~910 produits, pages légales, recherche, plus les nouvelles routes `/icon.png`, `/apple-icon.png`, `/opengraph-image.png`, `/manifest.webmanifest`).
- Script de test dans `package.json` : **NO TEST SCRIPT PRESENT IN PACKAGE.JSON**.
- Vérification fonctionnelle manuelle (Playwright/Chromium, build de production servi localement) : homepage, fiche produit, panier testés à 3 largeurs d'écran — logo lisible et non déformé partout, aucun débordement horizontal, métadonnées (`<link rel="icon">`, `<link rel="apple-touch-icon">`, `<link rel="manifest">`, `<meta property="og:image">`, `<meta name="theme-color">`, `<meta name="application-name">`) toutes présentes et correctement générées dans le `<head>`.

---

## 13. Conclusion

L'identité visuelle officielle OnDeal (logo réel fourni par le client, bleu foncé `#0C1F32` et orange `#F3A023` échantillonnés directement dans ces fichiers) est maintenant intégrée dans le header, le footer, les icônes d'application (favicon, icône moderne, icône Apple, manifest), l'image de partage Open Graph, et le système de couleurs de l'interface, en respectant strictement les règles de non-déformation et de non-recoloration du logo. Le seul résidu de marque générique trouvé ("MonSite") et le seul résidu de couleur générique (`#1a56db` dans le Hero) ont été corrigés ; aucune autre partie de l'interface n'a été recolorée en bleu/orange au-delà de ce qui était nécessaire pour la cohérence de marque (navigation, CTA principal, accents). Aucune mutation Shopify, aucune donnée catalogue, aucune donnée commerciale inventée. `tsc`, `lint` et `build` passent sans erreur ; le responsive a été vérifié sur 3 largeurs d'écran. Une observation hors périmètre (bug pré-existant de la barre CTA sticky mobile) a été documentée pour traitement séparé plutôt que corrigée silencieusement hors du cadre de cette mission.
