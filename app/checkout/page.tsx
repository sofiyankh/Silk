"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldCheck, Truck, CreditCard, ArrowRight, CheckCircle2 } from "@/components/icons";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/money";
import { getOptimizedSrc } from "@/lib/image-variants";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    clearCart,
    subtotalMillimes,
    discountMillimes,
    discountCode,
    shippingMillimes,
    totalMillimes,
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    governorate: "Tunis",
    postalCode: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD" | "PAYPAL">("COD");

  const governorates = [
    "Tunis",
    "Ariana",
    "Ben Arous",
    "Manouba",
    "Nabeul",
    "Sousse",
    "Monastir",
    "Mahdia",
    "Sfax",
    "Bizerte",
    "Béja",
    "Jendouba",
    "Le Kef",
    "Siliana",
    "Kairouan",
    "Kasserine",
    "Sidi Bouzid",
    "Gabès",
    "Médenine",
    "Tataouine",
    "Gafsa",
    "Tozeur",
    "Kébili",
    "Zaghouan",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || loading) return;

    if (!items.length) {
      setError("Your cart is empty");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      setError("Please fill in all mandatory shipping fields");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingInfo: formData,
          paymentMethod,
          discountCode,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 503) {
          throw new Error("Our checkout is experiencing high traffic right now. Your cart is safe — please try again in a moment.");
        }
        throw new Error(data.error || "Failed to process order. Your cart has been preserved.");
      }

      clearCart();
      router.push(`/order/${data.order.number}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Your cart has been preserved — please try again.");
      isSubmittingRef.current = false;
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-silk-black">
          No items to checkout
        </h1>
        <p className="text-sm text-silk-grey">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-silk-black text-white text-xs uppercase font-semibold tracking-widest px-8 py-3.5"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-silk-border mb-8">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-silk-black">
            Checkout
          </h1>
          <p className="text-xs text-silk-grey mt-1">Complete your order with secure delivery</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Shipping & Payment forms */}
          <div className="lg:col-span-7 space-y-10">
            {/* 1. Shipping Information */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-silk-black flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-silk-black text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Shipping Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-silk-border text-xs px-3.5 py-2.5 text-silk-black focus:outline-none focus:border-silk-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-silk-border text-xs px-3.5 py-2.5 text-silk-black focus:outline-none focus:border-silk-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey font-medium">
                    Phone Number (Tunisia) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+216 00 000 000"
                    className="w-full bg-white border border-silk-border text-xs px-3.5 py-2.5 text-silk-black focus:outline-none focus:border-silk-black"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey font-medium">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Appartement, rue, quartier..."
                    className="w-full bg-white border border-silk-border text-xs px-3.5 py-2.5 text-silk-black focus:outline-none focus:border-silk-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey font-medium">
                    City / Delegation *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-silk-border text-xs px-3.5 py-2.5 text-silk-black focus:outline-none focus:border-silk-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey font-medium">
                    Governorate (Gouvernorat) *
                  </label>
                  <select
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-silk-border text-xs px-3 py-2.5 text-silk-black focus:outline-none focus:border-silk-black"
                  >
                    {governorates.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-silk-grey font-medium">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-silk-border text-xs px-3.5 py-2.5 text-silk-black focus:outline-none focus:border-silk-black"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <p className="text-[11px] text-silk-grey flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    Direct guest checkout &mdash; our team will call your phone number to confirm before dispatch.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Payment Method: Cash on Delivery Only */}
            <div className="space-y-4 pt-6 border-t border-silk-border">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-silk-black flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-silk-black text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Payment Method</span>
              </h2>

              <div className="pt-2">
                {/* Cash On Delivery (COD) - Sole payment method */}
                <div className="flex items-start gap-4 p-5 border border-silk-black bg-white ring-1 ring-silk-black">
                  <div className="mt-1 size-4 rounded-full border-2 border-silk-black flex items-center justify-center bg-silk-black">
                    <span className="size-1.5 rounded-full bg-white" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-silk-black">
                        Cash on Delivery • Paiement à la livraison (COD)
                      </span>
                      <span className="text-[10px] uppercase font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded self-start sm:self-auto">
                        Available Nationwide
                      </span>
                    </div>
                    <p className="text-xs text-silk-grey leading-relaxed">
                      Pay in cash directly to the courier when your package arrives at your doorstep anywhere in Tunisia (Monastir, Tunis, Sousse, Sfax, etc.). No online payment or credit card required.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order CTA */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-silk-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 px-6 flex items-center justify-center gap-2 hover:bg-silk-charcoal transition shadow-lg disabled:opacity-50"
              >
                <span>{loading ? "Processing Order..." : "Place Order"}</span>
                <ArrowRight size={14} />
              </button>
              <p className="text-center text-[11px] text-silk-grey mt-2">
                By placing your order, you agree to Silk terms of service & COD policy.
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-silk-cream/40 border border-silk-border p-6 space-y-6 sticky top-28">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-silk-black border-b border-silk-border pb-3">
                Order Summary ({items.length})
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto divide-y divide-silk-border/60">
                {items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                    <div className="relative w-16 h-20 bg-white border border-silk-border flex-shrink-0">
                      <Image
                        src={getOptimizedSrc(item.image, 480)}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-silk-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-silk-black line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-silk-grey">
                        {item.color} • Size {item.size}
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-silk-black">
                      {formatPrice(item.priceMillimes * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation breakdown */}
              <div className="space-y-2.5 text-xs pt-4 border-t border-silk-border">
                <div className="flex justify-between text-silk-grey">
                  <span>Subtotal</span>
                  <span className="font-semibold text-silk-black">
                    {formatPrice(subtotalMillimes)}
                  </span>
                </div>

                {discountMillimes > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount ({discountCode})</span>
                    <span className="font-semibold">-{formatPrice(discountMillimes)}</span>
                  </div>
                )}

                <div className="flex justify-between text-silk-grey">
                  <span>Delivery (Tunisia)</span>
                  <span className="font-semibold text-silk-black">
                    {shippingMillimes === 0 ? "FREE" : formatPrice(shippingMillimes)}
                  </span>
                </div>

                <div className="pt-3 border-t border-silk-border flex justify-between text-sm font-bold text-silk-black">
                  <span>Total Amount Due</span>
                  <span>{formatPrice(totalMillimes)}</span>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 bg-white border border-silk-border/80 text-[11px] text-silk-grey space-y-1">
                <div className="font-semibold text-silk-black flex items-center gap-1.5">
                  <Truck size={13} />
                  <span>Express Courier Delivery</span>
                </div>
                <p>Delivery in 24–48 hours. Our delivery agent will contact your phone before arriving.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
