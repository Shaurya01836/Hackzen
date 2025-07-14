import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/CommonUI/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/DashboardUI/avatar";
import { Badge } from "../../components/CommonUI/badge";
import {
  Github,
  Linkedin,
  Globe,
  Twitter,
  Instagram,
  Link as LinkIcon,
} from "lucide-react";

export default function PublicProfileView({ userId }) {
  const [publicProfile, setPublicProfile] = useState(null);
  const [publicLoading, setPublicLoading] = useState(false);
  const [publicError, setPublicError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    setPublicLoading(true);
    setPublicError(null);
    setPublicProfile(null);
    fetch(`/api/users/public/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => setPublicProfile(data))
      .catch((err) => setPublicError(err.message))
      .finally(() => setPublicLoading(false));
  }, [userId]);

  if (publicLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (publicError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {publicError}
      </div>
    );
  if (!publicProfile) return null;

  // Banner fallback
  const banner = publicProfile.bannerImage || "/assets/default-banner.png";
  const initials = publicProfile.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex flex-col gap-8 w-full p-20">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/profile')}
        className="self-start mb-2 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 transition flex items-center gap-2 shadow"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back to My Profile
      </button>
      {/* Hero Profile Card */}
      <Card className="w-full overflow-hidden relative rounded-3xl border-0 bg-gradient-to-br from-white via-purple-50/30 to-white">
        {/* Banner */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={banner}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Profile Info Section */}
        <div className="relative px-8 pb-8">
          {/* Avatar */}
          <div className="flex justify-start -mt-20 mb-6">
            <div className="relative group">
              <Avatar className="w-28 h-28 border-2">
                <AvatarImage
                  src={publicProfile.profileImage}
                  alt={publicProfile.name}
                />
                <AvatarFallback className="text-3xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          {/* User Info */}
          <div className="text-start mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {publicProfile.name}
            </h2>
            {/* Bio */}
            {publicProfile.bio && (
              <p className="text-gray-600 mx-auto leading-relaxed">
                {publicProfile.bio}
              </p>
            )}
          </div>
          {/* Social Links */}
          {(publicProfile.website ||
            publicProfile.github ||
            publicProfile.linkedin ||
            publicProfile.twitter ||
            publicProfile.instagram ||
            publicProfile.portfolio) && (
            <div className="bg-white/50 rounded-2xl border border-gray-100 p-0 mb-8">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Social Links
                    </h3>
                    <p className="text-sm text-gray-500">
                      Connect with me online
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {publicProfile.website && (
                    <a
                      href={publicProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-indigo-600 hover:underline"
                    >
                      <Globe className="w-4 h-4" /> Website
                    </a>
                  )}
                  {publicProfile.github && (
                    <a
                      href={publicProfile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-800 hover:underline"
                    >
                      <Github className="w-4 h-4" /> GitHub
                    </a>
                  )}
                  {publicProfile.linkedin && (
                    <a
                      href={publicProfile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-700 hover:underline"
                    >
                      <Linkedin className="w-4 h-4" /> LinkedIn
                    </a>
                  )}
                  {publicProfile.twitter && (
                    <a
                      href={publicProfile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-500 hover:underline"
                    >
                      <Twitter className="w-4 h-4" /> Twitter
                    </a>
                  )}
                  {publicProfile.instagram && (
                    <a
                      href={publicProfile.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-pink-500 hover:underline"
                    >
                      <Instagram className="w-4 h-4" /> Instagram
                    </a>
                  )}
                  {publicProfile.portfolio && (
                    <a
                      href={publicProfile.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-700 hover:underline"
                    >
                      <LinkIcon className="w-4 h-4" /> Portfolio
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Skills */}
          {publicProfile.skills?.length > 0 && (
            <div className="bg-white/50 rounded-2xl border border-gray-100 p-0 mb-8">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">S</span>
                  </span>
                  Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {publicProfile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Badges */}
          {publicProfile.badges?.length > 0 && (
            <div className="bg-white/50 rounded-2xl border border-gray-100 p-0 mb-8">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">B</span>
                  </span>
                  Badges
                </h3>
                <div className="flex flex-wrap gap-3">
                  {publicProfile.badges.map((b, idx) => (
                    <Badge key={idx} variant="outline">
                      {b.badge?.name || "Badge"}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Projects */}
          {publicProfile.projects?.length > 0 && (
            <div className="bg-white/50 rounded-2xl border border-gray-100 p-0 mb-8">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">P</span>
                  </span>
                  Projects
                </h3>
                <ul className="list-disc list-inside text-gray-700">
                  {publicProfile.projects.map((p, idx) => (
                    <li key={idx}>{p.title || "Untitled Project"}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
