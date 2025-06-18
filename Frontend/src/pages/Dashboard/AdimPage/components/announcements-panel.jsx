"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/AdminCard"
import { Button } from "./ui/AdminButton"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Send, Eye, Megaphone, Clock } from "lucide-react"

const recentAnnouncements = [
  {
    id: 1,
    title: "New Hackathon Registration Open",
    message: "Registration for the AI Innovation Challenge 2024 is now open. Join us for an exciting 3-day event!",
    audience: "All Users",
    sentAt: "2024-01-18 10:30 AM",
    status: "Sent",
  },
  {
    id: 2,
    title: "Platform Maintenance Notice",
    message: "Scheduled maintenance will occur on January 25th from 2:00 AM to 4:00 AM UTC.",
    audience: "All Users",
    sentAt: "2024-01-17 3:45 PM",
    status: "Sent",
  },
  {
    id: 3,
    title: "Mentor Training Session",
    message: "Join our mentor training session this Friday to learn about best practices for guiding participants.",
    audience: "Mentors",
    sentAt: "2024-01-16 9:15 AM",
    status: "Sent",
  },
]

export function AnnouncementsPanel() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const handleSend = () => {
    // Handle sending announcement
    console.log("Sending announcement:", { title, message, audience })
    // Reset form
    setTitle("")
    setMessage("")
    setAudience("")
    setShowPreview(false)
  }

  const getAudienceColor = (audience) => {
    switch (audience) {
      case "All Users":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "Organizers":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "Participants":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "Mentors":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Announcements</h1>
        <div className="flex items-center text-purple-400">
          <Megaphone className="w-5 h-5 mr-2" />
          <span>Broadcast Center</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Announcement */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Send className="w-5 h-5 mr-2 text-purple-400" />
              Send New Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="Enter announcement title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/5 border-purple-500/20 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Message</label>
              <Textarea
                placeholder="Write your announcement message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="bg-white/5 border-purple-500/20 text-white placeholder-gray-400 resize-none"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Audience</label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger className="bg-white/5 border-purple-500/20 text-white">
                  <SelectValue placeholder="Select target audience" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                  <SelectItem value="all" className="text-white hover:bg-white/5">
                    All Users
                  </SelectItem>
                  <SelectItem value="organizers" className="text-white hover:bg-white/5">
                    Organizers
                  </SelectItem>
                  <SelectItem value="participants" className="text-white hover:bg-white/5">
                    Participants
                  </SelectItem>
                  <SelectItem value="mentors" className="text-white hover:bg-white/5">
                    Mentors
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex-1 border-purple-500/20 text-white hover:bg-purple-500/10"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSend}
                disabled={!title || !message || !audience}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Now
              </Button>
            </div>

            {/* Preview */}
            {showPreview && title && message && (
              <Card className="bg-purple-500/10 border-purple-500/30 mt-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold">{title}</h3>
                    <Badge className={getAudienceColor(audience)}>{audience}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">{message}</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-400" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-4 bg-white/5 rounded-lg border border-purple-500/20">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium text-sm">{announcement.title}</h4>
                    <Badge className={getAudienceColor(announcement.audience)}>{announcement.audience}</Badge>
                  </div>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">{announcement.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{announcement.sentAt}</span>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                      {announcement.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
