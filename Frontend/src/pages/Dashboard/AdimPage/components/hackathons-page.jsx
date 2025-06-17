"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Plus, Search, Calendar, Users, Trophy, Eye } from "lucide-react"

const hackathons = [
  {
    id: 1,
    title: "AI Innovation Challenge 2024",
    organizer: "TechCorp Inc.",
    status: "Live",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    participants: 1247,
    submissions: 89,
    prize: "$50,000",
  },
  {
    id: 2,
    title: "Sustainable Future Hackathon",
    organizer: "GreenTech Solutions",
    status: "Pending",
    startDate: "2024-02-15",
    endDate: "2024-02-17",
    participants: 0,
    submissions: 0,
    prize: "$25,000",
  },
  {
    id: 3,
    title: "FinTech Revolution",
    organizer: "Banking Innovations Ltd.",
    status: "Closed",
    startDate: "2024-01-01",
    endDate: "2024-01-03",
    participants: 892,
    submissions: 156,
    prize: "$75,000",
  },
  {
    id: 4,
    title: "Healthcare Tech Challenge",
    organizer: "MedTech Ventures",
    status: "Live",
    startDate: "2024-01-18",
    endDate: "2024-01-25",
    participants: 634,
    submissions: 45,
    prize: "$40,000",
  },
]

export function HackathonsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredHackathons = hackathons.filter(
    (hackathon) =>
      hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hackathon.organizer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "Live":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Closed":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Hackathons Management</h1>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Hackathon
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search hackathons by title or organizer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-purple-500/20 text-white placeholder-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHackathons.map((hackathon) => (
          <Card
            key={hackathon.id}
            className="bg-black/20 backdrop-blur-xl border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">
                    {hackathon.title}
                  </CardTitle>
                  <p className="text-gray-400 text-sm">by {hackathon.organizer}</p>
                </div>
                <Badge className={getStatusColor(hackathon.status)}>{hackathon.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-gray-300 text-sm">
                <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                {hackathon.startDate} - {hackathon.endDate}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-300 text-sm">
                  <Users className="w-4 h-4 mr-2 text-blue-400" />
                  {hackathon.participants} participants
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                  {hackathon.prize}
                </div>
              </div>

              <div className="text-gray-300 text-sm">
                <span className="text-green-400 font-semibold">{hackathon.submissions}</span> submissions received
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-purple-500/20 text-white hover:bg-purple-500/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
