# OnDeal — Limitations connues (mode autonome)

Ce fichier liste honnêtement ce qui a été identifié comme problème ou amélioration possible mais qui n'a **pas** été corrigé dans cette mission, avec la raison exacte : donnée métier manquante, décision commerciale/juridique nécessaire, dépendance externe (app à installer par le client, compte à créer), ou hors du scope technique atteignable dans cette passe.

Aucune ligne ici ne doit être confondue avec un correctif fait — voir IMPROVEMENTS.md pour ce qui est réellement en production.

---

## Héritées de la session précédente (rappel)

- **Judge.me (avis clients)** — nécessite l'installation de l'app par le client lui-même (flux OAuth Shopify, ne peut pas être fait par l'agent).
- **Klaviyo (flux panier abandonné)** — statut réel non vérifié, en attente d'une capture d'écran du client (Klaviyo → Flows).
- **Microsoft Clarity (tracking comportemental)** — nécessite que le client crée un compte gratuit et fournisse l'ID projet.
- **Chat / Messaging widget** — confirmé souhaité par le client, pas encore investigué/construit.
- **Knowledge Base → page /help** — app confirmée comme centre d'aide/FAQ, contenu pas encore branché.
- **Site multilingue (EN/ES/DE/JA-ZH)** — scope large, zéro contenu traduit n'existe actuellement dans Shopify, nécessite une architecture i18n complète — pas commencé.
- **`totalInventory` Shopify anormal sur 858/970 produits** (jusqu'à 3 440 217 en stock) — cause exacte non déterminable sans accès au flux fournisseur/CJdropshipping ; seul un signal binaire (`inStock`) est affiché au client en attendant.

---

_(les limitations découvertes pendant la mission autonome sont ajoutées ci-dessous)_

## Procédure de déploiement — à ne jamais oublier désormais

`www.ondeal.fr` et `ondeal.fr` sont deux alias Vercel INDÉPENDANTS (confirmé le 15/08/2026, incident réel) — réassigner l'un ne réassigne pas l'autre automatiquement, même si `www` a une règle de redirection configurée vers le domaine nu. Après chaque `vercel deploy --prod` (ou toute opération de rollback manuel via l'API), vérifier les DEUX :
```
curl -s -H "Authorization: Bearer $VERCEL_TOKEN" "https://api.vercel.com/v4/aliases?projectId=prj_9yXrUPI7GWu0Ig3V409ckPvanPSL&domain=ondeal.fr"
```
et s'assurer que `ondeal.fr` ET `www.ondeal.fr` pointent vers le même `deploymentId`.
