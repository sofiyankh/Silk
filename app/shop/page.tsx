import React from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { withRetry } from "@/lib/with-retry";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters } from "./shop-filters";

export const revalidate = 60; // ISR cache 60s

interface ShopPageProps {
  searchParams: {
    category?: string;
    size?: string;
    color?: string;
    q?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, size, color, q, sort } = searchParams;

  // Build Prisma query
  const whereClause: any = {
    isPublished: true,
  };

  if (category && category !== "all") {
    whereClause.category = { slug: category };
  }

  if (q) {
    whereClause.OR = [
      { nameEn: { contains: q } },
      { nameFr: { contains: q } },
      { descriptionEn: { contains: q } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { basePriceMillimes: "asc" };
  if (sort === "price-desc") orderBy = { basePriceMillimes: "desc" };

  const [products, categories] = await withRetry(() =>
    Promise.all([
      db.product.findMany({
        where: whereClause,
        include: {
          images: { orderBy: { position: "asc" } },
          category: true,
          variants: true,
        },
        orderBy,
      }),
      db.category.findMany(),
    ])
  );

  // Filter in-memory for size and color if variants match
  const filteredProducts = products.filter((product) => {
    if (size) {
      const hasSize = product.variants.some((v) => v.size.toLowerCase() === size.toLowerCase());
      if (!hasSize) return false;
    }
    if (color) {
      const hasColor = product.variants.some((v) => v.color.toLowerCase().includes(color.toLowerCase()));
      if (!hasColor) return false;
    }
    return true;
  });

  return (
    <div className="pb-20">
      {/* Editorial Category Banner */}
      <div className="relative w-full h-48 sm:h-64 bg-silk-black overflow-hidden flex items-center justify-center text-white mb-10">
        <Image
          src="/brand/models/editorial/white-hoodie-portrait-800w.webp"
          alt="Silk Hoodies Collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-30 filter grayscale"
        />
        <div className="relative z-10 text-center space-y-2 px-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/70 block">
            Autumn / Winter Archive
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight">
            {category ? category.toUpperCase() : "HOODIES"}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-light tracking-wide">
            Comfort meets style. Heavyweight streetwear engineered for every day.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-silk-border text-xs text-silk-grey gap-2">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-black">
              Shop
            </Link>
            {category && (
              <>
                <span>/</span>
                <span className="capitalize text-silk-black font-medium">{category}</span>
              </>
            )}
          </div>
          <span className="text-silk-charcoal font-medium">
            Showing {filteredProducts.length} pieces
          </span>
        </div>

        {/* Layout: Sidebar Filters + Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-1">
            <ShopFilters categories={categories} />
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-silk-border p-8 space-y-4">
                <p className="text-silk-grey text-sm">No products found matching your active filters.</p>
                <Link
                  href="/shop"
                  className="inline-block text-xs uppercase font-medium tracking-widest bg-silk-black text-white px-5 py-2.5"
                >
                  Reset All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    slug={product.slug}
                    name={product.nameEn}
                    priceMillimes={product.basePriceMillimes}
                    compareAtMillimes={product.compareAtMillimes}
                    image={product.images[0]?.url || "/brand/products/butterfly-hoodie/front.jpg"}
                    secondImage={product.images[1]?.url}
                    isNew={product.isNew}
                    priority={index < 4}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
