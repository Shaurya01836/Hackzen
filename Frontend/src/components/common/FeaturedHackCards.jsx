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

    // Navigate to the explore page with hackathon parameters
    navigate(`/explore?hackathon=${hackathon._id}&title=${slug}`);
  };

  const renderHackathonCard = (hackathon) => (
    <RCard
      key={hackathon._id}
      className="w-full overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group bg-white/20 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl"
      onClick={() => handleHackathonClick(hackathon)}
    >
      <div className="flex h-full">
        {/* Left Side: Image Section */}
        <div className="relative w-64 flex-shrink-0 rounded-l-xl overflow-hidden">
          <img
            src={
              hackathon.images?.banner?.url ||
              "https://www.hackquest.io/images/layout/hackathon_cover.png"
            }
            alt={hackathon.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay Gradient */}

          {/* Bottom-left Prize */}
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Trophy className="w-3 h-3 mr-1" />
              {hackathon.prizePool?.amount
                ? `$${hackathon.prizePool.amount.toLocaleString()}`
                : "TBA"}
            </Badge>
          </div>

          {/* Featured Badge */}
          {hackathon.tags?.includes("featured") && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </Badge>
            </div>
          )}
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          {/* Top Section: Title, Org, Desc, Info */}
          <div className="space-y-4">
            {/* Header: Title & Organizer */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <RCardTitle className="text-xl font-bold text-indigo-700 hover:text-indigo-800 transition-colors leading-tight group-hover:text-indigo-900">
                  {hackathon.title}
                </RCardTitle>
                <RCardDescription className="text-sm text-gray-600 mt-2">
                  by{" "}
                  <span className="font-semibold text-gray-800">
                    {hackathon.organizer?.name || "Unknown Organizer"}
                  </span>
                </RCardDescription>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 flex-shrink-0 bg-gray-50 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-800">4.5</span>
                <span className="text-sm text-gray-500">(12)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {hackathon.description || "Join this exciting hackathon and showcase your innovative ideas with fellow developers and creators."}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Duration */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-xl flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duration</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
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
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {hackathon.location || "TBA"}
                  </p>
                </div>
              </div>

              {/* Participants */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-xl flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Participants</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">
                      {hackathon.participants?.length || 0}/
                      {hackathon.maxParticipants || 100}
                    </p>
                    <div className="w-8 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ 
                          width: `${Math.min(((hackathon.participants?.length || 0) / (hackathon.maxParticipants || 100)) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-xl flex-shrink-0 group-hover:bg-red-200 transition-colors">
                  <Clock className="w-5 h-5 text-red-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Deadline</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">
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
          <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 transition-colors font-medium"
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
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-600 hover:from-indigo-700 hover:to-indigo-700 text-white transition-all duration-300 px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg"
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
                className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 px-4 py-2 rounded-lg group"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle save functionality
                  console.log("Saved hackathon:", hackathon.title);
                }}
              >
                <Heart className="w-4 h-4 group-hover:text-red-500 transition-colors" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RCard>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-6"></div>
          <p className="text-gray-500 text-lg">Loading featured hackathons...</p>
        </div>
      </div>
    );
  }

  if (hackathons.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Featured Hackathons</h3>
          <p className="text-gray-500">
            Check back soon for exciting hackathons to join!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {hackathons.map((hackathon) => renderHackathonCard(hackathon))}
    </div>
  );
}