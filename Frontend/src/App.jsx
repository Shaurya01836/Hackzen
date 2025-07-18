import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/Home/LandingPage";
import NotFound from "./pages/Notfound";
import Page from "./pages/AdminDashboard/AdminPanel";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CompleteProfile from "./pages/Auth/CompleteProfile";
import DashboardPage from "./pages/mainDashboard/Page";
import OAuthSuccess from "./pages/OAuthSuccess";
import Loader from "./pages/Loader";
import About from "./pages/Home/About";
import HackathonDetailsPage from "./pages/AdminDashboard/sections/HackathonDetailsPage";
import { ExploreHackathons } from "./pages/mainDashboard/sections/ExploreHackathon";
import AdminPanel from "./pages/AdminDashboard/AdminPanel";
import { ProfileSection } from "./pages/mainDashboard/ProfileSection";
import { Blogs } from "./pages/mainDashboard/sections/Blogs";
import InviteAccept from "./pages/InviteAccept";
import InviteRole from "./pages/InviteRole";
// import { MyHackathons } from "./pages/mainDashboard/sections/Myhackthon";
import { HackathonDetails } from "./pages/mainDashboard/sections/HackathonDetails";
import JudgePanel from "./pages/mainDashboard/sections/JudgePanel";
import { ProjectArchive } from "./pages/mainDashboard/sections/ProjectArchive";
import CreatedHackathons from "./pages/mainDashboard/sections/Created-hackathons";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Landing and auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/about" element={<About />} />
        <Route path="/loader" element={<Loader />} />

        {/* Admin */}
        <Route
          path="/admin/hackathons/:id"
          element={<HackathonDetailsPage />}
        />
        <Route path="/admin/:section" element={<AdminPanel />} />
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route
          path="/dashboard/project-archive/:id"
          element={<DashboardPage />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard/profile" replace />}
        />
        <Route path="/dashboard/:section" element={<DashboardPage />} />
        <Route
          path="/dashboard/hackathon/:id"
          element={<HackathonDetailsPage />}
        />
        <Route path="/dashboard/blogs/:id" element={<DashboardPage />} />
        <Route path="/dashboard/my-hackathons" element={<DashboardPage />} />
        <Route
          path="/dashboard/my-hackathons/:projectId"
          element={<DashboardPage />}
        />
        <Route
          path="/dashboard/my-submissions/:projectId"
          element={<DashboardPage />}
        />

        {/* Created Hackathons */}
        <Route path="/dashboard/created-hackathons" element={<DashboardPage />} />
        <Route path="/dashboard/created-hackathons/:hackathonId" element={<DashboardPage/>} />

        {/* Explore */}
        <Route path="/explore" element={<ExploreHackathons />} />
        <Route path="/explore/:id" element={<HackathonDetailsPage />} />

        {/* Profile */}
        <Route path="/dashboard/profile" element={<DashboardPage />} />
        <Route path="/dashboard/profile/edit" element={<DashboardPage />} />
        <Route
          path="/dashboard/profile/account-settings"
          element={<DashboardPage />}
        />
        <Route
          path="/dashboard/profile/privacy-security"
          element={<DashboardPage />}
        />
        <Route
          path="/dashboard/profile/help-support"
          element={<DashboardPage />}
        />
        <Route path="/invite/:inviteId" element={<InviteAccept />} />
        <Route path="/invite/role" element={<InviteRole />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />

        <Route path="/judge" element={<JudgePanel />} />
      </Routes>
    </>
  );
}

export default App;
