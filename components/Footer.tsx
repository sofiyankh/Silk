import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-silk-bg border-t border-silk-border pt-16 pb-12 text-silk-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-silk-border/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4 pr-6">
            <div className="relative h-16 w-52 sm:h-20 sm:w-64 max-w-full">
              <Image
                src="/brand/logo/silk-logo-black-480w.webp"
                alt="Silk Logo"
                fill
                loading="lazy"
                decoding="async"
                sizes="(max-width: 640px) 208px, 256px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-sm text-silk-grey leading-relaxed max-w-sm">
              Artistic streetwear brand blending heavyweight minimalist silhouettes with intricate botanical
              illustrations and delicate Japanese cherry blossom artistry.
            </p>
            <div className="pt-2 space-y-1 text-xs text-silk-grey tracking-wider uppercase">
              <div className="font-semibold text-silk-black">Monastir, Tunisia</div>
              <div>
                Tel / WhatsApp:{" "}
                <a
                  href="tel:+21658826329"
                  className="font-mono text-silk-black hover:underline"
                >
                  +216 58826329
                </a>
              </div>
            </div>
          </div>

          {/* Shopping */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-silk-black">Shopping</h4>
            <ul className="space-y-2 text-sm text-silk-grey">
              <li>
                <Link href="/shop" className="hover:text-silk-black transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=hoodies" className="hover:text-silk-black transition-colors">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-silk-black transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=new" className="hover:text-silk-black transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-silk-black">Customer Service</h4>
            <ul className="space-y-2 text-sm text-silk-grey">
              <li>
                <Link href="/contact" className="hover:text-silk-black transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/21658826329"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-silk-black transition-colors flex items-center gap-1.5"
                >
                  <span>WhatsApp: +216 58826329</span>
                </a>
              </li>
              <li>
                <span className="text-silk-charcoal font-medium">Cash on Delivery (COD)</span>
              </li>
              <li>
                <span className="text-xs block text-silk-grey">Payment at doorstep in TND</span>
              </li>
              <li>
                <Link href="/about" className="hover:text-silk-black transition-colors">
                  Brand Philosophy
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support & Direct Order Info (Account creation isolated: CSV order model) */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-silk-black">Orders & Support</h4>
            <ul className="space-y-2 text-sm text-silk-grey">
              <li>
                <Link href="/contact" className="hover:text-silk-black transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-silk-black transition-colors">
                  Command Assistance
                </Link>
              </li>
              <li className="text-xs text-zinc-400">
                Direct Guest Checkout (No Account Needed)
              </li>
              {/* Account creation isolated:
              <li>
                <Link href="/account">My Profile</Link>
              </li>
              <li>
                <Link href="/login">Sign In</Link>
              </li>
              <li>
                <Link href="/register">Create Account</Link>
              </li>
              */}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-silk-grey gap-4">
          <p>© {new Date().getFullYear()} SILK. All rights reserved.</p>
          <div className="flex space-x-6">
            <span>Made with precision</span>
            <span>Monastir, Tunisia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
