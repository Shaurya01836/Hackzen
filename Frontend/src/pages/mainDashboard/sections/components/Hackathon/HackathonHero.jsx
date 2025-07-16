"use client";
import { Badge } from "../../../../../components/CommonUI/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/CommonUI/card";
import { Progress } from "../../../../../components/DashboardUI/progress";
import { Calendar, Star, Trophy, Users, BadgeCheck, Hourglass, XCircle, Mail, Copy, Send, MessageCircle } from "lucide-react";
import { Button } from "../../../../../components/CommonUI/button";
import { useState, useEffect } from "react";
import { useAuth } from '../../../../../context/AuthContext';
import React from "react"; // Added for React.Fragment

// Helper to auto-link URLs in text (preserves line breaks)
function autoLink(text) {
  if (!text) return '';
  const urlRegex = /(https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+)/g;
  // Split by line, then by URL, and preserve line breaks
  return text.split('\n').map((line, idx) => (
    <React.Fragment key={idx}>
      {line.split(urlRegex).map((part, i) =>
        urlRegex.test(part)
          ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{part}</a>
          : part
      )}
      <br />
    </React.Fragment>
  ));
}
// Helper to extract first email from text
function extractEmail(text) {
  if (!text) return null;
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

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

  const { user } = useAuth();

  const [showSponsorModal, setShowSponsorModal] = useState(false);
  // NEW: State for sponsor status modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [myProposal, setMyProposal] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  // Add state for sponsor form fields
  const [sponsorForm, setSponsorForm] = useState({
    name: "",
    email: "",
    organization: "",
    website: "",
    telegram: "", // NEW
    discord: "",  // NEW
    title: "",
    description: "",
    deliverables: "",
    techStack: "",
    targetAudience: "",
    prizeAmount: "",
    prizeDescription: "",
    provideJudges: "no",
    judgeName: "",
    judgeEmail: "",
    judgeRole: "",
    customStartDate: "",
    customDeadline: "",
    notes: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  // Add state for editing proposal
  const [editingProposal, setEditingProposal] = useState(false);
  const [editForm, setEditForm] = useState({ telegram: '', discord: '' });

  // Helper: get sponsor email (from logged-in user)
  const sponsorEmail = user?.email || '';

  // Fetch sponsor proposal for this hackathon and email
  const fetchMyProposal = async (email) => {
    if (!email || !hackathon._id) return;
    setStatusLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/sponsor-proposals/${hackathon._id}`);
      const data = await res.json();
      // Find proposal by this email (from logged-in user)
      const found = Array.isArray(data) ? data.find(p => p.email === email) : null;
      setMyProposal(found || null);
    } catch {
      setMyProposal(null);
    } finally {
      setStatusLoading(false);
    }
  };

  // On mount, try to fetch proposal if user is logged in
  useEffect(() => {
    if (sponsorEmail) fetchMyProposal(sponsorEmail);
    // eslint-disable-next-line
  }, [hackathon._id, sponsorEmail]);

  // After submit, refetch proposal
  useEffect(() => {
    if (submitStatus === "success" && sponsorEmail) fetchMyProposal(sponsorEmail);
    // eslint-disable-next-line
  }, [submitStatus]);

  // Add logic to check if hackathon has started
  const now = new Date();
  const hackathonStart = hackathon.startDate ? new Date(hackathon.startDate) : null;
  console.log('Sponsor Button Debug:', { now: now.toISOString(), hackathonStart: hackathonStart ? hackathonStart.toISOString() : null, rawStart: hackathon.startDate });
  const canSponsor = hackathon.wantsSponsoredProblems && hackathonStart && now < hackathonStart;

  // Only show sponsor form if no proposal exists for this user/hackathon (regardless of status)
  const canShowSponsorForm = canSponsor && !myProposal;

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
        {/* If proposal exists, show status button; else show sponsor button */}
        {myProposal ? (
          <Card>
            <CardContent className="pt-6">
              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-3"
                size="lg"
                onClick={() => setShowStatusModal(true)}
                disabled={statusLoading}
              >
                {myProposal.status === 'pending' && 'Review Your Request'}
                {myProposal.status === 'approved' && 'Check Your Request'}
                {myProposal.status === 'rejected' && 'Check Your Request'}
              </Button>
              <div className="text-xs text-gray-600 mt-2 text-center">
                {myProposal.status === 'pending' && 'Your sponsorship proposal has been submitted and is currently awaiting review by the organizer.'}
                {myProposal.status === 'approved' && 'Your sponsorship proposal has been accepted! See details.'}
                {myProposal.status === 'rejected' && 'Your sponsorship proposal was rejected. See reason.'}
              </div>
            </CardContent>
          </Card>
        ) : canShowSponsorForm ? (
          <Card>
            <CardContent className="pt-6">
              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-3"
                size="lg"
                onClick={() => {
                  if (!myProposal) setShowSponsorModal(true);
                }}
                disabled={!!myProposal || statusLoading}
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
        {showSponsorModal && !myProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl p-0 max-w-2xl w-full relative overflow-hidden animate-slide-up">
              {/* Sticky header with close */}
              <div className="sticky top-0 z-10 bg-white border-b flex items-center justify-between px-8 py-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span role='img' aria-label='sponsor'>🤝</span> Sponsor a Problem Statement
                </h2>
                <button className="text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowSponsorModal(false)}>&times;</button>
              </div>
              <form onSubmit={async e => {
                e.preventDefault();
                setSubmitting(true);
                setSubmitStatus(null);
                try {
                  const payload = {
                    ...sponsorForm,
                    email: sponsorEmail,
                    hackathon: hackathon._id,
                    customStartDate: sponsorForm.customStartDate ? new Date(sponsorForm.customStartDate) : undefined,
                    customDeadline: sponsorForm.customDeadline ? new Date(sponsorForm.customDeadline) : undefined,
                  };
                  const res = await fetch("http://localhost:3000/api/sponsor-proposals", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  if (!res.ok) throw new Error("Failed to submit proposal");
                  setSubmitStatus("success");
                  setSponsorForm({
                    name: "",
                    email: "",
                    organization: "",
                    website: "",
                    telegram: "", // NEW
                    discord: "",  // NEW
                    title: "",
                    description: "",
                    deliverables: "",
                    techStack: "",
                    targetAudience: "",
                    prizeAmount: "",
                    prizeDescription: "",
                    provideJudges: "no",
                    judgeName: "",
                    judgeEmail: "",
                    judgeRole: "",
                    customStartDate: "",
                    customDeadline: "",
                    notes: "",
                  });
                  setShowSponsorModal(false);
                  setShowSuccessMsg(true);
                  // Refetch proposal to update UI
                  if (sponsorEmail) fetchMyProposal(sponsorEmail);
                  setTimeout(() => setShowSuccessMsg(false), 4000);
                } catch (err) {
                  setSubmitStatus("error");
                } finally {
                  setSubmitting(false);
                }
              }} className="space-y-8 px-8 py-6 overflow-y-auto max-h-[80vh]">
                {/* ✅ Basic Info */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                   Basic Info
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Your Name *</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="Your Name" required value={sponsorForm.name} onChange={e => setSponsorForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Your Email *</label>
                      <input type="email" className="w-full border rounded p-2 bg-gray-100" value={sponsorEmail} disabled readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Organization / Company Name *</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="Organization / Company Name" required value={sponsorForm.organization} onChange={e => setSponsorForm(f => ({ ...f, organization: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Website / LinkedIn</label>
                      <input type="url" className="w-full border rounded p-2" placeholder="Website / LinkedIn (optional)" value={sponsorForm.website} onChange={e => setSponsorForm(f => ({ ...f, website: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Telegram</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="Telegram ID or link (optional)" value={sponsorForm.telegram} onChange={e => setSponsorForm(f => ({ ...f, telegram: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Discord</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="Discord ID or link (optional)" value={sponsorForm.discord} onChange={e => setSponsorForm(f => ({ ...f, discord: e.target.value }))} />
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
                      <input type="text" className="w-full border rounded p-2" placeholder="Proposal Title / Problem Statement Title" required value={sponsorForm.title} onChange={e => setSponsorForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Preferred Tech Stack or Domain *</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="e.g., Web3, AI/ML, IoT" required value={sponsorForm.techStack} onChange={e => setSponsorForm(f => ({ ...f, techStack: e.target.value }))} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Full Description / Problem Context *</label>
                    <textarea className="w-full border rounded p-2" placeholder="Explain the challenge, background, and what you're looking for." rows={3} required value={sponsorForm.description} onChange={e => setSponsorForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Expected Deliverables *</label>
                    <textarea className="w-full border rounded p-2" placeholder="e.g., Demo, GitHub repo, PPT, Research Paper" rows={2} required value={sponsorForm.deliverables} onChange={e => setSponsorForm(f => ({ ...f, deliverables: e.target.value }))} />
                  </div>
                </div>
                {/* 🎯 Target Audience */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                  Target Audience
                  </div>
                  <select className="w-full border rounded p-2" required value={sponsorForm.targetAudience} onChange={e => setSponsorForm(f => ({ ...f, targetAudience: e.target.value }))} >
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
                      <input type="text" className="w-full border rounded p-2" placeholder="Prize Amount (e.g., ₹5000 / $100)" required value={sponsorForm.prizeAmount} onChange={e => setSponsorForm(f => ({ ...f, prizeAmount: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Prize Description *</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="Prize Description (Merch, internships, cash, etc.)" required value={sponsorForm.prizeDescription} onChange={e => setSponsorForm(f => ({ ...f, prizeDescription: e.target.value }))} />
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
                      <input type="radio" name="provideJudges" value="yes" required checked={sponsorForm.provideJudges === "yes"} onChange={() => setSponsorForm(f => ({ ...f, provideJudges: "yes" }))} /> Yes
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="provideJudges" value="no" required checked={sponsorForm.provideJudges === "no"} onChange={() => setSponsorForm(f => ({ ...f, provideJudges: "no" }))} /> No
                    </label>
                  </div>
                  {/* If Yes, show judge fields (for now, always show one set) */}
                  {sponsorForm.provideJudges === "yes" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-2 mt-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Judge Name</label>
                        <input type="text" className="w-full border rounded p-2" placeholder="Judge Name (if providing)" value={sponsorForm.judgeName} onChange={e => setSponsorForm(f => ({ ...f, judgeName: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Judge Email</label>
                        <input type="email" className="w-full border rounded p-2" placeholder="Judge Email (if providing)" value={sponsorForm.judgeEmail} onChange={e => setSponsorForm(f => ({ ...f, judgeEmail: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Judge Role</label>
                        <input type="text" className="w-full border rounded p-2" placeholder="Judge Role (if providing)" value={sponsorForm.judgeRole} onChange={e => setSponsorForm(f => ({ ...f, judgeRole: e.target.value }))} />
                      </div>
                    </div>
                  )}
                </div>
                {/* 📅 Preferred Timeline (Optional) */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
                 Preferred Timeline (Optional)
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date</label>
                      <input type="date" className="border rounded p-2 w-full" placeholder="Start Date" value={sponsorForm.customStartDate} onChange={e => setSponsorForm(f => ({ ...f, customStartDate: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Deadline</label>
                      <input type="date" className="border rounded p-2 w-full" placeholder="Deadline" value={sponsorForm.customDeadline} onChange={e => setSponsorForm(f => ({ ...f, customDeadline: e.target.value }))} />
                    </div>
                  </div>
                </div>
                {/* 💬 Any Additional Notes / Requirements? */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-lg font-semibold">
               Any Additional Notes / Requirements?
                  </div>
                  <textarea className="w-full border rounded p-2" placeholder="Add any extra information here..." rows={2} value={sponsorForm.notes} onChange={e => setSponsorForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold mt-2" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Sponsorship Proposal"}
                </Button>
                {submitStatus === "success" && <div className="text-green-600 font-semibold text-center">Proposal submitted successfully!</div>}
                {submitStatus === "error" && <div className="text-red-600 font-semibold text-center">Failed to submit proposal. Please try again.</div>}
              </form>
            </div>
          </div>
        )}
      </div>
      {/* Sponsor Status Modal */}
      {showStatusModal && myProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-0 max-w-md w-full relative overflow-hidden animate-slide-up">
            <div className="sticky top-0 z-10 bg-white border-b flex items-center justify-between px-8 py-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span role='img' aria-label='sponsor'>🤝</span> Sponsorship Request Status
              </h2>
              <button className="text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowStatusModal(false)}>&times;</button>
            </div>
            <div className="px-8 py-6">
              <div className="mb-4 flex items-center gap-2">
                {myProposal.status === 'pending' && <Hourglass className="text-yellow-500 w-6 h-6" />}
                {myProposal.status === 'approved' && <BadgeCheck className="text-green-600 w-6 h-6" />}
                {myProposal.status === 'rejected' && <XCircle className="text-red-500 w-6 h-6" />}
                <span className={`font-semibold text-lg ${myProposal.status === 'pending' ? 'text-yellow-700' : myProposal.status === 'approved' ? 'text-green-700' : 'text-red-700'}`}>{myProposal.status.charAt(0).toUpperCase() + myProposal.status.slice(1)}</span>
              </div>
              {/* Show organizer message if present */}
              {/* Edit button for user to update Telegram/Discord if pending or rejected */}
              {(myProposal.status === 'pending' || myProposal.status === 'rejected') && !editingProposal && (
                <Button className="mb-4" onClick={() => {
                  setEditForm({ telegram: myProposal.telegram || '', discord: myProposal.discord || '' });
                  setEditingProposal(true);
                }}>Edit Contact Details</Button>
              )}
              {/* Edit form for Telegram/Discord */}
              {editingProposal && (
                <form className="mb-4" onSubmit={async e => {
                  e.preventDefault();
                  // Call backend to update proposal
                  await fetch(`http://localhost:3000/api/sponsor-proposals/${myProposal._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ telegram: editForm.telegram, discord: editForm.discord })
                  });
                  setEditingProposal(false);
                  fetchMyProposal(sponsorEmail);
                }}>
                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">Telegram</label>
                    <div className="flex items-center gap-2">
                      <input type="text" className="w-full border rounded p-2" placeholder="Telegram ID or link" value={editForm.telegram} onChange={e => setEditForm(f => ({ ...f, telegram: e.target.value }))} />
                      <Button type="button" size="icon" onClick={() => {
                        if (editForm.telegram) {
                          window.open(editForm.telegram.startsWith('http') ? editForm.telegram : `https://t.me/${editForm.telegram.replace('@','')}`, '_blank');
                        } else {
                          alert('Please enter your Telegram username or link.');
                        }
                      }}><Send className="w-5 h-5" /></Button>
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">Discord</label>
                    <input type="text" className="w-full border rounded p-2" placeholder="Discord ID or link" value={editForm.discord} onChange={e => setEditForm(f => ({ ...f, discord: e.target.value }))} />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button type="submit">Save</Button>
                    <Button type="button" variant="outline" onClick={() => setEditingProposal(false)}>Cancel</Button>
                  </div>
                </form>
              )}
              {/* Show Telegram icon for direct messaging if both have Telegram */}
              {myProposal.telegram && hackathon.organizerTelegram && (
                <div className="flex items-center gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => window.open(hackathon.organizerTelegram.startsWith('http') ? hackathon.organizerTelegram : `https://t.me/${hackathon.organizerTelegram.replace('@','')}`, '_blank')}>
                    <Send className="w-5 h-5 mr-2" /> Message Organizer on Telegram
                  </Button>
                </div>
              )}
              <div className="border rounded p-4 bg-gray-50 text-gray-800 mb-2 relative whitespace-pre-line" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <div className="whitespace-pre-line text-base leading-relaxed">
                  {autoLink(myProposal.reviewMessage)}
                </div>
                {/* Copy Email button if email present */}
                {extractEmail(myProposal.reviewMessage) && (
                  <button
                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(extractEmail(myProposal.reviewMessage));
                    }}
                    title="Copy Email"
                  >
                    <Mail className="w-4 h-4" />
                    <Copy className="w-4 h-4" />
                    Copy Email
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-4">If you have questions, contact the hackathon organizer.</div>
            </div>
          </div>
        </div>
      )}
      {/* Success message after submission */}
      {showSuccessMsg && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded shadow-lg font-semibold text-lg">
            Your proposal for a Problem Statement was submitted successfully!
          </div>
        </div>
      )}
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
