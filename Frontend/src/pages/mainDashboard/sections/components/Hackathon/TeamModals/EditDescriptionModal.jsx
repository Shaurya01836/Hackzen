"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../../../../components/CommonUI/button";
import BaseModal from "./BaseModal";

export default function EditDescriptionModal({
  open,
  onClose,
  onSave,
  defaultValue = "",
  loading,
}) {
  const [description, setDescription] = useState(defaultValue);

  useEffect(() => {
    if (open) setDescription(defaultValue);
  }, [open, defaultValue]);

  const handleSave = () => {
    if (!description.trim()) return;
    onSave(description);
  };

  return (
    <BaseModal
      title="Edit Team Description"
      open={open}
      onOpenChange={onClose}
      content={
        <div className="space-y-4">
          <label className="block text-sm font-medium">Team Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your team's goals, skills, and what you hope to achieve"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            maxLength={300}
          />
          <p className="text-xs text-gray-500">{description.length}/300 characters</p>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={!description.trim() || loading} className="flex-1">
              {loading ? "Updating..." : "Update Description"}
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
