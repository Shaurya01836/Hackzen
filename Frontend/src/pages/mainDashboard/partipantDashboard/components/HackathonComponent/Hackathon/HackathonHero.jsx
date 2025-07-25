"use client";
import { Badge } from "../../../../../../components/CommonUI/badge";
import React from "react";

export default function HackathonHero({ hackathon, isRegistered, isSaved }) {
  const {
    featured,
    sponsored,
    images,
    difficulty,
    category,
  } = hackathon;

  const getRegistrationStatus = () => {
    const now = new Date();
    const deadline = new Date(hackathon.registrationDeadline);
    const safeParticipants = typeof hackathon.participants === "number" && !isNaN(hackathon.participants) ? hackathon.participants : 0;
    const safeMaxParticipants = typeof hackathon.maxParticipants === "number" && hackathon.maxParticipants > 0 ? hackathon.maxParticipants : 1;
    
    if (now > deadline) return "Registration Closed";
    if (safeParticipants >= safeMaxParticipants && !isRegistered) return "Registration Full";
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
    <div className="w-full">
      {/* Full Width Hero Banner with Hover Effects */}
      <div className="relative w-full rounded-2xl overflow-hidden border mb-8 group cursor-pointer">
        <img
          src={images?.banner?.url || "/placeholder.svg?height=400&width=800"}
          alt={hackathon.name}
          className="object-cover w-full h-56 md:h-[400px] lg:h-[500px] transition-all duration-300 ease-in-out group-hover:scale-105"
        />
        
        {/* Top badges */}
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
        
        {/* Hover overlay - appears on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
          {/* Bottom overlay with content - slides in from left */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="text-white">
              {/* Title slides in from left */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight transform -translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-100">
                {hackathon.name}
              </h1>
              
              {/* Badge row slides in from left with delay */}
              <div className="flex flex-wrap gap-3 items-center transform -translate-x-16 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-300">
                {registrationBadge()}
                {difficulty && (
                  <Badge className={`${getDifficultyColor(difficulty)} text-white text-sm px-3 py-1`}>
                    {difficulty}
                  </Badge>
                )}
                {category && (
                  <Badge variant="outline" className="border-white text-white bg-white/20 backdrop-blur-sm text-sm px-3 py-1">
                    {category}
                  </Badge>
                )}
              </div>
              
              {/* Description slides in from left with more delay */}
              {hackathon.description && (
                <p className="mt-4 text-gray-200 text-lg max-w-3xl leading-relaxed line-clamp-2 transform -translate-x-20 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 ease-out delay-500">
                  {hackathon.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}