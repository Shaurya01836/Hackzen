import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/CommonUI/button";
import JudgeAssignedProjectsGallery from "./JudgeAssignedProjectsGallery";
import { ProjectDetail } from "../../../components/CommonUI/ProjectDetail";
import { ArrowLeft, Filter, LayoutGrid, FileText, Folder } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../../components/CommonUI/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/CommonUI/select";

export default function JudgeProjectGallery() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedType, setSelectedType] = useState("all"); 

  // Handler for clicking a project card
  const handleProjectClick = ({ project, submission }) => {
    setSelectedProject(project);
    setSelectedSubmission(submission);
  };

  // Handler for back button in ProjectDetail
  const handleBackToGallery = () => {
    setSelectedProject(null);
    setSelectedSubmission(null);
  };

  // Handler for dropdown change
  const handleTypeChange = (value) => {
    setSelectedType(value);
  };


  const typeOptions = [
    { value: "all", label: "All Projects" },
    { value: "ppt", label: "Presentations" },
    { value: "project", label: "Projects" },
    { value: "research paper", label: "Research Papers" },
    { value: "demo", label: "Demos" },
  ];


  const getFilterValue = () => {
    return selectedType === "all" ? "" : selectedType;
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {!selectedProject ? (
          <>
            {/* Enhanced Header */}
            <div className="sticky top-0 z-20 backdrop-blur-sm bg-white/80 rounded-xl shadow-sm mb-6">
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-gray-100"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Project Gallery
                  </h1>
                </div>

                {/* Enhanced Filter */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">
                    View:
                  </span>
                  <Select value={selectedType} onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-48 bg-white">
                      <SelectValue placeholder="All Projects" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                 
                </div>
              </div>
            </div>

            {/* Enhanced Content Area */}
            <div className="space-y-6">
              {/* Projects Gallery Section */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-50 rounded-xl">
                    <FileText className="w-5 h-5 text-indigo-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Submitted Projects
                  </h2>
                </div>

                <JudgeAssignedProjectsGallery
                  hackathonId={hackathonId}
                  onProjectClick={handleProjectClick}
                  selectedType={getFilterValue()} 
                />
              </div>
            </div>
          </>
        ) : (
          <Card className="overflow-hidden">
            <CardContent className="p-6 pt-6">
              <Button
                variant="ghost"
                className="mb-6 flex items-center gap-2"
                onClick={handleBackToGallery}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Project Gallery
              </Button>
              <ProjectDetail
                project={selectedProject}
                submission={selectedSubmission}
                hideBackButton={true}
                onlyOverview={false}
                fallbackHackathonId={hackathonId}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
