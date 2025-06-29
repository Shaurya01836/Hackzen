"use client";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Calendar,
  Users,
  Trophy,
  MapPin,
  Clock,
  Star,
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  Globe,
  Building,
  Award,
  Target,
  Gift,
  MessageSquare,
  UserPlus,
  Download,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/DashboardUI/avatar";
import { Progress } from "../../../components/DashboardUI/progress";
import { HackathonRegistration } from "./RegistrationHackathon";
import axios from "axios";

// Mock animated card components
const ACard = Card;
const ACardContent = CardContent;
const ACardHeader = CardHeader;
const ACardTitle = CardTitle;

export function HackathonDetails({ hackathon, onBack, backButtonLabel }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  // Scroll to section and set active
  const handleSidebarClick = (sectionId) => {
    scrollToSection(sectionId);
    setActiveSection(sectionId);
    if (isMobile) setSidebarOpen(false);
  };

  const sectionRefs = {
    overview: useRef(null),
    problems: useRef(null),
    prizes: useRef(null),
    timeline: useRef(null),
    faqs: useRef(null),
    team: useRef(null),
    community: useRef(null),
  };

  const sections = [
    { id: "overview", label: "Overview & Requirements", icon: Target },
    { id: "problems", label: "Problems", icon: AlertCircle },
    { id: "prizes", label: "Prizes & Perks", icon: Trophy },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
    { id: "team", label: "Team Management", icon: Settings },
    { id: "community", label: "Community", icon: Users },
  ];

  useEffect(() => {
    const fetchRegisteredHackathons = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/registration/my",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const registered = res.data.some(
          (r) => r.hackathonId._id === hackathon._id // or r.hackathonId === hackathon._id if not populated
        );

        setIsRegistered(registered);
      } catch (err) {
        console.error("Error fetching registered hackathons", err);
      }
    };

    fetchRegisteredHackathons();
  }, [hackathon._id]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (sectionId) => {
    sectionRefs[sectionId].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500";
      case "Intermediate":
        return "bg-yellow-500";
      case "Advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Registration Open":
        return "bg-green-500";
      case "Ongoing":
        return "bg-blue-500";
      case "Ended":
        return "bg-gray-500";
      default:
        return "bg-yellow-500";
    }
  };

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/registration',
        {
          hackathonId: hackathon._id,
          formData: { acceptedTerms: true }, // if your backend needs formData
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsRegistered(true);
    } catch (err) {
      console.error("Failed to register:", err);
    }
  };
  
  const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("http://localhost:3000/api/users/save-hackathon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ hackathonId: hackathon._id }),
    });

    const data = await res.json();
    if (res.ok) {
      setIsSaved(data.savedHackathons.includes(hackathon._id));
    }
  } catch (err) {
    console.error("Error saving hackathon:", err);
  }
};


  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
    setIsRegistered(true);
  };

  const handleBackFromRegistration = () => {
    setShowRegistration(false);
  };

  // Registration status logic
  const now = new Date();
  const registrationDeadline = new Date(hackathon.registrationDeadline || hackathon.registrationDeadline);
  const maxParticipants = hackathon.maxParticipants || 100;
  const currentParticipants = hackathon.participants || 0;

  const isRegistrationClosed = registrationDeadline < now;
  const isRegistrationFull = currentParticipants >= maxParticipants;

  if (showRegistration) {
    return (
      <HackathonRegistration
        hackathon={hackathon}
        onBack={handleBackFromRegistration}
        onSuccess={handleRegistrationSuccess}
      />
    );
  }

  // Mock hackathon data for demo
  const mockHackathon = {
    name: "AI Innovation Challenge 2024",
    organizer: "TechCorp",
    prize: "$50,000",
    participants: 1250,
    maxParticipants: 2000,
    rating: 4.8,
    reviews: 324,
    registrationDeadline: "Dec 15, 2024",
    startDate: "Jan 10, 2025",
    endDate: "Jan 12, 2025",
    location: "Virtual Event",
    category: "Artificial Intelligence",
    difficulty: "Intermediate",
    status: "Registration Open",
    description:
      "Join us for an exciting 48-hour hackathon focused on building innovative AI solutions that can make a real impact on society. Whether you're interested in machine learning, natural language processing, computer vision, or any other AI domain, this is your chance to showcase your skills and creativity.",
    requirements: [
      "Basic programming knowledge",
      "Familiarity with AI/ML concepts",
      "Team of 2-4 members",
      "Original code only",
    ],
    tags: [
      "AI",
      "Machine Learning",
      "Python",
      "TensorFlow",
      "React",
      "Node.js",
    ],
    perks: [
      "Mentorship from industry experts",
      "Access to premium APIs and tools",
      "Networking opportunities",
      "Certificate of participation",
      "Swag kit for all participants",
    ],
    problemStatements: [
      "Develop an AI-powered solution for sustainable agriculture",
      "Create a machine learning model for healthcare diagnosis",
      "Build an intelligent system for smart city management",
    ],
    featured: true,
    sponsored: true,
    images: {
      banner: {
        url: "/placeholder.svg?height=400&width=800",
      },
    },
  };

  const currentHackathon = hackathon || mockHackathon;

  if (showRegistration) {
    return (
      <div className="fixed inset-0 z-50 overflow-auto">
        <div className="p-6">
          <Button onClick={handleBackFromRegistration} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Details
          </Button>
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
              Register for {currentHackathon.name}
            </h1>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-gray-600 mb-4">
                  Registration form would go here
                </p>
                <Button onClick={handleRegistrationSuccess} className="w-full">
                  Complete Registration
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar
  const Sidebar = (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-64 z-30 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 border-r 
        flex flex-col py-10
        transition-transform duration-300
        ${sidebarOpen || !isMobile ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <nav className="flex-1 px-4 space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => handleSidebarClick(section.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 font-semibold shadow border-l-4 border-indigo-500"
                    : "text-gray-600 hover:bg-gray-100 hover:text-indigo-700"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-indigo-500" : "text-gray-400"
                }`}
              />
              <span className="text-base">{section.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );

  // Header
  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 min-h-screen">
      {/* Fixed, centered header */}
      <header
        className={`
          fixed top-0 left-0 w-full flex justify-center z-40 transition-transform duration-300
          ${showHeader ? "translate-y-0" : "-translate-y-32"}
        `}
        style={{ height: 110 }}
      >
        <div className=" w-full pl-64">
          <div className="flex items-center justify-between h-[110px] bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 border-b px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="default"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {backButtonLabel || "Back to Explore"}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentHackathon.name}
                </h1>
                <p className="text-sm text-gray-500">
                  by {currentHackathon.organizer}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className={`flex items-center gap-2 ${
                  isSaved ? "text-red-500 border-red-500" : ""
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              {isRegistrationClosed ? (
                <Badge className="bg-red-500 text-white">Registration Closed</Badge>
              ) : isRegistrationFull && !isRegistered ? (
                <Badge className="bg-red-500 text-white">Registration Full</Badge>
              ) : isRegistered ? (
                <Badge className="bg-green-500 text-white">Registered</Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setShowRegistration(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Register
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar and main content */}
      <div className="flex pt-10 bg-gradient-to-r from-gray-50 to-slate-50">
        {Sidebar}
        <main className="flex-1 ml-0 transition-all duration-300">
          <div className="p-6 md:p-10 space-y-16 w-full mx-auto">
            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main Image */}
              <div className="lg:col-span-2">
                <div className="relative rounded-xl overflow-hidden shadow">
                  <img
                    src={
                      currentHackathon.images?.banner?.url ||
                      "/placeholder.svg?height=400&width=800"
                    }
                    alt={currentHackathon.name}
                    className="object-cover w-full h-56 md:h-[550px]"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {currentHackathon.featured && (
                      <Badge className="bg-purple-500">Featured</Badge>
                    )}
                    {currentHackathon.sponsored && (
                      <Badge
                        variant="outline"
                        className="border-yellow-500 text-yellow-600 bg-white"
                      >
                        Sponsored
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Badge
                      className={`${getStatusColor(
                        currentHackathon.status
                      )} text-white`}
                    >
                      {currentHackathon.status}
                    </Badge>
                  </div>
                </div>
              </div>
              {/* Quick Info Card */}
              <div className="space-y-4">
                <ACard>
                  <ACardHeader>
                    <ACardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Prize Pool
                    </ACardTitle>
                  </ACardHeader>
                  <ACardContent>
                    <p className="text-3xl font-bold text-green-600">
                      {currentHackathon.prize}
                    </p>
                    <p className="text-sm text-gray-500">Total rewards</p>
                  </ACardContent>
                </ACard>

                <ACard>
                  <ACardHeader>
                    <ACardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      Participation
                    </ACardTitle>
                  </ACardHeader>
                  <ACardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Registered</span>
                      <span>
                        {currentHackathon.participants}/
                        {currentHackathon.maxParticipants}
                      </span>
                    </div>
                    <Progress
                      value={
                        (currentHackathon.participants /
                          currentHackathon.maxParticipants) *
                        100
                      }
                      className="h-2"
                    />
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">
                          {currentHackathon.rating}
                        </span>
                      </div>
                      <span className="text-gray-500">
                        ({currentHackathon.reviews} reviews)
                      </span>
                    </div>
                  </ACardContent>
                </ACard>

                <ACard>
                  <ACardHeader>
                    <ACardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      Important Dates
                    </ACardTitle>
                  </ACardHeader>
                  <ACardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Registration Deadline:
                      </span>
                      <span className="font-medium">
                        {currentHackathon.registrationDeadline}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event Start:</span>
                      <span className="font-medium">
                        {currentHackathon.startDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Event End:</span>
                      <span className="font-medium">
                        {currentHackathon.endDate}
                      </span>
                    </div>
                  </ACardContent>
                </ACard>
              </div>
            </div>

            {/* Overview & Requirements Section */}
            <section ref={sectionRefs.overview} className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
                Overview & Requirements
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>About This Hackathon</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {currentHackathon.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Organizer Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Organizer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src="/placeholder.svg?height=64&width=64" />
                          <AvatarFallback>
                            {currentHackathon.organizer[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {currentHackathon.organizer}
                          </h3>
                          <p className="text-gray-600">Event Organizer</p>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">
                              <Globe className="w-4 h-4 mr-2" />
                              Website
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Requirements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Requirements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {currentHackathon.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-blue-500" />
                          What You'll Need
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 text-gray-700">
                          <li className="flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>
                              Laptop/Computer with development environment
                            </span>
                          </li>
                          <li className="flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>Stable internet connection</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>Team of 2-4 members (optional)</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>GitHub account for code submission</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Event Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">
                            {currentHackathon.location}
                          </p>
                          <p className="text-sm text-gray-500">Location</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">
                            {currentHackathon.category}
                          </p>
                          <p className="text-sm text-gray-500">Category</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-gray-500" />
                        <div>
                          <Badge
                            className={`${getDifficultyColor(
                              currentHackathon.difficulty
                            )} text-white`}
                          >
                            {currentHackathon.difficulty}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            Difficulty Level
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Technologies & Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {currentHackathon.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-sm"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Problems Section */}
            <section ref={sectionRefs.problems} className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
                Problem Statements
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Problem Statements
                  </CardTitle>
                  <CardDescription>
                    Choose from these exciting challenges to work on during the
                    hackathon
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentHackathon.problemStatements?.map((problem, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">
                        Problem {index + 1}
                      </h3>
                      <p className="text-gray-700">{problem}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Prizes & Perks Section */}
            <section ref={sectionRefs.prizes} className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
                Prizes & Perks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Prize Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <div>
                          <p className="font-semibold">First Place</p>
                          <p className="text-2xl font-bold text-yellow-600">
                            $25,000
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                          2
                        </div>
                        <div>
                          <p className="font-semibold">Second Place</p>
                          <p className="text-2xl font-bold text-gray-600">
                            $15,000
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          3
                        </div>
                        <div>
                          <p className="font-semibold">Third Place</p>
                          <p className="text-2xl font-bold text-orange-600">
                            $10,000
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-purple-500" />
                      Perks & Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {currentHackathon.perks.map((perk, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Gift className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Timeline Section */}
            <section ref={sectionRefs.timeline} className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
                Event Timeline
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Event Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <div className="w-0.5 h-16 bg-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Registration Opens</h3>
                        <p className="text-sm text-gray-500">
                          Now - {currentHackathon.registrationDeadline}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Sign up and form your team
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <div className="w-0.5 h-16 bg-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Hackathon Begins</h3>
                        <p className="text-sm text-gray-500">
                          {currentHackathon.startDate}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Opening ceremony and problem statement release
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <div className="w-0.5 h-16 bg-gray-200"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Development Phase</h3>
                        <p className="text-sm text-gray-500">
                          {currentHackathon.startDate} -{" "}
                          {currentHackathon.endDate}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Build your solution with mentor support
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Submission & Judging</h3>
                        <p className="text-sm text-gray-500">
                          {currentHackathon.endDate}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Submit your project and present to judges
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* FAQs Section */}
            <section ref={sectionRefs.faqs} className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-blue-500" />
                      Common Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-semibold text-lg">
                          Can I participate alone?
                        </h3>
                        <p className="text-gray-700 mt-2">
                          Yes! While we encourage team participation (2-4
                          members), solo participants are welcome. You can also
                          find teammates through our Discord community.
                        </p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h3 className="font-semibold text-lg">
                          What if I'm a beginner?
                        </h3>
                        <p className="text-gray-700 mt-2">
                          This hackathon welcomes all skill levels! We provide
                          mentorship, resources, and beginner-friendly problem
                          statements to help you learn and grow.
                        </p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h3 className="font-semibold text-lg">
                          How is judging conducted?
                        </h3>
                        <p className="text-gray-700 mt-2">
                          Projects are evaluated based on innovation, technical
                          implementation, presentation, and potential impact.
                          Our panel includes industry experts and experienced
                          developers.
                        </p>
                      </div>
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h3 className="font-semibold text-lg">
                          What technologies can I use?
                        </h3>
                        <p className="text-gray-700 mt-2">
                          You're free to use any programming languages,
                          frameworks, or tools. However, check the specific
                          problem statements for any technology requirements.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Team Management Section */}
            <section ref={sectionRefs.team} className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
                Team Management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-indigo-500" />
                      Team Formation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-800">Team Size</h3>
                      <p className="text-blue-700 text-sm mt-1">
                        Teams can have 2-4 members. Solo participation is also
                        allowed.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800">
                        Role Distribution
                      </h3>
                      <p className="text-green-700 text-sm mt-1">
                        Consider having developers, designers, and a project
                        manager for balanced teams.
                      </p>
                    </div>
                    <Button className="w-full">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Find Teammates
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-500" />
                      Team Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">
                          All team members must register individually
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">
                          Designate one team leader for communication
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">
                          Use collaborative tools like GitHub for code sharing
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">
                          Submit one project per team
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Community Section */}
            <section ref={sectionRefs.community} className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
                Community
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Join the Discussion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Join Discord Server
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Find Teammates
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resources
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Recent Participants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32`}
                            />
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">User {i}</p>
                            <p className="text-xs text-gray-500">
                              Joined 2 hours ago
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
