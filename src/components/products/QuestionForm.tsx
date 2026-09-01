"use client";

import { useState } from "react";
import styles from "./QuestionForm.module.css";

interface Props {
  productTitle: string;
  productSlug: string;
}

export default function QuestionForm({ productTitle, productSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/ask-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, question, productTitle, productSlug }),
    });
    setStatus(res.ok ? "success" : "error");
  }

  if (status === "success") {
    return <p className={styles.success}>✅ Votre question a bien été envoyée ! Nous vous répondrons rapidement.</p>;
  }

  return (
    <div className={styles.wrap}>
      {!open ? (
        <button className={styles.trigger} onClick={() => setOpen(true)}>
          Poser une question
        </button>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3 className={styles.formTitle}>Posez votre question</h3>
          <input
            className={styles.input}
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <textarea
            className={styles.textarea}
            placeholder="Votre question sur ce produit..."
            value={question}
            onChange={e => setQuestion(e.target.value)}
            rows={4}
            required
          />
          {status === "error" && <p className={styles.error}>Une erreur est survenue. Réessayez.</p>}
          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={() => setOpen(false)}>Annuler</button>
            <button type="submit" className={styles.submit} disabled={status === "loading"}>
              {status === "loading" ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
