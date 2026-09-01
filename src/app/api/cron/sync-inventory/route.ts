import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Sécurité — vérification token Vercel Cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Appel API Syncee ou votre fournisseur pour sync stock
    const res = await fetch("https://syncee.com/api/v1/products/sync", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SYNCEE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ store_id: process.env.SHOPIFY_STORE_DOMAIN }),
    });

    if (!res.ok) throw new Error("Syncee sync failed");

    return NextResponse.json({ success: true, synced_at: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
