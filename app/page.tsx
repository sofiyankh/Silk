import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from "@/components/icons";
import { db } from "@/lib/db";
import { withRetry } from "@/lib/with-retry";
import { HeroSection } from "@/components/HeroSection";
import { SilkRailShowcase } from "@/components/SilkRailShowcase";
import { ProductCard } from "@/components/ProductCard";
import { ScrollReveal } from "@/components/ScrollRevealSections";
import { getOptimizedSrc } from "@/lib/image-variants";

export const revalidate = 60; // ISR 60s cache

export default async function HomePage() {
  // Fetch featured products from the database
  const products = await withRetry(() =>
    db.product.findMany({
      where: { isPublished: true },
      include: {
        images: {
          orderBy: { position: "asc" },
        },
        variants: true,
      },
    })
  );

  const featuredPieces = products.filter((p) => p.isFeatured);
  const displayPieces = (featuredPieces.length > 0 ? featuredPieces : products).slice(0, 6);

  // Collections data
  const collections = [
    {
      title: "Signature Collection",
      slug: "signature",
      image: "/brand/models/editorial/blossom-bird-model.png",
      count: "Silk Needle & Thread",
    },
    {
      title: "Sakura Collection",
      slug: "sakura",
      image: "/brand/models/editorial/sakura-mirror-portrait.png",
      count: "Spring Series",
    },
    {
      title: "Floral Collection",
      slug: "floral",
      image: "/brand/models/editorial/blue-floral-model-back.png",
      count: "Midnight Botanical",
    },
    {
      title: "Butterfly Collection",
      slug: "butterfly",
      image: "/hoodies/models/women/butterfly/cream/butterfly-print-hoodie-front.png",
      count: "Exclusive Edition",
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Campaign Section with GSAP Kinetic Animation */}
      <HeroSection />

      {/* 2. 21st.dev Interactive Physical Garment Rail Hero */}
      <SilkRailShowcase products={products} />

      {/* 3. Featured Collections (4 Cards as shown in UI Moodboard) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-silk-black">
              Featured Collection
            </h2>
            <p className="text-xs text-silk-grey mt-0.5">Carefully curated seasonal capsules</p>
          </div>
          <Link
            href="/collections"
            className="text-xs font-semibold uppercase tracking-widest text-silk-charcoal hover:text-black flex items-center gap-1 group"
          >
            <span>View all</span>
            <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>

        <ScrollReveal stagger={0.12}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {collections.map((col) => (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="group relative flex flex-col overflow-hidden bg-silk-cream/40 border border-silk-border/60 tactile-button"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={getOptimizedSrc(col.image, 800)}
                    alt={col.title}
                    fill
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase tracking-widest text-white/70 block mb-0.5">
                      {col.count}
                    </span>
                    <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
                      {col.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Featured Pieces / Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-silk-black">
              Featured Pieces
            </h2>
            <p className="text-xs text-silk-grey mt-0.5">Heavyweight 450GSM cotton silhouettes</p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold uppercase tracking-widest text-silk-charcoal hover:text-black flex items-center gap-1 group"
          >
            <span>Shop Catalog</span>
            <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>

        <ScrollReveal stagger={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayPieces.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.nameEn}
                priceMillimes={product.basePriceMillimes}
                compareAtMillimes={product.compareAtMillimes}
                image={product.images[0]?.url || "/brand/products/butterfly-hoodie/front.jpg"}
                secondImage={product.images[1]?.url}
                isNew={product.isNew}
              />
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 4. Brand Editorial Statement (Art in Every Detail) */}
      <section className="bg-silk-cream/40 border-y border-silk-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal y={25}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-[11px] uppercase tracking-[0.25em] text-silk-grey font-semibold">
                  Brand Manifesto
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight uppercase leading-tight text-silk-black">
                  Art In Every Detail. <br />
                  Oversized Silhouettes.
                </h2>
                <p className="text-sm text-silk-grey leading-relaxed">
                  Silk was founded at the crossroads of contemporary urban streetwear culture and
                  traditional oriental botanical fine art. Each garment is constructed from 450GSM
                  brushed organic cotton, offering substantial drape and luxurious comfort, finished
                  with intricate embroidery and high-density screenprints that tell a story.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-silk-border">
                  <div>
                    <span className="block text-2xl font-bold text-silk-black">450</span>
                    <span className="text-[11px] uppercase tracking-wider text-silk-grey">
                      GSM Cotton
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-silk-black">100%</span>
                    <span className="text-[11px] uppercase tracking-wider text-silk-grey">
                      Organic Fleece
                    </span>
                  </div>
                  <div>
                    <span className="block text-2xl font-bold text-silk-black">COD</span>
                    <span className="text-[11px] uppercase tracking-wider text-silk-grey">
                      Cash Delivery
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden border border-silk-border shadow-md">
                <Image
                  src="/brand/models/lookbook/monochrome-showcase-800w.webp"
                  alt="Silk Craftsmanship"
                  fill
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. Value Props (COD, Free Shipping, Craftsmanship) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal stagger={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-y border-silk-border/60 text-center">
            <div className="flex flex-col items-center p-4 space-y-2">
              <Truck size={24} className="text-silk-black" strokeWidth={1.5} />
              <h3 className="text-xs font-bold uppercase tracking-widest text-silk-black">
                Cash on Delivery (COD)
              </h3>
              <p className="text-xs text-silk-grey max-w-xs">
                Inspect your garment upon arrival and pay in cash directly to our courier anywhere in Tunisia.
              </p>
            </div>

            <div className="flex flex-col items-center p-4 space-y-2">
              <Sparkles size={24} className="text-silk-black" strokeWidth={1.5} />
              <h3 className="text-xs font-bold uppercase tracking-widest text-silk-black">
                450GSM Luxury Terry
              </h3>
              <p className="text-xs text-silk-grey max-w-xs">
                Heavyweight custom milled organic cotton crafted for exceptional drape and enduring softness.
              </p>
            </div>

            <div className="flex flex-col items-center p-4 space-y-2">
              <RefreshCw size={24} className="text-silk-black" strokeWidth={1.5} />
              <h3 className="text-xs font-bold uppercase tracking-widest text-silk-black">
                Hassle-Free Exchanges
              </h3>
              <p className="text-xs text-silk-grey max-w-xs">
                Easy size exchange within 7 days to make sure your oversized silhouette fits you perfectly.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 6. Newsletter Subscription */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4 pt-8">
        <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-silk-grey">
          The Silk Archive
        </h3>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-silk-black">
          Join Our Community For Exclusive Drops
        </h2>
        <p className="text-xs sm:text-sm text-silk-grey max-w-md mx-auto">
          Receive private access to limited capsule releases, seasonal archives, and secret discount codes.
        </p>
        <form
          action="/api/newsletter"
          method="POST"
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email address"
            className="flex-1 px-4 py-3 bg-white border border-silk-border text-xs focus:outline-none focus:border-silk-black text-silk-black"
          />
          <button
            type="submit"
            className="tactile-button px-6 py-3 bg-silk-black text-white text-xs font-semibold uppercase tracking-widest hover:bg-silk-charcoal transition shadow-sm"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
