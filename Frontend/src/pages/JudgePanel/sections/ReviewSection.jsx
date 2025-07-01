"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../../components/CommonUI/card"
import { Badge } from "../../../components/CommonUI/badge"
import { Button } from "../../../components/CommonUI/button"
import { Textarea } from "../../../components/CommonUI/textarea"
import { Slider } from "../../../components/DashboardUI/slider"
import { Label } from "../../../components/CommonUI/label"
import { Progress } from "../../../components/DashboardUI/progress"
import {
  FileText,
  Users,
  Code,
  Play,
  ExternalLink,
  Send,
  Save,
  Star,
  Lightbulb,
  Zap,
  Palette,
  TrendingUp,
  Presentation,
  Github,
  Video,
  FileSliders,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

const projectData = {
  id: 1,
  title: "EcoTrack - Carbon Footprint Monitor",
  team: "Green Coders",
  track: "Sustainability",
  members: [
    {
      name: "Sarah Johnson",
      role: "Lead Developer",
      email: "sarah@greencoders.com"
    },
    {
      name: "Mike Chen",
      role: "UI/UX Designer",
      email: "mike@greencoders.com"
    },
    {
      name: "Alex Rodriguez",
      role: "Data Scientist",
      email: "alex@greencoders.com"
    }
  ],
  description: `EcoTrack is an innovative mobile application that helps individuals and organizations monitor their carbon footprint in real-time. The app uses AI to analyze daily activities and provides personalized recommendations for reducing environmental impact.

Key Features:
• Real-time carbon footprint tracking
• AI-powered recommendations
• Social sharing and challenges
• Integration with IoT devices
• Comprehensive analytics dashboard

The solution addresses the growing need for environmental awareness and provides actionable insights to help users make more sustainable choices in their daily lives.`,
  technologies: ["React Native", "Node.js", "MongoDB", "TensorFlow", "AWS"],
  links: {
    github: "https://github.com/greencoders/ecotrack",
    demo: "https://ecotrack-demo.vercel.app",
    video: "https://youtube.com/watch?v=demo",
    slides: "https://slides.com/ecotrack-presentation"
  },
  submitted: "2024-12-15T10:30:00Z",
  deadline: "2024-12-20T23:59:59Z"
}

const initialCriteria = [
  {
    name: "Innovation",
    weight: 25,
    score: 0,
    icon: Lightbulb,
    description: "Originality and creativity of the solution",
    color: "text-yellow-600 bg-yellow-50"
  },
  {
    name: "Technical Implementation",
    weight: 25,
    score: 0,
    icon: Zap,
    description: "Code quality and technical complexity",
    color: "text-blue-600 bg-blue-50"
  },
  {
    name: "User Experience",
    weight: 20,
    score: 0,
    icon: Palette,
    description: "Design and usability of the application",
    color: "text-purple-600 bg-purple-50"
  },
  {
    name: "Business Viability",
    weight: 15,
    score: 0,
    icon: TrendingUp,
    description: "Market potential and feasibility",
    color: "text-green-600 bg-green-50"
  },
  {
    name: "Presentation",
    weight: 15,
    score: 0,
    icon: Presentation,
    description: "Quality of demo and pitch",
    color: "text-red-600 bg-red-50"
  }
]

export function ReviewSection() {
  const [scores, setScores] = React.useState(initialCriteria)
  const [feedback, setFeedback] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDraft, setIsDraft] = React.useState(false)

  const updateScore = (index, newScore) => {
    const updatedScores = [...scores]
    updatedScores[index].score = newScore[0]
    setScores(updatedScores)
  }

  const totalScore = scores.reduce((sum, criterion) => {
    return sum + (criterion.score * criterion.weight) / 100
  }, 0)

  const handleSubmit = async (asDraft = false) => {
    setIsSubmitting(true)
    setIsDraft(asDraft)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsDraft(false)
  }

  const timeRemaining = () => {
    const now = new Date()
    const deadline = new Date(projectData.deadline)
    const diff = deadline.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return `${days}d ${hours}h`
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Project Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {projectData.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{projectData.team}</span>
                </div>
                <Badge variant="outline" className="bg-white/50">
                  {projectData.track}
                </Badge>
              </div>
            </div>

            <div className="text-right space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Deadline: {timeRemaining()} remaining</span>
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ready for Review
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Project Details - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Description */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Project Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {projectData.description}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team & Technologies */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectData.members.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name
                        .split(" ")
                        .map(n => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {member.name}
                      </div>
                      <div className="text-sm text-gray-600">{member.role}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-green-600" />
                  Technologies Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {projectData.technologies.map((tech, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-gradient-to-r from-gray-50 to-gray-100"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submission Links */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-indigo-600" />
                Submission Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-12 justify-start bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 group"
                >
                  <Github className="h-5 w-5 mr-3 group-hover:text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">GitHub Repository</div>
                    <div className="text-xs text-gray-500">
                      Source code & documentation
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-12 justify-start bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-green-100 group"
                >
                  <Play className="h-5 w-5 mr-3 group-hover:text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">Live Demo</div>
                    <div className="text-xs text-gray-500">
                      Interactive application
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-12 justify-start bg-gradient-to-r from-gray-50 to-white hover:from-red-50 hover:to-red-100 group"
                >
                  <Video className="h-5 w-5 mr-3 group-hover:text-red-600" />
                  <div className="text-left">
                    <div className="font-medium">Demo Video</div>
                    <div className="text-xs text-gray-500">
                      Project walkthrough
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-12 justify-start bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-purple-100 group"
                >
                  <FileSliders className="h-5 w-5 mr-3 group-hover:text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">Presentation</div>
                    <div className="text-xs text-gray-500">
                      Pitch deck slides
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scoring Panel - Right Column */}
        <div className="space-y-6">
          {/* Score Summary */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Current Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {totalScore.toFixed(1)}/10
                </div>
                <Progress value={totalScore * 10} className="h-3" />
                <div className="text-sm text-gray-600">
                  {totalScore === 0
                    ? "Not scored yet"
                    : totalScore < 5
                    ? "Needs improvement"
                    : totalScore < 7
                    ? "Good"
                    : totalScore < 8.5
                    ? "Very good"
                    : "Excellent"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scoring Criteria */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSliders className="h-5 w-5 text-blue-600" />
                Scoring Criteria
              </CardTitle>
              <CardDescription>Rate each aspect from 1-10</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {scores.map((criterion, index) => (
                <div key={criterion.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${criterion.color}`}>
                        <criterion.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          {criterion.name}
                        </Label>
                        <div className="text-xs text-gray-500">
                          {criterion.weight}% weight
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600">
                        {criterion.score}
                      </span>
                      <span className="text-sm text-gray-500">/10</span>
                    </div>
                  </div>

                  <Slider
                    value={[criterion.score]}
                    onValueChange={value => updateScore(index, value)}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {criterion.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Feedback & Comments
              </CardTitle>
              <CardDescription>
                Provide constructive feedback for the team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Share your thoughts on the project's strengths, areas for improvement, and suggestions for the team..."
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                rows={6}
                className="resize-none"
              />

              <div className="text-xs text-gray-500">
                {feedback.length}/1000 characters
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || totalScore === 0}
            >
              {isSubmitting && !isDraft ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting Score...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Final Score
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 bg-transparent"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
            >
              {isSubmitting && isDraft ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Saving Draft...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </>
              )}
            </Button>
          </div>

          {/* Warning */}
          {totalScore === 0 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Please score all criteria before submitting
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
