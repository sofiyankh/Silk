import React from "react";
import { Users, Mail, Phone, ShoppingBag } from "@/components/icons";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";

export const revalidate = 0;

interface ClientSummary {
  name: string;
  phone: string;
  email: string;
  city: string;
  governorate: string;
  ordersCount: number;
  totalSpentMillimes: number;
  lastOrderDate: string;
}

export default async function AdminCustomersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      contactName: true,
      contactPhone: true,
      contactEmail: true,
      city: true,
      totalMillimes: true,
      createdAt: true,
    },
  });

  // Aggregate clients by phone number / name from database
  const clientsMap = new Map<string, ClientSummary>();

  for (const order of orders) {
    const key = (order.contactPhone || order.contactName).trim().toLowerCase();
    const existing = clientsMap.get(key);

    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpentMillimes += order.totalMillimes || 0;
      if (!existing.email && order.contactEmail) existing.email = order.contactEmail;
    } else {
      clientsMap.set(key, {
        name: order.contactName,
        phone: order.contactPhone,
        email: order.contactEmail || "",
        city: order.city || "Tunis",
        governorate: "Tunisie",
        ordersCount: 1,
        totalSpentMillimes: order.totalMillimes || 0,
        lastOrderDate: order.createdAt
          ? new Date(order.createdAt).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      });
    }
  }

  const clients = Array.from(clientsMap.values());

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">
            Client Directory ({clients.length})
          </h1>
          <p className="text-xs text-[#888888] mt-0.5">
            Client contacts aggregated automatically from database command orders (Guest Checkout)
          </p>
        </div>

        <div>
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
            <span>Export Orders to Google Sheets</span>
          </a>
        </div>
      </div>

      <div className="bg-[#181818] border border-[#272727] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#272727] bg-[#1d1d1d] text-[11px] uppercase tracking-wider text-[#777777]">
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Command Orders</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4 text-right">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#666666]">
                    No client command orders recorded yet.
                  </td>
                </tr>
              ) : (
                clients.map((c, idx) => (
                  <tr key={idx} className="hover:bg-[#1f1f1f] transition">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{c.name || "Client"}</span>
                      {c.email && (
                        <span className="text-[10px] text-[#666666] flex items-center gap-1 mt-0.5">
                          <Mail size={10} />
                          {c.email}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#aaaaaa]">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Phone size={12} className="text-[#666666]" />
                        <span>{c.phone || "No phone"}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#aaaaaa]">
                      <span>{c.city}</span>
                      <span className="text-[#666666] text-[10px] block">{c.governorate}</span>
                    </td>
                    <td className="py-3 px-4 text-white font-mono">
                      <span className="px-2 py-0.5 bg-[#252525] rounded text-[11px]">
                        {c.ordersCount} {c.ordersCount === 1 ? "order" : "orders"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-white font-mono">
                      {formatPrice(c.totalSpentMillimes)}
                    </td>
                    <td className="py-3 px-4 text-[#888888] text-right font-mono text-[11px]">
                      {c.lastOrderDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
