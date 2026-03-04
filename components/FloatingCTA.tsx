"use client";

import {
    motion,
    useScroll,
    useTransform,
    useSpring,
} from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import ContactDrawer from "./ContactDrawer";

if (typeof window !== "undefined") {
    gsap.registerPlugin(MotionPathPlugin);
}

export default function FloatingCTA() {
    const btnRef = useRef<HTMLButtonElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const iconPillRef = useRef<HTMLSpanElement>(null);

    const arrowWrapperRef = useRef<HTMLDivElement>(null);
    const arrowInnerRef = useRef<HTMLDivElement>(null);

    const trailSvgRef = useRef<SVGSVGElement>(null);
    const flightPathRef = useRef<SVGPathElement>(null);
    const trailPathRef = useRef<SVGPathElement>(null);

    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const drawerOpenedRef = useRef(false);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Scroll-based visibility (Show after hero, hide at footer)
    const { scrollY } = useScroll();

    // We dynamically track the contact heading element to hide the CTA
    // exactly when it reaches the middle of the screen.
    const [contactEl, setContactEl] = useState<HTMLElement | null>(null);
    useEffect(() => {
        setContactEl(document.getElementById("contact-heading"));
    }, []);

    const { scrollYProgress: contactProgress } = useScroll({
        target: contactEl ? { current: contactEl } : undefined,
        // Start fading out when the top of the heading hits the center of viewport ("start center")
        // Fully hide it slightly above the center ("start 45%")
        offset: ["start center", "start 45%"]
    });

    // Hide at top of page
    const topOpacity = useTransform(scrollY, [300, 500], [0, 1]);
    const topY = useTransform(scrollY, [300, 500], [40, 0]);

    // Hide when Contact section reaches middle of screen
    const bottomOpacity = useTransform(contactProgress, [0, 1], [1, 0]);
    const bottomY = useTransform(contactProgress, [0, 1], [0, 40]);

    // Combine top and bottom visibilities
    const rawOpacity = useTransform(
        [topOpacity, bottomOpacity],
        ([top, bottom]) => Math.min(top as number, bottom as number)
    );
    const rawY = useTransform(
        [topY, bottomY, topOpacity],
        ([top, bottom, topOp]) => ((topOp as number) < 0.99 ? (top as number) : (bottom as number))
    );

    const opacity = useSpring(rawOpacity, { stiffness: 120, damping: 22, mass: 0.6 });
    const ySpring = useSpring(rawY, { stiffness: 120, damping: 22, mass: 0.6 });
    const pointerEvents = useTransform(rawOpacity, (v) => (v > 0.05 ? "auto" : "none"));

    // Magnetic Hover
    useEffect(() => {
        const btn = btnRef.current;
        if (!btn) return;
        const STRENGTH = 0.30;
        const onMove = (e: MouseEvent) => {
            if (isAnimating || isDrawerOpen) return;
            const rect = btn.getBoundingClientRect();
            gsap.to(btn, {
                x: (e.clientX - (rect.left + rect.width / 2)) * STRENGTH,
                y: (e.clientY - (rect.top + rect.height / 2)) * STRENGTH,
                duration: 0.4, ease: "power2.out", force3D: true,
            });
        };
        const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.55)", force3D: true });
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        return () => {
            btn.removeEventListener("mousemove", onMove);
            btn.removeEventListener("mouseleave", onLeave);
        };
    }, [isAnimating, isDrawerOpen]);

    const handleClick = useCallback(() => {
        if (isAnimating || isDrawerOpen) return;
        setIsAnimating(true);
        drawerOpenedRef.current = false;

        const btn = btnRef.current;
        const arrowW = arrowWrapperRef.current;
        const arrowI = arrowInnerRef.current;
        const trailSvg = trailSvgRef.current;
        const flightPath = flightPathRef.current;
        const trailPath = trailPathRef.current;

        if (!btn || !arrowW || !arrowI || !trailSvg || !flightPath || !trailPath || !labelRef.current) return;

        // 1. HARDCODED START POINT
        // The button is anchored with `bottom-4` (16px) and `left-1/2 -translate-x-1/2`.
        // The icon pill is w-8 h-8 (32x32px).
        // Therefore, when collapsed, the exact center of the pill is mathematically:
        // x = half of screen width
        // y = screen height - 16px (bottom-4) - 16px (half of pill) = vh - 32px
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const sx = vw / 2;
        const sy = vh - 32;

        // Path geometry
        const loopCx = vw * 0.75;  // Shifted right (was 0.65)
        const loopCy = vh * 0.45;  // Shifted down (was 0.35)
        const r = Math.min(vw, vh) * 0.08;
        const k = r * 0.5523;

        const d = `M ${sx} ${sy} 
                   C ${sx + 200} ${sy}, ${loopCx - r} ${loopCy + r * 2}, ${loopCx - r} ${loopCy}
                   C ${loopCx - r} ${loopCy - k}, ${loopCx - k} ${loopCy - r}, ${loopCx} ${loopCy - r}
                   C ${loopCx + k} ${loopCy - r}, ${loopCx + r} ${loopCy - k}, ${loopCx + r} ${loopCy}
                   C ${loopCx + r} ${loopCy + k}, ${loopCx + k} ${loopCy + r}, ${loopCx} ${loopCy + r}
                   C ${loopCx - k} ${loopCy + r}, ${loopCx - r} ${loopCy + k}, ${loopCx - r} ${loopCy}
                   C ${loopCx - r} ${loopCy - r * 2}, ${vw * 0.85} ${vh * 0.28}, ${vw + 150} ${vh * 0.45}`;

        flightPath.setAttribute("d", d);
        trailPath.setAttribute("d", d);

        const totalLength = trailPath.getTotalLength();

        // RESET: trail fully hidden, arrow at starting gate
        gsap.set(trailPath, { strokeDasharray: totalLength, strokeDashoffset: totalLength, opacity: 0 });
        gsap.set(arrowW, { x: sx - 20, y: sy - 20, opacity: 0, scale: 1 });
        gsap.set(arrowI, { rotation: 0 });

        if (tlRef.current) tlRef.current.kill();
        const tl = gsap.timeline({
            onComplete: () => {
                setIsAnimating(false);
                gsap.set(arrowW, { opacity: 0 });
            }
        });
        tlRef.current = tl;

        // ACT 1: MERGE & ANTICIPATE
        // 1. Label shrinks away. The button is flex-centered, so as the text
        // shrinks to 0, the remaining icon pill naturally arrives at the exact 
        // center of the button — exactly where `sx` and `sy` are defined above.
        tl.to(labelRef.current, {
            width: 0,
            paddingLeft: 0,
            paddingRight: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
        }, "merge");

        // 2. Crossfade: button fades out, arrow fades in at the same time
        tl.to(btnRef.current, { opacity: 0, duration: 0.15, ease: "power1.inOut" });
        tl.set(arrowW, { opacity: 1, scale: 1 }, "<");

        // 3. Anticipation: Arrow pulls back slightly and squashes
        // Also: Animate the arrow's rotation so it smoothly turns *into* the exact angle of the flight path.
        const pt0 = flightPath.getPointAtLength(0);
        const pt1 = flightPath.getPointAtLength(1);
        const startAngle = Math.atan2(pt1.y - pt0.y, pt1.x - pt0.x) * (180 / Math.PI);

        tl.to(arrowW, {
            scale: 0.8,
            rotation: startAngle,
            duration: 0.3,
            ease: "back.out(1.5)",
            force3D: true,
        });

        // A proxy { progress: 0→1 } is animated via a 3-segment speed curve.
        const flightProxy = { progress: 0 };
        // Performance: Create quickSetters outside the update loop
        // This prevents creating thousands of tween objects every second
        const setArrowX = gsap.quickSetter(arrowW, "x", "px");
        const setArrowY = gsap.quickSetter(arrowW, "y", "px");
        const setArrowRotation = gsap.quickSetter(arrowW, "rotation", "deg");
        const setTrailOpacity = gsap.quickSetter(trailPath, "opacity");
        const setTrailDashoffset = gsap.quickSetter(trailPath, "strokeDashoffset");
        const setArrowInnerRotation = gsap.quickSetter(arrowI, "rotation", "deg");

        // We set the arrow to be visible right as the speed curve begins
        tl.set(arrowW, { opacity: 1 }, "flight_start");

        const speedCurve = gsap.timeline({
            onUpdate: () => {
                const prog = flightProxy.progress;

                // 1. Position arrow & compute tangent via getPointAtLength
                // Using exact length interpolation
                const len = prog * totalLength;
                const pt = flightPath.getPointAtLength(len);
                const pt2 = flightPath.getPointAtLength(Math.min(len + 0.1, totalLength));
                const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI);

                // Apply via quickSetter (zero GC overhead)
                setArrowX(pt.x - 20);
                setArrowY(pt.y - 20);
                setArrowRotation(angle);

                // 2. Reveal trail (full path from start → arrow position)
                setTrailOpacity(prog > 0.01 ? 1 : 0);
                setTrailDashoffset(totalLength - (prog * totalLength));

                // 3. Barrel roll during loop (30% → 75%)
                if (prog > 0.3 && prog < 0.75) {
                    const loopProg = (prog - 0.3) / 0.45;
                    setArrowInnerRotation(loopProg * 360);
                }

                // 4. Trigger drawer at 80%
                if (prog > 0.8 && !drawerOpenedRef.current) {
                    drawerOpenedRef.current = true;
                    setIsDrawerOpen(true);
                }
            },
        });

        // The velocity trough — 3 segments, seamlessly chained
        speedCurve
            .to(flightProxy, { progress: 0.3, duration: 0.20, ease: "none" })   // Launch (medium)
            .to(flightProxy, { progress: 0.75, duration: 0.50, ease: "none" })  // Loop (slow — long duration = slow speed)
            .to(flightProxy, { progress: 1, duration: 0.10, ease: "none" });    // Exit (fast — short duration = high speed)

        // Connect flight sequentially, no fighting overlap
        tl.add(speedCurve);

        // ACT 3: TRAIL PERSISTENCE — glow stays, then fades
        tl.to(trailPath, { opacity: 0, duration: 0.8, ease: "power1.inOut" }, "+=0.2");

    }, [isAnimating, isDrawerOpen]);

    const handleDrawerClose = useCallback(() => {
        setIsDrawerOpen(false);
        drawerOpenedRef.current = false;
        if (btnRef.current) gsap.set(btnRef.current, { scale: 1, opacity: 1, clearProps: "all" });
        if (labelRef.current) gsap.set(labelRef.current, { clearProps: "all" });
    }, []);

    return (
        <>
            {/* SVG Trail Overlay */}
            <svg ref={trailSvgRef} className="fixed top-0 left-0 z-[10001] pointer-events-none w-screen h-screen" fill="none">
                <path ref={flightPathRef} d="" fill="none" stroke="none" />
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id="trail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFC300" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#FFC300" stopOpacity="1" />
                    </linearGradient>
                </defs>
                <path
                    ref={trailPathRef}
                    d=""
                    fill="none"
                    stroke="url(#trail-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    filter="url(#glow)"
                />
            </svg>

            {/* The Arrow */}
            <div ref={arrowWrapperRef} className="fixed top-0 left-0 z-[10002] pointer-events-none opacity-0">
                <div ref={arrowInnerRef} className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ background: "#FFC300", boxShadow: "0 0 30px rgba(255,195,0,0.7)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* Floating Button */}
            <motion.div
                style={{
                    opacity: isDrawerOpen ? 0 : opacity,
                    y: ySpring,
                    pointerEvents: isDrawerOpen || isAnimating ? "none" : pointerEvents,
                }}
                className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]"
            >
                <button
                    ref={btnRef}
                    onClick={handleClick}
                    className="group relative flex items-center gap-2 rounded-full overflow-hidden will-change-transform cursor-pointer"
                    style={{ padding: "0" }}
                >
                    <span ref={labelRef} className="relative overflow-hidden rounded-full font-medium whitespace-nowrap text-black group-hover:text-white transition-colors duration-300">
                        <span className="absolute inset-0 bg-accent rounded-full -z-10" />
                        <span className="absolute inset-0 bg-[#27701B] rounded-full -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                        <span className="relative z-10 block px-5 py-2.5 text-xs md:text-sm leading-none">
                            Book a Call
                        </span>
                    </span>

                    <span ref={iconPillRef} className="relative flex items-center justify-center w-9 h-9 rounded-full overflow-hidden">
                        <span className="absolute inset-0 bg-accent rounded-full -z-10" />
                        <span className="absolute inset-0 bg-[#27701B] rounded-full -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] delay-75" />
                        <span className="relative z-10 w-5 h-5 flex items-center justify-center overflow-hidden">
                            <span className="absolute inset-0 flex items-center justify-center -rotate-45 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-current text-black group-hover:text-white transition-colors duration-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                            <span className="absolute inset-0 flex items-center justify-center -rotate-45 -translate-x-[150%] translate-y-[150%] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-0 group-hover:translate-y-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-current text-black group-hover:text-white transition-colors duration-300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                        </span>
                    </span>
                </button>
            </motion.div>

            <ContactDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} />
        </>
    );
}
