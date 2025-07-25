import { useState, useEffect } from "react";
import { Button } from "../../../../../../../components/CommonUI/button";
import BaseModal from "./BaseModal";

export default function EditTeamNameModal({
  open,
  onClose,
  onSave,
  defaultValue = "",
  loading,
}) {
  const [name, setName] = useState(defaultValue);

  useEffect(() => {
    if (open) setName(defaultValue);
  }, [open, defaultValue]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name);
  };

  return (
    <BaseModal
      title="Edit Team Name"
      open={open}
      onOpenChange={onClose}
      content={
        <div className="space-y-4">
          <label className="block text-sm font-medium">Team Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your team name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            maxLength={50}
          />
          <p className="text-xs text-gray-500">{name.length}/50 characters</p>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={!name.trim() || loading} className="flex-1">
              {loading ? "Updating..." : "Update Name"}
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