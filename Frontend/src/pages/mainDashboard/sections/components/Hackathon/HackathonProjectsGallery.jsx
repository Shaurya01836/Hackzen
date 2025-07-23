"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../../../../../components/CommonUI/card";
import { Skeleton } from "../../../../../components/DashboardUI/skeleton";
import { ProjectCard } from "../../../../../components/CommonUI/ProjectCard"; // ✅ adjust path

export default function HackathonProjectsGallery({ hackathonId, onProjectClick, selectedType }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [judgeScores, setJudgeScores] = useState([]);
  const navigate = useNavigate();

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
            logo: { url: "/assets/default-banner.png" },
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

  if (filteredProjects.length === 0) {
    return <p className="text-center text-gray-500">No projects submitted yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
  );
}
