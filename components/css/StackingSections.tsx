"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StackingSections() {
  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".stack-section");

    sections.forEach((section, i) => {
      gsap.set(section, {
        zIndex: sections.length - i,
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: false,
        scrub: true,
      });
    });

    return () => ScrollTrigger.killAll();
  }, []);

  return null;
}
