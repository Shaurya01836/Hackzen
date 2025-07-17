import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../../../components/CommonUI/button";
import { Eye } from "lucide-react";
import { ProjectDetail } from "../../../components/CommonUI/ProjectDetail";

export default function AdminHackathonSubmissionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [submissionsError, setSubmissionsError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [fullProject, setFullProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState(null);

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/hackathons/${id}`);
        setHackathon(res.data);
      } catch (err) {
        setHackathon(null);
      }
    };
    fetchHackathon();
  }, [id]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setSubmissionsLoading(true);
      setSubmissionsError(null);
      try {
        const res = await axios.get(`/api/submission-form/admin/hackathon/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        setSubmissionsError("Failed to fetch submissions");
      } finally {
        setSubmissionsLoading(false);
      }
    };
    fetchSubmissions();
  }, [id]);

  const handleViewDetails = async (submission) => {
    setSelectedSubmission(submission);
    setFullProject(null);
    setProjectLoading(true);
    setProjectError(null);
    try {
      const res = await fetch(`/api/projects/${submission.projectId?._id || submission.projectId}`);
      if (!res.ok) throw new Error("Failed to fetch project details");
      const data = await res.json();
      setFullProject(data);
    } catch (err) {
      setProjectError(err.message || "Error fetching project details");
    } finally {
      setProjectLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 p-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" className="mr-4" onClick={() => navigate('/admin/hackathons')}>
          Back
        </Button>
        <h1 className="text-3xl font-bold text-purple-700">
          Submissions for {hackathon ? hackathon.title : "Hackathon"}
        </h1>
      </div>
      {submissionsLoading ? (
        <div className="p-10 text-center text-lg">Loading submissions...</div>
      ) : submissionsError ? (
        <div className="p-10 text-center text-red-500">{submissionsError}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-purple-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Project</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Team</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Submitted By</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Submitted At</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">No submissions found.</td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <tr key={submission._id} className="hover:bg-purple-50">
                    <td className="px-4 py-2">
                      <div className="font-medium text-gray-800">{submission.projectId?.title || "Untitled Project"}</div>
                      <div className="text-xs text-gray-500">{submission.projectId?.description?.slice(0, 40) || ""}</div>
                    </td>
                    <td className="px-4 py-2">{submission.teamName || "-"}</td>
                    <td className="px-4 py-2">{submission.submittedByName || "-"}</td>
                    <td className="px-4 py-2">{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : "-"}</td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-700">
                        {submission.status || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <Button
                        variant="outline"
                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                        onClick={() => navigate(`/admin/hackathons/${id}/submissions/${submission._id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 