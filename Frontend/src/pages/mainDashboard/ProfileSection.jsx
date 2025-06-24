"use client";
import { useState, useEffect } from "react";
import axios from "axios";

import {
   SquarePen,
  Trash2,
  User,
  Settings,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Edit,
  MessageSquare,
  Trophy,
  Award,
  Star,
  TrendingUp,
  Github,
  ExternalLink,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  UserCircle2,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/CommonUI/card";
import { Button } from "../../components/CommonUI/button";
import { Badge } from "../../components/CommonUI/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/DashboardUI/avatar";
import { Switch } from "../../components/DashboardUI/switch";
import { Input } from "../../components/CommonUI/input";
import { Label } from "../../components/CommonUI/label";
import { Textarea } from "../../components/CommonUI/textarea";
import { useAuth } from "../../context/AuthContext";
import { Progress } from "../../components/DashboardUI/progress";
import StreakGraphic from "../../components/DashboardUI/StreakGraphic";

export function ProfileSection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null); 
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordMessage, setPasswordMessage] = useState("");
const [passwordError, setPasswordError] = useState("");

  

  const [currentView, setCurrentViewState] = useState("overview");
  const setCurrentView = (view) => {
    setCurrentViewState(view);
    localStorage.setItem("currentView", view);
  };

const [streakData, setStreakData] = useState({
  currentStreak: 0,
  maxStreak: 0,
  activityLog: [],
});

  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  

  const { user, token, login } = useAuth();

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    github: "",
    linkedin: "",
    bannerImage: "",
  });

  const totalHackathons = 12;
  const totalWins = 3;
  const totalBadges = 8;
  const currentRank = 95;

  const featuredProjects = [
    {
      id: 1,
      name: "Smart City Dashboard",
      description: "AI-powered dashboard for urban management",
      technologies: ["React", "TensorFlow", "Node.js"],
      github: "github.com/user/smart-city",
      demo: "smartcity-demo.vercel.app",
      hackathon: "AI Innovation Challenge",
      rank: 3,
    },
    {
      id: 2,
      name: "DeFi Trading Platform",
      description: "Decentralized trading with automated market making",
      technologies: ["Solidity", "Web3.js", "React"],
      github: "github.com/user/defi-platform",
      demo: "defi-trader.eth",
      hackathon: "Web3 Builder Fest",
      rank: 1,
    },
    {
      id: 3,
      name: "AI Chatbot Assistant",
      description: "Intelligent assistant for daily task management",
      technologies: ["Python", "OpenAI", "Flask"],
      github: "github.com/user/ai-chatbot",
      demo: "ai-assistant.netlify.app",
      hackathon: "AI Innovation Challenge",
      rank: null,
    },
  ];

  const skills = [
    { name: "React", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "Python", level: 80 },
    { name: "TypeScript", level: 88 },
    { name: "Machine Learning", level: 75 },
    { name: "Blockchain", level: 70 },
    { name: "UI/UX Design", level: 65 },
    { name: "DevOps", level: 60 },
  ];

useEffect(() => {
  const savedView = localStorage.getItem("currentView");
  if (savedView) {
    setTimeout(() => setCurrentViewState(savedView), 0); // delay to avoid warning
  }
  fetchUserProfile();
}, []);

const fetchStreakData = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser?._id || !token) return;

    const res = await axios.get(`http://localhost:3000/api/users/${storedUser._id}/streaks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setStreakData(res.data);
  } catch (err) {
    console.error("Failed to fetch streaks:", err.message);
  }
};

useEffect(() => {
  const savedView = localStorage.getItem("currentView");
  if (savedView) {
    setTimeout(() => setCurrentViewState(savedView), 0);
  }
  fetchUserProfile();
  fetchStreakData(); // 👈 ADD THIS
}, []);






  const fetchUserProfile = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const userId = storedUser ? JSON.parse(storedUser)._id : null;
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        console.warn("Missing user ID or token.");
        return;
      }

      const res = await axios.get(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;

      setEditForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        bio: data.bio || "",
        website: data.website || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        profileImage: data.profileImage || "",
        bannerImage: data.bannerImage || "",
      });

      // Optional: update local context
      const updatedUser = { ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      login(updatedUser, token);
    } catch (err) {
      console.error("Failed to load user profile", err);
    }
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          {currentView === "overview" && "Profile Settings"}
          {currentView === "edit-profile" && "Edit Profile"}
          {currentView === "account-settings" && "Account Settings"}
          {currentView === "privacy-security" && "Privacy & Security"}
          {currentView === "help-support" && "Help & Support"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {currentView === "overview" && "Manage your account and preferences"}
          {currentView === "edit-profile" && "Update your personal information"}
          {currentView === "account-settings" &&
            "Configure your account preferences"}
          {currentView === "privacy-security" &&
            "Manage your privacy and security settings"}
          {currentView === "help-support" && "Get help and support resources"}
        </p>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="flex flex-col gap-6 w-full bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <Card className="w-full overflow-hidden relative rounded-2xl">
        {/* Banner */}
        <div className="relative h-48 w-full rounded-t-2xl overflow-hidden">
        <img
  src={user?.bannerImage || "/assets/default-banner.png"}
  alt="Banner"
  className="w-full h-full object-cover"
/>
      </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-16 z-10">
          <Avatar className="w-28 h-28 border-[3px] border-white shadow-xl">
            <AvatarImage src={user?.profileImage || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Info */}
        <CardHeader className="pt-4 pb-2 text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            {user?.name}
          </CardTitle>

          <div className="flex gap-2 pt-2 justify-center flex-wrap">
            <Badge
              variant="outline"
              className="bg-purple-100 text-purple-800 border-purple-300"
            >
             {user?.role || "Unknown"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-6 pb-6 text-sm text-gray-700">
          {/* Section: Personal Information */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Personal Information
            </h3>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <UserCircle2 className="w-4 h-4 text-indigo-500" />
                <span>{user?.name || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" />
                <span>{user?.email || "N/A"}</span>
              </div>
            </div>

            {/* Phone & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-500" />
                <span>{user?.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>{user?.location || "N/A"}</span>
              </div>
            </div>

            {/* Bio */}
            <div className="flex items-start gap-2 mt-3">
              <div className="pt-1">
                <Info className="w-4 h-4 text-indigo-500" />
              </div>
              <span className="whitespace-pre-wrap">
                {user?.bio || "No bio added yet."}
              </span>
            </div>
          </div>

          {/* Section: Social Links */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Social Links
            </h3>
            <div className="flex flex-wrap gap-4 text-indigo-600">
              {user?.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-indigo-800 transition"
                >
                  <Globe className="w-4 h-4" />
                  <span className="underline text-sm">Website</span>
                </a>
              )}
              {user?.github && (
                <a
                  href={user.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-indigo-800 transition"
                >
                  <Github className="w-4 h-4" />
                  <span className="underline text-sm">GitHub</span>
                </a>
              )}
              {user?.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-indigo-800 transition"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="underline text-sm">LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 text-center">
            <Trophy className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-indigo-600">
              {totalHackathons}
            </p>
            <p className="text-sm text-gray-600">Hackathons</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{totalWins}</p>
            <p className="text-sm text-gray-600">Wins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{totalBadges}</p>
            <p className="text-sm text-gray-600">Badges</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">#{currentRank}</p>
            <p className="text-sm text-gray-600">Global Rank</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Featured Projects</CardTitle>
          <CardDescription>Your best hackathon submissions</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {featuredProjects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {project.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    from {project.hackathon}
                  </p>
                </div>
                {project.rank && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-700 border-yellow-200"
                  >
                    #{project.rank}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="text-xs bg-indigo-100 text-indigo-700"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="default">
                  <Github className="w-3 h-3 mr-1" /> Code
                </Button>
                <Button size="sm" variant="default">
                  <ExternalLink className="w-3 h-3 mr-1" /> Demo
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <section className="py-10">
       <StreakGraphic
  data={streakData.activityLog}
  current={streakData.currentStreak}
  max={streakData.maxStreak}
/>

      </section>

      <Card>
        <CardHeader>
          <CardTitle>Skills & Technologies</CardTitle>
          <CardDescription>
            Your technical expertise across domains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-sm text-gray-500">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );



const renderEditProfile = () => (
  <div className="w-full flex flex-col gap-6">

    {/* Card with Banner and Avatar */}
    <Card className="w-full overflow-hidden relative">

      {/* Banner with Hover Edit */}
      <div className="relative h-48 w-full rounded-t-2xl overflow-hidden group">
        <img
          src={editForm.bannerImage || "/assets/default-banner.png"}
          alt="Banner"
          className="w-full h-full object-cover"
        />

        {/* Edit Banner Icon */}
        <button
          onClick={() => document.getElementById("upload-banner-edit").click()}
          className="absolute top-2 right-2 bg-white text-gray-700 p-1 rounded-full shadow-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition"
          title="Edit Banner"
        >
          <SquarePen className="w-4 h-4" />
        </button>
        <input
          type="file"
          id="upload-banner-edit"
          accept="image/*"
          className="hidden"
          onChange={handleBannerUpload}
        />
      </div>

      {/* Avatar with Hover Edit */}
      <div className="relative flex justify-center -mt-16 z-10 group">
        <Avatar className="w-28 h-28 border-[3px] border-white shadow-xl">
          <AvatarImage src={editForm.profileImage || "/placeholder.svg"} />
          <AvatarFallback className="text-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Edit Profile Icon */}
        <button
          onClick={() => document.getElementById("upload-avatar").click()}
          className="absolute bottom-2 right-[calc(50%-14px)] bg-white text-gray-700 p-1 rounded-full shadow-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition"
          title="Edit Profile Picture"
        >
          <SquarePen className="w-4 h-4" />
        </button>
        <input
          type="file"
          id="upload-avatar"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* User Info */}
      <CardHeader className="text-center pt-2">
        <CardTitle className="text-xl font-semibold">{user?.name}</CardTitle>
        <CardDescription>   {user?.role || "Unknown"}</CardDescription>

        {uploadSuccess && (
          <div className="mt-2 px-4 py-2 rounded bg-green-100 text-green-700 text-sm border border-green-300">
            ✅ Image uploaded successfully!
          </div>
        )}
      </CardHeader>
    </Card>


    {/* Personal Information Section */}
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
          <div className="w-full sm:w-[48%]">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
          </div>
          <div className="w-full sm:w-[48%]">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
            />
          </div>
          <div className="w-full sm:w-[48%]">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
            />
          </div>
          <div className="w-full sm:w-[48%]">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={editForm.location}
              onChange={(e) =>
                setEditForm({ ...editForm, location: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={3}
            value={editForm.bio}
            onChange={(e) =>
              setEditForm({ ...editForm, bio: e.target.value })
            }
          />
        </div>
      </CardContent>
    </Card>

    {/* Social Links Section */}
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
        <CardDescription>
          Add your social media and professional links
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="w-full">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={editForm.website}
            onChange={(e) =>
              setEditForm({ ...editForm, website: e.target.value })
            }
          />
        </div>
        <div className="w-full">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            value={editForm.github}
            onChange={(e) =>
              setEditForm({ ...editForm, github: e.target.value })
            }
          />
        </div>
        <div className="w-full">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            value={editForm.linkedin}
            onChange={(e) =>
              setEditForm({ ...editForm, linkedin: e.target.value })
            }
          />
        </div>
      </CardContent>
    </Card>

    {/* Save + Cancel Actions */}
    <div className="flex flex-col sm:flex-row gap-3 justify-start">
      <Button
        onClick={handleSaveChanges}
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        <Save className="w-4 h-4" />
        Save Changes
      </Button>
      <Button
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => setCurrentView("overview")}
      >
        Cancel
      </Button>
    </div>
  </div>
);


  const renderAccountSettings = () => (
    <div className="w-full flex flex-col gap-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {[
            {
              label: "Email Notifications",
              desc: "Receive notifications via email",
              value: emailUpdates,
              setter: setEmailUpdates,
            },
            {
              label: "Push Notifications",
              desc: "Receive push notifications in browser",
              value: notifications,
              setter: setNotifications,
            },
            {
              label: "SMS Notifications",
              desc: "Receive important updates via SMS",
              value: false,
              setter: () => {},
            },
          ].map(({ label, desc, value, setter }) => (
            <div className="flex items-center justify-between" key={label}>
              <div>
                <span className="text-sm font-medium">{label}</span>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <Switch checked={value} onCheckedChange={setter} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Account Preferences</CardTitle>
          <CardDescription>Customize your account experience</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Dark Mode</span>
              <p className="text-xs text-gray-500">
                Use dark theme across the platform
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Auto-save Drafts</span>
              <p className="text-xs text-gray-500">
                Automatically save your work
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="w-full sm:w-auto">Save Preferences</Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => setCurrentView("overview")}
        >
          Back to Overview
        </Button>
      </div>
    </div>
  );

 const renderPrivacySecurity = () => (
  <div className="w-full flex flex-col gap-6">
    {/* Password Section */}
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Password & Authentication</CardTitle>
        <CardDescription>Manage your login credentials</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Show Current Password only if registered via email */}
        {user?.authProvider === "email" && (
          <div className="relative">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-6 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        )}

        {/* New Password */}
        <div>
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* Confirm New Password */}
        <div>
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          className="flex items-center gap-2 w-full sm:w-auto"
          onClick={handlePasswordUpdate}
        >
          <Lock className="w-4 h-4" />
          Update Password
        </Button>
      </CardContent>
    </Card>

      {/* 2FA Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Enable 2FA</span>
              <p className="text-xs text-gray-500">
                Secure your account with two-factor authentication
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>
          {twoFactorEnabled && (
            <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
              2FA is enabled. Use your authenticator app to sign in.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control your data and visibility</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {[
            {
              label: "Profile Visibility",
              desc: "Make your profile visible to other users",
              defaultChecked: true,
            },
            {
              label: "Activity Status",
              desc: "Show when you're online",
              defaultChecked: false,
            },
          ].map(({ label, desc, defaultChecked }) => (
            <div className="flex items-center justify-between" key={label}>
              <div>
                <span className="text-sm font-medium">{label}</span>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <Switch defaultChecked={defaultChecked} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="w-full sm:w-auto">Save Security Settings</Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => setCurrentView("overview")}
        >
          Back to Overview
        </Button>
      </div>
    </div>
  );

  
  const renderHelpSupport = () => (
    <div className="w-full flex flex-col gap-6">
      {/* FAQ */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {[
            [
              "How do I join a hackathon?",
              "Browse events, click one, and follow registration steps.",
            ],
            [
              "How do I submit my project?",
              "Go to My Submissions > Submit Project > fill GitHub, video, description.",
            ],
            [
              "How do I organize a hackathon?",
              "Switch to organizer view > Create Hackathon > fill and publish.",
            ],
          ].map(([q, a]) => (
            <details key={q} className="group border rounded-md">
              <summary className="flex justify-between items-center p-3 cursor-pointer bg-gray-50">
                <span className="font-medium">{q}</span>
                <span className="transition group-open:rotate-180">↓</span>
              </summary>
              <div className="p-3 text-sm text-gray-600">{a}</div>
            </details>
          ))}
        </CardContent>
      </Card>

      {/* Support Channels */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>Reach out to us for help</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Email Support</span>
            </div>
            <p className="text-sm text-gray-600">Get a reply within 24 hours</p>
            <Button variant="outline" size="sm">
              support@hackzen.com
            </Button>
          </div>
          <div className="flex-1 border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-500" />
              <span className="font-medium">Live Chat</span>
            </div>
            <p className="text-sm text-gray-600">Chat with us live</p>
            <Button variant="outline" size="sm">
              Start Chat
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>Helpful guides and docs</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "📚 User Guide",
            "🎥 Video Tutorials",
            "💡 Best Practices",
            "🔧 API Docs",
          ].map((txt) => (
            <Button
              key={txt}
              variant="outline"
              className="justify-start w-full"
            >
              {txt}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Button
        variant="default"
        className="w-full sm:w-auto"
        onClick={() => setCurrentView("overview")}
      >
        Back to Overview
      </Button>
    </div>
  );

const handleSaveChanges = async () => {
  if (!user?._id || !token) {
    alert("User not logged in. Please log in again.");
    return;
  }

  const updates = {
    name: editForm.name,
    email: editForm.email,
    phone: editForm.phone,
    location: editForm.location,
    bio: editForm.bio,
    website: editForm.website,
    github: editForm.github,
    linkedin: editForm.linkedin,
    profileImage: editForm.profileImage || selectedImage,
    bannerImage: editForm.bannerImage || selectedBanner,
  };

  try {
    const res = await axios.put(
      `http://localhost:3000/api/users/${user._id}`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedUser = res.data;

    // 🔄 Sync context and localStorage
    login(updatedUser, token);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setCurrentView("overview");
    alert("Profile updated successfully!");
  } catch (err) {
    console.error("Error updating profile:", err);
    alert("Failed to update profile");
  }
};


 const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  setIsUploading(true); // ⏳ Start loading

  try {
    const uploadRes = await axios.post(
      "http://localhost:3000/api/uploads/image",
      formData
    );
    const imageUrl = uploadRes.data.url;

    setSelectedImage(null);
    setEditForm((prev) => ({ ...prev, profileImage: imageUrl }));

    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (userData?._id && token) {
      await axios.put(
        `http://localhost:3000/api/users/${userData._id}`,
        { profileImage: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ Update local storage and auth context
      const updatedUser = { ...userData, profileImage: imageUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      login(updatedUser, token);
    }

    // ✅ Show success notification
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000); // Auto-hide after 3s
  } catch (err) {
    console.error("Image upload failed:", err);
    alert("Failed to upload image");
  } finally {
    setIsUploading(false); // ✅ Stop loading
  }
};

const handleBannerUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setIsUploading(true);
  const formData = new FormData();
  formData.append("image", file);
  setIsUploading(true);

  try {
    const uploadRes = await axios.post("http://localhost:3000/api/uploads/image", formData);
    const imageUrl = uploadRes.data.url;

    setSelectedBanner(imageUrl);
    setEditForm((prev) => ({ ...prev, bannerImage: imageUrl }));

    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (userData?._id && token) {
      await axios.put(
        `http://localhost:3000/api/users/${userData._id}`,
        { bannerImage: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedUser = { ...userData, bannerImage: imageUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      login(updatedUser, token);
    }

   setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  } catch (err) {
    console.error("Banner upload failed:", err);
    alert("Failed to upload banner");
  } finally {
    setIsUploading(false);
  }
};


const handlePasswordUpdate = async () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!userData?._id || !token) {
    alert("Missing user session. Please re-login.");
    return;
  }

  if (!newPassword || newPassword !== confirmPassword) {
    alert("❌ Passwords do not match or are empty");
    return;
  }

  try {
    const res = await axios.put(
      `http://localhost:3000/api/users/${userData._id}/password`,
      {
        currentPassword, // Optional if OAuth
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err) {
    alert(err.response?.data?.message || "Error updating password");
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        {renderHeader()}

        <div className="flex flex-col gap-8">
          {/* Horizontal Tab Navigation */}
          <div className="flex flex-wrap gap-2 justify-start">
            <Button
              variant={currentView === "overview" ? "default" : "outline"}
              onClick={() => setCurrentView("overview")}
            >
              Overview
            </Button>
            <Button
              variant={currentView === "edit-profile" ? "default" : "outline"}
              onClick={() => setCurrentView("edit-profile")}
            >
              Edit Profile
            </Button>
            <Button
              variant={
                currentView === "account-settings" ? "default" : "outline"
              }
              onClick={() => setCurrentView("account-settings")}
            >
              Account Settings
            </Button>
            <Button
              variant={
                currentView === "privacy-security" ? "default" : "outline"
              }
              onClick={() => setCurrentView("privacy-security")}
            >
              Privacy & Security
            </Button>
            <Button
              variant={currentView === "help-support" ? "default" : "outline"}
              onClick={() => setCurrentView("help-support")}
            >
              Help & Support
            </Button>
          </div>

          {/* View Renderer */}
          <div className="flex-1 space-y-6">
            {currentView === "overview" && renderOverview()}
            {currentView === "edit-profile" && renderEditProfile()}
            {currentView === "account-settings" && renderAccountSettings()}
            {currentView === "privacy-security" && renderPrivacySecurity()}
            {currentView === "help-support" && renderHelpSupport()}
          </div>
        </div>
      </div>
    </div>
  );
}