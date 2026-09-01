/**
 * Configuration centrale de la marque et du domaine.
 * Modifier ici pour personnaliser le site (nom, domaine, description).
 */

export const SITE_NAME = "Ondeal";

// Ordre de résolution (mission déploiement Vercel, 2026-08-14) :
// 1. NEXT_PUBLIC_SITE_URL explicite (ex: production réelle → https://ondeal.fr)
// 2. VERCEL_URL — injectée automatiquement par Vercel sur chaque déploiement
//    (preview/staging), jamais définie en dehors de Vercel. Usage strictement
//    serveur (metadata/sitemap/robots — voir grep "SITE_URL" dans src/), donc
//    l'absence du préfixe NEXT_PUBLIC_ ici n'est pas un problème : cette
//    variable n'a jamais besoin d'atteindre le bundle client.
// 3. Repli codé en dur, uniquement si aucune des deux n'est définie.
const resolveSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://ondeal.fr";
};

export const SITE_URL = resolveSiteUrl();

export const SITE_DESCRIPTION =
  "Ondeal, la marketplace qui réunit des milliers de produits high-tech, maison, mode, sport et plus encore, au meilleur prix.";

export const SITE_TAGLINE = "Votre marketplace au meilleur prix";

/**
 * Compte client — portail natif Shopify ("Comptes clients" nouvelle
 * génération, sans mot de passe), et non plus une page /login personnalisée.
 *
 * Mission "CONNEXION CLIENT" (15/08/2026) — signalé par le client
 * (brou.alex75@gmail.com, qui est en fait sa propre adresse) impossible de se
 * connecter. Diagnostic en direct sur l'API : cette boutique a le nouveau
 * système "Comptes clients" Shopify actif (vérifié via
 * shop.customerAccountsV2.url = "https://account.ondeal.fr", confirmé aussi
 * par shop.ondeal.fr/account qui redirige bien vers ce domaine). Tout compte
 * client créé autrement que par un ancien formulaire mot de passe classique
 * (invitation Shopify, case "créer un compte" au checkout, etc.) passe par ce
 * portail sans jamais avoir de mot de passe classique — la page /login
 * personnalisée construite plus tôt dans cette session (Storefront API
 * `customerAccessTokenCreate`) ne peut donc JAMAIS authentifier ces
 * comptes-là, quel que soit le correctif de message d'erreur. Le client a
 * choisi (2026-08-15) de tout rediriger vers ce portail natif plutôt que de
 * maintenir deux systèmes de connexion incompatibles : fonctionne
 * immédiatement pour tous les clients (existants et nouveaux), sans mot de
 * passe, sans maintenance. `shop.ondeal.fr/account` est le point d'entrée
 * correct (et non `account.ondeal.fr` directement) : Shopify y génère un
 * jeton signé (`buyer_flags`) avant de rediriger — un lien direct vers
 * account.ondeal.fr sans ce jeton ne fonctionne pas.
 */
export const SHOPIFY_ACCOUNT_URL = "https://shop.ondeal.fr/account";

/**
 * Livraison — seuil de gratuité et tarif standard en dessous du seuil.
 *
 * Source de vérité UNIQUE désormais : Shopify Admin > Réglages > Expédition
 * et livraison > Profil général > tarif Standard (France / UE+Suisse).
 *
 * Mission "BAISSE FRAIS DE PORT" (26/08/2026) — demande explicite : faire
 * passer le tarif standard de 14,90 € à 4,99 € pour la France, la Suisse,
 * la Belgique, l'Allemagne et le reste de l'UE (seuil de gratuité à 80 €
 * inchangé). Appliqué côté Shopify sur les zones "France" et
 * "UE (Union Européenne) + Suisse" du Profil général — la zone UE+Suisse a
 * pu être mise à jour par API, la zone France a dû être corrigée
 * manuellement dans l'Admin Shopify (l'API refuse la mise à jour tant
 * qu'une condition de palier de gratuité lui est rattachée).
 *
 * Avant la correction du 14/08/2026, CartSummary.tsx, checkout/page.tsx,
 * TrustBadges.tsx et help-data.ts utilisaient chacun un chiffre différent
 * (39 €, jamais recroisé avec Shopify) — exactement le type de seuil
 * contradictoire à éviter. Toute nouvelle surface qui affiche ce seuil doit
 * importer ces deux constantes plutôt que redéfinir un chiffre localement.
 */
export const FREE_SHIPPING_THRESHOLD = 80;
export const STANDARD_SHIPPING_COST = 4.99;

/**
 * Mission "PLAN MARKETING" (15/08/2026) — liens réseaux sociaux réels,
 * vérifiés un par un en navigant directement sur chaque page (pas une
 * supposition à partir du nom de la marque) : les anciens liens documentés
 * dans le guide marchand (`ondeal_shop`, `ondealshop`) menaient tous les
 * deux vers des pages inexistantes. Les vrais comptes actifs sont sous le
 * handle `ondeal.fr` sur Instagram et TikTok ; aucune page Facebook trouvée
 * à ce jour sous ce nom (`SOCIAL_LINKS.facebook` reste `null` tant qu'aucun
 * lien réel n'est confirmé — jamais de lien inventé ou de bouton mort).
 */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/ondeal.fr/",
  tiktok: "https://www.tiktok.com/@ondeal.fr",
  facebook: null as string | null,
};
