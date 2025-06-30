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
  Copy,
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
import { useToast } from '../../../hooks/use-toast';
import { useAuth } from '../../../context/AuthContext';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../../../components/DashboardUI/alert-dialog';

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
  
  // Team management states
  const [userTeams, setUserTeams] = useState([]);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showJoinTeam, setShowJoinTeam] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [teamInvites, setTeamInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Add state for dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, teamId: null });
  const [removeDialog, setRemoveDialog] = useState({ open: false, teamId: null, memberId: null });

  // Add state for copy code feedback
  const [copiedTeamId, setCopiedTeamId] = useState(null);

  // Add state for leave team dialog
  const [leaveDialog, setLeaveDialog] = useState({ open: false, teamId: null });

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
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "http://localhost:3000/api/registration/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Safely check if user is registered for this hackathon
        const registered = res.data.some(
          (r) => r.hackathonId && (r.hackathonId._id === hackathon._id || r.hackathonId === hackathon._id)
        );

        console.log('Registration check:', { hackathonId: hackathon._id, registered, registrations: res.data });
        setIsRegistered(registered);
      } catch (err) {
        console.error("Error fetching registered hackathons", err);
        setIsRegistered(false);
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

  // Fetch user's teams for this hackathon
  useEffect(() => {
    if (isRegistered) {
      fetchUserTeams();
      fetchTeamInvites();
    } else {
      // Clear teams if user is not registered
      setUserTeams([]);
      setTeamInvites([]);
    }
  }, [isRegistered, hackathon._id]);

  const fetchUserTeams = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping team fetch');
        return;
      }

      console.log('Fetching teams for hackathon:', hackathon._id);
      const response = await axios.get(`http://localhost:3000/api/teams/hackathon/${hackathon._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Teams fetched:', response.data);
      setUserTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      if (error.response?.status === 401) {
        console.log('User not authenticated for team fetch');
      }
    }
  };

  const fetchTeamInvites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping invite fetch');
        return;
      }

      console.log('Fetching team invites for hackathon:', hackathon._id);
      const response = await axios.get(`http://localhost:3000/api/team-invites/hackathon/${hackathon._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Team invites fetched:', response.data);
      setTeamInvites(response.data);
    } catch (error) {
      console.error('Error fetching team invites:', error);
      if (error.response?.status === 401) {
        console.log('User not authenticated for invite fetch');
      }
    }
  };

  const handleCreateTeam = async (teamData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to create a team');
        return;
      }
      
      const response = await axios.post('http://localhost:3000/api/teams', {
        ...teamData,
        hackathonId: hackathon._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Team created successfully:', response.data);
      
      // Close the modal first
      setShowCreateTeam(false);
      
      // Refresh the teams list
      await fetchUserTeams();
      
      // Show success message with team code
      const teamCode = response.data.team.teamCode;
      alert(`Team created successfully!\n\nTeam Code: ${teamCode}\n\nShare this code with your teammates so they can join your team!`);
    } catch (error) {
      console.error('Error creating team:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create team. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim() || !selectedTeam) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail.trim())) {
      alert('Please enter a valid email address');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/team-invites', {
        invitedEmail: inviteEmail.trim(),
        teamId: selectedTeam._id,
        hackathonId: hackathon._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Invite sent successfully:', response.data);
      
      // Show success message
      alert('Invitation sent successfully! The recipient will receive an email with the invitation link.');
      
      // Clear form and close modal
      setInviteEmail('');
      setShowInviteModal(false);
      setSelectedTeam(null);
      
      // Refresh invites
      await fetchTeamInvites();
    } catch (error) {
      console.error('Error sending invite:', error);
      const errorMessage = error.response?.data?.error || 'Failed to send invitation. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!teamCode.trim()) {
      alert('Please enter a team code');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/teams/join/${teamCode.trim().toUpperCase()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Joined team successfully:', response.data);
      
      // Close modal and clear form
      setShowJoinTeam(false);
      setTeamCode('');
      
      // Refresh teams list
      await fetchUserTeams();
      
      // Show success message
      alert(`Successfully joined team: ${response.data.team.name}`);
    } catch (error) {
      console.error('Error joining team:', error);
      const errorMessage = error.response?.data?.error || 'Failed to join team. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update handleDeleteTeam to not use window.confirm
  const handleDeleteTeam = (teamId) => {
    setDeleteDialog({ open: true, teamId });
  };
  const confirmDeleteTeam = async () => {
    const teamId = deleteDialog.teamId;
    setDeleteDialog({ open: false, teamId: null });
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'Team deleted', description: 'The team was deleted successfully.' });
      await fetchUserTeams();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to delete team.' });
    } finally {
      setLoading(false);
    }
  };

  // Update handleRemoveMember to not use window.confirm
  const handleRemoveMember = (teamId, memberId) => {
    setRemoveDialog({ open: true, teamId, memberId });
  };
  const confirmRemoveMember = async () => {
    const { teamId, memberId } = removeDialog;
    setRemoveDialog({ open: false, teamId: null, memberId: null });
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/teams/${teamId}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'Member removed', description: 'The member was removed from the team.' });
      await fetchUserTeams();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to remove member.' });
    } finally {
      setLoading(false);
    }
  };

  // Add leave team handler
  const handleLeaveTeam = (teamId) => {
    setLeaveDialog({ open: true, teamId });
  };
  const confirmLeaveTeam = async () => {
    const teamId = leaveDialog.teamId;
    setLeaveDialog({ open: false, teamId: null });
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/teams/${teamId}/leave`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: 'Left team', description: 'You have left the team.' });
      await fetchUserTeams();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to leave team.' });
    } finally {
      setLoading(false);
    }
  };

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
                <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg mb-8">
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
                    {isRegistrationClosed ? (
                      <Badge className="bg-red-500 text-white">Registration Closed</Badge>
                    ) : isRegistrationFull && !isRegistered ? (
                      <Badge className="bg-red-500 text-white">Registration Full</Badge>
                    ) : isRegistered ? (
                      <Badge className="bg-green-500 text-white">Registered</Badge>
                    ) : (
                      <Badge className="bg-green-500 text-white">Registration Open</Badge>
                    )}
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
              
              {!isRegistered ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Registration Required</h3>
                    <p className="text-gray-600 mb-4">
                      You need to register for this hackathon before you can manage teams.
                    </p>
                    <Button onClick={() => setShowRegistration(true)}>
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* User's Teams */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-500" />
                          My Teams
                        </span>
                        <div className="flex gap-2">
                          {userTeams.length === 0 && (
                            <>
                              <Button 
                                onClick={() => setShowJoinTeam(true)}
                                variant="outline"
                                size="sm"
                              >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Join Team
                              </Button>
                              <Button 
                                onClick={() => setShowCreateTeam(true)}
                                size="sm"
                              >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create Team
                              </Button>
                            </>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userTeams.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Teams Yet</h3>
                          <p className="text-gray-500 mb-4">
                            Create a team or join an existing one to get started.
                          </p>
                          <Button onClick={() => setShowCreateTeam(true)}>
                            Create Your First Team
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {userTeams.map((team) => (
                            <div key={team._id} className="mb-6 p-4 border rounded-lg bg-gray-50">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-lg">{team.name}</h4>
                                  <p className="text-sm text-gray-500">Team Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{team.teamCode}</span></p>
                                </div>
                                <Badge variant={team.members.length >= team.maxMembers ? "destructive" : "default"}>
                                  {team.members.length}/{team.maxMembers} members
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-3">{team.description}</p>
                              {/* Team Members */}
                              <div className="mb-4">
                                <h5 className="font-medium mb-2">Team Members:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {team.members.map((member) => (
                                    <div key={member._id} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                                      <Avatar className="w-6 h-6">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm">{member.name}</span>
                                      {member._id === team.leader._id && (
                                        <Badge variant="secondary" className="text-xs">Leader</Badge>
                                      )}
                                      {team.leader._id === user?._id && member._id !== user?._id && (
                                        <AlertDialog open={removeDialog.open && removeDialog.teamId === team._id && removeDialog.memberId === member._id} onOpenChange={open => setRemoveDialog(open ? { open: true, teamId: team._id, memberId: member._id } : { open: false, teamId: null, memberId: null })}>
                                          <AlertDialogTrigger asChild>
                                            <Button size="xs" variant="destructive">Remove</Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to remove <b>{member.name}</b> from the team? This action cannot be undone.
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                                              <AlertDialogAction onClick={confirmRemoveMember} disabled={loading}>Remove</AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {/* Team Actions */}
                              <div className="flex gap-2 mb-2">
                                {team.members.length < team.maxMembers && (
                                  <Button 
                                    onClick={() => {
                                      setSelectedTeam(team);
                                      setShowInviteModal(true);
                                    }}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Invite Member
                                  </Button>
                                )}
                                <div className="relative inline-block">
                                  <Button 
                                    onClick={() => {
                                      navigator.clipboard.writeText(team.teamCode);
                                      setCopiedTeamId(team._id);
                                      toast({ title: 'Code copied!', description: 'Team code copied to clipboard.' });
                                      setTimeout(() => setCopiedTeamId(null), 1500);
                                    }}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy Code
                                  </Button>
                                  {copiedTeamId === team._id && (
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1 text-xs font-semibold animate-fade-in-out z-10" style={{ pointerEvents: 'none' }}>
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                      Code Copied!
                                    </span>
                                  )}
                                </div>
                                {/* Leave team button for logged-in user (not leader) */}
                                {team.members.some(m => m._id === user?._id) && team.leader._id !== user?._id && (
                                  <AlertDialog open={leaveDialog.open && leaveDialog.teamId === team._id} onOpenChange={open => setLeaveDialog(open ? { open: true, teamId: team._id } : { open: false, teamId: null })}>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="destructive" size="sm" disabled={loading}>Leave Team</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Leave Team?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to leave this team? You will be removed from the team and cannot rejoin unless invited again.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={confirmLeaveTeam} disabled={loading}>Leave</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Pending Invites */}
                  {teamInvites.filter(invite => invite.status === 'pending').length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          Pending Invites
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {teamInvites.filter(invite => invite.status === 'pending').map((invite) => (
                            <div key={invite._id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <p className="font-medium">{invite.invitedEmail}</p>
                                <p className="text-sm text-gray-500">
                                  Invited to {invite.team.name} by {invite.invitedBy.name}
                                </p>
                              </div>
                              <Badge variant="secondary">Pending</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </section>

            {/* Create Team Modal */}
            {showCreateTeam && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                  <button
                    onClick={() => setShowCreateTeam(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    ✕
                  </button>
                  <h3 className="text-xl font-semibold mb-4">Create New Team</h3>
                  <CreateTeamForm 
                    onSubmit={handleCreateTeam}
                    onCancel={() => setShowCreateTeam(false)}
                    loading={loading}
                  />
                </div>
              </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && selectedTeam && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                      setSelectedTeam(null);
                      setInviteEmail('');
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    ✕
                  </button>
                  <h3 className="text-xl font-semibold mb-4">Invite Team Member</h3>
                  <p className="text-gray-600 mb-4">
                    Invite someone to join <strong>{selectedTeam.name}</strong>
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="friend@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        The recipient will receive an email with an invitation link
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleSendInvite}
                        disabled={!inviteEmail.trim() || loading}
                        className="flex-1"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          'Send Invite'
                        )}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowInviteModal(false);
                          setSelectedTeam(null);
                          setInviteEmail('');
                        }}
                        className="flex-1"
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Join Team Modal */}
            {showJoinTeam && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                  <button
                    onClick={() => {
                      setShowJoinTeam(false);
                      setTeamCode('');
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    ✕
                  </button>
                  <h3 className="text-xl font-semibold mb-4">Join a Team</h3>
                  <p className="text-gray-600 mb-4">
                    Enter the team code provided by your team leader to join their team.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Team Code *</label>
                      <input
                        type="text"
                        value={teamCode}
                        onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                        placeholder="Enter team code (e.g., A1B2C3D4)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        disabled={loading}
                        required
                        maxLength={8}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Team codes are 8 characters long and case-insensitive
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleJoinTeam}
                        disabled={!teamCode.trim() || loading}
                        className="flex-1"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Joining...
                          </>
                        ) : (
                          'Join Team'
                        )}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowJoinTeam(false);
                          setTeamCode('');
                        }}
                        className="flex-1"
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

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

// Create Team Form Component
function CreateTeamForm({ onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 4
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Call onSubmit and then reset form
    onSubmit(formData);
    
    // Reset form data after submission
    setFormData({
      name: '',
      description: '',
      maxMembers: 4
    });
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: '',
      description: '',
      maxMembers: 4
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Team Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter team name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your team's goals and skills"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={loading}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Maximum Members</label>
        <select
          value={formData.maxMembers}
          onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value={2}>2 members</option>
          <option value={3}>3 members</option>
          <option value={4}>4 members</option>
        </select>
      </div>
      
      <div className="flex gap-3">
        <Button 
          type="submit"
          disabled={loading || !formData.name.trim() || !formData.description.trim()}
          className="flex-1"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </>
          ) : (
            'Create Team'
          )}
        </Button>
        <Button 
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
