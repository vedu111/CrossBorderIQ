import React from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Globe, Shield, Clock, CheckCircle, Users, BarChart3, MapPin, ArrowRight, Star } from "lucide-react";
import heroImg from "../../public/pic.png"
const Landing = () => {
  const navigate = useNavigate();
  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
    navigate(path);
  };

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Compliance Management",
      description: "Automated compliance checks for international shipping regulations, customs documentation, and trade restrictions."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Route Optimization",
      description: "AI-powered multi-modal route planning that considers cost, time, and environmental impact."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Real-time Tracking",
      description: "Live shipment visibility across all transportation modes with predictive delivery estimates."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and insights to optimize your supply chain performance."
    }
  ];

  const benefits = [
    "Reduce shipping costs by up to 30%",
    "Eliminate compliance violations",
    "Improve delivery times by 25%",
    "Real-time cargo visibility",
    "Automated documentation",
    "24/7 customer support"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "Global Freight Solutions",
      text: "This platform revolutionized our logistics operations. We've seen a 40% improvement in efficiency.",
      rating: 5
    },
    {
      name: "Michael Chen",
      company: "TransWorld Logistics",
      text: "The compliance features alone have saved us countless hours and prevented costly delays.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      company: "Maritime Express",
      text: "Outstanding route optimization. Our fuel costs dropped significantly while maintaining delivery times.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-extrabold">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                  Smart Logistics
                </span>
                <br />
                <span className="text-white">Platform</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
                Transform your supply chain with AI-powered compliance management, 
                optimized multi-modal routing, and real-time visibility across your entire logistics network.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleNavigation("/compliance")}
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 rounded-xl text-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
              >  Get Started
                
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-xl text-lg font-semibold text-white border-2 border-gray-600 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-300">
                Watch Demo
              </button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">10K+</div>
                <div className="text-gray-400 text-sm">Active Shipments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">500+</div>
                <div className="text-gray-400 text-sm">Global Partners</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={heroImg}
                alt="Logistics Operations" 
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features for Modern Logistics
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to streamline your logistics operations and stay compliant in today's complex global market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-700/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-600/30 hover:border-cyan-500/50 transition-all duration-300 group">
                <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Why Choose Our Platform?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 rounded-2xl border border-slate-600/30">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-cyan-500/20 p-3 rounded-lg">
                    <Globe className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Global Coverage</h3>
                    <p className="text-gray-300">200+ countries and territories</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-pink-500/20 p-3 rounded-lg">
                    <Users className="w-8 h-8 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Expert Support</h3>
                    <p className="text-gray-300">24/7 logistics specialists available</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <Truck className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Multi-Modal</h3>
                    <p className="text-gray-300">Air, sea, road, and rail logistics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-300">
              See what our customers say about transforming their logistics operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-700/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-600/30">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-cyan-400 text-sm">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 p-12 rounded-3xl border border-gradient-to-r from-cyan-500/20 to-pink-500/20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Logistics?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of companies already using our platform to optimize their supply chain operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleNavigation("/compliance")}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-10 py-4 rounded-xl text-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                Start Free Trial
              </button>
              <button className="px-10 py-4 rounded-xl text-lg font-semibold text-white border-2 border-gray-600 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-300">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent mb-4">
                Logistics Platform
              </h3>
              <p className="text-gray-400">
                Revolutionizing global logistics with AI-powered solutions and comprehensive compliance management.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">News</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Logistics Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;