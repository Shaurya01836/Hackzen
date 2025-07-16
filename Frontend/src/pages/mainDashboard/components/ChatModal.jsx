import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/CommonUI/button';
import socket from '../../../utils/socket';
import { Pencil, Trash2, EyeOff } from 'lucide-react';

export default function ChatModal({ open, onClose, proposalId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (!open || !proposalId) return;
    setLoading(true);
    fetch(`/api/sponsor-proposals/${proposalId}/chat`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
    socket.emit('joinProposalRoom', proposalId);
    const handler = (msg) => {
      if (msg.proposal === proposalId || msg.proposal?._id === proposalId) {
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
  }, [open, proposalId, currentUser._id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    setSending(true);
    try {
      await fetch(`/api/sponsor-proposals/${proposalId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: newMsg })
      });
      setNewMsg(''); // Only clear input, do NOT update messages state here
    } finally {
      setSending(false);
    }
  };

  const handleEdit = (msg) => {
    setEditingMsgId(msg._id);
    setEditText(msg.message);
  };
  const saveEdit = async () => {
    await fetch(`/api/sponsor-proposals/${proposalId}/chat/${editingMsgId}/edit`, {
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
    await fetch(`/api/sponsor-proposals/${proposalId}/chat/${msgId}/delete-for-me`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  };
  const deleteForBoth = async (msgId) => {
    await fetch(`/api/sponsor-proposals/${proposalId}/chat/${msgId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative flex flex-col" style={{ maxHeight: '90vh' }}>
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4 text-blue-700">Chat</h2>
        <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 border rounded p-2" style={{ minHeight: 200, maxHeight: 350 }}>
          {loading ? <div>Loading...</div> : (
            messages.filter(m => !(m.deletedFor || []).includes(currentUser._id)).length === 0 ? <div className="text-gray-400 text-center">No messages yet.</div> :
              messages.filter(m => !(m.deletedFor || []).includes(currentUser._id)).map((msg, i) => (
                <div key={msg._id || i} className={`mb-2 flex ${msg.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`} >
                  <div className={`rounded-lg px-3 py-2 max-w-xs relative ${msg.sender._id === currentUser._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
                    <div className="text-xs font-semibold mb-1">{msg.sender.name || msg.sender.email}</div>
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
                      {msg.sender._id === currentUser._id && editingMsgId !== msg._id && (
                        <button title="Edit" onClick={() => handleEdit(msg)}><Pencil className="w-3 h-3" /></button>
                      )}
                      <button title="Delete for me" onClick={() => deleteForMe(msg._id)}><EyeOff className="w-3 h-3" /></button>
                      {msg.sender._id === currentUser._id && (
                        <button title="Delete for both" onClick={() => deleteForBoth(msg._id)}><Trash2 className="w-3 h-3" /></button>
                      )}
                    </div>
                  </div>
                </div>
              ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded p-2"
            type="text"
            placeholder="Type a message..."
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            disabled={sending}
          />
          <Button onClick={sendMessage} disabled={sending || !newMsg.trim()}>Send</Button>
        </div>
      </div>
    </div>
  );
} 