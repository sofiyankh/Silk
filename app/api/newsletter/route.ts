import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData().catch(() => null);
    let email = formData?.get("email") as string;
    if (!email) {
      const json = await req.json().catch(() => null);
      email = json?.email;
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // In a full production setup this pushes to Resend / DB
    return NextResponse.redirect(new URL("/?subscribed=true", req.url));
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to subscribe" }, { status: 500 });
  }
}
