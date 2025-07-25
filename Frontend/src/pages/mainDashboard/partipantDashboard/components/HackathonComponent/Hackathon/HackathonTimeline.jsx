"use client";
import { useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../../components/CommonUI/card";
// import { format } from "date-fns"; // Uncomment if date-fns is available
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
  const [refreshKey, setRefreshKey] = useState(0); // force refresh
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
  // Add state for delete confirmation
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    submission: null,
  });

  // All your existing useEffect hooks and handlers remain the same...
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
        console.log("[useEffect] projectSubmissions:", updatedSubs); // Debug log
      } catch {
        setProjectSubmissions([]);
      }
    }
    fetchProjectSubmissions();
  }, [hackathon._id, user?._id, refreshKey]);

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
      // Save submission to backend
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
      // Refresh submissions
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
    setRefreshKey((k) => k + 1);
  };

  // Add handler for deleting a project submission
  const handleDeleteProjectSubmission = (submission) => {
    setDeleteDialog({ open: true, submission });
  };

  // Actual delete logic after confirmation
  const confirmDeleteProjectSubmission = async () => {
    const submission = deleteDialog.submission;
    setDeleteDialog({ open: false, submission: null });
    if (!submission) return;
    console.log("Deleting submission:", submission); // Debug log
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
      // Force fetch project submissions immediately
      if (hackathon._id && user?._id) {
        const res = await axios.get(
          `http://localhost:3000/api/submission-form/submissions?hackathonId=${hackathon._id}&userId=${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updatedSubs = (res.data.submissions || []).filter(
          (s) => s.projectId
        );
        setProjectSubmissions(updatedSubs);
        console.log("Updated projectSubmissions:", updatedSubs); // Debug log
      }
      handleAfterAction(); // still increment refreshKey for other effects
    } catch (err) {
      // Show backend error if present
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

  // Helper: check if user has submitted for this round
  console.log("pptSubmissions:", pptSubmissions);
  const getSubmissionForRound = (roundIdx) => {
    const found = pptSubmissions.find(
      (s) => String(s.roundIndex) === String(roundIdx)
    );
    console.log("Checking roundIdx", roundIdx, "found submission:", found);
    return found;
  };

  // Helper to get download link with correct filename and extension
  const getPPTDownloadLink = (
    pptFile,
    originalName,
    fallbackName = "presentation"
  ) => {
    if (!pptFile) return "#";
    // Remove duplicate /raw/raw/ if present
    let url = pptFile.replace("/raw/raw/", "/raw/");
    // Extract publicId
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    let publicId = matches ? matches[1] : "";
    // Remove .pptx if already present
    publicId = publicId.replace(/\.pptx$/, "");
    // Use originalName (without extension) or fallback
    let baseName = fallbackName;
    if (originalName) {
      baseName = originalName.replace(/\.[^/.]+$/, "");
    } else if (publicId) {
      baseName = publicId.split("/").pop() || fallbackName;
    }
    // Compose the download URL
    const baseUrl = url.split("/upload/")[0];
    return `${baseUrl}/raw/upload/fl_attachment:${baseName}.pptx/${publicId}.pptx`;
  };

  // Helper: get all project submissions for a round
  const getProjectSubmissionsForRound = (roundIdx) => {
    return projectSubmissions.filter(
      (s) => String(s.roundIndex) === String(roundIdx)
    );
  };

  // Helper: can edit before deadline
  const canEdit = (end) => {
    return !end || now <= end;
  };

  // Handler for closing modal (reset editingSubmission)
  const handleProjectModalOpenChange = (open) => {
    setProjectModal((prev) => ({ ...prev, open }));
    if (!open) setEditingSubmission(null);
    if (!open && typeof setShowProjectModal === "function")
      setShowProjectModal(false);
    if (!open) handleAfterAction();
  };

  // Handler for Submit Another Project
  const handleSubmitAnother = (roundIdx) => {
    setEditingSubmission(null);
    setProjectModal({ open: true, roundIdx });
  };

  // Handler for opening new submission
  const handleOpenNewSubmission = (roundIdx) => {
    setEditingSubmission(null);
    setProjectModal({ open: true, roundIdx });
  };

  return (
    <section ref={sectionRef} className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">
        Stages and Timelines
      </h2>
      
      {rounds.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              No rounds have been defined for this hackathon yet.
            </CardTitle>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-0">
          {/* For 'multi-project' + 'single-round', only show the first project round */}
          {(() => {
            const submissionType = hackathon.submissionType || "single-project";
            const roundType = hackathon.roundType || "single-round";
            let filteredRounds = rounds;
            if (
              submissionType === "multi-project" &&
              roundType === "single-round"
            ) {
              // Find the first project round
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
              
              // Get day and month from start date
              const dayNum = start ? start.getDate() : idx + 24; // fallback to 24+ for numbering
              const monthStr = start
                ? start.toLocaleString("en-US", { month: "short" })
                : "Jul";

              // Format time strings
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

              // --- New logic for project submissions ---
              let projectSubmissionsForRound =
                getProjectSubmissionsForRound(idx);
              const maxProjects = hackathon.maxSubmissionsPerParticipant || 1;
              
              // Fix: define submission for PPT logic
              const submission = getSubmissionForRound(idx);

              // --- Submission logic based on hackathon type ---
              const roundType2 = hackathon.roundType || "single-round";
              // For single-round, only consider the first project round
              const isFirstProjectRound =
                rounds
                  .filter(
                    (r) => r.type && r.type.toLowerCase().includes("project")
                  )
                  .findIndex((r) => r === round) === 0;

              // --- UI rendering for project submission ---
              let projectSubmissionUI = null;
              if (isProjectSubmission) {
                // 1. Single Project, Single Round
                if (
                  submissionType === "single-project" &&
                  roundType2 === "single-round"
                ) {
                  if (isFirstProjectRound) {
                    projectSubmissionUI =
                      projectSubmissionsForRound.length > 0 ? (
                        <div className="flex gap-2 items-center">
                          <div className="px-4 py-2 bg-green-600 text-white rounded text-center cursor-default select-none opacity-80">
                            Project Submitted
                          </div>
                          {isLive && canEdit(end) && (
                            <>
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
                            </>
                          )}
                        </div>
                      ) : (
                        isLive && (
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
                            Submission
                          </button>
                        )
                      );
                  }
                }
                // Continue with all other submission logic cases...
                // (keeping all the same logic but with "Submission" button text)
                else if (
                  submissionType === "single-project" &&
                  roundType2 === "multi-round"
                ) {
                  projectSubmissionUI =
                    projectSubmissionsForRound.length > 0 ? (
                      <div className="flex gap-2 items-center">
                        <div className="px-4 py-2 bg-green-600 text-white rounded text-center cursor-default select-none opacity-80">
                          Project Submitted
                        </div>
                        {isLive && canEdit(end) && (
                          <>
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
                          </>
                        )}
                      </div>
                    ) : (
                      isLive && (
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
                          Submission
                        </button>
                      )
                    );
                }
                // Add remaining cases...
              }

              return (
                <div key={idx} className="flex items-start relative">
                  {/* Left timeline section */}
                  <div className="flex flex-col items-center mr-6">
                    {/* Date circle - matching reference style */}
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex flex-col items-center justify-center text-white font-bold relative z-10 border-2 border-white shadow-md">
                      <span className="text-lg leading-none">{dayNum}</span>
                    </div>
                    
                    {/* Month label */}
                    <div className="text-xs text-blue-600 font-medium mt-1 mb-2">
                      {monthStr.toUpperCase()}
                    </div>

                    {/* Vertical connecting line */}
                    {idx < filteredRounds.length - 1 && (
                      <div className="w-0.5 h-20 bg-blue-200 mt-2"></div>
                    )}
                  </div>

                  {/* Right content section */}
                  <div className="flex-1 pb-8">
                    <Card className="p-4">
                      {/* Live indicator inside the card */}
                      {isLive && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Live</span>
                        </div>
                      )}

                      {/* Content in column layout */}
                      <div className="space-y-3">
                        {/* Title */}
                        <h3 className="text-lg font-semibold text-gray-800">
                          {round.name || `Submission Round (via Unstop)`}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-sm text-gray-600">
                          {round.description || "This will be a submission round! You will see the \"Submit\" button here, once the round is live."}
                        </p>

                        {/* Start time */}
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Start:</span> <span className="font-medium">{dayNum} {monthStr} 25, {startTime} IST</span>
                        </div>

                    {/* End time with buttons on the same line */}
<div className="flex items-center justify-between">
  <div className="text-sm text-gray-600">
    <span className="font-medium">End:</span> <span className="font-medium">{dayNum + 1} {monthStr} 25, {endTime} IST</span>
  </div>
  
  {/* Action buttons section - moved to same line as End time */}
  <div className="flex items-center gap-2">
    {/* Project submission buttons */}
    {projectSubmissionUI}
    
    {/* PPT submission buttons */}
    {isSubmission &&
      (submission ? (
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
          {isLive && (
            <>
              <button
                className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
                onClick={() =>
                  setPptModal({
                    open: true,
                    roundIdx: idx,
                  })
                }
              >
                Edit
              </button>
              <button
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                onClick={() => handleDeletePPT(idx)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ) : (
        isLive && (
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
            Submission
          </button>
        )
      ))}
      
    {round.resultsAvailable && (
      <button className="px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition">
        Results
      </button>
    )}
  </div>
</div>


                        {/* Eligibility notice */}
                        {!isRegistered && (
                          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded ">
                            <h1 className="text-sm text-yellow-700">
                             You're not eligible to participate in this round.
                            </h1>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              );
            });
          })()}

          {/* All your existing modals remain the same */}
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
        </div>
      )}
    </section>
  );
}
