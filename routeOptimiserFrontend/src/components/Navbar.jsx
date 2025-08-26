import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-lg border-b border-slate-700/50 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <img 
                  src="/src/assets/logo.png" 
                  alt="Logo" 
                  className="h-12 w-12 mr-4 rounded-xl shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300 group-hover:scale-110" 
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent cc-heading group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-pink-300 transition-all duration-300">
                CrossBorderIQ
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              to="/" 
              className="relative cc-text text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-slate-700/50 group"
            >
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>
            </Link>
            <Link 
              to="/compliance" 
              className="relative cc-text text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-slate-700/50 group"
            >
              <span className="relative z-10">Compliance</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>
            </Link>
            <Link 
              to="/about" 
              className="relative cc-text text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-slate-700/50 group"
            >
              <span className="relative z-10">About</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>
            </Link>
            <Link 
              to="/contact" 
              className="relative cc-text text-gray-200 hover:text-cyan-400 transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-slate-700/50 group"
            >
              <span className="relative z-10">Contact</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>
            </Link>
            
            {/* CTA Button */}
            <div className="ml-4">
              <Link 
                to="/compliance" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-300"
              aria-label="Toggle menu"
            >
              <svg
                className="h-8 w-8 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden absolute top-20 left-0 w-full bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50 shadow-2xl">
              <div className="px-6 py-4 space-y-1">
                <Link
                  to="/"
                  className="block cc-text text-gray-200 hover:text-cyan-400 hover:bg-slate-700/50 transition-all duration-300 font-medium px-4 py-3 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/compliance"
                  className="block cc-text text-gray-200 hover:text-cyan-400 hover:bg-slate-700/50 transition-all duration-300 font-medium px-4 py-3 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Compliance
                </Link>
                <Link
                  to="/about"
                  className="block cc-text text-gray-200 hover:text-cyan-400 hover:bg-slate-700/50 transition-all duration-300 font-medium px-4 py-3 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block cc-text text-gray-200 hover:text-cyan-400 hover:bg-slate-700/50 transition-all duration-300 font-medium px-4 py-3 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
                
                {/* Mobile CTA Button */}
                <div className="pt-4 border-t border-slate-700/50 mt-4">
                  <Link
                    to="/compliance"
                    className="block w-full text-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;