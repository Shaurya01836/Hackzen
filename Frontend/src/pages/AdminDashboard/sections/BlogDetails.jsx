"use client"
import { useState } from "react"
import {
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  Tag,
  BookOpenText,
  Share2,
  Heart,
  X
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/CommonUI/card"
import { Button } from "../../../components/CommonUI/button"
import { Badge } from "../../../components/CommonUI/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/CommonUI/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/DashboardUI/avatar"

export default function BlogDetails({ blog, onBack }) {
  const [isSaved, setIsSaved] = useState(false)

  if (!blog) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="w-full max-w-5xl h-[90vh] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm relative z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
              Close
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSaved(!isSaved)}
              className={`gap-2 ${
                isSaved
                  ? "text-red-500 border-red-500 bg-red-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-gray-50 bg-transparent"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Hero Image - Full Width */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={blog.image || "/placeholder.svg?height=400&width=800"}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(blog.publishedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {blog.readTime} min read
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {blog.views} views
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Author Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="w-12 h-12">
                <AvatarImage src={blog.author?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{blog.author?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">
                  {blog.author?.name || "Anonymous"}
                </p>
                <p className="text-sm text-gray-600">
                  {blog.author?.role || "Content Creator"}
                </p>
              </div>
            </div>

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-sm">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="prose max-w-none text-gray-800 leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpenText className="w-5 h-5" />
                        Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Publication Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge
                            variant={
                              blog.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {blog.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{blog.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Read Time:</span>
                          <span className="font-medium">
                            {blog.readTime} mins
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Publishing Info
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Published:</span>
                          <span className="font-medium">
                            {new Date(blog.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">
                            {new Date(blog.publishedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Statistics Tab */}
              <TabsContent value="stats" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-blue-600">
                        <Eye className="w-5 h-5" />
                        Views
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-gray-900">
                        {blog.views}
                      </p>
                      <p className="text-sm text-gray-600">Total page views</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <Heart className="w-5 h-5" />
                        Likes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-gray-900">
                        {blog.likes}
                      </p>
                      <p className="text-sm text-gray-600">
                        Reader appreciation
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <MessageSquare className="w-5 h-5" />
                        Comments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-gray-900">
                        {blog.comments}
                      </p>
                      <p className="text-sm text-gray-600">
                        Reader discussions
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Engagement Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Engagement Rate</span>
                        <span className="font-medium">
                          {(
                            ((blog.likes + blog.comments) / blog.views) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Comments per View</span>
                        <span className="font-medium">
                          {((blog.comments / blog.views) * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
