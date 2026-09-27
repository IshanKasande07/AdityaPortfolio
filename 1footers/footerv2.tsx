"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import styles from "./SiteFooter.module.css";
import { scrollToTarget } from "@/lib/scroll";

export default function SiteFooter() {
    const footer = useRef<HTMLElement>(null);
    useEffect(() => {
        const element = footer.current;
        if (!element) return;
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        const animations = new Map<Element, Animation>();
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const target = entry.target as HTMLElement;
                if (!entry.isIntersecting) {
                    animations.get(target)?.cancel();
                    animations.delete(target);
                    return;
                }
                if (preference.matches || target.contains(document.activeElement)) return;
                const landscape = target.hasAttribute("data-footer-landscape");
                const animation = target.animate(
                    landscape
                        ? [{ transform: "scale(1.035)" }, { transform: "scale(1)" }]
                        : [{ opacity: 0.65, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
                    { duration: landscape ? 1800 : 850, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
                );
                animations.set(target, animation);
                animation.onfinish = () => animations.delete(target);
            });
        }, { threshold: 0.12 });
        element.querySelectorAll("[data-footer-enter], [data-footer-landscape]").forEach(target => observer.observe(target));
        const cancel = () => { animations.forEach(animation => animation.cancel()); animations.clear(); };
        element.addEventListener("focusin", cancel);
        preference.addEventListener("change", cancel);
        return () => { observer.disconnect(); cancel(); element.removeEventListener("focusin", cancel); preference.removeEventListener("change", cancel); };
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
                    <h2 data-footer-enter>Make room for<br /><em>what’s next.</em></h2>
                    <Link href="/contact" className={styles.action} data-cursor-hover onClick={event => {
                        if (window.location.pathname === "/contact" && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
                            event.preventDefault();
                            scrollToTarget(0, { immediate: window.matchMedia("(prefers-reduced-motion: reduce)").matches });
                        }
                    }}>
                        <span>Let’s talk</span><ArrowUpRight size={19} aria-hidden="true" />
                    </Link>
                </div>
                <div className={styles.details}>
                    <div className={styles.identity}>
                        <Link href="/" aria-label="Monarch Media House home" className={styles.logo} data-cursor-hover>
                            <Image src="/brandlogo/Monarch White.png" alt="Monarch Media House" width={190} height={82} />
                        </Link>
                        <p data-footer-enter>Expertise deserves an audience.</p>
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
