import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status, note } = await req.json();

    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            variant: {
              include: { product: { select: { slug: true } } },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: any = {
      status,
    };

    const now = new Date();
    if (status === "CONFIRMED") updateData.confirmedAt = now;
    if (status === "SHIPPED") updateData.shippedAt = now;
    if (status === "DELIVERED") {
      updateData.deliveredAt = now;
      updateData.cashCollectedAt = now;
    }
    if (status === "CANCELLED") {
      updateData.cancelledAt = now;
      // Restore stock for cancelled order items
      for (const item of order.items) {
        await db.variant.update({
          where: { id: item.variantId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }

    const updated = await db.order.update({
      where: { id },
      data: {
        ...updateData,
        statusHistory: {
          create: {
            status,
            changedBy: "admin",
            note: note || `Order updated to ${status}`,
          },
        },
      },
      include: { items: true, statusHistory: true },
    });

    if (status === "CANCELLED") {
      try {
        revalidatePath("/");
        revalidatePath("/shop");
        revalidatePath("/collections");
        revalidatePath("/collections/[slug]", "page");
        const slugs = Array.from(new Set(order.items.map((it) => it.variant?.product?.slug).filter(Boolean)));
        for (const slug of slugs) {
          revalidatePath(`/product/${slug}`);
        }
      } catch {}
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update order status" }, { status: 500 });
  }
}
