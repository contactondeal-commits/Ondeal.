const fs = require('fs');
const content = `"use client";
import { useState } from "react";

export default function PartenairesPage() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/partenaires", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nom: fd.get("Nom"),
        email: fd.get("Email"),
        telephone: fd.get("Telephone"),
        activite: fd.get("Activite"),
        message: fd.get("Message"),
      }),
    });
    setStatus(res.ok ? "success" : "error");
  }

  return (
    <>
      <section style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "#fff", padding: "80px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, margin: "0 0 20px" }}>Vendez plus. Ensemble.</h1>
        <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 560, margin: "0 auto 40px" }}>OnDeal connecte des milliers d'acheteurs à des fournisseurs sélectionnés.</p>
        <a href="#formulaire" style={{ background: "#fff", color: "#4f46e5", padding: "16px 36px", borderRadius: 50, fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-block" }}>Devenir partenaire</a>
      </section>
      <section id="formulaire" style={{ background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", marginBottom: 40 }}>Rejoignez-nous</h2>
          {status === "success" ? (
            <div style={{ background: "#d1fae5", borderRadius: 12, padding: 32, textAlign: "center" }}>
              <h3 style={{ color: "#065f46" }}>Candidature envoyée !</h3>
              <p style={{ color: "#047857" }}>Notre équipe vous contacte sous 24h.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input name="Nom" placeholder="Nom / société *" required style={{ padding: "14px", border: "1px solid #ddd", borderRadius: 12, fontSize: 15 }} />
              <input name="Email" type="email" placeholder="Email *" required style={{ padding: "14px", border: "1px solid #ddd", borderRadius: 12, fontSize: 15 }} />
              <input name="Telephone" placeholder="Téléphone" type="tel" style={{ padding: "14px", border: "1px solid #ddd", borderRadius: 12, fontSize: 15 }} />
              <input name="Activite" placeholder="Activité / produits *" required style={{ padding: "14px", border: "1px solid #ddd", borderRadius: 12, fontSize: 15 }} />
              <textarea name="Message" placeholder="Décrivez votre offre..." rows={5} required style={{ padding: "14px", border: "1px solid #ddd", borderRadius: 12, fontSize: 15, resize: "vertical" }} />
              <button type="submit" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "#fff", padding: "16px", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
                {status === "loading" ? "Envoi..." : "Envoyer ma candidature →"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
`;
fs.writeFileSync('src/app/partenaires/page.tsx', content, 'utf8');
console.log('Done');
