"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@/components/icons";
import gsap from "gsap";

export function HeroSection() {
  const [useVideoBg, setUseVideoBg] = useState(true);
  const [canLoadVideo, setCanLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const containerRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const conn = (navigator as any).connection;
    const isSlowOrSaveData = Boolean(conn?.saveData || conn?.effectiveType === "2g");
    if (!isSlowOrSaveData) {
      // Load video only after hydration / first paint so poster renders immediately
      const id = window.requestAnimationFrame(() => {
        setCanLoadVideo(true);
      });
      return () => window.cancelAnimationFrame(id);
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
      )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 35, clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
          { opacity: 1, y: 0, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1.1 },
          "-=0.5"
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.6"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[85vh] min-h-[580px] max-h-[860px] overflow-hidden bg-silk-black text-white flex items-center"
    >
      {/* Background layer: Either ambient animated video or editorial image */}
      {useVideoBg ? (
        <>
          <Image
            src="/videos/sakura-ambient-poster.webp"
            alt="Silk Streetwear Campaign"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className={`object-cover filter saturate-110 transition-opacity duration-700 ${
              videoReady ? "opacity-0 pointer-events-none" : "opacity-60"
            }`}
          />
          {canLoadVideo && (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster="/videos/sakura-ambient-poster.webp"
              onCanPlay={() => setVideoReady(true)}
              className={`absolute inset-0 w-full h-full object-cover filter saturate-110 transition-opacity duration-700 ${
                videoReady ? "opacity-60" : "opacity-0"
              }`}
            >
              <source src="/videos/sakura-ambient.mp4" type="video/mp4" />
            </video>
          )}
        </>
      ) : (
        <Image
          src="/brand/models/editorial/black-floral-bird-back-800w.webp"
          alt="Silk Streetwear Campaign"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-top opacity-50 filter contrast-110"
        />
      )}

      {/* Atmospheric gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35" />

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 backdrop-blur-sm text-[11px] uppercase tracking-[0.25em] text-white/90"
          >
            <span>Spring / Summer 2026</span>
            <span className="w-1.5 h-1.5 rounded-full bg-silk-pink" />
            <span>Botanical Series</span>
          </div>

          <h1
            ref={headingRef}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase leading-[0.95] text-white"
          >
            More Than Just <br />
            <span className="font-light italic text-white/90">Clothes.</span>
          </h1>

          <p
            ref={descRef}
            className="text-sm sm:text-base text-white/80 font-light tracking-wide max-w-lg leading-relaxed"
          >
            Streetwear for a different generation. Oversized 450GSM cotton silhouettes layered with
            hand-illustrated cherry blossoms and delicate butterfly artwork.
          </p>

          <div ref={ctaRef} className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="tactile-button inline-flex items-center gap-3 bg-white text-silk-black text-xs font-semibold uppercase tracking-[0.2em] px-8 py-4 hover:bg-silk-cream transition-all duration-300 shadow-xl group cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>

            <Link
              href="/collections"
              className="tactile-button inline-flex items-center gap-2 border border-white/40 text-white text-xs font-semibold uppercase tracking-[0.2em] px-6 py-4 hover:border-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer"
            >
              <span>Collections</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Video / Background Switcher control */}
      <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] uppercase tracking-widest text-white/70 bg-black/40 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 border border-white/10 rounded">
        <span>Ambient Video</span>
        <button
          onClick={() => setUseVideoBg(!useVideoBg)}
          className="text-white hover:underline font-medium"
        >
          {useVideoBg ? "Switch to Photo" : "Play Video"}
        </button>
      </div>
    </section>
  );
}
