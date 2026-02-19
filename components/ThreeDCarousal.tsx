"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useRef } from "react";

const videos = [
  "https://storage.googleapis.com/clova-assets/public/clova-website/clova2/5.mp4",
  "https://storage.googleapis.com/clova-assets/public/clova-website/clova2/9.mp4",
  "https://storage.googleapis.com/clova-assets/public/clova-website/clova2/2.mp4",
  "https://storage.googleapis.com/clova-assets/public/clova-website/clova2/3.mp4",
  "https://storage.googleapis.com/clova-assets/public/clova-website/clova2/4.mp4",
  "https://storage.googleapis.com/clova-assets/public/clova-website/clova2/7.mp4",
];

export default function ThreeDCarousel() {
  const rotation = useMotionValue(0);
  const lastX = useRef<number | null>(null);

  return (
    <div className="page relative min-h-screen w-full bg-black overflow-hidden flex items-center justify-center z-20">

      {/* perspective */}
      <div
        style={{ perspective: "460px" }}
        className="w-full h-full flex items-center justify-center"
      >
        {/* world */}
        <motion.div
          onPointerDown={(e) => {
            lastX.current = e.clientX;
          }}
          onPointerMove={(e) => {
            if (lastX.current !== null) {
              const delta = e.clientX - lastX.current;
              rotation.set(rotation.get() + delta * 0.4);
              lastX.current = e.clientX;
            }
          }}
          onPointerUp={() => {
            lastX.current = null;
          }}
          onPointerLeave={() => {
            lastX.current = null;
          }}
          style={{
            rotateY: rotation,
            transformStyle: "preserve-3d",
            cursor: "grab",
          }}
          className="relative w-[900px] h-[520px]"
        >
          {videos.map((src, i) => {
            const center = Math.floor(videos.length / 2);
            const offset = i - center;
            const angle = (360 / videos.length) * i;
            const scale = 1.2;
            return (
              <div
                key={i}
                style={{
                  transformStyle: "preserve-3d",
                  transform: `
                    rotateY(${angle}deg)
                    translateZ(470px)
                    scale(${scale})
                  `,
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div style={{ transform: "rotateY(180deg)" }}>
                  <video
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-[420px] h-[300px] rounded-xl object-cover shadow-2xl select-none"
                  />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
