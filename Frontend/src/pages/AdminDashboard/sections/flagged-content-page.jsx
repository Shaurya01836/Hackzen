"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card"
import { Button } from "../../../components/CommonUI/button"
import { Badge } from "../../../components/CommonUI/badge"
import { Input } from "../../../components/CommonUI/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/AdminUI/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/AdminUI/dropdown-menu"
import { Search, Filter, Eye, Ban, Check, AlertTriangle, MoreHorizontal, Flag, Shuffle } from "lucide-react"

const flaggedContent = [
  {
    id: 1,
    type: "Comment",
    content: "This is inappropriate content that violates community guidelines...",
    reportedBy: "User123",
    reportedUser: "BadActor1",
    reason: "Harassment",
    severity: "High",
    reportedAt: "2024-01-21 14:30",
    status: "Under Review",
    hackathon: "AI Innovation Challenge 2024",
  },
  {
    id: 2,
    type: "Submission",
    content: "Project contains plagiarized code from GitHub repository...",
    reportedBy: "Mentor456",
    reportedUser: "CopyPaster",
    reason: "Plagiarism",
    severity: "Critical",
    reportedAt: "2024-01-20 16:45",
    status: "Confirmed",
    hackathon: "FinTech Revolution",
  },
  {
    id: 3,
    type: "Profile",
    content: "User profile contains offensive imagery and inappropriate bio...",
    reportedBy: "Admin",
    reportedUser: "OffensiveUser",
    reason: "Inappropriate Content",
    severity: "Medium",
    reportedAt: "2024-01-19 11:20",
    status: "Resolved",
    hackathon: "N/A",
  },
  {
    id: 4,
    type: "Chat Message",
    content: "Spam messages being sent to multiple participants...",
    reportedBy: "Participant789",
    reportedUser: "SpamBot",
    reason: "Spam",
    severity: "Low",
    reportedAt: "2024-01-18 09:15",
    status: "Under Review",
    hackathon: "Healthcare Tech Challenge",
  },
]

export function FlaggedContentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [severityFilter, setSeverityFilter] = useState("All")

  const filteredContent = flaggedContent.filter((item) => {
    const matchesSearch =
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || item.status === statusFilter
    const matchesSeverity = severityFilter === "All" || item.severity === severityFilter
    return matchesSearch && matchesStatus && matchesSeverity
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Under Review":
        return "bg-yellow-500 text-white border-yellow-500/30"
      case "Confirmed":
        return "bg-red-500 text-white border-red-500/30"
      case "Resolved":
        return "bg-green-500 text-white border-green-500/30"
      case "Dismissed":
        return "bg-orange-500 text-white border-gray-500/30"
      default:
        return "bg-gray-500 text-white border-gray-500/30"
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500 text-white border-red-500/30"
      case "High":
        return "bg-orange-500 text-white border-orange-500/30"
      case "Medium":
        return "bg-yellow-500 text-white border-yellow-500/30"
      case "Low":
        return "bg-blue-500 text-white border-blue-500/30"
      default:
        return "bg-gray-500 text-white border-gray-500/30"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "Comment":
        return "bg-purple-500 text-white border-purple-500/30"
      case "Submission":
        return "bg-blue-500 text-white border-blue-500/30"
      case "Profile":
        return "bg-green-500 text-white border-green-500/30"
      case "Chat Message":
        return "bg-orange-500 text-white border-orange-500/30"
      default:
        return "bg-gray-500 text-white border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Flagged Content Management</h1>
        <div className="flex items-center space-x-2">
          <Badge className="bg-red-500 text-white border-red-500">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {flaggedContent.filter((item) => item.status === "Under Review").length} Pending Review
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm">Total Reports</p>
                <p className="text-2xl font-bold text-black">{flaggedContent.length}</p>
              </div>
              <Flag className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm">Under Review</p>
                <p className="text-2xl font-bold text-black">
                  {flaggedContent.filter((item) => item.status === "Under Review").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm">Confirmed</p>
                <p className="text-2xl font-bold text-black">
                  {flaggedContent.filter((item) => item.status === "Confirmed").length}
                </p>
              </div>
              <Ban className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm">Resolution Rate</p>
                <p className="text-2xl font-bold text-black">85%</p>
              </div>
              <Check className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
              <Input
                placeholder="Search by content, user, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-purple-500/20 text-black placeholder-gray-600"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className=" text-black hover:bg-white/5">
                  <Filter className="w-4 h-4 mr-2" />
                  Status: {statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                {["All", "Under Review", "Confirmed", "Resolved", "Dismissed"].map((status) => (
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-black hover:bg-white/5">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Severity: {severityFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                {["All", "Critical", "High", "Medium", "Low"].map((severity) => (
                  <DropdownMenuItem
                    key={severity}
                    onClick={() => setSeverityFilter(severity)}
                    className="text-white hover:bg-white/5"
                  >
                    {severity}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

      {/* Flagged Content Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-black">Flagged Content ({filteredContent.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/20">
                <TableHead className="text-gray-700">Type</TableHead>
                <TableHead className="text-gray-700">Content</TableHead>
                <TableHead className="text-gray-700">Reported User</TableHead>
                <TableHead className="text-gray-700">Reason</TableHead>
                <TableHead className="text-gray-700">Severity</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => (
                <TableRow key={item.id} className="border-purple-500/20 hover:bg-white/5">
                  <TableCell>
                    <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-black text-sm line-clamp-2">{item.content}</p>
                      <p className="text-gray-700 text-xs mt-1">
                        Reported by: {item.reportedBy} • {item.reportedAt}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-black font-medium">{item.reportedUser}</div>
                    {item.hackathon !== "N/A" && <div className="text-gray-700 text-xs">{item.hackathon}</div>}
                  </TableCell>
                  <TableCell className="text-gray-700">{item.reason}</TableCell>
                  <TableCell>
                    <Badge className={getSeverityColor(item.severity)}>{item.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-700 hover:text-black">
                          <Shuffle className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                        <DropdownMenuItem className="text-white hover:bg-white/5">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {item.status === "Under Review" && (
                          <>
                            <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                              <Ban className="w-4 h-4 mr-2" />
                              Confirm Violation
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-green-400 hover:bg-green-500/10">
                              <Check className="w-4 h-4 mr-2" />
                              Dismiss Report
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
