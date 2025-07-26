"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../../../components/CommonUI/card";
import { Skeleton } from "../../../components/DashboardUI/skeleton";
import { ProjectCard } from "../../../components/CommonUI/ProjectCard";
import { Rocket, Code2, FileText, Sparkles, Gavel } from "lucide-react";

// Empty State Component for Judges
const EmptyJudgeProjectsState = ({ selectedType }) => {
  const getEmptyStateContent = () => {
    if (selectedType && selectedType !== "") {
      return {
        title: `No ${selectedType} assignments yet`,
        subtitle: `You haven't been assigned any ${selectedType.toLowerCase()} submissions for this hackathon yet.`,
        IconComponent: selectedType.toLowerCase() === 'ppt' ? FileText : Code2
      };
    }
    return {
      title: "No assigned submissions yet",
      subtitle: "You haven't been assigned any submissions to evaluate yet. Please wait for the organizer to assign projects to you.",
      IconComponent: Gavel
    };
  };

  const { title, subtitle, IconComponent } = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Icon Container */}
        <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl flex items-center justify-center mb-8 shadow-lg border border-purple-100/50">
          {/* Sparkle decoration */}
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
          <IconComponent className="w-16 h-16 text-purple-600" strokeWidth={1.5} />
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
          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default function JudgeAssignedProjectsGallery({ hackathonId, onProjectClick, selectedType }) {
  const [assignedSubmissions, setAssignedSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [judgeScores, setJudgeScores] = useState([]);
  const navigate = useNavigate();

  // Get dynamic heading based on filter
  const getPageHeading = () => {
    if (selectedType && selectedType !== "") {
      return `Assigned ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Submissions`;
    }
    return "My Assigned Submissions";
  };

  // Fetch only assigned submissions for the judge
  useEffect(() => {
    const fetchAssignedSubmissions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        
        // Fetch judge's assigned submissions
        const response = await axios.get(`/api/judge-management/my-assignments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = response.data;
        const submissions = data.submissions || [];
        
        // Filter submissions for this specific hackathon
        const hackathonSubmissions = submissions.filter(sub => 
          sub.hackathonId === hackathonId
        );

        // Transform submissions into project format
        const projects = hackathonSubmissions.map(submission => {
          if (submission.pptFile) {
            // PPT submission
            return {
              ...submission,
              type: "ppt",
              title: submission.title || submission.originalName || "PPT Submission",
              name: submission.teamName || (submission.team && submission.team.name) || "-",
              status: submission.status || "Submitted",
              submittedBy: submission.submittedBy,
              submittedAt: submission.submittedAt,
              pptFile: submission.pptFile,
              logo: { url: "/assets/ppt.png" },
              likes: submission.likes || 0,
              views: submission.views || 0,
              __submission: submission,
            };
          } else {
            // Project submission
            return {
              ...submission,
              type: "project",
              title: submission.projectTitle || submission.title || "Project Submission",
              name: submission.teamName || (submission.team && submission.team.name) || "-",
              status: submission.status || "Submitted",
              submittedBy: submission.submittedBy,
              submittedAt: submission.submittedAt,
              logo: submission.logo || { url: "/assets/default-banner.png" },
              likes: submission.likes || 0,
              views: submission.views || 0,
              __submission: submission,
            };
          }
        });

        setAssignedSubmissions(projects);
      } catch (err) {
        console.error("Error fetching assigned submissions", err);
        setAssignedSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    if (hackathonId) fetchAssignedSubmissions();
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
      ? assignedSubmissions.filter((project) => {
          if (project.type) {
            return project.type.toLowerCase() === selectedType.toLowerCase();
          }
          return selectedType.toLowerCase() === "project";
        })
      : assignedSubmissions;

  // Show attractive empty state when no projects
  if (filteredProjects.length === 0) {
    return (
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{getPageHeading()}</h2>
          <p className="text-gray-600">
            {selectedType && selectedType !== ""
              ? `${filteredProjects.length} ${selectedType} submissions assigned to you`
              : `${filteredProjects.length} submissions assigned to you`}
          </p>
        </div>
        
        {/* Empty State */}
        <Card>
          <CardContent className="p-0">
            <EmptyJudgeProjectsState selectedType={selectedType} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">{getPageHeading()}</h2>
        <p className="text-gray-600">
          {selectedType && selectedType !== ""
            ? `${filteredProjects.length} ${selectedType} submissions assigned to you`
            : `${filteredProjects.length} submissions assigned to you`}
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <ProjectCard
            key={project._id || index}
            project={project}
            submission={project.__submission}
            onClick={() => onProjectClick({ project, submission: project.__submission })}
            user={user}
            judgeScores={judgeScores}
            isJudgeView={true}
          />
        ))}
      </div>
    </div>
  );
} 