import React from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Package, MapPin, Heart, Settings, LogOut, ArrowUpRight } from "@/components/icons";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";

export const revalidate = 0;

interface AccountPageProps {
  searchParams: {
    status?: string;
  };
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const { status } = searchParams;

  // Find demo customer
  const user = await db.user.findFirst({
    where: { role: "CUSTOMER" },
    include: {
      addresses: true,
      orders: {
        include: { items: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const allOrders = user?.orders || [];
  const filteredOrders = status && status !== "all"
    ? allOrders.filter((o) => o.status.toLowerCase() === status.toLowerCase())
    : allOrders;

  // Status badge styling
  const getStatusBadge = (st: string) => {
    switch (st.toUpperCase()) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PROCESSING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const recentProducts = await db.product.findMany({
    where: { isPublished: true },
    include: { images: true },
    take: 5,
  });

  return (
    <div className="pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <div className="bg-silk-cream/40 border border-silk-border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-silk-black text-white flex items-center justify-center font-bold text-lg">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "SK"}
            </div>
            <div>
              <h1 className="text-lg font-bold uppercase tracking-wider text-silk-black">
                {user?.name || "Sofiene Kh"}
              </h1>
              <p className="text-xs text-silk-grey">{user?.email || "sofiene@example.com"}</p>
              <p className="text-[11px] text-silk-grey mt-0.5">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider px-3 py-1 bg-white border border-silk-border text-silk-charcoal font-medium">
              Verified Customer
            </span>
          </div>
        </div>

        {/* Layout: Sidebar Menu + Orders Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar Menu */}
          <div className="lg:col-span-3 space-y-1">
            <div className="bg-white border border-silk-border p-3 space-y-1 text-xs font-medium">
              <Link
                href="/account"
                className="flex items-center gap-3 px-3 py-2.5 bg-silk-cream/60 text-silk-black font-semibold rounded"
              >
                <Package size={15} />
                <span>My Orders</span>
              </Link>
              <Link
                href="/account/addresses"
                className="flex items-center gap-3 px-3 py-2.5 text-silk-charcoal hover:bg-silk-cream/30 rounded transition"
              >
                <MapPin size={15} />
                <span>Addresses</span>
              </Link>
              <Link
                href="/account/wishlist"
                className="flex items-center gap-3 px-3 py-2.5 text-silk-charcoal hover:bg-silk-cream/30 rounded transition"
              >
                <Heart size={15} />
                <span>Wishlist</span>
              </Link>
              <Link
                href="/account/settings"
                className="flex items-center gap-3 px-3 py-2.5 text-silk-charcoal hover:bg-silk-cream/30 rounded transition"
              >
                <Settings size={15} />
                <span>Settings</span>
              </Link>
              <div className="pt-2 border-t border-silk-border">
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded transition"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Main Content: Orders */}
          <div className="lg:col-span-9 space-y-8">
            <div className="bg-white border border-silk-border p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-silk-border gap-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-silk-black">
                  Order History ({filteredOrders.length})
                </h2>

                {/* Filter Tabs matching moodboard */}
                <div className="flex items-center gap-2 overflow-x-auto text-xs">
                  {["all", "processing", "shipped", "delivered", "cancelled"].map((st) => (
                    <Link
                      key={st}
                      href={st === "all" ? "/account" : `/account?status=${st}`}
                      className={`px-3 py-1 uppercase text-[11px] font-semibold tracking-wider rounded transition ${
                        (st === "all" && !status) || status === st
                          ? "bg-silk-black text-white"
                          : "text-silk-grey hover:text-black"
                      }`}
                    >
                      {st}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-silk-border text-[11px] uppercase tracking-wider text-silk-grey">
                      <th className="pb-3 font-semibold">Order #</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Items</th>
                      <th className="pb-3 font-semibold">Total</th>
                      <th className="pb-3 font-semibold text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-silk-border/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-silk-grey">
                          No orders found in this category.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-silk-cream/20 transition-colors">
                          <td className="py-4 font-bold text-silk-black">
                            <Link href={`/order/${ord.number}`} className="hover:underline">
                              {ord.number}
                            </Link>
                          </td>
                          <td className="py-4 text-silk-grey">
                            {new Date(ord.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-4">
                            <span
                              className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border rounded ${getStatusBadge(
                                ord.status
                              )}`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-4 text-silk-grey">
                            {ord.items.map((it) => it.productName).join(", ") || `${ord.items.length} items`}
                          </td>
                          <td className="py-4 font-bold text-silk-black">
                            {formatPrice(ord.totalMillimes)}
                          </td>
                          <td className="py-4 text-right">
                            <Link
                              href={`/order/${ord.number}`}
                              className="inline-flex items-center gap-1 font-semibold text-silk-charcoal hover:text-black uppercase text-[11px] hover:underline"
                            >
                              <span>View</span>
                              <ArrowUpRight size={13} />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recently Viewed Strip matching moodboard */}
            <div className="bg-white border border-silk-border p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-silk-black">
                Recently Viewed
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {recentProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="group border border-silk-border/60 bg-silk-cream/20 p-2 space-y-2 hover:border-black transition"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-white">
                      <Image
                        src={p.images[0]?.url || "/brand/products/butterfly-hoodie/front.jpg"}
                        alt={p.nameEn}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <div className="text-[11px]">
                      <h4 className="font-semibold text-silk-black line-clamp-1">{p.nameEn}</h4>
                      <p className="text-silk-grey">{formatPrice(p.basePriceMillimes)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
