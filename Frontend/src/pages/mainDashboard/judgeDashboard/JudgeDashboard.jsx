import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { Gavel, FileText } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger
} from "../../../components/DashboardUI/sidebar";
import DashboardJudgePanel from "./JudgePanel";
import JudgeProjectGallery from "./JudgeProjectGallery";

export default function JudgeDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [currentView, setCurrentView] = useState("judge-panel");

  const changeView = (viewKey) => {
    setCurrentView(viewKey);
    navigate(`/dashboard/${viewKey}`);
  };

  const judgeMenuItems = [
    { title: "Judge Panel", icon: Gavel, key: "judge-panel", onClick: () => changeView("judge-panel") },
    { title: "My Judgments", icon: FileText, key: "my-judgments", onClick: () => changeView("my-judgments") },
  ];

  const renderContent = () => {
    // Special case: judge project gallery route
    if (location.pathname.match(/^\/dashboard\/judge\/hackathon\/[^/]+\/gallery/)) {
      return <JudgeProjectGallery />;
    }
    switch (currentView) {
      case "judge-panel":
        return <DashboardJudgePanel onBack={() => changeView("judge-panel")} />;
      case "my-judgments":
        return <div className="p-6">My Judgments Section - Coming Soon</div>;
      default:
        return <DashboardJudgePanel onBack={() => changeView("judge-panel")} />;
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
                        <item.icon className={cn("w-4 h-4", currentView === item.key ? "text-orange-700" : "text-gray-500")} />
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