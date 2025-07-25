"use client";
import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../components/CommonUI/card";
import { Button } from "../../../../components/CommonUI/button";
import { Label } from "../../../../components/CommonUI/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../components/CommonUI/select";

import { MultiSelect } from "../../../../components/CommonUI/multiselect";
import { Gavel, Loader2 } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "../../../../components/DashboardUI/dialog";
import SubmissionRoundView from "./SubmissionRoundView";

// Mock stages data
const stages = [
  { id: 'reg', label: 'All Registrations', icon: 'REG', status: 'active' },
  { id: 'r1', label: 'Submission Round 1', icon: 'R1', status: 'in-progress' },
  { id: 'r2', label: 'Submission Round 2', icon: 'R2', status: 'pending' },
];
const statusTabs = [
  { key: 'all', label: 'All' },
  { key: 'inprogress', label: 'In-progress' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'rejected', label: 'Rejected' },
];

export default function JudgeManagementAssignments({
  selectedJudgeAssignmentId,
  setSelectedJudgeAssignmentId,
  allJudgeAssignments,
  selectedAssignmentType,
  setSelectedAssignmentType,
  selectedRoundId,
  setSelectedRoundId,
  hackathon,
  teams,
  selectedTeamIds,
  setSelectedTeamIds,
  assignTeamsToJudge,
  autoDistributeTeams,
  fetchJudgeAssignments,
  submissions = [], // <-- add this if not present
}) {
  console.log('DEBUG: JudgeManagementAssignments render', { submissionsLength: submissions.length });
  const [autoDistLoading, setAutoDistLoading] = useState(false);
  const [unassigning, setUnassigning] = useState({});
  const [scopeUnassigning, setScopeUnassigning] = useState({});
  const [updatingAssignment, setUpdatingAssignment] = useState(false);
  const [selectedStage, setSelectedStage] = useState(stages[0].id);
  const [selectedTab, setSelectedTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

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

  const filteredAssignments = useMemo(() => {
    if (!hackathon) return [];
    return allJudgeAssignments.filter(a => {
      if (selectedAssignmentType === "round") {
        return a.assignedRounds?.some(r => String(r.roundId) === String(selectedRoundId));
      } else {
        return a.assignedProblemStatements?.some(p => String(p.problemStatementId) === String(selectedRoundId));
      }
    });
  }, [allJudgeAssignments, hackathon, selectedAssignmentType, selectedRoundId]);

  const handleAutoDistribute = async () => {
    if (filteredAssignments.length === 0 || teams.length === 0) {
      toast({ title: "No judges or teams available for auto-distribution.", variant: "warning" });
      return;
    }
    setAutoDistLoading(true);
    try {
      await autoDistributeTeams(
        selectedAssignmentType,
        selectedRoundId,
        filteredAssignments.map(a => a._id),
        teams.map(t => t._id)
      );
      toast({ title: "Teams auto-distributed successfully!", description: "Teams have been assigned to judges." });
    } catch (err) {
      console.error("Auto-Distribute Error:", err);
      toast({ title: "Auto-Distribute Error", description: err?.message || JSON.stringify(err), variant: "destructive" });
    } finally {
      setAutoDistLoading(false);
    }
  };

  const handleUnassignAll = async (assignmentId) => {
    setUnassigning(prev => ({ ...prev, [assignmentId]: true }));
    try {
      await assignTeamsToJudge(assignmentId, []);
    } finally {
      setUnassigning(prev => ({ ...prev, [assignmentId]: false }));
    }
  };

  const handleUnassignScope = async (assignmentId, scopeId) => {
    setScopeUnassigning(prev => ({ ...prev, [assignmentId]: true }));
    try {
      await fetch(`/api/judge-management/judge-assignments/${assignmentId}/unassign-scope`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedAssignmentType === "round"
          ? { roundId: scopeId }
          : { problemStatementId: scopeId }
        ),
      });
      if (typeof fetchJudgeAssignments === "function") {
        await fetchJudgeAssignments();
      }
    } finally {
      setScopeUnassigning(prev => ({ ...prev, [assignmentId]: false }));
    }
  };

  const currentAssignment = selectedJudgeAssignmentId
    ? allJudgeAssignments.find(a => a._id === selectedJudgeAssignmentId)
    : null;

  // Find the round object for the selected stage
  let roundObj = null;
  if ((selectedStage === 'r1' || selectedStage === 'r2') && hackathon?.rounds) {
    const roundName = getRoundName(selectedStage);
    roundObj = hackathon.rounds.find(r => r.name === roundName);
  }

  // Format round dates for description
  const formatDate = (date) => date ? new Date(date).toLocaleString() : '--';
  let roundDescription = getRoundDetails(selectedStage);
  if (roundObj) {
    roundDescription += `\nStart: ${formatDate(roundObj.startDate)}\nEnd: ${formatDate(roundObj.endDate)}`;
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar: Stages */}
      <aside className="w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Stages</h3>
          <div className="flex flex-col gap-2">
            {stages.map((stage, idx) => (
              <div key={stage.id} className={`relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedStage === stage.id ? 'bg-indigo-50 border-indigo-400 shadow' : 'bg-white border-gray-200 hover:bg-gray-50'}`} onClick={() => setSelectedStage(stage.id)}>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${selectedStage === stage.id ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}>{stage.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-base">{stage.label}</div>
                  {stage.status === 'in-progress' && <span className="text-xs text-orange-500 font-semibold">Shortlist</span>}
                </div>
                {idx < stages.length - 1 && <div className="absolute left-4 top-full w-0.5 h-6 bg-gray-200 z-0" />}
              </div>
            ))}
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1">
        {/* Tabs */}
        <div className="flex items-center gap-8 border-b mb-4">
          {statusTabs.map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-2 font-semibold text-base border-b-2 transition-all ${selectedTab === tab.key ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-500 hover:text-indigo-600'}`}
              onClick={() => setSelectedTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Search/Filter Bar */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search here"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
          />
          <button className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" /></svg>
            Filter
          </button>
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
            {/* Teams/Participants Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-x-auto mb-10">
              <table className="min-w-full text-sm">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">#</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Team</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Leader</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Action / Status</th>
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
          </>
        )}
        {/* Team Details Dialog */}
        <Dialog open={!!selectedTeam} onOpenChange={open => !open && setSelectedTeam(null)}>
          <DialogContent className="max-w-lg w-full">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6 text-indigo-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4.13a4 4 0 10-8 0 4 4 0 008 0zm6 4v2a2 2 0 01-2 2h-1.5M3 16v2a2 2 0 002 2h1.5' /></svg>
                </div>
                {selectedTeam?.name}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600">Team Leader: <span className="font-semibold text-indigo-700">{selectedTeam?.leader?.name}</span></DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-2">Team Members</h4>
              <div className="flex flex-col gap-2">
                {selectedTeam?.members?.map((member, idx) => (
                  <div key={member._id || idx} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-base font-bold text-gray-700">{member.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.email}</div>
                    </div>
                    {selectedTeam.leader?.name === member.name && (
                      <span className="ml-auto text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">Leader</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <DialogClose asChild>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">Close</button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
        {/* The rest of the Judge Assignments UI below */}
        {/* Redesigned Judge Assignments Form and Current Assignments Table */}
        <Card className="p-6 max-w-3xl mx-auto relative">
          {(updatingAssignment || autoDistLoading) && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <Loader2 className="animate-spin w-8 h-8 text-indigo-500" aria-label="Loading" />
            </div>
          )}
          {/* Redesigned Judge Assignments Form */}
          <div className="bg-white/90 rounded-2xl shadow-lg border border-gray-200 p-6 mb-10 flex flex-col gap-6">
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2 text-indigo-900 tracking-tight">
              <Gavel className="w-6 h-6 text-indigo-500" /> Judge Assignments
            </h2>
            <p className="mb-2 text-gray-600 text-base">Assign teams and scope (round/problem) to judges.</p>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <Label className="text-base font-medium text-gray-800">Judge</Label>
                <Select value={selectedJudgeAssignmentId} onValueChange={setSelectedJudgeAssignmentId}>
                  <SelectTrigger className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-400">
                    <SelectValue placeholder="Select Judge" />
                  </SelectTrigger>
                  <SelectContent>
                    {allJudgeAssignments.map(a => (
                      <SelectItem key={a._id} value={a._id}>
                        {a.judge.email} ({a.judge.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-base font-medium text-gray-800">Assignment Type</Label>
                <Select value={selectedAssignmentType} onValueChange={setSelectedAssignmentType}>
                  <SelectTrigger className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round">Round</SelectItem>
                    <SelectItem value="problemStatement">Problem Statement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-base font-medium text-gray-800">Scope</Label>
                <MultiSelect
                  options={
                    selectedAssignmentType === "round"
                      ? hackathon?.rounds.map(r => ({ value: r._id, label: r.name }))
                      : hackathon?.problemStatements.map(ps => ({ value: ps._id, label: ps.statement }))
                  }
                  value={
                    currentAssignment
                      ? (selectedAssignmentType === "round"
                        ? currentAssignment.assignedRounds?.map(r => r.roundId) || []
                        : currentAssignment.assignedProblemStatements?.map(ps => ps.problemStatementId) || [])
                      : []
                  }
                  onChange={async (ids) => {
                    if (!selectedJudgeAssignmentId) return;
                    setUpdatingAssignment(true);
                    const token = localStorage.getItem("token");
                    const url = selectedAssignmentType === "round"
                      ? `/api/judge-management/judge-assignments/${selectedJudgeAssignmentId}/assign-rounds`
                      : `/api/judge-management/judge-assignments/${selectedJudgeAssignmentId}/assign-problem-statements`;
                    const bodyKey = selectedAssignmentType === "round" ? "roundIds" : "problemStatementIds";

                    try {
                      await fetch(url, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ [bodyKey]: ids }),
                      });
                      fetchJudgeAssignments?.();
                    } catch {
                      toast({ title: "Failed to update judge assignment.", variant: "destructive" });
                    } finally {
                      setUpdatingAssignment(false);
                    }
                  }}
                  placeholder="Select scopes"
                  disabled={updatingAssignment}
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-400"
                />
                <span className="text-xs text-gray-400">Select rounds or problem statements</span>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-base font-medium text-gray-800">Teams</Label>
                <MultiSelect
                  options={teams.map(t => ({ value: t._id, label: t.name }))}
                  value={selectedTeamIds}
                  onChange={setSelectedTeamIds}
                  placeholder="Select teams"
                  className="rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-400"
                />
                <span className="text-xs text-gray-400">Assign teams to this judge</span>
              </div>
              <div className="col-span-full flex gap-4 mt-2 justify-end">
                <Button type="button" className="px-6 py-2 rounded-lg text-base font-semibold shadow-md bg-indigo-600 hover:bg-indigo-700 text-white transition" disabled={!selectedJudgeAssignmentId || selectedTeamIds.length === 0} onClick={() => assignTeamsToJudge(selectedJudgeAssignmentId, selectedTeamIds)}>
                  Assign Teams
                </Button>
                <Button type="button" variant="outline" className="px-6 py-2 rounded-lg text-base font-semibold shadow-md border-indigo-300 hover:border-indigo-500 transition" loading={autoDistLoading} disabled={autoDistLoading || filteredAssignments.length === 0} onClick={handleAutoDistribute}>
                  Auto-Distribute
                </Button>
              </div>
            </form>
          </div>
          <div className="h-6" /> {/* Divider for better separation */}
          <h3 className="font-semibold mb-2 text-lg text-gray-800 tracking-tight">Current Assignments</h3>
          <div className="overflow-x-auto rounded-2xl shadow-lg bg-white/90 border border-gray-200 p-2 md:p-4">
            <table className="min-w-full text-sm border-separate border-spacing-y-3">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left font-bold text-gray-800 tracking-wide rounded-tl-2xl">Judge</th>
                  <th className="px-8 py-4 text-left font-bold text-gray-800 tracking-wide">Type</th>
                  <th className="px-8 py-4 text-left font-bold text-gray-800 tracking-wide">Teams</th>
                  <th className="px-8 py-4 text-left font-bold text-gray-800 tracking-wide rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="text-5xl">🧑‍⚖️</span>
                        <span className="font-semibold text-gray-700 text-lg">No assignments yet</span>
                        <span className="text-gray-500 text-base">Assign judges and teams to get started.</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAssignments.map(a => (
                  <tr key={a._id} className="bg-white hover:bg-indigo-50 transition-all duration-200 rounded-2xl shadow-md border border-gray-100">
                    <td className="px-8 py-4 flex items-center gap-4 border-r border-gray-100">
                      <Avatar className="h-9 w-9 shadow-sm">
                        <AvatarImage src={a.judge.avatarUrl || undefined} alt={a.judge.email} />
                        <AvatarFallback>{a.judge.email[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">{a.judge.email}</span>
                    </td>
                    <td className="px-8 py-4 border-r border-gray-100">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${a.judge.type === 'platform' ? 'bg-blue-100 text-blue-700' : a.judge.type === 'sponsor' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{a.judge.type}</span>
                    </td>
                    <td className="px-8 py-4 border-r border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {a.assignedTeams?.length ? a.assignedTeams.map(tid => {
                          const team = teams.find(t => t._id === tid);
                          return (
                            <span key={tid} className="inline-flex items-center bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs border shadow gap-2 transition-all duration-150">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={team?.avatarUrl || undefined} alt={team?.name || tid} />
                                <AvatarFallback>{team?.name?.[0]?.toUpperCase() || 'T'}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{team?.name || tid}</span>
                              <button
                                className="ml-1 text-red-500 hover:text-white hover:bg-red-500 rounded-full w-5 h-5 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                                onClick={() => assignTeamsToJudge(a._id, a.assignedTeams.filter(id => id !== tid))}
                                aria-label={`Remove team ${team?.name || tid}`}
                                tabIndex={0}
                                title="Remove team"
                              >×</button>
                            </span>
                          );
                        }) : <span className="text-gray-400">None</span>}
                      </div>
                    </td>
                    <td className="px-8 py-4 flex gap-3 flex-wrap">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={unassigning[a._id]}
                            loading={!!unassigning[a._id]}
                            aria-label="Remove all teams from this judge"
                            className="transition-all duration-200 shadow-sm"
                          >
                            🗑 Remove All
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove all teams from this judge?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. All teams will be unassigned from this judge.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleUnassignAll(a._id)} autoFocus>Remove All</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
