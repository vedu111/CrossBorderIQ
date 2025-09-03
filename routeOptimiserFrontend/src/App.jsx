import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import RouteDetails from "./pages/RouteDetails";
import Compliance from "./pages/Compliance";
import Landing from "./pages/Landing";
import Receipt from "./pages/Receipt";
import RouteLoader from "./components/RouteLoader";
import PrintableReceipt from "./pages/PrintableReceipt";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/printable-receipt" element={<PrintableReceipt />} />

        <Route
          path="*"
          element={
            <div className="min-h-screen bg-black text-gray-100">
              <Navbar />
              <RouteLoader>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/compliance" element={<Compliance />} />
                  <Route path="/plan" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/route/:rank" element={<RouteDetails />} />
                  <Route path="/receipt" element={<Receipt />} />
                </Routes>
              </RouteLoader>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
