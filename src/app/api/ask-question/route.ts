import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// Audit sécurité 2026-09-02 — les champs ci-dessous étaient injectés bruts
// dans le HTML de l'email (injection HTML : un client pouvait, via le champ
// "question" par exemple, casser la mise en forme de l'email ou y injecter
// des liens/contenu arbitraires). Même classe de risque déjà traitée
// ailleurs dans ce projet (voir escapeXml dans les flux XML, safeJsonLdString
// dans lib/seo.ts) — appliqué ici par cohérence.
function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  const { name, email, question, productTitle, productSlug, company_website } = await req.json();

  if (!name || !email || !question || !productTitle) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  // Honeypot anti-spam (voir QuestionForm.tsx) — un bot remplit ce champ
  // invisible, un humain jamais. Non vérifié côté serveur jusqu'ici, ce qui
  // rendait le honeypot inopérant (le champ était envoyé mais ignoré) :
  // succès silencieux sans envoyer l'email, cohérent avec le comportement
  // honeypot standard (ne jamais signaler au bot que sa soumission a été
  // détectée).
  if (typeof company_website === "string" && company_website.trim() !== "") {
    return NextResponse.json({ success: true });
  }

  try {
    await resend.emails.send({
      from: "OnDeal <noreply@ondeal.fr>",
      to: "contact@ondeal.fr",
      replyTo: email,
      subject: `Question produit : ${productTitle}`,
      html: `
        <h2>Nouvelle question client</h2>
        <p><strong>Produit :</strong> ${escapeHtml(productTitle)}</p>
        <p><strong>Lien :</strong> https://ondeal.fr/product/${escapeHtml(productSlug ?? "")}</p>
        <hr/>
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Question :</strong></p>
        <p>${escapeHtml(question)}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur envoi" }, { status: 500 });
  }
}
