import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { cn } from "../../../lib/utils";
import {
  Settings, CalendarX, PencilRulerIcon, MessageSquare, ShieldCheck, Wrench
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger
} from "../../../components/DashboardUI/sidebar";
import { CreatedHackathons } from "./Created-hackathons";
import { Announcements } from "./Announcements";
import { OrganizerTools } from "./OrganizerTools";
import CreateHackathon from "./Create-hackathon";
import CertificatesPage from "./CertificatePage";
import JudgeManagement from "./components/JudgeManagement";
import EditHackathonPage from "./components/EditHackathonPage";

export default function OrganizerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [currentView, setCurrentView] = useState("organizer-tools");

  // Sync currentView with URL for direct navigation
  useEffect(() => {
    const match = location.pathname.match(/^\/dashboard\/(\w+-?\w*)/);
    if (match && match[1] && match[1] !== currentView) {
      setCurrentView(match[1]);
    }
  }, [location.pathname]);

  const changeView = (viewKey) => {
    setCurrentView(viewKey);
    navigate(`/dashboard/${viewKey}`);
  };

  const organizerMenuItems = [
    { title: "Organizer Tools", icon: Settings, key: "organizer-tools", onClick: () => changeView("organizer-tools") },
    { title: "Hackathons", icon: CalendarX, key: "created-hackathons", onClick: () => changeView("created-hackathons") },
    { title: "Create Hackathons", icon: PencilRulerIcon, key: "create-hackathon", onClick: () => changeView("create-hackathon") },
    { title: "Announcements", icon: MessageSquare, key: "announcements", onClick: () => changeView("announcements") },
    { title: "Certificate Page", icon: ShieldCheck, key: "certificate-page", onClick: () => changeView("certificate-page") },
  ];

  const renderContent = () => {
    switch (currentView) {
      case "organizer-tools":
        return <OrganizerTools onBack={() => changeView("organizer-tools")} />;
      case "created-hackathons":
        return <CreatedHackathons onBack={() => changeView("organizer-tools")} onCreateNew={() => changeView("create-hackathon")} />;
      case "create-hackathon":
        return <CreateHackathon onBack={() => changeView("organizer-tools")} />;
      case "announcements":
        return <Announcements onBack={() => changeView("organizer-tools")} />;
      case "certificate-page":
        return <CertificatesPage onBack={() => changeView("organizer-tools")} />;
      case "judge-management":
        return <JudgeManagement hackathonId={params.hackathonId} onBack={() => changeView("organizer-tools")} />;
      case "edit-hackathon":
        return <EditHackathonPage />;
      default:
        return <OrganizerTools onBack={() => changeView("organizer-tools")} />;
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