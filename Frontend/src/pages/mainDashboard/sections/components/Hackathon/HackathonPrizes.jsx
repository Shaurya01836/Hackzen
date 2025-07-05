"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/CommonUI/card";
import { Gift, Trophy } from "lucide-react";

export default function HackathonPrizes({ hackathon, sectionRef }) {
  const perks = hackathon.perks || [];
  const prizeBreakdown = [
    { place: "First Place", amount: "$25,000", color: "yellow-500", bg: "from-yellow-50 to-orange-50", border: "border-yellow-200" },
    { place: "Second Place", amount: "$15,000", color: "gray-500", bg: "from-gray-50 to-slate-50", border: "border-gray-200" },
    { place: "Third Place", amount: "$10,000", color: "orange-500", bg: "from-orange-50 to-red-50", border: "border-orange-200" },
  ];

  return (
    <section ref={sectionRef} className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
        Prizes & Perks
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prize Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Prize Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {prizeBreakdown.map((prize, index) => (
              <div
                key={index}
                className={`p-4 bg-gradient-to-r ${prize.bg} rounded-lg border ${prize.border}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 bg-${prize.color} rounded-full flex items-center justify-center text-white font-bold`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{prize.place}</p>
                    <p className={`text-2xl font-bold text-${prize.color}`}>
                      {prize.amount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Perks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-500" />
              Perks & Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {perks.length === 0 ? (
                <p className="text-gray-500">Perks will be announced soon.</p>
              ) : (
                perks.map((perk, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Gift className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{perk}</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
