import { NextRequest, NextResponse } from "next/server";

const CUSTOMER_TOKEN_COOKIE = "shopify_customer_token";
const PROTECTED_PATHS = ["/account"];
const LOGIN_PATH = "/login";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const token = req.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value;
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = LOGIN_PATH;
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
