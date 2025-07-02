"use client"

import {
  ArrowLeft,
  Github,
  Heart,
  Share2,
  Users,
  ExternalLink,
  Play,
  Clock,
  Award,
  Code,
  Layers
} from "lucide-react"
import { Button } from "./button"
import { Badge } from "./badge"
import { Avatar, AvatarFallback, AvatarImage } from "../DashboardUI/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"
import { Card, CardContent, CardHeader, CardTitle } from "./card"

export function ProjectDetail({ project, onBack }) {
  if (!project) return <p>Loading...</p>

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2 hover:bg-gray-100">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Heart className="w-4 h-4" /> 7
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className=" px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
<img src={project.logo?.url || "/placeholder.svg"} alt="Project Logo" className="w-20 h-20 object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.title}</h1>
             {project.oneLineIntro && (
  <p className="text-gray-700 italic text-md mb-2">{project.oneLineIntro}</p>
)}


            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="hackathon">Hackathon</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-8">
                <Card>
                  <CardHeader><CardTitle><Play className="w-5 h-5" /> Videos</CardTitle></CardHeader>
                  <CardContent>
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-900">
                      {project.videoLink ? (
                        <iframe src={project.videoLink} title="Demo Video" className="w-full h-full" allowFullScreen />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <Play className="w-16 h-16" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
{project.description && (
<div className="text-gray-600 text-lg leading-relaxed max-w-4xl" dangerouslySetInnerHTML={{ __html: project.description }} />

)}
               

         {project.skills && project.skills.length > 0 && (
  <Card>
    <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2">
        {project.skills.map((skill, index) => (
          <Badge key={index} variant="outline" className="px-3 py-1">{skill}</Badge>
        ))}
      </div>
    </CardContent>
  </Card>
)}

              </TabsContent>

              <TabsContent value="hackathon" className="space-y-8">
                {project.hackathon ? (
                  <Card>
                    <CardHeader><CardTitle>Submitted Hackathon</CardTitle></CardHeader>
                    <CardContent>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.hackathon.name}</h3>
                      <p className="text-gray-600 mb-4">{project.hackathon.prizeTrack || "Prize track info"}</p>
                      <p className="text-sm text-gray-500">Status: {project.hackathon.status || "Unknown"}</p>
                    </CardContent>
                  </Card>
                ) : <p>No hackathon linked.</p>}
              </TabsContent>

              <TabsContent value="team" className="space-y-8">
                {project.teamIntro && (
                  <Card>
                    <CardHeader><CardTitle>Team Intro</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">{project.teamIntro}</p>
                    </CardContent>
                  </Card>
                )}
                {(project.team || []).length > 0 && (
                  <Card>
                    <CardHeader><CardTitle><Users className="w-5 h-5" /> Team Members</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {project.team.map((member, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{member.name?.[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {project.submittedBy && (
              <Card>
                <CardHeader><CardTitle className="text-sm text-gray-500">Team Leader</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={project.submittedBy.profileImage || "/placeholder.svg"} />
                      <AvatarFallback>{project.submittedBy.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{project.submittedBy.name || "Unknown"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {project.repoLink && (
              <Card>
                <CardHeader><CardTitle className="text-sm text-gray-500">Github</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                      <Github className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Repository</p>
                      <a href={project.repoLink} target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        {project.repoLink} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {project.category && (
              <Card>
                <CardHeader><CardTitle className="text-sm text-gray-500">Sector</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Layers className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{project.category}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
