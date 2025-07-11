"use client";

import { Button } from "../../../../../../components/CommonUI/button";
import BaseModal from "./BaseModal";
import { useEffect, useState } from "react";

export default function JoinTeamModal({ open, onClose, onJoin, loading }) {
  const [teamCode, setTeamCode] = useState("");

  useEffect(() => {
    if (!open) setTeamCode(""); // Clear input when modal closes
  }, [open]);

  const handleJoin = () => {
    if (!teamCode.trim()) return;
    onJoin(teamCode);
  };


  return (
    <BaseModal
      title="Join a Team"
      open={open}
      onOpenChange={onClose}
      content={
        <div className="space-y-4">
          <label className="block text-sm font-medium">Team Code</label>
          <input
            type="text"
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
            placeholder="Enter team code (e.g., A1B2C3D4)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            disabled={loading}
            maxLength={8}
          />
          <p className="text-xs text-gray-500">
            Team codes are 8 characters long and case-insensitive.
          </p>
          <div className="flex gap-3 pt-4">
            <Button onClick={handleJoin} disabled={!teamCode.trim() || loading} className="flex-1">
              {loading ? "Joining..." : "Join Team"}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
          </div>
        </div>
      }
    />
  );
}
