"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Search, Filter, Inbox, Clock, CheckCircle, AlertCircle, Send, MoreHorizontal, Shuffle } from "lucide-react"

const supportTickets = [
  {
    id: 1,
    subject: "Unable to submit hackathon project",
    user: "Sarah Johnson",
    email: "sarah@email.com",
    priority: "High",
    status: "Open",
    category: "Technical",
    createdAt: "2024-01-21 14:30",
    lastReply: "2024-01-21 15:45",
    messages: 3,
    assignedTo: "Admin",
  },
  {
    id: 2,
    subject: "Payment not processed for premium plan",
    user: "Mike Chen",
    email: "mike@email.com",
    priority: "Critical",
    status: "In Progress",
    category: "Billing",
    createdAt: "2024-01-20 16:45",
    lastReply: "2024-01-21 09:30",
    messages: 5,
    assignedTo: "Support Team",
  },
  {
    id: 3,
    subject: "Request for hackathon certificate",
    user: "Emily Davis",
    email: "emily@email.com",
    priority: "Low",
    status: "Resolved",
    category: "General",
    createdAt: "2024-01-19 11:20",
    lastReply: "2024-01-20 14:15",
    messages: 2,
    assignedTo: "Admin",
  },
  {
    id: 4,
    subject: "Account verification issues",
    user: "Alex Rodriguez",
    email: "alex@email.com",
    priority: "Medium",
    status: "Open",
    category: "Account",
    createdAt: "2024-01-18 09:15",
    lastReply: "2024-01-18 09:15",
    messages: 1,
    assignedTo: "Unassigned",
  },
]

export function SupportInboxPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyMessage, setReplyMessage] = useState("")

  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-blue-500 text-white border-blue-500/30"
      case "In Progress":
        return "bg-yellow-500 text-white border-yellow-500/30"
      case "Resolved":
        return "bg-green-500 text-white border-green-500/30"
      case "Closed":
        return "bg-gray-500 text-white border-gray-500/30"
      default:
        return "bg-gray-500 text-white border-gray-500/30"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500 text-white border-red-500/30"
      case "High":
        return "bg-orange-500 text-white border-orange-500/30"
      case "Medium":
        return "bg-yellow-500 text-white border-yellow-500/30"
      case "Low":
        return "bg-green-500 text-white border-green-500/30"
      default:
        return "bg-gray-500 text-white border-gray-500/30"
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "Technical":
        return "bg-purple-500 text-white border-purple-500/30"
      case "Billing":
        return "bg-green-500 text-white border-green-500/30"
      case "Account":
        return "bg-blue-500 text-white border-blue-500/30"
      case "General":
        return "bg-gray-500 text-white border-gray-500/30"
      default:
        return "bg-gray-500 text-white border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Support Inbox</h1>
        <div className="flex items-center space-x-2">
          <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
            <Inbox className="w-3 h-3 mr-1" />
            {supportTickets.filter((t) => t.status === "Open").length} Open
          </Badge>
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            {supportTickets.filter((t) => t.status === "In Progress").length} In Progress
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Tickets</p>
                <p className="text-2xl font-bold text-black">{supportTickets.length}</p>
              </div>
              <Inbox className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Open Tickets</p>
                <p className="text-2xl font-bold text-blue-600">
                  {supportTickets.filter((t) => t.status === "Open").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Resolved Today</p>
                <p className="text-2xl font-bold text-green-500">
                  {supportTickets.filter((t) => t.status === "Resolved").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Avg Response Time</p>
                <p className="text-2xl font-bold text-pink-500">2.4h</p>
              </div>
              <Clock className="w-8 h-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search tickets by subject, user, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-purple-500/20 text-black placeholder-gray-600"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-purple-500/20 text-black hover:bg-white/5">
                      <Filter className="w-4 h-4 mr-2" />
                      Status: {statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                    {["All", "Open", "In Progress", "Resolved", "Closed"].map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className="text-white hover:bg-white/5"
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

          {/* Tickets */}
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className={` transition-all duration-300 cursor-pointer ${
                  selectedTicket === ticket.id ? "border-purple-500/60 bg-purple-500/5" : ""
                }`}
                onClick={() => setSelectedTicket(ticket.id)}
              >
                <CardContent className="p-4">
                  <div className="pt-4 flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-black font-medium mb-1">{ticket.subject}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{ticket.user}</span>
                        <span>•</span>
                        <span>{ticket.email}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-black">
                          <Shuffle className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                        <DropdownMenuItem className="text-white hover:bg-white/5">Assign to me</DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/5">Mark as resolved</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">Close ticket</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                      <Badge className={getCategoryColor(ticket.category)}>{ticket.category}</Badge>
                    </div>
                    <div className="text-xs text-gray-700">
                      {ticket.messages} messages • {ticket.lastReply}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="space-y-4">
          {selectedTicket ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-black text-lg">
                    {supportTickets.find((t) => t.id === selectedTicket)?.subject}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                        {supportTickets
                          .find((t) => t.id === selectedTicket)
                          ?.user.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-black text-sm font-medium">
                        {supportTickets.find((t) => t.id === selectedTicket)?.user}
                      </p>
                      <p className="text-gray-600 text-xs">
                        {supportTickets.find((t) => t.id === selectedTicket)?.email}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-purple-500/20">
                    <p className="text-black text-sm mb-2 font-bold">Original Message:</p>
                    <p className="text-black">
                      Hi, I'm having trouble submitting my hackathon project. Every time I try to upload my files, I get
                      an error message saying "Upload failed". I've tried different browsers and file formats but
                      nothing seems to work. Can you please help me resolve this issue?
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      {supportTickets.find((t) => t.id === selectedTicket)?.createdAt}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-blue-500/20">
                    <p className="text-black font-bold text-sm mb-2">Admin Response:</p>
                    <p className="text-black">
                      Thank you for reaching out. I can see the issue you're experiencing. This appears to be related to
                      file size limits. Please ensure your files are under 50MB each. If the issue persists, please try
                      clearing your browser cache and cookies.
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                      {supportTickets.find((t) => t.id === selectedTicket)?.lastReply}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-black text-lg">Reply</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="bg-white/5 border-purple-500/20 text-black placeholder-gray-500 resize-none"
                    rows={4}
                  />
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                    <Button variant="outline" className="border-green-500/20 bg-green-500  text-black hover:bg-green-700 hover:text-white">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <Inbox className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                <p className="text-black">Select a ticket to view details and reply</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
