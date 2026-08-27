"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import FloatingCTA from "@/components/FloatingCTA";
import ContactForm from "@/components/ContactForm";

interface SlangWord {
    text: string;
    italic: boolean;
}

// Trimmed to 2 tight paragraphs — fits the viewport without scrolling
const slangSegments: SlangWord[] = [
    { text: "Most agencies ", italic: false },
    { text: "talk a big game", italic: true },
    { text: " and send you a deck. We are not that.", italic: false },
    { text: "\n\n", italic: false },
    { text: "We cook ", italic: false },
    { text: "differently", italic: true },
    { text: " — every frame is intentional, every story ", italic: false },
    { text: "engineered to hit", italic: true },
    { text: ". Our clients pay us to make people ", italic: false },
    { text: "stop scrolling", italic: true },
    { text: " and stay. If you want content that builds ", italic: false },
    { text: "actual authority", italic: true },
    { text: " — ", italic: false },
    { text: "fill the form.", italic: true },
];

const ItalicHoverWord = ({ text, onHover }: { text: string; onHover: (el: HTMLElement | null) => void }) => {
    const ref = useRef<HTMLSpanElement>(null);

    return (
        <motion.span
            ref={ref}
            data-cursor-hover
            onMouseEnter={() => onHover(ref.current)}
            onMouseMove={() => onHover(ref.current)}
            onMouseLeave={() => onHover(null)}
            /* The hover colour stays a literal hex, same exception as
               OurServices: Framer Motion tweens `color` numerically and cannot
               parse `var(...)`, so a custom property here would kill the
               transition. #8F3A1C = --color-clay-deep, 6.8:1 on the cream
               ground. It was #997300, a mustard gold that appeared on this one
               page and nowhere else on the site. */
            whileHover={{ color: "#8F3A1C", scale: 1.03 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
                /* Tiempos Headline, not Georgia. Tiempos is already loaded in
                   layout.tsx and already used by the Manifesto, so this page
                   was quietly introducing a fourth typeface for one word. */
                fontFamily: "var(--font-tiempos-headline), serif",
                fontStyle: "italic",
                display: "inline-block",
                position: "relative",
                /* rgba(143,58,28,0.3) = --color-clay-deep at 30%, matching the
                   hover colour above instead of the old gold. */
                borderBottom: "1px solid rgba(143,58,28,0.3)",
                paddingBottom: "1px",
                transition: "border-color 0.3s ease",
                zIndex: 1,
            }}
        >
            {text}
        </motion.span>
    );
};

export default function ContactPage() {
    const panelRef = useRef<HTMLDivElement>(null);
    const [targetPos, setTargetPos] = React.useState<{ x: number; y: number; side: "left" | "right" } | null>(null);

    const handleHover = (el: HTMLElement | null) => {
        if (!el || !panelRef.current) {
            setTargetPos(null);
            return;
        }
        const wordRect = el.getBoundingClientRect();
        const panelRect = panelRef.current.getBoundingClientRect();

        const x = wordRect.left - panelRect.left + wordRect.width / 2;
        const y = wordRect.top - panelRect.top + wordRect.height / 2;
        const side = x < panelRect.width / 2 ? "left" : "right";

        setTargetPos({ x, y, side });
    };

    return (
        // Native window scrolling wrapper
        <div className="bg-background min-h-screen text-white flex flex-col">
            <FloatingCTA />
            <Navbar />

            {/* Split-screen wrapper */}
            <div className="flex-1 flex flex-col lg:flex-row">

                {/* LEFT — scrolls naturally with the page */}
                <div className="w-full lg:w-1/2 flex flex-col relative pt-[68px]">
                    
                    {/* Premium Cinematic Background Layer */}
                    <div 
                        className="absolute top-0 left-0 w-full h-[80vh] md:h-[70vh] pointer-events-none opacity-50 mix-blend-screen overflow-hidden" 
                        style={{ 
                            maskImage: "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 40%, transparent 100%)", 
                            WebkitMaskImage: "linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 40%, transparent 100%)" 
                        }}
                    >
                        <motion.img 
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            src="/assets/contact_hero_bg.jpg" 
                            alt="" 
                            className="w-full h-full object-cover object-top"
                        />
                        {/* Film grain overlay just for this image section */}
                        <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,%3Csvg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noiseFilter\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.8\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noiseFilter)\\"/%3E%3C/svg%3E")' }} />
                    </div>

                    {/* Ambient glow. Was accent green on a cream ground, the
                        same green-on-light case the rest of the site just lost.
                        Clay keeps the warm single light source. */}
                    <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] bg-clay/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

                    <div className="relative z-10 w-full max-w-[500px] mx-auto px-8 md:px-12 py-12 lg:py-24">
                        {/* Eyebrow. 11-12px text, so it needs the strongest
                            accent available on cream: clay-deep at 6.8:1.
                            accent green was 2.6:1 and failed AA outright. */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9 }}
                            className="text-xs font-mono uppercase tracking-[0.25em] text-clay-deep mb-4"
                        >
                            Let's Build Together
                        </motion.p>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.0, delay: 0.15 }}
                            className="text-3xl md:text-4xl font-display font-semibold leading-[1.1] tracking-tight text-primary mb-3"
                        >
                            Turn Your Expertise<br />
                            <span className="text-clay-deep">Into Influence.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.0, delay: 0.3 }}
                            className="text-muted text-sm mb-10 leading-relaxed"
                        >
                            Apply for a strategy call below.
                        </motion.p>

                        <ContactForm />
                    </div>
                </div>

                {/* RIGHT — sticky, extends behind navbar for seamless bg */}
                <div ref={panelRef} className="hidden lg:flex w-1/2 flex-col items-center justify-center relative sticky top-0 h-screen overflow-hidden">
                    {/* Background image */}
                    <img
                        src="/heroassets/light_mode_contact.png"
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />

                    {/* Thin light overlay gradient — ensures slight text readability without drowning the image */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "linear-gradient(135deg, rgba(248,243,230,0.6) 0%, rgba(248,243,230,0.3) 50%, rgba(248,243,230,0.6) 100%)",
                        }}
                    />

                    {/* Interactive Gliding Blobs (Idle at Far Left and Far Right, Glide Behind Text on Hover) */}
                    <motion.div
                        className="absolute pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 z-10"
                        animate={{
                            left: targetPos && targetPos.side === "left" ? targetPos.x : "5%",
                            top: targetPos && targetPos.side === "left" ? targetPos.y : "45%",
                            scale: targetPos && targetPos.side === "left" ? 1.3 : 1,
                            opacity: targetPos && targetPos.side === "left" ? 0.35 : 0.2,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 140,
                            damping: 20,
                            mass: 0.8,
                        }}
                        style={{
                            width: 170,
                            height: 170,
                            background: "radial-gradient(circle, rgba(153,115,0,0.35) 0%, transparent 70%)",
                        }}
                    />

                    <motion.div
                        className="absolute pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 z-10"
                        animate={{
                            left: targetPos && targetPos.side === "right" ? targetPos.x : "95%",
                            top: targetPos && targetPos.side === "right" ? targetPos.y : "55%",
                            scale: targetPos && targetPos.side === "right" ? 1.3 : 1,
                            opacity: targetPos && targetPos.side === "right" ? 0.35 : 0.2,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 140,
                            damping: 20,
                            mass: 0.8,
                        }}
                        style={{
                            width: 170,
                            height: 170,
                            background: "radial-gradient(circle, rgba(153,115,0,0.35) 0%, transparent 70%)",
                        }}
                    />

                    {/* Content — centred */}
                    <div className="relative z-20 px-12 xl:px-16 text-center max-w-[420px]">
                        {/* Tag */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.45 }}
                            className="text-sm font-mono uppercase tracking-[0.25em] text-primary/80 font-semibold mb-6"
                        >
                            Real talk
                        </motion.p>

                        {/* Slang copy */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.35, delay: 0.6 }}
                            className="text-lg md:text-[1.2rem] leading-[1.7] text-primary font-display font-medium"
                            style={{ letterSpacing: "-0.005em" }}
                        >
                            {slangSegments.map((seg, i) => {
                                if (seg.text === "\n\n") {
                                    return <span key={i}><br /><br /></span>;
                                }
                                if (seg.italic) {
                                    return <ItalicHoverWord key={i} text={seg.text} onHover={handleHover} />;
                                }
                                return <span key={i}>{seg.text}</span>;
                            })}
                        </motion.div>

                        {/* Accent bar — centred. 2px rule on a light ground, so
                            it follows the same clay-deep rule as the eyebrow. */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-10 h-[2px] w-20 bg-clay-deep origin-center mx-auto"
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 1.8 }}
                            className="mt-5 text-sm text-primary/70 font-mono tracking-wide font-medium"
                        >
                            Monarch Media House — we do it differently.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Smooth fade into footer — masks the harsh border */}
            <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
                <SiteFooter />
            </div>
        </div>
    );
}
