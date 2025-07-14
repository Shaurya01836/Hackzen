import { useState, useEffect } from "react";
import BaseModal from "./TeamModals/BaseModal";
import { uploadPPTFile, savePPTSubmission } from '../../../../../lib/api';
import { useToast } from '../../../../../hooks/use-toast';

export default function PPTSubmissionModal({ open, onOpenChange, hackathonId, roundIndex, onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast ? useToast() : { toast: () => {} };

  // Reset file when modal closes
  useEffect(() => {
    if (!open) setFile(null);
  }, [open]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/vnd.openxmlformats-officedocument.presentationml.presentation' && !f.name.endsWith('.pptx')) {
      toast({ title: 'Invalid file', description: 'Please upload a .pptx file', variant: 'destructive' });
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({ title: 'No file selected', description: 'Please select a .pptx file', variant: 'destructive' });
      return;
    }
    setUploading(true);
    try {
      const result = await uploadPPTFile(file);
      console.log('Upload result:', result);
      if (!result || !result.url) {
        toast({ title: 'Upload failed', description: 'No URL returned from upload', variant: 'destructive' });
        setUploading(false);
        return;
      }
      const saveRes = await savePPTSubmission({ hackathonId, roundIndex, pptFile: result.url });
      console.log('Save result:', saveRes);
      if (!saveRes || !saveRes.success) {
        toast({ title: 'Save failed', description: saveRes && saveRes.error ? saveRes.error : 'Unknown error saving PPT', variant: 'destructive' });
        setUploading(false);
        return;
      }
      toast({ title: 'PPT Uploaded!', description: 'Your PPT has been uploaded successfully.', variant: 'success' });
      setFile(null);
      if (onOpenChange) onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      let message = err?.message;
      if (err && err.response && typeof err.response.json === 'function') {
        try {
          const data = await err.response.json();
          message = data.error || data.message || message;
        } catch {}
      }
      if (typeof message === 'object') message = JSON.stringify(message);
      console.error('PPT upload error:', err);
      toast({ title: 'Upload failed', description: message || 'Could not upload PPT', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title="Submit PPT for this Round"
      description="Upload your .pptx file. Only one submission allowed per round."
      content={
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <input
            type="file"
            accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {file && <div className="text-sm text-gray-700">Selected: {file.name}</div>}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Submit PPT'}
          </button>
        </form>
      }
    />
  );
} 