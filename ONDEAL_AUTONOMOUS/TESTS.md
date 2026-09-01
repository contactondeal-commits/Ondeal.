# OnDeal — Journal des tests (mode autonome)

Chaque correctif déployé en production est vérifié selon le même protocole (voir AGENTS.md / standing rules de la session) :

1. `npx tsc --noEmit` — aucune erreur de type.
2. `npx eslint <fichiers modifiés>` — aucune erreur (les warnings pré-existants non liés au changement ne sont pas traités comme des régressions).
3. `npm run build` — build de production complet, aucune page en échec.
4. Vérification fonctionnelle réelle (Playwright, contre le serveur de build de production en local sur le port 3100, ou directement contre ondeal.fr) — jamais de test contre le serveur `next dev`.
5. Déploiement `vercel deploy --prod`.
6. Vérification live sur https://ondeal.fr après déploiement (curl et/ou Playwright), avant de considérer le correctif comme terminé.

Aucun script de test temporaire n'est laissé dans le dépôt (`scripts/_*.mjs` toujours supprimé après usage, vérifié via `git status --short` avant chaque commit).

---

## Journal

_(rempli au fil des correctifs réels — voir aussi IMPROVEMENTS.md)_
