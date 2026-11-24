import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { withRetry } from "@/lib/with-retry";
import { ProductInteractive } from "./product-interactive";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 60; // ISR cache 60s

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = params;

  const [product, related] = await withRetry(() =>
    Promise.all([
      db.product.findUnique({
        where: { slug },
        include: {
          images: { orderBy: { position: "asc" } },
          variants: true,
          category: true,
        },
      }),
      db.product.findMany({
        where: {
          isPublished: true,
          slug: { not: slug },
        },
        include: {
          images: { orderBy: { position: "asc" } },
        },
        take: 4,
      }),
    ])
  );

  if (!product) {
    notFound();
  }

  return (
    <div className="pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-silk-grey mb-8">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black">
            Shop
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-black">
                {product.category.nameEn}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-silk-black font-medium">{product.nameEn}</span>
        </nav>

        {/* Main PDP Grid */}
        <ProductInteractive product={product} />

        {/* Related Products: YOU MAY ALSO LIKE */}
        {related.length > 0 && (
          <div className="mt-24 pt-12 border-t border-silk-border">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-silk-black mb-8 text-center sm:text-left">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  slug={item.slug}
                  name={item.nameEn}
                  priceMillimes={item.basePriceMillimes}
                  compareAtMillimes={item.compareAtMillimes}
                  image={item.images[0]?.url || "/brand/products/butterfly-hoodie/front.jpg"}
                  secondImage={item.images[1]?.url}
                  isNew={item.isNew}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
