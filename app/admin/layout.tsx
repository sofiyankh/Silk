import React from "react";
import { cookies } from "next/headers";
import { AdminSidebar } from "./admin-sidebar";
import { verifyAdminJWT } from "@/lib/admin-crypto";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get("silk_admin_token")?.value;

  const verified = token ? await verifyAdminJWT(token) : null;
  const isAuthenticated = verified !== null && verified.role === "ADMIN";

  // If not fully authenticated (2-step login not completed), block sidebar and render only children
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-[#f0f0f0] flex items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-[#f0f0f0] flex flex-col md:flex-row antialiased">
      <AdminSidebar adminEmail={verified.email || "admin@silk.com"} />
      <main className="flex-1 bg-[#121212] p-4 sm:p-8 lg:p-10 overflow-y-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
