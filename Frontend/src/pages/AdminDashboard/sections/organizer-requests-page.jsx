"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card"
import { Button } from "../../../components/CommonUI/button"
import { Badge } from "../../../components/CommonUI/badge"
import { Input } from "../../../components/CommonUI/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/AdminUI/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/AdminUI/dropdown-menu"
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  Shuffle,
} from "lucide-react"

export function OrganizerRequestsPage() {
  const [organizerRequests, setOrganizerRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/hackathons/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        setOrganizerRequests(res.data)
      } catch (err) {
        console.error("Failed to fetch hackathon requests", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const updateApprovalStatus = async (id, status) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/hackathons/${id}/approval`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      setOrganizerRequests((prev) =>
        prev.map((h) => (h._id === id ? { ...h, approvalStatus: status } : h))
      )
    } catch (err) {
      console.error("Failed to update approval status", err)
    }
  }

  const filteredRequests = organizerRequests.filter((request) => {
    const matchesSearch =
      request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "All" || request.approvalStatus === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-white"
      case "pending":
        return "bg-yellow-500 text-white"
      case "rejected":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (loading) return <p className="text-center text-black">Loading requests...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">Organizer Requests</h1>
        <div className="flex items-center space-x-2">
          <Badge className="bg-yellow-500 text-white">
            <Clock className="w-3 h-3 mr-1" />
            {organizerRequests.filter((r) => r.approvalStatus === "pending").length} Pending
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
          <Input
            placeholder="Search by event or organizer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white text-black"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-black">
              <Filter className="w-4 h-4 mr-2" />
              Status: {statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-black">Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Organizer</TableHead>
                <TableHead className="text-black">Event</TableHead>
                <TableHead className="text-black">Status</TableHead>
                <TableHead className="text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>
                    <div>
                      <div className="text-black font-medium">
                        {req.organizer?.name || "Unknown"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-black">{req.title}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(req.approvalStatus)}>
                      {req.approvalStatus || "pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Shuffle className="w-4 h-4 text-black" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        {req.approvalStatus === "pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => updateApprovalStatus(req._id, "approved")}
                              className="text-green-500"
                            >
                              <Check className="w-4 h-4 mr-2" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateApprovalStatus(req._id, "rejected")}
                              className="text-red-500"
                            >
                              <X className="w-4 h-4 mr-2" /> Reject
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
