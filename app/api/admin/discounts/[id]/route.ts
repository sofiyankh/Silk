import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const discount = await db.discount.update({
      where: { id },
      data: {
        isActive: body.isActive !== undefined ? !!body.isActive : undefined,
        value: body.value !== undefined ? Number(body.value) : undefined,
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
    return NextResponse.json({ error: err.message || "Failed to update discount" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await db.discount.delete({ where: { id } });

    try {
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/collections");
      revalidatePath("/collections/[slug]", "page");
      revalidatePath("/product/[slug]", "page");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete discount" }, { status: 500 });
  }
}
