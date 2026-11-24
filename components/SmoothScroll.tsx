"use client";

import React, { useEffect } from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    let lenisInstance: any = null;
    let tickerCb: ((time: number) => void) | null = null;
    let gsapRef: any = null;

    Promise.all([
      import("lenis"),
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([lenisMod, gsapMod, scrollTriggerMod]) => {
      if (cancelled) return;

      const Lenis = lenisMod.default;
      const gsap = gsapMod.default;
      const { ScrollTrigger } = scrollTriggerMod;
      gsapRef = gsap;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.05,
        touchMultiplier: 1.8,
      });
      lenisInstance = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      tickerCb = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerCb);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      cancelled = true;
      if (gsapRef && tickerCb) {
        gsapRef.ticker.remove(tickerCb);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}
