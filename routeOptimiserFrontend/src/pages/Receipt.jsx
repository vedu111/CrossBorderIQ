import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <p className="text-gray-300">No receipt data found. Please select a route first.</p>
      <button onClick={() => navigate('/plan')} className="mt-4 neon-button px-4 py-2 rounded-md">Go to Planning</button>
    </div>
  );

  const { selectedRoute, products, totals, addresses, compliance } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Shipment Receipt</h2>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="neon-button px-4 py-2 rounded-md">Print</button>
          <button onClick={() => navigate('/')} className="px-4 py-2 rounded-md bg-gray-800 text-gray-200">Back to Planning</button>
        </div>
      </div>

      <div className="neon-card p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Addresses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <div className="font-semibold">Start</div>
            <div>{addresses.start}</div>
            <div>{addresses.sourceCountry}</div>
            <div className="text-gray-400">{addresses.startLat}, {addresses.startLon}</div>
          </div>
          <div>
            <div className="font-semibold">End</div>
            <div>{addresses.end}</div>
            <div>{addresses.destinationCountry}</div>
            <div className="text-gray-400">{addresses.endLat}, {addresses.endLon}</div>
          </div>
        </div>
      </div>

      <div className="neon-card p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Route Summary (Route {selectedRoute.rank})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-200">
          <div><div className="text-sm text-gray-400">Score</div><div className="text-lg">{selectedRoute.score}</div></div>
          <div><div className="text-sm text-gray-400">Cost (USD)</div><div className="text-lg">{selectedRoute.cost.toLocaleString()}</div></div>
          <div><div className="text-sm text-gray-400">Time (days)</div><div className="text-lg">{selectedRoute.time_days}</div></div>
          <div><div className="text-sm text-gray-400">Emissions (kg CO₂)</div><div className="text-lg">{selectedRoute.emissions}</div></div>
        </div>
        <div className="mt-3 text-gray-300 break-words">
          <div className="font-semibold mb-1">Path</div>
          <div>{selectedRoute.path.join(' → ')}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <div className="font-semibold mb-1">Cost Breakdown</div>
            <div className="space-y-1 text-sm text-gray-300">
              {Object.entries(selectedRoute.cost_breakdown).map(([seg, cost]) => (
                <div key={seg} className="flex justify-between"><span>{seg}</span><span>${cost.toLocaleString()}</span></div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1">Time Breakdown (days)</div>
            <div className="space-y-1 text-sm text-gray-300">
              {Object.entries(selectedRoute.time_breakdown).map(([seg, days]) => (
                <div key={seg} className="flex justify-between"><span>{seg}</span><span>{days}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="neon-card p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-300">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">HS Code</th>
                <th className="py-2 pr-4">Weight (kg)</th>
                <th className="py-2 pr-4">Volume (m³)</th>
                <th className="py-2">Accepted</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="py-2 pr-4">{p.name}</td>
                  <td className="py-2 pr-4">{p.hsCode || '-'}</td>
                  <td className="py-2 pr-4">{p.weightKg}</td>
                  <td className="py-2 pr-4">{p.volumeM3}</td>
                  <td className="py-2">{(compliance.items || []).find(it => it.name === p.name)?.accepted ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-sm text-gray-300">Totals: {totals.weight} kg, {totals.volume} m³</div>
      </div>

      {(compliance.exportNotes.length > 0 || compliance.importNotes.length > 0) && (
        <div className="neon-card p-4 rounded-lg text-sm text-gray-300">
          <h3 className="text-xl font-bold mb-2">Compliance Notes</h3>
          {compliance.exportNotes.length > 0 && <div>Export: {compliance.exportNotes.join('; ')}</div>}
          {compliance.importNotes.length > 0 && <div>Import: {compliance.importNotes.join('; ')}</div>}
        </div>
      )}
    </div>
  );
};

export default Receipt;


