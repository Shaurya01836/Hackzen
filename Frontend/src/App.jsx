import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
// import other pages as needed

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Add other routes like:
      <Route path="/dashboard" element={<Dashboard />} />
      */}
    </Routes>
  );
}

export default App;
