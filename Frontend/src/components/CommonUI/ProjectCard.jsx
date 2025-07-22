import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import { Card, CardContent } from "../CommonUI/card";
import { Badge } from "../CommonUI/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../DashboardUI/avatar";
import { useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../context/AuthContext";

export function ProjectCard({ project, onClick , user, judgeScores = [] }) {
  const { toast } = useToast ? useToast() : { toast: () => {} };
  const { user: authUser } = useAuth ? useAuth() : { user: null };
  const [likeCount, setLikeCount] = useState(project.likes ?? 0);
  const [isLiked, setIsLiked] = useState(
    !!(authUser && project.likedBy && project.likedBy.includes(authUser._id))
  );
  const [viewCount, setViewCount] = useState(project.views ?? 0);

  const coverImage =
    project.logo?.url ||
    project.images?.[0] ||
    "/placeholder.svg?height=200&width=400";

  const author = project.submittedBy || {}; // fallback in case it's not populated
  // ✅ Show judged badge only if judge and already scored this project
  const alreadyScored =
    user?.role === "judge" && judgeScores.includes(project._id);

  const handleLike = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!authUser || !authUser._id) {
      toast && toast({ title: "Login Required", description: "Please log in to like projects.", duration: 2000 });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/projects/${project._id}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to like project");
      const data = await res.json();
      setIsLiked(data.liked);
      setLikeCount(data.likes);
      if (data.message && toast) {
        toast({ title: data.liked ? "Liked!" : "Unliked!", description: data.message, duration: 2000 });
      }
    } catch (err) {
      toast && toast({ title: "Error", description: "Failed to like project", duration: 2000 });
    }
  };

  // Increment view count when card is clicked (if onClick is provided)
  const handleCardClick = async () => {
    if (onClick) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`http://localhost:3000/api/projects/${project._id}/view`, {
          method: "PATCH",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setViewCount((prev) => prev + 1); // Optimistic update
      } catch {}
      onClick(project);
    }
  };

  // Special rendering for PPT submissions
  if (project.type === "ppt") {
    // Team name fallback
    const teamName = project.submittedBy?.name || project.submittedBy?.email || "Unknown Team";
    const author = project.submittedBy || {};
    const likeCount = project.likes ?? 0;
    const viewCount = project.views ?? 0;
    return (
      <div className="border rounded px-4 py-3 mb-2 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <img src={project.logo?.url || "/ppt.png"} alt="PPT" className="w-8 h-8" />
          <span className="font-medium text-gray-800 text-base">{project.title}</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
          <div className="flex items-center gap-2 pt-2">
            <Avatar className="w-6 h-6 ring-1 ring-gray-100">
              <AvatarImage src={author.profileImage || "/placeholder.svg"} />
              <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-600">
                {author.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-xs font-medium text-gray-900">
                {author.name || "Unknown"}
              </p>
              <p className="text-[10px] text-gray-500">
                Team Leader
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-2">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {likeCount}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {viewCount}
            </div>
            <button
              className="text-blue-600 underline text-xs font-medium ml-4"
              onClick={e => {
                e.stopPropagation();
                if (onClick) onClick(project);
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  const CardContentEl = (
    <Card className="cursor-pointer hover:shadow-md transition-all duration-300 group border border-gray-200 bg-white rounded-xl">
      <div className="relative h-36 overflow-hidden rounded-t-xl">
        <img
          src={coverImage}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {alreadyScored && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] px-2 py-1 rounded-full z-10 shadow">
            ✅ Judged
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-indigo-600">
          {project.title}
        </h3>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 pt-2">
            <Avatar className="w-6 h-6 ring-1 ring-gray-100">
              <AvatarImage src={author.profileImage || "/placeholder.svg"} />
              <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-600">
                {author.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-xs font-medium text-gray-900">
                {author.name || "Unknown"}
              </p>
              <p className="text-[10px] text-gray-500">
                {author.role || "Contributor"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-2">
            <div className="flex items-center gap-1">
              <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`} />
              {likeCount}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {viewCount}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return (
      <div onClick={handleCardClick} style={{ cursor: "pointer" }}>
        {CardContentEl}
      </div>
    );
  }

  return (
    <Link to={`/dashboard/project-archive/${project._id}`}>
      {CardContentEl}
    </Link>
  );
}
