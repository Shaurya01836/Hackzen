"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../components/CommonUI/card";
import { Button } from "../../../../components/CommonUI/button";
import { Gavel, Loader2, Users, Award, FileText, Eye, Calendar, Mail, CheckCircle, RefreshCw, Github, Globe, ExternalLink, Video, Code, BookOpen, User, Phone, MapPin, Star, Tag, Link, Download, Play, ArrowLeft } from "lucide-react";
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
// Removed circular import - stage selection functionality is now included directly
import BulkEvaluatorAssignModal from "./BulkEvaluatorAssignModal";
import ProjectDetail from "../../../../components/CommonUI/ProjectDetail";

// Mock stages data
const stages = [
  { id: 'reg', label: 'All Registrations', icon: 'REG', status: 'active' },
  { id: 'r1', label: 'Submission Round 1', icon: 'R1', status: 'in-progress' },
  { id: 'r2', label: 'Submission Round 2', icon: 'R2', status: 'pending' },
];

export default function JudgeManagementAssignments({
  allJudgeAssignments = [],
  hackathon,
  teams = [],
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
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionDetailsModalOpen, setSubmissionDetailsModalOpen] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [loadingSubmissionDetails, setLoadingSubmissionDetails] = useState(false);




  // Fetch assignment overview when component mounts or hackathon changes
  useEffect(() => {
    if (hackathon?._id || hackathon?.id) {
      fetchAssignmentOverview();
    }
  }, [hackathon?._id, hackathon?.id]);

  // Refresh assignment overview periodically to ensure data is current
  useEffect(() => {
    if (hackathon?._id || hackathon?.id) {
      const interval = setInterval(() => {
        fetchAssignmentOverview();
      }, 30000); // Refresh every 30 seconds

      return () => {
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
      return;
    }
    
    setOverviewLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Build URL with filters
      let url = `http://localhost:3000/api/judge-management/hackathons/${hackathonId}/assignment-overview`;
      const params = new URLSearchParams();
      
      // Add roundIndex filter based on selected stage
      if (selectedStage === 'r1') {
        params.append('roundIndex', '0');
      } else if (selectedStage === 'r2') {
        params.append('roundIndex', '1');
      }
      // Note: We could add problem statement filtering here too if needed
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAssignmentOverview(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch assignment overview:', response.status, errorText);
        toast({
          title: 'Error',
          description: `Failed to fetch assignment overview. Status: ${response.status}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching assignment overview:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch assignment overview. Please check your connection.',
        variant: 'destructive',
      });
    } finally {
      setOverviewLoading(false);
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
    const roundIndex = selectedStage === 'r1' ? 0 : 1; // Round 1 = index 0, Round 2 = index 1
    const submittedTeamIds = submissions
      .filter(sub => sub.roundIndex === roundIndex)
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
    
      }
    } catch (error) {
      console.error('Error fetching submission scores:', error);
    }
  };

  // Fetch available judges
  // Handle submission selection
  const handleSubmissionSelection = (submissionId, isSelected) => {
    setSelectedSubmissions(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(submissionId);
      } else {
        newSet.delete(submissionId);
      }
      return newSet;
    });
  };

  // Handle bulk assignment
  const handleBulkAssignment = () => {
    if (selectedSubmissions.size === 0) {
      toast({
        title: "No submissions selected",
        description: "Please select at least one submission to assign.",
        variant: "destructive",
      });
      return;
    }
    setAssignModalOpen(true);
  };

  const handleViewSubmission = async (submission) => {
    
    setSelectedSubmission(submission);
    setSubmissionDetailsModalOpen(true);
    setLoadingSubmissionDetails(true);
    
    try {
      const token = localStorage.getItem('token');
      const hackathonId = hackathon?._id || hackathon?.id;
      
      // Fetch detailed submission information
      const response = await fetch(`http://localhost:3000/api/submission-form/admin/${submission._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const submissionData = await response.json();
        
        // Fetch judge evaluations for this submission
        const evaluationsResponse = await fetch(`http://localhost:3000/api/scores/submission/${submission._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let evaluations = [];
        if (evaluationsResponse.ok) {
          evaluations = await evaluationsResponse.json();
        }
        
        // Get assigned judges for this submission
        const assignedJudges = assignmentOverview?.assignedSubmissions?.find(s => s._id === submission._id)?.assignedJudges || [];
        
        // Check if there are other submissions for this team that might have PPT files
        const teamSubmissions = assignmentOverview?.assignedSubmissions?.filter(s => s.teamName === submission.teamName) || [];
    
        

        
        // Merge with original submission data to ensure we have all fields
        // Prioritize original submission data for pptFile since assignment overview includes it
        const mergedSubmission = {
          ...submissionData.submission,  // API response
          ...submission,  // Original submission from table (prioritize pptFile from here)
          evaluations,
          assignedJudges
        };
        
        
        setSubmissionDetails(mergedSubmission);
        
        // Also fetch scores for this submission to update the table
        const scoresResponse = await fetch(`http://localhost:3000/api/scores/submission/${submission._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (scoresResponse.ok) {
          const scores = await scoresResponse.json();
          setSubmissionScores(prev => ({
            ...prev,
            [submission._id]: scores
          }));
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch submission details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching submission details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submission details",
        variant: "destructive",
      });
    } finally {
      setLoadingSubmissionDetails(false);
    }
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
        <div className="space-y-6">
          {/* Round Header */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
              {getRoundName(selectedStage)}
            </h2>
            <p className="text-gray-500 text-base">{roundDescription}</p>
          </div>
          
          {/* Submission Round Content */}
          <div className="space-y-6">
          {/* Assignment Overview Cards */}
{assignmentOverview && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-blue-50 to-blue-100">
      <CardContent className="p-6 pt-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-900">
              {assignmentOverview.judges?.length || 0}
            </p>
            <p className="text-sm font-medium text-blue-700">Active Judges</p>
            <p className="text-xs text-blue-600 mt-1">
              {assignmentOverview.judges?.reduce((total, judge) => total + (judge.assignedSubmissions?.length || 0), 0) || 0} assigned projects
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-orange-50 to-orange-100">
      <CardContent className="p-6 pt-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-600 rounded-xl">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-900">
              {assignmentOverview?.unassignedSubmissions?.filter(submission => {
                if (selectedStage === 'r1') return submission.pptFile;
                if (selectedStage === 'r2') return !submission.pptFile;
                return true;
              }).length || 0}
            </p>
            <p className="text-sm font-medium text-orange-700">Unassigned Projects</p>
            <p className="text-xs text-orange-600 mt-1">
              Need judge assignment
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-green-50 to-green-100">
      <CardContent className="p-6 pt-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-600 rounded-xl">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold text-green-900">
              {(assignmentOverview.judges?.reduce((total, judge) => total + (judge.assignedSubmissions?.length || 0), 0) || 0) +
              (assignmentOverview.unassignedSubmissions?.length || 0)}
            </p>
            <p className="text-sm font-medium text-green-700">Total Submissions</p>
            <p className="text-xs text-green-600 mt-1">
              All submissions
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)}


            {/* Assigned Submissions Table */}
            <div className="mb-6">
              <Card className="shadow-none hover:shadow-none">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        Assigned Submissions
                      </CardTitle>
                      <CardDescription className="text-green-600">
                        Submissions already assigned to Judges
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {assignmentOverview?.assignedSubmissions?.filter(submission => {
                          if (selectedStage === 'r1') return submission.pptFile;
                          if (selectedStage === 'r2') return !submission.pptFile;
                          return true;
                        }).length || 0}
                      </div>
                      <div className="text-sm text-gray-500">Assigned to Judges</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {assignmentOverview?.assignedSubmissions?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TEAM</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROJECT</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ASSIGNED JUDGES</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SCORE</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {assignmentOverview.assignedSubmissions
                            .filter(submission => {
                              // Filter submissions based on current round
                              if (selectedStage === 'r1') {
                                // Round 1: Show only PPT submissions
                                return submission.pptFile;
                              } else if (selectedStage === 'r2') {
                                // Round 2: Show only Project submissions
                                return !submission.pptFile;
                              }
                              // For other stages, show all
                              return true;
                            })
                            .map((submission) => (
                            <tr key={submission._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="font-medium text-gray-900">{submission.teamName}</div>
                                  <div className="text-sm text-gray-500">{submission.teamId}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {submission.projectTitle || submission.title || 'Untitled Project'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">
                                    {selectedStage === 'r1' ? 'PPT' : 'Project'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">
                                    {submission.assignedJudges?.length || 0} judge{submission.assignedJudges?.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {(() => {
                                  const scores = submissionScores[submission._id] || [];
                                  if (scores.length === 0) {
                                    return (
                                      <div className="text-sm italic text-gray-500">
                                        Not evaluated yet
                                      </div>
                                    );
                                  }
                                  const averageScore = getAverageScore(submission._id);
                                  return (
                                    <div className="text-sm font-medium text-green-600">
                                      {averageScore}/10 ({scores.length} judge{scores.length !== 1 ? 's' : ''})
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button 
                                  onClick={() => handleViewSubmission(submission)}
                                  className="inline-flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No assigned submissions</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Unassigned Submissions Section */}
           <Card className="shadow-none hover:shadow-none">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Unassigned Submissions</h3>
                    <p className="text-sm text-gray-600">Submissions that need to be assigned to judges</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">{assignmentOverview?.unassignedSubmissions?.length || 0}</div>
                    <div className="text-sm text-gray-500">Pending Assignment</div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                {assignmentOverview?.unassignedSubmissions?.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <input
                                type="checkbox"
                                checked={selectedSubmissions.size === assignmentOverview.unassignedSubmissions.length}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedSubmissions(new Set(assignmentOverview.unassignedSubmissions.map(s => s._id)));
                                  } else {
                                    setSelectedSubmissions(new Set());
                                  }
                                }}
                                className="h-4 w-4 text-blue-600 rounded"
                              />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TEAM</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROJECT</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROUND</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {assignmentOverview.unassignedSubmissions
                            .filter(submission => {
                              // Filter submissions based on current round
                              if (selectedStage === 'r1') {
                                // Round 1: Show only PPT submissions
                                return submission.pptFile;
                              } else if (selectedStage === 'r2') {
                                // Round 2: Show only Project submissions
                                return !submission.pptFile;
                              }
                              // For other stages, show all
                              return true;
                            })
                            .map((submission) => (
                            <tr key={submission._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedSubmissions.has(submission._id)}
                                  onChange={(e) => handleSubmissionSelection(submission._id, e.target.checked)}
                                  className="h-4 w-4 text-blue-600 rounded"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="font-medium text-gray-900">{submission.teamName}</div>
                                  <div className="text-sm text-gray-500">{submission.teamId}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {submission.projectTitle || submission.title || 'Untitled Project'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {submission.roundIndex !== null && submission.roundIndex !== undefined && !isNaN(submission.roundIndex) 
                                    ? `Round ${submission.roundIndex + 1}` 
                                    : 'Round 1'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">
                                    {selectedStage === 'r1' ? 'PPT' : 'Project'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Unassigned
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Assignment Actions for Unassigned */}
                    {selectedSubmissions.size > 0 && (
                      <div className="flex flex-wrap gap-4 mt-6 items-center">
                        <Button
                          onClick={handleBulkAssignment}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={selectedSubmissions.size === 0}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Assign to Judges ({selectedSubmissions.size} selected)
                        </Button>
                        <span className="text-sm text-gray-500">
                          Select judges to assign these submissions
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  // Empty state for no unassigned submissions
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Unassigned Submissions</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      All submissions have been assigned to judges for evaluation.
                    </p>
                    <div className="text-xs text-gray-400">
                      Great job! All submissions are now being reviewed by the judges.
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
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
          <Card className=" shadow-none hover:shadow-none">
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
              <div className="overflow-x-auto">
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
       <Card className=" shadow-none hover:shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="w-5 h-5" />
                Current Judge Assignments
              </CardTitle>
              <CardDescription>
                View current judge assignments and their assigned projects/teams for this hackathon.
              </CardDescription>
            </CardHeader>
            <CardContent>
            
              <div className="overflow-x-auto">
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
                          <tr key={a._id} className="bg-white hover:bg-indigo-50 transition-all duration-200 rounded-2xl  border border-gray-100">
                            <td className="px-8 py-4 flex items-center gap-4 border-r border-gray-100">
                              <Avatar className="h-9 w-9 ">
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

      {/* Submission Details Modal */}
      <Dialog open={submissionDetailsModalOpen} onOpenChange={setSubmissionDetailsModalOpen}>
        <DialogContent className="max-w-[98vw] max-h-[98vh] w-[98vw] h-[98vh] overflow-y-auto p-8">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Submission Details
            </DialogTitle>
            <DialogDescription>
              Complete view of submission, assigned judges, and evaluations
            </DialogDescription>
          </DialogHeader>
          {loadingSubmissionDetails ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading submission details...</span>
            </div>
          ) : submissionDetails ? (
            <div className="bg-gradient-to-b from-slate-50 via-purple-50 to-slate-100 min-h-full">
              {/* Project Summary Section */}
              <div className="px-6 pt-8">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 rounded-2xl bg-white/70 backdrop-blur-sm border-0 shadow-lg shadow-indigo-100/50 p-6">
                    {/* Project Logo */}
                    <div className="w-28 h-28 flex items-center justify-center rounded-2xl">
                      <img
                        src={submissionDetails.projectId?.logo?.url || submissionDetails.logo?.url || submissionDetails.projectId?.images?.[0]?.url || "/assets/default-banner.png"}
                        alt="Project Logo"
                        className="rounded-xl object-cover w-24 h-24"
                      />
                    </div>
                    
                    {/* Project Info */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h1 className="text-4xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                          {submissionDetails.projectTitle || submissionDetails.title || submissionDetails.projectId?.title || 'Untitled Project'}
                        </h1>
                        {submissionDetails.projectId?.category && (
                          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            {submissionDetails.projectId.category}
                          </div>
                        )}
                      </div>
                      
                      {submissionDetails.projectId?.description && (
                        <p className="text-gray-700 italic text-md mb-2 mt-1 max-w-2xl">
                          {submissionDetails.projectId.description}
                        </p>
                      )}
                      
                      {/* Horizontal line below title/intro */}
                      <div className="border-t border-gray-200 my-4 w-full" />
                      
                      {/* Project meta info */}
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          {submissionDetails.teamName || submissionDetails.team?.name || 'Unknown Team'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-green-500" />
                          {formatDate(submissionDetails.createdAt || submissionDetails.submittedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4 text-yellow-500" />
                          {submissionDetails.assignedJudges?.length || 0} Judges Assigned
                        </span>
                        {submissionDetails.evaluations?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {submissionDetails.evaluations.length} Evaluations
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
                            {/* Main Content Area */}
              <div className="px-6 py-8">
                <div className="max-w-7xl mx-auto space-y-8">



              {/* Project Information Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Project Description */}
                {(submissionDetails.projectId?.description || submissionDetails.description) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Project Description
                    </h4>
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: submissionDetails.projectId?.description || submissionDetails.description }} />
                    </div>
                  </div>
                )}

                {/* Problem Statement */}
                {(submissionDetails.projectId?.problemStatement || submissionDetails.problemStatement) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Code className="w-5 h-5 text-green-600" />
                      Problem Statement
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{submissionDetails.projectId?.problemStatement || submissionDetails.problemStatement}</p>
                    </div>
                  </div>
                )}

                {/* Tech Stack */}
                {(submissionDetails.projectId?.techStack || submissionDetails.techStack) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-indigo-600" />
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(submissionDetails.projectId?.techStack || submissionDetails.techStack || []).map((tech, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Links */}
                {(submissionDetails.projectId?.githubUrl || submissionDetails.projectId?.websiteUrl || submissionDetails.projectId?.demoUrl || submissionDetails.githubUrl || submissionDetails.websiteUrl || submissionDetails.demoUrl) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Link className="w-5 h-5 text-purple-600" />
                      Project Links
                    </h4>
                    <div className="space-y-3">
                      {(submissionDetails.projectId?.githubUrl || submissionDetails.githubUrl) && (
                        <a
                          href={submissionDetails.projectId?.githubUrl || submissionDetails.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Github className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">GitHub Repository</span>
                          <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                        </a>
                      )}
                      {(submissionDetails.projectId?.websiteUrl || submissionDetails.websiteUrl) && (
                        <a
                          href={submissionDetails.projectId?.websiteUrl || submissionDetails.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Globe className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">Live Website</span>
                          <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                        </a>
                      )}
                      {(submissionDetails.projectId?.demoUrl || submissionDetails.demoUrl) && (
                        <a
                          href={submissionDetails.projectId?.demoUrl || submissionDetails.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Video className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">Demo Video</span>
                          <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Project Category */}
                {(submissionDetails.projectId?.category || submissionDetails.category) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-orange-600" />
                      Project Category
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        {submissionDetails.projectId?.category || submissionDetails.category}
                      </span>
                    </div>
                  </div>
                )}

                {/* Project Status */}
                {(submissionDetails.projectId?.status || submissionDetails.status) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      Project Status
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        {submissionDetails.projectId?.status || submissionDetails.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Project Information */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Project Images */}
                {(submissionDetails.projectId?.images && submissionDetails.projectId.images.length > 0) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-blue-600" />
                      Project Images
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                      {submissionDetails.projectId.images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Attachments */}
                {(submissionDetails.projectId?.attachments && submissionDetails.projectId.attachments.length > 0) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Download className="w-5 h-5 text-green-600" />
                      Project Attachments
                    </h4>
                    <div className="space-y-2">
                      {submissionDetails.projectId.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <div>
                              <div className="font-medium text-gray-900">{file.name}</div>
                              <div className="text-sm text-gray-500">{file.type}</div>
                            </div>
                          </div>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Files */}
                {(submissionDetails.projectId?.files && submissionDetails.projectId.files.length > 0) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      Project Files
                    </h4>
                    <div className="space-y-2">
                      {submissionDetails.projectId.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <div>
                              <div className="font-medium text-gray-900">{file.name}</div>
                              <div className="text-sm text-gray-500">{file.type}</div>
                            </div>
                          </div>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project Documents */}
                {(submissionDetails.projectId?.documents && submissionDetails.projectId.documents.length > 0) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      Project Documents
                    </h4>
                    <div className="space-y-2">
                      {submissionDetails.projectId.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <div>
                              <div className="font-medium text-gray-900">{doc.name}</div>
                              <div className="text-sm text-gray-500">{doc.type}</div>
                            </div>
                          </div>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Team Information */}
              {(submissionDetails.projectId?.team || submissionDetails.team || submissionDetails.teamMembers) && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Team Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {(submissionDetails.projectId?.team || submissionDetails.team || submissionDetails.teamMembers || []).map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatarUrl || member.profileImage} alt={member.name} />
                          <AvatarFallback>{member.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.role || member.position}</div>
                          {member.email && (
                            <div className="text-xs text-gray-400">{member.email}</div>
                          )}
                          {member.phone && (
                            <div className="text-xs text-gray-400">{member.phone}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Statistics */}
              {(submissionDetails.projectId?.views || submissionDetails.projectId?.likes || submissionDetails.views || submissionDetails.likes) && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    Project Statistics
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {(submissionDetails.projectId?.views || submissionDetails.views) && (
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{submissionDetails.projectId?.views || submissionDetails.views}</div>
                        <div className="text-sm text-gray-600">Views</div>
                      </div>
                    )}
                    {(submissionDetails.projectId?.likes || submissionDetails.likes) && (
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{submissionDetails.projectId?.likes || submissionDetails.likes}</div>
                        <div className="text-sm text-gray-600">Likes</div>
                      </div>
                    )}
                    {(submissionDetails.projectId?.comments || submissionDetails.comments) && (
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{submissionDetails.projectId?.comments || submissionDetails.comments}</div>
                        <div className="text-sm text-gray-600">Comments</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Original Submission Files Section - Keep this intact */}
           
                
                <div className="space-y-4">
                  {(selectedStage === 'r1' || submissionDetails.pptFile || submissionDetails.type === 'ppt' || submissionDetails.submissionType === 'ppt' || submissionDetails.originalName?.includes('.ppt') || submissionDetails.originalName?.includes('.pptx')) ? (
                    <div className="space-y-4">
                      {(() => {
                        // Determine the PPT file URL
                        let pptFileUrl = submissionDetails.pptFile;
                        let pptFileName = submissionDetails.originalName || 'PPT Presentation';
                        
                        // If pptFile is not available but we have originalName, try to construct the URL
                        if (!pptFileUrl && submissionDetails.originalName) {
                          pptFileUrl = `/uploads/${submissionDetails.originalName}`;
                        }
                        
                        // Additional fallback: check if there are any files in the submission that might be PPT
                        if (!pptFileUrl && submissionDetails.projectFiles && submissionDetails.projectFiles.length > 0) {
                          const pptFile = submissionDetails.projectFiles.find(file => 
                            file.name?.toLowerCase().includes('.ppt') || 
                            file.name?.toLowerCase().includes('.pptx') ||
                            file.type?.includes('powerpoint')
                          );
                          if (pptFile) {
                            pptFileUrl = pptFile.url;
                            pptFileName = pptFile.name;
                          }
                        }
                        
                        // Check project attachments if no PPT file found
                        if (!pptFileUrl && submissionDetails.projectId && submissionDetails.projectId.attachments) {
                          const pptFile = submissionDetails.projectId.attachments.find(file => 
                            file.name?.toLowerCase().includes('.ppt') || 
                            file.name?.toLowerCase().includes('.pptx') ||
                            file.type?.includes('powerpoint')
                          );
                          if (pptFile) {
                            pptFileUrl = pptFile.url;
                            pptFileName = pptFile.name;
                          }
                        }
                        
                        // Check project files if no PPT file found
                        if (!pptFileUrl && submissionDetails.projectId && submissionDetails.projectId.files) {
                          const pptFile = submissionDetails.projectId.files.find(file => 
                            file.name?.toLowerCase().includes('.ppt') || 
                            file.name?.toLowerCase().includes('.pptx') ||
                            file.type?.includes('powerpoint')
                          );
                          if (pptFile) {
                            pptFileUrl = pptFile.url;
                            pptFileName = pptFile.name;
                          }
                        }
                        
                        // Check if project has any other file fields
                        if (!pptFileUrl && submissionDetails.projectId) {
                          const project = submissionDetails.projectId;
                          const possibleFileFields = ['attachments', 'files', 'documents', 'presentations', 'slides'];
                          for (const field of possibleFileFields) {
                            if (project[field] && Array.isArray(project[field])) {
                              const pptFile = project[field].find(file => 
                                file.name?.toLowerCase().includes('.ppt') || 
                                file.name?.toLowerCase().includes('.pptx') ||
                                file.type?.includes('powerpoint')
                              );
                              if (pptFile) {
                                pptFileUrl = pptFile.url;
                                pptFileName = pptFile.name;
                                break;
                              }
                            }
                          }
                        }
                        
                        return (
                          <>
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6 text-blue-600" />
                                <div>
                                  <div className="font-medium text-gray-900">PPT Presentation</div>
                                  <div className="text-sm text-gray-500">
                                    {pptFileName}
                                  </div>
                                </div>
                              </div>
                              {pptFileUrl && (
                                <a
                                  href={pptFileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                  <Eye className="w-4 h-4" />
                                  Open in New Tab
                                </a>
                              )}
                            </div>
                            
                            {/* PPT Preview Section */}
                            {pptFileUrl ? (
                              <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                  PPT Preview
                                </h5>
                                <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                  <iframe
                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(pptFileUrl)}&embedded=true`}
                                    style={{ 
                                      width: "100%", 
                                      height: "600px", 
                                      border: "none"
                                    }}
                                    title="PPT Preview"
                                    allowFullScreen
                                    className="rounded-lg"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                  PPT Preview
                                </h5>
                                <div className="text-center py-8 text-gray-500">
                                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                  <p>No PPT file uploaded</p>
                                  <p className="text-sm text-gray-400 mt-1">
                                    This submission is for Round 1 (PPT round) but no PPT file has been uploaded.
                                  </p>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      
                    </div>
                  )}
                  {submissionDetails.projectFiles && submissionDetails.projectFiles.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Project Files:</h5>
                      {submissionDetails.projectFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <div>
                              <div className="font-medium text-gray-900">{file.name}</div>
                              <div className="text-sm text-gray-500">{file.type}</div>
                            </div>
                          </div>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
              
              </div>

              {/* Assigned Judges */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Assigned Judges ({submissionDetails.assignedJudges?.length || 0})
                </h4>
                {submissionDetails.assignedJudges && submissionDetails.assignedJudges.length > 0 ? (
                  <div className="space-y-4">
                    {submissionDetails.assignedJudges.map((judge, index) => {
                      // Check if this judge has evaluated
                      const hasEvaluated = submissionDetails.evaluations?.some(evaluation => 
                        evaluation.judge?._id === judge._id || 
                        evaluation.judge?.email === judge.judgeEmail || 
                        evaluation.judge?.email === judge.email
                      );
                      
                      return (
                        <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${
                          hasEvaluated ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                        }`}>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={judge.avatarUrl} alt={judge.judgeName || judge.name || judge.judgeEmail || judge.email} />
                              <AvatarFallback>
                                {(judge.judgeName || judge.name || judge.judgeEmail || judge.email || 'J')[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">
                                {judge.judgeName || judge.name || 'Unknown Judge'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {judge.judgeEmail || judge.email || 'No email available'}
                              </div>
                              <div className="text-xs font-medium">
                                {hasEvaluated ? (
                                  <span className="text-green-600">✅ Evaluated</span>
                                ) : (
                                  <span className="text-yellow-600">⏳ Pending Evaluation</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {hasEvaluated ? 'Completed' : 'Pending'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {hasEvaluated ? 
                                formatDate(submissionDetails.evaluations?.find(evaluation => 
                                  evaluation.judge?._id === judge._id || 
                                  evaluation.judge?.email === judge.judgeEmail || 
                                  evaluation.judge?.email === judge.email
                                )?.createdAt) : 
                                'Not evaluated yet'
                              }
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No judges assigned to this submission</p>
                  </div>
                )}
              </div>

              {/* Judge Evaluations */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Judge Evaluations ({submissionDetails.evaluations?.length || 0})
                </h4>
                {submissionDetails.evaluations && submissionDetails.evaluations.length > 0 ? (
                  <div className="space-y-4">
                    {submissionDetails.evaluations.map((evaluation, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={evaluation.judge?.avatarUrl} alt={evaluation.judge?.name || evaluation.judge?.email} />
                              <AvatarFallback>
                                {(evaluation.judge?.name || evaluation.judge?.email || 'J')[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">
                                {evaluation.judge?.name || 'Unknown Judge'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {evaluation.judge?.email || 'No email available'}
                              </div>
                              <div className="text-xs text-blue-600 font-medium">
                                ✅ Evaluated
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {evaluation.totalScore || (evaluation.scores && Object.values(evaluation.scores).reduce((sum, score) => sum + (score || 0), 0) / Object.keys(evaluation.scores).length) || 0}/10
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(evaluation.createdAt)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Evaluation Criteria */}
                        {evaluation.scores && Object.keys(evaluation.scores).length > 0 && (
                          <div className="space-y-2">
                            <h6 className="font-medium text-gray-900">Evaluation Criteria:</h6>
                            {Object.entries(evaluation.scores).map(([criteria, score]) => (
                              <div key={criteria} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-700 capitalize">{criteria}</span>
                                <span className="text-sm font-medium text-gray-900">
                                  {score}/10
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Comments */}
                        {evaluation.feedback && (
                          <div className="mt-4">
                            <h6 className="font-medium text-gray-900 mb-2">Comments:</h6>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-sm text-gray-700">{evaluation.feedback}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Award className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No evaluations completed yet</p>
                    <p className="text-sm">Judges will appear here once they complete their evaluations</p>
                  </div>
                )}
              </div>

              {/* Average Score */}
              {submissionDetails.evaluations && submissionDetails.evaluations.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Overall Score</h4>
                    <div className="text-4xl font-bold text-green-600">
                      {(() => {
                        if (!submissionDetails.evaluations || submissionDetails.evaluations.length === 0) return '0.0';
                        const totalScore = submissionDetails.evaluations.reduce((sum, evaluation) => {
                          const score = evaluation.totalScore || 
                            (evaluation.scores && Object.values(evaluation.scores).reduce((s, val) => s + (val || 0), 0) / Object.keys(evaluation.scores).length) || 0;
                          return sum + score;
                        }, 0);
                        return (totalScore / submissionDetails.evaluations.length).toFixed(1);
                      })()}/10
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      Based on {submissionDetails.evaluations.length} evaluation{submissionDetails.evaluations.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No submission details available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                        {round.roundName || (round.roundIndex !== null && round.roundIndex !== undefined && !isNaN(round.roundIndex) 
                          ? `Round ${round.roundIndex + 1}` 
                          : 'Round 1')}
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
          setAssignModalOpen(false);
        }}
        selectedCount={selectedSubmissions.size}
        hackathonId={hackathon?._id || hackathon?.id}
        roundIndex={selectedStage === 'r1' ? 0 : 1}
        selectedSubmissionIds={Array.from(selectedSubmissions)}
        onAssign={(selectedEvaluators) => {
          setSelectedSubmissions(new Set());
          setAssignModalOpen(false);
          // Force refresh after assignment
          fetchAssignmentOverview();
        }}
        onAssignmentComplete={() => {
          // Force refresh assignment overview immediately
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
            fetchAssignmentOverview();
          }, 1000);
        }}
      />
    </div>
  );
}
