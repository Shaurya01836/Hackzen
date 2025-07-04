"use client";

import {
  ArrowLeft,
  FileText,
  Github,
  Youtube,
  Award,
  ExternalLink,
  Upload,
} from "lucide-react";
import {
  ACard,
  ACardContent,
  ACardDescription,
  ACardHeader,
  ACardTitle,
} from "../../../components/DashboardUI/AnimatedCard";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/CommonUI/tabs";
import { useEffect, useState } from "react";
import axios from "axios";

export function MySubmissions() {
  const [projects, setProjects] = useState([]);

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

  const renderSubmissionCard = (submission) => (
    <ACard key={submission._id} className="hover:ring-2 hover:ring-indigo-300">
      <ACardHeader>
        <div className="flex items-start justify-between">
          <div className="flex gap-3 items-center">
            {submission.logo?.url && (
              <img
                src={submission.logo.url}
                alt="logo"
                className="w-10 h-10 rounded-md object-cover"
              />
            )}
            <div>
              <ACardTitle className="text-lg text-indigo-700">
                {submission.title}
              </ACardTitle>
              <ACardDescription className="mt-1 text-sm">
                {submission.oneLineIntro || "No summary available"}
              </ACardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={submission.scores?.length > 0 ? "default" : "secondary"}
            >
              {submission.scores?.length > 0 ? "Judged" : "Submitted"}
            </Badge>
          </div>
        </div>
      </ACardHeader>
      <ACardContent className="pt-4 space-y-4">
        <div className="flex flex-wrap gap-1">
          {submission.skills?.map((skill) => (
            <Badge
              key={skill}
              className="bg-indigo-100 text-indigo-700"
              variant="outline"
            >
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          {submission.repoLink && (
            <Button
              size="sm"
              variant="default"
              className="flex items-center gap-1"
              onClick={() => window.open(submission.repoLink, "_blank")}
            >
              <Github className="w-3 h-3" /> GitHub
            </Button>
          )}
          {submission.videoLink && (
            <Button
              size="sm"
              variant="default"
              className="flex items-center gap-1"
              onClick={() => window.open(submission.videoLink, "_blank")}
            >
              <Youtube className="w-3 h-3" /> Video
            </Button>
          )}
          {submission.websiteLink && (
            <Button
              size="sm"
              variant="default"
              className="flex items-center gap-1"
              onClick={() => window.open(submission.websiteLink, "_blank")}
            >
              <ExternalLink className="w-3 h-3" /> Live
            </Button>
          )}
        </div>
      </ACardContent>
    </ACard>
  );

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Submissions</h1>
          <p className="text-sm text-gray-500">
            Track your project submissions and results
          </p>
        </div>
      </div>

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
                <p className="text-2xl font-bold">{pendingSubmissions.length}</p>
                <p className="text-sm text-gray-500">Pending Review</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({projects.length})</TabsTrigger>
          <TabsTrigger value="judged">Judged ({judgedSubmissions.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingSubmissions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map(renderSubmissionCard)}
          </div>
        </TabsContent>

        <TabsContent value="judged" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {judgedSubmissions.map(renderSubmissionCard)}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
