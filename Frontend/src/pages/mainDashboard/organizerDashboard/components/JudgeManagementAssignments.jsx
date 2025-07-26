"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../components/CommonUI/card";
import { Button } from "../../../../components/CommonUI/button";
import { Gavel, Loader2, Users, Award, FileText, Eye, Calendar, Mail, CheckCircle } from "lucide-react";
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
  console.log('DEBUG: JudgeManagementAssignments render', { submissionsLength: submissions.length });
  const [unassigning, setUnassigning] = useState({});
  const [selectedStage, setSelectedStage] = useState(stages[0].id);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedJudge, setSelectedJudge] = useState(null);
  const [judgeDetailsModalOpen, setJudgeDetailsModalOpen] = useState(false);
  const [deletingJudge, setDeletingJudge] = useState(null);
  const [availableJudges, setAvailableJudges] = useState([]);
  const [loadingAvailableJudges, setLoadingAvailableJudges] = useState(false);

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

  // Fetch available judges
  const fetchAvailableJudges = async () => {
    if (!hackathon?._id) return;
    
    setLoadingAvailableJudges(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/judge-management/hackathons/${hackathon._id}/available-judges`, {
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
          judgeAssignments={hackathon?.judgeAssignments || { platform: [], sponsor: [], hybrid: [] }}
          hackathonId={hackathon && (hackathon._id || hackathon.id) ? (hackathon._id || hackathon.id) : ""}
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

      {/* Current Assignments Table */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="w-5 h-5" />
            Current Judge Assignments
          </CardTitle>
          <CardDescription>
            View current judge assignments and available judges for this hackathon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-2xl shadow-lg bg-white/90 border border-gray-200 p-2 md:p-4">
            <table className="min-w-full text-sm border-separate border-spacing-y-3">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left font-bold text-gray-800 tracking-wide rounded-tl-2xl">Judge</th>
                  <th className="px-8 py-4 text-left font-bold text-gray-800 tracking-wide">Type</th>
                  <th className="px-8 py-4 text-left font-bold text-gray-800 tracking-wide">Status</th>
                  <th className="px-8 py-4 text-left font-bold text-gray-800 tracking-wide">Teams</th>
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
                          <div className="flex flex-wrap gap-1">
                            {a.assignedTeams?.length > 0 ? (
                              a.assignedTeams.slice(0, 3).map((teamId, idx) => {
                                const team = teams.find(t => t._id === teamId);
                                return team ? (
                                  <span key={teamId} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                                    {team.name}
                                  </span>
                                ) : null;
                              })
                            ) : (
                              <span className="text-gray-400 text-sm">No teams assigned</span>
                            )}
                            {a.assignedTeams?.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                +{a.assignedTeams.length - 3} more
                              </span>
                            )}
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
    </div>
  );
}
