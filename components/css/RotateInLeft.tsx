"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RotateInProps = {
  children: ReactNode;
  from?: "bottom-left" | "bottom-right";
  rotate?: number;
  x?: number;
  y?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  className?: string;
};

export default function RotateInLeft({
  children,
  from = "bottom-left",
  rotate = 12,
  x = 80,
  y = 80,
  duration = 1.5,
  delay = 0,
  once = false,
  className = "",
}: RotateInProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const isLeft = from === "bottom-left";

    gsap.fromTo(
      el,
      {
        opacity: 0,
        rotate: isLeft ? -rotate : rotate,
        x: isLeft ? -x : x,
        y,
        transformOrigin: isLeft ? "0% 100%" : "100% 100%",
      },
      {
        opacity: 1,
        rotate: 0,
        x: 0,
        y: 0,
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
  }, [from, rotate, x, y, duration, delay, once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}
