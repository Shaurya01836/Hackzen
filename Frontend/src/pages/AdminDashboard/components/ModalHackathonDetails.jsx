// ModalHackathonDetails.jsx
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { HackathonDetails } from "./HackathonDetails";

export default function ModalHackathonDetails({ isOpen, onClose, hackathon }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          <HackathonDetails hackathon={hackathon} onClose={onClose} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
