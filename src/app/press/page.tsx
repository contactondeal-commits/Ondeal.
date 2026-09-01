import type { Metadata } from "next";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { COMPANY_EMAIL } from "@/lib/company-info";
import styles from "../info-page.module.css";

export const metadata: Metadata = {
  title: "Presse | OnDeal",
  description: "Espace presse OnDeal.",
  alternates: { canonical: "/press" },
};

export default function PressPage() {
  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Presse" }]} />

      <header className={styles.header}>
        <h1>Espace Presse</h1>
        <p className={styles.intro}>
          Journalistes, blogueurs, créateurs de contenu — retrouvez ici tout ce qu&apos;il vous faut pour parler d&apos;OnDeal.
        </p>
      </header>

      <section className={styles.section}>
        <h2>Qui sommes-nous ?</h2>
        <p>
          OnDeal est une boutique en ligne française lancée le 1er août 2026. Depuis nos débuts, notre mission est simple : proposer des milliers de produits sélectionnés en high-tech, maison, mode, sport et beauté, au meilleur prix, livrés partout en France, dans l&apos;Union Européenne et dans le monde.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Chiffres clés</h2>
        <ul>
          <li>Lancement : 1er août 2026, France</li>
          <li>Catégories : High-tech, Maison, Mode, Sport, Beauté, Jouets et plus</li>
          <li>Livraison : France métropolitaine et Union Européenne</li>
          <li>Paiement sécurisé via Shopify Payments</li>
          <li>Service client disponible 7j/7 par email</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Angles éditoriaux</h2>
        <ul>
          <li><strong>Le e-commerce accessible</strong> : comment OnDeal démocratise l&apos;accès aux produits premium à prix juste.</li>
          <li><strong>Made in France (digital)</strong> : une boutique française face aux géants internationaux.</li>
          <li><strong>L&apos;achat responsable</strong> : sélection rigoureuse et transparence sur les conditions de vente.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Kit presse</h2>
        <p>
          Notre kit presse (logo, visuels haute définition, fiche produit) est disponible sur demande.
          Écrivez-nous à <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a> en précisant votre média
          et votre angle éditorial — nous vous répondrons sous 48h.
        </p>
      </section>

      <p className={styles.contactLine}>
        Contact presse : <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
      </p>
    </div>
  );
}
