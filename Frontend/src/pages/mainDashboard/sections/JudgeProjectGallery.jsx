import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/CommonUI/button";
import HackathonProjectsGallery from "./components/Hackathon/HackathonProjectsGallery";
import { ProjectDetail } from "../../../components/CommonUI/ProjectDetail";

export default function JudgeProjectGallery() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedType, setSelectedType] = useState("");

  // Handler for clicking a project card
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  // Handler for back button in ProjectDetail
  const handleBackToGallery = () => {
    setSelectedProject(null);
  };

  // Handler for dropdown change
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-6">
      {!selectedProject ? (
        <>
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">Back</Button>
          <h1 className="text-2xl font-bold mb-6">Project Gallery</h1>
          <div className="mb-4">
            <label htmlFor="typeDropdown" className="mr-2 font-medium">Filter by Type:</label>
            <select
              id="typeDropdown"
              value={selectedType}
              onChange={handleTypeChange}
              className="border rounded px-2 py-1"
            >
              <option value="">All</option>
              <option value="ppt">PPT</option>
              <option value="project">Project</option>
              <option value="research paper">Research Paper</option>
              <option value="demo">Demo</option>
            </select>
          </div>
          <HackathonProjectsGallery hackathonId={hackathonId} onProjectClick={handleProjectClick} selectedType={selectedType} />
        </>
      ) : (
        <ProjectDetail project={selectedProject} onBack={handleBackToGallery} backButtonLabel="Back to Project Gallery" />
      )}
    </div>
  );
} 