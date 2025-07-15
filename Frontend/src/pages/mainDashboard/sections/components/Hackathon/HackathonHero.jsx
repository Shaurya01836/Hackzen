"use client";
import { Badge } from "../../../../../components/CommonUI/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/CommonUI/card";
import { Progress } from "../../../../../components/DashboardUI/progress";
import { Calendar, Star, Trophy, Users } from "lucide-react";
import { Button } from "../../../../../components/CommonUI/button";
import { useState } from "react";

export default function HackathonHero({ hackathon, isRegistered, isSaved }) {
  const {
    prize,
    participants,
    maxParticipants,
    rating,
    reviews,
    registrationDeadline,
    startDate,
    endDate,
    featured,
    sponsored,
    images,
  } = hackathon;

  // Defensive: ensure participants and maxParticipants are numbers and maxParticipants > 0
  const safeParticipants = typeof participants === 'number' && !isNaN(participants) ? participants : 0;
  const safeMaxParticipants = typeof maxParticipants === 'number' && maxParticipants > 0 ? maxParticipants : 1;
  const progress = Math.min(100, Math.round((safeParticipants / safeMaxParticipants) * 100));

  const getRegistrationStatus = () => {
    const now = new Date();
    const deadline = new Date(registrationDeadline);
    if (now > deadline) return "Registration Closed";
    if (safeParticipants >= safeMaxParticipants && !isRegistered)
      return "Registration Full";
    if (isRegistered) return "Registered";
    return "Registration Open";
  };

  const registrationBadge = () => {
    const status = getRegistrationStatus();
    switch (status) {
      case "Registration Closed":
      case "Registration Full":
        return <Badge className="bg-red-500 text-white">{status}</Badge>;
      case "Registered":
        return <Badge className="bg-green-500 text-white">Registered</Badge>;
      default:
        return (
          <Badge className="bg-green-500 text-white">Registration Open</Badge>
        );
    }
  };

  const [showSponsorModal, setShowSponsorModal] = useState(false);

  // Add logic to check if hackathon has started
  const now = new Date();
  const hackathonStart = hackathon.startDate ? new Date(hackathon.startDate) : null;
  console.log('Sponsor Button Debug:', { now: now.toISOString(), hackathonStart: hackathonStart ? hackathonStart.toISOString() : null, rawStart: hackathon.startDate });
  const canSponsor = hackathon.wantsSponsoredProblems && hackathonStart && now < hackathonStart;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Hero Banner */}
      <div className="lg:col-span-2">
        <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden border mb-8">
          <img
            src={images?.banner?.url || "/placeholder.svg?height=400&width=800"}
            alt={hackathon.name}
            className="object-cover w-full h-56 md:h-[550px]"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {featured && <Badge className="bg-purple-500">Featured</Badge>}
            {sponsored && (
              <Badge
                variant="outline"
                className="border-yellow-500 text-yellow-600 bg-white"
              >
                Sponsored
              </Badge>
            )}
          </div>
          <div className="absolute bottom-4 right-4">{registrationBadge()}</div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="space-y-4">
        {/* Prize */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Prize Pool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{prize}</p>
            <p className="text-sm text-gray-500">Total rewards</p>
          </CardContent>
        </Card>

        {/* Participation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Participation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Registered</span>
              <span>
                {safeParticipants}/{safeMaxParticipants}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating}</span>
              </div>
              <span className="text-gray-500">({reviews} reviews)</span>
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Important Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Registration Deadline:</span>
              <span className="font-medium">{registrationDeadline}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Event Start:</span>
              <span className="font-medium">{startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Event End:</span>
              <span className="font-medium">{endDate}</span>
            </div>
          </CardContent>
        </Card>

        {/* CTA for submission or sponsor */}
        {canSponsor ? (
          <Card>
            <CardContent className="pt-6">
              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-3"
                size="lg"
                onClick={() => setShowSponsorModal(true)}
              >
                Sponsor a Problem Statement
              </Button>
            </CardContent>
          </Card>
        ) : null}
        {/* Show warning if start date is missing or invalid */}
        {hackathon.wantsSponsoredProblems && !hackathonStart && (
          <div className="text-xs text-red-600 font-semibold mt-2">Warning: Hackathon start date is missing or invalid. Sponsor button logic may not work as expected.</div>
        )}
        {/* Sponsor Modal Placeholder */}
        {showSponsorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl p-0 max-w-2xl w-full relative overflow-hidden animate-slide-up">
              {/* Sticky header with close */}
              <div className="sticky top-0 z-10 bg-white border-b flex items-center justify-between px-8 py-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span role='img' aria-label='sponsor'>🤝</span> Sponsor a Problem Statement
                </h2>
                <button className="text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowSponsorModal(false)}>&times;</button>
              </div>
              <form onSubmit={e => { e.preventDefault(); /* handle sponsor submit here */ }} className="space-y-8 px-8 py-6 overflow-y-auto max-h-[80vh]">
                {/* ✅ Basic Info */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                   Basic Info
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Your Name *</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="Your Name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Your Email *</label>
                      <input type="email" className="w-full border rounded p-2" placeholder="Your Email" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Organization / Company Name *</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="Organization / Company Name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Website / LinkedIn</label>
                      <input type="url" className="w-full border rounded p-2" placeholder="Website / LinkedIn (optional)" />
                    </div>
                  </div>
                </div>
                {/* 📄 Proposal Details */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                     Proposal Details
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Proposal Title *</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="Proposal Title / Problem Statement Title" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Preferred Tech Stack or Domain *</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="e.g., Web3, AI/ML, IoT" required />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Full Description / Problem Context *</label>
                    <textarea className="w-full border rounded p-2" placeholder="Explain the challenge, background, and what you're looking for." rows={3} required />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Expected Deliverables *</label>
                    <textarea className="w-full border rounded p-2" placeholder="e.g., Demo, GitHub repo, PPT, Research Paper" rows={2} required />
                  </div>
                </div>
                {/* 🎯 Target Audience */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                  Target Audience
                  </div>
                  <select className="w-full border rounded p-2" required>
                    <option value="">Who should attempt this problem?</option>
                    <option value="anyone">Anyone</option>
                    <option value="final-year">Final-year students</option>
                    <option value="ai-experience">Teams with AI experience</option>
                    <option value="other">Other (specify in notes)</option>
                  </select>
                </div>
                {/* 🏆 Proposed Prize / Incentive */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                   Proposed Prize / Incentive
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Prize Amount *</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="Prize Amount (e.g., ₹5000 / $100)" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Prize Description *</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="Prize Description (Merch, internships, cash, etc.)" required />
                    </div>
                  </div>
                </div>
                {/* 👩‍⚖️ Judging Preferences */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                   Judging Preferences
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <label className="flex items-center gap-1">
                      <input type="radio" name="provideJudges" value="yes" required /> Yes
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="provideJudges" value="no" required /> No
                    </label>
                  </div>
                  {/* If Yes, show judge fields (for now, always show one set) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-2 mt-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Judge Name</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="Judge Name (if providing)" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Judge Email</label>
                      <input type="email" className="w-full border rounded p-2" placeholder="Judge Email (if providing)" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Judge Role</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="Judge Role (if providing)" />
                    </div>
                  </div>
                </div>
                {/* 📅 Preferred Timeline (Optional) */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                 Preferred Timeline (Optional)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input type="date" className="border rounded p-2 w-full" placeholder="Start Date" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Deadline</label>
                      <input type="date" className="border rounded p-2 w-full" placeholder="Deadline" />
                    </div>
                  </div>
                </div>
                {/* 💬 Any Additional Notes / Requirements? */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
               Any Additional Notes / Requirements?
                  </div>
                  <textarea className="w-full border rounded p-2" placeholder="Add any extra information here..." rows={2} />
                </div>
                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mt-2">Submit Sponsorship Proposal</Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Add animation classes */
<style jsx>{`
  .animate-fade-in { animation: fadeIn 0.2s ease; }
  .animate-slide-up { animation: slideUp 0.3s cubic-bezier(.4,2,.6,1); }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`}</style>
