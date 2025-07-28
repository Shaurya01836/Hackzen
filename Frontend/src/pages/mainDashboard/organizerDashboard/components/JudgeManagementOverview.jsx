import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/CommonUI/card";
import { Users, Globe, Building, Shield, Target, FileText, Gavel, Trophy, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "../../../../components/CommonUI/button";
import { Badge } from "../../../../components/CommonUI/badge";

export default function JudgeManagementOverview({ summary, hackathon, judgedSubmissions, fetchJudged }) {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Judge Management Overview</h2>
        <p className="text-gray-600">
          Comprehensive view of judge assignments, problem statements, and evaluation progress
        </p>
      </div>

      {/* Enhanced Summary Cards */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-900">
                    {summary.total}
                  </p>
                  <p className="text-sm font-medium text-blue-700">Total Judges</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {summary.active} active, {summary.pending} pending
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6 pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600 rounded-xl">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-900">
                    {summary.platform}
                  </p>
                  <p className="text-sm font-medium text-green-700">Platform Judges</p>
                  <p className="text-xs text-green-600 mt-1">Can judge general PS</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6 pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-600 rounded-xl">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-900">
                    {summary.sponsor}
                  </p>
                  <p className="text-sm font-medium text-orange-700">Sponsor Judges</p>
                  <p className="text-xs text-orange-600 mt-1">Company-specific PS only</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none hover:shadow-none border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600 rounded-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-900">
                    {summary.hybrid}
                  </p>
                  <p className="text-sm font-medium text-purple-700">Hybrid Judges</p>
                  <p className="text-xs text-purple-600 mt-1">Can judge all PS types</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Problem Statements Overview */}
      <section>
        <Card className="shadow-none hover:shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
            
              Problem Statements Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {hackathon?.problemStatements && hackathon.problemStatements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hackathon.problemStatements.map((ps, index) => (
                  <div key={index} className="p-6 border-0 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-indigo-100 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <Badge 
                        variant={ps.type === "sponsored" ? "default" : "secondary"}
                        className={ps.type === "sponsored" ? "bg-green-100 text-green-700 border-green-200" : "bg-blue-100 text-blue-700 border-blue-200"}
                      >
                        {ps.type === "sponsored" ? "Sponsored" : "General"}
                      </Badge>
                      {ps.type === "sponsored" && ps.sponsorCompany && (
                        <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full">
                          {ps.sponsorCompany}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                      {typeof ps === "object" ? ps.statement : ps}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-100 rounded-full mb-4 w-16 h-16 flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No problem statements added yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Enhanced Judged Submissions */}
      <section>
        <Card className="shadow-none hover:shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gavel className="w-6 h-6 text-purple-600" />
                </div>
                Judged Submissions
                {judgedSubmissions.length > 0 && (
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                    {judgedSubmissions.length} evaluated
                  </Badge>
                )}
              </CardTitle>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={fetchJudged}
                className="border-gray-300 hover:bg-gray-50 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {judgedSubmissions.length === 0 ? (
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
                      {judgedSubmissions.map((score, index) => {
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
                                {typeof score.problemStatement === "object" 
                                  ? score.problemStatement?.statement || "N/A" 
                                  : score.problemStatement || "N/A"}
                              </div>
                            </td>
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
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
