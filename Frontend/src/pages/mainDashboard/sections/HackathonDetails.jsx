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
import { HackathonRegistration } from "./RegistrationHackathon";
import HorizontalTabNav from "./components/Hackathon/HorizontalTabNav";
import HackathonProjectsGallery from "./components/Hackathon/HackathonProjectsGallery";

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

  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const defaultTab = location.state?.defaultTab;
  const [activeTab, setActiveTab] = useState(defaultTab || "overview");
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

const sections = [
  { id: "overview", label: "Overview & Requirements" },
  { id: "problems", label: "Problem Statements" },
  { id: "timeline", label: "Timeline" },
  { id: "community", label: "Community" },
  { id: "projects", label: "Project Gallery" },
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (showRegistration) {
    return (
      <HackathonRegistration
        hackathon={hackathon}
        onBack={() => setShowRegistration(false)}
        onSuccess={() => {
          refreshRegistrationStatus();
          setShowRegistration(false);
        }}
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
        setShowRegistration={setShowRegistration}
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
        <div className="p-6 md:p-10 w-full mx-auto max-w-6xl">
          {activeTab === "overview" && (
            <>
              <HackathonHero
                hackathon={hackathon}
                isRegistered={isRegistered}
                isSaved={isSaved}
              />
              <HackathonOverview hackathon={hackathon} user={user} />
            </>
          )}
          {activeTab === "problems" && (
            <HackathonProblems hackathon={hackathon} />
          )}
          {activeTab === "timeline" && (
            <HackathonTimeline hackathon={hackathon} />
          )}
          {activeTab === "community" && <HackathonCommunity />}
          {activeTab === "projects" && (
  <HackathonProjectsGallery hackathonId={hackathon._id} />
)}

        </div>
      </main>
    </div>
  );
}
