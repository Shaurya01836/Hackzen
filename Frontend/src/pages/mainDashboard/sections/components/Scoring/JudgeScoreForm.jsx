import { useState } from "react";
import axios from "axios";
import { Button } from "../../../../../components/CommonUI/button";
import { Input } from "../../../../../components/CommonUI/input";
import { Textarea } from "../../../../../components/CommonUI/textarea";

const CRITERIA = [
  { key: "innovation", label: "Innovation" },
  { key: "impact", label: "Impact" },
  { key: "technicality", label: "Technicality" },
  { key: "presentation", label: "Presentation" },
];

export default function JudgeScoreForm({ projectId, hackathonId, onSubmitted }) {
  const [scores, setScores] = useState({
    innovation: "",
    impact: "",
    technicality: "",
    presentation: "",
  });
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and empty string
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
      await axios.post(
        "http://localhost:3000/api/scores",
        {
          project: projectId,
          hackathon: hackathonId,
          scores: {
            innovation: Number(scores.innovation),
            impact: Number(scores.impact),
            technicality: Number(scores.technicality),
            presentation: Number(scores.presentation),
          },
          feedback,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Score submitted successfully!");
      onSubmitted?.();
    } catch (err) {
      console.error("Error submitting score", err);
      alert("❌ Failed to submit score. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg space-y-4 bg-white/80">
      <h2 className="font-bold text-lg flex items-center gap-2 mb-2">
        <span role="img" aria-label="trophy">🏅</span> Judge Evaluation
      </h2>
      <p className="text-gray-600 text-sm mb-4">
        Score this project based on the hackathon criteria. Each score must be between <b>0</b> and <b>10</b>.
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
          {submitting ? "Submitting..." : "Submit Score"}
        </Button>
      </form>
    </div>
  );
}
