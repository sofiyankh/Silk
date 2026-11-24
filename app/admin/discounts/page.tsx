import React from "react";
import { db } from "@/lib/db";
import { DiscountsManager } from "./discounts-manager";

export const revalidate = 0;

export default async function AdminDiscountsPage() {
  const discounts = await db.discount.findMany({
    orderBy: { startsAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#252525] gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">
            Promotional Coupons ({discounts.length})
          </h1>
          <p className="text-xs text-[#888888] mt-0.5">
            Full Discount CRUD: Create, toggle active states, manage limits and audit usage
          </p>
        </div>
      </div>

      <DiscountsManager initialDiscounts={discounts} />
    </div>
  );
}
