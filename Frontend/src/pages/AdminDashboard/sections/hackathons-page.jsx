"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import {
  RCard,
  RCardContent,
  RCardHeader,
  RCardTitle,
} from "../../../components/CommonUI/RippleCard";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import { Input } from "../../../components/CommonUI/input";
import {
  Plus,
  Search,
  Calendar,
  Users,
  Trophy,
  Eye,
  FolderCode,
  Download,
  User,
  Shuffle,
} from "lucide-react";
import CreateHackathon from "../../mainDashboard/sections/Create-hackathon";
import { ProjectDetail } from "../../../components/CommonUI/ProjectDetail";
import { useNavigate } from "react-router-dom";

export function HackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/hackathons");
        setHackathons(res.data);
      } catch {
        setError("Failed to fetch hackathons");
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  const filteredHackathons = hackathons.filter(
    (hackathon) =>
      hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hackathon.organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) return <p className="text-gray-700">Loading hackathons...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 min-h-screen">
      {!showCreateForm ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              Hackathons Management
            </h1>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Hackathon
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
            <Input
              placeholder="Search hackathons by title or organizer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-purple-500/20 text-black placeholder-gray-600"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredHackathons.map((hackathon) => (
              <RCard
                key={hackathon._id}
                className="w-full flex flex-col overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Thumbnail */}
                <div className="relative h-40 w-full">
                  <img
                    src={
                      hackathon.images?.logo?.url ||
                      hackathon.images?.banner?.url ||
                      "/assets/default-banner.png"
                    }
                    alt={hackathon.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Prize Pool Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-yellow-400 text-yellow-900 font-semibold shadow-md">
                      <Trophy className="w-3 h-3 mr-1" />
                      {hackathon.prizePool?.amount
                        ? `${hackathon.prizePool.amount} ${hackathon.prizePool.currency}`
                        : "N/A"}
                    </Badge>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  {/* Title */}
                  <h3 className="text-md font-semibold text-indigo-700 leading-tight line-clamp-2 h-10">
                    {hackathon.title}
                  </h3>
                  {/* Organizer */}
                  <p className="text-xs text-gray-500 mb-1">
                    by {hackathon.organizer?.name || "Unknown"}
                  </p>
                  {/* Date */}
                  <div className="flex items-center text-gray-700 text-xs mb-2">
                    <Calendar className="w-4 h-4 mr-1 text-purple-500" />
                    {formatDate(hackathon.startDate)} — {formatDate(hackathon.endDate)}
                  </div>
                  {/* Details Row */}
                  <div className="flex flex-wrap gap-2 text-xs text-gray-700 mb-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      {hackathon.participants?.length || 0} participants
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      {hackathon.prizePool?.amount
                        ? `${hackathon.prizePool.amount} ${hackathon.prizePool.currency}`
                        : "N/A"} pool
                    </span>
                    <span className="flex items-center gap-1">
                      <FolderCode className="w-4 h-4 text-yellow-500" />
                      {hackathon.submissions?.length || 0} submissions received
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-auto text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    onClick={() => navigate(`/admin/hackathons/${hackathon._id}/submissions`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Submissions
                  </Button>
                </div>
              </RCard>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => setShowCreateForm(false)}
            className="flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-black mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <CreateHackathon
            onBack={() => setShowCreateForm(false)}
            isAdminCreate={true}
            onSave={() => setShowCreateForm(false)}
          />
        </div>
      )}
    </div>
  );
}
