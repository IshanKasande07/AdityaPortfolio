"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LenisProvider({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
    gsap.registerPlugin(ScrollTrigger);

    // PERF: Defer Lenis init until the page is fully loaded.
    // During the reveal animation, scroll is locked (overflow: hidden),
    // so Lenis running its RAF loop during that period is pure waste.
    let lenis;
    let rafCleanup;

    const initLenis = () => {
      lenis = new Lenis({
        duration: 1.2,        // scroll smoothness
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false,
      });

      if (typeof window !== "undefined") {
        window.lenis = lenis;
      }

      lenis.on('scroll', ScrollTrigger.update);

      function update(time) {
        lenis.raf(time * 1000);
      }

      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);

      // Sync Lenis with GSAP ScrollTrigger updates (e.g. pin spacers changing document height)
      const handleRefresh = () => {
        lenis.resize();
      };
      ScrollTrigger.addEventListener("refresh", handleRefresh);

      rafCleanup = () => {
        ScrollTrigger.removeEventListener("refresh", handleRefresh);
        if (typeof window !== "undefined" && window.lenis === lenis) {
          window.lenis = undefined;
        }
        lenis.destroy();
        gsap.ticker.remove(update);
      };
    };

    if (document.readyState === "complete") {
      // Page already loaded (e.g. SPA navigation)
      initLenis();
    } else {
      // Wait for page to fully load before starting the RAF loop
      window.addEventListener("load", initLenis, { once: true });
    }

    return () => {
      window.removeEventListener("load", initLenis);
      if (rafCleanup) rafCleanup();
    };
  }, []);

  return children;
}
