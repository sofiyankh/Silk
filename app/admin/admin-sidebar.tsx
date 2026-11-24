"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "@/components/icons";

interface AdminSidebarProps {
  adminEmail?: string;
}

export function AdminSidebar({ adminEmail = "admin@silk.com" }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Discounts", href: "/admin/discounts", icon: Tag },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    window.location.href = "/admin/login";
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-[#181818] border-b border-[#2a2a2a] px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="relative h-6 w-20">
            <Image
              src="/brand/logo/silk-logo-white.png"
              alt="Silk Admin"
              fill
              className="object-contain object-left"
            />
          </div>
          <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-white/90">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-[#aaaaaa] hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#181818] border-r border-[#2a2a2a] flex flex-col justify-between p-6 z-40 transition-transform duration-200 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-8">
          {/* Logo & Portal Badge */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative h-8 w-24">
                <Image
                  src="/brand/logo/silk-logo-white.png"
                  alt="Silk Admin"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-white/90">
                Admin
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-medium">
            {navItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded transition ${
                    active
                      ? "bg-[#252525] text-white font-semibold border-l-2 border-white shadow-sm"
                      : "text-[#999999] hover:text-white hover:bg-[#202020]"
                  }`}
                >
                  <Icon size={16} className={active ? "text-white" : "text-[#777777]"} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer */}
        <div className="pt-6 border-t border-[#2a2a2a] space-y-3 text-xs">
          <div className="px-3 py-1">
            <span className="text-[10px] text-[#666666] uppercase tracking-wider block">Logged in as</span>
            <span className="text-[11px] text-[#cccccc] font-mono truncate block">{adminEmail}</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded text-[#888888] hover:text-white hover:bg-[#222222] transition"
          >
            <span>View Storefront</span>
            <ExternalLink size={13} />
          </Link>

          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition cursor-pointer"
          >
            <LogOut size={14} />
            <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
