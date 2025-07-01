"use client";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../../../components/CommonUI/card";
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

export function Blogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("list"); // "list" or "write"
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [submittedArticle, setSubmittedArticle] = useState(null);
  const [categories, setCategories] = useState(["all"]);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0); // default 0

  const navigate = useNavigate();
  const { id: blogId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/articles");
        const data = await res.json();
        setBlogs(data);

        // extract categories from published blogs
        const published = data.filter((b) => b.status === "published");
        const uniqueCategories = Array.from(
          new Set(published.map((b) => b.category))
        );
        setCategories(["all", ...uniqueCategories]);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Handle write article navigation
  const handleWriteArticle = () => {
    setCurrentView("write");
  };

  const handleArticleSubmit = (article) => {
    setSubmittedArticle(article);
    setCurrentView("list");
    setShowApprovalDialog(true);
  };

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

  // Find the selected blog if blogId is present in the URL
  const selectedPost = blogId
    ? publishedBlogs.find((b) => b._id === blogId)
    : null;

  // When a blog card is clicked, navigate to its URL
  const handleBlogClick = (blog) => {
    navigate(`/dashboard/blogs/${blog._id}`);
  };

  // When back is clicked, go back to the blogs list URL
  const handleBackToBlogs = () => {
    navigate("/dashboard/blogs");
  };
  useEffect(() => {
    if (selectedPost) {
      setLikeCount(selectedPost.likes);
      setIsLiked(selectedPost.likedByUser);
    }
  }, [selectedPost]);

 const handleLike = async () => {
  const token = localStorage.getItem("token"); // or sessionStorage

  if (!token) {
    console.error("User not logged in");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/articles/${selectedPost._id}/like`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ add this line
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Like error:", errorData.message);
      return;
    }

    const data = await res.json();
    setIsLiked(data.liked); // true or false
    setLikeCount(data.likes);
  } catch (error) {
    console.error("Like request failed:", error);
  }
};



  // If we're in write mode, show the write article component
  if (currentView === "write") {
    return (
      <WriteArticle onBack={handleBackToBlogs} onSubmit={handleArticleSubmit} />
    );
  }

  const featuredBlogs = publishedBlogs.filter((blog) => blog.featured);
  const trendingBlogs = [...publishedBlogs]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  if (selectedPost) {
    return (
      <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        {/* Header */}
        <header className="bg-white/20 px-6 py-4 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="default"
                size="sm"
                onClick={handleBackToBlogs}
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
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4" /> Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" /> Share
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-6 py-8 ">
          <div className="max-w-full mx-auto space-y-8">
            {/* Cover Image */}
            {selectedPost.image && (
              <Card className="overflow-hidden rounded-xl shadow-lg">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-96 object-cover"
                />
              </Card>
            )}

            {/* Article Meta & Title */}
            <Card className="border border-gray-200 bg-white/70">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl font-bold text-gray-900 ">
                  {selectedPost.title}
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 py-2">
                  {selectedPost.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Author + Meta */}
                <div className="flex items-center justify-between flex-wrap gap-4 my-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 ring-2 ring-indigo-100">
                      <AvatarImage src={selectedPost.author.avatar} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 text-sm font-bold">
                        {selectedPost.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedPost.author.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedPost.author.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />{" "}
                      {new Date(selectedPost.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {selectedPost.readTime} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />{" "}
                      {selectedPost.views.toLocaleString()} views
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="px-2 py-1 text-sm"
                    >
                      <Tag className="w-3 h-3 mr-1" /> {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Full Content */}
            <Card className="border border-gray-200 bg-white/70 py-4">
              <CardContent className="prose max-w-none text-gray-800 prose-lg leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />
              </CardContent>
            </Card>

            {/* Engagement Footer */}
            <Card className="border border-gray-200 bg-white/70 pt-4">
              <CardFooter className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleLike}
                    className={`flex gap-1 items-center ${
                      isLiked ? "bg-red-100 text-red-600" : "text-gray-600"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-red-600" : ""}`}
                    />
                    {likeCount}
                  </Button>

                  <Button
                    variant="outline"
                    className="hover:bg-blue-100 text-blue-600"
                  >
                    <MessageCircle className="w-4 h-4" />{" "}
                    {selectedPost.comments}
                  </Button>
                  <Button
                    variant="outline"
                    className="hover:bg-green-100 text-green-600"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </Button>
                </div>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {selectedPost.category}
                </Badge>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-md space-y-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Article Submitted Successfully!
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Your article <strong>"{submittedArticle?.title}"</strong> has
                  been submitted for review.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-yellow-800">
                        Waiting for Admin Approval
                      </p>
                      <p className="text-sm text-yellow-700">
                        Your article will be reviewed and published once
                        approved. You’ll receive a notification when the status
                        changes.
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
      <header className="px-6 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
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
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Search and Filters */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 pt-5 space-y-5">
            <div className="flex flex-col lg:flex-row gap-5">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search blogs, topics, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              {/* Category Dropdown */}
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 w-full"
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

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/20 rounded-lg px-5">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-[#1b0c3f] data-[state=active]:text-white"
              >
                All Posts
              </TabsTrigger>
              <TabsTrigger
                value="featured"
                className="data-[state=active]:bg-[#1b0c3f] data-[state=active]:text-white"
              >
                Featured
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="data-[state=active]:bg-[#1b0c3f] data-[state=active]:text-white"
              >
                Trending
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8 px-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <Card
                      key={i}
                      className="animate-pulse border-gray-200 rounded-xl"
                    >
                      <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                      <CardContent className="p-6 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
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
                      key={blog._id}
                      onClick={() => handleBlogClick(blog)}
                      className="group relative rounded-2xl border border-gray-200 bg-white/40 backdrop-blur-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden rounded-t-2xl">
                        <img
                          src={blog.image || "/placeholder.svg"}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {blog.featured && (
                          <Badge className="absolute top-3 left-3 bg-yellow-400 text-white text-xs shadow-md">
                            ⭐ Featured
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content */}
                      <CardContent className="p-5 space-y-4 pt-2">
                        {/* Meta: Category + Read Time */}
                        <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                          <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md">
                            {blog.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{blog.readTime} min read</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 leading-snug group-hover:text-indigo-700 transition-colors">
                          {blog.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-1">
                          {blog.excerpt}
                        </p>

                        {/* Tags */}
                        {blog.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {blog.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer: Author + Stats */}
                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                          {/* Author */}
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 ring-2 ring-white shadow-md">
                              <AvatarImage
                                src={blog.author.avatar || "/placeholder.svg"}
                                alt={blog.author.name}
                              />
                              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                                {blog.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {blog.author.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {blog.author.role}
                              </p>
                            </div>
                          </div>

                          {/* Stats */}
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

            <TabsContent value="featured" className="mt-8 px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredBlogs.map((blog) => (
                  <Card
                    key={blog._id}
                    onClick={() => handleBlogClick(blog)}
                    className="group relative rounded-2xl border border-gray-200 bg-white/40 backdrop-blur-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden rounded-t-2xl">
                      <img
                        src={blog.image || "/placeholder.svg"}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {blog.featured && (
                        <Badge className="absolute top-3 left-3 bg-yellow-400 text-white text-xs shadow-md">
                          ⭐ Featured
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <CardContent className="p-5 space-y-4 pt-2">
                      {/* Meta: Category + Read Time */}
                      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                        <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md">
                          {blog.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{blog.readTime} min read</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 leading-snug group-hover:text-indigo-700 transition-colors">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-1">
                        {blog.excerpt}
                      </p>

                      {/* Tags */}
                      {blog.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer: Author + Stats */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                        {/* Author */}
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9 ring-2 ring-white shadow-md">
                            <AvatarImage
                              src={blog.author.avatar || "/placeholder.svg"}
                              alt={blog.author.name}
                            />
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                              {blog.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {blog.author.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {blog.author.role}
                            </p>
                          </div>
                        </div>

                        {/* Stats */}
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

            <TabsContent value="trending" className="mt-8 px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingBlogs.map((blog, index) => (
                  <Card
                    key={blog._id}
                    onClick={() => handleBlogClick(blog)}
                    className="group relative rounded-2xl border border-gray-200 bg-white/40 backdrop-blur-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white shadow-lg z-10">
                      🔥 #{index + 1} Trending
                    </Badge>

                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden rounded-t-2xl">
                      <img
                        src={blog.image || "/placeholder.svg"}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <CardContent className="p-5 space-y-4 pt-2">
                      {/* Meta: Category + Read Time */}
                      <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                        <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md">
                          {blog.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{blog.readTime} min read</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 leading-snug group-hover:text-indigo-700 transition-colors">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-1">
                        {blog.excerpt}
                      </p>

                      {/* Tags */}
                      {blog.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Footer: Author + Stats */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                        {/* Author */}
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9 ring-2 ring-white shadow-md">
                            <AvatarImage
                              src={blog.author.avatar || "/placeholder.svg"}
                              alt={blog.author.name}
                            />
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                              {blog.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {blog.author.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {blog.author.role}
                            </p>
                          </div>
                        </div>

                        {/* Stats */}
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
