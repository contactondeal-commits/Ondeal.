# 📋 RECAP SESSION — OnDeal Marketplace
**Date :** Mardi 1er septembre 2026 | 00h00 → 04h15 CEST  
**Projet :** ondeal-marketplace (Next.js 16.3 / Vercel)

---

## 🔧 BUGS CORRIGÉS

| Problème | Cause | Solution |
|---|---|---|
| Build cassé au démarrage | CSS collé dans `MainNav.tsx` | Restauré + séparé dans `MainNav.module.css` |
| Scripts bloqués | PowerShell PSSecurityException | Migré vers CMD |
| Popup invisible | `overflow: hidden` sur parent navbar | React Portal sur `document.body` |
| Exports manquants au build | `DeliveryLocation.tsx` collé dans `LocationContext.tsx` | Fichiers séparés proprement |

---

## 🚀 FONCTIONNALITÉS LIVRÉES

### 1. Géolocalisation complète (`DeliveryLocation.tsx`)
- ✅ Détection automatique par IP via `ipapi.co`
- ✅ Affichage drapeau + ville + pays dans la navbar
- ✅ Popup 4 étapes : menu → GPS confirm → loading → code postal → pays
- ✅ Écran de confirmation avant demande GPS (meilleur taux d'acceptation)
- ✅ Spinner de chargement pendant détection
- ✅ Gestion d'erreur GPS (permission refusée / timeout)
- ✅ Fermeture popup au clic extérieur
- ✅ React Portal — popup jamais bloquée par overflow

### 2. Contexte global React (`LocationContext.tsx`)
- ✅ `LocationProvider` wrappant tout le layout
- ✅ Prix convertis en temps réel selon le pays
- ✅ Tarifs de livraison réels depuis Shopify
- ✅ `localStorage` — choix mémorisé à chaque visite
- ✅ Fallback automatique sur FR si pays inconnu

### 3. Prix dynamiques par pays
- ✅ `ProductCard.tsx` — prix convertis sur les cartes
- ✅ `ProductPrice.tsx` — nouveau composant client pour fiche produit
- ✅ Mention "Prix converti · taux indicatif" si devise ≠ EUR
- ✅ Produits masqués si pays non livrable

### 4. Zones de livraison Shopify créées
- ✅ Zone **Maghreb** (MA, DZ, TN) → 19,90€
- ✅ Zone **Afrique subsaharienne** (SN, CI) → 29,90€
- ✅ MA/DZ/TN/SN/CI retirés de la zone "All Zones"

---

## 💱 TAUX DE CONVERSION (taux indicatifs)

| Pays | Devise | Taux | Livraison | Délai |
|---|---|---|---|---|
| 🇫🇷 France | EUR | 1x | 4,90€ (gratuit dès 80€) | 2-5 jours ouvrés |
| 🇧🇪 Belgique | EUR | 1x | 4,99€ | 4-7 jours ouvrés |
| 🇱🇺 Luxembourg | EUR | 1x | 4,99€ | 4-7 jours ouvrés |
| 🇩🇪 Allemagne | EUR | 1x | 4,99€ | 4-7 jours ouvrés |
| 🇪🇸 Espagne | EUR | 1x | 4,99€ | 4-7 jours ouvrés |
| 🇮🇹 Italie | EUR | 1x | 4,99€ | 4-7 jours ouvrés |
| 🇨🇭 Suisse | CHF | 0.97x | 4,99€ | 4-7 jours ouvrés |
| 🇬🇧 Royaume-Uni | GBP | 0.86x | 29,90€ | 7-14 jours ouvrés |
| 🇺🇸 États-Unis | USD | 1.08x | 29,90€ | 10-20 jours ouvrés |
| 🇨🇦 Canada | CAD | 1.47x | 29,90€ | 10-20 jours ouvrés |
| 🇲🇦 Maroc | MAD | 10.8x | 19,90€ | À confirmer |
| 🇩🇿 Algérie | DZD | 146x | 19,90€ | À confirmer |
| 🇹🇳 Tunisie | TND | 3.3x | 19,90€ | À confirmer |
| 🇸🇳 Sénégal | XOF | 655x | 29,90€ | À confirmer |
| 🇨🇮 Côte d'Ivoire | XOF | 655x | 29,90€ | À confirmer |

---

## 📁 FICHIERS CRÉÉS/MODIFIÉS

🚀 FONCTIONNALITÉS LIVRÉES
1. Géolocalisation complète (DeliveryLocation.tsx)
✅ Détection automatique par IP via ipapi.co
✅ Affichage drapeau + ville + pays dans la navbar
✅ Popup 4 étapes : menu → GPS confirm → loading → code postal → pays
✅ Écran de confirmation avant demande GPS (meilleur taux d'acceptation)
✅ Spinner de chargement pendant détection
✅ Gestion d'erreur GPS (permission refusée / timeout)
✅ Fermeture popup au clic extérieur
✅ React Portal — popup jamais bloquée par overflow
2. Contexte global React (LocationContext.tsx)
✅ LocationProvider wrappant tout le layout
✅ Prix convertis en temps réel selon le pays
✅ Tarifs de livraison réels depuis Shopify
✅ localStorage — choix mémorisé à chaque visite
✅ Fallback automatique sur FR si pays inconnu
3. Prix dynamiques par pays
✅ ProductCard.tsx — prix convertis sur les cartes
✅ ProductPrice.tsx — nouveau composant client pour fiche produit
✅ Mention "Prix converti · taux indicatif" si devise ≠ EUR
✅ Produits masqués si pays non livrable
4. Zones de livraison Shopify créées
✅ Zone Maghreb (MA, DZ, TN) → 19,90€
✅ Zone Afrique subsaharienne (SN, CI) → 29,90€
✅ MA/DZ/TN/SN/CI retirés de la zone "All Zones"
💱 TAUX DE CONVERSION (taux indicatifs)
Pays	Devise	Taux	Livraison	Délai
🇫🇷 France	EUR	1x	4,90€ (gratuit dès 80€)	2-5 jours ouvrés
🇧🇪 Belgique	EUR	1x	4,99€	4-7 jours ouvrés
🇱🇺 Luxembourg	EUR	1x	4,99€	4-7 jours ouvrés
🇩🇪 Allemagne	EUR	1x	4,99€	4-7 jours ouvrés
🇪🇸 Espagne	EUR	1x	4,99€	4-7 jours ouvrés
🇮🇹 Italie	EUR	1x	4,99€	4-7 jours ouvrés
🇨🇭 Suisse	CHF	0.97x	4,99€	4-7 jours ouvrés
🇬🇧 Royaume-Uni	GBP	0.86x	29,90€	7-14 jours ouvrés
🇺🇸 États-Unis	USD	1.08x	29,90€	10-20 jours ouvrés
🇨🇦 Canada	CAD	1.47x	29,90€	10-20 jours ouvrés
🇲🇦 Maroc	MAD	10.8x	19,90€	À confirmer
🇩🇿 Algérie	DZD	146x	19,90€	À confirmer
🇹🇳 Tunisie	TND	3.3x	19,90€	À confirmer
🇸🇳 Sénégal	XOF	655x	29,90€	À confirmer
🇨🇮 Côte d'Ivoire	XOF	655x	29,90€	À confirmer
📁 FICHIERS CRÉÉS/MODIFIÉS

src/ ├── context/ │ └── LocationContext.tsx ← CRÉÉ ├── components/ │ ├── layout/ │ │ └── DeliveryLocation.tsx ← REFAIT COMPLET │ └── products/ │ ├── ProductCard.tsx ← MIS À JOUR │ └── ProductPrice.tsx ← CRÉÉ └── app/

├── layout.tsx                   ← LocationProvider ajouté
└── product/[slug]/
    └── page.tsx                 ← ProductPrice intégré

---

## 📊 DÉPLOIEMENTS VERCEL

| # | URL | Statut |
|---|---|---|
| 1 | ondeal-marketplace-is1fu38c0-on-deal.vercel.app | ✅ |
| 2 | ondeal-marketplace-bkiam9957-on-deal.vercel.app | ✅ |
| 3+ | ondeal.fr (alias production) | ✅ |

**Pages générées :** 1267  
**Erreurs build :** 0  
**Temps build moyen :** ~2 min

---

## ⚠️ POINTS D'ATTENTION

- Les taux de conversion sont **indicatifs** — à mettre à jour si besoin
- Les délais Maghreb/Afrique sont "À confirmer" car Shopify ne stocke pas de transit times
- Le Maroc paie 19,90€ au checkout Shopify (zone Maghreb) — cohérent avec l'affichage
- `ipapi.co` est gratuit jusqu'à 1000 req/jour — à surveiller si trafic augmente

---

## 🔜 PROCHAINES ÉTAPES SUGGÉRÉES

- [ ] Ajouter prix convertis dans le **panier** (`cart`)
- [ ] Mettre à jour les taux de conversion automatiquement via une API
- [ ] Configurer les vrais délais de livraison dans Shopify (transit times)
- [ ] Ajouter d'autres pays (NL, PT, PL...)
- [ ] Surveiller le quota `ipapi.co` en production
— ce fichier reste dans votre projet pour référence future
# RECAP PROJET ONDEAL.FR — 01/09/2026

## Stack technique
- **Framework** : Next.js 16.3.0 (Turbopack, App Router)
- **Hosting** : Vercel (prod : ondeal.fr)
- **Backend** : Shopify Storefront API (dropshipping Syncee)
- **Reviews** : Judge.me
- **Email** : Klaviyo
- **Analytics** : GA4 + Google Ads conversion tracking
- **Bulk edits** : Matrixify

## État du site
- 1267 pages statiques générées (SSG)
- 68 catégories + 1158 produits
- Build : 0 erreur, 0 warning bloquant

## Ce qui est opérationnel ✅
- LocationContext : détection pays IP, taux de change live (open.er-api.com)
- Middleware proxy Next.js 16 compatible
- Images AVIF/WebP automatiques, cache 1 an
- SEO : canonical, robots, Open Graph, Twitter card, JSON-LD produit
- StockCountdown actif sur page produit
- Checkout Shopify sécurisé (validation GID, token serveur-only)
- Barre progression livraison offerte (progress bar violette)
- 23 pays couverts : FR, BE, LU, DE, ES, IT, CH, NL, PT, PL, AT, SE, DK, IE, GB, US, CA, MA, DZ, TN, SN, CI + fallback générique

## Devises supportées
EUR, CHF, GBP, USD, CAD, MAD, DZD, TND, XOF, PLN, SEK, DKK

## Seuil livraison offerte
- France : gratuit dès FREE_SHIPPING_THRESHOLD (défini dans site-config.ts)
- Autres pays : tarif fixe selon LOCATION_CONFIG

## Fichiers clés modifiés ce matin
- src/app/product/[slug]/page.tsx — try/catch + StockCountdown
- src/app/layout.tsx — SEO complet
- src/context/LocationContext.tsx — 8 pays ajoutés + devises
- src/components/cart/CartSummary.tsx — progress bar livraison
- src/components/cart/CartSummary.module.css — styles progress bar
- next.config.ts — AVIF/WebP, cache, optimizePackageImports

## Prochaines priorités suggérées
- [ ] OAuth customer account API (compte client sécurisé)
- [ ] Judge.me → Klaviyo flow (review-based emails)
- [ ] Titres/descriptions produits en français (Matrixify)
- [ ] JSON-LD BreadcrumbList sur pages catégorie
- [ ] Google Merchant Center : fix misrepresentation
- [ ] CSP (Content Security Policy) dédiée
