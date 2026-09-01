# OnDeal — Roadmap UX/UI Phase 2

Généré le : 2026-08-13
Source : `reports/ondeal-ux-ui-audit.md` (section 6, Problèmes P2)

Ce document liste les améliorations secondaires (P2) identifiées pendant l'audit UX/UI complet, non implémentées dans la phase de correction (P0/P1 uniquement), conformément à la consigne de la mission. Aucun chiffre de conversion, taux ou donnée business n'est indiqué ci-dessous — seules des observations techniques factuelles et des recommandations d'implémentation.

---

## P2-1 — Tailles de cible tactile mobile sous l'idéal 44×44px

**Constat** : mesuré en navigateur réel (390px) :
- Bouton menu hamburger (header mobile) : 36×36px
- Bouton panier (header mobile) : 42×38px
- Bouton de fermeture des drawers (`Drawer.tsx`) : 32×32px

**Conformité actuelle** : tous ces éléments respectent le minimum WCAG 2.2 AA (2.5.8 Target Size Minimum, 24×24px). Aucun n'est un manquement d'accessibilité bloquant.

**Recommandation** : augmenter le `padding` de ces boutons de quelques pixels pour se rapprocher de la recommandation AAA/Apple HIG/Material Design (44×44px), en conservant la taille visuelle actuelle de l'icône (agrandir uniquement la zone cliquable via `padding`, pas l'icône elle-même) pour ne pas alourdir visuellement le header.

**Fichiers concernés** : `src/components/layout/Header.module.css` (`.mobileMenuBtn`, `.cartBtn`), `src/components/ui/Drawer.module.css` (`.closeBtn`).

**Risque** : très faible — changement de padding uniquement, aucun impact fonctionnel.

**Priorité suggérée** : basse — amélioration de confort, pas de correction de bug.

---

## P2-2 — Contraste des étoiles de notation sous le seuil WCAG 1.4.11

**Constat** : `--color-rating` (`#F3A023`, orange de marque officiel) utilisé comme couleur de remplissage/contour des icônes étoiles (`ProductRating.tsx`) sur fond blanc donne un contraste de 2,13:1, sous le seuil recommandé de 3:1 pour les objets graphiques porteurs d'information (WCAG 1.4.11 Non-text Contrast). Ce chiffre est quasi identique à l'ancienne couleur orange générique (2,03:1) — ce n'est donc pas une régression introduite par l'intégration de l'identité visuelle, mais une limite préexistante.

**Pourquoi ce n'est pas bloquant en l'état** : la note numérique ("4.5") est affichée en texte à contraste conforme (`--color-text` sur blanc), et le conteneur porte un `aria-label` complet ("Note 4.5 sur 5, 128 avis") — l'information est donc intégralement accessible aux technologies d'assistance indépendamment du contraste visuel des icônes. L'impact réel se limite aux utilisateurs voyants à faible vision qui s'appuient uniquement sur la lecture visuelle des étoiles.

**Contrainte** : la mission interdit explicitement de dévier de la couleur de marque officielle (`#F3A023`) — la couleur elle-même ne peut donc pas être assombrie pour améliorer artificiellement le contraste.

**Recommandation** (à évaluer, non implémentée) : ajouter un léger contour (`stroke`) plus foncé (ex. une nuance de `--color-text` ou du bleu de marque `--color-primary` à faible opacité) sur les icônes `Star` de `lucide-react`, sans changer la couleur de remplissage perçue comme "orange de marque". Ceci est une technique standard pour améliorer la définition d'une icône colorée sur fond clair sans altérer sa teinte dominante.

**Fichier concerné** : `src/components/products/ProductRating.tsx`.

**Risque** : faible — modification visuelle mineure, à valider visuellement avant implémentation pour éviter un effet de bordure trop marqué.

**Priorité suggérée** : basse — non bloquant pour les technologies d'assistance, amélioration de confort visuel uniquement.

---

## Autres pistes identifiées pendant l'audit (non classées P0/P1/P2 strict, informations de contexte)

Ces points ont été observés pendant l'audit mais ne constituent pas des problèmes au sens strict de la mission — ils sont mentionnés pour information, à considérer si une Phase 2 plus large est engagée :

- **Section "Mes commandes" du compte** (`/account/orders`) : repose sur des données de démonstration locales car aucun système d'authentification client réel n'existe dans le projet. Non modifié (hors périmètre), mais à garder en tête si un vrai système de compte client est un jour connecté.
- **Rupture de stock** : aucun produit en rupture n'était présent dans l'échantillon du catalogue réel consulté pendant cet audit pour une vérification visuelle en conditions réelles — la logique a été vérifiée par lecture de code (chemins conditionnels `product.inStock`) sur `ProductCard`, la fiche produit, et `MobileStickyCta`. Une vérification visuelle en conditions réelles serait utile dès qu'un produit réel repasse en rupture de stock sur Shopify.

---

## Rappel — règle de vérité

Aucune amélioration listée ci-dessus ne doit être l'occasion d'introduire une donnée commerciale inventée (avis, statistique, stock, promotion, garantie, délai, preuve sociale). Toute donnée manquante doit continuer à être traitée par masquage propre ou état honnête "non disponible", jamais par une valeur fabriquée.
