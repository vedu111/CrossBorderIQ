import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, User, MessageCircle, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      info: "support@fusionflow.com",
      description: "Get in touch for support or inquiries",
      color: "cyan"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      info: "+1 (555) 123-4567",
      description: "Speak with our logistics experts",
      color: "pink"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      info: "123 Logistics Avenue, Global City",
      description: "Our headquarters and main office",
      color: "green"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      info: "24/7 Support Available",
      description: "Round-the-clock customer service",
      color: "blue"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      cyan: "bg-cyan-500/20 text-cyan-400",
      pink: "bg-pink-500/20 text-pink-400",
      green: "bg-green-500/20 text-green-400",
      blue: "bg-blue-500/20 text-blue-400"
    };
    return colors[color] || colors.cyan;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get in touch with our logistics experts. We're here to help optimize your supply chain operations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-cyan-500/20 p-2 rounded-lg">
                <MessageCircle className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Send us a Message</h2>
            </div>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="bg-green-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Message Sent!</h3>
                <p className="text-gray-300">
                  Thank you for contacting us. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </div>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </div>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </div>
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300 resize-none"
                    placeholder="Tell us how we can help you with your logistics needs..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-pink-500/20 p-2 rounded-lg">
                  <Phone className="w-6 h-6 text-pink-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Get in Touch</h2>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-600/30 transition-all duration-300">
                    <div className={`p-2 rounded-lg ${getColorClasses(item.color)}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-gray-300 font-medium mb-2">{item.info}</p>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <MapPin className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Quick Start</h2>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300 mb-6">
                  Ready to optimize your logistics? Start with these popular options:
                </p>
                
                <div className="space-y-3">
                  <button className="w-full text-left p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-600/30 hover:border-cyan-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Compliance Check</span>
                      <div className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">Verify your shipment regulations</p>
                  </button>

                  <button className="w-full text-left p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-600/30 hover:border-pink-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Route Planning</span>
                      <div className="text-pink-400 group-hover:translate-x-1 transition-transform">→</div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">Find optimal shipping routes</p>
                  </button>

                  <button className="w-full text-left p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-600/30 hover:border-green-500/50 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Support Center</span>
                      <div className="text-green-400 group-hover:translate-x-1 transition-transform">→</div>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">Browse help articles and guides</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;