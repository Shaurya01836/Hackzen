"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/AdminCard";
import { Button } from "./ui/AdminButton";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Plus, Search, Calendar, Users, Trophy, Eye } from "lucide-react";
import { CreateHackathonForm } from "./CreateHackathon";

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

  if (loading) return <p className="text-white">Loading hackathons...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const getStatusColor = (status) => {
    switch (status) {
      case "Live":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "Closed":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const handleCreateHackathon = (hackathonData) => {
    console.log("Creating hackathon:", hackathonData);
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      {!showCreateForm ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">
              Hackathons Management
            </h1>
            <Button
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Hackathon
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search hackathons by title or organizer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-purple-500/20 text-white placeholder-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Hackathons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHackathons.map((hackathon) => (
              <Card
                key={hackathon._id}
                className="bg-black/20 backdrop-blur-xl border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">
                        {hackathon.title}
                      </CardTitle>
                      <p className="text-gray-400 text-sm">
                        by {hackathon.organizer?.name || "Unknown"}
                      </p>
                    </div>
                    <Badge className={getStatusColor(hackathon.status)}>
                      {hackathon.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-gray-300 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                    {hackathon.startDate} - {hackathon.endDate}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-300 text-sm">
                      <Users className="w-4 h-4 mr-2 text-blue-400" />
                      {hackathon.participants} participants
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                      {hackathon.prize}
                    </div>
                  </div>

                  <div className="text-gray-300 text-sm">
                    <span className="text-green-400 font-semibold">
                      {hackathon.submissions}
                    </span>{" "}
                    submissions received
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-purple-500/20 text-white hover:bg-purple-500/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <CreateHackathonForm
          onBack={() => setShowCreateForm(false)}
          onSave={handleCreateHackathon}
        />
      )}
    </div>
  );
}
