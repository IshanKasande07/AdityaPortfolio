"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReveal } from "./RevealLayout";
import { useRouter, usePathname } from "next/navigation";

import Image from "next/image";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { revealed } = useReveal();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Toggle at 100px or so down
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isHomePage = pathname === "/";
  const shouldBeVisible = revealed || !isHomePage;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: shouldBeVisible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`${shouldBeVisible ? 'fixed' : 'absolute'} top-0 left-0 w-full z-[200] grid grid-cols-2 md:grid-cols-3 items-center px-6 md:px-12 py-4 mt-[3px] pointer-events-none transition-colors duration-300 text-primary`}
    >
      {/* Left: Logo */}
      <div className="flex justify-start pointer-events-auto">
        <button
          onClick={() => router.push('/')}
          className="flex items-center"
        >
          <Image 
            src="/brandlogo/Monarch White.png" 
            alt="Monarch Media House" 
            width={72} 
            height={40} 
            className="object-contain h-10 w-auto"
            priority
          />
        </button>
      </div>

      {/* Center: Liquid Glass Pill-shaped Navbar (Perfectly Centered via Grid) */}
      <div className="hidden md:flex justify-center pointer-events-auto">
        <div
          className={`flex items-center gap-6 backdrop-blur-2xl rounded-full px-6 py-2 transition-all duration-300 bg-transparent border border-primary/20 shadow-[0_4px_24px_0_rgba(17,37,14,0.08)] text-primary`}
        >
          <button 
            onClick={() => {
              if (pathname !== "/") {
                router.push("/#work");
              } else {
                document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
              }
            }} 
            className={`text-sm font-medium transition-colors hover:text-accent`}
          >
            Work
          </button>
          <button 
            onClick={() => {
              if (pathname !== "/") {
                router.push("/#impact");
              } else {
                const el = document.getElementById('impact');
                if (el) {
                  const sectionTop = el.offsetTop;
                  const offset = el.offsetHeight * 0.04;
                  window.scrollTo({ top: sectionTop + offset, behavior: 'smooth' });
                }
              }
            }} 
            className={`text-sm font-medium transition-colors hover:text-accent`}
          >
            Services
          </button>
          <button 
            onClick={() => router.push('/about')} 
            className={`text-sm font-medium transition-colors hover:text-accent`}
          >
            About
          </button>
          <button 
            onClick={() => router.push('/contact')} 
            className={`text-sm font-medium transition-colors hover:text-accent`}
          >
            Contact
          </button>
        </div>
      </div>

      {/* Right: Button */}
      <div className="hidden md:flex justify-end pointer-events-auto">
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' })}
          className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all flex items-center gap-2 backdrop-blur-sm border-primary/30 hover:bg-primary hover:text-background bg-transparent text-primary`}
        >
          Book a Call <span className="text-xs">↗</span>
        </button>
      </div>

      {/* Mobile menu button */}
      <div className="flex justify-end md:hidden pointer-events-auto text-primary">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 transition-colors duration-300"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[250] bg-[#11250E]/95 backdrop-blur-3xl flex flex-col justify-between p-8 md:hidden pointer-events-auto"
          >
            {/* Top row with Logo and Close button */}
            <div className="flex justify-between items-center w-full">
              <Image 
                src="/brandlogo/Monarch White.png" 
                alt="Monarch Media House" 
                width={72} 
                height={40} 
                className="object-contain h-10 w-auto"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#F8F3E6]/70 hover:text-[#F8F3E6]"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>

            {/* Vertical Menu Items */}
            <div className="flex flex-col gap-8 my-auto text-left">
              {[
                { name: "Work", target: "#work" },
                { name: "Services", target: "#impact" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => {
                    setIsOpen(false);
                    if (item.path) {
                      router.push(item.path);
                    } else if (item.target) {
                      if (pathname !== "/") {
                        router.push(`/${item.target}`);
                      } else {
                        if (item.target === "#impact") {
                          const el = document.getElementById("impact");
                          if (el) {
                            const sectionTop = el.offsetTop;
                            const offset = el.offsetHeight * 0.04;
                            window.scrollTo({ top: sectionTop + offset, behavior: "smooth" });
                          }
                        } else {
                          document.getElementById(item.target.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    }
                  }}
                  className="text-4xl font-semibold text-[#F8F3E6]/80 hover:text-[#F8F3E6] hover:translate-x-2 transition-all duration-300"
                >
                  {item.name}
                </motion.button>
              ))}
            </div>

            {/* CTA button at the bottom */}
            <div className="w-full pb-8">
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (pathname !== "/") {
                    router.push("/#contact");
                  } else {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full py-4 rounded-full border border-[#F8F3E6]/20 bg-[#F8F3E6] text-[#11250E] font-semibold text-center hover:bg-transparent hover:text-[#F8F3E6] transition-all duration-300"
              >
                Book a Call ↗
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Navbar;


