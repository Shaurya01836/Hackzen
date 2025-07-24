import { useState, createContext, useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import ParticipantDashboard from "./partipantDashboard/ParticipantDashboard";
import OrganizerDashboard from "./organizerDashboard/OrganizerDashboard";
import JudgeDashboard from "./judgeDashboard/JudgeDashboard";

// Create a context to expose the dashboard switcher
const DashboardContext = createContext();

export function useDashboard() {
  return useContext(DashboardContext);
}

export default function HackZenDashboard() {
  const { user: authUser } = useAuth();
  const [forceParticipant, setForceParticipant] = useState(false);
  const location = useLocation();

  // List of participant sections (route keys)
  const participantSections = [
    "profile",
    "my-hackathons",
    "my-submissions",
    "explore-hackathons",
    "blogs",
    "project-archive",
    "sponsored-ps"
  ];

  // Extract the current section from the URL
  // e.g. /dashboard/profile, /dashboard/my-hackathons, etc.
  const match = location.pathname.match(/^\/dashboard\/?([^\/]*)/);
  const currentSection = match ? match[1] : "";

  if (!authUser) return null;

  let dashboard;
  // Always render ParticipantDashboard for participant sections
  if (participantSections.includes(currentSection)) {
    dashboard = <ParticipantDashboard />;
  } else if (authUser.role === "organizer") {
    dashboard = <OrganizerDashboard />;
  } else if (authUser.role === "judge") {
    dashboard = <JudgeDashboard />;
  } else {
    dashboard = <ParticipantDashboard />;
  }

  return (
    <DashboardContext.Provider 
      value={{ 
        showParticipantDashboard: () => {
          setForceParticipant(true);
        },
        showOrganizerDashboard: () => {
          setForceParticipant(false);
        },
        isShowingParticipant: forceParticipant,
        resetDashboard: () => setForceParticipant(false)
      }}
    >
      {dashboard}
    </DashboardContext.Provider>
  );
}
