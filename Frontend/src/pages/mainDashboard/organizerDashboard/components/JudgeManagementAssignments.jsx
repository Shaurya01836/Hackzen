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
  autoDistributeTeams
}) {
  const [autoDistLoading, setAutoDistLoading] = useState(false);
  const [unassigning, setUnassigning] = useState({});
  const [scopeUnassigning, setScopeUnassigning] = useState({});

  // Filter judge assignments for the selected round/PS
  const filteredAssignments = useMemo(() => {
    if (!hackathon) return [];
    if (selectedAssignmentType === "round") {
      return allJudgeAssignments.filter(a =>
        a.assignedRounds && a.assignedRounds.some(r => r.roundId === selectedRoundId)
      );
    } else {
      const ps = hackathon.problemStatements?.find(ps => ps._id === selectedRoundId);
      if (!ps) return [];
      return allJudgeAssignments.filter(a =>
        a.assignedProblemStatements && a.assignedProblemStatements.some(p => String(p.problemStatementId) === String(ps._id))
      );
    }
  }, [allJudgeAssignments, hackathon, selectedAssignmentType, selectedRoundId]);

  // Judges already assigned to this scope
  const assignedJudgeIds = useMemo(() => {
    if (selectedAssignmentType === "round") {
      return new Set(
        allJudgeAssignments.filter(a =>
          a.assignedRounds && a.assignedRounds.some(r => r.roundId === selectedRoundId)
        ).map(a => a.judge.email)
      );
    } else {
      const ps = hackathon?.problemStatements?.find(ps => ps._id === selectedRoundId);
      if (!ps) return new Set();
      return new Set(
        allJudgeAssignments.filter(a =>
          a.assignedProblemStatements && a.assignedProblemStatements.some(p => String(p.problemStatementId) === String(ps._id))
        ).map(a => a.judge.email)
      );
    }
  }, [allJudgeAssignments, hackathon, selectedAssignmentType, selectedRoundId]);

  // Handler for auto-distribution
  const handleAutoDistribute = async () => {
    if (filteredAssignments.length === 0 || teams.length === 0) {
      window.alert("No judges or teams available for auto-distribution.");
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
      // Log and show error
      console.error("Auto-Distribute Error:", err);
      window.alert("Auto-Distribute Error: " + (err?.message || JSON.stringify(err)));
    } finally {
      setAutoDistLoading(false);
    }
  };

  // Handler to unassign all teams from a judge assignment
  const handleUnassignAll = async (assignmentId) => {
    setUnassigning((prev) => ({ ...prev, [assignmentId]: true }));
    try {
      await assignTeamsToJudge(assignmentId, []);
    } finally {
      setUnassigning((prev) => ({ ...prev, [assignmentId]: false }));
    }
  };

  // Handler to unassign judge from this scope (problem statement or round)
  const handleUnassignScope = async (assignmentId, scopeId) => {
    setScopeUnassigning((prev) => ({ ...prev, [assignmentId]: true }));
    try {
      await fetch(`/api/judge-management/judge-assignments/${assignmentId}/unassign-scope`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          selectedAssignmentType === "round"
            ? { roundId: scopeId }
            : { problemStatementId: scopeId }
        ),
      });
      // Optionally: refresh assignments in parent
      window.location.reload(); // or call a prop to refresh
    } finally {
      setScopeUnassigning((prev) => ({ ...prev, [assignmentId]: false }));
    }
  };

  // All available judges (from assignments)
  const allJudges = useMemo(() => {
    const emails = new Set();
    return allJudgeAssignments.filter(a => {
      if (!emails.has(a.judge.email)) {
        emails.add(a.judge.email);
        return true;
      }
      return false;
    }).map(a => a.judge);
  }, [allJudgeAssignments]);

  return (
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
        {/* Manual Assignment Controls */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
                {filteredAssignments.map(a => (
                  <SelectItem
                    key={a._id}
                    value={a._id}
                  >
                    {a.judge.email} ({a.judge.type})
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
              value={selectedRoundId || ""}
              onValueChange={setSelectedRoundId}
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
                  <SelectItem key={item._id} value={item._id}>
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
          <div className="flex flex-col gap-2">
            <Button
              disabled={!selectedJudgeAssignmentId || selectedTeamIds.length === 0}
              onClick={() => {
                if (!selectedJudgeAssignmentId) {
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
              loading={!!autoDistLoading || undefined}
              disabled={filteredAssignments.length === 0 || teams.length === 0 || autoDistLoading}
              onClick={handleAutoDistribute}
            >
              Auto-Distribute Teams
            </Button>
          </div>
        </div>
        {/* Assignment Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="px-2 py-1 text-left">Judge</th>
                <th className="px-2 py-1 text-left">Type</th>
                <th className="px-2 py-1 text-left">Assigned Teams</th>
                <th className="px-2 py-1 text-left">Count</th>
                <th className="px-2 py-1 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-2">No judge assignments for this scope.</td></tr>
              ) : (
                filteredAssignments.map(a => (
                  <tr key={a._id}>
                    <td className="px-2 py-1">{a.judge.email}</td>
                    <td className="px-2 py-1">{a.judge.type}</td>
                    <td className="px-2 py-1">
                      {a.assignedTeams && a.assignedTeams.length > 0
                        ? a.assignedTeams.map(tid => {
                            const t = teams.find(tm => tm._id === tid);
                            return t ? t.name : tid;
                          }).join(", ")
                        : <span className="text-muted-foreground">None</span>}
                    </td>
                    <td className="px-2 py-1 text-center">{a.assignedTeams ? a.assignedTeams.length : 0}</td>
                    <td className="px-2 py-1 flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={unassigning[a._id]}
                        loading={!!unassigning[a._id] || undefined}
                        onClick={() => handleUnassignAll(a._id)}
                      >
                        Unassign All Teams
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={scopeUnassigning[a._id]}
                        loading={!!scopeUnassigning[a._id] || undefined}
                        onClick={() => handleUnassignScope(a._id, selectedRoundId)}
                      >
                        Unassign from This {selectedAssignmentType === "round" ? "Round" : "Problem"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
} 