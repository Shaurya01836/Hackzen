import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/CommonUI/button";
import HackathonProjectsGallery from "./components/Hackathon/HackathonProjectsGallery";
import { ProjectDetail } from "../../../components/CommonUI/ProjectDetail";

export default function JudgeProjectGallery() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);

  // Handler for clicking a project card
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  // Handler for back button in ProjectDetail
  const handleBackToGallery = () => {
    setSelectedProject(null);
  };

  return (
    <div className="p-6">
      {!selectedProject ? (
        <>
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">Back</Button>
          <h1 className="text-2xl font-bold mb-6">Project Gallery</h1>
          <HackathonProjectsGallery hackathonId={hackathonId} onProjectClick={handleProjectClick} />
        </>
      ) : (
        <ProjectDetail project={selectedProject} onBack={handleBackToGallery} backButtonLabel="Back to Project Gallery" />
      )}
    </div>
  );
} 