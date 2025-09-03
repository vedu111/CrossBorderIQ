import React, { useEffect, useState } from "react";
import { 
  FileText, 
  MapPin, 
  Route, 
  Package, 
  AlertCircle,
  Clock,
  DollarSign,
  Truck
} from "lucide-react";

const PrintableReceipt = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Get data from sessionStorage
    try {
      const saved = sessionStorage.getItem('receiptData');
      if (saved) {
        setData(JSON.parse(saved));
        // Auto-print after a short delay to ensure content is loaded
        setTimeout(() => {
          window.print();
        }, 500);
      }
    } catch (error) {
      console.error('Error loading receipt data:', error);
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-4">Loading receipt data...</div>
          <div className="text-gray-600">If this persists, please go back and try again.</div>
        </div>
      </div>
    );
  }

  const { selectedRoute, products, totals, addresses, compliance } = data;

  return (
    <>
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body { margin: 0; padding: 0; }
          .print-container { margin: 0 !important; padding: 20px !important; }
        }
        @media screen {
          .print-container { max-width: 210mm; margin: 20px auto; padding: 20mm; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        }
      `}</style>

      <div className="print-container bg-white text-black font-sans">
        {/* Header */}
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
          <div className="mb-8">
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

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
          Generated by Logistics System | {new Date().toLocaleDateString()}
        </div>

        {/* Print button for screen view */}
        <div className="mt-6 text-center print:hidden">
          <button 
            onClick={() => window.print()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mr-4"
          >
            Print Receipt
          </button>
          <button 
            onClick={() => window.close()} 
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default PrintableReceipt;