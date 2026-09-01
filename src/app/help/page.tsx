import type { Metadata } from "next";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import HelpAccordion from "./HelpAccordion";
import { HELP_SECTIONS } from "./help-data";
import { COMPANY_PHONE } from "@/lib/company-info";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Aide & FAQ",
  description:
    "Trouvez des réponses à vos questions sur les commandes, la livraison, les retours et le paiement sur OnDeal.",
  alternates: { canonical: "/help" },
};

export default function HelpPage() {
  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Aide & FAQ" }]} />

      <header className={styles.header}>
        <h1>Aide & FAQ</h1>
        <p className={styles.intro}>
          Retrouvez ici les réponses aux questions les plus fréquentes. Vous ne trouvez pas ce que vous
          cherchez ? Contactez notre service client.
        </p>
      </header>

      <div className={styles.layout}>
        <div className={styles.sections}>
          {HELP_SECTIONS.map((section) => (
            <section key={section.id} aria-labelledby={`section-${section.id}`} className={styles.section}>
              <h2 id={`section-${section.id}`} className={styles.sectionTitle}>
                {section.title}
              </h2>
              <HelpAccordion items={section.items} sectionId={section.id} />
            </section>
          ))}
        </div>

        <aside className={styles.contact} aria-labelledby="contact-heading">
          <h2 id="contact-heading" className={styles.contactTitle}>
            Besoin d&apos;aide supplémentaire ?
          </h2>
          <p className={styles.contactText}>Notre équipe est disponible du lundi au vendredi, 9h–18h.</p>
          <a className={styles.contactLink} href="mailto:contact@ondeal.fr">
            contact@ondeal.fr
          </a>
          {/*
            Mission CRO Phase 1 (2026-08-13) — P0-3 : le numéro de téléphone
            "01 00 00 00 00" affiché ici était un numéro factice, non
            fonctionnel — retiré (règle de vérité). Mission "MENTIONS
            LÉGALES" (18/08/2026) : un vrai numéro est désormais disponible
            (contrat de domiciliation Kandbaz, voir src/lib/company-info.ts)
            — réaffiché ici, cette fois réel.
          */}
          <a className={styles.contactLink} href={`tel:${COMPANY_PHONE.replace(/\s/g, "")}`}>
            {COMPANY_PHONE}
          </a>
        </aside>
      </div>
    </div>
  );
}
