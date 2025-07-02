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
  const sampleProject = {
    title: "MetaCashBack",
    description:
      "MetaCashback gives you USDC rewards for purchases with your Wallet. Coming soon to the MetaMask Card. Boost your cashba...",
    logo: "/placeholder.svg?height=120&width=120",
    demoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    longDescription:
      "When we heard about the Hackathon, we reviewed all the categories and began brainstorming several ideas. In the end, we concluded that one of the most effective ways to popularize the use of a card like MetaMask's was through a CashBack system. By enhancing it with practices like staking and DeFi protocols, we realized we could build a powerful tool to help users improve their personal finances.",
    technologies: [
      "DeFi",
      "Staking",
      "Li.Fi",
      "MetaMaskSDK",
      "DeFiLlama API",
      "Wagmi",
      "NextJS",
      "Solidity"
    ],
    hackathon: "MetaMask Card Dev Cook-Off",
    hackathonStatus: "Live",
    daysLeft: "2 days left",
    prizeTrack:
      "Build the Future of Onchain Payments with the MetaMask Card, Li.Fi and USDC",
    schedule: "Registration",
    submissionType: "Team project",
    team: [
      {
        name: "Miguel Alejandro",
        role: "Team Leader",
        avatar: "/placeholder.svg?height=40&width=40"
      },
      {
        name: "Sarah Chen",
        role: "Frontend Developer",
        avatar: "/placeholder.svg?height=40&width=40"
      },
      {
        name: "Alex Rodriguez",
        role: "Smart Contract Developer",
        avatar: "/placeholder.svg?height=40&width=40"
      }
    ],
    githubLink: "https://github.com/Ni...",
    sector: "DeFi",
    teamIntro:
      "We are a multidisciplinary team passionate about Web3 technology, user-centered design, and decentralized finance. We combine expertise in full-stack development, UI/UX design, and DeFi strategies to",
    ...project
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <Heart className="w-4 h-4" />7
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className=" px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <img
                src={sampleProject.logo || "/placeholder.svg"}
                alt="Project Logo"
                className="w-20 h-20 object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {sampleProject.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-4xl">
                {sampleProject.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3 ">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-[#1b0c3f]"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="hackathon"
                    className="data-[state=active]:bg-[#1b0c3f]"
                  >
                    Hackathon
                  </TabsTrigger>
                  <TabsTrigger
                    value="team"
                    className="data-[state=active]:bg-[#1b0c3f]"
                  >
                    Team
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      Videos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">
                        Demo Video
                      </h3>
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-900">
                        {sampleProject.demoUrl ? (
                          <iframe
                            src={sampleProject.demoUrl}
                            title="Demo Video"
                            className="w-full h-full"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white">
                            <Play className="w-16 h-16" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Progress During Hackathon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {sampleProject.longDescription}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Tech Stack
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {sampleProject.technologies.map(tech => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="px-3 py-1"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Hackathon Tab */}
              <TabsContent value="hackathon" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Submitted Hackathon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            MetaMask Card Dev Cook-Off
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Build the Future of Onchain Payments with the
                            MetaMask Card, Li.Fi and USDC
                          </p>
                          <div className="flex gap-2 mb-4">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              Live
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-blue-600 border-blue-200"
                            >
                              <Clock className="w-3 h-3 mr-1" />2 days left
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">Prize Track</p>
                            <p className="font-medium">Registration</p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">
                              Submission Type
                            </p>
                            <p className="font-medium">Team project</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                              <Award className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">
                              META Developer
                            </span>
                          </div>
                          <h4 className="text-xl font-bold mb-2">
                            MetaMask Dev Cook-Off
                          </h4>
                          <p className="text-sm opacity-90 mb-4">
                            MetaMask Card Edition
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>$40,000 prize pool</span>
                            <span>in partnership with CIRCLE and Li.Fi</span>
                          </div>
                        </div>
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Team Tab */}
              <TabsContent value="team" className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Intro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {sampleProject.teamIntro}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sampleProject.team.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 rounded-lg bg-gray-50"
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={member.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                              {member.name
                                .split(" ")
                                .map(n => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {member.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {member.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-500">
                  Team Leader
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      MA
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Miguel Alejandro ...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-500">Github</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Github Link</p>
                    <a
                      href={sampleProject.githubLink}
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      https://github.com/Ni...
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-500">Sector</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Layers className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {sampleProject.sector}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
