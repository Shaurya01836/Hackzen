"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  Tag,
  BookOpenText,
  User,
  Star,
  Share2,
  Heart,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../components/CommonUI/card";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/CommonUI/tabs";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/DashboardUI/avatar";

export default function BlogDetails({ blog, onBack }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!blog) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center overflow-auto p-4">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Close
            </Button>
            <h2 className="text-xl font-bold text-gray-800">{blog.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSaved(!isSaved)}
              className={`gap-2 ${isSaved ? "text-red-500 border-red-500" : ""}`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Article */}
            <div className="md:col-span-2 space-y-6">
              <img
                src={blog.image || "https://source.unsplash.com/random/800x400?article"}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-md"
              />

              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="author">Author</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpenText className="w-5 h-5" />
                        Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{blog.excerpt}</p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Card>
                      <CardContent className="py-4 space-y-1 text-sm text-gray-700">
                        <p><strong>Status:</strong> {blog.status}</p>
                        <p><strong>Category:</strong> {blog.category}</p>
                        <p><strong>Read Time:</strong> {blog.readTime} mins</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="py-4 space-y-1 text-sm text-gray-700">
                        <p><strong>Published:</strong> {new Date(blog.publishedAt).toLocaleString()}</p>
                        <p><strong>Views:</strong> {blog.views}</p>
                        <p><strong>Comments:</strong> {blog.comments}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {blog.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm">
                          <Tag className="w-3 h-3 mr-1" /> {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Content */}
                <TabsContent value="content" className="pt-4">
                  <Card>
                    <CardContent className="prose max-w-none text-gray-800">
                      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Author */}
                <TabsContent value="author" className="pt-4">
                  <Card>
                    <CardContent className="flex items-center gap-4 py-4">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={blog.author?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{blog.author?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{blog.author?.name || "Anonymous"}</p>
                        <p className="text-sm text-gray-500">{blog.author?.role || "Content Creator"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right column - Quick Info */}
            <div className="space-y-4 text-sm text-gray-700">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Likes:</strong> {blog.likes}</p>
                  <p><strong>Comments:</strong> {blog.comments}</p>
                  <p><strong>Views:</strong> {blog.views}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Status:</strong> {blog.status}</p>
                  <p><strong>Created:</strong> {new Date(blog.publishedAt).toLocaleDateString()}</p>
                  <p><strong>Category:</strong> {blog.category}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
