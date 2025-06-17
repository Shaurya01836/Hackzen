"use client"

import { useState } from "react"
import { Sidebar } from "./components/sidebar"
import { TopNavigation } from "./components/top-navigation"
import { Dashboard } from "./components/dashboard"
import { UsersManagement } from "./components/users-management"
import { HackathonsPage } from "./components/hackathons-page"
import { AnnouncementsPanel } from "./components/announcements-panel"
import { SubmissionsPage } from "./components/submissions-page"
import { MentorChatPage } from "./components/mentor-chat-page"
import { OrganizerRequestsPage } from "./components/organizer-requests-page"


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
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1b0c3f] to-[#0d061f]">

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
