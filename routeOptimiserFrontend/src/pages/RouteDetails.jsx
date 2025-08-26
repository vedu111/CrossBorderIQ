import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Route, 
  Star, 
  DollarSign, 
  Clock, 
  Leaf, 
  Truck, 
  Plane, 
  Ship, 
  MapPin, 
  BarChart3, 
  Receipt,
  TrendingUp
} from "lucide-react";

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-2xl">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-cyan-500/20 p-2 rounded-lg">
        <Icon className="w-6 h-6 text-cyan-400" />
      </div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const RouteDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { rank } = useParams();

  const route = state?.route || null;
  const homeState = state?.homeState || null;

  useEffect(() => {
    if (!route) {
      // No route passed via navigation state; return to home.
      navigate("/", { replace: true });
    }
  }, [route, navigate]);

  if (!route) return null;

  const getTransportIcon = (mode) => {
    switch (mode.toLowerCase()) {
      case "land": return <Truck className="w-4 h-4" />;
      case "air": return <Plane className="w-4 h-4" />;
      case "sea": return <Ship className="w-4 h-4" />;
      default: return <Route className="w-4 h-4" />;
    }
  };

  const getTransportColor = (mode) => {
    switch (mode.toLowerCase()) {
      case "land": return "bg-cyan-400/20 text-cyan-400 border-cyan-400/30";
      case "air": return "bg-pink-500/20 text-pink-500 border-pink-500/30";
      case "sea": return "bg-green-400/20 text-green-400 border-green-400/30";
      default: return "bg-blue-400/20 text-blue-400 border-blue-400/30";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              Route {rank}
            </h1>
            <p className="text-xl text-gray-300">Detailed route analysis and breakdown</p>
          </div>
          <button
            onClick={() => {
              if (homeState) {
                try {
                  sessionStorage.setItem("homeState", JSON.stringify(homeState));
                } catch (e) {}
              }
              navigate('/plan', { state: { homeState }, replace: true });
            }}
            className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/30 text-gray-300 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Routes
          </button>
        </div>

        {/* Overview Section */}
        <Section title="Overview" icon={TrendingUp}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <p className="text-gray-400 text-sm font-medium">Score</p>
              </div>
              <p className="text-2xl font-bold text-white">{route.score}</p>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <p className="text-gray-400 text-sm font-medium">Cost (USD)</p>
              </div>
              <p className="text-2xl font-bold text-green-400">${route.cost.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <p className="text-gray-400 text-sm font-medium">Time (days)</p>
              </div>
              <p className="text-2xl font-bold text-blue-400">{route.time_days}</p>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <p className="text-gray-400 text-sm font-medium">Emissions (kg CO₂)</p>
              </div>
              <p className="text-2xl font-bold text-emerald-400">{route.emissions}</p>
            </div>
          </div>
        </Section>

        {/* Transport Modes Section */}
        <Section title="Transport Modes" icon={Route}>
          <div className="flex flex-wrap gap-3">
            {route.modes.map((m, i) => (
              <div 
                key={`${m}-${i}`} 
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300 ${getTransportColor(m)}`}
              >
                {getTransportIcon(m)}
                <span className="capitalize">{m}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Path Section */}
        <Section title="Route Path" icon={MapPin}>
          <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl">
            <div className="text-gray-300 text-lg leading-relaxed break-words">
              {route.path.join(" → ")}
            </div>
          </div>
        </Section>

        {/* Cost and Time Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cost Breakdown */}
          <Section title="Cost Breakdown" icon={DollarSign}>
            <div className="space-y-4">
              {Object.entries(route.cost_breakdown).map(([segment, cost]) => (
                <div key={segment} className="flex justify-between items-center py-3 px-4 bg-slate-700/30 border border-slate-600/30 rounded-lg">
                  <span className="text-gray-300 font-medium">{segment}</span>
                  <span className="text-green-400 font-bold">${cost.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-slate-600/50 pt-4 mt-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-white font-bold text-lg">Total Cost</span>
                  <span className="text-green-400 font-bold text-xl">${route.cost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Section>

          {/* Time Breakdown */}
          <Section title="Time Breakdown" icon={Clock}>
            <div className="space-y-4">
              {Object.entries(route.time_breakdown).map(([segment, days]) => (
                <div key={segment} className="flex justify-between items-center py-3 px-4 bg-slate-700/30 border border-slate-600/30 rounded-lg">
                  <span className="text-gray-300 font-medium">{segment}</span>
                  <span className="text-blue-400 font-bold">{days} days</span>
                </div>
              ))}
              <div className="border-t border-slate-600/50 pt-4 mt-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-white font-bold text-lg">Total Time</span>
                  <span className="text-blue-400 font-bold text-xl">{route.time_days} days</span>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Environmental Impact */}
        <Section title="Environmental Impact" icon={Leaf}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-medium">Carbon Footprint</span>
              <span className="text-emerald-400 font-bold text-xl">{route.emissions} kg CO₂</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((route.emissions / 1000) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">
              Environmental impact visualization based on CO₂ emissions
            </p>
          </div>
        </Section>

        {/* Action Button */}
        <div className="flex justify-center pt-6">
          <button
            onClick={() => {
              // Build receipt payload from available state + compliance cache
              let compliance = null;
              try { 
                compliance = JSON.parse(sessionStorage.getItem('complianceState') || 'null'); 
              } catch {}
              
              const totals = {
                weight: Number(homeState?.formData?.weight || 0),
                volume: Number(homeState?.formData?.volume || 0)
              };
              
              if ((!totals.weight || !totals.volume) && Array.isArray(compliance?.products)) {
                totals.weight = compliance.products.reduce((s,p)=>s+(Number(p.weightKg)||0),0);
                totals.volume = compliance.products.reduce((s,p)=>s+(Number(p.volumeM3)||0),0);
              }
              
              const payload = {
                selectedRoute: route,
                products: compliance?.products || [],
                totals,
                addresses: {
                  start: homeState?.initialAddress || '',
                  end: homeState?.finalAddress || '',
                  startLat: homeState?.formData?.startLat,
                  startLon: homeState?.formData?.startLon,
                  endLat: homeState?.formData?.endLat,
                  endLon: homeState?.formData?.endLon,
                  sourceCountry: homeState?.initialCountry,
                  destinationCountry: homeState?.finalCountry,
                },
                compliance: {
                  items: compliance?.itemsResult || [],
                  exportNotes: compliance?.notes?.exportNotes || [],
                  importNotes: compliance?.notes?.importNotes || []
                }
              };
              
              try { 
                sessionStorage.setItem('receiptData', JSON.stringify(payload)); 
              } catch {}
              
              navigate('/receipt', { state: { receiptData: payload } });
            }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-3 text-lg font-medium"
          >
            <Receipt className="w-6 h-6" />
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteDetails;