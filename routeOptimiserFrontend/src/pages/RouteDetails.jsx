import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Section = ({ title, children }) => (
  <div className="neon-card p-4 rounded-lg">
    <h3 className="text-xl font-bold mb-3">{title}</h3>
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Route {rank}</h2>
        <button
          onClick={() => {
            if (homeState) {
              try {
                sessionStorage.setItem("homeState", JSON.stringify(homeState));
              } catch (e) {}
            }
            navigate('/plan', { state: { homeState }, replace: true });
          }}
          className="neon-button px-4 py-2 rounded-md"
        >Back</button>
      </div>

      <Section title="Overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-md p-3">
            <p className="text-gray-400 text-sm">Score</p>
            <p className="text-xl font-semibold">{route.score}</p>
          </div>
          <div className="bg-gray-800 rounded-md p-3">
            <p className="text-gray-400 text-sm">Cost (USD)</p>
            <p className="text-xl font-semibold">{route.cost.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 rounded-md p-3">
            <p className="text-gray-400 text-sm">Time (days)</p>
            <p className="text-xl font-semibold">{route.time_days}</p>
          </div>
          <div className="bg-gray-800 rounded-md p-3">
            <p className="text-gray-400 text-sm">Emissions (kg CO₂)</p>
            <p className="text-xl font-semibold">{route.emissions}</p>
          </div>
        </div>
      </Section>

      <Section title="Transport Modes">
        <div className="flex flex-wrap gap-2">
          {route.modes.map((m, i) => (
            <span key={`${m}-${i}`} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-400/20 text-cyan-400">
              {m}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Path">
        <div className="text-gray-200 break-words">
          {route.path.join(" → ")}
        </div>
      </Section>

      <Section title="Cost Breakdown">
        <div className="space-y-1">
          {Object.entries(route.cost_breakdown).map(([segment, cost]) => (
            <div key={segment} className="flex justify-between text-sm text-gray-300">
              <span className="mr-2">{segment}</span>
              <span>${cost.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Time Breakdown (days)">
        <div className="space-y-1">
          {Object.entries(route.time_breakdown).map(([segment, days]) => (
            <div key={segment} className="flex justify-between text-sm text-gray-300">
              <span className="mr-2">{segment}</span>
              <span>{days}</span>
            </div>
          ))}
        </div>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={() => {
            // Build receipt payload from available state + compliance cache
            let compliance = null;
            try { compliance = JSON.parse(sessionStorage.getItem('complianceState') || 'null'); } catch {}
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
            try { sessionStorage.setItem('receiptData', JSON.stringify(payload)); } catch {}
            navigate('/receipt', { state: { receiptData: payload } });
          }}
          className="neon-button px-6 py-2 rounded-md"
        >Proceed</button>
      </div>
    </div>
  );
};

export default RouteDetails;


