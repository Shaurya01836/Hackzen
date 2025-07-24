"use client";
import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../../components/CommonUI/card";
import { Button } from "../../../../components/CommonUI/button";
import { Label } from "../../../../components/CommonUI/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../components/CommonUI/select";

import { MultiSelect } from "../../../../components/CommonUI/multiselect";
import { Gavel } from "lucide-react";

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
  fetchJudgeAssignments
}) {
  const [autoDistLoading, setAutoDistLoading] = useState(false);
  const [unassigning, setUnassigning] = useState({});
  const [scopeUnassigning, setScopeUnassigning] = useState({});
  const [updatingAssignment, setUpdatingAssignment] = useState(false);

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
      alert("No judges or teams available for auto-distribution.");
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
    } catch (err) {
      console.error("Auto-Distribute Error:", err);
      alert("Auto-Distribute Error: " + (err?.message || JSON.stringify(err)));
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

  return (
    <Card className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        <Gavel className="w-5 h-5" /> Judge Assignments
      </h2>
      <p className="mb-6 text-gray-600">Assign teams and scope (round/problem) to judges.</p>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label>Judge</Label>
          <Select value={selectedJudgeAssignmentId} onValueChange={setSelectedJudgeAssignmentId}>
            <SelectTrigger><SelectValue placeholder="Select Judge" /></SelectTrigger>
            <SelectContent>
              {allJudgeAssignments.map(a => (
                <SelectItem key={a._id} value={a._id}>
                  {a.judge.email} ({a.judge.type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Assignment Type</Label>
          <Select value={selectedAssignmentType} onValueChange={setSelectedAssignmentType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="round">Round</SelectItem>
              <SelectItem value="problemStatement">Problem Statement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Scope</Label>
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
                alert("Failed to update judge assignment.");
              } finally {
                setUpdatingAssignment(false);
              }
            }}
            placeholder="Select scopes"
            disabled={updatingAssignment}
          />
          <span className="text-xs text-gray-400">Select rounds or problem statements</span>
        </div>
        <div>
          <Label>Teams</Label>
          <MultiSelect
            options={teams.map(t => ({ value: t._id, label: t.name }))}
            value={selectedTeamIds}
            onChange={setSelectedTeamIds}
            placeholder="Select teams"
          />
          <span className="text-xs text-gray-400">Assign teams to this judge</span>
        </div>
        <div className="col-span-full flex gap-3 mt-2">
          <Button type="button" disabled={!selectedJudgeAssignmentId || selectedTeamIds.length === 0} onClick={() => assignTeamsToJudge(selectedJudgeAssignmentId, selectedTeamIds)}>
            Assign Teams
          </Button>
          <Button type="button" variant="outline" loading={autoDistLoading} disabled={autoDistLoading || filteredAssignments.length === 0} onClick={handleAutoDistribute}>
            Auto-Distribute
          </Button>
        </div>
      </form>
      <h3 className="font-semibold mb-2">Current Assignments</h3>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>Judge</th>
              <th>Type</th>
              <th>Teams</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-2">No assignments</td></tr>
            ) : filteredAssignments.map(a => (
              <tr key={a._id} className="border-b hover:bg-indigo-50 transition">
                <td className="px-2 py-1">{a.judge.email}</td>
                <td className="px-2 py-1">{a.judge.type}</td>
                <td className="px-2 py-1">
                  <div className="flex flex-wrap gap-1">
                    {a.assignedTeams?.length ? a.assignedTeams.map(tid => {
                      const team = teams.find(t => t._id === tid);
                      return (
                        <span key={tid} className="inline-flex items-center bg-purple-100 text-purple-700 rounded-full px-2 py-1 text-xs border shadow mr-1">
                          {team?.name || tid}
                          <button
                            className="ml-1 text-red-500 hover:text-white hover:bg-red-500 rounded-full w-4 h-4 flex items-center justify-center"
                            onClick={() => assignTeamsToJudge(a._id, a.assignedTeams.filter(id => id !== tid))}
                            title="Remove team"
                          >×</button>
                        </span>
                      );
                    }) : <span className="text-gray-400">None</span>}
                  </div>
                </td>
                <td className="px-2 py-1 flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={unassigning[a._id]}
                    loading={!!unassigning[a._id]}
                    onClick={() => handleUnassignAll(a._id)}
                  >
                    🗑 Remove All
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
