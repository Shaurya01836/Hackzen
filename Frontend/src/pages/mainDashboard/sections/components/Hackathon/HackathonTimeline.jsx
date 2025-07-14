"use client";
import { useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/CommonUI/card";
// import { format } from "date-fns"; // Uncomment if date-fns is available
import { uploadPPTFile } from '../../../../../lib/api';
import { useToast } from '../../../../../hooks/use-toast';

export default function HackathonTimeline({ hackathon, sectionRef }) {
  const rounds = Array.isArray(hackathon.rounds) ? hackathon.rounds : [];
  const now = new Date();
  const { toast } = useToast ? useToast() : { toast: () => {} };
  const [uploadingIdx, setUploadingIdx] = useState(null);

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
      toast({ title: 'PPT Uploaded!', description: 'Your PPT has been uploaded successfully.', variant: 'success' });
      // Optionally: Save result.url to backend for this user/round
    } catch (err) {
      toast({ title: 'Upload failed', description: err.message || 'Could not upload PPT', variant: 'destructive' });
    } finally {
      setUploadingIdx(null);
    }
  };

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
            // const startStr = start ? format(start, "dd MMM yy, hh:mm a") : "N/A";
            // const endStr = end ? format(end, "dd MMM yy, hh:mm a") : "N/A";
            const startStr = start ? start.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true, timeZoneName: "short" }) : "N/A";
            const endStr = end ? end.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true, timeZoneName: "short" }) : "N/A";
            // For timeline dot
            const dayNum = start ? start.getDate() : idx + 1;
            const monthStr = start ? start.toLocaleString("en-US", { month: "short" }) : "";
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
                            <>
                              <label className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer">
                                {uploadingIdx === idx ? 'Uploading...' : 'Submit PPT'}
                                <input
                                  type="file"
                                  accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                  style={{ display: 'none' }}
                                  disabled={uploadingIdx === idx}
                                  onChange={e => handlePPTUpload(e, idx)}
                                />
                              </label>
                            </>
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
        </div>
      )}
    </section>
  );
}
