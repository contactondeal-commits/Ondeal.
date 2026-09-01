import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";

function base64url(buf: Buffer) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export async function GET(req: NextRequest) {
  const verifier = base64url(randomBytes(32));
  const challenge = base64url(
    Buffer.from(createHash("sha256").update(verifier).digest())
  );
  const state = base64url(randomBytes(16));

  const params = new URLSearchParams({
    client_id: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID!,
    response_type: "code",
    redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    scope: "openid email customer-account-api:full",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  const res = NextResponse.redirect(
    `${process.env.SHOPIFY_CUSTOMER_ACCOUNT_URL}/authorize?${params}`
  );

  res.cookies.set("shopify_auth_state", state, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 300, path: "/" });
  res.cookies.set("shopify_code_verifier", verifier, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 300, path: "/" });

  return res;
}
