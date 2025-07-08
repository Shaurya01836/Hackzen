"use client";
import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../DashboardUI/dialog";
import { Button } from "../CommonUI/button";
import { Shield, User, Megaphone, Brain, Gavel, Key } from "lucide-react";
import { cn } from "../../lib/utils";
import { buildApiUrl, getAuthHeaders } from "../../lib/api";

const roleDetails = {
  participant: { icon: <User />, label: "Participant", desc: "Attends the event." },
  organizer: { icon: <Megaphone />, label: "Organizer", desc: "Manages the hackathon." },
  mentor: { icon: <Brain />, label: "Mentor", desc: "Guides participants." },
  judge: { icon: <Gavel />, label: "Judge", desc: "Evaluates submissions." },
  admin: { icon: <Key />, label: "Admin", desc: "Full access to settings." },
};

export default function ChangeRoleDialog({ userId, currentRole, onRoleUpdate }) {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // <-- NEW

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const apiUrl = buildApiUrl(`/users/${userId}/role`);
      const headers = getAuthHeaders();
      
      console.log("Making API call to:", apiUrl);
      console.log("Headers:", headers);
      console.log("Request body:", { newRole: selectedRole });
      
      const response = await axios.patch(
        apiUrl,
        { newRole: selectedRole },
        {
          headers: headers,
        }
      );
      
      console.log("Role update successful:", response.data);
      onRoleUpdate(selectedRole);
      setOpen(false);
    } catch (err) {
      console.error("Failed to update role:", err);
      
      let errorMessage = "Failed to update role.";
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Network error
        errorMessage = "Network error: Unable to connect to server. Please check your connection.";
      } else {
        // Other error
        errorMessage = err.message || "An unexpected error occurred.";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full text-white hover:bg-white/5 justify-start"
        >
          <Shield className="w-4 h-4 mr-2" />
          Change Role
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white text-black sm:max-w-md rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">Select New Role</DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-500">
            Choose the role that matches the user's responsibilities.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          {Object.entries(roleDetails).map(([role, { icon, label, desc }]) => (
            <div
              key={role}
              onClick={() => setSelectedRole(role)}
              className={cn(
                "cursor-pointer rounded-lg border p-4 transition-all duration-200",
                selectedRole === role
                  ? "border-purple-600 bg-purple-100 shadow"
                  : "border-gray-300 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center gap-2 font-semibold text-sm">
                {icon}
                {label}
              </div>
              <p className="text-xs text-gray-600 mt-1">{desc}</p>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {loading ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
