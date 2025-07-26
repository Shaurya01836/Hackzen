"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/CommonUI/card";
import { Target } from "lucide-react";

export default function HackathonProblems({ hackathon, sectionRef }) {
  const problems = hackathon.problemStatements || [];

  return (
    <section ref={sectionRef} className="space-y-6 max-w-5xl mx-auto">
      {/* Main Container Card */}
      <Card className="shadow-none hover:shadow-none">
        {/* Section Header */}
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-1 h-8 bg-indigo-500 rounded-full"></div>
            Problem Statements
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Problem Statements Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 my-4">
              <h3 className="text-xl font-semibold text-gray-900">Available Challenges</h3>
            </div>
            <div className="">
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Choose from these exciting challenges to work on during the hackathon.
              </p>
              
              {problems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Target className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No problem statements available yet.</p>
                  <p className="text-gray-400 text-sm mt-2">Check back later for exciting challenges!</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {problems.map((problem, index) => (
                    <div key={index}>
                      <div className="flex items-start gap-4 py-6">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-900 mb-2">
                            Problem Statement {index + 1}
                          </h4>
                          <p className="text-gray-700 leading-relaxed">
                            {typeof problem === 'object' && problem !== null ? problem.statement : problem}
                          </p>
                        </div>
                      </div>
                      {/* Horizontal line after each problem statement, except the last one */}
                      {index < problems.length - 1 && (
                        <hr className="border-gray-200" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
