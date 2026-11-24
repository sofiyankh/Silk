import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { withRetry } from "@/lib/with-retry";
import { ProductCard } from "@/components/ProductCard";
import { getOptimizedSrc } from "@/lib/image-variants";

export const revalidate = 60;

interface CollectionDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { slug } = params;

  const collectionInfoMap: Record<string, any> = {
    signature: {
      title: "Signature Silk Collection",
      desc: "The handwritten needle & thread logo paired with delicate songbirds.",
      heroImg: "/brand/models/editorial/blossom-bird-model.png",
      productSlugs: ["black-signature-hoodie"],
    },
    sakura: {
      title: "Sakura Blossom Collection",
      desc: "Delicate cherry blossom branches trailing along the shoulders, sleeves and back.",
      heroImg: "/brand/models/editorial/cherry-back-design.png",
      productSlugs: ["sakura-hoodie", "birds-sakura-hoodie", "monochrome-blossom-hoodie"],
    },
    floral: {
      title: "Midnight Floral Collection",
      desc: "Vibrant botanical petals stitched onto heavyweight midnight black cotton.",
      heroImg: "/brand/models/editorial/blue-floral-model-back.png",
      productSlugs: ["blue-floral-hoodie"],
    },
    butterfly: {
      title: "Butterfly Collection",
      desc: "Detailed monochrome butterfly motifs on buttery cream fleece.",
      heroImg: "/hoodies/models/women/butterfly/cream/butterfly-print-hoodie-front.png",
      productSlugs: ["butterfly-hoodie"],
    },
  };

  const info = collectionInfoMap[slug];
  if (!info) {
    notFound();
  }

  const products = await withRetry(() =>
    db.product.findMany({
      where: {
        slug: { in: info.productSlugs },
      },
      include: {
        images: { orderBy: { position: "asc" } },
      },
    })
  );

  return (
    <div className="pb-24">
      {/* Capsule Banner */}
      <div className="relative w-full h-64 sm:h-80 bg-silk-black overflow-hidden flex items-center justify-center text-white mb-12">
        <Image
          src={getOptimizedSrc(info.heroImg, 800)}
          alt={info.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 filter contrast-125"
        />
        <div className="relative z-10 text-center max-w-xl px-4 space-y-3">
          <span className="text-[11px] tracking-[0.25em] uppercase text-white/70 block">
            Capsule Archive
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight">
            {info.title}
          </h1>
          <p className="text-xs sm:text-sm text-white/90 font-light leading-relaxed">
            {info.desc}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-silk-border text-xs text-silk-grey mb-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-black">
              Collections
            </Link>
            <span>/</span>
            <span className="text-silk-black font-semibold uppercase">{info.title}</span>
          </div>
          <span className="font-medium text-silk-black">{products.length} garments in capsule</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.nameEn}
              priceMillimes={p.basePriceMillimes}
              compareAtMillimes={p.compareAtMillimes}
              image={p.images[0]?.url || "/brand/products/butterfly-hoodie/front.jpg"}
              secondImage={p.images[1]?.url}
              isNew={p.isNew}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
