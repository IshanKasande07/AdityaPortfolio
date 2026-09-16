"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Play } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./WhyInfotainmentWorks.module.css";
import MethodPath from "./MethodPath";

const edits = [
  { outcome: "Attention", edit: "The hook", title: "Make the first second impossible to ignore.", note: "Open on a question, image, or tension the audience needs resolved.", reaction: "Wait—what is this?", image: "/assets/infotainment/01-threshold.jpg", alt: "An open doorway framing hazy Lisbon rooftops and a distant bridge", position: "center 58%" },
  { outcome: "Authority", edit: "The insight", title: "Reward attention with an idea worth keeping.", note: "Turn expertise into one clear shift in how the audience sees the problem.", reaction: "I’ve never thought of it that way.", image: "/assets/infotainment/02-insight.jpg", alt: "A reader absorbed in a book beside a softly lit window", position: "center 48%" },
  { outcome: "Trust", edit: "The pattern", title: "Make useful thinking feel familiar.", note: "A recognisable voice, repeated with care, gives people a reason to return.", reaction: "There’s always something worth learning here.", image: "/assets/infotainment/03-pattern.jpg", alt: "Repeating curved balconies forming a precise architectural rhythm", position: "center 48%" },
  { outcome: "Demand", edit: "The payoff", title: "Turn remembered value into intent.", note: "When the need arrives, your expertise is already the natural next step.", reaction: "These are the people I want to work with.", image: "/assets/infotainment/04-production.jpg", alt: "A filmmaker recording a subject inside a dark editorial studio", position: "center 45%" },
];

export default function WhyInfotainmentWorks() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeEdit, setActiveEdit] = useState(0);

  useEffect(() => {
    if (!rootRef.current || !trackRef.current || !editorRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const editor = editorRef.current!;
        ScrollTrigger.create({
          trigger: trackRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          onUpdate: ({ progress }) => {
            editor.style.setProperty("--edit-progress", `${progress}`);
            editor.style.setProperty("--cloud-drift", `${progress * 11}%`);
            editor.style.setProperty("--cloud-x", `${progress * -3}%`);
            editor.style.setProperty("--playhead-x", `${progress * 100}%`);
            setActiveEdit(Math.min(edits.length - 1, Math.floor(progress * edits.length)));
          },
        });
        gsap.from(editor, { clipPath: "inset(12% 8% 12% 8% round 32px)", scale: 0.96, ease: "power3.out", scrollTrigger: { trigger: trackRef.current, start: "top 88%", end: "top 20%", scrub: 0.8 } });
      });
      media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-mobile-cut]").forEach((cut) => {
          gsap.from(cut, { y: 34, opacity: 0.35, duration: 0.95, ease: "power3.out", scrollTrigger: { trigger: cut, start: "top 88%", once: true } });
        });
      });

      // Global animations (run on all screen sizes)
      gsap.fromTo("[data-edit-heading] > span > span",
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.25, duration: 1.8, ease: "power3.out", scrollTrigger: { trigger: "[data-edit-heading]", start: "top 85%", end: "bottom top", toggleActions: "play reverse play reverse" } }
      );
      gsap.fromTo("[data-intro-copy] > * > span",
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.15, duration: 1.6, ease: "power3.out", scrollTrigger: { trigger: "[data-intro-copy]", start: "top 85%", end: "bottom top", toggleActions: "play reverse play reverse" } }
      );
    }, rootRef);
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { cancelAnimationFrame(frame); media.revert(); context.revert(); };
  }, []);

  const active = edits[activeEdit];

  return (
    <section ref={rootRef} id="infotainment" aria-labelledby="infotainment-heading" className={styles.section}>
      <header className={styles.intro}>
        <h2 id="infotainment-heading" data-edit-heading className={styles.heading}><span><span>Great content doesn’t hold attention</span></span><span><span>by <em>accident.</em></span></span></h2>
        <div data-intro-copy className={styles.introCopy}><p><span>Step inside the edit and see how entertainment becomes education—and how both become demand.</span></p><span className={styles.scrollHint}><span><ArrowDown size={15} aria-hidden="true" /> Scroll to move the playhead</span></span></div>
      </header>

      <div ref={trackRef} className={styles.track}>
        <div ref={editorRef} className={styles.editor}>
          <div className={styles.editorBar}><span className={styles.projectName}><i /> MONARCH / INFOTAINMENT_01</span><span className={styles.timecode}>00:00:0{activeEdit + 1}:12</span></div>
          <div className={styles.monitor}>
            {edits.map((edit, index) => <figure key={edit.outcome} className={styles.footage} data-active={activeEdit === index} aria-hidden={activeEdit !== index}><Image src={edit.image} alt={activeEdit === index ? edit.alt : ""} fill priority={index === 0} sizes="(max-width: 1100px) 100vw, 1070px" style={{ objectPosition: edit.position }} /></figure>)}
            <div className={styles.grade} />
            <Image src="/heroassets/CLoud.webp" alt="" width={1920} height={720} className={styles.cloudLayer} aria-hidden="true" />
            <div className={styles.frameCorners} aria-hidden="true"><i /><i /><i /><i /></div>
            {edits.map((edit, index) => <div key={edit.edit} className={styles.editCopy} data-active={activeEdit === index} aria-hidden={activeEdit !== index}><span className={styles.editLabel}>{edit.edit}</span><h3>{edit.title}</h3></div>)}
            <div className={styles.audienceReaction}><p key={activeEdit}>“{active.reaction}”</p></div>
            <div className={styles.outcome}><span>0{activeEdit + 1} /</span><strong key={activeEdit}>{active.outcome}</strong></div>
          </div>
          <div className={styles.timeline}>
            <div className={styles.controls}><Play size={13} fill="currentColor" aria-hidden="true" /><span>V1</span></div>
            <div className={styles.timelineBody}>
              <div className={styles.clips}>{edits.map((edit, index) => <div key={edit.outcome} className={styles.clip} data-active={activeEdit === index}><Image src={edit.image} alt="" fill sizes="240px" /><span>0{index + 1} · {edit.edit}</span></div>)}</div>
              <div className={styles.playhead} aria-hidden="true"><i /></div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mobileCuts}>
        {edits.map((edit, index) => <article key={edit.outcome} data-mobile-cut className={styles.mobileCut}><div className={styles.mobileFrame}><Image src={edit.image} alt={edit.alt} fill sizes="100vw" style={{ objectPosition: edit.position }} /><span>0{index + 1} / {edit.edit}</span><strong>{edit.outcome}</strong></div><p className={styles.mobileReaction}>“{edit.reaction}”</p><h3>{edit.title}</h3><p>{edit.note}</p></article>)}
      </div>

      <footer className={styles.outroWrapper}>
        <div className={styles.outro}>
          <p>Entertainment earns the pause.<br /><em>Education makes it valuable.</em></p>
          <a href="/work" data-cursor-hover className={styles.workLink}>See the work <ArrowUpRight size={19} aria-hidden="true" /></a>
        </div>
        <div className={styles.lineWrapper}>
          <Image src="/assets/6a51975c584436cfdd9e2406_loc_path.svg" alt="" width={1072} height={208} className={styles.outroLine} aria-hidden="true" />
          <span className={styles.floatWord} style={{ top: "48%", left: "16%" }}>
            <i>01</i><strong>Attention</strong><small>Earn the pause</small>
          </span>
          <span className={styles.floatWord} style={{ top: "82%", left: "36%" }}>
            <i>02</i><strong>Authority</strong><small>Share what matters</small>
          </span>
          <span className={styles.floatWord} style={{ top: "43%", left: "64%" }}>
            <i>03</i><strong>Trust</strong><small>Become remembered</small>
          </span>
          <span className={styles.floatWord} style={{ top: "78%", left: "86%" }}>
            <i>04</i><strong>Demand</strong><small>Turn value into intent</small>
          </span>
        </div>
      </footer>
    </section>
  );
}
