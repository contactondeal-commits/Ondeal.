import type { Metadata } from "next";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { COMPANY_LEGAL_NAME, BUSINESS_ADDRESS, COMPANY_EMAIL } from "@/lib/company-info";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  alternates: { canonical: "/legal/cgv" },
};

export default function CGVPage() {
  return (
    <div className={`${styles.page} container`}>
      <Breadcrumbs items={[{ label: "Accueil", href: "/" }, { label: "Conditions Générales de Vente" }]} />

      <header className={styles.header}>
        <h1>Conditions Générales de Vente</h1>
        <p className={styles.intro}>Dernière mise à jour : 18 août 2026.</p>
      </header>

      <section className={styles.section}>
        <h2>Article 1 — Objet et champ d&apos;application</h2>
        <p>
          Les présentes conditions générales de vente (CGV) régissent les ventes de produits réalisées sur le site
          ondeal.fr, édité par {COMPANY_LEGAL_NAME}, {BUSINESS_ADDRESS.full}. Elles s&apos;appliquent à toute
          commande passée par un client, sans restriction ni réserve.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Article 2 — Prix</h2>
        <p>
          Les prix des produits sont indiqués en euros. Ondeal se réserve le droit de modifier ses prix à tout
          moment, étant entendu que le prix applicable est celui affiché au moment de la commande.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Article 3 — Commande</h2>
        <p>
          Le client sélectionne les produits de son choix, les ajoute à son panier puis valide sa commande via le
          parcours de paiement sécurisé. Toute commande validée et payée vaut acceptation des présentes CGV.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Article 4 — Paiement</h2>
        <p>
          Le paiement s&apos;effectue en ligne, au moment de la commande, par carte bancaire ou tout autre moyen de
          paiement proposé lors du passage en caisse. La commande n&apos;est confirmée qu&apos;après validation
          effective du paiement.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Article 5 — Livraison</h2>
        <p>
          Les délais et frais de livraison sont détaillés sur notre page <a href="/legal/livraison">Livraison</a>.
          La livraison standard est gratuite dès 80 € d&apos;achat.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Article 6 — Droit de rétractation</h2>
        <p>
          Conformément aux articles L.221-18 et suivants du Code de la consommation, le client dispose d&apos;un
          délai de 14 jours à compter de la réception de sa commande pour exercer son droit de rétractation, sans
          avoir à justifier de motif ni à payer de pénalité. Les modalités de retour et de remboursement sont
          détaillées sur notre page <a href="/legal/retours">Retours &amp; remboursements</a>.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Article 7 — Garanties légales</h2>
        <p>
          Tout produit vendu bénéficie de la garantie légale de conformité (articles L.217-3 et suivants du Code de
          la consommation) et de la garantie légale des vices cachés (articles 1641 et suivants du Code civil). Le
          détail de ces garanties est disponible sur notre page <a href="/legal/garantie">Garantie</a>.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Article 8 — Responsabilité</h2>
        <p>
          Ondeal ne saurait être tenu responsable de l&apos;inexécution du contrat en cas de force majeure, de
          perturbation ou grève totale ou partielle des services postaux ou des moyens de transport, ou de tout
          autre événement échappant à son contrôle raisonnable.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Article 9 — Marketplace et vendeurs</h2>
        <p>
          À ce jour, l&apos;intégralité des produits proposés sur ondeal.fr est sélectionnée et vendue directement
          par {COMPANY_LEGAL_NAME} : il n&apos;existe pas de vendeurs tiers indépendants opérant leur propre boutique
          sur le site. Les présentes CGV s&apos;appliquent donc à l&apos;ensemble du catalogue. Voir notre page{" "}
          <a href="/sell">Vendre sur OnDeal</a> pour toute demande de partenariat fournisseur.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Article 10 — Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des éléments du site (textes, visuels, logo, structure) est protégé par le droit
          d&apos;auteur. Toute reproduction non autorisée est interdite.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Article 11 — Données personnelles</h2>
        <p>
          Le traitement de vos données personnelles est détaillé dans notre{" "}
          <a href="/legal/confidentialite">politique de confidentialité</a>.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Article 12 — Médiation de la consommation</h2>
        <p>
          Conformément à l&apos;article L.616-1 du Code de la consommation, tout consommateur a le droit de recourir
          gratuitement à un médiateur de la consommation en vue de la résolution amiable d&apos;un litige, après
          démarche préalable écrite auprès de notre service client. Le médiateur compétent n&apos;est pas encore
          désigné à ce jour ; ses coordonnées seront ajoutées à cette page dès qu&apos;il sera choisi. En attendant,
          contactez-nous à <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Article 13 — Droit applicable et litiges</h2>
        <p>
          Les présentes CGV sont soumises au droit français. En cas de litige, le client est invité à contacter en
          priorité notre service client à <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a> afin de rechercher
          une solution amiable, avant tout recours au médiateur de la consommation (article 12) ou aux tribunaux
          compétents.
        </p>
      </section>

      <p className={styles.contactLine}>
        Une question sur ces conditions générales de vente ?{" "}
        <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.
      </p>
    </div>
  );
}
