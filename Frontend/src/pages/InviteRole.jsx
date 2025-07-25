import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../components/CommonUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/CommonUI/card";
import { CheckCircle, XCircle, Gavel, AlertCircle, Award } from "lucide-react";

export default function InviteRole() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:3000/api/role-invites/${token}`)
        .then(res => res.json())
        .then(data => setInvite(data))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const respond = async (action) => {
    const endpoint = action === "accept"
      ? `/api/role-invites/${token}/accept`
      : `/api/role-invites/${token}/decline`;
    const res = await fetch(`http://localhost:3000${endpoint}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (res.ok) {
      alert(`Invite ${action}ed!`);
      navigate("/dashboard/judge");
    } else {
      alert("Failed to respond to invite.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Card className="w-full max-w-4xl border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-indigo-100 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                <Gavel className="w-4 h-4 text-indigo-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Loading Invitation</h2>
            <p className="text-gray-600">Please wait while we verify your judge invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invite || invite.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50">
        <Card className="w-full max-w-4xl border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Invitation Not Found</h2>
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-100 mb-6">
              <p className="text-red-800 leading-relaxed">
                The invitation link is invalid or has expired. Please contact the hackathon organizer for a new invitation.
              </p>
            </div>
            <Button 
              onClick={() => navigate("/dashboard")}
              className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-8"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-6xl border-0 shadow-xl">
        {/* Header Section */}
        <CardHeader className="text-center pb-6">
         
          <CardTitle className="text-4xl font-bold text-gray-900 mb-2">Judge Invitation</CardTitle>
          <p className="text-gray-600 text-lg">You've been invited to be a judge for this hackathon</p>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Left Column - Invitation Details */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-indigo-900">Invitation Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-indigo-100">
                    <span className="text-indigo-700 font-medium text-sm uppercase tracking-wide">Hackathon</span>
                    <p className="text-indigo-900 font-bold text-lg mt-1">{invite.hackathon?.title}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-indigo-100">
                    <span className="text-indigo-700 font-medium text-sm uppercase tracking-wide">Role</span>
                    <p className="text-indigo-900 font-bold text-lg mt-1 capitalize">{invite.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Role Description */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 h-full">
                <h4 className="text-xl font-semibold text-blue-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  What does this mean?
                </h4>
                <ul className="text-blue-800 space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Evaluate Submissions</p>
                      <p className="text-sm text-blue-700">Review and score project submissions</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Provide Feedback</p>
                      <p className="text-sm text-blue-700">Give valuable feedback to participants</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Select Winners</p>
                      <p className="text-sm text-blue-700">Help determine the hackathon winners</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Actions */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-100 h-full flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Ready to Judge?</h4>
                  <p className="text-gray-600 mb-6">
                    Accept this invitation to start your journey as a hackathon judge and help shape the future of innovation.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    onClick={() => respond("accept")}
                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-lg"
                  >
                    <CheckCircle className="w-6 h-6 mr-3" />
                    Accept Invitation
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => respond("decline")}
                    className="w-full h-14 border-red-200 text-red-700 hover:bg-red-50 font-medium rounded-lg text-lg"
                  >
                    <XCircle className="w-6 h-6 mr-3" />
                    Decline Invitation
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-100">
            <p className="text-gray-500">
              By accepting, you agree to judge fairly and provide constructive feedback to all participants.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
