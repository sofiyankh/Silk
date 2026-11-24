import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function AboutPage() {
  return (
    <div className="pb-24 pt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[11px] uppercase tracking-[0.25em] text-silk-grey font-semibold">
            Brand Philosophy
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-silk-black">
            The Silk Story
          </h1>
          <p className="text-xs sm:text-sm text-silk-grey max-w-xl mx-auto leading-relaxed">
            More than just clothes. An artistic streetwear dialogue between Mediterranean craftsmanship
            and Japanese botanical discipline.
          </p>
        </div>

        {/* Hero image */}
        <div className="relative aspect-[16/9] w-full border border-silk-border overflow-hidden">
          <Image
            src="/brand/models/lookbook/minimal-grid.png"
            alt="Silk Brand Story"
            fill
            className="object-cover"
          />
        </div>

        {/* Narrative Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-xs sm:text-sm text-silk-charcoal leading-relaxed">
          <div className="space-y-4">
            <h3 className="text-base font-bold uppercase tracking-widest text-silk-black">
              Substantial Silhouettes
            </h3>
            <p className="text-silk-grey">
              We reject lightweight, fast-fashion disposability. Every Silk hoodie starts with
              custom-developed 450GSM organic brushed cotton fleece, providing an architectural drop
              and a heavy, protective drape that retains its structure over years of wear.
            </p>
            <p className="text-silk-grey">
              The relaxed, drop-shoulder silhouette ensures unrestricted movement and an effortless,
              contemporary street presence.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold uppercase tracking-widest text-silk-black">
              Botanical Fine Art
            </h3>
            <p className="text-silk-grey">
              Our artwork explores nature&apos;s fragility. Rather than loud graphic logos, Silk
              incorporates trailing sakura blossoms, songbirds on flowering branches, and intricate
              monarch butterflies.
            </p>
            <p className="text-silk-grey">
              Each illustration is applied using a blend of high-density pigment screen-printing and
              tactile embroidery, celebrating the touch of the needle and thread.
            </p>
          </div>
        </div>

        {/* Cash on Delivery / Local pride */}
        <div className="bg-silk-cream/40 border border-silk-border p-8 text-center space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-silk-black">
            Direct To Your Door Across Tunisia
          </h3>
          <p className="text-xs text-silk-grey max-w-md mx-auto leading-relaxed">
            We offer direct express Cash on Delivery (COD) service nationwide. Inspect your garment,
            feel the 450GSM weight in your hands, and pay in cash upon arrival.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-silk-black text-white text-xs font-semibold uppercase tracking-widest px-8 py-3.5 hover:bg-silk-charcoal transition"
          >
            <span>Explore Current Pieces</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
