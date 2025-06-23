"use client";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // adjust path if needed
import { cn } from "../../../lib/utils";
import {
  LayoutDashboard,
  Users,
  Flag,
  Code,
  MessageSquare,
  Megaphone,
  Briefcase,
  BarChart3,
  Coins,
  Settings,
  AlertTriangle,
  Inbox,
  CircleArrowOutDownLeft,
  LogOut,
} from "lucide-react";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users Management", icon: Users },
  { id: "hackathons", label: "Hackathons", icon: Flag },
  { id: "submissions", label: "Submissions", icon: Code },
  { id: "mentors", label: "Mentor & Chat Logs", icon: MessageSquare },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "organizers", label: "Organizer Requests", icon: Briefcase },
  { id: "analytics", label: "Reports & Analytics", icon: BarChart3 },
  { id: "revenue", label: "Revenue & Ads", icon: Coins },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "flagged", label: "Flagged Content", icon: AlertTriangle },
  { id: "support", label: "Support Inbox", icon: Inbox },
];

export function Sidebar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await fetch("http://localhost:3000/api/users/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="w-64 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 border-r border-purple-200 flex flex-col justify-between">
      {/* Top Section */}
      <div className="p-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HackZen</h1>
              <p className="text-sm text-gray-500">Hackathon Platform</p>
            </div>
          </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-blue-600" : "text-gray-500"
                  )}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Buttons */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] hover:bg-black transition w-full"
        >
          <CircleArrowOutDownLeft className="w-5 h-5 text-white" />
          <span className="text-sm font-medium text-white">Back to Home Page</span>
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-red-600 hover:bg-red-700 transition w-full"
        >
          <LogOut className="w-5 h-5 text-white" />
          <span className="text-sm font-medium text-white">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
