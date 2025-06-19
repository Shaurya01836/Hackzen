// 🚨 Updated Announcements component for user dashboard
"use client"

import { useEffect, useState } from "react"
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

export function Announcements({ onBack }) {
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:3000/api/announcements", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setAnnouncements(data.announcements)
      } catch (err) {
        console.error("Error fetching announcements", err)
      }
    }
    fetchAnnouncements()
  }, [])

  const getPriorityColor = type => {
    switch (type) {
      case "alert": return "bg-red-500"
      case "reminder": return "bg-yellow-500"
      case "general": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="default"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>
            <p className="text-sm text-gray-500">Latest messages from the team</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {announcements.length > 0 ? (
          announcements.map((a) => (
            <Card key={a._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{a.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {a.audience} • {new Date(a.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge className={`${getPriorityColor(a.type)} text-white`}>
                    {a.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-2 space-y-4">
                <p className="text-sm text-gray-600">{a.message}</p>
                <div className="text-xs text-gray-400">Posted by: {a.postedBy?.email || "Admin"}</div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-600">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-400" />
              <p>No announcements yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}