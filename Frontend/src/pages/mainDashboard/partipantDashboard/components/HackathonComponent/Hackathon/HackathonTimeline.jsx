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
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
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
        <div className="flex flex-col gap-8">
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
              const startStr = start
                ? start.toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZoneName: "short",
                  })
                : "N/A";
              const endStr = end
                ? end.toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    timeZoneName: "short",
                  })
                : "N/A";
              // --- New logic for project submissions ---
              let projectSubmissionsForRound =
                getProjectSubmissionsForRound(idx);
              const maxProjects = hackathon.maxSubmissionsPerParticipant || 1;
              // Fix: define dayNum and monthStr
              const dayNum = start ? start.getDate() : idx + 1;
              const monthStr = start
                ? start.toLocaleString("en-US", { month: "short" })
                : "";
              // Fix: define submission for PPT logic
              const submission = getSubmissionForRound(idx);

              // --- Submission logic based on hackathon type ---
              const roundType = hackathon.roundType || "single-round";
              // For single-round, only consider the first project round
              const isFirstProjectRound =
                rounds
                  .filter(
                    (r) => r.type && r.type.toLowerCase().includes("project")
                  )
                  .findIndex((r) => r === round) === 0;
              // For multi-round, allow per round

              // --- UI rendering for project submission ---
              let projectSubmissionUI = null;
              if (isProjectSubmission) {
                // 1. Single Project, Single Round
                if (
                  submissionType === "single-project" &&
                  roundType === "single-round"
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
                        )
                      );
                  }
                }
                // 2. Single Project, Multi Round
                else if (
                  submissionType === "single-project" &&
                  roundType === "multi-round"
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
                      )
                    );
                }
                // 3. Multiple Project, Single Round
                else if (
                  submissionType === "multi-project" &&
                  roundType === "single-round"
                ) {
                  if (isFirstProjectRound) {
                    // Count logic
                    const submittedCount = projectSubmissionsForRound.length;
                    const maxAllowed = maxProjects;
                    const canSubmitMore =
                      maxAllowed === null || submittedCount < maxAllowed;
                    const remaining =
                      maxAllowed === null
                        ? "unlimited"
                        : maxAllowed - submittedCount;
                    // Info bar only if at least one submitted
                    projectSubmissionUI = (
                      <>
                        {submittedCount > 0 && (
                          <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-blue-800 font-medium">
                            {maxAllowed === null
                              ? `You can submit unlimited projects to this hackathon.`
                              : `You have submitted ${submittedCount} out of ${maxAllowed} allowed projects. ${
                                  canSubmitMore
                                    ? `You can submit ${remaining} more.`
                                    : "You cannot submit more projects."
                                }`}
                          </div>
                        )}
                        {projectSubmissionsForRound.length > 0 && (
                          <div className="flex flex-col gap-2 mb-2">
                            {projectSubmissionsForRound.map((sub, i) => (
                              <div
                                key={sub._id}
                                className="flex gap-2 items-center"
                              >
                                <div className="px-4 py-2 bg-green-600 text-white rounded text-center cursor-default select-none opacity-80">
                                  Submitted Project {i + 1}
                                </div>
                                {isLive && canEdit(end) && (
                                  <>
                                    <button
                                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                                      onClick={() =>
                                        handleDeleteProjectSubmission(sub)
                                      }
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {isLive && canEdit(end) && canSubmitMore && (
                          <button
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={() =>
                              isRegistered && handleSubmitAnother(idx)
                            }
                            disabled={!isRegistered}
                            title={
                              isRegistered
                                ? "Submit another project"
                                : "Register for the hackathon to submit"
                            }
                          >
                            {submittedCount === 0
                              ? "Submit Project"
                              : "Submit Another Project"}
                          </button>
                        )}
                        {isLive && !canSubmitMore && (
                          <div className="mt-2 text-red-600 font-semibold">
                            You have submitted all allowed projects. To submit a
                            new one, delete an existing submission.
                          </div>
                        )}
                      </>
                    );
                  } else {
                    // For all other project rounds, do not render projectSubmissionUI
                    projectSubmissionUI = null;
                  }
                }
                // 4. Multiple Project, Multi Round
                else if (
                  submissionType === "multi-project" &&
                  roundType === "multi-round"
                ) {
                  // Count logic for this round
                  const submittedCount = projectSubmissionsForRound.length;
                  const maxAllowed = maxProjects;
                  const canSubmitMore =
                    maxAllowed === null || submittedCount < maxAllowed;
                  const remaining =
                    maxAllowed === null
                      ? "unlimited"
                      : maxAllowed - submittedCount;
                  projectSubmissionUI = (
                    <>
                      {submittedCount > 0 && (
                        <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-blue-800 font-medium">
                          {maxAllowed === null
                            ? `You can submit unlimited projects to this round.`
                            : `You have submitted ${submittedCount} out of ${maxAllowed} allowed projects. ${
                                canSubmitMore
                                  ? `You can submit ${remaining} more.`
                                  : "You cannot submit more projects."
                              }`}
                        </div>
                      )}
                      {projectSubmissionsForRound.length > 0 && (
                        <div className="flex flex-col gap-2 mb-2">
                          {projectSubmissionsForRound.map((sub, i) => (
                            <div
                              key={sub._id}
                              className="flex gap-2 items-center"
                            >
                              <div className="px-4 py-2 bg-green-600 text-white rounded text-center cursor-default select-none opacity-80">
                                Submitted Project {i + 1}
                              </div>
                              {isLive && canEdit(end) && (
                                <>
                                  <button
                                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                                    onClick={() =>
                                      handleDeleteProjectSubmission(sub)
                                    }
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {isLive &&
                        canEdit(end) &&
                        (projectSubmissionsForRound.length < maxProjects ||
                          maxProjects === null) && (
                          <button
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={() =>
                              isRegistered && handleSubmitAnother(idx)
                            }
                            disabled={!isRegistered}
                            title={
                              isRegistered
                                ? "Submit another project"
                                : "Register for the hackathon to submit"
                            }
                          >
                            {projectSubmissionsForRound.length === 0
                              ? "Submit Project"
                              : "Submit Another Project"}
                          </button>
                        )}
                    </>
                  );
                }
              }
              // --- End submission logic ---
              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 relative group"
                >
                  {/* Timeline vertical line */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold ring-4 ring-blue-100">
                      {dayNum}
                    </div>
                    <span className="text-xs text-blue-500 mt-1 font-medium">
                      {monthStr}
                    </span>
                    {idx < rounds.length - 1 && (
                      <div className="w-px h-16 bg-blue-200 mt-2"></div>
                    )}
                  </div>

                  {/* Card for round */}
                  <div className="flex-1">
                    <Card className="py-5">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                          <div>
                            <h3 className="text-xl font-semibold tracking-tight text-gray-800">
                              {round.name || `Round ${idx + 1}`}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {round.description}
                            </p>

                            <div className="flex flex-col gap-1 text-sm text-gray-600">
                              <span>
                                Start:{" "}
                                <span className="font-medium">{startStr}</span>
                              </span>
                              <span>
                                End:{" "}
                                <span className="font-medium">{endStr}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 items-end mt-4 md:mt-0">
                            {/* --- Project Submission Logic --- */}
                            {projectSubmissionUI}
                            {/* --- End Project Submission Logic --- */}
                            {/* Existing PPT and Results logic ... */}
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
                                    Submit PPT
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
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            });
          })()}
          {/* PPT Submission Modal */}
          <PPTSubmissionModal
            open={pptModal.open}
            onOpenChange={(open) => {
              setPptModal({ open, roundIdx: open ? pptModal.roundIdx : null });
              if (!open) handleAfterAction(); // always refresh after modal closes
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
          {/* Project Submission Modal */}
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
