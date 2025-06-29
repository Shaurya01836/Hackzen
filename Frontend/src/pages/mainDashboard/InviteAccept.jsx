import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function InviteAccept() {
  const { inviteId } = useParams();
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("login");
      return;
    }

    // Accept invite
    const acceptInvite = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/team-invites/${inviteId}/accept`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStatus("accepted");
          setMessage("✅ You have joined the team!");
        } else {
          setStatus("error");
          setMessage(data.error || "❌ Failed to accept invite.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("❌ Failed to accept invite.");
      }
    };

    acceptInvite();
  }, [inviteId]);

  if (status === "login") {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="mb-4">Please log in or register to accept the team invite.</p>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Team Invitation</h2>
      <p className="mb-4">{message || "Processing your invitation..."}</p>
      {status === "accepted" && (
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/dashboard/my-hackathons")}
        >
          Go to My Hackathons
        </button>
      )}
    </div>
  );
}

export default InviteAccept; 