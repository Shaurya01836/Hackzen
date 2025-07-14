"use client";
import { CalendarDays, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/CommonUI/card";

export default function HackathonTimeline({ hackathon, sectionRef }) {
  const timeline = hackathon.timeline || [];

  return (
    <section ref={sectionRef} className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">Timeline</h2>
      

      {/* Rounds & Types Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-500" />
            Hackathon Rounds & Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.isArray(hackathon.rounds) && hackathon.rounds.length > 0 ? (
            <ul className="space-y-6">
              {hackathon.rounds.map((round, idx) => (
                <li key={idx} className="border-l-4 border-purple-500 pl-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div>
                      <h4 className="text-lg font-semibold">{round.name || `Round ${idx + 1}`}</h4>
                      <p className="text-gray-600 mb-1">{round.description}</p>
                      <span className="inline-block px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 font-medium">
                        {round.type ? round.type.charAt(0).toUpperCase() + round.type.slice(1).replace(/-/g, ' ') : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {round.startDate ? new Date(round.startDate).toLocaleString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : 'N/A'}
                      <span className="mx-1">-</span>
                      {round.endDate ? new Date(round.endDate).toLocaleString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : 'N/A'}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No rounds have been defined for this hackathon yet.</p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
