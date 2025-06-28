import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Input } from "../../../components/CommonUI/input";
import { Textarea } from "../../../components/CommonUI/textarea";
import { Button } from "../../../components/CommonUI/button";

export default function HackathonEditModal({ hackathon, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: hackathon.title || "",
    description: hackathon.description || "",
    category: hackathon.category || "",
    difficultyLevel: hackathon.difficultyLevel || "",
    location: hackathon.location || "",
    mode: hackathon.mode || "online",
    startDate: hackathon.startDate?.substring(0, 10) || "",
    endDate: hackathon.endDate?.substring(0, 10) || "",
    registrationDeadline: hackathon.registrationDeadline?.substring(0, 10) || "",
    submissionDeadline: hackathon.submissionDeadline?.substring(0, 10) || "",
    maxParticipants: hackathon.maxParticipants || "",
    prizeAmount: hackathon.prizePool?.amount || "",
    prizeBreakdown: hackathon.prizePool?.breakdown || "",
    tags: hackathon.tags?.join(", ") || "",
    problemStatements: hackathon.problemStatements?.join("\n") || "",
    requirements: hackathon.requirements?.join("\n") || "",
    perks: hackathon.perks?.join("\n") || "",
    judges: hackathon.judges || [],
    mentors: hackathon.mentors || [],
  });

  const [newJudge, setNewJudge] = useState("");
  const [newMentor, setNewMentor] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleAddJudge = () => {
  console.log("Adding Judge:", newJudge);
  if (newJudge && !form.judges.includes(newJudge)) {
    setForm((prev) => {
      const updatedJudges = [...prev.judges, newJudge];
      console.log("Updated Judges:", updatedJudges);
      return {
        ...prev,
        judges: updatedJudges,
      };
    });
    setNewJudge("");
  }
};

const handleRemoveJudge = (email) => {
  console.log("Removing Judge:", email);
  setForm((prev) => {
    const updatedJudges = prev.judges.filter((j) => j !== email);
    console.log("Judges after removal:", updatedJudges);
    return {
      ...prev,
      judges: updatedJudges,
    };
  });
};

const handleAddMentor = () => {
  console.log("Adding Mentor:", newMentor);
  if (newMentor && !form.mentors.includes(newMentor)) {
    setForm((prev) => {
      const updatedMentors = [...prev.mentors, newMentor];
      console.log("Updated Mentors:", updatedMentors);
      return {
        ...prev,
        mentors: updatedMentors,
      };
    });
    setNewMentor("");
  }
};

const handleRemoveMentor = (email) => {
  console.log("Removing Mentor:", email);
  setForm((prev) => {
    const updatedMentors = prev.mentors.filter((m) => m !== email);
    console.log("Mentors after removal:", updatedMentors);
    return {
      ...prev,
      mentors: updatedMentors,
    };
  });
};


  const handleSubmit = async () => {
    const updatedData = {
      title: form.title,
      description: form.description,
      category: form.category,
      difficultyLevel: form.difficultyLevel,
      location: form.location,
      mode: form.mode,
      startDate: form.startDate,
      endDate: form.endDate,
      registrationDeadline: form.registrationDeadline,
      submissionDeadline: form.submissionDeadline,
      maxParticipants: parseInt(form.maxParticipants),
      prizePool: {
        amount: parseInt(form.prizeAmount),
        breakdown: form.prizeBreakdown,
        currency: "USD",
      },
      tags: form.tags.split(",").map((tag) => tag.trim()),
      problemStatements: form.problemStatements.split("\n").filter(Boolean),
      requirements: form.requirements.split("\n").filter(Boolean),
      perks: form.perks.split("\n").filter(Boolean),
      judges: form.judges,
      mentors: form.mentors,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/hackathons/${hackathon._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        alert("Hackathon updated successfully!");
        onUpdated();
      } else {
        alert("Failed to update");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      <div className="relative bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-xl z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Hackathon</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Input name="title" value={form.title} onChange={handleChange} placeholder="Title" />
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />

          <div className="grid grid-cols-2 gap-4">
            <Input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
            <Input name="difficultyLevel" value={form.difficultyLevel} onChange={handleChange} placeholder="Difficulty" />
            <Input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
            <Input name="mode" value={form.mode} onChange={handleChange} placeholder="Mode (online/offline)" />
            <Input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            <Input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
            <Input type="date" name="registrationDeadline" value={form.registrationDeadline} onChange={handleChange} />
            <Input type="date" name="submissionDeadline" value={form.submissionDeadline} onChange={handleChange} />
            <Input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} placeholder="Max Participants" />
            <Input type="number" name="prizeAmount" value={form.prizeAmount} onChange={handleChange} placeholder="Prize Amount (USD)" />
          </div>

          <Textarea name="prizeBreakdown" value={form.prizeBreakdown} onChange={handleChange} placeholder="Prize Breakdown" />
          <Input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" />
          <Textarea name="problemStatements" value={form.problemStatements} onChange={handleChange} placeholder="Problem Statements (one per line)" />
          <Textarea name="requirements" value={form.requirements} onChange={handleChange} placeholder="Requirements (one per line)" />
          <Textarea name="perks" value={form.perks} onChange={handleChange} placeholder="Perks (one per line)" />

          {/* Judges Section */}
          <div>
            <label className="font-medium text-sm">Judges</label>
            <div className="flex gap-2 mb-2">
              <Input value={newJudge} onChange={(e) => setNewJudge(e.target.value)} placeholder="Judge Email" />
              <Button type="button" onClick={handleAddJudge}><Plus className="w-4 h-4" /></Button>
            </div>
            <ul className="space-y-1 text-sm">
              {form.judges.map((j, i) => (
                <li key={i} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  {j}
                  <button onClick={() => handleRemoveJudge(j)}><Trash2 className="w-4 h-4 text-red-500" /></button>
                </li>
              ))}
            </ul>
          </div>

          {/* Mentors Section */}
          <div>
            <label className="font-medium text-sm">Mentors</label>
            <div className="flex gap-2 mb-2">
              <Input value={newMentor} onChange={(e) => setNewMentor(e.target.value)} placeholder="Mentor Email" />
              <Button type="button" onClick={handleAddMentor}><Plus className="w-4 h-4" /></Button>
            </div>
            <ul className="space-y-1 text-sm">
              {form.mentors.map((m, i) => (
                <li key={i} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  {m}
                  <button onClick={() => handleRemoveMentor(m)}><Trash2 className="w-4 h-4 text-red-500" /></button>
                </li>
              ))}
            </ul>
          </div>

          <Button onClick={handleSubmit} className="w-full mt-4">
            Save Changes
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
