"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "@/components/icons";

export function DashboardSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/admin/orders`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full sm:w-80">
      <Search size={14} className="absolute left-3 top-3 text-[#666666]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search orders, clients, phones..."
        className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded text-xs pl-8 pr-3 py-2 text-white placeholder-[#666666] focus:outline-none focus:border-[#555555] transition"
      />
    </form>
  );
}
