import React from "react";
import { Truck, Globe, Shield, Users, Target, Award, MapPin, Clock } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Multi-Modal Transportation",
      description: "Seamlessly integrate land, sea, and air transportation modes for optimal route planning."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Compliance First",
      description: "Built-in compliance checking ensures all shipments meet international regulations."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Network",
      description: "Access to worldwide logistics partners and transportation providers."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-Time Optimization",
      description: "AI-powered algorithms continuously optimize routes for cost, time, and efficiency."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Shipments", color: "text-cyan-400" },
    { number: "500+", label: "Global Partners", color: "text-pink-400" },
    { number: "200+", label: "Countries Served", color: "text-green-400" },
    { number: "99.9%", label: "Platform Uptime", color: "text-blue-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            About Fusion Flow
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing global logistics with intelligent route optimization and seamless compliance management
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-cyan-500/20 p-2 rounded-lg">
              <Target className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          </div>
          
          <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
            <p>
              Fusion Flow is a cutting-edge multimodal cargo route optimization platform designed to transform 
              how businesses manage their global logistics operations. We combine advanced AI algorithms with 
              real-world logistics expertise to deliver the most efficient, compliant, and cost-effective 
              shipping solutions.
            </p>
            
            <p>
              Our platform seamlessly integrates various transportation modes including land, sea, and air 
              freight, while ensuring full compliance with international trade regulations. Whether you're 
              shipping a single package or managing complex supply chain operations, Fusion Flow provides 
              the tools and insights you need to optimize every aspect of your logistics workflow.
            </p>

            <p>
              Built for the modern global economy, our solution helps businesses reduce costs, improve 
              delivery times, and maintain compliance across all international borders. With real-time 
              tracking, predictive analytics, and automated documentation, we're making logistics smarter, 
              faster, and more reliable.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-pink-500/20 p-2 rounded-lg">
              <Award className="w-6 h-6 text-pink-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Key Features</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl hover:bg-slate-600/30 transition-all duration-300 group">
                <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">By the Numbers</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Our Vision</h2>
          </div>
          
          <div className="text-center space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
              We envision a world where global logistics is seamless, efficient, and accessible to businesses 
              of all sizes. Through innovative technology and strategic partnerships, we're building the 
              infrastructure for tomorrow's connected economy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer">
                Get Started Today
              </div>
              <div className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/30 px-8 py-3 rounded-xl text-gray-300 font-semibold transition-all duration-300 hover:border-cyan-500/50 cursor-pointer">
                Learn More
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;