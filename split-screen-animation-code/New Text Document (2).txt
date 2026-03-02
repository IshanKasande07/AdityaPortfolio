"use client"

import { useEffect, useRef, useState } from "react";
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
    icon: <TrendingDown className="w-6 h-6" />,
    insight:
      "Low engagement isn't a platform problem. It's a value problem. When you educate, people engage. Stop talking about yourself and start talking about what they want to know.",
  },
  {
    id: "reach",
    title: "Poor Reach",
    lines: ["Poor", "Reach"],
    icon: <Zap className="w-6 h-6" />,
    insight:
      "Algorithms reward content people actually want to consume. Education is inherently shareable and saveable. It's the ultimate organic growth engine.",
  },
  {
    id: "retention",
    title: "Low Retention",
    lines: ["Low", "Retention"],
    icon: <Clock className="w-6 h-6" />,
    insight:
      "People scroll past entertainment. They stop for insight. Retention follows value. A 5-minute deep dive easily outperforms a 15-second gimmick.",
  },
  {
    id: "authority",
    title: "No Authority",
    lines: ["No", "Authority"],
    icon: <Shield className="w-6 h-6" />,
    insight:
      "You can't buy authority. You earn it by teaching what others don't know. Trust is built when you consistently give away the secrets.",
  },
  {
    id: "fatigue",
    title: "Content Fatigue",
    lines: ["Content", "Fatigue"],
    icon: <Coffee className="w-6 h-6" />,
    insight:
      "Fatigue comes from creating content that doesn't matter. Purpose eliminates burnout. Changing your focus from 'going viral' to 'how many can I help' changes the game.",
  },
];

/* ─── Letter-split title layer ─── */
const TitleLayer = ({
  problem,
  elRef,
  isFirst,
}: {
  problem: Problem;
  elRef: (el: HTMLDivElement | null) => void;
  isFirst: boolean;
}) => (
  <div
    ref={elRef}
    className="absolute inset-0 flex flex-col justify-center gap-1"
    aria-hidden
  >
    {problem.lines.map((line, li) => (
      <div key={li} className="overflow-hidden leading-none">
        <div className="word-row flex">
          {line.split("").map((char, ci) => (
            <span
              key={ci}
              className="letter inline-block"
              style={{
                opacity: isFirst ? 1 : 0,
                transform: isFirst ? "translateY(0)" : "translateY(80px)",
                willChange: "transform, opacity",
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    ))}
    <div className="overflow-hidden mt-4">
      <div
        className="accent-bar h-[3px] w-14 bg-gradient-to-r from-accent to-red-500 rounded-full origin-left"
        style={{ transform: isFirst ? "scaleX(1)" : "scaleX(0)" }}
      />
    </div>
  </div>
);

const ProblemsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);   // slot trigger
  const innerCardRefs = useRef<(HTMLDivElement | null)[]>([]); // the visible box
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const incomingLineRef = useRef<HTMLDivElement>(null);
  const headerSvgPathRef = useRef<SVGPathElement>(null);
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const headerSectionWrapRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [headerDims, setHeaderDims] = useState<{ width: number, height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (headerContainerRef.current) {
        setHeaderDims({
          width: headerContainerRef.current.offsetWidth,
          height: headerContainerRef.current.offsetHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    setTimeout(updateDimensions, 100);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const inner = innerCardRefs.current[index];

        // ── Title swap ──
        ScrollTrigger.create({
          trigger: card,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => swapTitle(index, 1),
          onEnterBack: () => swapTitle(index, -1),
        });

        // ── Scrub-based scale + brightness single timeline ──
        if (!inner) return;

        // Reset any inline styles first from previous renders
        gsap.set(inner, { scale: 0.85, opacity: 0.35 });

        // Create a single scrolling timeline spanning the card's journey across the viewport
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",    // When card enters bottom of screen
            end: "bottom 15%",   // When card leaves top of screen
            scrub: true,         // Smooth scrubbing
          }
        });

        tl.to(inner, {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          duration: 0.4        // Scales up as it comes in
        })
          .to(inner, {
            scale: 1,
            opacity: 1,
            duration: 0.2        // Holds at full scale while in middle
          })
          .to(inner, {
            scale: 0.85,
            opacity: 0.35,
            ease: "power2.in",
            duration: 0.4        // Scales down as it leaves
          });
      });

      // Seamless timeline for incoming line + SVG trace
      if (headerSectionWrapRef.current && incomingLineRef.current && headerSvgPathRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headerSectionWrapRef.current,
            start: "top center+=15%",
            end: "bottom center+=15%",
            scrub: true,
          }
        });

        tl.fromTo(incomingLineRef.current,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", duration: 60 }
        )
          .fromTo(headerSvgPathRef.current,
            { strokeDashoffset: 1000 },
            { strokeDashoffset: 0, ease: "none", duration: 1000 },
            ">"
          );
      }
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerDims]);

  const swapTitle = (incoming: number, dir: 1 | -1) => {
    const exitY = dir === 1 ? -80 : 80;
    const enterY = dir === 1 ? 80 : -80;

    titleRefs.current.forEach((el, i) => {
      if (!el) return;
      const letters = el.querySelectorAll(".letter");
      const bar = el.querySelector(".accent-bar");

      if (i === incoming) {
        gsap.fromTo(
          letters,
          { y: enterY, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            stagger: { each: 0.022, from: "start" },
            overwrite: true,
          }
        );
        if (bar) gsap.to(bar, { scaleX: 1, duration: 0.5, ease: "power3.out", delay: 0.15 });
        el.style.zIndex = "10";
      } else {
        gsap.to(letters, {
          y: exitY,
          opacity: 0,
          duration: 0.38,
          ease: "power2.in",
          stagger: { each: 0.018, from: "end" },
          overwrite: true,
        });
        if (bar) gsap.to(bar, { scaleX: 0, duration: 0.25, ease: "power2.in" });
        el.style.zIndex = "1";
      }
    });

    setActiveIndex(incoming);
  };

  const w = headerDims.width;
  const h = headerDims.height;
  const radius = 24; // text container rounded-3xl

  const headerPathD = w > 0 ? `
    M ${w / 2} -20 
    Q ${w / 2} 0 ${w / 2 + 20} 0 
    L ${w - radius} 0 
    Q ${w} 0 ${w} ${radius} 
    L ${w} ${h - radius} 
    Q ${w} ${h} ${w - radius} ${h} 
    L ${radius} ${h} 
    Q 0 ${h} 0 ${h - radius} 
    L 0 ${radius} 
    Q 0 0 ${radius} 0 
    L ${(w / 2) - 20} 0
  ` : "";

  return (
    <div ref={sectionRef} className="relative w-full bg-background">

      {/* ── Section header centred above the split ── */}
      <div ref={headerSectionWrapRef} className="relative w-full flex flex-col items-center pt-0 pb-10">

        {/* Incoming Connecting Line from previous section */}
        <div className="relative w-full flex justify-center h-[80px] z-10">
          <div className="absolute top-0 h-[60px] w-[2px] bg-white/5"></div>
          <div
            ref={incomingLineRef}
            className="absolute top-0 h-[60px] w-[2px] bg-gradient-to-b from-[#FF5733] to-[#FFC300] origin-top shadow-[0_0_15px_rgba(255,195,0,0.5)] z-0"
          ></div>
        </div>

        {/* Traced Header Container */}
        <div className="relative flex flex-col items-center">

          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 transition-opacity duration-300 ${w > 0 ? 'opacity-100' : 'opacity-0'}`}
            style={{ width: w || "100%", height: h || "100%" }}
          >
            <svg className="w-full h-full absolute inset-0 overflow-visible" style={{ zIndex: 0 }}>
              <path d={headerPathD} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
              <path
                ref={headerSvgPathRef}
                d={headerPathD}
                fill="none"
                stroke="#FFC300"
                strokeWidth="2"
                pathLength="1000"
                style={{ strokeDasharray: "1000 1050", strokeDashoffset: 1000, filter: 'drop-shadow(0px 0px 8px rgba(255, 195, 0, 0.6))' }}
              />
            </svg>
          </div>

          <div ref={headerContainerRef} className="relative z-10 text-center px-[5vw] py-8 bg-surface-light/30 border border-white/5 backdrop-blur-md rounded-3xl">
            <h2 className="text-4xl md:text-[4vw] font-display font-semibold text-primary tracking-tight">
              The Problems We Solve
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FFC300] to-red-500 mx-auto mt-5 rounded-full" />
            <p className="mt-4 text-base md:text-[1.2vw] text-muted max-w-2xl mx-auto">
              Discover how infotainment transforms common business challenges into opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* ── Split columns ── */}
      {/* The left col uses CSS sticky so it stays centered in the viewport
          while the right col's block-level cards scroll past normally. */}
      <div className="flex w-full">

        {/* LEFT — sticky title panel */}
        <div className="w-[45%] shrink-0">
          <div
            className="sticky top-0 h-screen flex flex-col items-start justify-center px-[6vw] border-r border-white/5"
          >


            {/* Counter */}
            <p className="font-mono text-xs text-muted/40 tracking-[0.3em] uppercase mb-8 relative z-10">
              {String(activeIndex + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(problemsList.length).padStart(2, "0")}
            </p>

            {/* Floating icon */}
            <div className="relative z-10 h-12 w-12 mb-10">
              {problemsList.map((p, i) => (
                <div
                  key={p.id}
                  className="absolute inset-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent transition-all duration-300"
                  style={{
                    opacity: i === activeIndex ? 1 : 0,
                    transform: `scale(${i === activeIndex ? 1 : 0.75})`,
                  }}
                >
                  {p.icon}
                </div>
              ))}
            </div>

            {/* Title stack — one absolutely-positioned layer per problem */}
            <div className="relative z-10 w-full" style={{ height: "42vh" }}>
              {problemsList.map((problem, index) => (
                <TitleLayer
                  key={problem.id}
                  problem={problem}
                  isFirst={index === 0}
                  elRef={(el) => {
                    titleRefs.current[index] = el;
                    if (el) el.style.zIndex = index === 0 ? "10" : "1";
                  }}
                />
              ))}
            </div>

            {/* Progress dots */}
            <div className="absolute bottom-10 left-[6vw] flex gap-2 z-10">
              {problemsList.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: i === activeIndex ? 28 : 7,
                    height: 7,
                    backgroundColor:
                      i === activeIndex
                        ? "var(--color-accent, #FFC300)"
                        : "rgba(255,255,255,0.12)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — peek scroll cards */}
        {/* overflow-hidden clips peeking neighbours; py gives breathing room */}
        <div className="w-[55%] flex flex-col overflow-hidden" style={{ paddingTop: "20vh" }}>
          {problemsList.map((problem, index) => (
            // Slot is ~75vh so next/prev cards bleed in
            <div
              key={problem.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="flex items-center justify-center px-[4vw] py-6"
              style={{ height: "75vh" }}
            >
              {/* Inner box — GSAP animates scale + opacity on this */}
              <div
                ref={(el) => { innerCardRefs.current[index] = el; }}
                className="w-full max-w-lg bg-surface-light/25 backdrop-blur-xl border border-white/8 rounded-3xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-colors duration-300"
                style={{ willChange: "transform, opacity", transformOrigin: "center" }}
              >
                <div className="text-xs font-mono text-muted/40 tracking-widest mb-5 uppercase">
                  Problem {String(index + 1).padStart(2, "0")}
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="text-accent">{problem.icon}</div>
                  <h4 className="text-xl font-display font-semibold text-accent tracking-tight">
                    {problem.title}
                  </h4>
                </div>

                <p className="text-base md:text-lg text-primary/70 leading-[1.75] font-light">
                  {problem.insight}
                </p>

                <div className="mt-8 pt-6 border-t border-white/8">
                  <span className="text-xs text-muted/40 font-mono tracking-wider uppercase">
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
          font-size: clamp(2.4rem, 4.8vw, 6rem);
          font-family: var(--font-display, sans-serif);
          font-weight: 700;
          line-height: 1;
          color: var(--color-primary, white);
          letter-spacing: -0.03em;
        }
      `}</style>

      {/* ── Wave transition ── */}
      <div className="w-full overflow-hidden leading-[0] relative h-[100px] pointer-events-none z-40 bg-background">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-[100vw] h-[100px] transform scale-105 translate-y-[2px] block">
          <path d="M0 100C0 100 360 0 720 0C1080 0 1440 100 1440 100V100H0V100Z" fill="var(--color-surface)" />
        </svg>
      </div>
    </div>
  );
};

export default ProblemsSection;
