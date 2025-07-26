import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import { Card, CardContent } from "../CommonUI/card";
import { Badge } from "../CommonUI/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../DashboardUI/avatar";
import { useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../context/AuthContext";

export function ProjectCard({ project, onClick, user, judgeScores = [], className = "" }) {
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
    "/assets/default-banner.png";

  const author = project.submittedBy || {}; // fallback in case it's not populated
  
  // ✅ Show judged badge only if judge and already scored this project
  const alreadyScored =
    user?.role === "judge" && judgeScores.includes(project._id);

  // Helper function to truncate long names intelligently
  const truncateName = (name) => {
    if (!name) return 'Unknown';
    
    // If name is longer than 12 characters, show first name only
    if (name.length > 12) {
      const firstName = name.split(' ')[0];
      return firstName.length > 12 ? firstName.substring(0, 9) + '...' : firstName;
    }
    
    return name;
  };

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
        if (project.type && project.type.toLowerCase() === "ppt") {
          await fetch(`http://localhost:3000/api/submission-form/${project._id}/view`, {
            method: "PATCH",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          setViewCount((prev) => prev + 1); // Optimistic update
        } else {
          await fetch(`http://localhost:3000/api/projects/${project._id}/view`, {
            method: "PATCH",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          setViewCount((prev) => prev + 1); // Optimistic update
        }
      } catch {}
      onClick(project);
    }
  };

  const CardContentEl = (
    <Card className={`cursor-pointer hover:shadow-md transition-all duration-300 group border border-gray-200 bg-white rounded-xl h-full min-h-[280px] flex flex-col ${className}`}>
      {/* Image section - Fixed height */}
      <div className="relative h-36 overflow-hidden rounded-t-xl flex-shrink-0">
        <img
          src={coverImage}
          alt={project.title}
          className="w-full h-full object-cover bg-white group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.onerror = null; e.target.src = '/assets/default-banner.png'; }}
        />
        {alreadyScored && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] px-2 py-1 rounded-full z-10 shadow">
            ✅ Judged
          </div>
        )}
      </div>

      {/* Content section - Flexible height */}
      <CardContent className="p-4 flex-1 flex flex-col min-h-0">
        {/* Title section - Fixed height with line clamping */}
        <div className="mb-2 flex-shrink-0 pt-4">
          <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-indigo-600 leading-5 min-h-[2.5rem]">
            {project.title}
          </h3>
        </div>

        {/* Team name section - Fixed height (optional) */}
        {project.name && project.name !== '-' && (
          <div className="text-xs text-gray-500 mb-2 flex-shrink-0 line-clamp-1">
            Team: {project.name}
          </div>
        )}

        {/* Spacer to push footer to bottom */}
        <div className="flex-1"></div>

        {/* Footer section - Fixed at bottom */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto flex-shrink-0">
          {/* Author info with truncated name */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Avatar className="w-6 h-6 ring-1 ring-gray-100 flex-shrink-0">
              <AvatarImage src={author.profileImage || "/placeholder.svg"} />
              <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-600">
                {author.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-900 truncate" title={author.name || "Unknown"}>
                {truncateName(author.name)}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {author.role || "Contributor"}
              </p>
            </div>
          </div>

          {/* Stats section - Fixed width */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500 flex-shrink-0 ml-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-200 ${
                isLiked ? 'bg-pink-100' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="min-w-[1ch]">{likeCount}</span>
            </button>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span className="min-w-[1ch]">{viewCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return (
      <div onClick={handleCardClick} className="h-full">
        {CardContentEl}
      </div>
    );
  }

  return (
    <Link to={`/dashboard/project-archive/${project._id}`} className="h-full block">
      {CardContentEl}
    </Link>
  );
}