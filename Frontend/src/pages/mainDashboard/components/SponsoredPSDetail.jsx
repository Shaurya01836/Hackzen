import React, { useState } from 'react';
import { Button } from '../../../components/CommonUI/button';
import { BadgeCheck, Mail, Edit, ArrowLeft, MessageCircle, Info, User } from 'lucide-react';
import ChatModal from './ChatModal';

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

export default function SponsoredPSDetail({ proposal, onBack, onProposalUpdated }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [editForm, setEditForm] = useState({ ...proposal });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  if (!proposal) return null;
  const hackathonName = proposal.hackathon?.title || 'Unknown';
  const problemStatements = proposal.hackathon?.problemStatements || [];
  const statusColor = proposal.status === 'approved' ? 'bg-green-100 text-green-700' : proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';

  async function handleSaveEdit() {
    setSaving(true);
    setSaveStatus(null);
    try {
      const payload = { ...editForm };
      delete payload._id;
      delete payload.status;
      delete payload.messageToSponsor;
      delete payload.organizerTelegram;
      const res = await fetch(`/api/sponsor-proposals/${proposal._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update proposal');
      setSaveStatus('success');
      setShowEdit(false);
      if (onProposalUpdated) onProposalUpdated();
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 min-w-full bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 md:min-h-screen">
      <Button variant="ghost" size="sm" className="absolute top-4 left-4 flex items-center gap-1" onClick={onBack}>
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>
      <div className="flex items-center gap-3 mb-4">
        <BadgeCheck className="w-8 h-8 text-blue-500" />
        <h2 className="text-3xl font-bold">{proposal.title}</h2>
        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${statusColor}`}>{proposal.status}</span>
      </div>
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-gray-700"><Info className="w-4 h-4" /> <b>Hackathon:</b> {hackathonName}</div>
        <div className="flex items-center gap-2 text-gray-700"><User className="w-4 h-4" /> <b>Sponsor:</b> {proposal.name}</div>
        <div className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4" /> <b>Email:</b> {proposal.email}</div>
      </div>
      <div className="mb-6">
        <div className="font-semibold text-gray-700 mb-1">Problem Statements:</div>
        <ul className="list-disc list-inside ml-4">
          {problemStatements.map((ps, i) => (
            <li key={i} className="text-gray-800">{typeof ps === 'string' ? ps : ps.statement}</li>
          ))}
        </ul>
      </div>
      <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {proposalFields.map(field => (
            <React.Fragment key={field.key}>
              <dt className="font-semibold text-gray-700">{field.label}:</dt>
              <dd className="text-gray-900 break-words">{proposal[field.key] || <span className="text-gray-400">-</span>}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
      <div className="flex gap-4 mb-6">
        <Button variant="outline" size="lg" className="flex items-center gap-2" onClick={() => setShowEdit(true)}><Edit className="w-4 h-4" /> Edit</Button>
        <Button variant="default" size="lg" className="flex items-center gap-2" onClick={() => setShowChat(true)}><MessageCircle className="w-4 h-4" /> Chat</Button>
      </div>
      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowEdit(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2"><Edit className="w-5 h-5" />Edit Proposal</h3>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
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
              <div className="flex gap-2 mt-4">
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
                {saveStatus === 'success' && <span className="text-green-600 ml-2">Saved!</span>}
                {saveStatus === 'error' && <span className="text-red-600 ml-2">Failed to save.</span>}
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Chat Modal */}
      {showChat && (
        <ChatModal open={showChat} onClose={() => setShowChat(false)} proposalId={proposal._id} currentUser={{ email: proposal.email, name: proposal.name }} />
      )}
    </div>
  );
} 