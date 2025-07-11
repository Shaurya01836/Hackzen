"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { Button } from "../../../components/CommonUI/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/CommonUI/select";
import { Textarea } from "../../../components/CommonUI/textarea";
import { Label } from "../../../components/CommonUI/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/CommonUI/tabs";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import axios from "axios";
import { useAchievements } from '../../../hooks/useAchievements';
import { useToast } from '../../../hooks/use-toast';

export default function ProjectSubmissionForm({
  hackathon,
  onBack,
  userProjects = [],
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("project-selection");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [organizerQuestions, setOrganizerQuestions] = useState([]);
  const [termsAndConditions, setTermsAndConditions] = useState([]);
  const [organizerAnswers, setOrganizerAnswers] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;
  const { checkForNewBadges } = useAchievements(userId);

  // Track which projects have already been submitted to this hackathon
  const [submittedProjectIds, setSubmittedProjectIds] = useState([]);

  useEffect(() => {
    const fetchCustomForm = async () => {
      if (!hackathon || (!hackathon.id && !hackathon._id)) {
        console.warn('fetchCustomForm: No valid hackathon id found:', hackathon);
        return;
      }
      try {
        console.log('fetchCustomForm: hackathon =', hackathon);
        const res = await axios.get(
          `http://localhost:3000/api/hackathons/${hackathon._id || hackathon.id}`
        );
        const form = res.data.customForm || {};
        setOrganizerQuestions(form.questions || []);
        setTermsAndConditions(form.terms?.map((t) => t.text) || []);
      } catch (err) {
        console.error("Error fetching form questions:", err);
      }
    };
    fetchCustomForm();
  }, [hackathon]);

  useEffect(() => {
    // Fetch all submissions for this hackathon and user
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3000/api/submissions?hackathonId=${hackathon.id}&userId=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const submissions = res.data.submissions || [];
        setSubmittedProjectIds(submissions.map((s) => s.projectId));
      } catch (err) {
        setSubmittedProjectIds([]);
      }
    };
    if (hackathon.id && userId) fetchSubmissions();
  }, [hackathon.id, userId]);

  const handleOrganizerAnswer = (questionId, answer) => {
    setOrganizerAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleProjectSelect = (projectId) => {
    if (submittedProjectIds.includes(projectId)) {
      toast({
        title: 'Already Submitted',
        description: 'You have already submitted this project in this hackathon.',
        duration: 4000,
      });
      return;
    }
    setSelectedProjectId(projectId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submittedProjectIds.includes(selectedProjectId)) {
      toast({
        title: 'Already Submitted',
        description: 'You have already submitted this project in this hackathon.',
        duration: 4000,
      });
      return;
    }

    const token = localStorage.getItem("token");
    const answersArray = Object.entries(organizerAnswers).map(
      ([id, answer]) => ({
        questionId: id,
        answer,
      })
    );

    const payload = {
      hackathonId: hackathon._id || hackathon.id,
      projectId: selectedProjectId,
      problemStatement: selectedProblem,
      customAnswers: answersArray,
    };
    console.log('handleSubmit: payload =', payload);

    try {
      await axios.post(
        "http://localhost:3000/api/submission-form/submit",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Call badge check after successful submission
      await checkForNewBadges();
      toast({
        title: 'Success',
        description: 'Project submitted successfully!',
        duration: 4000,
      });
      setTimeout(() => navigate("/dashboard/my-hackathons"), 1200);
    } catch (err) {
      console.error("Error submitting project:", err);
      toast({
        title: 'Error',
        description: err.response?.data?.error || 'Failed to submit project.',
        duration: 4000,
      });
    }
  };

  // Stepper for navigation
  const steps = [
    { key: "project-selection", label: "Select Project" },
    { key: "terms-submit", label: "Q&A & Submit" },
  ];
  const currentStep = steps.findIndex((s) => s.key === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-slate-100 py-8 px-4">
      <div className=" mx-auto space-y-4">
        <Button
          variant="outline"
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="mb-2 border-indigo-300 text-indigo-700 hover:bg-indigo-100"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>

        <Card>
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-extrabold text-indigo-800 mb-2 tracking-tight">
              Submit Project
            </CardTitle>
            <p className="text-lg text-black font-medium">
              {hackathon?.name || "Hackathon"}
            </p>
            {/* Stepper */}
            <div className="flex justify-center mt-4 gap-4">
              {steps.map((step, idx) => (
                <div key={step.key} className="flex items-center">
                  <div
                    className={`rounded-full w-7 h-7 flex items-center justify-center font-bold text-white transition-all
                      ${idx <= currentStep ? "bg-indigo-600" : "bg-indigo-200"}
                    `}
                  >
                    {idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-8 h-1 ${
                        idx < currentStep ? "bg-indigo-500" : "bg-indigo-200"
                      } mx-1 rounded`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-8 ">
                  <TabsTrigger
                    value="project-selection"
                    className={`transition-all ${
                      activeTab === "project-selection"
                        ? "bg-indigo-600 text-white"
                        : "text-black"
                    }`}
                  >
                    Select Project
                  </TabsTrigger>
                  <TabsTrigger
                    value="terms-submit"
                    className={`transition-all ${
                      activeTab === "terms-submit"
                        ? "bg-indigo-600 text-white"
                        : "text-black"
                    }`}
                  >
                    Q&A & Submit
                  </TabsTrigger>
                </TabsList>

                {/* Step 1: Select Project */}
                <TabsContent
                  value="project-selection"
                  className="space-y-8 animate-fade-in"
                >
                  <div className="space-y-3 text-black">
                    <Label className="text-black font-semibold">
                      Select Project<span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedProjectId}
                      onValueChange={handleProjectSelect}
                      required
                    >
                      <SelectTrigger className="border-indigo-300 focus:ring-2 focus:ring-indigo-400">
                        <SelectValue placeholder="Choose..." />
                      </SelectTrigger>
                      <SelectContent>
                        {userProjects.map((project) => (
                          <SelectItem
                            key={project._id}
                            value={project._id}
                            className={`text-black ${submittedProjectIds.includes(project._id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={submittedProjectIds.includes(project._id)}
                          >
                            {project.title}
                          </SelectItem>
                        ))}
                        <SelectItem
                          value="create-new"
                          className="text-indigo-600 font-semibold"
                        >
                          + Create New Project
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedProjectId === "create-new" && (
                      <div className="mt-2 p-4 bg-indigo-50 rounded-lg border border-indigo-200 text-black">
                        Please create your project from the <b>Projects</b>{" "}
                        section before submitting.
                      </div>
                    )}
                  </div>

                  {/* Problem Statement Dropdown */}
                  <div className="space-y-3 text-black">
                    <Label className="text-black font-semibold">
                      Problem Statement<span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedProblem}
                      onValueChange={setSelectedProblem}
                      required
                      disabled={!hackathon.problemStatements || hackathon.problemStatements.length === 0}
                    >
                      <SelectTrigger className="border-indigo-300 focus:ring-2 focus:ring-indigo-400">
                        <SelectValue placeholder={hackathon.problemStatements && hackathon.problemStatements.length > 0 ? "Select a problem statement..." : "No problem statements available"} />
                      </SelectTrigger>
                      <SelectContent>
                        {hackathon.problemStatements && hackathon.problemStatements.length > 0 ? (
                          hackathon.problemStatements.map((statement, idx) => (
                            <SelectItem key={idx} value={statement} className="text-black">
                              {statement.length > 80 ? statement.slice(0, 80) + "..." : statement}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-problem" disabled>No problem statements available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("terms-submit")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition-all"
                      disabled={
                        !selectedProjectId || selectedProjectId === "create-new" || !selectedProblem
                      }
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 2: Questions & Terms */}
                <TabsContent
                  value="terms-submit"
                  className="space-y-6 animate-fade-in"
                >
                  {organizerQuestions.length > 0 && (
                    <>
                      <h3 className="text-xl font-bold text-black mb-2">
                        Organizer Questions
                      </h3>
                      <div className="space-y-4">
                        {organizerQuestions.map((q) => (
                          <div key={q.id}>
                            <Label className="text-black font-medium">
                              {q.text}
                              {q.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </Label>
                            <Textarea
                              value={organizerAnswers[q.id] || ""}
                              onChange={(e) =>
                                handleOrganizerAnswer(q.id, e.target.value)
                              }
                              required={q.required}
                              className="mt-1 border-indigo-300 focus:ring-2 focus:ring-indigo-400 text-black"
                              placeholder="Type your answer..."
                            />
                            {q.required && (
                              <span className="text-xs text-indigo-500">
                                This question is required.
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {termsAndConditions.length > 0 && (
                    <>
                      <h3 className="text-xl font-bold text-black mb-2">
                        Terms & Conditions
                      </h3>
                      <div className="max-h-40 overflow-y-auto bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-2">
                        <ul className="list-disc pl-6 space-y-1">
                          {termsAndConditions.map((term, i) => (
                            <li key={i} className="text-sm text-black">
                              {term}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <label className="flex items-center space-x-2 text-sm text-black font-medium">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          required
                          className="accent-indigo-600"
                        />
                        <span>I agree to the terms above</span>
                      </label>
                    </>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("project-selection")}
                      className="bg-indigo-100 text-black hover:bg-indigo-200 px-6 py-2 rounded-lg transition-all"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={!agreedToTerms}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg shadow transition-all font-semibold"
                    >
                      Submit →
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Animation for fade-in */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}
