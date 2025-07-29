import React from "react";
import { Button } from "../../../../components/CommonUI/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/CommonUI/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/CommonUI/select";
import { Badge } from "../../../../components/CommonUI/badge";
import { 
  Gavel, 
  TrendingUp, 
  Filter,
  Download,
  RefreshCw,
  FileText,
  Users,
  Trophy,
  Star
} from "lucide-react";

export default function JudgedSubmissionsView({
  judgedSubmissions = [],
  hackathon,
  fetchJudged,
  selectedRound = 'All',
  setSelectedRound = () => {},
  selectedProblemStatement = 'All',
  setSelectedProblemStatement = () => {},
}) {
  // Helper function to extract problem statement text
  const getProblemStatementText = (ps) => {
    if (typeof ps === 'string') return ps;
    if (typeof ps === 'object' && ps.statement) return ps.statement;
    return String(ps);
  };

  // Helper function to check if a submission matches the selected problem statement
  const hasSubmittedToProblemStatement = (submission, problemStatement) => {
    if (!submission.problemStatement) return false;
    return getProblemStatementText(submission.problemStatement) === getProblemStatementText(problemStatement);
  };

  // Helper function to get round from submission
  const getSubmissionRound = (submission) => {
    // First try to use the roundIndex field if available
    if (submission.roundIndex !== null && submission.roundIndex !== undefined) {
      return submission.roundIndex + 1; // Convert 0-based index to 1-based round number
    }
    
    // Fallback: Determine round based on submission data and hackathon configuration
    if (hackathon?.rounds && hackathon.rounds.length > 0) {
      // Try to find which round this submission belongs to based on round types
      for (let i = 0; i < hackathon.rounds.length; i++) {
        const roundType = hackathon.rounds[i].type || 'project';
        
        if (roundType === 'ppt' && submission.pptFile) {
          return i + 1;
        } else if (roundType === 'project' && submission.projectId && !submission.pptFile) {
          return i + 1;
        } else if (roundType === 'both' && submission.roundIndex === i) {
          return i + 1;
        }
      }
    }
    
    // Final fallback: Use submission data
    if (submission.pptFile) return 1; // PPT submissions are usually Round 1
    return 2; // Project submissions are usually Round 2
  };

  // Filtering logic for judged submissions
  const filteredSubmissions = judgedSubmissions.filter(sub => {
    const submissionRound = getSubmissionRound(sub);
    const roundMatch = selectedRound === 'All' || 
      (selectedRound === 'Round 1' && submissionRound === 1) ||
      (selectedRound === 'Round 2' && submissionRound === 2);
    
    const psMatch = selectedProblemStatement === 'All' || 
      hasSubmittedToProblemStatement(sub, selectedProblemStatement);
    
    return roundMatch && psMatch;
  });

  // Get all problem statements from hackathon (including those with no submissions)
  const allProblemStatements = hackathon?.problemStatements || [];

  // Also get problem statements from judged submissions
  const submissionProblemStatements = judgedSubmissions
    .map(sub => sub.problemStatement)
    .filter(ps => ps) // Remove null/undefined
    .map(ps => getProblemStatementText(ps))
    .filter(ps => ps && ps.trim()); // Remove empty strings

  // Process and deduplicate problem statements
  const uniqueProblemStatements = [...new Set([
    ...allProblemStatements.map(ps => getProblemStatementText(ps)),
    ...submissionProblemStatements
  ])].filter(ps => ps && ps.trim()); // Remove empty strings

  // Calculate statistics
  const totalSubmissions = judgedSubmissions.length;
  const round1Submissions = judgedSubmissions.filter(s => getSubmissionRound(s) === 1).length;
  const round2Submissions = judgedSubmissions.filter(s => getSubmissionRound(s) === 2).length;
  const filteredSubmissionsCount = filteredSubmissions.length;

  // Get problem statement statistics
  const problemStatementStats = {};
  judgedSubmissions.forEach(sub => {
    if (sub.problemStatement) {
      const ps = getProblemStatementText(sub.problemStatement);
      if (!problemStatementStats[ps]) {
        problemStatementStats[ps] = { total: 0, round1: 0, round2: 0 };
      }
      problemStatementStats[ps].total++;
      const round = getSubmissionRound(sub);
      if (round === 1) {
        problemStatementStats[ps].round1++;
      } else if (round === 2) {
        problemStatementStats[ps].round2++;
      }
    }
  });

  // Calculate problem statement counts based on current round filter
  const getProblemStatementCount = (ps) => {
    if (selectedRound === 'All') {
      return problemStatementStats[ps]?.total || 0;
    } else if (selectedRound === 'Round 1') {
      return problemStatementStats[ps]?.round1 || 0;
    } else if (selectedRound === 'Round 2') {
      return problemStatementStats[ps]?.round2 || 0;
    }
    return 0;
  };

  // Calculate average score for filtered submissions
  const averageScore = filteredSubmissions.length > 0 
    ? (filteredSubmissions.reduce((sum, sub) => {
        if (sub.scores) {
          const vals = Object.values(sub.scores);
          if (vals.length > 0) {
            return sum + (vals.reduce((a, b) => a + b, 0) / vals.length);
          }
        }
        return sum;
      }, 0) / filteredSubmissions.length).toFixed(2)
    : "N/A";

  return (
    <Card className="shadow-none hover:shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Gavel className="w-6 h-6 text-purple-600" />
            </div>
            Judged Submissions
            
          </CardTitle>
          
          {/* Filters */}
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            
            {/* Round Filter */}
            <span className="text-sm font-medium text-gray-500">Round:</span>
            <Select value={selectedRound} onValueChange={setSelectedRound}>
              <SelectTrigger className="w-40 bg-white">
                <SelectValue placeholder="All Rounds" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Rounds ({totalSubmissions})</SelectItem>
                <SelectItem value="Round 1">Round 1 ({round1Submissions})</SelectItem>
                <SelectItem value="Round 2">Round 2 ({round2Submissions})</SelectItem>
              </SelectContent>
            </Select>

            {/* Problem Statement Filter */}
            <span className="text-sm font-medium text-gray-500">Problem Statement:</span>
            <Select value={selectedProblemStatement} onValueChange={setSelectedProblemStatement}>
              <SelectTrigger className="w-64 bg-white">
                <SelectValue placeholder="All Problem Statements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Problem Statements ({filteredSubmissionsCount})</SelectItem>
                {uniqueProblemStatements.map((ps, idx) => (
                  <SelectItem key={idx} value={ps}>
                    {ps.length > 50 ? ps.substring(0, 50) + "..." : ps} ({getProblemStatementCount(ps)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(selectedRound !== 'All' || selectedProblemStatement !== 'All') && (
              <Button
                variant="outline"
                size="default"
                onClick={() => {
                  setSelectedRound('All');
                  setSelectedProblemStatement('All');
                }}
                className="text-gray-700 hover:text-gray-900 border-gray-400 hover:border-gray-500 bg-white hover:bg-gray-50 px-10 py-2 font-medium"
              >
                Clear Filters
              </Button>
            )}

            {/* Export Button */}
            <Button
              variant="outline"
              size="default"
              onClick={() => {
                // Export judged submissions functionality
                const csvContent = [
                  ['Team Name', 'Problem Statement', 'Judge', 'Average Score', 'Round', 'Feedback'],
                  ...filteredSubmissions.map(s => {
                    let avgScore = "N/A";
                    if (s.scores) {
                      const vals = Object.values(s.scores);
                      if (vals.length > 0) {
                        avgScore = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
                      }
                    }
                    return [
                      s.team?.name || (s.team?.members ? s.team.members.map(m => m.name || m.email).join(", ") : "Unknown Team"),
                      getProblemStatementText(s.problemStatement) || "N/A",
                      s.judge?.name || s.judge?.email || "Unknown Judge",
                      avgScore,
                      `Round ${getSubmissionRound(s)}`,
                      s.feedback || "No feedback provided"
                    ];
                  })
                ].map(row => row.join(',')).join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `judged-submissions-${selectedRound === 'All' ? 'all' : selectedRound.toLowerCase()}-${selectedProblemStatement === 'All' ? 'all' : 'filtered'}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
              className="text-gray-700 hover:text-gray-900 border-gray-400 hover:border-gray-500 bg-white hover:bg-gray-50 px-4 py-1 font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

        
            
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-100 rounded-full mb-4 w-20 h-20 flex items-center justify-center mx-auto">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Submissions Judged Yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Submissions will appear here once judges start evaluating projects. 
              Make sure judges are assigned to teams and problem statements.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
              <Card className="overflow-hidden">
                <CardContent className="p-6 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <Gavel className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{filteredSubmissionsCount}</div>
                      <div className="text-sm text-gray-500">
                        {selectedRound !== 'All' || selectedProblemStatement !== 'All' ? 'Filtered Submissions' : 'Total Judged'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-6 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{averageScore}</div>
                      <div className="text-sm text-gray-500">Average Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-6 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {new Set(filteredSubmissions.map(s => s.judge?.email || s.judge?.name)).size}
                      </div>
                      <div className="text-sm text-gray-500">Active Judges</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-6 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-xl">
                      <Star className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {filteredSubmissions.filter(s => s.feedback && s.feedback.trim()).length}
                      </div>
                      <div className="text-sm text-gray-500">With Feedback</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submissions Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Team Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Problem Statement
                      </th>
                      {selectedRound !== 'All' && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Round
                        </th>
                      )}
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Judge
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Avg Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Detailed Scores
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Feedback
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubmissions.map((score, index) => {
                      let avgScore = "N/A";
                      if (score.scores) {
                        const vals = Object.values(score.scores);
                        if (vals.length > 0) {
                          avgScore = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
                        }
                      }
                      return (
                        <tr key={score._id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                {(score.team?.name || 'T')[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {score.team?.name || (score.team?.members ? score.team.members.map(m => m.name || m.email).join(", ") : "Unknown Team")}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {getProblemStatementText(score.problemStatement) || "N/A"}
                            </div>
                          </td>
                          {selectedRound !== 'All' && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                getSubmissionRound(score) === 1 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                Round {getSubmissionRound(score)}
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-xs mr-2">
                                {(score.judge?.name || score.judge?.email || 'J')[0].toUpperCase()}
                              </div>
                              <div className="text-sm text-gray-900">
                                {score.judge?.name || score.judge?.email || "Unknown Judge"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                              <span className="text-sm font-semibold text-gray-900">
                                {avgScore}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {score.scores && Object.entries(score.scores).map(([k, v]) => (
                                <div key={k} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded text-xs">
                                  <span className="text-gray-600">{k}</span>
                                  <span className="font-semibold text-gray-900">{v}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 max-w-xs">
                              {score.feedback ? (
                                <div className="bg-blue-50 p-2 rounded text-xs">
                                  {score.feedback}
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">No feedback provided</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 