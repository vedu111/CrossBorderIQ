import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FileText, 
  Printer, 
  ArrowLeft, 
  MapPin, 
  Route, 
  Package, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Zap,
  Truck
} from "lucide-react";

const Receipt = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const incoming = state && state.receiptData ? state.receiptData : null;
    if (incoming) {
      setData(incoming);
      try { sessionStorage.setItem('receiptData', JSON.stringify(incoming)); } catch {}
    } else {
      try {
        const saved = sessionStorage.getItem('receiptData');
        if (saved) setData(JSON.parse(saved));
      } catch {}
    }
  }, [state]);

  if (!data) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl text-center">
          <div className="bg-red-500/20 p-4 rounded-lg inline-flex mb-6">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
          <p className="text-gray-300 text-lg mb-6">No receipt data found. Please select a route first.</p>
          <button 
            onClick={() => navigate('/plan')} 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Go to Planning
          </button>
        </div>
      </div>
    </div>
  );

  const { selectedRoute, products, totals, addresses, compliance } = data;

  // Printable Receipt Component - Enhanced for printing
  const PrintableReceipt = () => (
    <div className="bg-white text-black p-8 font-sans max-w-4xl mx-auto print:block hidden">
      <div className="border-b-2 border-gray-300 pb-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-blue-600">Shipment Receipt</h1>
          </div>
          <div className="text-sm text-gray-600">
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Receipt ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" /> Addresses
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="border border-gray-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-600">Origin</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">{addresses.start}</div>
              <div>{addresses.sourceCountry}</div>
              <div className="text-gray-500">Lat: {addresses.startLat}, Lon: {addresses.startLon}</div>
            </div>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-600">Destination</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">{addresses.end}</div>
              <div>{addresses.destinationCountry}</div>
              <div className="text-gray-500">Lat: {addresses.endLat}, Lon: {addresses.endLon}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Route className="w-5 h-5" /> Route Summary (Route {selectedRoute.rank})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="border border-gray-200 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-600">Score</div>
            <div className="font-bold text-blue-600">{selectedRoute.score}</div>
          </div>
          <div className="border border-gray-200 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-600">Cost (USD)</div>
            <div className="font-bold text-green-600">{selectedRoute.cost.toLocaleString()}</div>
          </div>
          <div className="border border-gray-200 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-600">Time (days)</div>
            <div className="font-bold text-blue-600">{selectedRoute.time_days}</div>
          </div>
          <div className="border border-gray-200 p-3 rounded-lg text-center">
            <div className="text-sm text-gray-600">Emissions (kg CO₂)</div>
            <div className="font-bold text-purple-600">{selectedRoute.emissions}</div>
          </div>
        </div>
        <div className="border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4" />
            <span className="font-medium">Path</span>
          </div>
          <div className="text-sm">{selectedRoute.path.join(' → ')}</div>
        </div>
      </div>

      {/* Cost & Time Breakdown */}
      <div className="mb-8 grid grid-cols-2 gap-6">
        <div className="border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-semibold">Cost Breakdown</span>
          </div>
          {Object.entries(selectedRoute.cost_breakdown).map(([seg, cost]) => (
            <div key={seg} className="flex justify-between text-sm py-1">
              <span>{seg}</span>
              <span className="font-medium">${cost.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">Time Breakdown (days)</span>
          </div>
          {Object.entries(selectedRoute.time_breakdown).map(([seg, days]) => (
            <div key={seg} className="flex justify-between text-sm py-1">
              <span>{seg}</span>
              <span className="font-medium">{days}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" /> Products
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2 text-left text-sm font-semibold">Name</th>
              <th className="border border-gray-200 p-2 text-left text-sm font-semibold">HS Code</th>
              <th className="border border-gray-200 p-2 text-left text-sm font-semibold">Weight (kg)</th>
              <th className="border border-gray-200 p-2 text-left text-sm font-semibold">Volume (m³)</th>
              <th className="border border-gray-200 p-2 text-left text-sm font-semibold">Accepted</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const isAccepted = (compliance.items || []).find(it => it.name === p.name)?.accepted;
              return (
                <tr key={i}>
                  <td className="border border-gray-200 p-2 text-sm">{p.name}</td>
                  <td className="border border-gray-200 p-2 text-sm font-mono">{p.hsCode || '-'}</td>
                  <td className="border border-gray-200 p-2 text-sm">{p.weightKg}</td>
                  <td className="border border-gray-200 p-2 text-sm">{p.volumeM3}</td>
                  <td className="border border-gray-200 p-2 text-sm">
                    {isAccepted ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-4 border border-gray-200 p-3 rounded-lg text-sm">
          <span className="font-medium">Totals:</span> {totals.weight} kg, {totals.volume} m³
        </div>
      </div>

      {/* Compliance Notes */}
      {(compliance.exportNotes.length > 0 || compliance.importNotes.length > 0) && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Compliance Notes
          </h2>
          {compliance.exportNotes.length > 0 && (
            <div className="border border-yellow-200 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="font-medium text-yellow-600">Export</span>
              </div>
              <div className="text-sm">{compliance.exportNotes.join('; ')}</div>
            </div>
          )}
          {compliance.importNotes.length > 0 && (
            <div className="border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-600">Import</span>
              </div>
              <div className="text-sm">{compliance.importNotes.join('; ')}</div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        Generated by Logistics System | {new Date().toLocaleDateString()}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-cyan-500/20 p-3 rounded-lg">
                <FileText className="w-8 h-8 text-cyan-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                Shipment Receipt
              </h1>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => print(<PrintableReceipt />)} 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/30 text-gray-300 px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Planning
              </button>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-pink-500/20 p-2 rounded-lg">
              <MapPin className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Addresses</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-500/20 p-1.5 rounded">
                  <MapPin className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-sm font-medium text-green-400">Start</div>
              </div>
              <div className="space-y-2">
                <div className="text-white font-medium">{addresses.start}</div>
                <div className="text-gray-300">{addresses.sourceCountry}</div>
                <div className="text-gray-400 text-sm font-mono">
                  {addresses.startLat}, {addresses.startLon}
                </div>
              </div>
            </div>
            
            <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-500/20 p-1.5 rounded">
                  <MapPin className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-sm font-medium text-red-400">End</div>
              </div>
              <div className="space-y-2">
                <div className="text-white font-medium">{addresses.end}</div>
                <div className="text-gray-300">{addresses.destinationCountry}</div>
                <div className="text-gray-400 text-sm font-mono">
                  {addresses.endLat}, {addresses.endLon}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Route Summary */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Route className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Route Summary (Route {selectedRoute.rank})</h3>
          </div>
          
          {/* Route Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-700/30 border border-slate-600/30 p-4 rounded-xl text-center">
              <div className="text-sm font-medium text-gray-400 mb-1">Score</div>
              <div className="text-2xl font-bold text-cyan-400">{selectedRoute.score}</div>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/30 p-4 rounded-xl text-center">
              <div className="text-sm font-medium text-gray-400 mb-1">Cost (USD)</div>
              <div className="text-2xl font-bold text-green-400">{selectedRoute.cost.toLocaleString()}</div>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/30 p-4 rounded-xl text-center">
              <div className="text-sm font-medium text-gray-400 mb-1">Time (days)</div>
              <div className="text-2xl font-bold text-blue-400">{selectedRoute.time_days}</div>
            </div>
            <div className="bg-slate-700/30 border border-slate-600/30 p-4 rounded-xl text-center">
              <div className="text-sm font-medium text-gray-400 mb-1">Emissions (kg CO₂)</div>
              <div className="text-2xl font-bold text-purple-400">{selectedRoute.emissions}</div>
            </div>
          </div>

          {/* Route Path */}
          <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-5 h-5 text-cyan-400" />
              <div className="text-sm font-medium text-gray-300">Path</div>
            </div>
            <div className="text-gray-300 break-words">
              {selectedRoute.path.join(' → ')}
            </div>
          </div>

          {/* Cost & Time Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-400" />
                <div className="text-lg font-bold text-white">Cost Breakdown</div>
              </div>
              <div className="space-y-3">
                {Object.entries(selectedRoute.cost_breakdown).map(([seg, cost]) => (
                  <div key={seg} className="flex justify-between items-center py-2 border-b border-slate-600/30 last:border-b-0">
                    <span className="text-gray-300">{seg}</span>
                    <span className="text-green-400 font-medium">${cost.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <div className="text-lg font-bold text-white">Time Breakdown (days)</div>
              </div>
              <div className="space-y-3">
                {Object.entries(selectedRoute.time_breakdown).map(([seg, days]) => (
                  <div key={seg} className="flex justify-between items-center py-2 border-b border-slate-600/30 last:border-b-0">
                    <span className="text-gray-300">{seg}</span>
                    <span className="text-blue-400 font-medium">{days}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-pink-500/20 p-2 rounded-lg">
              <Package className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Products</h3>
          </div>
          
          <div className="bg-slate-700/30 rounded-xl border border-slate-600/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-600/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">HS Code</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Weight (kg)</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Volume (m³)</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Accepted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600/30">
                  {products.map((p, i) => {
                    const isAccepted = (compliance.items || []).find(it => it.name === p.name)?.accepted;
                    return (
                      <tr key={i} className="hover:bg-slate-600/20 transition-colors">
                        <td className="px-6 py-4 text-gray-300">{p.name}</td>
                        <td className="px-6 py-4 text-gray-300 font-mono text-sm">{p.hsCode || '-'}</td>
                        <td className="px-6 py-4 text-gray-300">{p.weightKg}</td>
                        <td className="px-6 py-4 text-gray-300">{p.volumeM3}</td>
                        <td className="px-6 py-4">
                          {isAccepted ? (
                            <div className="flex items-center gap-2 text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm">Yes</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-400">
                              <XCircle className="w-4 h-4" />
                              <span className="text-sm">No</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 bg-slate-700/30 border border-slate-600/30 p-4 rounded-xl">
            <div className="flex items-center gap-4 text-gray-300 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Totals: {totals.weight} kg, {totals.volume} m³</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Notes */}
        {(compliance.exportNotes.length > 0 || compliance.importNotes.length > 0) && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Compliance Notes</h3>
            </div>
            
            <div className="space-y-4 text-sm text-gray-300">
              {compliance.exportNotes.length > 0 && (
                <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">Export</span>
                  </div>
                  <div className="text-gray-300">
                    {compliance.exportNotes.join('; ')}
                  </div>
                </div>
              )}
              
              {compliance.importNotes.length > 0 && (
                <div className="bg-blue-400/10 border border-blue-400/20 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Import</span>
                  </div>
                  <div className="text-gray-300">
                    {compliance.importNotes.join('; ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Printable Receipt - Now visible only when printing */}
        <PrintableReceipt />
      </div>
    </div>
  );
};

export default Receipt;