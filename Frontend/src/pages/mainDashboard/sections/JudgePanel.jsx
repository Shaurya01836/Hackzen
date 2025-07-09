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
  const [hackathons, setHackathons] = useState([]);
  const [loadingHackathons, setLoadingHackathons] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const token = localStorage.getItem("token");
const res = await fetch("http://localhost:3000/api/users/me/judge-hackathons", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHackathons(data);
      } catch (err) {
        console.error("Error fetching judge hackathons", err);
      } finally {
        setLoadingHackathons(false);
      }
    };

    fetchHackathons();
  }, []);

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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Trophy className="h-5 w-5 text-blue-600" />} label="Hackathons" value={judgeData.totalHackathons} />
        <StatCard icon={<FileText className="h-5 w-5 text-green-600" />} label="Submissions" value={judgeData.totalSubmissions} />
        <StatCard icon={<Star className="h-5 w-5 text-yellow-600" />} label="Avg Rating" value={Number(judgeData.averageRating).toFixed(2)} />
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

      {/* Hackathons You're Judging */}
      <h2 className="text-xl font-semibold mt-12 mb-4">Hackathons You’re Judging</h2>
      {loadingHackathons ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-52" />
          ))}
        </div>
      ) : hackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hackathons.map((hackathon) => (
            <Card
              key={hackathon._id}
              className="relative group bg-white/90 border border-indigo-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() =>
                navigate(`/dashboard/explore-hackathons?hackathon=${hackathon._id}&title=${encodeURIComponent(hackathon.name || hackathon.title)}&source=judge`)
              }
            >
              <div className="h-32 w-full bg-indigo-50 flex items-center justify-center overflow-hidden">
                <img
                  src={
                    hackathon.images?.logo?.url ||
                    hackathon.images?.banner?.url ||
                    "/assets/default-banner.png"
                  }
                  alt={hackathon.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="px-4 pt-3 pb-1">
                <CardTitle className="text-lg font-semibold text-indigo-700 line-clamp-1 group-hover:text-indigo-900 transition">
                  {hackathon.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-2 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    <Trophy className="inline w-4 h-4 mr-1" />
                    {hackathon.prize}
                  </span>
                  <span>
                    <Star className="inline w-4 h-4 mr-1" />
                    {hackathon.difficulty}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You’re not assigned to judge any hackathons yet.</p>
      )}
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
