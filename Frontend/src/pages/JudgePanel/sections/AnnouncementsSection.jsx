"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card"
import { Bell } from "lucide-react"

const announcements = [
  {
    id: 1,
    title: "Submission deadline extended by 2 hours",
    time: "10 minutes ago",
    body:
      "Due to server maintenance, the final submission deadline has been extended until 11:59 PM."
  },
  {
    id: 2,
    title: "Keynote starting in Auditorium A",
    time: "1 hour ago",
    body: "Join us for an inspiring talk on AI ethics by Dr. Ada Lovelace."
  }
]

export function AnnouncementsSection() {
  return (
    <div className="animate-in fade-in-50 duration-500 space-y-6">
      {announcements.map(a => (
        <Card key={a.id} className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              {a.title}
            </CardTitle>
            <span className="text-sm text-gray-500">{a.time}</span>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{a.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
