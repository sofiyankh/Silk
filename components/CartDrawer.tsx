"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "@/components/icons";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/money";
import { getOptimizedSrc } from "@/lib/image-variants";
import gsap from "gsap";

export function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeItem,
    subtotalMillimes,
    itemCount,
  } = useCart();

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCartDrawerOpen) {
      if (backdropRef.current && panelRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" }
        );
        gsap.fromTo(
          panelRef.current,
          { x: "100%" },
          { x: "0%", duration: 0.45, ease: "power3.out" }
        );
      }
    }
  }, [isCartDrawerOpen]);

  const handleClose = () => {
    if (backdropRef.current && panelRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
      gsap.to(panelRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => setIsCartDrawerOpen(false),
      });
    } else {
      setIsCartDrawerOpen(false);
    }
  };

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div
          ref={panelRef}
          className="w-screen max-w-md bg-silk-bg border-l border-silk-border shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-silk-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} />
              <h2 className="text-sm font-semibold tracking-widest uppercase">
                Your Bag ({itemCount})
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="tactile-button text-silk-grey hover:text-silk-black p-1 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <p className="text-silk-grey text-sm">Your shopping bag is empty.</p>
                <Link
                  href="/shop"
                  onClick={handleClose}
                  className="inline-block text-xs uppercase font-medium tracking-widest border-b border-silk-black pb-1 hover:opacity-70"
                >
                  Discover Collections
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-silk-border/60">
                  <div className="relative w-20 h-24 bg-silk-cream/40 flex-shrink-0 border border-silk-border/50">
                    <Image
                      src={getOptimizedSrc(item.image, 480)}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-silk-black line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-silk-grey hover:text-silk-black text-xs ml-2 tactile-button"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-[11px] text-silk-grey mt-0.5">
                        {item.color} • Size {item.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-silk-border bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 text-xs hover:bg-silk-cream/40 transition tactile-button"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-medium min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 text-xs hover:bg-silk-cream/40 transition tactile-button"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-xs font-semibold text-silk-black font-mono">
                        {formatPrice(item.priceMillimes * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-silk-border bg-white space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-silk-grey uppercase tracking-wider text-xs">Subtotal</span>
                <span className="font-semibold text-base text-silk-black font-mono">
                  {formatPrice(subtotalMillimes)}
                </span>
              </div>
              <p className="text-[11px] text-silk-grey">
                Taxes included. Cash on Delivery (COD) calculated at checkout.
              </p>
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={handleClose}
                  className="tactile-button w-full bg-silk-black text-white text-xs font-medium uppercase tracking-widest py-3.5 px-4 flex items-center justify-center gap-2 hover:bg-silk-charcoal transition"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/cart"
                  onClick={handleClose}
                  className="w-full block text-center text-xs text-silk-charcoal uppercase tracking-widest py-2 hover:underline"
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
