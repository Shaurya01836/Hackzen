import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  Mail,
  Trophy,
  Award,
  Star,
  Save,
  UserCircle2,
  TrendingUp,
} from "lucide-react";
import AchievementsSection from "../../components/DashboardUI/AchievementsSection";
import AchievementBadge from "../../components/DashboardUI/AchievementBadge";
import StreakGraphic from "../../components/DashboardUI/StreakGraphic";

function PublicAchievementsSection({ user }) {
  // Debug: Log the badge data to see what we're receiving
  console.log('PublicAchievementsSection - user badges:', user?.badges);
  console.log('PublicAchievementsSection - user role:', user?.role);

  // Show ALL badges from user's badges array (they are all unlocked)
  const unlockedBadges = (user?.badges || [])
    .map(b => {
      // Support both {badge: {...}} and {...} structures
      const badge = b.badge || b;
      return {
        ...badge,
        isUnlocked: true // All badges in user's badges array are unlocked
      };
    });

  console.log('PublicAchievementsSection - unlocked badges:', unlockedBadges);

  if (!unlockedBadges.length) {
    return (
      <div className="text-gray-500 text-center py-8">No badges unlocked yet.</div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {unlockedBadges.map(badge => (
        <AchievementBadge
          key={badge._id || badge.name}
          badge={badge}
          isUnlocked={true}
          showDetails={true}
        />
      ))}
    </div>
  );
}

export function PublicProfileView({ userId }) {
  const [publicProfile, setPublicProfile] = useState(null);
  const [publicLoading, setPublicLoading] = useState(false);
  const [publicError, setPublicError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if rendered from admin panel user profile route
  const isAdminUserProfile = location.pathname.startsWith("/admin/users/");

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
    <div className="flex flex-col gap-8 w-full p-10">
      {/* Back Button */}
      <button
        onClick={() => isAdminUserProfile ? navigate("/admin/users") : navigate("/dashboard/profile")}
        className="self-start mb-2 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        {isAdminUserProfile ? "Back" : "Back to My Profile"}
      </button>
      {/* Hero Profile Card */}
      <Card className="shadow-none hover:shadow-none">
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
            <div className="flex gap-2 mb-4">
              <Badge
                variant="outline"
                className="bg-purple-100 text-purple-800 border-purple-300 px-3 py-1 text-sm font-medium"
              >
                {publicProfile.role || "User"}
              </Badge>
            </div>
            {/* Bio */}
            {publicProfile.bio && (
              <p className="text-gray-600 mx-auto leading-relaxed">
                {publicProfile.bio}
              </p>
            )}
          </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/50 rounded-2xl p-0 border border-gray-100">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {publicProfile.registeredHackathonIds?.length || 0}
                </p>
                <p className="text-sm text-gray-500 font-medium">Hackathons</p>
              </div>
            </div>
            <div className="bg-white/50 rounded-2xl p-0 border border-gray-100">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">0</p>
                <p className="text-sm text-gray-500 font-medium">Wins</p>
              </div>
            </div>
            <div className="bg-white/50 rounded-2xl p-0 border border-gray-100">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {publicProfile.badges?.length || 0}
                </p>
                <p className="text-sm text-gray-500 font-medium">Badges</p>
              </div>
            </div>
            <div className="bg-white/50 rounded-2xl p-0 border border-gray-100">
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Save className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {publicProfile.projects?.length || 0}
                </p>
                <p className="text-sm text-gray-500 font-medium">Projects</p>
              </div>
            </div>
          </div>
          {/* Social & Skills Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Social Links */}
            <div className="bg-white/50 rounded-2xl border border-gray-100 p-0">
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
                <div className="space-y-3">
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
            {/* Skills & Interests */}
            {(publicProfile.skills?.length > 0 || publicProfile.interests?.length > 0) && (
              <div className="bg-white/50 rounded-2xl border border-gray-100 p-0">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">S</span>
                    </span>
                    Skills & Interests
                  </h3>
                  <div className="flex flex-wrap gap-3 mb-2">
                    {publicProfile.skills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {publicProfile.interests?.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Achievements & Badges */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-500" /> Achievements & Badges
            </h3>
            <div className="bg-white/50 rounded-2xl border border-gray-100 p-6">
              <PublicAchievementsSection user={publicProfile} />
            </div>
          </div>

          {/* Activity Streak Section */}
          {publicProfile.streakData && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-500" /> Activity Streak
              </h3>
              <div className="bg-white/50 rounded-2xl border border-gray-100 p-6">
                <StreakGraphic
                  data={publicProfile.streakData.activityLog || []}
                  current={publicProfile.streakData.currentStreak || 0}
                  max={publicProfile.streakData.maxStreak || 0}
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
