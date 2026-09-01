# OnDeal — Journal des décisions (mode autonome)

Ce fichier documente les décisions techniques/produit prises de manière autonome, avec leur justification, pour que le dirigeant d'OnDeal puisse comprendre et, si besoin, revenir dessus sans avoir à relire tout le code.

Règle appliquée à chaque décision : conversion / confiance / UX / SEO / performance / fidélisation / marketplace — lequel de ces 7 critères a motivé le choix, et quel compromis a été fait.

---

## Décisions héritées de la session précédente (rappel, non ré-décidées ici)

- **Connexion client → portail natif Shopify plutôt que système à mot de passe personnalisé.** Diagnostiqué en direct (compte réel `brou.alex75@gmail.com`) : la boutique utilise le nouveau système "Comptes clients" Shopify (sans mot de passe, `account.ondeal.fr`). Un système de connexion personnalisé à mot de passe ne peut jamais authentifier ces comptes. Décision validée par le dirigeant le 2026-08-15 : rediriger tout vers le portail natif plutôt que maintenir deux systèmes incompatibles. Confiance + fiabilité > personnalisation visuelle de /account.

---

_(les décisions de la mission autonome sont ajoutées ci-dessous au fil de l'avancement, avec la justification business à chaque fois)_
