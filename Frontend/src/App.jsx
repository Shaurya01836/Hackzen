import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Home/LandingPage";
import NotFound from "./pages/Notfound";
import Page from "./pages/AdminDashboard/AdminPanel";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DashboardPage from "./pages/mainDashboard/Page";
import OAuthSuccess from "./pages/OAuthSuccess";
import Loader from "./pages/Loader";
import About from "./pages/Home/About";
import { ExploreHackathons } from "./pages/mainDashboard/sections/ExploreHackathon";

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
      <Route path="/explore" element={<ExploreHackathons />} />
       <Route path="/dashboard/hackathon/:id" element={<DashboardPage/>} />
    </Routes>
  );
}

export default App;
