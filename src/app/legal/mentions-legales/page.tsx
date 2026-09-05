import type { Metadata } from "next";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import {
  COMPANY_LEGAL_NAME,
  COMPANY_LEGAL_FORM,
  COMPANY_REPRESENTATIVE,
  COMPANY_RCS_NUMBER,
  BUSINESS_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_PHONE,
  HOSTING_PROVIDER,
  COMMERCE_PLATFORM,
} from "@/lib/company-info";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/legal/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Mentions légales" }]} />

      <header className={styles.header}>
        <h1>Mentions légales</h1>
        <p className={styles.intro}>Dernière mise à jour : 18 août 2026.</p>
      </header>

      <section className={styles.section}>
        <h2>Éditeur du site</h2>
        <p>
          Le site ondeal.fr est édité par <strong>{COMPANY_LEGAL_NAME}</strong>, {COMPANY_LEGAL_FORM}.
        </p>
        <p>
          Adresse du siège : {BUSINESS_ADDRESS.full}
          <br />
          Numéro RCS : {COMPANY_RCS_NUMBER}
          <br />
          Représentant : {COMPANY_REPRESENTATIVE}
          <br />
          Email : <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
          <br />
          Téléphone : {COMPANY_PHONE}
        </p>
      </section>

      <section className={styles.section}>
        <h2>Directeur de la publication</h2>
        <p>{COMPANY_REPRESENTATIVE}, fondateur et représentant d&apos;OnDeal.fr.</p>
      </section>

      <section className={styles.section}>
        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par <strong>{HOSTING_PROVIDER.name}</strong>, {HOSTING_PROVIDER.address}.{" "}
          <a href={HOSTING_PROVIDER.website} target="_blank" rel="noopener noreferrer">
            {HOSTING_PROVIDER.website}
          </a>
        </p>
      </section>

      <section className={styles.section}>
        <h2>Plateforme de commerce</h2>
        <p>
          La gestion du catalogue, du panier, du paiement et des comptes clients repose sur la plateforme{" "}
          <strong>{COMMERCE_PLATFORM.name}</strong>.{" "}
          <a href={COMMERCE_PLATFORM.website} target="_blank" rel="noopener noreferrer">
            {COMMERCE_PLATFORM.website}
          </a>
        </p>
      </section>

      <section className={styles.section}>
        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des éléments du site ondeal.fr (textes, visuels, logos, mise en page) est protégé au titre
          du droit d&apos;auteur. Les visuels et descriptions de produits peuvent provenir des fournisseurs
          référencés dans le catalogue et restent la propriété de leurs auteurs respectifs.
        </p>
      </section>

      <p className={styles.contactLine}>
        Pour toute question concernant ces mentions légales, contactez-nous à{" "}
        <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.
      </p>
    </div>
  );
}
