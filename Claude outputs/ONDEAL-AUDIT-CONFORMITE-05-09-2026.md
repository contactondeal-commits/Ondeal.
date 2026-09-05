# Audit technique, sécurité, RGPD et conformité SaaS — Intelligence OnDeal
**Date : 05/09/2026 — Commit audité : `0dcac53` (production, `intelligence.ondeal.fr`) — Audit en lecture seule, aucun fichier modifié**

Ce rapport correspond à la **Phase 1** demandée : inspection complète avant toute modification. Six audits ont été menés en parallèle (architecture/Prisma, authentification/IDOR, Stripe, intégrations OAuth, flux IA/logs/secrets, pages légales/RGPD), chacun en lisant le code réellement déployé — pas une supposition. Un plan d'implémentation (Phases 2 à 12) suit le rapport, mais **aucun code n'a été modifié à ce stade**.

---

## Résumé exécutif

Le produit est **techniquement bien construit du point de vue sécurité applicative** : isolation multi-tenant rigoureuse (0 IDOR trouvé sur 33/33 routes API auditées), chiffrement correct des secrets d'intégration (AES-256-GCM), vérification systématique des signatures webhooks (Shopify + Stripe), pas de secret en dur, pas de PII client final collectée dans le cœur du produit (commandes sans données clients). C'est un socle solide.

En revanche, le produit est **quasiment nu côté conformité déclarative et droits utilisateurs** : aucune CGU, aucune case à cocher de consentement à l'inscription, aucune page mentions légales, aucun export/suppression de données en self-service, une politique de confidentialité qui contredit légèrement le schéma réel, et un contrôle de plan payant qui a un vrai trou (une organisation gratuite peut déclencher des actions premium via l'API directement). Rien de tout cela n'est irrattrapable, mais rien n'est fait non plus — il ne faut pas partir du principe que "c'est presque bon".

Les documents fournis (Guichet Unique, attestation de domiciliation KANDBAZ) donnent l'identité légale exacte à utiliser pour les pages juridiques — voir section dédiée en fin de rapport.

---

## A. Architecture actuelle

- **Stack** : Next.js 16.3.4 (App Router), React 19.2.8, TypeScript, Prisma 6.x, PostgreSQL (Neon) en production, hébergement Vercel.
- **Modèle multi-tenant** : `User` → `Membership(role)` → `Organization` → `Store` → données (produits, commandes, avis, scores, recommandations, actions). Isolation appliquée systématiquement via `requireStoreAccess(storeId)` côté API et `requireStore(searchParams)` côté pages serveur.
- **Rôles** : `OWNER/ADMIN/ANALYST/VIEWER`, avec `WRITE_ROLES` et `ADMIN_ROLES` vérifiés côté serveur (pas seulement dans le menu).
- **Sécurité transverse** : `src/middleware.ts` gère dynamiquement le CSP `frame-ancestors` (autorise l'iframe Shopify uniquement pour une session embarquée valide) ; `next.config.ts` pose HSTS, nosniff, Permissions-Policy, Referrer-Policy.
- **Chiffrement** : `src/lib/crypto.ts` — AES-256-GCM, clé 32 octets via `CREDENTIALS_ENCRYPTION_KEY`, refuse de démarrer avec la valeur placeholder.
- **⚠️ Point structurel notable** : **aucun dossier `prisma/migrations` n'existe** — le schéma est appliqué via `prisma db push`, pas via des migrations versionnées. Pas de garde-fou de rollback, pas d'historique d'évolution du schéma dans le dépôt. À corriger avant que le produit grossisse encore (bascule vers `prisma migrate` recommandée).
- **Intégrations** : Shopify (OAuth + App Bridge embedded), WooCommerce, PrestaShop, Judge.me, CJdropshipping (clés API), Stripe (clé serveur). Anthropic (Claude Haiku) pour un assistant IA optionnel.

## B. Données personnelles traitées

| Catégorie | Donnée | Où | Chiffré/protégé |
|---|---|---|---|
| Compte OnDeal (le marchand) | email, nom, mot de passe (haché bcrypt) | `User` | Mot de passe haché ; email/nom en clair (normal) |
| Facturation | `stripeCustomerId`, `stripeSubscriptionId` | `Organization` | Identifiants externes, pas des secrets |
| Intégrations tierces | tokens Shopify/WooCommerce/PrestaShop/Judge.me/CJ | `Integration.encryptedCredentials` | **Oui, AES-256-GCM** |
| **Client final du marchand** | `authorName` (nom de l'auteur d'un avis Judge.me) | `Review` | **Non chiffré, en clair** — seule donnée nominative de client final réellement stockée |
| Mode test avis | `author`, `email` (fictifs par conception) | `TestReview` | Non chiffré ; rien n'empêche techniquement d'y saisir une vraie adresse |
| Assistant IA | texte libre de la question posée par l'utilisateur OnDeal | `AuditLog.message` + transmis à Anthropic | **Non filtré** — voir risque ÉLEVÉ en section G |

**Confirmé par lecture du connecteur Shopify réel** (`ORDERS_QUERY`) : aucun champ client (nom, email, adresse, téléphone) n'est demandé à l'API Shopify pour les commandes. Le connecteur Judge.me exclut explicitement l'email/IP du client. C'est une politique de non-collecte volontaire et vérifiée dans le code, pas une affirmation marketing.

**Incohérence à corriger** : la page `/privacy` affirme "aucune coordonnée nominative de clients finaux" alors que `Review.authorName` en est une (à l'affichage uniquement, jamais envoyée à l'IA).

## C. Données e-commerce traitées

`Product`, `Variant` (SKU, prix, stock, coût), `Order`/`OrderLine` (montants, statuts, **sans aucune donnée client**), `SalesSnapshot`/`MarginSnapshot` (agrégats dérivés), `Review`/`TestReview`, `CostAssumption` (hypothèses de coût saisies manuellement), `Recommendation`/`ActionItem` (moteur de scoring et d'actions, avec `ActionSensitivity.SENSITIVE` forçant une validation humaine pour les changements de prix/stock/publication).

## D. Sous-traitants externes (constatés dans le code, pas supposés)

| Sous-traitant | Rôle | Données concernées |
|---|---|---|
| **Vercel** | Hébergement, exécution, cron | Toute la donnée applicative en transit/exécution |
| **Neon (PostgreSQL)** | Base de données | Toute la donnée persistée |
| **Stripe** | Paiement par carte | Email/nom du payeur, statut d'abonnement (aucune donnée de carte ne transite par OnDeal) |
| **Shopify** | Plateforme e-commerce du marchand | Catalogue, commandes (sans PII client), avis (via Judge.me) |
| **Judge.me** | Avis produits | `authorName` (nom du client final) |
| **WooCommerce / PrestaShop** | Plateformes e-commerce alternatives | Catalogue, commandes |
| **CJdropshipping** | Fournisseur dropshipping | Stock fournisseur |
| **Anthropic (Claude Haiku)** | Assistant IA en langage naturel | Texte libre de la question + faits agrégés (marge, stock, scores) — **jamais** de nom/email client |

Aucune page/liste dédiée aux sous-traitants n'existe ; ils ne sont mentionnés que dans la section 6 de `/privacy`.

## E. Flux de données

```
Marchand (navigateur) ──HTTPS──> Next.js (Vercel) ──Prisma──> PostgreSQL (Neon)
                                        │
                                        ├──> Shopify/WooCommerce/PrestaShop/Judge.me/CJ (sync catalogue/commandes/avis)
                                        ├──> Stripe (paiement carte)
                                        └──> Anthropic (assistant IA, si ANTHROPIC_API_KEY configurée)
```
Aucun flux vers un fournisseur d'analytics/tracking (aucun GA4/Pixel/Hotjar trouvé). Aucun upload de fichier utilisateur (pas de stockage binaire côté OnDeal).

## F. Risques sécurité

| # | Risque | Sévérité | Détail |
|---|---|---|---|
| F1 | CSRF sur les routes mutatives, notamment le flux embarqué Shopify (cookie `SameSite=None`), sans jeton CSRF | **MOYEN/ÉLEVÉ** (scope intra-tenant uniquement, pas de fuite cross-org) | Un marchand piégé pourrait déclencher une mutation sur **sa propre** boutique via une page malveillante |
| F2 | Rate limiting en mémoire, non partagé entre instances serverless Vercel | **MOYEN** | Limite l'efficacité réelle en production multi-instance ; le code le documente déjà lui-même |
| F3 | Comparaison non constant-time du secret `CRON_SECRET` (`===` au lieu de `timingSafeEqual`) | **FAIBLE** | Timing attack théorique, exploitabilité très faible en HTTPS |
| F4 | Oracle d'existence 404 vs 403 sur `actions/[id]/*` | **FAIBLE** | IDs `cuid()` non devinables — impact négligeable |
| F5 | 3 routes (`actions`, `actions/bulk`, `actions/bulk/confirm`) sans schéma Zod strict | **FAIBLE** | `requireStoreAccess` s'applique quand même ; inconsistance de style, pas une faille IDOR |
| F6 | Filtrage SSRF WooCommerce/PrestaShop par blocklist littérale d'hôtes privés, pas par résolution DNS | **FAIBLE** | Déjà noté dans le code lui-même comme non garanti à 100 % contre le DNS rebinding |

**Aucune vulnérabilité IDOR trans-organisation trouvée** après revue exhaustive des 33 routes API et des pages serveur associées (couverture 100 %, pas un échantillon). Aucune injection SQL (tous les `$queryRaw` utilisent `Prisma.sql` paramétré). Aucun secret en dur. Aucune stack trace exposée au client.

## G. Risques RGPD

| # | Risque | Sévérité | Détail |
|---|---|---|---|
| G1 | Texte libre de l'assistant IA transmis à Anthropic sans filtrage, et stocké tel quel (sans purge) dans `AuditLog`, visible par toute l'équipe de l'organisation | **ÉLEVÉ** | Un marchand pourrait involontairement transmettre une donnée personnelle de client (nom, email collés dans sa question) |
| G2 | Aucune CGU, aucune case à cocher de consentement à l'inscription | **ÉLEVÉ / OBLIGATOIRE** | Un compte est créé (traitement de données personnelles) sans consentement explicite tracé |
| G3 | Page `/privacy` invisible depuis l'app (aucun lien dans le footer/navigation/paramètres) | **ÉLEVÉ / OBLIGATOIRE** | Accessible uniquement par URL directe |
| G4 | Aucun export/suppression de données en self-service (seulement un email manuel mentionné dans `/privacy`) | **MOYEN** | Droit d'accès/effacement RGPD non opérationnalisé dans le produit |
| G5 | Déconnexion d'intégration efface les identifiants mais pas les données déjà synchronisées (avis Judge.me, etc.) | **MOYEN** | Le marchand ne peut pas faire disparaître les données importées sans passer par un canal manuel |
| G6 | Bug bloquant : déconnexion **CJdropshipping** impossible (l'enum Zod de `/api/integrations/disconnect` omet `CJDROPSHIPPING`) | **ÉLEVÉ (bug + RGPD)** | Le token CJ ne peut jamais être supprimé via le parcours standard — à corriger en priorité, c'est un bug pur en plus d'un point RGPD |
| G7 | Incohérence `/privacy` vs schéma réel (`Review.authorName`) | **FAIBLE** | À reformuler pour rester exact |
| G8 | Aucune politique de rétention documentée pour le sous-traitant Anthropic (DPA à obtenir) | **MOYEN** | Ne jamais affirmer une conformité sans le DPA du fournisseur |
| G9 | Pas de bandeau cookies — mais **non requis aujourd'hui** car aucun cookie non essentiel n'est posé (à réévaluer si un tracker est ajouté un jour) | **INFORMATIONNEL** | Bon point actuel, vigilance future |

## H. Risques Stripe

| # | Risque | Sévérité |
|---|---|---|
| H1 | `isStripeConfigured()` ne vérifie pas `STRIPE_WEBHOOK_SECRET` — si mal configuré, un paiement réel peut être encaissé sans jamais activer le plan (silencieusement) | **ÉLEVÉ** |
| H2 | Pas de protection contre un événement webhook livré hors séquence pour le même abonnement (Stripe ne garantit pas l'ordre) | **MOYEN** |
| H3 | Pas de table d'événements Stripe déjà traités → doublons `AuditLog` en cas de redélivrance (cosmétique, sans impact fonctionnel) | **FAIBLE** |

**Points forts confirmés** : le prix/montant n'est jamais fourni par le client (toujours un Price ID serveur) ; `Organization.plan` n'est modifié qu'à 2 endroits dans tout le code (les deux webhooks, signature vérifiée) ; `checkout.session.completed` est ignoré à dessein pour éviter d'activer un plan avant confirmation réelle ; tests dédiés (`tests/stripeBilling.test.ts`) couvrant signature valide/altérée/rejeu/rotation.

## I. Risques Shopify / API

| # | Risque | Sévérité |
|---|---|---|
| I1 | **Le moteur d'actions (changement de prix réel sur Shopify) n'est jamais vérifié côté serveur par rapport au plan de l'organisation** — seul l'affichage frontend restreint l'accès à la marge/pricing. Un compte `STARTER` avec un rôle `ANALYST` peut, en appelant directement l'API, saisir des coûts (`/api/cost-assumptions`) et confirmer/exécuter une action de changement de prix réel, sans jamais payer | **ÉLEVÉ** |
| I2 | Features "Automatisations avancées" et "Historique" présentées comme réservées BUSINESS/AGENCY dans l'UI mais jamais vérifiées sur les routes correspondantes (`actions/bulk`, `/audit-log`) | **MOYEN (fuite de revenu, pas de sécurité)** |
| I3 | Blocage Shopify App Store connu (déjà traité en partie ce jour) : `appSubscriptionCreate` refusé tant que l'app n'est pas migrée côté Partners — bouton masqué en attendant | **Déjà mitigé aujourd'hui** |
| I4 | Bug déconnexion CJdropshipping (voir G6) | **ÉLEVÉ** |

## J. Facturation

- Flux Stripe et Shopify Billing tous deux fonctionnels dans leur logique (le Shopify natif est actuellement masqué côté UI en attendant la migration Partners, décision prise plus tôt aujourd'hui).
- **Aucune fonctionnalité de facturation électronique française** : pas de génération de facture avec numéro séquentiel, pas de mention SIREN/SIRET/TVA du vendeur, pas de gestion d'avoir, pas d'export comptable. Stripe génère ses propres reçus de paiement mais ce ne sont pas des factures conformes françaises avec les mentions obligatoires (nom/SIREN du vendeur, numéro de facture séquentiel, etc.).
- **Statut juridique du vendeur = entrepreneur individuel (micro-entreprise)**, pas une société : cela change les mentions obligatoires sur les factures (numéro RCS non applicable de la même façon, mention "TVA non applicable, art. 293 B du CGI" si sous le seuil de franchise en base — **à confirmer avec l'expert-comptable**, je ne peux pas garantir le statut TVA actuel sans document comptable).
- Réforme facturation électronique B2B France : calendrier et obligations à reconfirmer à la date de mise en œuvre (mon dernier ancrage fiable est fin janvier 2026) — **ne pas construire de plateforme "agréée" maison**, une intégration avec un prestataire compatible (facturation électronique) sera nécessaire le moment venu.

## K. Pages juridiques manquantes

| Page | Statut |
|---|---|
| `/privacy` (politique de confidentialité) | ✅ Existe, correcte mais invisible dans l'app, une inexactitude à corriger |
| Mentions légales | ❌ Absente |
| CGU | ❌ Absente |
| CGV | ❌ Absente |
| Cookies | ❌ Absente (non bloquant tant qu'aucun tracker n'est ajouté) |
| DPA | ❌ Absente (structurée) |
| Sous-traitants (page dédiée) | ⚠️ Seulement listés dans `/privacy` §6 |
| Sécurité / Trust Center | ❌ Absente |

## L. Fonctionnalités de conformité manquantes

- Case à cocher CGU/confidentialité à l'inscription — **absente**.
- Section "Confidentialité / Données" dans Paramètres — **absente**.
- Export de données self-service — **absent** (email manuel uniquement).
- Suppression de compte/organisation self-service — **absente** (seul le webhook Shopify `shop/redact` supprime réellement, hors contrôle direct de l'utilisateur).
- Suppression réelle des données lors d'une déconnexion d'intégration (au-delà des identifiants) — **absente**.
- Gestion des préférences de consentement — **sans objet aujourd'hui** (pas de tracker), mais à prévoir en amont si un tracker est ajouté.

## M. Priorités — synthèse

### CRITIQUE
*(rien classé critique — aucune fuite de données cross-organisation, aucun secret exposé, aucune faille d'authentification)*

### ÉLEVÉE
1. Bug déconnexion CJdropshipping impossible (G6/I4) — **technique**, correctif direct.
2. Contrôle serveur du plan absent sur le moteur d'actions/cost-assumptions (I1) — **technique**.
3. `isStripeConfigured()` n'inclut pas `STRIPE_WEBHOOK_SECRET` (H1) — **technique**.
4. Absence de CGU + case à cocher consentement à l'inscription (G2) — **obligatoire, technique + rédaction juridique**.
5. Page `/privacy` invisible dans l'app (G3) — **technique** (lien), immédiat.
6. Texte libre de l'assistant IA non filtré vers Anthropic + persistance sans purge (G1) — **technique + décision produit**.

### MOYENNE
- Rate limiting non partagé entre instances (F2) — technique, nécessite un service externe (Upstash/Redis).
- CSRF sur flux embarqué Shopify (F1) — technique.
- Pas d'export/suppression self-service (G4, L) — technique + décision produit sur la priorité.
- Événements Stripe désordonnés non protégés (H2) — technique.
- Features BUSINESS/AGENCY non vérifiées côté serveur (I2) — technique.
- Incohérence /privacy vs schéma (G7) — rédactionnel, rapide.
- Facturation électronique française absente (J) — **décision entreprise + validation expert-comptable**, pas un simple correctif technique.

### FAIBLE
- Migrations Prisma absentes (A) — technique, chantier de fond.
- Comparaison non constant-time du `CRON_SECRET` (F3).
- Oracle d'existence 404/403 (F4), inconsistance Zod sur 3 routes (F5), SSRF par blocklist littérale (F6).
- Doublons AuditLog sur redélivrance webhook (H3).

---

## Informations légales de l'entité (extraites des documents fournis, à valider par vous avant publication)

D'après le Guichet Unique des Entreprises (formalité Y00274281229, 22/08/2026) et l'attestation de domiciliation KANDBAZ :

- **Forme juridique** : Entrepreneur individuel (micro-entreprise)
- **Nom** : BROU Alex Christophe
- **SIREN** : 994594059
- **SIRET (établissement principal)** : 994 594 059 00010
- **Code APE** : 4791A (Vente à distance sur catalogue général)
- **Adresse professionnelle (domiciliation)** : 231 rue Saint-Honoré, 75001 Paris, France
- **Domiciliataire** : KANDBAZ (SAS), RCS Paris 497 933 408, agrément préfectoral N°DOM2025097
- **Nom de domaine déclaré** : ondeal.fr
- **Activité déclarée** : vente à distance de produits de consommation courante par site internet marchand, sans stock physique (dropshipping), régime micro-entrepreneur
- **TVA** : non mentionnée dans ces documents — **à confirmer avec votre expert-comptable** (probable franchise en base de TVA en micro-entreprise selon le chiffre d'affaires, mais je n'ai aucun document comptable pour l'affirmer)

**Point d'attention business à trancher, pas technique** : le statut de micro-entreprise plafonne le chiffre d'affaires annuel (seuil commercial/vente, à reconfirmer au moment venu — je n'ai pas de source à jour fiable sur le seuil 2026 exact). Un SaaS par abonnement qui grossit peut dépasser ce plafond assez vite ; c'est une décision d'entreprise (et de votre expert-comptable) de basculer vers une société (SASU/EURL...) le cas échéant — pas quelque chose que je peux ou dois décider dans le code.

---

## Plan d'implémentation proposé (Phases 2 à 12) — pour validation avant exécution

Je ne commence aucune des phases suivantes sans votre feu vert, phase par phase si vous préférez. Je classe chaque item par nature :
**[T]** technique (je peux l'implémenter) · **[D]** décision d'entreprise nécessaire · **[J]** validation juriste/expert-comptable nécessaire avant publication/usage · **[O]** obligatoire · **[R]** recommandé.

### Phase 2 — RGPD (architecture + droits)
- [T][O] Corriger le bug CJdropshipping (ajouter `CJDROPSHIPPING` à l'enum de déconnexion) — correctif isolé, sûr, rapide.
- [T][O] Case à cocher CGU + Politique de confidentialité obligatoire à l'inscription, avec horodatage du consentement stocké en base.
- [T][R] Section "Confidentialité / Données" dans Paramètres (lien vers `/privacy`, demande d'export/suppression même si le traitement reste manuel au départ).
- [T][O] Lier `/privacy` depuis le footer/navigation de l'app.
- [J] Rédaction des CGU, CGV, mentions légales, page cookies, DPA — **je peux produire des modèles avec placeholders clairement marqués "à faire valider juridiquement"**, en utilisant les informations légales ci-dessus comme base factuelle, mais je ne suis pas juriste et ne dois pas être traité comme tel.
- [T][R] Suppression réelle des données à la déconnexion d'une intégration (pas seulement les identifiants).

### Phase 3 — Données envoyées à l'IA
- [T][O] Retirer le texte libre `question` du prompt envoyé à Anthropic, ou le remplacer par l'intention détectée (enum fermé) déjà calculée côté serveur — élimine la fuite de PII potentielle à la source.
- [T][R] Si le texte libre doit être conservé pour la reformulation, ajouter un avertissement UI ("ne mentionnez pas de données personnelles de vos clients") et un masquage best-effort avant envoi.
- [T][R] Ne pas persister le texte libre non filtré dans `AuditLog` sans limite de rétention, ou tronquer/masquer avant stockage.
- [J] Obtenir/documenter le DPA Anthropic (rétention, formation, transfert) avant d'affirmer une conformité.

### Phase 4 — Sécurité
- [T][O] Gating serveur du plan sur le moteur d'actions (`/api/cost-assumptions`, `/api/actions*`) — c'est le point le plus important de cette phase, ça touche à la fois sécurité et revenu.
- [T][R] Jeton CSRF ou vérification d'origine sur les routes mutatives, en particulier le flux embarqué Shopify.
- [T][R] Rate limiting partagé (Upstash/Redis) au lieu de la mémoire par instance.
- [T][R] `timingSafeEqual` pour le secret cron.

### Phase 5 — Stripe
- [T][O] Inclure `STRIPE_WEBHOOK_SECRET` dans `isStripeConfigured()`.
- [T][R] Protection anti-désordre sur les événements webhook (comparer un timestamp/version avant d'appliquer un changement de statut).

### Phase 6 — Facturation électronique française
- [D][J] Décision d'entreprise + validation expert-comptable sur le statut TVA réel et le calendrier d'obligation de facturation électronique applicable à une micro-entreprise.
- [T] (une fois la décision prise) Génération de factures conformes (numérotation séquentielle, mentions SIREN/SIRET/adresse, TVA le cas échéant), historique, téléchargement.
- [D] Choix d'un prestataire de facturation électronique compatible si l'obligation s'applique — je peux proposer une architecture d'intégration, pas choisir le prestataire à votre place.

### Phase 7 — Cookies/tracking
- [T][R] Rien à faire dans l'immédiat (aucun tracker non essentiel). Prévoir un bandeau de consentement **au moment** où un premier tracker sera ajouté, pas avant.

### Phase 8 — Droits utilisateur (self-service)
- [T][R] Paramètres → Confidentialité (télécharger mes données, demander la suppression, voir les connexions).
- [T][R] Paramètres organisation → Données (export, suppression de store, déconnexion propre des intégrations).

### Phase 9 — Sous-traitants
- [T][R] Page dédiée listant les sous-traitants réels constatés (section D ci-dessus) avec finalité/catégories de données/localisation.

### Phase 10 — Pages juridiques
- [J] Textes rédigés avec placeholders `[SIREN]`, `[SIRET]`, `[ADRESSE]`, etc. — je peux pré-remplir avec les informations réelles ci-dessus (SIREN 994594059, adresse 231 rue Saint-Honoré 75001 Paris) puisque vous me les avez fournies, mais la validation juridique finale reste la vôtre avant publication.

### Phase 11 — Sécurité / Trust Center
- [T][R] Page `/security` factuelle (chiffrement AES-256-GCM réellement implémenté, HMAC réellement vérifié, etc.) — sans jamais prétendre à une certification (ISO 27001/SOC 2) non obtenue.

### Phase 12 — Audit final
- [T] Une fois les phases ci-dessus exécutées : `tsc --noEmit`, lint, tests, build, vérification Prisma/migrations, routes API, permissions, Stripe, webhooks, OAuth, pages légales, variables d'environnement — avec un rapport final par item (CONFORME TECHNIQUEMENT / PARTIELLEMENT CONFORME / À FAIRE PAR LE PROPRIÉTAIRE / À FAIRE VALIDER PAR JURISTE / RISQUE CRITIQUE).

---

**Je n'ai touché à aucun fichier de code pendant cet audit.** Dites-moi par quelle phase commencer (je recommande Phase 2 en premier : le bug CJdropshipping + la case CGU sont rapides, sûrs, et à fort impact), ou si vous préférez que je traite d'abord le point le plus critique pour le revenu (Phase 4 — gating serveur du plan sur le moteur d'actions).
