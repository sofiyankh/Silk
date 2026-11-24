import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      nameEn,
      nameFr,
      basePriceMillimes,
      compareAtMillimes,
      isPublished,
      descriptionEn,
      descriptionFr,
    } = body;

    const updated = await db.product.update({
      where: { id },
      data: {
        nameEn: nameEn !== undefined ? nameEn : undefined,
        nameFr: nameFr !== undefined ? nameFr : undefined,
        basePriceMillimes: basePriceMillimes !== undefined ? Number(basePriceMillimes) : undefined,
        compareAtMillimes: compareAtMillimes !== undefined ? Number(compareAtMillimes) : undefined,
        isPublished: isPublished !== undefined ? !!isPublished : undefined,
        descriptionEn: descriptionEn !== undefined ? descriptionEn : undefined,
        descriptionFr: descriptionFr !== undefined ? descriptionFr : undefined,
      },
      include: { variants: true, images: true },
    });

    try {
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/collections");
      revalidatePath("/collections/[slug]", "page");
      revalidatePath(`/product/${updated.slug}`);
      revalidatePath("/admin/products");
    } catch (e) {
      // Ignore cache revalidation errors if any
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete related images, variants, and product
    await db.productImage.deleteMany({ where: { productId: id } });
    await db.variant.deleteMany({ where: { productId: id } });
    const deleted = await db.product.delete({ where: { id }, select: { slug: true } });

    try {
      revalidatePath("/");
      revalidatePath("/shop");
      revalidatePath("/collections");
      revalidatePath("/collections/[slug]", "page");
      revalidatePath(`/product/${deleted.slug}`);
      revalidatePath("/admin/products");
    } catch (e) {
      // Ignore
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete product" }, { status: 500 });
  }
}
