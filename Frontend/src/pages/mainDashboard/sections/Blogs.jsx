"use client";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  Eye,
  Filter,
  Bookmark,
  Tag,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "../../../components/CommonUI/button";
import { Input } from "../../../components/CommonUI/input";
import { Card, CardContent } from "../../../components/CommonUI/card";
import { Badge } from "../../../components/CommonUI/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/DashboardUI/avatar";
import { Separator } from "../../../components/CommonUI/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/CommonUI/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/DashboardUI/dialog";
import { WriteArticle } from "./WriteArticle";

export function Blogs({ onBack }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("list"); // "list" or "write"
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [submittedArticle, setSubmittedArticle] = useState(null);

  // Mock data - replace with actual API call
  const mockBlogs = [
    {
      id: "1",
      title: "Building Scalable Web Applications with React and Node.js",
      excerpt:
        "Learn how to create robust, scalable web applications using modern React patterns and Node.js best practices. This comprehensive guide covers everything from project setup to deployment.",
      content: "Full blog content here...",
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Full Stack Developer",
      },
      publishedAt: "2024-01-15",
      readTime: 8,
      category: "Web Development",
      tags: ["React", "Node.js", "JavaScript", "Full Stack"],
      likes: 124,
      comments: 23,
      views: 1250,
      featured: true,
      image: "/placeholder.svg?height=300&width=600",
      status: "published",
    },
    {
      id: "2",
      title: "Machine Learning in Healthcare: A Beginner's Guide",
      excerpt:
        "Explore how AI and ML are revolutionizing healthcare with practical examples and implementation strategies. Perfect for developers looking to enter the healthcare tech space.",
      content: "Full blog content here...",
      author: {
        name: "Dr. Michael Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "AI Researcher",
      },
      publishedAt: "2024-01-12",
      readTime: 12,
      category: "AI/ML",
      tags: ["Machine Learning", "Healthcare", "AI", "Python"],
      likes: 89,
      comments: 15,
      views: 890,
      featured: false,
      image: "/placeholder.svg?height=300&width=600",
      status: "published",
    },
    {
      id: "3",
      title: "Blockchain Development: Smart Contracts with Solidity",
      excerpt:
        "A comprehensive guide to developing smart contracts using Solidity and deploying them on Ethereum. Includes real-world examples and best practices.",
      content: "Full blog content here...",
      author: {
        name: "Alex Thompson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Blockchain Developer",
      },
      publishedAt: "2024-01-10",
      readTime: 15,
      category: "Blockchain",
      tags: ["Blockchain", "Solidity", "Ethereum", "Smart Contracts"],
      likes: 156,
      comments: 31,
      views: 1680,
      featured: true,
      image: "/placeholder.svg?height=300&width=600",
      status: "published",
    },
    {
      id: "4",
      title: "Cybersecurity Best Practices for Developers",
      excerpt:
        "Essential security practices every developer should know to build secure applications. Learn about common vulnerabilities and how to prevent them.",
      content: "Full blog content here...",
      author: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Security Engineer",
      },
      publishedAt: "2024-01-08",
      readTime: 10,
      category: "Cybersecurity",
      tags: ["Security", "Best Practices", "Development", "OWASP"],
      likes: 78,
      comments: 12,
      views: 650,
      featured: false,
      image: "/placeholder.svg?height=300&width=600",
      status: "published",
    },
  ];

  const categories = [
    "all",
    "Web Development",
    "AI/ML",
    "Blockchain",
    "Cybersecurity",
    "Mobile",
    "DevOps",
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBlogs(mockBlogs);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle write article navigation
  const handleWriteArticle = () => {
    setCurrentView("write");
  };

  const handleBackToBlogs = () => {
    setCurrentView("list");
  };

  const handleArticleSubmit = (article) => {
    setSubmittedArticle(article);
    setCurrentView("list");
    setShowApprovalDialog(true);
  };

  // If we're in write mode, show the write article component
  if (currentView === "write") {
    return (
      <WriteArticle onBack={handleBackToBlogs} onSubmit={handleArticleSubmit} />
    );
  }

  // Only show published blogs in the main view
  const publishedBlogs = blogs.filter((blog) => blog.status === "published");

  const filteredBlogs = publishedBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredBlogs = publishedBlogs.filter((blog) => blog.featured);
  const trendingBlogs = [...publishedBlogs]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  if (selectedPost) {
    return (
      <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        {/* Header */}
        <header className="bg-white/20 border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="default"
                size="sm"
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blogs
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Blog Post
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
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Hero Image */}
            {selectedPost.image && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={selectedPost.image || "/placeholder.svg"}
                  alt={selectedPost.title}
                  className="w-full h-80 object-cover"
                />
              </div>
            )}

            {/* Article Header */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {selectedPost.title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 ring-2 ring-indigo-100">
                    <AvatarImage
                      src={selectedPost.author.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                      {selectedPost.author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedPost.author.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedPost.author.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedPost.publishedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedPost.readTime} min read
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {selectedPost.views.toLocaleString()} views
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedPost.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="px-3 py-1 ">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Excerpt */}
              <p className="text-xl text-gray-700 leading-relaxed font-light">
                {selectedPost.excerpt}
              </p>
            </div>

            {/* Article Content */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-800 leading-relaxed mb-6">
                  This is where the full blog content would be displayed. You
                  can integrate with a rich text editor or markdown parser to
                  render the complete blog post content.
                </p>
                <p className="text-gray-800 leading-relaxed mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-800 leading-relaxed">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>

            {/* Engagement Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Heart className="w-4 h-4" />
                    {selectedPost.likes} Likes
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {selectedPost.comments} Comments
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  {selectedPost.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Article Submitted Successfully!
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Your article <strong>"{submittedArticle?.title}"</strong> has
                  been submitted for review.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Waiting for Admin Approval
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your article will be reviewed by our admin team and
                        published once approved. You'll receive a notification
                        when the status changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowApprovalDialog(false)}>Got it</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className=" border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="default"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Blogs & Articles
                </h1>
                <p className="text-sm text-gray-500">
                  Discover insights from the community
                </p>
              </div>
            </div>
          </div>
          <Button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            onClick={handleWriteArticle}
          >
            <Plus className="w-4 h-4" />
            Write Article
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search and Filters */}
          <div className="bg-white/20 rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search blogs, topics, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/20 border border-gray-200 p-1 rounded-lg">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                All Posts
              </TabsTrigger>
              <TabsTrigger
                value="featured"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Featured
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
              >
                Trending
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
                  {filteredBlogs.map((blog) => (
                    <Card
                      key={blog.id}
                      className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-gray-200 bg-white/20 group"
                      onClick={() => setSelectedPost(blog)}
                    >
                      <div className="relative overflow-hidden rounded-t-xl">
                        <img
                          src={blog.image || "/placeholder.svg"}
                          alt={blog.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {blog.featured && (
                          <Badge className="absolute top-3 left-3 bg-yellow-500 text-white shadow-lg">
                            ⭐ Featured
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant="outline"
                            className="px-2 py-1 text-xs font-medium border-indigo-200 text-indigo-700"
                          >
                            {blog.category}
                          </Badge>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {blog.readTime} min read
                          </span>
                        </div>

                        <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {blog.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {blog.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs px-2 py-1"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 ring-2 ring-gray-100">
                              <AvatarImage
                                src={blog.author.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs font-semibold">
                                {blog.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {blog.author.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {blog.author.role}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {blog.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {blog.comments}
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
                {featuredBlogs.map((blog) => (
                  <Card
                    key={blog.id}
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white group"
                    onClick={() => setSelectedPost(blog)}
                  >
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img
                        src={blog.image || "/placeholder.svg"}
                        alt={blog.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-yellow-500 text-white shadow-lg">
                        ⭐ Featured
                      </Badge>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className="px-2 py-1 text-xs font-medium border-yellow-300 text-yellow-700"
                        >
                          {blog.category}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {blog.readTime} min read
                        </span>
                      </div>

                      <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-yellow-600 transition-colors">
                        {blog.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-yellow-100">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 ring-2 ring-yellow-100">
                            <AvatarImage
                              src={blog.author.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="bg-yellow-100 text-yellow-600 text-xs font-semibold">
                              {blog.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {blog.author.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {blog.author.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {blog.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {blog.comments}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingBlogs.map((blog, index) => (
                  <Card
                    key={blog.id}
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-red-200 bg-gradient-to-br from-red-50 to-white group relative"
                    onClick={() => setSelectedPost(blog)}
                  >
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white shadow-lg z-10">
                      🔥 #{index + 1} Trending
                    </Badge>

                    <div className="relative overflow-hidden rounded-t-xl">
                      <img
                        src={blog.image || "/placeholder.svg"}
                        alt={blog.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className="px-2 py-1 text-xs font-medium border-red-300 text-red-700"
                        >
                          {blog.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <TrendingUp className="w-3 h-3" />
                          {blog.views.toLocaleString()} views
                        </div>
                      </div>

                      <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-red-600 transition-colors">
                        {blog.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-red-100">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 ring-2 ring-red-100">
                            <AvatarImage
                              src={blog.author.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="bg-red-100 text-red-600 text-xs font-semibold">
                              {blog.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {blog.author.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {blog.author.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {blog.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {blog.comments}
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
  );
}
