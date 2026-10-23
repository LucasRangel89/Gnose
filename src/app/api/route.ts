import { NextResponse } from "next/server";

/** Lightweight health check for the application API. */
export async function GET() {
  return NextResponse.json({ status: "ok", service: "gnose-dashboard" });
}
