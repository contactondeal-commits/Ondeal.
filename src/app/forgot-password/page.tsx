import { redirect } from "next/navigation";
import { SHOPIFY_ACCOUNT_URL } from "@/lib/site-config";

// Voir src/app/login/page.tsx et SHOPIFY_ACCOUNT_URL (site-config.ts) : le
// portail natif Shopify est sans mot de passe (connexion par e-mail), donc
// "mot de passe oublié" n'a plus lieu d'être — redirigé vers le même point
// d'entrée unique.
export default function ForgotPasswordRedirectPage() {
  redirect(SHOPIFY_ACCOUNT_URL);
}
