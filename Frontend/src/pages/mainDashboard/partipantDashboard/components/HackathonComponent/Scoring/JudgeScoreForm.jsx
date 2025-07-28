import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../../../../../../components/CommonUI/button";
import { Input } from "../../../../../../components/CommonUI/input";
import { Textarea } from "../../../../../../components/CommonUI/textarea";

const CRITERIA = [
  { key: "innovation", label: "Innovation" },
  { key: "impact", label: "Impact" },
  { key: "technicality", label: "Technicality" },
  { key: "presentation", label: "Presentation" },
];

export default function JudgeScoreForm({ submissionId, onSubmitted }) {
  const [scores, setScores] = useState({
    innovation: "",
    impact: "",
    technicality: "",
    presentation: "",
  });
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
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
          // Pre-fill the form with existing scores
          setScores({
            innovation: response.data.score.scores.innovation.toString(),
            impact: response.data.score.scores.impact.toString(),
            technicality: response.data.score.scores.technicality.toString(),
            presentation: response.data.score.scores.presentation.toString(),
          });
          setFeedback(response.data.score.feedback || "");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^\d{0,2}$/.test(value)) {
      setScores({ ...scores, [name]: value });
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validate = () => {
    const newErrors = {};
    CRITERIA.forEach(({ key }) => {
      const val = scores[key] === "" ? null : Number(scores[key]);
      if (val === null || isNaN(val)) {
        newErrors[key] = "Required";
      } else if (val < 0 || val > 10) {
        newErrors[key] = "Score must be between 0 and 10";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitScore = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const scoreData = {
        submission: submissionId,
        scores: {
          innovation: Number(scores.innovation),
          impact: Number(scores.impact),
          technicality: Number(scores.technicality),
          presentation: Number(scores.presentation),
        },
        feedback,
      };

      if (existingScore) {
        // Update existing score - use POST since backend handles both create and update
        await axios.post(
          "/api/scores",
          scoreData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("✅ Score updated successfully!");
      } else {
        // Create new score
        await axios.post(
          "/api/scores",
          scoreData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("✅ Score submitted successfully!");
      }
      
      onSubmitted?.();
    } catch (err) {
      console.error("Error submitting score", err);
      alert("❌ Failed to submit score. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-sm mb-4">
        Score this submission based on the hackathon criteria. Each score must be between <b>0</b> and <b>10</b>.
      </p>
      <form
        onSubmit={e => {
          e.preventDefault();
          submitScore();
        }}
        className="space-y-4"
      >
        {CRITERIA.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <label htmlFor={key} className="block font-medium text-gray-700">
              {label} <span className="text-red-500">*</span>
            </label>
            <Input
              id={key}
              name={key}
              type="number"
              min={0}
              max={10}
              value={scores[key]}
              onChange={handleChange}
              placeholder={`Score for ${label} (0-10)`}
              className={errors[key] ? "border-red-500" : ""}
              required
            />
            {errors[key] && (
              <span className="text-xs text-red-500">{errors[key]}</span>
            )}
          </div>
        ))}
        <div>
          <label htmlFor="feedback" className="block font-medium text-gray-700">
            Optional Feedback
          </label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Share feedback or suggestions (optional)"
            rows={3}
          />
        </div>
        <Button type="submit" disabled={submitting} className="w-full mt-2">
          {submitting ? "Submitting..." : (existingScore ? "Update Score" : "Submit Score")}
        </Button>
      </form>
    </div>
  );
}
