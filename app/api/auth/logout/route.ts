import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = cookies();
  cookieStore.delete("silk_session_user");
  cookieStore.delete("silk_admin_token");

  return NextResponse.redirect(new URL("/login", req.url));
}

export async function POST(req: Request) {
  const cookieStore = cookies();
  cookieStore.delete("silk_session_user");
  cookieStore.delete("silk_admin_token");

  return NextResponse.json({ success: true });
}
