"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Users,
  Clock,
  ExternalLink,
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

export function MyHackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

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
            submitted: false, // replace with real logic if needed
          };
        });
        setHackathons(formatted);
      } catch (err) {
        console.error("Failed to fetch registered hackathons", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredHackathons();
  }, []);

  const activeHackathons = hackathons.filter((h) => h.status === "live");
  const completedHackathons = hackathons.filter((h) => h.status === "closed");
  const upcomingHackathons = hackathons.filter((h) => h.status === "upcoming");

  const renderHackathonCard = (hackathon) => (
    <ACard
      key={hackathon.id}
      className="hover:scale-[1.01] transition-all duration-200 ease-in-out shadow-md "
    >
      <ACardHeader>
        <div className="flex items-start justify-between">
          <div>
            <ACardTitle className="text-lg font-semibold text-indigo-700">
              {hackathon.name}
            </ACardTitle>
            <ACardDescription className="mt-1 text-gray-600">
              {hackathon.description}
            </ACardDescription>
          </div>
          <Badge
            className={`capitalize ${
              hackathon.status === "live"
                ? "bg-green-500 text-white"
                : hackathon.status === "Closed"
                ? "bg-gray-400 text-white"
                : "border-indigo-300 text-indigo-600"
            }`}
          >
            {hackathon.status}
          </Badge>
        </div>
      </ACardHeader>
      <ACardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>
              {hackathon.startDate} - {hackathon.endDate}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>{hackathon.participants} participants</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-indigo-500" />
            <span>{hackathon.prize} prize pool</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{hackathon.deadline}</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">{hackathon.category}</Badge>
          <Badge variant="outline">{hackathon.difficulty}</Badge>
        </div>

        <div className="flex gap-2 pt-2 flex-wrap">
          <Button
            size="sm"
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <ExternalLink className="w-3 h-3" />
            View Details
          </Button>
          {hackathon.status === "live" && !hackathon.submitted && (
            <Button size="sm" variant="default">
              Submit Project
            </Button>
          )}
          {hackathon.submitted && (
            <Button size="sm" variant="outline" disabled>
              Submitted ✓
            </Button>
          )}
        </div>
      </ACardContent>
    </ACard>
  );

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
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
            Active ({activeHackathons.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingHackathons.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedHackathons.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeHackathons.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeHackathons.map(renderHackathonCard)}
            </div>
          ) : (
            <ACard>
              <ACardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Active Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  You're not currently participating in any active hackathons.
                </p>
              </ACardContent>
            </ACard>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingHackathons.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingHackathons.map(renderHackathonCard)}
            </div>
          ) : (
            <ACard>
              <ACardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Upcoming Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  No upcoming hackathons registered yet.
                </p>
              </ACardContent>
            </ACard>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedHackathons.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedHackathons.map(renderHackathonCard)}
            </div>
          ) : (
            <ACard>
              <ACardContent className="flex flex-col items-center justify-center py-12">
                <Trophy className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Completed Hackathons
                </h3>
                <p className="text-gray-500 text-center">
                  You haven't completed any hackathons yet.
                </p>
              </ACardContent>
            </ACard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}