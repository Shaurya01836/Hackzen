"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FileText,
  Award,
  Upload,
} from "lucide-react";
import {
  ACard,
  ACardContent,
} from "../../../components/DashboardUI/AnimatedCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/CommonUI/tabs";

export function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await axios.get(
          `http://localhost:3000/api/submission-form/submissions?userId=${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
    };
    fetchSubmissions();
  }, []);

  // For stats and tabs, you can categorize by status or other fields if needed
  const total = submissions.length;
  const judged = submissions.filter((s) => s.status === "reviewed").length;
  const pending = submissions.filter((s) => s.status !== "reviewed").length;

  // Render a card for each submission
  const renderSubmissionCard = (sub) => (
    <ACard key={sub._id}>
      <ACardContent className="pt-4">
        <div className="font-bold text-lg mb-2">
          {sub.projectId?.title || sub.projectId || "Untitled Project"}
        </div>
        <div className="text-sm text-gray-600 mb-1">
          Hackathon: {sub.hackathonId?.name || sub.hackathonId}
        </div>
        <div className="text-sm text-gray-600 mb-1">
          Status: {sub.status}
        </div>
        <div className="text-xs text-gray-400">
          Submitted: {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : "-"}
        </div>
        <button
          className="mt-2 text-indigo-600 underline"
          onClick={() => setSelectedSubmission(sub)}
        >
          View Details
        </button>
      </ACardContent>
    </ACard>
  );

  if (selectedSubmission) {
    // You can render a details view here, or navigate to a details page if you have one
    return (
      <ACard>
        <ACardContent className="pt-4">
          <button
            className="mb-4 text-indigo-600 underline"
            onClick={() => setSelectedSubmission(null)}
          >
            Back to My Submissions
          </button>
          <div className="font-bold text-lg mb-2">
            {selectedSubmission.projectId?.title || selectedSubmission.projectId || "Untitled Project"}
          </div>
          <div className="text-sm text-gray-600 mb-1">
            Hackathon: {selectedSubmission.hackathonId?.name || selectedSubmission.hackathonId}
          </div>
          <div className="text-sm text-gray-600 mb-1">
            Status: {selectedSubmission.status}
          </div>
          <div className="text-xs text-gray-400">
            Submitted: {selectedSubmission.submittedAt ? new Date(selectedSubmission.submittedAt).toLocaleString() : "-"}
          </div>
          {/* Add more details as needed */}
        </ACardContent>
      </ACard>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 md:min-h-screen">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Submissions</h1>
          <p className="text-sm text-gray-500">
            Track your project submissions and results
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{total}</p>
                <p className="text-sm text-gray-500">Total Submissions</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{judged}</p>
                <p className="text-sm text-gray-500">Judged</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Upload className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{pending}</p>
                <p className="text-sm text-gray-500">Pending Review</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({total})</TabsTrigger>
          <TabsTrigger value="judged">Judged ({judged})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {submissions.map(renderSubmissionCard)}
          </div>
        </TabsContent>

        <TabsContent value="judged">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {submissions.filter((s) => s.status === "reviewed").map(renderSubmissionCard)}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          {pending > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {submissions.filter((s) => s.status !== "reviewed").map(renderSubmissionCard)}
            </div>
          ) : (
            <ACard>
              <ACardContent className="flex flex-col items-center justify-center py-12">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Pending Submissions
                </h3>
                <p className="text-gray-500 text-center">
                  All your submissions have been reviewed.
                </p>
              </ACardContent>
            </ACard>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
