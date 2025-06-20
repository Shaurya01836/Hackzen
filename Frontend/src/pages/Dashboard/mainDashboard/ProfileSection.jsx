"use client";

import { useState, useEffect } from "react";
import axios from "axios";
// adjust path if needed
import {
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
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../AdimPage/components/ui/card";
import { Button } from "../AdimPage/components/ui/button";
import { Badge } from "../AdimPage/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../AdimPage/components/ui/avatar";
import { Switch } from "../AdimPage/components/ui/switch";
import { Input } from "../AdimPage/components/ui/input";
import { Label } from "../AdimPage/components/ui/label";
import { Textarea } from "../AdimPage/components/ui/textarea";
import { useAuth } from "../../../context/AuthContext";
import { Progress } from "../AdimPage/components/ui/progress";
import StreakGraphic from "../AdimPage/components/ui/StreakGraphic";

export function ProfileSection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentView, setCurrentView] = useState("overview");
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const { user, login } = useAuth();

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    github: "",
    linkedin: "",
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
    const fetchUserProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const userId = storedUser ? JSON.parse(storedUser)._id : null;
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          console.warn("⚠️ Missing user ID or token.");
          return;
        }

        const res = await axios.get(
          `http://localhost:3000/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;

        setEditForm((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          website: data.website || "",
          github: data.githubUsername
            ? `https://github.com/${data.githubUsername}`
            : "",
          linkedin: data.linkedin || "",
          profileImage: data.profileImage || "",
        }));

        // 🔄 Optional: refresh global user context with latest profileImage
        const updatedUser = { ...user, profileImage: data.profileImage };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        login(updatedUser, token);
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };

    fetchUserProfile();
  }, []);

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
    <div className="flex flex-col gap-6 w-full p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <Card className="w-full overflow-hidden shadow-lg border-none relative">
        {/* Banner */}
        <div className="relative h-36 w-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl">
          <div className="absolute inset-0 opacity-20 bg-[url('/banner-pattern.svg')] bg-cover bg-center rounded-b-2xl" />
        </div>

        {/* Avatar Overlap */}
        <div className="flex justify-center -mt-14 z-10">
          <Avatar className="w-28 h-28 border-2 border-indigo-300 shadow-md">
            <AvatarImage src={user?.profileImage || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Details */}
        <CardHeader className="pt-2">
          <div className="flex flex-col items-center space-y-2">
            <CardTitle className="text-xl">{user?.name}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
            <div className="flex gap-2 mt-2 justify-center flex-wrap">
              <Badge className="bg-indigo-100 text-indigo-700" variant="secondary">Participant</Badge>
           
            </div>
          </div>
        </CardHeader>
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
                  <Badge key={tech} variant="outline" className="text-xs bg-indigo-100 text-indigo-700">
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
        <StreakGraphic />
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
      {/* Profile Picture Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile photo</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="w-32 h-32">
            <AvatarImage
              src={
                editForm.profileImage ||
                user?.profileImage ||
                "/placeholder.svg"
              }
            />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>

          <input
            type="file"
            accept="image/*"
            id="upload-avatar"
            className="hidden"
            onChange={handleImageUpload}
          />

          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("upload-avatar").click()}
            >
              <Edit className="w-3 h-3 mr-1" />
              Upload New Image
            </Button>
          </div>
        </CardContent>
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
          {[
            {
              id: "current-password",
              label: "Current Password",
              type: showPassword ? "text" : "password",
            },
            { id: "new-password", label: "New Password", type: "password" },
            {
              id: "confirm-password",
              label: "Confirm New Password",
              type: "password",
            },
          ].map(({ id, label, type }) => (
            <div key={id} className="relative">
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                type={type}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
              {id === "current-password" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-6 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          ))}
          <Button className="flex items-center gap-2 w-full sm:w-auto">
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
    let userId = null;
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      userId = userData?._id;
    } catch (e) {
      console.error("❌ Failed to parse user from localStorage", e);
    }

    const token = localStorage.getItem("token");

    if (!userId || !token) {
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
      githubUsername: editForm.github.replace("https://github.com/", ""),
      linkedin: editForm.linkedin,
      profileImage: editForm.profileImage || selectedImage, // include image
    };

    console.log("👤 userId:", userId);
    console.log("🔐 token:", token);
    console.log("📦 updates:", updates);

    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/${userId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Update response:", res.data);
      alert("Profile updated successfully!");
      setCurrentView("overview");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Failed to update profile.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadRes = await axios.post(
        "http://localhost:3000/api/uploads/image",
        formData
      );
      const imageUrl = uploadRes.data.url;

      setSelectedImage(null);
      setEditForm((prev) => ({ ...prev, profileImage: imageUrl }));

      // ✅ update user profile in MongoDB immediately
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if (userData?._id && token) {
        await axios.put(
          `http://localhost:3000/api/users/${userData._id}`,
          { profileImage: imageUrl },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // ✅ ensure correct content type
            },
          }
        );

        // Update localStorage and context user
        const updatedUser = { ...userData, profileImage: imageUrl };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        login(updatedUser, token);
      }
      alert("Image uploaded successfully!");
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image");
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
