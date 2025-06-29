"use client"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Award,
  MapPin,
  Calendar,
  Search,
  Filter,
  ExternalLink,
  Clock,
  Trophy,
  Building
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
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/DashboardUI/avatar"
import { Input } from "../../../components/CommonUI/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/CommonUI/tabs"
import { Progress } from "../../../components/DashboardUI/progress"
import { useAuth } from "../../../context/AuthContext"

export function ParticipantOverview() {
  const { user } = useAuth()
  const [hackathons, setHackathons] = useState([])
  const [selectedHackathon, setSelectedHackathon] = useState(null)
  const [participants, setParticipants] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Fetch hackathons created by the organizer
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/hackathons/my', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setHackathons(data)
        }
      } catch (error) {
        console.error('Error fetching hackathons:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHackathons()
  }, [])

  // Fetch participants for selected hackathon
  const fetchParticipants = async (hackathonId) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3000/api/registration/hackathon/${hackathonId}/participants`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setParticipants(data.participants)
        setAnalytics(data.analytics)
        setSelectedHackathon(data.hackathon)
      }
    } catch (error) {
      console.error('Error fetching participants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleHackathonClick = (hackathon) => {
    fetchParticipants(hackathon._id)
  }

  const handleBackToHackathons = () => {
    setSelectedHackathon(null)
    setParticipants([])
    setAnalytics({})
  }

  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeParticipants = filteredParticipants.filter(p => p.status === "Active")
  const inactiveParticipants = filteredParticipants.filter(p => p.status === "Inactive")

  const renderParticipantCard = participant => (
    <Card key={participant.id} className="pt-6">
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
              <Badge variant="default" className="bg-green-500">
                Registered
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span>{participant.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span>Joined {new Date(participant.registrationDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mb-3">
              <div>
                <p className="text-lg font-bold text-blue-600">
                  {participant.age || 'N/A'}
                </p>
                <p className="text-xs text-gray-500">Age</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">
                  {participant.gender || 'N/A'}
                </p>
                <p className="text-xs text-gray-500">Gender</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600">
                  {participant.track || 'N/A'}
                </p>
                <p className="text-xs text-gray-500">Track</p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              {participant.collegeOrCompany && (
                <div className="flex items-center gap-1 text-sm">
                  <Building className="w-3 h-3 text-gray-400" />
                  <span>{participant.collegeOrCompany}</span>
                </div>
              )}
              {participant.teamName && (
                <div className="flex items-center gap-1 text-sm">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span>Team: {participant.teamName}</span>
                </div>
              )}
            </div>

            {participant.projectIdea && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Project Idea:</p>
                <p className="text-sm text-gray-700 line-clamp-2">{participant.projectIdea}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Registered: {new Date(participant.registrationDate).toLocaleDateString()}</span>
              <div className="flex gap-2">
                {participant.github && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={participant.github} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      GitHub
                    </a>
                  </Button>
                )}
                {participant.linkedin && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={participant.linkedin} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderHackathonCard = hackathon => (
    <Card 
      key={hackathon._id} 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleHackathonClick(hackathon)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{hackathon.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {hackathon.description}
            </p>
          </div>
          <Badge 
            variant={hackathon.status === 'ongoing' ? 'default' : 
                   hackathon.status === 'upcoming' ? 'secondary' : 'outline'}
            className={hackathon.status === 'ongoing' ? 'bg-green-500' : ''}
          >
            {hackathon.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{new Date(hackathon.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{hackathon.location || 'Online'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">
                {hackathon.participants?.length || 0} / {hackathon.maxParticipants}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">
                ${hackathon.prizePool?.amount || 0}
              </span>
            </div>
          </div>
          <Button size="sm" variant="outline">
            View Participants
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show hackathon participants view
  if (selectedHackathon) {
    return (
      <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBackToHackathons}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hackathons
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedHackathon.title} - Participants
            </h1>
            <p className="text-sm text-gray-500">
              Manage and analyze participant engagement
            </p>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ACard>
            <ACardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {analytics.totalParticipants || 0}
                  </p>
                  <p className="text-sm text-gray-500">Total Participants</p>
                </div>
              </div>
            </ACardContent>
          </ACard>
          <ACard>
            <ACardContent className="pt-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {analytics.activeParticipants || 0}
                  </p>
                  <p className="text-sm text-gray-500">Active Now</p>
                </div>
              </div>
            </ACardContent>
          </ACard>
          <ACard>
            <ACardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{analytics.newThisMonth || 0}</p>
                  <p className="text-sm text-gray-500">New This Month</p>
                </div>
              </div>
            </ACardContent>
          </ACard>
          <ACard>
            <ACardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{analytics.averageAge || 0}</p>
                  <p className="text-sm text-gray-500">Average Age</p>
                </div>
              </div>
            </ACardContent>
          </ACard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Participants List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search participants..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All ({filteredParticipants.length})</TabsTrigger>
                <TabsTrigger value="active">
                  Active ({activeParticipants.length})
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive ({inactiveParticipants.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map(renderParticipantCard)
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No participants found</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="active" className="space-y-3">
                {activeParticipants.length > 0 ? (
                  activeParticipants.map(renderParticipantCard)
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No active participants</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="inactive" className="space-y-3">
                {inactiveParticipants.length > 0 ? (
                  inactiveParticipants.map(renderParticipantCard)
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No inactive participants</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-6">
            {/* Top Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Locations</CardTitle>
                <CardDescription>
                  Participant distribution by location
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3 space-y-3">
                {analytics.topCountries?.map((country, index) => (
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
                          (country.count / (analytics.totalParticipants || 1)) * 100
                        }
                        className="w-16 h-2"
                      />
                      <span className="text-sm font-medium">{country.count}</span>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No location data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Popular Tracks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Tracks</CardTitle>
                <CardDescription>Most chosen project tracks</CardDescription>
              </CardHeader>
              <CardContent className="pt-3 space-y-3">
                {analytics.skillDistribution?.map((skill, index) => (
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
                        value={(skill.count / (analytics.totalParticipants || 1)) * 100}
                        className="w-16 h-2"
                      />
                      <span className="text-sm font-medium">{skill.count}</span>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No track data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
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

  // Show hackathons list view
  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            My Hackathons
          </h1>
          <p className="text-sm text-gray-500">
            Select a hackathon to view its participants and analytics
          </p>
        </div>
      </div>

      {hackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map(renderHackathonCard)}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Hackathons Created</h3>
          <p className="text-gray-500 mb-4">
            You haven't created any hackathons yet. Create your first hackathon to start managing participants.
          </p>
          <Button>
            Create Hackathon
          </Button>
        </div>
      )}
    </div>
  )
}