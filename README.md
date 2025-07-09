# STPI-Project
Hackathon Management System

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/Home/LandingPage";
import NotFound from "./pages/Notfound";
import Page from "./pages/AdminDashboard/AdminPanel";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DashboardPage from "./pages/mainDashboard/Page";
import OAuthSuccess from "./pages/OAuthSuccess";
import Loader from "./pages/Loader";
import About from "./pages/Home/About";
import HackathonDetailsPage from "./pages/AdminDashboard/sections/HackathonDetailsPage";
import { ExploreHackathons } from "./pages/mainDashboard/sections/ExploreHackathon";
import AdminPanel from "./pages/AdminDashboard/AdminPanel";
import { ProfileSection } from "./pages/mainDashboard/ProfileSection";
import { Blogs } from "./pages/mainDashboard/sections/Blogs";
import InviteAccept from "./pages/InviteAccept";
import InviteRole from "./pages/InviteRole";
// import { MyHackathons } from "./pages/mainDashboard/sections/Myhackthon";
import { HackathonDetails } from "./pages/mainDashboard/sections/HackathonDetails";
import JudgePanel from "./pages/Judge/JudgePanel";
import { ProjectArchive } from "./pages/mainDashboard/sections/ProjectArchive";


function App() {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Routes>
      {/* Landing and auth */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/about" element={<About />} />
      <Route path="/loader" element={<Loader />} />

      {/* Admin */}
      <Route path="/admin/hackathons/:id" element={<HackathonDetailsPage />} />
      <Route path="/admin/:section" element={<AdminPanel />} />
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
<Route path="/dashboard/project-archive/:id" element={<DashboardPage />} />
<Route path="/dashboard/exploreh/:id" element={<DashboardPage />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={<Navigate to="/dashboard/profile" replace />}
      />
      <Route path="/dashboard/:section" element={<DashboardPage />} />
      <Route
        path="/dashboard/hackathon/:id"
        element={<HackathonDetailsPage />}
      />
      <Route path="/dashboard/blogs/:id" element={<DashboardPage />} />
      <Route path="/dashboard/my-hackathons" element={<DashboardPage />} />
      <Route path="/dashboard/my-hackathons/:projectId" element={<DashboardPage />} />

      {/* Explore */}
      <Route path="/explore" element={<ExploreHackathons />} />
      <Route path="/explore/:id" element={<HackathonDetailsPage />} />

      {/* Profile */}
      <Route path="/dashboard/profile" element={<DashboardPage />} />
      <Route path="/dashboard/profile/edit" element={<DashboardPage />} />
      <Route
        path="/dashboard/profile/account-settings"
        element={<DashboardPage />}
      />
      <Route
        path="/dashboard/profile/privacy-security"
        element={<DashboardPage />}
      />
      <Route
        path="/dashboard/profile/help-support"
        element={<DashboardPage />}
      />
      <Route path="/invite/:inviteId" element={<InviteAccept />} />
      <Route path="/invite/role" element={<InviteRole />} />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />

      <Route path="/judge" element={<JudgePanel />} />
    </Routes>
    </>
  );
}

export default App;
       

"use client";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { cn } from "../../lib/utils";
import axios from "axios";
import {
  Users,
  Trophy,
  MessageSquare,
  User,
  Plus,
  LogOut,
  FileText,
  Settings,
  Eye,
  Search,
  Archive,
  Building,
  UsersRoundIcon,
  NotebookTabs,
  Wrench,
  PencilRulerIcon,
  Fuel,
  CalendarX,
  Gavel,
  ShieldCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/DashboardUI/sidebar";

import { useAuth } from "../../context/AuthContext";
// Sections
import { ProfileSection } from "./ProfileSection";
import { MySubmissions } from "./sections/MySubmissions";
import { ChatRooms } from "./sections/Chat-rooms";
import { CreatedHackathons } from "./sections/Created-hackathons";
import { ParticipantOverview } from "./sections/ParticipantOverview";
import { ReviewSubmissions } from "./sections/ReviewSubmissions";
import { Announcements } from "./sections/Announcements";
import { OrganizerTools } from "./sections/OrganizerTools";
import { ExploreHackathons } from "./sections/ExploreHackathon";
import { CreateHackathon } from "./sections/Create-hackathon";
import { OrganizationHub } from "./sections/OrganizationHub";
import { Blogs } from "./sections/Blogs";
import { ProjectArchive } from "./sections/ProjectArchive";
import MyHackathon from "./sections/Myhackthon";
import JudgePanel from "../JudgePanel/JudgePage";
import DashboardJudgePanel from "../Judge/JudgePanel";
import CertificatesPage from "./sections/CertificatePage";

export default function HackZenDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  // Extract the active section from the current URL path
  const getActiveSectionFromPath = () => {
    const path = location.pathname;
    // Extract section from /dashboard/section pattern
    const match = path.match(/^\/dashboard\/([^\/]+)/);
    return match ? match[1] : "profile";
  };

  const [currentView, setCurrentView] = useState(getActiveSectionFromPath());

  const { user, refreshUser } = useAuth();

  // Debug: Log user role for troubleshooting
  console.log("Dashboard - Current user:", user);
  console.log("Dashboard - User role:", user?.role);

  // Function to handle section changes with nested URLs
  const changeView = (viewKey) => {
    setCurrentView(viewKey);
    navigate(`/dashboard/${viewKey}`);
  };

  // Function to navigate to home page
  const navigateToHome = () => {
    navigate("/");
  };

  // Set default route on component mount
  useEffect(() => {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/dashboard/"
    ) {
      navigate("/dashboard/profile", { replace: true });
    }
    // Update currentView when URL changes
    setCurrentView(getActiveSectionFromPath());
  }, [location.pathname, navigate, params.section]);

  const participantMenuItems = [
    {
      title: "Profile",
      icon: User,
      key: "profile",
      onClick: () => changeView("profile"),
    },
    {
      title: "My Hackathons",
      icon: Trophy,
      key: "my-hackathons",
      onClick: () => changeView("my-hackathons"),
    },
    {
      title: "My Submissions",
      icon: FileText,
      key: "my-submissions",
      onClick: () => changeView("my-submissions"),
    },
    {
      title: "Explore Hackathons",
      icon: Search,
      key: "explore-hackathons",
      onClick: () => changeView("explore-hackathons"),
    },
    {
      title: "My Community",
      icon: UsersRoundIcon,
      key: "my-community",
      onClick: () => changeView("my-community"),
    },
    // {
    //   title: "Chat Rooms",
    //   icon: MessageSquare,
    //   key: "chat-rooms",
    //   onClick: () => changeView("chat-rooms"),
    // },
    {
      title: "Blogs",
      icon: NotebookTabs,
      key: "blogs",
      onClick: () => changeView("blogs"),
    },
    {
      title: "Project Archive",
      icon: Archive,
      key: "project-archive",
      onClick: () => changeView("project-archive"),
    },
    {
      title: "Organization Hub",
      icon: Building,
      key: "organization-hub",
      onClick: () => changeView("organization-hub"),
    },
  ];

  const organizerMenuItems = [
    {
      title: "Organizer Tools",
      icon: Settings,
      key: "organizer-tools",
      onClick: () => changeView("organizer-tools"),
    },
    {
      title: "Hackathons",
      icon: CalendarX,
      key: "created-hackathons", // ✅ keep this
      onClick: () => changeView("created-hackathons"),
    },
    {
      title: "Participant Overview",
      icon: Users,
      key: "participant-overview",
      onClick: () => changeView("participant-overview"),
    },
    {
      title: "Create Hackathons",
      icon: PencilRulerIcon,
      key: "create-hackathon", // ✅ FIX this key!
      onClick: () => changeView("create-hackathon"),
    },
    {
      title: "Review Submissions",
      icon: Eye,
      key: "review-submissions",
      onClick: () => changeView("review-submissions"),
    },
    {
      title: "Announcements",
      icon: MessageSquare,
      key: "announcements",
      onClick: () => changeView("announcements"),
    },
    {
      title: "Certificate Page",
      icon: ShieldCheck,
      key: "certificate-page",
      onClick: () => changeView("certificate-page"),
    },
  ];

  const judgeMenuItems = [
    {
      title: "Judge Panel",
      icon: Gavel,
      key: "judge-panel",
      onClick: () => changeView("judge-panel"),
    },
    {
      title: "My Judgments",
      icon: FileText,
      key: "my-judgments",
      onClick: () => changeView("my-judgments"),
    },
  ];


  // Function to render content based on current view
  const renderContent = () => {
    switch (currentView) {
      case "profile":
        return (
          <ProfileSection
            userName="John Doe"
            userEmail="john@example.com"
            userAvatar="/placeholder.svg?height=96&width=96"
            onBack={() => changeView("profile")}
          />
        );
      case "my-hackathons":
        return <MyHackathon onBack={() => changeView("profile")} />;
      case "my-submissions":
        return <MySubmissions onBack={() => changeView("profile")} />;
      case "chat-rooms":
        return <ChatRooms onBack={() => changeView("profile")} />;
      case "explore-hackathons":
        return <ExploreHackathons onBack={() => changeView("profile")} />;
      case "organization-hub":
        return <OrganizationHub onBack={() => changeView("profile")} />;
      case "created-hackathons":
        return (
          <CreatedHackathons
            onBack={() => changeView("profile")}
            onCreateNew={() => changeView("create-hackathon")}
          />
        );
      case "participant-overview":
        return <ParticipantOverview onBack={() => changeView("profile")} />;
      case "review-submissions":
        return <ReviewSubmissions onBack={() => changeView("profile")} />;
      case "announcements":
        return <Announcements onBack={() => changeView("profile")} />;
      case "organizer-tools":
        return <OrganizerTools onBack={() => changeView("profile")} />;
      case "create-hackathon":
        return (
          <CreateHackathon onBack={() => changeView("profile")} />
        );
      case "blogs":
        return <Blogs onBack={() => changeView("profile")} />;
      case "project-archive":
        return <ProjectArchive onBack={() => changeView("profile")} />;
      case "my-community":
        return <div className="p-6">My Community Section - Coming Soon</div>;
      case "judge-panel":
        return <DashboardJudgePanel onBack={() => changeView("profile")} />;
      case "my-judgments":
        return <div className="p-6">My Judgments Section - Coming Soon</div>;

      case "certificate-page":
        return <CertificatesPage onBack={() => changeView("profile")} />;
      default:
        return (
          <ProfileSection
            userName="John Doe"
            userEmail="john@example.com"
            userAvatar="/placeholder.svg?height=96&width=96"
            onBack={() => changeView("profile")}
          />
        );
    }
  };

  useEffect(() => {
    const pingStreak = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          "http://localhost:3000/api/users/streak",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("✅ Streak pinged and user fetched:", res.data);
      } catch (err) {
        console.error("📉 Failed to track streak:", err);
      }
    };

    pingStreak();

    // Refresh user info to ensure we have the latest role
    refreshUser();
  }, [refreshUser]);

  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <SidebarHeader className="p-4">
          <div
            className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={navigateToHome}
          >
             <img
                src="https://res.cloudinary.com/dg2q2tzbv/image/upload/v1751960561/logo_bg_yvh9hq.png"
                alt="HackZen Logo"
                className="w-10 h-10 object-contain border rounded-full"
              />
            <div>
              <h1 className="text-xl font-bold text-gray-900">HackZen</h1>
              <p className="text-sm text-gray-500">Hackathon Platform</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {participantMenuItems.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={item.onClick}
                        className={cn(
                          "flex items-center gap-3 w-full text-left rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                          currentView === item.key
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-4 h-4",
                            currentView === item.key
                              ? "text-indigo-700"
                              : "text-gray-500"
                          )}
                        />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Organizer Menu - Only show to organizers, NOT to judges */}
          {user?.role === "organizer" && user?.role !== "judge" && (
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-purple-600">
                <Wrench className="w-4 h-4" />
                Organizer Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {organizerMenuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={item.onClick}
                          className={cn(
                            "flex items-center gap-3 w-full text-left rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                            currentView === item.key
                              ? "bg-indigo-100 text-indigo-700"
                              : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "w-4 h-4",
                              currentView === item.key
                                ? "text-indigo-700"
                                : "text-gray-500"
                            )}
                          />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Judge Menu - Show to judges */}
          {user?.role === "judge" && (
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-orange-600">
                <Gavel className="w-4 h-4" />
                Judge Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {judgeMenuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={item.onClick}
                          className={cn(
                            "flex items-center gap-3 w-full text-left rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                            currentView === item.key
                              ? "bg-orange-100 text-orange-700"
                              : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "w-4 h-4",
                              currentView === item.key
                                ? "text-orange-700"
                                : "text-gray-500"
                            )}
                          />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="p-4"></SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Dashboard</span>
            <span>/</span>
            <span className="capitalize">{currentView.replace("-", " ")}</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}




const User = require('../model/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Organization = require('../model/OrganizationModel');
const Score = require("../model/ScoreModel");
const Project = require("../model/ProjectModel");
const Hackathon = require("../model/HackathonModel");
// ✅ Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};
exports.getJudgeStats = async (req, res) => {
  try {
    const judgeId = req.user._id;

    const scores = await Score.find({ judge: judgeId });

    const judgedProjectIds = [...new Set(scores.map(s => s.project.toString()))];
    const hackathonIds = [...new Set(scores.map(s => s.hackathon.toString()))];

    const totalScores = scores.length;
    const avgRating =
      totalScores > 0
        ? (scores.reduce((sum, s) => {
            const avg = Object.values(s.scores).reduce((a, b) => a + b, 0) / 4;
            return sum + avg;
          }, 0) / totalScores).toFixed(2)
        : 0;

    res.json({
      totalHackathons: hackathonIds.length,
      totalSubmissions: judgedProjectIds.length,
      averageRating: parseFloat(avgRating),
      completedJudgments: totalScores,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch judge stats" });
  }
};

// ✅ Invite user to organization
const inviteToOrganization = async (req, res) => {
  const { email, role } = req.body;
  const inviter = req.user;

  try {
    if (!inviter.organization) {
      return res.status(403).json({ message: "Inviter must belong to an organization." });
    }

    const domain = email.split("@")[1];
    const inviterDomain = inviter.email.split("@")[1];
    const isSameDomain = domain === inviterDomain;

    if (inviter.role !== "admin" && !isSameDomain) {
      return res.status(403).json({ message: "Only same-domain invitations are allowed." });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        role,
        organization: inviter.organization,
        applicationStatus: "pending"
      });
    } else {
      user.role = role;
      user.organization = inviter.organization;
      user.applicationStatus = "pending";
    }

    await user.save();
    res.status(200).json({ message: "User invited successfully.", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Register a new user (email only)
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.applicationStatus === "pending" && !existingUser.passwordHash) {
        existingUser.name = name;
        existingUser.passwordHash = await bcrypt.hash(password, 10);
        existingUser.authProvider = "email";
        await existingUser.save();

        return res.status(200).json({
          user: {
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role
          },
          token: generateToken(existingUser)
        });
      }

      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const isAdminEmail = email === 'admin@rr.dev';

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      authProvider: 'email',
      role: isAdminEmail ? 'admin' : undefined,
      bannerImage: "/assets/default-banner.png"
    });

    res.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token: generateToken(newUser)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2FA check
    if (user.twoFA && user.twoFA.enabled) {
      return res.json({ require2FA: true, userId: user._id });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get single user by ID
// ✅ Get single user by ID (now includes registeredHackathonIds)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('badges hackathonsJoined projects organization registeredHackathonIds')
      .select('-passwordHash');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const saveHackathon = async (req, res) => {
  try {
    const userId = req.user._id;
    const { hackathonId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Toggle Save
    const index = user.savedHackathons.indexOf(hackathonId);
    if (index > -1) {
      user.savedHackathons.splice(index, 1); // Unsave
    } else {
      user.savedHackathons.push(hackathonId); // Save
    }

    await user.save();
    res.status(200).json({ message: "Saved hackathons updated", savedHackathons: user.savedHackathons });
  } catch (err) {
    console.error("Error saving hackathon:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ✅ Update user
const updateUser = async (req, res) => {
  try {
    const allowedFields = [
      "name", "phone", "location", "bio", "website", "github",
      "githubUsername", "linkedin", "profileImage", "bannerImage"
    ];

    if (req.user.role === "admin") {
      allowedFields.push("applicationStatus", "organization");
    }

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Change user role
const changeUserRole = async (req, res) => {
  try {
    const { newRole } = req.body;
    const validRoles = ['participant', 'organizer', 'mentor', 'judge', 'admin'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = newRole;
    await user.save();
    res.json({ message: `User role updated to ${newRole}`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Change password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.authProvider === "email") {
      if (!currentPassword || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
        return res.status(401).json({ message: "Incorrect current password" });
      }
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newHash;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ My org status (dashboard)
const getMyOrganizationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("organization");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      organization: user.organization,
      status: user.applicationStatus,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch organization info" });
  }
};

const getUserStreakData = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const sortedLog = user.activityLog.sort((a, b) => new Date(a) - new Date(b));
    let maxStreak = 0, currentStreak = 0, prevDate = null;

    sortedLog.forEach(date => {
      const currentDate = new Date(date);
      if (prevDate) {
        const diff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
        currentStreak = diff === 1 ? currentStreak + 1 : 1;
      } else {
        currentStreak = 1;
      }
      maxStreak = Math.max(maxStreak, currentStreak);
      prevDate = currentDate;
    });

    res.status(200).json({
      streaks: user.activityLog,
      current: currentStreak,
      max: maxStreak,
    });
  } catch (err) {
    console.error("Get streak error:", err);
    res.status(500).json({ message: "Failed to fetch streaks" });
  }
};

// ✅ Get current user info (for session refresh)
const getMe = async (req, res) => {
  try {
    console.log('=== getMe function called ===');
    console.log('req.user:', req.user);
    console.log('req.user._id:', req.user._id);
    console.log('req.user._id type:', typeof req.user._id);
    console.log('req.user._id toString:', req.user._id.toString());
    
    // First try without populate to see if the basic query works
    const user = await User.findById(req.user._id).select('-passwordHash');
    
    console.log('Database query result:', user);
    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Sending user response:', { _id: user._id, email: user.email, role: user.role });
    res.json(user);
  } catch (err) {
    console.error('getMe error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Admin Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get active users (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      lastLoginAt: { $gte: thirtyDaysAgo }
    });

    // Get new users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Calculate percentage change from last month
    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);
    const endOfLastMonth = new Date();
    endOfLastMonth.setDate(1);
    endOfLastMonth.setHours(0, 0, 0, 0);
    const newUsersLastMonth = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth }
    });

    const userGrowthPercentage = newUsersLastMonth > 0 
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth * 100).toFixed(1)
      : newUsersThisMonth > 0 ? 100 : 0;

    res.json({
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      userGrowthPercentage: userGrowthPercentage > 0 ? `+${userGrowthPercentage}%` : `${userGrowthPercentage}%`,
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item._id || 'user'] = item.count;
        return acc;
      }, {})
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get monthly user registration data for charts
const getMonthlyUserStats = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = monthlyStats.map(stat => ({
      month: monthNames[stat._id.month - 1],
      users: stat.count
    }));

    res.json(chartData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ User Role Breakdown for Pie Chart
const getUserRoleBreakdown = async (req, res) => {
  try {
    const roleBreakdown = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const roleColors = {
      participant: '#8B5CF6',
      organizer: '#3B82F6',
      mentor: '#10B981',
      judge: '#F59E0B',
    };

    const pieData = ["participant", "organizer", "mentor", "judge"].map(role => {
      const found = roleBreakdown.find(r => r._id === role);
      return {
        name: role.charAt(0).toUpperCase() + role.slice(1) + 's',
        value: found ? found.count : 0,
        color: roleColors[role]
      };
    });

    res.json(pieData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get judge stats for judge dashboard
const getJudgeStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get hackathons where user is a judge
    const RoleInvite = require('../model/RoleInviteModel');
    const judgeInvites = await RoleInvite.find({ 
      invitedUser: userId, 
      role: 'judge', 
      status: 'accepted' 
    }).populate('hackathon');
    
    const totalHackathons = judgeInvites.length;
    
    // For now, return mock data since we don't have submission/judgment models yet
    res.json({
      totalHackathons,
      totalSubmissions: 12, // Mock data
      averageRating: 4.2, // Mock data
      completedJudgments: 8 // Mock data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Test endpoint to check database connection
const testDatabase = async (req, res) => {
  try {
    console.log('=== Testing database connection ===');
    
    // Test basic user count
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);
    
    // Test finding a specific user by ID
    const testUserId = req.params.id || '686b6744dce4d0b41b175a04';
    console.log('Testing user lookup for ID:', testUserId);
    
    const testUser = await User.findById(testUserId);
    console.log('Test user found:', testUser ? { _id: testUser._id, email: testUser.email } : 'null');
    
    res.json({
      success: true,
      userCount,
      testUser: testUser ? { _id: testUser._id, email: testUser.email, role: testUser.role } : null
    });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  inviteToOrganization,
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserRole,
  changePassword,
  getMyOrganizationStatus,
  getUserStreakData,
  saveHackathon,
  getMe,
  getDashboardStats,
  getMonthlyUserStats,
  getUserRoleBreakdown,
  getJudgeStats,
};



const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');
const { protect, isAdmin, isOrganizerOrAdmin } = require('../middleware/authMiddleware');
const trackStreak = require("../middleware/trackStreak");
const User = require('../model/UserModel');

// 🔐 OAuth Routes
router.get('/github', (req, res, next) => {
  const redirectTo = req.query.redirectTo;
  const state = redirectTo ? Buffer.from(JSON.stringify({ redirectTo })).toString('base64') : undefined;
  passport.authenticate('github', { 
    scope: ['user:email'],
    state: state
  })(req, res, next);
});

router.get('/google', (req, res, next) => {
  const redirectTo = req.query.redirectTo;
  const state = redirectTo ? Buffer.from(JSON.stringify({ redirectTo })).toString('base64') : undefined;
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    state: state
  })(req, res, next);
});

router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/login',
  session: true,
}), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  // Get redirectTo from state parameter if present
  let redirectTo = null;
  if (req.query.state) {
    try {
      const stateData = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
      redirectTo = stateData.redirectTo;
    } catch (err) {
      console.warn('Failed to parse OAuth state:', err);
    }
  }
  
  const baseRedirectUrl = `http://localhost:5173/oauth-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&_id=${user._id}`;
  const redirectUrl = redirectTo ? `${baseRedirectUrl}&redirectTo=${encodeURIComponent(redirectTo)}` : baseRedirectUrl;
  
  res.redirect(redirectUrl);
});

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: true,
}), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  // Get redirectTo from state parameter if present
  let redirectTo = null;
  if (req.query.state) {
    try {
      const stateData = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
      redirectTo = stateData.redirectTo;
    } catch (err) {
      console.warn('Failed to parse OAuth state:', err);
    }
  }
  
  const baseRedirectUrl = `http://localhost:5173/oauth-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&_id=${user._id}`;
  const redirectUrl = redirectTo ? `${baseRedirectUrl}&redirectTo=${encodeURIComponent(redirectTo)}` : baseRedirectUrl;
  
  res.redirect(redirectUrl);
});

// ✉️ Auth
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// 🚪 Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('http://localhost:5173/');
    });
  });
});

// 👤 User Routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, isAdmin, userController.deleteUser);
router.patch('/:id/role', protect, isOrganizerOrAdmin, userController.changeUserRole);
router.put('/:id/password', protect, userController.changePassword);
router.get("/judge-stats", protect, userController.getJudgeStats);

// ✅ Get current user info (for session refresh)
router.get('/me', protect, userController.getMe);

// Test route removed for now to fix the server startup

// 🏢 Organization
router.post('/invite', protect, isOrganizerOrAdmin, userController.inviteToOrganization);
router.get('/me/organization', protect, userController.getMyOrganizationStatus);

// 🔥 Streak
router.get('/:id/streaks', protect, userController.getUserStreakData);
router.post("/streak", protect, trackStreak, (req, res) => {
  res.status(200).json({ message: "Streak tracked" });
});

// ✅ My Registered Hackathons (IDs only)
router.get('/me/registered-hackathons', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('registeredHackathonIds');
    res.json(user.registeredHackathonIds || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch registered hackathons" });
  }
});

// ✅ Save / Unsave Hackathon
router.post('/save-hackathon', protect, userController.saveHackathon);

// ✅ Get Saved Hackathons List (full populated data)
router.get('/me/saved-hackathons', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedHackathons');
    res.status(200).json(user.savedHackathons || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved hackathons" });
  }
});

// ✅ Admin Dashboard Routes
router.get('/admin/stats', protect, isAdmin, userController.getDashboardStats);
router.get('/admin/monthly-stats', protect, isAdmin, userController.getMonthlyUserStats);
router.get('/admin/role-breakdown', protect, isAdmin, userController.getUserRoleBreakdown);

// ✅ Judge Dashboard Routes
router.get('/judge-stats', protect, userController.getJudgeStats);

module.exports = router;







