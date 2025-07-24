import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectDetail } from "../../../components/CommonUI/ProjectDetail";
import axios from "axios";

export default function AdminSubmissionDetailsPage({ hackathonId, submissionId }) {
  console.log("Hackathon ID from props:", hackathonId, "Submission ID from props:", submissionId);
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissionAndProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/submission-form/admin/submission/${submissionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const submissionData = res.data.submission || res.data;
        if (submissionData.projectId) {
          const projectRes = await axios.get(`/api/projects/${submissionData.projectId._id || submissionData.projectId}`);
          setProject(projectRes.data);
        }
      } catch {
        setError("Failed to fetch submission or project details");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissionAndProject();
  }, [submissionId]);

  if (loading) {
    return <div className="p-10 text-center text-lg">Loading details...</div>;
  }
  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }
  if (!project) {
    return <div className="text-center text-gray-500">No project details found.</div>;
  }
  return (
    <ProjectDetail
      project={project}
      hideBackButton={false}
      onBack={() => navigate(`/admin/hackathons/${hackathonId}/submissions`)}
      backButtonLabel="Back to Submissions"
    />
  );
} 