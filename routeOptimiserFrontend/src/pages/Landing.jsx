import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
          Logistics Platform
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Plan compliant shipments and optimized multi-modal routes in a single workflow.
        </p>
        <button
          onClick={() => navigate("/compliance")}
          className="neon-button px-6 py-3 rounded-lg text-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Landing;


