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
import { SupportInboxPage } from "./sections/support-inbox-page"



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
      case "support":
        return <SupportInboxPage />
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
