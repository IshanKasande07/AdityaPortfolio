"use client";

import React, { useRef, useEffect, useState } from "react";
import FadeUp from "./css/FadeUp";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const brandLogos = [
    { src: "/logos/1.webp", scale: 1.5 },
    { src: "/logos/2.webp", scale: 1.5 },
    { src: "/logos/3.webp", scale: 1.5 },
    { src: "/logos/4.webp", scale: 1.5 },
    { src: "/logos/5.webp", scale: 1.5 },
    { src: "/logos/6.webp", scale: 1.5 },
    { src: "/logos/7.webp", scale: 1.5 },
    { src: "/logos/8.webp", scale: 1.5 },
    { src: "/logos/9.webp" },
    { src: "/logos/10.webp" },
    { src: "/logos/11.webp" },
    { src: "/logos/12.webp", scale: 3.0 },
    { src: "/logos/Akshay PAtra Black.webp" },
    { src: "/logos/Biosun white.webp" },
    { src: "/logos/Debridge - White.webp" },
    { src: "/logos/Ishita Sakuja White.webp", scale: 2.0 },
    { src: "/logos/SSB White.webp" },
    { src: "/logos/Waddle White.webp" },
    { src: "/logos/decstudio.webp" },
    { src: "/logos/nugget by zomato.webp" },
    { src: "/logos/vandan white.webp", scale: 2.0 }
];

const LogoCard = ({ src, isLarge, manualScale = 1 }: { src: string; isLarge: boolean; manualScale?: number }) => {
    const s = isLarge ? 1.25 * manualScale : 0.85 * manualScale;
    return (
        <div className="logo-card">
            <img
                src={src}
                alt=""
                aria-hidden="true"
                className="logo-img"
                style={{ transform: `scale(${s})` }}
                loading="lazy"
                decoding="async"
            />
        </div>
    );
};

const CSSCarousel = ({ items, reverse, isLarge }: { items: { src: string; scale?: number }[]; reverse?: boolean; isLarge: boolean }) => {
    // Duplicate items for seamless loop
    const doubled = [...items, ...items];
    return (
        <div className="carousel-track-container">
            <div className={`carousel-track ${reverse ? "carousel-reverse" : ""}`}>
                {doubled.map((item, i) => (
                    <LogoCard
                        key={`${item.src}-${i}`}
                        src={item.src}
                        isLarge={isLarge}
                        manualScale={item.scale || 1}
                    />
                ))}
            </div>
        </div>
    );
};

const BrandsWhoTrustUs = () => {
    const row1 = brandLogos.slice(0, 11);
    const row2 = brandLogos.slice(11);

    const containerRef = useRef<HTMLDivElement>(null);
    const separatorRef = useRef<HTMLImageElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!containerRef.current || !separatorRef.current) return;
        
        // Use GSAP ScrollTrigger for parallax instead of a manual scroll listener.
        // Manual scroll listeners with getBoundingClientRect cause layout thrashing,
        // especially when Lenis smooth scrolling is active.
        const ctx = gsap.context(() => {
            gsap.fromTo(separatorRef.current, 
                { y: 75, scaleY: 0.8 }, 
                { 
                    y: -75, 
                    scaleY: 0.8,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                }
            );
        });

        return () => ctx.revert();
    }, []);

    // PERF: Pause the infinite carousel CSS animations when the section
    // is scrolled off-screen. Two continuously animating translateX tracks
    // with ~42 logo images each waste GPU compositor budget when invisible.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { rootMargin: "100px" } // start slightly before entering viewport
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <style jsx global>{`
                .carousel-track-container {
                    overflow: hidden;
                    width: 100%;
                    padding: 5px 0;
                    contain: layout style paint;
                }

                .carousel-track {
                    display: flex;
                    width: max-content;
                    animation: scroll-left 35s linear infinite;
                }

                .carousel-offscreen .carousel-track {
                    animation-play-state: paused;
                }

                .carousel-track:hover {
                    animation-play-state: paused;
                }

                .carousel-reverse {
                    animation-name: scroll-right;
                }

                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                @keyframes scroll-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }

                .logo-card {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px 20px;
                    border: 1px solid rgba(248, 243, 230, 0.08);
                    border-radius: 12px;
                    background: rgba(248, 243, 230, 0.025);
                    width: 150px;
                    height: 92px;
                    margin: 0 5px;
                    transition: background-color 0.45s cubic-bezier(.22, 1, .36, 1), transform 0.45s cubic-bezier(.22, 1, .36, 1);
                }

                .logo-card:hover {
                    background: rgba(248, 243, 230, 0.08);
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .logo-card {
                        width: 112px;
                        height: 72px;
                        padding: 12px 14px;
                        margin: 0 4px;
                    }
                }

                .logo-img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    filter: brightness(0) invert(1);
                    opacity: 0.66;
                    transition: opacity 0.45s cubic-bezier(.22, 1, .36, 1);
                }

                .logo-card:hover .logo-img {
                    opacity: 1;
                }

                .trust-section {
                    position: relative;
                    z-index: 30;
                    width: 100%;
                    overflow: visible;
                    padding: 64px 24px 144px;
                    background: var(--color-background);
                }

                .trust-header {
                    position: relative;
                    z-index: 4;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    width: min(1070px, 100%);
                    margin-inline: auto;
                    text-align: center;
                    padding: 20px 24px 36px;
                }

                .trust-heading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: clamp(20px, 4vw, 56px);
                    width: 100%;
                    max-width: 100%;
                    color: var(--color-background);
                    font: 400 clamp(32px, 3.5vw, 48px)/1.15 var(--font-tiempos-headline), Georgia, serif;
                    letter-spacing: -.025em;
                    text-wrap: balance;
                }

                .trust-heading em {
                    color: #c4d67e;
                    font-weight: 400;
                }

                .trust-copy {
                    max-width: 58ch;
                    margin: 24px auto 0;
                    text-align: center;
                    color: var(--color-muted);
                    font: 400 16px/1.65 var(--font-space-grotesk), Arial, sans-serif;
                }

                .trust-copy strong {
                    color: var(--color-primary);
                    font-weight: 400;
                }

                .logo-stage {
                    position: relative;
                    z-index: 2;
                    width: min(1120px, 100%);
                    margin: 0 auto;
                    padding: 24px 0;
                    overflow: hidden;
                    border-radius: 28px;
                    background: var(--color-primary);
                    box-shadow: 0 24px 64px rgba(17, 37, 14, .14);
                    isolation: isolate;
                }

                .logo-stage::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                    pointer-events: none;
                    background: radial-gradient(circle at 18% 0%, rgba(137, 162, 54, .14), transparent 34%);
                }

                .logo-stage__rows {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    width: 100%;
                    overflow: hidden;
                }

                .logo-stage__fade {
                    position: absolute;
                    z-index: 3;
                    top: 0;
                    bottom: 0;
                    width: clamp(44px, 11vw, 150px);
                    pointer-events: none;
                }

                .logo-stage__fade--left {
                    left: 0;
                    background: linear-gradient(90deg, var(--color-primary), rgba(17, 37, 14, .88) 35%, transparent);
                }

                .logo-stage__fade--right {
                    right: 0;
                    background: linear-gradient(270deg, var(--color-primary), rgba(17, 37, 14, .88) 35%, transparent);
                }

                @media (max-width: 767px) {
                    .trust-section { padding: 48px 20px 112px; }
                    .trust-header { padding: 16px 24px 28px; }
                    .trust-copy { max-width: 36ch; font-size: 16px; }
                    .logo-stage { width: calc(100% + 40px); margin: 0 0 0 -20px; padding: 18px 0; border-radius: 0; box-shadow: none; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .carousel-track { animation-play-state: paused; }
                }
            `}</style>

            <section
                ref={containerRef}
                className="trust-section"
            >

                <div className="w-full relative z-10">
                    <div className={`logo-stage${!isVisible ? " carousel-offscreen" : ""}`}>
                    <FadeUp>
                        <div className="trust-header">
                            <h2 className="trust-heading">
                                <span>Brands who <em>trust us.</em></span>
                            </h2>
                        </div>
                    </FadeUp>

                        <div className="logo-stage__fade logo-stage__fade--left" />
                        <div className="logo-stage__fade logo-stage__fade--right" />

                        <div className="logo-stage__rows">
                            <CSSCarousel items={row1} isLarge={true} />
                            <CSSCarousel items={row2} reverse isLarge={false} />
                        </div>
                    </div>
                    <p className="trust-copy">
                        We collaborate with visionary companies who demand nothing less than <strong>extraordinary.</strong>
                    </p>
                </div>

                {/* Forest separator overlay on bottom right, overlapping Brands section */}
                <div
                    className="absolute right-0 pointer-events-none z-30"
                    style={{ width: "50%", bottom: "-230px" }}
                >
                    <img
                        ref={separatorRef}
                        src="/separator/forest right seperator.webp"
                        alt=""
                        aria-hidden="true"
                        style={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                            transform: "translateY(0px) scaleY(0.8)",
                            transformOrigin: "bottom center",
                            willChange: "transform",
                        }}
                        loading="lazy"
                        decoding="async"
                    />
                </div>
            </section>
        </>
    );
};

export default BrandsWhoTrustUs;
