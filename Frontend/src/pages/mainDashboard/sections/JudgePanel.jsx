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
import { Gavel, Trophy, FileText, Star } from "lucide-react";
import {
  ACard,
  ACardContent,
} from "../../../components/DashboardUI/AnimatedCard";
import { HackathonCard } from "../../../components/DashboardUI/HackathonCard";
import { useAuth } from "../../../context/AuthContext";

export default function JudgePanel() {
  const [judgeData, setJudgeData] = useState({
    totalHackathons: 0,
    totalSubmissions: 0,
    averageRating: 0,
    completedJudgments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hackathons, setHackathons] = useState([]);
  const [loadingHackathons, setLoadingHackathons] = useState(true);
  const [pendingInvites, setPendingInvites] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:3000/api/users/me/judge-hackathons",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  // Fetch pending judge invites
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3000/api/role-invites/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setPendingInvites(data || []));
  }, [token]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
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
    <div className="p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Judge Panel</h1>
          <p className="text-gray-600">
            Manage your hackathon judgments and reviews
          </p>
        </div>
      </div>

      {/* Pending Judge Invites */}
      {pendingInvites.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Pending Judge Invites</h2>
          {pendingInvites.map((invite) => (
            <div key={invite._id} className="p-4 border rounded mb-2 flex justify-between items-center bg-yellow-50">
              <div>
                <b>{invite.hackathon?.title}</b> — {invite.role}
              </div>
              <Button
                onClick={() => navigate(`/invite/role?token=${invite.token}`)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                View Invite
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {judgeData.totalHackathons}
                </p>
                <p className="text-sm text-gray-500">Hackathons</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {judgeData.totalSubmissions}
                </p>
                <p className="text-sm text-gray-500">Submissions</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Number(judgeData.averageRating).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Avg Rating</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Gavel className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {judgeData.completedJudgments}
                </p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
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
            <Button
              className="w-full"
              onClick={() => navigate("/judge/active")}
            >
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
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/judge/history")}
            >
              View History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Hackathons You're Judging */}
      <h2 className="text-xl font-semibold mt-12 mb-4">
        Hackathons You're Judging
      </h2>
      {loadingHackathons ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse h-52" />
          ))}
        </div>
      ) : hackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hackathons.map((hackathon) => (
            <HackathonCard
              key={hackathon._id}
              hackathon={hackathon}
              onClick={() =>
                navigate(
                  `/judge/hackathon/${hackathon._id}/gallery`,
                  { state: { hackathon } }
                )
              }
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          You're not assigned to judge any hackathons yet.
        </p>
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
