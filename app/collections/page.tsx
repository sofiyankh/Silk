import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@/components/icons";
import { db } from "@/lib/db";
import { withRetry } from "@/lib/with-retry";
import { SilkRailShowcase } from "@/components/SilkRailShowcase";
import { getOptimizedSrc } from "@/lib/image-variants";

export const revalidate = 60;

export default async function CollectionsPage() {
  const products = await withRetry(() =>
    db.product.findMany({
      where: { isPublished: true },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: true,
      },
    })
  );

  const collections = [
    {
      slug: "signature",
      title: "Signature Silk Needle & Thread",
      subtitle: "The official cursive Silk insignia paired with singing blossom birds",
      image: "/brand/models/editorial/blossom-bird-model.png",
      hoodieSlug: "black-signature-hoodie",
    },
    {
      slug: "sakura",
      title: "Sakura Blossom Collection",
      subtitle: "Spring cherry blossom branches trailing along the shoulders and hood",
      image: "/brand/models/editorial/sakura-mirror-portrait.png",
      hoodieSlug: "sakura-hoodie",
    },
    {
      slug: "floral",
      title: "Midnight Floral Collection",
      subtitle: "Azure and cobalt petal embroidery contrasting deep black cotton",
      image: "/brand/models/editorial/blue-floral-model-back.png",
      hoodieSlug: "blue-floral-hoodie",
    },
    {
      slug: "butterfly",
      title: "Butterfly Collection",
      subtitle: "Delicate metamorphosis across heavyweight 450GSM cream fleece",
      image: "/hoodies/models/women/butterfly/cream/butterfly-print-hoodie-front.png",
      hoodieSlug: "butterfly-hoodie",
    },
  ];

  return (
    <div className="pb-24 pt-6 space-y-16">
      {/* 1. Interactive Physical Garment Rail Showroom */}
      <SilkRailShowcase
        products={products}
        eyebrow="Interactive Capsule Showroom • 2026 Archive"
        heading="The Silk Collection Rail"
        caption="Interact directly with each capsule silhouette. Sway the hangers, rotate to inspect rear embroideries, or tap any hoodie for 3D inspection."
        className="border-y border-silk-border bg-transparent"
        action={
          <a
            href="#capsules"
            className="inline-flex items-center gap-2 bg-silk-black text-white hover:bg-black px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Capsules Below</span>
            <ArrowRight size={14} />
          </a>
        }
      />

      {/* 2. Curated Capsule Collections Grid */}
      <div id="capsules" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-silk-border">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-silk-grey font-semibold">
              Curated Capsules
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-silk-black mt-1">
              Seasonal Archive Series
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-silk-grey max-w-md">
            Each capsule explores an exclusive dialogue between delicate botanical needlework and
            heavyweight 450GSM relaxed street cuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group relative flex flex-col bg-silk-cream/30 border border-silk-border overflow-hidden"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={getOptimizedSrc(col.image, 800)}
                  alt={col.title}
                  fill
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/70 block">
                    Capsule Series
                  </span>
                  <h3 className="text-xl font-bold uppercase tracking-wide">
                    {col.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2">{col.subtitle}</p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white group-hover:translate-x-1 transition-transform">
                    <span>Explore Capsule</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
