import React, { useState, useEffect, useMemo } from "react";
import { Eye, Users, Award, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/DashboardUI/dialog";
import { ProjectDetail } from "../../../../components/CommonUI/ProjectDetail";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../../hooks/use-toast";
import axios from "axios";
import BulkEvaluatorAssignModal from "./BulkEvaluatorAssignModal";

const PAGE_SIZE = 10;

export default function SubmissionRoundView({ roundId, roundName, roundDescription, roundStart, roundEnd, roundIndex, roundType, teams, submissions, judgeAssignments = { platform: [], sponsor: [], hybrid: [] }, hackathonId }) {
  console.log('DEBUG: SubmissionRoundView render', { submissionsLength: submissions.length, roundIndex });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [scoresMap, setScoresMap] = useState({});
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [allEvaluators, setAllEvaluators] = useState([]);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Get judge count for a submission - moved before useMemo to fix hoisting issue
  const getJudgeCountForSubmission = (submissionId) => {
    let count = 0;
    
    // Check all judge assignment types
    Object.values(judgeAssignments).forEach(assignmentArray => {
      if (Array.isArray(assignmentArray)) {
        assignmentArray.forEach(assignment => {
          if (assignment.assignedRounds) {
            assignment.assignedRounds.forEach(round => {
              if (round.assignedSubmissions && round.assignedSubmissions.includes(submissionId)) {
                count++;
              }
            });
          }
        });
      }
    });
    
    return count;
  };

  // Memoized roundSubmissions using the submissions prop
  const roundSubmissions = useMemo(() => {
    const filtered = submissions.filter(sub => {
      const matchesRound = typeof roundIndex === 'number' && sub.roundIndex === roundIndex;
      const isSubmitted = sub.status && sub.status.toLowerCase() === 'submitted';
      return matchesRound && isSubmitted;
    });
    return filtered;
  }, [submissions, roundIndex]);

  // Separate assigned and unassigned submissions
  const { assignedSubmissions, unassignedSubmissions } = useMemo(() => {
    const assigned = [];
    const unassigned = [];
    
    roundSubmissions.forEach(sub => {
      const judgeCount = getJudgeCountForSubmission(sub._id);
      if (judgeCount > 0) {
        assigned.push(sub);
      } else {
        unassigned.push(sub);
      }
    });
    
    return { assignedSubmissions: assigned, unassignedSubmissions: unassigned };
  }, [roundSubmissions, judgeAssignments]);

  // Debug logs for submissions and roundSubmissions
  useEffect(() => {
    console.log('DEBUG: all submissions', submissions);
  }, [submissions]);
  useEffect(() => {
    console.log('DEBUG: roundSubmissions', roundSubmissions);
  }, [roundSubmissions]);

  // Fetch evaluators when component mounts
  useEffect(() => {
    if (hackathonId) {
      fetchEvaluators();
    }
  }, [hackathonId]);

  const fetchEvaluators = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/judge-management/hackathons/${hackathonId}/evaluators`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAllEvaluators(data.evaluators || []);
      } else {
        console.error('Failed to fetch evaluators');
      }
    } catch (error) {
      console.error('Error fetching evaluators:', error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(roundSubmissions.length / PAGE_SIZE);
  const paginatedSubmissions = useMemo(() => {
    return roundSubmissions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [roundSubmissions, currentPage]);

  useEffect(() => {
    // Fetch scores for all paginated submissions
    async function fetchScores() {
      const map = {};
      await Promise.all(paginatedSubmissions.map(async (sub) => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`/api/scores/submission/${sub._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const scores = Array.isArray(res.data) ? res.data : [];
          if (scores.length > 0) {
            // Calculate average as in ProjectScoresList
            const CRITERIA = ["innovation", "impact", "technicality", "presentation"];
            const avg = (
              scores.reduce((sum, s) => {
                const total = CRITERIA.reduce((acc, c) => acc + (s.scores?.[c] || 0), 0);
                return sum + total / CRITERIA.length;
              }, 0) / scores.length
            ).toFixed(2);
            map[sub._id] = avg;
          }
        } catch {}
      }));
      setScoresMap(map);
    }
    fetchScores();
  }, [paginatedSubmissions]);

  // Improved team/leader extraction
  const getTeamAndLeader = (sub) => {
    let team = null;
    // Try to match by _id (string/number mismatch safe)
    if (sub.team && typeof sub.team === 'object') team = sub.team;
    else if (sub.teamId) team = teams.find(t => t._id == sub.teamId);
    else if (sub.teamName) team = teams.find(t => t.name === sub.teamName);
    // Fallbacks if not found
    let teamName = team?.name || sub.teamName || sub.teamId || 'No Team';
    let leaderName = team?.leader?.name || team?.leader || sub.leaderName || sub.leader;
    if (!leaderName) {
      if (sub.submittedBy && (sub.submittedBy.name || sub.submittedBy.email)) {
        leaderName = sub.submittedBy.name || sub.submittedBy.email;
      } else {
        leaderName = '--';
      }
    }
    return { teamName, leaderName };
  };

  const formatDate = (date) => date ? new Date(date).toLocaleString() : '--';



  // Selection logic
  const isAllSelected = paginatedSubmissions.length > 0 && paginatedSubmissions.every(sub => selectedRows.includes(sub._id));
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows([
        ...selectedRows,
        ...paginatedSubmissions.map(sub => sub._id).filter(id => !selectedRows.includes(id))
      ]);
    } else {
      setSelectedRows(selectedRows.filter(id => !paginatedSubmissions.map(sub => sub._id).includes(id)));
    }
  };
  const handleSelectRow = (id) => {
    setSelectedRows(selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id]
    );
  };

  const handleShortlistSelected = async () => {
    if (selectedRows.length === 0) {
      toast({
        title: 'No submissions selected',
        description: 'Please select at least one submission to shortlist.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const promises = selectedRows.map(submissionId =>
        fetch(`/api/judge-management/submissions/${submissionId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'shortlisted' })
        })
      );

      const responses = await Promise.all(promises);
      const failedCount = responses.filter(r => !r.ok).length;
      const successCount = responses.length - failedCount;

      if (successCount > 0) {
        toast({
          title: 'Shortlist successful',
          description: `Successfully shortlisted ${successCount} submission(s)${failedCount > 0 ? `, ${failedCount} failed` : ''}.`,
          variant: 'default',
        });
        setSelectedRows([]);
        // Refresh the submissions list
        window.location.reload();
      } else {
        throw new Error('All shortlist operations failed');
      }
    } catch (error) {
      console.error('Error shortlisting submissions:', error);
      toast({
        title: 'Shortlist failed',
        description: 'Failed to shortlist selected submissions.',
        variant: 'destructive',
      });
    }
  };

  const handleRejectSelected = async () => {
    if (selectedRows.length === 0) {
      toast({
        title: 'No submissions selected',
        description: 'Please select at least one submission to reject.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const promises = selectedRows.map(submissionId =>
        fetch(`/api/judge-management/submissions/${submissionId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'rejected' })
        })
      );

      const responses = await Promise.all(promises);
      const failedCount = responses.filter(r => !r.ok).length;
      const successCount = responses.length - failedCount;

      if (successCount > 0) {
        toast({
          title: 'Reject successful',
          description: `Successfully rejected ${successCount} submission(s)${failedCount > 0 ? `, ${failedCount} failed` : ''}.`,
          variant: 'default',
        });
        setSelectedRows([]);
        // Refresh the submissions list
        window.location.reload();
      } else {
        throw new Error('All reject operations failed');
      }
    } catch (error) {
      console.error('Error rejecting submissions:', error);
      toast({
        title: 'Reject failed',
        description: 'Failed to reject selected submissions.',
        variant: 'destructive',
      });
    }
  };

  // Determine if the round has started
  const now = new Date();
  const roundStartDate = roundStart ? new Date(roundStart) : null;
  const roundEndDate = roundEnd ? new Date(roundEnd) : null;
  const hasStarted = !roundStartDate || now >= roundStartDate;

  return (
    <div className="space-y-6">
      {/* Round Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{roundName}</h2>
            <p className="text-gray-600 mt-1">{roundDescription}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>Start: {formatDate(roundStart)}</span>
              <span>End: {formatDate(roundEnd)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{roundSubmissions.length}</div>
            <div className="text-sm text-gray-500">Total Submissions</div>
          </div>
        </div>

        {/* Assignment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Assigned</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{assignedSubmissions.length}</p>
            <p className="text-sm text-blue-600">To Judges</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-900">Unassigned</span>
            </div>
            <p className="text-2xl font-bold text-yellow-700">{unassignedSubmissions.length}</p>
            <p className="text-sm text-yellow-600">Need Assignment</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">Evaluated</span>
            </div>
            <p className="text-2xl font-bold text-green-700">
              {assignedSubmissions.filter(sub => scoresMap[sub._id]).length}
            </p>
            <p className="text-sm text-green-600">With Scores</p>
      </div>
        </div>
      </div>

      {/* Unassigned Submissions Section */}
      {unassignedSubmissions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Unassigned Submissions</h3>
                <p className="text-sm text-gray-600">Submissions that need to be assigned to judges</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600">{unassignedSubmissions.length}</div>
                <div className="text-sm text-gray-500">Pending Assignment</div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows(unassignedSubmissions.map(sub => sub._id));
                          } else {
                            setSelectedRows([]);
                          }
                        }}
                        checked={selectedRows.length === unassignedSubmissions.length && unassignedSubmissions.length > 0}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {unassignedSubmissions.map((sub) => {
                    const { teamName, leaderName } = getTeamAndLeader(sub);
                    return (
                      <tr key={sub._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedRows.includes(sub._id)}
                            onChange={() => handleSelectRow(sub._id)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{teamName}</div>
                            <div className="text-sm text-gray-500">{leaderName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {sub.projectTitle || sub.title || 'Untitled Project'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {sub.pptFile ? (
                              <FileText className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Award className="w-4 h-4 text-green-600" />
                            )}
                            <span className="text-sm text-gray-600">
                              {sub.pptFile ? 'PPT' : 'Project'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(sub.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                <button
                            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-900 font-medium text-xs"
                            onClick={() => navigate(`/dashboard/organizer/submission/${sub._id}`)}
                >
                            <Eye className="w-4 h-4" /> View
                </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Assignment Actions for Unassigned */}
            {selectedRows.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-6 items-center">
                <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Assign {selectedRows.length} selected submission{selectedRows.length > 1 ? 's' : ''} to judges
                    </p>
                    <p className="text-xs text-blue-700">
                      Judges will only see submissions you assign to them
                    </p>
                  </div>
                </div>
                <button
                  className="border border-blue-500 text-blue-600 bg-white px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition flex items-center gap-2" 
                  onClick={() => setAssignModalOpen(true)}
                >
                  <Users className="w-4 h-4" />
                  Assign to Judges
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assigned Submissions Section */}
      {assignedSubmissions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Assigned Submissions</h3>
                <p className="text-sm text-gray-600">Submissions already assigned to judges</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{assignedSubmissions.length}</div>
                <div className="text-sm text-gray-500">Assigned to Judges</div>
              </div>
            </div>
          </div>
          <div className="p-6">
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Judges</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignedSubmissions.map((sub) => {
                  const { teamName, leaderName } = getTeamAndLeader(sub);
                    const judgeCount = getJudgeCountForSubmission(sub._id);
                  return (
                      <tr key={sub._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{teamName}</div>
                            <div className="text-sm text-gray-500">{leaderName}</div>
                          </div>
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {sub.projectTitle || sub.title || 'Untitled Project'}
                          </div>
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            {sub.pptFile ? (
                              <FileText className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Award className="w-4 h-4 text-green-600" />
                            )}
                            <span className="text-sm text-gray-600">
                              {sub.pptFile ? 'PPT' : 'Project'}
                          </span>
                        </div>
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700">
                              {judgeCount} judge{judgeCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {scoresMap[sub._id] ? (
                            <span className="font-bold text-yellow-700">{scoresMap[sub._id]} / 10</span>
                          ) : (
                            <span className="italic text-gray-500">Not evaluated yet</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <button
                            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium text-xs"
                          onClick={() => navigate(`/dashboard/organizer/submission/${sub._id}`)}
                        >
                            <Eye className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {roundSubmissions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Submissions Yet</h3>
          <p className="text-gray-600">No submissions have been made for this round.</p>
        </div>
      )}

          {/* Modal for viewing submission details */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="max-w-3xl w-full">
              <DialogHeader>
                <DialogTitle>Submission Details</DialogTitle>
              </DialogHeader>
              {selectedSubmission && (
                <ProjectDetail
                  project={selectedSubmission}
                  submission={selectedSubmission}
                  hideBackButton={true}
                  onlyOverview={false}
                />
              )}
            </DialogContent>
          </Dialog>

      {/* Bulk Evaluator Assign Modal */}
          <BulkEvaluatorAssignModal
            open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
            selectedCount={selectedRows.length}
            onAssign={(selectedEvaluatorIds) => {
          toast({
            title: 'Success',
            description: `Assigned ${selectedEvaluatorIds.length} evaluator(s) to ${selectedRows.length} submission(s)`,
          });
              setAssignModalOpen(false);
          setSelectedRows([]);
          // Refresh the component to update assignments
          window.location.reload();
            }}
            allEvaluators={allEvaluators}
            initialSelected={[]}
            hackathonId={hackathonId}
            roundIndex={roundIndex}
            selectedSubmissionIds={selectedRows}
          />
    </div>
  );
} 