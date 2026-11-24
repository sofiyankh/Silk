"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingBag, Menu, X } from "@/components/icons";
import { useCart } from "@/lib/cart-context";

export function Navbar() {
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <header className="sticky top-0 z-40 bg-silk-bg/95 backdrop-blur-md border-b border-silk-border/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-silk-black hover:text-silk-grey transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex items-center">
              {/* Official Silk needle & thread logo */}
              <div className="relative h-14 w-[170px] sm:h-20 sm:w-[280px] lg:h-28 lg:w-[416px] max-w-[48vw] sm:max-w-none">
                <Image
                  src="/brand/logo/silk-logo-black-480w.webp"
                  alt="Silk Logo"
                  fill
                  sizes="(max-width: 640px) 170px, (max-width: 1024px) 280px, 416px"
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links (Centered) */}
          <nav className="hidden lg:flex items-center space-x-10 text-[13px] font-medium tracking-[0.15em] uppercase text-silk-charcoal absolute left-1/2 -translate-x-1/2">
            <Link
              href="/shop"
              className="hover:text-silk-black transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-silk-black hover:after:w-full after:transition-all"
            >
              Shop
            </Link>
            <Link
              href="/collections"
              className="hover:text-silk-black transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-silk-black hover:after:w-full after:transition-all"
            >
              Collections
            </Link>
            <Link
              href="/about"
              className="hover:text-silk-black transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-silk-black hover:after:w-full after:transition-all"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-silk-black transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-silk-black hover:after:w-full after:transition-all"
            >
              Contact
            </Link>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center space-x-5 text-silk-black">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 hover:opacity-60 transition"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.75} />
            </button>

            {/* Account creation disabled: CSV direct order model (isolated) */}
            {/* <Link href="/account" className="p-1.5 hover:opacity-60 transition" aria-label="Account">
              <User size={20} strokeWidth={1.75} />
            </Link> */}

            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-1.5 hover:opacity-60 transition relative"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.75} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-silk-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-silk-border bg-silk-bg px-6 py-6 space-y-4 text-sm font-medium tracking-widest uppercase">
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-silk-black hover:text-silk-grey"
            >
              Shop All
            </Link>
            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-silk-black hover:text-silk-grey"
            >
              Collections
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-silk-black hover:text-silk-grey"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-silk-black hover:text-silk-grey"
            >
              Contact
            </Link>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-in fade-in duration-200">
          <div className="bg-silk-bg border border-silk-border max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 text-silk-grey hover:text-silk-black"
            >
              <X size={20} />
            </button>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-silk-grey mb-3">
              Search Products
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="flex items-center gap-3 border-b border-silk-black pb-2"
            >
              <Search size={18} className="text-silk-grey" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hoodies, sakura, butterfly..."
                className="w-full bg-transparent text-silk-black focus:outline-none text-base"
                autoFocus
              />
              <button
                type="submit"
                className="text-xs uppercase font-medium tracking-widest text-silk-black hover:opacity-70"
              >
                Search
              </button>
            </form>
            <div className="mt-4 pt-3 flex flex-wrap gap-2 text-xs text-silk-grey">
              <span>Popular:</span>
              <Link href="/shop?q=butterfly" onClick={() => setSearchOpen(false)} className="underline hover:text-black">
                Butterfly
              </Link>
              <Link href="/shop?q=sakura" onClick={() => setSearchOpen(false)} className="underline hover:text-black">
                Sakura
              </Link>
              <Link href="/shop?q=signature" onClick={() => setSearchOpen(false)} className="underline hover:text-black">
                Signature
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
