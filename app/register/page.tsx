"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Sparkles } from "@/components/icons";

/**
 * =============================================================================
 * CUSTOMER ACCOUNTS ISOLATED (Guest Checkout / CSV Command Order Model)
 * Customer orders are processed directly as guest commands and appended to
 * data/orders.csv (Google Sheets compatible). No accounts are needed or stored.
 * =============================================================================
 */

export default function RegisterPage() {
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
            <Sparkles size={12} />
            <span>Direct Guest Checkout Active</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-silk-black">
            No Account Needed
          </h1>
          <p className="text-xs text-silk-grey leading-relaxed max-w-sm mx-auto">
            At Silk, customer orders are processed with frictionless direct checkout. 
            Your delivery and contact information are registered automatically with your order.
          </p>
        </div>

        <div className="p-6 bg-white border border-silk-border rounded space-y-4 shadow-sm text-xs text-left">
          <h3 className="font-semibold uppercase tracking-wider text-silk-black text-[11px]">
            How Silk Orders Work:
          </h3>
          <ul className="space-y-2 text-silk-grey text-xs">
            <li className="flex items-start gap-2">
              <span className="text-silk-black font-bold">1.</span>
              <span>Select your streetwear pieces and size directly.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-silk-black font-bold">2.</span>
              <span>Enter your phone & delivery address at checkout.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-silk-black font-bold">3.</span>
              <span>Cash on Delivery (COD) across all Tunisian governorates.</span>
            </li>
          </ul>

          <Link
            href="/shop"
            className="w-full bg-silk-black text-white text-xs font-semibold uppercase tracking-widest py-3.5 px-6 flex items-center justify-center gap-2 hover:bg-silk-charcoal transition shadow-md mt-4"
          >
            <ShoppingBag size={14} />
            <span>Explore Collections & Shop</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
 * PREVIOUS REGISTRATION FORM CODE (ISOLATED & PRESERVED BELOW)
 * =============================================================================
 *
 * export function LegacyRegisterForm() {
 *   const router = useRouter();
 *   const [form, setForm] = useState({
 *     name: "", email: "", phone: "", password: "", address: "", city: "Tunis", governorate: "Tunis"
 *   });
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *     await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(form) });
 *   };
 *   return <form>...</form>;
 * }
 * =============================================================================
 */
