import type { Metadata } from "next";
import Script from "next/script";
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
        <Script id="gebrush-ui" strategy="afterInteractive">
          {`(function () {
    function gebrush() {
        const selectors = [
            '.nl-wrap',
            '#nl-card',
            '#nl-badge'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.classList.add('gebrush');
            });
        });
    }

    // Initial execution
    gebrush();

    // Monitor dynamically added elements
    const observer = new MutationObserver(() => {
        gebrush();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();`}
        </Script>
      </body>
    </html>
  );
}
