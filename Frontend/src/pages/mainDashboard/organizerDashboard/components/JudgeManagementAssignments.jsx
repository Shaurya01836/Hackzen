"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../components/CommonUI/card";
import { Button } from "../../../../components/CommonUI/button";
import { Gavel, Loader2, Users, Award, FileText, Eye, Calendar, Mail, CheckCircle, RefreshCw } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../../../../components/DashboardUI/avatar";
import { toast } from "../../../../hooks/use-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from "../../../../components/DashboardUI/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../../components/DashboardUI/dialog";
import SubmissionRoundView from "./SubmissionRoundView";
import BulkEvaluatorAssignModal from "./BulkEvaluatorAssignModal";

// Mock stages data
const stages = [
  { id: 'reg', label: 'All Registrations', icon: 'REG', status: 'active' },
  { id: 'r1', label: 'Submission Round 1', icon: 'R1', status: 'in-progress' },
  { id: 'r2', label: 'Submission Round 2', icon: 'R2', status: 'pending' },
];

export default function JudgeManagementAssignments({
  allJudgeAssignments,
  hackathon,
  teams,
  fetchJudgeAssignments,
  submissions = [],
}) {
  const [unassigning, setUnassigning] = useState({});
  const [selectedStage, setSelectedStage] = useState(stages[0].id);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedSubmissions, setSelectedSubmissions] = useState(new Set());
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignmentOverview, setAssignmentOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [availableJudges, setAvailableJudges] = useState([]);
  const [deletingJudge, setDeletingJudge] = useState(null);
  const [judgeDetailsOpen, setJudgeDetailsOpen] = useState(false);
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [judgeDetailsModalOpen, setJudgeDetailsModalOpen] = useState(false);
  const [loadingAvailableJudges, setLoadingAvailableJudges] = useState(false);
  const [submissionScores, setSubmissionScores] = useState({});

  // Debug log after all state initializations
  useEffect(() => {
      console.log('🔍 DEBUG: JudgeManagementAssignments render', { 
    submissionsLength: submissions.length,
    hackathonId: hackathon?._id || hackathon?.id,
    selectedStage,
    assignmentOverview: !!assignmentOverview,
    selectedSubmissionsSize: selectedSubmissions.size
  });
  }, [submissions.length, hackathon?._id, selectedStage, assignmentOverview, selectedSubmissions.size]);


  // Fetch assignment overview when component mounts or hackathon changes
  useEffect(() => {
    console.log('🔍 DEBUG: useEffect triggered for fetchAssignmentOverview', { hackathonId: hackathon?._id || hackathon?.id });
    if (hackathon?._id || hackathon?.id) {
      fetchAssignmentOverview();
    }
  }, [hackathon?._id, hackathon?.id]);

  // Refresh assignment overview periodically to ensure data is current
  useEffect(() => {
    console.log('🔍 DEBUG: Setting up periodic refresh for assignment overview', { hackathonId: hackathon?._id || hackathon?.id });
    if (hackathon?._id || hackathon?.id) {
      const interval = setInterval(() => {
        console.log('🔍 DEBUG: Periodic refresh of assignment overview');
        fetchAssignmentOverview();
      }, 30000); // Refresh every 30 seconds

      return () => {
        console.log('🔍 DEBUG: Clearing periodic refresh interval');
        clearInterval(interval);
      };
    }
  }, [hackathon?._id, hackathon?.id]);

  // Fetch scores when assignment overview changes
  useEffect(() => {
    if (assignmentOverview) {
      fetchSubmissionScores();
    }
  }, [assignmentOverview]);

  const fetchAssignmentOverview = async () => {
    const hackathonId = hackathon?._id || hackathon?.id;
    if (!hackathonId) {
      console.log('🔍 DEBUG: No hackathon ID available for fetchAssignmentOverview');
      return;
    }
    
    console.log('🔍 DEBUG: Starting fetchAssignmentOverview for hackathon:', hackathonId);
    setOverviewLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 DEBUG: Token available:', !!token);
      
      const url = `http://localhost:3000/api/judge-management/hackathons/${hackathonId}/assignment-overview`;
      console.log('🔍 DEBUG: Fetching from URL:', url);
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('🔍 DEBUG: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 DEBUG: Assignment overview data received:', {
          totalSubmissions: data.summary?.totalSubmissions,
          assignedSubmissions: data.summary?.assignedSubmissions,
          unassignedSubmissions: data.summary?.unassignedSubmissions,
          judges: data.judges?.length,
          unassignedIds: data.unassignedSubmissions?.map(s => s._id),
          assignedIds: data.assignedSubmissions?.map(s => s._id)
        });
        setAssignmentOverview(data);
      } else {
        const errorText = await response.text();
        console.error('🔍 DEBUG: Failed to fetch assignment overview:', response.status, errorText);
        toast({
          title: 'Error',
          description: `Failed to fetch assignment overview. Status: ${response.status}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('🔍 DEBUG: Error fetching assignment overview:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch assignment overview. Please check your connection.',
        variant: 'destructive',
      });
    } finally {
      setOverviewLoading(false);
      console.log('🔍 DEBUG: fetchAssignmentOverview completed');
    }
  };

  // Helper: get round name from stage id
  const getRoundName = (stageId) => {
    if (stageId === 'reg') return 'All Registrations';
    if (stageId === 'r1') return 'Submission Round 1';
    if (stageId === 'r2') return 'Submission Round 2';
    return stageId;
  };

  // Helper: get round details (mock for now)
  const getRoundDetails = (stageId) => {
    if (stageId === 'reg') return 'All teams that have registered.';
    if (stageId === 'r1') return 'Teams that have submitted in Submission Round 1.';
    if (stageId === 'r2') return 'Teams that have submitted in Submission Round 2.';
    return '';
  };

  // Filter teams by selected stage (round)
  let teamsToShow = teams;
  if (selectedStage === 'r1' || selectedStage === 'r2') {
    // Find all team IDs that have a submission in this round
    const roundName = getRoundName(selectedStage);
    const submittedTeamIds = submissions
      .filter(sub => (sub.round === roundName || sub.roundName === roundName || sub.round?.name === roundName))
      .map(sub => sub.team?._id || sub.teamId || sub.teamName)
      .filter(Boolean);
    teamsToShow = teams.filter(team => submittedTeamIds.includes(team._id) || submittedTeamIds.includes(team.name));
  }

  const handleUnassignAll = async (assignmentId) => {
    setUnassigning(prev => ({ ...prev, [assignmentId]: true }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/judge-management/judge-assignments/${assignmentId}/assign-teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ teamIds: [] }),
      });
      if (res.ok) {
        fetchJudgeAssignments?.();
        toast({ title: "All teams unassigned successfully!" });
      } else {
        toast({ title: "Failed to unassign teams", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Failed to unassign teams", variant: "destructive" });
    } finally {
      setUnassigning(prev => ({ ...prev, [assignmentId]: false }));
    }
  };

  const handleJudgeClick = (judge) => {
    setSelectedJudge(judge);
    setJudgeDetailsModalOpen(true);
  };

  const getJudgeAssignmentStats = (judge) => {
    const totalSubmissions = judge.assignedRounds?.reduce((total, round) => 
      total + (round.assignedSubmissions?.length || 0), 0) || 0;
    
    const evaluatedSubmissions = judge.assignedRounds?.reduce((total, round) => {
      const evaluatedInRound = round.assignedSubmissions?.filter(subId => {
        const submission = submissions.find(s => s._id === subId);
        return submission?.scores?.length > 0;
      }).length || 0;
      return total + evaluatedInRound;
    }, 0) || 0;

    return { totalSubmissions, evaluatedSubmissions };
  };

  const getJudgeAssignedTeams = (judge) => {
    const assignedTeamIds = new Set();
    judge.assignedRounds?.forEach(round => {
      round.assignedSubmissions?.forEach(subId => {
        const submission = submissions.find(s => s._id === subId);
        if (submission?.teamId) {
          assignedTeamIds.add(submission.teamId);
        }
      });
    });
    
    return teams.filter(team => assignedTeamIds.has(team._id));
  };

  const handleDeleteJudge = async (judgeAssignment) => {
    if (!confirm(`Are you sure you want to delete judge "${judgeAssignment.judge.email}"? This will also remove all their assigned submissions and scores.`)) {
      return;
    }

    setDeletingJudge(judgeAssignment._id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/judge-management/hackathons/${hackathon?._id || hackathon?.id}/judges/${judgeAssignment._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const result = await res.json();
        toast({ 
          title: "Judge deleted successfully!", 
          description: `Removed ${result.deletedJudge.assignmentsRemoved} assignments and ${result.deletedJudge.scoresRemoved} scores.`
        });
        fetchJudgeAssignments?.();
      } else {
        const error = await res.json();
        toast({ 
          title: "Failed to delete judge", 
          description: error.message || "An error occurred while deleting the judge.",
          variant: "destructive" 
        });
      }
    } catch (err) {
      toast({ 
        title: "Failed to delete judge", 
        description: "Network error occurred. Please try again.",
        variant: "destructive" 
      });
    } finally {
      setDeletingJudge(null);
    }
  };

  const formatDate = (date) => date ? new Date(date).toLocaleString() : '--';

  // Calculate average score for a submission
  const getAverageScore = (submissionId) => {
    const scores = submissionScores[submissionId] || [];
    if (scores.length === 0) return null;
    
    const CRITERIA = ["innovation", "impact", "technicality", "presentation"];
    const totalScore = scores.reduce((sum, score) => {
      const criteriaScore = CRITERIA.reduce((acc, criteria) => acc + (score.scores?.[criteria] || 0), 0);
      return sum + (criteriaScore / CRITERIA.length);
    }, 0);
    
    return (totalScore / scores.length).toFixed(2);
  };

  // Fetch scores for submissions
  const fetchSubmissionScores = async () => {
    try {
      const token = localStorage.getItem('token');
      const allSubmissionIds = [
        ...(assignmentOverview?.unassignedSubmissions?.map(sub => sub._id) || []),
        ...(assignmentOverview?.assignedSubmissions?.map(sub => sub._id) || [])
      ];
      
      if (allSubmissionIds.length === 0) return;

      const response = await fetch(`http://localhost:3000/api/scores/submissions-scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ submissionIds: allSubmissionIds })
      });

      if (response.ok) {
        const data = await response.json();
        const scoresData = {};
        
        data.forEach(score => {
          if (!scoresData[score.submissionId]) {
            scoresData[score.submissionId] = [];
          }
          scoresData[score.submissionId].push(score);
        });
        
        setSubmissionScores(scoresData);
        console.log('🔍 Fetched submission scores:', scoresData);
      }
    } catch (error) {
      console.error('Error fetching submission scores:', error);
    }
  };

  // Fetch available judges
  // Handle submission selection
  const handleSubmissionSelection = (submissionId, isSelected) => {
    console.log('🔍 DEBUG: handleSubmissionSelection called:', { submissionId, isSelected });
    setSelectedSubmissions(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(submissionId);
      } else {
        newSet.delete(submissionId);
      }
      console.log('🔍 DEBUG: Updated selectedSubmissions:', Array.from(newSet));
      return newSet;
    });
  };

  // Handle bulk assignment
  const handleBulkAssignment = () => {
    console.log('🔍 DEBUG: handleBulkAssignment called with selectedSubmissions:', Array.from(selectedSubmissions));
    if (selectedSubmissions.size === 0) {
      console.log('🔍 DEBUG: No submissions selected for assignment');
      toast({
        title: "No submissions selected",
        description: "Please select at least one submission to assign.",
        variant: "destructive",
      });
      return;
    }
    console.log('🔍 DEBUG: Opening assignment modal');
    setAssignModalOpen(true);
  };

  const fetchAvailableJudges = async () => {
    const hackathonId = hackathon?._id || hackathon?.id;
    if (!hackathonId) return;
    
    setLoadingAvailableJudges(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/judge-management/hackathons/${hackathonId}/available-judges`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAvailableJudges(data.evaluators || []);
      } else {
        console.error('Failed to fetch available judges');
      }
    } catch (error) {
      console.error('Error fetching available judges:', error);
    } finally {
      setLoadingAvailableJudges(false);
    }
  };

  // Fetch available judges when component mounts
  React.useEffect(() => {
    fetchAvailableJudges();
  }, [hackathon?._id]);

  // Find the round object for the selected stage
  let roundObj = null;
  if ((selectedStage === 'r1' || selectedStage === 'r2') && hackathon?.rounds) {
    const roundName = getRoundName(selectedStage);
    roundObj = hackathon.rounds.find(r => r.name === roundName);
  }

  // Format round dates for description
  let roundDescription = getRoundDetails(selectedStage);
  if (roundObj) {
    roundDescription += `\nStart: ${formatDate(roundObj.startDate)}\nEnd: ${formatDate(roundObj.endDate)}`;
  }

  return (
    <div className="space-y-6">
      {/* Stage Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => setSelectedStage(stage.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedStage === stage.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {stage.label}
          </button>
        ))}
      </div>

      {/* Show Submission Round 1 or 2 view if selected */}
      {(selectedStage === 'r1' || selectedStage === 'r2') ? (
        <SubmissionRoundView
          roundId={roundObj?._id || selectedStage}
          roundName={roundObj?.name || getRoundName(selectedStage)}
          roundDescription={roundObj?.description || roundDescription}
          roundStart={roundObj?.startDate}
          roundEnd={roundObj?.endDate}
          roundIndex={selectedStage === 'r1' ? 0 : 1}
          roundType={roundObj?.type || 'ppt'}
          teams={teams}
          submissions={submissions}
          judgeAssignments={allJudgeAssignments || { platform: [], sponsor: [], hybrid: [] }}
          hackathonId={hackathon && (hackathon._id || hackathon.id) ? (hackathon._id || hackathon.id) : ""}
          onAssignmentComplete={() => {
            // Refresh assignment overview when assignments are made
            fetchAssignmentOverview();
            // Also refresh judge assignments if the callback exists
            if (fetchJudgeAssignments) {
              fetchJudgeAssignments();
            }
          }}
        />
      ) : (
        <>
          {/* Show round name and details above the table for other stages */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
              {getRoundName(selectedStage)}
            </h2>
            <p className="text-gray-500 text-base">{getRoundDetails(selectedStage)}</p>
          </div>
          
          {/* Team Management Section */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5" />
                Team Management
              </CardTitle>
              <CardDescription>
                View and manage teams across different stages of the hackathon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Teams Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leader</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamsToShow.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-gray-400">No teams found.</td></tr>
                    ) : teamsToShow.map((team, idx) => (
                      <tr key={team._id} className="border-b hover:bg-indigo-50 transition-all">
                        <td className="px-6 py-4 font-medium">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <button className="flex items-center gap-2 font-semibold text-indigo-700 hover:underline" onClick={() => setSelectedTeam(team)}>
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-white" style={{ background: '#'+((1<<24)*Math.abs(Math.sin(team.name.length))).toString(16).slice(0,6) }}>{team.name.charAt(0).toUpperCase()}</div>
                            {team.name}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">{team.leader?.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" /></svg>
                            REG <span className="text-green-500">→</span> R1
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Current Assignments Table */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5" />
                Current Judge Assignments
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAssignmentOverview}
                  disabled={overviewLoading}
                  className="ml-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${overviewLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedSubmissions(new Set());
                    fetchAssignmentOverview();
                  }}
                  disabled={overviewLoading}
                >
                  Force Refresh
                </Button>
              </CardTitle>
              <CardDescription>
                View current judge assignments and their assigned projects/teams for this hackathon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Assignment Summary */}
              {assignmentOverview && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Active Judges</div>
                        <div className="text-lg font-bold text-blue-700">{assignmentOverview.judges?.length || 0}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Assigned Projects</div>
                        <div className="text-lg font-bold text-green-700">
                          {assignmentOverview.judges?.reduce((total, judge) => total + (judge.assignedSubmissions?.length || 0), 0) || 0}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Unassigned Projects</div>
                        <div className="text-lg font-bold text-orange-700">{assignmentOverview.unassignedSubmissions?.length || 0}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Total Projects</div>
                        <div className="text-lg font-bold text-purple-700">
                          {(assignmentOverview.judges?.reduce((total, judge) => total + (judge.assignedSubmissions?.length || 0), 0) || 0) + 
                           (assignmentOverview.unassignedSubmissions?.length || 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Unassigned and Assigned Submissions Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Unassigned Submissions */}
                <Card className="border-2 border-orange-200 bg-orange-50/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                      <FileText className="w-5 h-5" />
                      Unassigned Submissions ({assignmentOverview?.unassignedSubmissions?.length || 0})
                    </CardTitle>
                    <CardDescription className="text-orange-600">
                      These submissions need to be assigned to judges
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {assignmentOverview?.unassignedSubmissions?.length > 0 ? (
                        <>
                          {assignmentOverview.unassignedSubmissions.map((submission) => (
                            <div key={submission._id} className="p-3 bg-white rounded-lg border border-orange-200">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium text-gray-900">
                                  {submission.projectTitle || submission.title || 'Untitled Project'}
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={selectedSubmissions.has(submission._id)}
                                    onChange={(e) => handleSubmissionSelection(submission._id, e.target.checked)}
                                  />
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                {submission.teamName} • {submission.pptFile ? 'PPT' : 'Project'}
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                  <span>Status: Unassigned</span>
                                  {(() => {
                                    const averageScore = getAverageScore(submission._id);
                                    const scores = submissionScores[submission._id] || [];
                                    if (scores.length > 0) {
                                      return (
                                        <span className="text-green-600 font-medium">
                                          Score: {averageScore}/10 ({scores.length} judge{scores.length > 1 ? 's' : ''})
                                        </span>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                                <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                          {selectedSubmissions.size > 0 && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-900">
                                    {selectedSubmissions.size} submission{selectedSubmissions.size > 1 ? 's' : ''} selected
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={handleBulkAssignment}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <Users className="w-4 h-4 mr-1" />
                                  Assign to Judges
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p>No unassigned submissions</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Assigned Submissions */}
                <Card className="border-2 border-green-200 bg-green-50/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      Assigned Submissions ({assignmentOverview?.assignedSubmissions?.length || 0})
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      These submissions are already assigned to judges
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {assignmentOverview?.assignedSubmissions?.length > 0 ? (
                        assignmentOverview.assignedSubmissions.map((submission) => (
                          <div key={submission._id} className="p-3 bg-white rounded-lg border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-gray-900">
                                {submission.projectTitle || submission.title || 'Untitled Project'}
                              </div>
                              <div className="flex items-center gap-2">
                                {submission.evaluationStatus === 'evaluated' ? (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Evaluated
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                                    <span className="w-3 h-3 mr-1">⏳</span>
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {submission.teamName} • {submission.pptFile ? 'PPT' : 'Project'}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-2">
                                <span>Assigned to: {submission.assignedJudges?.map(j => j.judgeName).join(', ') || 'Unknown'}</span>
                                {(() => {
                                  const averageScore = getAverageScore(submission._id);
                                  const scores = submissionScores[submission._id] || [];
                                  if (scores.length > 0) {
                                    return (
                                      <span className="text-green-600 font-medium">
                                        Score: {averageScore}/10 ({scores.length} judge{scores.length > 1 ? 's' : ''})
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                              <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                            </div>
                            {submission.averageScore && (
                              <div className="mt-2 text-xs text-gray-600">
                                Average Score: {submission.averageScore}/10 ({submission.scoreCount} evaluations)
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p>No assigned submissions</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="overflow-x-auto rounded-2xl shadow-lg bg-white/90 border border-gray-200 p-2 md:p-4">
                <table className="min-w-full text-sm border-separate border-spacing-y-3">
                  <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-8 py-4 text-left font-bold text-gray-800 tracking-wide rounded-tl-2xl">Judge</th>
                      <th className="px-8 py-4 text-left font-bold text-gray-800 tracking-wide">Type</th>
                      <th className="px-8 py-4 text-left font-bold text-gray-800 tracking-wide">Status</th>
                      <th className="px-8 py-4 text-left font-bold text-gray-800 tracking-wide">Assigned Projects</th>
                      <th className="px-8 py-4 text-left font-bold text-gray-800 tracking-wide rounded-tr-2xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Assigned Judges */}
                    {allJudgeAssignments.length === 0 && availableJudges.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-16">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span className="text-5xl">🧑‍⚖️</span>
                            <span className="font-semibold text-gray-700 text-lg">No judges assigned yet</span>
                            <span className="text-gray-500 text-base">Invite judges to get started.</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {/* Assigned Judges */}
                        {allJudgeAssignments.map(a => (
                          <tr key={a._id} className="bg-white hover:bg-indigo-50 transition-all duration-200 rounded-2xl shadow-md border border-gray-100">
                            <td className="px-8 py-4 flex items-center gap-4 border-r border-gray-100">
                              <Avatar className="h-9 w-9 shadow-sm">
                                <AvatarImage src={a.judge.avatarUrl || undefined} alt={a.judge.email} />
                                <AvatarFallback>{a.judge.email[0]?.toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <button 
                                onClick={() => handleJudgeClick(a)}
                                className="font-medium text-gray-900 hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                              >
                                {a.judge.email}
                              </button>
                            </td>
                            <td className="px-8 py-4 border-r border-gray-100">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${a.judge.type === 'platform' ? 'bg-blue-100 text-blue-700' : a.judge.type === 'sponsor' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{a.judge.type}</span>
                            </td>
                            <td className="px-8 py-4 border-r border-gray-100">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Assigned
                              </span>
                            </td>
                                                             <td className="px-8 py-4 border-r border-gray-100">
                               <div className="space-y-2">
                                 {(() => {
                                   // Get assigned projects from assignment overview
                                   const judgeOverview = assignmentOverview?.judges?.find(j => j.judgeEmail === a.judge.email);
                                   const assignedProjects = judgeOverview?.assignedSubmissions || [];
                                   
                                   if (assignedProjects.length > 0) {
                                     return (
                                       <div className="space-y-1">
                                         {assignedProjects.slice(0, 3).map((project, idx) => (
                                           <div key={project._id} className="flex items-center justify-between p-2 bg-indigo-50 rounded border border-indigo-100">
                                             <div className="flex items-center gap-2">
                                               <FileText className="w-3 h-3 text-indigo-600" />
                                               <span className="text-xs font-medium text-indigo-700">
                                                 {project.projectTitle || 'Untitled'}
                                               </span>
                                             </div>
                                             <div className="flex items-center gap-2">
                                               <span className={`text-xs px-2 py-1 rounded-full ${
                                                 project.evaluationStatus === 'evaluated' 
                                                   ? 'bg-green-100 text-green-700' 
                                                   : 'bg-yellow-100 text-yellow-700'
                                               }`}>
                                                 {project.evaluationStatus === 'evaluated' ? '✓' : '⏳'}
                                               </span>
                                               {project.averageScore && (
                                                 <span className="text-xs font-bold text-green-700">
                                                   {project.averageScore}/10
                                                 </span>
                                               )}
                                             </div>
                                           </div>
                                         ))}
                                         {assignedProjects.length > 3 && (
                                           <div className="text-xs text-gray-500 text-center">
                                             +{assignedProjects.length - 3} more projects
                                           </div>
                                         )}
                                       </div>
                                     );
                                   } else {
                                     return (
                                       <span className="text-gray-400 text-sm">No projects assigned</span>
                                     );
                                   }
                                 })()}
                               </div>
                             </td>
                            <td className="px-8 py-4">
                              <div className="flex items-center gap-2">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                      Unassign All
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Unassign All Teams</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will remove all team assignments from this judge. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleUnassignAll(a._id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        {unassigning[a._id] ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unassign All"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                                      disabled={deletingJudge === a._id}
                                    >
                                      {deletingJudge === a._id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        "Delete Judge"
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Judge</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete judge "{a.judge.email}" and remove all their:
                                        <ul className="list-disc list-inside mt-2 space-y-1">
                                          <li>Assigned submissions</li>
                                          <li>Given scores</li>
                                          <li>Judge role for this hackathon</li>
                                        </ul>
                                        <p className="mt-2 font-semibold text-red-600">This action cannot be undone!</p>
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteJudge(a)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete Judge
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </td>
                          </tr>
                        ))}
                        
                        {/* Available Judges */}
                        {availableJudges.map(judge => (
                          <tr key={judge.id} className="bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-2xl shadow-sm border border-gray-200">
                            <td className="px-8 py-4 flex items-center gap-4 border-r border-gray-200">
                              <Avatar className="h-9 w-9 shadow-sm">
                                <AvatarImage src={judge.profileImage || undefined} alt={judge.email} />
                                <AvatarFallback>{judge.name?.charAt(0)?.toUpperCase() || judge.email[0]?.toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-gray-600">
                                {judge.name || judge.email}
                              </span>
                            </td>
                            <td className="px-8 py-4 border-r border-gray-200">
                              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm bg-gray-100 text-gray-700">
                                {judge.type || 'external'}
                              </span>
                            </td>
                            <td className="px-8 py-4 border-r border-gray-200">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                                <Users className="w-3 h-3 mr-1" />
                                Available
                              </span>
                            </td>
                            <td className="px-8 py-4 border-r border-gray-200">
                              <span className="text-gray-400 text-sm">Not assigned yet</span>
                            </td>
                            <td className="px-8 py-4">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
                                onClick={() => {
                                  // TODO: Open invite modal or assign directly
                                  toast({
                                    title: 'Invite Judge',
                                    description: `Click "Assign to Judges" in the submission round to invite ${judge.name || judge.email}`,
                                    variant: 'default',
                                  });
                                }}
                              >
                                Invite
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Team Details Modal */}
      <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Team Details</DialogTitle>
            <DialogDescription>
              Detailed view of team information and submissions.
            </DialogDescription>
          </DialogHeader>
          {selectedTeam && (
            <SubmissionRoundView
              team={selectedTeam}
              hackathonId={hackathon?._id || hackathon?.id}
              onClose={() => setSelectedTeam(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Judge Details Modal */}
      <Dialog open={judgeDetailsModalOpen} onOpenChange={setJudgeDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Judge Assignment Details
            </DialogTitle>
            <DialogDescription>
              Detailed view of judge assignments, submissions, and evaluation progress.
            </DialogDescription>
          </DialogHeader>
          {selectedJudge && (
            <div className="space-y-6">
              {/* Judge Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedJudge.judge.avatarUrl || undefined} alt={selectedJudge.judge.email} />
                  <AvatarFallback className="text-lg">{selectedJudge.judge.email[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedJudge.judge.name || selectedJudge.judge.email}</h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {selectedJudge.judge.email}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedJudge.judge.type === 'platform' ? 'bg-blue-100 text-blue-700' : 
                      selectedJudge.judge.type === 'sponsor' ? 'bg-green-100 text-green-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {selectedJudge.judge.type} Judge
                    </span>
                    <span className="text-sm text-gray-500">
                      Status: {selectedJudge.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignment Statistics */}
              {(() => {
                const stats = getJudgeAssignmentStats(selectedJudge);
                const assignedTeams = getJudgeAssignedTeams(selectedJudge);
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">Total Submissions</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">{stats.totalSubmissions}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900">Evaluated</span>
                      </div>
                      <p className="text-2xl font-bold text-green-700">{stats.evaluatedSubmissions}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-purple-900">Assigned Teams</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-700">{assignedTeams.length}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Assigned Teams */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Assigned Teams
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getJudgeAssignedTeams(selectedJudge).map(team => (
                    <div key={team._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-semibold text-gray-900">{team.name}</h5>
                          <p className="text-sm text-gray-600">
                            Leader: {team.leader?.name || 'Unknown'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">
                            {team.members?.length || 0} members
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Round-wise Assignments */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Round-wise Assignments
                </h4>
                {selectedJudge.assignedRounds?.map((round, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-900">
                        {round.roundName || `Round ${round.roundIndex + 1}`}
                      </h5>
                      <span className="text-sm text-gray-500">
                        {round.assignedSubmissions?.length || 0} submissions
                      </span>
                    </div>
                    
                    {round.assignedSubmissions?.length > 0 ? (
                      <div className="space-y-2">
                        {round.assignedSubmissions.map(subId => {
                          const submission = submissions.find(s => s._id === subId);
                          const team = teams.find(t => t._id === submission?.teamId);
                          return submission ? (
                            <div key={subId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                {submission.pptFile ? (
                                  <FileText className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Award className="w-4 h-4 text-green-600" />
                                )}
                                <span className="text-sm font-medium">
                                  {submission.projectTitle || submission.title || 'Untitled Project'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({team?.name || 'No Team'})
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {submission.scores?.length > 0 ? (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    Evaluated
                                  </span>
                                ) : (
                                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                    Pending
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No submissions assigned to this round</p>
                    )}
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">No rounds assigned</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Assignment Modal */}
      <BulkEvaluatorAssignModal
        open={assignModalOpen}
        onClose={() => {
          console.log('🔍 DEBUG: Assignment modal closed');
          setAssignModalOpen(false);
        }}
        selectedCount={selectedSubmissions.size}
        hackathonId={hackathon?._id || hackathon?.id}
        roundIndex={selectedStage === 'r1' ? 0 : 1}
        selectedSubmissionIds={Array.from(selectedSubmissions)}
        onAssign={(selectedEvaluators) => {
          console.log('🔍 DEBUG: onAssign callback called with evaluators:', selectedEvaluators);
          setSelectedSubmissions(new Set());
          setAssignModalOpen(false);
          // Force refresh after assignment
          fetchAssignmentOverview();
        }}
        onAssignmentComplete={() => {
          // Force refresh assignment overview immediately
          console.log('🔍 DEBUG: Assignment completed, refreshing overview...');
          fetchAssignmentOverview();
          // Reset selected submissions
          setSelectedSubmissions(new Set());
          // Show success message
          toast({
            title: 'Assignment completed',
            description: 'Submissions have been assigned to judges. The overview has been refreshed.',
            variant: 'default',
          });
          // Force a second refresh after a short delay to ensure data is updated
          setTimeout(() => {
            console.log('🔍 DEBUG: Second refresh to ensure data consistency...');
            fetchAssignmentOverview();
          }, 1000);
        }}
      />
    </div>
  );
}
