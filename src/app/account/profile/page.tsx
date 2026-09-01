import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Mes informations", robots: { index: false, follow: false } };

export default function ProfilePage() {
  return (
    <div>
      <h1>Mes informations</h1>
      <form className={styles.form}>
        <label>
          Nom complet
          <input defaultValue="Utilisateur Démo" />
        </label>
        <label>
          E-mail
          <input type="email" defaultValue="utilisateur@exemple.fr" />
        </label>
        <label>
          Téléphone
          <input type="tel" placeholder="06 12 34 56 78" />
        </label>
        <fieldset className={styles.fieldset}>
          <legend>Mot de passe</legend>
          <input type="password" placeholder="Nouveau mot de passe" />
          <input type="password" placeholder="Confirmer le mot de passe" />
        </fieldset>
        <Button type="submit" variant="primary">
          Enregistrer les modifications
        </Button>
      </form>
    </div>
  );
}
