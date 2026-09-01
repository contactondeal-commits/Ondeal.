import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { nom, email, telephone, activite, message } = await req.json();

  const key = process.env.KLAVIYO_PRIVATE_KEY;
  if (!key) return NextResponse.json({ error: "No API key" }, { status: 500 });

  // 1. Créer/mettre à jour le profil
  const profileRes = await fetch("https://a.klaviyo.com/api/profiles/", {
    method: "POST",
    headers: {
      accept: "application/json",
      revision: "2024-02-15",
      "content-type": "application/json",
      Authorization: `Klaviyo-API-Key ${key}`,
    },
    body: JSON.stringify({
      data: {
        type: "profile",
        attributes: {
          email,
          first_name: nom,
          phone_number: telephone || undefined,
          properties: { activite, message, source: "formulaire-partenaires" },
        },
      },
    }),
  });

  if (!profileRes.ok && profileRes.status !== 409) {
    return NextResponse.json({ error: "Klaviyo error" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
