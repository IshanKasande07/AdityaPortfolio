"use client"

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Brain, Heart, Zap } from "lucide-react";

const WhyInfotainmentWorks = () => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const svgPathsRef = useRef<(SVGPathElement | null)[]>([]);
  const connectingLinesRef = useRef<(SVGLineElement | null)[]>([]);
  const actionWordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const incomingLineRef = useRef<SVGLineElement>(null);
  const waveTransitionRef = useRef<HTMLDivElement>(null);

  const [cardDimensions, setCardDimensions] = useState<{ width: number, height: number }[]>([]);

  // Capture dimensions to build accurate SVG paths
  useEffect(() => {
    const updateDimensions = () => {
      if (cardRefs.current) {
        const dims = cardRefs.current.map(card => ({
          width: card?.offsetWidth || 320,
          height: card?.offsetHeight || 200
        }));
        setCardDimensions(dims);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const timeOut = setTimeout(updateDimensions, 150);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timeOut);
    }
  }, []);

  useEffect(() => {
    if (!cardDimensions.length) return;
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    let ctx = gsap.context(() => {
      // Create a master timeline locked purely to vertical scrolling
      // We removed horizontal panning to keep everything completely still as requested.
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom", // Ties perfectly to the 300vh container
          scrub: 1,
          // No pinning used! We rely on native CSS `sticky` below. 
        }
      });

      // A. Draw Initial Unifying Incoming Line first
      if (incomingLineRef.current) {
        masterTl.fromTo(incomingLineRef.current,
          { strokeDashoffset: 100 },
          { strokeDashoffset: 0, ease: "none", duration: 0.5 }
        );
      }

      steps.forEach((_, i) => {
        const card = cardRefs.current[i];
        const topPath = svgPathsRef.current[i * 2];
        const bottomPath = svgPathsRef.current[i * 2 + 1];
        const connLine = connectingLinesRef.current[i];
        const actionWord = actionWordRefs.current[i]; // Remember: action words point to the next line segment

        // B. Split and Trace Card Borders (The split)
        if (topPath && bottomPath) {
          masterTl.fromTo([topPath, bottomPath],
            { strokeDashoffset: 100 },
            { strokeDashoffset: 0, ease: "none", duration: 1 }
          );
        }

        // C. Reveal Card (Happens as borders are finishing drawing)
        if (card) {
          masterTl.to(card, {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
          }, "-=0.3"); // Overlap card pop with end of border trace
        }

        // D. Draw Outgoing Connecting Line (The joining)
        if (connLine) {
          masterTl.fromTo(connLine,
            { strokeDashoffset: 100 },
            { strokeDashoffset: 0, ease: "none", duration: 0.8 }
          );

          if (actionWord) {
            masterTl.fromTo(actionWord,
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" },
              "-=0.4"
            );
          }
        }
      });
    });

    return () => ctx.revert();
  }, [cardDimensions]);

  // Parallax setup for the subtle vertical sway
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const steps = [
    { label: "Attention", icon: <Zap className="w-5 h-5 text-accent" />, actionWord: null },
    { label: "Authority", icon: <Brain className="w-5 h-5 text-accent" />, actionWord: "Builds" },
    { label: "Trust", icon: <Heart className="w-5 h-5 text-accent" />, actionWord: "Earns" },
    { label: "Demand", icon: <Sparkles className="w-5 h-5 text-accent" />, actionWord: "Creates" },
  ];

  const addToRefs = (el: any, refArray: React.MutableRefObject<any[]>, index: number) => {
    if (el) refArray.current[index] = el;
  };

  return (
    <section id="infotainment" ref={containerRef} className="relative w-full h-[250vh] bg-black z-10">
      <div className="sticky top-0 h-screen w-full overflow-hidden isolate flex flex-col justify-center">

        {/* Card Row — moved up slightly to make room for heading below */}
        <div className="absolute top-[35%] md:top-[40%] left-0 right-0 -translate-y-1/2 flex items-center justify-center">
          <div className="flex flex-nowrap items-center">

            {/* Lead-in line — same width as connectors */}
            <div className="shrink-0 w-[56px] md:w-[72px] flex items-center justify-center">
              <svg width="100%" height="100%" viewBox="0 0 72 4" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                <line
                  ref={incomingLineRef}
                  x1="0" y1="2" x2="72" y2="2"
                  stroke="#FFC300" strokeWidth="2"
                  pathLength="100" strokeDasharray="100" strokeDashoffset="100"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(255,195,0,0.7))' }}
                />
              </svg>
            </div>

            {steps.map((step, index) => {
              const { width: w, height: h } = cardDimensions[index] || { width: 180, height: 140 };
              const r = 14;
              const midY = h / 2;
              const topPathD = `M 0 ${midY} L 0 ${r} Q 0 0 ${r} 0 L ${w - r} 0 Q ${w} 0 ${w} ${r} L ${w} ${midY}`;
              const bottomPathD = `M 0 ${midY} L 0 ${h - r} Q 0 ${h} ${r} ${h} L ${w - r} ${h} Q ${w} ${h} ${w} ${h - r} L ${w} ${midY}`;

              return (
                <div key={index} className="flex flex-row items-center shrink-0">

                  {/* Card wrapper with border-tracing SVG */}
                  <div className="relative shrink-0">
                    {/* SVG overlay for the card border trace — uses viewBox matching card size, overflow visible for glow */}
                    <svg
                      className="absolute inset-0 pointer-events-none"
                      width={w} height={h}
                      viewBox={`0 0 ${w} ${h}`}
                      style={{ overflow: 'visible', filter: 'drop-shadow(0 0 6px rgba(255,195,0,0.7))' }}
                    >
                      <path
                        ref={(el) => addToRefs(el, svgPathsRef, index * 2)}
                        d={topPathD}
                        fill="none" stroke="#FFC300" strokeWidth="2"
                        pathLength="100" strokeDasharray="100" strokeDashoffset="100"
                      />
                      <path
                        ref={(el) => addToRefs(el, svgPathsRef, index * 2 + 1)}
                        d={bottomPathD}
                        fill="none" stroke="#FFC300" strokeWidth="2"
                        pathLength="100" strokeDasharray="100" strokeDashoffset="100"
                      />
                    </svg>

                    {/* The actual card */}
                    <div
                      ref={(el) => addToRefs(el, cardRefs, index)}
                      className="w-[160px] md:w-[180px] p-5 md:p-6 rounded-[14px] bg-surface/60 border border-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-center flex flex-col items-center group relative z-10 opacity-0 scale-95 blur-[10px] transform-gpu"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[14px]"></div>
                      <div className="w-10 h-10 rounded-full bg-surface-light/50 border border-white/10 flex items-center justify-center mb-4 shadow-lg z-10 transition-transform duration-500 group-hover:scale-110">
                        {step.icon}
                      </div>
                      <h3 className="text-base md:text-lg font-display font-semibold text-primary tracking-tight z-10">
                        {step.label}
                      </h3>
                    </div>
                  </div>

                  {/* Connector line after card */}
                  <div className="w-[56px] md:w-[72px] flex items-center justify-center shrink-0 relative">
                    <svg width="100%" height="4" viewBox="0 0 72 4" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                      <line
                        ref={(el) => addToRefs(el, connectingLinesRef, index)}
                        x1="0" y1="2" x2="72" y2="2"
                        stroke="#FFC300" strokeWidth="2" fill="none"
                        pathLength="100" strokeDasharray="100" strokeDashoffset="100"
                        style={{ filter: 'drop-shadow(0 0 6px rgba(255,195,0,0.7))' }}
                      />
                    </svg>
                    {index < steps.length - 1 && steps[index + 1].actionWord && (
                      <div
                        ref={(el) => addToRefs(el, actionWordRefs, index)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] md:text-[10px] font-medium text-accent tracking-widest uppercase px-2 py-1 border border-[#FFC300]/30 rounded-full bg-surface z-20 opacity-0 scale-90"
                        style={{ boxShadow: '0 0 12px rgba(255,195,0,0.2)' }}
                      >
                        {steps[index + 1].actionWord}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Header — Masking reveal (stationary) */}
        <div 
            className="absolute bottom-[10%] right-8 md:right-16 text-right z-50 flex flex-col items-end"
        >
            <div className="overflow-hidden py-2">
                <motion.h2 
                    initial={{ y: "110%", opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ margin: "-10%" }}
                    transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                    className="text-3xl md:text-[3.75vw] font-display font-semibold text-primary tracking-tight leading-tight"
                >
                    Why Infotainment Works
                </motion.h2>
            </div>
            
            <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ margin: "-10%" }}
                transition={{ duration: 1, delay: 0.4, ease: "circOut" }}
                className="w-32 h-1 bg-gradient-to-l from-accent to-red-500 mt-4 rounded-full origin-right" 
            />
            
            <div className="overflow-hidden py-2 max-w-xl outline-none mt-4">
                <motion.p 
                    initial={{ y: "100%", opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ margin: "-10%" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
                    className="text-lg md:text-xl text-muted font-light leading-relaxed"
                >
                  Anyone can entertain. Anyone can educate. Very few can do both — <span className="text-accent font-medium">consistently</span>.
                </motion.p>
            </div>
        </div>

        {/* Wave transition linking into the next section (Problems) */}
        <div ref={waveTransitionRef} className="absolute bottom-[-20px] left-0 w-full overflow-hidden leading-[0] z-40 pointer-events-none drop-shadow-xl will-change-transform transform-gpu">
          <div className="w-full relative flex flex-col">
            <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[100px] transform scale-105 translate-y-[2px]">
              {/* Transition into background color of the next section */}
              <path d="M0 100C0 100 360 0 720 0C1080 0 1440 100 1440 100V100H0V100Z" fill="var(--color-background)" />
            </svg>
            {/* Fill the gap created by the upward parallax translation */}
            <div className="h-[30px] w-full bg-background" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyInfotainmentWorks;

