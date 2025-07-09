import { useState } from "react";
import axios from "axios";
import { Button } from "../../../../../components/CommonUI/button";
import { Input } from "../../../../../components/CommonUI/input";
import { Textarea } from "../../../../../components/CommonUI/textarea";

export default function JudgeScoreForm({ projectId, hackathonId, onSubmitted }) {
  const [scores, setScores] = useState({
    innovation: 0,
    impact: 0,
    technicality: 0,
    presentation: 0,
  });
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    setScores({ ...scores, [e.target.name]: parseInt(e.target.value) });
  };

  const submitScore = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:3000/api/scores",
        {
          project: projectId,
          hackathon: hackathonId,
          scores,
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
    }
  };

  return (
    <div className="border p-4 rounded-lg space-y-2">
      {["innovation", "impact", "technicality", "presentation"].map((field) => (
        <Input
          key={field}
          type="number"
          name={field}
          min={0}
          max={10}
          value={scores[field]}
          onChange={handleChange}
          placeholder={`Score for ${field}`}
        />
      ))}
      <Textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Optional feedback"
      />
      <Button onClick={submitScore}>Submit Score</Button>
    </div>
  );
}
