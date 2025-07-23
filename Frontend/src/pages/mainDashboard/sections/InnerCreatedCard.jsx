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
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from '../../../hooks/use-toast';
import ChatModal from '../components/ChatModal';
import BaseModal from "./components/Hackathon/TeamModals/BaseModal";
import { fetchHackathonParticipants } from "../../../lib/api";
import { ProjectCard } from '../../../components/CommonUI/ProjectCard';
import { ProjectDetail } from '../../../components/CommonUI/ProjectDetail';

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
  const { toast } = useToast();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatProposalId, setChatProposalId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participantsModalLoading, setParticipantsModalLoading] = useState(false);
  const [participantsModalError, setParticipantsModalError] = useState(null);
  const [participantsList, setParticipantsList] = useState([]);
  const [showTeamsView, setShowTeamsView] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [showParticipantsView, setShowParticipantsView] = useState(false);
  const [showSubmissionsView, setShowSubmissionsView] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);
  const [selectedType, setSelectedType] = useState('All');

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
          if (!res.ok) throw new Error(await res.text());
          return await res.json();
        };
        const [h, t, s, p] = await Promise.all([
          fetchJson(`http://localhost:3000/api/hackathons/${id}`),
          fetchJson(`http://localhost:3000/api/teams/hackathon/${id}/all`),
          fetchJson(`http://localhost:3000/api/projects/hackathon/${id}`),
          fetchJson(`http://localhost:3000/api/registration/hackathon/${id}/participants`),
        ]);
        setTeams(t);
        setParticipants(p.participants || []);

        // Fetch all submissions for this hackathon (admin endpoint)
        const submissionsRes = await fetchJson(`http://localhost:3000/api/submission-form/admin/hackathon/${id}`);
        const allSubs = submissionsRes.submissions || [];
        // Separate project and PPT submissions (match judge panel logic)
        const pptSubs = allSubs
          .filter((s) => s.pptFile && !s.projectId)
          .map((s) => ({
            ...s,
            type: 'ppt',
            title: s.originalName || 'PPT Submission',
          }));
        const projectSubs = allSubs.filter((s) => s.projectId);
        setSubmissions([...projectSubs, ...pptSubs]);
        setHackathon(h);
      } catch (err) {
        setFetchError(err.message || 'Failed to fetch data');
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
    const title = typeof project.title === 'string' ? project.title : '';
    const teamName = typeof project.teamName === 'string' ? project.teamName : '';
    const members = Array.isArray(project.members) ? project.members : [];
    const search = typeof searchTerm === 'string' ? searchTerm : '';

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      teamName.toLowerCase().includes(search.toLowerCase()) ||
      members.some((member) =>
        typeof member === 'string' && member.toLowerCase().includes(search.toLowerCase())
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
      toast({ title: 'Message sent!', description: 'Your message to the sponsor was sent successfully.' });
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
      body: JSON.stringify({ messageToSponsor: messageModal.message })
    });
    setMessageModal({ open: false, proposal: null, message: '' });
    fetchSponsorProposals();
    toast({ title: 'Message sent!', description: 'Your message to the sponsor was sent successfully.' });
  }

  const handleShowParticipantsModal = async () => {
    if (!hackathon || !hackathon._id) return;
    setParticipantsModalLoading(true);
    setParticipantsModalError(null);
    setShowParticipantsModal(true);
    try {
      const data = await fetchHackathonParticipants(hackathon._id);
      setParticipantsList(data.participants || []);
    } catch (err) {
      setParticipantsModalError("Failed to fetch participants");
      setParticipantsList([]);
    } finally {
      setParticipantsModalLoading(false);
    }
  };

  return (
    <>
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

      {/* Main Content Area - Only show one or the other */}
      {showSubmissionsView ? (
        <div className="max-w-6xl mx-auto p-6">
          {/* Dropdown filter for submission type */}
          {!selectedSubmissionId && (
            <div className="mb-6 flex items-center gap-4">
              <label className="font-medium text-gray-700">Filter by Type:</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="PPT">PPT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {selectedSubmissionId ? (
            (() => {
              const sub = submissions.find(s => s._id === selectedSubmissionId);
              if (!sub) return null;
              return (
                <div>
                  <button className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium" onClick={() => setSelectedSubmissionId(null)}>
                    ← Back to Submissions
                  </button>
                  <ProjectDetail
                    project={{
                      ...sub,
                      ...(sub.projectId && typeof sub.projectId === 'object' ? sub.projectId : {}),
                    }}
                    onBack={() => setSelectedSubmissionId(null)}
                    hideBackButton={true}
                    onlyOverview={false}
                  />
                </div>
              );
            })()
          ) : (
            <>
              <button className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium" onClick={() => setShowSubmissionsView(false)}>
                ← Back to Overview
              </button>
              <h1 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Submissions</h1>
              {(() => {
                let filteredSubs = submissions;
                try {
                  const safeSelectedType = typeof selectedType === 'string' && selectedType ? selectedType : 'All';
                  filteredSubs = safeSelectedType.toLowerCase() === 'all'
                    ? submissions
                    : submissions.filter(sub => {
                        let type = 'project';
                        if (typeof sub.type === 'string' && sub.type) {
                          type = sub.type.toLowerCase();
                        } else if (sub.pptFile) {
                          type = 'ppt';
                        }
                        if (typeof type !== 'string' || typeof safeSelectedType !== 'string') {
                          console.warn('Skipping submission due to invalid type:', sub, type, safeSelectedType);
                          return false;
                        }
                        return type === safeSelectedType.toLowerCase();
                      });
                } catch (err) {
                  console.error('Error filtering submissions:', err);
                  filteredSubs = submissions; // fallback to showing all
                }
                if (filteredSubs.length === 0) {
                  return <div className="text-center text-gray-500">No submissions yet.</div>;
                }
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSubs.map((sub, idx) => (
                      <ProjectCard
                        key={sub._id ? String(sub._id) : `submission-${idx}`}
                        project={{
                          ...sub,
                          ...(sub.projectId && typeof sub.projectId === 'object' ? sub.projectId : {}),
                          title: sub.title || sub.originalName || (sub.projectId && sub.projectId.title) || 'Untitled',
                          name: sub.teamName || (sub.team && sub.team.name) || '-',
                          type: sub.type ? sub.type.toUpperCase() : (sub.pptFile ? 'PPT' : 'Project'),
                          status: sub.status || 'Submitted',
                          submittedBy: sub.submittedBy,
                          submittedAt: sub.submittedAt,
                          pptFile: sub.pptFile,
                        }}
                        onClick={() => setSelectedSubmissionId(sub._id)}
                        user={user}
                        judgeScores={[]}
                      />
                    ))}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      ) : showParticipantsView ? (
        <div className="max-w-5xl mx-auto p-6">
          <button className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium" onClick={() => setShowParticipantsView(false)}>
            ← Back to Overview
          </button>
          <h1 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Participants</h1>
          {participants.length === 0 ? (
            <div className="text-center text-gray-500">No participants registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((p, idx) => (
                    <tr key={p._id || p.userId || idx}>
                      <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{p.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{p.teamName || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : showTeamsView ? (
        <div className="max-w-5xl mx-auto p-6">
          {console.log('Teams array:', teams)}
          {selectedTeamId ? (
            (() => {
              const team = teams.find(t => t._id === selectedTeamId);
              // Build a map of userId to submission status
              const userSubmissionMap = {};
              submissions.forEach(sub => {
                if (sub.submittedBy && sub.submittedBy._id) {
                  userSubmissionMap[sub.submittedBy._id] = sub.status || "Draft";
                }
              });
              return (
                <>
                  <button className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium" onClick={() => setSelectedTeamId(null)}>
                    ← Back to Teams
                  </button>
                  <h1 className="text-3xl font-bold text-indigo-900 mb-8 text-center">{team?.name || 'Team Details'}</h1>
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-indigo-800">{team?.name}</div>
                        <div className="text-gray-600 text-sm mt-1">Team Leader: <span className="font-semibold">{team?.leader?.name}</span></div>
                      </div>
                      <div className="mt-2 sm:mt-0 text-sm text-gray-500">Members: {team?.members.length}</div>
                    </div>
                    {team?.members.length === 1 && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm text-center">
                        This team has only one member.
                      </div>
                    )}
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {team?.members.map((member) => (
                          <tr key={member._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{team.leader._id === member._id ? "Team Leader" : "Member"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{userSubmissionMap[member._id] || "Not Started"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })()
          ) : (
            <>
              <button className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm font-medium" onClick={() => setShowTeamsView(false)}>
                ← Back to Overview
              </button>
              <h1 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Teams & Leaders</h1>
              {teams.length === 0 ? (
                <div className="text-center text-gray-500">No teams found for this hackathon.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {teams.map((team) => (
                    <div
                      key={team._id}
                      className="bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition cursor-pointer border border-gray-100"
                      onClick={() => setSelectedTeamId(team._id)}
                    >
                      <div className="text-lg font-bold text-indigo-700 mb-2">{team.name}</div>
                      <div className="text-sm text-gray-500 mb-1">Team Leader: <span className="font-semibold text-gray-700">{team.leader?.name}</span></div>
                      <div className="text-xs text-gray-400 mt-2">Members: {team.members.length}</div>
                      {team.members.length === 1 && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-blue-800 text-xs text-center">
                          This team has only one member.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="min-h-screen bg-[#f9f9fb]">
          {/* Stats Overview */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Hackathon Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full mb-8">
              <ACard className="cursor-pointer hover:shadow-lg transition" onClick={() => setShowParticipantsView(true)}>
                <ACardContent className="pt-4 flex flex-col items-center justify-center py-6">
                  <Users className="w-8 h-8 text-indigo-500 mb-2" />
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {totalParticipants}
                  </p>
                  <p className="text-sm text-gray-500 font-medium text-center">
                    Participants
                  </p>
                </ACardContent>
              </ACard>
              <ACard
                className="cursor-pointer hover:shadow-lg transition"
                onClick={() => setShowTeamsView(true)}
              >
                <ACardContent className="pt-4 flex flex-col items-center justify-center py-6">
                  <Users2 className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {totalTeams}
                  </p>
                  <p className="text-sm text-gray-500 font-medium text-center">
                    Teams
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Click to view all teams</p>
                </ACardContent>
              </ACard>
              <ACard
                className="cursor-pointer hover:shadow-lg transition"
                onClick={() => setShowSubmissionsView(true)}
              >
                <ACardContent className="pt-4 flex flex-col items-center justify-center py-6">
                  <Upload className="w-8 h-8 text-green-500 mb-2" />
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {totalSubmissions}
                  </p>
                  <p className="text-sm text-gray-500 font-medium text-center">
                    Submissions
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Click to view all submissions</p>
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
          </section>

          {/* Submitted Projects + Quick Actions Side by Side, Projects Scrollable */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Submitted Projects - Only Cards Scrollable, Hide Scrollbar */}
             
            
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
                    <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        <dt className="font-semibold text-gray-700">Organization / Company Name:</dt>
                        <dd className="text-gray-900 break-words">{p.organization || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Proposal Title:</dt>
                        <dd className="text-gray-900 break-words">{p.title || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Description / Problem Context:</dt>
                        <dd className="text-gray-900 break-words">{p.description || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Expected Deliverables:</dt>
                        <dd className="text-gray-900 break-words">{p.deliverables || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Preferred Tech Stack or Domain:</dt>
                        <dd className="text-gray-900 break-words">{p.techStack || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Target Audience:</dt>
                        <dd className="text-gray-900 break-words">{p.targetAudience || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Prize Amount:</dt>
                        <dd className="text-gray-900 break-words">{p.prizeAmount || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Prize Description:</dt>
                        <dd className="text-gray-900 break-words">{p.prizeDescription || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Will you provide judges?</dt>
                        <dd className="text-gray-900 break-words">{p.provideJudges || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Judge Name:</dt>
                        <dd className="text-gray-900 break-words">{p.judgeName || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Judge Email:</dt>
                        <dd className="text-gray-900 break-words">{p.judgeEmail || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Judge Role:</dt>
                        <dd className="text-gray-900 break-words">{p.judgeRole || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Preferred Start Date:</dt>
                        <dd className="text-gray-900 break-words">{p.customStartDate ? new Date(p.customStartDate).toLocaleDateString() : <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Preferred Deadline:</dt>
                        <dd className="text-gray-900 break-words">{p.customDeadline ? new Date(p.customDeadline).toLocaleDateString() : <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Additional Notes:</dt>
                        <dd className="text-gray-900 break-words">{p.notes || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Telegram:</dt>
                        <dd className="text-gray-900 break-words">{p.telegram ? <a href={p.telegram.startsWith('http') ? p.telegram : `https://t.me/${p.telegram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer">{p.telegram}</a> : <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Discord:</dt>
                        <dd className="text-gray-900 break-words">{p.discord || <span className="text-gray-400">-</span>}</dd>
                        <dt className="font-semibold text-gray-700">Sponsor Email:</dt>
                        <dd className="text-gray-900 break-words">{p.email || <span className="text-gray-400">-</span>}</dd>
                      </dl>
                    </div>
                    {p.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleReviewProposal(p._id, 'approved')}>Approve</Button>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleReviewProposal(p._id, 'rejected')}>Reject</Button>
                      </div>
                    )}
                   
                    <Button size="sm" variant="default" className="mt-2" onClick={() => { setChatProposalId(p._id); setChatOpen(true); }}>Chat with Sponsor</Button>
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
            {user && !user.telegram && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded">
                <b>Reminder:</b> Please provide your Telegram handle in your profile so sponsors can contact you.
              </div>
            )}
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
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} proposalId={chatProposalId} currentUser={user} />
      {/* Participants Modal */}
      <BaseModal
        open={showParticipantsModal}
        onOpenChange={setShowParticipantsModal}
        title="Registered Participants"
        content={
          participantsModalLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : participantsModalError ? (
            <div className="p-4 text-red-600">{participantsModalError}</div>
          ) : participantsList.length === 0 ? (
            <div className="p-4 text-gray-500">No participants registered yet.</div>
          ) : (
            <ul className="max-h-72 overflow-y-auto divide-y">
              {participantsList.map((p, idx) => (
                <li key={p.id || p.userId || idx} className="py-2 flex items-center gap-3">
                  {p.avatar && <img src={p.avatar} alt="avatar" className="w-8 h-8 rounded-full" />}
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.email}</div>
                  </div>
                  {p.teamName && <span className="ml-auto text-xs text-indigo-600">{p.teamName}</span>}
                </li>
              ))}
            </ul>
          )
        }
      />
    </>
  );
}
