"use client"

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingDown, Clock, Shield, Coffee, CheckCircle2 } from "lucide-react";
import FadeUp from "./css/FadeUp";
import FadeUpDelay from "./css/FadeUpDelay";

interface Problem {
  id: string;
  title: string;
  icon: React.ReactNode;
  insight: string;
}

const problemsList: Problem[] = [
  {
    id: "engagement",
    title: "Low Engagement",
    icon: <TrendingDown className="w-8 h-8" />,
    insight: "Low engagement isn't a platform problem. It's a value problem. When you educate, people engage. Stop talking about yourself and start talking about what they want to know.",
  },
  {
    id: "reach",
    title: "Poor Reach",
    icon: <Zap className="w-8 h-8" />,
    insight: "Algorithms reward content people actually want to consume. Education is inherently shareable and saveable. It's the ultimate organic growth engine.",
  },
  {
    id: "retention",
    title: "Low Retention",
    icon: <Clock className="w-8 h-8" />,
    insight: "People scroll past entertainment. They stop for insight. Retention follows value. A 5-minute deep dive easily outperforms a 15-second gimmick.",
  },
  {
    id: "authority",
    title: "No Authority",
    icon: <Shield className="w-8 h-8" />,
    insight: "You can't buy authority. You earn it by teaching what others don't know. Trust is built when you consistently give away the secrets.",
  },
  {
    id: "fatigue",
    title: "Content Fatigue",
    icon: <Coffee className="w-8 h-8" />,
    insight: "Fatigue comes from creating content that doesn't matter. Purpose eliminates burnout. Changing your focus from 'going viral' to 'how many can I help' changes the game.",
  },
];

const ProblemsSection = () => {
  const [dismissedCards, setDismissedCards] = useState<string[]>([]);

  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const activeProblems = problemsList.filter(p => !dismissedCards.includes(p.id));

  return (
    <section className="page min-h-[100vh] w-full flex flex-col justify-between pt-20 pb-0 z-40 bg-background relative selection:bg-accent selection:text-black overflow-hidden">
      <div className="flex flex-col items-center gap-16 flex-1 max-w-7xl mx-auto w-full px-[5vw] lg:px-0">

        {/* Section header */}
        <div className="text-center mx-auto flex flex-col gap-6 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <FadeUp>
              <h2 className="text-4xl md:text-[4vw] font-display font-semibold text-primary tracking-tight">The Problems We Solve</h2>
            </FadeUp>
            <FadeUpDelay>
              <p className="mt-4 text-base md:text-[1.2vw] text-muted max-w-2xl mx-auto">
                Discover how infotainment transforms common business challenges into opportunities.
              </p>
            </FadeUpDelay>
          </motion.div>
        </div>

        {/* Simple Interactive Grid */}
        <div className="w-full relative flex-1 min-h-[500px] flex flex-col">
          <motion.div
            layout
            className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
          >
            {problemsList.map((problem) => {
              const isDismissed = dismissedCards.includes(problem.id);
              return (
                <motion.div
                  key={problem.id}
                  layout
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => !isDismissed && setDismissedCards([...dismissedCards, problem.id])}
                  className={`
                    flex flex-col items-start text-left justify-between border border-white/10 rounded-3xl p-8 md:p-10 min-h-[320px] transition-all duration-500
                    ${isDismissed
                      ? 'bg-transparent cursor-default border-dashed opacity-40 scale-[0.98] grayscale'
                      : 'bg-surface-light/40 backdrop-blur-md hover:bg-surface-light hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer group opacity-100 scale-100'
                    }
                  `}
                >
                  <div className="flex flex-col gap-6 w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className={`transition-colors duration-300 ${isDismissed ? 'text-muted/50' : 'text-muted group-hover:text-orange-400'}`}>
                        {problem.icon}
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isDismissed ? 'border-orange-500/50 bg-orange-500/10 opacity-100' : 'border border-white/10 bg-white/5 opacity-0 group-hover:opacity-100'}`}>
                        <CheckCircle2 className={`w-4 h-4 ${isDismissed ? 'text-orange-500/80 scale-110' : 'text-orange-400 scale-100'}`} />
                      </div>
                    </div>

                    <h3 className={`text-2xl font-display font-medium transition-colors ${isDismissed ? 'text-muted/50 line-through decoration-orange-500/50 decoration-2' : 'text-primary/90 group-hover:text-primary'}`}>
                      {problem.title}
                    </h3>
                  </div>

                  <p className={`border-t border-white/10 pt-6 mt-6 text-base leading-relaxed font-light tracking-wide w-full transition-colors ${isDismissed ? 'text-muted/40 line-through decoration-white/20' : 'text-primary/70'}`}>
                    {problem.insight}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          <AnimatePresence>
            {dismissedCards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-center w-full mt-12"
              >
                <button
                  onClick={() => setDismissedCards([])}
                  className="flex items-center gap-2 text-sm text-muted hover:text-orange-400 transition-colors border border-white/5 bg-white/5 px-6 py-3 rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  Restore Checked Out Problems
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {dismissedCards.length === problemsList.length && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-surface-light/20 rounded-3xl border border-white/5 backdrop-blur-sm"
              >
                <CheckCircle2 className="w-16 h-16 text-orange-400 mb-6" />
                <h3 className="text-3xl font-display font-semibold text-white mb-4">All Problems Solved</h3>
                <p className="text-muted max-w-md">You've checked out every common challenge. Scroll down to see exactly how we fix them.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full overflow-hidden leading-[0] relative h-[100px] pointer-events-none z-40 bg-background">
        <svg ref={svgRef} viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-[100vw] h-[100px] transform scale-105 translate-y-[2px] block">
          {/* Note: Next section "Who" will be bg-surface */}
          <path d="M0 100C0 100 360 0 720 0C1080 0 1440 100 1440 100V100H0V100Z" fill="var(--color-surface)" />
          <path ref={pathRef} d="M0,50 Q720,150 1440,50" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </section>
  );
};

export default ProblemsSection;
