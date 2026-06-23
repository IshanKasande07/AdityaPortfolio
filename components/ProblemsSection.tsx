"use client"

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, TrendingDown, Clock, Shield, Coffee } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Problem {
  id: string;
  title: string;
  lines: string[]; // title split into visual lines
  icon: React.ReactNode;
  insight: string;
}

const problemsList: Problem[] = [
  {
    id: "engagement",
    title: "Low Engagement",
    lines: ["Low", "Engagement"],
    icon: <TrendingDown className="w-5 h-5" />,
    insight:
      "Low engagement isn't a platform problem. It's a value problem. When you educate, people engage. Stop talking about yourself and start talking about what they want to know.",
  },
  {
    id: "reach",
    title: "Poor Reach",
    lines: ["Poor", "Reach"],
    icon: <Zap className="w-5 h-5" />,
    insight:
      "Algorithms reward content people actually want to consume. Education is inherently shareable and saveable. It's the ultimate organic growth engine.",
  },
  {
    id: "retention",
    title: "Low Retention",
    lines: ["Low", "Retention"],
    icon: <Clock className="w-5 h-5" />,
    insight:
      "People scroll past entertainment. They stop for insight. Retention follows value. A 5-minute deep dive easily outperforms a 15-second gimmick.",
  },
  {
    id: "authority",
    title: "No Authority",
    lines: ["No", "Authority"],
    icon: <Shield className="w-5 h-5" />,
    insight:
      "You can't buy authority. You earn it by teaching what others don't know. Trust is built when you consistently give away the secrets.",
  },
  {
    id: "fatigue",
    title: "Content Fatigue",
    lines: ["Content", "Fatigue"],
    icon: <Coffee className="w-5 h-5" />,
    insight:
      "Fatigue comes from creating content that doesn't matter. Purpose eliminates burnout. Changing your focus from 'going viral' to 'how many can I help' changes the game.",
  },
];

const ProblemsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);   // slot trigger
  const innerCardRefs = useRef<(HTMLDivElement | null)[]>([]); // the visible box

  const slashLineRef = useRef<SVGLineElement>(null);
  const transitionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observers: IntersectionObserver[] = [];
    let timerId: ReturnType<typeof setTimeout>;

    const setupObservers = () => {
      // Re-set all cards to hidden AFTER layout has settled
      cardRefs.current.forEach((card, index) => {
        const inner = innerCardRefs.current[index];
        if (!inner) return;
        gsap.set(inner, { scale: 0.85, opacity: 0, y: 20 });
        const letters = inner.querySelectorAll(".letter");
        const bar = inner.querySelector(".accent-bar");
        gsap.set(letters, { y: 60, opacity: 0 });
        if (bar) gsap.set(bar, { scaleX: 0 });
      });

      // Tell GSAP to recalculate all ScrollTriggers now that layout is settled
      ScrollTrigger.refresh();

      // NOW start observing
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const inner = innerCardRefs.current[index];
        if (!inner) return;

        const letters = inner.querySelectorAll(".letter");
        const bar = inner.querySelector(".accent-bar");

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // ── Card reveal ──
                gsap.to(inner, {
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "power3.out",
                  overwrite: true,
                });
                // ── Letter stagger reveal (simultaneous) ──
                gsap.to(letters, {
                  y: 0,
                  opacity: 1,
                  duration: 0.7,
                  ease: "power3.out",
                  stagger: { each: 0.03, from: "start" },
                  delay: 0.1,
                  overwrite: true,
                });
                // ── Accent bar ──
                if (bar) {
                  gsap.to(bar, {
                    scaleX: 1,
                    duration: 0.6,
                    ease: "power3.out",
                    delay: 0.3,
                    overwrite: true,
                  });
                }
              } else {
                // ── Exit: fade back to hidden ──
                gsap.to(inner, {
                  scale: 0.85,
                  opacity: 0,
                  y: 20,
                  duration: 0.4,
                  ease: "power2.in",
                  overwrite: true,
                });
                gsap.to(letters, {
                  y: 60,
                  opacity: 0,
                  duration: 0.3,
                  ease: "power2.in",
                  stagger: { each: 0.02, from: "end" },
                  overwrite: true,
                });
                if (bar) {
                  gsap.to(bar, {
                    scaleX: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    overwrite: true,
                  });
                }
              }
            });
          },
          {
            threshold: 0.15,
            rootMargin: "0px 0px -5% 0px",
          }
        );

        observer.observe(card);
        observers.push(observer);
      });
    };

    // Delay by 500ms — lets GSAP pin-spacers from sections above (WhyInfotainmentWorks)
    // finish inserting into the DOM before we start observing, preventing
    // false-positive intersection fires that animate cards before user reaches section.
    timerId = setTimeout(() => {
      requestAnimationFrame(setupObservers);
    }, 500);


    const ctx = gsap.context(() => {

      // ── Gold Slash: looping glow pulse ──
      if (slashLineRef.current) {
        gsap.fromTo(
          slashLineRef.current,
          { attr: { strokeWidth: 1.5 }, opacity: 0.7 },
          {
            attr: { strokeWidth: 3 },
            opacity: 1,
            duration: 2.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }
        );
      }

      // ── Geometric Cut Transition Parallax ──
      if (transitionRef.current) {
        gsap.fromTo(transitionRef.current,
          { y: 0 },
          {
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: transitionRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true,
            }
          }
        );
      }

    }, sectionRef);

    return () => {
      clearTimeout(timerId);
      observers.forEach((obs) => obs.disconnect());
      ctx.revert();
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative w-full bg-background pt-0">
      {/* ── Split columns ── */}
      <div className="flex flex-col md:flex-row w-full max-w-[1040px] mx-auto">

        {/* LEFT — sticky title panel */}
        <div className="w-full md:w-[55%] shrink-0">
          <div className="md:sticky md:top-0 h-auto md:h-screen flex flex-col items-start justify-center px-6 md:px-16 py-12 md:py-0 border-b md:border-b-0 md:border-r border-primary/5">
            <div className="relative z-10 w-full pl-0">

              <h2
                className="font-display font-bold text-primary tracking-[-0.03em] leading-[1.05]"
                style={{ fontSize: "clamp(2.5rem, 4.5vw, 5rem)" }}
              >
                Problems<br />
                We&nbsp;&nbsp;Solve
              </h2>

              {/* Scribbled Arching Arrow (hidden on mobile, visible on md+) */}
              <div className="hidden md:block absolute -top-[80%] left-[90%] w-[25vw] max-w-[350px] h-auto opacity-70 pointer-events-none z-0 transform -translate-x-1/2">
                <svg
                  viewBox="0 0 300 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full text-accent drop-shadow-[0_0_12px_rgba(137,162,54,0.4)]"
                  style={{ vectorEffect: "non-scaling-stroke" }}
                >
                  {/* Arrow main curved arch (starts left bottoms, arches right) */}
                  <path
                    d="M40,80 C 80,0 240,0 280,80"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Arrow head */}
                  <path
                    d="M265,55 L280,80 L250,85"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Subtle scribble loop on tail */}
                  <path
                    d="M35,75 C 25,95 55,100 45,80"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                  />
                </svg>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT — peek scroll cards */}
        <div className="w-full md:w-[45%] flex flex-col items-center overflow-hidden md:border-l border-primary/5" style={{ paddingTop: "10vh", paddingBottom: "10vh" }}>
          {problemsList.map((problem, index) => (
            <div
              key={problem.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="flex items-center justify-center px-[4%] py-6 md:py-4 w-full min-h-[40vh] md:h-[45vh]"
            >
              {/* Inner box — GSAP animates scale + opacity on this */}
              <div
                ref={(el) => { innerCardRefs.current[index] = el; }}
                className="w-full max-w-[280px] bg-surface-light/10 backdrop-blur-md rounded-[24px] p-4 md:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-colors duration-300"
                style={{ willChange: "transform, opacity", transformOrigin: "center left" }}
              >
                <div className="text-[9px] font-mono text-muted/30 tracking-widest mb-3 uppercase">
                  Problem {String(index + 1).padStart(2, "0")}
                </div>

                {/* Grouping Icon and Animated Title */}
                <div className="flex items-start gap-3 mb-3">
                  {/* The Icon */}
                  <div className="text-accent shrink-0 bg-primary/5 p-2 rounded-lg border border-primary/10 mt-1.5 md:mt-2">
                    {problem.icon}
                  </div>

                  {/* The Animated Title Layer */}
                  <div className="flex-1" aria-hidden>
                    {problem.lines.map((line, li) => (
                      <div key={li} className="overflow-hidden leading-none mb-0.5">
                        <div className="word-row flex flex-wrap">
                          {line.split("").map((char, ci) => (
                            <span
                              key={ci}
                              className="letter inline-block"
                              style={{
                                opacity: 0,
                                transform: "translateY(80px)",
                                willChange: "transform, opacity",
                              }}
                            >
                              {char === " " ? "\u00A0" : char}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="overflow-hidden mt-4">
                      <div
                        className="accent-bar h-[2px] w-12 bg-gradient-to-r from-accent to-surface-light rounded-full origin-left opacity-80"
                        style={{ transform: "scaleX(0)" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Insight Description */}
                <div className="flex flex-col mt-3 gap-2">
                  <p className="text-[11px] md:text-[12px] text-primary/60 leading-[1.5] font-light">
                    {problem.insight}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-primary/5 w-full">
                  <span className="text-[9px] text-muted/30 font-mono tracking-wider uppercase">
                    The Fix →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Letter size ── */}
      <style>{`
        .word-row .letter {
          font-size: clamp(1.4rem, 2.2vw, 24px);
          font-family: var(--font-display, sans-serif);
          font-weight: 700;
          line-height: 1;
          color: var(--color-primary, white);
          letter-spacing: -0.04em;
        }
      `}</style>

      {/* ── Transition A: Gold Slash Geometric Cut ── */}
      <div ref={transitionRef} className="w-full relative pointer-events-none overflow-hidden z-40" style={{ height: '90px', marginBottom: '-1px' }}>
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full block"
        >
          <defs>
            <linearGradient id="slashGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#89A236" stopOpacity="0" />
              <stop offset="20%" stopColor="#89A236" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFD700" stopOpacity="1" />
              <stop offset="80%" stopColor="#FF5733" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF5733" stopOpacity="0" />
            </linearGradient>
            <filter id="slashGlow" x="-20%" y="-200%" width="140%" height="500%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Upper fill: background color above the slash */}
          <polygon points="0,0 1440,0 1440,0 0,90" fill="var(--color-background)" />
          {/* Lower fill: surface color below the slash (next section = bg-surface for Who) */}
          <polygon points="0,90 1440,0 1440,90" fill="var(--color-background)" />
          {/* The glowing slash line */}
          <line
            ref={slashLineRef}
            x1="0" y1="90"
            x2="1440" y2="0"
            stroke="url(#slashGold)"
            strokeWidth="2"
            filter="url(#slashGlow)"
          />
          {/* Secondary softer echo line for depth */}
          <line
            x1="0" y1="92"
            x2="1440" y2="2"
            stroke="url(#slashGold)"
            strokeWidth="1"
            opacity="0.3"
          />
        </svg>
      </div>
    </div>
  );
};

export default ProblemsSection;
