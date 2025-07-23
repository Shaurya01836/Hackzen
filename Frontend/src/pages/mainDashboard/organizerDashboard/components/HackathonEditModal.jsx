import { Dialog } from "@headlessui/react";
import { useState } from "react";
import CreateHackathon from "../Create-hackathon";
import { X } from "lucide-react";

export default function HackathonEditModal({ hackathon, onClose, onUpdated }) {
  // Handler for updating hackathon
  const handleUpdate = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/hackathons/${hackathon._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Hackathon updated successfully!");
        onUpdated && onUpdated();
        onClose && onClose();
      } else {
        alert("Failed to update hackathon. Please try again.");
      }
    } catch (err) {
      alert("Error updating hackathon: " + err.message);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
          <button className="absolute top-2 right-2" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold mb-4">Edit Hackathon</h2>
          <CreateHackathon initialData={hackathon} onSubmit={handleUpdate} onBack={onClose} />
        </div>
      </div>
    </Dialog>
  );
}
