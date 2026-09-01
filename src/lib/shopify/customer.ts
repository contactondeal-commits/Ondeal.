import { SHOPIFY_API_VERSION, getShopifyDomain } from "./config";
import { cookies } from "next/headers";

const CUSTOMER_TOKEN_COOKIE = "shopify_customer_token";

async function storefrontFetch(query: string, variables?: Record<string, unknown>, customerToken?: string) {
  const domain = getShopifyDomain();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  };
  if (customerToken) headers["X-Shopify-Customer-Access-Token"] = customerToken;

  const res = await fetch(`https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  return res.json();
}

export async function customerLogin(email: string, password: string): Promise<{ token: string | null; errors: string[] }> {
  const { data } = await storefrontFetch(`
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { message }
      }
    }
  `, { input: { email, password } });

  const result = data?.customerAccessTokenCreate;
  const errors = result?.customerUserErrors?.map((e: { message: string }) => e.message) ?? [];
  const token = result?.customerAccessToken?.accessToken ?? null;
  return { token, errors };
}

export async function customerLogout(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value;
  if (token) {
    await storefrontFetch(`
      mutation customerAccessTokenDelete($customerAccessToken: String!) {
        customerAccessTokenDelete(customerAccessToken: $customerAccessToken) { deletedAccessToken }
      }
    `, { customerAccessToken: token });
  }
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE);
}

export async function getCustomerToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value ?? null;
}

export async function setCustomerToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    path: "/",
  });
}

export async function getCustomer(): Promise<{ firstName: string; lastName: string; email: string } | null> {
  const token = await getCustomerToken();
  if (!token) return null;

  const { data } = await storefrontFetch(`
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        firstName lastName email
      }
    }
  `, { customerAccessToken: token });

  return data?.customer ?? null;
}
