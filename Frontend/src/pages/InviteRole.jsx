import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "../components/CommonUI/button";

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

  if (loading) return <div>Loading...</div>;
  if (!invite || invite.error) return <div>Invite not found or expired.</div>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Judge Invitation</h1>
      <p>
        <b>Hackathon:</b> {invite.hackathon?.title}<br />
        <b>Role:</b> {invite.role}
      </p>
      <div className="mt-6 flex gap-4">
        <Button onClick={() => respond("accept")}>Accept</Button>
        <Button variant="outline" onClick={() => respond("decline")}>Decline</Button>
      </div>
    </div>
  );
}