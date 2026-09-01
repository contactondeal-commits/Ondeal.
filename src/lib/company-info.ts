/**
 * Informations légales de l'entreprise — source de vérité unique pour
 * toutes les pages /legal/*.
 *
 * Mission "MENTIONS LÉGALES" (18/08/2026) — jusqu'ici ces pages affichaient
 * honnêtement un message "en cours de finalisation" car aucune donnée
 * officielle n'était disponible (voir historique dans LegalPendingPage.tsx).
 * L'utilisateur a transmis le 18/08/2026 deux documents officiels signés
 * avec Kandbaz (société de domiciliation agréée, agrément préfectoral
 * N°DOM2025097) :
 *  - Contrat de domiciliation n°202608-02159
 *  - Attestation de domiciliation (même date)
 * Toutes les valeurs ci-dessous sont recopiées telles quelles depuis ces
 * documents — aucune donnée inventée.
 *
 * IMPORTANT — adresse professionnelle vs domicile personnel : le domicile
 * personnel du représentant (Alex Brou, 35 Av. du Colonel Fabien, 78210
 * Saint-Cyr-l'École) apparaît dans les documents Kandbaz UNIQUEMENT comme
 * information contractuelle interne (lieu de tenue de la comptabilité).
 * Ce n'est PAS l'adresse à publier : le contrat de domiciliation a été
 * signé précisément pour disposer d'une adresse professionnelle à Paris et
 * ne jamais exposer publiquement le domicile personnel. Toute page publique
 * (mentions légales, CGV, footer, factures, etc.) doit utiliser
 * BUSINESS_ADDRESS ci-dessous, jamais l'adresse de Saint-Cyr-l'École.
 */

export const COMPANY_LEGAL_NAME = "Alex Brou - OnDeal.fr";
export const COMPANY_LEGAL_FORM = "Entreprise individuelle (auto-entrepreneur)";
export const COMPANY_REPRESENTATIVE = "Alex Brou";
export const COMPANY_RCS_NUMBER = "994 594 059";

/** Adresse professionnelle publique (domiciliation Kandbaz, effective depuis le 16/08/2026). */
export const BUSINESS_ADDRESS = {
  line1: "231 rue Saint-Honoré",
  postalCode: "75001",
  city: "Paris",
  country: "France",
  full: "231 rue Saint-Honoré, 75001 Paris, France",
};

export const COMPANY_EMAIL = "contact@ondeal.fr";
export const COMPANY_PHONE = "+33 6 18 04 39 78";

/** Prestataire de domiciliation (mentionné pour transparence, non affiché par défaut). */
export const DOMICILIATION_PROVIDER = {
  name: "Kandbaz",
  legalForm: "SAS",
  rcs: "RCS Paris 497 933 408",
  address: "1 rue de Stockholm, 75008 Paris, France",
  agrement: "Agrément préfectoral N°DOM2025097",
};

/** Hébergeur du site (vérifié via vercel.com/legal/privacy-notice le 18/08/2026). */
export const HOSTING_PROVIDER = {
  name: "Vercel Inc.",
  address: "440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis",
  website: "https://vercel.com",
};

/**
 * Plateforme de commerce (Shopify) — utilisée pour le catalogue, le panier,
 * le paiement et la création de comptes clients (voir SHOPIFY_ACCOUNT_URL
 * dans site-config.ts).
 */
export const COMMERCE_PLATFORM = {
  name: "Shopify International Limited",
  website: "https://www.shopify.com",
};

/** Solution d'avis clients (voir src/lib/shopify/judgeme.ts). */
export const REVIEWS_PROVIDER = {
  name: "Judge.me",
  website: "https://judge.me",
};
