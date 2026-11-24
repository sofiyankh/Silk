"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "@/components/icons";
import { formatPrice } from "@/lib/money";
import { getOptimizedSrc } from "@/lib/image-variants";

export interface ProductCardProps {
  slug: string;
  name: string;
  priceMillimes: number;
  compareAtMillimes?: number | null;
  image: string;
  secondImage?: string;
  isNew?: boolean;
  colorHex?: string;
  category?: string;
  priority?: boolean;
}

export function ProductCard({
  slug,
  name,
  priceMillimes,
  compareAtMillimes,
  image,
  secondImage,
  isNew,
  priority = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWished, setIsWished] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const displayImage = isHovered && secondImage ? secondImage : image;

  // 21st.dev spotlight mouse tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="group relative flex flex-col">
      {/* Image container with 21st.dev spotlight & smooth hover zoom */}
      <Link
        ref={cardRef}
        href={`/product/${slug}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="spotlight-card relative aspect-[3/4] w-full overflow-hidden bg-silk-cream/40 border border-silk-border/60 cursor-pointer"
      >
        <Image
          src={getOptimizedSrc(displayImage, 800)}
          alt={name}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {compareAtMillimes && compareAtMillimes > priceMillimes && (
            <span className="bg-silk-black text-white text-[10px] uppercase font-semibold px-2 py-0.5 tracking-wider shadow-sm">
              20% OFF
            </span>
          )}
          {isNew && (
            <span className="bg-white/95 backdrop-blur-sm text-silk-black border border-silk-border text-[9px] uppercase font-semibold px-2 py-0.5 tracking-wider shadow-sm">
              NEW
            </span>
          )}
        </div>

        {/* 21st.dev tactile Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWished(!isWished);
          }}
          className="tactile-button absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-silk-charcoal transition z-10 shadow-sm"
          aria-label="Wishlist"
        >
          <Heart
            size={16}
            className={`transition-colors duration-200 ${
              isWished ? "fill-red-500 text-red-500 scale-110" : "text-silk-charcoal"
            }`}
          />
        </button>
      </Link>

      {/* Product Information */}
      <div className="mt-3 flex flex-col space-y-1">
        <Link href={`/product/${slug}`}>
          <h3 className="text-xs font-medium uppercase tracking-wider text-silk-black hover:text-silk-grey transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-silk-black">
            {formatPrice(priceMillimes)}
          </span>
          {compareAtMillimes && compareAtMillimes > priceMillimes && (
            <span className="text-[11px] text-silk-grey line-through">
              {formatPrice(compareAtMillimes)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
