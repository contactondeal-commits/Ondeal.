import { NextResponse } from "next/server";
import { customerLogout } from "@/lib/shopify/customer";

export async function POST() {
  await customerLogout();
  return NextResponse.json({ success: true });
}
