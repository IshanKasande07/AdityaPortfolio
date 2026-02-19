"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PageStack() {
  useEffect(() => {
    const pages = gsap.utils.toArray<HTMLElement>(".page");

    pages.forEach((page, i) => {
      gsap.set(page, {
        zIndex: pages.length - i,
      });

      ScrollTrigger.create({
        trigger: page,
        start: "top top",
        end: () => `+=100%`,
        pin: true,
        pinSpacing: false,
        scrub: true,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
