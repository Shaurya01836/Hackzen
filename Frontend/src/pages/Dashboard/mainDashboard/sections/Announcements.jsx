"use client"
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Users,
  Calendar,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../AdimPage/components/ui/card"
import { Button } from "../../AdimPage/components/ui/button"
import { Badge } from "../../AdimPage/components/ui/badge"
import { Textarea } from "../../AdimPage/components/ui/textarea"
import { Input } from "../../AdimPage/components/ui/input"
import { Label } from "../../AdimPage/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../AdimPage/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../AdimPage/components/ui/tabs"

const announcements = [
  {
    id: 1,
    title: "AI Innovation Challenge - Final Week Reminder",
    content:
      "This is a reminder that the AI Innovation Challenge will end in one week. Make sure to submit your projects before the deadline on December 22nd, 2024.",
    hackathon: "AI Innovation Challenge",
    audience: "All Participants",
    sentDate: "Dec 15, 2024",
    sentTime: "10:30 AM",
    status: "Sent",
    recipients: 156,
    readCount: 142,
    priority: "High"
  },
  {
    id: 2,
    title: "New Judging Criteria Released",
    content:
      "We've updated the judging criteria for all ongoing hackathons. Please review the new guidelines in your participant dashboard.",
    hackathon: "All Events",
    audience: "All Participants",
    sentDate: "Dec 12, 2024",
    sentTime: "2:15 PM",
    status: "Sent",
    recipients: 479,
    readCount: 398,
    priority: "Medium"
  },
  {
    id: 3,
    title: "Web3 Builder Fest - Winners Announcement",
    content:
      "Congratulations to all participants! The winners of Web3 Builder Fest have been announced. Check your dashboard for results and prize distribution details.",
    hackathon: "Web3 Builder Fest",
    audience: "Event Participants",
    sentDate: "Nov 28, 2024",
    sentTime: "4:45 PM",
    status: "Sent",
    recipients: 89,
    readCount: 89,
    priority: "High"
  },
  {
    id: 4,
    title: "Upcoming Workshop: Advanced React Patterns",
    content:
      "Join us for an exclusive workshop on Advanced React Patterns. This session will cover hooks, context, and performance optimization techniques.",
    hackathon: "All Events",
    audience: "All Participants",
    sentDate: "",
    sentTime: "",
    status: "Draft",
    recipients: 0,
    readCount: 0,
    priority: "Low"
  }
]

export function Announcements({ onBack }) {
  const sentAnnouncements = announcements.filter(a => a.status === "Sent")
  const draftAnnouncements = announcements.filter(a => a.status === "Draft")

  const getPriorityColor = priority => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const renderAnnouncementCard = announcement => (
    <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{announcement.title}</CardTitle>
            <CardDescription className="mt-1">
              {announcement.hackathon} • {announcement.audience}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${getPriorityColor(
                announcement.priority
              )} text-white`}
            >
              {announcement.priority}
            </Badge>
            <Badge
              variant={announcement.status === "Sent" ? "default" : "secondary"}
            >
              {announcement.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <p className="text-sm text-gray-600">{announcement.content}</p>

        {announcement.status === "Sent" && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                {announcement.sentDate} at {announcement.sentTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>{announcement.recipients} recipients</span>
            </div>
          </div>
        )}

        {announcement.status === "Sent" && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                Read Rate
              </span>
              <span className="text-sm text-blue-600">
                {announcement.readCount}/{announcement.recipients} (
                {Math.round(
                  (announcement.readCount / announcement.recipients) * 100
                )}
                %)
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            View Details
          </Button>
          {announcement.status === "Draft" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Edit
              </Button>
              <Button
                size="sm"
                className="bg-purple-500 hover:bg-purple-600 flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                Send Now
              </Button>
            </>
          )}
          {announcement.status === "Sent" && (
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3" />
              View Responses
            </Button>
          )}
          {announcement.status === "Draft" && (
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
            <p className="text-sm text-gray-500">
              Communicate with participants across your events
            </p>
          </div>
        </div>
        <Button className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600">
          <MessageSquare className="w-4 h-4" />
          Create Announcement
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcements List */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="sent" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sent">
                Sent ({sentAnnouncements.length})
              </TabsTrigger>
              <TabsTrigger value="drafts">
                Drafts ({draftAnnouncements.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sent" className="space-y-4">
              {sentAnnouncements.length > 0 ? (
                <div className="space-y-4">
                  {sentAnnouncements.map(renderAnnouncementCard)}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Sent Announcements
                    </h3>
                    <p className="text-gray-500 text-center">
                      You haven't sent any announcements yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="drafts" className="space-y-4">
              {draftAnnouncements.length > 0 ? (
                <div className="space-y-4">
                  {draftAnnouncements.map(renderAnnouncementCard)}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Edit className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Draft Announcements
                    </h3>
                    <p className="text-gray-500 text-center">
                      All your announcements have been sent.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Create Announcement Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Announcement</CardTitle>
              <CardDescription>Send a message to participants</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Announcement title..." />
              </div>

              <div>
                <Label htmlFor="hackathon">Target Event</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hackathon" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black shadow-lg rounded-md border">
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="ai-challenge">
                      AI Innovation Challenge
                    </SelectItem>
                    <SelectItem value="web3-fest">Web3 Builder Fest</SelectItem>
                    <SelectItem value="mobile-marathon">
                      Mobile App Marathon
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black shadow-lg rounded-md border">
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your announcement..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                  <Send className="w-3 h-3 mr-1" />
                  Send Now
                </Button>
                <Button size="sm" variant="outline">
                  Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Announcement Stats</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Sent</span>
                <span className="font-medium">{sentAnnouncements.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Draft Messages</span>
                <span className="font-medium">{draftAnnouncements.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Recipients</span>
                <span className="font-medium">
                  {sentAnnouncements.reduce((sum, a) => sum + a.recipients, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Read Rate</span>
                <span className="font-medium">
                  {sentAnnouncements.length > 0
                    ? Math.round(
                        sentAnnouncements.reduce(
                          (sum, a) => sum + (a.readCount / a.recipients) * 100,
                          0
                        ) / sentAnnouncements.length
                      )
                    : 0}
                  %
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
