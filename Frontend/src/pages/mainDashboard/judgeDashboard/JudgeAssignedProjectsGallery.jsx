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
  
  console.log('🔍 Frontend - JudgeAssignedProjectsGallery props:', {
    hackathonId,
    selectedType
  });
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
      console.log('🔍 Frontend - Fetching assigned submissions for hackathonId:', hackathonId);
      try {
        const token = localStorage.getItem("token");
        
        // Fetch judge's assigned submissions
        const response = await axios.get(`/api/judge-management/my-assignments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = response.data;
        const submissions = data.submissions || [];
        
        console.log('🔍 Frontend - API Response:', {
          totalSubmissions: submissions.length,
          hackathonId,
          submissions: submissions.map(s => ({
            id: s._id,
            title: s.projectTitle || s.title,
            hackathonId: s.hackathonId?._id || s.hackathonId
          }))
        });
        
        // Filter submissions for this specific hackathon
        const hackathonSubmissions = submissions.filter(sub => {
          // Check both hackathonId and hackathonId._id (in case it's populated)
          const submissionHackathonId = sub.hackathonId?._id || sub.hackathonId;
          const submissionHackathonIdStr = submissionHackathonId?.toString();
          const expectedHackathonIdStr = hackathonId?.toString();
          
          console.log('🔍 Frontend - Filtering submission:', {
            submissionId: sub._id,
            submissionHackathonId,
            submissionHackathonIdStr,
            expectedHackathonIdStr,
            matches: submissionHackathonId === hackathonId || submissionHackathonIdStr === expectedHackathonIdStr
          });
          
          // If no hackathonId is provided, show all submissions
          if (!hackathonId) {
            return true;
          }
          
          const matches = submissionHackathonId === hackathonId || submissionHackathonIdStr === expectedHackathonIdStr;
          return matches;
        });
        
        console.log('🔍 Frontend - Filtered submissions:', hackathonSubmissions.length);

        // Transform submissions into project format
        const projects = await Promise.all(hackathonSubmissions.map(async (submission) => {
          // Ensure submittedBy has proper structure
          const submittedBy = submission.submittedBy ? {
            _id: submission.submittedBy._id || submission.submittedBy,
            name: submission.submittedBy.name || submission.submittedBy.email || "Unknown",
            email: submission.submittedBy.email || "",
            profileImage: submission.submittedBy.profileImage || "",
            role: submission.submittedBy.role || "Contributor"
          } : {
            _id: "unknown",
            name: "Unknown",
            email: "",
            profileImage: "",
            role: "Contributor"
          };

          if (submission.pptFile) {
            // PPT submission
            return {
              ...submission,
              type: "ppt",
              title: submission.title || submission.originalName || "PPT Submission",
              name: submission.teamName || (submission.team && submission.team.name) || "-",
              status: submission.status || "Submitted",
              submittedBy: submittedBy,
              submittedAt: submission.submittedAt,
              pptFile: submission.pptFile,
              logo: { url: "/assets/ppt.png" },
              likes: submission.likes || 0,
              views: submission.views || 0,
              __submission: submission,
            };
          } else {
            // Project submission - fetch complete project data
            const projectId = submission.projectId?._id || submission.projectId;
            
            if (projectId) {
              try {
                // Fetch complete project data from API
                const projectResponse = await axios.get(`/api/projects/${projectId}`);
                const fullProjectData = projectResponse.data;
                
                return {
                  ...fullProjectData, // Use complete project data
                  type: "project",
                  submittedBy: submittedBy,
                  submittedAt: submission.submittedAt,
                  __submission: submission, // Keep submission reference
                };
              } catch (projectErr) {
                console.error(`Failed to fetch project ${projectId}:`, projectErr);
                // Fallback to submission data
                const projectData = submission.projectId || submission.project || submission;
                const projectLogo = projectData?.logo || 
                                   projectData?.images?.[0] || 
                                   submission.logo || 
                                   { url: "/assets/default-banner.png" };
                
                return {
                  ...submission,
                  type: "project",
                  title: projectData?.projectTitle || projectData?.title || submission.projectTitle || submission.title || "Project Submission",
                  name: submission.teamName || (submission.team && submission.team.name) || "-",
                  status: submission.status || "Submitted",
                  submittedBy: submittedBy,
                  submittedAt: submission.submittedAt,
                  logo: projectLogo,
                  likes: submission.likes || 0,
                  views: submission.views || 0,
                  __submission: submission,
                };
              }
            } else {
              // No project ID, use submission data
              const projectData = submission.project || submission;
              const projectLogo = projectData?.logo || 
                                 projectData?.images?.[0] || 
                                 submission.logo || 
                                 { url: "/assets/default-banner.png" };
              
              return {
                ...submission,
                type: "project",
                title: projectData?.projectTitle || projectData?.title || submission.projectTitle || submission.title || "Project Submission",
                name: submission.teamName || (submission.team && submission.team.name) || "-",
                status: submission.status || "Submitted",
                submittedBy: submittedBy,
                submittedAt: submission.submittedAt,
                logo: projectLogo,
                likes: submission.likes || 0,
                views: submission.views || 0,
                __submission: submission,
              };
            }
          }
        }));

        setAssignedSubmissions(projects);
      } catch (err) {
        console.error("Error fetching assigned submissions", err);
        console.error("Error details:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data
        });
        
        // Show user-friendly error message
        if (err.response?.status === 500) {
          console.error("Server error - check backend logs");
        }
        
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
        const userRes = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const currentUser = userRes.data;
        setUser(currentUser);

        if (currentUser.role === "judge") {
          // TODO: Implement judge scores endpoint
  
          setJudgeScores([]); // Empty array for now
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