import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, question, productTitle, productSlug } = await req.json();

  if (!name || !email || !question || !productTitle) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "OnDeal <noreply@ondeal.fr>",
      to: "contact@ondeal.fr",
      replyTo: email,
      subject: `Question produit : ${productTitle}`,
      html: `
        <h2>Nouvelle question client</h2>
        <p><strong>Produit :</strong> ${productTitle}</p>
        <p><strong>Lien :</strong> https://ondeal.fr/product/${productSlug}</p>
        <hr/>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Question :</strong></p>
        <p>${question}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur envoi" }, { status: 500 });
  }
}
