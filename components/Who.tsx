"use client"

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

/* ─── Data ─── */
import {
    Sparkles, TrendingUp, Anchor, Gem,
    Zap, Compass, SquareSquare, Hourglass
} from 'lucide-react'

const forPoints = [
    { text: "Real expertise worth sharing.", icon: Sparkles },
    { text: "Long-term authority over virality.", icon: TrendingUp },
    { text: "Brand depth over surface metrics.", icon: Anchor },
    { text: "Ready to invest in content.", icon: Gem },
]
const notForPoints = [
    { text: "Viral clips without substance.", icon: Zap },
    { text: "Chasing trends, no core message.", icon: Compass },
    { text: "Content as a checkbox.", icon: SquareSquare },
    { text: "Expecting overnight results.", icon: Hourglass },
]

/* ─── Main Component ─── */
export default function Who() {
    const pinWrapRef = useRef<HTMLDivElement>(null)
    const sectionRef = useRef<HTMLDivElement>(null)
    const notWordRef = useRef<HTMLSpanElement>(null)
    const forWordRef = useRef<HTMLSpanElement>(null)
    const phaseRef = useRef(0)
    const [phase, setPhase] = useState(0)
    const pointRefs = useRef<(HTMLDivElement | null)[]>([])

    /* ─── Animate "not " insertion/removal ─── */
    const swapPhase = (to: number, dir: 1 | -1) => {
        const el = sectionRef.current
        const notEl = notWordRef.current
        if (!el || !notEl) return

        if (to === 1) {
            gsap.to(notEl, {
                width: notEl.scrollWidth, opacity: 1,
                duration: 0.5, ease: "power3.out", force3D: true,
            })
            if (forWordRef.current) {
                gsap.to(forWordRef.current, {
                    color: "#f87171", duration: 0.5, ease: "power2.out", delay: 0.1,
                })
            }
        } else {
            gsap.to(notEl, {
                width: 0, opacity: 0,
                duration: 0.4, ease: "power2.in", force3D: true,
            })
            if (forWordRef.current) {
                gsap.to(forWordRef.current, {
                    color: "#FFC300", duration: 0.4, ease: "power2.in",
                })
            }
        }

        /* Swap surrounding points — only text + icons, not the line */
        const exitY = dir === 1 ? -20 : 20
        const enterY = dir === 1 ? 20 : -20

        pointRefs.current.forEach((wrapper, i) => {
            if (!wrapper) return
            const delay = i * 0.1

            /* Text elements */
            const forText = wrapper.querySelector<HTMLDivElement>(".txt-for")
            const notText = wrapper.querySelector<HTMLDivElement>(".txt-not")
            /* Icon elements */
            const iconFor = wrapper.querySelector<HTMLSpanElement>(".icon-for")
            const iconNot = wrapper.querySelector<HTMLSpanElement>(".icon-not")
            /* Large Icon elements */
            const iconForLg = wrapper.querySelector<SVGSVGElement>(".icon-for-large")
            const iconNotLg = wrapper.querySelector<SVGSVGElement>(".icon-not-large")
            /* Line element */
            const line = wrapper.querySelector<HTMLDivElement>(".point-line")

            if (to === 1) {
                if (forText) gsap.to(forText, { y: exitY, opacity: 0, filter: "blur(6px)", duration: 0.35, ease: "power2.in", delay, force3D: true, overwrite: true })
                if (notText) gsap.fromTo(notText, { y: enterY, opacity: 0, filter: "blur(6px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.55, ease: "power3.out", delay: delay + 0.18, force3D: true, overwrite: true })
                if (iconFor) gsap.to(iconFor, { opacity: 0, scale: 0.3, rotation: -45, duration: 0.25, delay, force3D: true, overwrite: true })
                if (iconNot) gsap.to(iconNot, { opacity: 1, scale: 1, rotation: 0, duration: 0.4, ease: "back.out(1.7)", delay: delay + 0.15, force3D: true, overwrite: true })
                if (iconForLg) gsap.to(iconForLg, { opacity: 0, scale: 0.3, rotation: -45, duration: 0.25, delay, force3D: true, overwrite: true })
                if (iconNotLg) gsap.to(iconNotLg, { opacity: 1, scale: 1, rotation: 0, duration: 0.4, ease: "back.out(1.7)", delay: delay + 0.15, force3D: true, overwrite: true })
                if (line) gsap.to(line, { backgroundColor: "rgba(248, 113, 113, 0.4)", duration: 0.4, delay: delay + 0.15, overwrite: true }) // Red
            } else {
                if (notText) gsap.to(notText, { y: exitY, opacity: 0, filter: "blur(6px)", duration: 0.35, ease: "power2.in", delay, force3D: true, overwrite: true })
                if (forText) gsap.fromTo(forText, { y: enterY, opacity: 0, filter: "blur(6px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.55, ease: "power3.out", delay: delay + 0.18, force3D: true, overwrite: true })
                if (iconNot) gsap.to(iconNot, { opacity: 0, scale: 0.3, rotation: 45, duration: 0.25, delay, force3D: true, overwrite: true })
                if (iconFor) gsap.to(iconFor, { opacity: 1, scale: 1, rotation: 0, duration: 0.4, ease: "back.out(1.7)", delay: delay + 0.15, force3D: true, overwrite: true })
                if (iconNotLg) gsap.to(iconNotLg, { opacity: 0, scale: 0.3, rotation: 45, duration: 0.25, delay, force3D: true, overwrite: true })
                if (iconForLg) gsap.to(iconForLg, { opacity: 1, scale: 1, rotation: 0, duration: 0.4, ease: "back.out(1.7)", delay: delay + 0.15, force3D: true, overwrite: true })
                if (line) gsap.to(line, { backgroundColor: "rgba(255, 255, 255, 0.06)", duration: 0.4, delay: delay + 0.15, overwrite: true }) // Back to subtle white
            }
        })
    }

    /* ─── ScrollTrigger ─── */
    useEffect(() => {
        if (typeof window === "undefined") return

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: pinWrapRef.current,
                start: "top top",
                end: "bottom bottom",
                onUpdate(self) {
                    const np = self.progress >= 0.48 ? 1 : 0
                    if (np !== phaseRef.current) {
                        const dir: 1 | -1 = np > phaseRef.current ? 1 : -1
                        phaseRef.current = np
                        setPhase(np)
                        swapPhase(np, dir)
                    }
                },
            })
        }, pinWrapRef)

        return () => ctx.revert()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /* ─── Render a top point (line on top, text below) ─── */
    const renderTopPoint = (i: number) => {
        const isRight = i === 1
        const IconFor = forPoints[i].icon
        const IconNot = notForPoints[i].icon

        return (
            <div key={i} ref={el => { pointRefs.current[i] = el }}
                className="relative" style={{ maxWidth: "clamp(180px, 20vw, 280px)", textAlign: isRight ? "right" : "left" }}>

                {/* Persistent line + swapping icon */}
                <div className={`flex items-center gap-2.5 mb-2.5 ${isRight ? "flex-row-reverse" : ""}`}>
                    <div className="relative w-5 h-5 flex flex-shrink-0 items-center justify-center">
                        <span className="icon-for text-emerald-400 text-base absolute">✓</span>
                        <span className="icon-not text-red-400 text-base absolute" style={{ opacity: 0, transform: "scale(0.5)" }}>×</span>
                    </div>
                    <div className="point-line h-[1px] flex-1 bg-white/6" style={{ transition: "background-color 0.4s ease" }} />
                </div>

                {/* Swapping text + large icons */}
                <div className="relative" style={{ minHeight: "1.8em" }}>
                    <div className="txt-for flex flex-col gap-2.5" style={{ willChange: "transform, opacity", alignItems: isRight ? "flex-end" : "flex-start" }}>
                        <IconFor className="icon-for-large text-emerald-400/80 w-6 h-6 md:w-8 md:h-8" />
                        <p className="font-display font-medium text-primary/80 text-lg md:text-[1.4vw] leading-snug">
                            {forPoints[i].text}
                        </p>
                    </div>
                    <div className="txt-not absolute inset-x-0 top-0 flex flex-col gap-2.5" style={{ opacity: 0, willChange: "transform, opacity", alignItems: isRight ? "flex-end" : "flex-start" }}>
                        <IconNot className="icon-not-large text-red-400/80 w-6 h-6 md:w-8 md:h-8" />
                        <p className="font-display font-medium text-primary/80 text-lg md:text-[1.4vw] leading-snug">
                            {notForPoints[i].text}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    /* ─── Render a bottom point (text on top, line below) ─── */
    const renderBottomPoint = (i: number) => {
        const isRight = i === 3
        const IconFor = forPoints[i].icon
        const IconNot = notForPoints[i].icon

        return (
            <div key={i} ref={el => { pointRefs.current[i] = el }}
                className={`relative ${i === 2 ? "-mt-8 md:-mt-12" : ""}`} style={{ maxWidth: "clamp(180px, 20vw, 280px)", textAlign: isRight ? "right" : "left" }}>

                {/* Swapping text + large icons */}
                <div className="relative mb-2.5" style={{ minHeight: "1.8em" }}>
                    <div className="txt-for flex flex-col-reverse gap-2.5" style={{ willChange: "transform, opacity", alignItems: isRight ? "flex-end" : "flex-start" }}>
                        <IconFor className="icon-for-large text-emerald-400/80 w-6 h-6 md:w-8 md:h-8" />
                        <p className="font-display font-medium text-primary/80 text-lg md:text-[1.4vw] leading-snug">
                            {forPoints[i].text}
                        </p>
                    </div>
                    <div className="txt-not absolute inset-x-0 bottom-0 flex flex-col-reverse gap-2.5" style={{ opacity: 0, willChange: "transform, opacity", alignItems: isRight ? "flex-end" : "flex-start" }}>
                        <IconNot className="icon-not-large text-red-400/80 w-6 h-6 md:w-8 md:h-8" />
                        <p className="font-display font-medium text-primary/80 text-lg md:text-[1.4vw] leading-snug">
                            {notForPoints[i].text}
                        </p>
                    </div>
                </div>

                {/* Persistent line + swapping icon */}
                <div className={`flex items-center gap-2.5 ${isRight ? "flex-row-reverse" : ""}`}>
                    <div className="point-line h-[1px] flex-1 bg-white/6" style={{ transition: "background-color 0.4s ease" }} />
                    <div className="relative w-5 h-5 flex flex-shrink-0 items-center justify-center">
                        <span className="icon-for text-emerald-400 text-base absolute">✓</span>
                        <span className="icon-not text-red-400 text-base absolute" style={{ opacity: 0, transform: "scale(0.5)" }}>×</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <section id="about" ref={pinWrapRef} className="relative w-full h-[200vh] bg-background text-white select-none">
            {/* The actual pinned content area */}
            <div
                ref={sectionRef}
                className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center py-8 md:py-12 border-b border-white/5"
            >
                {/* Subtle ambient */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vh] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, rgba(255,195,0,0.025) 0%, transparent 70%)" }} />

                {/* ─── Heading ─── */}
                <div className="w-full text-center absolute top-[10%] md:top-[12%] left-0 right-0 z-20">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="flex justify-center gap-[0.3em] font-display font-semibold text-primary tracking-tight text-3xl md:text-5xl"
                    >
                        {["Who", "is", "this", "for"].map((word, i) => (
                            <div key={i} className="overflow-hidden inline-block relative py-1">
                                <motion.span
                                    variants={{
                                        hidden: { y: "110%" },
                                        visible: {
                                            y: "0%",
                                            transition: {
                                                duration: 1.1,
                                                ease: [0.76, 0, 0.24, 1],
                                                delay: i * 0.05
                                            }
                                        }
                                    }}
                                    className="inline-block origin-bottom-left will-change-transform transform-gpu"
                                    style={{ backfaceVisibility: "hidden" }}
                                >
                                    {word}
                                </motion.span>
                            </div>
                        ))}
                    </motion.div>
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileInView={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
                        viewport={{ once: true }}
                        className="w-16 h-1 bg-gradient-to-r from-accent to-red-500 mx-auto mt-4 md:mt-6 rounded-full origin-center"
                    />
                </div>

                {/* ─── Main layout ─── */}
                <div className="relative w-full max-w-[82vw] mx-auto flex flex-col items-center justify-center gap-6 md:gap-8 mt-16 md:mt-24">

                    {/* Top row — points 0 & 1 */}
                    <div className="w-full flex justify-between items-end px-2 md:px-8 translate-y-8 md:translate-y-12">
                        {[0, 1].map(i => renderTopPoint(i))}
                    </div>



                    {/* ─── Centre ─── */}
                    <div className="relative text-center">
                        <div className="px-10 py-6 md:px-16 md:py-8 rounded-3xl border border-white/6 bg-surface-light/15 backdrop-blur-sm">
                            <h2 className="font-display font-semibold text-primary tracking-tight leading-tight"
                                style={{ fontSize: "clamp(1.8rem, 3vw, 3.5rem)" }}>
                                Brands{" "}
                                <span
                                    ref={notWordRef}
                                    className="font-display font-semibold italic"
                                    style={{ display: "inline-block", width: 0, overflow: "hidden", opacity: 0, whiteSpace: "nowrap", verticalAlign: "bottom", color: "#f87171" }}
                                >
                                    not{" "}
                                </span>{" "}
                                <span ref={forWordRef} className="font-display font-semibold italic" style={{ color: "var(--color-accent, #FFC300)", transition: "none" }}>
                                    looking for
                                </span>
                            </h2>
                            <div className="flex gap-2 items-center justify-center mt-6">
                                {[0, 1].map(i => (
                                    <div key={i} className="rounded-full transition-all duration-500" style={{
                                        width: phase === i ? 22 : 6, height: 6,
                                        backgroundColor: phase === i ? "var(--color-accent, #FFC300)" : "rgba(255,255,255,0.10)",
                                    }} />
                                ))}
                            </div>
                        </div>
                    </div>



                    {/* Bottom row — points 2 & 3 */}
                    <div className="w-full flex justify-between items-start px-2 md:px-8">
                        {[2, 3].map(i => renderBottomPoint(i))}
                    </div>
                </div>

                {/* Scroll dots moved under heading */}
            </div>
        </section>
    )
}
