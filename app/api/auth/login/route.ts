import { NextResponse } from "next/server";

/**
 * =============================================================================
 * CUSTOMER LOGIN API (ISOLATED & DISABLED)
 * Customer accounts are disabled. Orders are processed via guest checkout to CSV.
 * Administrators must authenticate strictly through the secure port 9090 gateway.
 * =============================================================================
 */

export async function POST() {
  return NextResponse.json(
    {
      disabled: true,
      message:
        "Customer account login is disabled. Silk operates exclusively on direct guest checkout.",
    },
    { status: 403 }
  );
}

/* =============================================================================
 * LEGACY LOGIN HANDLER (PRESERVED FOR REFERENCE)
 * =============================================================================
 *
 * export async function LegacyPOST(req: Request) {
 *   const { email, password } = await req.json();
 *   const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
 *   if (!user || user.role === "ADMIN") return NextResponse.json({ error: "Access Denied" }, { status: 403 });
 *   ...
 * }
 * =============================================================================
 */
