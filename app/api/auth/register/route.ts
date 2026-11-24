import { NextResponse } from "next/server";

/**
 * =============================================================================
 * CUSTOMER REGISTRATION API (ISOLATED & DISABLED)
 * The database is reserved exclusively for catalog/products and the single admin.
 * Client command orders are recorded to CSV (data/orders.csv) without DB users.
 * =============================================================================
 */

export async function POST() {
  return NextResponse.json(
    {
      disabled: true,
      message:
        "Customer account creation is disabled. Silk operates exclusively on direct guest checkout with CSV/Google Sheets order processing.",
    },
    { status: 403 }
  );
}

/* =============================================================================
 * LEGACY REGISTRATION HANDLER (PRESERVED FOR REFERENCE)
 * =============================================================================
 *
 * export async function LegacyPOST(req: Request) {
 *   const { name, email, phone, password, address, city, governorate } = await req.json();
 *   const passwordHash = await bcrypt.hash(password, 12);
 *   const user = await db.user.create({ data: { name, email, phone, passwordHash, role: "CUSTOMER" } });
 *   return NextResponse.json({ user });
 * }
 * =============================================================================
 */
