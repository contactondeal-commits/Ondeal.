import type { Metadata } from "next";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import ManageCookiesLink from "@/components/analytics/ManageCookiesLink";
import { COMPANY_EMAIL } from "@/lib/company-info";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Politique de cookies",
  alternates: { canonical: "/legal/cookies" },
};

export default function CookiesPage() {
  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Politique de cookies" }]} />

      <header className={styles.header}>
        <h1>Politique de cookies</h1>
        <p className={styles.intro}>Dernière mise à jour : 18 août 2026.</p>
      </header>

      <section className={styles.section}>
        <h2>Votre consentement</h2>
        <p>
          Lors de votre première visite, un bandeau vous propose trois choix : « Tout accepter », « Tout refuser »
          ou « Personnaliser » (pour choisir cookie par cookie). Les cookies de mesure d&apos;audience et
          publicitaires décrits ci-dessous ne se déclenchent que si vous les avez acceptés — tant qu&apos;aucun choix
          n&apos;a été fait, ils restent bloqués. Vous pouvez changer d&apos;avis à tout moment :
        </p>
        <p>
          <ManageCookiesLink className={styles.manageButton} />
        </p>
      </section>

      <section className={styles.section}>
        <h2>Cookies essentiels</h2>
        <p>
          Le panier, la liste de favoris et l&apos;historique de recherche ne sont pas stockés dans des cookies mais
          dans le stockage local de votre navigateur (localStorage), sur votre appareil uniquement — ils ne sont
          jamais transmis à nos serveurs tant que vous n&apos;initiez pas une commande. Un cookie technique
          (localStorage) mémorise également votre choix de consentement décrit ci-dessus.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Cookies de mesure d&apos;audience — Google Analytics (GA4)</h2>
        <p>
          Soumis à votre consentement. Ce site utilise Google Analytics 4 pour mesurer la fréquentation (pages
          visitées, provenance du trafic). Ces cookies (notamment <code>_ga</code>, <code>_ga_*</code>, conservés
          jusqu&apos;à 13 mois par défaut) sont déposés par Google LLC.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Cookies publicitaires — Meta Pixel</h2>
        <p>
          Soumis à votre consentement. Ce site utilise le pixel Meta (Facebook/Instagram) pour mesurer
          l&apos;efficacité de nos campagnes publicitaires et proposer des publicités pertinentes. Ce cookie
          (notamment <code>_fbp</code>, conservé 90 jours par défaut) est déposé par Meta Platforms, Inc.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Cookies liés au paiement et au compte client</h2>
        <p>
          Strictement nécessaires — non soumis à consentement. La création de compte, la connexion et le paiement
          s&apos;effectuent sur le portail sécurisé de notre plateforme e-commerce Shopify (sous-domaine{" "}
          <code>shop.ondeal.fr</code>). Des cookies techniques, nécessaires au fonctionnement du panier et du
          paiement sur ce portail, y sont déposés par Shopify.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Gérer vos cookies via votre navigateur</h2>
        <p>
          Vous pouvez également configurer votre navigateur pour refuser ou supprimer les cookies déposés par ce
          site (menu « Confidentialité » ou « Cookies » de votre navigateur). Le blocage des cookies de mesure
          d&apos;audience et publicitaires n&apos;empêche pas la navigation ni la commande sur le site.
        </p>
      </section>

      <p className={styles.contactLine}>
        Une question sur cette politique de cookies ?{" "}
        <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.
      </p>
    </div>
  );
}
