import type { Metadata } from "next";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { COMPANY_EMAIL } from "@/lib/company-info";
import styles from "../info-page.module.css";

export const metadata: Metadata = {
  title: "À propos | OnDeal",
  description: "Découvrez l'histoire d'OnDeal, boutique en ligne française lancée en août 2026.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "À propos" }]} />

      <header className={styles.header}>
        <h1>À propos d&apos;OnDeal</h1>
        <p className={styles.intro}>
          OnDeal est une jeune boutique en ligne française, lancée le 1er août 2026. Depuis nos débuts,
          notre mission est simple : proposer des milliers de produits sélectionnés en high-tech, maison,
          mode, sport et beauté, au meilleur prix, livrés partout en France, dans l&apos;Union Européenne
          et dans le monde.
        </p>
      </header>

      <section className={styles.section}>
        <h2>Notre histoire</h2>
        <p>
          OnDeal est né d&apos;une conviction simple : acheter en ligne doit être rapide, fiable et accessible
          à tous. La boutique a ouvert ses portes le 1er août 2026 à Paris, avec l&apos;ambition de proposer
          une alternative française sérieuse aux grandes plateformes internationales.
        </p>
        <p>
          Encore jeune, mais déjà déterminée — OnDeal grandit chaque jour avec une sélection de produits
          soigneusement choisie et un service client disponible 7j/7.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Nos valeurs</h2>
        <ul>
          <li><strong>Accessibilité</strong> — des prix justes, sans compromis sur la qualité.</li>
          <li><strong>Fiabilité</strong> — paiement sécurisé, livraison suivie, retours facilités.</li>
          <li><strong>Transparence</strong> — des conditions claires, un service client honnête.</li>
          <li><strong>Proximité</strong> — une boutique française, à l&apos;écoute de ses clients.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Ce que nous proposons</h2>
        <p>
          High-tech, maison, mode, sport, beauté, jouets et bien plus — OnDeal réunit des milliers de produits
          sélectionnés pour répondre aux besoins du quotidien, livrés rapidement partout en France,
          dans l&apos;UE et dans le monde entier.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Notre engagement</h2>
        <p>
          Chaque commande est traitée avec soin. En cas de problème, notre équipe vous répond rapidement
          et trouve une solution — retour, échange ou remboursement. Votre satisfaction est notre priorité.
        </p>
      </section>

      <p className={styles.contactLine}>
        Une question sur OnDeal ? Écrivez-nous à <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.
      </p>
    </div>
  );
}
