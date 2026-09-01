# OnDeal — Procédure de rollback (mode autonome)

## Principe

Chaque correctif de cette mission est un commit Git isolé et déployé individuellement (`vercel deploy --prod`). Aucune opération destructive n'est effectuée sur des données réelles (commandes, clients, paiements, stock) sans sauvegarde vérifiable préalable — voir la règle "EXCEPTION — DONNÉES IRRÉVERSIBLES" de la mission.

## Revenir à une version précédente du code (Vercel)

Chaque déploiement `vercel deploy --prod` crée une nouvelle URL de déploiement immuable (visible dans les logs de commit ci-dessous et dans le dashboard Vercel du projet `ondeal-marketplace`, org `on-deal`). Pour revenir en arrière :

```bash
# Lister les déploiements récents
vercel ls ondeal-marketplace --token=$VERCEL_TOKEN

# Promouvoir un déploiement antérieur en production
vercel promote <deployment-url> --token=$VERCEL_TOKEN
```

Alternative via Git : chaque commit correspond à un état stable et testé (voir CHANGELOG.md). `git revert <commit>` puis redéployer.

## Revenir à une version précédente du code (Git)

```bash
git log --oneline    # identifier le commit à restaurer
git revert <hash>     # annule proprement un commit précis sans réécrire l'historique
npm run build         # revalider avant de redéployer
vercel deploy --prod --token=$VERCEL_TOKEN --yes
```

## Données Shopify (Admin API)

Aucune modification destructive de données Shopify (clients, commandes, stock réel) n'est effectuée dans cette mission sans mention explicite ici, avec la sauvegarde correspondante. À ce stade de la mission : _aucune opération de ce type n'a été nécessaire._

---

_(mis à jour si une opération avec mécanisme de rollback spécifique est effectuée)_
