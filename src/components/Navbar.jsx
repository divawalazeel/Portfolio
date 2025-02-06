import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // Import icons for menu

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full py-4 bg-transparent fixed top-0 left-0 flex justify-center items-center px-6 md:px-12 z-50">
      {/* Desktop Menu (Centered) */}
      <ul className="hidden md:flex space-x-20 text-white text-lg uppercase">
        {["Home", "About", "Services", "Projects", "Contact"].map((item, index) => (
          <li
            key={index}
            className="relative cursor-pointer transition duration-300 group"
          >
            {item}
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gray-400 transition-all duration-300 group-hover:w-full"></span>
          </li>
        ))}
      </ul>

      {/* Mobile Menu Button (Right Aligned) */}
      <button
        className="md:hidden text-white text-2xl absolute right-6 top-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Menu (Full Width) */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-black bg-opacity-80 md:hidden flex flex-col items-center py-6 space-y-4 text-white text-lg uppercase font-semibold">
          {["Home", "About", "Services", "Projects", "Contact"].map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase()}`}
              className="cursor-pointer transition duration-300 hover:text-gray-400"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
