"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trophy, Users, Clock, ExternalLink, Heart, MapPin, Code, Star } from "lucide-react"

import { Button } from "../../../components/CommonUI/button"
import { Badge } from "../../../components/CommonUI/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/CommonUI/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/CommonUI/tabs"
import { Skeleton } from "../../../components/DashboardUI/skeleton"

// Import the ProjectSubmission component
import ProjectSubmission from "./ProjectSubmission"

export default function MyHackathons() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [hackathons, setHackathons] = useState([])
  const [savedHackathons, setSavedHackathons] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingHackathons, setLoadingHackathons] = useState(true)
  const [savedLoading, setSavedLoading] = useState(true)

  // State to manage which view to show
  const [currentView, setCurrentView] = useState("dashboard") // 'dashboard' or 'create-project'

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/projects/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await res.json()
        setProjects(data || [])
      } catch (err) {
        console.error("Failed to fetch projects", err)
        setProjects([])
      } finally {
        setLoadingProjects(false)
      }
    }

    fetchProjects()
  }, [])

  // Fetch Hackathons
  useEffect(() => {
    const fetchRegisteredHackathons = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/registration/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await res.json()
        const formatted = data.map((reg) => {
          const h = reg.hackathonId
          return {
            id: h._id,
            name: h.title,
            image: h.images?.banner?.url,
            images: h.images,
            status: h.status,
            deadline: new Date(h.registrationDeadline).toDateString(),
            participants: h.participants?.length || 0,
            description: h.description,
            prize: `$${h.prizePool?.amount?.toLocaleString()}`,
            startDate: new Date(h.startDate).toDateString(),
            endDate: new Date(h.endDate).toDateString(),
            category: h.category,
            difficulty: h.difficultyLevel,
            registered: true,
            submitted: false,
          }
        })
        setHackathons(formatted)
      } catch (err) {
        console.error("Failed to fetch registered hackathons", err)
      } finally {
        setLoadingHackathons(false)
      }
    }

    const fetchSavedHackathons = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/me/saved-hackathons", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await res.json()
        const formatted = data.map((h) => ({
          id: h._id,
          name: h.title,
          image: h.images?.banner?.url,
          images: h.images,
          status: h.status,
          deadline: new Date(h.registrationDeadline).toDateString(),
          participants: h.participants?.length || 0,
          description: h.description,
          prize: `$${h.prizePool?.amount?.toLocaleString()}`,
          startDate: new Date(h.startDate).toDateString(),
          endDate: new Date(h.endDate).toDateString(),
          category: h.category,
          difficulty: h.difficultyLevel,
          registered: false,
          submitted: false,
        }))
        setSavedHackathons(formatted)
      } catch (err) {
        console.error("Failed to fetch saved hackathons", err)
      } finally {
        setSavedLoading(false)
      }
    }

    fetchRegisteredHackathons()
    fetchSavedHackathons()
  }, [])

  const handleHackathonClick = (hackathonId, hackathonTitle) => {
    navigate(`/dashboard/explore-hackathons?hackathon=${hackathonId}&title=${encodeURIComponent(hackathonTitle)}`)
  }

  const handleCreateProject = () => {
    setCurrentView("create-project")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
  }

  const handleSaveProject = (projectData) => {
    console.log("Saving project:", projectData)
    // Here you would typically save the project to your backend
    // For now, we'll just add it to the local projects state
    const newProject = {
      _id: Date.now().toString(),
      title: projectData.title,
      builderName: "You", // or get from user context
      updatedAt: new Date().toISOString(),
      description: projectData.description,
      status: projectData.status,
    }

    setProjects((prev) => [newProject, ...prev])

    // Show success message (you might want to add a toast notification here)
    alert("Project saved successfully!")

    // Optionally go back to dashboard
    setCurrentView("dashboard")
  }

  const handleExploreHackathons = () => {
    navigate("/dashboard/explore-hackathons")
  }

  // If we're in create project view, render the ProjectSubmission component
  if (currentView === "create-project") {
    return (
      <ProjectSubmission
        hackathonName="HackZen 2024"
        teamLeaderName="Nitin Jain" // You might want to get this from user context
        onBack={handleBackToDashboard}
        onSave={handleSaveProject}
      />
    )
  }

  const renderHackathonCard = (hackathon) => (
    <Card
      key={hackathon.id}
      className="group w-full max-w-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
      onClick={() => handleHackathonClick(hackathon.id, hackathon.name)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={
            hackathon.image ||
            "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop"
          }
          alt={hackathon.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold shadow-lg border-0">
            <Trophy className="w-3 h-3 mr-1" />
            {hackathon.prize || "TBA"}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-lg line-clamp-2 drop-shadow-lg">{hackathon.name}</h3>
        </div>
      </div>

      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs">{hackathon.deadline}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="text-xs">{hackathon.participants}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-xs">{hackathon.location || "Online"}</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {hackathon.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {hackathon.difficulty}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )

  const renderProjectCard = (project) => (
    <Card
      key={project._id}
      className="group w-full max-w-sm hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {project.title || "Untitled Project"}
            </CardTitle>
            <CardDescription className="text-sm">by {project.builderName || "Unknown"}</CardDescription>
          </div>
          <Code className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated</span>
          <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          View Project
        </Button>
      </CardContent>
    </Card>
  )

  const ProjectsSkeleton = () => (
    <div className="flex gap-4 flex-wrap">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="w-full max-w-sm">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const HackathonsSkeleton = () => (
    <div className="flex gap-4 flex-wrap">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="w-full max-w-sm">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Main dashboard view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="container mx-auto px-6 py-8 space-y-12">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">My Projects</h2>
              <p className="text-muted-foreground">Your creative coding projects</p>
            </div>
          </div>

          {loadingProjects ? (
            <ProjectsSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <Card
                className="group border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-all duration-300 hover:shadow-lg bg-white/50"
                onClick={handleCreateProject}
              >
                <CardContent className="pt-8 flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Create New Project</h3>
                  <p className="text-sm text-muted-foreground">Start building something amazing</p>
                </CardContent>
              </Card>

              {projects.length > 0 ? (
                projects.map(renderProjectCard)
              ) : (
                <Card className="col-span-full">
                  <CardContent className="pt-8 flex flex-col items-center justify-center py-12 text-center">
                    <Code className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Projects Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't created any projects yet. Start your coding journey!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </section>

        {/* Hackathons Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Hackathons</h2>
            <p className="text-muted-foreground">Track your hackathon participation and progress</p>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className=" grid w-full max-w-md grid-cols-2 ">
              <TabsTrigger value="active" className="flex gap-2">
                <Trophy className="w-4 h-4" />
                Registered ({hackathons.length})
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex gap-2">
                <Heart className="w-4 h-4" />
                Saved ({savedHackathons.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {loadingHackathons ? (
                <HackathonsSkeleton />
              ) : hackathons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hackathons.map(renderHackathonCard)}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-8 flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                      <Trophy className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Registered Hackathons</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      You're not currently registered for any hackathons. Explore exciting competitions and start
                      building!
                    </p>
                    <Button onClick={handleExploreHackathons} className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Explore Hackathons
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              {savedLoading ? (
                <HackathonsSkeleton />
              ) : savedHackathons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedHackathons.map(renderHackathonCard)}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-6">
                      <Heart className="w-8 h-8 text-pink-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Saved Hackathons</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      You haven't saved any hackathons yet. Save interesting competitions to participate later!
                    </p>
                    <Button onClick={handleExploreHackathons} variant="outline" className="gap-2 bg-transparent">
                      <Star className="w-4 h-4" />
                      Browse Hackathons
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  )
}
