"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Users,
  Clock,
  ExternalLink,
  Heart,
  MapPin,
} from "lucide-react";
import {
  ACard,
  ACardContent,
  ACardDescription,
  ACardHeader,
  ACardTitle,
} from "../../../components/DashboardUI/AnimatedCard";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/CommonUI/tabs";
import { HackathonDetails } from "./HackathonDetails";

export function MyHackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [savedHackathons, setSavedHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(true);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  useEffect(() => {
    const fetchRegisteredHackathons = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/registration/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        const formatted = data.map((reg) => {
          const h = reg.hackathonId;
          return {
            id: h._id,
            name: h.title,
            image: h.images?.banner?.url,
            images: h.images,
            status: h.status,
            deadline: new Date(h.registrationDeadline).toDateString(),
            participants: h.participants?.length || 0,
            description: h.description,
            prize: `$${h.prizePool?.amount?.toLocaleString()}`,
            startDate: new Date(h.startDate).toDateString(),
            endDate: new Date(h.endDate).toDateString(),
            category: h.category,
            difficulty: h.difficultyLevel,
            registered: true,
            submitted: false,
          };
        });
        setHackathons(formatted);
      } catch (err) {
        console.error("Failed to fetch registered hackathons", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedHackathons = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/users/me/saved-hackathons",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        const formatted = data.map((h) => ({
          id: h._id,
          name: h.title,
          image: h.images?.banner?.url,
          images: h.images,
          status: h.status,
          deadline: new Date(h.registrationDeadline).toDateString(),
          participants: h.participants?.length || 0,
          description: h.description,
          prize: `$${h.prizePool?.amount?.toLocaleString()}`,
          startDate: new Date(h.startDate).toDateString(),
          endDate: new Date(h.endDate).toDateString(),
          category: h.category,
          difficulty: h.difficultyLevel,
          registered: false,
          submitted: false,
        }));
        setSavedHackathons(formatted);
      } catch (err) {
        console.error("Failed to fetch saved hackathons", err);
      } finally {
        setSavedLoading(false);
      }
    };

    fetchRegisteredHackathons();
    fetchSavedHackathons();
  }, []);

  const transformHackathonData = (hackathon) => {
    return {
      ...hackathon,
      _id: hackathon.id,
      name: hackathon.name,
      prize: hackathon.prize,
      participants: hackathon.participants || 0,
      maxParticipants: hackathon.maxParticipants || 100,
      rating: 4.5,
      reviews: 12,
      difficulty: hackathon.difficulty,
      status:
        hackathon.status === "upcoming"
          ? "Registration Open"
          : hackathon.status === "ongoing"
          ? "Ongoing"
          : "Ended",
      startDate: hackathon.startDate,
      endDate: hackathon.endDate,
      registrationDeadline: hackathon.deadline,
      organizer: hackathon.organizer || "Unknown Organizer",
      organizerLogo: hackathon.organizerLogo || null,
      featured: hackathon.tags?.includes("featured") || false,
      sponsored: hackathon.tags?.includes("sponsored") || false,
      requirements: hackathon.requirements || [],
      perks: hackathon.perks || [],
      tags: hackathon.tags || [hackathon.category],
      problemStatements: hackathon.problemStatements || [],
      images: hackathon.images,
      description: hackathon.description,
      location: hackathon.location,
    };
  };

  const renderHackathonCard = (hackathon) => {
    return (
      <ACard
        key={hackathon.id}
        className="w-full max-w-xs flex flex-col overflow-hidden cursor-pointer rounded-xl transition-transform duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
        onClick={() => setSelectedHackathon(transformHackathonData(hackathon))}
      >
        {/* Thumbnail Section */}
        <div className="relative h-40 w-full">
          <img
            src={hackathon.image || "https://www.hackquest.io/images/layout/hackathon_cover.png"}
            alt={hackathon.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Prize Pool Badge */}
          <div className="absolute top-2 right-2">
            <Badge className="bg-yellow-400 text-yellow-900 font-semibold shadow-md">
              <Trophy className="w-3 h-3 mr-1" />
              {hackathon.prize || "TBA"}
            </Badge>
          </div>
        </div>
        {/* Card Content */}
        <div className="p-4 flex flex-col gap-3">
          <h3 className="text-md font-semibold text-indigo-700 leading-tight line-clamp-1 ">
            {hackathon.name}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-indigo-500" />
              {hackathon.deadline}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-indigo-500" />
              {hackathon.location || "Online"}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap mt-1">
            <Badge
              variant="outline"
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 border-gray-200"
            >
              {hackathon.category}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 border-gray-200"
            >
              {hackathon.difficulty}
            </Badge>
          </div>
        </div>
      </ACard>
    );
  };

  if (selectedHackathon) {
    return (
      <HackathonDetails
        hackathon={selectedHackathon}
        onBack={() => setSelectedHackathon(null)}
        backButtonLabel="Go to My Hackathons"
      />
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 md:min-h-screen">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Hackathons</h1>
          <p className="text-sm text-gray-500">
            Track your hackathon participation and progress
          </p>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Registered ({hackathons.length})
          </TabsTrigger>
          <TabsTrigger value="saved">
            Saved ({savedHackathons.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          {hackathons.length > 0 ? (
            <div className="flex gap-4 pb-4">
              {hackathons.map(renderHackathonCard)}
            </div>
          ) : (
            <ACard>
              <ACardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Registered Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  You're not currently registered in any hackathons.
                </p>
              </ACardContent>
            </ACard>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {savedHackathons.length > 0 ? (
            <div className="flex gap-4 pb-4">
              {savedHackathons.map(renderHackathonCard)}
            </div>
          ) : (
            <ACard>
              <ACardContent className="flex flex-col items-center justify-center py-12">
                <Heart className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Saved Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  You haven't saved any hackathons yet.
                </p>
              </ACardContent>
            </ACard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
