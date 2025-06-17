"use client"

import { useState } from "react"
import {
  Users,
  Trophy,
  MessageSquare,
  User,
  Plus,
  BarChart3,
  FileText,
  Settings,
  Github,
  Youtube,
  Award,
  TrendingUp,
  Eye,
  CheckCircle,
} from "lucide-react"
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
  SidebarTrigger
} from "../AdimPage/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../AdimPage/components/ui/card"
import { Button } from "../AdimPage/components/ui/button"
import { Badge } from "../AdimPage/components/ui/badge"
import { Progress } from "../AdimPage/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "../AdimPage/components/ui/avatar"
import { Separator } from "../AdimPage/components/ui/separator"
import { ProfileSection } from "./Profile-section"

const participantMenuItems = [
  { title: "My Hackathons", icon: Trophy, href: "#" },
  { title: "Explore Hackathons", icon: Plus , href: "#" },
  { title: "My Submissions", icon: FileText, href: "#" },
  { title: "Chat Rooms", icon: MessageSquare, href: "#" },
  { title: "My Portfolio", icon: User, href: "#" }
]

const organizerMenuItems = [
  { title: "Created Hackathons", icon: Plus, href: "#" },
  { title: "Participant Overview", icon: Users, href: "#" },
  { title: "Review Submissions", icon: Eye, href: "#" },
  { title: "Announcements", icon: MessageSquare, href: "#" },
  { title: "Organizer Tools", icon: Settings, href: "#" }
]

const hackathons = [
  {
    name: "Poornima HIS",
    status: "Live",
    deadline: "2 days left",
    participants: 156
  },
  {
    name: "JECRC Marathon",
    status: "Closed",
    deadline: "Ended",
    participants: 89
  },
  {
    name: "Skit Smart hackathon 2k25",
    status: "Upcoming",
    deadline: "5 days to start",
    participants: 234
  }
]

const Explorehackathons = [
  {
    name: "Walmart Sparkthon",
    status: "Live",
    deadline: "19 days left",
    participants: 156
  },
  {
    name: "Rajasthan Police Hackathon",
    status: "Live",
    deadline: "56 days left",
    participants: 89
  },
  {
    name: "SIH-2K26",
    status: "Upcoming",
    deadline: "90 days to start",
    participants: 234
  }
]

const submissions = [
  {
    name: "Smart City Dashboard",
    github: "github.com/user/smart-city",
    youtube: "youtube.com/watch?v=abc",
    status: "Judged",
    score: 85
  },
  {
    name: "AI Chatbot Assistant",
    github: "github.com/user/ai-chatbot",
    youtube: "",
    status: "Submitted",
    score: null
  }
]

const chatRooms = [
  { name: "AI Challenge General", members: 45, active: true },
  { name: "Web3 Builders", members: 23, active: false },
  { name: "Mobile Dev Help", members: 67, active: true }
]

export default function HackZenDashboard() {
  const [activeRole, setActiveRole] = useState("participant")
  const [currentView, setCurrentView] = useState("dashboard")

  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HackZen</h1>
              <p className="text-sm text-gray-500">Hackathon Platform</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Profile Completion
              </span>
              <span className="text-sm text-gray-500">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-indigo-600">
              <User className="w-4 h-4" />
              Participant Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {participantMenuItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-indigo-50 hover:text-indigo-700"
                      isActive={activeRole === "participant"}
                    >
                      <a href={item.href} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-purple-600">
              <Settings className="w-4 h-4" />
              Organizer Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {organizerMenuItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-purple-50 hover:text-purple-700"
                      isActive={activeRole === "organizer"}
                    >
                      <a href={item.href} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <button
            onClick={() => setCurrentView("profile")}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {currentView === "dashboard" ? (
          <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div>
                <h1 className="text-xl font-semibold">Welcome back, John 👋</h1>
                <p className="text-sm text-gray-500">
                  Here's your HackZen overview
                </p>
              </div>
            </header>

            <div className="flex-1 space-y-6 p-6">
              {/* Role Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={activeRole === "participant" ? "default" : "outline"}
                  onClick={() => setActiveRole("participant")}
                  className="flex items-center gap-2 "
                >
                  <User className="w-4 h-4" />
                  Participant View
                </Button>
                <Button
                  variant={activeRole === "organizer" ? "default" : "outline"}
                  onClick={() => setActiveRole("organizer")}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Organizer View
                </Button>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Participant Panel */}
                {activeRole === "participant" && (
                  <>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          👨‍💻 Participant Panel
                        </h2>

                        {/* My Hackathons */}
                        <Card className="m-7 hover:shadow-lg transition-shadow hover:ring-2 hover:ring-indigo-300">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-indigo-600" />
                              My Hackathons
                            </CardTitle>
                            <CardDescription>
                              Track your active and completed hackathons
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {hackathons.map((hackathon, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">
                                    {hackathon.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {hackathon.deadline}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    hackathon.status === "Live"
                                      ? "default"
                                      : hackathon.status === "Closed"
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className={
                                    hackathon.status === "Live"
                                      ? "bg-green-500"
                                      : ""
                                  }
                                >
                                  {hackathon.status}
                                </Badge>
                              </div>
                            ))}
                          </CardContent>
                        </Card>

                        {/* My Submissions */}
                        <Card className="m-6 hover:shadow-lg transition-shadow hover:ring-2 hover:ring-indigo-300">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-indigo-600" />
                              My Submissions
                            </CardTitle>
                            <CardDescription>
                              Your project submissions and their status
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {submissions.map((submission, index) => (
                              <div
                                key={index}
                                className="p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-medium">
                                    {submission.name}
                                  </p>
                                  <Badge
                                    variant={
                                      submission.status === "Judged"
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {submission.status}
                                  </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex items-center gap-1"
                                  >
                                    <Github className="w-3 h-3" />
                                    GitHub
                                  </Button>
                                  {submission.youtube && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex items-center gap-1"
                                    >
                                      <Youtube className="w-3 h-3" />
                                      Demo
                                    </Button>
                                  )}
                                </div>
                                {submission.score && (
                                  <p className="text-sm text-green-600 mt-2">
                                    Score: {submission.score}/100
                                  </p>
                                )}
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Chat Rooms */}
                      <Card className="hover:shadow-lg transition-shadow hover:ring-2 hover:ring-indigo-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-indigo-600" />
                            Chat Rooms
                          </CardTitle>
                          <CardDescription>
                            Join discussions with other participants
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {chatRooms.map((room, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{room.name}</p>
                                <p className="text-sm text-gray-500">
                                  {room.members} members
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {room.active && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                )}
                                <Button
                                  size="sm"
                                  className="bg-indigo-500 hover:bg-indigo-600"
                                >
                                  Join
                                </Button>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Portfolio Stats */}
                      <Card className="hover:shadow-lg transition-shadow hover:ring-2 hover:ring-indigo-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-indigo-600" />
                            Portfolio Stats
                          </CardTitle>
                          <CardDescription>
                            Your achievements and progress
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
                              <p className="text-2xl font-bold text-indigo-600">
                                12
                              </p>
                              <p className="text-sm text-gray-600">
                                Hackathons
                              </p>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                              <p className="text-2xl font-bold text-green-600">
                                3
                              </p>
                              <p className="text-sm text-gray-600">Wins</p>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                              <p className="text-2xl font-bold text-yellow-600">
                                8
                              </p>
                              <p className="text-sm text-gray-600">Badges</p>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                              <p className="text-2xl font-bold text-purple-600">
                                95
                              </p>
                              <p className="text-sm text-gray-600">Rank</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Explore Hackathons */}
                      <Card className="hover:shadow-lg transition-shadow hover:ring-2 hover:ring-indigo-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-indigo-600" />
                            Explore Hackathons
                          </CardTitle>
                          <CardDescription>
                            You can Participate and Change the world
                          </CardDescription>
                        </CardHeader>
                            <CardContent className="space-y-3">
                            {Explorehackathons.map((hackathon, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">
                                    {hackathon.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {hackathon.deadline}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    hackathon.status === "Live"
                                      ? "default"
                                      : hackathon.status === "Closed"
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className={
                                    hackathon.status === "Live"
                                      ? "bg-green-500"
                                      : ""
                                  }
                                >
                                  {hackathon.status}
                                </Badge>
                              </div>
                            ))}
                          </CardContent> 
                      </Card>
                    </div>
                  </>
                )}

                {/* Organizer Panel */}
                {activeRole === "organizer" && (
                  <>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          🏢 Organizer Panel
                        </h2>

                        {/* Created Hackathons */}
                        <Card className="hover:shadow-lg transition-shadow hover:ring-2 hover:ring-purple-300">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Plus className="w-5 h-5 text-purple-600" />
                              Created Hackathons
                            </CardTitle>
                            <CardDescription>
                              Manage your organized events
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {hackathons.map((hackathon, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div>
                                  <p className="font-medium">
                                    {hackathon.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {hackathon.participants} participants
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-3 h-3 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-purple-500 hover:bg-purple-600"
                                  >
                                    Manage
                                  </Button>
                                </div>
                              </div>
                            ))}
                            <Button className="w-full bg-purple-500 hover:bg-purple-600">
                              <Plus className="w-4 h-4 mr-2" />
                              Create New Hackathon
                            </Button>
                          </CardContent>
                        </Card>

                        {/* Review Queue */}
                        <Card className="hover:shadow-lg transition-shadow hover:ring-2 hover:ring-purple-300">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Eye className="w-5 h-5 text-purple-600" />
                              Review Queue
                            </CardTitle>
                            <CardDescription>
                              Submissions pending your review
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <div>
                                <p className="font-medium">
                                  AI Innovation Challenge
                                </p>
                                <p className="text-sm text-gray-500">
                                  15 submissions pending
                                </p>
                              </div>
                              <Button
                                size="sm"
                                className="bg-yellow-500 hover:bg-yellow-600"
                              >
                                Review Now
                              </Button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                              <div>
                                <p className="font-medium">Web3 Builder Fest</p>
                                <p className="text-sm text-gray-500">
                                  All submissions reviewed
                                </p>
                              </div>
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Participant Stats */}
                      <Card className="hover:shadow-lg transition-shadow hover:ring-2 hover:ring-purple-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            Participant Overview
                          </CardTitle>
                          <CardDescription>
                            Statistics across your events
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
                              <p className="text-2xl font-bold text-purple-600">
                                479
                              </p>
                              <p className="text-sm text-gray-600">
                                Total Participants
                              </p>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                              <p className="text-2xl font-bold text-blue-600">
                                156
                              </p>
                              <p className="text-sm text-gray-600">
                                Active Now
                              </p>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                              <p className="text-2xl font-bold text-green-600">
                                89%
                              </p>
                              <p className="text-sm text-gray-600">
                                Completion Rate
                              </p>
                            </div>
                            <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                              <p className="text-2xl font-bold text-orange-600">
                                4.8
                              </p>
                              <p className="text-sm text-gray-600">
                                Avg Rating
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Organizer Tools */}
                      <Card className="hover:shadow-lg transition-shadow hover:ring-2 hover:ring-purple-300">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-purple-600" />
                            Organizer Tools
                          </CardTitle>
                          <CardDescription>
                            Quick actions and utilities
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button className="w-full justify-start bg-purple-500 hover:bg-purple-600">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Analytics
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Announcement
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Export Data
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <Award className="w-4 h-4 mr-2" />
                            Manage Prizes
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                )}
              </div>

              {/* Analytics Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  📊 Analytics Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Submissions Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-24 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-end justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            +23%
                          </p>
                          <p className="text-sm text-gray-600">This month</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        Participant Growth
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-24 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-end justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            +156
                          </p>
                          <p className="text-sm text-gray-600">New this week</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Active Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-24 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg flex items-end justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-600">
                            8
                          </p>
                          <p className="text-sm text-gray-600">Live now</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </>
        ) : (
          <ProfileSection
            userName="John Doe"
            userEmail="john@example.com"
            userAvatar="/placeholder.svg?height=96&width=96"
            onBack={() => setCurrentView("dashboard")}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}

