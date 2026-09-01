import { redirect } from "next/navigation";
import { SHOPIFY_ACCOUNT_URL } from "@/lib/site-config";

// Route "attrape-tout" : couvre les anciens liens /account/orders,
// /account/profile, /account/addresses, /account/payment-methods, etc.
// (désormais supprimés — voir src/app/account/page.tsx) pour qu'ils
// redirigent proprement vers le portail natif Shopify plutôt que d'afficher
// une 404.
export default function AccountCatchAllRedirectPage() {
  redirect(SHOPIFY_ACCOUNT_URL);
}
