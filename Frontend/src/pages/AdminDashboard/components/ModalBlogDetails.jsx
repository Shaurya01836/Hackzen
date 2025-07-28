import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import BlogDetails from "./BlogDetails";

export default function ModalBlogDetails({ isOpen, onClose, blog }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl relative">
          <BlogDetails blog={blog} onBack={onClose} />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
