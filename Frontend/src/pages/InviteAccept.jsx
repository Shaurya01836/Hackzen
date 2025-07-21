import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, UserPlus, ArrowRight, XCircle } from "lucide-react";
import { Button } from "../components/CommonUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/CommonUI/card";
import { HackathonRegistration } from "./mainDashboard/sections/RegistrationHackathon";

function getUserFromStorage() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function InviteAccept() {
  const { inviteId } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [inviteData, setInviteData] = useState(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  // Helper to refresh user from storage
  const refreshUser = useCallback(() => {
    /* no-op: removed user state */
  }, []);

  // On mount, check for stored invite redirect after login
  useEffect(() => {
    const storedInvite = localStorage.getItem("pendingInviteRedirect");
    if (storedInvite) {
      localStorage.removeItem("pendingInviteRedirect");
      if (window.location.pathname !== storedInvite) {
        navigate(storedInvite, { replace: true });
        return;
      }
    }
    refreshUser();
  }, [navigate, refreshUser]);

  // Main invite logic
  const checkInvite = useCallback(async () => {
    setStatus("loading");
    try {
      const inviteRes = await fetch(`http://localhost:3000/api/team-invites/${inviteId}`);
      if (!inviteRes.ok) {
        setStatus("error");
        setMessage("❌ Invalid or expired invitation link.");
        return;
      }
      const invite = await inviteRes.json();
      setInviteData(invite);
      const userObj = getUserFromStorage();
      if (!userObj) {
        setShowLoginModal(true);
        setShowAcceptModal(false);
        setStatus("login");
        return;
      }
      if (userObj.email !== invite.invitedEmail) {
        setShowLoginModal(false);
        setShowAcceptModal(false);
        setStatus("wronguser");
        setMessage(`You are logged in as ${userObj.email}. Please log out and log in as ${invite.invitedEmail} to accept this invite.`);
        return;
      }
      // Already accepted or already a member
      if (invite.status === 'accepted' || (invite.team && invite.team.members && invite.team.members.some(m => m.email === userObj.email))) {
        setShowLoginModal(false);
        setShowAcceptModal(false);
        setStatus("accepted");
        setMessage("✅ You are already a member of this team!");
        return;
      }
      // Show accept/reject modal
      setShowLoginModal(false);
      setShowAcceptModal(true);
      setStatus("pending");
    } catch {
      setStatus("error");
      setMessage("❌ Failed to process invitation.");
    }
  }, [inviteId]);

  useEffect(() => {
    checkInvite();
  }, [checkInvite]);

  // Accept invite handler (now just accepts, then shows registration form)
  const handleAccept = async () => {
    setShowAcceptModal(false);
    setStatus("loading");
    try {
      const token = localStorage.getItem("token");
      const acceptRes = await fetch(`http://localhost:3000/api/team-invites/${inviteId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await acceptRes.json();
      if (acceptRes.ok) {
        setStatus("register");
        setShowRegistrationForm(true);
      } else {
        setStatus("error");
        setMessage(data.error || "❌ Failed to accept invite.");
      }
    } catch {
      setStatus("error");
      setMessage("❌ Failed to accept invite.");
    }
  };

  // Registration form submit handler
  const handleRegistrationSubmit = async (formData) => {
    setStatus("loading");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/team-invites/${inviteId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ formData })
      });
      const data = await res.json();
      if (res.ok) {
        setRegistrationSuccess(true);
        setStatus("accepted");
        setMessage("✅ You have successfully joined the team and registered for the hackathon!");
      } else {
        setStatus("error");
        setMessage(data.error || "❌ Failed to register for hackathon.");
      }
    } catch {
      setStatus("error");
      setMessage("❌ Failed to register for hackathon.");
    } finally {
      // Always redirect after registration attempt
      setTimeout(() => {
        navigate("/dashboard/my-hackathons");
      }, 2000);
    }
  };

  // Reject invite handler
  const handleReject = async () => {
    setShowAcceptModal(false);
    setStatus("loading");
    try {
      const token = localStorage.getItem("token");
      const rejectRes = await fetch(`http://localhost:3000/api/team-invites/${inviteId}/respond`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "declined" })
      });
      const data = await rejectRes.json();
      if (rejectRes.ok) {
        setStatus("declined");
        setMessage("You have declined the invitation.");
        await checkInvite();
      } else {
        setStatus("error");
        setMessage(data.error || "❌ Failed to decline invite.");
      }
    } catch {
      setStatus("error");
      setMessage("❌ Failed to decline invite.");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing Invitation</h2>
            <p className="text-gray-600">Please wait while we verify your invitation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Join the Team!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {inviteData && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Team Invitation</h3>
                <p className="text-blue-800 text-sm">
                  You've been invited to join <strong>{inviteData.team?.name}</strong> for{" "}
                  <strong>{inviteData.hackathon?.title}</strong>
                </p>
              </div>
            )}
            <div className="space-y-4">
              <p className="text-gray-600">
                To accept this invitation, you need to have an account. Please log in or create a new account.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => {
                    localStorage.setItem("pendingInviteRedirect", `/invite/${inviteId}`);
                    navigate("/login");
                  }}
                  className="w-full"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Login to Existing Account
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    localStorage.setItem("pendingInviteRedirect", `/invite/${inviteId}`);
                    navigate("/register");
                  }}
                  className="w-full"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create New Account
                </Button>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">
                After logging in, you'll be automatically redirected back here to accept the invitation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "wronguser") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Invitation Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-600">{message}</p>
            <Button 
              onClick={() => {
                localStorage.setItem("pendingInviteRedirect", `/invite/${inviteId}`);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="w-full"
              variant="destructive"
            >
              Switch Account
            </Button>
            <Button onClick={() => navigate("/dashboard")} className="w-full" variant="outline">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login/register modal
  if (showLoginModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Register or Log In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 text-center">
              Please register or log in to accept this invitation and join the hackathon.
            </p>
            <Button 
              onClick={() => {
                localStorage.setItem("pendingInviteRedirect", `/invite/${inviteId}`);
                navigate("/login");
              }}
              className="w-full"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Login to Existing Account
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                localStorage.setItem("pendingInviteRedirect", `/invite/${inviteId}`);
                navigate("/register");
              }}
              className="w-full"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create New Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show accept/reject modal
  if (showAcceptModal && inviteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Team Invitation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">You've been invited!</h3>
              <p className="text-green-800 text-sm">
                Join <strong>{inviteData.team?.name}</strong> for <strong>{inviteData.hackathon?.title}</strong>?
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAccept} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="w-4 h-4 mr-2" /> Accept
              </Button>
              <Button onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                <XCircle className="w-4 h-4 mr-2" /> Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show registration form after accepting invite
  if (showRegistrationForm && inviteData && inviteData.hackathon) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-2xl p-6">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-lg font-semibold text-blue-900">
              {inviteData.invitedBy?.name || inviteData.invitedBy?.email || "A friend"} is inviting you to join the hackathon <span className="font-bold">{inviteData.hackathon?.title}</span>!
            </p>
          </div>
          <HackathonRegistration
            hackathon={inviteData.hackathon}
            onBack={() => setShowRegistrationForm(false)}
            onSuccess={handleRegistrationSubmit}
            inviteMode={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            status === "accepted" ? "bg-green-100" : "bg-red-100"
          }`}>
            {status === "accepted" ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === "accepted" ? "Welcome to the Team!" : "Invitation Error"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600">{message}</p>
          
          {status === "accepted" && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">What's Next?</h3>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Check your dashboard for team details</li>
                  <li>• Connect with your teammates</li>
                  <li>• Start working on your project</li>
                </ul>
              </div>
              
              <Button 
                onClick={() => navigate("/dashboard/my-hackathons")}
                className="w-full"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Go to My Hackathons
              </Button>
            </div>
          )}
          
          {status === "error" && (
            <Button 
              onClick={() => navigate("/dashboard")}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default InviteAccept; 