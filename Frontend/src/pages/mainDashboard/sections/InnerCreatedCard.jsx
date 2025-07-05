"use client";
import * as React from "react";
import { Badge } from "../../../components/CommonUI/badge";
import { Button } from "../../../components/CommonUI/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { Input } from "../../../components/CommonUI/input";
import { useState, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/CommonUI/select";
import { Separator } from "../../../components/CommonUI/separator";
import {
  ACard,
  ACardContent,
} from "../../../components/DashboardUI/AnimatedCard";
import CustomSubmissionForm from "./CustomSubmissionForm";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  FormInputIcon,
  Github,
  Globe,
  Mail,
  MapPin,
  Medal,
  Megaphone,
  PieChart,
  Search,
  Settings,
  Trash2,
  Trophy,
  Upload,
  Users,
  Users2,
  Zap,
} from "lucide-react";

// Mock data
const hackathonStats = {
  totalParticipants: 1247,
  totalTeams: 312,
  totalSubmissions: 298,
  topTracks: ["AI/ML", "Web3", "FinTech", "HealthTech"],
  topLocations: ["San Francisco", "New York", "London", "Berlin"],
  averageAge: 24,
  genderDistribution: { male: 65, female: 32, other: 3 },
  activeParticipants: 1180,
  inactiveParticipants: 67,
  duration: "48 hours",
  lastSubmission: "2 hours ago",
};

const projectSubmissions = [
  {
    id: "1",
    teamName: "Code Crusaders",
    members: ["alice@example.com", "bob@example.com", "charlie@example.com"],
    track: "AI/ML",
    title: "Smart Health Assistant",
    description:
      "An AI-powered health monitoring app that provides personalized recommendations based on user data and medical history.",
    links: {
      github: "https://github.com/team/project",
      website: "https://smarthealth.demo.com",
      figma: "https://figma.com/design",
    },
    attachments: ["presentation.pdf", "demo-video.mp4"],
    submittedOn: "2024-01-15T14:30:00Z",
    status: "Winner",
    score: 95,
    rank: 1,
  },
  {
    id: "2",
    teamName: "Innovation Labs",
    members: ["dev1@example.com", "dev2@example.com"],
    track: "Web3",
    title: "DeFi Portfolio Tracker",
    description:
      "A comprehensive dashboard for tracking DeFi investments across multiple blockchains with real-time analytics.",
    links: {
      github: "https://github.com/team/defi-tracker",
      website: "https://defi-tracker.demo.com",
    },
    attachments: ["pitch-deck.pdf"],
    submittedOn: "2024-01-15T16:45:00Z",
    status: "Finalist",
    score: 88,
    rank: 3,
  },
  {
    id: "3",
    teamName: "Green Tech Solutions",
    members: [
      "eco@example.com",
      "green@example.com",
      "sustain@example.com",
      "earth@example.com",
    ],
    track: "Climate Tech",
    title: "Carbon Footprint Calculator",
    description:
      "An interactive tool that helps individuals and businesses calculate and reduce their carbon footprint through actionable insights.",
    links: {
      github: "https://github.com/team/carbon-calc",
      figma: "https://figma.com/carbon-design",
    },
    attachments: ["research-paper.pdf", "user-study.pdf"],
    submittedOn: "2024-01-15T18:20:00Z",
    status: "Reviewed",
    score: 82,
  },
  {
    id: "4",
    teamName: "FinTech Pioneers",
    members: ["fintech@example.com", "money@example.com"],
    track: "FinTech",
    title: "Micro-Investment Platform",
    description:
      "A mobile app that enables users to invest spare change from daily transactions into diversified portfolios.",
    links: {
      github: "https://github.com/team/micro-invest",
    },
    attachments: ["business-plan.pdf"],
    submittedOn: "2024-01-15T12:15:00Z",
    status: "Pending",
  },
];

export default function HackathonDetailsPage({
  hackathon: hackathonProp,
  onBack,
}) {
  // If hackathon data is passed as prop, use it instead of mock data
  const hackathonData = hackathonProp || {
    title: "AI Innovation Hackathon 2024",
    description: "January 13-15, 2024 • San Francisco, CA",
    status: "Completed",
  };
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterTrack, setFilterTrack] = React.useState("all");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionHackathon, setSubmissionHackathon] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const hackathonToDelete = useRef(null);

  const filteredProjects = projectSubmissions.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.members.some((member) =>
        member.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesTrack = filterTrack === "all" || project.track === filterTrack;
    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;

    return matchesSearch && matchesTrack && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = () => {
    hackathonToDelete.current = hackathonData;
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    const hackathon = hackathonToDelete.current;
    if (!hackathon) return;
    setDeletingId(hackathon._id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/hackathons/${hackathon._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete hackathon");
      setShowDeleteDialog(false);
      hackathonToDelete.current = null;
      // Optionally, redirect or call onBack after delete
      if (onBack) onBack();
    } catch (err) {
      alert("Error deleting hackathon: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    hackathonToDelete.current = null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Winner":
        return "bg-green-100 text-green-800 border-green-200";
      case "Finalist":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Reviewed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Add back button if onBack function is provided
  return (
    <>
      {showSubmissionForm ? (
        <CustomSubmissionForm
          hackathon={submissionHackathon}
          onCancel={() => {
            setShowSubmissionForm(false);
            setSubmissionHackathon(null);
          }}
        />
      ) : (
        <div className="min-h-screen bg-[#f9f9fb]">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {onBack && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onBack}
                      className="flex items-center gap-2 hover:bg-white/50 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  )}
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 truncate">
                      {hackathonData.title}
                    </h1>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 text-xs"
                >
                  {hackathonData.status || "Completed"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats and Top Tracks/Locations - Full Width */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
            {/* Stats Overview */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Hackathon Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full mb-8">
                <ACard>
                  <ACardContent className="pt-4 flex flex-col items-center justify-center py-6">
                    <Users className="w-8 h-8 text-indigo-500 mb-2" />
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {hackathonStats.totalParticipants.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 font-medium text-center">
                      Participants
                    </p>
                  </ACardContent>
                </ACard>
                <ACard>
                  <ACardContent className="pt-4 flex flex-col items-center justify-center py-6">
                    <Users2 className="w-8 h-8 text-blue-500 mb-2" />
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {hackathonStats.totalTeams}
                    </p>
                    <p className="text-sm text-gray-500 font-medium text-center">
                      Teams
                    </p>
                  </ACardContent>
                </ACard>
                <ACard>
                  <ACardContent className="pt-4 flex flex-col items-center justify-center py-6">
                    <Upload className="w-8 h-8 text-green-500 mb-2" />
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {hackathonStats.totalSubmissions}
                    </p>
                    <p className="text-sm text-gray-500 font-medium text-center">
                      Submissions
                    </p>
                  </ACardContent>
                </ACard>
                <ACard>
                  <ACardContent className="pt-4 flex flex-col items-center justify-center py-6">
                    <Clock className="w-8 h-8 text-purple-500 mb-2" />
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      {hackathonStats.duration}
                    </p>
                    <p className="text-sm text-gray-500 font-medium text-center">
                      Duration
                    </p>
                  </ACardContent>
                </ACard>
                <ACard>
                  <ACardContent className="pt-4 flex flex-col items-center justify-center py-6">
                    <PieChart className="w-8 h-8 text-orange-500 mb-2" />
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {hackathonStats.averageAge}
                    </p>
                    <p className="text-sm text-gray-500 font-medium text-center">
                      Avg Age
                    </p>
                  </ACardContent>
                </ACard>
                <ACard>
                  <ACardContent className="pt-4 flex flex-col items-center justify-center py-6">
                    <CalendarDays className="w-8 h-8 text-red-500 mb-2" />
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      {hackathonStats.lastSubmission}
                    </p>
                    <p className="text-sm text-gray-500 font-medium text-center">
                      Last Submit
                    </p>
                  </ACardContent>
                </ACard>
              </div>

              {/* Top Tracks and Locations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card className=" border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Top Tracks</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {hackathonStats.topTracks.map((track, index) => (
                        <div
                          key={track}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-700">{track}</span>
                          <Badge variant="secondary" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className=" border-gray-200 ">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Top Locations</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {hackathonStats.topLocations.map((location, index) => (
                        <div
                          key={location}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {location}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>

          {/* Submitted Projects + Quick Actions Side by Side, Projects Scrollable */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Submitted Projects - Only Cards Scrollable, Hide Scrollbar */}
              <div className="flex-1">
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Submitted Projects
                    </h2>
                    <div className="text-sm text-gray-600">
                      {filteredProjects.length} of {projectSubmissions.length}{" "}
                      projects
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search projects, teams, or members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white border-gray-200"
                      />
                    </div>
                    <Select value={filterTrack} onValueChange={setFilterTrack}>
                      <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200">
                        <SelectValue placeholder="Filter by track" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tracks</SelectItem>
                        <SelectItem value="AI/ML">AI/ML</SelectItem>
                        <SelectItem value="Web3">Web3</SelectItem>
                        <SelectItem value="FinTech">FinTech</SelectItem>
                        <SelectItem value="Climate Tech">
                          Climate Tech
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Winner">Winner</SelectItem>
                        <SelectItem value="Finalist">Finalist</SelectItem>
                        <SelectItem value="Reviewed">Reviewed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Projects Grid - Scrollable, Hide Scrollbar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[74vh] overflow-y-auto scrollbar-hide p-3">
                    {filteredProjects.map((project, index) => (
                      <ACard
                        key={project.id}
                        className="w-full flex flex-col overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg bg-white border border-indigo-100"
                      >
                        {/* Banner / Logo */}
                        <div className="relative h-32 w-full bg-indigo-50 flex items-center justify-center">
                          <img
                            src="https://www.hackquest.io/images/layout/hackathon_cover.png"
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Status Badge */}
                          <div className="absolute top-2 right-2">
                            <Badge
                              variant={project.score ? "default" : "outline"}
                              className="font-semibold shadow"
                            >
                              {project.score ? "Judged" : "Submitted"}
                            </Badge>
                          </div>
                          {/* Index Number */}
                          <div className="absolute top-2 left-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center ">
                              <span className="text-sm font-semibold text-indigo-700">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col gap-3 flex-1">
                          {/* Title and Track */}
                          <div>
                            <h3 className="text-lg font-semibold text-indigo-700 leading-tight line-clamp-2 mb-2">
                              {project.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className="text-xs"
                              >
                                {project.track}
                              </Badge>
                              {project.rank && (
                                <div className="flex items-center gap-1">
                                  <Trophy className="h-3 w-3 text-yellow-500" />
                                  <span className="text-xs font-medium text-yellow-600">
                                    #{project.rank}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Team Name Badge */}
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              {project.teamName}
                            </Badge>
                          </div>

                          {/* Score and Submission Time */}
                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              {formatDate(project.submittedOn)}
                            </div>
                            {project.score && (
                              <div className="flex items-center gap-1 text-indigo-600 font-semibold">
                                <Medal className="h-4 w-4" />
                                {project.score}/100
                              </div>
                            )}
                          </div>
                        </div>
                      </ACard>
                    ))}
                  </div>
                </section>
              </div>
              {/* Quick Actions Panel */}
              <div className="w-full lg:w-80 flex-shrink-0 pt-20">
                <div className="sticky top-8">
                  <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-5 w-5 text-indigo-600" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-left bg-transparent"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit Hackathon
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-left bg-transparent"
                      >
                        <Download className="h-4 w-4" />
                        Export Participants
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-left bg-transparent"
                        onClick={() => {
                          setShowSubmissionForm(true);
                          setSubmissionHackathon(hackathonData);
                        }}
                      >
                        <FormInputIcon className="h-4 w-4" />
                        Submission Form
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-left bg-transparent"
                      >
                        <Download className="h-4 w-4" />
                        Export Submissions
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-left bg-transparent"
                      >
                        <Medal className="h-4 w-4" />
                        Send Certificates
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-left bg-transparent"
                      >
                        <Trophy className="h-4 w-4" />
                        View Leaderboard
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-left bg-transparent"
                      >
                        <Megaphone className="h-4 w-4" />
                        Send Announcements
                      </Button>
                      <Separator />
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-left text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                        onClick={handleDelete}
                        disabled={deletingId === hackathonData._id}
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingId === hackathonData._id
                          ? "Deleting..."
                          : "Delete Hackathon"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Quick Actions - Sticky Bottom */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="flex gap-2 overflow-x-auto">
              <Button
                size="sm"
                variant="outline"
                className="flex-shrink-0 bg-transparent"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-shrink-0 bg-transparent"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-shrink-0 bg-transparent"
              >
                <Trophy className="h-4 w-4 mr-1" />
                Leaderboard
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-shrink-0 bg-transparent"
              >
                <Megaphone className="h-4 w-4 mr-1" />
                Announce
              </Button>
            </div>
          </div>
        </div>
      )}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-lg font-bold mb-2">Delete Hackathon?</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this hackathon? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex-1"
              >
                {deletingId !== null ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="outline"
                onClick={cancelDelete}
                className="flex-1"
                disabled={deletingId !== null}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
