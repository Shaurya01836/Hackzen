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
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "../DashboardUI/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card";
import { useToast } from "../../hooks/use-toast";
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
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [likeCount, setLikeCount] = useState(project.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [fullHackathon, setFullHackathon] = useState(
    typeof project.hackathon === "object" && project.hackathon && project.hackathon.images
      ? project.hackathon
      : null
  );
  const [pptLoading, setPptLoading] = useState(true);
  const [viewCount, setViewCount] = useState(project.views || 0);

  // On mount, check if this project is liked in localStorage
  useEffect(() => {
    const likedProjects = JSON.parse(
      localStorage.getItem("likedProjects") || "{}"
    );
    setIsLiked(!!likedProjects[project._id]);
  }, [project._id]);

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
          `http://localhost:3000/api/submission-form/${project._id}/like`,
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
          `http://localhost:3000/api/projects/${project._id}/like`,
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

  if (!project) return <p>Loading...</p>;

  if (project.type && project.type.toLowerCase() === "ppt") {
    const teamName = project.submittedBy?.name || project.submittedBy?.email || "Unknown Team";
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-slate-100 ">
        <header className="px-6 py-4 sticky top-0 z-20 ">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
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
          </div>
        </header>
        <div className="px-6 pt-8 max-w-3xl mx-auto">
          <Card className="mb-6">
            <CardContent className="py-6 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={project.logo?.url || "/assets/default-banner.png"}
                    alt="PPT"
                    className="w-12 h-12"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{project.title}</h1>
                    <div className="text-sm text-gray-500">Team: {teamName}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant={isLiked ? "solid" : "outline"}
                    size="sm"
                    className={`flex items-center gap-2 rounded-full px-3 py-2 transition-all ${isLiked ? "bg-pink-100 text-red-500" : "bg-gray-100 hover:bg-pink-50"}`}
                    onClick={handleLike}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                    {likeCount}
                  </Button>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Eye className="w-4 h-4" />
                    {viewCount}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <a
                  href={project.pptFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm font-medium"
                >
                </a>
                <a
                  href={project.pptFile}
                  download
                  className="text-green-600 underline text-sm font-medium"
                >
                  Download PPT
                </a>
              </div>
              <div className="mt-4">
                {pptLoading && (
                  <div className="flex items-center justify-center w-full h-64">
                    <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  </div>
                )}
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(project.pptFile)}&embedded=true`}
                  style={{ width: "100%", height: "500px", border: "none", display: pptLoading ? 'none' : 'block' }}
                  title="PPT Preview"
                  allowFullScreen
                  onLoad={() => setPptLoading(false)}
                />
              </div>
            </CardContent>
          </Card>
          {user?.role === "judge" && submission && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" /> Judge Evaluation
                </CardTitle>
                <p className="text-xs text-gray-500 mt-1">
                  Score this submission based on the hackathon criteria. Your feedback helps determine the winners!
                </p>
              </CardHeader>
              <CardContent>
                <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-blue-400 w-1/3 transition-all" />
                </div>
                <JudgeScoreForm
                  submissionId={submission._id}
                  onSubmitted={() => {
                    toast({ title: "✅ Score Submitted", duration: 2000 });
                  }}
                />
              </CardContent>
            </Card>
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
                {project.hackathon && (
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
          <div className="flex justify-center mb-8">
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
          {/* Wrap the grid and sidebar in a single parent div to fix JSX error */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <TabsContent value="overview" className="space-y-8">
                <Card>
                  {project.videoLink ? (
                    (() => {
                      // Check if the link is a direct video file (mp4, webm, ogg)
                      const isDirectVideo =
                        typeof project.videoLink === 'string' &&
                        /\.(mp4|webm|ogg)(\?.*)?$/i.test(project.videoLink);
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
                {/* Description Section */}
                {project.description && (
                  <Card className="bg-white/50 px-6 py-6 mb-4">
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
                  <div className=" px-6 py-5 mb-4">
                    <h2 className="text-xl font-bold mb-3 text-gray-900">
                      Tech Stack
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {project.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-1 rounded-full bg-gray-300 text-gray-800 font-semibold text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Horizontal line between description and skills */}
                <div className="border-t border-gray-200 my-6 w-full" />
                {project.teamIntro && (
                  <Card className="bg-white/50 px-6 py-6 mb-4">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Team Introduction</h2>
                    <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed" style={{ whiteSpace: "pre-line" }}>
                      {project.teamIntro}
                    </div>
                  </Card>
                )}
                {project.customAnswers && project.customAnswers.length > 0 && (
                  <Card className="bg-white/50 px-6 py-6 mb-4">
                    <h2 className="text-xl font-bold mb-4 text-gray-900">Custom Answers</h2>
                    <ul className="list-disc pl-6">
                      {project.customAnswers.map((ans, idx) => (
                        <li key={ans.questionId || idx}>
                          <strong>Q:</strong> {ans.questionId} <br />
                          <strong>A:</strong> {ans.answer}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </TabsContent>

              {!onlyOverview && (
                <TabsContent value="hackathon" className="space-y-8 pb-10">
                  <section>
                    {fullHackathon ? (
                      <div className="flex justify-center">
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
                      <div className="text-center text-gray-400 mt-8">No hackathon linked.</div>
                    )}
                  </section>
                </TabsContent>
              )}

              {!onlyOverview && (
                <TabsContent value="team" className="space-y-8 pb-10">
                  <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-8">
                      {/* Team Leader Card */}
                      {project?.submittedBy && (
                        <Card className="">
                          <a
                            href={`/dashboard/profile/${project.submittedBy._id}`}
                            className="group flex flex-col items-center"
                          >
                            <img
                              src={project.submittedBy.profileImage || "/placeholder.svg"}
                              alt={project.submittedBy.name || "Team Leader"}
                              className="w-full h-32 object-cover rounded-t-xl"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder.svg";
                              }}
                            />
                            {/* Fallback for missing image: show first letter if using placeholder */}
                            {(!project.submittedBy.profileImage || project.submittedBy.profileImage === "/placeholder.svg") && (
                              <div className="w-full h-32 flex items-center justify-center bg-indigo-100 text-4xl font-bold text-indigo-600 rounded-t-xl -mt-32 ">
                                {project.submittedBy.name?.[0]?.toUpperCase() || "?"}
                              </div>
                            )}
                            <div className="flex flex-col items-center w-full py-4">
                              <span className="font-bold text-lg text-gray-700">
                                {project.submittedBy.name || "Unknown"}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">Team Leader</span>
                            </div>
                          </a>
                        </Card>
                      )}
                      {/* Divider for visual separation if there are members */}
                      {project.team && project.team.members && project.team.members.filter((member) => member._id !== project.submittedBy?._id).length > 0 && (
                        <div className="sm:col-span-2 md:col-span-3 flex items-center justify-center my-2">
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
                        </div>
                      )}
                      {/* Team Members (excluding leader) */}
                      {project.team && project.team.members &&
                        project.team.members
                          .filter((member) => member._id !== project.submittedBy?._id)
                          .map((member, idx) => (
                            <Card key={member._id || idx} className="">
                              <a
                                href={`/dashboard/profile/${member._id}`}
                                className="group flex flex-col items-center"
                              >
                                <img
                                  src={member.profileImage || member.avatar || "/placeholder.svg"}
                                  alt={member.name || "Team Member"}
                                  className="w-full h-32 object-cover rounded-t-xl border-b border-indigo-100 shadow"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder.svg";
                                  }}
                                />
                                {/* Fallback for missing image: show first letter if using placeholder */}
                                {(!member.profileImage && !member.avatar) || member.profileImage === "/placeholder.svg" || member.avatar === "/placeholder.svg" ? (
                                  <div className="w-full h-32 flex items-center justify-center bg-indigo-100 text-4xl font-bold text-indigo-600 rounded-t-xl border-b border-indigo-100 shadow -mt-32 mb-4">
                                    {member.name?.[0]?.toUpperCase() || "?"}
                                  </div>
                                ) : null}
                                <div className="flex flex-col items-center w-full py-4">
                                  <span className="font-semibold text-gray-900 group-hover:underline">
                                    {member.name}
                                  </span>
                                  <span className="text-xs text-gray-500 mt-1">Member</span>
                                </div>
                              </a>
                            </Card>
                          ))}
                      {/* If no members, show a friendly message */}
                      {project.team && project.team.members && project.team.members.filter((member) => member._id !== project.submittedBy?._id).length === 0 && (
                        <div className="text-center text-gray-400 mt-8">No other team members yet.</div>
                      )}
                    </div>
                  </section>
                </TabsContent>
              )}
            </div>
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {(project.team && project.team.length > 0) && (
                <Card className="bg-white/50">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-500">
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      {project.team.map((member) => (
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

{user?.role === "judge" && submission && (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
        <Award className="w-4 h-4 text-yellow-500" /> Judge Evaluation
      </CardTitle>
      <p className="text-xs text-gray-500 mt-1">
        Score this project based on the hackathon criteria. Your feedback helps determine the winners!
      </p>
    </CardHeader>
    <CardContent>
      <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-400 to-blue-400 w-1/3 transition-all" />
      </div>
      <JudgeScoreForm
        submissionId={submission._id}
        onSubmitted={() => {
          toast({ title: "✅ Score Submitted", duration: 2000 });
        }}
      />
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
