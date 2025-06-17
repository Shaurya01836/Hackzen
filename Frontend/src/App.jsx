import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/Notfound";
import Page from "./pages/Dashboard/AdimPage/AdminPanel";
// import other pages as needed

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/admin" element={<Page />} />
      {/* Add other routes like:
      <Route path="/dashboard" element={<Dashboard />} />
      */}
    </Routes>
  );
}

export default App;
