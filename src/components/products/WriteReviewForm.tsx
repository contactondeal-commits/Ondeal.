"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { submitProductReview } from "@/app/actions/reviews";
import styles from "./WriteReviewForm.module.css";

/**
 * Mission "FORMULAIRE AVIS CLIENT" (17/08/2026) — voir judgeme.ts et
 * src/app/actions/reviews.ts pour le contexte complet et les décisions de
 * sécurité. Ce formulaire est la seule pièce manquante pour qu'un client
 * puisse réellement poster un avis (jusqu'ici : affichage seul).
 *
 * Publication immédiate choisie explicitement par le client (via
 * AskUserQuestion) plutôt qu'une file de validation manuelle — l'avis
 * soumis apparaît donc directement après rechargement de la page (voir
 * `revalidatePath` dans la Server Action), sans attente. Honnêteté du
 * message de confirmation : Judge.me ne permet pas de marquer un avis
 * soumis via l'API comme "achat vérifié" (limite documentée de l'API, pas
 * un choix de ce projet) — jamais laissé entendre le contraire.
 */
export default function WriteReviewForm({
  slug,
  shopifyProductId,
}: {
  slug: string;
  shopifyProductId: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  // Champ piège à robots — jamais rempli par un vrai visiteur (masqué
  // visuellement ET du lecteur d'écran, voir WriteReviewForm.module.css).
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    if (rating < 1) {
      setStatus("error");
      setErrorMessage("Merci de choisir une note (1 à 5 étoiles).");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    const result = await submitProductReview({
      slug,
      shopifyProductId,
      name,
      email,
      rating,
      title,
      body,
      honeypot,
    });

    if (result.ok) {
      setStatus("success");
      setName("");
      setEmail("");
      setRating(0);
      setTitle("");
      setBody("");
    } else {
      setStatus("error");
      setErrorMessage(
        result.error === "invalid_input"
          ? "Merci de vérifier les champs du formulaire (email valide, avis non vide)."
          : "Une erreur est survenue, réessayez plus tard."
      );
    }
  }

  if (status === "success") {
    return (
      <p className={styles.success}>
        Merci pour votre avis ! Il est maintenant visible sur cette page.
      </p>
    );
  }

  if (!open) {
    return (
      <button type="button" className={styles.openBtn} onClick={() => setOpen(true)}>
        Laisser un avis
      </button>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.heading}>Laisser un avis</h3>

      <div className={styles.field}>
        <span className={styles.label}>Votre note</span>
        <div className={styles.stars} role="radiogroup" aria-label="Note sur 5">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
              className={styles.starBtn}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
            >
              <Star
                size={24}
                fill={value <= (hoverRating || rating) ? "var(--color-rating)" : "none"}
                color="var(--color-primary)"
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="review-name" className={styles.label}>
          Votre nom
        </label>
        <input
          id="review-name"
          type="text"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="review-email" className={styles.label}>
          Votre email
        </label>
        <input
          id="review-email"
          type="email"
          required
          maxLength={320}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <span className={styles.hint}>Ne sera jamais affiché publiquement.</span>
      </div>

      <div className={styles.field}>
        <label htmlFor="review-title" className={styles.label}>
          Titre (facultatif)
        </label>
        <input
          id="review-title"
          type="text"
          maxLength={150}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="review-body" className={styles.label}>
          Votre avis
        </label>
        <textarea
          id="review-body"
          required
          minLength={3}
          maxLength={5000}
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={styles.textarea}
        />
      </div>

      {/* Piège à robots : visuellement et pour le lecteur d'écran invisible
          (tabIndex=-1, aria-hidden), donc jamais rempli par un vrai
          visiteur — voir src/app/actions/reviews.ts pour la vérification
          côté serveur. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="review-website">Site web</label>
        <input
          id="review-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {status === "error" && <p className={styles.error}>{errorMessage}</p>}

      <div className={styles.actions}>
        <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
          {status === "loading" ? "Envoi..." : "Publier mon avis"}
        </button>
        <button type="button" className={styles.cancelBtn} onClick={() => setOpen(false)}>
          Annuler
        </button>
      </div>
    </form>
  );
}
