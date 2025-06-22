"use client"

import { useState } from "react"
import { Sidebar } from "./sections/sidebar"
import { TopNavigation } from "./sections/top-navigation"
import { Dashboard } from "./sections/dashboard"
import { UsersManagement } from "./sections/users-management"
import { HackathonsPage } from "./sections/hackathons-page"
import { AnnouncementsPanel } from "./sections/announcements-panel"
import { SubmissionsPage } from "./sections/submissions-page"
import { MentorChatPage } from "./sections/mentor-chat-page"
import { OrganizerRequestsPage } from "./sections/organizer-requests-page"
import { AnalyticsPage } from "./sections/analytics-page"
import { RevenuePage } from "./sections/revenue-page"
import { SettingsPage } from "./sections/settings-page"
import { FlaggedContentPage } from "./sections/flagged-content-page"
import { SupportInboxPage } from "./sections/support-inbox-page"
// import { AdminProfilePage } from "./sections/AdminProfile"



export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard")

   const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />
      case "users":
        return <UsersManagement />
      case "hackathons":
        return <HackathonsPage />
      case "submissions":
        return <SubmissionsPage />
      case "mentors":
        return <MentorChatPage />
      case "announcements":
        return <AnnouncementsPanel />
      case "organizers":
        return <OrganizerRequestsPage />
      case "analytics":
        return <AnalyticsPage />
      case "revenue":
        return <RevenuePage />
      case "settings":
        return <SettingsPage />
      case "flagged":
        return <FlaggedContentPage />
      case "support":
        return <SupportInboxPage />
      // case "profile":
      //   return <AdminProfilePage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">

      <div className="flex h-screen">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavigation />
          <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
        </div>
      </div>
    </div>
  )
}
