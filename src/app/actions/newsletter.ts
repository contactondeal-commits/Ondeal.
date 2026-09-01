"use server";

import { subscribeEmailToMarketing, isMarketingConsentConfigured, type SubscribeResult } from "@/lib/shopify/marketing-consent";

/** Permet au composant client (footer) de savoir si l'inscription est activable, sans exposer de secret. */
export async function isNewsletterEnabled(): Promise<boolean> {
  return isMarketingConsentConfigured();
}

export async function subscribeToNewsletter(email: unknown): Promise<SubscribeResult> {
  if (typeof email !== "string" || email.length === 0 || email.length > 320) {
    return { ok: false, reason: "invalid_email" };
  }
  return subscribeEmailToMarketing(email);
}
