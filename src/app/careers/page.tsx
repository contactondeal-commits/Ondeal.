import type { Metadata } from "next";
import { Info } from "lucide-react";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { COMPANY_EMAIL } from "@/lib/company-info";
import styles from "../info-page.module.css";

export const metadata: Metadata = {
  title: "Carrières",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Carrières" }]} />

      <header className={styles.header}>
        <h1>Carrières</h1>
      </header>

      <div className={styles.infoNotice}>
        <Info size={18} />
        <span>
          OnDeal est aujourd&apos;hui géré par une petite équipe et n&apos;a pas de poste ouvert au recrutement pour
          le moment.
        </span>
      </div>

      <section className={styles.section}>
        <p>
          Si vous souhaitez néanmoins nous transmettre une candidature spontanée, écrivez-nous à{" "}
          <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a> en précisant le type de collaboration qui vous
          intéresse : nous la conserverons et vous recontacterons si une opportunité correspondante se présente.
        </p>
      </section>
    </div>
  );
}
