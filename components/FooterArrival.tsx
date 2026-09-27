"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FooterArrival.module.css";

/** One shared image coordinate system keeps the bridge continuous at the seam. */
export default function FooterArrival({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 767px)" }, (match) => {
      if (!match.conditions?.motion) return;
      const inset = match.conditions.mobile ? 34 : 19;
      const edge = match.conditions.mobile ? 8 : 20;
      const context = gsap.context(() => {
        const left = `.${styles.left}`;
        const right = `.${styles.right}`;
        gsap.set(left, { clipPath: `inset(${inset}% 50.6% ${inset}% ${edge}%)`, yPercent: 5 });
        gsap.set(right, { clipPath: `inset(${inset}% ${edge}% ${inset}% 50.6%)`, yPercent: -5 });
        gsap.set(`.${styles.letter}`, { yPercent: 115 });
        gsap.set(`.${styles.fade}`, { opacity: 0 });
        gsap.set(`.${styles.full}`, { opacity: 0 });
        gsap.set(`.${styles.content}`, { autoAlpha: 0 });
        gsap.set("[data-footer-line], .bridge-footer img, .footer-links > div, [data-footer-reveal]", { y: 22, opacity: 0 });

        const sequence = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.45}`,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "power2.inOut" },
        });
        sequence
          .to([left, right], { yPercent: 0, duration: 0.28 }, 0)
          .to(left, { clipPath: `inset(${inset}% 49.98% ${inset}% ${edge}%)`, duration: 0.2 }, 0.18)
          .to(right, { clipPath: `inset(${inset}% ${edge}% ${inset}% 49.98%)`, duration: 0.2 }, 0.18)
          .to(left, { clipPath: "inset(0% 49.98% 0% 0%)", duration: 0.48 }, 0.38)
          .to(right, { clipPath: "inset(0% 0% 0% 49.98%)", duration: 0.48 }, 0.38)
          .to(`.${styles.image}`, { scale: 1.1, duration: 0.55 }, 0.38)
          // Once open, use one image to eliminate subpixel clipping seams.
          .set(`.${styles.full}`, { opacity: 1 }, 0.86)
          .set([left, right], { opacity: 0 }, 0.86)
          .to(`.${styles.letter}`, { yPercent: 0, duration: 0.23, stagger: 0.018, ease: "power3.out" }, 0.58)
          .to(`.${styles.title}`, { autoAlpha: 0, y: -30, duration: 0.18 }, 1.02)
          .to(`.${styles.fade}`, { opacity: 1, duration: 0.28 }, 1.02)
          .set(`.${styles.content}`, { autoAlpha: 1 }, 1.12)
          .to("[data-footer-line], .bridge-footer img, .footer-links > div, [data-footer-reveal]", { y: 0, opacity: 1, stagger: 0.025, duration: 0.3 }, 1.12);
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <div ref={root} className={styles.journey}>
      <div className={styles.stage}>
        {[styles.left, styles.right, styles.full].map((half) => (
          <div key={half} className={`${styles.half} ${half}`} aria-hidden="true">
            <Image src="/footer-bg.png" alt="" fill sizes="100vw" className={styles.image} />
            <div className={styles.shade} />
          </div>
        ))}
        <h2 className={styles.title} aria-label="Authority">
          <span className={styles.word} aria-hidden="true">
            {"AUTHORITY".split("").map((letter, index) => <span className={styles.letter} key={index}>{letter}</span>)}
          </span>
        </h2>
        <div className={styles.fade} aria-hidden="true" />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
