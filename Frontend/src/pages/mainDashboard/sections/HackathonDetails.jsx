"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../../hooks/use-toast";
import { useAuth } from "../../../context/AuthContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import HeaderSection from "./components/Hackathon/HeaderSection";
import HackathonHero from "./components/Hackathon/HackathonHero";
import HackathonOverview from "./components/Hackathon/HackathonOverview";
import HackathonTimeline from "./components/Hackathon/HackathonTimeline";
import HackathonProblems from "./components/Hackathon/HackathonProblems";
import HackathonCommunity from "./components/Hackathon/HackathonCommunity";
import { HackathonRegistration } from "../partipantDashboard/components/RegistrationHackathon";
import HorizontalTabNav from "./components/Hackathon/HorizontalTabNav";
import HackathonProjectsGallery from "./components/Hackathon/HackathonProjectsGallery";
import TeamManagementSection from "./components/Hackathon/TeamManagementSection";
import { SmartCountdown } from "../../../components/DashboardUI/countdown";
import BaseModal from "./components/Hackathon/TeamModals/BaseModal";
import { fetchHackathonParticipants } from "../../../lib/api";

export function HackathonDetails({ hackathon: propHackathon, onBack, backButtonLabel }) {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Use hackathon from location.state if available, else prop, else null
  const stateHackathon = location.state?.hackathon;
  const source = location.state?.source;
  const [hackathon, setHackathon] = useState(stateHackathon || propHackathon || null);
  const [loading, setLoading] = useState(!stateHackathon && !propHackathon && !!hackathonId);
  const [error, setError] = useState(null);

  // Defensive: loading/error/null checks at the very top
  if (loading) {
    return <div className="p-10 text-center text-lg">Loading hackathon details...</div>;
  }
  if (error) {
    return <div className="p-10 text-center text-red-600 font-bold">{error}</div>;
  }
  if (!hackathon) {
    return <div className="p-10 text-center text-red-600 font-bold">Hackathon not found.</div>;
  }

   // Debug: log the raw date fields
  console.log('HackathonDetails - Raw Dates:', {
    startDate: hackathon.startDate,
    endDate: hackathon.endDate,
    registrationDeadline: hackathon.registrationDeadline,
    submissionDeadline: hackathon.submissionDeadline,
  });
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const defaultTab = location.state?.defaultTab;
  const [activeTab, setActiveTab] = useState(defaultTab || "overview");
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [editRegistration, setEditRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [participantsError, setParticipantsError] = useState(null);

const sections = [
  { id: "overview", label: "Overview & Requirements" },
  { id: "problems", label: "Problem Statements" },
  { id: "timeline", label: "Timeline" },
  { id: "community", label: "Community" },
  { id: "projects", label: "Project Gallery" },
  { id: "team", label: "Team Management" },
];


  // Fetch hackathon by ID if not provided as prop or state
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
    setShowHeader(currentScrollY < lastScrollY || currentScrollY < 10);
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
    } catch (err) {
      setIsRegistered(false);
    }
  };

  useEffect(() => {
    if (!hackathon || !hackathon._id) return;
    refreshRegistrationStatus();
  }, [hackathon && hackathon._id]);

  // Fetch user's registration for this hackathon if needed
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
    } catch (err) {
      setRegistrationData(null);
    }
  };

  // Pass setShowRegistration to HeaderSection, but wrap to support edit mode
  const handleShowRegistration = async (edit = false) => {
    if (edit) {
      // View Details - edit mode, start at case 3
      setEditRegistration(true);
      await fetchRegistrationData(); // Wait for data to be set
      setShowRegistration(true);
    } else {
      // Register - new registration, start at case 1
      setEditRegistration(false);
      setRegistrationData(null); // Clear any previous data
      setShowRegistration(true);
    }
  };

  // Scroll to top when component mounts
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
    } catch (err) {
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

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 min-h-screen">
      <HeaderSection
        hackathon={hackathon}
        onBack={onBack || (() => navigate("/dashboard/my-hackathons"))}
        backButtonLabel={
          backButtonLabel || (source === 'my-hackathons' ? 'Back to My Hackathons' : 'Back to Explore')
        }
        isSaved={isSaved}
        isRegistered={isRegistered}
        setShowRegistration={(edit) => handleShowRegistration(edit)}
        showHeader={showHeader}
        refreshRegistrationStatus={refreshRegistrationStatus}
        setIsSaved={setIsSaved}
      />

      <HorizontalTabNav
        sections={sections}
        activeSection={activeTab}
        onSectionClick={(id) => setActiveTab(id)}
      />

      <main className="flex-1 ml-0 transition-all duration-300">
        <div className="p-6 md:p-10 w-full mx-auto ">
          {activeTab === "overview" && (
            <>
            
              <HackathonHero
                hackathon={hackathon}
                isRegistered={isRegistered}
                isSaved={isSaved}
              />
                <SmartCountdown hackathon={hackathon} />
              <HackathonOverview
                hackathon={hackathon}
                user={user}
                onShowParticipants={handleShowParticipants}
              />
            </>
          )}
          {activeTab === "problems" && (
            <HackathonProblems hackathon={hackathon} />
          )}
          {activeTab === "timeline" && (
            <HackathonTimeline hackathon={hackathon} isRegistered={isRegistered} />
          )}
          {activeTab === "community" && <HackathonCommunity />}
          {activeTab === "projects" && (
            <HackathonProjectsGallery hackathonId={hackathon._id} />
          )}
          {activeTab === "team" && (
            <TeamManagementSection
              hackathon={hackathon}
              user={user}
              isRegistered={isRegistered}
              setIsRegistered={setIsRegistered}
              refreshRegistrationStatus={refreshRegistrationStatus}
              toast={toast}
            />
          )}
        </div>
      </main>

      {/* Participants Modal */}
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
