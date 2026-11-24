import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET() {
  try {
    const orders = await db.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Order Number",
      "Date",
      "Status",
      "Customer Name",
      "Phone",
      "Email",
      "City",
      "Address",
      "Postal Code",
      "Items Count",
      "Items Summary",
      "Subtotal (TND)",
      "Discount (TND)",
      "Discount Code",
      "Shipping (TND)",
      "Total (TND)",
      "Payment Method",
      "Notes",
    ];

    const rows = [headers.map(escapeCSV).join(",")];

    for (const o of orders) {
      const itemsSummary = o.items
        .map((it) => `${it.productName} (${it.color}/${it.size}) x${it.quantity}`)
        .join(" | ");
      const itemsCount = o.items.reduce((sum, it) => sum + it.quantity, 0);

      const row = [
        o.number,
        o.createdAt.toISOString(),
        o.status,
        o.contactName,
        o.contactPhone,
        o.contactEmail || "",
        o.city || "Tunis",
        o.shippingAddress || "",
        o.postalCode || "1000",
        itemsCount,
        itemsSummary,
        (o.subtotalMillimes / 1000).toFixed(3),
        (o.discountMillimes / 1000).toFixed(3),
        o.discountCode || "",
        (o.shippingMillimes / 1000).toFixed(3),
        (o.totalMillimes / 1000).toFixed(3),
        o.paymentMethod,
        o.notes || "",
      ];

      rows.push(row.map(escapeCSV).join(","));
    }

    // UTF-8 BOM (\uFEFF) for Excel / Google Sheets compatibility
    const csvContent = "\uFEFF" + rows.join("\r\n");
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `silk-orders-${timestamp}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err: any) {
    console.error("Export orders CSV error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to export orders CSV" },
      { status: 500 }
    );
  }
}
