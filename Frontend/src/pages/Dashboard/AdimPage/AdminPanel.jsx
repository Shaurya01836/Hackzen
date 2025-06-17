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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/20 to-slate-900/20 pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />

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
