"use client"

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import FadeUp from "./css/FadeUp";

const WhyInfotainmentWorks = () => {
  const steps = [
    { label: "Education", desc: "builds" },
    { label: "Authority", desc: "builds" },
    { label: "Trust", desc: "builds" },
    { label: "Demand", desc: null },
  ];

  return (
      <div className="h-auto w-full py-25 page z-30 min-h-[100vh bg-white">
        <div className="flex flex-col items-center gap-20 mt-10">
          {/* Header */}
            <FadeUp>
              <h2 className="text-[4vw] font-serif">Why Infotainment Works</h2>
            </FadeUp>

          {/* Flow visualization */}
          <div className="flex flex-col items-center gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="flex flex-col items-center"
              >
                <div className="px-10 py-6 border-2 border-gray-200 rounded-lg bg-gray-50">
                  <span className="text-[2vw] md:text-[1.5vw] font-serif font-medium">
                    {step.label}
                  </span>
                </div>
                {step.desc && (
                  <div className="flex flex-col items-center py-3 text-muted-foreground text-gray-500">
                    <ArrowDown className="w-6 h-6 mb-1" />
                    <span className="text-[0.8vw]">{step.desc}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

<motion.blockquote
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
  className="text-center"
>
<FadeUp>
    <p className="text-xl md:text-[1.5vw] font-serif italic text-black mx-auto">
    &quot;Anyone can entertain. Anyone can educate. Very few can do both — consistently.&quot;
  </p>
</FadeUp>
</motion.blockquote>



        </div>
      </div>
  );
};

export default WhyInfotainmentWorks;
