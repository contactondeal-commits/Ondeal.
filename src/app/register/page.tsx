import { redirect } from "next/navigation";
import { SHOPIFY_ACCOUNT_URL } from "@/lib/site-config";

// Voir src/app/login/page.tsx et SHOPIFY_ACCOUNT_URL (site-config.ts) pour
// le détail complet : le portail natif Shopify gère à la fois connexion et
// inscription (sans mot de passe), donc les deux routes redirigent au même
// endroit.
export default function RegisterRedirectPage() {
  redirect(SHOPIFY_ACCOUNT_URL);
}
