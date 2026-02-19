import React from "react";

const Navbar = () => {
  return (
    <div className="w-full px-40 bg-white text-black fixed z-50 border-b-[1px] border-gray-200">
      <div className="flex items-center justify-between h-25">

        {/* Logo */}
        <a
          href="#"
          className="text-xl font-serif font-semibold"
        >
          Monarch Media House
        </a>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-10 text-gray-500">
          <button className="text-[1.1vw] font-medium" style={{ cursor : "pointer" }}>
            Work
          </button>

          <button className="text-[1.1vw] font-medium" style={{ cursor : "pointer" }}>
            Contact
          </button>

          <button style={{ cursor : "pointer" }} className="text-[1.1vw] px-3 py-2 rounded-lg bg-black text-white border-2 hover:bg-white hover:border-2 hover:border-black hover:text-black transition-transform duration-300 ">
            Get Started
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
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
