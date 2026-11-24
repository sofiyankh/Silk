"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/lib/cart-context";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";

const CartDrawer = dynamic(
  () => import("@/components/CartDrawer").then((m) => m.CartDrawer),
  { ssr: false }
);

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // For Admin views: render pure admin shell with NO storefront navbar, announcement bar, or footer!
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#121212] text-[#f0f0f0] antialiased">
        {children}
      </div>
    );
  }

  // For Customer Storefront: render standard e-commerce shell
  return (
    <SmoothScroll>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-silk-bg text-silk-black antialiased">
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </SmoothScroll>
  );
}
