"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

function Counter({ value, direction = "up" }: { value: number; direction?: "up" | "down" }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === "down" ? value : 0);
    const springValue = useSpring(motionValue, {
        stiffness: 40,
        damping: 30,
    });
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(direction === "down" ? 0 : value);
        }
    }, [motionValue, isInView, value, direction]);

    const displayValue = useTransform(springValue, (latest) =>
        Intl.NumberFormat("en-US").format(Math.round(latest))
    );

    return <motion.span ref={ref}>{displayValue}</motion.span>;
}

export default function ResultsSection() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-20%" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring" as const, stiffness: 100, damping: 20 },
        },
    };

    // The data points requested by the user
    const stats = [
        { value: 10, suffix: "M+", label: "Views" },
        { value: 1200, suffix: "+", label: "Creatives" },
        { value: 20, suffix: "+", label: "Brands" },
        { value: 150, suffix: "%", label: "Traffic Growth" },
    ];

    return (
        <section 
            id="results" 
            ref={containerRef}
            className="w-full pt-8 pb-8 md:pt-10 md:pb-10 bg-background-alt relative z-20"
        >
            {/* Torn Paper Edge Separator */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-20 transform -translate-y-[99%]">
                <svg 
                    viewBox="0 0 1200 50" 
                    preserveAspectRatio="none" 
                    className="w-full h-[25px] md:h-[40px] text-background-alt block"
                >
                    <path 
                        fill="currentColor" 
                        opacity="0.5"
                        d="M0,50 L0.0,20.0 L6.0,18.5 L12.0,17.5 L18.0,20.4 L24.0,21.4 L30.0,21.5 L36.0,21.1 L42.0,24.1 L48.0,25.5 L54.0,26.3 L60.0,25.7 L66.0,27.3 L72.0,29.0 L78.0,30.1 L84.0,32.8 L90.0,33.2 L96.0,34.0 L102.0,33.4 L108.0,32.2 L114.0,33.7 L120.0,33.2 L126.0,33.4 L132.0,32.2 L138.0,31.7 L144.0,29.1 L150.0,28.1 L156.0,27.3 L162.0,24.5 L168.0,21.8 L174.0,22.5 L180.0,20.4 L186.0,21.3 L192.0,19.8 L198.0,17.9 L204.0,18.5 L210.0,17.8 L216.0,18.4 L222.0,16.3 L228.0,14.1 L234.0,15.3 L240.0,12.1 L246.0,10.2 L252.0,8.8 L258.0,8.9 L264.0,9.0 L270.0,7.9 L276.0,8.5 L282.0,8.4 L288.0,6.6 L294.0,9.4 L300.0,11.7 L306.0,12.9 L312.0,13.3 L318.0,14.2 L324.0,13.8 L330.0,14.3 L336.0,17.4 L342.0,19.6 L348.0,20.3 L354.0,22.3 L360.0,23.2 L366.0,22.7 L372.0,23.3 L378.0,24.2 L384.0,25.3 L390.0,27.2 L396.0,29.8 L402.0,30.7 L408.0,32.5 L414.0,33.7 L420.0,34.0 L426.0,34.3 L432.0,32.8 L438.0,30.6 L444.0,31.5 L450.0,32.0 L456.0,31.9 L462.0,32.5 L468.0,32.9 L474.0,30.5 L480.0,28.7 L486.0,26.2 L492.0,24.3 L498.0,22.8 L504.0,22.9 L510.0,19.6 L516.0,16.2 L522.0,16.8 L528.0,15.9 L534.0,14.1 L540.0,14.4 L546.0,12.5 L552.0,12.6 L558.0,13.8 L564.0,12.7 L570.0,13.0 L576.0,12.9 L582.0,11.5 L588.0,9.2 L594.0,9.2 L600.0,9.3 L606.0,8.1 L612.0,6.7 L618.0,8.7 L624.0,9.7 L630.0,11.5 L636.0,14.8 L642.0,15.9 L648.0,14.8 L654.0,17.1 L660.0,19.3 L666.0,19.6 L672.0,23.0 L678.0,23.1 L684.0,24.0 L690.0,26.0 L696.0,29.0 L702.0,30.0 L708.0,31.3 L714.0,33.8 L720.0,34.8 L726.0,34.0 L732.0,34.9 L738.0,33.3 L744.0,30.8 L750.0,28.7 L756.0,29.0 L762.0,28.1 L768.0,27.3 L774.0,28.5 L780.0,27.3 L786.0,28.3 L792.0,25.9 L798.0,23.7 L804.0,24.7 L810.0,22.4 L816.0,21.9 L822.0,22.9 L828.0,21.2 L834.0,20.8 L840.0,19.0 L846.0,18.6 L852.0,17.1 L858.0,15.2 L864.0,12.4 L870.0,9.8 L876.0,9.6 L882.0,8.1 L888.0,6.9 L894.0,5.8 L900.0,6.0 L906.0,6.7 L912.0,7.7 L918.0,9.9 L924.0,8.4 L930.0,9.0 L936.0,11.3 L942.0,13.0 L948.0,12.7 L954.0,12.2 L960.0,11.4 L966.0,13.1 L972.0,12.9 L978.0,13.9 L984.0,16.5 L990.0,18.7 L996.0,21.7 L1002.0,24.4 L1008.0,26.1 L1014.0,25.7 L1020.0,24.7 L1026.0,25.8 L1032.0,28.6 L1038.0,30.8 L1044.0,29.6 L1050.0,29.1 L1056.0,27.5 L1062.0,27.5 L1068.0,25.5 L1074.0,24.1 L1080.0,22.3 L1086.0,23.4 L1092.0,24.3 L1098.0,25.0 L1104.0,22.1 L1110.0,20.4 L1116.0,19.8 L1122.0,17.1 L1128.0,17.1 L1134.0,15.3 L1140.0,16.5 L1146.0,14.2 L1152.0,13.1 L1158.0,11.8 L1164.0,11.4 L1170.0,12.8 L1176.0,11.4 L1182.0,11.3 L1188.0,11.8 L1194.0,10.1 L1200.0,7.8 L1200,50 Z" 
                    />
                    <path 
                        fill="currentColor" 
                        d="M0,50 L0.0,24.1 L6.0,26.9 L12.0,24.5 L18.0,25.5 L24.0,26.2 L30.0,29.2 L36.0,32.2 L42.0,31.5 L48.0,34.3 L54.0,36.6 L60.0,38.9 L66.0,39.6 L72.0,40.1 L78.0,40.2 L84.0,39.2 L90.0,39.3 L96.0,39.1 L102.0,38.6 L108.0,37.9 L114.0,36.7 L120.0,37.0 L126.0,37.7 L132.0,39.4 L138.0,40.9 L144.0,40.9 L150.0,41.4 L156.0,38.4 L162.0,36.0 L168.0,35.3 L174.0,33.8 L180.0,34.0 L186.0,33.6 L192.0,34.4 L198.0,31.9 L204.0,32.0 L210.0,30.5 L216.0,30.2 L222.0,26.6 L228.0,24.0 L234.0,21.2 L240.0,22.2 L246.0,19.3 L252.0,18.4 L258.0,18.9 L264.0,19.9 L270.0,18.5 L276.0,18.2 L282.0,20.0 L288.0,20.8 L294.0,20.7 L300.0,19.3 L306.0,17.3 L312.0,16.7 L318.0,20.4 L324.0,23.4 L330.0,22.6 L336.0,25.2 L342.0,23.3 L348.0,24.3 L354.0,25.9 L360.0,25.4 L366.0,25.9 L372.0,26.9 L378.0,30.0 L384.0,30.7 L390.0,31.0 L396.0,32.9 L402.0,33.5 L408.0,32.8 L414.0,32.9 L420.0,34.7 L426.0,36.0 L432.0,35.6 L438.0,36.0 L444.0,34.0 L450.0,31.7 L456.0,33.9 L462.0,35.0 L468.0,32.8 L474.0,31.4 L480.0,33.0 L486.0,29.7 L492.0,29.5 L498.0,30.1 L504.0,26.5 L510.0,25.4 L516.0,22.5 L522.0,20.4 L528.0,18.2 L534.0,15.1 L540.0,15.5 L546.0,14.3 L552.0,15.1 L558.0,16.6 L564.0,18.6 L570.0,20.1 L576.0,20.8 L582.0,22.5 L588.0,24.2 L594.0,23.9 L600.0,24.0 L606.0,22.2 L612.0,23.7 L618.0,21.2 L624.0,22.2 L630.0,22.6 L636.0,22.7 L642.0,24.4 L648.0,24.6 L654.0,25.5 L660.0,25.9 L666.0,25.7 L672.0,26.6 L678.0,27.4 L684.0,26.3 L690.0,28.3 L696.0,28.5 L702.0,30.5 L708.0,32.7 L714.0,35.2 L720.0,36.1 L726.0,33.7 L732.0,32.7 L738.0,33.5 L744.0,31.6 L750.0,34.4 L756.0,36.7 L762.0,36.4 L768.0,36.5 L774.0,36.4 L780.0,33.4 L786.0,30.2 L792.0,28.8 L798.0,28.0 L804.0,25.0 L810.0,25.0 L816.0,25.5 L822.0,22.5 L828.0,21.9 L834.0,18.3 L840.0,16.0 L846.0,18.2 L852.0,14.9 L858.0,14.0 L864.0,14.2 L870.0,15.8 L876.0,13.4 L882.0,13.7 L888.0,14.7 L894.0,15.2 L900.0,14.9 L906.0,15.2 L912.0,15.4 L918.0,14.2 L924.0,13.7 L930.0,16.3 L936.0,18.7 L942.0,16.9 L948.0,19.1 L954.0,20.0 L960.0,18.5 L966.0,17.9 L972.0,18.9 L978.0,18.4 L984.0,21.2 L990.0,24.4 L996.0,28.1 L1002.0,30.1 L1008.0,29.1 L1014.0,28.2 L1020.0,31.7 L1026.0,34.1 L1032.0,37.3 L1038.0,36.2 L1044.0,34.1 L1050.0,34.8 L1056.0,35.5 L1062.0,36.8 L1068.0,37.2 L1074.0,38.2 L1080.0,37.1 L1086.0,38.0 L1092.0,36.0 L1098.0,36.0 L1104.0,32.2 L1110.0,30.8 L1116.0,32.1 L1122.0,29.5 L1128.0,30.5 L1134.0,30.9 L1140.0,26.6 L1146.0,24.6 L1152.0,22.8 L1158.0,20.6 L1164.0,20.1 L1170.0,20.6 L1176.0,20.0 L1182.0,20.8 L1188.0,22.4 L1194.0,23.3 L1200.0,24.1 L1200,50 Z" 
                    />
                </svg>
            </div>

            {/* Subtle radial glow matching the site aesthetic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-[1040px] mx-auto px-6 md:px-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                {/* Heading Left Side */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full md:w-[40%] flex flex-col items-center md:items-start text-center md:text-left"
                >
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-accent text-[8px] md:text-[9px] font-mono uppercase tracking-widest mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        Impact & Scale
                    </div>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-display font-semibold text-primary tracking-tight leading-tight">
                        Results That <span className="text-accent italic">Speak.</span>
                    </h2>
                    <p className="text-[10px] md:text-xs text-primary/70 mt-2 md:mt-3 max-w-sm leading-relaxed">
                        We don't just talk about growth. We engineer it. Here's a snapshot of the tangible value we've delivered.
                    </p>
                </motion.div>

                {/* Metrics Grid Right Side */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="w-full md:w-[60%] grid grid-cols-2 gap-3 md:gap-4"
                >
                    {stats.map((stat, index) => (
                        <motion.div 
                            key={index}
                            variants={itemVariants}
                            className="flex flex-col items-center md:items-start justify-center p-3 md:p-4 bg-primary/5 rounded-xl border border-primary/5 hover:bg-primary/10 hover:border-accent/30 transition-all duration-300 group"
                        >
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-primary group-hover:text-accent transition-colors duration-300 mb-1 tracking-tighter shrink-0 flex items-end">
                                <Counter value={stat.value} />
                                <span className="ml-[2px] text-lg md:text-xl lg:text-2xl">{stat.suffix}</span>
                            </h3>
                            <p className="text-[8px] md:text-[9px] text-primary/60 group-hover:text-primary/90 transition-colors uppercase tracking-[0.2em] font-medium">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom Torn Edge Separator */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 transform translate-y-[99%] rotate-180">
                <svg 
                    viewBox="0 0 1200 50" 
                    preserveAspectRatio="none" 
                    className="w-full h-[25px] md:h-[40px] text-background-alt block"
                >
                    <path 
                        fill="currentColor" 
                        opacity="0.5"
                        d="M0,50 L0.0,20.0 L6.0,18.5 L12.0,17.5 L18.0,20.4 L24.0,21.4 L30.0,21.5 L36.0,21.1 L42.0,24.1 L48.0,25.5 L54.0,26.3 L60.0,25.7 L66.0,27.3 L72.0,29.0 L78.0,30.1 L84.0,32.8 L90.0,33.2 L96.0,34.0 L102.0,33.4 L108.0,32.2 L114.0,33.7 L120.0,33.2 L126.0,33.4 L132.0,32.2 L138.0,31.7 L144.0,29.1 L150.0,28.1 L156.0,27.3 L162.0,24.5 L168.0,21.8 L174.0,22.5 L180.0,20.4 L186.0,21.3 L192.0,19.8 L198.0,17.9 L204.0,18.5 L210.0,17.8 L216.0,18.4 L222.0,16.3 L228.0,14.1 L234.0,15.3 L240.0,12.1 L246.0,10.2 L252.0,8.8 L258.0,8.9 L264.0,9.0 L270.0,7.9 L276.0,8.5 L282.0,8.4 L288.0,6.6 L294.0,9.4 L300.0,11.7 L306.0,12.9 L312.0,13.3 L318.0,14.2 L324.0,13.8 L330.0,14.3 L336.0,17.4 L342.0,19.6 L348.0,20.3 L354.0,22.3 L360.0,23.2 L366.0,22.7 L372.0,23.3 L378.0,24.2 L384.0,25.3 L390.0,27.2 L396.0,29.8 L402.0,30.7 L408.0,32.5 L414.0,33.7 L420.0,34.0 L426.0,34.3 L432.0,32.8 L438.0,30.6 L444.0,31.5 L450.0,32.0 L456.0,31.9 L462.0,32.5 L468.0,32.9 L474.0,30.5 L480.0,28.7 L486.0,26.2 L492.0,24.3 L498.0,22.8 L504.0,22.9 L510.0,19.6 L516.0,16.2 L522.0,16.8 L528.0,15.9 L534.0,14.1 L540.0,14.4 L546.0,12.5 L552.0,12.6 L558.0,13.8 L564.0,12.7 L570.0,13.0 L576.0,12.9 L582.0,11.5 L588.0,9.2 L594.0,9.2 L600.0,9.3 L606.0,8.1 L612.0,6.7 L618.0,8.7 L624.0,9.7 L630.0,11.5 L636.0,14.8 L642.0,15.9 L648.0,14.8 L654.0,17.1 L660.0,19.3 L666.0,19.6 L672.0,23.0 L678.0,23.1 L684.0,24.0 L690.0,26.0 L696.0,29.0 L702.0,30.0 L708.0,31.3 L714.0,33.8 L720.0,34.8 L726.0,34.0 L732.0,34.9 L738.0,33.3 L744.0,30.8 L750.0,28.7 L756.0,29.0 L762.0,28.1 L768.0,27.3 L774.0,28.5 L780.0,27.3 L786.0,28.3 L792.0,25.9 L798.0,23.7 L804.0,24.7 L810.0,22.4 L816.0,21.9 L822.0,22.9 L828.0,21.2 L834.0,20.8 L840.0,19.0 L846.0,18.6 L852.0,17.1 L858.0,15.2 L864.0,12.4 L870.0,9.8 L876.0,9.6 L882.0,8.1 L888.0,6.9 L894.0,5.8 L900.0,6.0 L906.0,6.7 L912.0,7.7 L918.0,9.9 L924.0,8.4 L930.0,9.0 L936.0,11.3 L942.0,13.0 L948.0,12.7 L954.0,12.2 L960.0,11.4 L966.0,13.1 L972.0,12.9 L978.0,13.9 L984.0,16.5 L990.0,18.7 L996.0,21.7 L1002.0,24.4 L1008.0,26.1 L1014.0,25.7 L1020.0,24.7 L1026.0,25.8 L1032.0,28.6 L1038.0,30.8 L1044.0,29.6 L1050.0,29.1 L1056.0,27.5 L1062.0,27.5 L1068.0,25.5 L1074.0,24.1 L1080.0,22.3 L1086.0,23.4 L1092.0,24.3 L1098.0,25.0 L1104.0,22.1 L1110.0,20.4 L1116.0,19.8 L1122.0,17.1 L1128.0,17.1 L1134.0,15.3 L1140.0,16.5 L1146.0,14.2 L1152.0,13.1 L1158.0,11.8 L1164.0,11.4 L1170.0,12.8 L1176.0,11.4 L1182.0,11.3 L1188.0,11.8 L1194.0,10.1 L1200.0,7.8 L1200,50 Z" 
                    />
                    <path 
                        fill="currentColor" 
                        d="M0,50 L0.0,24.1 L6.0,26.9 L12.0,24.5 L18.0,25.5 L24.0,26.2 L30.0,29.2 L36.0,32.2 L42.0,31.5 L48.0,34.3 L54.0,36.6 L60.0,38.9 L66.0,39.6 L72.0,40.1 L78.0,40.2 L84.0,39.2 L90.0,39.3 L96.0,39.1 L102.0,38.6 L108.0,37.9 L114.0,36.7 L120.0,37.0 L126.0,37.7 L132.0,39.4 L138.0,40.9 L144.0,40.9 L150.0,41.4 L156.0,38.4 L162.0,36.0 L168.0,35.3 L174.0,33.8 L180.0,34.0 L186.0,33.6 L192.0,34.4 L198.0,31.9 L204.0,32.0 L210.0,30.5 L216.0,30.2 L222.0,26.6 L228.0,24.0 L234.0,21.2 L240.0,22.2 L246.0,19.3 L252.0,18.4 L258.0,18.9 L264.0,19.9 L270.0,18.5 L276.0,18.2 L282.0,20.0 L288.0,20.8 L294.0,20.7 L300.0,19.3 L306.0,17.3 L312.0,16.7 L318.0,20.4 L324.0,23.4 L330.0,22.6 L336.0,25.2 L342.0,23.3 L348.0,24.3 L354.0,25.9 L360.0,25.4 L366.0,25.9 L372.0,26.9 L378.0,30.0 L384.0,30.7 L390.0,31.0 L396.0,32.9 L402.0,33.5 L408.0,32.8 L414.0,32.9 L420.0,34.7 L426.0,36.0 L432.0,35.6 L438.0,36.0 L444.0,34.0 L450.0,31.7 L456.0,33.9 L462.0,35.0 L468.0,32.8 L474.0,31.4 L480.0,33.0 L486.0,29.7 L492.0,29.5 L498.0,30.1 L504.0,26.5 L510.0,25.4 L516.0,22.5 L522.0,20.4 L528.0,18.2 L534.0,15.1 L540.0,15.5 L546.0,14.3 L552.0,15.1 L558.0,16.6 L564.0,18.6 L570.0,20.1 L576.0,20.8 L582.0,22.5 L588.0,24.2 L594.0,23.9 L600.0,24.0 L606.0,22.2 L612.0,23.7 L618.0,21.2 L624.0,22.2 L630.0,22.6 L636.0,22.7 L642.0,24.4 L648.0,24.6 L654.0,25.5 L660.0,25.9 L666.0,25.7 L672.0,26.6 L678.0,27.4 L684.0,26.3 L690.0,28.3 L696.0,28.5 L702.0,30.5 L708.0,32.7 L714.0,35.2 L720.0,36.1 L726.0,33.7 L732.0,32.7 L738.0,33.5 L744.0,31.6 L750.0,34.4 L756.0,36.7 L762.0,36.4 L768.0,36.5 L774.0,36.4 L780.0,33.4 L786.0,30.2 L792.0,28.8 L798.0,28.0 L804.0,25.0 L810.0,25.0 L816.0,25.5 L822.0,22.5 L828.0,21.9 L834.0,18.3 L840.0,16.0 L846.0,18.2 L852.0,14.9 L858.0,14.0 L864.0,14.2 L870.0,15.8 L876.0,13.4 L882.0,13.7 L888.0,14.7 L894.0,15.2 L900.0,14.9 L906.0,15.2 L912.0,15.4 L918.0,14.2 L924.0,13.7 L930.0,16.3 L936.0,18.7 L942.0,16.9 L948.0,19.1 L954.0,20.0 L960.0,18.5 L966.0,17.9 L972.0,18.9 L978.0,18.4 L984.0,21.2 L990.0,24.4 L996.0,28.1 L1002.0,30.1 L1008.0,29.1 L1014.0,28.2 L1020.0,31.7 L1026.0,34.1 L1032.0,37.3 L1038.0,36.2 L1044.0,34.1 L1050.0,34.8 L1056.0,35.5 L1062.0,36.8 L1068.0,37.2 L1074.0,38.2 L1080.0,37.1 L1086.0,38.0 L1092.0,36.0 L1098.0,36.0 L1104.0,32.2 L1110.0,30.8 L1116.0,32.1 L1122.0,29.5 L1128.0,30.5 L1134.0,30.9 L1140.0,26.6 L1146.0,24.6 L1152.0,22.8 L1158.0,20.6 L1164.0,20.1 L1170.0,20.6 L1176.0,20.0 L1182.0,20.8 L1188.0,22.4 L1194.0,23.3 L1200.0,24.1 L1200,50 Z" 
                    />
                </svg>
            </div>
        </section>
    );
}
