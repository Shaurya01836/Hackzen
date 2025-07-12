"use client";

import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("project-selection");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [organizerQuestions, setOrganizerQuestions] = useState([]);
  const [termsAndConditions, setTermsAndConditions] = useState([]);
  const [organizerAnswers, setOrganizerAnswers] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const isMounted = useRef(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

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
        const hackathonId = hackathon._id || hackathon.id;
        const res = await axios.get(
          `http://localhost:3000/api/submission-form/submissions?hackathonId=${hackathonId}&userId=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const submissions = res.data.submissions || [];
        // Ensure projectId is always a string
        const projectIds = submissions.map((s) =>
          s.projectId && typeof s.projectId === 'object' && s.projectId._id
            ? s.projectId._id.toString()
            : s.projectId?.toString()
        );
        console.log("DEBUG: projectIds from backend", projectIds, submissions);
        setSubmittedProjectIds(projectIds);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setSubmittedProjectIds([]);
      }
    };
    if ((hackathon._id || hackathon.id) && userId) fetchSubmissions();
  }, [hackathon._id, hackathon.id, userId]);

  useEffect(() => {
    if (selectedProjectId && submittedProjectIds.some(id => id.toString() === selectedProjectId.toString())) {
      setSelectedProjectId("");
      toast({
        title: 'Already Submitted',
        description: 'You have already submitted this project in this hackathon.',
        duration: 4000,
      });
    }
  }, [selectedProjectId, submittedProjectIds, toast]);

  // Pre-select new project if redirected back from create project
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newProjectId = params.get("newProjectId");
    if (newProjectId) {
      setSelectedProjectId(newProjectId);
    }
  }, [location.search]);

  // Fetch team members for this hackathon
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const token = localStorage.getItem("token");
        const hackathonId = hackathon._id || hackathon.id;
        const res = await fetch(`http://localhost:3000/api/teams/hackathon/${hackathonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const teams = await res.json();
        // Find the team where the user is a member
        if (Array.isArray(teams) && teams.length > 0) {
          const user = JSON.parse(localStorage.getItem('user'));
          const myTeam = teams.find(team => team.members.some(m => m._id === user._id));
          if (myTeam) {
            setTeamMembers(myTeam.members);
            setIsLeader(myTeam.leader && myTeam.leader._id === user._id);
            // By default, select all members
            setSelectedMembers(myTeam.members.map(m => m._id));
          }
        }
      } catch (err) {
        setTeamMembers([]);
        setIsLeader(false);
      }
    };
    if (hackathon && (hackathon._id || hackathon.id)) fetchTeam();
  }, [hackathon]);

  const handleOrganizerAnswer = (questionId, answer) => {
    setOrganizerAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleProjectSelect = (projectId) => {
    if (projectId === "create-new") {
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/dashboard/my-hackathons?createProject=1&hackathonId=${hackathon._id || hackathon.id}&returnUrl=${returnUrl}`);
      return;
    }
    const isSubmitted = submittedProjectIds.some(id => id.toString() === projectId.toString());
    if (isSubmitted) {
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

    // Validate required fields
    if (!selectedProjectId || selectedProjectId === "create-new") {
      toast({
        title: '❌ Error',
        description: 'Please select a project to submit.',
        duration: 4000,
      });
      return;
    }

    if (!selectedProblem) {
      toast({
        title: '❌ Error',
        description: 'Please select a problem statement.',
        duration: 4000,
      });
      return;
    }

    if (submittedProjectIds.some(id => id.toString() === selectedProjectId.toString())) {
      toast({
        title: 'Already Submitted',
        description: 'You have already submitted this project in this hackathon.',
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);
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
      selectedMembers,
    };
    console.log('handleSubmit: payload =', payload);

    try {
      console.log('🚀 Submitting project with payload:', payload);
      const response = await axios.post(
        "http://localhost:3000/api/submission-form/submit",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('✅ Submission successful:', response.data);
      
      // Add the just-submitted project to the submitted list
      setSubmittedProjectIds((prev) => [...prev, selectedProjectId]);
      setSelectedProjectId(""); // Optionally clear the selection
      
      // Call badge check after successful submission
      await checkForNewBadges();
      
      // Show success state
      setShowSuccess(true);
      
      // Show success toast
      toast({
        title: '🎉 Success!',
        description: 'Your project has been submitted successfully!',
        duration: 5000,
      });
      
      // Robust redirect after 2 seconds
      setTimeout(() => {
        // Use hard redirect to ensure navigation always works
        window.location.href = "/dashboard/my-hackathons";
      }, 2000);
      
    } catch (err) {
      console.error("❌ Error submitting project:", err);
      console.error("❌ Error response:", err.response?.data);
      toast({
        title: '❌ Error',
        description: err.response?.data?.error || 'Failed to submit project. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keep all projects but mark submitted ones as disabled
  const allProjects = userProjects;
  console.log("DEBUG: allProjects", allProjects);
  console.log("DEBUG: submittedProjectIds", submittedProjectIds);

  // Check if there are custom questions or terms
  const hasCustomQuestions = organizerQuestions.length > 0;
  const hasTerms = termsAndConditions.length > 0;
  const hasCustomForm = hasCustomQuestions || hasTerms;
  
  // Check if there are any required questions
  const hasRequiredQuestions = organizerQuestions.some(q => q.required);

  // Dynamic stepper based on whether there are custom questions/terms
  const steps = hasCustomForm 
    ? [
        { key: "project-selection", label: "Select Project" },
        { key: "terms-submit", label: "Q&A & Submit" },
      ]
    : [
        { key: "project-selection", label: "Submit Project" },
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
                {hasCustomForm ? (
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
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={
                        !selectedProjectId ||
                        selectedProjectId === "create-new" ||
                        !selectedProblem ||
                        submittedProjectIds.some(id => id.toString() === selectedProjectId.toString())
                      }
                    >
                      Q&A & Submit
                      {(!selectedProjectId || selectedProjectId === "create-new" || !selectedProblem) && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                          Locked
                        </span>
                      )}
                      {(selectedProjectId && selectedProjectId !== "create-new" && selectedProblem) && (
                        <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          Ready
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                ) : (
                  <TabsList className="grid w-full grid-cols-1 mb-8 ">
                    <TabsTrigger
                      value="project-selection"
                      className="bg-indigo-600 text-white"
                    >
                      Submit Project
                    </TabsTrigger>
                  </TabsList>
                )}

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
                      key={submittedProjectIds.join(",")}
                      value={selectedProjectId}
                      onValueChange={handleProjectSelect}
                      required
                    >
                      <SelectTrigger className="border-indigo-300 focus:ring-2 focus:ring-indigo-400">
                        <SelectValue placeholder={allProjects.length === 0 ? "No projects available" : "Choose..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {allProjects.length === 0 ? (
                          <div className="px-4 py-2 text-gray-500">No projects available. Create a project first.</div>
                        ) : (
                          <>
                            {/* Available projects */}
                            {allProjects
                              .filter(project => !submittedProjectIds.some(id => id.toString() === project._id.toString()))
                              .map((project) => (
                                <SelectItem
                                  key={project._id}
                                  value={project._id}
                                  className="text-black"
                                >
                                  {project.title}
                                </SelectItem>
                              ))
                            }
                            
                            {/* Submitted projects (disabled) */}
                            {allProjects
                              .filter(project => submittedProjectIds.some(id => id.toString() === project._id.toString()))
                              .map((project) => (
                                <SelectItem
                                  key={project._id}
                                  value={project._id}
                                  className="text-gray-400 cursor-not-allowed"
                                  disabled={true}
                                >
                                  {project.title} (Already Submitted)
                                </SelectItem>
                              ))
                            }
                            
                            <SelectItem
                              value="create-new"
                              className="text-indigo-600 font-semibold"
                            >
                              + Create New Project
                            </SelectItem>
                          </>
                        )}
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

                  <div className="space-y-3 text-black">
                    {isLeader && teamMembers.length > 0 && (
                      <div className="mb-4">
                        <Label className="text-black font-semibold">Select Team Members to Include in Submission</Label>
                        <div className="border border-indigo-300 rounded p-2 bg-white">
                          {teamMembers.map(member => (
                            <label key={member._id} className="flex items-center space-x-2 mb-1">
                              <input
                                type="checkbox"
                                checked={selectedMembers.includes(member._id)}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setSelectedMembers(prev => [...prev, member._id]);
                                  } else {
                                    setSelectedMembers(prev => prev.filter(id => id !== member._id));
                                  }
                                }}
                                disabled={member._id === userId} // leader always included
                              />
                              <span>{member.name} {member._id === userId ? "(You)" : ""}</span>
                            </label>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">You (leader) are always included in the submission.</div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    {hasCustomForm ? (
                      <>
                        {/* Show guidance message when requirements not met */}
                        {(!selectedProjectId || selectedProjectId === "create-new" || !selectedProblem) && (
                          <div className="flex-1 text-sm text-gray-500">
                            {!selectedProjectId || selectedProjectId === "create-new" ? "Please select a project" : ""}
                            {(!selectedProjectId || selectedProjectId === "create-new") && !selectedProblem ? " and " : ""}
                            {!selectedProblem ? "choose a problem statement" : ""}
                            {" to proceed to Q&A & Submit"}
                          </div>
                        )}
                        {(selectedProjectId && selectedProjectId !== "create-new" && selectedProblem) && (
                          <div className="flex-1 text-sm text-green-600">
                            ✓ Ready to proceed to Q&A & Submit
                          </div>
                        )}
                        <Button
                          type="button"
                          onClick={() => setActiveTab("terms-submit")}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition-all"
                          disabled={
                            !selectedProjectId ||
                            selectedProjectId === "create-new" ||
                            !selectedProblem ||
                            submittedProjectIds.some(id => id.toString() === selectedProjectId.toString())
                          }
                        >
                          Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg shadow transition-all font-semibold"
                        disabled={
                          !selectedProjectId ||
                          selectedProjectId === "create-new" ||
                          !selectedProblem ||
                          submittedProjectIds.some(id => id.toString() === selectedProjectId.toString()) ||
                          isSubmitting
                        }
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Project →"
                        )}
                      </Button>
                    )}
                  </div>
                </TabsContent>

                {/* Step 2: Questions & Terms */}
                <TabsContent
                  value="terms-submit"
                  className="space-y-6 animate-fade-in"
                >
                  {!hasCustomForm && (
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-4">
                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-700">Ready to Submit!</p>
                        <p className="text-sm text-gray-500">No additional questions or terms required.</p>
                      </div>
                    </div>
                  )}
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
                      {hasTerms && (
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
                      )}
                    </>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("project-selection")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition-all"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        (hasTerms && !agreedToTerms) || 
                        (hasRequiredQuestions && !organizerQuestions.every(q => !q.required || organizerAnswers[q.id])) ||
                        isSubmitting || 
                        !selectedProjectId || 
                        selectedProjectId === "create-new" || 
                        !selectedProblem ||
                        submittedProjectIds.some(id => id.toString() === selectedProjectId.toString())
                      }
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg shadow transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit →"
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600 mb-6">Your project has been submitted successfully!</p>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <p className="text-sm text-gray-500">Redirecting to My Hackathons...</p>
          </div>
        </div>
      )}
      
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
