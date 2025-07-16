"use client"
import { useState } from "react"
import {
  MessageCircle,
  Heart,
  Reply,
  Clock,
  Users,
  Trophy,
  ChevronRight,
  Send,
  Search,
  Filter,
  MoreHorizontal,
  Pin,
  Bookmark,
  Share,
  TrendingUp,
  FlameIcon as Fire,
  Star,
  Zap
} from "lucide-react"

function MyCommunity() {
  const [selectedHackathon, setSelectedHackathon] = useState(0)
  const [newMessage, setNewMessage] = useState("")

  const hackathons = [
    {
      id: 1,
      title: "AI for Good 2024",
      participants: 847,
      timeLeft: "2 days left",
      prize: "$50,000",
      status: "active",
      color: "from-green-400 to-emerald-500",
      messages: 234,
      trending: true
    },
    {
      id: 2,
      title: "Web3 Innovation Challenge",
      participants: 623,
      timeLeft: "5 days left",
      prize: "$30,000",
      status: "active",
      color: "from-blue-400 to-cyan-500",
      messages: 189,
      trending: false
    },
    {
      id: 3,
      title: "Climate Tech Hackathon",
      participants: 456,
      timeLeft: "1 week left",
      prize: "$25,000",
      status: "active",
      color: "from-purple-400 to-indigo-500",
      messages: 156,
      trending: false
    },
    {
      id: 4,
      title: "FinTech Revolution",
      participants: 789,
      timeLeft: "3 days left",
      prize: "$40,000",
      status: "active",
      color: "from-yellow-400 to-orange-500",
      messages: 298,
      trending: true
    },
    {
      id: 5,
      title: "Healthcare Innovation",
      participants: 534,
      timeLeft: "4 days left",
      prize: "$35,000",
      status: "active",
      color: "from-pink-400 to-rose-500",
      messages: 167,
      trending: false
    },
    {
      id: 6,
      title: "Blockchain Gaming",
      participants: 412,
      timeLeft: "6 days left",
      prize: "$20,000",
      status: "active",
      color: "from-violet-400 to-purple-500",
      messages: 143,
      trending: false
    }
  ]

  const discussions = [
    [
      // AI for Good discussions
      {
        id: 1,
        type: "question",
        author: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "2 hours ago",
        content:
          "What's the best approach for training models with limited climate data? Looking for suggestions on data augmentation techniques. Has anyone worked with synthetic data generation for environmental datasets?",
        likes: 12,
        replies: 8,
        pinned: true,
        tags: ["AI", "Climate", "Data Science"]
      },
      {
        id: 2,
        type: "message",
        author: "Alex Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "4 hours ago",
        content:
          "Just submitted our carbon tracking app! Really excited about the potential impact. Anyone else working on environmental solutions? Would love to collaborate and share insights.",
        likes: 23,
        replies: 15,
        pinned: false,
        tags: ["Environment", "Mobile App"]
      },
      {
        id: 3,
        type: "comment",
        author: "Priya Patel",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "6 hours ago",
        content:
          "The mentorship session on AI ethics was incredibly insightful. Thanks to all the organizers for setting this up! Looking forward to implementing these principles in our project.",
        likes: 18,
        replies: 6,
        pinned: false,
        tags: ["Ethics", "Mentorship"]
      },
      {
        id: 4,
        type: "question",
        author: "Michael Zhang",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "8 hours ago",
        content:
          "Anyone have experience with TensorFlow Lite for mobile deployment? Our model is too large for mobile devices and we need optimization tips.",
        likes: 9,
        replies: 12,
        pinned: false,
        tags: ["TensorFlow", "Mobile", "Optimization"]
      }
    ],
    [
      // Web3 discussions
      {
        id: 4,
        type: "question",
        author: "Marcus Kim",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "1 hour ago",
        content:
          "Has anyone successfully integrated Polygon with their DeFi solution? Running into some gas optimization issues and could use some guidance from experienced developers.",
        likes: 15,
        replies: 12,
        pinned: false,
        tags: ["Polygon", "DeFi", "Gas Optimization"]
      },
      {
        id: 5,
        type: "message",
        author: "Elena Vasquez",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "3 hours ago",
        content:
          "Our NFT marketplace for creators is live! Would love feedback from the community. We've implemented some unique features for royalty distribution.",
        likes: 31,
        replies: 22,
        pinned: true,
        tags: ["NFT", "Marketplace", "Creators"]
      }
    ],
    [
      // Climate Tech discussions
      {
        id: 6,
        type: "question",
        author: "David Park",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "30 minutes ago",
        content:
          "Looking for team members with IoT experience for our smart grid project. Anyone interested in collaborating? We're building something revolutionary!",
        likes: 8,
        replies: 5,
        pinned: false,
        tags: ["IoT", "Smart Grid", "Team"]
      }
    ],
    [
      // FinTech discussions
      {
        id: 7,
        type: "message",
        author: "Lisa Wang",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "1 hour ago",
        content:
          "Blockchain-based micro-lending platform is showing promising results in our tests. Excited to present tomorrow! The potential for financial inclusion is huge.",
        likes: 19,
        replies: 11,
        pinned: false,
        tags: ["Blockchain", "FinTech", "Lending"]
      }
    ],
    [
      // Healthcare discussions
      {
        id: 8,
        type: "question",
        author: "Ahmed Hassan",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "2 hours ago",
        content:
          "Any recommendations for HIPAA-compliant cloud services for our telemedicine app? Security is our top priority and we need reliable solutions.",
        likes: 14,
        replies: 9,
        pinned: false,
        tags: ["Healthcare", "HIPAA", "Cloud"]
      }
    ],
    [
      // Blockchain Gaming discussions
      {
        id: 9,
        type: "message",
        author: "Ryan Cooper",
        avatar: "/placeholder.svg?height=40&width=40",
        time: "3 hours ago",
        content:
          "Just integrated Web3 wallet connectivity into our gaming platform. The user experience is seamless! Happy to share the implementation details.",
        likes: 25,
        replies: 18,
        pinned: false,
        tags: ["Gaming", "Web3", "Wallet"]
      }
    ]
  ]

  const trendingTopics = [
    { name: "AI Ethics", count: 45, color: "bg-blue-100 text-blue-700" },
    { name: "Web3 Gaming", count: 32, color: "bg-purple-100 text-purple-700" },
    { name: "Climate Tech", count: 28, color: "bg-green-100 text-green-700" },
    { name: "DeFi", count: 24, color: "bg-yellow-100 text-yellow-700" }
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-screen">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {/* Header Section */}
            <div className="mb-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Community Hub
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Connect, collaborate, and create amazing projects together
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Filter className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <Search className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Hackathon Header */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 mb-6 relative overflow-hidden animate-slide-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {hackathons[selectedHackathon].title}
                      </h2>
                      {hackathons[selectedHackathon].trending && (
                        <div className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          <Fire className="w-4 h-4" />
                          <span>Trending</span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="w-5 h-5" />
                        <span className="font-medium">
                          {hackathons[selectedHackathon].participants}
                        </span>
                        <span className="text-sm">participants</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-5 h-5" />
                        <span className="font-medium">
                          {hackathons[selectedHackathon].timeLeft}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Trophy className="w-5 h-5" />
                        <span className="font-medium">
                          {hackathons[selectedHackathon].prize}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">
                          {hackathons[selectedHackathon].messages}
                        </span>
                        <span className="text-sm">messages</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-6 py-3 bg-gradient-to-r ${hackathons[selectedHackathon].color} text-white rounded-2xl text-sm font-semibold shadow-lg`}
                  >
                    Active Now
                  </div>
                </div>
              </div>
            </div>

            {/* Discussion Feed */}
            <div className="space-y-5 mb-8">
              {discussions[selectedHackathon]?.map((discussion, index) => (
                <div
                  key={discussion.id}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 relative group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {discussion.pinned && (
                    <div className="absolute top-4 right-4">
                      <Pin className="w-5 h-5 text-indigo-500" />
                    </div>
                  )}

                  <div className="flex items-start space-x-5">
                    <div className="relative">
                      <img
                        src={discussion.avatar || "/placeholder.svg"}
                        alt={discussion.author}
                        className="w-14 h-14 rounded-2xl border-3 border-gray-100 shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {discussion.author}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            discussion.type === "question"
                              ? "bg-blue-100 text-blue-700"
                              : discussion.type === "message"
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {discussion.type}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                          {discussion.time}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed text-lg">
                        {discussion.content}
                      </p>

                      {discussion.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {discussion.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-all duration-300 hover:scale-110">
                            <Heart className="w-5 h-5" />
                            <span className="font-medium">
                              {discussion.likes}
                            </span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-all duration-300 hover:scale-110">
                            <Reply className="w-5 h-5" />
                            <span className="font-medium">
                              {discussion.replies} replies
                            </span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-500 transition-all duration-300 hover:scale-110">
                            <Share className="w-5 h-5" />
                            <span className="font-medium">Share</span>
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300">
                            <Bookmark className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Message Input */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100 sticky bottom-6 animate-slide-up">
              <div className="flex items-center space-x-4">
                <img
                  src="/placeholder.svg?height=50&width=50"
                  alt="Your avatar"
                  className="w-12 h-12 rounded-2xl border-2 border-gray-100 shadow-lg"
                />
                <div className="flex-1 flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Share your thoughts with the community..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    className="flex-1 px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg transition-all duration-300"
                    onKeyPress={e => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 shadow-lg font-semibold hover:scale-105 hover:shadow-xl"
                  >
                    <Send className="w-5 h-5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Right Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              {/* Hackathons List */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100 animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Active Hackathons
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Search className="w-5 h-5 text-gray-400" />
                    <Filter className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {hackathons.map((hackathon, index) => (
                    <button
                      key={hackathon.id}
                      onClick={() => setSelectedHackathon(index)}
                      className={`w-full text-left p-5 rounded-2xl transition-all duration-300 relative hover:scale-102 ${
                        selectedHackathon === index
                          ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 shadow-lg"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3
                              className={`font-bold text-sm ${
                                selectedHackathon === index
                                  ? "text-indigo-900"
                                  : "text-gray-900"
                              }`}
                            >
                              {hackathon.title}
                            </h3>
                            {hackathon.trending && (
                              <TrendingUp className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span>{hackathon.participants} participants</span>
                            <span className="font-semibold text-green-600">
                              {hackathon.prize}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${hackathon.color} text-white`}
                            >
                              {hackathon.timeLeft}
                            </div>
                            <span className="text-xs text-gray-500">
                              {hackathon.messages} messages
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 ml-2 transition-transform duration-300 ${
                            selectedHackathon === index
                              ? "text-indigo-600 rotate-90"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Topics */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100 animate-slide-up animation-delay-200">
                <div className="flex items-center space-x-2 mb-6">
                  <Fire className="w-6 h-6 text-orange-500" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Trending Topics
                  </h2>
                </div>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 cursor-pointer hover:scale-102"
                    >
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${topic.color}`}
                      >
                        #{topic.name}
                      </span>
                      <span className="text-sm text-gray-600 font-medium">
                        {topic.count} posts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Stats */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl animate-slide-up animation-delay-400">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Live Activity</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-100">Online Now</span>
                    <span className="font-bold text-2xl">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-100">Active Projects</span>
                    <span className="font-bold text-2xl">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-100">Messages Today</span>
                    <span className="font-bold text-2xl">2,456</span>
                  </div>
                </div>
              </div>

              {/* Join Community Section */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl animate-slide-up animation-delay-600">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                  <h2 className="text-2xl font-bold mb-3">
                    Ready to Join Our Community?
                  </h2>
                  <p className="text-purple-100 leading-relaxed">
                    Connect with thousands of developers, participate in
                    hackathons, and build the future of technology together.
                  </p>
                </div>
                <div className="space-y-4">
                  <button className="w-full bg-white text-purple-700 font-bold px-6 py-4 rounded-2xl hover:bg-purple-50 transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-xl">
                    Join Community Discord
                  </button>
                  <button className="w-full border-2 border-white text-white font-bold px-6 py-4 rounded-2xl hover:bg-white hover:text-purple-700 transition-all duration-300 hover:scale-105">
                    Follow on Twitter
                  </button>
                </div>
                <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-purple-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span>24/7 Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyCommunity
