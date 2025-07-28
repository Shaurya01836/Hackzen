import { useState, useEffect } from "react";
import axios from "axios";

const CRITERIA = [
  { key: "innovation", label: "Innovation" },
  { key: "impact", label: "Impact" },
  { key: "technicality", label: "Technicality" },
  { key: "presentation", label: "Presentation" },
];

export default function JudgeEvaluation({ submissionId, onSubmitted }) {
  const [existingScore, setExistingScore] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing score for this submission
  useEffect(() => {
    const fetchExistingScore = async () => {
      if (!submissionId) return;
      
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/scores/my-score/${submissionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.score) {
          setExistingScore(response.data.score);
        }
      } catch (err) {
        // No existing score found or error - this is normal
        console.log("No existing score found for this submission");
      } finally {
        setLoading(false);
      }
    };

    fetchExistingScore();
  }, [submissionId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!existingScore) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-gray-500 mb-2">
          <span role="img" aria-label="clipboard">📋</span>
        </div>
        <p className="text-gray-600 font-medium">No evaluation submitted yet</p>
        <p className="text-sm text-gray-500 mt-1">Use the evaluation form in the sidebar to submit your score</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Score Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CRITERIA.map(({ key, label }) => (
          <div key={key} className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {existingScore.scores[key]}
            </div>
            <div className="text-xs text-blue-700 font-medium">{label}</div>
          </div>
        ))}
      </div>
      
      {/* Overall Score */}
      <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
        <span role="img" aria-label="star">⭐</span>
        <span className="text-lg font-bold text-blue-800">
          Overall: {((existingScore.scores.innovation + existingScore.scores.impact + existingScore.scores.technicality + existingScore.scores.presentation) / 4).toFixed(1)}/10
        </span>
      </div>

      {/* Feedback */}
      {existingScore.feedback && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
          <div className="text-sm font-medium text-blue-800 mb-2">Your Feedback:</div>
          <div className="text-sm text-blue-700 italic">"{existingScore.feedback}"</div>
        </div>
      )}

      {/* Submission Date */}
      <div className="flex items-center gap-2 text-xs text-blue-600">
        <span role="img" aria-label="clock">🕐</span>
        <span>Submitted on {new Date(existingScore.createdAt).toLocaleDateString()} at {new Date(existingScore.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
} 