"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus, X, ArrowRight, ShoppingBag, Tag } from "@/components/icons";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/money";

export default function CartPage() {
  const {
    items,
    itemCount,
    updateQuantity,
    removeItem,
    clearCart,
    subtotalMillimes,
    discountMillimes,
    discountCode,
    applyDiscount,
    removeDiscount,
    shippingMillimes,
    totalMillimes,
  } = useCart();

  const [inputCode, setInputCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = await applyDiscount(inputCode);
    if (res.success) {
      setPromoMessage({ type: "success", text: res.message });
      setInputCode("");
    } else {
      setPromoMessage({ type: "error", text: res.message });
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-silk-cream/60 flex items-center justify-center mx-auto text-silk-grey">
          <ShoppingBag size={28} />
        </div>
        <h1 className="text-2xl font-bold uppercase tracking-tight text-silk-black">
          Your Cart is Empty
        </h1>
        <p className="text-sm text-silk-grey max-w-sm mx-auto">
          You have no items in your shopping bag. Explore our collection of premium botanical streetwear.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-silk-black text-white text-xs uppercase font-semibold tracking-widest px-8 py-3.5 hover:bg-silk-charcoal transition"
        >
          Discover Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-silk-border">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-silk-black">
            Your Cart ({itemCount})
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-silk-grey hover:text-black underline uppercase tracking-wider"
          >
            Clear Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
          {/* Left Column: Cart items */}
          <div className="lg:col-span-8 divide-y divide-silk-border">
            {items.map((item) => (
              <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center">
                <Link
                  href={`/product/${item.productSlug}`}
                  className="relative w-24 h-32 sm:w-28 sm:h-36 bg-silk-cream/40 flex-shrink-0 border border-silk-border/60 overflow-hidden"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <Link href={`/product/${item.productSlug}`}>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-silk-black hover:text-silk-grey">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-silk-grey">
                      Color: {item.color} | Size: {item.size}
                    </p>
                    <p className="text-xs font-semibold text-silk-black pt-1">
                      {formatPrice(item.priceMillimes)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Stepper */}
                    <div className="flex items-center border border-silk-border bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2.5 sm:p-2 text-silk-grey hover:text-black text-xs"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-3 text-xs font-semibold min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2.5 sm:p-2 text-silk-grey hover:text-black text-xs"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Total for item */}
                    <span className="text-sm font-bold text-silk-black min-w-[64px] sm:min-w-[80px] text-right">
                      {formatPrice(item.priceMillimes * item.quantity)}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-silk-grey hover:text-red-600 p-2 sm:p-1"
                      aria-label="Remove item"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-silk-cream/40 border border-silk-border p-6 space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-silk-black border-b border-silk-border pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-silk-grey">
                  <span>Subtotal</span>
                  <span className="font-semibold text-silk-black">
                    {formatPrice(subtotalMillimes)}
                  </span>
                </div>

                {discountMillimes > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      <span>Discount ({discountCode})</span>
                    </span>
                    <span className="font-semibold">-{formatPrice(discountMillimes)}</span>
                  </div>
                )}

                <div className="flex justify-between text-silk-grey">
                  <span>Shipping (Tunisia)</span>
                  <span className="font-semibold text-silk-black">
                    {shippingMillimes === 0 ? "FREE" : formatPrice(shippingMillimes)}
                  </span>
                </div>

                <div className="pt-3 border-t border-silk-border flex justify-between text-sm font-bold text-silk-black">
                  <span>Total</span>
                  <span>{formatPrice(totalMillimes)}</span>
                </div>
              </div>

              {/* Promo code input */}
              <div className="pt-2 border-t border-silk-border">
                {discountCode ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 p-2.5 text-xs text-green-800">
                    <span>Coupon <strong>{discountCode}</strong> applied</span>
                    <button
                      onClick={removeDiscount}
                      className="text-red-500 hover:underline uppercase text-[10px] font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-silk-grey block">
                      Have a promotional code?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        placeholder="e.g. SILK10"
                        className="flex-1 bg-white border border-silk-border text-xs px-3 py-2 uppercase focus:outline-none focus:border-silk-black"
                      />
                      <button
                        type="submit"
                        className="bg-silk-black text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 hover:bg-silk-charcoal transition"
                      >
                        Apply
                      </button>
                    </div>
                    {promoMessage && (
                      <p
                        className={`text-[11px] ${
                          promoMessage.type === "success" ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {promoMessage.text}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <Link
                  href="/checkout"
                  className="w-full bg-silk-black text-white text-xs font-bold uppercase tracking-[0.2em] py-4 px-6 flex items-center justify-center gap-2 hover:bg-silk-charcoal transition shadow-md"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href="/shop"
                  className="block text-center text-xs text-silk-grey hover:text-black uppercase tracking-wider underline pt-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
