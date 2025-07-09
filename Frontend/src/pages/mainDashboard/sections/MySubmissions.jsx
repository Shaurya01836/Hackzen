"use client";

import {
  FileText,
  Award,
  Upload,
  Search,
  Code,
} from "lucide-react";
import {
  ACard,
  ACardContent,
} from "../../../components/DashboardUI/AnimatedCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/CommonUI/tabs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ProjectCard } from "../../../components/CommonUI/ProjectCard";
import { ProjectDetail } from "../../../components/CommonUI/ProjectDetail";
import { useLocation } from "react-router-dom";

export function MySubmissions() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Support direct linking to a project detail
  useEffect(() => {
    const match = location.pathname.match(/my-submissions\/(\w+)/);
    const urlProjectId = match ? match[1] : null;
    if (urlProjectId && projects.length > 0) {
      const found = projects.find((p) => p._id === urlProjectId);
      if (found) setSelectedProject(found);
    }
  }, [location.pathname, projects]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/projects/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const submitted = res.data.filter((p) => p.status === "submitted");
        setProjects(submitted);
      } catch (err) {
        console.error("Error fetching submitted projects:", err);
      }
    };

    fetchProjects();
  }, []);

  const judgedSubmissions = projects.filter((p) => p.scores?.length > 0);
  const pendingSubmissions = projects.filter((p) => p.scores?.length === 0);

const renderSubmissionCard = (project) => (
  <ProjectCard
    key={project._id}
    project={project}
    onClick={() => {
      setSelectedProject(project);
      navigate(`/dashboard/my-submissions/${project._id}`);
    }}
    showActions={true}
    highlightAuthor={true}
    compact={false}
  />
);



  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => {
          setSelectedProject(null);
          navigate("/dashboard/my-submissions");
        }}
        backButtonLabel="Back to My Submissions"
      />
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 md:min-h-screen">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Submissions</h1>
          <p className="text-sm text-gray-500">
            Track your project submissions and results
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-gray-500">Total Submissions</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{judgedSubmissions.length}</p>
                <p className="text-sm text-gray-500">Judged</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Upload className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {pendingSubmissions.length}
                </p>
                <p className="text-sm text-gray-500">Pending Review</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({projects.length})</TabsTrigger>
          <TabsTrigger value="judged">Judged ({judgedSubmissions.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingSubmissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map(renderSubmissionCard)}
          </div>
        </TabsContent>

        <TabsContent value="judged">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {judgedSubmissions.map(renderSubmissionCard)}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          {pendingSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {pendingSubmissions.map(renderSubmissionCard)}
            </div>
          ) : (
            <ACard>
              <ACardContent className="flex flex-col items-center justify-center py-12">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Pending Submissions
                </h3>
                <p className="text-gray-500 text-center">
                  All your submissions have been reviewed.
                </p>
              </ACardContent>
            </ACard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
