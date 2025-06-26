"use client";
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
  HandHelpingIcon,
  NotebookIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BlogManage } from "./BlogsRequest";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users Management", icon: Users },
  { id: "hackathons", label: "Hackathons", icon: Flag },
  { id: "submissions", label: "Submissions", icon: Code },
  { id: "hackathonRequest", label: "Hackathon Requests", icon: HandHelpingIcon },
  { id: "mentors", label: "Mentor & Chat Logs", icon: MessageSquare },
  {id: "blogs", label: "Blogs Requests", icon: NotebookIcon },
  { id: "announcements", label: "Announcements", icon: Megaphone },
  { id: "organizers", label: "Organizer Requests", icon: Briefcase },
  { id: "analytics", label: "Reports & Analytics", icon: BarChart3 },
  { id: "revenue", label: "Revenue & Ads", icon: Coins },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "flagged", label: "Flagged Content", icon: AlertTriangle },
  { id: "support", label: "Support Inbox", icon: Inbox },
];

export function Sidebar({ activeSection, setActiveSection }) {
  return (
    <div className="w-64 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 border-r border-purple-200 flex flex-col justify-between">
      {/* Top Section */}
      <div className="p-4">
        {/* Logo with link to home */}
        <Link to="/" className="flex items-center gap-4 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">HackZen</h1>
            <p className="text-sm text-gray-500">Hackathon Platform</p>
          </div>
        </Link>
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
    </div>
  );
}
