"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { Button } from "../../../components/CommonUI/button";
import { Input } from "../../../components/CommonUI/input";
import { Textarea } from "../../../components/CommonUI/textarea";
import { Badge } from "../../../components/CommonUI/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/CommonUI/select";
import { Send, Eye, Megaphone, Clock } from "lucide-react";

export function AnnouncementsPanel() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  const handleSend = async () => {
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
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send");

      alert("Announcement sent successfully!");
      setTitle("");
      setMessage("");
      setAudience("");
      setShowPreview(false);
      fetchAnnouncements(); // refresh recent
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAnnouncements(data.announcements);
    } catch (err) {
      console.error("Failed to fetch announcements", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const getAudienceVariant = (aud) => {
    switch (aud) {
      case "all":
        return "outline";
      case "organizers":
        return "secondary";
      case "participants":
        return "outline";
      case "mentors":
        return "secondary";
      default:
        return "dark";
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Announcements</h1>
        <div className="flex items-center text-black text-xl font-bold">
          <Megaphone className="w-5 h-5 mr-2" />
          <span>Broadcast Center</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Static Send Announcement Form */}
        <div className="w-full lg:w-1/2 flex-shrink-0">
          <Card className="rounded-xl shadow-md bg-white/80 border border-purple-100">
            <CardHeader>
              <CardTitle className="text-black flex items-center text-lg font-semibold">
                <Send className="w-5 h-5 mr-2 text-purple-700" />
                Send New Announcement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Title
                </label>
                <Input
                  placeholder="Enter announcement title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/5 border-purple-500/20 text-black placeholder-gray-600"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Message
                </label>
                <Textarea
                  placeholder="Write your announcement message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="bg-white/5 border-purple-500/20 text-black placeholder-gray-600 resize-none"
                />
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">
                  Audience
                </label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger className="bg-white/5 border-purple-500/20 text-black">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                    <SelectItem
                      value="all"
                      className="text-white hover:bg-white/5"
                    >
                      All Users
                    </SelectItem>
                    <SelectItem
                      value="organizers"
                      className="text-white hover:bg-white/5"
                    >
                      Organizers
                    </SelectItem>
                    <SelectItem
                      value="participants"
                      className="text-white hover:bg-white/5"
                    >
                      Participants
                    </SelectItem>
                    <SelectItem
                      value="mentors"
                      className="text-white hover:bg-white/5"
                    >
                      Mentors
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex-1 border-purple-500 text-black hover:bg-purple-600 hover:text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={!title || !message || !audience}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Now
                </Button>
              </div>

              {showPreview && title && message && (
                <Card className="rounded-xl shadow bg-white/80 border border-purple-100 mt-4">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-gray-600 font-semibold">{title}</h3>
                      <Badge className={getAudienceVariant(audience)}>
                        {audience}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-sm">{message}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Fixed Height Recent Announcements with Scroll */}
        <div className="w-full lg:w-1/2 flex-grow">
          <Card className="rounded-xl shadow-md bg-white/80 border border-purple-100">
            <CardHeader>
              <CardTitle className="text-black flex items-center text-lg font-semibold">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Recent Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              {/* Fixed height container with scroll */}
              <div className="max-h-[330px] overflow-y-auto pr-2 -mr-2 scrollbar-hide">
                <div className="space-y-4">
                  {announcements.length > 0 ? (
                    announcements.map((announcement) => (
                      <div
                        key={announcement._id}
                        className="p-4 bg-white/5 rounded-lg border border-purple-500/20 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-black font-medium text-sm leading-tight">
                            {announcement.title}
                          </h4>
                          <Badge
                            variant={getAudienceVariant(announcement.audience)}
                            className="flex-shrink-0 ml-2"
                          >
                            {announcement.audience}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-xs mb-3 line-clamp-3 leading-relaxed">
                          {announcement.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 text-xs">
                            {new Date(announcement.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-8">No announcements yet.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
