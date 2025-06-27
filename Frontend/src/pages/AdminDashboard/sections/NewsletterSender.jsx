import React, { useState } from "react";

export default function NewsletterSender() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  const sendNewsletter = async () => {
    if (!subject || !content) {
      setStatus("❗ Subject and content required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/newsletter/send-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });

      const data = await res.json();
      setStatus(data.message);
    } catch (err) {
      setStatus("❌ Error sending newsletter.");
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Send Newsletter</h2>

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full border border-gray-400 p-2 rounded mb-3"
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-gray-400 p-2 rounded mb-3"
        rows={8}
      />

      <button
        onClick={sendNewsletter}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Send Newsletter
      </button>

      {status && <p className="mt-4 text-sm text-indigo-700 font-medium">{status}</p>}
    </div>
  );
}


