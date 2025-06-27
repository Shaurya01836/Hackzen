import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../../../components/CommonUI/card";
import { Input } from "../../../components/CommonUI/input";
import { Button } from "../../../components/CommonUI/button";

export default function NewsletterSender() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const sendNewsletter = async () => {
    if (!subject || !content) {
      setStatus("❗ Subject and content required.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:3000/api/newsletter/send-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content }),
      });

      const data = await res.json();
      setStatus(data.message || "✅ Newsletter sent successfully!");
    } catch (err) {
      setStatus("❌ Error sending newsletter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>📩 Send Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700">Subject</label>
              <Input
                placeholder="Enter newsletter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Content</label>
              <textarea
                placeholder="Write the newsletter content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full mt-2 bg-transparent rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 ring-1 ring-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>

            <Button
              variant="blue"
              size="lg"
              onClick={sendNewsletter}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                "🚀 Send Newsletter"
              )}
            </Button>

            {status && (
              <p className="text-sm text-center text-indigo-700 font-medium animate-fadeIn">
                {status}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
