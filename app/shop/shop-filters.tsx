"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, RotateCcw } from "@/components/icons";

interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameFr: string;
}

export function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const currentCategory = searchParams.get("category") || "";
  const currentSize = searchParams.get("size") || "";
  const currentColor = searchParams.get("color") || "";
  const currentSort = searchParams.get("sort") || "";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    { label: "White", hex: "#FFFFFF", border: true },
    { label: "Cream", hex: "#F0EBE2", border: true },
    { label: "Grey", hex: "#D5D5D5" },
    { label: "Black", hex: "#151515" },
    { label: "Pink", hex: "#D7B4B4" },
  ];

  const hasActiveFilters = Boolean(currentCategory || currentSize || currentColor || currentSort);

  return (
    <div>
      {/* Mobile filter accordion toggle button */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden w-full flex items-center justify-between py-3 px-4 border border-silk-border bg-white text-xs font-semibold uppercase tracking-wider text-silk-black mb-4 shadow-sm"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={14} />
          <span>Filters & Sort {hasActiveFilters && "(Active)"}</span>
        </span>
        <span className="text-silk-grey text-[11px] font-normal">
          {mobileOpen ? "Hide" : "Show"}
        </span>
      </button>

      <div className={`${mobileOpen ? "block" : "hidden lg:block"} space-y-8 pr-4`}>
        {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-silk-black flex items-center justify-between">
          <span>Categories</span>
          <SlidersHorizontal size={14} className="text-silk-grey" />
        </h3>
        <ul className="space-y-2 text-xs text-silk-grey">
          <li>
            <button
              onClick={() => updateParam("category", null)}
              className={`hover:text-silk-black transition text-left ${
                !currentCategory ? "text-silk-black font-bold underline" : ""
              }`}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => updateParam("category", cat.slug)}
                className={`hover:text-silk-black transition text-left capitalize ${
                  currentCategory === cat.slug ? "text-silk-black font-bold underline" : ""
                }`}
              >
                {cat.nameEn}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Size Filter */}
      <div className="space-y-3 pt-6 border-t border-silk-border">
        <h3 className="text-xs font-bold uppercase tracking-widest text-silk-black">
          Filter by Size
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => updateParam("size", currentSize === s ? null : s)}
              className={`py-2 text-[11px] font-medium border text-center transition ${
                currentSize === s
                  ? "bg-silk-black text-white border-silk-black"
                  : "bg-white text-silk-charcoal border-silk-border hover:border-silk-black"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3 pt-6 border-t border-silk-border">
        <h3 className="text-xs font-bold uppercase tracking-widest text-silk-black">
          Filter by Color
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((c) => (
            <button
              key={c.label}
              onClick={() => updateParam("color", currentColor === c.label ? null : c.label)}
              title={c.label}
              style={{ backgroundColor: c.hex }}
              className={`w-6 h-6 rounded-full transition-transform ${
                c.border ? "border border-silk-border" : ""
              } ${
                currentColor === c.label
                  ? "ring-2 ring-offset-2 ring-silk-black scale-110"
                  : "hover:scale-105"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-3 pt-6 border-t border-silk-border">
        <h3 className="text-xs font-bold uppercase tracking-widest text-silk-black">Sort By</h3>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value || null)}
          className="w-full bg-white border border-silk-border text-xs py-2 px-2.5 text-silk-charcoal focus:outline-none focus:border-silk-black"
        >
          <option value="">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Reset button if any filter active */}
        {(currentCategory || currentSize || currentColor || currentSort) && (
          <button
            onClick={() => router.push("/shop")}
            className="flex items-center gap-1.5 text-xs text-silk-grey hover:text-black uppercase tracking-wider font-semibold pt-2"
          >
            <RotateCcw size={12} />
            <span>Clear All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
