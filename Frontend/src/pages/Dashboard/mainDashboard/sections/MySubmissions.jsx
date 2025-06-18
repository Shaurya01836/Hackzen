"use client"
import {
  ArrowLeft,
  FileText,
  Github,
  Youtube,
  Award,
  ExternalLink,
  Upload
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../AdimPage/components/ui/card"
import { Button } from "../../AdimPage/components/ui/button"
import { Badge } from "../../AdimPage/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../AdimPage/components/ui/tabs"

const submissions = [
  {
    id: 1,
    name: "Smart City Dashboard",
    hackathon: "AI Innovation Challenge",
    github: "github.com/user/smart-city",
    youtube: "youtube.com/watch?v=abc",
    demo: "smartcity-demo.vercel.app",
    status: "Judged",
    score: 85,
    rank: 3,
    submittedDate: "Dec 20, 2024",
    description:
      "A comprehensive dashboard for smart city management using AI and IoT data",
    technologies: ["React", "Node.js", "TensorFlow", "MongoDB"],
    feedback: "Great implementation of AI algorithms. UI could be improved."
  },
  {
    id: 2,
    name: "AI Chatbot Assistant",
    hackathon: "AI Innovation Challenge",
    github: "github.com/user/ai-chatbot",
    youtube: "",
    demo: "ai-assistant.netlify.app",
    status: "Submitted",
    score: null,
    rank: null,
    submittedDate: "Dec 21, 2024",
    description:
      "An intelligent chatbot that helps users with daily tasks and queries",
    technologies: ["Python", "OpenAI", "Flask", "React"],
    feedback: null
  },
  {
    id: 3,
    name: "DeFi Trading Platform",
    hackathon: "Web3 Builder Fest",
    github: "github.com/user/defi-platform",
    youtube: "youtube.com/watch?v=xyz",
    demo: "defi-trader.eth",
    status: "Judged",
    score: 92,
    rank: 1,
    submittedDate: "Nov 26, 2024",
    description:
      "A decentralized trading platform with automated market making",
    technologies: ["Solidity", "Web3.js", "React", "Hardhat"],
    feedback: "Excellent smart contract implementation and user experience."
  }
]

export function MySubmissions({ onBack }) {
  const judgedSubmissions = submissions.filter(s => s.status === "Judged")
  const pendingSubmissions = submissions.filter(s => s.status === "Submitted")

  const renderSubmissionCard = submission => (
    <Card key={submission.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{submission.name}</CardTitle>
            <CardDescription className="mt-1">
              {submission.hackathon} • Submitted {submission.submittedDate}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={submission.status === "Judged" ? "default" : "secondary"}
            >
              {submission.status}
            </Badge>
            {submission.rank && (
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-200"
              >
                #{submission.rank}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <p className="text-sm text-gray-600">{submission.description}</p>

        <div className="flex flex-wrap gap-1">
          {submission.technologies.map(tech => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>

        {submission.score && (
          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
            <Award className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">
                Score: {submission.score}/100
              </p>
              {submission.rank && (
                <p className="text-sm text-green-600">
                  Ranked #{submission.rank}
                </p>
              )}
            </div>
          </div>
        )}

        {submission.feedback && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-1">
              Judge Feedback:
            </p>
            <p className="text-sm text-blue-700">{submission.feedback}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <Github className="w-3 h-3" />
            GitHub
          </Button>
          {submission.youtube && (
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <Youtube className="w-3 h-3" />
              Demo Video
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Live Demo
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Submissions</h1>
          <p className="text-sm text-gray-500">
            Track your project submissions and results
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{submissions.length}</p>
                <p className="text-sm text-gray-500">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{judgedSubmissions.length}</p>
                <p className="text-sm text-gray-500">Judged</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Upload className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {pendingSubmissions.length}
                </p>
                <p className="text-sm text-gray-500">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Submissions ({submissions.length})
          </TabsTrigger>
          <TabsTrigger value="judged">
            Judged ({judgedSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingSubmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {submissions.map(renderSubmissionCard)}
          </div>
        </TabsContent>

        <TabsContent value="judged" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {judgedSubmissions.map(renderSubmissionCard)}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingSubmissions.map(renderSubmissionCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Pending Submissions
                </h3>
                <p className="text-gray-500 text-center">
                  All your submissions have been reviewed.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
