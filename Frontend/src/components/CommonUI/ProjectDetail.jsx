import {
  ArrowLeft,
  Github,
  ForkliftIcon as Fork,
  Heart,
  Share2,
  Users
} from "lucide-react"
import { Button } from "../CommonUI/button"
import { Badge } from "../CommonUI/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../DashboardUI/avatar"
import { Separator } from "../CommonUI/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../CommonUI/tabs"

export function ProjectDetail({ project, onBack }) {
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
              Back to Projects
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Like
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Title Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="flex items-center gap-4">
          <img
            src={project.logo || "/placeholder.svg"}
            alt="Project Logo"
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {project.title}
            </h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <div className="flex-1 overflow-auto px-6 py-8">
        <Tabs defaultValue="overview" className="max-w-6xl mx-auto w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hackathon">Hackathon</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-8">
              {project.demoUrl && (
                <div className="aspect-video w-full rounded-xl overflow-hidden">
                  <iframe
                    src={project.demoUrl}
                    title="Demo Video"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Project</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {project.longDescription}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Technology Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant="outline"
                      className="px-4 py-2 text-sm border-indigo-200 text-indigo-700 bg-indigo-50"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Hackathon Tab */}
          <TabsContent value="hackathon">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Hackathons Submitted</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {project.hackathons?.map((h, idx) => (
                  <li key={idx}>{h}</li>
                )) || <li>{project.hackathon}</li>}
              </ul>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Introduction</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {project.teamIntro || "Our team is passionate about solving real-world problems through innovative tech solutions."}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Team Members
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.team?.map((member, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 ring-2 ring-indigo-100">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                          {member.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                  )) || <p className="text-gray-600">No team data available.</p>}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}