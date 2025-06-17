"use client"
import {
  ArrowLeft,
  Plus,
  Users,
  Calendar,
  Trophy,
  Settings,
  Eye,
  Edit,
  Trash2,
  BarChart3
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../AdimPage/components/ui/tabs"
import { Progress } from "../../AdimPage/components/ui/progress"

const hackathons = [
  {
    id: 1,
    name: "AI Innovation Challenge",
    status: "Live",
    participants: 156,
    submissions: 89,
    startDate: "Dec 15, 2024",
    endDate: "Dec 22, 2024",
    prize: "$10,000",
    category: "Artificial Intelligence",
    description: "Build innovative AI solutions for real-world problems",
    registrationDeadline: "Dec 14, 2024",
    submissionDeadline: "Dec 21, 2024",
    maxParticipants: 200,
    judgesAssigned: 5,
    sponsorCount: 3
  },
  {
    id: 2,
    name: "Web3 Builder Fest",
    status: "Completed",
    participants: 89,
    submissions: 67,
    startDate: "Nov 20, 2024",
    endDate: "Nov 27, 2024",
    prize: "$5,000",
    category: "Blockchain",
    description:
      "Create decentralized applications using blockchain technology",
    registrationDeadline: "Nov 19, 2024",
    submissionDeadline: "Nov 26, 2024",
    maxParticipants: 100,
    judgesAssigned: 3,
    sponsorCount: 2
  },
  {
    id: 3,
    name: "Mobile App Marathon",
    status: "Draft",
    participants: 0,
    submissions: 0,
    startDate: "Jan 10, 2025",
    endDate: "Jan 17, 2025",
    prize: "$7,500",
    category: "Mobile Development",
    description: "Develop mobile applications for iOS and Android",
    registrationDeadline: "Jan 9, 2025",
    submissionDeadline: "Jan 16, 2025",
    maxParticipants: 150,
    judgesAssigned: 0,
    sponsorCount: 1
  },
  {
    id: 4,
    name: "Cybersecurity Challenge",
    status: "Registration Open",
    participants: 45,
    submissions: 0,
    startDate: "Jan 5, 2025",
    endDate: "Jan 12, 2025",
    prize: "$12,000",
    category: "Security",
    description: "Solve security vulnerabilities and build secure systems",
    registrationDeadline: "Jan 4, 2025",
    submissionDeadline: "Jan 11, 2025",
    maxParticipants: 80,
    judgesAssigned: 4,
    sponsorCount: 4
  }
]

export function CreatedHackathons({ onBack }) {
  const liveHackathons = hackathons.filter(h => h.status === "Live")
  const completedHackathons = hackathons.filter(h => h.status === "Completed")
  const draftHackathons = hackathons.filter(h => h.status === "Draft")
  const registrationOpenHackathons = hackathons.filter(
    h => h.status === "Registration Open"
  )

  const getStatusColor = status => {
    switch (status) {
      case "Live":
        return "bg-green-500"
      case "Completed":
        return "bg-gray-500"
      case "Registration Open":
        return "bg-blue-500"
      case "Draft":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const renderHackathonCard = hackathon => (
    <Card key={hackathon.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{hackathon.name}</CardTitle>
            <CardDescription className="mt-1">
              {hackathon.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${getStatusColor(hackathon.status)} text-white`}
            >
              {hackathon.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>
              {hackathon.startDate} - {hackathon.endDate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gray-500" />
            <span>{hackathon.prize} prize pool</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>
              {hackathon.participants}/{hackathon.maxParticipants} participants
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <span>{hackathon.submissions} submissions</span>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Participation</span>
              <span>
                {Math.round(
                  (hackathon.participants / hackathon.maxParticipants) * 100
                )}
                %
              </span>
            </div>
            <Progress
              value={(hackathon.participants / hackathon.maxParticipants) * 100}
              className="h-2"
            />
          </div>
          {hackathon.status === "Live" && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Submission Rate</span>
                <span>
                  {hackathon.participants > 0
                    ? Math.round(
                        (hackathon.submissions / hackathon.participants) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  hackathon.participants > 0
                    ? (hackathon.submissions / hackathon.participants) * 100
                    : 0
                }
                className="h-2"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Badge variant="outline">{hackathon.category}</Badge>
          <Badge variant="outline">{hackathon.judgesAssigned} judges</Badge>
          <Badge variant="outline">{hackathon.sponsorCount} sponsors</Badge>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            View Details
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <Edit className="w-3 h-3" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <BarChart3 className="w-3 h-3" />
            Analytics
          </Button>
          {hackathon.status === "Draft" && (
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
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
              Created Hackathons
            </h1>
            <p className="text-sm text-gray-500">
              Manage and monitor your organized events
            </p>
          </div>
        </div>
        <Button className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600">
          <Plus className="w-4 h-4" />
          Create New Hackathon
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{hackathons.length}</p>
                <p className="text-sm text-gray-500">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {hackathons.reduce((sum, h) => sum + h.participants, 0)}
                </p>
                <p className="text-sm text-gray-500">Total Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {hackathons.reduce((sum, h) => sum + h.submissions, 0)}
                </p>
                <p className="text-sm text-gray-500">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{liveHackathons.length}</p>
                <p className="text-sm text-gray-500">Active Now</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Events ({hackathons.length})
          </TabsTrigger>
          <TabsTrigger value="live">Live ({liveHackathons.length})</TabsTrigger>
          <TabsTrigger value="registration">
            Registration ({registrationOpenHackathons.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedHackathons.length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts ({draftHackathons.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          {liveHackathons.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveHackathons.map(renderHackathonCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Live Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  You don't have any live hackathons at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="registration" className="space-y-4">
          {registrationOpenHackathons.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {registrationOpenHackathons.map(renderHackathonCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Registration Open
                </h3>
                <p className="text-gray-500 text-center">
                  No hackathons currently accepting registrations.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedHackathons.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedHackathons.map(renderHackathonCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Completed Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  You haven't completed any hackathons yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {draftHackathons.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {draftHackathons.map(renderHackathonCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Edit className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Draft Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  All your hackathons have been published.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
