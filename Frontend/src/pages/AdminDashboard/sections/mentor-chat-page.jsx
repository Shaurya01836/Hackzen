"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card"
import { Button } from "../../../components/CommonUI/button"
import { Badge } from "../../../components/CommonUI/badge"
import { Input } from "../../../components/CommonUI/input"
import { Avatar, AvatarFallback } from "../../../components/DashboardUI/avatar"
import { MessageSquare, Search, Clock, Users, TrendingUp } from "lucide-react"

const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    expertise: "AI/ML",
    status: "Online",
    activeChats: 3,
    totalSessions: 45,
    rating: 4.9,
    lastActive: "2 min ago",
  },
  {
    id: 2,
    name: "John Martinez",
    expertise: "Full Stack",
    status: "Busy",
    activeChats: 5,
    totalSessions: 67,
    rating: 4.7,
    lastActive: "5 min ago",
  },
  {
    id: 3,
    name: "Lisa Chen",
    expertise: "UI/UX Design",
    status: "Away",
    activeChats: 1,
    totalSessions: 32,
    rating: 4.8,
    lastActive: "15 min ago",
  },
  {
    id: 4,
    name: "Michael Brown",
    expertise: "Blockchain",
    status: "Online",
    activeChats: 2,
    totalSessions: 28,
    rating: 4.6,
    lastActive: "1 min ago",
  },
]

const recentChats = [
  {
    id: 1,
    participant: "Alex Johnson",
    mentor: "Dr. Sarah Wilson",
    topic: "Neural Network Architecture",
    lastMessage: "Thanks for the explanation about backpropagation!",
    timestamp: "2 min ago",
    status: "Active",
  },
  {
    id: 2,
    participant: "Emma Davis",
    mentor: "John Martinez",
    topic: "React State Management",
    lastMessage: "Could you help me with Redux implementation?",
    timestamp: "5 min ago",
    status: "Active",
  },
  {
    id: 3,
    participant: "Ryan Kim",
    mentor: "Lisa Chen",
    topic: "User Interface Design",
    lastMessage: "The wireframes look great, let's discuss colors",
    timestamp: "12 min ago",
    status: "Resolved",
  },
]

export function MentorChatPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status) => {
    switch (status) {
      case "Online":
        return "bg-green-500 text-white border-green-500/30"
      case "Busy":
        return "bg-yellow-500 text-white border-yellow-500/30"
      case "Away":
        return "bg-gray-500 text-white border-gray-500/30"
      default:
        return "bg-gray-500 text-white border-gray-500/30"
    }
  }

  const getChatStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-blue-500 text-white border-blue-500/30"
      case "Resolved":
        return "bg-green-500 text-white border-green-500/30"
      default:
        return "bg-gray-500 text-white border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Mentor & Chat Management</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-green-400">
            <div className="w-2 h-2 bg-green-800 rounded-full animate-pulse mr-2" />
            <span className="text-sm font-bold">Live Monitoring</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 text-sm">Active Mentors</p>
                <p className="text-2xl font-bold text-gray-600">12</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 text-sm">Active Chats</p>
                <p className="text-2xl font-bold text-gray-600">28</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 text-sm">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-600">3.2m</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 text-sm">Satisfaction Rate</p>
                <p className="text-2xl font-bold text-gray-600">94%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentors List */}
        <Card>
          <CardHeader>
            <CardTitle className="pb-5 text-black flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-700" />
              Active Mentors
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
              <Input
                placeholder="Search mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-purple-500/20 text-black placeholder-gray-600"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="p-4 bg-white/5 rounded-lg border border-purple-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-black font-medium">{mentor.name}</h3>
                      <p className="text-gray-500 text-sm">{mentor.expertise}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(mentor.status)}>{mentor.status}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-black">Active Chats</p>
                    <p className="text-white font-semibold">{mentor.activeChats}</p>
                  </div>
                  <div>
                    <p className="text-black">Total Sessions</p>
                    <p className="text-white font-semibold">{mentor.totalSessions}</p>
                  </div>
                  <div>
                    <p className="text-black">Rating</p>
                    <p className="text-yellow-500 font-semibold">⭐ {mentor.rating}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-xs mt-2">Last active: {mentor.lastActive}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Chat Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-700" />
              Recent Chat Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentChats.map((chat) => (
              <div key={chat.id} className="p-4 bg-white/5 rounded-lg border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-black font-medium text-sm">{chat.participant}</h4>
                    <span className="text-gray-800 text-xs">→</span>
                    <span className="text-black text-sm">{chat.mentor}</span>
                  </div>
                  <Badge className={getChatStatusColor(chat.status)}>{chat.status}</Badge>
                </div>
                <p className="text-gray-800 text-sm font-medium mb-2">{chat.topic}</p>
                <p className="text-gray-700 text-sm mb-2 line-clamp-2">{chat.lastMessage}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-xs">{chat.timestamp}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    View Chat
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
