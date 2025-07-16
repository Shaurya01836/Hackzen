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
import { useEffect, useState, useRef } from "react";
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
import HackathonEditModal from "./HackathonEditModal";
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
  Send,
  MessageCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HackathonDetailsPage({
  hackathon: hackathonProp,
  onBack,
}) {
  // All hooks at the top!
  const [hackathon, setHackathon] = useState(hackathonProp || null);
  const [teams, setTeams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTrack, setFilterTrack] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionHackathon, setSubmissionHackathon] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const hackathonToDelete = useRef(null);
  const navigate = useNavigate();
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [sponsorProposals, setSponsorProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [reviewModal, setReviewModal] = useState({ open: false, proposalId: null, action: '', loading: false, message: '', price: '' });
  const [messageModal, setMessageModal] = useState({ open: false, proposal: null, message: '' });

  // Define these before your return
  const totalParticipants = participants.length;
  const totalTeams = teams.length;
  const totalSubmissions = submissions.length;

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setFetchError(null);
      const token = localStorage.getItem("token");
      const id = hackathonProp?._id;
      if (!id) return;
      try {
        const fetchJson = async (url) => {
          const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
          const text = await res.text();
          try {
            return JSON.parse(text);
          } catch (err) {
            throw new Error(`API error at ${url}: ${res.status} - ${text.slice(0, 100)}`);
          }
        };
        const [h, t, s, p] = await Promise.all([
          fetchJson(`http://localhost:3000/api/hackathons/${id}`),
          fetchJson(`http://localhost:3000/api/teams/hackathon/${id}`),
          fetchJson(`http://localhost:3000/api/projects/hackathon/${id}`),
          fetchJson(`http://localhost:3000/api/registration/hackathon/${id}/participants`),
        ]);
        setHackathon(h);
        setTeams(t);
        setSubmissions(s);
        setParticipants(p.participants || []);
      } catch (err) {
        setFetchError(err.message);
        setHackathon(null);
        setTeams([]);
        setSubmissions([]);
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    }
    if (hackathonProp?._id) fetchAll();
  }, [hackathonProp]);

  if (loading) return <div>Loading...</div>;
  if (fetchError) return <div className="text-red-600 font-bold">Error: {fetchError}</div>;
  if (!hackathon) return <div>No data found.</div>;

  const filteredProjects = submissions.filter((project) => {
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
    hackathonToDelete.current = hackathon;
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

  // Fetch sponsor proposals for this hackathon
  const fetchSponsorProposals = async () => {
    setLoadingProposals(true);
    try {
      const res = await fetch(`http://localhost:3000/api/sponsor-proposals/${hackathon._id}`);
      const data = await res.json();
      setSponsorProposals(Array.isArray(data) ? data : []);
      setShowSponsorModal(true);
    } catch (err) {
      setSponsorProposals([]);
      setShowSponsorModal(true);
    } finally {
      setLoadingProposals(false);
    }
  };

  // Approve/Reject proposal with message
  const handleReviewProposal = (proposalId, action) => {
    console.log('DEBUG: handleReviewProposal called', { proposalId, action });
    setReviewModal({ open: true, proposalId, action, loading: false, message: '', price: '' });
  };

  const submitReview = async () => {
    if (!reviewModal.message.trim()) return;
    setReviewModal((prev) => ({ ...prev, loading: true }));
    try {
      const payload = {
        status: reviewModal.action,
        reviewMessage: reviewModal.message,
      };
      if (reviewModal.action === 'approved') {
        payload.priceAmount = reviewModal.price;
      }
      await fetch(`http://localhost:3000/api/sponsor-proposals/${reviewModal.proposalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setReviewModal({ open: false, proposalId: null, action: '', loading: false, message: '', price: '' });
      fetchSponsorProposals();
    } catch (err) {
      setReviewModal(prev => ({ ...prev, loading: false }));
      alert('Failed to submit review.');
    }
  };

  function openMessageModal(proposal) {
    setMessageModal({ open: true, proposal, message: proposal.messageToSponsor || '' });
  }
  async function handleSendMessageToSponsor() {
    if (!messageModal.proposal) return;
    await fetch(`http://localhost:3000/api/sponsor-proposals/${messageModal.proposal._id}/message`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageToSponsor: messageModal.message }),
    });
    setMessageModal({ open: false, proposal: null, message: '' });
    fetchSponsorProposals();
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
                      {hackathon.title}
                    </h1>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 text-xs"
                >
                  {hackathon.status || "Completed"}
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
                      {totalParticipants.toLocaleString()}
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
                      {totalTeams}
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
                      {totalSubmissions}
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
                      {hackathon.duration}
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
                      {hackathon.averageAge}
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
                      {hackathon.lastSubmission}
                    </p>
                    <p className="text-sm text-gray-500 font-medium text-center">
                      Last Submit
                    </p>
                  </ACardContent>
                </ACard>
              </div>

              {/* Top Tracks and Locations - Only show if there are submissions */}
              {submissions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Card className=" border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Top Tracks</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {Array.isArray(hackathon.topTracks) && hackathon.topTracks.map((track, index) => (
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
                        {Array.isArray(hackathon.topLocations) && hackathon.topLocations.map((location, index) => (
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
              )}
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
                      {filteredProjects.length} of {submissions.length}{" "}
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
                  {filteredProjects.length === 0 ? (
                    <Card className="flex-1 h-full w-full min-h-[340px] lg:min-h-[520px] flex items-center justify-center">
                      <CardContent className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto p-8">
                        <div className="flex items-center justify-center mb-4">
                          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50">
                            <svg className="w-9 h-9 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path d="M8.21 13.89l-.94 4.13A1 1 0 008.24 19a1 1 0 00.51-.14L12 16.94l3.25 1.92a1 1 0 001.49-1.06l-.94-4.13 3.18-2.77a1 1 0 00-.57-1.76l-4.19-.36-1.63-3.89a1 1 0 00-1.84 0l-1.63 3.89-4.19.36a1 1 0 00-.57 1.76l3.18 2.77z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-2 text-center">No Submissions Yet</div>
                        <div className="text-gray-600 text-base text-center mb-6">No teams have submitted projects for this hackathon yet. Once teams submit, their projects will appear here for your review and management.</div>
                        <button
                          className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-[#20124d] hover:bg-[#2d186b] text-white font-semibold text-base shadow transition-colors"
                          onClick={() => window.location.href = '/explore-hackathons'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 3h6v6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          View All Hackathons
                        </button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[74vh] overflow-y-auto scrollbar-hide p-3">
                      {filteredProjects.map((project, index) => (
                        <ACard
                          key={project.id}
                          className="w-full flex flex-col overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg bg-white border border-indigo-100"
                        >
                          {/* Banner / Logo */}
                          <div className="relative h-32 w-full bg-indigo-50 flex items-center justify-center">
                            <img
                              src={
                                hackathon.images?.logo?.url ||
                                hackathon.images?.banner?.url ||
                                "/assets/default-banner.png"
                              }
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
                  )}
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
                        onClick={() => navigate(`/dashboard/edit-hackathon/${hackathon._id}`)}
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
                          setSubmissionHackathon(hackathon);
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
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-left bg-transparent border-yellow-500 text-yellow-700"
                        onClick={fetchSponsorProposals}
                      >
                        Review Sponsored PS
                      </Button>
                      <Separator />
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-left text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                        onClick={handleDelete}
                        disabled={deletingId === hackathon._id}
                      >
                        <Trash2 className="h-4 w-4" />
                        {deletingId === hackathon._id
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
                onClick={() => navigate(`/dashboard/edit-hackathon/${hackathon._id}`)}
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
      {/* Sponsor Proposals Modal */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowSponsorModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Sponsored Problem Statement Proposals</h2>
            {loadingProposals ? (
              <div>Loading...</div>
            ) : sponsorProposals.length === 0 ? (
              <div className="text-gray-500">No proposals found.</div>
            ) : (
              <div className="space-y-6">
                {sponsorProposals.map((p) => (
                  <div key={p._id} className="border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold text-lg">{p.title}</div>
                      <span className={p.status === 'pending' ? 'text-yellow-600' : p.status === 'approved' ? 'text-green-600' : 'text-red-600'}>{p.status}</span>
                    </div>
                    <div className="text-sm text-gray-700 mb-1"><b>By:</b> {p.name} ({p.email}) | {p.organization}</div>
                    <div className="text-xs text-gray-500 mb-2">Submitted: {new Date(p.createdAt).toLocaleString()}</div>
                    <div className="mb-2"><b>Description:</b> {p.description}</div>
                    <div className="mb-2"><b>Deliverables:</b> {p.deliverables}</div>
                    <div className="mb-2"><b>Tech Stack:</b> {p.techStack}</div>
                    <div className="mb-2"><b>Target Audience:</b> {p.targetAudience}</div>
                    <div className="mb-2"><b>Prize:</b> {p.prizeAmount} - {p.prizeDescription}</div>
                    <div className="mb-2"><b>Judging:</b> {p.provideJudges === 'yes' ? `Sponsor Provided (${p.judgeName}, ${p.judgeEmail}, ${p.judgeRole})` : 'Organizer Assigned'}</div>
                    <div className="mb-2"><b>Timeline:</b> {p.customStartDate ? new Date(p.customStartDate).toLocaleDateString() : 'N/A'} - {p.customDeadline ? new Date(p.customDeadline).toLocaleDateString() : 'N/A'}</div>
                    <div className="mb-2"><b>Notes:</b> {p.notes || 'None'}</div>
                    <div className="mb-2 flex items-center gap-2"><b>Telegram:</b> {p.telegram ? <><a href={p.telegram.startsWith('http') ? p.telegram : `https://t.me/${p.telegram}`} target="_blank" rel="noopener noreferrer">{p.telegram}</a> <Button size="icon" variant="ghost" onClick={() => window.open(p.telegram.startsWith('http') ? p.telegram : `https://t.me/${p.telegram.replace('@', '')}`)}><Send className="w-4 h-4" /></Button></> : <Button size="icon" variant="ghost" onClick={() => alert('Sponsor has not provided a Telegram username/link yet.')}><Send className="w-4 h-4 text-gray-400" /></Button>}</div>
                    <div className="mb-2"><b>Discord:</b> {p.discord ? <span>{p.discord}</span> : 'None'}</div>
                    <div className="mb-2 flex items-center gap-2"><b>Message:</b> {p.messageToSponsor ? <span>{p.messageToSponsor}</span> : 'None'}</div>
                    {p.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleReviewProposal(p._id, 'approved')}>Approve</Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleReviewProposal(p._id, 'rejected')}>Reject</Button>
                      </div>
                    )}
                    {p.status !== 'pending' && (
                      <div className="mb-2">
                        <Button size="sm" variant="outline" onClick={() => openMessageModal(p)}><MessageCircle className="w-4 h-4 mr-1" />Message Sponsor</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Review Modal for Approve/Reject with message */}
      {reviewModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative border-4 border-indigo-400">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => { setReviewModal({ open: false, proposalId: null, action: '', loading: false, message: '', price: '' }); }}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-indigo-700">{reviewModal.action === 'approved' ? 'Accept Proposal & Provide Contact Instructions' : 'Reject Proposal'}</h2>

            {reviewModal.action === 'approved' && (
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Set Price/Prize Amount (required)</label>
                <input
                  type="text"
                  className="w-full border-2 border-indigo-300 rounded p-2 mb-2 focus:outline-indigo-500"
                  placeholder="e.g., ₹5000 / $100"
                  value={reviewModal.price || ''}
                  onChange={e => setReviewModal(prev => ({ ...prev, price: e.target.value }))}
                  disabled={reviewModal.loading}
                  required
                />
              </div>
            )}
            <label className="block text-sm font-semibold mb-2">
              {reviewModal.action === 'approved'
                ? 'Contact Instructions / Next Steps for Sponsor (required)'
                : 'Reason for Rejection (required)'}
            </label>
            <textarea
              className="w-full border-2 border-indigo-300 rounded p-2 mb-4 focus:outline-indigo-500"
              rows={4}
              placeholder={reviewModal.action === 'approved' ? 'E.g., We will contact you at your email. Please join our Slack: ... or Next steps for collaboration...' : 'Please specify the reason for rejection.'}
              value={reviewModal.message}
              onChange={e => setReviewModal(prev => ({ ...prev, message: e.target.value }))}
              disabled={reviewModal.loading}
            />
            <Button
              className={reviewModal.action === 'approved' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}
              onClick={() => submitReview()}
              disabled={reviewModal.loading || !reviewModal.message.trim() || (reviewModal.action === 'approved' && !reviewModal.price)}
            >
              {reviewModal.loading ? 'Submitting...' : reviewModal.action === 'approved' ? 'Accept & Send' : 'Reject & Send'}
            </Button>
          </div>
        </div>
      )}


      {messageModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative border-4 border-blue-400">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setMessageModal({ open: false, proposal: null, message: '' })}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">Send Message to Sponsor</h2>
            <textarea
              className="w-full border-2 border-blue-300 rounded p-2 mb-4 focus:outline-blue-500"
              rows={4}
              placeholder="Type your message to the sponsor here..."
              value={messageModal.message}
              onChange={e => setMessageModal(prev => ({ ...prev, message: e.target.value }))}
            />
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSendMessageToSponsor} disabled={!messageModal.message.trim()}>
              Send Message
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
