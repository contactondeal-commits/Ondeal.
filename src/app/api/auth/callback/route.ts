import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("shopify_auth_state")?.value;
  const codeVerifier = cookieStore.get("shopify_code_verifier")?.value;

  if (!code || !state || state !== storedState || !codeVerifier) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", req.url));
  }

  const tokenRes = await fetch(
    `${process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL}/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
        code,
        code_verifier: codeVerifier,
      }),
    }
  );

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/login?error=token_failed", req.url));
  }

  const { access_token, expires_in } = await tokenRes.json();
  const res = NextResponse.redirect(new URL("/account", req.url));

  res.cookies.set("shopify_customer_token", access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: expires_in ?? 60 * 60 * 24 * 30,
    path: "/",
  });
  res.cookies.delete("shopify_auth_state");
  res.cookies.delete("shopify_code_verifier");

  return res;
}
