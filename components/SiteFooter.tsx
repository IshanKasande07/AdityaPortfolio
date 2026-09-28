"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./SiteFooter.module.css";
import { scrollToTarget } from "@/lib/scroll";

export default function SiteFooter() {
    const footer = useRef<HTMLElement>(null);
    useEffect(() => {
        if (!footer.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();

        media.add("(prefers-reduced-motion: no-preference)", () => {
            const context = gsap.context(() => {
                const reveal = gsap.timeline({
                    scrollTrigger: {
                        trigger: footer.current,
                        start: "top 82%",
                        once: true,
                    },
                });

                reveal
                    .from(`.${styles.lineInner}`, {
                        yPercent: 112,
                        duration: 0.9,
                        stagger: 0.13,
                        ease: "power3.out",
                    })
                    .from(`.${styles.invitationCopy}`, {
                        clipPath: "inset(0 0 100% 0)",
                        opacity: 0,
                        y: 16,
                        duration: 0.7,
                        ease: "power3.out",
                    }, "-=0.48")
                    .from(`.${styles.landscapeImage}`, {
                        scale: 1.035,
                        duration: 1.5,
                        ease: "power2.out",
                    }, 0);

                gsap.fromTo(`.${styles.invitation}`,
                    { y: 34 },
                    {
                        y: -24,
                        ease: "none",
                        scrollTrigger: {
                            trigger: footer.current,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 0.8,
                        },
                    }
                );
            }, footer);

            return () => context.revert();
        });

        return () => media.revert();
    }, []);

    return (
        <footer ref={footer} className={`site-footer ${styles.footer}`} aria-label="Monarch Media House footer">
            <div className={styles.landscape} aria-hidden="true">
                <div className={styles.landscapeImage} data-footer-landscape>
                    <Image src="/footer-bg.png" alt="" fill sizes="100vw" className={styles.image} />
                </div>
                </div>
                <div className={styles.atmosphere} aria-hidden="true" />
                <div className={styles.inner}>
                    <div className={styles.invitation}>
                    <h2>
                        <span className={styles.line}><span className={styles.lineInner}>Ready to build</span></span>
                        <span className={styles.line}><span className={styles.lineInner}>absolute <em>authority?</em></span></span>
                    </h2>
                    <p className={styles.invitationCopy}>
                        Partner with us to create infotainment-led content that drives massive reach and converts attention into long-term growth.
                    </p>
                </div>
                <div className={styles.details}>
                    <div className={styles.identity}>
                        <Link href="/" aria-label="Monarch Media House home" className={styles.logo} data-cursor-hover>
                            <Image src="/brandlogo/Monarch White.png" alt="Monarch Media House" width={190} height={82} />
                        </Link>
                        <p>Expertise deserves an audience.</p>
                        <a href="mailto:hello@monarchmedia.house" className={styles.email} data-cursor-hover>hello@monarchmedia.house<ArrowUpRight size={16} aria-hidden="true" /></a>
                    </div>
                    <nav className={styles.navigation} aria-label="Footer navigation">
                        <span className={styles.label}>Explore</span>
                        <Link href="/" data-cursor-hover>Home</Link>
                        <Link href="/work" data-cursor-hover>Work</Link>
                        <Link href="/about" data-cursor-hover>About</Link>
                        <Link href="/contact" data-cursor-hover>Contact</Link>
                    </nav>
                    <nav className={styles.navigation} aria-label="Social links">
                        <span className={styles.label}>Elsewhere</span>
                        <a href="https://www.instagram.com/monarchmediahouse?igsh=OHdoOXZmMnB4cDQx" target="_blank" rel="noopener noreferrer" data-cursor-hover>Instagram<ArrowUpRight size={14} aria-hidden="true" /></a>
                        <a href="https://www.linkedin.com/company/monarchmediahouse/" target="_blank" rel="noopener noreferrer" data-cursor-hover>LinkedIn<ArrowUpRight size={14} aria-hidden="true" /></a>
                    </nav>
                </div>
                <div className={styles.bottom}>
                    <small>© {new Date().getFullYear()} Monarch Media House</small>
                    <button type="button" onClick={() => scrollToTarget(0, { immediate: window.matchMedia("(prefers-reduced-motion: reduce)").matches })} data-cursor-hover>Back to top<ArrowUp size={14} aria-hidden="true" /></button>
                </div>
            </div>
        </footer>
    );
}
