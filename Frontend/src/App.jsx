import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Home/LandingPage";
import NotFound from "./pages/Notfound";
import Page from "./pages/AdminDashboard/AdminPanel";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DashboardPage from "./pages/mainDashboard/Page";
// import Dashboard from "./pages/Dashboard/mainDashboard/Dashbord";
// import other pages as needed
import OAuthSuccess from "./pages/OAuthSuccess"; // ✅ Import the new OAuthSuccess page
import Loader from "./pages/Loader";
import About from "./pages/Home/About";
function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<Page />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/loader" element={<Loader />} />
    </Routes>
  );
}

export default App;
