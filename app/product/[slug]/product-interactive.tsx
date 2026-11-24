"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { getOptimizedSrc } from "@/lib/image-variants";
import { Heart, ChevronDown, ChevronUp, Check, ShieldCheck, Truck, RotateCcw } from "@/components/icons";
import { formatPrice } from "@/lib/money";
import { useCart } from "@/lib/cart-context";
import gsap from "gsap";

interface ProductInteractiveProps {
  product: any;
}

export function ProductInteractive({ product }: ProductInteractiveProps) {
  const { addItem } = useCart();
  const images: string[] = product.images.map((img: any) => img.url);
  // Turntable order: front → sleeves & shoulders → back
  const spinFrames: string[] = images.length >= 3 ? [images[0], images[2], images[1]] : images;
  const spinLabels = ["Front", "Sleeves & Shoulders", "Back"];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [spinMode, setSpinMode] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);
  const spinDrag = useRef({ startX: 0, dragging: false });
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState(1);
  const [isWished, setIsWished] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const mainImageRef = useRef<HTMLDivElement>(null);

  // Accordion open/close states
  const [openSection, setOpenSection] = useState<string | null>("details");

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const handleSelectImage = (idx: number) => {
    setSpinMode(false);
    if (idx === activeImageIndex) return;
    if (mainImageRef.current) {
      gsap.fromTo(
        mainImageRef.current,
        { opacity: 0.7, scale: 0.99 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
      );
    }
    setActiveImageIndex(idx);
  };

  const currentVariant =
    product.variants.find((v: any) => v.size === selectedSize) || product.variants[0];

  const handleAddToCart = () => {
    if (!currentVariant) return;
    addItem({
      variantId: currentVariant.id,
      productId: product.id,
      productSlug: product.slug,
      name: product.nameEn,
      priceMillimes: currentVariant.priceOverrideMillimes || product.basePriceMillimes,
      compareAtMillimes: product.compareAtMillimes,
      size: selectedSize,
      color: currentVariant.color,
      image: images[0] || "/brand/products/butterfly-hoodie/front.jpg",
      quantity,
      maxStock: currentVariant.stock || 20,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Gallery Section: 7 columns (Left thumbnail strip + Center Main View) */}
      <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
        {/* Left vertical thumbnail strip */}
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[640px] md:w-20 flex-shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectImage(idx)}
              className={`tactile-button relative w-16 h-20 md:w-20 md:h-24 flex-shrink-0 border transition-all ${
                activeImageIndex === idx
                  ? "border-silk-black ring-1 ring-silk-black"
                  : "border-silk-border hover:border-silk-grey opacity-75 hover:opacity-100"
              }`}
            >
              <Image
                src={getOptimizedSrc(img, 480)}
                alt={`${product.nameEn} view ${idx + 1}`}
                fill
                loading="lazy"
                decoding="async"
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Center Main Photograph */}
        <div
          ref={mainImageRef}
          className={`relative flex-1 aspect-[3/4] bg-silk-cream/40 border border-silk-border/60 overflow-hidden select-none ${spinMode ? "cursor-grab active:cursor-grabbing" : ""}`}
          style={spinMode ? { touchAction: "pan-y" } : undefined}
          onPointerDown={(event) => {
            if (!spinMode) return;
            spinDrag.current = { startX: event.clientX, dragging: true };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!spinMode || !spinDrag.current.dragging) return;
            const dx = event.clientX - spinDrag.current.startX;
            if (Math.abs(dx) < 45) return;
            setSpinIndex((current) => (current + (dx < 0 ? 1 : spinFrames.length - 1)) % spinFrames.length);
            spinDrag.current.startX = event.clientX;
          }}
          onPointerUp={() => { spinDrag.current.dragging = false; }}
          onPointerCancel={() => { spinDrag.current.dragging = false; }}
        >
          <Image
            key={spinMode ? `spin-${spinIndex}` : `image-${activeImageIndex}`}
            src={getOptimizedSrc((spinMode ? spinFrames[spinIndex] : images[activeImageIndex]) || images[0], 800)}
            alt={product.nameEn}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover animate-in fade-in duration-300 transition-transform duration-700 ease-out hover:scale-105"
            draggable={false}
          />
          {product.compareAtMillimes && (
            <span className="absolute top-4 left-4 bg-silk-black text-white text-[10px] uppercase font-semibold px-2.5 py-1 tracking-wider z-10 shadow-sm">
              20% OFF
            </span>
          )}
          {spinFrames.length >= 3 && (
            <button
              type="button"
              onClick={() => { setSpinMode((on) => !on); setSpinIndex(0); }}
              className={`absolute top-4 right-4 z-10 border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${spinMode ? "bg-silk-black text-white border-silk-black" : "bg-white/90 text-silk-black border-silk-border hover:border-silk-black"}`}
            >
              {spinMode ? "Exit 360°" : "360° View"}
            </button>
          )}
          {spinMode && (
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 bg-gradient-to-t from-black/55 to-transparent px-4 pt-8 pb-3 text-[10px] uppercase tracking-[0.16em] text-white">
              {spinLabels.map((label, i) => (
                <span key={label} className={i === spinIndex ? "font-semibold" : "text-white/60"}>
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Information Section: 5 columns */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-silk-grey font-semibold">
            Silk Archive Collection
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-silk-black mt-1">
            {product.nameEn}
          </h1>

          {/* Price */}
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xl font-bold text-silk-black font-mono">
              {formatPrice(product.basePriceMillimes)}
            </span>
            {product.compareAtMillimes && (
              <span className="text-sm text-silk-grey line-through font-mono">
                {formatPrice(product.compareAtMillimes)}
              </span>
            )}
            <span className="text-[11px] text-green-700 font-medium bg-green-50 px-2 py-0.5 border border-green-200">
              In Stock (COD Available)
            </span>
          </div>
        </div>

        {/* Short description */}
        <p className="text-xs sm:text-sm text-silk-grey leading-relaxed">
          {product.descriptionEn}
        </p>

        {/* Color representation */}
        <div className="space-y-2 pt-2 border-t border-silk-border">
          <div className="flex justify-between text-xs">
            <span className="uppercase tracking-widest font-semibold text-silk-black">Color</span>
            <span className="text-silk-grey">{currentVariant?.color || "Original"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border border-silk-border ring-2 ring-offset-2 ring-silk-black shadow-sm"
              style={{ backgroundColor: currentVariant?.colorHex || "#f0ebe2" }}
            />
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-2 pt-2 border-t border-silk-border">
          <div className="flex justify-between text-xs">
            <span className="uppercase tracking-widest font-semibold text-silk-black">Select Size</span>
            <span className="text-silk-grey underline cursor-pointer hover:text-black">
              Size Guide
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {sizes.map((sz) => {
              const variant = product.variants.find((v: any) => v.size === sz);
              const inStock = variant ? variant.stock > 0 : true;

              return (
                <button
                  key={sz}
                  disabled={!inStock}
                  onClick={() => setSelectedSize(sz)}
                  className={`tactile-button py-2.5 text-xs font-semibold uppercase tracking-wider border transition ${
                    selectedSize === sz
                      ? "bg-silk-black text-white border-silk-black"
                      : inStock
                      ? "bg-white text-silk-charcoal border-silk-border hover:border-silk-black"
                      : "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through"
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity and Add to Cart action */}
        <div className="space-y-3 pt-4 border-t border-silk-border">
          <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center border border-silk-border bg-white px-1 sm:px-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="tactile-button px-2 py-3 text-xs hover:text-silk-black text-silk-grey font-bold"
              >
                -
              </button>
              <span className="px-3 text-xs font-semibold text-silk-black min-w-[24px] text-center font-mono">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="tactile-button px-2 py-3 text-xs hover:text-silk-black text-silk-grey font-bold"
              >
                +
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              className="tactile-button min-w-[140px] flex-1 bg-silk-black text-white text-xs font-bold uppercase tracking-[0.2em] py-3.5 sm:py-4 px-4 sm:px-6 hover:bg-silk-charcoal transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Add to Cart</span>
            </button>

            {/* Wishlist toggle */}
            <button
              onClick={() => setIsWished(!isWished)}
              className="tactile-button p-3 sm:p-4 border border-silk-border bg-white hover:border-silk-black transition text-silk-charcoal cursor-pointer flex-shrink-0"
              aria-label="Wishlist"
            >
              <Heart
                size={18}
                className={isWished ? "fill-red-500 text-red-500 scale-110" : "text-silk-charcoal"}
              />
            </button>
          </div>

          {addedNotice && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-800 text-xs animate-in fade-in duration-300">
              <Check size={16} />
              <span>Added to your bag! Check your drawer or proceed to checkout.</span>
            </div>
          )}
        </div>

        {/* Guarantee value props */}
        <div className="space-y-2 pt-2 text-[11px] text-silk-grey border-t border-silk-border/60">
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-silk-black" />
            <span>Paiement à la livraison (COD) partout en Tunisie</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw size={14} className="text-silk-black" />
            <span>Échange gratuit de taille sous 7 jours</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-silk-black" />
            <span>Coton lourd 450GSM haute durabilité</span>
          </div>
        </div>

        {/* Expandable Accordions */}
        <div className="border-t border-silk-border divide-y divide-silk-border pt-2">
          {/* Details */}
          <div>
            <button
              onClick={() => toggleSection("details")}
              className="w-full py-3 flex justify-between items-center text-xs uppercase font-bold tracking-widest text-silk-black text-left"
            >
              <span>Product Details</span>
              {openSection === "details" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {openSection === "details" && (
              <div className="pb-4 text-xs text-silk-grey space-y-1.5 leading-relaxed animate-in fade-in duration-200">
                <p>• 450GSM custom heavy terry organic fleece.</p>
                <p>• Intricate front, sleeve and back botanical print and needle embroidery.</p>
                <p>• Double-layered hood with metallic aglets on heavy drawcords.</p>
                <p>• Kangaroo pocket with reinforced bar-tack stitching.</p>
                <p>• Designed in Tunis, crafted with meticulous quality control.</p>
              </div>
            )}
          </div>

          {/* Size & Fit */}
          <div>
            <button
              onClick={() => toggleSection("size-fit")}
              className="w-full py-3 flex justify-between items-center text-xs uppercase font-bold tracking-widest text-silk-black text-left"
            >
              <span>Size & Fit</span>
              {openSection === "size-fit" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {openSection === "size-fit" && (
              <div className="pb-4 text-xs text-silk-grey space-y-1.5 leading-relaxed animate-in fade-in duration-200">
                <p>• Signature relaxed streetwear oversized fit.</p>
                <p>• Dropped shoulders and slightly cropped body length.</p>
                <p>• Male model is 184cm (6 ft) wearing size L.</p>
                <p>• Female model is 170cm (5 ft 7 in) wearing size M.</p>
                <p>• Take your regular size for an oversized look, or size down for standard fit.</p>
              </div>
            )}
          </div>

          {/* Shipping & Returns */}
          <div>
            <button
              onClick={() => toggleSection("shipping")}
              className="w-full py-3 flex justify-between items-center text-xs uppercase font-bold tracking-widest text-silk-black text-left"
            >
              <span>Shipping & Returns</span>
              {openSection === "shipping" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {openSection === "shipping" && (
              <div className="pb-4 text-xs text-silk-grey space-y-1.5 leading-relaxed animate-in fade-in duration-200">
                <p>• <strong>Paiement à la livraison :</strong> payez en espèces à la réception de votre colis.</p>
                <p>• Delivery across Tunisia takes 24 to 48 business hours.</p>
                <p>• Flat rate 7.000 TND delivery across Tunisia.</p>
                <p>• You may open the parcel in front of the courier before acceptance.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
