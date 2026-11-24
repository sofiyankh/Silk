"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, ShieldCheck } from "@/components/icons";

/**
 * =============================================================================
 * CUSTOMER LOGIN ISOLATED (Direct CSV Order Model - No Customer DB Accounts)
 * Database stores catalog/products only. Orders are recorded to data/orders.csv.
 * Customer authentication is not required for shopping or ordering.
 * =============================================================================
 */

export default function LoginPage() {
  return (
    <div className="pb-24 pt-16">
      <div className="max-w-md mx-auto px-4 space-y-8 text-center">
        <div className="relative h-10 w-28 mx-auto">
          <Image
            src="/brand/logo/silk-logo-black.png"
            alt="Silk Logo"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-silk-cream border border-silk-border rounded-full text-[10px] uppercase font-bold tracking-widest text-silk-black">
            <ShieldCheck size={12} />
            <span>Frictionless Guest Checkout</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-silk-black">
            Guest Orders Only
          </h1>
          <p className="text-xs text-silk-grey leading-relaxed max-w-sm mx-auto">
            Silk does not require customer accounts or passwords. Simply add items to your cart
            and proceed directly to checkout. Your orders are confirmed via SMS/WhatsApp.
          </p>
        </div>

        <div className="p-6 bg-white border border-silk-border rounded space-y-4 shadow-sm text-xs text-left">
          <Link
            href="/shop"
            className="w-full bg-silk-black text-white text-xs font-semibold uppercase tracking-widest py-3.5 px-6 flex items-center justify-center gap-2 hover:bg-silk-charcoal transition shadow-md"
          >
            <ShoppingBag size={14} />
            <span>Go to Shop / Catalog</span>
            <ArrowRight size={14} />
          </Link>

          <p className="text-[11px] text-center text-silk-grey pt-2">
            Need help with a previous order? Contact us on{" "}
            <Link href="/contact" className="text-silk-black font-semibold underline">
              Customer Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
 * PREVIOUS CUSTOMER LOGIN CODE (ISOLATED & PRESERVED)
 * =============================================================================
 *
 * export function LegacyLoginForm() {
 *   const [email, setEmail] = useState("sofiene@example.com");
 *   const [password, setPassword] = useState("Customer123!");
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *     const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
 *   };
 *   return <form>...</form>;
 * }
 * =============================================================================
 */
