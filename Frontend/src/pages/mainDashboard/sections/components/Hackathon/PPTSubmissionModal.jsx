import { useState, useEffect } from "react";
import BaseModal from "./TeamModals/BaseModal";
import { uploadPPTFile, savePPTSubmission } from '../../../../../lib/api';
import { useToast } from '../../../../../hooks/use-toast';

export default function PPTSubmissionModal({ open, onOpenChange, hackathonId, roundIndex, onSuccess, hackathon, editingSubmission }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast ? useToast() : { toast: () => {} };
  const [selectedProblem, setSelectedProblem] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Prefill in edit mode
  useEffect(() => {
    if (open && editingSubmission) {
      setIsEditMode(true);
      setSelectedProblem(editingSubmission.problemStatement || "");
      setFile(null); // Don't prefill file input, but show current file below
    } else if (open) {
      setIsEditMode(false);
      setSelectedProblem("");
      setFile(null);
    }
  }, [open, editingSubmission]);

  // Reset file and problem when modal closes
  // (already handled above)

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
    if (!file && !isEditMode) {
      toast({ title: 'No file selected', description: 'Please select a .pptx file', variant: 'destructive' });
      return;
    }
    if (hackathon?.problemStatements?.length && !selectedProblem) {
      toast({ title: 'No problem statement selected', description: 'Please select a problem statement', variant: 'destructive' });
      return;
    }
    setUploading(true);
    try {
      let pptUrl = editingSubmission?.pptFile;
      if (file) {
        const result = await uploadPPTFile(file);
        if (!result || !result.url) {
          toast({ title: 'Upload failed', description: 'No URL returned from upload', variant: 'destructive' });
          setUploading(false);
          return;
        }
        pptUrl = result.url;
      }
      const saveRes = await savePPTSubmission({ hackathonId, roundIndex, pptFile: pptUrl, problemStatement: selectedProblem, originalName: file ? file.name : (editingSubmission?.originalName || undefined) });
      if (!saveRes || !saveRes.success) {
        toast({ title: 'Save failed', description: saveRes && saveRes.error ? saveRes.error : 'Unknown error saving PPT', variant: 'destructive' });
        setUploading(false);
        return;
      }
      toast({ title: isEditMode ? 'PPT Updated!' : 'PPT Uploaded!', description: isEditMode ? 'Your PPT submission has been updated.' : 'Your PPT has been uploaded successfully.', variant: 'success' });
      setFile(null);
      setSelectedProblem("");
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

  const showProblemDropdown = hackathon?.problemStatements && hackathon.problemStatements.length > 0;

  // Helper to get download link for existing PPT
  const getPPTDownloadLink = (pptFile, originalName, fallbackName = "presentation") => {
    if (!pptFile) return '#';
    let url = pptFile.replace('/raw/raw/', '/raw/');
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    let publicId = matches ? matches[1] : '';
    publicId = publicId.replace(/\.pptx$/, '');
    let baseName = fallbackName;
    if (originalName) {
      baseName = originalName.replace(/\.[^/.]+$/, '');
    } else if (publicId) {
      baseName = publicId.split('/').pop() || fallbackName;
    }
    const baseUrl = url.split('/upload/')[0];
    return `${baseUrl}/raw/upload/fl_attachment:${baseName}.pptx/${publicId}.pptx`;
  };

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditMode ? "Edit PPT Submission" : "Submit PPT for this Round"}
      description={isEditMode ? "Update your .pptx file or problem statement. Only one submission allowed per round." : "Upload your .pptx file. Only one submission allowed per round."}
      content={
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {isEditMode && editingSubmission?.pptFile && (
            <div className="text-sm text-gray-700 flex flex-col gap-1">
              <span>Current PPT:</span>
              <a
                href={getPPTDownloadLink(editingSubmission.pptFile, editingSubmission.originalName)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {editingSubmission.originalName || 'Download current PPT'}
              </a>
            </div>
          )}
          <input
            type="file"
            accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {file && <div className="text-sm text-gray-700">Selected: {file.name}</div>}
          {showProblemDropdown && (
            <>
              <label className="block text-sm font-medium text-gray-700 mt-2">Select a problem statement</label>
              <select
                value={selectedProblem}
                onChange={e => setSelectedProblem(e.target.value)}
                disabled={uploading}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a problem statement</option>
                {hackathon.problemStatements.map((ps, idx) => (
                  <option key={idx} value={typeof ps === 'object' && ps !== null ? ps.statement : ps}>
                    {typeof ps === 'object' && ps !== null ? ps.statement : ps}
                  </option>
                ))}
              </select>
            </>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60"
            disabled={uploading}
          >
            {uploading ? (isEditMode ? 'Saving...' : 'Uploading...') : (isEditMode ? 'Save Changes' : 'Submit PPT')}
          </button>
        </form>
      }
    />
  );
} 