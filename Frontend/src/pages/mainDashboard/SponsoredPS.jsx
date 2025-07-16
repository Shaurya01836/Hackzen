import React, { useEffect, useState } from 'react';
import { Button } from '../../components/CommonUI/button';
import { MessageCircle, Send, Mail, RefreshCw } from 'lucide-react';
import ChatModal from './components/ChatModal';

const proposalFields = [
  { key: 'name', label: 'Your Name', required: true },
  { key: 'email', label: 'Your Email', required: true, disabled: true },
  { key: 'organization', label: 'Organization / Company Name', required: true },
  { key: 'website', label: 'Website / LinkedIn', required: false },
  { key: 'telegram', label: 'Telegram', required: false },
  { key: 'title', label: 'Proposal Title', required: true },
  { key: 'description', label: 'Description / Problem Context', required: true, textarea: true },
  { key: 'deliverables', label: 'Expected Deliverables', required: true, textarea: true },
  { key: 'techStack', label: 'Preferred Tech Stack or Domain', required: true },
  { key: 'targetAudience', label: 'Target Audience', required: true },
  { key: 'prizeAmount', label: 'Prize Amount', required: true },
  { key: 'prizeDescription', label: 'Prize Description', required: true },
  { key: 'provideJudges', label: 'Will you provide judges?', required: true, type: 'radio' },
  { key: 'judgeName', label: 'Judge Name', required: false },
  { key: 'judgeEmail', label: 'Judge Email', required: false },
  { key: 'judgeRole', label: 'Judge Role', required: false },
  { key: 'customStartDate', label: 'Preferred Start Date', required: false, type: 'date' },
  { key: 'customDeadline', label: 'Preferred Deadline', required: false, type: 'date' },
  { key: 'notes', label: 'Additional Notes', required: false, textarea: true },
];

export default function SponsoredPS() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [messageModal, setMessageModal] = useState({ open: false, proposal: null, message: '' });
  const [messageStatus, setMessageStatus] = useState(null);
  const [showOrgMsgModal, setShowOrgMsgModal] = useState(false);
  const [orgMsgProposalIdx, setOrgMsgProposalIdx] = useState(null);
  const [seenMessages, setSeenMessages] = useState({}); // { proposalId: true }
  const [organizerTelegrams, setOrganizerTelegrams] = useState({}); // { hackathonId: telegram }
  const [chatOpen, setChatOpen] = useState(false);
  const [chatProposalId, setChatProposalId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  // Move fetchProposalsAndTelegrams outside useEffect so it can be called from button and event
  async function fetchProposalsAndTelegrams() {
    setLoading(true);
    const res = await fetch(`/api/sponsor-proposals/user/${user?.email}`);
    const data = await res.json();
    const approvedProposals = Array.isArray(data) ? data.filter(p => p.status === 'approved') : [];
    setProposals(approvedProposals);
    // Fetch organizer Telegrams for each proposal
    const telegrams = {};
    await Promise.all(approvedProposals.map(async (proposal) => {
      if (proposal.hackathon) {
        // Fetch hackathon to get organizer
        const hackathonRes = await fetch(`/api/hackathons/${proposal.hackathon}`);
        if (hackathonRes.ok) {
          const hackathon = await hackathonRes.json();
          let organizerId = null;
          if (hackathon.organizer) {
            // Handle both populated object and plain ID
            if (typeof hackathon.organizer === 'object' && hackathon.organizer._id) {
              organizerId = hackathon.organizer._id;
            } else if (typeof hackathon.organizer === 'string') {
              organizerId = hackathon.organizer;
            }
          }
          if (organizerId) {
            // Fetch organizer user profile
            const organizerRes = await fetch(`/api/users/${organizerId}`);
            if (organizerRes.ok) {
              const organizer = await organizerRes.json();
              telegrams[proposal.hackathon] = organizer.telegram || null;
            }
          }
        }
      }
    }));
    setOrganizerTelegrams(telegrams);
    setLoading(false);
  }

  useEffect(() => {
    if (user?.email) fetchProposalsAndTelegrams();
    // Auto-refresh on tab focus
    function handleVisibility() {
      if (document.visibilityState === 'visible' && user?.email) {
        fetchProposalsAndTelegrams();
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [user?.email]);

  function startEdit(idx) {
    setEditIdx(idx);
    setEditForm({ ...proposals[idx] });
    setSaveStatus(null);
  }
  function cancelEdit() {
    setEditIdx(null);
    setEditForm({});
    setSaveStatus(null);
  }
  async function saveEdit(idx) {
    setSaving(true);
    setSaveStatus(null);
    const proposal = proposals[idx];
    const payload = { ...editForm };
    // Remove fields that shouldn't be updated
    delete payload._id;
    delete payload.status;
    delete payload.messageToSponsor;
    delete payload.organizerTelegram;
    try {
      const res = await fetch(`/api/sponsor-proposals/${proposal._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update proposal');
      setSaveStatus('success');
      // Update proposals in state
      setProposals(prev => prev.map((p, i) => i === idx ? { ...p, ...payload } : p));
      setEditIdx(null);
      setEditForm({});
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  }

  function openMessageModal(proposal) {
    setMessageModal({ open: true, proposal, message: '' });
    setMessageStatus(null);
  }
  async function handleSendMessageToOrganizer() {
    if (!messageModal.proposal) return;
    setMessageStatus(null);
    try {
      await fetch(`/api/sponsor-proposals/${messageModal.proposal._id}/message`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageToSponsor: messageModal.message })
      });
      setMessageStatus('success');
      setTimeout(() => setMessageModal({ open: false, proposal: null, message: '' }), 1000);
    } catch {
      setMessageStatus('error');
    }
  }

  // Show org message modal
  function handleShowOrgMsg(idx) {
    setShowOrgMsgModal(true);
    setOrgMsgProposalIdx(idx);
    // Mark as seen
    setSeenMessages(prev => ({ ...prev, [proposals[idx]._id]: true }));
  }
  function closeOrgMsgModal() {
    setShowOrgMsgModal(false);
    setOrgMsgProposalIdx(null);
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (proposals.length === 0) return <div className="p-8">No sponsored problem statements found.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><span role="img" aria-label="sponsor">🤝</span> Sponsored Problem Statements</h1>
        <Button size="icon" variant="outline" title="Refresh" onClick={fetchProposalsAndTelegrams}><RefreshCw className="w-5 h-5" /></Button>
      </div>
      {proposals.map((p, idx) => {
        const hasNewMsg = !!p.messageToSponsor && !seenMessages[p._id];
        const organizerTelegram = organizerTelegrams[p.hackathon];
        return (
          <div key={p._id} className="border rounded-lg p-6 mb-6 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold text-lg">{p.title}</div>
              <span className="text-green-600">{p.status}</span>
            </div>
            {editIdx === idx ? (
              <form className="space-y-3 mb-4" onSubmit={e => { e.preventDefault(); saveEdit(idx); }}>
                {proposalFields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-1">{field.label}{field.required && ' *'}</label>
                    {field.type === 'radio' ? (
                      <div className="flex gap-4">
                        <label><input type="radio" name="provideJudges" value="yes" checked={editForm.provideJudges === 'yes'} onChange={() => setEditForm(f => ({ ...f, provideJudges: 'yes' }))} /> Yes</label>
                        <label><input type="radio" name="provideJudges" value="no" checked={editForm.provideJudges === 'no'} onChange={() => setEditForm(f => ({ ...f, provideJudges: 'no' }))} /> No</label>
                      </div>
                    ) : field.textarea ? (
                      <textarea className="w-full border rounded p-2" rows={field.key === 'description' ? 3 : 2} required={field.required} value={editForm[field.key] || ''} onChange={e => setEditForm(f => ({ ...f, [field.key]: e.target.value }))} />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        className="w-full border rounded p-2"
                        required={field.required}
                        disabled={field.disabled}
                        value={editForm[field.key] || ''}
                        onChange={e => setEditForm(f => ({ ...f, [field.key]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                  <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
                  {saveStatus === 'success' && <span className="text-green-600 ml-2">Saved!</span>}
                  {saveStatus === 'error' && <span className="text-red-600 ml-2">Failed to save.</span>}
                </div>
              </form>
            ) : (
              <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {proposalFields.map(field => (
                    <React.Fragment key={field.key}>
                      <dt className="font-semibold text-gray-700">{field.label}:</dt>
                      <dd className="text-gray-900 break-words">{p[field.key] || <span className="text-gray-400">-</span>}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </div>
            )}
            {editIdx === idx ? null : (
              <Button size="sm" variant="outline" className="mb-2" onClick={() => startEdit(idx)}>Edit Proposal</Button>
            )}
            <div className="border-t pt-4 mt-4">
              <div className="mb-2 flex items-center gap-2">
                <b>Organizer Telegram:</b> {organizerTelegram ? (
                  <>
                    <a href={organizerTelegram.startsWith('http') ? organizerTelegram : `https://t.me/${organizerTelegram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      {/* Telegram SVG icon */}
                      <svg className="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M9.036 16.572l-.398 3.52c.57 0 .816-.244 1.113-.537l2.664-2.537 5.522 4.04c1.012.557 1.73.264 1.98-.937l3.594-16.84c.328-1.527-.553-2.127-1.54-1.76l-21.36 8.23c-1.46.557-1.44 1.36-.25 1.72l5.46 1.705 12.66-7.98c.6-.41 1.15-.18.7.23z"/></svg>
                      {organizerTelegram.startsWith('@') ? organizerTelegram : `@${organizerTelegram}`}
                    </a>
                   
                  </>
                ) : (
                  <span className="text-gray-400 flex items-center gap-1"><svg className="w-4 h-4 text-blue-300 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M9.036 16.572l-.398 3.52c.57 0 .816-.244 1.113-.537l2.664-2.537 5.522 4.04c1.012.557 1.73.264 1.98-.937l3.594-16.84c.328-1.527-.553-2.127-1.54-1.76l-21.36 8.23c-1.46.557-1.44 1.36-.25 1.72l5.46 1.705 12.66-7.98c.6-.41 1.15-.18.7.23z"/></svg>Organizer has not provided a Telegram handle yet.</span>
                )}
              </div>
              
             
            </div>
            <Button size="sm" variant="default" className="mt-2" onClick={() => { setChatProposalId(p._id); setChatOpen(true); }}>Chat with Organizer</Button>
          </div>
        );
      })}
      <ChatModal open={chatOpen} onClose={() => setChatOpen(false)} proposalId={chatProposalId} currentUser={user} />
      {messageModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative border-4 border-blue-400">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setMessageModal({ open: false, proposal: null, message: '' })}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">Message Organizer</h2>
            <textarea
              className="w-full border-2 border-blue-300 rounded p-2 mb-4 focus:outline-blue-500"
              rows={4}
              placeholder="Type your message to the organizer here..."
              value={messageModal.message}
              onChange={e => setMessageModal(prev => ({ ...prev, message: e.target.value }))}
            />
            <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSendMessageToOrganizer} disabled={!messageModal.message.trim()}>
              Send Message
            </Button>
            {messageStatus === 'success' && <div className="text-green-600 mt-2">Message sent!</div>}
            {messageStatus === 'error' && <div className="text-red-600 mt-2">Failed to send message.</div>}
          </div>
        </div>
      )}
      {showOrgMsgModal && orgMsgProposalIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative border-4 border-yellow-400" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={closeOrgMsgModal}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-yellow-700 flex items-center gap-2"><Mail className="w-5 h-5" />Message from Organizer</h2>
            <div className="whitespace-pre-line text-base leading-relaxed" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
              {proposals[orgMsgProposalIdx]?.messageToSponsor}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 