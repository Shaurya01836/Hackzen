import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/CommonUI/card";
import { Button } from "../../../components/CommonUI/button";
import { Eye, CheckCircle, Clock, XCircle, Users, Award, FileText, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/DashboardUI/dialog";
import { ProjectDetail } from "../../../components/CommonUI/ProjectDetail";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "../../../hooks/use-toast";
import ScoringModal from "./ScoringModal";

export default function JudgeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignedSubmissions, setAssignedSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [scoringModalOpen, setScoringModalOpen] = useState(false);
  const [submissionToScore, setSubmissionToScore] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [rounds, setRounds] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [hasSpecificAssignments, setHasSpecificAssignments] = useState(false);

  useEffect(() => {
    if (user) {
      console.log('🔍 Fetching submissions for user and round:', currentRound);
      fetchAssignedSubmissions();
    }
  }, [user, currentRound]);

  // Add periodic refresh
  useEffect(() => {
    const interval = setInterval(fetchAssignedSubmissions, 30000);
    return () => clearInterval(interval);
  }, [currentRound]);

  const fetchAssignedSubmissions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/judge-management/my-assignments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Judge dashboard data:', {
          hasSpecificAssignments: data.hasSpecificAssignments,
          totalSubmissions: data.totalSubmissions,
          submissions: data.submissions?.length || 0,
          rounds: data.rounds?.length || 0,
          hackathons: data.hackathons?.length || 0,
          allSubmissions: data.submissions || [],
          roundsData: data.rounds || [],
          hackathonsData: data.hackathons || []
        });
        
        setAllSubmissions(data.submissions || []);
        setRounds(data.rounds || []);
        setHackathons(data.hackathons || []);
        setHasSpecificAssignments(data.hasSpecificAssignments || false);
        
        // Set current round to first available round if we have rounds
        if (data.rounds && data.rounds.length > 0) {
          const firstRoundIndex = data.rounds[0].index;
          setCurrentRound(firstRoundIndex);
          console.log('🔍 Setting current round to:', firstRoundIndex);
        }
        
        console.log('🔍 Available rounds:', data.rounds);
        console.log('🔍 Current round state:', currentRound);
        
        // Only show submissions if judge has specific assignments
        if (data.hasSpecificAssignments) {
          // Filter submissions for current round
          const roundSubmissions = data.submissions?.filter(sub => {
            console.log(`🔍 Checking submission ${sub._id} - roundIndex: ${sub.roundIndex}, currentRound: ${currentRound}`);
            return sub.roundIndex === currentRound;
          }) || [];
          console.log(`🔍 Filtered submissions for round ${currentRound}:`, roundSubmissions.length);
          console.log('🔍 All submissions data:', data.submissions);
          console.log('🔍 Round submissions:', roundSubmissions);
          setAssignedSubmissions(roundSubmissions);
        } else {
          // Show no submissions when no specific assignments
          console.log('🔍 No specific assignments, showing empty dashboard');
          setAssignedSubmissions([]);
        }
      } else {
        throw new Error('Failed to fetch assigned submissions');
      }
    } catch (error) {
      console.error('Error fetching assigned submissions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your assigned submissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScoreSubmission = async (submissionId, score, feedback) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/judge-management/submissions/${submissionId}/score`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ score, feedback, roundIndex: currentRound })
      });
      
      if (response.ok) {
        toast({
          title: 'Score submitted successfully',
          description: 'Your evaluation has been recorded.',
          variant: 'default',
        });
        fetchAssignedSubmissions(); // Refresh the list
      } else {
        throw new Error('Failed to submit score');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit score',
        variant: 'destructive',
      });
    }
  };

  const openScoringModal = (submission) => {
    setSubmissionToScore(submission);
    setScoringModalOpen(true);
  };

  const handleScoreSubmit = (submissionId, score, feedback) => {
    // Update the local state to reflect the new score
    setAssignedSubmissions(prev => 
      prev.map(sub => 
        sub._id === submissionId 
          ? { ...sub, score, evaluationStatus: 'evaluated' }
          : sub
      )
    );
    setAllSubmissions(prev => 
      prev.map(sub => 
        sub._id === submissionId 
          ? { ...sub, score, evaluationStatus: 'evaluated' }
          : sub
      )
    );
    handleScoreSubmission(submissionId, score, feedback);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'evaluated':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'evaluated':
        return 'Evaluated';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (date) => date ? new Date(date).toLocaleString() : '--';

  const getSubmissionTypeIcon = (submission) => {
    if (submission.pptFile) return <FileText className="w-4 h-4 text-blue-600" />;
    if (submission.projectId) return <Award className="w-4 h-4 text-green-600" />;
    return <FileText className="w-4 h-4 text-gray-600" />;
  };

  const getSubmissionTypeText = (submission) => {
    if (submission.pptFile) return 'PPT';
    if (submission.projectId) return 'Project';
    return 'Submission';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Judge Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || user?.email}</p>
          <p className="text-sm text-blue-600 mt-1">
            {hasSpecificAssignments 
              ? "You can view and evaluate submissions assigned to you by the organizer"
              : "No submissions assigned yet. The organizer will assign specific projects to you for evaluation."
            }
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            {hasSpecificAssignments ? (
              <>
                <span className="text-sm text-gray-500">
                  {allSubmissions.length} total submissions assigned
                </span>
                <br />
                <span className="text-sm text-gray-500">
                  {assignedSubmissions.length} in current round
                </span>
              </>
            ) : (
              <div className="mt-2">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  No assignments yet
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Round Selection */}
      {rounds.length > 0 && hasSpecificAssignments && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Round
            </CardTitle>
            <p className="text-sm text-gray-600">
              Choose which round's submissions you want to evaluate
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {rounds.map((round, index) => (
                <Button
                  key={index}
                  variant={currentRound === round.index ? "default" : "outline"}
                  onClick={() => setCurrentRound(round.index)}
                >
                  {round.name || `Round ${round.index + 1}`}
                  <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded">
                    {round.submissionCount || 0}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assigned Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="w-5 h-5" />
            My Assigned Submissions
            <Button onClick={fetchAssignedSubmissions} disabled={loading} variant="outline" size="sm" className="ml-auto">
              <RefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </CardTitle>
          <p className="text-sm text-gray-600">
            {hasSpecificAssignments 
              ? `${rounds.find(r => r.index === currentRound)?.name || `Round ${currentRound + 1}`} - ${assignedSubmissions.length} submissions assigned to you`
              : 'No submissions assigned yet. The organizer will assign projects to you for evaluation.'
            }
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading your assigned submissions...</p>
            </div>
          ) : assignedSubmissions.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {hasSpecificAssignments 
                  ? 'No submissions assigned to you for this round.'
                  : 'No submissions assigned to you yet.'
                }
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {hasSpecificAssignments
                  ? 'The organizer will assign submissions to you when they are ready for evaluation.'
                  : 'The organizer will assign specific projects to you for evaluation.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">#</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Team</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Project Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Submitted</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedSubmissions.map((submission, index) => (
                    <tr key={submission._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {submission.team?.name?.charAt(0)?.toUpperCase() || 'T'}
                          </div>
                          <span className="font-medium text-gray-900">
                            {submission.team?.name || 'No Team'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {getSubmissionTypeIcon(submission)}
                          <span className="text-sm text-gray-600">
                            {getSubmissionTypeText(submission)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">
                          {submission.projectTitle || submission.title || 'Untitled Project'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDate(submission.submittedAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(submission.evaluationStatus || 'pending')}
                          <span className="text-sm text-gray-600">
                            {getStatusText(submission.evaluationStatus || 'pending')}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {submission.score ? (
                          <span className="font-bold text-yellow-700">
                            {submission.score} / 10
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">Not scored</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {submission.evaluationStatus !== 'evaluated' && (
                            <Button
                              size="sm"
                              onClick={() => openScoringModal(submission)}
                            >
                              Score
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
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

      {/* Scoring Modal */}
      <ScoringModal
        open={scoringModalOpen}
        onClose={() => setScoringModalOpen(false)}
        submission={submissionToScore}
        onScoreSubmit={handleScoreSubmit}
        roundIndex={currentRound}
      />
    </div>
  );
}