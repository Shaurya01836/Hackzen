import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { Badge } from "./badge";
import { Skeleton } from "../DashboardUI/skeleton";

const CRITERIA = [
  { key: "innovation", label: "Innovation" },
  { key: "impact", label: "Impact" },
  { key: "technicality", label: "Technicality" },
  { key: "presentation", label: "Presentation" },
];

export default function ProjectScoresList({ projectId }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    setError("");
    fetch(`/api/scores/project/${projectId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setScores(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load scores");
        setLoading(false);
      });
  }, [projectId]);

  // Calculate average score (across all criteria and judges)
  const averageScore =
    scores.length > 0
      ? (
          scores.reduce((sum, s) => {
            const total = CRITERIA.reduce((acc, c) => acc + (s.scores?.[c.key] || 0), 0);
            return sum + total / CRITERIA.length;
          }, 0) / scores.length
        ).toFixed(2)
      : null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span>Judging Scores</span>
          {averageScore && (
            <Badge className="bg-yellow-500 text-white">Avg: {averageScore}/10</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : scores.length === 0 ? (
          <div className="text-gray-500">No scores yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Judge</th>
                  {CRITERIA.map((c) => (
                    <th key={c.key} className="p-2 border">{c.label}</th>
                  ))}
                  <th className="p-2 border">Feedback</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score) => (
                  <tr key={score._id} className="border-b">
                    <td className="p-2 border">
                      {score.judge?.name || score.judge?.email || "-"}
                    </td>
                    {CRITERIA.map((c) => (
                      <td key={c.key} className="p-2 border text-center">
                        {score.scores?.[c.key] ?? "-"}
                      </td>
                    ))}
                    <td className="p-2 border">{score.feedback || "-"}</td>
                    <td className="p-2 border">
                      {score.createdAt ? new Date(score.createdAt).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 