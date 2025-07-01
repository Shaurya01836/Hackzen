"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card"
import { Badge } from "../../../components/CommonUI/badge"
import { Button } from "../../../components/CommonUI/button"
import { Input } from "../../../components/CommonUI/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../../components/AdminUI/dropdown-menu"
import {
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  Download,
  Calendar,
  Users,
  Code,
  Play,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

const submissions = [
  {
    id: 1,
    title: "EcoTrack - Carbon Footprint Monitor",
    team: "Green Coders",
    members: ["Sarah Johnson", "Mike Chen", "Alex Rodriguez"],
    track: "Sustainability",
    status: "pending",
    priority: "high",
    submitted: "2 hours ago",
    deadline: "2024-12-20",
    technologies: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/greencoders/ecotrack",
    demo: "https://ecotrack-demo.vercel.app",
    description:
      "AI-powered carbon footprint tracking application with real-time recommendations."
  },
  {
    id: 2,
    title: "AI Study Buddy",
    team: "Neural Networks",
    members: ["Emma Wilson", "David Kim"],
    track: "AI/ML",
    status: "reviewed",
    priority: "medium",
    submitted: "5 hours ago",
    deadline: "2024-12-20",
    technologies: ["Python", "TensorFlow", "React"],
    github: "https://github.com/neuralnet/studybuddy",
    demo: "https://studybuddy-ai.com",
    description:
      "Personalized AI tutor that adapts to individual learning styles."
  },
  {
    id: 3,
    title: "HealthConnect Telemedicine",
    team: "MedTech Innovators",
    members: ["Dr. Lisa Park", "James Wright", "Maria Garcia", "Tom Anderson"],
    track: "Healthcare",
    status: "in-review",
    priority: "high",
    submitted: "1 day ago",
    deadline: "2024-12-20",
    technologies: ["Vue.js", "Express", "PostgreSQL"],
    github: "https://github.com/medtech/healthconnect",
    demo: "https://healthconnect-demo.com",
    description:
      "Comprehensive telemedicine platform with AI-assisted diagnosis."
  },
  {
    id: 4,
    title: "CryptoWallet Security Suite",
    team: "BlockChain Builders",
    members: ["Alex Chen", "Sophie Turner"],
    track: "Blockchain",
    status: "pending",
    priority: "low",
    submitted: "2 days ago",
    deadline: "2024-12-20",
    technologies: ["Solidity", "Web3.js", "React"],
    github: "https://github.com/blockchain/cryptowallet",
    demo: "https://cryptowallet-secure.com",
    description:
      "Advanced security features for cryptocurrency wallet management."
  }
]

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  reviewed: { color: "bg-green-100 text-green-800", icon: CheckCircle2 },
  "in-review": { color: "bg-blue-100 text-blue-800", icon: AlertCircle }
}

const priorityConfig = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800"
}

export function SubmissionsSection() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedTrack, setSelectedTrack] = React.useState("all")
  const [selectedStatus, setSelectedStatus] = React.useState("all")

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch =
      submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.team.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTrack =
      selectedTrack === "all" || submission.track === selectedTrack
    const matchesStatus =
      selectedStatus === "all" || submission.status === selectedStatus

    return matchesSearch && matchesTrack && matchesStatus
  })

  const tracks = [...new Set(submissions.map(s => s.track))]

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Enhanced Header with Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Submissions
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {submissions.length}
                </p>
              </div>
              <div className="p-2 bg-blue-200 rounded-lg">
                <Users className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Reviewed</p>
                <p className="text-2xl font-bold text-green-900">
                  {submissions.filter(s => s.status === "reviewed").length}
                </p>
              </div>
              <div className="p-2 bg-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {submissions.filter(s => s.status === "pending").length}
                </p>
              </div>
              <div className="p-2 bg-yellow-200 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  High Priority
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {submissions.filter(s => s.priority === "high").length}
                </p>
              </div>
              <div className="p-2 bg-purple-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by project name or team..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[120px] justify-between bg-transparent"
                >
                  Track: {selectedTrack === "all" ? "All" : selectedTrack}
                  <Filter className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedTrack("all")}>
                  All Tracks
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {tracks.map(track => (
                  <DropdownMenuItem
                    key={track}
                    onClick={() => setSelectedTrack(track)}
                  >
                    {track}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[120px] justify-between bg-transparent"
                >
                  Status: {selectedStatus === "all" ? "All" : selectedStatus}
                  <Filter className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedStatus("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedStatus("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSelectedStatus("in-review")}
                >
                  In Review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("reviewed")}>
                  Reviewed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Submissions Grid */}
      <div className="grid gap-6">
        {filteredSubmissions.map(submission => {
          const StatusIcon = statusConfig[submission.status].icon

          return (
            <Card
              key={submission.id}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {submission.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{submission.team}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{submission.submitted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={priorityConfig[submission.priority]}>
                      {submission.priority} priority
                    </Badge>
                    <Badge className={statusConfig[submission.status].color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {submission.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  {submission.description}
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Team Members
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {submission.members.map((member, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {member}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {submission.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Code className="h-3 w-3 mr-1" />
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {submission.track}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-blue-50 bg-transparent"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      GitHub
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-green-50 bg-transparent"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Demo
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Files
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Flag Issue
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredSubmissions.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No submissions found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
