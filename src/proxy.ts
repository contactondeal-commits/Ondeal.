import { NextRequest, NextResponse } from "next/server";

const CUSTOMER_TOKEN_COOKIE = "shopify_customer_token";
const PROTECTED_PATHS = ["/account"];
const LOGIN_PATH = "/login";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // BUG FIX (02/09/2026) — Audit conversion : la langue par défaut du
  // domaine ondeal.fr est volontairement réglée sur "anglais" côté Shopify
  // (Paramètres > Langues), pour bénéficier de la traduction automatique
  // vers le français à chaque nouveau produit (voir décision explicite de
  // l'utilisateur — repasser en "français par défaut" casserait cette
  // traduction automatique). Conséquence : Shopify considère le français
  // comme une langue SECONDAIRE publiée sur ce domaine, et préfixe certains
  // liens qu'il génère lui-même (ex. "retour au panier" après le checkout)
  // par "/fr/...", comme s'il s'agissait d'un site multilingue à routing
  // par préfixe. Ce site Next.js n'a jamais eu ce type de routing (une
  // seule langue affichée, aucune page sous "/fr/*") : "/fr/cart" renvoyait
  // donc un vrai 404, cassant le retour au panier pour la quasi-totalité
  // des clients revenant du checkout — trouvé en conditions réelles le
  // 02/09/2026 (client bloqué juste après un "rupture de stock" au
  // paiement). Plutôt que de toucher au réglage Shopify (ce qui casserait
  // la traduction automatique voulue), on redirige ici tout /fr/... vers
  // l'équivalent sans préfixe, où la page existe réellement.
  if (pathname === "/fr" || pathname.startsWith("/fr/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

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
  matcher: ["/account/:path*", "/fr", "/fr/:path*"],
};
