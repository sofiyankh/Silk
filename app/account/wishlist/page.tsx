"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Package, MapPin, Settings, LogOut, ShoppingBag, ArrowRight } from "@/components/icons";
import { formatPrice } from "@/lib/money";
import { useCart } from "@/lib/cart-context";

export default function WishlistPage() {
  const { addItem } = useCart();

  // Curated demo wishlist items
  const wishlistItems = [
    {
      id: "butterfly-hoodie",
      name: "Butterfly Cream Hoodie",
      priceMillimes: 89000,
      image: "/brand/products/butterfly-hoodie/front.jpg",
      color: "Cream",
      size: "M",
    },
    {
      id: "sakura-hoodie",
      name: "Sakura Blossom Heather Hoodie",
      priceMillimes: 89000,
      image: "/brand/products/sakura-hoodie/front.jpg",
      color: "Heather White",
      size: "L",
    },
  ];

  return (
    <div className="pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-silk-cream/40 border border-silk-border p-6 mb-8">
          <h1 className="text-lg font-bold uppercase tracking-wider text-silk-black">
            My Wishlist ({wishlistItems.length})
          </h1>
          <p className="text-xs text-silk-grey mt-0.5">
            Saved pieces from the Silk archive. Move to your shopping bag at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Menu */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-silk-border p-3 space-y-1 text-xs font-medium">
              <Link
                href="/account"
                className="flex items-center gap-3 px-3 py-2.5 text-silk-charcoal hover:bg-silk-cream/30 rounded transition"
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
                className="flex items-center gap-3 px-3 py-2.5 bg-silk-cream/60 text-silk-black font-semibold rounded"
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
                  href="/api/auth/logout"
                  className="flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded transition"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white border border-silk-border p-4 space-y-3 group">
                  <Link href={`/product/${item.id}`} className="block relative aspect-[3/4] w-full overflow-hidden bg-silk-cream/30">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </Link>

                  <div className="space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-silk-black line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-silk-grey">{item.color} • Size {item.size}</p>
                    <p className="text-xs font-semibold text-silk-black">{formatPrice(item.priceMillimes)}</p>
                  </div>

                  <button
                    onClick={() => {
                      addItem({
                        variantId: "demo-variant",
                        productId: item.id,
                        productSlug: item.id,
                        name: item.name,
                        priceMillimes: item.priceMillimes,
                        size: item.size,
                        color: item.color,
                        image: item.image,
                        quantity: 1,
                        maxStock: 20,
                      });
                    }}
                    className="w-full bg-silk-black text-white text-xs font-semibold uppercase tracking-wider py-2.5 flex items-center justify-center gap-2 hover:bg-silk-charcoal transition"
                  >
                    <ShoppingBag size={13} />
                    <span>Move To Bag</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
