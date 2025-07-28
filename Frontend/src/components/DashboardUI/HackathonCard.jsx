import { Badge } from "../CommonUI/badge";
import { Button } from "../CommonUI/button";
import { ACard } from "./AnimatedCard";
import { Trophy, Clock, MapPin, Sparkles } from "lucide-react";

export function HackathonCard({ hackathon, onClick }) {
  // Calculate deadline days left
  const registrationDeadline = new Date(hackathon.registrationDeadline);
  const today = new Date();
  const daysLeft = Math.ceil((registrationDeadline - today) / (1000 * 60 * 60 * 24));
  const deadlineLabel = isNaN(daysLeft) ? "TBA" : daysLeft > 0 ? `${daysLeft} day${daysLeft > 1 ? "s" : ""} left` : "Closed";

  // Get hackathon title/name
  const hackathonTitle = hackathon.title || hackathon.name || "Untitled Hackathon";

  return (
    <ACard
      key={hackathon._id}
      className="w-full max-w-xs flex flex-col overflow-hidden cursor-pointer rounded-xl transition-transform duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
      onClick={() => onClick && onClick(hackathon._id, hackathonTitle)}
    >
      {/* Thumbnail Section */}
      <div className="relative h-40 w-full">
        {hackathon.isFeatured && (
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-indigo-600 text-white font-semibold shadow-md">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
        <img
          src={
            hackathon.images?.logo?.url ||
            hackathon.images?.banner?.url ||
            hackathon.image ||
            "/assets/default-banner.png"
          }
          alt={hackathonTitle}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Card Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-md font-semibold text-indigo-700 leading-tight line-clamp-2 h-10">
          {hackathonTitle}
        </h3>
        <div className="text-xs text-gray-500 flex justify-between items-center">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> 
            {hackathon.location || "TBA"}
          </span>
          <span className="flex items-center gap-1 text-red-600 font-medium">
            <Clock className="w-3 h-3" /> 
            {deadlineLabel}
          </span>
        </div>
        <div className="flex gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
          {hackathon.tags?.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 border-gray-200 shrink-0"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </ACard>
  );
}
