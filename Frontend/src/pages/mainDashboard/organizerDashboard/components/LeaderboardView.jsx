import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/CommonUI/card";
import { Button } from "../../../../components/CommonUI/button";
import { Trophy, Award, Users, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "../../../../hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/DashboardUI/dialog";

export default function LeaderboardView({ hackathonId, roundIndex = 1, onShortlistingComplete }) {
  const { toast } = useToast();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shortlisting, setShortlisting] = useState(false);
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [shortlistCount, setShortlistCount] = useState(10);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (hackathonId) {
      fetchLeaderboard();
    }
  }, [hackathonId, roundIndex]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/judge-management/hackathons/${hackathonId}/rounds/${roundIndex}/leaderboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
        setSummary(data.summary);
      } else {
        throw new Error('Failed to fetch leaderboard');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch leaderboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShortlisting = async () => {
    if (shortlistCount < 1) {
      toast({
        title: 'Invalid count',
        description: 'Please enter a valid number of submissions to shortlist',
        variant: 'destructive',
      });
      return;
    }

    setShortlisting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/judge-management/hackathons/${hackathonId}/rounds/${roundIndex}/shortlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ shortlistCount })
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Round {roundIndex + 1} Leaderboard</h2>
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
          <h2 className="text-2xl font-bold text-gray-900">Round {roundIndex + 1} Leaderboard</h2>
          <p className="text-gray-600">
            {summary ? (
              <>
                {summary.totalSubmissions} total submissions • {summary.evaluatedSubmissions} evaluated • {summary.pendingEvaluations} pending
              </>
            ) : (
              'Leaderboard data'
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {summary && summary.evaluatedSubmissions > 0 && (
            <Button
              onClick={() => setShortlistModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Shortlist Top Projects
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          {leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No submissions found for this round</p>
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
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboard.map((entry, index) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(entry.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shortlist Modal */}
      <Dialog open={shortlistModalOpen} onOpenChange={setShortlistModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Shortlist Top Projects
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  This will shortlist the top {shortlistCount} projects based on their scores.
                </span>
              </div>
            </div>
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