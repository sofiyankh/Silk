import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { ok: true, timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Health check failed:", err.message);
    return NextResponse.json(
      { ok: false, timestamp: new Date().toISOString() },
      { status: 503 }
    );
  }
}
