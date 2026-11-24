import React from "react";
import { db } from "@/lib/db";
import { OrdersTable } from "./orders-table";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">
            Customer Orders ({orders.length})
          </h1>
          <p className="text-xs text-[#888888] mt-0.5">
            Audit trail, customer contact numbers, COD verification & CSV / Google Sheets storage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/orders/export-csv"
            download
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider rounded transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Export CSV (Google Sheets)</span>
          </a>
        </div>
      </div>

      <OrdersTable initialOrders={orders} />
    </div>
  );
}
