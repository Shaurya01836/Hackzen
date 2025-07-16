import React, { useEffect, useState } from 'react';
import { Button } from '../../components/CommonUI/button';
import { MessageCircle, Send } from 'lucide-react';

const proposalFields = [
  { key: 'name', label: 'Your Name', required: true },
  { key: 'email', label: 'Your Email', required: true, disabled: true },
  { key: 'organization', label: 'Organization / Company Name', required: true },
  { key: 'website', label: 'Website / LinkedIn', required: false },
  { key: 'telegram', label: 'Telegram', required: false },
  { key: 'discord', label: 'Discord', required: false },
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
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    async function fetchProposals() {
      setLoading(true);
      const res = await fetch(`/api/sponsor-proposals/user/${user?.email}`);
      const data = await res.json();
      setProposals(Array.isArray(data) ? data.filter(p => p.status === 'approved') : []);
      setLoading(false);
    }
    if (user?.email) fetchProposals();
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

  if (loading) return <div className="p-8">Loading...</div>;
  if (proposals.length === 0) return <div className="p-8">No sponsored problem statements found.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><span role="img" aria-label="sponsor">🤝</span> Sponsored Problem Statements</h1>
      {proposals.map((p, idx) => (
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
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {proposalFields.map(field => (
                <div key={field.key}>
                  <b>{field.label}:</b> {p[field.key] || <span className="text-gray-400">-</span>}
                </div>
              ))}
            </div>
          )}
          {editIdx === idx ? null : (
            <Button size="sm" variant="outline" className="mb-2" onClick={() => startEdit(idx)}>Edit Proposal</Button>
          )}
          <div className="border-t pt-4 mt-4">
            <div className="mb-2 flex items-center gap-2"><b>Organizer Telegram:</b> {p.organizerTelegram ? <><a href={p.organizerTelegram.startsWith('http') ? p.organizerTelegram : `https://t.me/${p.organizerTelegram}`} target="_blank" rel="noopener noreferrer">{p.organizerTelegram}</a> <Button size="icon" variant="ghost" onClick={() => window.open(p.organizerTelegram.startsWith('http') ? p.organizerTelegram : `https://t.me/${p.organizerTelegram.replace('@','')}`, '_blank')}><Send className="w-4 h-4" /></Button></> : <span className="text-gray-400">Not provided</span>}</div>
            <div className="mb-2"><b>Message from Organizer:</b> {p.messageToSponsor || <span className="text-gray-400">No message yet</span>}</div>
            <Button size="sm" variant="outline" onClick={() => openMessageModal(p)}><MessageCircle className="w-4 h-4 mr-1" />Message Organizer</Button>
          </div>
        </div>
      ))}
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
    </div>
  );
} 