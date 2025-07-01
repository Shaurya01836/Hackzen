import { Star, Eye, Heart, Award } from "lucide-react";
import { Card, CardContent } from "../CommonUI/card";
import { Badge } from "../CommonUI/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../DashboardUI/avatar";

export function ProjectCard({ project, onClick, variant = "default" }) {
  const getCardStyles = () => {
    switch (variant) {
      case "featured":
        return "border-blue-200 bg-gradient-to-br from-blue-50 to-white";
      case "awards":
        return "border-yellow-200 bg-gradient-to-br from-yellow-50 to-white";
      default:
        return "border-gray-200 bg-white";
    }
  };

 
  const getHoverColor = () => {
    switch (variant) {
      case "featured":
        return "group-hover:text-blue-600";
      case "awards":
        return "group-hover:text-yellow-600";
      default:
        return "group-hover:text-indigo-600";
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case "featured":
        return "border-blue-100";
      case "awards":
        return "border-yellow-100";
      default:
        return "border-gray-100";
    }
  };

  const getAvatarRing = () => {
    switch (variant) {
      case "featured":
        return "ring-blue-100";
      case "awards":
        return "ring-yellow-100";
      default:
        return "ring-gray-100";
    }
  };

  const getAvatarFallback = () => {
    switch (variant) {
      case "featured":
        return "bg-blue-100 text-blue-600";
      case "awards":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-indigo-100 text-indigo-600";
    }
  };

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-all duration-300 group ${getCardStyles()} border rounded-xl`}
      onClick={() => onClick(project)}
    >
      <div className="relative h-36 overflow-hidden rounded-t-xl">
        <img
          src={project.images[0] || "/placeholder.svg?height=200&width=400"}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-500">{project.hackathon}</span>
        </div>

        <h3
          className={`font-semibold text-sm line-clamp-2 text-gray-900 ${getHoverColor()}`}
        >
          {project.title}
        </h3>

        {variant === "default" && (
          <div className="flex flex-wrap gap-1">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-[10px] px-1.5 py-0.5 "
              >
                {tech}
              </Badge>
            ))}
          </div>
        )}

        <div
          className={`flex items-center justify-between pt-3 border-t ${getBorderColor()}`}
        >
          <div className="flex items-center gap-2 pt-2">
            <Avatar className={`w-6 h-6 ring-1 ${getAvatarRing()}`}>
              <AvatarImage src={project.author.avatar || "/placeholder.svg"} />
              <AvatarFallback className={`text-[10px] ${getAvatarFallback()}`}>
                {project.author.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-xs font-medium text-gray-900">
                {project.author.name}
              </p>
              <p className="text-[10px] text-gray-500">{project.author.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              {project.stars}
            </div>
            <div className="flex items-center gap-1">
              {variant === "featured" ? (
                <>
                  <Heart className="w-3.5 h-3.5" />
                  {project.likes}
                </>
              ) : variant === "awards" ? (
                <>
                  <Award className="w-3.5 h-3.5" />
                  Winner
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  {project.views}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
