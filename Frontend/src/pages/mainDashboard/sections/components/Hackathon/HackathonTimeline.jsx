"use client";
import { useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/CommonUI/card";
// import { format } from "date-fns"; // Uncomment if date-fns is available
import { uploadPPTFile, savePPTSubmission, fetchUserPPTSubmissions } from '../../../../../lib/api';
import { useToast } from '../../../../../hooks/use-toast';
import { useAuth } from '../../../../../context/AuthContext';
import { useEffect } from 'react';
import PPTSubmissionModal from './PPTSubmissionModal';

export default function HackathonTimeline({ hackathon, sectionRef }) {
  const rounds = Array.isArray(hackathon.rounds) ? hackathon.rounds : [];
  const now = new Date();
  const { toast } = useToast ? useToast() : { toast: () => {} };
  const { user } = useAuth ? useAuth() : { user: null };
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [pptSubmissions, setPptSubmissions] = useState([]);
  const [pptModal, setPptModal] = useState({ open: false, roundIdx: null });

  // Fetch user's PPT submissions for this hackathon
  useEffect(() => {
    if (!hackathon._id || !user?._id) return;
    fetchUserPPTSubmissions(hackathon._id, user._id)
      .then(setPptSubmissions)
      .catch(() => setPptSubmissions([]));
  }, [hackathon._id, user?._id]);

  const handlePPTUpload = async (e, roundIdx) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation' && !file.name.endsWith('.pptx')) {
      toast({ title: 'Invalid file', description: 'Please upload a .pptx file', variant: 'destructive' });
      return;
    }
    setUploadingIdx(roundIdx);
    try {
      const result = await uploadPPTFile(file);
      // Save submission to backend
      await savePPTSubmission({ hackathonId: hackathon._id, roundIndex: roundIdx, pptFile: result.url });
      toast({ title: 'PPT Uploaded!', description: 'Your PPT has been uploaded successfully.', variant: 'success' });
      // Refresh submissions
      const updated = await fetchUserPPTSubmissions(hackathon._id, user._id);
      setPptSubmissions(updated);
    } catch (err) {
      toast({ title: 'Upload failed', description: err.message || 'Could not upload PPT', variant: 'destructive' });
    } finally {
      setUploadingIdx(null);
    }
  };

  // Helper: check if user has submitted for this round
  const getSubmissionForRound = (roundIdx) => pptSubmissions.find(s => s.roundIndex === roundIdx);

  return (
    <section ref={sectionRef} className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">Stages and Timelines</h2>
      {rounds.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No rounds have been defined for this hackathon yet.</CardTitle>
          </CardHeader>
        </Card>
      ) : (
        <div className="flex flex-col gap-8">
          {rounds.map((round, idx) => {
            const start = round.startDate ? new Date(round.startDate) : null;
            const end = round.endDate ? new Date(round.endDate) : null;
            const isLive = start && end && now >= start && now <= end;
            const isSubmission = round.type && round.type.toLowerCase().includes("ppt");
            const startStr = start ? start.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true, timeZoneName: "short" }) : "N/A";
            const endStr = end ? end.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true, timeZoneName: "short" }) : "N/A";
            const dayNum = start ? start.getDate() : idx + 1;
            const monthStr = start ? start.toLocaleString("en-US", { month: "short" }) : "";
            const submission = getSubmissionForRound(idx);
            return (
              <div key={idx} className="flex items-start gap-4 relative group">
                {/* Timeline vertical line */}
                <div className="flex flex-col items-center mr-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex flex-col items-center justify-center font-bold text-lg text-blue-700 border border-blue-300">
                    <span>{dayNum}</span>
                    <span className="text-xs text-blue-500 font-normal">{monthStr}</span>
                  </div>
                  {idx < rounds.length - 1 && (
                    <div className="w-1 h-16 bg-blue-200 mx-auto"></div>
                  )}
                </div>
                {/* Card for round */}
                <div className="flex-1">
                  <Card className="shadow-md">
                    <CardContent className="py-4 px-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{round.name || `Round ${idx + 1}`}</h3>
                          <p className="text-gray-700 mb-2">{round.description}</p>
                          <div className="flex flex-col gap-1 text-sm text-gray-600">
                            <span>Start: <span className="font-medium">{startStr}</span></span>
                            <span>End: <span className="font-medium">{endStr}</span></span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end mt-4 md:mt-0">
                          {isSubmission && isLive && (
                            submission ? (
                              <a
                                href={submission.pptFile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-center"
                              >
                                PPT Submitted
                              </a>
                            ) : (
                              <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                onClick={() => setPptModal({ open: true, roundIdx: idx })}
                                disabled={uploadingIdx === idx}
                              >
                                Submit PPT
                              </button>
                            )
                          )}
                          {round.resultsAvailable && (
                            <button className="px-4 py-2 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition">Results</button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
          {/* PPT Submission Modal */}
          <PPTSubmissionModal
            open={pptModal.open}
            onOpenChange={open => setPptModal({ open, roundIdx: open ? pptModal.roundIdx : null })}
            hackathonId={hackathon._id}
            roundIndex={pptModal.roundIdx}
            onSuccess={async () => {
              if (hackathon._id && user?._id) {
                const updated = await fetchUserPPTSubmissions(hackathon._id, user._id);
                setPptSubmissions(updated);
              }
            }}
          />
        </div>
      )}
    </section>
  );
}
