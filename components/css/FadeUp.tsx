"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FadeUpDelayProps = {
  children: ReactNode;
  y?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  className?: string;
};

export default function FadeUp({
  children,
  y = 40,
  duration = 1.5,
  delay = 0,
  once = true,
  className = "",
}: FadeUpDelayProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: once
            ? "play none none none"
            : "play reverse play reverse",
        },
        clearProps: "transform",
      }
    );
  }, [y, duration, delay, once]);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
}
