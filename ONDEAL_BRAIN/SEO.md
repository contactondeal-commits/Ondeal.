# SEO.md — SEO technique & sémantique

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026.*

## Corrections déjà appliquées (CONFIRMÉ, session 01-02/09/2026, commitées)

- `layout.tsx` : ajout complet des métadonnées globales (title template, description, Open Graph, Twitter Card, robots, canonical via `metadataBase`), `viewport` avec la vraie couleur de thème (`#4f46e5`), JSON-LD `Organization` (nom légal, email, médiateur CM2C en `hasCredential`).
- `product/[slug]/page.tsx` et `category/[slug]/page.tsx` : ajout de `export const revalidate = 3600` — ces pages étaient en SSG pur sans revalidation, ce qui signifie qu'avant cette correction, un changement de prix/stock/description ne se répercutait sur les pages statiques qu'au prochain build complet, pas automatiquement.
- Google Shopping feed enrichi (voir MARKETING.md).

## Ce qui reste non traité ou non vérifié

- **Aucune donnée Search Console** consultée (pas d'accès configuré cette session) — impossible de savoir quelles requêtes génèrent réellement du trafic, ni l'état d'indexation réel. **INACCESSIBLE.**
- **Pages catégorie vides indexables** : les tags `cat-ordinateurs`, `cat-romans`, `cat-bd` (0 produit chacun) peuvent générer des pages catégorie vides si elles sont routées et liées en navigation — mauvais signal SEO (contenu fin/vide) si c'est le cas. **À VÉRIFIER** : confirmer si ces routes sont effectivement accessibles publiquement et liées, avant d'agir (noindex, retrait de nav, ou fusion).
- **JSON-LD Product/BreadcrumbList** : seul le JSON-LD `Organization` a été ajouté cette session. Aucun JSON-LD `Product` (prix, disponibilité, avis) ni `BreadcrumbList` n'a été confirmé présent sur les pages produit/catégorie — **À VÉRIFIER par lecture de `product/[slug]/page.tsx`** (non ré-audité en détail cette session pour ce point précis).
- **Maillage interne** : non audité cette session.

## Recommandations priorisées

1. **Faible risque, à faire en premier** : vérifier concrètement si les 3 tags à 0 produit génèrent des URLs publiques indexables ; si oui, les retirer de la navigation et/ou appliquer un `noindex` — action de code réversible, aucune donnée sensible touchée.
2. **Moyenne priorité** : ajouter JSON-LD `Product` + `BreadcrumbList` sur les pages produit/catégorie si absent — gain SEO structurel classique (rich snippets), zéro risque business.
3. **Bloquant pour tout pilotage SEO sérieux** : obtenir un accès Search Console (ou équivalent) — sans cela, toute priorisation SEO reste une hypothèse.
