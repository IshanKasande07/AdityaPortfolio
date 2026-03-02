"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Transition C — "Scroll Overlap Stack"
 * Desktop-only (≥1024px): each .page section slides over the previous
 * like a deck of stacked cards. The covered page subtly dims and scales
 * inward, giving genuine layered depth.
 */
export default function PageStack() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const pages = gsap.utils.toArray<HTMLElement>(".page");

      pages.forEach((page, i) => {
        // Stack z-indices so later pages cover earlier ones
        gsap.set(page, {
          zIndex: i + 1,
          // All pages except the first get a rounded top edge —
          // they look like cards being dealt on top
          borderRadius: i > 0 ? "2rem 2rem 0 0" : "0",
          overflow: "hidden",
          willChange: "transform, filter",
        });

        // Pin each page while the next one slides over it
        ScrollTrigger.create({
          trigger: page,
          start: "top top",
          end: () => `+=100%`,
          pin: true,
          pinSpacing: false,
          scrub: true,
        });

        // When the next page comes over this one → dim + scale it down
        if (i < pages.length - 1) {
          const nextPage = pages[i + 1];
          ScrollTrigger.create({
            trigger: nextPage,
            start: "top 90%",
            end: "top top",
            scrub: 0.4,
            onUpdate: (self) => {
              const p = self.progress;
              gsap.set(page, {
                scale: 1 - p * 0.05,
                filter: `brightness(${1 - p * 0.25})`,
              });
            },
            onLeaveBack: () => {
              gsap.to(page, { scale: 1, filter: "brightness(1)", duration: 0.4, ease: "power2.out" });
            },
          });
        }
      });

      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    });

    return () => mm.revert();
  }, []);

  return null;
}

