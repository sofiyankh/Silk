import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-silk-bg text-silk-black">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative h-10 w-28 mx-auto">
          <Image
            src="/brand/logo/silk-logo-black.png"
            alt="Silk Logo"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.3em] text-silk-grey font-semibold block">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-silk-black">
            Piece Not Found
          </h1>
          <p className="text-xs sm:text-sm text-silk-grey leading-relaxed max-w-sm mx-auto">
            The garment, collection, or destination you are searching for does not exist in the
            Silk archive or has been retired.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="bg-silk-black text-white text-xs font-semibold uppercase tracking-widest py-3.5 px-6 hover:bg-silk-charcoal transition flex items-center justify-center gap-2"
          >
            <span>Shop The Archive</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/"
            className="bg-white border border-silk-border text-silk-black text-xs font-semibold uppercase tracking-widest py-3.5 px-6 hover:bg-silk-cream transition flex items-center justify-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
