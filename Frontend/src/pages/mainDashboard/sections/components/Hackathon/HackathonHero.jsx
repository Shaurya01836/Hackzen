"use client";
import { Badge } from "../../../../../components/CommonUI/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/CommonUI/card";
import { Progress } from "../../../../../components/DashboardUI/progress";
import { Calendar, Star, Trophy, Users } from "lucide-react";
import { Button } from "../../../../../components/CommonUI/button";

export default function HackathonHero({ hackathon, isRegistered, isSaved }) {
  const {
    prize,
    participants,
    maxParticipants,
    rating,
    reviews,
    registrationDeadline,
    startDate,
    endDate,
    featured,
    sponsored,
    images,
  } = hackathon;

  const progress = Math.round((participants / maxParticipants) * 100);

  const getRegistrationStatus = () => {
    const now = new Date();
    const deadline = new Date(registrationDeadline);
    if (now > deadline) return "Registration Closed";
    if (participants >= maxParticipants && !isRegistered) return "Registration Full";
    if (isRegistered) return "Registered";
    return "Registration Open";
  };

  const registrationBadge = () => {
    const status = getRegistrationStatus();
    switch (status) {
      case "Registration Closed":
      case "Registration Full":
        return <Badge className="bg-red-500 text-white">{status}</Badge>;
      case "Registered":
        return <Badge className="bg-green-500 text-white">Registered</Badge>;
      default:
        return <Badge className="bg-green-500 text-white">Registration Open</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Hero Banner */}
      <div className="lg:col-span-2">
        <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg mb-8">
          <img
            src={images?.banner?.url || "/placeholder.svg?height=400&width=800"}
            alt={hackathon.name}
            className="object-cover w-full h-56 md:h-[550px]"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {featured && <Badge className="bg-purple-500">Featured</Badge>}
            {sponsored && (
              <Badge
                variant="outline"
                className="border-yellow-500 text-yellow-600 bg-white"
              >
                Sponsored
              </Badge>
            )}
          </div>
          <div className="absolute bottom-4 right-4">
            {registrationBadge()}
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="space-y-4">
        {/* Prize */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Prize Pool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{prize}</p>
            <p className="text-sm text-gray-500">Total rewards</p>
          </CardContent>
        </Card>

        {/* Participation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Participation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Registered</span>
              <span>
                {participants}/{maxParticipants}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating}</span>
              </div>
              <span className="text-gray-500">({reviews} reviews)</span>
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Important Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Registration Deadline:</span>
              <span className="font-medium">{registrationDeadline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Event Start:</span>
              <span className="font-medium">{startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Event End:</span>
              <span className="font-medium">{endDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* CTA for submission */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3"
              size="lg"
            >
              Submit Your Project
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
