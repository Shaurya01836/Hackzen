"use client";

import { useState } from "react";
import {
  Users,
  Trophy,
  MessageSquare,
  User,
  Plus,
  BarChart3,
  FileText,
  Settings,
  Github,
  Youtube,
  Award,
  TrendingUp,
  Eye,
  CheckCircle,
  Search,
} from "lucide-react";

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
} from "../AdimPage/components/ui/sidebar";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../AdimPage/components/ui/avatar";

import { Separator } from "../AdimPage/components/ui/separator";
import { Button } from "../AdimPage/components/ui/button";
import { Progress } from "../AdimPage/components/ui/progress";

// Sections
import { ProfileSection } from "./ProfileSection";
import { MyHackathons } from "./sections/Myhackthon";
import { MySubmissions } from "./sections/MySubmissions";
import { ChatRooms } from "./sections/Chat-rooms";
import { MyPortfolio } from "./sections/Myportfolio";
import { CreatedHackathons } from "./sections/Created-hackathons";
import { ParticipantOverview } from "./sections/ParticipantOverview";
import { ReviewSubmissions } from "./sections/ReviewSubmissions";
import { Announcements } from "./sections/Announcements";
import { OrganizerTools } from "./sections/OrganizerTools";
import { ExploreHackathons } from "./sections/ExploreHackathon";
import { CreateHackathon } from "./sections/Create-hackathon";

export default function HackZenDashboard() {
  const [currentView, setCurrentView] = useState("dashboard");

  const participantMenuItems = [
    {
      title: "My Hackathons",
      icon: Trophy,
      key: "my-hackathons",
      onClick: () => setCurrentView("my-hackathons"),
    },
    {
      title: "My Submissions",
      icon: FileText,
      key: "my-submissions",
      onClick: () => setCurrentView("my-submissions"),
    },
    {
      title: "Chat Rooms",
      icon: MessageSquare,
      key: "chat-rooms",
      onClick: () => setCurrentView("chat-rooms"),
    },
    {
      title: "My Portfolio",
      icon: User,
      key: "my-portfolio",
      onClick: () => setCurrentView("my-portfolio"),
    },
    {
      title: "Explore Hackathons",
      icon: Search,
      key: "explore-hackathons",
      onClick: () => setCurrentView("explore-hackathons"),
    },
  ];

  const organizerMenuItems = [
    {
      title: "Created Hackathons",
      icon: Plus,
      key: "created-hackathons",
      onClick: () => setCurrentView("created-hackathons"),
    },
    {
      title: "Participant Overview",
      icon: Users,
      key: "participant-overview",
      onClick: () => setCurrentView("participant-overview"),
    },
    {
      title: "Review Submissions",
      icon: Eye,
      key: "review-submissions",
      onClick: () => setCurrentView("review-submissions"),
    },
    {
      title: "Announcements",
      icon: MessageSquare,
      key: "announcements",
      onClick: () => setCurrentView("announcements"),
    },
    {
      title: "Organizer Tools",
      icon: Settings,
      key: "organizer-tools",
      onClick: () => setCurrentView("organizer-tools"),
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HackZen</h1>
              <p className="text-sm text-gray-500">Hackathon Platform</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Profile Completion
              </span>
              <span className="text-sm text-gray-500">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-indigo-600">
              <User className="w-4 h-4" />
              Participant Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {participantMenuItems.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentView === item.key}
                      className="hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <button
                        onClick={item.onClick}
                        className="flex items-center gap-3 w-full text-left"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-purple-600">
              <Settings className="w-4 h-4" />
              Organizer Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {organizerMenuItems.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentView === item.key}
                      className="hover:bg-purple-50 hover:text-purple-700"
                    >
                      <button
                        onClick={item.onClick}
                        className="flex items-center gap-3 w-full text-left"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
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
        ) : currentView === "my-portfolio" ? (
          <MyPortfolio onBack={() => setCurrentView("dashboard")} />
        ) : currentView === "explore-hackathons" ? (
          <ExploreHackathons onBack={() => setCurrentView("dashboard")} />
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
        ) : null}
      </SidebarInset>
    </SidebarProvider>
  );
}
