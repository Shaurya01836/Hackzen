"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../../../../../../components/CommonUI/card";
import { Skeleton } from "../../../../../../components/DashboardUI/skeleton";
import { ProjectCard } from "../../../../../../components/CommonUI/ProjectCard"; // ✅ adjust path
import { Rocket, Code2, FileText, Sparkles } from "lucide-react";

// Empty State Component (Adjusted for Card layout)
const EmptyProjectsState = ({ selectedType }) => {
  const getEmptyStateContent = () => {
    if (selectedType && selectedType !== "") {
      return {
        title: `No ${selectedType} submissions yet`,
        subtitle: `Be the first to submit a ${selectedType.toLowerCase()} for this hackathon!`,
        IconComponent: selectedType.toLowerCase() === 'ppt' ? FileText : Code2
      };
    }
    return {
      title: "No projects submitted yet",
      subtitle: "Be the first to showcase your innovative solution!",
      IconComponent: Rocket
    };
  };

  const { title, subtitle, IconComponent } = getEmptyStateContent();

  return (
    // Reduced padding (py-16) to fit nicely inside a CardContent
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Icon Container */}
        <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center mb-8 shadow-lg border border-blue-100/50">
          {/* Sparkle decoration */}
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
          <IconComponent className="w-16 h-16 text-blue-600" strokeWidth={1.5} />
        </div>
        
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
          {title}
        </h3>
        
        {/* Subtitle */}
        <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-md mx-auto">
          {subtitle}
        </p>
        
        {/* Decorative Elements */}
        <div className="flex justify-center items-center space-x-3 opacity-40">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default function HackathonProjectsGallery({ hackathonId, onProjectClick, selectedType }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [judgeScores, setJudgeScores] = useState([]);
  const navigate = useNavigate();

  // Get dynamic heading based on filter
  const getPageHeading = () => {
    if (selectedType && selectedType !== "") {
      return `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Submissions`;
    }
    return "Project Gallery";
  };

  // Fetch only submitted projects for the hackathon
  useEffect(() => {
    const fetchSubmittedProjects = async () => {
      setLoading(true);
      try {
        // 1. Fetch all submissions for this hackathon
        const submissionsRes = await axios.get(
          `/api/submission-form/admin/hackathon/${hackathonId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        const submissions = submissionsRes.data.submissions || [];

        // 2. Get all project-backed submissions
        const projectBackedSubmissions = submissions.filter((s) => s.projectId);
        const projectPromises = projectBackedSubmissions.map((s) => {
          const id = typeof s.projectId === "object" ? s.projectId._id : s.projectId;
          return axios.get(`/api/projects/${id}`).then((res) => ({
            ...res.data,
            type: "project",
            __submission: s, // ✅ attach corresponding submission
          }));
        });

        const projectsData = await Promise.all(projectPromises);

        // 3. Add standalone PPT submissions
        const pptSubmissions = submissions
          .filter((s) => s.pptFile && !s.projectId)
          .map((s) => ({
            ...s,
            type: "ppt",
            title: s.title || s.originalName || "PPT Submission",
            name: s.teamName || (s.team && s.team.name) || "-",
            status: s.status || "Submitted",
            submittedBy: s.submittedBy,
            submittedAt: s.submittedAt,
            pptFile: s.pptFile,
            logo: { url: "/assets/ppt.png" },
            likes: s.likes || 0,
            views: s.views || 0,
            __submission: s, // ✅ attach itself as submission
          }));

        // 4. Combine and set
        setProjects([...projectsData, ...pptSubmissions]);
      } catch (err) {
        console.error("Error fetching submitted projects for hackathon", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    if (hackathonId) fetchSubmittedProjects();
  }, [hackathonId]);

  // Fetch current user + judge scores if applicable
  useEffect(() => {
    const fetchUserAndScores = async () => {
      const token = localStorage.getItem("token");
      try {
        const userRes = await axios.get("http://localhost:3000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentUser = userRes.data;
        setUser(currentUser);

        if (currentUser.role === "judge") {
          const scoreRes = await axios.get("http://localhost:3000/api/scores/my-scored-projects", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setJudgeScores(scoreRes.data); // Array of submission IDs
        }
      } catch (err) {
        console.error("Failed to fetch user or judge scores", err);
      }
    };

    fetchUserAndScores();
  }, []);

  // Show skeletons while loading
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading Header */}
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        {/* Loading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-40 w-full" />
              <CardContent className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Filter by selected type
  const filteredProjects =
    selectedType && selectedType !== ""
      ? projects.filter((project) => {
          if (project.type) {
            return project.type.toLowerCase() === selectedType.toLowerCase();
          }
          return selectedType.toLowerCase() === "project";
        })
      : projects;

  // Show attractive empty state when no projects
  if (filteredProjects.length === 0) {
    return (
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {getPageHeading()}
          </h2>
          <p className="text-gray-600 text-lg">
            Discover innovative solutions and creative projects from talented participants
          </p>
        </div>
        
        {/* Empty State is now wrapped in a Card */}
        <Card>
          <CardContent className="pt-6">
            <EmptyProjectsState selectedType={selectedType} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          {getPageHeading()}
        </h2>
        <p className="text-gray-600 text-lg">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} submitted for this hackathon
        </p>
      </div>
      
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            user={user}
            judgeScores={judgeScores}
            onClick={() => {
              if (onProjectClick) {
                onProjectClick({ project, submission: project.__submission }); // ✅ Pass both
              } else {
                navigate(`/dashboard/project-archive/${project._id}`);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}