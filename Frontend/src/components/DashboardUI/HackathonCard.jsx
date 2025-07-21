import { Badge } from "../CommonUI/badge";
import { Button } from "../CommonUI/button";
import { ACard } from "./AnimatedCard";
import { Trophy, Clock } from "lucide-react";

export function HackathonCard({ hackathon, onClick }) {
  return (
    <ACard
      key={hackathon._id}
      className="w-full max-w-md flex flex-col overflow-y-hidden max-h-96 cursor-pointer rounded-xl transition-transform duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
      onClick={() => onClick && onClick(hackathon._id, hackathon.name)}
    >
      {/* Thumbnail Section */}
      <div className="relative h-40 w-full">
        <img
          src={
            hackathon.images?.banner?.url ||
            hackathon.images?.logo?.url ||
            hackathon.image ||
            "/assets/default-banner.png"
          }
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
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-md font-semibold text-indigo-700 leading-tight line-clamp-1 ">
          {hackathon.name || hackathon.title}
        </h3>
        {/* Category and Difficulty */}
        <div className="text-xs text-gray-500 mb-1">
          {hackathon.category && <span>{hackathon.category}</span>}
          {hackathon.category && hackathon.difficulty && <span> • </span>}
          {hackathon.difficulty && <span>{hackathon.difficulty}</span>}
        </div>
        {/* Date and Prize Row */}
        <div className="flex items-center justify-between text-xs text-gray-700 mt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {hackathon.deadline || hackathon.registrationDeadline || "TBA"}
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            {hackathon.prize || "TBA"}
          </span>
        </div>
      </div>
    </ACard>
  );
}
