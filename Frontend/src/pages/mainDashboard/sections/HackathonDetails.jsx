"use client"
import { useState } from "react"
import {
  ArrowLeft,
  Calendar,
  Users,
  Trophy,
  MapPin,
  Clock,
  Star,
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  Globe,
  Building,
  Award,
  Target,
  Gift,
  MessageSquare,
  UserPlus,
  Download
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../../components/CommonUI/card"
import { Button } from "../../../components/CommonUI/button"
import { Badge } from "../../../components/CommonUI/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/DashboardUI/avatar"
import { Progress } from "../../../components/DashboardUI/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/CommonUI/tabs"

export function HackathonDetails({ hackathon, onBack }) {
  const [isRegistered, setIsRegistered] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const getDifficultyColor = difficulty => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500"
      case "Intermediate":
        return "bg-yellow-500"
      case "Advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case "Registration Open":
        return "bg-green-500"
      case "Ongoing":
        return "bg-blue-500"
      case "Ended":
        return "bg-gray-500"
      default:
        return "bg-yellow-500"
    }
  }

  const handleRegister = () => {
    setIsRegistered(!isRegistered)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Explore
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {hackathon.name}
                </h1>
                <p className="text-sm text-gray-500">
                  by {hackathon.organizer}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className={`flex items-center gap-2 ${
                  isSaved ? "text-red-500 border-red-500" : ""
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                size="sm"
                onClick={handleRegister}
                className={`${
                  isRegistered
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                {isRegistered ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Registered
                  </>
                ) : (
                  "Register Now"
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Image */}
            <div className="lg:col-span-2">
              <div className="relative">
                <img
                  src={
                    hackathon.image || "/placeholder.svg?height=400&width=800"
                  }
                  alt={hackathon.name}
                  className="w-full h-80 object-cover rounded-lg"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {hackathon.featured && (
                    <Badge className="bg-purple-500">Featured</Badge>
                  )}
                  {hackathon.sponsored && (
                    <Badge
                      variant="outline"
                      className="border-yellow-500 text-yellow-600 bg-white"
                    >
                      Sponsored
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-4 right-4">
                  <Badge
                    className={`${getStatusColor(hackathon.status)} text-white`}
                  >
                    {hackathon.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Prize Pool
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">
                    {hackathon.prize}
                  </p>
                  <p className="text-sm text-gray-500">Total rewards</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Participation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Registered</span>
                    <span>
                      {hackathon.participants}/{hackathon.maxParticipants}
                    </span>
                  </div>
                  <Progress
                    value={
                      (hackathon.participants / hackathon.maxParticipants) * 100
                    }
                    className="h-2"
                  />
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{hackathon.rating}</span>
                    </div>
                    <span className="text-gray-500">
                      ({hackathon.reviews} reviews)
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Registration Deadline:
                    </span>
                    <span className="font-medium">
                      {hackathon.registrationDeadline}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Event Start:</span>
                    <span className="font-medium">{hackathon.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Event End:</span>
                    <span className="font-medium">{hackathon.endDate}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="problems">Problems</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="prizes">Prizes & Perks</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Hackathon</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {hackathon.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Organizer Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Organizer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage
                            src={hackathon.organizerLogo || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {hackathon.organizer[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {hackathon.organizer}
                          </h3>
                          <p className="text-gray-600">Event Organizer</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">
                              <Globe className="w-4 h-4 mr-2" />
                              Website
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Event Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{hackathon.location}</p>
                          <p className="text-sm text-gray-500">Location</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{hackathon.category}</p>
                          <p className="text-sm text-gray-500">Category</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-gray-500" />
                        <div>
                          <Badge
                            className={`${getDifficultyColor(
                              hackathon.difficulty
                            )} text-white`}
                          >
                            {hackathon.difficulty}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            Difficulty Level
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Technologies & Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {hackathon.tags.map(tag => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-sm"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="problems" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Problem Statements
                  </CardTitle>
                  <CardDescription>
                    Choose from these exciting challenges to work on during the
                    hackathon
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hackathon.problemStatements?.map((problem, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">
                        Problem {index + 1}
                      </h3>
                      <p className="text-gray-700">{problem}</p>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-8">
                      Problem statements will be announced soon!
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {hackathon.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-500" />
                      What You'll Need
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>
                          Laptop/Computer with development environment
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Stable internet connection</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Team of 2-4 members (optional)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>GitHub account for code submission</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="prizes" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Prize Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <div>
                          <p className="font-semibold">First Place</p>
                          <p className="text-2xl font-bold text-yellow-600">
                            $25,000
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                          2
                        </div>
                        <div>
                          <p className="font-semibold">Second Place</p>
                          <p className="text-2xl font-bold text-gray-600">
                            $15,000
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          3
                        </div>
                        <div>
                          <p className="font-semibold">Third Place</p>
                          <p className="text-2xl font-bold text-orange-600">
                            $10,000
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-purple-500" />
                      Perks & Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {hackathon.perks.map((perk, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Gift className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Event Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <div className="w-0.5 h-16 bg-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Registration Opens</h3>
                        <p className="text-sm text-gray-500">
                          Now - {hackathon.registrationDeadline}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Sign up and form your team
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <div className="w-0.5 h-16 bg-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Hackathon Begins</h3>
                        <p className="text-sm text-gray-500">
                          {hackathon.startDate}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Opening ceremony and problem statement release
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <div className="w-0.5 h-16 bg-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Development Phase</h3>
                        <p className="text-sm text-gray-500">
                          {hackathon.startDate} - {hackathon.endDate}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Build your solution with mentor support
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Submission & Judging</h3>
                        <p className="text-sm text-gray-500">
                          {hackathon.endDate}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Submit your project and present to judges
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Join the Discussion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Join Discord Server
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Find Teammates
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resources
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Recent Participants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32`}
                            />
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">User {i}</p>
                            <p className="text-xs text-gray-500">
                              Joined 2 hours ago
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
