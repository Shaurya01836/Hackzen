"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Users,
  Calendar,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import { Textarea } from "../../../components/CommonUI/textarea";
import { Input } from "../../../components/CommonUI/input";
import { Label } from "../../../components/CommonUI/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/CommonUI/select";

export function Announcements({ onBack }) {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("");
  const [priority, setPriority] = useState("");
  const [hackathon, setHackathon] = useState("");

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAnnouncements(data.announcements);
    } catch (err) {
      console.error("Error fetching announcements", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleQuickSend = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/announcements/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          message,
          audience,
          hackathonId: hackathon === "all" ? undefined : hackathon,
          type: priority || "general",
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to send announcement");
      alert("Announcement sent!");
      setTitle("");
      setMessage("");
      setAudience("");
      setPriority("");
      setHackathon("");
      fetchAnnouncements();
    } catch (err) {
      alert(err.message);
    }
  };

  const sent = announcements;

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              if (onBack) onBack();
              navigate("/dashboard");
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
            <p className="text-sm text-gray-500">
              Send announcements and track performance
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcement Cards */}
        <div className="lg:col-span-2 space-y-4">
          {sent.length > 0 ? (
            sent.map((a) => (
              <Card key={a._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{a.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {a.audience} •{" "}
                        {new Date(a.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge
                      className={`text-white ${
                        a.type === "alert"
                          ? "bg-red-500"
                          : a.type === "reminder"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {a.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{a.message}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No announcements yet.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Create */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Announcement</CardTitle>
              <CardDescription>Send a message instantly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label>Hackathon</Label>
                <Select value={hackathon} onValueChange={setHackathon}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hackathon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>{" "}
                    {/* ✅ fixed */}
                    {/* Dynamically inject more <SelectItem />s if needed */}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alert">High (Alert)</SelectItem>
                    <SelectItem value="reminder">Medium (Reminder)</SelectItem>
                    <SelectItem value="general">Low (General)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="organizers">Organizers</SelectItem>
                    <SelectItem value="participants">Participants</SelectItem>
                    <SelectItem value="mentors">Mentors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <Button
                onClick={handleQuickSend}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Send className="w-4 h-4 mr-1" /> Send Now
              </Button>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Announcement Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Total Announcements</span>
                <span className="font-medium">{sent.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Sent</span>
                <span className="font-medium">
                  {sent[0] ? new Date(sent[0].createdAt).toLocaleString() : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
