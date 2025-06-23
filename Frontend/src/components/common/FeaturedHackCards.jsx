"use client";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Users,
  Trophy,
  MapPin,
  Clock,
  Star,
  Heart,
  ExternalLink,
} from "lucide-react";
import {
  RCard,
  RCardContent,
  RCardDescription,
  RCardTitle,
} from "../../components/CommonUI/RippleCard";
import { Button } from "../../components/CommonUI/button";
import { Badge } from "../../components/CommonUI/badge";

export default function FeaturedHackCards({ hackathons: propHackathons }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(!propHackathons);

  useEffect(() => {
    if (propHackathons) {
      // Use provided hackathons and filter for approved ones, limit to 3
      const approvedHackathons = propHackathons
        .filter((h) => h.approvalStatus === "approved")
        .slice(0, 3);
      setHackathons(approvedHackathons);
      setLoading(false);
    } else {
      // Fetch hackathons from API if not provided as props
      const fetchHackathons = async () => {
        try {
          const res = await axios.get("http://localhost:3000/api/hackathons");
          const approvedHackathons = res.data
            .filter((h) => h.approvalStatus === "approved")
            .slice(0, 3); // Limit to 3 hackathons
          setHackathons(approvedHackathons);
        } catch (err) {
          console.error("Hackathon fetch error:", err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchHackathons();
    }
  }, [propHackathons]);

  const handleHackathonClick = (hackathon) => {
    // Create URL-friendly slug from hackathon title
    const slug = hackathon.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Navigate to hackathon details
    const newParams = new URLSearchParams(location.search);
    newParams.set("hackathon", hackathon._id);
    newParams.set("title", slug);
    newParams.set("view", "explore-hackathons");

    navigate(`${location.pathname}?${newParams.toString()}`, {
      replace: false,
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

const renderHackathonCard = (hackathon) => (
  <RCard
    key={hackathon._id}
    className="w-full overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.01] group bg-white border border-gray-100 shadow-lg rounded-lg"
    onClick={() => handleHackathonClick(hackathon)}
  >
    <div className="flex h-full">
      {/* Left Side: Image Section */}
      <div className="relative w-64 flex-shrink-0 rounded-l-lg overflow-hidden">
        <img
          src={
            hackathon.images?.banner?.url ||
            "https://www.hackquest.io/images/layout/hackathon_cover.png"
          }
          alt={hackathon.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        {/* Top-left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className={getDifficultyColor(hackathon.difficultyLevel)}>
            {hackathon.difficultyLevel}
          </Badge>
          <Badge className="bg-purple-600 text-white">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </Badge>
        </div>

        {/* Bottom-left Prize */}
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-semibold shadow-lg">
            <Trophy className="w-3 h-3 mr-1" />
            {hackathon.prizePool?.amount
              ? `$${hackathon.prizePool.amount.toLocaleString()}`
              : "TBA"}
          </Badge>
        </div>
      </div>

      {/* Right Side: Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Top Section: Title, Org, Desc, Info */}
        <div className="space-y-3">
          {/* Header: Title & Organizer */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <RCardTitle className="text-lg font-semibold text-indigo-700 hover:text-indigo-800 transition-colors leading-tight">
                {hackathon.title}
              </RCardTitle>
              <RCardDescription className="text-sm text-gray-600 mt-1">
                by{" "}
                <span className="font-medium text-gray-800">
                  {hackathon.organizer?.name || "Unknown Organizer"}
                </span>
              </RCardDescription>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-800">4.5</span>
              <span className="text-sm text-gray-500">(12)</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-1 group-hover:line-clamp-2 transition-all duration-300">
            {hackathon.description || "No description available"}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* Duration */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg flex-shrink-0">
                <Calendar className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">Duration</p>
                <p className="text-xs font-semibold text-gray-800 truncate">
                  {new Date(hackathon.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(hackathon.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg flex-shrink-0">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">Location</p>
                <p className="text-xs font-semibold text-gray-800 truncate">
                  {hackathon.location || "TBA"}
                </p>
              </div>
            </div>

            {/* Participants */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg flex-shrink-0">
                <Users className="w-4 h-4 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">Participants</p>
                <p className="text-xs font-semibold text-gray-800">
                  {hackathon.participants?.length || 0}/
                  {hackathon.maxParticipants || 100}
                </p>
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg flex-shrink-0">
                <Clock className="w-4 h-4 text-red-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500">Deadline</p>
                <p className="text-xs font-semibold text-gray-800 truncate">
                  {new Date(
                    hackathon.registrationDeadline
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tags & Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              {hackathon.category}
            </Badge>
            {(hackathon.tags || []).slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
            {hackathon.tags?.length > 2 && (
              <Badge variant="outline" className="bg-gray-50 text-gray-500">
                +{hackathon.tags.length - 2} more
              </Badge>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              size="sm"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200 px-4 py-2 rounded-lg font-medium"
              onClick={(e) => {
                e.stopPropagation();
                handleHackathonClick(hackathon);
              }}
            >
              <ExternalLink className="w-4 h-4" />
              View Details
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 transition-colors duration-200 px-3 py-2 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                // Handle save functionality
              }}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </RCard>
);


  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading featured hackathons...</p>
        </div>
      </div>
    );
  }

  if (hackathons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No featured hackathons available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {hackathons.map((hackathon) => renderHackathonCard(hackathon))}
    </div>
  );
}