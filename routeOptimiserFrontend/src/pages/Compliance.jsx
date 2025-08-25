import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const emptyProduct = { name: "", hsCode: "", weightKg: 0, volumeM3: 0 };

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
    // try restore last session
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
      // Ensure geocoded countries available
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
      // apply suggested hsCode back into editor if provided
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
    // pass totals to Home and persist
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-3xl font-bold">Compliance Check</h2>

      <div className="neon-card p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Start Address</label>
          <div className="flex gap-2">
            <input className="neon-input w-full" value={startAddress} onChange={(e) => setStartAddress(e.target.value)} placeholder="Enter start address" />
            <button onClick={handleGeocodeStart} type="button" className="neon-button px-3 py-2 rounded-md">Set</button>
          </div>
          {startLat && startLon && (
            <div className="text-xs text-gray-400 mt-1">{sourceCountry} · {startLat.toFixed(4)}, {startLon.toFixed(4)}</div>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">End Address</label>
          <div className="flex gap-2">
            <input className="neon-input w-full" value={endAddress} onChange={(e) => setEndAddress(e.target.value)} placeholder="Enter destination address" />
            <button onClick={handleGeocodeEnd} type="button" className="neon-button px-3 py-2 rounded-md">Set</button>
          </div>
          {endLat && endLon && (
            <div className="text-xs text-gray-400 mt-1">{destinationCountry} · {endLat.toFixed(4)}, {endLon.toFixed(4)}</div>
          )}
        </div>
      </div>

      <div className="neon-card p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold">Products</h3>
          <button onClick={addProduct} className="neon-button px-3 py-1 rounded-md">Add product</button>
        </div>
        <div className="space-y-3">
          {products.map((p, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-1">Name</label>
                <input className="neon-input w-full" value={p.name} onChange={(e) => updateProduct(idx, 'name', e.target.value)} placeholder="Lithium batteries" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">HS Code (optional)</label>
                <input className="neon-input w-full" value={p.hsCode} onChange={(e) => updateProduct(idx, 'hsCode', e.target.value)} placeholder="850650" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Weight (kg)</label>
                <input type="number" min="0" step="0.01" className="neon-input w-full" value={p.weightKg} onChange={(e) => updateProduct(idx, 'weightKg', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Volume (m³)</label>
                <input type="number" min="0" step="0.001" className="neon-input w-full" value={p.volumeM3} onChange={(e) => updateProduct(idx, 'volumeM3', e.target.value)} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => removeProduct(idx)} className="px-3 py-2 rounded-md bg-gray-800 text-gray-300">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4">
          <button disabled={!canRun || loading} onClick={runCompliance} className="neon-button px-4 py-2 rounded-md disabled:opacity-50">{loading ? 'Checking…' : 'Run compliance check'}</button>
          <div className="text-sm text-gray-300">Totals: {totals.weight.toFixed(2)} kg, {totals.volume.toFixed(3)} m³</div>
        </div>
        {error && <div className="mt-3 text-red-400 text-sm">{error}</div>}
      </div>

      {itemsResult.length > 0 && (
        <div className="neon-card p-4 rounded-lg space-y-3">
          <h3 className="text-xl font-bold">Results</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-300">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">HS Code</th>
                  <th className="py-2 pr-4">Accepted</th>
                  <th className="py-2">Reasons</th>
                </tr>
              </thead>
              <tbody>
                {itemsResult.map((it, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    <td className="py-2 pr-4">{it.name}</td>
                    <td className="py-2 pr-4">{it.hsCode || '-'}</td>
                    <td className="py-2 pr-4">{it.accepted ? <span className="text-green-400">Accepted</span> : <span className="text-red-400">Rejected</span>}</td>
                    <td className="py-2">{(it.reasons || []).join('; ') || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(notes.exportNotes.length > 0 || notes.importNotes.length > 0) && (
            <div className="text-sm text-gray-400 space-y-1">
              {notes.exportNotes.length > 0 && <div>Export: {notes.exportNotes.join('; ')}</div>}
              {notes.importNotes.length > 0 && <div>Import: {notes.importNotes.join('; ')}</div>}
            </div>
          )}
          <div className="pt-2 flex justify-end">
            <button disabled={!allAccepted} onClick={goToPlanning} className="neon-button px-4 py-2 rounded-md disabled:opacity-50">Proceed</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compliance;


