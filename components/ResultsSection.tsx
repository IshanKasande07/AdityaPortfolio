"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import styles from "./ResultsSection.module.css";

const stats = [
    { value: 10, suffix: "M+", label: "Views" },
    { value: 1200, suffix: "+", label: "Creatives" },
    { value: 20, suffix: "+", label: "Brands" },
    { value: 150, suffix: "%", label: "Traffic Growth" },
];

function Counter({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const reducedMotion = useReducedMotion();
    const inView = useInView(ref, { once: true, amount: 0.5 });
    const count = useMotionValue(0);
    const spring = useSpring(count, { stiffness: 40, damping: 30 });
    const display = useTransform(spring, latest => Intl.NumberFormat("en-US").format(Math.round(latest)));
    useEffect(() => { if (inView) count.set(value); }, [inView, count, value]);
    return <span ref={ref} aria-hidden="true">{reducedMotion ? Intl.NumberFormat("en-US").format(value) : <motion.span>{display}</motion.span>}</span>;
}

export default function ResultsSection() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: sceneRef, offset: ["start end", "end start"] });
    const imageY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
    return (
        <section id="results" className={styles.section} aria-labelledby="results-title">
            <div className={styles.inner}>
                <header className={styles.header}>
                    <h2 id="results-title">Results That <em>Speak.</em></h2>
                    <p>We don&apos;t just talk about growth. We engineer it. Here&apos;s a snapshot of the tangible value we&apos;ve delivered.</p>
                </header>
                <motion.div ref={sceneRef} className={styles.scene} initial={false}
                    whileInView={reducedMotion ? undefined : { clipPath: ["inset(6% 3% 6% 3% round 24px)", "inset(0% 0% 0% 0% round 24px)"] }}
                    viewport={{ amount: 0.25, once: true }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}>
                    <motion.div className={styles.image} style={{ y: reducedMotion ? 0 : imageY }}>
                        <Image src="/assets/infotainment/04-production.jpg" alt="" fill sizes="(max-width: 767px) 100vw, 1070px" className={styles.photo} />
                    </motion.div>
                    <div className={styles.shade} aria-hidden="true" />
                    <Link href="/work" className={styles.workLink} data-cursor-hover>
                        Explore the work <span><ArrowUpRight size={19} strokeWidth={1.5} aria-hidden="true" /></span>
                    </Link>
                </motion.div>
                <dl className={styles.metrics}>
                    {stats.map(stat => (
                        <div key={stat.label} className={styles.metric}>
                            <dt>{stat.label}</dt>
                            <dd>
                                <span className={styles.srOnly}>{Intl.NumberFormat("en-US").format(stat.value)}{stat.suffix}</span>
                                <Counter value={stat.value} /><span className={styles.suffix} aria-hidden="true">{stat.suffix}</span>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
