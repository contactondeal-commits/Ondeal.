import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import ContactForm from "./ContactForm";
import { COMPANY_EMAIL, COMPANY_PHONE, BUSINESS_ADDRESS } from "@/lib/company-info";
import styles from "../info-page.module.css";

export const metadata: Metadata = {
  title: "Contact | OnDeal",
  description: "Contactez le service client OnDeal par email, téléphone ou via notre formulaire.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Contact" }]} />

      <header className={styles.header}>
        <h1>Contactez-nous</h1>
        <p className={styles.intro}>
          Une question sur une commande, un produit ou un partenariat ? Notre équipe vous répond rapidement.
        </p>
      </header>

      <dl className={styles.contactCard}>
        <dt>Email</dt>
        <dd>
          <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
        </dd>
        <dt>Téléphone</dt>
        <dd>
          <a href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`}>{COMPANY_PHONE}</a>
        </dd>
        <dt>Disponibilité</dt>
        <dd>Du lundi au vendredi, 9h&ndash;18h.</dd>
        <dt>Adresse</dt>
        <dd>{BUSINESS_ADDRESS.full}</dd>
      </dl>

      <section className={styles.section}>
        <h2>Envoyez-nous un message</h2>
        <p>
          Pour toute question sur une commande en cours, munissez-vous de votre numéro de commande — vous le
          retrouverez dans votre <Link href="/account">espace client</Link>.
        </p>
      </section>

      <ContactForm toEmail={COMPANY_EMAIL} />

      <p className={styles.contactLine}>
        Besoin d&apos;aide urgente ? Appelez-nous au <a href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`}>{COMPANY_PHONE}</a> ou écrivez à <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.
      </p>
    </div>
  );
}
