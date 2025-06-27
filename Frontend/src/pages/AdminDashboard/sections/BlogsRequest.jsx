"use client"

import { useEffect, useState } from "react"
import axios from "axios"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
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
  TableRow
} from "../../../components/AdminUI/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../../../components/AdminUI/dropdown-menu"
import { Search, Filter, Eye, Check, Clock, FileText, ActivityIcon } from "lucide-react"

import ModalBlogDetails from "./ModalBlogDetails"

export function BlogManage() {
  const [articles, setArticles] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const [selectedBlog, setSelectedBlog] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/articles/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        })
        setArticles(res.data)
      } catch (err) {
        console.error("Error fetching articles", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/articles/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      setArticles(prev => prev.map(a => (a._id === id ? { ...a, status } : a)))
    } catch (err) {
      console.error("Error updating article status", err)
    }
  }

  const filteredArticles = articles.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "All" || a.status === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusColor = status => {
    switch (status) {
      case "published":
        return "bg-green-500 text-white"
      case "pending":
        return "bg-yellow-500 text-white"
      case "draft":
        return "bg-gray-400 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (loading)
    return (
      <p className="text-center text-black font-semibold">
        Loading articles...
      </p>
    )

  return (
    <div className="space-y-6 p-4 md:p-8 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-3xl font-bold text-black">Manage Blogs</h1>
        <Badge variant="outline">
          <Clock className="w-4 h-4 mr-2" />
          {articles.filter(a => a.status === "pending").length} Pending
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
          <Input
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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
            {["All", "Pending", "Published", "Draft"].map(status => (
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

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-black text-lg">
            Articles ({filteredArticles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Author</TableHead>
                <TableHead className="text-black">Title</TableHead>
                <TableHead className="text-black">Status</TableHead>
                <TableHead className="text-black">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.map(article => (
                <TableRow key={article._id} className="hover:bg-gray-50">
                  <TableCell className="text-black font-medium">
                    {article.author?.name || "Anonymous"}
                  </TableCell>
                  <TableCell className="text-black font-medium">
                    {article.title}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(article.status)}>
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ActivityIcon className="w-4 h-4 text-black" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => setSelectedBlog(article)}
                        >
                          <Eye className="w-4 h-4 mr-2" /> View
                        </DropdownMenuItem>
                        {article.status !== "published" && (
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatus(article._id, "published")
                            }
                            className="text-green-600"
                          >
                            <Check className="w-4 h-4 mr-2" /> Publish
                          </DropdownMenuItem>
                        )}
                        {article.status !== "draft" && (
                          <DropdownMenuItem
                            onClick={() => updateStatus(article._id, "draft")}
                            className="text-gray-600"
                          >
                            <Clock className="w-4 h-4 mr-2" /> Mark Draft
                          </DropdownMenuItem>
                        )}
                        {article.status !== "pending" && (
                          <DropdownMenuItem
                            onClick={() => updateStatus(article._id, "pending")}
                            className="text-yellow-600"
                          >
                            <Clock className="w-4 h-4 mr-2" /> Mark Pending
                          </DropdownMenuItem>
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

      {selectedBlog && (
        <ModalBlogDetails
          isOpen={!!selectedBlog}
          onClose={() => setSelectedBlog(null)}
          blog={selectedBlog}
        />
      )}
    </div>
  )
}
