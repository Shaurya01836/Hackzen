"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/CommonUI/card";
import { Button } from "../../../../components/CommonUI/button";
import { Badge } from "../../../../components/CommonUI/badge";
import { Input } from "../../../../components/CommonUI/input";
import { Label } from "../../../../components/CommonUI/label";
import { Textarea } from "../../../../components/CommonUI/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/CommonUI/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/CommonUI/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/DashboardUI/dialog";
import {
  Users,
  Gavel,
  Target,
  Plus,
  Edit,
  Trash2,
  Award,
  Building,
  Globe,
  Shield,
  Trophy,
  User,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { MultiSelect } from "../../../../components/CommonUI/multiselect";
import ProjectScoresList from '../../../../components/CommonUI/ProjectScoresList';

import axios from "axios";

export default function JudgeManagement({ hackathonId, hideHackathonSelector = false, onBack }) {
  const { token } = useAuth();
  const [hackathon, setHackathon] = useState(null);
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState(hackathonId);
  const [judgeAssignments, setJudgeAssignments] = useState({
    platform: [],
    sponsor: [],
    hybrid: [],
  });
  const [summary, setSummary] = useState({
    total: 0,
    platform: 0,
    sponsor: 0,
    hybrid: 0,
    active: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingHackathons, setLoadingHackathons] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Problem Statement Management
  const [newProblemStatement, setNewProblemStatement] = useState({
    statement: "",
    type: "general",
    sponsorCompany: "",
  });
  const [showAddPSDialog, setShowAddPSDialog] = useState(false);
  const [sponsoredProposals, setSponsoredProposals] = useState([]);
  const [selectedSponsoredProposal, setSelectedSponsoredProposal] = useState(null);

  // Judge Assignment Management
  const [newJudgeAssignment, setNewJudgeAssignment] = useState({
    judgeEmail: "",
    judgeType: "platform",
    sponsorCompany: "",
    canJudgeSponsoredPS: false,
    problemStatementIds: [],
    roundIndices: [],
    maxSubmissionsPerJudge: 50,
  });
  const [showAddJudgeDialog, setShowAddJudgeDialog] = useState(false);

  const [judgedSubmissions, setJudgedSubmissions] = useState([]);

  // Add state for teams and assignment mode loading
  const [teams, setTeams] = useState([]);
  const [assignmentModeLoading, setAssignmentModeLoading] = useState(false);

  useEffect(() => {
    fetchHackathons();
  }, []);

  useEffect(() => {
    if (selectedHackathonId) {
      fetchJudgeAssignments();
    } else {
      setLoading(false);
    }
  }, [selectedHackathonId]);

  useEffect(() => {
    if (selectedHackathonId) {
      fetch(`http://localhost:3000/api/sponsor-proposals/${selectedHackathonId}`)
        .then(res => res.json())
        .then(data => setSponsoredProposals(data.filter(p => p.status === "approved")));
    }
  }, [selectedHackathonId]);

  const fetchJudged = async () => {
    if (!selectedHackathonId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/scores/all/hackathon/${selectedHackathonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJudgedSubmissions(res.data || []);
    } catch (err) {
      setJudgedSubmissions([]);
    }
  };

  useEffect(() => {
    fetchJudged();
  }, [selectedHackathonId]);

  // Fetch teams for the selected hackathon
  useEffect(() => {
    if (!selectedHackathonId) return;
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/api/teams/hackathon/${selectedHackathonId}/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTeams(Array.isArray(data) ? data : []);
      } catch (err) {
        setTeams([]);
      }
    };
    fetchTeams();
  }, [selectedHackathonId]);

  const fetchHackathons = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/hackathons/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setHackathons(data);
      
      // If no hackathonId is provided, select the first hackathon
      if (!selectedHackathonId && data.length > 0) {
        setSelectedHackathonId(data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching hackathons:", error);
    } finally {
      setLoadingHackathons(false);
    }
  };

  const fetchJudgeAssignments = async () => {
    try {
      setLoading(true);
      console.log("Fetching judge assignments for hackathon:", selectedHackathonId);
      
      const response = await fetch(
        `http://localhost:3000/api/judge-management/hackathons/${selectedHackathonId}/judge-assignments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Judge assignments data:", data);
        setHackathon(data.hackathon);
        setJudgeAssignments(data.assignments);
        setSummary(data.summary);
      } else {
        console.error("Failed to fetch judge assignments:", response.status);
        // Set empty data if the API fails
        setHackathon(null);
        setJudgeAssignments({ platform: [], sponsor: [], hybrid: [] });
        setSummary({ total: 0, platform: 0, sponsor: 0, hybrid: 0, active: 0, pending: 0 });
      }
    } catch (error) {
      console.error("Error fetching judge assignments:", error);
      // Set empty data on error
      setHackathon(null);
      setJudgeAssignments({ platform: [], sponsor: [], hybrid: [] });
      setSummary({ total: 0, platform: 0, sponsor: 0, hybrid: 0, active: 0, pending: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addProblemStatement = async () => {
    try {
      const payload = {
        ...newProblemStatement,
      };
      if (newProblemStatement.sponsorProposalId) {
        payload.sponsorProposalId = newProblemStatement.sponsorProposalId;
      }
      const response = await fetch(
        `http://localhost:3000/api/judge-management/hackathons/${selectedHackathonId}/problem-statements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            problemStatements: [payload],
          }),
        }
      );
      if (response.ok) {
        setShowAddPSDialog(false);
        setNewProblemStatement({ statement: "", type: "general", sponsorCompany: "" });
        setSelectedSponsoredProposal(null);
        fetchJudgeAssignments();
      }
    } catch (error) {
      console.error("Error adding problem statement:", error);
    }
  };

  const assignJudge = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/judge-management/hackathons/${selectedHackathonId}/assign-judges`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            judgeAssignments: [newJudgeAssignment],
          }),
        }
      );

      if (response.ok) {
        setShowAddJudgeDialog(false);
        setNewJudgeAssignment({
          judgeEmail: "",
          judgeType: "platform",
          sponsorCompany: "",
          canJudgeSponsoredPS: false,
          problemStatementIds: [],
          roundIndices: [],
          maxSubmissionsPerJudge: 50,
        });
        fetchJudgeAssignments();
      }
    } catch (error) {
      console.error("Error assigning judge:", error);
    }
  };

  const removeJudgeAssignment = async (assignmentId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/judge-management/judge-assignments/${assignmentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        fetchJudgeAssignments();
      }
    } catch (error) {
      console.error("Error removing judge assignment:", error);
    }
  };

  // Handler to set assignment mode for a round or problem statement
  const setAssignmentMode = async (type, index, mode) => {
    setAssignmentModeLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/judge-management/hackathons/${selectedHackathonId}/${type}/${index}/assignment-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mode }),
      });
      if (res.ok) {
        fetchJudgeAssignments();
      }
    } finally {
      setAssignmentModeLoading(false);
    }
  };

  // Handler to assign teams to a judge
  const assignTeamsToJudge = async (assignmentId, teamIds) => {
    console.log("Assigning teams:", teamIds);
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/judge-management/judge-assignments/${assignmentId}/assign-teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ teamIds }),
    });
    if (!res.ok) {
      let error;
      try {
        error = await res.json();
      } catch (e) {
        error = { message: "Unknown error" };
      }
      alert(`Error: ${error.message || JSON.stringify(error)}`);
      console.error("Assign Teams Error:", error, "Status:", res.status);
      return;
    }
    fetchJudgeAssignments();
  };

  // Handler to auto-distribute teams among judges
  const autoDistributeTeams = async (type, index, judgeAssignmentIds, teamIds, forceOverwrite = false) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:3000/api/judge-management/hackathons/${selectedHackathonId}/${type}/${index}/auto-distribute`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ judgeAssignmentIds, teamIds, forceOverwrite }), // Pass forceOverwrite
    });
    if (!res.ok) {
      let error;
      try {
        error = await res.json();
      } catch (e) {
        error = { message: "Unknown error" };
      }
      // Check if the error is due to already assigned teams
      if (res.status === 400 && error.message && error.message.includes('Some teams are already assigned to judges')) {
        const confirmOverwrite = window.confirm(
          `Some teams are already assigned to judges. Do you want to overwrite existing assignments and proceed with auto-distribution?`
        );
        if (confirmOverwrite) {
          // Retry the auto-distribution with forceOverwrite set to true
          await autoDistributeTeams(type, index, judgeAssignmentIds, teamIds, true);
        } else {
          alert("Auto-distribution cancelled.");
        }
      } else {
        alert(`Error: ${error.message || JSON.stringify(error)}`);
      }
      console.error("Auto-Distribute Error:", error, "Status:", res.status);
      return;
    }
    fetchJudgeAssignments();
  };

  // Memoize all judge assignments flat
  const allJudgeAssignments = useMemo(() =>
    [
      ...judgeAssignments.platform,
      ...judgeAssignments.sponsor,
      ...judgeAssignments.hybrid,
    ], [judgeAssignments]);

  // State for assignment UI
  const [selectedJudgeAssignmentId, setSelectedJudgeAssignmentId] = useState("");
  const [selectedAssignmentType, setSelectedAssignmentType] = useState("round");
  const [selectedAssignmentIndex, setSelectedAssignmentIndex] = useState(0);
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [autoDistributeLoading, setAutoDistributeLoading] = useState(false);

  const getJudgeTypeIcon = (type) => {
    switch (type) {
      case "platform":
        return <Globe className="w-4 h-4 text-blue-500" />;
      case "sponsor":
        return <Building className="w-4 h-4 text-green-500" />;
      case "hybrid":
        return <Shield className="w-4 h-4 text-purple-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getJudgeTypeLabel = (type) => {
    switch (type) {
      case "platform":
        return "Platform Judge";
      case "sponsor":
        return "Sponsor Judge";
      case "hybrid":
        return "Hybrid Judge";
      default:
        return "Unknown";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case "completed":
        return <Badge className="bg-blue-500 text-white">Completed</Badge>;
      case "removed":
        return <Badge className="bg-red-500 text-white">Removed</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  if (loadingHackathons) {
    return (
      <div className="flex-1 space-y-8 p-6 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (hackathons.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center text-center">
            <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">No Hackathons Found</h2>
            <p className="text-gray-600 mb-6">
              You need to create a hackathon before you can manage judges and assignments.<br/>
              Get started by creating your first hackathon!
            </p>
            <Button
              className="w-full mb-2 bg-indigo-600 hover:bg-indigo-700 text-lg py-2"
              onClick={() => window.location.href = '/dashboard/create-hackathon'}
            >
              <Plus className="w-5 h-5 mr-2" /> Create Hackathon
            </Button>
            <Button
              className="w-full mt-1"
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-8 p-6 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <Card className="mb-6">
          <CardContent className="pt-6 flex flex-col gap-4">
            {/* First row: Back button, title, actions */}
            <div className="flex items-center gap-4">
              {hideHackathonSelector && typeof onBack === 'function' && (
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-gray-100"
                  onClick={onBack}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex-1">
                Judge Management
              </h1>
              <div className="flex gap-3 flex-wrap">
                {selectedHackathonId && (
                  <>
                    <Dialog open={showAddPSDialog} onOpenChange={setShowAddPSDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Problem Statement
                        </Button>
                      </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Problem Statement</DialogTitle>
                        <DialogDescription>
                          Add a new problem statement for participants to work on.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="statement">Problem Statement</Label>
                          <Textarea
                            id="statement"
                            value={newProblemStatement.statement}
                            onChange={(e) =>
                              setNewProblemStatement({
                                ...newProblemStatement,
                                statement: e.target.value,
                              })
                            }
                            placeholder="Describe the problem participants need to solve..."
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Select
                            value={newProblemStatement.type}
                            onValueChange={(value) =>
                              setNewProblemStatement({
                                ...newProblemStatement,
                                type: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="sponsored">Sponsored</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {newProblemStatement.type === "sponsored" && (
                          <div>
                            <Label htmlFor="sponsorCompany">Sponsor Company</Label>
                            <Input
                              id="sponsorCompany"
                              value={newProblemStatement.sponsorCompany}
                              onChange={(e) =>
                                setNewProblemStatement({
                                  ...newProblemStatement,
                                  sponsorCompany: e.target.value,
                                })
                              }
                              placeholder="Enter sponsor company name"
                            />
                          </div>
                        )}
                        <div>
                          <Label htmlFor="sponsorProposalId">Sponsored Proposal</Label>
                          <Select
                            value={newProblemStatement.sponsorProposalId}
                            onValueChange={id => {
                              setNewProblemStatement(prev => ({
                                ...prev,
                                sponsorProposalId: id,
                              }));
                              const proposal = sponsoredProposals.find(p => p._id === id);
                              setSelectedSponsoredProposal(proposal || null);
                              if (proposal) {
                                setNewProblemStatement(prev => ({
                                  ...prev,
                                  statement: proposal.description || '',
                                  sponsorCompany: proposal.organization || '',
                                  // Optionally, you can prefill more fields if needed
                                }));
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select sponsored proposal" />
                            </SelectTrigger>
                            <SelectContent>
                              {sponsoredProposals.map(proposal => (
                                <SelectItem key={proposal._id} value={proposal._id}>
                                  {proposal.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setShowAddPSDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={addProblemStatement}>Add Problem Statement</Button>
                        </div>
                      </div>
                    </DialogContent>
                    </Dialog>

                    <Dialog open={showAddJudgeDialog} onOpenChange={setShowAddJudgeDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Users className="w-4 h-4 mr-2" />
                          Assign Judge
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Assign Judge</DialogTitle>
                          <DialogDescription>
                            Assign a judge to problem statements and rounds.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="judgeEmail">Judge Email</Label>
                            <Input
                              id="judgeEmail"
                              type="email"
                              value={newJudgeAssignment.judgeEmail}
                              onChange={(e) =>
                                setNewJudgeAssignment({
                                  ...newJudgeAssignment,
                                  judgeEmail: e.target.value,
                                })
                              }
                              placeholder="judge@example.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="judgeType">Judge Type</Label>
                            <Select
                              value={newJudgeAssignment.judgeType}
                              onValueChange={(value) =>
                                setNewJudgeAssignment({
                                  ...newJudgeAssignment,
                                  judgeType: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="platform">Platform Judge</SelectItem>
                                <SelectItem value="sponsor">Sponsor Judge</SelectItem>
                                <SelectItem value="hybrid">Hybrid Judge</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {newJudgeAssignment.judgeType === "sponsor" && (
                            <div>
                              <Label htmlFor="sponsorCompany">Sponsor Company</Label>
                              <Input
                                id="sponsorCompany"
                                value={newJudgeAssignment.sponsorCompany}
                                onChange={(e) =>
                                  setNewJudgeAssignment({
                                    ...newJudgeAssignment,
                                    sponsorCompany: e.target.value,
                                  })
                                }
                                placeholder="Enter sponsor company name"
                              />
                            </div>
                          )}
                          {newJudgeAssignment.judgeType === "platform" && (
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="canJudgeSponsoredPS"
                                checked={newJudgeAssignment.canJudgeSponsoredPS}
                                onChange={(e) =>
                                  setNewJudgeAssignment({
                                    ...newJudgeAssignment,
                                    canJudgeSponsoredPS: e.target.checked,
                                  })
                                }
                              />
                              <Label htmlFor="canJudgeSponsoredPS">
                                Can also judge sponsored problem statements
                              </Label>
                            </div>
                          )}
                          <div>
                            <Label>Assign to Problem Statement(s) (optional)</Label>
                            <MultiSelect
                              options={hackathon?.problemStatements?.map(ps => ({
                                value: ps._id,
                                label: ps.statement,
                              })) || []}
                              value={newJudgeAssignment.problemStatementIds}
                              onChange={ids => setNewJudgeAssignment(prev => ({
                                ...prev,
                                problemStatementIds: ids,
                              }))}
                              placeholder="Select problem statements (leave blank for all eligible)"
                            />
                            <small className="text-gray-500">Leave blank to assign to all eligible problem statements.</small>
                          </div>


                          <div>
                            <Label htmlFor="maxSubmissions">Max Submissions per Judge</Label>
                            <Input
                              id="maxSubmissions"
                              type="number"
                              value={newJudgeAssignment.maxSubmissionsPerJudge}
                              onChange={(e) =>
                                setNewJudgeAssignment({
                                  ...newJudgeAssignment,
                                  maxSubmissionsPerJudge: parseInt(e.target.value),
                                })
                              }
                              min="1"
                              max="100"
                            />
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setShowAddJudgeDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={assignJudge}>Assign Judge</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </div>
            {/* Second row: Hackathon selector and subtitle */}
            <div>
              {!hideHackathonSelector && (
                <div className="flex items-center gap-4 mt-2">
                  <Label htmlFor="hackathon-select" className="text-sm font-medium text-gray-700">
                    Select Hackathon:
                  </Label>
                  <Select
                    value={selectedHackathonId || ""}
                    onValueChange={(value) => setSelectedHackathonId(value)}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Choose a hackathon" />
                    </SelectTrigger>
                    <SelectContent>
                      {hackathons.map((hack) => (
                        <SelectItem key={hack._id} value={hack._id}>
                          {hack.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 rounded-t-xl">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="problem-statements">Problem Statements</TabsTrigger>
                <TabsTrigger value="judges">Judges</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Judges</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary.total}</div>
                      <p className="text-xs text-muted-foreground">
                        {summary.active} active, {summary.pending} pending
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Platform Judges</CardTitle>
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary.platform}</div>
                      <p className="text-xs text-muted-foreground">
                        Can judge general PS
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Sponsor Judges</CardTitle>
                      <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary.sponsor}</div>
                      <p className="text-xs text-muted-foreground">
                        Company-specific PS only
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Hybrid Judges</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{summary.hybrid}</div>
                      <p className="text-xs text-muted-foreground">
                        Can judge all PS types
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Problem Statements Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Problem Statements Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hackathon?.problemStatements?.map((ps, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-white"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge
                              variant={ps.type === "sponsored" ? "default" : "secondary"}
                            >
                              {ps.type === "sponsored" ? "Sponsored" : "General"}
                            </Badge>
                            {ps.type === "sponsored" && (
                              <span className="text-sm text-gray-600">
                                {ps.sponsorCompany}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {typeof ps === "object" ? ps.statement : ps}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Judged Submissions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Judged Submissions</CardTitle>
                    <div className="flex justify-end">
                      <Button size="sm" variant="outline" onClick={fetchJudged}>Refresh</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {judgedSubmissions.length === 0 ? (
                      <p className="text-gray-500">No submissions have been judged yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="p-2 border">Team Name</th>
                              <th className="p-2 border">Problem Statement</th>
                              <th className="p-2 border">Judge</th>
                              <th className="p-2 border">Avg Score</th>
                              <th className="p-2 border">Scores</th>
                              <th className="p-2 border">Feedback</th>
                            </tr>
                          </thead>
                          <tbody>
                            {judgedSubmissions.map((score) => {
                              // Calculate average score
                              let avgScore = "N/A";
                              if (score.scores) {
                                const vals = Object.values(score.scores);
                                if (vals.length > 0) {
                                  avgScore = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
                                }
                              }
                              return (
                                <tr key={score._id} className="border-b">
                                  <td className="p-2 border">
                                    {/* Show all member names if available, else team name, else "-" */}
                                    {score.team?.name ||
                                      (score.team?.members
                                        ? score.team.members.map(m => m.name || m.email).join(", ")
                                        : "-")}
                                  </td>
                                  <td className="p-2 border">
                                    {/* Show statement if object, else string, else "-" */}
                                    {typeof score.problemStatement === "object"
                                      ? score.problemStatement?.statement || "-"
                                      : score.problemStatement || "-"}
                                  </td>
                                  <td className="p-2 border">{score.judge?.name || score.judge?.email || "-"}</td>
                                  <td className="p-2 border">{avgScore}</td>
                                  <td className="p-2 border">
                                    {score.scores && Object.entries(score.scores).map(([k, v]) => (
                                      <div key={k}>{k}: {v}</div>
                                    ))}
                                  </td>
                                  <td className="p-2 border">{score.feedback || "-"}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Problem Statements Tab */}
              <TabsContent value="problem-statements" className="space-y-6 p-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Problem Statements
                    </CardTitle>
                    <CardDescription>
                      Manage problem statements for the hackathon
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {hackathon?.problemStatements?.map((ps, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-white flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={ps.type === "sponsored" ? "default" : "secondary"}
                              >
                                {ps.type === "sponsored" ? "Sponsored" : "General"}
                              </Badge>
                              {ps.type === "sponsored" && (
                                <span className="text-sm text-gray-600">
                                  {ps.sponsorCompany}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700">
                              {typeof ps === "object" ? ps.statement : ps}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Judges Tab */}
              <TabsContent value="judges" className="space-y-6 p-6">
                {/* Platform Judges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-500" />
                      Platform Judges ({judgeAssignments.platform.length})
                    </CardTitle>
                    <CardDescription>
                      Judges who can evaluate general problem statements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {judgeAssignments.platform.map((assignment) => (
                        <div
                          key={assignment._id}
                          className="p-4 border rounded-lg bg-white flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {getJudgeTypeIcon(assignment.judge.type)}
                              <div>
                                <p className="font-medium">{assignment.judge.email}</p>
                                <p className="text-sm text-gray-600">
                                  {getJudgeTypeLabel(assignment.judge.type)}
                                </p>
                              </div>
                            </div>
                            {getStatusBadge(assignment.status)}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => removeJudgeAssignment(assignment._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {judgeAssignments.platform.length === 0 && (
                        <p className="text-gray-500 text-center py-8">
                          No platform judges assigned yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Sponsor Judges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-green-500" />
                      Sponsor Judges ({judgeAssignments.sponsor.length})
                    </CardTitle>
                    <CardDescription>
                      Judges who can only evaluate their company's sponsored problem statements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {judgeAssignments.sponsor.map((assignment) => (
                        <div
                          key={assignment._id}
                          className="p-4 border rounded-lg bg-white flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {getJudgeTypeIcon(assignment.judge.type)}
                              <div>
                                <p className="font-medium">{assignment.judge.email}</p>
                                <p className="text-sm text-gray-600">
                                  {assignment.judge.sponsorCompany}
                                </p>
                              </div>
                            </div>
                            {getStatusBadge(assignment.status)}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => removeJudgeAssignment(assignment._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {judgeAssignments.sponsor.length === 0 && (
                        <p className="text-gray-500 text-center py-8">
                          No sponsor judges assigned yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Hybrid Judges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-500" />
                      Hybrid Judges ({judgeAssignments.hybrid.length})
                    </CardTitle>
                    <CardDescription>
                      Judges who can evaluate both general and sponsored problem statements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {judgeAssignments.hybrid.map((assignment) => (
                        <div
                          key={assignment._id}
                          className="p-4 border rounded-lg bg-white flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {getJudgeTypeIcon(assignment.judge.type)}
                              <div>
                                <p className="font-medium">{assignment.judge.email}</p>
                                <p className="text-sm text-gray-600">
                                  {getJudgeTypeLabel(assignment.judge.type)}
                                </p>
                              </div>
                            </div>
                            {getStatusBadge(assignment.status)}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => removeJudgeAssignment(assignment._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {judgeAssignments.hybrid.length === 0 && (
                        <p className="text-gray-500 text-center py-8">
                          No hybrid judges assigned yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Assignments Tab */}
              <TabsContent value="assignments" className="space-y-6 p-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gavel className="w-5 h-5" />
                      Judge Assignments
                    </CardTitle>
                    <CardDescription>
                      Assign teams to judges and manage assignment mode for rounds/problem statements.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Assignment Mode Toggles */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Assignment Mode</h4>
                      <div className="flex flex-wrap gap-6">
                        {hackathon?.rounds?.map((round, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="font-medium">Round: {round.name || `#${idx + 1}`}</span>
                            <Select
                              value={round.assignmentMode || "open"}
                              onValueChange={mode => setAssignmentMode("round", idx, mode)}
                              disabled={assignmentModeLoading}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="assigned">Assigned</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                        {hackathon?.problemStatements?.map((ps, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="font-medium">PS: {ps.statement.slice(0, 20)}...</span>
                            <Select
                              value={ps.assignmentMode || "open"}
                              onValueChange={mode => setAssignmentMode("problemStatement", idx, mode)}
                              disabled={assignmentModeLoading}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="assigned">Assigned</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Judge/Assignment/Team Selection */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Judge Assignment</Label>
                        <Select
                          value={selectedJudgeAssignmentId}
                          onValueChange={setSelectedJudgeAssignmentId}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Judge" />
                          </SelectTrigger>
                          <SelectContent>
                            {allJudgeAssignments.map(a => (
                              <SelectItem key={a._id} value={a._id}>
                                {a.judge.email} ({getJudgeTypeLabel(a.judge.type)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Assignment Scope</Label>
                        <Select
                          value={selectedAssignmentType}
                          onValueChange={setSelectedAssignmentType}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="round">Round</SelectItem>
                            <SelectItem value="problemStatement">Problem Statement</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={String(selectedAssignmentIndex)}
                          onValueChange={v => setSelectedAssignmentIndex(Number(v))}
                          className="mt-2"
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={selectedAssignmentType === "round" ? "Select Round" : "Select PS"} />
                          </SelectTrigger>
                          <SelectContent>
                            {(selectedAssignmentType === "round"
                              ? hackathon?.rounds || []
                              : hackathon?.problemStatements || []
                            ).map((item, idx) => (
                              <SelectItem key={idx} value={String(idx)}>
                                {selectedAssignmentType === "round"
                                  ? item.name || `Round #${idx + 1}`
                                  : item.statement.slice(0, 30) + (item.statement.length > 30 ? "..." : "")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Teams</Label>
                        <MultiSelect
                          options={teams.map(t => ({ value: t._id, label: t.name }))}
                          value={selectedTeamIds}
                          onChange={setSelectedTeamIds}
                          placeholder="Select teams to assign"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 mb-6">
                      <Button
                        disabled={!selectedJudgeAssignmentId || selectedTeamIds.length === 0}
                        onClick={() => {
                          if (!selectedJudgeAssignmentId) {
                            // Using a custom message box instead of alert()
                            // For this example, I'll use window.alert as a quick placeholder
                            // In a full application, you'd integrate a proper UI component (e.g., a toast or modal)
                            window.alert("Please select a judge assignment first.");
                            return;
                          }
                          if (selectedTeamIds.length === 0) {
                            window.alert("Please select at least one team to assign.");
                            return;
                          }
                          assignTeamsToJudge(selectedJudgeAssignmentId, selectedTeamIds);
                        }}
                      >
                        Assign Selected Teams
                      </Button>
                      <Button
                        variant="outline"
                        disabled={autoDistributeLoading || allJudgeAssignments.length === 0 || teams.length === 0}
                        onClick={async () => {
                          setAutoDistributeLoading(true);
                          // Call autoDistributeTeams without forceOverwrite initially
                          await autoDistributeTeams(
                            selectedAssignmentType,
                            selectedAssignmentIndex,
                            allJudgeAssignments.map(a => a._id),
                            teams.map(t => t._id)
                          );
                          setAutoDistributeLoading(false);
                        }}
                      >
                        Auto-Distribute Teams
                      </Button>
                    </div>
                    {/* Current Assignments Table */}
                    <div>
                      <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-500" />
                        Current Team Assignments
                      </h4>
                      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="p-3 border-b font-semibold text-left">Judge</th>
                              <th className="p-3 border-b font-semibold text-left">Type</th>
                              <th className="p-3 border-b font-semibold text-left">Assigned Teams</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allJudgeAssignments.map(a => (
                              <tr key={a._id} className="border-b hover:bg-indigo-50/30 transition">
                                <td className="p-3 border-b">{a.judge.email}</td>
                                <td className="p-3 border-b">{getJudgeTypeLabel(a.judge.type)}</td>
                                <td className="p-3 border-b">
                                  {Array.isArray(a.assignedTeams) && a.assignedTeams.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 items-center">
                                      {a.assignedTeams.map(teamId => {
                                        const team = teams.find(t => t._id === teamId);
                                        return (
                                          <span key={teamId} className="inline-block bg-indigo-100 text-indigo-800 rounded px-2 py-1 text-xs font-medium">
                                            {team ? team.name : teamId}
                                          </span>
                                        );
                                      })}
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="ml-2 text-red-600 hover:bg-red-50 border border-red-200 px-2 py-1"
                                        title="Unassign all teams from this judge"
                                        onClick={() => assignTeamsToJudge(a._id, [])}
                                      >
                                        Unassign
                                      </Button>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">None</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>
      </div>
    </div>
  );
}
