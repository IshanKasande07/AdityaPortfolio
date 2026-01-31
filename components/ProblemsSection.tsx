"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingDown, Clock, Shield, Coffee } from "lucide-react";

interface Problem {
  id: string;
  title: string;
  icon: React.ReactNode;
  insight: string;
  solved: boolean;
}

const initialProblems: Problem[] = [
  {
    id: "engagement",
    title: "Low Engagement",
    icon: <TrendingDown className="w-6 h-6" />,
    insight: "Low engagement isn't a platform problem. It's a value problem. When you educate, people engage.",
    solved: false,
  },
  {
    id: "reach",
    title: "Poor Reach",
    icon: <Zap className="w-6 h-6" />,
    insight: "Algorithms reward content people actually want to consume. Education is inherently shareable.",
    solved: false,
  },
  {
    id: "retention",
    title: "Low Retention",
    icon: <Clock className="w-6 h-6" />,
    insight: "People scroll past entertainment. They stop for insight. Retention follows value.",
    solved: false,
  },
  {
    id: "authority",
    title: "No Authority",
    icon: <Shield className="w-6 h-6" />,
    insight: "You can't buy authority. You earn it by teaching what others don't know.",
    solved: false,
  },
  {
    id: "fatigue",
    title: "Content Fatigue",
    icon: <Coffee className="w-6 h-6" />,
    insight: "Fatigue comes from creating content that doesn't matter. Purpose eliminates burnout.",
    solved: false,
  },
];

const ProblemsSection = () => {
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  const handleSolveProblem = (id: string) => {
    const problem = problems.find((p) => p.id === id);
    if (problem && !problem.solved) {
      setActiveInsight(problem.insight);
      setProblems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, solved: true } : p))
      );
      
      // Clear insight after delay
      setTimeout(() => {
        setActiveInsight(null);
      }, 4000);
    }
  };

  const handleReset = () => {
    setProblems(initialProblems);
    setActiveInsight(null);
  };

  const allSolved = problems.every((p) => p.solved);

  return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center gap-20">
        {/* Section header */}
        <div className="text-center mx-auto flex flex-col gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="accent-line w-full" />
            <h2 className="text-[4vw]">The Problems We Solve</h2>
            <p className="lead text-[1.5vw] text-gray-500">
              Click on each problem to see how infotainment solves it.
            </p>
          </motion.div>
        </div>

        {/* Problem cards */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => handleSolveProblem(problem.id)}
                disabled={problem.solved}
                whileHover={!problem.solved ? { scale: 1.05 } : {}}
                whileTap={!problem.solved ? { scale: 0.95 } : {}}
                className={`
                  relative flex flex-col items-center justify-center gap-3
                  px-6 py-8 md:px-10 md:py-10 w-[10vw] h-[20vh]
                  rounded-lg border-2 border-gray-300 transition-all duration-300
                  ${
                    problem.solved
                      ? "border-accent/30 bg-accent/10 opacity-50 cursor-default"
                      : "border-foreground/10 bg-background hover:border-foreground/30 hover:shadow-lg cursor-pointer"
                  }
                `}
              >
                <AnimatePresence mode="wait">
                  {problem.solved ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-accent"
                    >
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                  ) : (
                    <motion.div
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-foreground/70"
                    >
                      {problem.icon}
                    </motion.div>
                  )}
                </AnimatePresence>
                <span
                  className={`text-sm font-medium ${
                    problem.solved ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {problem.title}
                </span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Insight display */}
        <div className="h-32 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeInsight && (
              <motion.div
                key={activeInsight}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl text-center"
              >
                <p className="text-lg md:text-[1.5vw] font-serif italic text-foreground/80">
                  "{activeInsight}"
                </p>
              </motion.div>
            )}
            {allSolved && !activeInsight && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <p className="text-xl font-serif mb-4">
                  Now imagine solving all these for your brand.
                </p>
                <button
                  onClick={handleReset}
                  className="text-[1vw] text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  Reset problems
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
  );
};

export default ProblemsSection;
