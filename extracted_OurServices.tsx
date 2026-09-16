Created At: 2026-09-15T14:29:53+05:30
Completed At: 2026-09-15T14:29:53+05:30
File Path: `file:///c:/Users/Ishan/Desktop/monarch%20Media%20House/AdityaPortfolioFrontend/components/OurServices.tsx`
Total Lines: 295
Total Bytes: 15096
Showing lines 1 to 295
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.
"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Film, Lightbulb, BarChart3, Search } from "lucide-react";
import Image from "next/image";
import atmosphere from "./ServicesAtmosphere.module.css";

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        icon: Share2,
        title: "Social Media Marketing",
        desc: "Dominate the feed with content that stops the scroll and builds real, lasting engagement across every platform.",
        number: "01",
    },
    {
        icon: Film,
        title: "Post Production",
        desc: "High-end visual storytelling that turns raw footage into cinematic brand experiences your audience won't forget.",
        number: "02",
    },
    {
        icon: Lightbulb,
        title: "Creative Strategy",
        desc: "Data-driven creative directions designed to align your brand perfectly with your market and audience.",
        number: "03",
    },
    {
        icon: BarChart3,
        title: "Performance Marketing",
        desc: "Aggressive, ROI-focused campaigns designed to scale your revenue and outperform competition at every level.",
        number: "04",
    },
    {
        icon: Search,
        title: "SE
<truncated 12948 bytes>
           }}
                                                animate={{
                                                    opacity: isActive ? 1 : 0,
                                                    scaleX: isActive ? 1.1 : 0.4,
                                                }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Active service label under the container with smooth cross-fade */}
                        <div className="mt-6 text-center h-6 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="text-xs font-mono text-accent tracking-[0.3em] uppercase"
                                >
                                    {services[activeIndex].number} — {services[activeIndex].title}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default OurServices;

The above content shows the entire, complete file contents of the requested file.
