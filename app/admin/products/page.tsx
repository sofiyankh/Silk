import React from "react";
import { db } from "@/lib/db";
import { ProductsManager } from "./products-manager";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">
            Catalog Products ({products.length})
          </h1>
          <p className="text-xs text-[#888888] mt-0.5">
            Full Product CRUD: Add new designs, edit prices, manage variants & publication
          </p>
        </div>
      </div>

      <ProductsManager initialProducts={products} />
    </div>
  );
}
