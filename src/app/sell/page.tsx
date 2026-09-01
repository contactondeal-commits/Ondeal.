import type { Metadata } from "next";
import { Info } from "lucide-react";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { COMPANY_EMAIL } from "@/lib/company-info";
import styles from "../info-page.module.css";

export const metadata: Metadata = {
  title: "Nos partenaires",
  alternates: { canonical: "/sell" },
};

export default function SellPage() {
  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Nos partenaires" }]} />

      <header className={styles.header}>
        <h1>Nos partenaires</h1>
      </header>

      <div className={styles.infoNotice}>
        <Info size={18} />
        <span>
          OnDeal fonctionne aujourd&apos;hui comme une boutique unique dont nous sélectionnons nous-mêmes tout le
          catalogue. Il n&apos;existe pas encore de parcours d&apos;inscription en libre-service permettant à un
          vendeur tiers de créer sa propre boutique sur le site — cette fonctionnalité n&apos;est pas encore
          développée.
        </span>
      </div>

      <section className={styles.section}>
        <h2>Comment fonctionne le catalogue aujourd&apos;hui</h2>
        <p>
          Chaque produit visible sur ondeal.fr est sélectionné, mis en ligne et expédié sous la responsabilité
          directe d&apos;OnDeal — il n&apos;y a pas de commission vendeur puisqu&apos;il n&apos;y a pas, à ce jour,
          de vendeurs tiers indépendants.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Vous êtes fournisseur ou marque ?</h2>
        <p>
          Si vous souhaitez proposer vos produits sur OnDeal ou explorer un partenariat d&apos;approvisionnement,
          écrivez-nous à <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a> en présentant votre catalogue et
          vos conditions (tarifs, délais de livraison, zones couvertes) : nous étudions chaque demande
          individuellement et vous répondrons pour discuter des modalités.
        </p>
      </section>
    </div>
  );
}
