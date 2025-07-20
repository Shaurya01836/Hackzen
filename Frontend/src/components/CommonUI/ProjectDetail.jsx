"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  Github,
  Heart,
  Share2,
  Users,
  ExternalLink,
  Play,
  Clock,
  Award,
  Code,
  Layers,
  UserPlus,
  Copy,
  Edit,
  LogOut,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "../DashboardUI/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../DashboardUI/alert-dialog";
import { useToast } from "../../hooks/use-toast";
import axios from "axios";
import JudgeScoreForm from "../../pages/mainDashboard/sections/components/Scoring/JudgeScoreForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../DashboardUI/dialog";
import { SiWhatsapp, SiFacebook, SiX, SiTelegram, SiLinkedin } from "react-icons/si";
import { Share2 as Share2Icon, Heart as HeartIcon, Copy as CopyIcon } from "lucide-react";

export function ProjectDetail({ project, onBack, backButtonLabel, hideBackButton = false, onlyOverview = false }) {
  const { user } = useAuth();
  const { toast } = useToast();

  // Team management state
  const [userTeams, setUserTeams] = useState([]);
  const [projectTeams, setProjectTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copiedTeamId, setCopiedTeamId] = useState(null);
  const [showEditDescription, setShowEditDescription] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingDescription, setEditingDescription] = useState("");
  const [removeDialog, setRemoveDialog] = useState({
    open: false,
    teamId: null,
    memberId: null,
  });
  const [leaveDialog, setLeaveDialog] = useState({ open: false, teamId: null });
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [submittedUser, setSubmittedUser] = useState(null);
  // Video preview state for YouTube
  const [showVideo, setShowVideo] = useState(false);
  const [likeCount, setLikeCount] = useState(project.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // On mount, check if this project is liked in localStorage
  useEffect(() => {
    const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '{}');
    setIsLiked(!!likedProjects[project._id]);
  }, [project._id]);

  // Fetch user teams for this project's hackathon
  useEffect(() => {
    if (project?.hackathon?._id) {
      fetchUserTeams();
    }
  }, [project]);

  // Fetch project teams (independent of hackathon)
  useEffect(() => {
    if (project?._id) {
      fetchProjectTeams();
    }
  }, [project]);

  const fetchUserTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/teams/hackathon/${project.hackathon._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const teams = await response.json();
        setUserTeams(teams);
      }
    } catch (error) {
      console.error("Failed to fetch user teams:", error);
    }
  };
  const getEmbeddableVideoLink = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/
    );
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url; // fallback (e.g., Cloudinary video link)
  };
  // Helper to get YouTube thumbnail
  const getYoutubeThumbnail = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    );
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
    }
    return null;
  };

  const fetchProjectTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/teams/project/${project._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const teams = await response.json();
        setProjectTeams(teams);
      }
    } catch (error) {
      console.error("Failed to fetch project teams:", error);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName.trim() || !newTeamDescription.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newTeamName.trim(),
          description: newTeamDescription.trim(),
          projectId: project._id,
          maxMembers: 4,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Team Created!",
          description: `Team "${newTeamName}" has been created successfully`,
          duration: 3000,
        });
        setShowCreateTeamModal(false);
        setNewTeamName("");
        setNewTeamDescription("");
        fetchProjectTeams(); // Refresh teams
      } else {
        toast({
          title: "Failed to create team",
          description: data.message || "Something went wrong",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description: "Failed to create team",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim() || !selectedTeam) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/team-invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teamId: selectedTeam._id,
          invitedUserEmail: inviteEmail,
          hackathonId: project.hackathon._id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Invite Sent!",
          description: `Invitation sent to ${inviteEmail}`,
          duration: 3000,
        });
        setShowInviteModal(false);
        setSelectedTeam(null);
        setInviteEmail("");
      } else {
        toast({
          title: "Failed to send invite",
          description: data.message || "Something went wrong",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditDescription = (team) => {
    setEditingTeamId(team._id);
    setEditingDescription(team.description);
    setShowEditDescription(true);
  };
  useEffect(() => {
    const fetchUser = async () => {
      if (typeof project.submittedBy === "string") {
        try {
          const res = await axios.get(
            `http://localhost:3000/api/users/${project.submittedBy}`
          );
          setSubmittedUser(res.data);
        } catch (err) {
          console.error("Error fetching submittedBy user:", err);
        }
      } else {
        // If already populated
        setSubmittedUser(project.submittedBy);
      }
    };

    fetchUser();
  }, [project]);
  const handleUpdateDescription = async () => {
    if (!editingDescription.trim() || !editingTeamId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/teams/${editingTeamId}/description`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ description: editingDescription }),
        }
      );

      if (response.ok) {
        toast({
          title: "Description Updated",
          description: "Team description has been updated successfully",
          duration: 3000,
        });
        setShowEditDescription(false);
        setEditingTeamId(null);
        setEditingDescription("");
        fetchUserTeams(); // Refresh teams
      } else {
        const data = await response.json();
        toast({
          title: "Failed to update description",
          description: data.message || "Something went wrong",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating description:", error);
      toast({
        title: "Error",
        description: "Failed to update description",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (teamId, memberId) => {
    setRemoveDialog({ open: true, teamId, memberId });
  };

  const confirmRemoveMember = async () => {
    if (!removeDialog.teamId || !removeDialog.memberId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/teams/${removeDialog.teamId}/members/${removeDialog.memberId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Member Removed",
          description: "Team member has been removed successfully",
          duration: 3000,
        });
        fetchUserTeams(); // Refresh teams
      } else {
        const data = await response.json();
        toast({
          title: "Failed to remove member",
          description: data.message || "Something went wrong",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        duration: 3000,
      });
    } finally {
      setLoading(false);
      setRemoveDialog({ open: false, teamId: null, memberId: null });
    }
  };

  const handleLeaveTeam = (teamId) => {
    setLeaveDialog({ open: true, teamId });
  };

  const confirmLeaveTeam = async () => {
    if (!leaveDialog.teamId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/teams/${leaveDialog.teamId}/leave`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast({
          title: "Left Team",
          description: "You have successfully left the team",
          duration: 3000,
        });
        fetchUserTeams(); // Refresh teams
      } else {
        const data = await response.json();
        toast({
          title: "Failed to leave team",
          description: data.message || "Something went wrong",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error leaving team:", error);
      toast({
        title: "Error",
        description: "Failed to leave team",
        duration: 3000,
      });
    } finally {
      setLoading(false);
      setLeaveDialog({ open: false, teamId: null });
    }
  };

  // Like handler (public, no login required)
  const handleLike = async () => {
    if (!user || !user._id) {
      toast({ title: "Login Required", description: "Please log in to like projects.", duration: 2000 });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/projects/${project._id}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to like project");
      const data = await res.json();
      setIsLiked(data.liked);
      setLikeCount(data.likes);
      // Persist like in localStorage
      const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '{}');
      if (data.liked) {
        likedProjects[project._id] = true;
      } else {
        delete likedProjects[project._id];
      }
      localStorage.setItem('likedProjects', JSON.stringify(likedProjects));
      if (data.message) {
        toast({ title: data.liked ? "Liked!" : "Unliked!", description: data.message, duration: 2000 });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to like project", duration: 2000 });
    }
  };
  // Share handler (opens modal)
  const handleShare = () => setShareOpen(true);
  const projectUrl = `${window.location.origin}/dashboard/project-archive/${project._id}`;
  const handleCopy = async () => {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(projectUrl);
        toast({ title: "Link Copied!", description: "Project link copied to clipboard.", duration: 2000 });
      } catch {
        toast({ title: "Error", description: "Failed to copy link", duration: 2000 });
      }
    } else {
      toast({ title: "Error", description: "Clipboard not available", duration: 2000 });
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
        toast({ title: "Not Supported", description: "Instagram does not support direct web sharing.", duration: 2000 });
        return;
      default:
        return;
    }
    window.open(url, "_blank");
  };

  if (!project) return <p>Loading...</p>;

  const sharePlatforms = [
    { name: "WhatsApp", icon: <SiWhatsapp size={32} />, color: "#25D366", handler: () => handleSocialShare("whatsapp"), aria: "Share on WhatsApp" },
    { name: "Facebook", icon: <SiFacebook size={32} />, color: "#1877F3", handler: () => handleSocialShare("facebook"), aria: "Share on Facebook" },
    { name: "X", icon: <SiX size={32} />, color: "#228ED7", handler: () => handleSocialShare("twitter"), aria: "Share on X (Twitter)" },
    { name: "Telegram", icon: <SiTelegram size={32} />, color: "#229ED9", handler: () => handleSocialShare("telegram"), aria: "Share on Telegram" },
    { name: "LinkedIn", icon: <SiLinkedin size={32} />, color: "#0077B5", handler: () => handleSocialShare("linkedin"), aria: "Share on LinkedIn" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-slate-100 ">
      {/* Improved Header */}
      <header className=" px-6 py-4 sticky top-0 z-20 ">
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
          <div className="flex items-center gap-2">
            <Button
              variant={isLiked ? "solid" : "outline"}
              size="sm"
              className={`flex items-center gap-2 bg-transparent hover:bg-pink-50 rounded-full px-3 py-2 transition-all ${isLiked ? "text-red-500" : ""}`}
              onClick={handleLike}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} /> {likeCount}
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
              onFocus={e => e.target.select()}
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
                src={project.logo?.url || "/placeholder.svg"}
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
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center relative">
                    {project.videoLink ? (
                      project.videoLink.includes("youtube.com") ||
                      project.videoLink.includes("youtu.be") ? (
                        showVideo ? (
                          <iframe
                            src={getEmbeddableVideoLink(project.videoLink)}
                            title="Demo Video"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <button
                            className="absolute inset-0 w-full h-full flex items-center justify-center group bg-black/10 hover:bg-black/20 transition"
                            aria-label="Play video"
                            onClick={() => setShowVideo(true)}
                          >
                            <img
                              src={getYoutubeThumbnail(project.videoLink)}
                              alt="YouTube video thumbnail"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="bg-white/80 rounded-full p-4 shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="w-10 h-10 text-purple-600" />
                              </span>
                            </span>
                          </button>
                        )
                      ) : (
                        <video
                          src={project.videoLink}
                          controls
                          className="w-full h-full object-cover rounded-xl"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 select-none">
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
                  </div>
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
              </TabsContent>

              {!onlyOverview && (
                <TabsContent value="hackathon" className="space-y-8">
                  {project.hackathon ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Submitted Hackathon</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {project.hackathon.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {project.hackathon.prizeTrack || "Prize track info"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {project.hackathon.status || "Unknown"}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <p>No hackathon linked.</p>
                  )}
                </TabsContent>
              )}

              {!onlyOverview && (
                <TabsContent value="team" className="space-y-8">
                  {/* Team Intro */}
                  {project?.submittedBy && (
                    <>
                      <CardHeader>
                        <CardTitle className="text-sm text-gray-500">
                          Team Leader
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={
                                project.submittedBy.profileImage ||
                                "/placeholder.svg"
                              }
                              alt={project.submittedBy.name || "Team Leader"}
                            />
                            <AvatarFallback>
                              {project.submittedBy.name?.[0]?.toUpperCase() ||
                                "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {project.submittedBy.name || "Unknown"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  )}

                  {/* Project Team Management Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-500" />
                          Project Team Management
                        </span>
                        <Button
                          onClick={() => setShowCreateTeamModal(true)}
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          Create Team
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {projectTeams.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No Teams Yet
                          </h3>
                          <p className="text-gray-500 mb-4">
                            Create a team to collaborate on this project and
                            invite members to join.
                          </p>
                          <Button
                            onClick={() => setShowCreateTeamModal(true)}
                            className="flex items-center gap-2"
                          >
                            <UserPlus className="w-4 h-4" />
                            Create Your First Team
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {projectTeams.map((team) => (
                            <div
                              key={team._id}
                              className="mb-6 p-4 border rounded-lg bg-gray-50"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-lg">
                                    {team.name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    Team Code:{" "}
                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                      {team.teamCode}
                                    </span>
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    team.members.length >= team.maxMembers
                                      ? "destructive"
                                      : "default"
                                  }
                                >
                                  {team.members.length}/{team.maxMembers} members
                                </Badge>
                              </div>
                              <div className="flex items-start justify-between mb-3">
                                <p className="text-gray-600 flex-1">
                                  {team.description}
                                </p>
                                {team.leader._id === user?._id && (
                                  <Button
                                    onClick={() => handleEditDescription(team)}
                                    variant="ghost"
                                    size="sm"
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                              {/* Team Members */}
                              <div className="mb-4">
                                <h5 className="font-medium mb-2">
                                  Team Members:
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {team.members.map((member) => (
                                    <div
                                      key={member._id}
                                      className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                                    >
                                      <Avatar className="w-6 h-6">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>
                                          {member.name?.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm">
                                        {member.name}
                                      </span>
                                      {member._id === team.leader._id && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          Leader
                                        </Badge>
                                      )}
                                      {team.leader._id === user?._id &&
                                        member._id !== user?._id && (
                                          <AlertDialog
                                            open={
                                              removeDialog.open &&
                                              removeDialog.teamId === team._id &&
                                              removeDialog.memberId === member._id
                                            }
                                            onOpenChange={(open) =>
                                              setRemoveDialog(
                                                open
                                                  ? {
                                                      open: true,
                                                      teamId: team._id,
                                                      memberId: member._id,
                                                    }
                                                  : {
                                                      open: false,
                                                      teamId: null,
                                                      memberId: null,
                                                    }
                                              )
                                            }
                                          >
                                            <AlertDialogTrigger asChild>
                                              <Button
                                                size="xs"
                                                variant="destructive"
                                              >
                                                Remove
                                              </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                  Remove Team Member?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  Are you sure you want to remove{" "}
                                                  <b>{member.name}</b> from the
                                                  team? They will be unregistered
                                                  from the hackathon and need to
                                                  register again if they want to
                                                  participate. This action cannot
                                                  be undone.
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                  Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                  onClick={confirmRemoveMember}
                                                  disabled={loading}
                                                >
                                                  Remove
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {/* Team Actions */}
                              <div className="flex gap-2 mb-2">
                                {team.members.length < team.maxMembers && (
                                  <Button
                                    onClick={() => {
                                      setSelectedTeam(team);
                                      setShowInviteModal(true);
                                    }}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Invite Member
                                  </Button>
                                )}
                                <div className="relative inline-block">
                                  <Button
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        team.teamCode
                                      );
                                      setCopiedTeamId(team._id);
                                      toast({
                                        title: "Code copied!",
                                        description:
                                          "Team code copied to clipboard.",
                                      });
                                      setTimeout(
                                        () => setCopiedTeamId(null),
                                        1500
                                      );
                                    }}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Code
                                  </Button>
                                  {copiedTeamId === team._id && (
                                    <span
                                      className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1 text-xs font-semibold animate-fade-in-out z-10"
                                      style={{ pointerEvents: "none" }}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Code Copied!
                                    </span>
                                  )}
                                </div>
                                {/* Leave team button for members (not leader) */}
                                {team.leader._id !== user?._id && (
                                  <AlertDialog
                                    open={
                                      leaveDialog.open &&
                                      leaveDialog.teamId === team._id
                                    }
                                    onOpenChange={(open) =>
                                      setLeaveDialog(
                                        open
                                          ? { open: true, teamId: team._id }
                                          : { open: false, teamId: null }
                                      )
                                    }
                                  >
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={loading}
                                        className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                      >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Leave Team
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Leave Team?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to leave this
                                          team? You will be unregistered from the
                                          hackathon and need to register again if
                                          you want to participate.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={confirmLeaveTeam}
                                          disabled={loading}
                                        >
                                          Leave Team
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Original Team Members Display */}
                  {(project.team || []).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          <Users className="w-5 h-5" /> Project Team Members
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {project.team.map((member, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4 p-4 rounded-lg bg-gray-50"
                            >
                              <Avatar className="w-12 h-12">
                                <AvatarImage
                                  src={member.avatar || "/placeholder.svg"}
                                />
                                <AvatarFallback>
                                  {member.name?.[0] || "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {member.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {member.role}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              )}
            </div>
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {project.submittedBy && (
                <Card className="bg-white/50">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-500">
                      Team Leader
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={
                            submittedUser?.profileImage || "/placeholder.svg"
                          }
                          alt={submittedUser?.name || "Team Leader"}
                        />
                        <AvatarFallback>
                          {submittedUser?.name?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {submittedUser?.name || "Unknown"}
                        </p>
                      </div>
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

              {user?.role === "judge" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-500 flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" /> Judge
                      Evaluation
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      Score this project based on the hackathon criteria. Your
                      feedback helps determine the winners!
                    </p>
                  </CardHeader>
                  <CardContent>
                    {/* Progress bar placeholder for visual feedback */}
                    <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
                      {/* You can connect this to actual progress if available */}
                      <div className="h-full bg-gradient-to-r from-purple-400 to-blue-400 w-1/3 transition-all" />
                    </div>
                    <JudgeScoreForm
                      projectId={project._id}
                      hackathonId={project.hackathon?._id}
                      onSubmitted={() => {
                        toast({ title: "✅ Score Submitted", duration: 2000 });
                      }}
                    />
                    {/* Enhanced submit button inside JudgeScoreForm is recommended for full effect */}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Tabs>
      </div>

      {/* Invite Modal */}
      {showInviteModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowInviteModal(false);
                setSelectedTeam(null);
                setInviteEmail("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">Invite Team Member</h3>
            <p className="text-gray-600 mb-4">
              Invite someone to join <strong>{selectedTeam.name}</strong>
            </p>
            <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
              <strong>Team Size:</strong> {selectedTeam.members.length}/
              {selectedTeam.maxMembers} members currently. This hackathon allows
              teams of {project.hackathon?.teamSize?.min || 1} to{" "}
              {project.hackathon?.teamSize?.max || 4} members.
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="friend@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The recipient will receive an email with an invitation link
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSendInvite}
                  disabled={!inviteEmail.trim() || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    "Send Invite"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInviteModal(false);
                    setSelectedTeam(null);
                    setInviteEmail("");
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Description Modal */}
      {showEditDescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowEditDescription(false);
                setEditingTeamId(null);
                setEditingDescription("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">
              Edit Team Description
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Team Description
                </label>
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  placeholder="Describe your team's goals, skills, and what you hope to achieve"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {editingDescription.length}/300 characters
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleUpdateDescription}
                  disabled={!editingDescription.trim() || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Description"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditDescription(false);
                    setEditingTeamId(null);
                    setEditingDescription("");
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setShowCreateTeamModal(false);
                setNewTeamName("");
                setNewTeamDescription("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">Create New Team</h3>
            <p className="text-gray-600 mb-4">
              Create a team to collaborate on this project
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Team Description *
                </label>
                <textarea
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  placeholder="Describe your team's goals and what you hope to achieve"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                  required
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {newTeamDescription.length}/300 characters
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCreateTeam}
                  disabled={
                    !newTeamName.trim() || !newTeamDescription.trim() || loading
                  }
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Team"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateTeamModal(false);
                    setNewTeamName("");
                    setNewTeamDescription("");
                  }}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
