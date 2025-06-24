"use client"
"use client"

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import axios from "axios";

import {
  Users,
  CircleArrowOutDownLeft,
  Trophy,
  MessageSquare,
  User,
  Plus,
  LogOut,
  FileText,
  Settings,
  Eye,
  Search,
  Archive,
  Building,
  UsersRoundIcon,
  NotebookTabs,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/DashboardUI/sidebar";

import SignOutModal from "../../components/SignOutModal";
import { useAuth } from "../../context/AuthContext";
// Sections
import { ProfileSection } from "./ProfileSection";
import { MyHackathons } from "./sections/Myhackthon";
import { MySubmissions } from "./sections/MySubmissions";
import { ChatRooms } from "./sections/Chat-rooms";
import { CreatedHackathons } from "./sections/Created-hackathons";
import { ParticipantOverview } from "./sections/ParticipantOverview";
import { ReviewSubmissions } from "./sections/ReviewSubmissions";
import { Announcements } from "./sections/Announcements";
import { OrganizerTools } from "./sections/OrganizerTools";
import { ExploreHackathons } from "./sections/ExploreHackathon";
import { CreateHackathon } from "./sections/Create-hackathon";
import { OrganizationHub } from "./sections/OrganizationHub";


import { Blogs } from "./sections/Blogs"
import { ProjectArchive } from "./sections/ProjectArchive"

export default function HackZenDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const initialView = queryParams.get("view") || "dashboard"

  const [currentView, setCurrentView] = useState(initialView)
  const [showModal, setShowModal] = useState(false)

  const { logout, user } = useAuth();

  const changeView = (viewKey) => {
    setCurrentView(viewKey)
    navigate(`?view=${viewKey}`)
  }

  const handleSignOut = async () => {
    try {
      await fetch("http://localhost:3000/api/users/logout", {
        method: "GET",
        credentials: "include",
      })
    } catch (err) {
      console.error("Logout failed:", err)
    } finally {
      logout()
      navigate("/")
    }
  }

  const participantMenuItems = [
    {
      title: "My Hackathons",
      icon: Trophy,
      key: "my-hackathons",
      onClick: () => changeView("my-hackathons"),
    },
    {
      title: "My Submissions",
      icon: FileText,
      key: "my-submissions",
      onClick: () => changeView("my-submissions"),
    },

    {
      title: "Explore Hackathons",
      icon: Search,
      key: "explore-hackathons",
      onClick: () => changeView("explore-hackathons"),
    },
    {
      title: "My Community",
      icon: UsersRoundIcon,
      key: "my-community",
      onClick: () => changeView("my-community"),
    },
    // {
    //   title: "Chat Rooms",
    //   icon: MessageSquare,
    //   key: "chat-rooms",
    //   onClick: () => changeView("chat-rooms"),
    // },

    {
      title: "Blogs",
      icon: NotebookTabs,
      key: "blogs",
      onClick: () => changeView("blogs"),
    },
    {
      title: "Project Archive",
      icon: Archive,
      key: "project-archive",
      onClick: () => changeView("project-archive"),
    },

    {
      title: "Organization Hub",
      icon: Building,
      key: "Organization-hub",
      onClick: () => changeView("Organization-hub"),
    },
  ]

  const organizerMenuItems = [
    {
      title: "Created Hackathons",
      icon: Plus,
      key: "created-hackathons",
      onClick: () => changeView("created-hackathons"),
    },
    {
      title: "Participant Overview",
      icon: Users,
      key: "participant-overview",
      onClick: () => changeView("participant-overview"),
    },
    {
      title: "Review Submissions",
      icon: Eye,
      key: "review-submissions",
      onClick: () => changeView("review-submissions"),
    },
    {
      title: "Announcements",
      icon: MessageSquare,
      key: "announcements",
      onClick: () => changeView("announcements"),
    },
    {
      title: "Organizer Tools",
      icon: Settings,
      key: "organizer-tools",
      onClick: () => changeView("organizer-tools"),
    },
  ]

    useEffect(() => {
    const pingStreak = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        await axios.get("http://localhost:3000/api/users/track", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn("📉 Failed to track streak:", err.message);
      }
    };

    pingStreak();
  }, []);

  
  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HackZen</h1>
              <p className="text-sm text-gray-500">Hackathon Platform</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-3 text-indigo-600">
              <User className="w-4 h-4" />
              Participant Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {participantMenuItems.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={item.onClick}
                        className={cn(
                          "flex items-center gap-3 w-full text-left rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                          currentView === item.key
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700",
                        )}
                      >
                        <item.icon
                          className={cn("w-4 h-4", currentView === item.key ? "text-indigo-700" : "text-gray-500")}
                        />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          
          {user?.role !== "participant" && (
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-purple-600">
                <Settings className="w-4 h-4" />
                Organizer Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {organizerMenuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={item.onClick}
                          className={cn(
                            "flex items-center gap-3 w-full text-left rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                            currentView === item.key
                              ? "bg-indigo-100 text-indigo-700"
                              : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "w-4 h-4",
                              currentView === item.key
                                ? "text-indigo-700"
                                : "text-gray-500"
                            )}
                          />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="p-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] hover:bg-black transition"
          >
            <CircleArrowOutDownLeft className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">Back to Home Page</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut className="w-5 h-5 text-white" />
            <span className="text-sm font-medium text-white">Sign Out</span>
          </button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {currentView === "dashboard" ? (
          <ProfileSection
            userName="John Doe"
            userEmail="john@example.com"
            userAvatar="/placeholder.svg?height=96&width=96"
            onBack={() => setCurrentView("dashboard")}
          />
        ) : currentView === "my-hackathons" ? (
          <MyHackathons onBack={() => setCurrentView("dashboard")} />
        ) : currentView === "my-submissions" ? (
          <MySubmissions onBack={() => setCurrentView("dashboard")} />
        ) : currentView === "chat-rooms" ? (
          <ChatRooms onBack={() => setCurrentView("dashboard")} />
        ) : currentView === "explore-hackathons" ? (
          <ExploreHackathons onBack={() => setCurrentView("dashboard")} />
          
        ) : currentView === "Organization-hub" ? (
          <OrganizationHub onBack={() => setCurrentView("dashboard")} />
          
        ) : currentView === "created-hackathons" ? (
          <CreatedHackathons
            onBack={() => setCurrentView("dashboard")}
            onCreateNew={() => setCurrentView("create-hackathon")}
          />
        ) : currentView === "participant-overview" ? (
          <ParticipantOverview onBack={() => setCurrentView("dashboard")} />
        ) : currentView === "review-submissions" ? (
          <ReviewSubmissions onBack={() => setCurrentView("dashboard")} />
        ) : currentView === "announcements" ? (
          <Announcements onBack={() => setCurrentView("dashboard")} />
        ) : currentView === "organizer-tools" ? (
          <OrganizerTools onBack={() => setCurrentView("dashboard")} />
        ) : currentView === "create-hackathon" ? (
          <CreateHackathon onBack={() => setCurrentView("created-hackathons")} />
        ) : currentView === "blogs" ? (
          <Blogs onBack={() => setCurrentView("dashboard")} />
        ) : currentView === "project-archive" ? (
          <ProjectArchive onBack={() => setCurrentView("dashboard")} />
        ) : null}
      </SidebarInset>
      <SignOutModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleSignOut} />
    </SidebarProvider>
  )
}
