"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trophy,
  Clock,
  ExternalLink,
  Heart,
  MapPin,
  Code,
  Star,
} from "lucide-react";

import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { ACard } from "../../../components/DashboardUI/AnimatedCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/CommonUI/tabs";
import { Skeleton } from "../../../components/DashboardUI/skeleton";

// Import the ProjectSubmission component
import ProjectSubmission from "./ProjectSubmission";
import { ProjectDetail } from "../../../components/CommonUI/ProjectDetail";
import { HackathonCard } from "../../../components/DashboardUI/HackathonCard";
import ParticipantSubmissionForm from "./ParticipantSubmitForm";


export default function MyHackathons() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [savedHackathons, setSavedHackathons] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingHackathons, setLoadingHackathons] = useState(true);
  const [savedLoading, setSavedLoading] = useState(true);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  // State to manage which view to show
  const [currentView, setCurrentView] = useState("dashboard"); // 'dashboard' or 'create-project'

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/projects/mine", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setProjects(data || []);
      } catch (err) {
        console.error("Failed to fetch projects", err);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch Hackathons
  useEffect(() => {
    const fetchRegisteredHackathons = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/registration/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        const formatted = data.map((reg) => {
          const h = reg.hackathonId;
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
          };
        });
        setHackathons(formatted);
      } catch (err) {
        console.error("Failed to fetch registered hackathons", err);
      } finally {
        setLoadingHackathons(false);
      }
    };

    const fetchSavedHackathons = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/users/me/saved-hackathons",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
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
        }));
        setSavedHackathons(formatted);
      } catch (err) {
        console.error("Failed to fetch saved hackathons", err);
      } finally {
        setSavedLoading(false);
      }
    };

    fetchRegisteredHackathons();
    fetchSavedHackathons();
  }, []);

  const handleHackathonClick = (hackathonId, hackathonTitle) => {
    navigate(
      `/dashboard/explore-hackathons?hackathon=${hackathonId}&title=${encodeURIComponent(
        hackathonTitle
      )}&source=my-hackathons`
    );
  };

  const handleCreateProject = () => {
    setCurrentView("create-project");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  const handleSaveProject = (projectData) => {
    console.log("Saving project:", projectData);
    // Here you would typically save the project to your backend
    // For now, we'll just add it to the local projects state
    const newProject = {
      _id: Date.now().toString(),
      title: projectData.title,
      builderName: "You", // or get from user context
      updatedAt: new Date().toISOString(),
      description: projectData.description,
      status: projectData.status,
    };

    setProjects((prev) => [newProject, ...(Array.isArray(prev) ? prev : [])]);

    // Show success message (you might want to add a toast notification here)
    alert("Project saved successfully!");

    // Optionally go back to dashboard
    setCurrentView("dashboard");
  };

  const handleExploreHackathons = () => {
    navigate("/dashboard/explore-hackathons");
  };

  // If we're in create project view, render the ProjectSubmission component
  if (currentView === "create-project") {
    return (
      <ProjectSubmission
        hackathonName={selectedHackathon?.name || "HackZen 2024"}
        hackathonId={selectedHackathon?.id || null}
        onBack={handleBackToDashboard}
        onSave={handleSaveProject}
      />
    );
  }

  const renderProjectCard = (project) => (
    <Card
      key={project._id}
      className="group w-full max-w-sm rounded-2xl bg-white/80 shadow-md hover:shadow-xl transition duration-300 border border-border/50 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-32 w-full bg-muted overflow-hidden">
        <img
          src={project.logo?.url || "/placeholder-image.png"}
          alt={project.title || "Project image"}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-indigo-500 text-white text-xs font-semibold shadow-sm">
            <Code className="w-3 h-3 mr-1" />
            Project
          </Badge>
        </div>
      </div>

      {/* Header */}
      <CardHeader className="px-4 pt-3 pb-1">
        <CardTitle className="text-lg font-semibold text-foreground line-clamp-1 transition group-hover:text-indigo-600">
          {project.title || "Untitled Project"}
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="px-4 pb-4 pt-2 space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last updated:</span>
          <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedProject(project)}
            className="w-full"
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setProjectToEdit(project);
              setEditMode(true);
              setCurrentView("edit-project");
            }}
            className="w-full"
          >
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => {
          setSelectedProject(null);
        }}
      />
    );
  }

  if (currentView === "edit-project" && projectToEdit) {
    return (
      <ProjectSubmission
        mode="edit"
        projectId={projectToEdit._id}
        initialData={projectToEdit}
        onBack={() => {
          setEditMode(false);
          setCurrentView("dashboard");
        }}
        onSave={(updated) => {
          // Replace the updated project in local state
          setProjects((prev) =>
            prev.map((p) => (p._id === updated._id ? updated : p))
          );
          setSelectedProject(updated);
          setEditMode(false);
          setCurrentView("dashboard");
        }}
      />
    );
  }

  const ProjectsSkeleton = () => (
    <Card className="w-full max-w-sm rounded-2xl bg-white/70 border border-border/30 shadow-sm">
      <div className="h-32 w-full bg-muted">
        <Skeleton className="h-full w-full" />
      </div>

      <CardHeader className="px-4 pt-3 pb-1 space-y-2">
        <Skeleton className="h-4 w-2/3 rounded-md" />
        <Skeleton className="h-3 w-5/6 rounded-md" />
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-2 space-y-3">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );

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
  );

  if (showSubmissionForm && selectedHackathon) {
  return (
    <ParticipantSubmissionForm
      hackathon={selectedHackathon}
      onBack={() => setShowSubmissionForm(false)}
      userProjects={projects} // ✅ This is what the form needs
    />
  );
}


  // Main dashboard view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="container mx-auto px-6 py-8 space-y-12">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                My Projects
              </h2>
              <p className="text-muted-foreground">
                Your creative coding projects
              </p>
            </div>
          </div>

          {loadingProjects ? (
            <ProjectsSkeleton />
          ) : (
            <div className="space-y-6">
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <Card
                    className="group border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-all duration-300 hover:shadow-lg bg-white/50"
                    onClick={handleCreateProject}
                  >
                    <CardContent className="h-full flex flex-col items-center justify-center text-center p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Plus className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Create New Project
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Start building something amazing
                      </p>
                    </CardContent>
                  </Card>
                  {projects.map(renderProjectCard)}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card
                    className="group border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-all duration-300 hover:shadow-lg bg-white/50 max-w-sm"
                    onClick={handleCreateProject}
                  >
                    <CardContent className="pt-8 flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Plus className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Create New Project
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Start building something amazing
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm lg:col-span-2">
                    <CardContent className="pt-8 flex flex-col items-center justify-center py-12 text-center">
                      <Code className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No Projects Yet
                      </h3>
                      <p className="text-muted-foreground">
                        You haven't created any projects yet. Start your coding
                        journey!
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Hackathons Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              My Hackathons
            </h2>
            <p className="text-muted-foreground">
              Track your hackathon participation and progress
            </p>
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
                  {hackathons.map((hackathon) => (
                    <HackathonCard
  key={hackathon.id}
  hackathon={hackathon}
  onClick={handleHackathonClick}
  onSubmitProject={(hackathon) => {
    setSelectedHackathon(hackathon);
    setShowSubmissionForm(true);
  }}
/>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-8 flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                      <Trophy className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No Registered Hackathons
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      You're not currently registered for any hackathons.
                      Explore exciting competitions and start building!
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {savedHackathons.map((hackathon) => (
                    <HackathonCard
                      key={hackathon.id}
                      hackathon={hackathon}
                      onClick={handleHackathonClick}
                      onSubmitProject={(hackathon) => {
                        setSelectedHackathon(hackathon);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-6">
                      <Heart className="w-8 h-8 text-pink-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      No Saved Hackathons
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                      You haven't saved any hackathons yet. Save interesting
                      competitions to participate later!
                    </p>
                    <Button
                      onClick={handleExploreHackathons}
                      variant="outline"
                      className="gap-2 bg-transparent"
                    >
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
  );
}