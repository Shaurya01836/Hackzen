"use client"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Search,
  Github,
  ExternalLink,
  Star,
  ForkliftIcon as Fork,
  Eye,
  Calendar,
  Code,
  Award,
  Download,
  Heart,
  Share2,
  Play,
  Filter,
  Bookmark,
  Trophy,
  Users,
  Zap
} from "lucide-react"
import { Button } from "../../../components/CommonUI/button"
import { Input } from "../../../components/CommonUI/input"
import { Card, CardContent } from "../../../components/CommonUI/card"
import { Badge } from "../../../components/CommonUI/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/DashboardUI/avatar"
import { Separator } from "../../../components/CommonUI/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/CommonUI/tabs"

export function ProjectArchive({ onBack }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProject, setSelectedProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual API call
  const mockProjects = [
    {
      id: "1",
      title: "AI-Powered Healthcare Assistant",
      description:
        "An intelligent healthcare assistant that helps patients track symptoms and get preliminary diagnoses using advanced machine learning algorithms.",
      longDescription:
        "This project was developed during the Healthcare Innovation Hackathon. It uses machine learning algorithms to analyze patient symptoms and provide preliminary health assessments. The system includes a chatbot interface, symptom tracking, and integration with medical databases. The AI model was trained on thousands of medical cases and provides accurate preliminary diagnoses with 85% accuracy rate.",
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Full Stack Developer"
      },
      hackathon: "Healthcare Innovation Challenge 2024",
      category: "Healthcare",
      technologies: ["React", "Node.js", "Python", "TensorFlow", "MongoDB"],
      githubUrl: "https://github.com/user/healthcare-ai",
      liveUrl: "https://healthcare-ai-demo.com",
      demoUrl: "https://youtube.com/watch?v=demo1",
      createdAt: "2024-01-15",
      stars: 156,
      forks: 23,
      views: 1250,
      likes: 89,
      featured: true,
      award: "1st Place Winner",
      images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600"
      ],
      status: "completed"
    },
    {
      id: "2",
      title: "Blockchain Voting System",
      description:
        "A secure, transparent voting system built on blockchain technology for democratic elections with immutable record keeping.",
      longDescription:
        "This decentralized voting platform ensures election integrity through blockchain technology. Features include voter authentication, transparent vote counting, and immutable record keeping. Built on Ethereum with smart contracts handling all voting logic.",
      author: {
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Blockchain Developer"
      },
      hackathon: "Democracy Tech Hackathon 2024",
      category: "Blockchain",
      technologies: ["Solidity", "React", "Web3.js", "Ethereum", "IPFS"],
      githubUrl: "https://github.com/user/blockchain-voting",
      liveUrl: "https://vote-chain.com",
      createdAt: "2024-01-12",
      stars: 234,
      forks: 45,
      views: 2100,
      likes: 167,
      featured: true,
      award: "Best Innovation Award",
      images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600"
      ],
      status: "completed"
    },
    {
      id: "3",
      title: "Smart City Traffic Optimizer",
      description:
        "IoT-based traffic management system that optimizes traffic flow in urban areas using machine learning and real-time data.",
      longDescription:
        "An intelligent traffic management system using IoT sensors and machine learning to optimize traffic flow, reduce congestion, and improve urban mobility. Deployed in 3 cities with 30% reduction in traffic congestion.",
      author: {
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "IoT Engineer"
      },
      hackathon: "Smart City Challenge 2024",
      category: "IoT",
      technologies: ["Arduino", "Python", "React", "AWS IoT", "TensorFlow"],
      githubUrl: "https://github.com/user/smart-traffic",
      demoUrl: "https://youtube.com/watch?v=demo3",
      createdAt: "2024-01-10",
      stars: 98,
      forks: 12,
      views: 780,
      likes: 45,
      featured: false,
      images: ["/placeholder.svg?height=400&width=600"],
      status: "completed"
    },
    {
      id: "4",
      title: "Cybersecurity Threat Detector",
      description:
        "Real-time threat detection system using machine learning to identify security vulnerabilities and potential attacks.",
      longDescription:
        "Advanced cybersecurity tool that monitors network traffic and system behavior to detect potential threats and vulnerabilities in real-time. Uses advanced ML algorithms for anomaly detection.",
      author: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Security Engineer"
      },
      hackathon: "CyberSec Hackathon 2024",
      category: "Cybersecurity",
      technologies: ["Python", "Scikit-learn", "Flask", "Docker", "PostgreSQL"],
      githubUrl: "https://github.com/user/threat-detector",
      createdAt: "2024-01-08",
      stars: 67,
      forks: 8,
      views: 450,
      likes: 23,
      featured: false,
      images: ["/placeholder.svg?height=400&width=600"],
      status: "in-progress"
    }
  ]

  const categories = [
    "all",
    "Healthcare",
    "Blockchain",
    "IoT",
    "Cybersecurity",
    "AI/ML",
    "Web Development",
    "Mobile"
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProjects(mockProjects)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredProjects = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech =>
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      )
    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredProjects = projects.filter(project => project.featured)
  const awardWinningProjects = projects.filter(project => project.award)

  if (selectedProject) {
    return (
      <div className="flex-1 flex flex-col h-full bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-2 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Project Details
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Project Hero */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {selectedProject.title}
                      </h1>
                      <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                        {selectedProject.description}
                      </p>

                      {selectedProject.award && (
                        <div className="flex items-center gap-2 mb-6">
                          <Badge className="bg-yellow-500 text-white px-4 py-2 text-sm font-semibold shadow-lg">
                            🏆 {selectedProject.award}
                          </Badge>
                        </div>
                      )}

                      {/* Author Info */}
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="w-12 h-12 ring-2 ring-indigo-100">
                          <AvatarImage
                            src={
                              selectedProject.author.avatar ||
                              "/placeholder.svg"
                            }
                          />
                          <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                            {selectedProject.author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {selectedProject.author.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedProject.author.role}
                          </p>
                        </div>
                        <Separator orientation="vertical" className="h-8" />
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(
                              selectedProject.createdAt
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            {selectedProject.hackathon}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Button
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                      asChild
                    >
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4" />
                        View Source Code
                      </a>
                    </Button>
                    {selectedProject.liveUrl && (
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
                        asChild
                      >
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {selectedProject.demoUrl && (
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-red-300 text-red-700 hover:bg-red-50"
                        asChild
                      >
                        <a
                          href={selectedProject.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Play className="w-4 h-4" />
                          Video Demo
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
                        <Star className="w-4 h-4" />
                        <span className="font-bold text-lg">
                          {selectedProject.stars}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Stars</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <Fork className="w-4 h-4" />
                        <span className="font-bold text-lg">
                          {selectedProject.forks}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Forks</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                        <Eye className="w-4 h-4" />
                        <span className="font-bold text-lg">
                          {selectedProject.views}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Views</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                        <Heart className="w-4 h-4" />
                        <span className="font-bold text-lg">
                          {selectedProject.likes}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Likes</p>
                    </div>
                  </div>
                </div>

                {/* Project Images */}
                {selectedProject.images.length > 0 && (
                  <div className="lg:w-1/2">
                    <div className="space-y-4">
                      {selectedProject.images.map((image, index) => (
                        <div
                          key={index}
                          className="rounded-xl overflow-hidden shadow-lg"
                        >
                          <img
                            src={
                              image || "/placeholder.svg?height=400&width=600"
                            }
                            alt={`${selectedProject.title} screenshot ${index +
                              1}`}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-indigo-600" />
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-3">
                {selectedProject.technologies.map(tech => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="px-4 py-2 text-sm font-medium border-indigo-200 text-indigo-700 bg-indigo-50"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                About This Project
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {selectedProject.longDescription}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Heart className="w-4 h-4" />
                    Like Project
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>

                <Badge
                  className={`px-4 py-2 text-sm font-medium ${
                    selectedProject.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : selectedProject.status === "in-progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {selectedProject.status.replace("-", " ").toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Code className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Project Archive
                </h1>
                <p className="text-sm text-gray-500">
                  Discover amazing hackathon projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search projects, technologies, or descriptions..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Code className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.length}
                  </p>
                  <p className="text-sm text-gray-600">Total Projects</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {awardWinningProjects.length}
                  </p>
                  <p className="text-sm text-gray-600">Award Winners</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(projects.map(p => p.author.name)).size}
                  </p>
                  <p className="text-sm text-gray-600">Contributors</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.reduce((sum, p) => sum + p.stars, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Stars</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 p-1 rounded-lg">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                All Projects
              </TabsTrigger>
              <TabsTrigger
                value="featured"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Featured
              </TabsTrigger>
              <TabsTrigger
                value="awards"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Award Winners
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse border-gray-200">
                      <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                        <div className="flex justify-between">
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map(project => (
                    <Card
                      key={project.id}
                      className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-200 bg-white group"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="relative overflow-hidden rounded-t-xl">
                        <img
                          src={
                            project.images[0] ||
                            "/placeholder.svg?height=200&width=400"
                          }
                          alt={project.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {project.featured && (
                          <Badge className="absolute top-3 left-3 bg-blue-500 text-white shadow-lg">
                            ⭐ Featured
                          </Badge>
                        )}
                        {project.award && (
                          <Badge className="absolute top-3 right-3 bg-yellow-500 text-white shadow-lg">
                            🏆 Winner
                          </Badge>
                        )}
                        <Badge
                          className={`absolute bottom-3 left-3 shadow-lg ${
                            project.status === "completed"
                              ? "bg-green-500 text-white"
                              : project.status === "in-progress"
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {project.status.replace("-", " ")}
                        </Badge>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="outline"
                            className="px-2 py-1 text-xs font-medium border-indigo-200 text-indigo-700"
                          >
                            {project.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {project.hackathon}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {project.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 3).map(tech => (
                            <Badge
                              key={tech}
                              variant="secondary"
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-700"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-700"
                            >
                              +{project.technologies.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 ring-2 ring-gray-100">
                              <AvatarImage
                                src={
                                  project.author.avatar || "/placeholder.svg"
                                }
                              />
                              <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs font-semibold">
                                {project.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {project.author.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {project.author.role}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              {project.stars}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {project.views}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map(project => (
                  <Card
                    key={project.id}
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white group"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img
                        src={
                          project.images[0] ||
                          "/placeholder.svg?height=200&width=400"
                        }
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-blue-500 text-white shadow-lg">
                        ⭐ Featured
                      </Badge>
                      {project.award && (
                        <Badge className="absolute top-3 right-3 bg-yellow-500 text-white shadow-lg">
                          🏆 {project.award}
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className="px-2 py-1 text-xs font-medium border-blue-300 text-blue-700"
                        >
                          {project.category}
                        </Badge>
                      </div>

                      <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-blue-100">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 ring-2 ring-blue-100">
                            <AvatarImage
                              src={project.author.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                              {project.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {project.author.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {project.author.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {project.stars}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {project.likes}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="awards" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {awardWinningProjects.map(project => (
                  <Card
                    key={project.id}
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white group"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img
                        src={
                          project.images[0] ||
                          "/placeholder.svg?height=200&width=400"
                        }
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-yellow-500 text-white shadow-lg">
                        🏆 {project.award}
                      </Badge>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className="px-2 py-1 text-xs font-medium border-yellow-300 text-yellow-700"
                        >
                          {project.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {project.hackathon}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-yellow-600 transition-colors">
                        {project.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-yellow-100">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 ring-2 ring-yellow-100">
                            <AvatarImage
                              src={project.author.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="bg-yellow-100 text-yellow-600 text-xs font-semibold">
                              {project.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {project.author.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {project.author.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {project.stars}
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            Winner
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
