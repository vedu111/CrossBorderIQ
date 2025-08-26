import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Package, CheckCircle, XCircle, Plus, Trash2, Globe, Weight, Box, ArrowRight, AlertCircle, FileText } from "lucide-react";

const emptyProduct = { name: "", hsCode: "", weightKg: "", volumeM3: "" };

const Compliance = () => {
  const navigate = useNavigate();
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [sourceCountry, setSourceCountry] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [startLat, setStartLat] = useState(null);
  const [startLon, setStartLon] = useState(null);
  const [endLat, setEndLat] = useState(null);
  const [endLon, setEndLon] = useState(null);
  const [products, setProducts] = useState([{ ...emptyProduct }]);
  const [itemsResult, setItemsResult] = useState([]);
  const [notes, setNotes] = useState({ exportNotes: [], importNotes: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allAccepted = useMemo(() => itemsResult.length > 0 && itemsResult.every(i => i.accepted), [itemsResult]);
  const totals = useMemo(() => {
    const weight = products.reduce((s, p) => s + (Number(p.weightKg) || 0), 0);
    const volume = products.reduce((s, p) => s + (Number(p.volumeM3) || 0), 0);
    return { weight, volume };
  }, [products]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("complianceState");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.startAddress) setStartAddress(parsed.startAddress);
        if (parsed.endAddress) setEndAddress(parsed.endAddress);
        if (typeof parsed.startLat === 'number') setStartLat(parsed.startLat);
        if (typeof parsed.startLon === 'number') setStartLon(parsed.startLon);
        if (typeof parsed.endLat === 'number') setEndLat(parsed.endLat);
        if (typeof parsed.endLon === 'number') setEndLon(parsed.endLon);
        if (parsed.sourceCountry) setSourceCountry(parsed.sourceCountry);
        if (parsed.destinationCountry) setDestinationCountry(parsed.destinationCountry);
        if (Array.isArray(parsed.products) && parsed.products.length) setProducts(parsed.products);
        if (Array.isArray(parsed.itemsResult)) setItemsResult(parsed.itemsResult);
        if (parsed.notes) setNotes(parsed.notes);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem("complianceState", JSON.stringify({ startAddress, endAddress, startLat, startLon, endLat, endLon, sourceCountry, destinationCountry, products, itemsResult, notes }));
    } catch {}
  }, [startAddress, endAddress, startLat, startLon, endLat, endLon, sourceCountry, destinationCountry, products, itemsResult, notes]);

  const googleApiKey = (typeof process !== "undefined" && process.env && process.env.REACT_APP_GOOGLE_API_KEY)
    ? process.env.REACT_APP_GOOGLE_API_KEY
    : import.meta.env.VITE_GOOGLE_API_KEY;

  const geocodeAddress = async (addr, setter) => {
    if (!addr || !googleApiKey) return;
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addr)}&key=${googleApiKey}`);
    const data = await response.json();
    if (data.status === 'OK' && data.results.length > 0) {
      const loc = data.results[0].geometry.location;
      const countryComp = data.results[0].address_components.find(c => c.types.includes('country'));
      setter(loc, countryComp ? countryComp.long_name : "");
    } else {
      throw new Error('Address not found');
    }
  };

  const handleGeocodeStart = async () => {
    try {
      await geocodeAddress(startAddress, (loc, country) => { setStartLat(loc.lat); setStartLon(loc.lng); setSourceCountry(country); });
    } catch {}
  };
  const handleGeocodeEnd = async () => {
    try {
      await geocodeAddress(endAddress, (loc, country) => { setEndLat(loc.lat); setEndLon(loc.lng); setDestinationCountry(country); });
    } catch {}
  };

  const updateProduct = (idx, key, value) => {
    setProducts(prev => prev.map((p, i) => (i === idx ? { ...p, [key]: key === 'name' || key === 'hsCode' ? value : Number(value) } : p)));
    setItemsResult([]); // invalidate previous results on edit
  };
 

  const addProduct = () => setProducts(prev => [...prev, { ...emptyProduct }]);
  const removeProduct = (idx) => setProducts(prev => prev.filter((_, i) => i !== idx));

  const runCompliance = async () => {
    setLoading(true);
    setError("");
    setItemsResult([]);
    try {
      if (!sourceCountry || !destinationCountry) {
        await handleGeocodeStart();
        await handleGeocodeEnd();
      }
      const apiBase = (import.meta?.env?.VITE_API_BASE) || "http://localhost:3000";
      const payload = {
        sourceCountry: sourceCountry.trim(),
        destinationCountry: destinationCountry.trim(),
        products: products.map(p => ({
          name: String(p.name || ""),
          hsCode: p.hsCode ? String(p.hsCode) : undefined,
          weightKg: Number(p.weightKg) || 0,
          volumeM3: Number(p.volumeM3) || 0,
        }))
      };
      const res = await fetch(`${apiBase}/api/compliance/check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`${res.status} ${t}`);
      }
      const data = await res.json();
      if (data.status !== 'success') throw new Error(data.message || 'Compliance failed');
      setItemsResult(data.items || []);
      setNotes({ exportNotes: data.exportNotes || [], importNotes: data.importNotes || [] });
      if (Array.isArray(data.items)) {
        setProducts(prev => prev.map((p, i) => ({ ...p, hsCode: (data.items[i] && data.items[i].hsCode) ? data.items[i].hsCode : p.hsCode })));
      }
    } catch (e) {
      setError(e.message || 'Compliance service error');
    } finally {
      setLoading(false);
    }
  };

  const goToPlanning = () => {
    const homeState = {
      homeState: {
        prefill: { weight: totals.weight, volume: totals.volume },
        formData: {
          startLat: startLat, startLon: startLon,
          endLat: endLat, endLon: endLon,
          weight: totals.weight, volume: totals.volume
        },
        initialCountry: sourceCountry,
        finalCountry: destinationCountry,
        initialAddress: startAddress,
        finalAddress: endAddress,
        hasSubmitted: false
      }
    };
    try {
      sessionStorage.setItem('homeState', JSON.stringify(homeState.homeState));
    } catch {}
    navigate('/plan', { state: homeState });
  };

  const canRun = startAddress && endAddress && products.every(p => p.name && p.weightKg >= 0 && p.volumeM3 >= 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Address Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-cyan-500/20 p-2 rounded-lg">
              <MapPin className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Route Information</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Address</label>
              <div className="flex space-x-4">
                <div className="relative flex-1">
                  <input 
                    className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300" 
                    value={startAddress} 
                    onChange={(e) => setStartAddress(e.target.value)} 
                    placeholder="Enter start address" 
                  />
                </div>
                <button 
                  onClick={handleGeocodeStart} 
                  type="button" 
                  className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <Globe className="w-5 h-5" />
                </button>
              </div>
              {startLat && startLon && (
                <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                  <CheckCircle className="w-4 h-4" />
                  <span>{sourceCountry} · {startLat.toFixed(4)}, {startLon.toFixed(4)}</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">End Address</label>
              <div className="flex space-x-4">
                <div className="relative flex-1">
                  <input 
                    className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300" 
                    value={endAddress} 
                    onChange={(e) => setEndAddress(e.target.value)} 
                    placeholder="Enter destination address" 
                  />
                </div>
                <button 
                  onClick={handleGeocodeEnd} 
                  type="button" 
                  className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <Globe className="w-5 h-5" />
                </button>
              </div>
              {endLat && endLon && (
                <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                  <CheckCircle className="w-4 h-4" />
                  <span>{destinationCountry} · {endLat.toFixed(4)}, {endLon.toFixed(4)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-pink-500/20 p-2 rounded-lg">
                <Package className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Products</h3>
            </div>
            <button 
              onClick={addProduct} 
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>

          <div className="space-y-6">
            {products.map((p, idx) => (
              <div key={idx} className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-end">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                    <input 
                      className="w-full p-3 bg-slate-600/50 border border-slate-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300" 
                      value={p.name} 
                      onChange={(e) => updateProduct(idx, 'name', e.target.value)} 
                      placeholder="e.g., Lithium batteries" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">HS Code <span className="text-gray-500">(optional)</span></label>
                    <input 
                      className="w-full p-3 bg-slate-600/50 border border-slate-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300" 
                      value={p.hsCode} 
                      onChange={(e) => updateProduct(idx, 'hsCode', e.target.value)} 
                      placeholder="850650" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Weight className="w-4 h-4" />
                      Weight (kg)
                    </label>
                    <input 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      className="w-full p-3 bg-slate-600/50 border border-slate-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300" 
                      value={p.weightKg} 
                      onChange={(e) => updateProduct(idx, 'weightKg', e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Box className="w-4 h-4" />
                      Volume (m³)
                    </label>
                    <input 
                      type="number" 
                      min="0" 
                      step="0.001" 
                      className="w-full p-3 bg-slate-600/50 border border-slate-500/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300" 
                      value={p.volumeM3} 
                      onChange={(e) => updateProduct(idx, 'volumeM3', e.target.value)} 
                    />
                  </div>
                  <div className="flex justify-center">
                    <button 
                      onClick={() => removeProduct(idx)} 
                      className="flex items-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-lg font-medium transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col md:flex-row items-center gap-6">
            <button 
              disabled={!canRun || loading} 
              onClick={runCompliance} 
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Checking Compliance...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Run Compliance Check
                </>
              )}
            </button>
            
            <div className="flex items-center gap-4 px-6 py-3 bg-slate-700/50 rounded-xl border border-slate-600/30">
              <div className="flex items-center gap-2 text-cyan-400">
                <Weight className="w-5 h-5" />
                <span className="font-medium">{totals.weight.toFixed(2)} kg</span>
              </div>
              <div className="w-px h-6 bg-slate-600"></div>
              <div className="flex items-center gap-2 text-pink-400">
                <Box className="w-5 h-5" />
                <span className="font-medium">{totals.volume.toFixed(3)} m³</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        {itemsResult.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Compliance Results</h3>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-full bg-slate-700/30 rounded-xl border border-slate-600/30 overflow-hidden">
                <div className="bg-slate-600/50 px-6 py-4 border-b border-slate-500/50">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-300">
                    <div>Product</div>
                    <div>HS Code</div>
                    <div>Status</div>
                    <div>Details</div>
                  </div>
                </div>
                <div className="divide-y divide-slate-600/30">
                  {itemsResult.map((it, i) => (
                    <div key={i} className="px-6 py-4 hover:bg-slate-600/20 transition-colors">
                      <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-white font-medium">{it.name}</div>
                        <div className="text-gray-300 font-mono text-sm">{it.hsCode || '-'}</div>
                        <div>
                          {it.accepted ? (
                            <span className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-lg border border-green-400/20 text-sm font-medium">
                              <CheckCircle className="w-4 h-4" />
                              Accepted
                            </span>
                          ) : (
                            <span className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1 rounded-lg border border-red-400/20 text-sm font-medium">
                              <XCircle className="w-4 h-4" />
                              Rejected
                            </span>
                          )}
                        </div>
                        <div className="text-gray-300 text-sm">{(it.reasons || []).join('; ') || '-'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {(notes.exportNotes.length > 0 || notes.importNotes.length > 0) && (
              <div className="mt-6 space-y-3">
                {notes.exportNotes.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="bg-blue-500/20 p-1 rounded">
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-blue-400 font-medium text-sm mb-1">Export Notes</div>
                      <div className="text-gray-300 text-sm">{notes.exportNotes.join('; ')}</div>
                    </div>
                  </div>
                )}
                {notes.importNotes.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                    <div className="bg-purple-500/20 p-1 rounded">
                      <ArrowRight className="w-4 h-4 text-purple-400 rotate-180" />
                    </div>
                    <div>
                      <div className="text-purple-400 font-medium text-sm mb-1">Import Notes</div>
                      <div className="text-gray-300 text-sm">{notes.importNotes.join('; ')}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="pt-8 flex justify-end">
              <button 
                disabled={!allAccepted} 
                onClick={goToPlanning} 
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <ArrowRight className="w-5 h-5" />
                Proceed to Planning
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compliance;