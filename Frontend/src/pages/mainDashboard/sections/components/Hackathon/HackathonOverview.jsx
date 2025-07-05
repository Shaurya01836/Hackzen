"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/CommonUI/card";
import { Badge } from "../../../../../components/CommonUI/badge";
import { Building, MapPin, Target, Award, Users, AlertCircle, CheckCircle, Globe, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../components/DashboardUI/avatar";
import { Button } from "../../../../../components/CommonUI/button";

export default function HackathonOverview({ hackathon, sectionRef, user }) {
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

  return (
    <section ref={sectionRef} className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
        Overview & Requirements
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Hackathon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{hackathon.description}</p>
            </CardContent>
          </Card>

          {/* Organizer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Organizer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback>{hackathon.organizer[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{hackathon.organizer}</h3>
                  <p className="text-gray-600">Event Organizer</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {hackathon.requirements?.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  What You'll Need
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    Laptop/Computer with development environment
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    Stable internet connection
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    Team of {hackathon.teamSize?.min || 1} to {hackathon.teamSize?.max || 4} members
                    {hackathon.teamSize?.allowSolo ? " (solo participation allowed)" : ""}
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    GitHub account for code submission
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event Details Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{hackathon.location}</p>
                  <p className="text-sm text-gray-500">Location</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{hackathon.category}</p>
                  <p className="text-sm text-gray-500">Category</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-gray-500" />
                <div>
                  <Badge
                    className={`${getDifficultyColor(hackathon.difficulty)} text-white`}
                  >
                    {hackathon.difficulty}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">Difficulty Level</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">
                    {hackathon.teamSize?.min || 1} - {hackathon.teamSize?.max || 4} members
                    {hackathon.teamSize?.allowSolo ? " (solo allowed)" : ""}
                  </p>
                  <p className="text-sm text-gray-500">Team Size</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Technologies & Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {hackathon.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
