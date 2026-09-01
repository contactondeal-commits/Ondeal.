import type { Metadata } from "next";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { HELP_SECTIONS } from "@/app/help/help-data";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Livraison",
  description: "Délais, frais et zones de livraison Ondeal.",
  alternates: { canonical: "/legal/livraison" },
};

/**
 * Mission CRO Phase 1 (2026-08-13) — P0-3 : le lien footer "Livraison"
 * pointait vers la FAQ générique /help. Cette page dédiée réutilise le
 * contenu réel déjà présent dans le projet (src/app/help/help-data.ts,
 * section "livraison") — aucune information n'est inventée, la source de
 * vérité reste unique (une seule modification à faire si les délais
 * changent).
 */
export default function LivraisonPage() {
  const section = HELP_SECTIONS.find((s) => s.id === "livraison");

  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Livraison" }]} />

      <header className={styles.header}>
        <h1>Livraison</h1>
        <p className={styles.intro}>Tout ce qu&apos;il faut savoir sur la livraison de vos commandes.</p>
      </header>

      {section?.items.map((item) => (
        <section key={item.id} className={styles.section}>
          <h2>{item.question}</h2>
          <p>{item.answer}</p>
        </section>
      ))}

      <p className={styles.contactLine}>
        Une question sur la livraison de votre commande ?{" "}
        <a href="mailto:contact@ondeal.fr">contact@ondeal.fr</a>.
      </p>
    </div>
  );
}
