import type { Metadata } from "next";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import {
  COMPANY_LEGAL_NAME,
  BUSINESS_ADDRESS,
  COMPANY_EMAIL,
  HOSTING_PROVIDER,
  COMMERCE_PLATFORM,
  REVIEWS_PROVIDER,
} from "@/lib/company-info";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  alternates: { canonical: "/legal/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Politique de confidentialité" }]} />

      <header className={styles.header}>
        <h1>Politique de confidentialité</h1>
        <p className={styles.intro}>Dernière mise à jour : 18 août 2026.</p>
      </header>

      <section className={styles.section}>
        <h2>Responsable du traitement</h2>
        <p>
          {COMPANY_LEGAL_NAME}, {BUSINESS_ADDRESS.full}, est responsable du traitement des données personnelles
          collectées sur ondeal.fr. Pour toute question, contactez{" "}
          <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Données collectées et finalités</h2>
        <p>
          <strong>Compte client et commandes</strong> — la création de compte, la gestion des commandes et le
          paiement sont assurés par notre plateforme e-commerce {COMMERCE_PLATFORM.name} (nom, adresse, email,
          historique de commandes). Ces données sont traitées directement par Shopify selon sa propre politique de
          confidentialité, pour l&apos;exécution des commandes.
        </p>
        <p>
          <strong>Newsletter</strong> — si vous vous inscrivez à la newsletter, votre email est transmis à
          {" "}{COMMERCE_PLATFORM.name} pour l&apos;envoi de communications marketing (réductions, nouveautés). Vous
          pouvez vous désinscrire à tout moment via le lien présent dans chaque email.
        </p>
        <p>
          <strong>Avis clients</strong> — si vous publiez un avis sur une fiche produit, votre nom, votre email et
          le contenu de votre avis sont transmis à notre prestataire {REVIEWS_PROVIDER.name} pour publication et
          modération. L&apos;email n&apos;est jamais affiché publiquement.
        </p>
        <p>
          <strong>Mesure d&apos;audience et publicité</strong> — sous réserve de votre consentement (bandeau
          affiché à la première visite), nous utilisons Google Analytics 4 et le pixel Meta pour mesurer la
          fréquentation du site et l&apos;efficacité de nos campagnes publicitaires. Voir notre{" "}
          <a href="/legal/cookies">politique de cookies</a> pour le détail et pour modifier votre choix.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Destinataires des données</h2>
        <p>
          Vos données sont partagées uniquement avec les prestataires nécessaires au fonctionnement du site :{" "}
          {COMMERCE_PLATFORM.name} (catalogue, panier, paiement, compte client), {REVIEWS_PROVIDER.name} (avis
          clients), {HOSTING_PROVIDER.name} (hébergement technique), ainsi que Google (mesure d&apos;audience) et
          Meta Platforms, Inc. (publicité), le cas échéant. Vos données ne sont ni vendues ni louées à des tiers.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Durée de conservation</h2>
        <p>
          Les données liées à votre compte et à vos commandes sont conservées pendant toute la durée de la relation
          commerciale, puis archivées conformément aux obligations légales (notamment comptables et fiscales). Les
          données de mesure d&apos;audience sont conservées selon les durées par défaut de Google Analytics et de
          Meta.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Vos droits</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit
          d&apos;accès, de rectification, d&apos;effacement et de portabilité de vos données, ainsi que d&apos;un
          droit d&apos;opposition et de limitation du traitement. Pour exercer ces droits, contactez-nous à{" "}
          <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>. Vous disposez également du droit d&apos;introduire
          une réclamation auprès de la CNIL (www.cnil.fr).
        </p>
      </section>

      <p className={styles.contactLine}>
        Une question sur le traitement de vos données ?{" "}
        <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.
      </p>
    </div>
  );
}
