"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, CardContent, CardHeader, CardTitle
} from "../../../components/CommonUI/card";
import { Button } from "../../../components/CommonUI/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../../../components/CommonUI/select";
import { Textarea } from "../../../components/CommonUI/textarea";
import { Label } from "../../../components/CommonUI/label";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "../../../components/CommonUI/tabs";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import axios from "axios";

export default function ProjectSubmissionForm({ hackathon, onBack, userProjects = [] }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("project-selection");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [organizerQuestions, setOrganizerQuestions] = useState([]);
  const [termsAndConditions, setTermsAndConditions] = useState([]);
  const [organizerAnswers, setOrganizerAnswers] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    const fetchCustomForm = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/hackathons/${hackathon.id}`);
        const form = res.data.customForm || {};
        setOrganizerQuestions(form.questions || []);
        setTermsAndConditions(form.terms?.map(t => t.text) || []);
      } catch (err) {
        console.error("Error fetching form questions:", err);
      }
    };
    fetchCustomForm();
  }, [hackathon]);

  const handleOrganizerAnswer = (questionId, answer) => {
    setOrganizerAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const answersArray = Object.entries(organizerAnswers).map(([id, answer]) => ({
      questionId: id,
      answer
    }));

    const payload = {
      hackathonId: hackathon.id,
      projectId: selectedProjectId,
      customAnswers: answersArray
    };

    try {
      await axios.post("http://localhost:3000/api/submission-form/submit", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("🎉 Project submitted successfully!");
      navigate("/dashboard/my-hackathons");
    } catch (err) {
      console.error("Error submitting project:", err);
      alert("Failed to submit project.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <Button variant="outline" onClick={() => (onBack ? onBack() : navigate(-1))}>
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-slate-800 mb-2">
              Submit Project
            </CardTitle>
            <p className="text-lg text-slate-600 font-medium">
              {hackathon?.name || "Hackathon"}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="project-selection">Select Project</TabsTrigger>
                  <TabsTrigger value="terms-submit">Q&A & Submit</TabsTrigger>
                </TabsList>

                {/* Step 1: Select Project */}
                <TabsContent value="project-selection" className="space-y-8">
                  <div className="space-y-3">
                    <Label>Select Project<span className="text-red-500">*</span></Label>
                    <Select value={selectedProjectId} onValueChange={setSelectedProjectId} required>
                      <SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger>
                      <SelectContent>
                        {userProjects.map((project) => (
                          <SelectItem key={project._id} value={project._id}>{project.title}</SelectItem>
                        ))}
                        <SelectItem value="create-new">+ Create New Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setActiveTab("terms-submit")}>
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Step 2: Questions & Terms */}
                <TabsContent value="terms-submit" className="space-y-6">
                  {organizerQuestions.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold">Organizer Questions</h3>
                      {organizerQuestions.map(q => (
                        <div key={q.id}>
                          <Label>{q.text}{q.required && <span className="text-red-500 ml-1">*</span>}</Label>
                          <Textarea
                            value={organizerAnswers[q.id] || ""}
                            onChange={e => handleOrganizerAnswer(q.id, e.target.value)}
                            required={q.required}
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {termsAndConditions.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold">Terms & Conditions</h3>
                      <ul className="list-disc pl-6">
                        {termsAndConditions.map((term, i) => (
                          <li key={i} className="text-sm text-slate-700">{term}</li>
                        ))}
                      </ul>

                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={e => setAgreedToTerms(e.target.checked)}
                          required
                        />
                        <span>I agree to the terms above</span>
                      </label>
                    </>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button type="button" onClick={() => setActiveTab("project-selection")}>
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" disabled={!agreedToTerms} className="bg-yellow-500 hover:bg-yellow-600">
                      Submit →
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
