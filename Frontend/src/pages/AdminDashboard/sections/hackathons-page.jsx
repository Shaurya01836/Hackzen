"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import {
  RCard,
  RCardContent,
  RCardHeader,
  RCardTitle,
} from "../../../components/CommonUI/RippleCard";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import { Input } from "../../../components/CommonUI/input";
import {
  Plus,
  Search,
  Calendar,
  Users,
  Trophy,
  Eye,
  FolderCode,
  Download,
  User,
  Shuffle,
} from "lucide-react";
import { CreateHackathon } from "./CreateHackathon";
import { ProjectDetail } from "../../../components/CommonUI/ProjectDetail";

export function HackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [fullProject, setFullProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/hackathons");
        setHackathons(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch hackathons");
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  const filteredHackathons = hackathons.filter(
    (hackathon) =>
      hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hackathon.organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-orange-500 text-white border-orange-500/30";
      case "ended":
        return "bg-red-600 text-white border-red-500/30";
      case "ongoing":
        return "bg-green-500 text-white border-green-500/30";
      default:
        return "bg-gray-500 text-white border-gray-500/30";
    }
  };

  const handleCreateHackathon = (hackathonData) => {
    console.log("Creating hackathon:", hackathonData);
    setShowCreateForm(false);
  };

  const handleViewSubmissions = async (hackathon) => {
    setSelectedHackathon(hackathon);
    setSubmissions([]);
    setSubmissionsLoading(true);
    setSubmissionsError(null);
    try {
      const res = await axios.get(`/api/submission-form/admin/hackathon/${hackathon._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      setSubmissionsError("Failed to fetch submissions");
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleViewDetails = async (submission) => {
    setSelectedSubmission(submission);
    setFullProject(null);
    setProjectLoading(true);
    setProjectError(null);
    try {
      const res = await fetch(`/api/projects/${submission.projectId?._id || submission.projectId}`);
      if (!res.ok) throw new Error("Failed to fetch project details");
      const data = await res.json();
      setFullProject(data);
    } catch (err) {
      setProjectError(err.message || "Error fetching project details");
    } finally {
      setProjectLoading(false);
    }
  };

  if (loading) return <p className="text-gray-700">Loading hackathons...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {!showCreateForm ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              Hackathons Management
            </h1>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Hackathon
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
            <Input
              placeholder="Search hackathons by title or organizer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-purple-500/20 text-black placeholder-gray-600"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((hackathon) => (
              <RCard key={hackathon._id}>
                <RCardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <RCardTitle className="text-gray-800 text-lg mb-2 transition-colors">
                        {hackathon.title}
                      </RCardTitle>
                      <p className="text-gray-600 text-sm">
                        by {hackathon.organizer?.name || "Unknown"}
                      </p>
                    </div>
                    <Badge className={getStatusColor(hackathon.status)}>
                      {hackathon.status}
                    </Badge>
                  </div>
                </RCardHeader>
                <RCardContent className="space-y-4">
                  <div className="flex items-center text-gray-700 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                    {formatDate(hackathon.startDate)} — {formatDate(hackathon.endDate)}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-700 text-sm">
                      <Users className="w-4 h-4 mr-2 text-blue-500" />
                      {hackathon.participants?.length || 0} participants
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                      {hackathon.prizePool?.amount
                        ? `${hackathon.prizePool.amount} ${hackathon.prizePool.currency}`
                        : "N/A"}{" "}
                      pool
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm">
                    <FolderCode className="w-4 h-4 mr-2 text-yellow-500" />
                    {hackathon.submissions?.length || 0} submissions received
                  </div>
                  <Button
                    variant="outline"
                    className="mt-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    onClick={() => handleViewSubmissions(hackathon)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Submissions
                  </Button>
                </RCardContent>
              </RCard>
            ))}
          </div>
        </>
      ) : (
        <CreateHackathon
          onBack={() => setShowCreateForm(false)}
          onSave={handleCreateHackathon}
        />
      )}
      {/* Submissions Modal */}
      {selectedHackathon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => { setSelectedHackathon(null); setSelectedSubmission(null); }}
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-purple-700">
              Submissions for {selectedHackathon.title}
            </h2>
            {submissionsLoading ? (
              <div className="p-10 text-center text-lg">Loading submissions...</div>
            ) : submissionsError ? (
              <div className="p-10 text-center text-red-500">{submissionsError}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-purple-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Project</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Team</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Submitted By</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Submitted At</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-gray-500">No submissions found.</td>
                      </tr>
                    ) : (
                      submissions.map((submission) => (
                        <tr key={submission._id} className="hover:bg-purple-50">
                          <td className="px-4 py-2">
                            <div className="font-medium text-gray-800">{submission.projectId?.title || "Untitled Project"}</div>
                            <div className="text-xs text-gray-500">{submission.projectId?.description?.slice(0, 40) || ""}</div>
                          </td>
                          <td className="px-4 py-2">{submission.teamName || "-"}</td>
                          <td className="px-4 py-2">{submission.submittedByName || "-"}</td>
                          <td className="px-4 py-2">{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : "-"}</td>
                          <td className="px-4 py-2">
                            <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700">
                              {submission.status || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-black"
                              onClick={() => handleViewDetails(submission)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {/* Submission Details Modal */}
            {selectedSubmission && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-0 relative overflow-y-auto max-h-[95vh]">
                  {projectLoading ? (
                    <div className="p-10 text-center text-lg">Loading project details...</div>
                  ) : projectError ? (
                    <div className="p-10 text-center text-red-500">{projectError}</div>
                  ) : fullProject ? (
                    <ProjectDetail
                      project={fullProject}
                      onBack={() => setSelectedSubmission(null)}
                      backButtonLabel="Back to Submissions"
                    />
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
