import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import JudgeAssignedProjectsGallery from "./JudgeAssignedProjectsGallery";
import ProjectDetail from "../../../components/CommonUI/ProjectDetail";
import { 
  ArrowLeft, 
  Filter, 
  LayoutGrid, 
  FileText, 
  Folder, 
  Search,
  Eye,
  Star,
  Users,
  Calendar,
  Award,
  Target,
  BookOpen,
  Video,
  Code,
  Settings,
  Grid3X3,
  List,
  ChevronDown,
  Info,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../../../components/CommonUI/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/CommonUI/select";
import { Input } from "../../../components/CommonUI/input";

export default function JudgeProjectGallery() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

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
    { value: "all", label: "All Projects", icon: LayoutGrid, color: "text-gray-600", bgColor: "bg-gray-100" },
    { value: "ppt", label: "Presentations", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-100" },
    { value: "project", label: "Projects", icon: Code, color: "text-green-600", bgColor: "bg-green-100" },
    { value: "research paper", label: "Research Papers", icon: BookOpen, color: "text-purple-600", bgColor: "bg-purple-100" },
    { value: "demo", label: "Demos", icon: Video, color: "text-orange-600", bgColor: "bg-orange-100" },
  ];

  const getFilterValue = () => {
    return selectedType === "all" ? "" : selectedType;
  };

  const currentTypeOption = typeOptions.find(option => option.value === selectedType) || typeOptions[0];
  const CurrentTypeIcon = currentTypeOption.icon;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="w-full max-w-none mx-auto p-6">
        {!selectedProject ? (
          <>
            {/* Header Section */}
            <Card className="shadow-none hover:shadow-none mb-8">
              <CardContent className="p-6 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-6">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-gray-100 transition-colors px-4 py-2"
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </Button>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Project Gallery
                      </h1>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg">
                      <Eye className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium text-indigo-800">Judge View</span>
                    </div>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search projects by title, team, or technology..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                    />
                  </div>



                </div>
              </CardContent>
            </Card>

            {/* Filter Summary & Quick Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Badge variant="blue">
                  <CurrentTypeIcon className="w-3 h-3 mr-1" />
                  {currentTypeOption.label}
                </Badge>
                {searchQuery && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Search className="w-3 h-3 mr-1" />
                    "{searchQuery}"
                  </Badge>
                )}
              </div>
              

            </div>

            {/*Content Area */}
            <div className="space-y-8">
              {/* Project Gallery Section */}
              <div className="bg-white border border-indigo-100 rounded-2xl">
                <CardContent className="pt-4">
                  <JudgeAssignedProjectsGallery
                    hackathonId={hackathonId}
                    onProjectClick={handleProjectClick}
                    selectedType={getFilterValue()}
                    searchQuery={searchQuery}
                    viewMode={viewMode}
                  />
                </CardContent>
              </div>
            </div>
          </>
        ) : (
          /* Enhanced Project Detail View */
          <div className="space-y-6">
            {/* Project Detail Header */}
            <div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-gray-100 transition-colors px-4 py-2"
                      onClick={handleBackToGallery}
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back to Project Gallery
                    </Button>
                 
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <Eye className="w-3 h-3 mr-1" />
                      Evaluation Mode
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </div>

            {/* Project Detail Content */}
            <div>
              <CardContent className="p-0">
                <ProjectDetail
                  project={selectedProject}
                  submission={selectedSubmission}
                  hideBackButton={true}
                  onlyOverview={false}
                  fallbackHackathonId={hackathonId}
                />
              </CardContent>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
