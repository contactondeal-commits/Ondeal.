# CUSTOMER.md — Intelligence client

*Voir `_LEGEND.md`. Mise à jour : 02/09/2026.*

## Ce qui est réellement connu

Aucun accès à Google Analytics, Search Console, ou toute plateforme d'analytics comportemental n'a été configuré ou consulté cette session — **INACCESSIBLE**. Le code de `layout.tsx` confirme d'ailleurs qu'aucun identifiant GA4 n'est configuré dans l'environnement (`NEXT_PUBLIC_GA4_MEASUREMENT_ID` absent) — **CONFIRMÉ, et c'est en soi une lacune critique** : OnDeal n'a actuellement aucune vue chiffrée sur le trafic, les sources d'acquisition ou le comportement des visiteurs (voir DATA.md, RISKS.md).

Aucune liste de clients réels, aucune commande réelle, aucun avis Judge.me n'a été consulté cette session (les outils `mcp__Shopify__list-orders` / `list-customers` sont disponibles mais n'ont pas été utilisés pour cette mission — **À VÉRIFIER / action recommandée à court terme**, voir ROADMAP.md 7 jours).

## Ce qu'on peut déduire indirectement du catalogue (HYPOTHÈSE, pas une segmentation validée)

Sur la base de la structure de prix (85 % du catalogue < 50 €, CONFIRMÉ en BUSINESS.md) et de la répartition catégorielle (bijoux/montres/jouets/cuisine/jardin dominants), le profil client le plus plausible est un acheteur "petit prix / achat plaisir ou cadeau", sensible au prix, probablement capté via réseaux sociaux ou recherche impulsive plutôt que recherche intentionniste de marque précise. **Ceci est une hypothèse de travail, pas une donnée vérifiée** — à confronter à de vraies données d'audience dès qu'un accès Analytics/Search Console/Meta Ads sera fourni.

## Parcours client documenté côté produit (CONFIRMÉ, lecture code)

- Formulaire "poser une question" sur fiche produit (`QuestionForm.tsx` → `api/ask-question/route.ts`, corrigé cette session : anti-spam honeypot + échappement HTML ajoutés).
- Formulaire partenaires (`partenaires/page.tsx` → `api/partenaires/route.ts`) — **était cassé à 100 % (405 sur toute soumission) avant la correction du 01-02/09/2026**, donc tout partenaire ayant tenté de contacter OnDeal via ce formulaire avant cette date n'a jamais reçu de suite. Impact business potentiellement réel, non quantifiable rétroactivement.
- Flow email d'abandon de panier actif selon `ONDEAL_AUTONOMOUS/CHANGELOG.md` (15/08/2026) — **CONFIRMÉ comme documenté**, non re-testé en live cette session.

## Lacunes à combler (À VÉRIFIER / INACCESSIBLE — priorité)

1. Aucune donnée de trafic (sessions, sources, appareils) — bloque toute décision d'acquisition chiffrée.
2. Aucun avis client consulté (Judge.me est intégré selon la stack documentée, mais son contenu réel n'a pas été lu cette session).
3. Aucune donnée de panier moyen, taux de conversion, taux de retour réel.
4. Aucune définition de persona écrite et validée par l'utilisateur.
