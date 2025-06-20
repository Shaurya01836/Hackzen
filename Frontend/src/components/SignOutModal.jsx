// components/SignOutModal.jsx
import { Dialog } from '@headlessui/react';
import { LogOut } from 'lucide-react';

export default function SignOutModal({ isOpen, onClose, onConfirm }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-black/40 px-4">
        <Dialog.Panel className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center space-y-4">
          <div className="flex justify-center items-center w-12 h-12 mx-auto bg-red-100 rounded-full">
            <LogOut className="text-red-600 w-6 h-6" />
          </div>
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Confirm Sign Out
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500">
            Are you sure you want to sign out from your account?
          </Dialog.Description>
          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Yes, Sign Out
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
