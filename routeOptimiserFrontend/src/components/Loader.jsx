import React, { useState, useEffect } from "react";

const Loader = () => {
  const [currentTransport, setCurrentTransport] = useState(0);

  const transports = [
    {
      name: "truck",
      icon: (
        <svg
          className="w-8 h-8 text-cyan-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17 8h2l2 4v6h-2a2 2 0 11-4 0H9a2 2 0 11-4 0H3v-6c0-1.1.9-2 2-2h12V8zM7 16a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z" />
        </svg>
      ),
      color: "from-cyan-400 to-blue-500",
    },
    {
      name: "ship",
      icon: (
        <svg
          className="w-8 h-8 text-blue-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 18H6l-3-7h2l1 2h2l-1-2h2l1 2h2l-1-2h2l1 2h2l-1-2h3l-3 7zm-1-9V6c0-1.1-.9-2-2-2h-2V3h-4v1H8c-1.1 0-2 .9-2 2v3H4v2h16V9h-2z" />
        </svg>
      ),
      color: "from-blue-400 to-purple-500",
    },
    {
      name: "plane",
      icon: (
        <svg
          className="w-8 h-8 text-purple-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      ),
      color: "from-purple-400 to-pink-500",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTransport((prev) => (prev + 1) % transports.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.3) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        ></div>
      </div>

      {/* Main Loader Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo/Brand Area */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              CrossBorderIQ
            </h1>
          </div>
        </div>

        {/* Circular Transport Animation */}
        <div className="relative w-80 h-80 mb-8">
          {/* Outer Circle Border */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30">
            {/* Hub Points around the circle */}
            {[0, 72, 144, 216, 288].map((angle, index) => (
              <div
                key={angle}
                className="absolute w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-140px) rotate(-${angle}deg)`,
                  animation: `pulse-hub 2s ease-in-out infinite ${index * 0.2}s`,
                }}
              >
                <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-50"></div>
              </div>
            ))}
          </div>

          {/* Inner Diamond/Square Shape */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32">
            <div className="w-full h-full border-2 border-dashed border-cyan-500/40 rotate-45 rounded-lg"></div>
          </div>

          {/* Central Hub with Sequential Transport Icons */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className={`relative w-20 h-20 bg-gradient-to-r ${transports[currentTransport].color} rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 ease-in-out`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-white/10 to-white/5 rounded-full animate-pulse"></div>

              {/* Transport Icon */}
              <div className="relative z-10 transition-all duration-300 ease-in-out transform">
                {transports[currentTransport].icon}
              </div>
            </div>
          </div>

          {/* Animated Route Lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
            <defs>
              <linearGradient
                id="routeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
                <stop offset="50%" stopColor="rgba(6, 182, 212, 0.6)" />
                <stop offset="100%" stopColor="rgba(147, 51, 234, 0)" />
              </linearGradient>
            </defs>

            <circle
              cx="160"
              cy="160"
              r="100"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="2"
              strokeDasharray="15,10"
              className="animate-route-circle"
            />
          </svg>
        </div>

        {/* Status Information */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <p className="text-xl font-semibold text-white animate-pulse">
              Optimizing Smart Routes
            </p>
          </div>

          <p className="text-gray-400 text-sm max-w-md">
            AI-powered logistics optimization in progress...
          </p>

          {/* Progress Indicators */}
          <div className="flex items-center justify-center space-x-8 mt-6 text-sm text-gray-400">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white">
                ✓
              </div>
              <span>Route Analysis</span>
            </div>

            <div className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-cyan-500"></div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span>Cost Optimization</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-600"></div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-400">
                ◐
              </div>
              <span>Final Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes grid-move {
          0% {
            transform: translateX(0) translateY(0);
          }
          100% {
            transform: translateX(50px) translateY(50px);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
