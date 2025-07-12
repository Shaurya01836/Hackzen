"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  Award,
  Upload,
  Calendar,
  Users,
  ExternalLink,
  Eye,
} from "lucide-react";
import {
  ACard,
  ACardContent,
} from "../../../components/DashboardUI/AnimatedCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/CommonUI/tabs";
import { Badge } from "../../../components/CommonUI/badge";

export function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!user || !user._id) {
          setError("User not found. Please login again.");
          return;
        }

        const res = await axios.get(
          `http://localhost:3000/api/submission-form/submissions?userId=${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError("Failed to load submissions. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  // For stats and tabs, you can categorize by status or other fields if needed
  const total = submissions.length;
  const judged = submissions.filter((s) => s.status === "reviewed").length;
  const pending = submissions.filter((s) => s.status !== "reviewed").length;

  // Render a card for each submission
  const renderSubmissionCard = (sub) => {
    const projectTitle = sub.projectId?.title || "Untitled Project";
    const hackathonName = sub.hackathonId?.title || sub.hackathonId?.name || "Unknown Hackathon";
    const projectDescription = sub.projectId?.description || "No description available";
    const projectLogo = sub.projectId?.logo?.url || "/assets/default-banner.png";
    
    return (
      <ACard key={sub._id} className="hover:shadow-xl transition-all duration-300 rounded-2xl p-0 flex flex-col items-center bg-white/80 border border-indigo-100">
        <div className="w-full flex flex-col items-center p-4 pb-0">
          <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center mb-2">
            <img
              src={projectLogo}
              alt={projectTitle}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = "/assets/default-banner.png"; }}
            />
          </div>
          <div className="font-extrabold text-xl text-gray-900 text-center mb-1 truncate w-full">{projectTitle}</div>
          <div className="flex items-center justify-center text-gray-700 text-sm mb-1 gap-1">
            <Calendar className="w-4 h-4" />
            <span className="truncate">{hackathonName}</span>
          </div>
          <div className="text-gray-500 text-xs text-center mb-2 line-clamp-2 w-full">{projectDescription}</div>
        </div>
        <div className="flex flex-col items-center w-full px-4 pb-4 mt-auto">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant={sub.status === "reviewed" ? "default" : "secondary"}
              className={sub.status === "reviewed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
            >
              {sub.status === "reviewed" ? "Judged" : "Pending Review"}
            </Badge>
            <button
              className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold underline ml-2"
              onClick={() => setSelectedSubmission(sub)}
            >
              View Details
            </button>
          </div>
          <div className="text-xs text-gray-400 text-center">
            Submitted: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "-"}
          </div>
        </div>
      </ACard>
    );
  };

  if (selectedSubmission) {
    const projectTitle = selectedSubmission.projectId?.title || "Untitled Project";
    const hackathonName = selectedSubmission.hackathonId?.title || selectedSubmission.hackathonId?.name || "Unknown Hackathon";
    const projectDescription = selectedSubmission.projectId?.description || "No description available";
    const projectLogo = selectedSubmission.projectId?.logo?.url || "/assets/default-banner.png";
    const links = selectedSubmission.projectId?.links || {};
    const attachments = selectedSubmission.projectId?.attachments || [];
    const videoLink = links?.video || selectedSubmission.projectId?.videoLink || null;
    const githubLink = links?.github || selectedSubmission.projectId?.repoLink || null;
    const websiteLink = links?.website || selectedSubmission.projectId?.websiteLink || null;
    const figmaLink = links?.figma || null;
    const problemStatement = selectedSubmission.problemStatement;
    const customAnswers = selectedSubmission.customAnswers || [];

    return (
      <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 md:min-h-screen">
        <ACard className="max-w-2xl mx-auto rounded-2xl shadow-xl border border-indigo-100 bg-white/90">
          <ACardContent className="p-6">
            <button
              className="mb-4 text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
              onClick={() => setSelectedSubmission(null)}
            >
              ← Back to My Submissions
            </button>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center mb-4">
                <img
                  src={projectLogo}
                  alt={projectTitle}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = "/assets/default-banner.png"; }}
                />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">{projectTitle}</h2>
              <div className="text-lg text-gray-600 mb-2 flex items-center gap-2 justify-center">
                <Calendar className="w-5 h-5" />
                {hackathonName}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <Badge
                  variant={selectedSubmission.status === "reviewed" ? "default" : "secondary"}
                  className={selectedSubmission.status === "reviewed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                >
                  {selectedSubmission.status === "reviewed" ? "Judged" : "Pending Review"}
                </Badge>
                <span className="text-sm text-gray-500">
                  Submitted: {selectedSubmission.submittedAt ? new Date(selectedSubmission.submittedAt).toLocaleString() : "-"}
                </span>
              </div>
              <p className="text-gray-700 text-base mb-4 text-center max-w-xl">{projectDescription}</p>
              {problemStatement && (
                <div className="w-full mb-4">
                  <div className="font-semibold text-gray-800 mb-1">Problem Statement</div>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-700 text-sm border border-gray-200">{problemStatement}</div>
                </div>
              )}
              {customAnswers.length > 0 && (
                <div className="w-full mb-4">
                  <div className="font-semibold text-gray-800 mb-1">Custom Answers</div>
                  <ul className="space-y-2">
                    {customAnswers.map((ans, idx) => (
                      <li key={idx} className="bg-gray-50 rounded-lg p-3 text-gray-700 text-sm border border-gray-200">
                        <span className="font-medium">Q:</span> {ans.questionId}<br />
                        <span className="font-medium">A:</span> {ans.answer}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="w-full flex flex-col gap-2 mb-4">
                {videoLink && (
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Demo Video</div>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-black">
                      <iframe
                        src={videoLink.replace('watch?v=', 'embed/')}
                        title="Demo Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-64 rounded-lg border-none"
                      />
                    </div>
                  </div>
                )}
                {githubLink && (
                  <div>
                    <a href={githubLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" /> GitHub Repository
                    </a>
                  </div>
                )}
                {websiteLink && (
                  <div>
                    <a href={websiteLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" /> Live Website
                    </a>
                  </div>
                )}
                {figmaLink && (
                  <div>
                    <a href={figmaLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" /> Figma Design
                    </a>
                  </div>
                )}
                {attachments.length > 0 && (
                  <div>
                    <div className="font-semibold text-gray-800 mb-1">Attachments</div>
                    <ul className="list-disc list-inside text-sm text-indigo-700">
                      {attachments.map((file, idx) => (
                        <li key={idx}>
                          <a href={file.url || file} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {file.name || (typeof file === 'string' ? file : 'Attachment')}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </ACardContent>
        </ACard>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 md:min-h-screen">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Submissions</h1>
            <p className="text-sm text-gray-500">Loading your submissions...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <ACard key={i}>
              <ACardContent className="pt-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </ACardContent>
            </ACard>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 md:min-h-screen">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Submissions</h1>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      </div>
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
                <p className="text-2xl font-bold">{total}</p>
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
                <p className="text-2xl font-bold">{judged}</p>
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
                <p className="text-2xl font-bold">{pending}</p>
                <p className="text-sm text-gray-500">Pending Review</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({total})</TabsTrigger>
          <TabsTrigger value="judged">Judged ({judged})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {submissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {submissions.map(renderSubmissionCard)}
            </div>
          ) : (
            <ACard>
              <ACardContent className="flex flex-col items-center justify-center py-12">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Submissions Yet
                </h3>
                <p className="text-gray-500 text-center">
                  You haven't submitted any projects yet. Start by exploring hackathons and submitting your projects!
                </p>
              </ACardContent>
            </ACard>
          )}
        </TabsContent>

        <TabsContent value="judged">
          {judged > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {submissions.filter((s) => s.status === "reviewed").map(renderSubmissionCard)}
            </div>
          ) : (
            <ACard>
              <ACardContent className="flex flex-col items-center justify-center py-12">
                <Award className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Judged Submissions
                </h3>
                <p className="text-gray-500 text-center">
                  Your submissions are still being reviewed by judges.
                </p>
              </ACardContent>
            </ACard>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pending > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {submissions.filter((s) => s.status !== "reviewed").map(renderSubmissionCard)}
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
