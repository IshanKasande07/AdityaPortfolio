"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stories = [
  {
    eyebrow: "01 / Attention",
    title: "Short-form",
    desc: "We engineer hooks that stop the scroll and retain fractured attention across TikTok, Reels, and Shorts.",
    img: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2940&auto=format&fit=crop",
  },
  {
    eyebrow: "02 / Depth",
    title: "Long-form",
    desc: "Documentary-style YouTube narratives that build lasting authority and deep parasocial trust.",
    img: "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=2940&auto=format&fit=crop",
  },
  {
    eyebrow: "03 / Impact",
    title: "Campaigns",
    desc: "Multi-channel brand pushes that convert earned trust into measurable demand.",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2942&auto=format&fit=crop",
  },
  {
    eyebrow: "04 / Aesthetic",
    title: "Graphics",
    desc: "High-end visual communication that elevates perception instantly.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop",
  },
];

export default function CinematicFilmstrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const parallaxWrapperRef = useRef<HTMLDivElement>(null);
  
  const railRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const pinWrapper = pinWrapperRef.current;
    const parallaxWrapper = parallaxWrapperRef.current;
    const rail = railRef.current;
    const container = containerRef.current;

    if (!section || !pinWrapper || !rail || !parallaxWrapper || !container) return;

    const ctx = gsap.context(() => {
      // ── Horizontal Scroll ───────────────────────────────────────────
      const getScrollAmount = () => -(rail.scrollWidth - window.innerWidth);
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapper,
          start: "top top",
          end: () => `+=${rail.scrollWidth}`, // dynamically based on rail width
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      tl.to(rail, {
        x: getScrollAmount,
        ease: "none",
      });

      // ── Entry Parallax ──────────────────────────────────────────────
      gsap.fromTo(parallaxWrapper,
        { y: 150 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top top",
            scrub: true,
          }
        }
      );

    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative z-20">
      <section
        ref={sectionRef}
        id="filmstrip"
        aria-label="Storytelling Portfolio"
        className="relative w-full z-20 -mt-12 md:-mt-24"
      >
        <div ref={pinWrapperRef} className="relative w-full h-screen z-20">
          <div 
            ref={parallaxWrapperRef} 
            className="w-full h-full relative origin-bottom bg-background overflow-hidden rounded-t-[3rem] md:rounded-t-[4rem] flex flex-col justify-center"
          >
            {/* Grain */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none z-0 opacity-[0.035]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: "180px 180px",
              }}
            />

            {/* Static Header */}
            <div 
              ref={headerRef}
              className="absolute top-12 md:top-24 left-0 w-full px-[clamp(1.5rem,5vw,6rem)] z-30 pointer-events-none"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-accent text-sm leading-none" aria-hidden="true">✦</span>
                  <span className="text-[10px] uppercase tracking-[0.28em] font-medium text-primary/60" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                    Selected Work
                  </span>
                </div>
                <h2 
                  className="text-primary font-display text-4xl md:text-5xl lg:text-6xl font-normal italic tracking-tight"
                  style={{ fontFamily: "var(--font-tiempos-headline), serif" }}
                >
                  The <span className="text-accent font-semibold not-italic">Proof.</span>
                </h2>
              </div>
            </div>

            {/* Horizontal Rail */}
            <div 
              ref={railRef} 
              className="flex items-center gap-6 md:gap-12 pl-[clamp(1.5rem,5vw,6rem)] h-[55vh] md:h-[65vh] pt-24 md:pt-16 z-10 w-max"
            >
              {stories.map((story, i) => (
                <div 
                  key={i} 
                  className="w-[85vw] md:w-[60vw] lg:w-[45vw] max-w-[900px] h-full relative rounded-[2rem] md:rounded-[3rem] overflow-hidden group shrink-0 flex flex-col justify-end shadow-2xl"
                  style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <Image 
                    src={story.img} 
                    alt={story.title} 
                    fill 
                    className="object-cover object-center scale-[1.01] group-hover:scale-105 transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,1,0.2,1)]" 
                    sizes="(max-width: 768px) 85vw, 60vw"
                  />
                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11250E]/95 via-[#11250E]/30 to-transparent pointer-events-none" />
                  
                  {/* Card Content */}
                  <div className="relative z-10 p-6 md:p-10 lg:p-12 flex flex-col gap-3 md:gap-4 pointer-events-auto max-w-[85%]">
                    <span 
                      className="text-accent text-[10px] md:text-xs uppercase tracking-[0.24em] font-bold"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {story.eyebrow}
                    </span>
                    <h3 
                      className="text-[#F8F3E6] text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.05]"
                      style={{ fontFamily: "var(--font-tiempos-headline), serif" }}
                    >
                      {story.title}
                    </h3>
                    <p 
                      className="text-[#F8F3E6]/70 text-sm md:text-base leading-relaxed"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      {story.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* Extra spacing block at the end so the last card isn't glued to the edge of the screen */}
              <div className="w-[10vw] shrink-0" aria-hidden="true" />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
