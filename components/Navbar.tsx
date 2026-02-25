"use client";
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle at 100px or so down
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 grid grid-cols-2 md:grid-cols-3 items-center px-6 md:px-12 py-4 pointer-events-none transition-colors duration-300 text-white`}
    >
      {/* Left: Logo */}
      <div className="flex justify-start pointer-events-auto">
        <a
          href="#"
          className="text-xl md:text-2xl font-display font-semibold tracking-wide"
        >
          MONARCH MEDIA HOUSE
        </a>
      </div>

      {/* Center: Liquid Glass Pill-shaped Navbar (Perfectly Centered via Grid) */}
      <div className="hidden md:flex justify-center pointer-events-auto">
        <div
          className={`flex items-center gap-6 backdrop-blur-2xl rounded-full px-6 py-2 transition-all duration-300 bg-transparent border border-white/20 shadow-[0_4px_24px_0_rgba(255,255,255,0.05)] text-white`}
        >
          <button className={`text-sm font-medium transition-colors hover:text-accent`}>
            Work
          </button>
          <button className={`text-sm font-medium transition-colors hover:text-accent`}>
            Services
          </button>
          <button className={`text-sm font-medium transition-colors hover:text-accent`}>
            About
          </button>
          <button className={`text-sm font-medium transition-colors hover:text-accent`}>
            Contact
          </button>
        </div>
      </div>

      {/* Right: Button */}
      <div className="hidden md:flex justify-end pointer-events-auto">
        <button
          className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all flex items-center gap-2 backdrop-blur-sm border-white/30 hover:bg-white hover:text-black bg-transparent text-white`}
        >
          Book a Call <span className="text-xs">↗</span>
        </button>
      </div>

      {/* Mobile menu button */}
      <div className="flex justify-end md:hidden pointer-events-auto text-white">
        <button
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

    </div>
  );
};

export default Navbar;
