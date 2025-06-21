"use client"

import { cn } from "./lib/utils"
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
} from "lucide-react"

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
]

export function Sidebar({ activeSection, setActiveSection }) {
  return (
    <div className="w-64 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 border-r border-purple-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-purple-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">HZ</span>
          </div>
          <span className="text-gray-800 font-bold text-xl">HackZen</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-300 shadow-sm"
                  : "text-gray-600 hover:text-purple-700 hover:bg-purple-100/50",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isActive
                    ? "text-purple-500"
                    : "group-hover:text-purple-500",
                )}
              />
              <span className="font-medium">{item.label}</span>
              {isActive && <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full animate-pulse" />}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
