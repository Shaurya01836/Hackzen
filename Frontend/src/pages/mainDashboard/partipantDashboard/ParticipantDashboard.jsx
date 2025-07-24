import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { cn } from "../../../lib/utils";
import {
  User, Trophy, FileText, Search, NotebookTabs, Archive, Handshake
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger
} from "../../../components/DashboardUI/sidebar";
import { useAuth } from "../../../context/AuthContext";
import { ProfileSection } from "../ProfileSection";
import { MySubmissions } from "./MySubmissions";
import { ExploreHackathons } from "./ExploreHackathon";
import { Blogs } from "./Blogs";
import { ProjectArchive } from "./ProjectArchive";
import MyHackathon from "./Myhackathon";
import SponsoredPS from "../SponsoredPS";

export default function ParticipantDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [currentView, setCurrentView] = useState("profile");
  const [hasApprovedSponsoredPS, setHasApprovedSponsoredPS] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function checkSponsoredPS() {
      if (!user?.email) return;
      try {
        const res = await fetch(`/api/sponsor-proposals/user/${user.email}`);
        const data = await res.json();
        setHasApprovedSponsoredPS(Array.isArray(data) && data.length > 0);
      } catch {
        setHasApprovedSponsoredPS(false);
      }
    }
    checkSponsoredPS();
  }, [user?.email]);

  const changeView = (viewKey) => {
    setCurrentView(viewKey);
    navigate(`/dashboard/${viewKey}`);
  };

  const participantMenuItems = [
    { title: "Profile", icon: User, key: "profile", onClick: () => changeView("profile") },
    { title: "My Hackathons", icon: Trophy, key: "my-hackathons", onClick: () => changeView("my-hackathons") },
    { title: "My Submissions", icon: FileText, key: "my-submissions", onClick: () => changeView("my-submissions") },
    { title: "Explore Hackathons", icon: Search, key: "explore-hackathons", onClick: () => changeView("explore-hackathons") },
    { title: "Blogs", icon: NotebookTabs, key: "blogs", onClick: () => changeView("blogs") },
    { title: "Project Archive", icon: Archive, key: "project-archive", onClick: () => changeView("project-archive") },
    ...(hasApprovedSponsoredPS
      ? [{ title: "Sponsored PS", icon: Handshake, key: "sponsored-ps", onClick: () => changeView("sponsored-ps") }]
      : []),
  ];

  const renderContent = () => {
    switch (currentView) {
      case "profile":
        return <ProfileSection viewUserId={params.id} userName="John Doe" userEmail="john@example.com" userAvatar="/placeholder.svg?height=96&width=96" onBack={() => changeView("profile")} />;
      case "my-hackathons":
        return <MyHackathon onBack={() => changeView("profile")} />;
      case "my-submissions":
        return <MySubmissions onBack={() => changeView("profile")} />;
      case "explore-hackathons":
        return <ExploreHackathons onBack={() => changeView("profile")} />;
      case "blogs":
        return <Blogs onBack={() => changeView("profile")} />;
      case "project-archive":
        return <ProjectArchive onBack={() => changeView("profile")} />;
      case "sponsored-ps":
        return <SponsoredPS onBack={() => changeView("profile")} />;
      default:
        return <ProfileSection viewUserId={params.id} userName="John Doe" userEmail="john@example.com" userAvatar="/placeholder.svg?height=96&width=96" onBack={() => changeView("profile")} />;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
            <img src="https://res.cloudinary.com/dg2q2tzbv/image/upload/v1751960561/logo_bg_yvh9hq.png" alt="HackZen Logo" className="w-10 h-10 object-contain border rounded-full" />
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
                        <item.icon className={cn("w-4 h-4", currentView === item.key ? "text-indigo-700" : "text-gray-500")} />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
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