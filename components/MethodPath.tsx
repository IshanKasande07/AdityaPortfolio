"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./MethodPath.module.css";

const stages = ["Attention", "Authority", "Trust", "Demand"];

export default function MethodPath() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.style.setProperty("--path-reveal", "100%");
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        root,
        { "--path-reveal": "0%" },
        {
          "--path-reveal": "100%",
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            end: "bottom 42%",
            scrub: 0.65,
          },
        },
      );
    }, root);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className={styles.journey}>
      <div className={styles.path} aria-hidden="true" />
      <ol className={styles.labels} aria-label="The path from attention to demand">
        {stages.map((stage, index) => (
          <li key={stage} className={styles[`stage${index + 1}`]}>
            {stage}
          </li>
        ))}
      </ol>
    </div>
  );
}
