"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Share2, Film, Lightbulb, BarChart3, Search } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// 5 evenly-spaced angles (deg), clockwise from top
const ORBIT_ANGLES_DEG = [-90, -18, 54, 126, 198];

// How far outside the circle edge to park labels — pushed clearly beyond the ring
const ORBIT_EXTRA = 1.4;

// Scale factor when parked at circumference
const ORBIT_SCALE = 0.75;

// Minimum clear space (px) between a parked label center and the viewport edge
const VIEWPORT_PAD_X = 90;
const VIEWPORT_PAD_Y = 100;

// Per-item manual nudges (px) applied AFTER orbit clamping for fine-tuning placement
// [dx_extra, dy_extra]  — positive x = right, positive y = down
const ORBIT_NUDGE: [number, number][] = [
    [0, 20],   // 0: Social Media   — push down
    [-35, 0],   // 1: Post Production — push further left
    [0, 0],   // 2: Creative Strategy — perfect
    [0, 0],   // 3: Performance Marketing — perfect
    [40, 0],   // 4: SEO — push further right
];

const contents = [
    {
        icon: <Share2 className="w-14 h-14 text-accent" />,
        title: "Social Media Marketing",
        desc: "Dominate the feed with content that stops the scroll and builds real, lasting engagement.",
    },
    {
        icon: <Film className="w-14 h-14 text-accent" />,
        title: "Post Production",
        desc: "High-end visual storytelling that turns raw footage into cinematic brand experiences.",
    },
    {
        icon: <Lightbulb className="w-14 h-14 text-accent" />,
        title: "Creative Strategy",
        desc: "Data-driven creative directions designed to align your brand perfectly with your market.",
    },
    {
        icon: <BarChart3 className="w-14 h-14 text-accent" />,
        title: "Performance Marketing",
        desc: "Aggressive, ROI-focused campaigns designed to scale your revenue and outperform competition.",
    },
    {
        icon: <Search className="w-14 h-14 text-accent" />,
        title: "SEO",
        desc: "Master the search engine landscape and secure long-term organic growth.",
    },
];

const ImpactSection = () => {
    const containerRef = useRef<HTMLElement>(null);
    const ringRef = useRef<SVGSVGElement>(null);
    const arrowsRef = useRef<HTMLDivElement>(null);

    // Each service: one "group" div (icon + heading + subtext) that physically moves
    const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
    const subRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!containerRef.current || !ringRef.current) return;

        // Wait one frame so the layout has settled and getBoundingClientRect is accurate
        const raf = requestAnimationFrame(() => {
            const ringRect = ringRef.current!.getBoundingClientRect();
            const radius = ringRect.width / 2; // actual px radius of the rendered circle

            const ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.5,
                    },
                });

                // Continuous ring + arrows rotation
                tl.to([ringRef.current, arrowsRef.current], {
                    rotation: 360,
                    ease: "none",
                    duration: 1,
                }, 0);

                // Each service gets a 0.2 slot of the scroll range
                // Timeline phases within each slot:
                //  0.00 – 0.07 : group fades/slides in at center (full size)
                //  0.07 – 0.12 : fully visible (icon + heading + subtext)
                //  0.12 – 0.16 : subtext fades out
                //  0.16 – 0.20 : group translates to circumference & shrinks (ORBIT_SCALE)
                // After 0.20   : group stays parked indefinitely (no more tweens)

                const SLOT = 0.2;

                contents.forEach((_, idx) => {
                    const base = idx * SLOT;
                    const groupEl = groupRefs.current[idx];
                    const subEl = subRefs.current[idx];

                    if (!groupEl || !subEl) return;

                    // Ideal orbit position (clear of circle edge)
                    const angleDeg = ORBIT_ANGLES_DEG[idx];
                    const angle = (angleDeg * Math.PI) / 180;
                    const orbitR = radius * ORBIT_EXTRA;
                    const rawDx = orbitR * Math.cos(angle);
                    const rawDy = orbitR * Math.sin(angle);

                    // Clamp independently per axis so nothing ever leaves the viewport
                    const maxDx = window.innerWidth / 2 - VIEWPORT_PAD_X;
                    const maxDy = window.innerHeight / 2 - VIEWPORT_PAD_Y;
                    const dx = Math.sign(rawDx) * Math.min(Math.abs(rawDx), maxDx) + ORBIT_NUDGE[idx][0];
                    const dy = Math.sign(rawDy) * Math.min(Math.abs(rawDy), maxDy) + ORBIT_NUDGE[idx][1];

                    // --- Phase 1: appear at center ---
                    tl.fromTo(
                        groupEl,
                        { autoAlpha: 0, y: 40, x: 0, scale: 1 },
                        { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: 0.07, ease: "power2.out" },
                        base
                    );

                    // --- Phase 2: subtext fades out ---
                    tl.to(
                        subEl,
                        { autoAlpha: 0, y: -10, duration: 0.04, ease: "power2.in" },
                        base + 0.12
                    );

                    // --- Phase 3: move to circumference (real x/y motion + shrink) ---
                    tl.to(
                        groupEl,
                        {
                            x: dx,
                            y: dy,
                            scale: ORBIT_SCALE,
                            duration: 0.07,
                            ease: "power2.inOut",
                        },
                        base + 0.14
                    );
                    // No fade-out — stays parked at circumference
                });
            }, containerRef);

            return () => ctx.revert();
        });

        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section id="impact" ref={containerRef} className="relative w-full h-[600vh] bg-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* Background Ellipse */}
                <svg
                    className="absolute w-full max-w-[1418px] opacity-40 pointer-events-none"
                    viewBox="0 0 1418 525"
                    fill="none"
                >
                    <ellipse
                        cx="709" cy="262.5" rx="708" ry="261.5"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        strokeDasharray="0.1 3"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Rotating Ring */}
                <svg
                    ref={ringRef}
                    className="absolute w-[55vw] max-w-[360px] h-auto pointer-events-none will-change-transform transform-gpu"
                    viewBox="0 0 542 540"
                    fill="none"
                >
                    <circle
                        cx="271" cy="270" r="269"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="2"
                        strokeDasharray="0.1 3"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Orbiting Arrows Container */}
                <div
                    ref={arrowsRef}
                    className="absolute w-[55vw] max-w-[360px] aspect-square rounded-full pointer-events-none will-change-transform transform-gpu"
                >
                    {[
                        "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90",
                        "top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rotate-180",
                        "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-[270deg]",
                        "top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rotate-0",
                    ].map((cls, i) => (
                        <div key={i} className={`absolute ${cls}`}>
                            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" className="fill-white">
                                <path d="M8 0L16 14H0L8 0Z" />
                            </svg>
                        </div>
                    ))}
                </div>

                {/* ── Service Cards ─────────────────────────────────────────
                    Each card is absolutely centered (inset-0 + flex center).
                    GSAP animates it via x / y / scale to fly it to the orbit spot.
                    transformOrigin is kept at "center center" so scale anchors to the element center.
                ─────────────────────────────────────────────────────────── */}
                {contents.map((content, idx) => (
                    <div
                        key={idx}
                        // Invisible, positioned to fill the sticky viewport center
                        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 invisible"
                        ref={el => { groupRefs.current[idx] = el; }}
                        style={{ transformOrigin: "center center" }}
                    >
                        {/*
                            Inner wrapper: flex-col so icon is always above heading.
                            Width is constrained so it doesn't stretch.
                        */}
                        <div className="flex flex-col items-center gap-3 w-[220px]">
                            {/* Icon */}
                            <div>{content.icon}</div>

                            {/* Heading */}
                            <h2 className="text-[22px] font-display font-semibold text-[#F5F5F0] tracking-tight text-center leading-tight">
                                {content.title}
                            </h2>

                            {/* Subtext — separate ref so GSAP can fade only this */}
                            <div
                                ref={el => { subRefs.current[idx] = el; }}
                                className="w-full"
                            >
                                <p className="text-[13px] text-[#9CA3AF] font-light leading-relaxed text-center">
                                    {content.desc}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </section>
    );
};

export default ImpactSection;