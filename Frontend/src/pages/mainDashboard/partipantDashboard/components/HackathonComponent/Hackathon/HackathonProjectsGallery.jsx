"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/CommonUI/card";
import { Skeleton } from "../../../../../../components/DashboardUI/skeleton";
import { ProjectCard } from "../../../../../../components/CommonUI/ProjectCard";
import { Rocket, Code2, FileText, Sparkles, FolderOpen } from "lucide-react";

// Empty State Component (Adjusted for consistent design)
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
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
        <IconComponent className="w-8 h-8 text-indigo-600" />
      </div>
      <h4 className="text-2xl font-bold text-gray-800 mb-3">{title}</h4>
      <p className="text-gray-700 leading-relaxed text-lg mb-6 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default function HackathonProjectsGallery({ hackathonId, onProjectClick, selectedType, sectionRef }) {
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

  // Show skeletons while loading
  if (loading) {
    return (
      <section ref={sectionRef} className="space-y-6 max-w-5xl mx-auto">
        <Card className="shadow-none hover:shadow-none">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-1 h-8 bg-indigo-500 rounded-full"></div>
              <Skeleton className="h-8 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-40 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="space-y-6 max-w-5xl mx-auto">
      {/* Main Container Card */}
      <Card className="shadow-none hover:shadow-none">
        {/* Section Header */}
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-1 h-8 bg-indigo-500 rounded-full"></div>
            {getPageHeading()}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Projects Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 my-4">
              <h3 className="text-xl font-semibold text-gray-900">Submitted Projects</h3>
            </div>
            
            {filteredProjects.length === 0 ? (
              <EmptyProjectsState selectedType={selectedType} />
            ) : (
              <div className="">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} submitted for this hackathon
                </p>
                
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
                          onProjectClick({ project, submission: project.__submission });
                        } else {
                          navigate(`/dashboard/project-archive/${project._id}`);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
