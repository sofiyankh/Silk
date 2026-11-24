import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET() {
  const discounts = await db.discount.findMany({ orderBy: { startsAt: "desc" } });
  return NextResponse.json({ discounts });
}

export async function POST(req: Request) {
  try {
    const { name, code, type = "PERCENT", value, usageLimit } = await req.json();

    if (!name || !code || !value) {
      return NextResponse.json({ error: "Name, coupon code and discount value are required" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await db.discount.findUnique({ where: { code: cleanCode } });
    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }

    const discount = await db.discount.create({
      data: {
        name,
        code: cleanCode,
        type,
        value: Number(value),
        usageLimit: usageLimit ? Number(usageLimit) : null,
        isActive: true,
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/collections");
      revalidatePath("/collections/[slug]", "page");
      revalidatePath("/product/[slug]", "page");
    } catch {}

    return NextResponse.json({ success: true, discount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create discount" }, { status: 500 });
  }
}
