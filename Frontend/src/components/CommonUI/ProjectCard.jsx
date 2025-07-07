import { Link } from "react-router-dom";
import { Star, Eye } from "lucide-react";
import { Card, CardContent } from "../CommonUI/card";
import { Badge } from "../CommonUI/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../DashboardUI/avatar";

export function ProjectCard({ project }) {
  const coverImage =
    project.logo?.url || project.images?.[0] || "/placeholder.svg?height=200&width=400";

  return (
    <Link to={`/projects/${project._id}`}>
      <Card className="cursor-pointer hover:shadow-md transition-all duration-300 group border border-gray-200 bg-white rounded-xl">
        <div className="relative h-36 overflow-hidden rounded-t-xl">
          <img
            src={coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500">
              {project.hackathon?.title || "Untitled Hackathon"}
            </span>
          </div>

          <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-indigo-600">
            {project.title}
          </h3>

          <div className="flex flex-wrap gap-1">
            {(project.technologies || []).slice(0, 3).map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-[10px] px-1.5 py-0.5"
              >
                {tech}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 pt-2">
              <Avatar className="w-6 h-6 ring-1 ring-gray-100">
                <AvatarImage
                  src={project.author?.avatar || "/placeholder.svg"}
                />
                <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-600">
                  {project.author?.name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <p className="text-xs font-medium text-gray-900">
                  {project.author?.name || "Unknown"}
                </p>
                <p className="text-[10px] text-gray-500">
                  {project.author?.role || "Contributor"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-2">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                {project.stars ?? 0}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {project.views ?? 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
