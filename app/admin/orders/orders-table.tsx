"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Truck, XCircle, Clock, ChevronDown, ChevronUp, Phone, MapPin } from "@/components/icons";
import { formatPrice } from "@/lib/money";

export function OrdersTable({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = activeTab === "ALL"
    ? orders
    : orders.filter((o) => o.status.toUpperCase() === activeTab);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setLoadingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st.toUpperCase()) {
      case "DELIVERED":
        return "bg-emerald-950 text-emerald-400 border border-emerald-800";
      case "SHIPPED":
        return "bg-sky-950 text-sky-400 border border-sky-800";
      case "PROCESSING":
        return "bg-amber-950 text-amber-400 border border-amber-800";
      case "CONFIRMED":
        return "bg-indigo-950 text-indigo-400 border border-indigo-800";
      case "CANCELLED":
        return "bg-rose-950 text-rose-400 border border-rose-800";
      default:
        return "bg-zinc-800 text-zinc-300 border border-zinc-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 uppercase font-semibold text-[11px] tracking-wider rounded transition ${
                activeTab === tab
                  ? "bg-white text-black"
                  : "bg-[#1c1c1c] text-[#888888] hover:text-white"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-[#181818] border border-[#272727] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#272727] bg-[#1d1d1d] text-[11px] uppercase tracking-wider text-[#777777]">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone / City</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]">
              {filtered.map((ord) => {
                const isExpanded = expandedId === ord.id;

                return (
                  <React.Fragment key={ord.id}>
                    <tr
                      className="hover:bg-[#1f1f1f] transition cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : ord.id)}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {ord.number}
                      </td>
                      <td className="py-3 px-4 text-[#888888]">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        {ord.contactName}
                      </td>
                      <td className="py-3 px-4 text-[#aaaaaa]">
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-[#666666]" />
                          <span>{ord.contactPhone}</span>
                        </div>
                        <span className="text-[10px] text-[#666666]">{ord.city || "Tunis"}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-white">
                        {formatPrice(ord.totalMillimes)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusBadge(
                            ord.status
                          )}`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {ord.status === "PENDING" && (
                            <button
                              disabled={loadingId === ord.id}
                              onClick={() => updateStatus(ord.id, "CONFIRMED")}
                              className="px-2 py-1 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 text-[10px] font-semibold uppercase tracking-wider rounded"
                            >
                              Confirm
                            </button>
                          )}
                          {ord.status === "CONFIRMED" && (
                            <button
                              disabled={loadingId === ord.id}
                              onClick={() => updateStatus(ord.id, "PROCESSING")}
                              className="px-2 py-1 bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-[10px] font-semibold uppercase tracking-wider rounded"
                            >
                              Process
                            </button>
                          )}
                          {ord.status === "PROCESSING" && (
                            <button
                              disabled={loadingId === ord.id}
                              onClick={() => updateStatus(ord.id, "SHIPPED")}
                              className="px-2 py-1 bg-sky-900/60 hover:bg-sky-800 text-sky-200 text-[10px] font-semibold uppercase tracking-wider rounded flex items-center gap-1"
                            >
                              <Truck size={11} />
                              <span>Ship</span>
                            </button>
                          )}
                          {ord.status === "SHIPPED" && (
                            <button
                              disabled={loadingId === ord.id}
                              onClick={() => updateStatus(ord.id, "DELIVERED")}
                              className="px-2 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[10px] font-semibold uppercase tracking-wider rounded flex items-center gap-1"
                            >
                              <Check size={11} />
                              <span>Collected (COD)</span>
                            </button>
                          )}
                          {ord.status !== "CANCELLED" && ord.status !== "DELIVERED" && (
                            <button
                              disabled={loadingId === ord.id}
                              onClick={() => updateStatus(ord.id, "CANCELLED")}
                              className="p-1 text-[#666666] hover:text-rose-400"
                              title="Cancel order"
                            >
                              <XCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Order Detail */}
                    {isExpanded && (
                      <tr className="bg-[#151515] text-xs">
                        <td colSpan={7} className="p-4 border-b border-[#252525]">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1 text-[#aaaaaa]">
                              <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider block">
                                Shipping Address
                              </span>
                              <p className="text-white font-medium">{ord.contactName}</p>
                              <p>{ord.shippingAddress}</p>
                              <p>{ord.city}, {ord.postalCode}</p>
                              <p className="text-white">Phone: {ord.contactPhone}</p>
                            </div>

                            <div className="space-y-1 text-[#aaaaaa]">
                              <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider block">
                                Items ({ord.items?.length || 0})
                              </span>
                              {ord.items?.map((it: any) => (
                                <div key={it.id} className="flex justify-between py-1 border-b border-[#222222]">
                                  <span>
                                    {it.productName} ({it.size}/{it.color}) x {it.quantity}
                                  </span>
                                  <span className="text-white font-mono">
                                    {formatPrice(it.unitMillimes * it.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-1 text-[#aaaaaa]">
                              <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider block">
                                Audit Status History
                              </span>
                              {ord.statusHistory?.map((h: any) => (
                                <div key={h.id} className="text-[11px] py-0.5">
                                  <span className="text-white font-semibold uppercase">{h.status}</span>
                                  <span className="text-[#666666] ml-2">by {h.changedBy}</span>
                                  <p className="text-[10px] text-[#555555]">
                                    {new Date(h.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
