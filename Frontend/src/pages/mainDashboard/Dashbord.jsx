"use client";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  Users,
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
  Wrench,
  PencilRulerIcon,
  Fuel,
  CalendarX,
  Gavel,
  ShieldCheck,
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
} from "../../components/DashboardUI/sidebar";

import { useAuth } from "../../context/AuthContext";
// Sections
import { ProfileSection } from "./ProfileSection";
import { MySubmissions } from "./sections/MySubmissions";
import { CreatedHackathons } from "./sections/Created-hackathons";
import { Announcements } from "./sections/Announcements";
import { OrganizerTools } from "./sections/OrganizerTools";
import { ExploreHackathons } from "./sections/ExploreHackathon";
import CreateHackathon from "./sections/Create-hackathon";
import { OrganizationHub } from "./sections/OrganizationHub";
import { Blogs } from "./sections/Blogs";
import { ProjectArchive } from "./sections/ProjectArchive";
import MyHackathon from "./sections/Myhackthon";
import JudgePanel from "../JudgePanel/JudgePage";
import DashboardJudgePanel from "./sections/JudgePanel";
import CertificatesPage from "./sections/CertificatePage";

export default function HackZenDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  // Extract the active section from the current URL path
  const getActiveSectionFromPath = () => {
    const path = location.pathname;
    // Extract section from /dashboard/section pattern
    const match = path.match(/^\/dashboard\/([^/]+)/);
    return match ? match[1] : "profile";
  };

  const [currentView, setCurrentView] = useState(getActiveSectionFromPath());

  const { user, refreshUser } = useAuth();

  // Debug: Log user role for troubleshooting
  console.log("Dashboard - Current user:", user);
  console.log("Dashboard - User role:", user?.role);

  // Function to handle section changes with nested URLs
  const changeView = (viewKey) => {
    setCurrentView(viewKey);
    navigate(`/dashboard/${viewKey}`);
  };

  // Function to navigate to home page
  const navigateToHome = () => {
    navigate("/");
  };

  // Set default route on component mount
  useEffect(() => {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/dashboard/"
    ) {
      navigate("/dashboard/profile", { replace: true });
    }
    // Update currentView when URL changes
    setCurrentView(getActiveSectionFromPath());
  }, [location.pathname, navigate, params.section]);

  const participantMenuItems = [
    {
      title: "Profile",
      icon: User,
      key: "profile",
      onClick: () => changeView("profile"),
    },
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
      key: "organization-hub",
      onClick: () => changeView("organization-hub"),
    },
  ];

  const organizerMenuItems = [
    {
      title: "Organizer Tools",
      icon: Settings,
      key: "organizer-tools",
      onClick: () => changeView("organizer-tools"),
    },
    {
      title: "Hackathons",
      icon: CalendarX,
      key: "created-hackathons", // ✅ keep this
      onClick: () => changeView("created-hackathons"),
    },

    {
      title: "Create Hackathons",
      icon: PencilRulerIcon,
      key: "create-hackathon", // ✅ FIX this key!
      onClick: () => changeView("create-hackathon"),
    },

    {
      title: "Announcements",
      icon: MessageSquare,
      key: "announcements",
      onClick: () => changeView("announcements"),
    },
    {
      title: "Certificate Page",
      icon: ShieldCheck,
      key: "certificate-page",
      onClick: () => changeView("certificate-page"),
    },
  ];

  const judgeMenuItems = [
    {
      title: "Judge Panel",
      icon: Gavel,
      key: "judge-panel",
      onClick: () => changeView("judge-panel"),
    },
    {
      title: "My Judgments",
      icon: FileText,
      key: "my-judgments",
      onClick: () => changeView("my-judgments"),
    },
  ];

  // Function to render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case "profile":
        return (
          <ProfileSection
            userName="John Doe"
            userEmail="john@example.com"
            userAvatar="/placeholder.svg?height=96&width=96"
            onBack={() => changeView("profile")}
          />
        );
      case "my-hackathons":
        return <MyHackathon onBack={() => changeView("profile")} />;
      case "my-submissions":
        return <MySubmissions onBack={() => changeView("profile")} />;
      case "chat-rooms":
        return <ChatRooms onBack={() => changeView("profile")} />;
      case "explore-hackathons":
        return <ExploreHackathons onBack={() => changeView("profile")} />;
      case "organization-hub":
        return <OrganizationHub onBack={() => changeView("profile")} />;
      case "created-hackathons":
        return (
          <CreatedHackathons
            onBack={() => changeView("profile")}
            onCreateNew={() => changeView("create-hackathon")}
          />
        );
      case "participant-overview":
        return <ParticipantOverview onBack={() => changeView("profile")} />;
      case "review-submissions":
        return <ReviewSubmissions onBack={() => changeView("profile")} />;
      case "announcements":
        return <Announcements onBack={() => changeView("profile")} />;
      case "organizer-tools":
        return <OrganizerTools onBack={() => changeView("profile")} />;
      case "create-hackathon":
        return <CreateHackathon onBack={() => changeView("profile")} />;
      case "blogs":
        return <Blogs onBack={() => changeView("profile")} />;
      case "project-archive":
        return <ProjectArchive onBack={() => changeView("profile")} />;
      case "my-community":
        return <div className="p-6">My Community Section - Coming Soon</div>;
      case "judge-panel":
        return <DashboardJudgePanel onBack={() => changeView("profile")} />;
      case "my-judgments":
        return <div className="p-6">My Judgments Section - Coming Soon</div>;

      case "certificate-page":
        return <CertificatesPage onBack={() => changeView("profile")} />;
      default:
        return (
          <ProfileSection
            userName="John Doe"
            userEmail="john@example.com"
            userAvatar="/placeholder.svg?height=96&width=96"
            onBack={() => changeView("profile")}
          />
        );
    }
  };

  useEffect(() => {
    // Refresh user info to ensure we have the latest role
    refreshUser();
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (user && !user.profileCompleted) {
      navigate("/complete-profile");
    }
  }, [user, navigate]);

  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <SidebarHeader className="p-4">
          <div
            className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={navigateToHome}
          >
            <img
              src="https://res.cloudinary.com/dg2q2tzbv/image/upload/v1751960561/logo_bg_yvh9hq.png"
              alt="HackZen Logo"
              className="w-10 h-10 object-contain border rounded-full"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">HackZen</h1>
              <p className="text-sm text-gray-500">Hackathon Platform</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="scrollbar-hide">
          <SidebarGroup>
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

          {/* Organizer Menu - Only show to organizers, NOT to judges */}
          {user?.role === "organizer" && user?.role !== "judge" && (
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-purple-600">
                <Wrench className="w-4 h-4" />
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

          {/* Judge Menu - Show to judges */}
          {user?.role === "judge" && (
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-orange-600">
                <Gavel className="w-4 h-4" />
                Judge Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {judgeMenuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={item.onClick}
                          className={cn(
                            "flex items-center gap-3 w-full text-left rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                            currentView === item.key
                              ? "bg-orange-100 text-orange-700"
                              : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "w-4 h-4",
                              currentView === item.key
                                ? "text-orange-700"
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

        <SidebarFooter className="p-4"></SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Dashboard</span>
            <span>/</span>
            <span className="capitalize">{currentView.replace("-", " ")}</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto scrollbar-hide">
          {renderContent()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
