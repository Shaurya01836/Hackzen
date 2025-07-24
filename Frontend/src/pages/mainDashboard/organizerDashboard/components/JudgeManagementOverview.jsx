import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/CommonUI/card";
import { Users, Globe, Building, Shield, Target } from "lucide-react";
import { Button } from "../../../../components/CommonUI/button";
import { Badge } from "../../../../components/CommonUI/badge";

export default function JudgeManagementOverview({ summary, hackathon, judgedSubmissions, fetchJudged }) {
  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Judges</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
            <p className="text-xs text-muted-foreground">
              {summary.active} active, {summary.pending} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Judges</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.platform}</div>
            <p className="text-xs text-muted-foreground">Can judge general PS</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sponsor Judges</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.sponsor}</div>
            <p className="text-xs text-muted-foreground">Company-specific PS only</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hybrid Judges</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.hybrid}</div>
            <p className="text-xs text-muted-foreground">Can judge all PS types</p>
          </CardContent>
        </Card>
      </div>
      {/* Problem Statements Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Problem Statements Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hackathon?.problemStatements?.map((ps, index) => (
              <div key={index} className="p-4 border rounded-lg bg-white">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={ps.type === "sponsored" ? "default" : "secondary"}>
                    {ps.type === "sponsored" ? "Sponsored" : "General"}
                  </Badge>
                  {ps.type === "sponsored" && (
                    <span className="text-sm text-gray-600">{ps.sponsorCompany}</span>
                  )}
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {typeof ps === "object" ? ps.statement : ps}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Judged Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Judged Submissions</CardTitle>
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={fetchJudged}>Refresh</Button>
          </div>
        </CardHeader>
        <CardContent>
          {judgedSubmissions.length === 0 ? (
            <p className="text-gray-500">No submissions have been judged yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Team Name</th>
                    <th className="p-2 border">Problem Statement</th>
                    <th className="p-2 border">Judge</th>
                    <th className="p-2 border">Avg Score</th>
                    <th className="p-2 border">Scores</th>
                    <th className="p-2 border">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {judgedSubmissions.map((score) => {
                    let avgScore = "N/A";
                    if (score.scores) {
                      const vals = Object.values(score.scores);
                      if (vals.length > 0) {
                        avgScore = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
                      }
                    }
                    return (
                      <tr key={score._id} className="border-b">
                        <td className="p-2 border">
                          {score.team?.name || (score.team?.members ? score.team.members.map(m => m.name || m.email).join(", ") : "-")}
                        </td>
                        <td className="p-2 border">
                          {typeof score.problemStatement === "object" ? score.problemStatement?.statement || "-" : score.problemStatement || "-"}
                        </td>
                        <td className="p-2 border">{score.judge?.name || score.judge?.email || "-"}</td>
                        <td className="p-2 border">{avgScore}</td>
                        <td className="p-2 border">
                          {score.scores && Object.entries(score.scores).map(([k, v]) => (
                            <div key={k}>{k}: {v}</div>
                          ))}
                        </td>
                        <td className="p-2 border">{score.feedback || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
} 