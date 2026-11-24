import type { Metadata } from "next";
import "./globals.css";
import { StorefrontShell } from "@/components/StorefrontShell";

export const metadata: Metadata = {
  title: "SILK — Artistic Streetwear Label",
  description: "Official store of Silk. Premium oversized streetwear hoodies with delicate botanical illustrations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-silk-black selection:text-white">
        <StorefrontShell>{children}</StorefrontShell>
      </body>
    </html>
  );
}
