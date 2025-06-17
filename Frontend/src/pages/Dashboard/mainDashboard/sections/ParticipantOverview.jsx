"use client"
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Award,
  MapPin,
  Calendar,
  Search,
  Filter
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../AdimPage/components/ui/card"
import { Button } from "../../AdimPage/components/ui/button"
import { Badge } from "../../AdimPage/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../AdimPage/components/ui/avatar"
import { Input } from "../../AdimPage/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../AdimPage/components/ui/tabs"
import { Progress } from "../../AdimPage/components/ui/progress"

const participants = [
  {
    id: 1,
    name: "Alex Chen",
    email: "alex.chen@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "San Francisco, CA",
    joinedDate: "Nov 2024",
    hackathonsParticipated: 8,
    hackathonsWon: 2,
    currentHackathons: ["AI Innovation Challenge"],
    skills: ["React", "Python", "Machine Learning"],
    status: "Active",
    lastActive: "2 hours ago",
    submissions: 6,
    averageScore: 87
  },
  {
    id: 2,
    name: "Sarah Kim",
    email: "sarah.kim@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "New York, NY",
    joinedDate: "Oct 2024",
    hackathonsParticipated: 12,
    hackathonsWon: 3,
    currentHackathons: ["AI Innovation Challenge", "Cybersecurity Challenge"],
    skills: ["Node.js", "Blockchain", "UI/UX"],
    status: "Active",
    lastActive: "1 hour ago",
    submissions: 10,
    averageScore: 92
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Austin, TX",
    joinedDate: "Sep 2024",
    hackathonsParticipated: 5,
    hackathonsWon: 1,
    currentHackathons: [],
    skills: ["Flutter", "Firebase", "Swift"],
    status: "Inactive",
    lastActive: "1 week ago",
    submissions: 4,
    averageScore: 78
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Seattle, WA",
    joinedDate: "Dec 2024",
    hackathonsParticipated: 3,
    hackathonsWon: 0,
    currentHackathons: ["AI Innovation Challenge"],
    skills: ["Vue.js", "Django", "PostgreSQL"],
    status: "Active",
    lastActive: "30 min ago",
    submissions: 2,
    averageScore: 85
  }
]

const analytics = {
  totalParticipants: 479,
  activeParticipants: 156,
  newThisMonth: 45,
  averageAge: 26,
  topCountries: [
    { name: "United States", count: 180 },
    { name: "India", count: 95 },
    { name: "Canada", count: 67 },
    { name: "United Kingdom", count: 43 },
    { name: "Germany", count: 38 }
  ],
  skillDistribution: [
    { skill: "JavaScript", count: 234 },
    { skill: "Python", count: 198 },
    { skill: "React", count: 167 },
    { skill: "Node.js", count: 145 },
    { skill: "Machine Learning", count: 123 }
  ]
}

export function ParticipantOverview({ onBack }) {
  const activeParticipants = participants.filter(p => p.status === "Active")
  const inactiveParticipants = participants.filter(p => p.status === "Inactive")

  const renderParticipantCard = participant => (
    <Card key={participant.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={participant.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {participant.name
                .split(" ")
                .map(n => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium">{participant.name}</h3>
                <p className="text-sm text-gray-500">{participant.email}</p>
              </div>
              <Badge
                variant={
                  participant.status === "Active" ? "default" : "secondary"
                }
                className={
                  participant.status === "Active" ? "bg-green-500" : ""
                }
              >
                {participant.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span>{participant.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span>Joined {participant.joinedDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mb-3">
              <div>
                <p className="text-lg font-bold text-blue-600">
                  {participant.hackathonsParticipated}
                </p>
                <p className="text-xs text-gray-500">Hackathons</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">
                  {participant.hackathonsWon}
                </p>
                <p className="text-xs text-gray-500">Wins</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600">
                  {participant.averageScore}
                </p>
                <p className="text-xs text-gray-500">Avg Score</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {participant.skills.slice(0, 3).map(skill => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {participant.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{participant.skills.length - 3} more
                </Badge>
              )}
            </div>

            {participant.currentHackathons.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">
                  Currently participating in:
                </p>
                {participant.currentHackathons.map(hackathon => (
                  <Badge
                    key={hackathon}
                    variant="outline"
                    className="text-xs mr-1"
                  >
                    {hackathon}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Last active: {participant.lastActive}</span>
              <Button size="sm" variant="outline">
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Participant Overview
          </h1>
          <p className="text-sm text-gray-500">
            Monitor and analyze participant engagement
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {analytics.totalParticipants}
                </p>
                <p className="text-sm text-gray-500">Total Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {analytics.activeParticipants}
                </p>
                <p className="text-sm text-gray-500">Active Now</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{analytics.newThisMonth}</p>
                <p className="text-sm text-gray-500">New This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{analytics.averageAge}</p>
                <p className="text-sm text-gray-500">Average Age</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participants List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search participants..." className="pl-10" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All ({participants.length})</TabsTrigger>
              <TabsTrigger value="active">
                Active ({activeParticipants.length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                Inactive ({inactiveParticipants.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {participants.map(renderParticipantCard)}
            </TabsContent>

            <TabsContent value="active" className="space-y-3">
              {activeParticipants.map(renderParticipantCard)}
            </TabsContent>

            <TabsContent value="inactive" className="space-y-3">
              {inactiveParticipants.map(renderParticipantCard)}
            </TabsContent>
          </Tabs>
        </div>

        {/* Analytics Sidebar */}
        <div className="space-y-6">
          {/* Top Countries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Countries</CardTitle>
              <CardDescription>
                Participant distribution by location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.topCountries.map((country, index) => (
                <div
                  key={country.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">#{index + 1}</span>
                    <span className="text-sm">{country.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={
                        (country.count / analytics.totalParticipants) * 100
                      }
                      className="w-16 h-2"
                    />
                    <span className="text-sm font-medium">{country.count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Popular Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Skills</CardTitle>
              <CardDescription>Most common technologies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analytics.skillDistribution.map((skill, index) => (
                <div
                  key={skill.skill}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">#{index + 1}</span>
                    <span className="text-sm">{skill.skill}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(skill.count / analytics.totalParticipants) * 100}
                      className="w-16 h-2"
                    />
                    <span className="text-sm font-medium">{skill.count}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Export Participant Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award className="w-4 h-4 mr-2" />
                Send Certificates
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
