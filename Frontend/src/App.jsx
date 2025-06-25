import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/Home/LandingPage";
import NotFound from "./pages/Notfound";
import Page from "./pages/AdminDashboard/AdminPanel";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DashboardPage from "./pages/mainDashboard/Page";
import OAuthSuccess from "./pages/OAuthSuccess";
import Loader from "./pages/Loader";
import About from "./pages/Home/About";
import HackathonDetailsPage from "./pages/AdminDashboard/sections/HackathonDetailsPage";
import { ExploreHackathons } from "./pages/mainDashboard/sections/ExploreHackathon";
import AdminPanel from "./pages/AdminDashboard/AdminPanel";

function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<Page />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/hackathons/:id" element={<HackathonDetailsPage />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/loader" element={<Loader />} />
      <Route path="/explore" element={<ExploreHackathons />} />
      <Route path="/dashboard/hackathon/:id" element={<DashboardPage />} />

      {/* Redirect root to admin dashboard */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Admin routes - all admin sections use the same component */}
      <Route path="/admin/:section" element={<AdminPanel />} />

      {/* Fallback for /admin without section */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />

      {/* Catch all other routes */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

export default App;
