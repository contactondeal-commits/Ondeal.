"use server";

import { createShopifyCart, type CartLineInput } from "@/lib/shopify/cart";
import { isShopifyPublicConfigured } from "@/lib/shopify/config";

export interface CheckoutHandoffResult {
  ok: boolean;
  checkoutUrl?: string;
  error?: string;
}

/** Permet au composant client /checkout de savoir si le checkout Shopify réel est disponible, sans exposer de secret. */
export async function isShopifyCheckoutEnabled(): Promise<boolean> {
  return isShopifyPublicConfigured();
}

// Mission "FINALISATION — audit sécurité" (15/08/2026), section 17 :
// une Server Action est un point d'entrée public — un appel direct (hors
// UI) peut envoyer n'importe quelle donnée. `lines` provient du panier
// local (client), jamais vérifié côté serveur jusqu'ici. Validation
// défensive avant tout appel Shopify : format d'ID Shopify réel
// (`gid://shopify/ProductVariant/<chiffres>`), quantité entière positive
// bornée à une valeur raisonnable (évite un abus/DoS via une quantité
// absurde envoyée directement à l'API Shopify). Aucun changement de
// comportement pour un usage normal depuis l'UI — uniquement un filtre
// contre une entrée malformée ou hostile.
const SHOPIFY_VARIANT_GID_PATTERN = /^gid:\/\/shopify\/ProductVariant\/\d+$/;
// Volontairement large — ne doit jamais bloquer un achat légitime (le
// panier local plafonne déjà la quantité au stock réel du produit, voir
// AddToCartPanel.tsx). Sert uniquement à rejeter une valeur absurde envoyée
// directement à l'API Shopify hors UI (ex: Number.MAX_SAFE_INTEGER).
const MAX_QUANTITY_PER_LINE = 5000;

function validateLines(lines: unknown): CartLineInput[] | null {
  if (!Array.isArray(lines) || lines.length === 0) return null;
  const validated: CartLineInput[] = [];
  for (const line of lines) {
    if (
      typeof line !== "object" ||
      line === null ||
      typeof (line as Record<string, unknown>).variantId !== "string" ||
      typeof (line as Record<string, unknown>).quantity !== "number"
    ) {
      return null;
    }
    const { variantId, quantity } = line as CartLineInput;
    if (!SHOPIFY_VARIANT_GID_PATTERN.test(variantId)) return null;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_LINE) return null;
    validated.push({ variantId, quantity });
  }
  return validated;
}

/**
 * Server Action appelée depuis /checkout : crée un panier Shopify réel à
 * partir des lignes du panier local Ondeal, puis renvoie l'URL de checkout
 * Shopify officielle. Le token Storefront ne quitte jamais le serveur.
 */
export async function createShopifyCheckout(lines: CartLineInput[]): Promise<CheckoutHandoffResult> {
  if (!isShopifyPublicConfigured()) {
    return { ok: false, error: "Shopify n'est pas configuré (SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_ACCESS_TOKEN manquants)." };
  }

  const validatedLines = validateLines(lines);
  if (!validatedLines) {
    return { ok: false, error: "Panier invalide." };
  }

  try {
    const cart = await createShopifyCart(validatedLines);
    return { ok: true, checkoutUrl: cart.checkoutUrl };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erreur inconnue lors de la création du panier Shopify." };
  }
}
