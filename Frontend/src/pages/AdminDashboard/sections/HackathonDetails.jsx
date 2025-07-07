"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Users,
  Trophy,
  MapPin,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Globe,
  Building,
  Award,
  Target,
  Gift,
  MessageSquare,
  UserPlus,
  Download,
  Heart,
  Share2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import { Progress } from "../../../components/DashboardUI/progress";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/DashboardUI/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/CommonUI/tabs";

export function HackathonDetails({ hackathon, onClose }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500";
      case "Intermediate":
        return "bg-yellow-500";
      case "Advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Registration Open":
        return "bg-green-500";
      case "Ongoing":
        return "bg-blue-500";
      case "Ended":
        return "bg-gray-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center overflow-auto p-4">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Close
            </Button>
            <h2 className="text-xl font-bold text-gray-800">{hackathon.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSaved(!isSaved)}
              className={`gap-2 ${isSaved ? "text-red-500 border-red-500" : ""}`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
            <Button
              size="sm"
              onClick={() => setIsRegistered(!isRegistered)}
              className={`gap-2 ${
                isRegistered ? "bg-green-500 hover:bg-green-600" : "bg-indigo-500 hover:bg-indigo-600"
              } text-white`}
            >
              {isRegistered ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Registered
                </>
              ) : (
                "Register Now"
              )}
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Overview */}
            <div className="md:col-span-2 space-y-6">
              {/* Hero */}
              <div className="relative">
                <img
                  src={
                    hackathon.images?.banner?.url ||
                    hackathon.images?.logo?.url ||
                    hackathon.image ||
                    "/assets/default-banner.png"
                  }
                  alt={hackathon.title}
                  className="w-full rounded-md object-cover h-52 md:h-64"
                />
                <div className="absolute bottom-4 right-4">
                  <Badge className={`${getStatusColor(hackathon.status)} text-white`}>
                    {hackathon.status}
                  </Badge>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="problems">Problems</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="prizes">Prizes</TabsTrigger>
                  <TabsTrigger value="community">Community</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{hackathon.description}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Organizer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={hackathon.organizerLogo || "/placeholder.svg"} />
                        <AvatarFallback>{hackathon.organizer?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{hackathon.organizer?.name}</p>
                        <p className="text-sm text-gray-500">Event Organizer</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Problems */}
                <TabsContent value="problems" className="pt-4 space-y-3">
                  {hackathon.problemStatements?.length ? (
                    hackathon.problemStatements.map((problem, idx) => (
                      <Card key={idx}>
                        <CardContent className="py-4">
                          <p className="font-medium">Problem {idx + 1}</p>
                          <p className="text-gray-700">{problem}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-500">No problem statements yet.</p>
                  )}
                </TabsContent>

                {/* Requirements */}
                <TabsContent value="requirements" className="pt-4">
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    {hackathon.requirements?.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </TabsContent>

                {/* Prizes */}
                <TabsContent value="prizes" className="pt-4 space-y-3">
                  <Card>
                    <CardContent className="py-4">
                      <p className="font-bold text-lg text-green-600">
                        {hackathon.prize || "$0"}
                      </p>
                      <p className="text-sm text-gray-500">Total Prize Pool</p>
                    </CardContent>
                  </Card>
                  <div className="flex flex-wrap gap-2">
                    {hackathon.perks?.map((perk, idx) => (
                      <Badge key={idx} variant="outline">
                        {perk}
                      </Badge>
                    ))}
                  </div>
                </TabsContent>

                {/* Community */}
                <TabsContent value="community" className="pt-4 space-y-3">
                  <Button className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Join Discord
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Find Teammates
                  </Button>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right column - Info */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p><strong>Registration Deadline:</strong> {hackathon.registrationDeadline}</p>
                  <p><strong>Start:</strong> {hackathon.startDate}</p>
                  <p><strong>End:</strong> {hackathon.endDate}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>Location:</strong> {hackathon.location}</p>
                  <p><strong>Category:</strong> {hackathon.category}</p>
                  <p>
                    <strong>Difficulty: </strong>
                    <Badge className={`${getDifficultyColor(hackathon.difficulty)} text-white`}>
                      {hackathon.difficulty}
                    </Badge>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
