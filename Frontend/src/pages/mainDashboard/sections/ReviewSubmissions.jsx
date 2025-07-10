"use client"
import {
  ArrowLeft,
  Eye,
  Star,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  Trophy,
  BarChart3
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../../components/CommonUI/card"
import {
  ACard,
  ACardContent,
  ACardDescription,
  ACardHeader,
  ACardTitle
} from "../../../components/DashboardUI/AnimatedCard"
import { Button } from "../../../components/CommonUI/button"
import { Badge } from "../../../components/CommonUI/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/DashboardUI/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/CommonUI/tabs"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ReviewSubmissions() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/hackathons/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHackathons(data);
      } catch {
        setHackathons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHackathons();
  }, []);

  const handleCardClick = (hackathon) => {
    navigate(
      `/dashboard/explore-hackathons?hackathon=${hackathon._id}&title=${encodeURIComponent(hackathon.title)}`,
      { state: { defaultTab: "projects" } }
    );
  };

  const renderHackathonCard = (hackathon) => {
    const registrationDeadline = new Date(hackathon.registrationDeadline);
    const today = new Date();
    const daysLeft = Math.ceil(
      (registrationDeadline - today) / (1000 * 60 * 60 * 24)
    );
    const deadlineLabel = isNaN(daysLeft)
      ? "TBA"
      : daysLeft > 0
      ? `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`
      : "Closed";
    return (
      <Card
        key={hackathon._id}
        className="w-full max-w-xs flex flex-col overflow-hidden cursor-pointer rounded-xl transition-transform duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
        onClick={() => handleCardClick(hackathon)}
      >
        {/* Thumbnail with prize badge */}
        <div className="relative h-40 w-full">
          <img
            src={
              hackathon.images?.logo?.url ||
              hackathon.images?.banner?.url ||
              "/assets/default-banner.png"
            }
            alt={hackathon.title}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          {/* Prize Pool Badge */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-400 text-yellow-900 font-semibold shadow-md">
              <Trophy className="w-3 h-3 mr-1" />
              {hackathon.prizePool?.amount
                ? `$${hackathon.prizePool.amount.toLocaleString()}`
                : "TBA"}
            </Badge>
          </div>
        </div>
        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          {/* Title */}
          <h3 className="text-md font-semibold text-indigo-700 leading-tight line-clamp-2 h-10">
            {hackathon.title}
          </h3>
          {/* Date and Participants */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(hackathon.startDate).toLocaleDateString("en-GB")} - {new Date(hackathon.endDate).toLocaleDateString("en-GB")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              <span>{hackathon.submissions?.length || 0} submissions</span>
            </div>
          </div>
          {/* Location + Registration Deadline */}
          <div className="text-xs text-gray-500 flex justify-between items-center pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {hackathon.location || "TBA"}
            </span>
            <span className="flex items-center gap-1 text-red-600 font-medium">
              <Calendar className="w-3 h-3" />
              {deadlineLabel}
            </span>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Hackathons</h1>
          <p className="text-sm text-gray-500">Select a hackathon to view its project gallery</p>
        </div>
      </div>
      {hackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map(renderHackathonCard)}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Hackathons Created</h3>
          <p className="text-gray-500 mb-4">
            You haven't created any hackathons yet. Create your first hackathon to start managing projects.
          </p>
        </div>
      )}
    </div>
  );
}

