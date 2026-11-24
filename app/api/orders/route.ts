import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendWhatsAppNotification } from "@/lib/whatsapp-service";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Throttle storefront revalidation during order bursts (15s cooldown)
const REVALIDATE_COOLDOWN_MS = 15000;
let lastStorefrontRevalidateAt = 0;

// Generate next collision-safe order number
async function generateOrderNumber(tx: Prisma.TransactionClient): Promise<string> {
  const latestOrder = await tx.order.findFirst({
    orderBy: { createdAt: "desc" },
    select: { number: true },
  });

  let nextSequence = 1;
  if (latestOrder?.number) {
    const match = latestOrder.number.match(/\d+/);
    if (match) {
      nextSequence = parseInt(match[0], 10) + 1;
    }
  }

  return `ORD-${String(nextSequence).padStart(6, "0")}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      items,
      shippingInfo,
      paymentMethod = "COD",
      discountCode,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    if (!shippingInfo || !shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address) {
      return NextResponse.json({ error: "Missing required shipping information" }, { status: 400 });
    }

    const requestStartTime = Date.now();

    // Step 7 optimization: Pre-fetch all variants & prices in ONE query before the transaction
    const variantIds = items.map((it: any) => it.variantId).filter(Boolean);
    const variantsList = await db.variant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true },
    });
    const variantsMap = new Map(variantsList.map((v) => [v.id, v]));

    for (const item of items) {
      if (!item.variantId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json({ error: "Invalid item format or quantity" }, { status: 400 });
      }
      const variant = variantsMap.get(item.variantId);
      if (!variant) {
        return NextResponse.json({ error: `Variant ${item.variantId} not found` }, { status: 400 });
      }
      if (variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${variant.product.nameEn} (${variant.size}). Only ${variant.stock} available.` },
          { status: 400 }
        );
      }
    }

    // Execute order creation in a single transaction with collision retry budget (max 3 attempts, 6s total)
    let createdOrder: any = null;
    let orderSummaryData: any = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 3;
    const RETRY_DEADLINE_MS = 6000;

    while (attempts < MAX_ATTEMPTS) {
      attempts++;
      const remaining = 8500 - (Date.now() - requestStartTime);
      if (remaining < 1500) {
        const busyErr: any = new Error("busy, please retry");
        busyErr.status = 503;
        throw busyErr;
      }

      try {
        const result = await db.$transaction(
          async (tx) => {
            let subtotalMillimes = 0;
            const orderItemsData: {
              variantId: string;
              productName: string;
              size: string;
              color: string;
              quantity: number;
              unitMillimes: number;
            }[] = [];

            for (const item of items) {
              const variant = variantsMap.get(item.variantId)!;

              // Atomically decrement stock
              await tx.variant.update({
                where: { id: variant.id },
                data: { stock: { decrement: item.quantity } },
              });

              const unitPrice = variant.priceOverrideMillimes ?? variant.product.basePriceMillimes;
              subtotalMillimes += unitPrice * item.quantity;

              orderItemsData.push({
                variantId: variant.id,
                productName: variant.product.nameEn,
                size: variant.size,
                color: variant.color,
                quantity: item.quantity,
                unitMillimes: unitPrice,
              });
            }

            // Server-side discount evaluation
            let discountMillimes = 0;
            let validatedDiscountCode: string | null = null;

            if (discountCode && typeof discountCode === "string") {
              const cleanCode = discountCode.trim().toUpperCase();
              if (cleanCode === "SILK10") {
                discountMillimes = Math.round((subtotalMillimes * 10) / 100);
                validatedDiscountCode = "SILK10";
              } else if (cleanCode === "WELCOME") {
                discountMillimes = Math.round((subtotalMillimes * 15) / 100);
                validatedDiscountCode = "WELCOME";
              }
            }

            // Server-side shipping calculation: Free shipping over 100 TND (100,000 millimes), else 7 TND flat rate
            const shippingMillimes = subtotalMillimes >= 100000 ? 0 : 7000;
            const totalMillimes = Math.max(0, subtotalMillimes - discountMillimes + shippingMillimes);

            // Generate collision-safe order number
            const orderNumber = await generateOrderNumber(tx);

            // Create Order, OrderItems and OrderStatusEvent inside atomic transaction
            const order = await tx.order.create({
              data: {
                number: orderNumber,
                userId: null,
                addressId: null,
                status: "PENDING",
                subtotalMillimes,
                discountMillimes,
                shippingMillimes,
                totalMillimes,
                discountCode: validatedDiscountCode,
                contactName: shippingInfo.fullName.trim(),
                contactPhone: shippingInfo.phone.trim(),
                contactEmail: (shippingInfo.email || "").trim(),
                shippingAddress: `${shippingInfo.address.trim()}, ${shippingInfo.city || "Tunis"}`,
                city: shippingInfo.city || "Tunis",
                postalCode: shippingInfo.postalCode || "1000",
                paymentMethod: "COD",
                notes: shippingInfo.notes ? shippingInfo.notes.trim() : null,
                items: {
                  create: orderItemsData,
                },
                statusHistory: {
                  create: {
                    status: "PENDING",
                    changedBy: "customer",
                    note: `Client order placed via COD (Cash On Delivery)`,
                  },
                },
              },
              include: {
                items: true,
                statusHistory: true,
              },
            });

            return {
              order,
              summary: {
                orderNumber: order.number,
                customerName: order.contactName,
                customerPhone: order.contactPhone,
                customerEmail: order.contactEmail,
                shippingAddress: order.shippingAddress,
                city: order.city,
                postalCode: order.postalCode,
                subtotalMillimes: order.subtotalMillimes,
                discountMillimes: order.discountMillimes,
                shippingMillimes: order.shippingMillimes,
                totalMillimes: order.totalMillimes,
                discountCode: order.discountCode,
                paymentMethod: order.paymentMethod,
                notes: order.notes,
                items: orderItemsData.map((it) => ({
                  productName: it.productName,
                  color: it.color,
                  size: it.size,
                  quantity: it.quantity,
                  unitPriceMillimes: it.unitMillimes,
                })),
              },
            };
          },
          {
            maxWait: Math.floor(Math.min(2000, remaining / 3)),
            timeout: Math.floor(Math.min(6000, remaining - 500)),
          }
        );

        createdOrder = result.order;
        orderSummaryData = result.summary;
        break; // Transaction succeeded
      } catch (txError: any) {
        // If unique constraint violation on order number (P2002), retry with next sequence if within attempt & time limits
        const elapsed = Date.now() - requestStartTime;
        if (
          txError.code === "P2002" &&
          txError.meta?.target?.includes("number") &&
          attempts < MAX_ATTEMPTS &&
          elapsed < RETRY_DEADLINE_MS
        ) {
          await new Promise((res) => setTimeout(res, 50));
          continue;
        }
        throw txError;
      }
    }

    // Await WhatsApp notification with dynamic time budget; errors/skips are logged so order is always returned
    if (orderSummaryData) {
      const elapsed = Date.now() - requestStartTime;
      const remainingTime = 9000 - elapsed;
      const waTimeout = Math.min(3000, remainingTime);

      if (waTimeout < 1000) {
        console.warn(
          `[Orders] Skipping WhatsApp notification: insufficient time remaining (${remainingTime}ms). Order #${createdOrder?.number} saved.`
        );
      } else {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error(`WhatsApp notification timed out after ${waTimeout}ms`)),
              waTimeout
            )
          );
          await Promise.race([
            sendWhatsAppNotification(orderSummaryData),
            timeoutPromise,
          ]);
        } catch (notifyErr: any) {
          console.warn("[Orders] WhatsApp notification dispatch failed (non-fatal):", notifyErr.message);
        }
      }
    }

    try {
      const now = Date.now();
      if (now - lastStorefrontRevalidateAt >= REVALIDATE_COOLDOWN_MS) {
        lastStorefrontRevalidateAt = now;
        revalidatePath("/");
        revalidatePath("/shop");
        revalidatePath("/collections");
        const productSlugs = Array.from(new Set(variantsList.map((v) => v.product?.slug).filter(Boolean)));
        for (const slug of productSlugs) {
          revalidatePath(`/product/${slug}`);
        }
      }
    } catch {}

    return NextResponse.json({ success: true, order: createdOrder });
  } catch (err: any) {
    console.error("Order creation error:", err?.message || "Unknown error");
    return NextResponse.json(
      { error: err.message || "Failed to create order" },
      { status: err.status || 400 }
    );
  }
}
