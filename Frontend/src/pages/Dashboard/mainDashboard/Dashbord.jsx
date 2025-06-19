"use client";

import { useState } from "react";
import {
  Users, Trophy, MessageSquare, User, Plus, BarChart3, FileText, Settings,
  Github, Youtube, Award, TrendingUp, Eye, CheckCircle, Search
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger
} from "../AdimPage/components/ui/sidebar";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "../AdimPage/components/ui/card";
import { Button } from "../AdimPage/components/ui/button";
import { Badge } from "../AdimPage/components/ui/badge";
import { Progress } from "../AdimPage/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../AdimPage/components/ui/avatar";
import { Separator } from "../AdimPage/components/ui/separator";
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
import { useAuth } from "../../../context/AuthContext"; // ✅ new

export default function HackZenDashboard() {
  const [activeRole, setActiveRole] = useState("participant");
  const [currentView, setCurrentView] = useState("dashboard");
  const { user } = useAuth(); // ✅ get user

  const participantMenuItems = [
    { title: "My Hackathons", icon: Trophy, onClick: () => setCurrentView("my-hackathons"), key: "my-hackathons" },
    { title: "My Submissions", icon: FileText, onClick: () => setCurrentView("my-submissions"), key: "my-submissions" },
    { title: "Chat Rooms", icon: MessageSquare, onClick: () => setCurrentView("chat-rooms"), key: "chat-rooms" },
    { title: "My Portfolio", icon: User, onClick: () => setCurrentView("my-portfolio"), key: "my-portfolio" },
    { title: "Explore Hackathons", icon: Search, onClick: () => setCurrentView("explore-hackathons"), key: "explore-hackathons" },
  ];

  const organizerMenuItems = [
    { title: "Created Hackathons", icon: Plus, onClick: () => setCurrentView("created-hackathons"), key: "created-hackathons" },
    { title: "Participant Overview", icon: Users, onClick: () => setCurrentView("participant-overview"), key: "participant-overview" },
    { title: "Review Submissions", icon: Eye, onClick: () => setCurrentView("review-submissions"), key: "review-submissions" },
    { title: "Announcements", icon: MessageSquare, onClick: () => setCurrentView("announcements"), key: "announcements" },
    { title: "Organizer Tools", icon: Settings, onClick: () => setCurrentView("organizer-tools"), key: "organizer-tools" },
  ];

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
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
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-indigo-600">
              <User className="w-4 h-4" /> Participant Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {participantMenuItems.map(item => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentView === item.key}
                    >
                      <button onClick={item.onClick} className="flex items-center gap-3 w-full text-left">
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
              <Settings className="w-4 h-4" /> Organizer Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {organizerMenuItems.map(item => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentView === item.key}
                    >
                      <button onClick={item.onClick} className="flex items-center gap-3 w-full text-left">
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
          <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
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
          <div className="p-6 text-lg">Welcome to HackZen 👋</div>
        ) : currentView === "chat-rooms" ? (
        <ChatRooms hackathonId="6852e6fbb2749d8c2b9a8f2f" />
        ) : currentView === "my-hackathons" ? (
          <MyHackathons onBack={() => setCurrentView("dashboard")} />
        ) : currentView === "my-submissions" ? (
          <MySubmissions onBack={() => setCurrentView("dashboard")} />
        ) : currentView === "my-portfolio" ? (
          <MyPortfolio onBack={() => setCurrentView("dashboard")} />
        ) : currentView === "explore-hackathons" ? (
          <ExploreHackathons onBack={() => setCurrentView("dashboard")} />
        ) : currentView === "created-hackathons" ? (
          <CreatedHackathons onBack={() => setCurrentView("dashboard")} />
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
        ) : currentView === "profile" ? (
          <ProfileSection
            userName="John Doe"
            userEmail="john@example.com"
            userAvatar="/placeholder.svg"
            onBack={() => setCurrentView("dashboard")}
          />
        ) : null}
      </SidebarInset>
    </SidebarProvider>
  );
}
