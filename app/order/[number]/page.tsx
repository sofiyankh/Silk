import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, Package, Truck, Phone } from "@/components/icons";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";

export const revalidate = 0;

interface OrderConfirmationPageProps {
  params: {
    number: string;
  };
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { number } = params;

  const order = await db.order.findUnique({
    where: { number },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="pb-24 pt-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Header */}
        <div className="bg-silk-cream/40 border border-silk-border p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-silk-grey font-semibold">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-silk-black mt-1">
              Thank You For Your Order
            </h1>
            <p className="text-xs text-silk-grey mt-1">
              Order reference: <strong className="text-silk-black">{order.number}</strong>
            </p>
          </div>
          <p className="text-xs sm:text-sm text-silk-charcoal max-w-md mx-auto leading-relaxed">
            We have received your order. Our team will verify your phone number and dispatch your
            hoodie via express delivery within 24–48 hours.
          </p>
        </div>

        {/* COD Notice Box */}
        <div className="bg-white border-l-4 border-silk-black p-5 border border-silk-border space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-silk-black">
            <Truck size={16} />
            <span>Cash on Delivery Instructions</span>
          </div>
          <p className="text-xs text-silk-grey leading-relaxed">
            Please prepare the exact amount of{" "}
            <strong className="text-silk-black">{formatPrice(order.totalMillimes)}</strong> in cash.
            The delivery courier will contact you at{" "}
            <strong className="text-silk-black">{order.contactPhone}</strong> before arriving at your address.
          </p>
        </div>

        {/* Order Details & Summary */}
        <div className="bg-white border border-silk-border p-6 space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-silk-black border-b border-silk-border pb-3">
            Order Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-silk-grey uppercase tracking-wider text-[10px] block">
                Delivery Address
              </span>
              <p className="font-semibold text-silk-black">{order.contactName}</p>
              <p className="text-silk-grey">{order.shippingAddress}</p>
              <p className="text-silk-grey">{order.city}, {order.postalCode}</p>
              <p className="text-silk-grey">Tel: {order.contactPhone}</p>
            </div>

            <div className="space-y-1">
              <span className="text-silk-grey uppercase tracking-wider text-[10px] block">
                Payment Details
              </span>
              <p className="font-semibold text-silk-black">
                {order.paymentMethod === "COD" ? "Cash On Delivery (Espèces)" : order.paymentMethod}
              </p>
              <p className="text-silk-grey">Status: <span className="text-amber-700 font-semibold">{order.status}</span></p>
              <p className="text-silk-grey">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Itemized list */}
          <div className="pt-4 border-t border-silk-border space-y-3">
            <span className="text-silk-grey uppercase tracking-wider text-[10px] block">
              Purchased Items
            </span>
            <div className="divide-y divide-silk-border/60">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold uppercase text-silk-black">{item.productName}</span>
                    <span className="text-silk-grey ml-2">
                      ({item.color} / {item.size}) x {item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold text-silk-black">
                    {formatPrice(item.unitMillimes * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-silk-border space-y-2 text-xs">
            <div className="flex justify-between text-silk-grey">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotalMillimes)}</span>
            </div>
            {order.discountMillimes > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>-{formatPrice(order.discountMillimes)}</span>
              </div>
            )}
            <div className="flex justify-between text-silk-grey">
              <span>Shipping</span>
              <span>{order.shippingMillimes === 0 ? "FREE" : formatPrice(order.shippingMillimes)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-silk-black pt-2 border-t border-silk-border">
              <span>Total Amount</span>
              <span>{formatPrice(order.totalMillimes)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/shop"
            className="flex-1 bg-silk-black text-white text-xs font-semibold uppercase tracking-widest py-3.5 px-6 text-center hover:bg-silk-charcoal transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="flex-1 bg-white border border-silk-border text-silk-black text-xs font-semibold uppercase tracking-widest py-3.5 px-6 text-center hover:bg-silk-cream transition"
          >
            View My Account
          </Link>
        </div>
      </div>
    </div>
  );
}
