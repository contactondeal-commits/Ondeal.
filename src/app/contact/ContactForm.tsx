"use client";

import { useState, type FormEvent } from "react";
import styles from "./ContactForm.module.css";

const CATEGORIES = [
  "Une commande en cours",
  "Un produit",
  "Une livraison ou un retour",
  "Un partenariat / devenir fournisseur",
  "Presse",
  "Autre",
];

/**
 * Mission "PAGES FOOTER" (18/08/2026) — formulaire de contact réellement
 * fonctionnel. Le projet ne dispose d'aucun service d'envoi d'email
 * (aucune clé Resend/SendGrid/SMTP configurée — vérifié dans .env/.env.local
 * avant d'écrire ce composant, voir rapport de fin de mission) : plutôt que
 * d'inventer un backend d'envoi qui échouerait silencieusement en
 * production, ce formulaire valide les champs puis ouvre le client email du
 * visiteur (mailto:) avec le message pré-rempli, adressé à COMPANY_EMAIL.
 * C'est un envoi réel (le message part bien du logiciel de messagerie du
 * client vers notre adresse), juste pas un envoi silencieux depuis un
 * serveur — la confirmation à l'écran l'explique honnêtement.
 *
 * Anti-spam : champ honeypot invisible (même pattern que
 * WriteReviewForm.tsx) — un bot qui remplit tous les champs, y compris
 * celui-ci, voit sa soumission bloquée côté client sans jamais ouvrir de
 * client email.
 */
export default function ContactForm({ toEmail }: { toEmail: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (honeypot.trim().length > 0) {
      // Bot détecté : on affiche quand même une confirmation (ne pas
      // révéler le piège), mais on n'ouvre rien.
      setSent(true);
      return;
    }

    if (name.trim().length < 2) {
      setError("Merci d'indiquer votre nom.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) {
      setError("Merci d'indiquer une adresse email valide.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Votre message est un peu court — dites-nous en un peu plus (10 caractères minimum).");
      return;
    }

    const subject = `[OnDeal — ${category}] Message de ${name.trim()}`;
    const body = `${message.trim()}\n\n---\nNom : ${name.trim()}\nEmail : ${email.trim()}\nCatégorie : ${category}`;
    const mailtoUrl = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
    setSent(true);
  }

  if (sent) {
    return (
      <div className={styles.confirmation} role="status">
        <p>
          Votre logiciel de messagerie va s&apos;ouvrir avec votre message pré-rempli, adressé à{" "}
          <strong>{toEmail}</strong>. Il ne vous reste qu&apos;à cliquer sur « Envoyer » depuis votre boîte mail pour
          que nous le recevions.
        </p>
        <p>
          Rien ne s&apos;est ouvert ?{" "}
          <a href={`mailto:${toEmail}`}>Écrivez-nous directement à {toEmail}</a>.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="contact-name">Nom</label>
        <input id="contact-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-category">Catégorie de votre demande</label>
        <select id="contact-category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      {/* Piège à robots — invisible et non atteignable au clavier, jamais
          rempli par un utilisateur humain (voir en-tête du fichier). */}
      <div className={styles.honeypotWrap} aria-hidden="true">
        <label htmlFor="contact-website">Laissez ce champ vide</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.submit}>
        Envoyer le message
      </button>
    </form>
  );
}
