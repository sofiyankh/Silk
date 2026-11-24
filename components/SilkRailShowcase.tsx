"use client";

import React from "react";
import Link from "next/link";
import ClothingRailHero, { RailGarment } from "./ClothingRailHero";
import { ArrowRight } from "@/components/icons";
import { getOptimizedSrc } from "@/lib/image-variants";

const SILK_RAIL_ITEMS: RailGarment[] = [
  {
    id: "butterfly-hoodie",
    name: "Butterfly Cream 450GSM Hoodie",
    description:
      "Heavyweight organic fleece engineered with intricate high-density botanical butterfly needlework across chest and sleeves.",
    kind: "hoodie",
    color: "#F0EBE2",
    trim: "#C9BBA7",
    tag: "89 TND",
    details: ["450 GSM Organic Cotton", "Heavyweight Fleece", "Botanical Butterfly", "Oversized Fit"],
    href: "/product/butterfly-hoodie",
    image: "/brand/rail/designed/butterfly-cream-front.png",
    backImage: "/brand/rail/designed/butterfly-cream-back.png",
    editorialImage: "/hoodies/models/women/butterfly/cream/butterfly-print-hoodie-front.png",
    bgImage: "/hoodies/models/women/butterfly/cream/Ivory Floral Butterfly Garland.png",
  },
  {
    id: "blue-sakura-hoodie",
    name: "Midnight Blue Sakura 450GSM Hoodie",
    description:
      "Deep obsidian black fleece contrasted with vibrant azure cherry blossom DTF illustration along the sleeves and chest.",
    kind: "hoodie",
    color: "#141618",
    trim: "#2B3F58",
    tag: "89 TND",
    details: ["450 GSM Heavy Fleece", "Azure Sakura Graphic", "Double-Lined Hood", "Preshrunk French Terry"],
    href: "/product/blue-floral-hoodie",
    image: "/brand/rail/designed/blue-sakura-black-back.png",
    backImage: "/brand/rail/designed/blue-sakura-black-front.png",
    editorialImage: "/hoodies/models/men/floral-branch/black/back-view-floral-branch-back-hoodie.png",
    bgImage: "/brand/rail/artworks/blue-sakura-dtf.png",
  },
  {
    id: "crimson-maple-white",
    name: "Crimson Maple White 450GSM Hoodie",
    description:
      "Unbleached white heavyweight hoodie tailored with cascading Japanese red maple leaf branches across shoulder and back.",
    kind: "hoodie",
    color: "#F2EDE8",
    trim: "#A82020",
    tag: "89 TND",
    details: ["450 GSM Heavyweight Cotton", "Crimson Maple Branches", "Brushed Fleece Interior", "Relaxed Street Fit"],
    href: "/product/sakura-hoodie",
    image: "/brand/rail/designed/crimson-maple-white-back.png",
    backImage: "/brand/rail/designed/crimson-maple-white-front.png",
    editorialImage: "/brand/models/editorial/sakura-mirror-portrait.png",
    bgImage: "/brand/rail/artworks/crimson-maple-dtf.png",
  },
  {
    id: "crimson-maple-black",
    name: "Crimson Maple Black 450GSM Hoodie",
    description:
      "Midnight black cotton hoodie featuring rich scarlet maple foliage trailing from collar to drop-shoulders and back.",
    kind: "hoodie",
    color: "#171717",
    trim: "#B52828",
    tag: "89 TND",
    details: ["450 GSM Luxury Fleece", "Vibrant Red Foliage", "Reinforced Ribbed Cuffs", "Kangaroo Pocket"],
    href: "/product/sakura-hoodie",
    image: "/brand/rail/designed/crimson-maple-black-back.png",
    backImage: "/brand/rail/designed/crimson-maple-black-front.png",
    editorialImage: "/brand/models/editorial/urban-cherry-portrait.png",
    bgImage: "/brand/rail/artworks/crimson-maple-dtf.png",
  },
  {
    id: "monochrome-blossom-white",
    name: "Monochrome Blossom White 450GSM Hoodie",
    description:
      "Pure white minimalist street silhouette with high-contrast monochrome cherry blossom artwork.",
    kind: "hoodie",
    color: "#EDEAE5",
    trim: "#3A3A3A",
    tag: "89 TND",
    details: ["450 GSM Heavy Cotton", "Monochrome Ink", "Ribbed 2x2 Cuffs", "Oversized Fit"],
    href: "/product/monochrome-blossom-hoodie",
    image: "/brand/rail/designed/monochrome-blossom-white-back.png",
    backImage: "/brand/rail/designed/monochrome-blossom-white-front.png",
    editorialImage: "/hoodies/models/men/monochrome-cherry-blossom/white/monochrome-cherry-blossom-hoodie-front.png",
    bgImage: "/brand/rail/artworks/botanical-blossom-artwork.png",
  },
  {
    id: "monochrome-blossom-black",
    name: "Monochrome Blossom Black 450GSM Hoodie",
    description:
      "Deep midnight black hoodie with intricate white cherry blossom floral linework across chest and back.",
    kind: "hoodie",
    color: "#161616",
    trim: "#D4D4D4",
    tag: "89 TND",
    details: ["450 GSM French Terry", "Contrasting White Blossom", "Double-Lined Hood", "Preshrunk Organic Fleece"],
    href: "/product/black-signature-hoodie",
    image: "/brand/rail/designed/monochrome-blossom-black-back.png",
    backImage: "/brand/rail/designed/monochrome-blossom-black-front.png",
    editorialImage: "/hoodies/models/women/cherry-blossom-bird/black/cherry-blossom-hoodieblack.png",
    bgImage: "/brand/rail/artworks/botanical-blossom-artwork.png",
  },
];

export interface SilkRailShowcaseProps {
  eyebrow?: string;
  heading?: string;
  caption?: string;
  className?: string;
  items?: RailGarment[];
  products?: any[];
  action?: React.ReactNode;
}

export function buildRailItems(products: any[], defaultItems = SILK_RAIL_ITEMS): RailGarment[] {
  if (!products || products.length === 0) return defaultItems;

  const published = products.filter((p) => p.isPublished);

  const railItems: RailGarment[] = [];
  // For each default verified rail garment, only include it if its product is published in DB
  for (const item of defaultItems) {
    const productSlug = item.href?.replace("/product/", "");
    const product = published.find((p) => p.slug === productSlug);
    if (product) {
      railItems.push({
        ...item,
        name: product.nameEn || item.name,
        description: product.descriptionEn || item.description,
        tag: `${Math.round(product.basePriceMillimes / 1000)} TND`,
        // Verified transparent cutout sprites: only override if explicit railImage exists
        image: (product as any).railImage || item.image,
        backImage: (product as any).railBackImage || item.backImage,
        editorialImage: (product as any).editorialImageUrl || item.editorialImage || product.images?.[0]?.url,
        bgImage: (product as any).designArtworkUrl || item.bgImage || product.images?.[2]?.url || product.images?.[0]?.url,
      });
    }
  }

  // ONLY add custom products if they have an EXPLICIT transparent rail cutout sprite (railImage)!
  // Photoshoot model photos (p.images[0].url) must NEVER be hung on the rail!
  for (const p of published) {
    const isAlreadyOnRail = railItems.some((r) => r.href === `/product/${p.slug}`);
    if (!isAlreadyOnRail && (p as any).railImage) {
      railItems.push({
        id: p.slug,
        name: p.nameEn,
        description: p.descriptionEn,
        kind: "hoodie",
        color: p.variants?.[0]?.colorHex || "#151515",
        trim: "#242424",
        tag: `${Math.round(p.basePriceMillimes / 1000)} TND`,
        details: ["450 GSM Heavy Fleece", "Exclusive Silk Edition", "Oversized Fit"],
        href: `/product/${p.slug}`,
        image: (p as any).railImage,
        backImage: (p as any).railBackImage || (p as any).railImage,
        editorialImage: (p as any).editorialImageUrl || p.images?.[0]?.url,
        bgImage: (p as any).designArtworkUrl || p.images?.[2]?.url || p.images?.[0]?.url,
      });
    }
  }

  return railItems;
}

export function SilkRailShowcase({
  eyebrow = "Physical Garment Rail • Interactive Capsule",
  heading = "The Silk Physical Rail",
  caption = "Drag to sway the garments, swipe to rotate angles, or tap any piece to open full 3D inspection.",
  className = "",
  items = SILK_RAIL_ITEMS,
  products,
  action,
}: SilkRailShowcaseProps) {
  const [activeIdx, setActiveIdx] = React.useState<number | null>(0);
  const displayItems = React.useMemo(() => {
    if (products) {
      return buildRailItems(products, items);
    }
    return items;
  }, [products, items]);

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section className={`relative overflow-hidden py-12 md:py-16 border-y border-silk-border bg-gradient-to-b from-silk-bg via-silk-cream/20 to-silk-bg ${className}`}>
      {/* Full-Section Ambient Design Artwork across entire screen width & height */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden flex items-center justify-center">
        {displayItems.map((item, idx) => {
          const isSelected = (activeIdx ?? 0) === idx;
          const bgUrl = item.bgImage || item.editorialImage || item.image;
          if (!bgUrl || !isSelected) return null;
          return (
            <div
              key={item.id}
              className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out opacity-25 dark:opacity-35 scale-100"
            >
              <img
                src={getOptimizedSrc(bgUrl, 800)}
                alt=""
                loading="lazy"
                decoding="async"
                width={800}
                height={800}
                className="w-full h-full object-contain object-center scale-[1.35] drop-shadow-[0_20px_48px_rgba(0,0,0,0.16)] filter saturate-[1.05] contrast-[1.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-silk-bg/50 via-transparent to-silk-bg/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-silk-bg/35 via-transparent to-silk-bg/35" />
            </div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClothingRailHero
          items={displayItems}
          eyebrow={eyebrow}
          heading={heading}
          caption={caption}
          hanger="matte"
          autoplay={true}
          interval={3400}
          onActiveChange={setActiveIdx}
          action={
            action || (
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-silk-black text-white hover:bg-black px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Entire Catalog</span>
                <ArrowRight size={14} />
              </Link>
            )
          }
        />
      </div>
    </section>
  );
}

export default SilkRailShowcase;
