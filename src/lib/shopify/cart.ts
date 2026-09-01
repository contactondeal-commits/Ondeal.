import { shopifyStorefrontGraphQL } from "./storefront";

/**
 * Panier + checkout Shopify réels (Storefront Cart API).
 *
 * Architecture retenue (voir docs/SHOPIFY_INTEGRATION.md pour le détail) :
 * - Le panier Ondeal reste local (Zustand + localStorage) pendant la navigation,
 *   pour une UX instantanée sans dépendre du réseau à chaque ajout/retrait.
 * - Au moment où le client lance le paiement (`/checkout`), un panier Shopify
 *   réel est créé en un seul appel `cartCreate` à partir du contenu du panier
 *   local (variantId + quantité), puis le client est redirigé vers le
 *   `checkoutUrl` retourné par Shopify — c'est Shopify qui gère intégralement
 *   le paiement et la commande, jamais CJdropshipping ni un code maison.
 * - Évolution possible (non implémentée ici) : synchroniser le panier Shopify
 *   en temps réel à chaque ajout pour permettre un panier partagé multi-appareil.
 */

interface CartCreateResponse {
  cartCreate: {
    cart: { id: string; checkoutUrl: string; totalQuantity: number } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
}

export interface CartLineInput {
  variantId: string;
  quantity: number;
}

/**
 * Crée un panier Shopify réel à partir des lignes fournies et renvoie l'URL
 * de checkout Shopify officielle vers laquelle rediriger le client.
 */
export async function createShopifyCart(lines: CartLineInput[]): Promise<{ id: string; checkoutUrl: string }> {
  if (lines.length === 0) {
    throw new Error("Impossible de créer un panier Shopify vide.");
  }

  const data = await shopifyStorefrontGraphQL<CartCreateResponse>(
    `mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { id checkoutUrl totalQuantity }
        userErrors { field message }
      }
    }`,
    {
      lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })),
    }
  );

  const { cart, userErrors } = data.cartCreate;
  if (userErrors.length > 0 || !cart) {
    throw new Error(`Échec de création du panier Shopify : ${userErrors.map((e) => e.message).join(", ")}`);
  }
  return { id: cart.id, checkoutUrl: cart.checkoutUrl };
}
