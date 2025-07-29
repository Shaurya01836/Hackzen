"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  Github,
  Heart,
  Share2,
  Users,
  Play,
  Clock,
  Award,
  Code,
  Layers,
  UserPlus,
  Copy,
  Globe,
  Eye,
  FileText,
  Download,
  ExternalLink,
  User,
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "../DashboardUI/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card";
import { useToast } from "../../hooks/use-toast";
import JudgeEvaluation from "./JudgeEvaluation";
import JudgeScoreForm from "../../pages/mainDashboard/partipantDashboard/components/HackathonComponent/Scoring/JudgeScoreForm";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../DashboardUI/dialog";
import {
  SiWhatsapp,
  SiFacebook,
  SiX,
  SiTelegram,
  SiLinkedin,
} from "react-icons/si";
import {
  Share2 as Share2Icon,
  Heart as HeartIcon,
  Copy as CopyIcon,
} from "lucide-react";
import { ACard } from "../DashboardUI/AnimatedCard";
import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HackathonCard } from "../DashboardUI/HackathonCard";
import axios from "axios";

export function ProjectDetail({
  project,
  submission, // require submission object
  onBack,
  backButtonLabel,
  hideBackButton = false,
  onlyOverview = false,
  evaluations = [],
  averages = null,
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [likeCount, setLikeCount] = useState(project.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [fullHackathon, setFullHackathon] = useState(
    typeof project.hackathon === "object" && project.hackathon && project.hackathon.title
      ? project.hackathon
      : null
  );
  const [pptLoading, setPptLoading] = useState(true);
  const [viewCount, setViewCount] = useState(project.views || 0);
  const [showJudgeForm, setShowJudgeForm] = useState(false);

  // On mount, check if this project is liked in localStorage
  useEffect(() => {
    const likedProjects = JSON.parse(
      localStorage.getItem("likedProjects") || "{}"
    );
    setIsLiked(!!likedProjects[project._id]);
  }, [project._id]);

  useEffect(() => {
    console.log('[ProjectDetail] submission prop:', submission);
    if (submission && submission._id) {
      console.log('[ProjectDetail] submission._id:', submission._id);
    }
  }, [submission]);

  // Update fullHackathon when project changes
  useEffect(() => {
    if (project.hackathon && typeof project.hackathon === "object" && project.hackathon.title) {
      setFullHackathon(project.hackathon);
    } else {
      setFullHackathon(null);
    }
  }, [project.hackathon]);

  

  // Like handler (public, no login required)
  const handleLike = async () => {
    if (!user || !user._id) {
      toast({
        title: "Login Required",
        description: "Please log in to like projects.",
        duration: 2000,
      });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      let res;
      if (project.type && project.type.toLowerCase() === "ppt") {
        res = await fetch(
          `/api/submission-form/${project._id}/like`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        res = await fetch(
          `/api/projects/${project._id}/like`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (!res.ok) throw new Error("Failed to like");
      const data = await res.json();
      setIsLiked(data.liked);
      setLikeCount(data.likes);
      // Persist like in localStorage
      const likedProjects = JSON.parse(
        localStorage.getItem("likedProjects") || "{}"
      );
      if (data.liked) {
        likedProjects[project._id] = true;
      } else {
        delete likedProjects[project._id];
      }
      localStorage.setItem("likedProjects", JSON.stringify(likedProjects));
      if (data.message) {
        toast({
          title: data.liked ? "Liked!" : "Unliked!",
          description: data.message,
          duration: 2000,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to like",
        duration: 2000,
      });
    }
  };
  // Share handler (opens modal)
  const handleShare = () => setShareOpen(true);
  const projectUrl = `${window.location.origin}/dashboard/project-archive/${project._id}`;
  const handleCopy = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(projectUrl);
        toast({
          title: "Link Copied!",
          description: "Project link copied to clipboard.",
          duration: 2000,
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to copy link",
          duration: 2000,
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Clipboard not available",
        duration: 2000,
      });
    }
  };
  const handleSocialShare = (platform) => {
    let url = "";
    const encoded = encodeURIComponent(projectUrl);
    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${encoded}`;
        break;
      case "telegram":
        url = `https://t.me/share/url?url=${encoded}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encoded}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;
        break;
      case "instagram":
        toast({
          title: "Not Supported",
          description: "Instagram does not support direct web sharing.",
          duration: 2000,
        });
        return;
      default:
        return;
    }
    window.open(url, "_blank");
  };



  console.log('[ProjectDetail] project prop:', project);
  console.log('[ProjectDetail] project details:', {
    title: project.title,
    description: project.description,
    videoLink: project.videoLink,
    repoLink: project.repoLink,
    websiteLink: project.websiteLink,
    skills: project.skills,
    team: project.team,
    hackathon: project.hackathon
  });

  if (!project) return <p>Loading...</p>;


if (project.type && project.type.toLowerCase() === "ppt") {
  const teamName = project.submittedBy?.name || project.submittedBy?.email || "Unknown Team";
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="py-2  mx-auto">
        <Card className="shadow-none hover:shadow-none">
          {/* Project Header */}
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Project Info */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={project.logo?.url || "/assets/default-banner.png"}
                    alt="Project Logo"
                    className="w-16 h-16 rounded-xl object-cover shadow-md border border-gray-200"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-purple-100 p-1 rounded-full">
                    <FileText className="w-3 h-3 text-purple-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {project.title}
                  </h1>
                  {/* Team/Leader/Problem Statement Info */}
                  <div className="mb-2 mt-1 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="flex flex-wrap gap-6 items-center text-sm text-gray-700">
                      <div><span className="font-semibold">Team:</span> {project.teamName || project.submittedBy?.name || project.submittedBy?.email || "Unknown Team"}</div>
                      <div><span className="font-semibold">Leader:</span> {project.leaderName || '--'}</div>
                      {project.problemStatement && (
                        <div className="w-full"><span className="font-semibold">Problem Statement:</span> <span className="whitespace-pre-line break-words">{project.problemStatement}</span></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions & Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span className="font-medium">{viewCount}</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <Button
                    variant={isLiked ? "solid" : "outline"}
                    size="sm"
                    className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 ${
                      isLiked 
                        ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                        : "bg-white border-gray-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                    }`}
                    onClick={handleLike}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                    <span className="font-medium">{likeCount}</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Judge Evaluations Card (for organizer view) - only show if user is organizer/admin */}
            {user?.role === 'organizer' || user?.role === 'admin' ? (
              <Card className="mb-8 bg-white/90 border border-indigo-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-700">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Judge Evaluations
                  </CardTitle>
                  {averages && evaluations.length > 0 && (
                    <div className="mt-2 text-sm text-gray-700 flex flex-wrap gap-6">
                      <div><span className="font-semibold">Innovation:</span> {averages.innovation}</div>
                      <div><span className="font-semibold">Impact:</span> {averages.impact}</div>
                      <div><span className="font-semibold">Technicality:</span> {averages.technicality}</div>
                      <div><span className="font-semibold">Presentation:</span> {averages.presentation}</div>
                      <div><span className="font-semibold">Overall:</span> {averages.overall}</div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {evaluations.length === 0 ? (
                    <div className="text-gray-500 italic text-center py-6">No evaluations yet.</div>
                  ) : (
                    evaluations.map((ev, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-gray-100 bg-indigo-50">
                        <div className="flex flex-wrap gap-6 items-center text-sm text-gray-800 mb-2">
                          <div><span className="font-semibold">Judge:</span> {ev.judge?.name || ev.judge?.email || 'Unknown'}</div>
                          <div><span className="font-semibold">Innovation:</span> {ev.scores.innovation}</div>
                          <div><span className="font-semibold">Impact:</span> {ev.scores.impact}</div>
                          <div><span className="font-semibold">Technicality:</span> {ev.scores.technicality}</div>
                          <div><span className="font-semibold">Presentation:</span> {ev.scores.presentation}</div>
                          <div><span className="font-semibold">Date:</span> {new Date(ev.createdAt).toLocaleString()}</div>
                        </div>
                        {ev.feedback && (
                          <div className="mt-2 text-gray-700"><span className="font-semibold">Feedback:</span> {ev.feedback}</div>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            ) : null}
            {/* Download Actions */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Download className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Access Presentation</h3>
                <p className="text-sm text-gray-600">Download the presentation file</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={project.pptFile}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
            {/* Loader below download, above preview */}
            {pptLoading && (
              <div className="flex flex-col items-center gap-4 p-8">
                <div className="relative">
                  <svg className="animate-spin h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <div className="absolute inset-0 animate-pulse">
                    <FileText className="w-12 h-12 text-indigo-300" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800 mb-1">Loading Presentation</p>
                  <p className="text-sm text-gray-600">
                    Please wait while we prepare your presentation preview...
                  </p>
                </div>
                {/* Loading progress indicator */}
                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}

            {/* PPT Preview */}
            <div className="relative">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Presentation Preview</h3>
                <p className="text-sm text-gray-600">
                  Interactive preview of the presentation. Use the controls to navigate through slides.
                </p>
              </div>
              
              <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(project.pptFile)}&embedded=true`}
                  style={{ 
                    width: "100%", 
                    height: "600px", 
                    border: "none", 
                    display: pptLoading ? 'none' : 'block' 
                  }}
                  title="PPT Preview"
                  allowFullScreen
                  onLoad={() => setPptLoading(false)}
                  className="rounded-lg"
                />
              </div>
            </div>


          </CardContent>
        </Card>

        {/* Judge Evaluation Section */}
        {user?.role === "judge" && submission && (
          <div className="mt-8">
            {/* Your Evaluation Display - Left column */}
            {!showJudgeForm && (
              <Card className="shadow-none hover:shadow-none mb-6">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Your Evaluation
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Your current evaluation for this submission
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <JudgeEvaluation 
                    submissionId={submission._id}
                    onSubmitted={() => {
                      toast({ title: "✅ Score Submitted", duration: 2000 });
                    }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Judge Evaluation Form */}
            {showJudgeForm && (
              <Card className="bg-white/70 border-0">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Judge Evaluation
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Score this submission based on the hackathon criteria. Your feedback helps determine the winners!
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <JudgeScoreForm
                    submissionId={submission._id}
                                          onSubmitted={() => {
                        toast({ title: "✅ Score Submitted", duration: 2000 });
                        setShowJudgeForm(false);
                      }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Edit Button - Show when form is not visible */}
            {!showJudgeForm && (
              <div className="flex justify-center">
                <Button 
                  onClick={() => setShowJudgeForm(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                >
                  Edit Score
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

  const sharePlatforms = [
    {
      name: "WhatsApp",
      icon: <SiWhatsapp size={32} />,
      color: "#25D366",
      handler: () => handleSocialShare("whatsapp"),
      aria: "Share on WhatsApp",
    },
    {
      name: "Facebook",
      icon: <SiFacebook size={32} />,
      color: "#1877F3",
      handler: () => handleSocialShare("facebook"),
      aria: "Share on Facebook",
    },
    {
      name: "X",
      icon: <SiX size={32} />,
      color: "#228ED7",
      handler: () => handleSocialShare("twitter"),
      aria: "Share on X (Twitter)",
    },
    {
      name: "Telegram",
      icon: <SiTelegram size={32} />,
      color: "#229ED9",
      handler: () => handleSocialShare("telegram"),
      aria: "Share on Telegram",
    },
    {
      name: "LinkedIn",
      icon: <SiLinkedin size={32} />,
      color: "#0077B5",
      handler: () => handleSocialShare("linkedin"),
      aria: "Share on LinkedIn",
    },
  ];

  // Debug: log hackathon data for troubleshooting
  console.log('ProjectDetail HackathonCard data:', project.hackathon);
  if (!project.hackathon) {
    console.warn('No hackathon data found for this project.');
  } else {
    if (!project.hackathon.images) console.warn('No images field in hackathon');
    if (!project.hackathon.title) console.warn('No title field in hackathon');
    if (!project.hackathon.prizePool) console.warn('No prizePool field in hackathon');
    if (!project.hackathon.registrationDeadline) console.warn('No registrationDeadline field in hackathon');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-slate-100 ">
      {/* Improved Header */}
      <header className=" px-6 py-4 sticky top-0 z-20 ">
        <div className="flex items-center max-w-7xl mx-auto">
          {!hideBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 text-gray-700 font-medium "
            >
              <ArrowLeft className="w-4 h-4" /> {backButtonLabel || "Back"}
            </Button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant={isLiked ? "solid" : "outline"}
              size="sm"
              className={`flex items-center gap-2 bg-transparent hover:bg-pink-50 rounded-full px-3 py-2 transition-all ${
                isLiked ? "text-red-500" : ""
              }`}
              onClick={handleLike}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />{" "}
              {likeCount}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent hover:bg-blue-50 rounded-full px-3 py-2 transition-all"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      {/* Share Modal */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
          </DialogHeader>
          <div className="flex flex-row flex-wrap items-center justify-center gap-6 py-4">
            {sharePlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={platform.handler}
                aria-label={platform.aria}
                className="flex flex-col items-center focus:outline-none group"
                style={{ background: "none", border: "none" }}
              >
                <span
                  className="flex items-center justify-center mb-1"
                  style={{
                    background: platform.color,
                    borderRadius: "50%",
                    width: 56,
                    height: 56,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                    transition: "transform 0.15s",
                    color: "white",
                  }}
                >
                  {platform.icon}
                </span>
                <span className="text-xs text-center text-gray-700 font-medium mt-1">
                  {platform.name}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 bg-gray-100 rounded-xl px-3 py-2">
            <input
              type="text"
              value={projectUrl}
              readOnly
              className="flex-1 bg-transparent text-gray-800 text-base outline-none border-none font-mono"
              onFocus={(e) => e.target.select()}
              aria-label="Project share link"
            />
            <button
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-base font-semibold transition"
              aria-label="Copy project link"
            >
              <CopyIcon className="w-5 h-5" /> Copy
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Summary Card */}
      <div className="px-6 pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 rounded-2xl">
            <div className="w-28 h-28 flex items-center justify-center rounded-2xl ">
              <img
                src={project.logo?.url || "/assets/default-banner.png"}
                alt="Project Logo"
                className="rounded-xl object-cover w-24 h-24 "
              />
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h1 className="text-4xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  {project.title}
                </h1>
                {project.category && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {project.category}
                  </Badge>
                )}
              </div>
              {project.oneLineIntro && (
                <p className="text-gray-700 italic text-md mb-2 mt-1 max-w-2xl">
                  {project.oneLineIntro}
                </p>
              )}
              {/* Horizontal line below title/intro */}
              <div className="border-t border-gray-200 my-4 w-full" />
              {/* Project meta info */}
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                {project.hackathon && project.hackathon.title && (
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    {project.hackathon.title}
                  </span>
                )}
                {project.repoLink && (
                  <a
                    href={project.repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline hover:text-blue-600 transition-all"
                  >
                    <Github className="w-4 h-4" />
                    Repo
                  </a>
                )}
                {project.websiteLink && (
                  <a
                    href={project.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline hover:text-blue-600 transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                {project.socialLinks && project.socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.socialLinks.map((link, idx) => (
                      <a
                        key={link || idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                )}
                {project.customCategory && (
                  <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-200">
                    {project.customCategory}
                  </Badge>
                )}
                {project.createdAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Horizontal line above tabs */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <div className="border-t border-gray-200 mb-4 w-full" />
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex justify-start mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3 rounded-xl">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Play className="w-4 h-4" /> Overview
              </TabsTrigger>
              {!onlyOverview && (
                <TabsTrigger
                  value="hackathon"
                  className="flex items-center gap-2"
                >
                  <Award className="w-4 h-4" /> Hackathon
                </TabsTrigger>
              )}
              {!onlyOverview && (
                <TabsTrigger value="team" className="flex items-center gap-2">
                  <Users className="w-4 h-4" /> Team
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          <div className="border-t border-gray-200 mb-6 w-full" />
          {/* Wrap the grid and sidebar in a single parent div to fix JSX error */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <TabsContent value="overview" className="space-y-8">
                <Card className="shadow-none hover:shadow-none">
                  {project.videoLink ? (
                    (() => {
                      // Check if the link is a direct video file (mp4, webm, ogg)
                      const isDirectVideo =
                        typeof project.videoLink === 'string' &&
                        /\.(mp4|webm|ogg)(\?.*)?$/i.test(project.videoLink);
                      // Check if the link is a YouTube URL
                      const isYouTube =
                        typeof project.videoLink === 'string' &&
                        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(project.videoLink);
                      if (isDirectVideo) {
                        return (
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center relative">
                            <video
                              src={project.videoLink}
                              controls
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>
                        );
                      } else if (isYouTube) {
                        // Extract YouTube video ID
                        let videoId = null;
                        const ytMatch = project.videoLink.match(
                          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/
                        );
                        if (ytMatch && ytMatch[1]) {
                          videoId = ytMatch[1];
                        }
                        if (videoId) {
                          return (
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center relative">
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full object-cover rounded-xl"
                              />
                            </div>
                          );
                        } else {
                          // fallback to link if ID extraction fails
                          return (
                            <div className="py-6 px-4 flex flex-col items-start">
                              <h2 className="text-xl font-bold mb-2 text-gray-900 flex items-center gap-2">
                                <Play className="w-5 h-5" /> Demo Video
                              </h2>
                              <a
                                href={project.videoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-base font-medium break-all"
                              >
                                {project.videoLink}
                              </a>
                            </div>
                          );
                        }
                      } else {
                        return (
                          <div className="py-6 px-4 flex flex-col items-start">
                            <h2 className="text-xl font-bold mb-2 text-gray-900 flex items-center gap-2">
                              <Play className="w-5 h-5" /> Demo Video
                            </h2>
                            <a
                              href={project.videoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-base font-medium break-all"
                            >
                              {project.videoLink}
                            </a>
                          </div>
                        );
                      }
                    })()
                  ) : (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 flex flex-col items-center justify-center text-gray-400 gap-2 select-none">
                      <span className="bg-purple-100 rounded-full p-6 mb-2 animate-pulse">
                        <Play className="w-12 h-12 text-purple-400" />
                      </span>
                      <span className="font-semibold text-lg">
                        No video available
                      </span>
                      <span className="text-sm text-gray-400">
                        This project has not provided a demo video yet.
                      </span>
                    </div>
                  )}
                </Card>
                  {/* Horizontal line between video and description */}
                <div className="border-t border-gray-200 my-6 w-full" />
                {/* Description Section */}
                {project.description && (
                  <Card className="px-6 py-6 mb-4 shadow-none hover:shadow-none">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">
                      Description
                    </h2>
                    <div
                      className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                      style={{ whiteSpace: "pre-line" }}
                      dangerouslySetInnerHTML={{ __html: project.description }}
                    />
                  </Card>
                )}
                {/* Horizontal line between video and description */}
                <div className="border-t border-gray-200 my-6 w-full" />
                {/* Skills Section */}
                {project.skills && project.skills.length > 0 && (
                  <div className=" px-2 pb-6">
                    <h2 className="text-xl font-bold mb-3 text-gray-900">
                      Tech Stack
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {project.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Judge Evaluation Display - Left column (read-only) */}
                {user?.role === "judge" && submission && !showJudgeForm && (
                  <div className="px-2 pb-6">
                    <div className="border-t border-gray-200 my-6 w-full" />
                    <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                      <span role="img" aria-label="trophy">🏅</span>
                      Your Evaluation
                    </h2>
                    <JudgeEvaluation 
                      submissionId={submission._id}
                      onSubmitted={() => {
                        toast({ title: "✅ Score Submitted", duration: 2000 });
                      }}
                    />
                  </div>
                )}

               
              
              </TabsContent>

              {!onlyOverview && (
                <TabsContent value="hackathon" className="space-y-8 pb-10">
                  <section>
                    {fullHackathon ? (
                      <div className="flex justify-start">
                        <HackathonCard
                          hackathon={{
                            id: fullHackathon._id,
                            name: fullHackathon.title,
                            image: fullHackathon.images?.banner?.url || fullHackathon.images?.logo?.url || fullHackathon.image,
                            images: fullHackathon.images,
                            status: fullHackathon.status,
                            deadline: fullHackathon.registrationDeadline
                              ? new Date(fullHackathon.registrationDeadline).toDateString()
                              : "",
                            participants: Array.isArray(fullHackathon.participants) ? fullHackathon.participants.length : 0,
                            description: fullHackathon.description,
                            prize: fullHackathon.prizePool?.amount
                              ? `$${Number(fullHackathon.prizePool.amount).toLocaleString()}`
                              : "TBA",
                            startDate: fullHackathon.startDate
                              ? new Date(fullHackathon.startDate).toDateString()
                              : "",
                            endDate: fullHackathon.endDate
                              ? new Date(fullHackathon.endDate).toDateString()
                              : "",
                            category: fullHackathon.category,
                            difficulty: fullHackathon.difficultyLevel,
                          }}
                          onClick={() =>
                            navigate(
                              `/dashboard/explore-hackathons?hackathon=${
                                fullHackathon._id || fullHackathon.id
                              }&title=${encodeURIComponent(fullHackathon.title)}`
                            )
                          }
                        />
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 mt-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                          <Award className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-lg font-medium mb-2">No Hackathon Linked</p>
                        <p className="text-sm">This project was not submitted to any hackathon.</p>
                      </div>
                    )}
                  </section>
                </TabsContent>
              )}

{!onlyOverview && (
  <TabsContent value="team" className="space-y-8 pb-10">
    <section>
      <div className="max-w-4xl mx-auto px-8">
        {/* Team Description */}
        {project.team && project.team.description && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Team Description
            </h3>
            <Card className="shadow-none hover:shadow-none">
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  {project.team.description}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Team Leader Section */}
        {project?.submittedBy && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
              Team Leader
            </h3>
            <Card className="shadow-none hover:shadow-none">
              <a
                href={`/dashboard/profile/${project.submittedBy._id}`}
                className="group flex items-center p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="relative flex-shrink-0 mr-4">
                  {project.submittedBy.profileImage && project.submittedBy.profileImage !== "/placeholder.svg" ? (
                    <img
                      src={project.submittedBy.profileImage}
                      alt={project.submittedBy.name || "Team Leader"}
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
                      <span className="text-lg font-bold text-indigo-600">
                        {project.submittedBy.name?.[0]?.toUpperCase() || "?"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {project.submittedBy.name || "Unknown"}
                      </h4>
                      <p className="text-sm text-gray-600">Team Leader</p>
                    </div>
                    <div className="flex items-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </Card>
          </div>
        )}

        {/* Team Members Section */}
        {project.team && project.team.members && project.team.members.filter((member) => member._id !== project.submittedBy?._id).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-gray-600 rounded-full mr-3"></span>
              Team Members
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({project.team.members.filter((member) => member._id !== project.submittedBy?._id).length})
              </span>
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm divide-y divide-gray-100">
              {project.team.members
                .filter((member) => member._id !== project.submittedBy?._id)
                .map((member, idx) => (
                  <a
                    key={member._id || idx}
                    href={`/dashboard/profile/${member._id}`}
                    className="group flex items-center p-6 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex-shrink-0 mr-4">
                      {(member.profileImage || member.avatar) && 
                       member.profileImage !== "/placeholder.svg" && 
                       member.avatar !== "/placeholder.svg" ? (
                        <img
                          src={member.profileImage || member.avatar}
                          alt={member.name || "Team Member"}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                          <span className="text-lg font-bold text-gray-600">
                            {member.name?.[0]?.toUpperCase() || "?"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {member.name || "Unknown Member"}
                          </h4>
                          <p className="text-sm text-gray-600">Team Member</p>
                        </div>
                        <div className="flex items-center text-gray-400 group-hover:text-indigo-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!project.team || !project.team.members || project.team.members.filter((member) => member._id !== project.submittedBy?._id).length === 0) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No additional team members have joined yet.</p>
          </div>
        )}
      </div>
    </section>
  </TabsContent>
)}


            </div>
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {(project.team && project.team.members && project.team.members.length > 0) && (
                <Card className="bg-white/50">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-500">
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      {project.team.members.map((member) => (
                        <div key={member._id} className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={member.profileImage || member.avatar || "/placeholder.svg"}
                              alt={member.name || "Team Member"}
                            />
                            <AvatarFallback>
                              {member.name?.[0]?.toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {member.name || "Unknown"}
                            </p>
                            <span className="text-xs text-gray-500">
                              {member._id === project.submittedBy?._id ? "Team Leader" : "Member"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {project.repoLink && (
                <Card className="bg-white/50">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                      <Github className="w-4 h-4" /> Github
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center shadow hover:scale-105 transition-transform duration-200"
                        aria-label="GitHub Repository"
                      >
                        <Github className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Extract repo name from URL */}
                        <p className="font-semibold text-gray-900 truncate">
                          {(() => {
                            try {
                              const url = new URL(project.repoLink);
                              return url.pathname.replace(/^\//, "");
                            } catch {
                              return project.repoLink;
                            }
                          })()}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <a
                            href={project.repoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline truncate max-w-[120px]"
                            aria-label="Open GitHub repository"
                          >
                            {project.repoLink}
                          </a>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(project.repoLink);
                              toast({
                                title: "Copied!",
                                description:
                                  "Repository URL copied to clipboard.",
                                duration: 1500,
                              });
                            }}
                            className="ml-1 p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            aria-label="Copy repository URL"
                            type="button"
                          >
                            <Copy className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* User Profile Card */}
              {project.submittedBy && (
                <Card className="bg-white/50">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                      <User className="w-4 h-4" /> Submitted By
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={project.submittedBy.profileImage || "/placeholder.svg"}
                          alt={project.submittedBy.name || "User"}
                        />
                        <AvatarFallback>
                          {project.submittedBy.name?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {project.submittedBy.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {project.submittedBy.email || ""}
                        </p>
                        {project.submittedBy.githubProfile && (
                          <a
                            href={project.submittedBy.githubProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline truncate block"
                          >
                            {project.submittedBy.githubProfile}
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Judge Evaluation Form - Right Sidebar */}
              {user?.role === "judge" && submission && showJudgeForm && (
                <Card className="bg-white/50">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" /> Judge Evaluation
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      Score this project based on the hackathon criteria. Your feedback helps determine the winners!
                    </p>
                  </CardHeader>
                  <CardContent>
                    <JudgeScoreForm
                      submissionId={submission._id}
                      onSubmitted={() => {
                        toast({ title: "✅ Score Submitted", duration: 2000 });
                        setShowJudgeForm(false);
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Edit Button - Show when form is not visible */}
              {user?.role === "judge" && submission && !showJudgeForm && (
                <Card className="bg-white/50">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" /> Judge Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => setShowJudgeForm(true)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Edit Score
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default ProjectDetail;
