import { useEffect, useState } from "react";
import BaseModal from "./TeamModals/BaseModal";
import { Button } from "../../../../../components/CommonUI/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../../components/CommonUI/select";
import { useToast } from '../../../../../hooks/use-toast';
import { useNavigate, useLocation } from "react-router-dom";

export default function ProjectSubmissionModal({ open, onOpenChange, hackathon, roundIndex, onSuccess, autoSelectProjectId, editingSubmission }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDebug, setShowDebug] = useState(false);
  // Add state for editing mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Helper to fetch projects
  const fetchProjects = async (autoSelectLatest = false) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/projects/mine", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setProjects(data || []);
      const params = new URLSearchParams(location.search);
      const newProjectId = params.get("newProjectId");
      if (newProjectId && data.some(p => p._id === newProjectId)) {
        setSelectedProject(newProjectId);
      } else if (autoSelectLatest && data && data.length > 0) {
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSelectedProject(sorted[0]._id);
      }
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-open modal if returnTo=hackathon-timeline is in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("returnTo") === "hackathon-timeline" && !open) {
      if (onOpenChange) onOpenChange(true);
      // Remove the param from the URL after opening
      params.delete("returnTo");
      navigate({ search: params.toString() }, { replace: true });
    }
    // eslint-disable-next-line
  }, [location.search]);

  // Fetch projects and auto-select the latest if redirected from create
  useEffect(() => {
    if (!open) {
      setSelectedProject("");
      setSelectedProblem("");
      return;
    }
    const params = new URLSearchParams(location.search);
    fetchProjects(params.get("returnTo") === "hackathon-timeline");
    // eslint-disable-next-line
  }, [open, location.search]);

  useEffect(() => {
    if (open && autoSelectProjectId) {
      setSelectedProject(autoSelectProjectId);
    }
  }, [open, autoSelectProjectId]);

  // Pre-fill form if editing
  useEffect(() => {
    if (editingSubmission && open) {
      setIsEditMode(true);
      setEditingId(editingSubmission._id);
      setSelectedProject(editingSubmission.projectId?._id || editingSubmission.projectId);
      setSelectedProblem(editingSubmission.problemStatement || "");
    } else if (open) {
      setIsEditMode(false);
      setEditingId(null);
      setSelectedProject("");
      setSelectedProblem("");
    }
  }, [editingSubmission, open]);

  const handleRefresh = () => {
    fetchProjects();
  };

  const handleCreateNew = () => {
    const hackathonId = hackathon?._id || hackathon?.id;
    const returnUrl = encodeURIComponent(`/dashboard/hackathons/${hackathonId}?returnTo=hackathon-timeline`);
    navigate(`/dashboard/my-hackathons?createProject=1&hackathonId=${hackathonId}&returnUrl=${returnUrl}`);
    if (onOpenChange) onOpenChange(false); // Close modal
  };

  const handleSubmit = async () => {
    if (!selectedProject) return;
    if (hackathon.problemStatements?.length && !selectedProblem) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (isEditMode && editingId) {
        // Edit existing submission
        const res = await fetch(`http://localhost:3000/api/submission-form/submission/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            projectId: selectedProject,
            problemStatement: selectedProblem,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Update failed");
        toast({ title: "Submission Updated!", description: "Your project submission has been updated.", variant: "success" });
        if (onOpenChange) onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        // Create new submission (existing logic)
        // Find the selected project
        const project = projects.find(p => p._id === selectedProject);
        // If the project is not linked to this hackathon, update it first
        if (!project.hackathon || (project.hackathon._id !== hackathon._id && project.hackathon !== hackathon._id)) {
          const updateRes = await fetch(`http://localhost:3000/api/projects/${selectedProject}/assign-hackathon`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ hackathonId: hackathon._id }),
          });
          if (!updateRes.ok) {
            const errData = await updateRes.json();
            throw new Error(errData.message || "Failed to link project to hackathon");
          }
        }
        // Now submit the project
        const res = await fetch("http://localhost:3000/api/submission-form/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            hackathonId: hackathon._id,
            roundIndex,
            projectId: selectedProject,
            problemStatement: selectedProblem,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Submission failed");
        toast({ title: "Project Submitted!", description: "Your project has been submitted successfully.", variant: "success" });
        if (onOpenChange) onOpenChange(false);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast({ title: isEditMode ? "Update failed" : "Submission failed", description: err.message || "Could not submit project", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const showProblemDropdown = hackathon.problemStatements && hackathon.problemStatements.length > 0 && selectedProject;
  const canSubmit = selectedProject && (!showProblemDropdown || selectedProblem);

  // Debug log for dropdown rendering
  if (projects && projects.length > 0) {
    // eslint-disable-next-line
    console.log("[ProjectSubmissionModal] Projects for dropdown:", projects);
  }

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Submit Project for this Round"
      description="Choose a project to submit for this round. You can select an existing project or create a new one."
      content={
        <div className="flex flex-col gap-4 mt-2">
          <Button variant="outline" className="w-full" onClick={handleRefresh}>
            Refresh Projects
          </Button>
          {loading ? (
            <div>Loading your projects...</div>
          ) : projects.length === 0 ? (
            <>
              <div className="text-gray-600 text-center">No previous projects.</div>
             
              {showDebug && (
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-40">{JSON.stringify(projects, null, 2)}</pre>
              )}
            </>
          ) : (
            <>
              <div className="text-sm text-gray-700">{projects.length} project(s) found.</div>
              {/* Fallback: Native select for debugging */}
              <label className="block text-sm font-medium text-gray-700 mt-2">Select a project</label>
              <select
                value={selectedProject}
                onChange={e => setSelectedProject(e.target.value)}
                disabled={submitting}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.title || project.name}
                  </option>
                ))}
              </select>
              {/*
              <Select value={selectedProject} onValueChange={setSelectedProject} disabled={submitting}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project._id} value={project._id}>{project.title || project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              */}
              <Button onClick={handleCreateNew} className="w-full bg-blue-600 text-white mt-2">Create New Project</Button>
              <Button variant="outline" className="w-full mt-2" onClick={() => setShowDebug(d => !d)}>
                {showDebug ? "Hide" : "Show"} Debug Project JSON
              </Button>
              {showDebug && (
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-h-40">{JSON.stringify(projects, null, 2)}</pre>
              )}
              {showProblemDropdown && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mt-2">Select a problem statement</label>
                  <select
                    value={selectedProblem}
                    onChange={e => setSelectedProblem(e.target.value)}
                    disabled={submitting}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a problem statement</option>
                    {hackathon.problemStatements.map((ps, idx) => (
                      <option key={idx} value={typeof ps === 'object' && ps !== null ? ps.statement : ps}>
                        {typeof ps === 'object' && ps !== null ? ps.statement : ps}
                      </option>
                    ))}
                  </select>
                  {/*
                  <Select value={selectedProblem} onValueChange={setSelectedProblem} disabled={submitting}>
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select a problem statement" />
                    </SelectTrigger>
                    <SelectContent>
                      {hackathon.problemStatements.map((ps, idx) => (
                        <SelectItem key={idx} value={typeof ps === 'object' && ps !== null ? ps.statement : ps}>
                          {typeof ps === 'object' && ps !== null ? ps.statement : ps}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  */}
                </>
              )}
            </>
          )}
          <Button
            className="w-full bg-green-600 text-white mt-4"
            onClick={handleSubmit}
            disabled={submitting || !canSubmit}
          >
            {submitting ? (isEditMode ? "Saving..." : "Submitting...") : (isEditMode ? "Save Changes" : "Submit Project")}
          </Button>
        </div>
      }
    />
  );
} 