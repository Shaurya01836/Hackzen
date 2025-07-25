import React, { useState, useEffect, useMemo } from "react";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/DashboardUI/dialog";
import { ProjectDetail } from "../../../../components/CommonUI/ProjectDetail";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  // Memoized roundSubmissions using the submissions prop
  const roundSubmissions = useMemo(() => {
    const filtered = submissions.filter(sub => {
      const matchesRound = typeof roundIndex === 'number' && sub.roundIndex === roundIndex;
      const isSubmitted = sub.status && sub.status.toLowerCase() === 'submitted';
      return matchesRound && isSubmitted;
    });
    return filtered;
  }, [submissions, roundIndex]);

  // Debug logs for submissions and roundSubmissions
  useEffect(() => {
    console.log('DEBUG: all submissions', submissions);
  }, [submissions]);
  useEffect(() => {
    console.log('DEBUG: roundSubmissions', roundSubmissions);
  }, [roundSubmissions]);

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

  // Format evaluators from judgeAssignments
  const allEvaluators = useMemo(() => {
    const evaluators = [];
    
    // Add platform judges
    if (judgeAssignments.platform) {
      judgeAssignments.platform.forEach(judge => {
        evaluators.push({
          id: judge._id || judge.judge?.email,
          name: judge.judge?.name || judge.judge?.email || 'Unknown Judge',
          email: judge.judge?.email,
          type: 'platform',
          status: judge.status
        });
      });
    }
    
    // Add sponsor judges
    if (judgeAssignments.sponsor) {
      judgeAssignments.sponsor.forEach(judge => {
        evaluators.push({
          id: judge._id || judge.judge?.email,
          name: judge.judge?.name || judge.judge?.email || 'Unknown Judge',
          email: judge.judge?.email,
          type: 'sponsor',
          status: judge.status
        });
      });
    }
    
    // Add hybrid judges
    if (judgeAssignments.hybrid) {
      judgeAssignments.hybrid.forEach(judge => {
        evaluators.push({
          id: judge._id || judge.judge?.email,
          name: judge.judge?.name || judge.judge?.email || 'Unknown Judge',
          email: judge.judge?.email,
          type: 'hybrid',
          status: judge.status
        });
      });
    }
    
    return evaluators;
  }, [judgeAssignments]);

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

  // Determine if the round has started
  const now = new Date();
  const roundStartDate = roundStart ? new Date(roundStart) : null;
  const roundEndDate = roundEnd ? new Date(roundEnd) : null;
  const hasStarted = !roundStartDate || now >= roundStartDate;

  // Modal for viewing submission details
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-7xl mx-auto my-10">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          {roundName}
          {roundType && (
            <span className="ml-2 px-3 py-1 rounded-full bg-gray-200 text-gray-800 text-xs font-semibold uppercase">{roundType}</span>
          )}
        </h2>
        <div className="flex gap-8 text-sm text-gray-700 items-center mb-1">
          {roundStart && <span><b>Start:</b> {formatDate(roundStart)}</span>}
          {roundEnd && <span><b>End:</b> {formatDate(roundEnd)}</span>}
        </div>
        {roundDescription && <p className="text-gray-600 text-base mb-2">{roundDescription}</p>}
      </div>
      {!hasStarted ? (
        <div className="my-12 p-8 bg-yellow-50 border border-yellow-200 rounded-xl text-center text-lg text-yellow-800 font-semibold shadow">
          This round has not been started yet.<br/>
          <span className="text-base font-normal text-gray-700">Start: {formatDate(roundStart)} | End: {formatDate(roundEnd)}</span>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-4">
            <span className="text-sm text-gray-800 font-medium">Selected: {selectedRows.length}</span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 rounded border text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="text-xs text-gray-600">Page {currentPage} of {totalPages}</span>
                <button
                  className="px-2 py-1 rounded border text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">All Submissions for <span className="text-indigo-700">{roundName}</span></h3>
            <p className="text-gray-700 text-sm mb-2">Below are <b>all participant submissions</b> for this round. Click "View" to see full details.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-3 text-left font-semibold text-gray-900 border-b border-gray-300">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      aria-label="Select all submissions on this page"
                    />
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900 border-b border-gray-300">#</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900 border-b border-gray-300">Team</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900 border-b border-gray-300">Leader</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900 border-b border-gray-300">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900 border-b border-gray-300">Submitted At</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900 border-b border-gray-300">Score</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900 border-b border-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-400">No submissions found for this round.</td></tr>
                ) : paginatedSubmissions.map((sub, idx) => {
                  const { teamName, leaderName } = getTeamAndLeader(sub);
                  return (
                    <tr key={sub._id || idx} className="border-b border-gray-200 bg-white hover:bg-gray-50 transition-all rounded-xl">
                      <td className="px-3 py-3 align-middle border-b border-gray-200">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(sub._id)}
                          onChange={() => handleSelectRow(sub._id)}
                          aria-label={`Select submission ${idx + 1}`}
                        />
                      </td>
                      <td className="px-6 py-3 font-medium align-middle border-b border-gray-200 text-gray-900 font-bold">
                        {(currentPage - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="px-6 py-3 align-middle border-b border-gray-200 min-w-[120px]">
                        <div className="flex items-center gap-2">
                          {teamName !== 'No Team' ? (
                            <div
                              className="h-8 w-8 rounded-full flex items-center justify-center text-lg font-bold text-white"
                              style={{ background: `#${((1<<24)*Math.abs(Math.sin(teamName.length))).toString(16).slice(0,6)}` }}
                            >
                              {teamName.charAt(0).toUpperCase()}
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold text-gray-500 border border-gray-400">-</div>
                          )}
                          <span className={teamName !== 'No Team' ? 'font-semibold' : 'text-gray-500'} style={teamName !== 'No Team' ? { color: `#${((1<<24)*Math.abs(Math.sin(teamName.length))).toString(16).slice(0,6)}` } : {}}>
                            {teamName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 align-middle border-b border-gray-200">
                        <span className="text-gray-800 font-medium">{leaderName}</span>
                      </td>
                      <td className="px-6 py-3 align-middle border-b border-gray-200">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white">
                          Submitted
                        </span>
                      </td>
                      <td className="px-6 py-3 align-middle border-b border-gray-200">
                        <span className="text-gray-900 font-semibold">{sub.submittedAt ? formatDate(sub.submittedAt) : '--'}</span>
                      </td>
                      <td className="px-6 py-3 align-middle border-b border-gray-200">
                        {scoresMap[sub._id] ? (
                          <span className="font-bold text-yellow-700">{scoresMap[sub._id]} / 10</span>
                        ) : <span className="italic text-gray-500">Not evaluated yet</span>}
                      </td>
                      <td className="px-6 py-3 align-middle border-b border-gray-200">
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium text-xs shadow"
                          onClick={() => navigate(`/dashboard/organizer/submission/${sub._id}`)}
                          title="View Submission"
                        >
                          <Eye className="w-4 h-4 mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
          {/* After the table, add action buttons if any rows are selected */}
          {selectedRows.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-8 items-center">
              <button className="border border-blue-500 text-blue-600 bg-white px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition" onClick={() => { console.log('DEBUG: Assign Bulk Evaluator clicked'); setAssignModalOpen(true); }}>Assign Bulk Evaluator</button>
              <button className="border border-blue-500 text-blue-600 bg-white px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition" onClick={() => alert('Download Reports')}>Download Reports</button>
              <button className="border border-blue-500 text-blue-600 bg-white px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition" onClick={() => alert('Download report url sheet')}>Download report url sheet</button>
              <button className="border border-blue-500 text-blue-600 bg-white px-5 py-2 rounded-lg font-medium hover:bg-blue-50 transition" onClick={() => alert('Move Candidate')}>Move Candidate</button>
              <button className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-700 transition" onClick={() => alert('Shortlist')}>Shortlist</button>
              <button className="bg-red-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-red-600 transition" onClick={() => alert('Reject')}>Reject</button>
              <button className="bg-orange-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-600 transition" onClick={() => alert('Rollback')}>Rollback</button>
            </div>
          )}
          <BulkEvaluatorAssignModal
            open={assignModalOpen}
            onClose={() => { console.log('DEBUG: BulkEvaluatorAssignModal closed'); setAssignModalOpen(false); }}
            selectedCount={selectedRows.length}
            onAssign={(selectedEvaluatorIds) => {
              alert(`Assigned ${selectedEvaluatorIds.length} evaluator(s) to ${selectedRows.length} candidate(s)`);
              setAssignModalOpen(false);
            }}
            allEvaluators={allEvaluators}
            initialSelected={[]}
            hackathonId={hackathonId}
            roundIndex={roundIndex}
            selectedSubmissionIds={selectedRows}
          />
        </>
      )}
    </div>
  );
} 