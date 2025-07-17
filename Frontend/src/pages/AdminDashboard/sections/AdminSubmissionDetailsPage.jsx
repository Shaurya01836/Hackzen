import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../components/CommonUI/button";
import { ProjectDetail } from "../../../components/CommonUI/ProjectDetail";
import axios from "axios";

export default function AdminSubmissionDetailsPage() {
  const { id, submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
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
        setSubmission(submissionData);
        if (submissionData.projectId) {
          const projectRes = await axios.get(`/api/projects/${submissionData.projectId._id || submissionData.projectId}`);
          setProject(projectRes.data);
        }
      } catch (err) {
        setError("Failed to fetch submission or project details");
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissionAndProject();
  }, [submissionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 p-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" className="mr-4" onClick={() => navigate(`/admin/hackathons/${id}/submissions`)}>
          Back
        </Button>
        <h1 className="text-3xl font-bold text-purple-700">
          Submission Details
        </h1>
      </div>
      {loading ? (
        <div className="p-10 text-center text-lg">Loading details...</div>
      ) : error ? (
        <div className="p-10 text-center text-red-500">{error}</div>
      ) : (
        <div>
          {project ? (
            <ProjectDetail project={project} hideBackButton={true} />
          ) : (
            <div className="p-10 text-center text-gray-500">No project details found.</div>
          )}
        </div>
      )}
    </div>
  );
} 