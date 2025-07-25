"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../../../components/CommonUI/card";
import { Target } from "lucide-react";

export default function HackathonProblems({ hackathon, sectionRef }) {
  const problems = hackathon.problemStatements || [];

  return (
    <section ref={sectionRef} className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">
        Problem Statements
      </h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Problem Statements
          </CardTitle>
          <CardDescription>
            Choose from these exciting challenges to work on during the hackathon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {problems.length === 0 ? (
            <p className="text-gray-500">No problem statements available yet.</p>
          ) : (
            problems.map((problem, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Problem {index + 1}</h3>
                <p className="text-gray-700">{typeof problem === 'object' && problem !== null ? problem.statement : problem}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
