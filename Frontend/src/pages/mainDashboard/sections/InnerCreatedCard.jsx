"use client"
import * as React from "react"
import { Badge } from "../../../components/CommonUI/badge"
import { Button } from "../../../components/CommonUI/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card"
import { Input } from "../../../components/CommonUI/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/CommonUI/select"
import { Separator } from "../../../components/CommonUI/separator"
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Mail,
  MapPin,
  Medal,
  Megaphone,
  PieChart,
  Search,
  Settings,
  Trash2,
  Trophy,
  Upload,
  Users,
  Users2,
  Zap
} from "lucide-react"

// Mock data
const hackathonStats = {
  totalParticipants: 1247,
  totalTeams: 312,
  totalSubmissions: 298,
  topTracks: ["AI/ML", "Web3", "FinTech", "HealthTech"],
  topLocations: ["San Francisco", "New York", "London", "Berlin"],
  averageAge: 24,
  genderDistribution: { male: 65, female: 32, other: 3 },
  activeParticipants: 1180,
  inactiveParticipants: 67,
  duration: "48 hours",
  lastSubmission: "2 hours ago"
}

const projectSubmissions = [
  {
    id: "1",
    teamName: "Code Crusaders",
    members: ["alice@example.com", "bob@example.com", "charlie@example.com"],
    track: "AI/ML",
    title: "Smart Health Assistant",
    description:
      "An AI-powered health monitoring app that provides personalized recommendations based on user data and medical history.",
    links: {
      github: "https://github.com/team/project",
      website: "https://smarthealth.demo.com",
      figma: "https://figma.com/design"
    },
    attachments: ["presentation.pdf", "demo-video.mp4"],
    submittedOn: "2024-01-15T14:30:00Z",
    status: "Winner",
    score: 95,
    rank: 1
  },
  {
    id: "2",
    teamName: "Innovation Labs",
    members: ["dev1@example.com", "dev2@example.com"],
    track: "Web3",
    title: "DeFi Portfolio Tracker",
    description:
      "A comprehensive dashboard for tracking DeFi investments across multiple blockchains with real-time analytics.",
    links: {
      github: "https://github.com/team/defi-tracker",
      website: "https://defi-tracker.demo.com"
    },
    attachments: ["pitch-deck.pdf"],
    submittedOn: "2024-01-15T16:45:00Z",
    status: "Finalist",
    score: 88,
    rank: 3
  },
  {
    id: "3",
    teamName: "Green Tech Solutions",
    members: [
      "eco@example.com",
      "green@example.com",
      "sustain@example.com",
      "earth@example.com"
    ],
    track: "Climate Tech",
    title: "Carbon Footprint Calculator",
    description:
      "An interactive tool that helps individuals and businesses calculate and reduce their carbon footprint through actionable insights.",
    links: {
      github: "https://github.com/team/carbon-calc",
      figma: "https://figma.com/carbon-design"
    },
    attachments: ["research-paper.pdf", "user-study.pdf"],
    submittedOn: "2024-01-15T18:20:00Z",
    status: "Reviewed",
    score: 82
  },
  {
    id: "4",
    teamName: "FinTech Pioneers",
    members: ["fintech@example.com", "money@example.com"],
    track: "FinTech",
    title: "Micro-Investment Platform",
    description:
      "A mobile app that enables users to invest spare change from daily transactions into diversified portfolios.",
    links: {
      github: "https://github.com/team/micro-invest"
    },
    attachments: ["business-plan.pdf"],
    submittedOn: "2024-01-15T12:15:00Z",
    status: "Pending"
  }
]

export default function HackathonDetailsPage({
  hackathon: hackathonProp,
  onBack
}) {
  // If hackathon data is passed as prop, use it instead of mock data
  const hackathonData = hackathonProp || {
    title: "AI Innovation Hackathon 2024",
    description: "January 13-15, 2024 • San Francisco, CA",
    status: "Completed"
  }
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterTrack, setFilterTrack] = React.useState("all")
  const [filterStatus, setFilterStatus] = React.useState("all")

  const filteredProjects = projectSubmissions.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.members.some(member =>
        member.toLowerCase().includes(searchTerm.toLowerCase())
      )
    const matchesTrack = filterTrack === "all" || project.track === filterTrack
    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus

    return matchesSearch && matchesTrack && matchesStatus
  })

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusColor = status => {
    switch (status) {
      case "Winner":
        return "bg-green-100 text-green-800 border-green-200"
      case "Finalist":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Reviewed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Pending":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Add back button if onBack function is provided
  return (
    <div className="min-h-screen bg-[#f9f9fb]">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {hackathonData.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  {hackathonData.description}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              {hackathonData.status || "Completed"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats and Top Tracks/Locations - Full Width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Stats Overview */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Hackathon Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {/* 6 stats cards */}
            <Card className="bg-white border-gray-200 shadow-sm col-span-1">
              <CardContent className="pt-12">
                <div className="flex flex-col items-center justify-between gap-2">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Participants
                    </p>
                    <p className="pl-2 text-3xl font-bold text-gray-900">
                      {hackathonStats.totalParticipants.toLocaleString()}
                    </p>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm col-span-1">
              <CardContent className="pt-12">
                <div className="flex flex-col gap-2 items-center justify-between">
                    <div className="p-3 bg-blue-100 rounded-xl">
                    <Users2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Teams
                    </p>
                    <p className="pl-2 text-3xl font-bold text-gray-900">
                      {hackathonStats.totalTeams}
                    </p>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm col-span-1">
              <CardContent className="pt-12">
                <div className="flex flex-col gap-2 items-center justify-between">
                    <div className="p-3 bg-green-100 rounded-xl">
                    <Upload className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Submissions
                    </p>
                    <p className="pl-2 text-3xl font-bold text-gray-900">
                      {hackathonStats.totalSubmissions}
                    </p>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm col-span-1">
              <CardContent className="pt-12">
                <div className="flex flex-col gap-2 items-center justify-between">
                    <div className="p-3 bg-purple-100 rounded-xl">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Duration
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {hackathonStats.duration}
                    </p>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm col-span-1">
              <CardContent className="pt-12">
                <div className="flex flex-col gap-2 items-center justify-between">
                    <div className="p-3 bg-orange-100 rounded-xl">
                    <PieChart className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Average Age
                    </p>
                    <p className="pl-2 text-3xl font-bold text-gray-900">
                      {hackathonStats.averageAge}
                    </p>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm col-span-1">
              <CardContent className="pt-12">
                <div className="flex flex-col gap-2 items-center justify-between">
                    <div className="p-3 bg-red-100 rounded-xl">
                    <CalendarDays className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Last Submission
                    </p>
                    <p className="pl-2 text-3xl font-bold text-gray-900">
                      {hackathonStats.lastSubmission}
                    </p>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Tracks and Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Top Tracks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hackathonStats.topTracks.map((track, index) => (
                    <div key={track} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{track}</span>
                      <Badge variant="secondary" className="text-xs">#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Top Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hackathonStats.topLocations.map((location, index) => (
                    <div key={location} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{location}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Submitted Projects + Quick Actions Side by Side, Projects Scrollable */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Submitted Projects - Only Cards Scrollable, Hide Scrollbar */}
          <div className="flex-1">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Submitted Projects
                </h2>
                <div className="text-sm text-gray-600">
                  {filteredProjects.length} of {projectSubmissions.length} projects
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search projects, teams, or members..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-200"
                  />
                </div>
                <Select value={filterTrack} onValueChange={setFilterTrack}>
                  <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200">
                    <SelectValue placeholder="Filter by track" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tracks</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="Web3">Web3</SelectItem>
                    <SelectItem value="FinTech">FinTech</SelectItem>
                    <SelectItem value="Climate Tech">Climate Tech</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Winner">Winner</SelectItem>
                    <SelectItem value="Finalist">Finalist</SelectItem>
                    <SelectItem value="Reviewed">Reviewed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Projects Grid - Scrollable, Hide Scrollbar */}
              <div className="space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide p-3">
                {filteredProjects.map(project => (
                  <Card
                    key={project.id}
                    className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {project.title}
                                </h3>
                                {project.rank && (
                                  <div className="flex items-center gap-1">
                                    <Trophy className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm font-medium text-yellow-600">
                                      #{project.rank}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                by {project.teamName}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {project.track}
                              </Badge>
                            </div>
                            <Badge
                              className={`${getStatusColor(
                                project.status
                              )} text-xs`}
                            >
                              {project.status}
                            </Badge>
                          </div>

                          <p className="text-gray-700 text-sm leading-relaxed">
                            {project.description}
                          </p>

                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-2">
                                Team Members
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {project.members.map(member => (
                                  <div
                                    key={member}
                                    className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md"
                                  >
                                    <Mail className="h-3 w-3" />
                                    {member}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm">
                              {project.links.github && (
                                <a
                                  href={project.links.github}
                                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                                >
                                  <Github className="h-4 w-4" />
                                  GitHub
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                              {project.links.website && (
                                <a
                                  href={project.links.website}
                                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                                >
                                  <Globe className="h-4 w-4" />
                                  Website
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                              {project.links.figma && (
                                <a
                                  href={project.links.figma}
                                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                                >
                                  <Settings className="h-4 w-4" />
                                  Figma
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>

                            {project.attachments.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-2">
                                  Attachments
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {project.attachments.map(attachment => (
                                    <div
                                      key={attachment}
                                      className="flex items-center gap-1 text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded-md"
                                    >
                                      <FileText className="h-3 w-3" />
                                      {attachment}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(project.submittedOn)}
                          </div>
                          {project.score && (
                            <div className="flex items-center gap-1 text-indigo-600 font-medium">
                              <Medal className="h-4 w-4" />
                              {project.score}/100
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
          {/* Quick Actions Panel */}
          <div className="w-full lg:w-80 flex-shrink-0 pt-28">
            <div className="sticky top-8">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-indigo-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Hackathon
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    Export Participants
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    Export Submissions
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent"
                  >
                    <Medal className="h-4 w-4" />
                    Send Certificates
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent"
                  >
                    <Trophy className="h-4 w-4" />
                    View Leaderboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left bg-transparent"
                  >
                    <Megaphone className="h-4 w-4" />
                    Send Announcements
                  </Button>
                  <Separator />
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 text-left text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Hackathon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions - Sticky Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2 overflow-x-auto">
          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0 bg-transparent"
          >
            <Edit3 className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0 bg-transparent"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0 bg-transparent"
          >
            <Trophy className="h-4 w-4 mr-1" />
            Leaderboard
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-shrink-0 bg-transparent"
          >
            <Megaphone className="h-4 w-4 mr-1" />
            Announce
          </Button>
        </div>
      </div>
    </div>
  )
}

/* Add this to your global CSS if not already present: */
/*
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
*/
