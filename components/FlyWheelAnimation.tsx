"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const logos = [
  "https://cdn.prod.website-files.com/6778043699a2f913f47628dd/68cf7451a6e940587e2c95d7_flywheel-logo03.avif",
  "https://cdn.prod.website-files.com/6778043699a2f913f47628dd/68cf7451ab8eac4ad4126de4_flywheel-logo02.avif",
  "https://cdn.prod.website-files.com/6778043699a2f913f47628dd/68cf74510a7ff0335708e7c2_flywheel-logo01.avif",
  "https://cdn.prod.website-files.com/6778043699a2f913f47628dd/68cf7451b0d64adae141479f_flywheel-logo07.avif",
  "https://cdn.prod.website-files.com/6778043699a2f913f47628dd/68cf74514ebc6e7085da8c2a_flywheel-logo06.avif",
  "https://cdn.prod.website-files.com/6778043699a2f913f47628dd/68cf745146e749fd22638514_flywheel-logo04.avif",
];

export default function FlywheelScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  // scroll progress only inside this section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // rotate wheel based on scroll
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
<div
  ref={ref}
  className="relative min-h-[300vh] w-full bg-black text-white"
>
  {/* sticky center */}
  <div className="sticky top-10 h-screen flex items-center justify-center">

    <div className="relative w-full h-full">

      {/* rotating wheel */}
      <motion.div
        style={{ rotate }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Image
          src="https://cdn.prod.website-files.com/6778043699a2f913f47628dd/68ce5f7fbf72d4300ecf5d79_Group%201000004004.avif"
          alt="wheel"
          width={750}
          height={750}
          priority
        />
      </motion.div>

      {/* logos */}
      {logos.map((src, i) => {
        const start = i / logos.length;
        const end = start + 0.15;

        const opacity = useTransform(
          scrollYProgress,
          [start, end],
          [0, 1]
        );

        return (
          <motion.div
            key={i}
            style={{
              opacity,
              transform: `rotate(${(400 / logos.length) * i}deg) translateY(-300px)`,
            }}
            className="absolute inset-0 flex items-center justify-center -z-10"
          >
            <Image
              src={src}
              alt="logo"
              width={170}
              height={170}
              className="rounded-full p-2 shadow-md"
            />
          </motion.div>
        );
      })}

      {/* center text
      <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
        <p className="font-serif font-semibold text-lg leading-tight">
          Content
          <br />
          Flywheel
        </p>
      </div> */}

    </div>
  </div>
</div>

  );
}
