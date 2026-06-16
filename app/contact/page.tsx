"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

const ItalicHoverWord = ({ text }: { text: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const glowX = useMotionValue(0);
    const glowY = useMotionValue(0);
    const springX = useSpring(glowX, { stiffness: 300, damping: 20 });
    const springY = useSpring(glowY, { stiffness: 300, damping: 20 });

    return (
        <motion.span
            ref={ref}
            data-cursor-hover
            onMouseMove={(e) => {
                const rect = ref.current?.getBoundingClientRect();
                if (!rect) return;
                glowX.set(e.clientX - rect.left);
                glowY.set(e.clientY - rect.top);
            }}
            onMouseLeave={() => {
                glowX.set(0);
                glowY.set(0);
            }}
            whileHover={{ color: "#FFC300", scale: 1.02 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                fontStyle: "italic",
                display: "inline",
                position: "relative",
                borderBottom: "1px solid rgba(255,195,0,0.0)",
                paddingBottom: "1px",
                transition: "border-color 0.3s ease",
            }}
        >
            {/* Glow blob */}
            <motion.span
                aria-hidden
                style={{
                    position: "absolute",
                    left: springX,
                    top: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,195,0,0.18) 0%, transparent 70%)",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            />
            <span style={{ position: "relative", zIndex: 1 }}>{text}</span>
        </motion.span>
    );
};

export default function ContactPage() {
    return (
        // Native window scrolling wrapper
        <div className="bg-background min-h-screen text-white flex flex-col">
            <FloatingCTA />
            <Navbar />

            {/* Split-screen wrapper */}
            <div className="flex-1 flex flex-col lg:flex-row">

                {/* LEFT — scrolls naturally with the page */}
                <div className="w-full lg:w-1/2 flex flex-col relative pt-[68px]">
                    {/* Ambient glow */}
                    <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] max-w-[400px] max-h-[400px] bg-accent/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

                    <div className="relative z-10 w-full max-w-[500px] mx-auto px-8 md:px-12 py-12 lg:py-24">
                        {/* Eyebrow */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9 }}
                            className="text-xs font-mono uppercase tracking-[0.25em] text-accent mb-4"
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
                            <span className="text-accent">Into Influence.</span>
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
                <div className="hidden lg:flex w-1/2 flex-col items-center justify-center relative sticky top-0 h-screen overflow-hidden">
                    {/* Background image */}
                    <img
                        src="/contact-bg.png"
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />

                    {/* Dark overlay gradient — ensures text readability */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "linear-gradient(135deg, rgba(10,10,14,0.82) 0%, rgba(10,10,14,0.65) 50%, rgba(10,10,14,0.78) 100%)",
                        }}
                    />



                    {/* Decorative circle */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, delay: 0.6 }}
                        className="absolute top-12 right-12 w-20 h-20 rounded-full border border-accent/15 pointer-events-none z-10"
                        style={{ background: "radial-gradient(circle, rgba(255,195,0,0.06) 0%, transparent 70%)" }}
                    />

                    {/* Content — centred */}
                    <div className="relative z-20 px-12 xl:px-16 text-center max-w-[420px]">
                        {/* Tag */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.45 }}
                            className="text-xs font-mono uppercase tracking-[0.25em] text-white/50 mb-6"
                        >
                            Real talk
                        </motion.p>

                        {/* Slang copy */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.35, delay: 0.6 }}
                            className="text-base md:text-[1.05rem] leading-[1.75] text-white/90 font-display font-normal"
                            style={{ letterSpacing: "-0.005em" }}
                        >
                            {slangSegments.map((seg, i) => {
                                if (seg.text === "\n\n") {
                                    return <span key={i}><br /><br /></span>;
                                }
                                if (seg.italic) {
                                    return <ItalicHoverWord key={i} text={seg.text} />;
                                }
                                return <span key={i}>{seg.text}</span>;
                            })}
                        </motion.div>

                        {/* Accent bar — centred */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-10 h-[2px] w-20 bg-accent origin-center mx-auto"
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 1.8 }}
                            className="mt-5 text-xs text-white/40 font-mono tracking-wide"
                        >
                            Monarch Media House — we do it differently.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Smooth fade into footer — masks the harsh border */}
            <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
                <Footer />
            </div>
        </div>
    );
}
