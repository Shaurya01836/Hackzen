"use client"

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  MessageCircle,
  Edit3,
  Send,
  ExternalLink,
  Share2,
  Bookmark,
  Users,
  Calendar,
  Trophy,
  Clock,
  Pencil,
  Trash2,
  EyeOff
} from "lucide-react";
import { Button } from "../../../components/CommonUI/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card";
import { Badge } from "../../../components/CommonUI/badge";
import { Input } from "../../../components/CommonUI/input";
import { Separator } from "../../../components/CommonUI/separator";
import { Avatar, AvatarFallback } from "../../../components/DashboardUI/avatar";
import socket from '../../../utils/socket';

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

export default function RealSponseredDetail({ proposal, onBack, onProposalUpdated }) {
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ ...proposal });
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Real chat state
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editText, setEditText] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    if (!proposal?._id) return;
    setLoading(true);
    fetch(`/api/sponsor-proposals/${proposal._id}/chat`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
    socket.emit('joinProposalRoom', proposal._id);
    const handler = (msg) => {
      if (msg.proposal === proposal._id || msg.proposal?._id === proposal._id) {
        setMessages(prev => [...prev, msg]);
      }
    };
    const editHandler = (msg) => {
      setMessages(prev => prev.map(m => m._id === msg._id ? msg : m));
    };
    const deleteHandler = (info) => {
      if (info.forBoth) {
        setMessages(prev => prev.filter(m => m._id !== info._id));
      } else if (info.user === currentUser._id) {
        setMessages(prev => prev.map(m => m._id === info._id ? { ...m, deletedFor: [...(m.deletedFor || []), info.user] } : m));
      }
    };
    socket.on('chat message', handler);
    socket.on('chat message edited', editHandler);
    socket.on('chat message deleted', deleteHandler);
    return () => {
      socket.off('chat message', handler);
      socket.off('chat message edited', editHandler);
      socket.off('chat message deleted', deleteHandler);
    };
  }, [proposal._id, currentUser._id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    setSending(true);
    try {
      await fetch(`/api/sponsor-proposals/${proposal._id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: newMsg })
      });
      setNewMsg('');
    } finally {
      setSending(false);
    }
  };

  const handleEdit = (msg) => {
    setEditingMsgId(msg._id);
    setEditText(msg.message);
  };
  const saveEdit = async () => {
    await fetch(`/api/sponsor-proposals/${proposal._id}/chat/${editingMsgId}/edit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ message: editText })
    });
    setEditingMsgId(null);
    setEditText('');
  };
  const deleteForMe = async (msgId) => {
    await fetch(`/api/sponsor-proposals/${proposal._id}/chat/${msgId}/delete-for-me`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  };
  const deleteForBoth = async (msgId) => {
    await fetch(`/api/sponsor-proposals/${proposal._id}/chat/${msgId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  };

  if (!proposal) return null;
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

  const formatDate = dateString => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" className="mb-4 p-0 h-auto" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Problems
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {proposal.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <Badge
                  variant={proposal.status === "Active" ? "default" : "secondary"}
                >
                  {proposal.status}
                </Badge>
                {proposal.submissions && (
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {proposal.submissions} submissions
                  </span>
                )}
                {proposal.daysLeft && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {proposal.daysLeft} days left
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
                <Edit3 className="w-4 h-4 mr-1" /> Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Main grid: left scrollable, right sticky chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* Left Section - Problem Details (scrollable, all divs) */}
          <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[calc(100vh-60px)] pr-2">
            {/* Organizer Info */}
            <div className="bg-white rounded-lg border border-gray-200 px-6 py-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-gray-700" />
                <span className="text-xl font-bold text-gray-900">Organizer Information</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">{proposal.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{proposal.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Organization</label>
                  <p className="text-gray-900">{proposal.organization}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Website/LinkedIn</label>
                  <a href={proposal.website} className="text-blue-600 hover:underline flex items-center gap-1">View Profile <ExternalLink className="h-3 w-3" /></a>
                </div>
              </div>
            </div>

            {/* Problem Description */}
            <div className="bg-white rounded-lg border border-gray-200 px-6 py-6 mb-6">
              <div className="text-xl font-bold text-gray-900 mb-4">Problem Description</div>
              <p className="text-gray-700 leading-relaxed">{proposal.description}</p>
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-lg border border-gray-200 px-6 py-6 mb-6">
              <div className="text-xl font-bold text-gray-900 mb-4">Expected Deliverables</div>
              <div className="whitespace-pre-line text-gray-700">{proposal.deliverables}</div>
            </div>

            {/* Technical Details */}
            <div className="bg-white rounded-lg border border-gray-200 px-6 py-6 mb-6">
              <div className="text-xl font-bold text-gray-900 mb-4">Technical Requirements</div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Preferred Tech Stack</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {proposal.techStack
                    ? proposal.techStack.split(", ").map((tech, index) => (
                      <Badge key={index} variant="outline">{tech}</Badge>
                    ))
                    : <span className="text-gray-400">-</span>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Target Audience</label>
                <p className="text-gray-900">{proposal.targetAudience}</p>
              </div>
            </div>

            {/* Prize Information */}
            <div className="bg-white rounded-lg border border-gray-200 px-6 py-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-gray-700" />
                <span className="text-xl font-bold text-gray-900">Prize Information</span>
              </div>
              <div className="mb-2">
                <label className="text-sm font-medium text-gray-700">Prize Amount</label>
                <p className="text-gray-900">{proposal.prizeAmount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Prize Description</label>
                <p className="text-gray-900">{proposal.prizeDescription}</p>
              </div>
            </div>

            {/* Judging Preferences */}
            <div className="bg-white rounded-lg border border-gray-200 px-6 py-6 mb-6">
              <div className="text-xl font-bold text-gray-900 mb-4">Judging Preferences</div>
              <div className="mb-2">
                <label className="text-sm font-medium text-gray-700">Will you provide judges?</label>
                <p className="text-gray-900">{proposal.provideJudges}</p>
              </div>
              <div className="mb-2">
                <label className="text-sm font-medium text-gray-700">Judge Name</label>
                <p className="text-gray-900">{proposal.judgeName || '-'}</p>
              </div>
              <div className="mb-2">
                <label className="text-sm font-medium text-gray-700">Judge Email</label>
                <p className="text-gray-900">{proposal.judgeEmail || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Judge Role</label>
                <p className="text-gray-900">{proposal.judgeRole || '-'}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 px-6 py-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-gray-700" />
                <span className="text-xl font-bold text-gray-900">Timeline</span>
              </div>
              <div className="mb-2">
                <label className="text-sm font-medium text-gray-700">Preferred Start Date</label>
                <p className="text-gray-900">{formatDate(proposal.customStartDate)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Preferred Deadline</label>
                <p className="text-gray-900">{formatDate(proposal.customDeadline)}</p>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-lg border border-gray-200 px-6 py-6 mb-6">
              <div className="text-xl font-bold text-gray-900 mb-4">Additional Notes</div>
              <p className="text-gray-700 whitespace-pre-line">{proposal.notes || '-'}</p>
            </div>
          </div>

          {/* Right Section - Discussion sticky/static, plain HTML */}
          <div className="hidden lg:block sticky top-6 h-[calc(90vh-60px)]">
            {/* Discussion */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6 flex flex-col h-full min-h-[600px]">
              <div className="px-6 pt-6 pb-2 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-gray-700" />
                <span className="text-xl font-bold text-gray-900">Discussion</span>
              </div>
              <div className="flex-1 px-6 pb-2 overflow-y-auto space-y-4">
                {loading ? <div>Loading...</div> : (
                  messages.filter(m => !(m.deletedFor || []).includes(currentUser._id)).length === 0 ? <div className="text-gray-400 text-center">No messages yet.</div> :
                    messages.filter(m => !(m.deletedFor || []).includes(currentUser._id)).map((msg, i) => (
                      <div key={msg._id || i} className={`flex ${msg.sender && msg.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`} >
                        <div className={`rounded-lg px-3 py-2 max-w-xs relative ${msg.sender && msg.sender._id === currentUser._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
                          <div className="text-xs font-semibold mb-1">{msg.sender?.name || msg.sender?.email}</div>
                          {editingMsgId === msg._id ? (
                            <div className="flex gap-2 items-center">
                              <input className="flex-1 border rounded p-1 text-black" value={editText} onChange={e => setEditText(e.target.value)} />
                              <button className="text-green-600 font-bold" onClick={saveEdit}>Save</button>
                              <button className="text-gray-500 font-bold" onClick={() => setEditingMsgId(null)}>Cancel</button>
                            </div>
                          ) : (
                            <>
                              <div>{msg.message}</div>
                              {msg.edited && <span className="text-xs italic ml-2">(edited)</span>}
                            </>
                          )}
                          <div className="text-[10px] text-right mt-1 opacity-70">{new Date(msg.sentAt || msg.createdAt).toLocaleString()}</div>
                          <div className="absolute top-1 right-1 flex gap-1">
                            {msg.sender && msg.sender._id === currentUser._id && editingMsgId !== msg._id && (
                              <button title="Edit" onClick={() => handleEdit(msg)}><Pencil className="w-3 h-3" /></button>
                            )}
                            <button title="Delete for me" onClick={() => deleteForMe(msg._id)}><EyeOff className="w-3 h-3" /></button>
                            {msg.sender && msg.sender._id === currentUser._id && (
                              <button title="Delete for both" onClick={() => deleteForBoth(msg._id)}><Trash2 className="w-3 h-3" /></button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <Separator className="my-2" />
              <div className="flex gap-2 px-6 pb-4">
                <input
                  className="flex-1 border rounded p-2 text-sm"
                  placeholder="Ask a question..."
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                  disabled={sending}
                />
                <button
                  className="bg-gray-800 hover:bg-gray-900 text-white rounded p-2 flex items-center justify-center"
                  onClick={sendMessage}
                  disabled={sending || !newMsg.trim()}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
    
          </div>
        </div>

        {/* Edit Modal */}
        {showEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowEdit(false)}>&times;</button>
              <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2"><Edit3 className="w-5 h-5" />Edit Proposal</h3>
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
      </div>
    </div>
  );
}
