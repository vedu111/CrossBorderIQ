import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img src="/src/assets/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent
                group-hover:from-pink-500 group-hover:to-cyan-400 transition-all duration-300">
                Fusion Flow
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-cyan-400 transition-colors">Home</Link>
            <Link to="/compliance" className="text-gray-300 hover:text-cyan-400 transition-colors">Compliance</Link>
            <Link to="/about" className="text-gray-300 hover:text-cyan-400 transition-colors">About</Link>
            <Link to="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;