import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { MapPin, Search, Package, Truck, Plane, Ship, Eye, Route, Clock, DollarSign, Leaf, Zap } from "lucide-react";
import "leaflet/dist/leaflet.css";

const googleApiKey =
  typeof process !== "undefined" && process.env && process.env.REACT_APP_GOOGLE_API_KEY
    ? process.env.REACT_APP_GOOGLE_API_KEY
    : import.meta.env.VITE_GOOGLE_API_KEY;

// Debug: Log the API key status
console.log("Google API Key loaded:", !!googleApiKey);
console.log("API Key value:", googleApiKey ? googleApiKey.substring(0, 10) + "..." : "Not found");

const Home = () => {
  const [formData, setFormData] = useState({
    startLat: "",
    startLon: "",
    endLat: "",
    endLon: "",
    maxDays: "",
    optimizationType: "time",
    customWeights: {
      time: 0.25,
      cost: 0.25,
      emissions: 0.25,
      logisticsScore: 0.25,
    },
    weight: "",
    volume: "",
  });

  const [initialAddress, setInitialAddress] = useState("");
  const [finalAddress, setFinalAddress] = useState("");
  const [initialCountry, setInitialCountry] = useState("");
  const [finalCountry, setFinalCountry] = useState("");
  const [routes, setRoutes] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [routeStops, setRouteStops] = useState([]);
  const [selectedRouteRank, setSelectedRouteRank] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const restoredRef = useRef(false);

  // Restore state from sessionStorage on mount
  // Also restore if navigation state provides a fresh snapshot
  useEffect(() => {
    const navState = location.state && (location.state.homeState || location.state.prefill)
      ? (location.state.homeState || { prefill: location.state.prefill })
      : null;
    try {
      const saved = navState || sessionStorage.getItem("homeState");
      const parsed = typeof saved === 'string' ? JSON.parse(saved) : saved;
      if (parsed) {
        if (parsed.formData) setFormData(prev => ({ ...prev, ...parsed.formData }));
        if (parsed.initialAddress) setInitialAddress(parsed.initialAddress);
        if (parsed.finalAddress) setFinalAddress(parsed.finalAddress);
        if (parsed.initialCountry) setInitialCountry(parsed.initialCountry);
        if (parsed.finalCountry) setFinalCountry(parsed.finalCountry);
        if (Array.isArray(parsed.routes)) setRoutes(parsed.routes);
        if (Array.isArray(parsed.routeStops)) setRouteStops(parsed.routeStops);
        if (typeof parsed.hasSubmitted === "boolean") {
          setHasSubmitted(parsed.hasSubmitted);
        } else if (Array.isArray(parsed.routes) && parsed.routes.length > 0) {
          setHasSubmitted(true);
        }
        // Accept prefill from compliance (weight/volume)
        if (parsed.prefill) {
          setFormData(prev => ({ ...prev, weight: parsed.prefill.weight ?? prev.weight, volume: parsed.prefill.volume ?? prev.volume }));
        }
      }
      restoredRef.current = true;
    } catch (e) {
      console.warn("Failed to restore state:", e);
    }
  }, [location.state]);

  // Persist essential state to sessionStorage
  useEffect(() => {
    try {
      if (!restoredRef.current) return; // wait until initial restore happens
      const snapshot = {
        formData,
        initialAddress,
        finalAddress,
        initialCountry,
        finalCountry,
        routes,
        hasSubmitted,
        routeStops,
        selectedRouteRank,
      };
      sessionStorage.setItem("homeState", JSON.stringify(snapshot));
    } catch (e) {
      console.warn("Failed to persist state:", e);
    }
  }, [formData, initialAddress, finalAddress, initialCountry, finalCountry, routes, hasSubmitted, routeStops, selectedRouteRank]);

  // Fallback: if /plan was opened without full state, merge from complianceState
  useEffect(() => {
    if (!restoredRef.current) return;
    const needCoords = !formData.startLat || !formData.startLon || !formData.endLat || !formData.endLon;
    const needTotals = !formData.weight || !formData.volume;
    const needAddrs = !initialAddress || !finalAddress;
    if (!(needCoords || needTotals || needAddrs)) return;
    try {
      const saved = sessionStorage.getItem('complianceState');
      if (!saved) return;
      const c = JSON.parse(saved);
      // Merge addresses and countries
      if (needAddrs) {
        if (c.startAddress) setInitialAddress(c.startAddress);
        if (c.endAddress) setFinalAddress(c.endAddress);
      }
      if (!initialCountry && c.sourceCountry) setInitialCountry(c.sourceCountry);
      if (!finalCountry && c.destinationCountry) setFinalCountry(c.destinationCountry);
      // Merge coordinates
      if (needCoords) {
        setFormData(prev => ({
          ...prev,
          startLat: prev.startLat || c.startLat || prev.startLat,
          startLon: prev.startLon || c.startLon || prev.startLon,
          endLat: prev.endLat || c.endLat || prev.endLat,
          endLon: prev.endLon || c.endLon || prev.endLon,
        }));
      }
      // Merge totals
      if (needTotals && Array.isArray(c.products)) {
        const w = c.products.reduce((s,p)=>s + (Number(p.weightKg)||0), 0);
        const v = c.products.reduce((s,p)=>s + (Number(p.volumeM3)||0), 0);
        setFormData(prev => ({ ...prev, weight: prev.weight || w, volume: prev.volume || v }));
      }
    } catch {}
  }, [restoredRef.current, formData.startLat, formData.startLon, formData.endLat, formData.endLon, formData.weight, formData.volume, initialAddress, finalAddress, initialCountry, finalCountry]);

  // ### Address Geocoding Functions

  const handleInitialSearch = async () => {
    if (!initialAddress || !googleApiKey) {
      console.error("Initial address or Google API key is missing.");
      return;
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          initialAddress
        )}&key=${googleApiKey}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setFormData((prev) => ({
          ...prev,
          startLat: location.lat,
          startLon: location.lng,
        }));
        const countryComponent = data.results[0].address_components.find((comp) =>
          comp.types.includes("country")
        );
        setInitialCountry(countryComponent ? countryComponent.long_name : "");
      } else {
        alert("Address not found for Initial Position.");
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error);
    }
  };

  const handleFinalSearch = async () => {
    if (!finalAddress || !googleApiKey) {
      console.error("Final address or Google API key is missing.");
      return;
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          finalAddress
        )}&key=${googleApiKey}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setFormData((prev) => ({
          ...prev,
          endLat: location.lat,
          endLon: location.lng,
        }));
        const countryComponent = data.results[0].address_components.find((comp) =>
          comp.types.includes("country")
        );
        setFinalCountry(countryComponent ? countryComponent.long_name : "");
      } else {
        alert("Address not found for Final Position.");
      }
    } catch (error) {
      console.error("Error fetching geocode data:", error);
    }
  };

  // ### Form Submission Logic

  const weightsObj = formData.customWeights || { time: 0.25, cost: 0.25, emissions: 0.25, logisticsScore: 0.25 };
  const sumOfWeights = Object.values(weightsObj).reduce(
    (acc, val) => acc + val,
    0
  );
  const isSumValid = Math.abs(sumOfWeights - 1) < 0.0001;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const apiBase = (import.meta?.env?.VITE_API_BASE) || "http://localhost:3000";

    const dataToSend = {
      startLat: formData.startLat,
      startLon: formData.startLon,
      endLat: formData.endLat,
      endLon: formData.endLon,
      maxDays: formData.maxDays || null,
      optimizationType: formData.optimizationType,
      customWeights: formData.customWeights,
      weight: parseFloat(formData.weight),
      volume: parseFloat(formData.volume),
      initialCountry: initialCountry,
      finalCountry: finalCountry,
    };

    try {
      const response = await fetch(`${apiBase}/api/find-routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      if (result.status === "success") {
        setRoutes(result.routes);
      } else {
        alert(`Backend error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Failed to fetch routes: ${error.message}. Ensure the backend is running on http://localhost:5001.`);
    }
  };

  // ### Route Stops Calculation

  useEffect(() => {
    if (routes.length > 0) {
      const firstRoute = routes[0];
      const intermediateStops = firstRoute.path.slice(1, -1).filter(
        (point) => point !== firstRoute.path[firstRoute.path.length - 1]
      );

      const geocodePromises = intermediateStops.map((stop) =>
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            stop
          )}&key=${googleApiKey}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "OK" && data.results.length > 0) {
              const location = data.results[0].geometry.location;
              return { name: stop, lat: location.lat, lon: location.lng };
            } else {
              console.warn(`Geocode failed for ${stop}`);
              return null;
            }
          })
          .catch((error) => {
            console.error(`Error geocoding ${stop}:`, error);
            return null;
          })
      );

      Promise.all(geocodePromises).then((intermediateCoords) => {
        const filteredCoords = intermediateCoords.filter((coord) => coord !== null);
        const stops = [
          { name: initialAddress, lat: Number(formData.startLat), lon: Number(formData.startLon) },
          ...filteredCoords,
          { name: finalAddress, lat: Number(formData.endLat), lon: Number(formData.endLon) },
        ];
        setRouteStops(stops);
        console.log("Route Stops:", stops); // Verify data in console
      });
    }
  }, [
    routes,
    initialAddress,
    finalAddress,
    formData.startLat,
    formData.startLon,
    formData.endLat,
    formData.endLon,
  ]);

  // ### Map Bounds Adjustment Component

  const MapUpdater = ({ routeStops }) => {
    const map = useMap();
    useEffect(() => {
      if (routeStops.length > 0) {
        const bounds = routeStops.map((stop) => [Number(stop.lat), Number(stop.lon)]);
        console.log("Bounds:", bounds); // Debug coordinates
        map.fitBounds(bounds);
      }
    }, [routeStops, map]);
    return null;
  };

  const getTransportIcon = (mode) => {
    switch (mode) {
      case "land": return <Truck className="w-4 h-4" />;
      case "air": return <Plane className="w-4 h-4" />;
      case "sea": return <Ship className="w-4 h-4" />;
      default: return <Route className="w-4 h-4" />;
    }
  };

  // ### JSX Rendering

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-cyan-500/20 p-2 rounded-lg">
                <Package className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Shipment Details</h2>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Initial Position */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                    Initial Position
                  </h3>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300"
                    value={initialAddress}
                    onChange={(e) => setInitialAddress(e.target.value)}
                    placeholder="Enter initial address"
                  />
                  <button
                    type="button"
                    onClick={handleInitialSearch}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                {formData.startLat && formData.startLon && (
                  <div className="bg-slate-700/30 border border-slate-600/30 p-4 rounded-xl">
                    <div className="space-y-2 text-sm text-gray-300">
                      <p><span className="text-cyan-400">Latitude:</span> {formData.startLat}</p>
                      <p><span className="text-cyan-400">Longitude:</span> {formData.startLon}</p>
                      <p><span className="text-cyan-400">Country:</span> {initialCountry}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Final Position */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-500/20 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-lg font-medium bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                    Final Position
                  </h3>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300"
                    value={finalAddress}
                    onChange={(e) => setFinalAddress(e.target.value)}
                    placeholder="Enter final address"
                  />
                  <button
                    type="button"
                    onClick={handleFinalSearch}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                {formData.endLat && formData.endLon && (
                  <div className="bg-slate-700/30 border border-slate-600/30 p-4 rounded-xl">
                    <div className="space-y-2 text-sm text-gray-300">
                      <p><span className="text-cyan-400">Latitude:</span> {formData.endLat}</p>
                      <p><span className="text-cyan-400">Longitude:</span> {formData.endLon}</p>
                      <p><span className="text-cyan-400">Country:</span> {finalCountry}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Max Days */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Max Days (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300"
                  value={formData.maxDays}
                  onChange={(e) =>
                    setFormData({ ...formData, maxDays: e.target.value })
                  }
                />
              </div>

              {/* Optimization Type */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Preferred Optimization</h3>
                </div>
                <div className="space-y-3">
                  {["time", "cost", "emissions", "logisticsScore", "customWeights"].map(
                    (option) => (
                      <label key={option} className="flex items-center p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-600/30 transition-all duration-300 cursor-pointer">
                        <input
                          type="radio"
                          name="optimizationType"
                          value={option}
                          checked={formData.optimizationType === option}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              optimizationType: e.target.value,
                            })
                          }
                          className="text-cyan-400 focus:ring-cyan-500"
                        />
                        <span className="ml-3 capitalize text-gray-300">
                          {option.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Custom Weights */}
              {formData.optimizationType === "customWeights" && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-300">
                    Custom Weights (Sum must equal 1)
                  </h4>
                  <div className="space-y-3">
                    {Object.keys(formData.customWeights).map((weight) => (
                      <div key={weight}>
                        <label className="block text-sm font-medium text-gray-300 capitalize mb-2">
                          {weight.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300"
                          value={formData.customWeights[weight]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customWeights: {
                                ...formData.customWeights,
                                [weight]: parseFloat(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    ))}
                    <div className="bg-slate-700/30 border border-slate-600/30 p-4 rounded-xl">
                      <p className="text-sm text-gray-300">
                        Current sum: {sumOfWeights.toFixed(2)}
                      </p>
                      {!isSumValid && (
                        <p className="text-red-400 text-sm mt-1">
                          Sum of weights must equal 1
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Shipment Measurements */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-pink-500/20 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-pink-400" />
                  </div>
                  <h3 className="text-lg font-medium bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                    Shipment Measurements
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Volume (m³)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-cyan-500/50 text-white placeholder-gray-400 transition-all duration-300"
                      value={formData.volume}
                      onChange={(e) =>
                        setFormData({ ...formData, volume: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium"
                disabled={
                  (formData.optimizationType === "customWeights" && !isSumValid) ||
                  !formData.startLat ||
                  !formData.startLon ||
                  !formData.endLat ||
                  !formData.endLon ||
                  !formData.weight ||
                  !formData.volume
                }
              >
                Find Optimal Routes
              </button>
            </form>
          </div>

          {/* Map and Routes Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Map */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Route className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Route Visualization</h3>
              </div>
              <div className="h-[400px] rounded-xl overflow-hidden border border-slate-600/30">
                <MapContainer
                  center={routeStops.length > 0 ? [Number(routeStops[0].lat), Number(routeStops[0].lon)] : [51.505, -0.09]}
                  zoom={13}
                  className="h-full w-full"
                  style={{ filter: "invert(90%) hue-rotate(180deg)" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {routeStops.length > 0 ? (
                    <>
                      {routeStops.map((stop, index) => (
                        <Marker key={index} position={[Number(stop.lat), Number(stop.lon)]}>
                          <Popup>{stop.name}</Popup>
                        </Marker>
                      ))}
                      {routeStops.length > 1 && (
                        <Polyline
                          positions={routeStops.map((stop) => [Number(stop.lat), Number(stop.lon)])}
                          color="blue"
                          weight={4}
                          opacity={1}
                          dashArray="5, 10"
                        />
                      )}
                      <MapUpdater routeStops={routeStops} />
                    </>
                  ) : (
                    <>
                      {formData.startLat && formData.startLon && (
                        <Marker position={[Number(formData.startLat), Number(formData.startLon)]}>
                          <Popup>Start: {initialAddress}</Popup>
                        </Marker>
                      )}
                      {formData.endLat && formData.endLon && (
                        <Marker position={[Number(formData.endLat), Number(formData.endLon)]}>
                          <Popup>End: {finalAddress}</Popup>
                        </Marker>
                      )}
                    </>
                  )}
                </MapContainer>
              </div>
            </div>

            {/* Routes Results */}
            <div className="space-y-6">
              {routes.length > 0 ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-cyan-500/20 p-2 rounded-lg">
                      <Route className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Optimal Routes</h3>
                  </div>
                  {routes.map((route) => (
                    <div key={route.rank} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 pb-6 border-b border-slate-700/50">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                              Route {route.rank}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {route.modes.includes("land") && (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">
                                <Truck className="w-4 h-4" />
                                Land
                              </div>
                            )}
                            {route.modes.includes("air") && (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-pink-500/20 text-pink-500 border border-pink-500/30">
                                <Plane className="w-4 h-4" />
                                Air
                              </div>
                            )}
                            {route.modes.includes("sea") && (
                              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-green-400/20 text-green-400 border border-green-400/30">
                                <Ship className="w-4 h-4" />
                                Sea
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col lg:items-end space-y-3">
                          <div className="flex flex-col lg:items-end space-y-2">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-5 h-5 text-green-400" />
                              <span className="text-lg font-medium text-green-400">
                                ${route.cost.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-blue-400" />
                              <span className="text-lg font-medium text-blue-400">
                                {route.time_days} days
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const homeState = {
                                formData,
                                initialAddress,
                                finalAddress,
                                initialCountry,
                                finalCountry,
                                routes,
                                hasSubmitted,
                                routeStops,
                              };
                              navigate(`/route/${route.rank}`, { state: { route, homeState } });
                            }}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>

                      {/* Route Path */}
                      <div className="mt-6 bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <Route className="w-5 h-5 text-cyan-400" />
                          <h4 className="text-lg font-bold text-white">Route Path</h4>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed">
                          {[
                            initialAddress,
                            ...(route.path
                              .slice(1, -1)
                              .filter((point) => point !== route.path[route.path.length - 1])),
                            finalAddress,
                          ].join(" → ")}
                        </p>
                      </div>

                      {/* Carbon Footprint */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-green-400" />
                            <span className="text-gray-300 font-medium">Carbon Footprint</span>
                          </div>
                          <span className="text-green-400 font-bold">{route.emissions} kg CO₂</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(route.emissions / 10, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Cost Breakdown */}
                        <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <DollarSign className="w-5 h-5 text-green-400" />
                            <h4 className="text-lg font-medium text-white">Cost Breakdown</h4>
                          </div>
                          <div className="space-y-3">
                            {Object.entries(route.cost_breakdown).map(([segment, cost]) => (
                              <div
                                key={segment}
                                className="flex justify-between items-center py-2 border-b border-slate-600/30 last:border-b-0"
                              >
                                <span className="text-gray-300">{segment}</span>
                                <span className="text-green-400 font-medium">${cost.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Time Breakdown */}
                        <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl">
                          <div className="flex items-center gap-3 mb-4">
                            <Clock className="w-5 h-5 text-blue-400" />
                            <h4 className="text-lg font-medium text-white">Time Breakdown</h4>
                          </div>
                          <div className="space-y-3">
                            {Object.entries(route.time_breakdown).map(([segment, time]) => (
                              <div
                                key={segment}
                                className="flex justify-between items-center py-2 border-b border-slate-600/30 last:border-b-0"
                              >
                                <span className="text-gray-300">{segment}</span>
                                <span className="text-blue-400 font-medium">{time} days</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : hasSubmitted ? (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl text-center">
                  <div className="bg-yellow-400/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Route className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Routes Found</h3>
                  <p className="text-gray-400">We couldn't find any routes matching your criteria. Please try adjusting your parameters.</p>
                </div>
              ) : (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl text-center">
                  <div className="bg-blue-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Route className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Ready to Find Routes</h3>
                  <p className="text-gray-400">Fill out the shipment details form and click "Find Optimal Routes" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;