import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { stock } = await req.json();

    const variant = await db.variant.update({
      where: { id },
      data: { stock: Math.max(0, Number(stock)) },
      include: { product: true },
    });

    try {
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/collections");
      revalidatePath("/collections/[slug]", "page");
      if (variant.product?.slug) {
        revalidatePath(`/product/${variant.product.slug}`);
      }
    } catch {}

    return NextResponse.json({ success: true, variant });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update stock" }, { status: 500 });
  }
}
