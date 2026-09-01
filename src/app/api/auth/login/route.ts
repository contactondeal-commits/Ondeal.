import { NextRequest, NextResponse } from "next/server";
import { customerLogin, setCustomerToken } from "@/lib/shopify/customer";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
  }

  const { token, errors } = await customerLogin(email, password);

  if (!token || errors.length > 0) {
    return NextResponse.json({ error: errors[0] ?? "Identifiants incorrects." }, { status: 401 });
  }

  await setCustomerToken(token);
  return NextResponse.json({ success: true });
}
