"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/AdminCard"
import { Button } from "./ui/AdminButton"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Search, Filter, Eye, Download, Star, Code, Calendar, User, MoreHorizontal } from "lucide-react"

const submissions = [
  {
    id: 1,
    title: "AI-Powered Healthcare Assistant",
    hackathon: "AI Innovation Challenge 2024",
    team: "Team Alpha",
    submittedBy: "Sarah Johnson",
    submittedAt: "2024-01-20 14:30",
    status: "Under Review",
    rating: 4.5,
    technologies: ["React", "Python", "TensorFlow"],
    githubUrl: "https://github.com/team-alpha/healthcare-ai",
  },
  {
    id: 2,
    title: "Sustainable Energy Tracker",
    hackathon: "Sustainable Future Hackathon",
    team: "EcoTech Warriors",
    submittedBy: "Mike Chen",
    submittedAt: "2024-01-19 16:45",
    status: "Approved",
    rating: 4.8,
    technologies: ["Vue.js", "Node.js", "MongoDB"],
    githubUrl: "https://github.com/ecotech/energy-tracker",
  },
  {
    id: 3,
    title: "Blockchain Payment Gateway",
    hackathon: "FinTech Revolution",
    team: "CryptoBuilders",
    submittedBy: "Alex Rodriguez",
    submittedAt: "2024-01-18 11:20",
    status: "Rejected",
    rating: 3.2,
    technologies: ["Solidity", "React", "Web3.js"],
    githubUrl: "https://github.com/cryptobuilders/payment-gateway",
  },
  {
    id: 4,
    title: "Mental Health Support Bot",
    hackathon: "Healthcare Tech Challenge",
    team: "MindCare Solutions",
    submittedBy: "Emily Davis",
    submittedAt: "2024-01-21 09:15",
    status: "Under Review",
    rating: 4.3,
    technologies: ["Python", "NLP", "Flask"],
    githubUrl: "https://github.com/mindcare/support-bot",
  },
]

export function SubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.hackathon.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || submission.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "Under Review":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Rejected":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Submissions Management</h1>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search submissions, teams, or hackathons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-purple-500/20 text-white placeholder-gray-400"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-purple-500/20 text-white hover:bg-white/5">
                  <Filter className="w-4 h-4 mr-2" />
                  Status: {statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                {["All", "Under Review", "Approved", "Rejected"].map((status) => (
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
        </CardContent>
      </Card>

      {/* Submissions Table */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Code className="w-5 h-5 mr-2 text-purple-400" />
            All Submissions ({filteredSubmissions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/20">
                <TableHead className="text-gray-300">Project</TableHead>
                <TableHead className="text-gray-300">Team</TableHead>
                <TableHead className="text-gray-300">Hackathon</TableHead>
                <TableHead className="text-gray-300">Submitted</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Rating</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id} className="border-purple-500/20 hover:bg-white/5">
                  <TableCell>
                    <div>
                      <div className="text-white font-medium">{submission.title}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {submission.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs bg-blue-500/20 text-blue-300">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-white font-medium">{submission.team}</div>
                      <div className="text-gray-400 text-sm flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {submission.submittedBy}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">{submission.hackathon}</TableCell>
                  <TableCell>
                    <div className="text-gray-300 text-sm flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {submission.submittedAt}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {submission.rating}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                        <DropdownMenuItem className="text-white hover:bg-white/5">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/5">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
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
