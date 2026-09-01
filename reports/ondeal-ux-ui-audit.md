# OnDeal — Audit UX/UI Complet

Généré le : 2026-08-13
Mission : AUDIT + FINALISATION UX/UI ONDEAL.FR
Périmètre : audit écran par écran + corrections des problèmes réellement constatés (P0/P1). Shopify strictement en lecture seule pendant toute la mission.

---

## 1. Executive Summary

Un audit complet de 24 écrans/contextes a été mené directement dans le navigateur (Chromium/Playwright, build de production servi localement), à 3 largeurs (390px, 834px, 1440px), plus une revue de code ciblée pour la hiérarchie visuelle, l'accessibilité et la cohérence de marque.

Deux problèmes **P0** ont été confirmés en conditions réelles de navigateur (reproduction effective, pas seulement suspectée) et corrigés :
1. La barre CTA sticky mobile (`MobileStickyCta`) restait invisible après certains types de scroll (saut instantané), un bug déjà signalé dans le rapport précédent — cause exacte identifiée et corrigée.
2. **Nouveau problème découvert pendant cet audit**, non documenté auparavant : cliquer sur une catégorie du menu principal ("Électronique", "Maison", "Mode") sur desktop ne menait jamais vers la page catégorie et ouvrait par erreur un panneau mobile en superposition — navigation cassée sur le parcours le plus emprunté du site.

Deux problèmes **P1** supplémentaires ont été confirmés et corrigés, tous deux sur `MobileStickyCta` : la barre pouvait recouvrir le bouton "Ajouter au panier" d'un AUTRE produit dans les sections liées, et aucune protection n'empêchait un double-ajout par double-tap.

Deux observations **P2** ont été identifiées (tailles de cible tactile légèrement sous l'idéal 44px ; contraste des étoiles de notation sous le seuil WCAG non-text 3:1) — documentées dans `reports/ondeal-ux-ui-roadmap.md`, non corrigées dans cette phase conformément à la consigne.

Aucune autre régression ou problème bloquant n'a été trouvé : le reste de l'interface (homepage, fiches produit, panier, checkout, pages légales, filtres, recherche, états vides, page 404) fonctionne correctement, est cohérent avec l'identité visuelle officielle (bleu `#0C1F32` / orange `#F3A023`), et ne présente aucun débordement horizontal sur les 3 largeurs testées.

`npx tsc --noEmit`, `npm run lint` et `npm run build` passent tous les trois sans erreur. Aucun script de test n'existe dans `package.json`. Les parcours critiques (accueil → catégorie → produit, produit → panier, panier → checkout, recherche → produit, navigation mobile, CTA sticky mobile) ont tous été testés et fonctionnent de bout en bout après corrections. Aucune donnée commerciale n'a été inventée. Shopify n'a fait l'objet d'aucune lecture ni écriture pendant cette mission (aucun outil `mcp__Shopify__*` appelé).

---

## 2. État avant mission

Contexte hérité des missions précédentes (déjà en place, vérifié à jour) :
- Identité visuelle officielle intégrée (logo réel, bleu `#0C1F32`, orange `#F3A023`) dans Header, Footer, favicon, apple-icon, manifest, Open Graph.
- Shopify Storefront API réelle connectée, catalogue réel utilisé (970 produits environ).
- 147 produits HIGH bijoux tagués `cat-bijoux` (mutation Shopify antérieure, hors périmètre de cette mission).
- CRO Phase 1 déjà livrée : toast de confirmation d'ajout panier, `MobileStickyCta`, badges de confiance, avis masqués si vides, filtres Note/Livraison rapide supprimés (car non fonctionnels sur les données réelles), barre de progression livraison gratuite, pages légales dédiées.
- Rapport précédent (`reports/ondeal-branding-audit.md`) signalait, sans le corriger (hors périmètre de la mission branding), que `MobileStickyCta` ne devenait jamais visible après scroll — à vérifier en priorité dans cette mission (ÉTAPE 2).

---

## 3. Audit écran par écran

Chaque écran a été inspecté dans le navigateur réel (capture d'écran + vérification DOM/CSS) à 390px, 834px et 1440px sauf mention contraire. Seuls les écarts par rapport à l'attendu sont détaillés ; l'absence de remarque signifie : hiérarchie visuelle, lisibilité, spacing, contraste, cohérence des boutons/couleurs/logo, navigation, CTA, confiance et responsive jugés corrects.

1. **Homepage** — Hero (dégradé bleu de marque + CTA orange), catégories, "Meilleures ventes", "Nos marques" ; section "Offres du moment" correctement masquée (moins de 4 produits promotion réels, logique déjà en place). RAS.
2. **Header desktop** — logo officiel dans chip blanc, recherche, compte, commandes, panier. RAS.
3. **Header mobile** — logo compact, menu hamburger, recherche repliée sous le header. RAS.
4. **Navigation / menu mobile** (`CategoryMenu`) — drawer accessible (focus trap, Échap, `aria-modal`), navigation multi-niveaux fonctionnelle. RAS.
   - **Menu principal desktop (`MainNav`)** — **P0 découvert** : clic sur une catégorie mega-menu ne navigue jamais et ouvre un panneau mobile en double superposition sur desktop. Voir section 4.
5. **Recherche** — résultats corrects, filtres appliqués, page vide honnête ("Aucun produit ne correspond à votre recherche"). RAS.
6. **Page catégorie** — fil d'Ariane, sous-catégories, filtres, grille produits. RAS.
7. **Listing produits** — cohérent avec ProductCard (voir 9). RAS.
8. **Filtres** — Prix et Marque vérifiés fonctionnels par interaction réelle (filtre 0-50€ → 0 résultat exact pour Électronique, filtre 100-250€ → 6 résultats, tous les prix affichés dans la plage). Les filtres Note/Livraison rapide, non fiables sur les données réelles, ont déjà été retirés lors de la mission CRO précédente (confirmé toujours absents, pas de régression). RAS.
9. **ProductCard** — image réelle Shopify avec repli honnête si absente/en erreur (`PlaceholderImage`), avis masqués si `reviewsCount === 0`, bouton favoris avec `aria-label`/`aria-pressed`, CTA désactivé si rupture de stock. RAS.
10. **Fiche produit desktop** — galerie, prix réel (barré uniquement si `compareAtPrice` réel), disponibilité binaire honnête, badges de confiance, avis. RAS.
11. **Fiche produit mobile** — idem + CTA sticky (voir 13). RAS après correction.
12. **CTA d'achat** (`AddToCartPanel`) — Ajouter au panier / Acheter maintenant, quantité bornée au stock, toast de confirmation. RAS.
13. **CTA sticky mobile** (`MobileStickyCta`) — **P0 + 2×P1 confirmés et corrigés**. Voir section 4 (ÉTAPE 2 détaillée).
14. **Panier** — état vide honnête ("Votre panier est vide" + CTA "Continuer mes achats"), résumé, barre de progression livraison gratuite (seuil réel 39 €), badges de confiance. RAS.
15. **Checkout** — chemin réel Shopify (si tous les articles ont un `shopifyVariantId`) avec redirection vers le paiement sécurisé Shopify ; chemin de démonstration clairement annoncé ("Simulation — aucun paiement réel n'est effectué") si Shopify non disponible pour les articles du panier. RAS.
16. **Pages aide / livraison / retours** — contenu réel réutilisé de la FAQ existante (`help-data.ts`), aucune donnée inventée. RAS.
17. **Pages légales** — CGV/Confidentialité/Cookies/Mentions légales/Garantie affichent honnêtement l'absence de contenu juridique vérifiable plutôt que d'inventer une raison sociale/adresse ; Livraison/Retours ont un contenu réel. RAS.
18. **Footer** — nom de marque correct ("Ondeal"), logo, liens vers les pages légales/aide, aucune ancienne marque résiduelle. RAS.
19. **États vides** — panier vide, recherche sans résultat, favoris (à vérifier données mock, voir remarque ci-dessous) : tous honnêtes, pas de donnée inventée. RAS.
20. **Rupture de stock** — logique vérifiée dans le code (`ProductCard`, PDP, `AddToCartPanel`, `MobileStickyCta` corrigé) : CTA désactivé + libellé "Rupture de stock" partout où `product.inStock === false`. Aucun produit en rupture n'était présent dans l'échantillon du catalogue réel consulté pendant cet audit pour une capture d'écran live ; la logique a donc été vérifiée par lecture de code et par les chemins conditionnels (pas de donnée inventée pour simuler cet état).
21. **Erreurs** — page 404 (`not-found.tsx`) claire, avec CTA "Retour à l'accueil" / "Rechercher un produit", cohérente avec l'identité de marque. RAS.
22. **Responsive 390 px** — voir section 10.
23. **Responsive 834 px** — voir section 10.
24. **Desktop 1440 px** — voir section 10.

**Remarque hors périmètre (non corrigée)** : la section "Mes commandes" du compte (`/account/orders`, "3 commande(s)") repose sur des données de démonstration locales, car aucun système d'authentification/compte client réel n'existe dans ce projet (confirmé dans les missions précédentes). Ce n'est pas une donnée commerciale au sens de la consigne (avis/stock/promotion/garantie/délai) mais un historique de commande fictif dans une zone "compte" elle-même non connectée à un vrai système d'authentification. Non modifié : hors périmètre de cette mission, déjà un état connu et accepté du projet.

---

## 4. Problèmes P0

### P0-1 — Navigation principale desktop cassée (menu mega-menu)

- **Écran** : Header desktop / navigation principale (`MainNav`), sur les 3 catégories mega-menu ("Électronique", "Maison", "Mode").
- **Constat réel** (Playwright, navigateur réel, viewport 1440px) : un clic sur "Électronique" ne change jamais l'URL — l'utilisateur reste bloqué sur la page courante. Capture d'écran : un second panneau plein-largeur (`MegaMenuMobile`, conçu pour mobile) s'ouvre par-dessus le panneau de survol déjà affiché (`MegaMenuPanel`), créant une superposition visuellement cassée.
- **Cause exacte** : dans `MainNav.tsx`, l'élément de catégorie était un `<button onClick={() => setMobileMega(cat.id)}>` — ce gestionnaire de clic déclenchait TOUJOURS l'ouverture du panneau mobile, sans jamais vérifier la largeur d'écran, et il n'existait aucun lien réel (`<Link>`) vers `/category/<slug>`.
- **Solution** : remplacement par un vrai `<Link href="/category/<slug>">`, qui navigue nativement vers la page catégorie. Un gestionnaire `onClick` vérifie `window.matchMedia("(max-width: 767px)")` (même seuil que le reste du composant) : sur mobile, il annule la navigation et ouvre le panneau plein écran existant (comportement mobile inchangé) ; sur desktop, la navigation s'effectue normalement (bug corrigé). Le survol desktop (`MegaMenuPanel`) est inchangé et continue de fonctionner.
- **Fichier** : `src/components/layout/MainNav.tsx`
- **Test effectué** : clic desktop → URL `/category/electronique` confirmée + écran propre sans superposition ; survol desktop → panneau mega-menu toujours affiché ; tap mobile → drawer plein écran toujours ouvert, URL inchangée (comportement voulu).
- **Impact UX/CRO attendu** : rétablit le parcours de navigation le plus visible et le plus emprunté du site (3 catégories principales du menu, present sur 100 % des pages) sur desktop. Sans correctif, tout utilisateur desktop cliquant directement sur une catégorie (plutôt que sur une sous-catégorie du panneau) restait bloqué sans retour visuel utile — frein direct à la découverte du catalogue.

### P0-2 — CTA sticky mobile jamais visible après un scroll instantané (bug déjà signalé, confirmé)

- **Écran** : Fiche produit mobile, `MobileStickyCta`.
- **Constat réel** (Playwright, instrumentation du `IntersectionObserver` natif pour tracer chaque callback) : un scroll incrémental réel (molette pas à pas) déclenche bien les callbacks attendus et la barre s'affiche. Mais un saut de scroll en un seul mouvement (`scrollIntoView({behavior:'instant'})`, ancre `#hash`, `window.scrollTo` direct) fait passer le sentinel de "sous le viewport" à "au-dessus du viewport" sans qu'aucun échantillon intermédiaire ne le capture comme intersectant : logs vides confirmés, **zéro callback ne se déclenche**, `visible` reste bloqué à `false`.
- **Cause exacte** : dépendance exclusive à `IntersectionObserver` à seuil 0, qui ne détecte que les franchissements de seuil échantillonnés — un saut qui traverse toute la zone en un seul échantillon n'est jamais détecté.
- **Solution** : remplacement par un calcul de position direct (`getBoundingClientRect().top < 0`) recalculé sur chaque évènement `scroll`/`resize`, limité à une fois par frame via `requestAnimationFrame`. Fiable quel que soit le type de scroll (molette, tactile, saut programmatique), coût négligible (un seul calcul de rectangle par frame, uniquement pendant un scroll actif).
- **Fichier** : `src/components/products/MobileStickyCta.tsx`
- **Test effectué** : saut instantané à `y=1500` (bien après le sentinel) → barre visible (confirmé) ; saut à `y=200` (avant le sentinel) → barre absente (confirmé) ; saut en bas de page → barre absente (voir P1-1) ; scroll incrémental → toujours fonctionnel (non régressé).
- **Impact UX/CRO attendu** : le CTA sticky mobile (ajouté lors de la mission CRO Phase 1 précédente pour augmenter le taux d'ajout au panier mobile) ne fonctionnait de façon fiable que pour un sous-ensemble des façons de scroller — désormais fiable dans tous les cas testés.

---

## 5. Problèmes P1

### P1-1 — CTA sticky mobile recouvrant le CTA d'un AUTRE produit

- **Écran** : Fiche produit mobile, section "Produits fréquemment achetés ensemble" / "Produits similaires".
- **Constat réel** : capture d'écran confirmée — une fois visible, la barre restait affichée pour le reste du scroll de la page, y compris par-dessus la grille de produits liés, recouvrant visuellement le bouton "Ajouter au panier" d'un AUTRE produit. Risque de confusion (quel produit est réellement ajouté ?).
- **Cause exacte** : aucune condition de masquage n'existait au-delà du sentinel initial — la barre restait affichée jusqu'à la fin de la page.
- **Solution** : ajout d'un second repère (`#sticky-cta-end-boundary`) juste avant les sections "produits liés", sur le même modèle que le sentinel existant. La barre se masque dès que ce repère entre dans le viewport.
- **Fichiers** : `src/components/products/MobileStickyCta.tsx`, `src/app/product/[slug]/page.tsx`
- **Test effectué** : scroll jusqu'en bas de page → barre absente (confirmé) ; scroll dans la zone intermédiaire (description/avis) → barre visible sans chevauchement (capture d'écran confirmée).
- **Impact UX/CRO attendu** : supprime une ambiguïté de confiance ("est-ce que j'ajoute le bon produit ?") susceptible de dissuader l'achat ou de provoquer un ajout du mauvais produit.

### P1-2 — Absence de protection contre le double-ajout (double-tap)

- **Écran** : Fiche produit mobile, `MobileStickyCta`.
- **Constat réel** : une variable `addedRef` existait mais n'était jamais lue — aucune protection réelle contre un double-tap rapide.
- **Cause exacte** : absence de désactivation temporaire du bouton après un premier tap.
- **Solution** : le bouton se désactive 700 ms après un tap (`justAdded`), avec retour visuel explicite ("Ajouté ✓"), puis se réactive automatiquement.
- **Fichier** : `src/components/products/MobileStickyCta.tsx`
- **Test effectué** : premier clic → bouton désactivé immédiatement, libellé "Ajouté ✓" ; tentative de second clic pendant la fenêtre de garde → aucun événement `click` supplémentaire ne se déclenche (comportement natif d'un `<button disabled>`) ; panier vérifié à 1 article (pas de doublon) ; réactivation automatique après 700 ms confirmée.
- **Impact UX/CRO attendu** : évite un ajout accidentel en double quantité (frustration, correction manuelle nécessaire au panier).

---

## 6. Problèmes P2

Documentés en détail avec recommandations dans `reports/ondeal-ux-ui-roadmap.md`, non implémentés dans cette phase conformément à la consigne ("P2 : ne pas forcément les implémenter").

- **P2-1** — Tailles de cible tactile légèrement sous l'idéal 44×44px sur certains boutons icône du header mobile (menu hamburger 36×36, panier 42×38, fermeture de drawer 32×32). Conformes au minimum WCAG 2.2 AA (24×24px) mais sous la recommandation AAA/Apple/Material (44px).
- **P2-2** — Contraste des étoiles de notation (`--color-rating`, orange de marque `#F3A023` sur fond blanc) à 2,13:1, sous le seuil WCAG 1.4.11 (objets graphiques, 3:1 minimum). Préexistant (2,03:1 avec l'ancienne couleur, quasi inchangé), non spécifique à cette mission. Information redondante disponible via le texte ("4.5") et l'`aria-label` du composant, donc non bloquant pour les technologies d'assistance — impact réel limité aux utilisateurs voyants à faible vision. Corriger nécessiterait de dévier de la couleur de marque officielle (interdit) ou d'ajouter un contour plus foncé aux icônes (option documentée dans la roadmap).

---

## 7. Corrections effectuées

| # | Problème | Cause | Solution | Fichier(s) | Test effectué | Impact UX/CRO attendu |
|---|---|---|---|---|---|---|
| 1 | P0-1 : navigation mega-menu cassée sur desktop | `<button>` déclenchant toujours l'ouverture du panneau mobile, aucun lien réel vers la catégorie | `<Link>` réel + détection mobile via `matchMedia` pour préserver le comportement mobile existant | `src/components/layout/MainNav.tsx` | Clic desktop → navigation confirmée ; survol desktop → inchangé ; tap mobile → inchangé | Rétablit la navigation catégorie sur desktop, seule voie d'accès direct depuis le menu principal |
| 2 | P0-2 : CTA sticky mobile jamais visible après scroll instantané | Dépendance exclusive à `IntersectionObserver`, qui rate les sauts de scroll en un seul mouvement | Détection par calcul direct de position sur `scroll`/`resize`, throttlé par `requestAnimationFrame` | `src/components/products/MobileStickyCta.tsx` | Saut instantané avant/après sentinel testés, scroll incrémental non régressé | Fiabilise le CTA mobile déjà construit pour augmenter l'ajout au panier mobile |
| 3 | P1-1 : CTA sticky recouvrant le CTA d'un autre produit | Aucune condition de masquage en fin de page | Repère `#sticky-cta-end-boundary` avant les sections liées | `src/components/products/MobileStickyCta.tsx`, `src/app/product/[slug]/page.tsx` | Scroll en bas de page → barre masquée, capture d'écran confirmée | Supprime une ambiguïté de confiance sur le produit réellement ajouté |
| 4 | P1-2 : absence de protection anti double-tap | `addedRef` jamais lu, aucune désactivation du bouton | Désactivation 700 ms + libellé "Ajouté ✓" | `src/components/products/MobileStickyCta.tsx` | Double-clic simulé → un seul ajout confirmé (panier à 1 article) | Évite un ajout accidentel en double quantité |

---

## 8. Fichiers modifiés

3 fichiers modifiés, aucun fichier créé (hors les deux rapports de cette mission) :
- `src/components/layout/MainNav.tsx`
- `src/components/products/MobileStickyCta.tsx`
- `src/app/product/[slug]/page.tsx`

---

## 9. Tests réalisés

- `npx tsc --noEmit` → **OK**, aucune erreur.
- `npm run lint` → **OK**, aucune erreur.
- `npm run build` → **OK**, build de production réussi (983 routes générées).
- Script de test dans `package.json` : **NO TEST SCRIPT PRESENT IN PACKAGE.JSON**.
- Tests fonctionnels réels en navigateur (Playwright/Chromium, build de production servi localement) : voir sections 3 (audit écran par écran), 4/5 (corrections) et 12 (parcours critiques).

---

## 10. Résultats responsive

Sweep automatisé sur 13 pages (homepage, catégorie, recherche, recherche vide, panier vide, checkout, aide, 2 pages légales, compte, commandes, favoris, 404, fiche produit) × 3 largeurs (390px, 834px, 1440px) = 39 combinaisons vérifiées :

- **Débordement horizontal** (`scrollWidth > clientWidth`) : **0/39** — aucun débordement détecté.
- **Logo** : jamais coupé, jamais déformé, jamais débordant du header, sur les 3 largeurs.
- **Header/menu** : hamburger + drawer catégories fonctionnels en mobile (390px) ; navigation complète visible en desktop (1440px) et tablette (834px).
- **Cartes produits** : grille qui se réorganise correctement (colonnes réduites en mobile/tablette).
- **Filtres** : sidebar desktop, drawer plein écran mobile (`FilterMobile`), les deux fonctionnels.
- **CTA / CTA sticky** : boutons pleine largeur en mobile, CTA sticky corrigé (voir section 4) visible uniquement ≤640px.
- **Panier / footer** : colonnes footer réorganisées (5 → 3 → 2 colonnes selon la largeur), aucune régression.
- **Textes longs / images** : aucun texte tronqué de façon incorrecte observé ; images produit avec repli honnête si absentes.

---

## 11. Accessibilité

- **Contrastes** : vérifiés par calcul WCAG (luminance relative) sur les principales paires couleur/fond du design system. Tous les textes/CTA/badges passent AA (≥ 4.5:1 pour le texte normal, ≥ 3:1 pour le texte large/UI), à l'exception du contraste des icônes étoiles de notation (2,13:1 — voir P2-2, préexistant, information redondante en texte).
- **Focus clavier** : `:focus-visible` appliqué globalement (`globals.css`) sur liens, boutons, champs, éléments avec `tabindex` — anneau de focus visible cohérent sur tout le site, couleur alignée sur le bleu de marque.
- **`aria-label`** : vérifiés sur tous les boutons icône-seul identifiés (favoris avec `aria-pressed`, fermeture de drawer, ouverture menu catégories, panier avec quantité annoncée). Les boutons accompagnés d'un texte visible (filtres, navigation catégories, CTA) n'ont pas besoin d'`aria-label` supplémentaire — le texte visible sert de nom accessible.
- **Images** : `PlaceholderImage` transmet systématiquement un `alt` descriptif (titre produit réel) quand une image réelle est affichée ; repli honnête (icône "image non disponible" + `role="img"`/`aria-label` explicite) si l'image est absente ou échoue au chargement — jamais d'image factice.
- **Navigation clavier** : `Drawer` (menu catégories, filtres mobile, mega-menu mobile) implémente correctement `role="dialog"`, `aria-modal`, piège de focus minimal (focus renvoyé à l'élément déclencheur à la fermeture), fermeture par `Échap`.
- **Tailles tactiles mobile** : la majorité des cibles tactiles (liens de catégories, CTA principaux) sont pleine largeur ou ≥ 42px. Quelques boutons icône-seul du header sont sous l'idéal 44px (voir P2-1, roadmap) — restent conformes au minimum WCAG 2.2 AA (24px).
- **Messages d'erreur** : page 404 claire et actionnable ; états vides (panier, recherche) explicites en langage naturel, jamais de code d'erreur technique exposé à l'utilisateur.

Aucune dégradation d'accessibilité n'a été introduite pour obtenir un rendu visuel — les deux corrections P0 et les deux corrections P1 sont neutres ou positives sur l'accessibilité (le nouveau lien de catégorie est nativement plus accessible qu'un bouton non-navigant ; le bouton sticky CTA annonce désormais son état "Ajouté ✓" plutôt que de rester silencieusement actif).

---

## 12. Parcours critiques

Tous testés en navigateur réel (Playwright, build de production, synchronisation stricte sur les changements d'URL réels plutôt que sur des délais arbitraires) :

| Parcours | Résultat |
|---|---|
| Accueil → catégorie → produit | ✅ `/` → `/category/electronique` → `/product/<slug>` |
| Produit → ajout panier | ✅ toast de confirmation affiché, panier mis à jour |
| Panier → checkout | ✅ `/cart` → `/checkout`, résumé correct |
| Recherche → produit | ✅ `/search?q=smartphone` → résultats corrects → `/product/<slug>` |
| Navigation mobile (drawer catégories) | ✅ ouverture/fermeture confirmées |
| CTA sticky mobile | ✅ apparition, ajout au panier, toast, masquage en fin de page — tous confirmés après correction |

---

## 13. Shopify safety check

- [x] Shopify strictement en lecture seule — **aucun appel `mcp__Shopify__*`, ni lecture ni écriture, effectué à aucun moment de cette mission**.
- [x] Aucun produit modifié
- [x] Aucun prix modifié
- [x] Aucun stock modifié
- [x] Aucun tag modifié (les 147 `cat-bijoux` restent inchangés, non touchés par cette mission)
- [x] Aucune variante modifiée
- [x] Aucune collection modifiée
- [x] Aucun produit publié/dépublié
- [x] Aucune commande créée
- [x] Aucun import CJ
- [x] Aucune donnée Shopify modifiée pour résoudre un problème UI (les 2 correctifs P0 et 2 correctifs P1 sont exclusivement du code frontend local — logique de navigation et de détection de scroll)
- [x] Aucune donnée commerciale inventée
- [x] Aucun faux numéro de téléphone utilisé
- [x] Aucun faux avis affiché
- [x] Aucun faux compteur de stock affiché
- [x] Aucune fausse urgence créée

---

## 14. Roadmap Phase 2

Voir `reports/ondeal-ux-ui-roadmap.md` pour le détail complet des points P2 (tailles de cible tactile, contraste des étoiles de notation) et des pistes d'amélioration continue identifiées pendant l'audit mais non implémentées dans cette phase.

---

## 15. Conclusion

L'audit UX/UI complet des 24 écrans a confirmé que l'interface OnDeal, déjà consolidée par les missions CRO et branding précédentes, est globalement solide : navigation, filtres, panier, checkout, pages légales, accessibilité de base et responsive fonctionnent correctement sur les 3 largeurs testées. Deux problèmes P0 ont été confirmés en conditions réelles de navigateur et corrigés — un bug de navigation desktop jusque-là non détecté (clic sur une catégorie du menu principal) et le bug de CTA sticky mobile déjà signalé, dont la cause exacte (limite d'`IntersectionObserver` face aux sauts de scroll instantanés) a été identifiée précisément. Deux problèmes P1 connexes au CTA sticky (chevauchement avec un autre produit, absence de protection anti double-tap) ont également été corrigés. Aucune donnée commerciale n'a été inventée, Shopify n'a fait l'objet d'aucune modification, et les trois validations techniques (`tsc`, `lint`, `build`) ainsi que l'ensemble des parcours critiques passent avec succès.
