import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, UserPlus, ArrowRight } from "lucide-react";
import { Button } from "../components/CommonUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/CommonUI/card";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../components/DashboardUI/alert-dialog";

export function InviteAccept() {
  const { inviteId } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [inviteData, setInviteData] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [hasProcessedInvite, setHasProcessedInvite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkInvite = async () => {
      try {
        // Reset status when inviteId changes
        setStatus("loading");
        setShowDialog(false);
        setHasProcessedInvite(false);
        
        // First, check if the invite exists and get its details
        const inviteRes = await fetch(`http://localhost:3000/api/team-invites/${inviteId}`);
        if (!inviteRes.ok) {
          setStatus("error");
          setMessage("Invalid or expired invitation link.");
          return;
        }
        const invite = await inviteRes.json();
        setInviteData(invite);

        // Check if user is logged in
        const token = localStorage.getItem("token");
        if (!token) {
          setStatus("login");
          return;
        }

        // Check if user has already processed this invite
        const processedInvites = JSON.parse(localStorage.getItem("processedInvites") || "[]");
        if (processedInvites.includes(inviteId)) {
          setStatus("error");
          setMessage("You have already processed this invitation.");
          return;
        }

        // Show accept/decline dialog
        setShowDialog(true);
        setStatus("prompt");
      } catch (err) {
        setStatus("error");
        setMessage("Failed to process invitation.");
      }
    };
    checkInvite();
  }, [inviteId]);

  const handleAccept = async () => {
    try {
      setStatus("loading");
      const token = localStorage.getItem("token");
      const acceptRes = await fetch(`http://localhost:3000/api/team-invites/${inviteId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await acceptRes.json();
      if (acceptRes.ok) {
        // Mark this invite as processed
        const processedInvites = JSON.parse(localStorage.getItem("processedInvites") || "[]");
        processedInvites.push(inviteId);
        localStorage.setItem("processedInvites", JSON.stringify(processedInvites));
        
        setStatus("accepted");
        setMessage("✅ You have successfully joined the team!");
        setShowDialog(false);
        setHasProcessedInvite(true);
      } else {
        setStatus("error");
        setMessage(data.error || "❌ Failed to accept invite.");
        setShowDialog(false);
      }
    } catch (err) {
      setStatus("error");
      setMessage("❌ Failed to process invitation.");
      setShowDialog(false);
    }
  };

  const handleDecline = () => {
    // Mark this invite as processed
    const processedInvites = JSON.parse(localStorage.getItem("processedInvites") || "[]");
    processedInvites.push(inviteId);
    localStorage.setItem("processedInvites", JSON.stringify(processedInvites));
    
    setShowDialog(false);
    setStatus("declined");
    setMessage("You have declined the invitation.");
    setHasProcessedInvite(true);
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  const clearProcessedInvite = () => {
    const processedInvites = JSON.parse(localStorage.getItem("processedInvites") || "[]");
    const updatedInvites = processedInvites.filter(id => id !== inviteId);
    localStorage.setItem("processedInvites", JSON.stringify(updatedInvites));
    // Reload the page to restart the flow
    window.location.reload();
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
                  onClick={() => navigate(`/login?redirectTo=/invite/${inviteId}`)}
                  className="w-full"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Login to Existing Account
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/register?redirectTo=/invite/${inviteId}`)}
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

  // Accept/Decline dialog for logged-in users
  if (status === "prompt" && inviteData) {
    return (
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Team Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              <div>You have been invited to join team <b>{inviteData.team?.name}</b> for hackathon <b>{inviteData.hackathon?.title}</b>.</div>
              <div>Do you want to accept this invitation?</div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDecline}>Decline</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccept}>Accept</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Success or error
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
            <div className="space-y-3">
              <Button 
                onClick={() => navigate("/dashboard")}
                className="w-full"
              >
                Go to Dashboard
              </Button>
              {message.includes("already processed") && (
                <Button 
                  variant="outline"
                  onClick={clearProcessedInvite}
                  className="w-full"
                >
                  Try Again
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default InviteAccept; 