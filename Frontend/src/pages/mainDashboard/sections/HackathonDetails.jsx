"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../../hooks/use-toast";
import { useAuth } from "../../../context/AuthContext";

import HeaderSection from "./components/Hackathon/HeaderSection";
import HackathonHero from "./components/Hackathon/HackathonHero";
import HackathonOverview from "./components/Hackathon/HackathonOverview";
import HackathonTimeline from "./components/Hackathon/HackathonTimeline";
import HackathonProblems from "./components/Hackathon/HackathonProblems";
import TeamManagementSection from "./components/Hackathon/TeamManagementSection";
import HackathonCommunity from "./components/Hackathon/HackathonCommunity";
import { HackathonRegistration } from "./RegistrationHackathon";
import HorizontalTabNav from "./components/Hackathon/HorizontalTabNav";
import HackathonProjectsGallery from "./components/Hackathon/HackathonProjectsGallery";

export function HackathonDetails({ hackathon, onBack, backButtonLabel }) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

const sections = [
  { id: "overview", label: "Overview & Requirements" },
  { id: "problems", label: "Problem Statements" },
  { id: "timeline", label: "Timeline" },
  { id: "team", label: "Team Management" },
  { id: "community", label: "Community" },
  { id: "projects", label: "Projects Gallery" }, // ✅ NEW
];


  useEffect(() => {
    const fetchSavedHackathons = async () => {
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
  }, [hackathon._id]);

  useEffect(() => {
    const currentScrollY = window.scrollY;
    setShowHeader(currentScrollY < lastScrollY || currentScrollY < 10);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  const refreshRegistrationStatus = async () => {
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
    refreshRegistrationStatus();
  }, [hackathon._id]);

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
        onBack={onBack}
        backButtonLabel={backButtonLabel}
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
          {activeTab === "team" && (
            <TeamManagementSection
              hackathon={hackathon}
              isRegistered={isRegistered}
              setIsRegistered={setIsRegistered}
              refreshRegistrationStatus={refreshRegistrationStatus}
              user={user}
              toast={toast}
            />
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
