import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  Users,
  Trophy,
  MessageSquare,
  Settings,
  Eye,
  UserCheck,
  FileText,
  BarChart3,
  DollarSign,
  Flag,
  HeadphonesIcon,
  NotebookTabs,
  Mail,
  Building,
  Wrench,
  Clock,
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

// Import your admin sections
import { Dashboard } from "./sections/dashboard";
import { UsersManagement } from "./sections/users-management";
import { HackathonsPage } from "./sections/hackathons-page";
import { AnnouncementsPanel } from "./sections/announcements-panel";
import { SubmissionsPage } from "./sections/submissions-page";
import { MentorChatPage } from "./sections/mentor-chat-page";
import { OrganizerRequestsPage } from "./sections/organizer-requests-V1";
import { HackathonRequest } from "./sections/HackathonRequest";
import { AnalyticsPage } from "./sections/analytics-page";
import { RevenuePage } from "./sections/revenue-page";
import { SettingsPage } from "./sections/settings-page";
import { FlaggedContentPage } from "./sections/flagged-content-page";
import { SupportInboxPage } from "./sections/support-inbox-page";
import { BlogManage } from "./sections/BlogsRequest";
import NewsletterSender from "./sections/NewsletterSender";
import { PendingChangesPage } from "./sections/pending-changes-page";
import { SmoothCursor } from "../../components/Magic UI/SmoothScroll";

export default function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the active section from the current URL path
  const getActiveSectionFromPath = () => {
    const path = location.pathname;
    const match = path.match(/^\/admin\/([^\/]+)/);
    return match ? match[1] : "dashboard";
  };

  const activeSection = getActiveSectionFromPath();

  // Function to handle section changes
  const setActiveSection = (section) => {
    navigate(`/admin/${section}`);
  };

  // Function to navigate to home page
  const navigateToHome = () => {
    navigate("/");
  };

  // Set default route on component mount
  useEffect(() => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  // Admin menu items organized by categories
  const coreMenuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      key: "dashboard",
      onClick: () => setActiveSection("dashboard"),
    },
    {
      title: "Users Management",
      icon: Users,
      key: "users",
      onClick: () => setActiveSection("users"),
    },
    {
      title: "Hackathons",
      icon: Trophy,
      key: "hackathons",
      onClick: () => setActiveSection("hackathons"),
    },
    {
      title: "Submissions",
      icon: FileText,
      key: "submissions",
      onClick: () => setActiveSection("submissions"),
    },
    {
      title: "Announcements",
      icon: MessageSquare,
      key: "announcements",
      onClick: () => setActiveSection("announcements"),
    },
  ];

  const moderationMenuItems = [
    {
      title: "Mentor Chat",
      icon: HeadphonesIcon,
      key: "mentors",
      onClick: () => setActiveSection("mentors"),
    },
    {
      title: "Organizer Requests",
      icon: UserCheck,
      key: "organizers",
      onClick: () => setActiveSection("organizers"),
    },
    {
      title: "Hackathon Requests",
      icon: Building,
      key: "hackathonRequest",
      onClick: () => setActiveSection("hackathonRequest"),
    },
    {
      title: "Blog Management",
      icon: NotebookTabs,
      key: "blogs",
      onClick: () => setActiveSection("blogs"),
    },
    {
      title: "Pending Changes",
      icon: Clock,
      key: "pending-changes",
      onClick: () => setActiveSection("pending-changes"),
    },
    {
      title: "Flagged Content",
      icon: Flag,
      key: "flagged",
      onClick: () => setActiveSection("flagged"),
    },
  ];

  const analyticsMenuItems = [
    {
      title: "Analytics",
      icon: BarChart3,
      key: "analytics",
      onClick: () => setActiveSection("analytics"),
    },
    {
      title: "Revenue",
      icon: DollarSign,
      key: "revenue",
      onClick: () => setActiveSection("revenue"),
    },
  ];

  const systemMenuItems = [
    {
      title: "Newsletter",
      icon: Mail,
      key: "newsletter",
      onClick: () => setActiveSection("newsletter"),
    },
    {
      title: "Support Inbox",
      icon: HeadphonesIcon,
      key: "support",
      onClick: () => setActiveSection("support"),
    },
    {
      title: "Settings",
      icon: Settings,
      key: "settings",
      onClick: () => setActiveSection("settings"),
    },
  ];

  // Function to render content based on current view
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <UsersManagement />;
      case "hackathons":
        return <HackathonsPage />;
      case "submissions":
        return <SubmissionsPage />;
      case "mentors":
        return <MentorChatPage />;
      case "announcements":
        return <AnnouncementsPanel />;
      case "hackathonRequest":
        return <HackathonRequest />;
      case "organizers":
        return <OrganizerRequestsPage />;
      case "blogs":
        return <BlogManage />;
      case "pending-changes":
        return <PendingChangesPage />;
      case "newsletter":
        return <NewsletterSender />;
      case "analytics":
        return <AnalyticsPage />;
      case "revenue":
        return <RevenuePage />;
      case "settings":
        return <SettingsPage />;
      case "flagged":
        return <FlaggedContentPage />;
      case "support":
        return <SupportInboxPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <SmoothCursor />
      <SidebarProvider>
        <Sidebar className="border-r bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
          <SidebarHeader className="p-4">
            <div
              className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={navigateToHome}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">HackZen Management</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {/* Core Management */}
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-red-600">
                <LayoutDashboard className="w-4 h-4" />
                Core Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {coreMenuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={item.onClick}
                          className={cn(
                            "flex items-center gap-3 w-full text-left rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                            activeSection === item.key
                              ? "bg-red-100 text-red-700"
                              : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "w-4 h-4",
                              activeSection === item.key
                                ? "text-red-700"
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

            {/* Content Moderation */}
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-orange-600">
                <Eye className="w-4 h-4" />
                Content Moderation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {moderationMenuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={item.onClick}
                          className={cn(
                            "flex items-center gap-3 w-full text-left rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                            activeSection === item.key
                              ? "bg-red-100 text-red-700"
                              : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "w-4 h-4",
                              activeSection === item.key
                                ? "text-red-700"
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

            {/* Analytics & Revenue */}
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-blue-600">
                <BarChart3 className="w-4 h-4" />
                Analytics & Revenue
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {analyticsMenuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={item.onClick}
                          className={cn(
                            "flex items-center gap-3 w-full text-left rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                            activeSection === item.key
                              ? "bg-red-100 text-red-700"
                              : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "w-4 h-4",
                              activeSection === item.key
                                ? "text-red-700"
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

            {/* System & Support */}
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-purple-600">
                <Wrench className="w-4 h-4" />
                System & Support
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {systemMenuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={item.onClick}
                          className={cn(
                            "flex items-center gap-3 w-full text-left rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                            activeSection === item.key
                              ? "bg-red-100 text-red-700"
                              : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "w-4 h-4",
                              activeSection === item.key
                                ? "text-red-700"
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
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="text-xs text-gray-500 text-center">
              Admin Panel v1.0
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Admin</span>
              <span>/</span>
              <span className="capitalize">{activeSection.replace("-", " ")}</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">{renderContent()}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}