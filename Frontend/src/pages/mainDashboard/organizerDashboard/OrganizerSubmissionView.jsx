import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectDetail from "../../../components/CommonUI/ProjectDetail";
import { Button } from "../../../components/CommonUI/button";
import { ArrowLeft } from "lucide-react";

export default function OrganizerSubmissionView() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [averages, setAverages] = useState(null);

  useEffect(() => {
    async function fetchSubmission() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/submission-form/admin/${submissionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Submission not found");
        const data = await res.json();
        setSubmission(data.submission || data);
        // Fetch judge evaluations
        const evalRes = await fetch(`/api/submission-form/${submissionId}/judge-evaluations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (evalRes.ok) {
          const evalData = await evalRes.json();
          setEvaluations(evalData.evaluations || []);
          setAverages(evalData.averages || null);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch submission");
      } finally {
        setLoading(false);
      }
    }
    if (submissionId) fetchSubmission();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <p className="mb-4">{error}</p>
        <Button onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
      </div>
    );
  }
  if (!submission) return null;

  let projectForDetail = submission;
  if (submission && submission.projectId) {
    // Merge submission fields (like teamName, leaderName, problemStatement) into projectId for full context
    projectForDetail = { ...submission.projectId, ...submission, _id: submission.projectId._id || submission._id };
  } else if (submission && submission.pptFile) {
    projectForDetail = { ...submission, type: 'ppt' };
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-20 bg-white/80 border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <span className="text-lg font-semibold text-gray-700">Submission Details</span>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProjectDetail
          project={projectForDetail}
          submission={submission}
          evaluations={evaluations}
          averages={averages}
          hideBackButton={true}
          onlyOverview={false}
        />
      </div>
    </div>
  );
} 