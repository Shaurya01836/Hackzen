import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/CommonUI/card";
import { Button } from "../../../../components/CommonUI/button";
import { Trophy, Award, Users, FileText, CheckCircle, Clock, AlertCircle, RefreshCw, Info, Eye, Filter } from "lucide-react";
import { useToast } from "../../../../hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/DashboardUI/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/CommonUI/select";

export default function LeaderboardView({ hackathonId, roundIndex = 1, onShortlistingComplete }) {
  const { toast } = useToast();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shortlisting, setShortlisting] = useState(false);
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [shortlistCount, setShortlistCount] = useState(10);
  const [shortlistThreshold, setShortlistThreshold] = useState(5);
  const [shortlistMode, setShortlistMode] = useState('topN'); // 'topN', 'threshold', or 'date'
  const [summary, setSummary] = useState(null);
  const [selectedRound, setSelectedRound] = useState(roundIndex);
  const [showOnlyEvaluated, setShowOnlyEvaluated] = useState(false);
  const [viewSubmissionModalOpen, setViewSubmissionModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [loadingSubmissionDetails, setLoadingSubmissionDetails] = useState(false);

  useEffect(() => {
    if (hackathonId) {
      fetchLeaderboard();
      checkAutoProgress();
    }
  }, [hackathonId, selectedRound]);

  const checkAutoProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/judge-management/hackathons/${hackathonId}/auto-progress-round2`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.progressed) {
          toast({
            title: 'Round 2 Auto-Progress',
            description: `${data.count} submissions have been automatically moved to Round 2`,
            variant: 'default',
          });
          fetchLeaderboard(); // Refresh data
        }
      }
    } catch (error) {
      console.error('Error checking auto-progress:', error);
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      console.log('🔍 Frontend - Fetching leaderboard for hackathonId:', hackathonId, 'roundIndex:', selectedRound);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/judge-management/hackathons/${hackathonId}/rounds/${selectedRound}/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('🔍 Frontend - Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Frontend - Leaderboard data received:', data);
        
        // Filter to show only evaluated submissions if requested
        let filteredLeaderboard = data.leaderboard || [];
        console.log('🔍 Frontend - Raw leaderboard data:', filteredLeaderboard);
        console.log('🔍 Frontend - Show only evaluated:', showOnlyEvaluated);
        console.log('🔍 Frontend - Summary data:', data.summary);
        
        // Debug: Log each entry's score count
        filteredLeaderboard.forEach((entry, index) => {
          console.log(`🔍 Frontend - Entry ${index}:`, {
            projectTitle: entry.projectTitle,
            scoreCount: entry.scoreCount,
            averageScore: entry.averageScore,
            totalScore: entry.totalScore
          });
        });
        
        if (showOnlyEvaluated) {
          filteredLeaderboard = filteredLeaderboard.filter(entry => entry.scoreCount > 0);
          console.log('🔍 Frontend - Filtered leaderboard (evaluated only):', filteredLeaderboard);
        }
        
        setLeaderboard(filteredLeaderboard);
        setSummary(data.summary);
      } else {
        const errorData = await response.json();
        console.error('🔍 Frontend - Error response:', errorData);
        throw new Error('Failed to fetch leaderboard');
      }
    } catch (error) {
      console.error('🔍 Frontend - Error fetching leaderboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch leaderboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = async (submission) => {
    setSelectedSubmission(submission);
    setViewSubmissionModalOpen(true);
    setLoadingSubmissionDetails(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Fetch detailed submission information
      const response = await fetch(`/api/submission-form/admin/${submission._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const submissionData = await response.json();
        
        // Fetch judge evaluations for this submission
        const evaluationsResponse = await fetch(`/api/scores/submission/${submission._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let evaluations = [];
        if (evaluationsResponse.ok) {
          evaluations = await evaluationsResponse.json();
        }
        
        setSubmissionDetails({
          ...submissionData.submission,
          evaluations
        });
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

  const handleShortlisting = async () => {
    // Validate based on mode
    if (shortlistMode === 'topN' && shortlistCount < 1) {
      toast({
        title: 'Invalid count',
        description: 'Please enter a valid number of submissions to shortlist',
        variant: 'destructive',
      });
      return;
    }

    if (shortlistMode === 'threshold' && (shortlistThreshold < 0 || shortlistThreshold > 10)) {
      toast({
        title: 'Invalid threshold',
        description: 'Please enter a valid score threshold between 0 and 10',
        variant: 'destructive',
      });
      return;
    }

    setShortlisting(true);
    try {
      const token = localStorage.getItem('token');
      const requestBody = shortlistMode === 'topN' 
        ? { shortlistCount, mode: 'topN' }
        : { shortlistThreshold, mode: 'threshold' };

      const response = await fetch(`/api/judge-management/hackathons/${hackathonId}/rounds/${selectedRound}/shortlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Shortlisting successful',
          description: `Successfully shortlisted ${data.shortlistedSubmissions.length} submissions`,
          variant: 'default',
        });
        setShortlistModalOpen(false);
        if (onShortlistingComplete) {
          onShortlistingComplete();
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Shortlisting failed');
      }
    } catch (error) {
      console.error('Error performing shortlisting:', error);
      toast({
        title: 'Shortlisting failed',
        description: error.message || 'Failed to perform shortlisting',
        variant: 'destructive',
      });
    } finally {
      setShortlisting(false);
    }
  };

  const getStatusIcon = (scoreCount) => {
    if (scoreCount > 0) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <Clock className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusText = (scoreCount) => {
    if (scoreCount > 0) {
      return 'Evaluated';
    }
    return 'Pending';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const filteredLeaderboard = showOnlyEvaluated 
    ? leaderboard.filter(entry => entry.scoreCount > 0)
    : leaderboard;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Round {selectedRound + 1} Leaderboard</h2>
            <p className="text-gray-600">Loading leaderboard data...</p>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Round {selectedRound + 1} Leaderboard</h2>
          <p className="text-gray-600">
            {summary ? (
              <>
                {summary.totalSubmissions} total submissions • {summary.evaluatedSubmissions} evaluated • {summary.pendingEvaluations} pending
              </>
            ) : (
              'Leaderboard data'
            )}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Shortlist top performers to advance to Round 2
          </p>
          {summary && summary.evaluatedSubmissions > 0 && (
            <p className="text-sm text-green-600 mt-1">
              ✅ {summary.evaluatedSubmissions} submissions evaluated • Ready for shortlisting
            </p>
          )}
          {summary && summary.evaluatedSubmissions === 0 && (
            <p className="text-sm text-yellow-600 mt-1">
              ⏳ Waiting for judge evaluations to begin shortlisting
            </p>
          )}
          <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600">
              <strong>Shortlisting Process:</strong> 
              1) Judges evaluate Round 1 submissions → 
              2) Scores appear in leaderboard → 
              3) Organizer shortlists top performers → 
              4) Shortlisted teams can submit to Round 2
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={fetchLeaderboard}
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {summary && summary.totalSubmissions > 0 && (
            <Button
              onClick={() => setShortlistModalOpen(true)}
              className={`${
                summary.evaluatedSubmissions > 0 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
              disabled={summary.evaluatedSubmissions === 0}
            >
              <Trophy className="w-4 h-4 mr-2" />
              {summary.evaluatedSubmissions > 0 
                ? 'Shortlist for Round 2' 
                : 'Shortlist (No Evaluations Yet)'
              }
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        {/* Round Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Round:</label>
          <Select value={selectedRound.toString()} onValueChange={(value) => setSelectedRound(parseInt(value))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Round 1</SelectItem>
              <SelectItem value="2">Round 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show Only Evaluated Filter */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlyEvaluated}
              onChange={(e) => setShowOnlyEvaluated(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Show only evaluated</span>
          </label>
          <Button
            onClick={() => setShowOnlyEvaluated(!showOnlyEvaluated)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            Toggle Filter
          </Button>
        </div>

        <div className="text-sm text-gray-500">
          Showing {filteredLeaderboard.length} of {leaderboard.length} submissions
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Total Submissions</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{summary.totalSubmissions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">Evaluated</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{summary.evaluatedSubmissions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-900">Pending</span>
              </div>
              <p className="text-2xl font-bold text-yellow-700">{summary.pendingEvaluations}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-900">Avg Score</span>
              </div>
              <p className="text-2xl font-bold text-purple-700">{summary.averageScore}/10</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-900">Shortlisted</span>
              </div>
              <p className="text-2xl font-bold text-yellow-700">{summary.shortlistedCount || 0}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLeaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {showOnlyEvaluated 
                  ? 'No evaluated submissions found for this round' 
                  : 'No submissions found for this round'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Evaluations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shortlisted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeaderboard.map((entry, index) => (
                    <tr key={entry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index < 3 ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              'bg-orange-500'
                            }`}>
                              {index + 1}
                            </div>
                          ) : (
                            <span className="text-gray-900 font-medium">{entry.rank}</span>
                          )}
                          {index < 5 && (
                            <span className="ml-2 text-xs text-green-600 font-medium">
                              Top Performer
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{entry.teamName}</div>
                          <div className="text-sm text-gray-500">{entry.leaderName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {entry.projectTitle}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {entry.pptFile ? (
                            <FileText className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Award className="w-4 h-4 text-green-600" />
                          )}
                          <span className="text-sm text-gray-600">
                            {entry.pptFile ? 'PPT' : 'Project'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {entry.averageScore > 0 ? `${entry.averageScore}/10` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {entry.scoreCount} evaluation{entry.scoreCount !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(entry.scoreCount)}
                          <span className="text-sm text-gray-600">
                            {getStatusText(entry.scoreCount)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.status === 'shortlisted' ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">Shortlisted</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          onClick={() => handleViewSubmission(entry)}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Submission Modal */}
      <Dialog open={viewSubmissionModalOpen} onOpenChange={setViewSubmissionModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Submission Details
            </DialogTitle>
          </DialogHeader>
          {loadingSubmissionDetails ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading submission details...</span>
            </div>
          ) : submissionDetails ? (
            <div className="space-y-6">
              {/* Submission Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {submissionDetails.projectTitle || submissionDetails.title || 'Untitled Project'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Team:</span>
                        <span className="ml-2 text-gray-900">{submissionDetails.teamName}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Submission Type:</span>
                        <span className="ml-2 text-gray-900">
                          {submissionDetails.pptFile ? 'PPT Presentation' : 'Project Files'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Submitted:</span>
                        <span className="ml-2 text-gray-900">
                          {formatDate(submissionDetails.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {submissionDetails.evaluations?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Evaluations</div>
                  </div>
                </div>
              </div>

              {/* Submission Files */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Submission Files
                </h4>
                <div className="space-y-4">
                  {submissionDetails.pptFile && (
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">PPT Presentation</div>
                          <div className="text-sm text-gray-500">
                            {submissionDetails.pptFile.split('/').pop()}
                          </div>
                        </div>
                      </div>
                      <a
                        href={submissionDetails.pptFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                        View PPT
                      </a>
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
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-700">
                                {(evaluation.judge?.name || evaluation.judge?.email || 'J')[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {evaluation.judge?.name || evaluation.judge?.email || 'Unknown Judge'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {evaluation.judge?.email || 'No email available'}
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No submission details available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Shortlist Modal */}
      <Dialog open={shortlistModalOpen} onOpenChange={setShortlistModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Shortlist for Round 2
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Shortlisting Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shortlisting Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="topN"
                    checked={shortlistMode === 'topN'}
                    onChange={(e) => setShortlistMode(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Top N Projects</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="threshold"
                    checked={shortlistMode === 'threshold'}
                    onChange={(e) => setShortlistMode(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Score Threshold</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="date"
                    checked={shortlistMode === 'date'}
                    onChange={(e) => setShortlistMode(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Round 1 End Date</span>
                </label>
              </div>
            </div>

            {/* Top N Mode */}
            {shortlistMode === 'topN' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of projects to shortlist
                </label>
                <input
                  type="number"
                  min="1"
                  max={leaderboard.length}
                  value={shortlistCount}
                  onChange={(e) => setShortlistCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: {leaderboard.length} projects
                </p>
              </div>
            )}

            {/* Threshold Mode */}
            {shortlistMode === 'threshold' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum score threshold
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={shortlistThreshold}
                  onChange={(e) => setShortlistThreshold(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Projects with average score ≥ {shortlistThreshold}/10 will be shortlisted
                </p>
              </div>
            )}

            {/* Date Mode */}
            {shortlistMode === 'date' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shortlist all submissions after Round 1 ends
                </label>
                <div className="bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-700">
                    This will shortlist all submissions that were submitted before the Round 1 end date.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Useful when you want to advance all teams that participated in Round 1.
                  </p>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  {shortlistMode === 'topN' 
                    ? `This will shortlist the top ${shortlistCount} projects to advance to Round 2.`
                    : shortlistMode === 'threshold'
                    ? `This will shortlist all projects with average score ≥ ${shortlistThreshold}/10 to advance to Round 2.`
                    : `This will shortlist all submissions that participated in Round 1 to advance to Round 2.`
                  }
                </span>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">What happens after shortlisting?</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Shortlisted teams will be notified</li>
                    <li>• They can submit new projects for Round 2</li>
                    <li>• Only shortlisted teams can access Round 2</li>
                    <li>• Auto-progression occurs when Round 2 starts</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {summary && summary.evaluatedSubmissions === 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <div className="text-sm text-orange-800">
                    <p className="font-medium">No evaluations yet</p>
                    <p className="text-xs mt-1">
                      You can still shortlist submissions manually, but it's recommended to wait for judge evaluations for better decision-making.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShortlistModalOpen(false)}
                disabled={shortlisting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleShortlisting}
                disabled={shortlisting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {shortlisting ? 'Shortlisting...' : 'Shortlist Projects'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 