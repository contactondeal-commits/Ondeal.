import "server-only";
import { SHOPIFY_API_VERSION, getShopifyDomain } from "./config";

/**
 * Mission "PLAN MARKETING" (15/08/2026) — capture d'email newsletter côté
 * site public.
 *
 * IMPORTANT — pourquoi ce fichier existe séparément de src/lib/shopify/admin.ts :
 * ce dernier porte volontairement un token Admin PUISSANT (read_products +
 * write_products, capable de créer/modifier tout le catalogue) et une règle
 * explicite : "jamais importé sous src/app/ ou src/components/" (voir son
 * en-tête). Le formulaire newsletter, lui, doit être appelable depuis une
 * Server Action déclenchée par n'importe quel visiteur du site public — y
 * exposer, même côté serveur, un token capable d'écrire sur tout le
 * catalogue serait une surface d'attaque disproportionnée pour un simple
 * formulaire d'inscription email. Ce module utilise donc un token DÉDIÉ,
 * volontairement limité aux scopes clients (`read_customers`,
 * `write_customers`) — jamais le même token que l'import catalogue.
 *
 * Vérifié (recherche 15/08/2026) : la Storefront API n'a pas de mutation
 * dédiée "inscription newsletter sans mot de passe" (demande ouverte depuis
 * 2022 côté Shopify, toujours sans solution native). L'approche recommandée
 * pour une boutique headless reste l'API Admin `customerCreate` /
 * `customerUpdate` avec consentement marketing — d'où ce module, avec un
 * token isolé plutôt que réutiliser SHOPIFY_ADMIN_ACCESS_TOKEN.
 *
 * CREDENTIAL REQUIS : SHOPIFY_MARKETING_ADMIN_TOKEN (app privée Shopify
 * dédiée, scopes `read_customers` + `write_customers` UNIQUEMENT — jamais
 * write_products). Tant que cette variable n'est pas renseignée, la
 * fonction retourne explicitement "non configuré" plutôt que de faire
 * semblant de réussir (voir principe anti-fabrication du projet).
 */

export function isMarketingConsentConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_MARKETING_ADMIN_TOKEN);
}

class MarketingConsentError extends Error {}

async function marketingAdminGraphQL<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = getShopifyDomain();
  const token = process.env.SHOPIFY_MARKETING_ADMIN_TOKEN;
  if (!token) {
    throw new MarketingConsentError("SHOPIFY_MARKETING_ADMIN_TOKEN manquant.");
  }
  const res = await fetch(`https://${domain}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new MarketingConsentError(`Requête Admin GraphQL échouée (HTTP ${res.status})`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new MarketingConsentError(`Erreurs GraphQL: ${JSON.stringify(json.errors)}`);
  }
  return json.data as T;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeResult = { ok: true } | { ok: false; reason: "invalid_email" | "not_configured" | "error" };

interface CustomerCreateResponse {
  customerCreate: {
    customer: { id: string } | null;
    userErrors: { field: string[] | null; message: string; code?: string }[];
  };
}

interface CustomerFindResponse {
  customers: { nodes: { id: string }[] };
}

interface CustomerUpdateResponse {
  customerUpdate: {
    userErrors: { field: string[] | null; message: string }[];
  };
}

/**
 * Inscrit un email au consentement marketing Shopify (visible dans Shopify
 * Admin > Clients, avec l'étiquette "Abonné e-mail"). Idempotent : si le
 * client existe déjà (email déjà connu, ex. ancien acheteur), met à jour son
 * consentement au lieu d'échouer.
 */
export async function subscribeEmailToMarketing(email: string): Promise<SubscribeResult> {
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(trimmed)) {
    return { ok: false, reason: "invalid_email" };
  }
  if (!isMarketingConsentConfigured()) {
    return { ok: false, reason: "not_configured" };
  }

  try {
    const created = await marketingAdminGraphQL<CustomerCreateResponse>(
      `mutation CreateSubscriber($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer { id }
          userErrors { field message code }
        }
      }`,
      {
        input: {
          email: trimmed,
          emailMarketingConsent: {
            marketingState: "SUBSCRIBED",
            marketingOptInLevel: "SINGLE_OPT_IN",
          },
        },
      }
    );

    if (created.customerCreate.customer) {
      return { ok: true };
    }

    // Email déjà connu de Shopify (ancien client, ou déjà abonné) — on
    // récupère son id pour mettre à jour son consentement plutôt que
    // d'échouer silencieusement.
    const alreadyExists = created.customerCreate.userErrors.some((e) => e.code === "TAKEN" || /already/i.test(e.message));
    if (!alreadyExists) {
      return { ok: false, reason: "error" };
    }

    const found = await marketingAdminGraphQL<CustomerFindResponse>(
      `query FindByEmail($query: String!) { customers(first: 1, query: $query) { nodes { id } } }`,
      { query: `email:${trimmed}` }
    );
    const customerId = found.customers.nodes[0]?.id;
    if (!customerId) return { ok: false, reason: "error" };

    const updated = await marketingAdminGraphQL<CustomerUpdateResponse>(
      `mutation UpdateSubscriber($input: CustomerInput!) {
        customerUpdate(input: $input) { userErrors { field message } }
      }`,
      {
        input: {
          id: customerId,
          emailMarketingConsent: { marketingState: "SUBSCRIBED", marketingOptInLevel: "SINGLE_OPT_IN" },
        },
      }
    );
    if (updated.customerUpdate.userErrors.length > 0) {
      return { ok: false, reason: "error" };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: "error" };
  }
}
