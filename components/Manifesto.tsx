"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

/* ── The full statement split into word tokens ────────────────────
   Words marked with `accent: true` get the italic clay color.   */
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

const services = ["Strategy", "Content", "Social", "Growth"];

export default function Manifesto() {
    const sectionRef = useRef<HTMLElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);
    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const wordsContainerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const treelineRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const sticky = stickyRef.current;
        const imageWrapper = imageWrapperRef.current;
        const overlay = overlayRef.current;
        const badge = badgeRef.current;
        const wordsContainer = wordsContainerRef.current;
        const footer = footerRef.current;

        if (
            !section ||
            !sticky ||
            !imageWrapper ||
            !overlay ||
            !badge ||
            !wordsContainer ||
            !footer
        )
            return;

        const wordEls =
            wordsContainer.querySelectorAll<HTMLSpanElement>(".manifesto-word");

        const ctx = gsap.context(() => {
            /* ── Initial states ─────────────────────────────────── */
            gsap.set(wordEls, { opacity: 0.1, y: 30 });
            gsap.set(overlay, { opacity: 0 });
            gsap.set(badge, { opacity: 0, y: 20 });
            gsap.set(footer, { opacity: 0 });
            gsap.set(imageWrapper, {
                scale: 0.35,
                borderRadius: "24px",
            });

            /* ── Master timeline: CSS sticky + scrubbed ─────────
               We use the outer section (which has 350vh height) as the
               scroll trigger. The sticky div stays pinned natively.
               This prevents GSAP's pin-spacer from breaking downstream
               ScrollTriggers! */
            const masterTl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.8,
                },
            });

            /* ─── Phase 1: Text arrival (0 → 0.40) ────────────── */

            // Badge fades in
            masterTl.to(
                badge,
                { opacity: 1, y: 0, duration: 0.06, ease: "power2.out" },
                0
            );

            // Words reveal with stagger
            masterTl.to(
                wordEls,
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.03,
                    duration: 0.25,
                    ease: "power2.out",
                },
                0.04
            );

            // Image drifts up slightly during text reveal
            masterTl.to(
                imageWrapper,
                { y: -20, duration: 0.35, ease: "none" },
                0
            );

            /* ─── Phase 2: Image expansion (0.35 → 0.72) ──────── */

            // Image scales from small frame to full viewport
            masterTl.to(
                imageWrapper,
                {
                    scale: 1,
                    borderRadius: "0px",
                    y: 0,
                    duration: 0.35,
                    ease: "power2.inOut",
                },
                0.35
            );

            // Dark overlay fades in for text legibility
            masterTl.to(
                overlay,
                { opacity: 0.5, duration: 0.25, ease: "none" },
                0.4
            );

            // Text shifts to cream/white color for contrast
            masterTl.to(
                wordEls,
                {
                    color: "#F8F3E6",
                    textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                    duration: 0.2,
                    ease: "none",
                },
                0.42
            );

            // Badge text also shifts
            masterTl.to(
                badge,
                { color: "#F8F3E6", duration: 0.15, ease: "none" },
                0.42
            );

            // Badge line shifts
            const badgeLine = badge.querySelector(".badge-line");
            if (badgeLine) {
                masterTl.to(
                    badgeLine,
                    {
                        backgroundColor: "rgba(248,243,230,0.4)",
                        duration: 0.15,
                        ease: "none",
                    },
                    0.42
                );
            }

            /* ─── Phase 3: Resolve & hold (0.72 → 1.0) ──────── */

            // Footer fades in
            masterTl.to(
                footer,
                { opacity: 1, duration: 0.1, ease: "power2.out" },
                0.72
            );

            // Hold everything for the final stretch before unpin
            masterTl.to({}, { duration: 0.16 });
        }, section);

        return () => ctx.revert();
    }, []);

    /* ── Treeline parallax ─────────────────────────────────────── */
    useEffect(() => {
        const section = sectionRef.current;
        const treeline = treelineRef.current;
        if (!section || !treeline) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                treeline,
                { y: 80, scaleY: 0.8 },
                {
                    y: -60,
                    scaleY: 0.8,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            /* h-[300vh] provides the scroll distance for the scrubbing animation */
            className="relative w-full h-[300vh] bg-background z-20"
        >
            {/* Treeline, bottom right — sits outside the sticky wrapper */}
            <div className="absolute bottom-0 right-0 w-[52%] md:w-[38%] pointer-events-none z-[5]">
                <img
                    ref={treelineRef}
                    src="/separator/forest right seperator.webp"
                    alt=""
                    aria-hidden="true"
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        transform: "translateY(80px) scaleY(0.8)",
                        transformOrigin: "bottom center",
                        willChange: "transform",
                    }}
                    loading="lazy"
                    decoding="async"
                />
            </div>

            {/* ── CSS Sticky Container ──
                 This native sticky pinning replaces GSAP's pin: true, preventing
                 pin-spacer calculations from throwing off downstream sections. */}
            <div
                ref={stickyRef}
                className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden"
            >
                {/* ── Door image — starts small centered, scales to fill ── */}
                <div
                    ref={imageWrapperRef}
                    className="absolute inset-0 overflow-hidden"
                    style={{ willChange: "transform, border-radius" }}
                >
                    <Image
                        src="/assets/door1.jpg"
                        alt="Open the door to marketing"
                        fill
                        className="object-cover object-center"
                        style={{
                            /* Counter-scale so the image fills even when
                               the wrapper is scaled down to 0.35 */
                            transform: "scale(2.8)",
                            filter: "saturate(1.3)",
                        }}
                        sizes="100vw"
                        priority
                    />
                </div>

                {/* ── Dark overlay for text legibility during phase 2 ── */}
                <div
                    ref={overlayRef}
                    className="absolute inset-0 bg-primary/80 pointer-events-none"
                    style={{ willChange: "opacity" }}
                />

                {/* ── Text content — overlays everything ── */}
                <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-16 max-w-[900px]">
                    {/* ── Badge ── */}
                    <div
                        ref={badgeRef}
                        className="flex items-center gap-3 mb-8 md:mb-12 text-clay-deep"
                    >
                        <span className="text-lg leading-none mt-[-2px]">
                            ✦
                        </span>
                        <div className="badge-line w-8 h-[1px] bg-clay-deep/40" />
                        <span
                            className="text-xs md:text-sm tracking-[0.2em] uppercase font-medium text-primary/70"
                            style={{
                                fontFamily:
                                    "var(--font-space-grotesk), sans-serif",
                            }}
                        >
                            Who we are
                        </span>
                    </div>

                    {/* ── Statement — scroll-driven word reveal ── */}
                    <div
                        ref={wordsContainerRef}
                        className="mb-12 md:mb-16"
                        style={{
                            fontFamily:
                                "var(--font-tiempos-headline), serif",
                        }}
                    >
                        {statementWords.map((word, i) => (
                            <span
                                key={i}
                                className={`manifesto-word inline-block text-[10vw] sm:text-[7vw] md:text-[5.5vw] lg:text-[4.2vw] xl:text-[3.8vw] leading-[1.15] tracking-tight ${
                                    word.accent
                                        ? "text-clay italic font-normal"
                                        : "text-primary font-medium"
                                }`}
                                style={{
                                    willChange: "opacity, transform, color",
                                }}
                            >
                                {word.text}
                                {i < statementWords.length - 1 && (
                                    <span className="text-[10vw] sm:text-[7vw] md:text-[5.5vw] lg:text-[4.2vw] xl:text-[3.8vw]">
                                        {"\u00A0"}
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>

                    {/* ── Services footer ── */}
                    <div
                        ref={footerRef}
                        className="flex flex-wrap items-center justify-center gap-3 text-xs tracking-[0.2em] uppercase font-medium text-mist/70"
                        style={{
                            fontFamily:
                                "var(--font-space-grotesk), sans-serif",
                        }}
                    >
                        {services.map((service, i) => (
                            <span
                                key={service}
                                className="flex items-center gap-3"
                            >
                                <span>{service}</span>
                                {i < services.length - 1 && (
                                    <div className="w-4 h-[1px] bg-mist/30" />
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
