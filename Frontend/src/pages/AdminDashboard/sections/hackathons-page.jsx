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
} from "lucide-react";
import { CreateHackathon } from "./CreateHackathon";

export function HackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/hackathons");
        setHackathons(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-orange-500 text-white border-orange-500/30";
      case "ended":
        return "bg-red-600 text-white border-red-500/30";
      case "ongoing":
        return "bg-green-500 text-white border-green-500/30";
      default:
        return "bg-gray-500 text-white border-gray-500/30";
    }
  };

  const handleCreateHackathon = (hackathonData) => {
    console.log("Creating hackathon:", hackathonData);
    setShowCreateForm(false);
  };

  if (loading) return <p className="text-gray-700">Loading hackathons...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
            <Input
              placeholder="Search hackathons by title or organizer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-purple-500/20 text-black placeholder-gray-600"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((hackathon) => (
              <RCard key={hackathon._id}>
                <RCardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <RCardTitle className="text-gray-800 text-lg mb-2 transition-colors">
                        {hackathon.title}
                      </RCardTitle>
                      <p className="text-gray-600 text-sm">
                        by {hackathon.organizer?.name || "Unknown"}
                      </p>
                    </div>
                    <Badge className={getStatusColor(hackathon.status)}>
                      {hackathon.status}
                    </Badge>
                  </div>
                </RCardHeader>
                <RCardContent className="space-y-4">
                  <div className="flex items-center text-gray-700 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                    {formatDate(hackathon.startDate)} — {formatDate(hackathon.endDate)}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-700 text-sm">
                      <Users className="w-4 h-4 mr-2 text-blue-500" />
                      {hackathon.participants?.length || 0} participants
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                      {hackathon.prizePool?.amount
                        ? `${hackathon.prizePool.amount} ${hackathon.prizePool.currency}`
                        : "N/A"}{" "}
                      pool
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm">
                    <FolderCode className="w-4 h-4 mr-2 text-yellow-500" />
                    {hackathon.submissions?.length || 0} submissions received
                  </div>
                </RCardContent>
              </RCard>
            ))}
          </div>
        </>
      ) : (
        <CreateHackathon
          onBack={() => setShowCreateForm(false)}
          onSave={handleCreateHackathon}
        />
      )}
    </div>
  );
}
