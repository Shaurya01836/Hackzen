"use client"
import {
  ArrowLeft,
  Eye,
  Star,
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../../components/CommonUI/card"
import {
  ACard,
  ACardContent,
  ACardDescription,
  ACardHeader,
  ACardTitle
} from "../../../components/DashboardUI/AnimatedCard"
import { Button } from "../../../components/CommonUI/button"
import { Badge } from "../../../components/CommonUI/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/DashboardUI/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/CommonUI/tabs"
import { useNavigate } from "react-router-dom";

const submissions = [
  {
    id: 1,
    projectName: "Smart City Dashboard",
    participant: {
      name: "Alex Chen",
      email: "alex.chen@email.com",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    hackathon: "AI Innovation Challenge",
    submittedDate: "Dec 20, 2024",
    status: "Pending Review",
    description:
      "A comprehensive dashboard for smart city management using AI and IoT data visualization",
    technologies: ["React", "Node.js", "TensorFlow", "MongoDB", "D3.js"],
    githubUrl: "https://github.com/alexchen/smart-city-dashboard",
    demoUrl: "https://smartcity-demo.vercel.app",
    videoUrl: "https://youtube.com/watch?v=abc123",
    score: null,
    feedback: null,
    judgeAssigned: null
  },
  {
    id: 2,
    projectName: "AI Chatbot Assistant",
    participant: {
      name: "Sarah Kim",
      email: "sarah.kim@email.com",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    hackathon: "AI Innovation Challenge",
    submittedDate: "Dec 21, 2024",
    status: "Under Review",
    description:
      "An intelligent chatbot that helps users with daily tasks and provides personalized recommendations",
    technologies: ["Python", "OpenAI", "Flask", "React", "PostgreSQL"],
    githubUrl: "https://github.com/sarahkim/ai-chatbot",
    demoUrl: "https://ai-assistant.netlify.app",
    videoUrl: "",
    score: null,
    feedback: null,
    judgeAssigned: "Dr. Jane Smith"
  },
  {
    id: 3,
    projectName: "Blockchain Voting System",
    participant: {
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    hackathon: "Web3 Builder Fest",
    submittedDate: "Nov 26, 2024",
    status: "Reviewed",
    description:
      "A secure and transparent voting system built on blockchain technology",
    technologies: ["Solidity", "Web3.js", "React", "Hardhat", "IPFS"],
    githubUrl: "https://github.com/mikejohnson/blockchain-voting",
    demoUrl: "https://voting-dapp.eth",
    videoUrl: "https://youtube.com/watch?v=xyz789",
    score: 88,
    feedback:
      "Excellent implementation of blockchain concepts. The smart contracts are well-written and secure. The user interface could be more intuitive for non-technical users.",
    judgeAssigned: "Prof. Robert Lee"
  },
  {
    id: 4,
    projectName: "Mental Health Tracker",
    participant: {
      name: "Emily Davis",
      email: "emily.davis@email.com",
      avatar: "/placeholder.svg?height=40&width=40"
    },
    hackathon: "AI Innovation Challenge",
    submittedDate: "Dec 19, 2024",
    status: "Needs Revision",
    description:
      "A mobile app that tracks mental health patterns and provides AI-powered insights",
    technologies: ["Flutter", "Firebase", "Python", "TensorFlow"],
    githubUrl: "https://github.com/emilydavis/mental-health-tracker",
    demoUrl: "",
    videoUrl: "https://youtube.com/watch?v=def456",
    score: 65,
    feedback:
      "Good concept and implementation. However, the AI model needs improvement and the app requires better data privacy measures.",
    judgeAssigned: "Dr. Michael Brown"
  }
]

export function ReviewSubmissions({ onBack }) {
   const navigate = useNavigate();
  const pendingSubmissions = submissions.filter(
    s => s.status === "Pending Review"
  )
  const underReviewSubmissions = submissions.filter(
    s => s.status === "Under Review"
  )
  const reviewedSubmissions = submissions.filter(s => s.status === "Reviewed")
  const needsRevisionSubmissions = submissions.filter(
    s => s.status === "Needs Revision"
  )

  const getStatusIcon = status => {
    switch (status) {
      case "Pending Review":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "Under Review":
        return <Eye className="w-4 h-4 text-blue-500" />
      case "Reviewed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Needs Revision":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case "Pending Review":
        return "bg-yellow-500"
      case "Under Review":
        return "bg-blue-500"
      case "Reviewed":
        return "bg-green-500"
      case "Needs Revision":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const renderSubmissionCard = submission => (
    <Card key={submission.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={submission.participant.avatar || "/placeholder.svg"}
              />
              <AvatarFallback>
                {submission.participant.name
                  .split(" ")
                  .map(n => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {submission.projectName}
              </CardTitle>
              <CardDescription>
                by {submission.participant.name} • {submission.hackathon}
              </CardDescription>
              <p className="text-xs text-gray-500 mt-1">
                Submitted {submission.submittedDate}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(submission.status)}
            <Badge
              variant="outline"
              className={`${getStatusColor(submission.status)} text-white`}
            >
              {submission.status}
            </Badge>
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

        {submission.judgeAssigned && (
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Assigned to: {submission.judgeAssigned}</span>
          </div>
        )}

        {submission.score && (
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-medium">Score: {submission.score}/100</span>
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
          <Button size="sm" variant="outline">
            <Eye className="w-3 h-3 mr-1" />
            View Project
          </Button>
          <Button size="sm" variant="outline">
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
          {submission.status === "Pending Review" && (
            <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
              Start Review
            </Button>
          )}
          {submission.status === "Under Review" && (
            <Button size="sm" className="bg-green-500 hover:bg-green-600">
              Complete Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex-1 space-y-6 p-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      <div className="flex items-center gap-4">
         <Button
          variant="default"
          size="sm"
          onClick={() => {
            if (onBack) onBack();
            navigate("/dashboard");
          }}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Review Submissions
          </h1>
          <p className="text-sm text-gray-500">
            Evaluate and provide feedback on participant submissions
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {pendingSubmissions.length}
                </p>
                <p className="text-sm text-gray-500">Pending Review</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Eye className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">
                  {underReviewSubmissions.length}
                </p>
                <p className="text-sm text-gray-500">Under Review</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {reviewedSubmissions.length}
                </p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
        <ACard>
          <ACardContent className="pt-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">
                  {needsRevisionSubmissions.length}
                </p>
                <p className="text-sm text-gray-500">Needs Revision</p>
              </div>
            </div>
          </ACardContent>
        </ACard>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="reviewing">
            Under Review ({underReviewSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({reviewedSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="revision">
            Needs Revision ({needsRevisionSubmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingSubmissions.map(renderSubmissionCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Pending Reviews
                </h3>
                <p className="text-gray-500 text-center">
                  All submissions have been assigned for review.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviewing" className="space-y-4">
          {underReviewSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {underReviewSubmissions.map(renderSubmissionCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Eye className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Active Reviews
                </h3>
                <p className="text-gray-500 text-center">
                  No submissions are currently being reviewed.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {reviewedSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reviewedSubmissions.map(renderSubmissionCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Completed Reviews
                </h3>
                <p className="text-gray-500 text-center">
                  No submissions have been reviewed yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="revision" className="space-y-4">
          {needsRevisionSubmissions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {needsRevisionSubmissions.map(renderSubmissionCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Revisions Needed
                </h3>
                <p className="text-gray-500 text-center">
                  All reviewed submissions meet the requirements.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
