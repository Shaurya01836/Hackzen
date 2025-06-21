
"use client"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
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
} from "../../../components/CommonUI/card"
import {
  ACard,
  ACardContent,
  ACardDescription,
  ACardHeader,
  ACardTitle
} from "../../../components/DashboardUI/AnimatedCard"
import { Button } from "../../../components/CommonUI/button"
import { Badge } from "../../../components/CommonUI/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../../../components/CommonUI/tabs"
import { Progress } from "../../../components/DashboardUI/progress"

export function CreatedHackathons({ onBack, onCreateNew }) {
   const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([])

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:3000/api/hackathons", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        setHackathons(data)
      } catch (err) {
        console.error("Failed to load hackathons", err)
      }
    }

    fetchHackathons()
  }, [])

  const liveHackathons = hackathons.filter(h => h.status === "ongoing")
  const completedHackathons = hackathons.filter(h => h.status === "ended")
  const draftHackathons = hackathons.filter(h => h.status === "draft")
  const registrationOpenHackathons = hackathons.filter(
    h => new Date(h.registrationDeadline) > new Date()
  )

  const getStatusColor = status => {
    switch (status) {
      case "ongoing":
        return "bg-green-500"
      case "ended":
        return "bg-gray-500"
      case "draft":
        return "bg-yellow-500"
      case "upcoming":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const renderHackathonCard = hackathon => (
    <Card key={hackathon._id} className="">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{hackathon.title}</CardTitle>
            <CardDescription className="mt-1">
              {hackathon.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${getStatusColor(hackathon.status)}`}
            >
              {hackathon.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>
              {new Date(hackathon.startDate).toLocaleDateString()} -{" "}
              {new Date(hackathon.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-gray-500" />
            <span>
              {hackathon.prizePool?.amount
                ? `$${hackathon.prizePool.amount}`
                : "No Prize"}{" "}
              prize pool
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span>
            {hackathon.participantCount || 0}/{hackathon.maxParticipants} participants
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <span>{hackathon.submissions?.length || 0} submissions</span>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Participation</span>
              <span>
                {Math.round(
                  ((hackathon.participants?.length || 0) /
                    hackathon.maxParticipants) *
                    100
                )}
                %
              </span>
            </div>
            <Progress
              value={
                ((hackathon.participantCount || 0) /
                  hackathon.maxParticipants) *
                100
              }
              className="h-2"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Badge variant="outline">{hackathon.category}</Badge>
          <Badge variant="outline">
            {hackathon.judges?.length || 0} judges
          </Badge>
          <Badge variant="outline">{hackathon.tags?.join(", ")}</Badge>
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
          {hackathon.status === "draft" && (
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
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
          variant="default"
          size="sm"
          onClick={() => {
            if (onBack) onBack();
            navigate("/dashboard");
          }}
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
        <Button
          className="flex items-center gap-2"
          onClick={onCreateNew}
        >
          <Plus className="w-4 h-4" />
          Create New Hackathon
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{hackathons.length}</p>
                <p className="text-sm text-gray-500">Total Events</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                {hackathons.reduce((sum, h) => sum + (h.participantCount || 0), 0)}
                </p>
                <p className="text-sm text-gray-500">Total Participants</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                {hackathons.reduce((sum, h) => sum + (h.submissions?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-500">Total Submissions</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{liveHackathons.length}</p>
                <p className="text-sm text-gray-500">Active Now</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="registration">Registration Open</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>
        <TabsContent value="live" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {liveHackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>
        <TabsContent value="registration" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {registrationOpenHackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedHackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>
        <TabsContent value="draft" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {draftHackathons.map(renderHackathonCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
