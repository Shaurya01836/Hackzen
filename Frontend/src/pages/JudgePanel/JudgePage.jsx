"use client"

import * as React from "react"
import {
  BarChart3,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Star,
  Bell,
  LogOut,
  Search
} from "lucide-react"

import { Badge } from "../../components/CommonUI/badge"
import { Button } from "../../components/CommonUI/button"
import { Separator } from "../../components/CommonUI/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from "../../components/DashboardUI/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../components/AdminUI/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/DashboardUI/avatar"

// Import individual section components
import { DashboardSection } from "./sections/DashboardSection"
import { SubmissionsSection } from "./sections/SubmissionsSection"
import { ReviewSection } from "./sections/ReviewSection"
import { ScoresSection } from "./sections/ScoresSection"
import { GuidelinesSection } from "./sections/GuidelinesSection"
import { AnnouncementsSection } from "./sections/AnnouncementsSection"
import { ChatSection } from "./sections/ChatSection"
import { ProfileSection } from "./sections/ProfileSection"

const sidebarData = {
  navigation: [
    {
      title: "Dashboard",
      icon: Home,
      url: "#dashboard",
      isActive: true
    },
    {
      title: "Submissions",
      icon: FileText,
      url: "#submissions",
      badge: "12"
    },
    {
      title: "Review Projects",
      icon: Star,
      url: "#review"
    },
    {
      title: "My Scores",
      icon: BarChart3,
      url: "#scores"
    },
    {
      title: "Guidelines",
      icon: FileText,
      url: "#guidelines"
    },
    {
      title: "Live Announcements",
      icon: Bell,
      url: "#announcements",
      badge: "3"
    },
    {
      title: "Judge Chat",
      icon: MessageSquare,
      url: "#chat"
    },
    {
      title: "Profile",
      icon: Settings,
      url: "#profile"
    }
  ]
}

export default function HackZenDashboard() {
  const [activeSection, setActiveSection] = React.useState("dashboard")

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />
      case "submissions":
        return <SubmissionsSection />
      case "review":
        return <ReviewSection />
      case "scores":
        return <ScoresSection />
      case "guidelines":
        return <GuidelinesSection />
      case "announcements":
        return <AnnouncementsSection />
      case "chat":
        return <ChatSection />
      case "profile":
        return <ProfileSection />
      default:
        return <DashboardSection />
    }
  }

  const getSectionTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      submissions: "Submissions",
      review: "Review Projects",
      scores: "My Scores",
      guidelines: "Guidelines",
      announcements: "Live Announcements",
      chat: "Judge Chat",
      profile: "Profile"
    }
    return titles[activeSection] || "Dashboard"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <SidebarProvider>
        <Sidebar className="border-r border-gray-200/60 backdrop-blur-sm bg-white/80">
          <SidebarHeader className="border-b border-gray-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white font-bold text-xl shadow-lg">
                H
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HackZen
                </h2>
                <p className="text-sm text-gray-500 font-medium">
                  Judge Portal
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {sidebarData.navigation.map(item => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={activeSection === item.url.replace("#", "")}
                        className="group relative overflow-hidden rounded-xl transition-all duration-200 hover:shadow-md"
                        onClick={() =>
                          setActiveSection(item.url.replace("#", ""))
                        }
                      >
                        <a
                          href={item.url}
                          className="flex items-center gap-3 px-4 py-3"
                        >
                          <div
                            className={`p-1.5 rounded-lg transition-colors ${
                              activeSection === item.url.replace("#", "")
                                ? "bg-white/20"
                                : "group-hover:bg-blue-50"
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-sm"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          {/* Enhanced Top Header */}
          <header className="flex h-20 shrink-0 items-center justify-between border-b border-gray-200/60 px-8 backdrop-blur-sm bg-white/80">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1 hover:bg-blue-50 rounded-lg transition-colors" />
              <Separator orientation="vertical" className="mr-2 h-6" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {getSectionTitle()}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {activeSection === "dashboard" &&
                    "Overview of your judging activities"}
                  {activeSection === "submissions" &&
                    "Manage project submissions"}
                  {activeSection === "review" && "Evaluate hackathon projects"}
                  {activeSection === "scores" && "Track your scoring history"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="pl-10 pr-4 py-2 w-64 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-blue-50 rounded-xl"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 hover:bg-blue-50 rounded-xl px-4 py-2"
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        JS
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="font-semibold text-gray-900">
                        Dr. Jane Smith
                      </div>
                      <div className="text-xs text-gray-500">Senior Judge</div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl shadow-lg border-gray-200/60"
                >
                  <DropdownMenuItem className="rounded-lg">
                    <Settings className="mr-3 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg text-red-600 focus:text-red-600">
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Enhanced Main Content */}
          <main className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto">{renderActiveSection()}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
