"use client";

import { useState } from "react";
import { Input } from "../../../../../../components/CommonUI/input";
import { Button } from "../../../../../../components/CommonUI/button";
import BaseModal from "./BaseModal";
import { Copy } from "lucide-react";
import { useToast } from "../../../../../../hooks/use-toast";

export default function InviteModal({ onInvite, team, hackathon, project, show, onClose }) {
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleInvite = async () => {
    if (!email.trim()) return;
    // Robust null checks
    if (!team || !team._id) {
      toast({
        title: "Error",
        description: "Team not loaded. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    if (!hackathon && !project) {
      toast({
        title: "Error",
        description: "Context not loaded. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const inviteData = {
        invitedEmail: email,
        teamId: team._id,
      };
      // Add context-specific ID
      if (hackathon) {
        inviteData.hackathonId = hackathon._id;
      } else if (project) {
        inviteData.projectId = project._id;
      }
      const res = await fetch("http://localhost:3000/api/team-invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inviteData),
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { message: "Invalid server response." };
      }
      if (res.ok && data.invite && data.invite._id) {
        onInvite?.(); // callback to refresh invite list
        const link = `${window.location.origin}/invite/${data.invite._id}`;
        setInviteLink(link);
        setEmail("");
        toast({
          title: "Invite Sent",
          description: "Link generated. Share or copy it below.",
        });
      } else {
        toast({
          title: "Invite Failed",
          description: data.error || data.message || "Could not send invite",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error sending invite:", err);
      toast({
        title: "Error",
        description: err.message || "Something went wrong while sending the invite",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast({ title: "Copied", description: "Invite link copied to clipboard" });
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClose = () => {
    setEmail("");
    setInviteLink(null);
    onClose();
  };

  return (
    <BaseModal
      title="Invite Team Member"
      open={show}
      onOpenChange={handleClose}
      content={
        <div className="space-y-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com"
          />
          <Button onClick={handleInvite} disabled={!email.trim()}>
            Send Invite
          </Button>

          {inviteLink && (
            <div className="text-sm text-gray-600">
              Share this invite link:
              <div className="bg-gray-100 mt-2 px-3 py-2 rounded flex items-center justify-between">
                <span className="break-all">{inviteLink}</span>
                <Button size="icon" variant="ghost" onClick={handleCopy}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              {copied && <p className="text-green-600 mt-1">Link copied!</p>}
            </div>
          )}
        </div>
      }
    />
  );
}
