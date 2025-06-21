"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Search, Filter, Eye, Check, X, Clock, Briefcase, MoreHorizontal, Shuffle } from "lucide-react"

const organizerRequests = [
  {
    id: 1,
    name: "TechCorp Solutions",
    contactPerson: "Sarah Johnson",
    email: "sarah@techcorp.com",
    company: "TechCorp Inc.",
    eventTitle: "AI Innovation Summit 2024",
    eventType: "Conference",
    expectedParticipants: 500,
    budget: "$75,000",
    requestedDate: "2024-02-15",
    submittedAt: "2024-01-18",
    status: "Pending",
    priority: "High",
  },
  {
    id: 2,
    name: "StartupHub",
    contactPerson: "Mike Chen",
    email: "mike@startuphub.io",
    company: "StartupHub Inc.",
    eventTitle: "Fintech Hackathon 2024",
    eventType: "Hackathon",
    expectedParticipants: 200,
    budget: "$25,000",
    requestedDate: "2024-03-01",
    submittedAt: "2024-01-19",
    status: "Under Review",
    priority: "Medium",
  },
  {
    id: 3,
    name: "GreenTech Ventures",
    contactPerson: "Emily Davis",
    email: "emily@greentech.com",
    company: "GreenTech Ventures",
    eventTitle: "Sustainable Innovation Challenge",
    eventType: "Competition",
    expectedParticipants: 150,
    budget: "$30,000",
    requestedDate: "2024-04-10",
    submittedAt: "2024-01-20",
    status: "Approved",
    priority: "High",
  },
  {
    id: 4,
    name: "HealthTech Alliance",
    contactPerson: "Dr. Robert Kim",
    email: "robert@healthtech.org",
    company: "HealthTech Alliance",
    eventTitle: "Medical AI Workshop",
    eventType: "Workshop",
    expectedParticipants: 80,
    budget: "$15,000",
    requestedDate: "2024-02-28",
    submittedAt: "2024-01-21",
    status: "Rejected",
    priority: "Low",
  },
]

export function OrganizerRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredRequests = organizerRequests.filter((request) => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500 text-white border-green-500/30"
      case "Pending":
        return "bg-yellow-500 text-white border-yellow-500/30"
      case "Under Review":
        return "bg-blue-500 text-white border-blue-500/30"
      case "Rejected":
        return "bg-red-500 text-white border-red-500/30"
      default:
        return "bg-gray-500 text-white border-gray-500/30"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500 text-white border-red-500/30"
      case "Medium":
        return "bg-yellow-500 text-white border-yellow-500/30"
      case "Low":
        return "bg-green-500 text-white border-green-500/30"
      default:
        return "bg-gray-500 text-white border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Organizer Requests</h1>
        <div className="flex items-center space-x-2">
          <Badge className="bg-yellow-500 text-red-300 border-yellow-500/30">
            <Clock className="w-3 h-3 mr-1" />
            {organizerRequests.filter((r) => r.status === "Pending").length} Pending
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Total Requests</p>
                <p className="text-2xl font-bold text-black">{organizerRequests.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {organizerRequests.filter((r) => r.status === "Pending" || r.status === "Under Review").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-500">
                  {organizerRequests.filter((r) => r.status === "Approved").length}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black text-sm">Approval Rate</p>
                <p className="text-2xl font-bold text-pink-500">75%</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                %
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
              <Input
                placeholder="Search by organizer, event, or contact person..."
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
                {["All", "Pending", "Under Review", "Approved", "Rejected"].map((status) => (
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

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-black">Organizer Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/20">
                <TableHead className="text-black">Organizer</TableHead>
                <TableHead className="text-black">Event Details</TableHead>
                <TableHead className="text-black">Budget</TableHead>
                <TableHead className="text-black">Priority</TableHead>
                <TableHead className="text-black">Status</TableHead>
                <TableHead className="text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className="border-purple-500/20 hover:bg-white/5">
                  <TableCell>
                    <div>
                      <div className="text-black font-medium">{request.name}</div>
                      <div className="text-gray-600 text-sm">{request.contactPerson}</div>
                      <div className="text-gray-800 text-xs">{request.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-black font-medium">{request.eventTitle}</div>
                      <div className="text-gray-600 text-sm">{request.eventType}</div>
                      <div className="text-gray-800 text-xs">{request.expectedParticipants} participants</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-green-600 font-semibold">{request.budget}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(request.priority)}>{request.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-black">
                          <Shuffle className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                        <DropdownMenuItem className="text-white hover:bg-white/5">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {request.status === "Pending" && (
                          <>
                            <DropdownMenuItem className="text-green-400 hover:bg-green-500/10">
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
