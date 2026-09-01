"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Lock, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import TrustBadges from "@/components/products/TrustBadges";
import { useCart } from "@/hooks/useCart";
import { createShopifyCheckout, isShopifyCheckoutEnabled } from "@/app/actions/shopify-checkout";
import { fireGoogleAdsConversion } from "@/lib/analytics/googleAds";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_COST } from "@/lib/site-config";
import styles from "./page.module.css";

export default function CheckoutPage() {
  const { items, subtotal, count } = useCart();
  const [shopifyEnabled, setShopifyEnabled] = useState<boolean | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_COST;
  const total = subtotal + shipping;

  useEffect(() => {
    isShopifyCheckoutEnabled().then(setShopifyEnabled);
  }, []);

  const allItemsHaveShopifyVariant = items.length > 0 && items.every((i) => Boolean(i.shopifyVariantId));
  const useRealShopifyCheckout = shopifyEnabled === true && allItemsHaveShopifyVariant;

  async function handleShopifyCheckout() {
    setCheckoutError(null);
    setRedirecting(true);
    const lines = items.map((i) => ({ variantId: i.shopifyVariantId!, quantity: i.quantity }));
    const result = await createShopifyCheckout(lines);
    if (result.ok && result.checkoutUrl) {
      fireGoogleAdsConversion("beginCheckout", { value: total });
      window.location.href = result.checkoutUrl;
      return;
    }
    setCheckoutError(result.error ?? "Impossible de créer le panier Shopify.");
    setRedirecting(false);
  }

  // Chemin réel : le paiement est intégralement géré par Shopify Checkout —
  // Ondeal ne collecte ni n'affiche jamais les informations de carte bancaire.
  if (useRealShopifyCheckout) {
    return (
      <div className={`${styles.page} container`}>
        <h1>Commande</h1>
        <div className={styles.layout}>
          <div className={styles.form}>
            <fieldset className={styles.fieldset}>
              <legend>
                <Lock size={16} /> Paiement sécurisé Shopify
              </legend>
              <p className={styles.note}>
                Vous allez être redirigé vers le paiement sécurisé Shopify pour finaliser votre commande
                (livraison, moyens de paiement, confirmation). Ondeal ne stocke jamais vos informations de
                paiement.
              </p>
              {checkoutError && <p className={styles.error}>{checkoutError}</p>}
              <Button variant="primary" size="lg" fullWidth onClick={handleShopifyCheckout} disabled={redirecting || count === 0}>
                {redirecting ? (
                  <>
                    <Loader2 size={18} className={styles.spin} /> Redirection…
                  </>
                ) : (
                  "Continuer vers le paiement Shopify"
                )}
              </Button>
              {/* Mission CRO Phase 1 — P1-4 / section 11 : badges de confiance au checkout. */}
              <TrustBadges compact />
            </fieldset>
          </div>
          <aside className={styles.summary}>
            <h2>Résumé</h2>
            {items.map((item) => (
              <div key={item.lineId} className={styles.summaryRow}>
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // Corrigé le 15/08/2026 (mission "propre et fonctionnel") : ce chemin
  // affichait auparavant un faux tunnel de paiement à 3 étapes (y compris un
  // champ "Numéro de carte" qui ne faisait RIEN) puis une fausse page "Merci
  // pour votre commande !" — sans jamais créer de vraie commande. Un client
  // pouvait donc croire avoir payé alors qu'aucun paiement ni commande réels
  // n'avaient eu lieu. Ce cas ne doit normalement jamais se produire en
  // production (le catalogue réel Shopify fournit toujours un
  // shopifyVariantId), mais si jamais Shopify est injoignable ou qu'un
  // article du panier n'a pas d'ID Shopify valide, on affiche maintenant un
  // état honnête qui bloque la commande plutôt que de la simuler.
  if (shopifyEnabled === null) {
    return (
      <div className={`${styles.page} container`}>
        <h1>Commande</h1>
        <p>Chargement…</p>
      </div>
    );
  }

  return (
    <div className={`${styles.page} container`}>
      <h1>Commande</h1>
      <div className={styles.layout}>
        <div className={styles.form}>
          <fieldset className={styles.fieldset}>
            <legend>
              <AlertTriangle size={16} /> Paiement momentanément indisponible
            </legend>
            <p className={styles.note}>
              {count === 0
                ? "Votre panier est vide."
                : "Le paiement sécurisé n'est pas disponible pour le moment pour un ou plusieurs articles de votre panier. Aucun montant ne sera prélevé. Merci de réessayer dans quelques instants ou de nous contacter si le problème persiste."}
            </p>
          </fieldset>
        </div>
        <aside className={styles.summary}>
          <h2>Résumé</h2>
          {items.map((item) => (
            <div key={item.lineId} className={styles.summaryRow}>
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
