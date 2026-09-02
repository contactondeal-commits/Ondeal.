import { Resend } from "resend";
import { NextResponse } from "next/server";

// Correctif 2026-09-02 — ce fichier contenait par erreur (écrasement
// accidentel) une copie du générateur de flux Google Shopping
// (voir src/app/feed/google-shopping.xml/route.ts) : uniquement un GET()
// renvoyant du XML, sans aucun handler POST. Or src/app/partenaires/page.tsx
// fait un fetch POST vers /api/partenaires avec les champs du formulaire
// "Devenir partenaire" — sans handler POST, Next.js renvoie 405 à chaque
// soumission : AUCUNE candidature partenaire n'a donc jamais pu être reçue.
// Réimplémenté sur le modèle exact de src/app/api/ask-question/route.ts
// (même prestataire d'envoi d'email, même échappement HTML).
const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  const { nom, email, telephone, activite, message } = await req.json();

  if (!nom || !email || !activite || !message) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "OnDeal <noreply@ondeal.fr>",
      to: "contact@ondeal.fr",
      replyTo: email,
      subject: `Nouvelle candidature partenaire : ${nom}`,
      html: `
        <h2>Nouvelle candidature partenaire</h2>
        <p><strong>Nom / société :</strong> ${escapeHtml(nom)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Téléphone :</strong> ${escapeHtml(telephone || "Non renseigné")}</p>
        <p><strong>Activité / produits :</strong> ${escapeHtml(activite)}</p>
        <hr/>
        <p><strong>Message :</strong></p>
        <p>${escapeHtml(message)}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur envoi" }, { status: 500 });
  }
}
