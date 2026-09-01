import { AlertTriangle } from "lucide-react";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import styles from "./legal.module.css";

/**
 * Mission CRO Phase 1 (2026-08-13) — P0-3 : ces pages (CGV, Politique de
 * confidentialité, Cookies, Mentions légales, Garantie) étaient auparavant
 * de simples redirections vers la FAQ générique /help — aucun contenu
 * légal réel n'existait. Plutôt que d'inventer un texte juridique (SIRET,
 * adresse, forme sociale, DPO, etc. — aucune de ces données n'est
 * disponible dans le projet), cette page affiche honnêtement que le
 * contenu est en cours de finalisation et oriente vers un contact réel.
 * Voir reports/ondeal-cro-implementation.md section 6 (Trust) et
 * section 21 (règle de vérité) : "Si une donnée n'est pas disponible →
 * NOT AVAILABLE".
 */
export default function LegalPendingPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: title }]} />

      <header className={styles.header}>
        <h1>{title}</h1>
      </header>

      <div className={styles.pendingNotice}>
        <AlertTriangle size={18} />
        <span>
          Cette page est en cours de finalisation. {description} Aucune information n&apos;est encore
          publiée ici afin de ne rien afficher d&apos;incomplet ou d&apos;incorrect.
        </span>
      </div>

      <p className={styles.contactLine}>
        Pour toute question à ce sujet, contactez-nous directement à{" "}
        <a href="mailto:contact@ondeal.fr">contact@ondeal.fr</a>.
      </p>
    </div>
  );
}
