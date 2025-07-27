"use client";
import { useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../components/CommonUI/card";
import {
  uploadPPTFile,
  savePPTSubmission,
  fetchUserPPTSubmissions,
  deletePPTSubmission,
} from "../../../../../../lib/api";
import { useToast } from "../../../../../../hooks/use-toast";
import { useAuth } from "../../../../../../context/AuthContext";
import { useEffect, useRef } from "react";
import PPTSubmissionModal from "./PPTSubmissionModal";
import ProjectSubmissionModal from "./ProjectSubmissionModal";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../../../components/DashboardUI/alert-dialog";

export default function HackathonTimeline({
  hackathon,
  sectionRef,
  isRegistered,
  showProjectModal,
  setShowProjectModal,
  autoSelectProjectId,
}) {
  const rounds = Array.isArray(hackathon.rounds) ? hackathon.rounds : [];
  const [refreshKey, setRefreshKey] = useState(0);
  const now = new Date();
  const { toast } = useToast ? useToast() : { toast: () => {} };
  const { user } = useAuth ? useAuth() : { user: null };
  

  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [pptSubmissions, setPptSubmissions] = useState([]);
  const [pptModal, setPptModal] = useState({ open: false, roundIdx: null });
  const pptModalRef = useRef();
  const [projectSubmissions, setProjectSubmissions] = useState([]);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [projectModal, setProjectModal] = useState({
    open: false,
    roundIdx: null,
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    submission: null,
  });
  
  // Add state for round2 eligibility
  const [round2Eligibility, setRound2Eligibility] = useState(null);
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  


  // Fetch user's PPT submissions for this hackathon
  useEffect(() => {
    if (!hackathon._id || !user?._id) return;
    fetchUserPPTSubmissions(hackathon._id, user._id)
      .then(setPptSubmissions)
      .catch(() => setPptSubmissions([]));
  }, [hackathon._id, user?._id, refreshKey]);

  // Fetch user's project submissions for this hackathon
  useEffect(() => {
    
    async function fetchProjectSubmissions() {
      if (!hackathon._id || !user?._id) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3000/api/submission-form/submissions?hackathonId=${hackathon._id}&userId=${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedSubs = (res.data.submissions || []).filter(
          (s) => s.projectId
        );
        setProjectSubmissions(updatedSubs);
      } catch {
        setProjectSubmissions([]);
      }
    }
    fetchProjectSubmissions();
  }, [hackathon._id, user?._id, refreshKey]);

  // Fetch Round 2 eligibility function
  const fetchRound2Eligibility = async () => {
    if (!hackathon._id || !user?._id) {
      return;
    }
    
    // Only check for Round 2 (index 1)
    const round2Exists = hackathon.rounds && hackathon.rounds.length > 1;
    if (!round2Exists) {
      return;
    }
    
    setLoadingEligibility(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/judge-management/hackathons/${hackathon._id}/round2-eligibility`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRound2Eligibility(res.data);
    } catch (error) {
      console.error("Error fetching Round 2 eligibility:", error);
      setRound2Eligibility(null);
    } finally {
      setLoadingEligibility(false);
    }
  };

  // Fetch Round 2 eligibility
  useEffect(() => {
    fetchRound2Eligibility();
  }, [hackathon._id, user?._id, isRegistered, refreshKey]);

  // Helper function to check if deadline has passed
  const hasDeadlinePassed = (endDate) => {
    if (!endDate) return false;
    return now > new Date(endDate);
  };

  // Helper function to format deadline message
  const formatDeadlineMessage = (endDate) => {
    if (!endDate) return "";
    const deadline = new Date(endDate);
    return deadline.toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata"
    });
  };

  // Helper function to check if user has submitted in previous round
  const hasSubmittedInPreviousRound = (currentRoundIdx) => {
    if (currentRoundIdx === 0) return true; // First round, no previous submission needed
    const previousRoundSubmissions = getProjectSubmissionsForRound(currentRoundIdx - 1);
    return previousRoundSubmissions.length > 0;
  };

  // Helper function to check if user is shortlisted for next round
  const isShortlistedForNextRound = (currentRoundIdx) => {
    if (currentRoundIdx === 0) {
      return true; // First round, everyone is eligible
    }
    if (currentRoundIdx === 1 && round2Eligibility) {
      // Use shortlisted field if available, otherwise fall back to eligible
      return round2Eligibility.shortlisted === true || round2Eligibility.eligible === true;
    }
    return false; // For other rounds, implement as needed
  };

  // Helper function to check if user is not selected for next round
  const isNotSelectedForNextRound = (currentRoundIdx) => {
    if (currentRoundIdx === 0) {
      return false; // First round, no selection needed
    }
    if (currentRoundIdx === 1 && round2Eligibility) {
      // Only show "not selected" if user is explicitly not shortlisted
      // Use shortlisted field if available, otherwise fall back to eligible
      const isShortlisted = round2Eligibility.shortlisted === true || round2Eligibility.eligible === true;
      return isShortlisted === false;
    }
    return false;
  };

  const handlePPTUpload = async (e, roundIdx) => {
    const file = e.target.files[0];
    if (!file) return;
    if (
      file.type !==
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" &&
      !file.name.endsWith(".pptx")
    ) {
      toast({
        title: "Invalid file",
        description: "Please upload a .pptx file",
        variant: "destructive",
      });
      return;
    }
    setUploadingIdx(roundIdx);
    try {
      const result = await uploadPPTFile(file);
      await savePPTSubmission({
        hackathonId: hackathon._id,
        roundIndex: roundIdx,
        pptFile: result.url,
      });
      toast({
        title: "PPT Uploaded!",
        description: "Your PPT has been uploaded successfully.",
        variant: "success",
      });
      const updated = await fetchUserPPTSubmissions(hackathon._id, user._id);
      setPptSubmissions(updated);
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err.message || "Could not upload PPT",
        variant: "destructive",
      });
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleDeletePPT = async (roundIdx) => {
    if (
      !window.confirm(
        "Are you sure you want to delete your PPT submission for this round?"
      )
    )
      return;
    try {
      await deletePPTSubmission({
        hackathonId: hackathon._id,
        roundIndex: roundIdx,
      });
      toast({
        title: "PPT Deleted",
        description: "Your PPT submission has been deleted.",
        variant: "success",
      });
      if (hackathon._id && user?._id) {
        const updated = await fetchUserPPTSubmissions(hackathon._id, user._id);
        setPptSubmissions(updated);
      }
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err.message || "Could not delete PPT",
        variant: "destructive",
      });
    }
  };

  const handleAfterAction = () => {
    console.log('🔄 handleAfterAction called - refreshing data...');
    setRefreshKey((k) => k + 1);
    // Also directly fetch updated data after a short delay to ensure backend has processed
    setTimeout(() => {
      if (hackathon._id && user?._id) {
        const token = localStorage.getItem("token");
        axios.get(
          `http://localhost:3000/api/submission-form/submissions?hackathonId=${hackathon._id}&userId=${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(res => {
          const updatedSubs = (res.data.submissions || []).filter(
            (s) => s.projectId
          );
          console.log('📊 Updated project submissions:', updatedSubs);
          setProjectSubmissions(updatedSubs);
        })
        .catch(() => {
          // Silently fail, the useEffect will handle it
        });
      }
    }, 500); // Small delay to ensure backend has processed
  };

  const handleDeleteProjectSubmission = (submission) => {
    setDeleteDialog({ open: true, submission });
  };

  const confirmDeleteProjectSubmission = async () => {
    const submission = deleteDialog.submission;
    setDeleteDialog({ open: false, submission: null });
    if (!submission) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/api/submission-form/submission/${submission._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "Project Deleted",
        description:
          "Your project submission has been deleted. You can now resubmit until the round ends.",
        variant: "success",
      });
      if (hackathon._id && user?._id) {
        const res = await axios.get(
          `http://localhost:3000/api/submission-form/submissions?hackathonId=${hackathon._id}&userId=${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedSubs = (res.data.submissions || []).filter(
          (s) => s.projectId
        );
        setProjectSubmissions(updatedSubs);
      }
      handleAfterAction();
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.message ||
        "Could not delete project submission";
      toast({
        title: "Delete failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const getSubmissionForRound = (roundIdx) => {
    const found = pptSubmissions.find(
      (s) => String(s.roundIndex) === String(roundIdx)
    );
    return found;
  };

  const getPPTDownloadLink = (
    pptFile,
    originalName,
    fallbackName = "presentation"
  ) => {
    if (!pptFile) return "#";
    let url = pptFile.replace("/raw/raw/", "/raw/");
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    let publicId = matches ? matches[1] : "";
    publicId = publicId.replace(/\.pptx$/, "");
    let baseName = fallbackName;
    if (originalName) {
      baseName = originalName.replace(/\.[^/.]+$/, "");
    } else if (publicId) {
      baseName = publicId.split("/").pop() || fallbackName;
    }
    const baseUrl = url.split("/upload/")[0];
    return `${baseUrl}/raw/upload/fl_attachment:${baseName}.pptx/${publicId}.pptx`;
  };

  const getProjectSubmissionsForRound = (roundIdx) => {
    const submissions = projectSubmissions.filter(
      (s) => String(s.roundIndex) === String(roundIdx)
    );
    console.log(`🔍 getProjectSubmissionsForRound(${roundIdx}): ${submissions.length} submissions`, submissions);
    return submissions;
  };

  const canEdit = (end) => {
    return !end || now <= end;
  };

  const handleProjectModalOpenChange = (open) => {
    setProjectModal((prev) => ({ ...prev, open }));
    if (!open) setEditingSubmission(null);
    if (!open && typeof setShowProjectModal === "function")
      setShowProjectModal(false);
    if (!open) handleAfterAction();
  };

  const handleSubmitAnother = (roundIdx) => {
    setEditingSubmission(null);
    setProjectModal({ open: true, roundIdx });
  };

  const handleOpenNewSubmission = (roundIdx) => {
    setEditingSubmission(null);
    setProjectModal({ open: true, roundIdx });
  };

  return (
    <section ref={sectionRef} className="space-y-6 max-w-5xl mx-auto">
      <Card className="shadow-none hover:shadow-none">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-1 h-8 bg-indigo-500 rounded-full"></div>
            Stages and Timelines
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 my-4">
              <h3 className="text-xl font-semibold text-gray-900">Competition Rounds</h3>
            </div>
            
            {rounds.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <CalendarDays className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-2xl font-bold text-gray-800 mb-3">No Rounds Defined</h4>
                <p className="text-gray-700 leading-relaxed text-lg">
                  No rounds have been defined for this hackathon yet.
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {(() => {
                  const submissionType = hackathon.submissionType || "single-project";
                  const roundType = hackathon.roundType || "single-round";
                  let filteredRounds = rounds;
                  if (
                    submissionType === "multi-project" &&
                    roundType === "single-round"
                  ) {
                    const firstProjectIdx = rounds.findIndex(
                      (r) => r.type && r.type.toLowerCase().includes("project")
                    );
                    filteredRounds =
                      firstProjectIdx !== -1 ? [rounds[firstProjectIdx]] : [];
                  }
                  return filteredRounds.map((round, idx) => {
                    const start = round.startDate ? new Date(round.startDate) : null;
                    const end = round.endDate ? new Date(round.endDate) : null;
                    const isLive = start && end && now >= start && now <= end;
                    const isSubmission =
                      round.type && round.type.toLowerCase().includes("ppt");
                    const isProjectSubmission =
                      round.type && round.type.toLowerCase().includes("project");
                    
                    console.log(`🔍 Round ${idx} Debug:`, {
                      roundType: round.type,
                      isProjectSubmission,
                      isLive,
                      canEdit: canEdit(end)
                    });
                    
                    const dayNum = start ? start.getDate() : idx + 24;
                    const monthStr = start
                      ? start.toLocaleString("en-US", { month: "short" })
                      : "Jul";

                    const startTime = start
                      ? start.toLocaleString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                          timeZone: "Asia/Kolkata"
                        })
                      : "11:48 PM";
                    
                    const endTime = end
                      ? end.toLocaleString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                          timeZone: "Asia/Kolkata"
                        })
                      : "11:46 PM";

                    let projectSubmissionsForRound = getProjectSubmissionsForRound(idx);
                    const maxProjects = hackathon.maxSubmissionsPerParticipant || 1;
                    const submission = getSubmissionForRound(idx);
                    const roundType2 = hackathon.roundType || "single-round";
                    
                    // Debug for Round 2 specifically
                    if (idx === 1) {
                      console.log(`🔍 ROUND 2 DEBUG:`, {
                        roundIndex: idx,
                        projectSubmissionsForRound: projectSubmissionsForRound,
                        submissionType: hackathon.submissionType,
                        roundType2,
                        isProjectSubmission,
                        isLive,
                        canEdit: canEdit(end),
                        submissionCount: projectSubmissionsForRound.length
                      });
                    }
                    const isFirstProjectRound =
                      rounds
                        .filter(
                          (r) => r.type && r.type.toLowerCase().includes("project")
                        )
                        .findIndex((r) => r === round) === 0;

                    let projectSubmissionUI = null;
                    let pptSubmissionUI = null;
                    
                    // Check if this is Round 2 and user needs to be shortlisted
                    const isRound2 = idx === 1;
                    const needsShortlisting = isRound2 && isProjectSubmission;
                    
                    // Check if user submitted in Round 1 (for eligibility message)
                    const round1Submissions = getProjectSubmissionsForRound(0);
                    const hasSubmittedRound1 = round1Submissions.length > 0;
                    
                    // Check deadline conditions
                    const deadlinePassed = hasDeadlinePassed(end);
                    const hasSubmittedInPrevious = hasSubmittedInPreviousRound(idx);
                    const isShortlisted = isShortlistedForNextRound(idx);
                    const isNotSelected = isNotSelectedForNextRound(idx);
                    
                    // Debug logging
                    // Enhanced debug logging
                    console.log(`🔍 Round ${idx} Enhanced Debug:`, {
                      isRound2: idx === 1,
                      isProjectSubmission,
                      isShortlisted,
                      isNotSelected,
                      round2Eligibility: round2Eligibility ? {
                        eligible: round2Eligibility.eligible,
                        shortlisted: round2Eligibility.shortlisted,
                        round2Started: round2Eligibility.round2Started,
                        message: round2Eligibility.message,
                        shortlistingSource: round2Eligibility.shortlistingSource
                      } : null,
                      condition1: isShortlisted && isProjectSubmission && round2Eligibility && (round2Eligibility.shortlisted === true || round2Eligibility.eligible === true),
                      condition2: isNotSelected && isProjectSubmission && round2Eligibility && round2Eligibility.shortlisted === false
                    });
                    
                    // Show loading state for Round 2 eligibility check
                    if (isRound2 && isProjectSubmission && loadingEligibility) {
                      projectSubmissionUI = (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-spin">
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <h3 className="font-semibold text-blue-800">Checking Shortlisting Status</h3>
                          </div>
                          <p className="text-sm text-blue-700">
                            Please wait while we check your Round 2 eligibility...
                          </p>
                        </div>
                      );
                    }
                    // Show pending status when eligibility check is complete but no data
                    else if (isRound2 && isProjectSubmission && !round2Eligibility && !loadingEligibility) {
                      projectSubmissionUI = (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-spin">
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <h3 className="font-semibold text-blue-800">Checking Shortlisting Status</h3>
                          </div>
                          <p className="text-sm text-blue-700">
                            Please wait while we check your Round 2 eligibility...
                          </p>
                        </div>
                      );
                    }
                    

                    
                    // Condition 1: Missed Deadline (No Submission)
                    if (deadlinePassed && !projectSubmissionsForRound.length && !submission) {
                      const deadlineMessage = formatDeadlineMessage(end);
                      projectSubmissionUI = (
                        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 font-medium">
                          The hackathon submission window is closed. The deadline was {deadlineMessage}.
                        </div>
                      );
                      if (isSubmission) {
                        pptSubmissionUI = (
                          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 font-medium">
                            The hackathon submission window is closed. The deadline was {deadlineMessage}.
                          </div>
                        );
                      }
                    }
                    // Condition 2: Round Selection - User is shortlisted for next round (but check if already submitted)
                    else if (isShortlisted && isProjectSubmission && round2Eligibility && (round2Eligibility.shortlisted === true || round2Eligibility.eligible === true) && projectSubmissionsForRound.length === 0) {
                      console.log(`🔍 Round ${idx} - Showing shortlisted message (no submissions yet)`);
                      if (isLive && canEdit(end)) {
                        projectSubmissionUI = (
                          <div className="space-y-3">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm">✓</span>
                                </div>
                                <h3 className="font-semibold text-green-800">Congratulations! You're Selected for Round 2</h3>
                              </div>
                              <p className="text-sm text-green-700 mb-3">
                                Your Round 1 submission has been shortlisted. You can now submit a new project for Round 2.
                              </p>
                              <button
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed font-medium"
                                onClick={() =>
                                  isRegistered && handleOpenNewSubmission(idx)
                                }
                                disabled={!isRegistered}
                                title={
                                  isRegistered
                                    ? "Submit your project for Round 2"
                                    : "Register for the hackathon to submit"
                                }
                              >
                                Submit Project for Round 2
                              </button>
                            </div>
                          </div>
                        );
                      } else if (!isLive) {
                        projectSubmissionUI = (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">✓</span>
                              </div>
                              <h3 className="font-semibold text-green-800">Congratulations! You're Selected for Round 2</h3>
                            </div>
                            <p className="text-sm text-green-700">
                              Your Round 1 submission has been shortlisted. You can submit your project when Round 2 starts.
                            </p>
                            {round2Eligibility && round2Eligibility.round2StartDate && (
                              <p className="text-xs text-green-600 mt-2">
                                Round 2 starts: {new Date(round2Eligibility.round2StartDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        );
                      } else {
                        projectSubmissionUI = (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">✓</span>
                              </div>
                              <h3 className="font-semibold text-green-800">Congratulations! You're Selected for Round 2</h3>
                            </div>
                            <p className="text-sm text-green-700">
                              Your Round 1 submission has been shortlisted. Round 2 has ended.
                            </p>
                          </div>
                        );
                      }
                    }
                    // Fallback: Show shortlisting message if Round 2 exists but no eligibility data
                    else if (isRound2 && isProjectSubmission && !round2Eligibility && !loadingEligibility) {
                      projectSubmissionUI = (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">⏳</span>
                            </div>
                            <h3 className="font-semibold text-yellow-800">Shortlisting Status Pending</h3>
                          </div>
                          <p className="text-sm text-yellow-700 mb-3">
                            Round 1 evaluations are in progress. Your shortlisting status will be determined soon.
                          </p>
                          <button 
                            className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition"
                            onClick={() => {
                              fetchRound2Eligibility();
                            }}
                          >
                            Check Status
                          </button>
                        </div>
                      );
                    }
                    // Condition 3: Not Selected for Next Round (only show if explicitly not shortlisted)
                    else if (isNotSelected && isProjectSubmission && round2Eligibility && round2Eligibility.shortlisted === false) {
                      projectSubmissionUI = (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">✗</span>
                            </div>
                            <h3 className="font-semibold text-red-800">Not Selected for Round 2</h3>
                          </div>
                          <p className="text-sm text-red-700 mb-2">
                            Thank you for participating in Round 1. After careful evaluation, you are not shortlisted for Round 2.
                          </p>
                          <p className="text-xs text-red-600">
                            Keep an eye on future hackathons and continue building amazing projects!
                          </p>
                        </div>
                      );
                    }
                    // Normal submission logic for active rounds
                    else if (isLive && canEdit(end)) {
                      console.log(`🔍 Round ${idx} - isLive && canEdit(end): true`);
                      // Project submission logic
                      if (isProjectSubmission) {
                        console.log(`🔍 Round ${idx} - isProjectSubmission: true`);
                        if (
                          submissionType === "single-project" &&
                          roundType2 === "single-round"
                        ) {
                          console.log(`🔍 Timeline Round ${idx}: projectSubmissionsForRound.length = ${projectSubmissionsForRound.length}`, projectSubmissionsForRound);
                          projectSubmissionUI =
                            projectSubmissionsForRound.length > 0 ? (
                              <div className="flex gap-2 items-center">
                                <div className="px-4 py-2 bg-green-600 text-white rounded text-center cursor-default select-none opacity-80">
                                  Project Submitted
                                </div>
                                <button
                                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                                  onClick={() =>
                                    handleDeleteProjectSubmission(
                                      projectSubmissionsForRound[0]
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            ) : (
                              <button
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={() =>
                                  isRegistered && handleOpenNewSubmission(idx)
                                }
                                disabled={!isRegistered}
                                title={
                                  isRegistered
                                    ? "Submit your project"
                                    : "Register for the hackathon to submit"
                                }
                              >
                                Submit Project
                              </button>
                            );
                        } else if (
                          submissionType === "single-project" &&
                          roundType2 === "multi-round"
                        ) {
                          console.log(`🔍 Timeline Round ${idx} (multi-round): projectSubmissionsForRound.length = ${projectSubmissionsForRound.length}`, projectSubmissionsForRound);
                          console.log(`🔍 Round ${idx} - Condition: single-project && multi-round`);
                          projectSubmissionUI =
                            projectSubmissionsForRound.length > 0 ? (
                              <div className="flex gap-2 items-center">
                                <div className="px-4 py-2 bg-green-600 text-white rounded text-center cursor-default select-none opacity-80">
                                  Project Submitted
                                </div>
                                {canEdit(end) && (
                                  <button
                                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                                    onClick={() =>
                                      handleDeleteProjectSubmission(
                                        projectSubmissionsForRound[0]
                                      )
                                    }
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            ) : (
                              <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={() =>
                                  isRegistered && handleOpenNewSubmission(idx)
                                }
                                disabled={!isRegistered}
                                title={
                                  isRegistered
                                    ? "Submit your project"
                                    : "Register for the hackathon to submit"
                                }
                              >
                                Submit Project
                              </button>
                            );
                        } else if (
                          submissionType === "multi-project" &&
                          roundType2 === "single-round"
                        ) {
                          const submittedCount = projectSubmissionsForRound.length;
                          const maxAllowed = hackathon.maxSubmissionsPerParticipant || 1;
                          const canSubmitMore = submittedCount < maxAllowed;
                          
                          projectSubmissionUI = (
                            <div className="flex flex-col gap-2">
                              {submittedCount > 0 && (
                                <div className="text-sm text-gray-600">
                                  Submitted: {submittedCount}/{maxAllowed} projects
                                </div>
                              )}
                              <div className="flex gap-2 items-center">
                                {canSubmitMore ? (
                                  <button
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() =>
                                      isRegistered && handleOpenNewSubmission(idx)
                                    }
                                    disabled={!isRegistered}
                                    title={
                                      isRegistered
                                        ? "Submit another project"
                                        : "Register for the hackathon to submit"
                                    }
                                  >
                                    Submit Project
                                  </button>
                                ) : (
                                  <div className="px-4 py-2 bg-gray-400 text-white rounded text-center cursor-default select-none opacity-80">
                                    Max Submissions Reached
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        } else if (
                          submissionType === "multi-project" &&
                          roundType2 === "multi-round"
                        ) {
                          const submittedCount = projectSubmissionsForRound.length;
                          const maxAllowed = hackathon.maxSubmissionsPerParticipant || 1;
                          const canSubmitMore = submittedCount < maxAllowed;
                          
                          projectSubmissionUI = (
                            <div className="flex flex-col gap-2">
                              {submittedCount > 0 && (
                                <div className="text-sm text-gray-600">
                                  Submitted: {submittedCount}/{maxAllowed} projects
                                </div>
                              )}
                              <div className="flex gap-2 items-center">
                                {canSubmitMore ? (
                                  <button
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    onClick={() =>
                                      isRegistered && handleOpenNewSubmission(idx)
                                    }
                                    disabled={!isRegistered}
                                    title={
                                      isRegistered
                                        ? "Submit another project"
                                        : "Register for the hackathon to submit"
                                    }
                                  >
                                    Submit Project
                                  </button>
                                ) : (
                                  <div className="px-4 py-2 bg-gray-400 text-white rounded text-center cursor-default select-none opacity-80">
                                    Max Submissions Reached
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                      }
                      
                      // PPT submission logic
                      if (isSubmission) {
                        if (submission) {
                          pptSubmissionUI = (
                            <div className="flex gap-2 items-center">
                              {submission.originalName ? (
                                <div className="px-4 py-2 bg-green-600 text-white rounded text-center cursor-default select-none opacity-80">
                                  {submission.originalName}
                                </div>
                              ) : (
                                <div className="px-4 py-2 bg-green-600 text-white rounded text-center cursor-default select-none opacity-80">
                                  PPT Submitted
                                </div>
                              )}
                              <button
                                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                                onClick={() => handleDeletePPT(idx)}
                              >
                                Delete
                              </button>
                            </div>
                          );
                        } else {
                          pptSubmissionUI = (
                            <button
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                              onClick={() =>
                                isRegistered &&
                                setPptModal({ open: true, roundIdx: idx })
                              }
                              disabled={
                                uploadingIdx === idx || !isRegistered
                              }
                              title={
                                isRegistered
                                  ? "Submit your PPT"
                                  : "Register for the hackathon to submit"
                              }
                            >
                              Submit PPT
                            </button>
                          );
                        }
                      }
                    }
                    // Round has ended but no deadline passed message
                    else if (!isLive && !deadlinePassed) {
                      if (isProjectSubmission) {
                        projectSubmissionUI = (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 font-medium">
                            This round has not started yet. You can submit when the round begins.
                          </div>
                        );
                      }
                      if (isSubmission) {
                        pptSubmissionUI = (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 font-medium">
                            This round has not started yet. You can submit when the round begins.
                          </div>
                        );
                      }
                    }

                    return (
                      <div key={idx} className="flex items-start relative">
                        <div className="flex flex-col items-center mr-6">
                          <div className="w-12 h-12 bg-indigo-600 rounded-full flex flex-col items-center justify-center text-white font-bold relative z-10 border-2 border-white shadow-md">
                            <span className="text-lg leading-none">{dayNum}</span>
                          </div>
                          
                          <div className="text-xs text-indigo-600 font-medium mt-1 mb-2">
                            {monthStr.toUpperCase()}
                          </div>

                          {idx < filteredRounds.length - 1 && (
                            <div className="w-0.5 h-20 bg-indigo-200 mt-2"></div>
                          )}
                        </div>

                        <div className="flex-1 pb-8">
                          <div className="bg-gray-50 rounded-2xl p-6 border">
                            {isLive && (
                              <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-red-600">Live Now</span>
                              </div>
                            )}

                            <div className="space-y-4">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {round.name || `Submission Round (via Unstop)`}
                              </h4>
                              
                              <p className="text-gray-700 leading-relaxed">
                                {round.description || "This will be a submission round! You will see the \"Submit\" button here, once the round is live."}
                              </p>

                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  <span className="font-medium">Start:</span>
                                  <span>{dayNum} {monthStr} 25, {startTime} IST</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  <span className="font-medium">End:</span>
                                  <span>{dayNum + 1} {monthStr} 25, {endTime} IST</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 pt-2">
                                {projectSubmissionUI}
                                {pptSubmissionUI}
                                
                                {round.resultsAvailable && (
                                  <button className="px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition">
                                    Results
                                  </button>
                                )}
                              </div>

                              {!isRegistered && (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                  <p className="text-sm text-yellow-700">
                                    You're not eligible to participate in this round.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <PPTSubmissionModal
        open={pptModal.open}
        onOpenChange={(open) => {
          setPptModal({ open, roundIdx: open ? pptModal.roundIdx : null });
          if (!open) handleAfterAction();
        }}
        hackathonId={hackathon._id}
        roundIndex={pptModal.roundIdx}
        onSuccess={handleAfterAction}
        hackathon={hackathon}
        editingSubmission={
          pptModal.open && pptModal.roundIdx !== null
            ? getSubmissionForRound(pptModal.roundIdx)
            : null
        }
      />
      
      <ProjectSubmissionModal
        open={
          showProjectModal !== undefined
            ? showProjectModal
            : projectModal.open
        }
        onOpenChange={handleProjectModalOpenChange}
        hackathon={hackathon}
        roundIndex={projectModal.roundIdx}
        onSuccess={handleAfterAction}
        autoSelectProjectId={autoSelectProjectId}
        editingSubmission={editingSubmission}
        onEditSuccess={handleAfterAction}
        onSubmitAnother={handleSubmitAnother}
        projectSubmissions={projectSubmissions}
      />
      
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog({
            open,
            submission: open ? deleteDialog.submission : null,
          })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your project submission? You
              can resubmit anytime until the round ends.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() =>
                setDeleteDialog({ open: false, submission: null })
              }
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProjectSubmission}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
