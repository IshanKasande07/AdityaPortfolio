"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

/* ── The full statement split into word tokens ────────────────────
   Words marked with `accent: true` get the italic accent color.   */
const statementWords = [
    { text: "Open", accent: false },
    { text: "the", accent: false },
    { text: "door", accent: true },
    { text: "to", accent: false },
    { text: "marketing", accent: false },
    { text: "the", accent: false },
    { text: "internet", accent: false },
    { text: "can't", accent: true },
    { text: "ignore.", accent: true },
];

export default function Manifesto() {
    const sectionRef = useRef<HTMLElement>(null);
    const wordsContainerRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const wordsContainer = wordsContainerRef.current;
        const badge = badgeRef.current;
        const footer = footerRef.current;
        const image = imageRef.current;
        if (!section || !wordsContainer || !badge || !footer || !image) return;

        const charEls = wordsContainer.querySelectorAll<HTMLSpanElement>(".manifesto-char");

        const ctx = gsap.context(() => {
            /* ── Badge + footer + image entrance ─────────────────────────── */
            const entranceTl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
            });

            entranceTl
                .fromTo(
                    badge,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
                )
                .fromTo(
                    footer,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
                    "-=0.4"
                )
                .fromTo(
                    image,
                    { opacity: 0, scale: 0.95, y: 20 },
                    { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" },
                    "-=0.8"
                );

            /* ── Scroll-driven character reveal ─────────────────────
               Each letter transitions from dim (0.15 opacity) to full
               as the user scrolls through the section, using a stagger. */
            
            // Set initial state for all characters
            gsap.set(charEls, { opacity: 0.15 });

            gsap.to(charEls, {
                opacity: 1,
                stagger: 0.05,
                ease: "none",
                scrollTrigger: {
                    trigger: wordsContainer,
                    start: "top 85%", 
                    toggleActions: "play none none none",
                }
            });
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-background z-20 overflow-hidden"
        >


            <div className="relative w-full max-w-[1070px] mx-auto px-6 md:px-16 py-24 md:py-32 lg:py-40 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                
                {/* ── Left Column: Text ── */}
                <div className="flex flex-col items-start">
                    {/* ── Minimalist Badge ─── */}
                    <div ref={badgeRef} className="flex items-center gap-3 mb-8 md:mb-12 text-accent">
                        <span className="text-lg leading-none mt-[-2px]">✦</span>
                        <div className="w-8 h-[1px] bg-accent/40" />
                        <span
                            className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-primary/70"
                            style={{
                                fontFamily: "var(--font-space-grotesk), sans-serif",
                            }}
                        >
                            Who we are
                        </span>
                    </div>

                    {/* ── The statement — scroll-driven letter reveal ──── */}
                    <div
                        ref={wordsContainerRef}
                        className="mb-12 md:mb-16"
                        style={{
                            fontFamily: "var(--font-tiempos-headline), serif",
                        }}
                    >
                        {statementWords.map((word, i) => (
                            <span key={i} className="inline-block">
                                {word.text.split("").map((char, j) => (
                                    <span
                                        key={j}
                                        className={`manifesto-char inline text-[10vw] sm:text-[8vw] lg:text-[4.5vw] xl:text-[4vw] leading-[1.1] tracking-tight ${
                                            word.accent
                                                ? "text-accent italic font-normal"
                                                : "text-primary font-medium"
                                        }`}
                                    >
                                        {char}
                                    </span>
                                ))}
                                {/* Add a regular space after each word except the last */}
                                {i < statementWords.length - 1 && (
                                    <span className="text-[10vw] sm:text-[8vw] lg:text-[4.5vw] xl:text-[4vw]">
                                        {"\u00A0"}
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>

                    {/* ── Footer row: Services ─── */}
                    <div ref={footerRef} className="flex flex-wrap items-center gap-3 text-xs tracking-[0.15em] uppercase font-medium text-primary/40" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
                        <span>Strategy</span>
                        <div className="w-4 h-[1px] bg-primary/20" />
                        <span>Content</span>
                        <div className="w-4 h-[1px] bg-primary/20" />
                        <span>Social</span>
                        <div className="w-4 h-[1px] bg-primary/20" />
                        <span>Growth</span>
                    </div>
                </div>

                {/* ── Right Column: Image ── */}
                <div className="flex justify-center lg:justify-end items-center w-full mt-8 lg:mt-0">
                    <div 
                        ref={imageRef}
                        className="relative w-full max-w-[280px] md:max-w-[360px] lg:max-w-[400px] aspect-square rounded-2xl overflow-hidden"
                    >
                        <Image
                            src="/assets/door1.jpg"
                            alt="Open the door to marketing"
                            fill
                            className="object-cover object-center saturate-150"
                            sizes="(max-width: 1024px) 100vw, 400px"
                            priority
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
