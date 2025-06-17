"use client"
import {
  ArrowLeft,
  MessageSquare,
  Users,
  Search,
  Hash,
  Volume2,
  VolumeX
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
import { Input } from "../../AdimPage/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../AdimPage/components/ui/avatar"

const chatRooms = [
  {
    id: 1,
    name: "AI Challenge General",
    members: 45,
    active: true,
    description: "General discussion for AI Innovation Challenge participants",
    category: "General",
    lastMessage: "Anyone working on computer vision projects?",
    lastMessageTime: "2 min ago",
    unreadCount: 3
  },
  {
    id: 2,
    name: "Web3 Builders",
    members: 23,
    active: false,
    description: "Web3 and blockchain development discussions",
    category: "Technical",
    lastMessage: "Check out this new DeFi protocol!",
    lastMessageTime: "1 hour ago",
    unreadCount: 0
  },
  {
    id: 3,
    name: "Mobile Dev Help",
    members: 67,
    active: true,
    description: "Get help with mobile app development",
    category: "Help",
    lastMessage: "How to implement push notifications in React Native?",
    lastMessageTime: "5 min ago",
    unreadCount: 7
  },
  {
    id: 4,
    name: "UI/UX Design",
    members: 34,
    active: true,
    description: "Design discussions and feedback",
    category: "Design",
    lastMessage: "Love the color scheme in your mockup!",
    lastMessageTime: "15 min ago",
    unreadCount: 1
  },
  {
    id: 5,
    name: "Team Formation",
    members: 89,
    active: true,
    description: "Find teammates for hackathons",
    category: "Teams",
    lastMessage: "Looking for a backend developer for AI project",
    lastMessageTime: "30 min ago",
    unreadCount: 12
  }
]

const recentMessages = [
  {
    id: 1,
    user: "Alex Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "Anyone working on computer vision projects?",
    time: "2 min ago",
    room: "AI Challenge General"
  },
  {
    id: 2,
    user: "Sarah Kim",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "How to implement push notifications in React Native?",
    time: "5 min ago",
    room: "Mobile Dev Help"
  },
  {
    id: 3,
    user: "Mike Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "Love the color scheme in your mockup!",
    time: "15 min ago",
    room: "UI/UX Design"
  }
]

export function ChatRooms({ onBack }) {
  return (
    <div className="flex-1 space-y-6 p-6">
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
          <h1 className="text-2xl font-bold text-gray-800">Chat Rooms</h1>
          <p className="text-sm text-gray-500">
            Connect and collaborate with other participants
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Rooms List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search chat rooms..." className="pl-10" />
            </div>
            <Button>
              <MessageSquare className="w-4 h-4 mr-2" />
              Create Room
            </Button>
          </div>

          <div className="space-y-3">
            {chatRooms.map(room => (
              <Card
                key={room.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <Hash className="w-5 h-5 text-gray-500" />
                        {room.active && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{room.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {room.category}
                          </Badge>
                          {room.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              {room.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {room.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{room.members} members</span>
                            </div>
                            {room.active ? (
                              <div className="flex items-center gap-1 text-green-600">
                                <Volume2 className="w-4 h-4" />
                                <span>Active</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <VolumeX className="w-4 h-4" />
                                <span>Quiet</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <p className="text-gray-700">{room.lastMessage}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {room.lastMessageTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="ml-4">
                      Join
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chat Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Rooms</span>
                <span className="font-medium">{chatRooms.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Rooms</span>
                <span className="font-medium">
                  {chatRooms.filter(r => r.active).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Unread Messages</span>
                <span className="font-medium text-red-600">
                  {chatRooms.reduce((sum, room) => sum + room.unreadCount, 0)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Messages</CardTitle>
              <CardDescription>
                Latest activity across all rooms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMessages.map(message => (
                <div key={message.id} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{message.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {message.user}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {message.message}
                    </p>
                    <p className="text-xs text-gray-500">in #{message.room}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Create New Room
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Find Teammates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Search className="w-4 h-4 mr-2" />
                Browse All Rooms
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
