# DESIGN_SYSTEM.md — Système de design

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026.*

## Confirmé

- Stack : CSS Modules (pas de framework CSS type Tailwind détecté dans les sessions précédentes), variables CSS custom (`--color-primary: #4f46e5` notamment).
- Accessibilité : des corrections antérieures documentées (`ONDEAL_AUTONOMOUS`, phases 3-4) portent sur le focus trap des drawers, le CTA sticky mobile, testées via Playwright (26/26 tests passés au 14/08/2026 sur le code applicatif — **CONFIRMÉ comme rapporté**, non re-exécuté cette session).
- Sécurité : headers CSP + 5 headers de sécurité (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS) confirmés présents dans `next.config.ts`, plus `poweredByHeader: false` ajouté cette session.

## Non audité cette session

Aucun audit visuel multi-résolution (390/834/1440px), aucun audit d'accessibilité WCAG complet (contraste, ARIA, navigation clavier) n'a été mené cette session — le dernier audit de ce type documenté date du 14/08/2026 et portait sur un code qui, à l'époque, n'était pas confirmé comme étant celui réellement servi en production (voir DATA.md pour le point déploiement). **À VÉRIFIER** : refaire un audit visuel/accessibilité ciblé maintenant que le déploiement Next.js semble actif en production (à reconfirmer).

## Recommandation

Avant tout nouvel audit visuel approfondi, confirmer explicitement que `ondeal.fr` sert bien l'application Next.js de ce dépôt (et non plus le thème Dawn) — un audit de code sans lien confirmé avec ce qui est réellement affiché aux visiteurs a une valeur limitée. Une vérification rapide : comparer un élément de design distinctif du code (ex. une classe CSS Module générée) avec le DOM live de ondeal.fr.
