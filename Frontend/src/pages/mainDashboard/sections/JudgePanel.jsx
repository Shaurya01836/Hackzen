"use client";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { Button } from "../../../components/CommonUI/button";
import {
  Gavel,
  Trophy,
  FileText,
  Star,
} from "lucide-react";

export default function JudgePanel({ onBack }) {
  const [judgeData, setJudgeData] = useState({
    totalHackathons: 0,
    totalSubmissions: 0,
    averageRating: 0,
    completedJudgments: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJudgeData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:3000/api/users/judge-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setJudgeData(data);
        }
      } catch (err) {
        console.error("Error loading judge data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJudgeData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <h1 className="text-2xl font-bold">Judge Panel</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Judge Panel</h1>
          <p className="text-gray-600">
            Manage your hackathon judgments and reviews
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Trophy className="h-5 w-5 text-blue-600" />} label="Hackathons" value={judgeData.totalHackathons} />
        <StatCard icon={<FileText className="h-5 w-5 text-green-600" />} label="Submissions" value={judgeData.totalSubmissions} />
        <StatCard icon={<Star className="h-5 w-5 text-yellow-600" />} label="Avg Rating" value={judgeData.averageRating.toFixed(1)} />
        <StatCard icon={<Gavel className="h-5 w-5 text-purple-600" />} label="Completed" value={judgeData.completedJudgments} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Active Judgments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Review and score submissions for active hackathons you're judging.
            </p>
            <Button className="w-full" onClick={() => navigate("/judge/active")}>
              View Active Judgments
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My Judgments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              View your completed judgments and review history.
            </p>
            <Button variant="outline" className="w-full" onClick={() => navigate("/judge/history")}>
              View History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-600">{label}</span>
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
