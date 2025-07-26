"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useToast } from "../../../../hooks/use-toast";
import { useAuth } from "../../../../context/AuthContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Zap } from "lucide-react";

import HeaderSection from "./HackathonComponent/Hackathon/HeaderSection";
import HackathonHero from "./HackathonComponent/Hackathon/HackathonHero";
import HackathonOverview from "./HackathonComponent/Hackathon/HackathonOverview";
import HackathonTimeline from "./HackathonComponent/Hackathon/HackathonTimeline";
import HackathonProblems from "./HackathonComponent/Hackathon/HackathonProblems";
import HackathonCommunity from "./HackathonComponent/Hackathon/HackathonCommunity";
import { HackathonRegistration } from "./RegistrationHackathon";
import HorizontalTabNav from "./HackathonComponent/Hackathon/HorizontalTabNav";
import HackathonProjectsGallery from "./HackathonComponent/Hackathon/HackathonProjectsGallery";
import TeamManagementSection from "./HackathonComponent/Hackathon/TeamManagementSection";
import BaseModal from "./HackathonComponent/Hackathon/TeamModals/BaseModal";
import { fetchHackathonParticipants } from "../../../../lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/CommonUI/card";
import { Badge } from "../../../../components/CommonUI/badge";
import {
  Trophy,
  Users,
  Award,
  MapPin,
} from "lucide-react";
import { SmartCountdown } from "../../../../components/DashboardUI/countdown";

export function HackathonDetails({ hackathon: propHackathon, onBack, backButtonLabel }) {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const headerRef = useRef(null);
  const navRef = useRef(null);
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

  const stateHackathon = location.state?.hackathon;
  const source = location.state?.source;
  const [hackathon, setHackathon] = useState(stateHackathon || propHackathon || null);
  const [loading, setLoading] = useState(!stateHackathon && !propHackathon && !!hackathonId);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview & Requirements" },
    { id: "timeline", label: "Timeline" },
    { id: "problems", label: "Problem Statements" },
    { id: "team", label: "Team Management" },
    { id: "community", label: "Community" },
    { id: "projects", label: "Project Gallery" },
  ];

  const sectionRefs = {
    overview: useRef(null),
    timeline: useRef(null),
    problems: useRef(null),
    team: useRef(null),
    community: useRef(null),
    projects: useRef(null),
  };

  const handleSectionClick = (id) => {
    const ref = sectionRefs[id];
    if (ref && ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  
  useEffect(() => {
    const measureNavHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };
    measureNavHeight();
    window.addEventListener('resize', measureNavHeight);
    return () => window.removeEventListener('resize', measureNavHeight);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        setIsNavFixed(headerBottom <= 0);
      }

      let current = "";
      for (const section of sections) {
        const ref = sectionRefs[section.id];
        if (ref && ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section.id;
            break;
          }
        }
      }

      if (current && activeTab !== current) {
        setActiveTab(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab, sectionRefs, sections]);

  if (loading) {
    return <div className="p-10 text-center text-lg">Loading hackathon details...</div>;
  }
  if (error) {
    return <div className="p-10 text-center text-red-600 font-bold">{error}</div>;
  }
  if (!hackathon) {
    return <div className="p-10 text-center text-red-600 font-bold">Hackathon not found.</div>;
  }
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [editRegistration, setEditRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [participantsError, setParticipantsError] = useState(null);

  useEffect(() => {
    if (!stateHackathon && !propHackathon && hackathonId) {
      setLoading(true);
      axios
        .get(`http://localhost:3000/api/hackathons/${hackathonId}`)
        .then((res) => {
          setHackathon(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load hackathon details");
          setLoading(false);
        });
    }
  }, [stateHackathon, propHackathon, hackathonId]);

  useEffect(() => {
    const fetchSavedHackathons = async () => {
      if (!hackathon || !hackathon._id) return;
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          "http://localhost:3000/api/users/me/saved-hackathons",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const savedHackathons = await res.json();
        setIsSaved(
          savedHackathons.some(
            (h) =>
              h._id === hackathon._id || h._id === hackathon._id?.toString()
          )
        );
      } catch (err) {
        console.error("Failed to fetch saved hackathons:", err);
      }
    };

    fetchSavedHackathons();
  }, [hackathon && hackathon._id]);

  useEffect(() => {
    const currentScrollY = window.scrollY;
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  const refreshRegistrationStatus = async () => {
    if (!hackathon || !hackathon._id) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:3000/api/registration/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const registered = res.data.some(
        (r) =>
          r.hackathonId === hackathon._id ||
          r.hackathonId?._id === hackathon._id
      );
      setIsRegistered(registered);
    } catch  {
      setIsRegistered(false);
    }
  };

  useEffect(() => {
    if (!hackathon || !hackathon._id) return;
    refreshRegistrationStatus();
  }, [hackathon && hackathon._id]);

  const fetchRegistrationData = async () => {
    if (!hackathon || !hackathon._id) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:3000/api/registration/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reg = res.data.find(
        (r) => r.hackathonId === hackathon._id || r.hackathonId?._id === hackathon._id
      );
      if (reg) setRegistrationData(reg.formData);
    } catch  {
      setRegistrationData(null);
    }
  };

  const handleShowRegistration = async (edit = false) => {
    if (edit) {
      setEditRegistration(true);
      await fetchRegistrationData();
      setShowRegistration(true);
    } else {
      setEditRegistration(false);
      setRegistrationData(null);
      setShowRegistration(true);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShowParticipants = async () => {
    if (!hackathon || !hackathon._id) return;
    setParticipantsLoading(true);
    setParticipantsError(null);
    setShowParticipantsModal(true);
    try {
      const data = await fetchHackathonParticipants(hackathon._id);
      setParticipants(data.participants || []);
    } catch  {
      setParticipantsError("Failed to fetch participants");
      setParticipants([]);
    } finally {
      setParticipantsLoading(false);
    }
  };

  if (showRegistration) {
    return (
      <HackathonRegistration
        hackathon={hackathon}
        onBack={() => setShowRegistration(false)}
        onSuccess={() => {
          refreshRegistrationStatus();
          setShowRegistration(false);
        }}
        editMode={editRegistration}
        startStep={editRegistration ? 3 : 1}
        initialData={editRegistration ? registrationData : undefined}
      />
    );
  }

  // Function to get difficulty text color (instead of background color)
  const getDifficultyTextColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-600";
      case "Intermediate":
        return "text-yellow-600";
      case "Advanced":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const RightSideContent = (
    <div className="space-y-8">
    <Card className= "hover:shadow-sm">
  <CardHeader className="pb-3">
    <CardTitle className="text-lg">Event Details</CardTitle>
  </CardHeader>
  <CardContent className="space-y-3">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
        <Trophy className="h-5 w-5 text-yellow-500" />
      </div>
      <div>
        <p className="text-xl font-bold text-green-600">{hackathon.prize}</p>
        <p className="text-xs text-gray-500">Prize Pool</p>
      </div>
    </div>

    <hr />

    <div className="flex items-center gap-3">
       <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
        <Users className="h-5 w-5 text-blue-500" />
      </div>
      <div>
        <p className="text-sm font-semibold">{hackathon.participants} / {hackathon.maxParticipants}</p>
        <p className="text-xs text-gray-500">Registered Participants</p>
      </div>
    </div>

    <div className="flex items-center gap-3">
       <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
        <Users className="h-5 w-5 text-gray-500" />
      </div>
      <div>
        <p className="text-sm font-semibold">{hackathon.teamSize?.min || 1} - {hackathon.teamSize?.max || 4} members</p>
        <p className="text-xs text-gray-500">Team Size</p>
      </div>
    </div>
    
    <div className="flex items-center gap-3">
       <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 flex-shrink-0">
        <MapPin className="h-5 w-5 text-gray-500" />
      </div>
      <div>
        <p className="text-sm font-semibold">{hackathon.location || "TBA"}</p>
        <p className="text-xs text-gray-500">Location</p>
      </div>
    </div>
  </CardContent>
</Card>

      <div>
          <SmartCountdown hackathon={hackathon} />
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 min-h-screen">
      <div ref={headerRef}>
        <HeaderSection
          hackathon={hackathon}
          onBack={onBack || (() => navigate("/dashboard/my-hackathons"))}
          backButtonLabel={
            backButtonLabel || (source === 'my-hackathons' ? 'Back to My Hackathons' : 'Back to Explore')
          }
          isSaved={isSaved}
          isRegistered={isRegistered}
          setShowRegistration={(edit) => handleShowRegistration(edit)}
          refreshRegistrationStatus={refreshRegistrationStatus}
          setIsSaved={setIsSaved}
        />
      </div>

      <div ref={navRef}>
        <HorizontalTabNav
          sections={sections}
          activeSection={activeTab}
          onSectionClick={handleSectionClick}
          isFixed={isNavFixed}
          isRegistered={isRegistered}
          onRegisterClick={handleShowRegistration}
        />
      </div>

      {isNavFixed && <div style={{ height: navHeight }} />}

      <main className="flex-1 ml-0 transition-all duration-300">
        <div className="p-6 w-full mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div ref={sectionRefs.overview} id="overview" className="py-8 border-b">
                  <HackathonHero
                    hackathon={hackathon}
                    isRegistered={isRegistered}
                    isSaved={isSaved}
                  />
                  <HackathonOverview
                    hackathon={hackathon}
                    user={user}
                    onShowParticipants={handleShowParticipants}
                  />
              </div>
              <div ref={sectionRefs.timeline} id="timeline" className="py-8 border-b">
                <HackathonTimeline hackathon={hackathon} isRegistered={isRegistered} />
              </div>
              <div ref={sectionRefs.problems} id="problems" className="py-8 border-b">
                <HackathonProblems hackathon={hackathon} />
              </div>
              <div ref={sectionRefs.team} id="team" className="py-8 border-b">
                <TeamManagementSection
                  hackathon={hackathon}
                  user={user}
                  isRegistered={isRegistered}
                  setIsRegistered={setIsRegistered}
                  refreshRegistrationStatus={refreshRegistrationStatus}
                  toast={toast}
                  setShowRegistration={handleShowRegistration}
                />
              </div>
              <div ref={sectionRefs.community} id="community" className="py-8 border-b">
                <HackathonCommunity />
              </div>
              <div ref={sectionRefs.projects} id="projects" className="py-8">
                <HackathonProjectsGallery hackathonId={hackathon._id} />
              </div>
               <div className="py-8 mt-10 text-center border-t border-gray-200/75">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <p className="text-sm text-slate-600">Powered by</p>
                  <a 
                    href="https://hackzen.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1.5 font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
                  >
                    <Zap className="w-4 h-4 text-indigo-500" />
                    <span>HackZen</span>
                  </a>
                </div>
                <p className="text-xs text-slate-500">
                  Copyright © {new Date().getFullYear()} HackZen Pvt. Ltd. - All rights reserved.
                </p>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className={`transition-all duration-300 ${isNavFixed ? 'fixed top-24 w-full max-w-sm' : ''}`}>
                {RightSideContent}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BaseModal
        open={showParticipantsModal}
        onOpenChange={setShowParticipantsModal}
        title="Registered Participants"
        content={
          participantsLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : participantsError ? (
            <div className="p-4 text-red-600">{participantsError}</div>
          ) : participants.length === 0 ? (
            <div className="p-4 text-gray-500">No participants registered yet.</div>
          ) : (
            <ul className="max-h-72 overflow-y-auto divide-y">
              {participants.map((p) => (
                <li key={p.userId} className="py-2 flex items-center gap-3">
                  {p.avatar && <img src={p.avatar} alt="avatar" className="w-8 h-8 rounded-full" />}
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.email}</div>
                  </div>
                  {p.teamName && <span className="ml-auto text-xs text-indigo-600">{p.teamName}</span>}
                </li>
              ))}
            </ul>
          )
        }
      />
    </div>
  );
}
