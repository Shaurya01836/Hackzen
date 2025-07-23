import { X } from "lucide-react";
import { Dialog } from "@headlessui/react"; // Or your modal lib
import { Badge } from "../../../../components/CommonUI/badge";  
import { Button } from "../../../../components/CommonUI/button";

export default function HackathonDetailModal({ isOpen, onClose, hackathon }) {
  if (!hackathon) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      <div className="relative bg-white w-full max-w-3xl h-[90vh] overflow-y-scroll rounded-xl shadow-xl z-50 p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{hackathon.title}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <img
          src={hackathon.images?.banner?.url}
          alt="Hackathon Banner"
          className="w-full h-52 object-cover rounded-md mb-4"
        />

        <p className="text-gray-700 mb-4">{hackathon.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div><strong>Location:</strong> {hackathon.location}</div>
          <div><strong>Mode:</strong> {hackathon.mode}</div>
          <div><strong>Start:</strong> {new Date(hackathon.startDate).toLocaleDateString()}</div>
          <div><strong>End:</strong> {new Date(hackathon.endDate).toLocaleDateString()}</div>
          <div><strong>Registration Deadline:</strong> {new Date(hackathon.registrationDeadline).toLocaleDateString()}</div>
          <div>
            <strong>Prize Pool:</strong> ${hackathon.prizePool.amount}
            <div className="text-xs text-gray-500 mt-1 whitespace-pre-line">
              {hackathon.prizePool.breakdown}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <strong>Category:</strong> <Badge>{hackathon.category}</Badge>
        </div>

        <div className="mb-4">
          <strong>Tags:</strong>{" "}
          {hackathon.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="mr-1">{tag}</Badge>
          ))}
        </div>

        <div className="mb-4">
          <strong>Difficulty:</strong> {hackathon.difficultyLevel}
        </div>

        <div className="mb-4">
          <strong>Problem Statements:</strong>
          <ul className="list-disc ml-6 mt-2 text-sm text-gray-700">
            {hackathon.problemStatements.map((prob, i) => (
              <li key={i}>{prob}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <strong>Requirements:</strong>
          <ul className="list-disc ml-6 mt-2 text-sm text-gray-700">
            {hackathon.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <strong>Perks:</strong>
          <ul className="list-disc ml-6 mt-2 text-sm text-gray-700">
            {hackathon.perks.map((perk, i) => (
              <li key={i}>{perk}</li>
            ))}
          </ul>
        </div>

        {/* ✅ Judge & Mentor Count */}
        <div className="mb-4">
          <strong>Judges:</strong> {hackathon.judges?.length || 0}
        </div>

        <div className="mb-4">
          <strong>Mentors:</strong> {hackathon.mentors?.length || 0}
        </div>

        <div className="mt-6">
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </Dialog>
  );
}
