import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  LayoutTemplateIcon,
  LucideBadgeDollarSign,
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
import { HackathonRequest } from "./sections/HackathonRequest";
import { AnalyticsPage } from "./sections/analytics-page";
import { RevenuePage } from "./sections/revenue-page";
import { SettingsPage } from "./sections/settings-page";
import { FlaggedContentPage } from "./sections/flagged-content-page";
import { SupportInboxPage } from "./sections/support-inbox-page";
import { BlogManage } from "./sections/BlogsRequest";
import NewsletterSender from "./sections/NewsletterSender";
import AddCertificateForm from "./sections/AddCertificateForm";
import AdminHackathonSubmissionsPage from "./components/AdminHackathonSubmissionsPage";
import AdminSubmissionDetailsPage from "./components/AdminSubmissionDetailsPage";
import HackathonDetailsPage from "./components/HackathonDetailsPage";
import {PublicProfileView} from "../mainDashboard/PublicProfileView";
import { SiMoneygram } from "react-icons/si";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from '../../components/DashboardUI/NotificationBell';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/DashboardUI/avatar';
import useDropdownTimeout from '../../hooks/useDropdownTimeout';

export default function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { handleMouseEnter: profileEnter, handleMouseLeave: profileLeave } = useDropdownTimeout(setShowProfileDropdown);

  // Extract the active section from the current URL path
  const getActiveSectionFromPath = () => {
    const path = location.pathname;
    const match = path.match(/^\/admin\/([^/]+)/);
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
  ];

  const moderationMenuItems = [
  
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
      title: "Flagged Content",
      icon: Flag,
      key: "flagged",
      onClick: () => setActiveSection("flagged"),
    },
    {
      title: "Certificate Templates",
      icon: LayoutTemplateIcon,
      key: "certificateTemplate",
      onClick: () => setActiveSection("certificateTemplate"),
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
      icon: LucideBadgeDollarSign,
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
    // Check for user profile route
    const userProfileMatch = location.pathname.match(/^\/admin\/users\/([^/]+)$/);
    if (userProfileMatch) {
      const userId = userProfileMatch[1];
      return <PublicProfileView userId={userId} />;
    }
    // Check for hackathon submissions and submission details routes
    const path = location.pathname;
    const hackathonSubmissionsMatch = path.match(/^\/admin\/hackathons\/([^/]+)\/submissions$/);
    const hackathonSubmissionDetailsMatch = path.match(/^\/admin\/hackathons\/([^/]+)\/submissions\/([^/]+)$/);
    const hackathonDetailsMatch = path.match(/^\/admin\/hackathons\/([^/]+)$/);
    if (hackathonSubmissionDetailsMatch) {
      const hackathonId = hackathonSubmissionDetailsMatch[1];
      const submissionId = hackathonSubmissionDetailsMatch[2];
      return <AdminSubmissionDetailsPage hackathonId={hackathonId} submissionId={submissionId} />;
    }
    if (hackathonSubmissionsMatch) {
      const hackathonId = hackathonSubmissionsMatch[1];
      return <AdminHackathonSubmissionsPage hackathonId={hackathonId} />;
    }
    if (hackathonDetailsMatch) {
      const hackathonId = hackathonDetailsMatch[1];
      return <HackathonDetailsPage hackathonId={hackathonId} />;
    }
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <UsersManagement />;
      case "hackathons":
        return <HackathonsPage />;
      case "mentors":
        return <MentorChatPage />;
      case "hackathonRequest":
        return <HackathonRequest />;
      case "blogs":
        return <BlogManage />;
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
      case "certificateTemplate":
        return <AddCertificateForm />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
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
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">HackZen Management</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="scrollbar-hide">
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
              Scroll to see more content
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Admin</span>
                <span>/</span>
                <span className="capitalize">{activeSection.replace("-", " ")}</span>
              </div>
            </div>
            <div className="flex items-center gap-6 pr-4"> {/* increased gap and added right padding */}
              <NotificationBell />
              {/* Profile Icon with Dropdown */}
              {authUser && (
                <div
                  className="relative"
                  onMouseEnter={profileEnter}
                  onMouseLeave={profileLeave}
                >
                  <div
                    className="w-10 h-10 rounded-full bg-[#1b0c3f] text-white flex items-center justify-center font-semibold text-sm uppercase overflow-hidden cursor-pointer mr-1"
                    onClick={() => setShowProfileDropdown((v) => !v)}
                    title={authUser.name || authUser.email}
                  >
                    {authUser.profilePic ? (
                      <Avatar>
                        <AvatarImage src={authUser.profilePic} alt="Profile" />
                        <AvatarFallback>{authUser.name?.charAt(0) || authUser.email?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <span>{authUser.name?.charAt(0) || authUser.email?.charAt(0)}</span>
                    )}
                  </div>
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white/20 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg z-50 text-sm overflow-hidden">
                      <Link
                        to="/dashboard/profile"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-200"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/dashboard/profile/privacy-security"
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-900 border-b border-gray-200"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        Settings
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 border-b border-gray-200"
                        onClick={() => {
                          logout();
                          setShowProfileDropdown(false);
                          navigate('/');
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 scrollbar-hide">{renderContent()}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}