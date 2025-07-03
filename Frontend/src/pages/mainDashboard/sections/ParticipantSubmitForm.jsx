"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← For back button
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../../../components/CommonUI/card";
import { Button } from "../../../components/CommonUI/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/CommonUI/select";
import { Textarea } from "../../../components/CommonUI/textarea";
import { Label } from "../../../components/CommonUI/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../../../components/CommonUI/tabs";
import {
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ArrowLeft
} from "lucide-react";

const projectCategories = [
  { id: "web-app", label: "Web Application" },
  { id: "mobile-app", label: "Mobile Application" },
  { id: "ai-ml", label: "AI/Machine Learning" },
  { id: "blockchain", label: "Blockchain/Web3" },
  { id: "iot", label: "Internet of Things (IoT)" },
  { id: "game", label: "Game Development" },
  { id: "dev-tools", label: "Developer Tools" },
  { id: "other", label: "Other" }
];

const organizerQuestions = [
  {
    id: 1,
    question: "What technologies did you use in your project?",
    required: true
  },
  {
    id: 2,
    question: "How does your solution address scalability concerns?",
    required: false
  },
  {
    id: 3,
    question: "What challenges did you face during development?",
    required: true
  }
];

const termsAndConditions = [
  "All submissions must be original work created during the hackathon period",
  "Ensure all team members are properly registered on the platform",
  "Submission deadline must be respected - no late submissions accepted",
  "Projects must include proper documentation and setup instructions",
  "Code repositories must be publicly accessible for judging",
  "By submitting, you agree to allow organizers to showcase your project"
];

export default function ProjectSubmissionForm({ hackathon, onBack }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("project-selection");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [themeExplanation, setThemeExplanation] = useState("");
  const [organizerAnswers, setOrganizerAnswers] = useState({});

  const handleOrganizerAnswer = (questionId, answer) => {
    setOrganizerAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      selectedProject,
      selectedCategory,
      themeExplanation,
      organizerAnswers
    });
    alert("Project submitted successfully!");
    navigate("/dashboard/my-hackathons"); // Optional redirect after submission
  };

  const handleNextTab = (nextTab) => {
    setActiveTab(nextTab);
  };

  const handlePrevTab = (prevTab) => {
    setActiveTab(prevTab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <Button
          variant="outline"
          className="mb-2"
          onClick={() => (onBack ? onBack() : navigate(-1))}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-slate-800 mb-2">
              Submit Project
            </CardTitle>
            <p className="text-lg text-slate-600 font-medium">
              {hackathon?.name || "Hackathon"}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="project-selection" className="text-sm">
                    Project & Tracks
                  </TabsTrigger>
                  <TabsTrigger value="project-details" className="text-sm">
                    Project Details
                  </TabsTrigger>
                  <TabsTrigger value="terms-submit" className="text-sm">
                    Terms & Submit
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1 */}
                <TabsContent value="project-selection" className="space-y-8 mt-0">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-slate-700">
                      Select the Project to Submit{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedProject}
                      onValueChange={setSelectedProject}
                      required
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Choose a project..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="project-alpha">
                          Project Alpha
                        </SelectItem>
                        <SelectItem value="project-beta">
                          Project Beta
                        </SelectItem>
                        <SelectItem value="project-gamma">
                          Project Gamma
                        </SelectItem>
                        <SelectItem value="create-new">
                          Create New Project
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-slate-700">
                      Select Project Category{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                      required
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Choose a category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {projectCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="button"
                      onClick={() => handleNextTab("project-details")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Tab 2 */}
                <TabsContent value="project-details" className="space-y-8 mt-0">
                  <Label className="text-base font-semibold text-slate-700">
                    Describe your project and what problem it solves{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-2">
                    <Textarea
                      value={themeExplanation}
                      onChange={(e) =>
                        setThemeExplanation(e.target.value.slice(0, 500))
                      }
                      placeholder="Explain your project..."
                      className="min-h-[120px] text-base resize-none"
                      required
                    />
                    <div className="text-right text-sm text-slate-500">
                      {themeExplanation.length}/500 characters
                    </div>
                  </div>

                  <div className="space-y-6">
                    {organizerQuestions.map((question) => (
                      <div key={question.id} className="space-y-3">
                        <Label className="text-base font-medium text-slate-700">
                          {question.question}
                          {question.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </Label>
                        <Textarea
                          value={organizerAnswers[question.id] || ""}
                          onChange={(e) =>
                            handleOrganizerAnswer(question.id, e.target.value)
                          }
                          placeholder="Your answer..."
                          className="min-h-[100px] text-base"
                          required={question.required}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handlePrevTab("project-selection")}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleNextTab("terms-submit")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Tab 3 */}
                <TabsContent value="terms-submit" className="space-y-8 mt-0">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-800">
                      Terms and Conditions
                    </h3>
                    <div className="bg-slate-50 rounded-lg p-6 max-h-64 overflow-y-auto">
                      <ul className="space-y-3">
                        {termsAndConditions.map((term, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-sm text-slate-700"
                          >
                            <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                            <span>{term}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handlePrevTab("project-details")}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
                    >
                      Submit Project
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
