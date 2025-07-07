import { Badge } from "../CommonUI/badge";
import { Button } from "../CommonUI/button";
import { ACard } from "./AnimatedCard";
import { Trophy, Clock, MapPin } from "lucide-react";


export function HackathonCard({ hackathon, onClick, onSubmitProject, onEdit }) {
  return (
    <ACard
      key={hackathon.id}
      className="w-full max-w-md flex flex-col overflow-y-hidden max-h-96 cursor-pointer rounded-xl transition-transform duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
      onClick={() => onClick && onClick(hackathon.id, hackathon.name)}
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
      <div className="p-4 flex flex-col gap-3 flex-1">
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
        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation(); // Prevents card click from triggering
              onSubmitProject && onSubmitProject(hackathon); // 🔥 This line triggers the form to open
            }}
          >
            Submit Project
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(hackathon);
            }}
          >
            Edit
          </Button>
        </div>
      </div>
    </ACard>
  );
}
