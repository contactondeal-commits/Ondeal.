import type { Metadata } from "next";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { COMPANY_EMAIL } from "@/lib/company-info";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Garantie",
  alternates: { canonical: "/legal/garantie" },
};

export default function GarantiePage() {
  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Garantie" }]} />

      <header className={styles.header}>
        <h1>Garantie</h1>
        <p className={styles.intro}>Dernière mise à jour : 18 août 2026.</p>
      </header>

      <section className={styles.section}>
        <h2>Garantie légale de conformité</h2>
        <p>
          Conformément aux articles L.217-3 et suivants du Code de la consommation, tout produit acheté sur ondeal.fr
          bénéficie de la garantie légale de conformité pendant 2 ans à compter de la livraison. Cette garantie vous
          permet d&apos;obtenir la réparation ou le remplacement du produit, sans frais, en cas de défaut de
          conformité existant au moment de la livraison.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Garantie légale des vices cachés</h2>
        <p>
          Conformément aux articles 1641 et suivants du Code civil, vous bénéficiez également de la garantie légale
          des vices cachés. Si le produit présente un défaut caché qui le rend impropre à l&apos;usage auquel il est
          destiné, vous pouvez choisir entre la résolution de la vente (remboursement) ou une réduction du prix.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Comment faire valoir votre garantie ?</h2>
        <p>
          Contactez-nous à <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a> en décrivant le défaut constaté
          et en joignant si possible une photo, ainsi que votre numéro de commande. Nous vous indiquerons la marche
          à suivre (réparation, remplacement ou remboursement selon le cas).
        </p>
      </section>

      <p className={styles.contactLine}>
        Une question sur une garantie produit ? <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.
      </p>
    </div>
  );
}
