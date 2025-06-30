import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, UserPlus, ArrowRight } from "lucide-react";
import { Button } from "../components/CommonUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/CommonUI/card";

export function InviteAccept() {
  const { inviteId } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [inviteData, setInviteData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkInvite = async () => {
      try {
        // First, check if the invite exists and get its details
        const inviteRes = await fetch(`http://localhost:3000/api/team-invites/${inviteId}`);
        if (!inviteRes.ok) {
          setStatus("error");
          setMessage("❌ Invalid or expired invitation link.");
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

        // Accept invite
        const acceptRes = await fetch(`http://localhost:3000/api/team-invites/${inviteId}/accept`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await acceptRes.json();
        if (acceptRes.ok) {
          setStatus("accepted");
          setMessage("✅ You have successfully joined the team!");
        } else {
          setStatus("error");
          setMessage(data.error || "❌ Failed to accept invite.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("❌ Failed to process invitation.");
      }
    };

    checkInvite();
  }, [inviteId]);

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
                  onClick={() => navigate("/login")}
                  className="w-full"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Login to Existing Account
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate("/register")}
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