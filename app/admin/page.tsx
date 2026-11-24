import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  Plus,
  ArrowUpRight,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Tag,
} from "@/components/icons";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { DashboardSearch } from "./dashboard-search";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [products, dbOrders] = await Promise.all([
    db.product.findMany({
      include: {
        category: true,
        variants: true,
      },
    }),
    db.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const allOrdersList = dbOrders.map((o) => ({
    id: o.id,
    number: o.number,
    createdAt: o.createdAt,
    customerName: o.contactName,
    customerPhone: o.contactPhone,
    city: o.city || "Tunis",
    totalMillimes: o.totalMillimes,
    status: o.status,
    itemsCount: o.items.reduce((s, it) => s + it.quantity, 0),
  }));

  // Metrics
  const totalOrdersCount = allOrdersList.length;
  const totalRevenueMillimes = allOrdersList.reduce((sum, o) => sum + (o.totalMillimes || 0), 0);
  const uniqueClientsCount = new Set(
    allOrdersList.map((o) => (o.customerPhone || o.customerName || "").trim().toLowerCase()).filter(Boolean)
  ).size;
  const totalProductsCount = products.length;

  // Status breakdown
  const pendingCount = allOrdersList.filter((o) => o.status === "PENDING").length;
  const confirmedCount = allOrdersList.filter((o) => o.status === "CONFIRMED").length;
  const shippedCount = allOrdersList.filter((o) => o.status === "SHIPPED").length;
  const deliveredCount = allOrdersList.filter((o) => o.status === "DELIVERED").length;

  // Check low stock variants (stock <= 5)
  const lowStockVariants: { product: string; variant: string; stock: number }[] = [];
  products.forEach((p) => {
    p.variants.forEach((v) => {
      if (v.stock <= 5) {
        lowStockVariants.push({
          product: p.nameEn,
          variant: `${v.color} / ${v.size}`,
          stock: v.stock,
        });
      }
    });
  });

  // Calculate monthly distribution for chart
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyRevenue = new Array(12).fill(0);

  allOrdersList.forEach((ord) => {
    const d = new Date(ord.createdAt);
    if (!isNaN(d.getTime())) {
      const m = d.getMonth();
      monthlyRevenue[m] += (ord.totalMillimes || 0) / 1000;
    }
  });

  const maxMonthRev = Math.max(...monthlyRevenue, 100);
  const chartPoints = monthlyRevenue
    .map((val, idx) => {
      const x = Math.round((idx / 11) * 480) + 10;
      const y = Math.round(130 - (val / maxMonthRev) * 100);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPolygon = `10,135 ${chartPoints} 490,135`;

  const getStatusBadge = (st: string) => {
    switch ((st || "").toUpperCase()) {
      case "DELIVERED":
        return "bg-emerald-950/80 text-emerald-400 border border-emerald-800";
      case "SHIPPED":
        return "bg-sky-950/80 text-sky-400 border border-sky-800";
      case "PROCESSING":
        return "bg-amber-950/80 text-amber-400 border border-amber-800";
      case "CONFIRMED":
        return "bg-indigo-950/80 text-indigo-400 border border-indigo-800";
      case "CANCELLED":
        return "bg-rose-950/80 text-rose-400 border border-rose-800";
      default:
        return "bg-amber-950/60 text-amber-300 border border-amber-700/60";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">
            Admin Command Center
          </h1>
          <p className="text-xs text-[#888888] mt-0.5">
            Real-time catalog telemetry, orders fulfillment and customer analytics
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <DashboardSearch />
          <Link
            href="/admin/products"
            className="flex items-center justify-center gap-2 px-3.5 py-2 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#e0e0e0] transition"
          >
            <Plus size={14} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-[#181818] border border-[#272727] p-5 rounded space-y-2">
          <div className="flex justify-between items-center text-xs text-[#888888]">
            <span className="uppercase tracking-wider">Total Revenue</span>
            <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-0.5">
              Live <TrendingUp size={12} />
            </span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {formatPrice(totalRevenueMillimes)}
          </p>
          <span className="text-[10px] text-[#666666] block">
            {totalOrdersCount} client orders completed & pending
          </span>
        </div>

        {/* Total Orders */}
        <div className="bg-[#181818] border border-[#272727] p-5 rounded space-y-2">
          <div className="flex justify-between items-center text-xs text-[#888888]">
            <span className="uppercase tracking-wider">Command Orders</span>
            <span className="text-sky-400 text-[11px] font-semibold flex items-center gap-0.5">
              <ShoppingBag size={12} /> {pendingCount} Pending
            </span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {totalOrdersCount}
          </p>
          <div className="flex gap-2 text-[10px] text-[#888888]">
            <span className="text-indigo-400">{confirmedCount} Confirmed</span>
            <span>•</span>
            <span className="text-emerald-400">{deliveredCount} Delivered</span>
          </div>
        </div>

        {/* Total Clients */}
        <div className="bg-[#181818] border border-[#272727] p-5 rounded space-y-2">
          <div className="flex justify-between items-center text-xs text-[#888888]">
            <span className="uppercase tracking-wider">Total Clients</span>
            <span className="text-purple-400 text-[11px] font-semibold flex items-center gap-0.5">
              <Users size={12} />
            </span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {uniqueClientsCount}
          </p>
          <span className="text-[10px] text-[#666666] block">Unique client phone contacts</span>
        </div>

        {/* Catalog Products */}
        <div className="bg-[#181818] border border-[#272727] p-5 rounded space-y-2">
          <div className="flex justify-between items-center text-xs text-[#888888]">
            <span className="uppercase tracking-wider">Catalog Products</span>
            <span className="text-amber-400 text-[11px] font-semibold flex items-center gap-0.5">
              <Package size={12} />
            </span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">
            {totalProductsCount}
          </p>
          <span className="text-[10px] text-[#666666] block">
            {lowStockVariants.length > 0 ? (
              <span className="text-amber-400">{lowStockVariants.length} low-stock alerts</span>
            ) : (
              "All inventory in stock"
            )}
          </span>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/admin/orders"
          className="p-3.5 bg-[#181818] hover:bg-[#202020] border border-[#272727] rounded flex items-center justify-between text-xs transition"
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={16} className="text-indigo-400" />
            <span className="font-semibold text-white">Manage Orders</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#282828] text-[#888888] font-mono">
            {totalOrdersCount}
          </span>
        </Link>

        <a
          href="/api/admin/orders/export-csv"
          download
          className="p-3.5 bg-[#181818] hover:bg-[#202020] border border-[#272727] rounded flex items-center justify-between text-xs transition"
        >
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="font-semibold text-white">Export to Sheets</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold">CSV</span>
        </a>

        <Link
          href="/admin/discounts"
          className="p-3.5 bg-[#181818] hover:bg-[#202020] border border-[#272727] rounded flex items-center justify-between text-xs transition"
        >
          <div className="flex items-center gap-2.5">
            <Tag size={16} className="text-amber-400" />
            <span className="font-semibold text-white">Discounts</span>
          </div>
          <ArrowUpRight size={13} className="text-[#666666]" />
        </Link>

        <Link
          href="/admin/settings"
          className="p-3.5 bg-[#181818] hover:bg-[#202020] border border-[#272727] rounded flex items-center justify-between text-xs transition"
        >
          <div className="flex items-center gap-2.5">
            <Truck size={16} className="text-sky-400" />
            <span className="font-semibold text-white">Logistics & COD</span>
          </div>
          <ArrowUpRight size={13} className="text-[#666666]" />
        </Link>
      </div>

      {/* Grid: Revenue Overview Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dynamic Revenue Curve */}
        <div className="lg:col-span-7 bg-[#181818] border border-[#272727] p-6 rounded space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                Revenue Trajectory
              </h3>
              <p className="text-[11px] text-[#888888]">Monthly distribution from client orders</p>
            </div>
            <span className="text-xs font-bold text-white font-mono">
              Peak: {formatPrice(Math.round(maxMonthRev * 1000))}
            </span>
          </div>

          <div className="h-52 w-full flex items-end pt-4">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="10" y1="30" x2="490" y2="30" stroke="#252525" strokeDasharray="3 3" />
              <line x1="10" y1="75" x2="490" y2="75" stroke="#252525" strokeDasharray="3 3" />
              <line x1="10" y1="120" x2="490" y2="120" stroke="#252525" strokeDasharray="3 3" />

              <polygon points={areaPolygon} fill="url(#chartGrad)" />
              <polyline fill="none" stroke="#ffffff" strokeWidth="2.5" points={chartPoints} />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-[#666666] uppercase tracking-wider pt-2 border-t border-[#252525]">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Recent Orders table */}
        <div className="lg:col-span-5 bg-[#181818] border border-[#272727] p-6 rounded space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">
              Recent Command Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-[11px] text-[#888888] hover:text-white uppercase tracking-wider underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#272727] text-[10px] uppercase tracking-wider text-[#666666]">
                  <th className="pb-2">Order #</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Total</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]">
                {allOrdersList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[#666666]">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  allOrdersList.slice(0, 7).map((ord) => (
                    <tr key={ord.number} className="hover:bg-[#202020] transition">
                      <td className="py-2.5 font-mono text-white text-[11px]">
                        <Link href="/admin/orders" className="hover:underline">
                          {ord.number}
                        </Link>
                      </td>
                      <td className="py-2.5 text-[#aaaaaa]">
                        <span className="text-white block font-medium truncate max-w-[120px]">
                          {ord.customerName}
                        </span>
                        <span className="text-[10px] text-[#666666]">{ord.city}</span>
                      </td>
                      <td className="py-2.5 text-white font-semibold font-mono">
                        {formatPrice(ord.totalMillimes)}
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${getStatusBadge(
                            ord.status
                          )}`}
                        >
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
