"use client";
import { CalendarDays, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/CommonUI/card";

export default function HackathonTimeline({ hackathon, sectionRef }) {
  const timeline = hackathon.timeline || [];

  return (
    <section ref={sectionRef} className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">Timeline</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-500" />
            Important Dates & Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {timeline.length === 0 ? (
            <p className="text-gray-500">Timeline details will be announced soon.</p>
          ) : (
            <ul className="space-y-6">
              {timeline.map((item, index) => (
                <li key={index} className="border-l-4 border-indigo-500 pl-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {new Date(item.date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
