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

  const renderSubmissionCard = (submission) => {
    return (
      <ACard
        key={submission._id}
        className="w-full max-w-xs flex flex-col overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg bg-white border border-indigo-100"
      >
        {/* Banner / Logo */}
        <div className="relative h-32 w-full bg-indigo-50 flex items-center justify-center">
          <img
            src={
              submission.logo?.url ||
              "https://www.hackquest.io/images/layout/hackathon_cover.png"
            }
            alt={submission.title}
            className="w-full h-full object-cover"
          />
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={submission.scores?.length > 0 ? "deafault" : "outline"}
              className="font-semibold shadow"
            >
              {submission.scores?.length > 0 ? "Judged" : "Submitted"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          {/* Title */}
          <h3 className="text-lg font-semibold text-indigo-700 leading-tight line-clamp-2">
            {submission.title}
          </h3>
          {/* One-line intro */}
          <p className="text-sm text-gray-600 mb-1 line-clamp-2">
            {submission.oneLineIntro || "No summary available"}
          </p>
        </div>
      </ACard>
    );
  };

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

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({projects.length})</TabsTrigger>
          <TabsTrigger value="judged">
            Judged ({judgedSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingSubmissions.length})
          </TabsTrigger>
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
