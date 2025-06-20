"use client"
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Users,
  Clock,
  ExternalLink
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

const hackathons = [
  {
    id: 1,
    name: "AI Innovation Challenge",
    status: "Live",
    deadline: "2 days left",
    participants: 156,
    description: "Build innovative AI solutions for real-world problems",
    prize: "$10,000",
    startDate: "Dec 15, 2024",
    endDate: "Dec 22, 2024",
    category: "Artificial Intelligence",
    difficulty: "Advanced",
    registered: true,
    submitted: false
  },
  {
    id: 2,
    name: "Web3 Builder Fest",
    status: "Closed",
    deadline: "Ended",
    participants: 89,
    description:
      "Create decentralized applications using blockchain technology",
    prize: "$5,000",
    startDate: "Nov 20, 2024",
    endDate: "Nov 27, 2024",
    category: "Blockchain",
    difficulty: "Intermediate",
    registered: true,
    submitted: true
  },
  {
    id: 3,
    name: "Mobile App Marathon",
    status: "Upcoming",
    deadline: "5 days to start",
    participants: 234,
    description: "Develop mobile applications for iOS and Android",
    prize: "$7,500",
    startDate: "Jan 10, 2025",
    endDate: "Jan 17, 2025",
    category: "Mobile Development",
    difficulty: "Beginner",
    registered: false,
    submitted: false
  },
  {
    id: 4,
    name: "Cybersecurity Challenge",
    status: "Live",
    deadline: "1 week left",
    participants: 78,
    description: "Solve security vulnerabilities and build secure systems",
    prize: "$12,000",
    startDate: "Dec 10, 2024",
    endDate: "Dec 24, 2024",
    category: "Security",
    difficulty: "Advanced",
    registered: true,
    submitted: false
  }
]

export function MyHackathons({ onBack }) {
  const activeHackathons = hackathons.filter(h => h.status === "Live")
  const completedHackathons = hackathons.filter(h => h.status === "Closed")
  const upcomingHackathons = hackathons.filter(h => h.status === "Upcoming")

  const renderHackathonCard = hackathon => (
   <Card
  key={hackathon.id}
  className="hover:scale-[1.01] transition-all duration-200 ease-in-out shadow-md border border-gray-200 bg-white/80 backdrop-blur-sm"
>
  <CardHeader>
    <div className="flex items-start justify-between">
      <div>
        <CardTitle className="text-lg font-semibold text-indigo-700">
          {hackathon.name}
        </CardTitle>
        <CardDescription className="mt-1 text-gray-600">
          {hackathon.description}
        </CardDescription>
      </div>
      <Badge
        variant={
          hackathon.status === "Live"
            ? "default"
            : hackathon.status === "Closed"
            ? "secondary"
            : "outline"
        }
        className={`capitalize ${
          hackathon.status === "Live"
            ? "bg-green-500 text-white"
            : hackathon.status === "Closed"
            ? "bg-gray-400 text-white"
            : "border-indigo-300 text-indigo-600"
        }`}
      >
        {hackathon.status}
      </Badge>
    </div>
  </CardHeader>
  <CardContent className="pt-4 space-y-4">
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-indigo-500" />
        <span>
          {hackathon.startDate} - {hackathon.endDate}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-indigo-500" />
        <span>{hackathon.participants} participants</span>
      </div>
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4 text-indigo-500" />
        <span>{hackathon.prize} prize pool</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-indigo-500" />
        <span>{hackathon.deadline}</span>
      </div>
    </div>

    <div className="flex gap-2 flex-wrap">
      <Badge className="" variant="outline">
        {hackathon.category}
      </Badge>
      <Badge className="" variant="outline">
        {hackathon.difficulty}
      </Badge>
    </div>

    <div className="flex gap-2 pt-2 flex-wrap">
      {hackathon.registered ? (
        <>
          <Button
            size="sm"
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <ExternalLink className="w-3 h-3" />
            View Details
          </Button>
          {hackathon.status === "Live" && !hackathon.submitted && (
            <Button size="sm" variant="default">
              Submit Project
            </Button>
          )}
          {hackathon.submitted && (
            <Button size="sm" variant="outline" disabled>
              Submitted ✓
            </Button>
          )}
        </>
      ) : (
        <Button
          size="sm"
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
        >
          Register Now
        </Button>
      )}
    </div>
  </CardContent>
</Card>

  )

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="flex items-center gap-4">
        <Button
          variant="default"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Hackathons</h1>
          <p className="text-sm text-gray-500">
            Track your hackathon participation and progress
          </p>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeHackathons.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingHackathons.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedHackathons.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeHackathons.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeHackathons.map(renderHackathonCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Active Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  You're not currently participating in any active hackathons.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingHackathons.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingHackathons.map(renderHackathonCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Upcoming Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  No upcoming hackathons registered yet.
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
      </Tabs>
    </div>
  )
}
