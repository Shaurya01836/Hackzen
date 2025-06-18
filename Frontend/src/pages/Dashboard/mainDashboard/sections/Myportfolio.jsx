"use client"
import {
  ArrowLeft,
  Award,
  Trophy,
  Star,
  Github,
  ExternalLink,
  Calendar,
  TrendingUp
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
import { Avatar, AvatarFallback, AvatarImage } from "../../AdimPage/components/ui/avatar"
import { Progress } from "../../AdimPage/components/ui/progress"

const achievements = [
  {
    id: 1,
    title: "First Place Winner",
    description: "Won 1st place in Web3 Builder Fest",
    icon: "🥇",
    date: "Nov 2024",
    hackathon: "Web3 Builder Fest"
  },
  {
    id: 2,
    title: "AI Innovation Badge",
    description: "Completed AI Innovation Challenge",
    icon: "🤖",
    date: "Dec 2024",
    hackathon: "AI Innovation Challenge"
  },
  {
    id: 3,
    title: "Team Player",
    description: "Successfully collaborated in 5+ hackathons",
    icon: "🤝",
    date: "Dec 2024",
    hackathon: "Multiple Events"
  },
  {
    id: 4,
    title: "Quick Starter",
    description: "Submitted project within first 24 hours",
    icon: "⚡",
    date: "Oct 2024",
    hackathon: "Mobile App Marathon"
  }
]

const skills = [
  { name: "React", level: 90, category: "Frontend" },
  { name: "Node.js", level: 85, category: "Backend" },
  { name: "Python", level: 80, category: "Backend" },
  { name: "TypeScript", level: 88, category: "Language" },
  { name: "Machine Learning", level: 75, category: "AI/ML" },
  { name: "Blockchain", level: 70, category: "Web3" },
  { name: "UI/UX Design", level: 65, category: "Design" },
  { name: "DevOps", level: 60, category: "Infrastructure" }
]

const projects = [
  {
    id: 1,
    name: "Smart City Dashboard",
    description: "AI-powered dashboard for urban management",
    technologies: ["React", "TensorFlow", "Node.js"],
    github: "github.com/user/smart-city",
    demo: "smartcity-demo.vercel.app",
    hackathon: "AI Innovation Challenge",
    rank: 3,
    score: 85
  },
  {
    id: 2,
    name: "DeFi Trading Platform",
    description: "Decentralized trading with automated market making",
    technologies: ["Solidity", "Web3.js", "React"],
    github: "github.com/user/defi-platform",
    demo: "defi-trader.eth",
    hackathon: "Web3 Builder Fest",
    rank: 1,
    score: 92
  },
  {
    id: 3,
    name: "AI Chatbot Assistant",
    description: "Intelligent assistant for daily task management",
    technologies: ["Python", "OpenAI", "Flask"],
    github: "github.com/user/ai-chatbot",
    demo: "ai-assistant.netlify.app",
    hackathon: "AI Innovation Challenge",
    rank: null,
    score: null
  }
]

export function MyPortfolio({ onBack }) {
  const totalHackathons = 12
  const totalWins = 3
  const totalBadges = 8
  const currentRank = 95

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
          <h1 className="text-2xl font-bold text-gray-800">My Portfolio</h1>
          <p className="text-sm text-gray-500">
            Showcase your hackathon achievements and skills
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">John Doe</CardTitle>
                  <CardDescription className="mt-1">
                    Full-stack developer passionate about AI and blockchain
                    technology. Love building innovative solutions and
                    collaborating with amazing teams.
                  </CardDescription>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      <Github className="w-3 h-3 mr-1" />
                      GitHub
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Portfolio
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-5 text-center">
                <Trophy className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-indigo-600">
                  {totalHackathons}
                </p>
                <p className="text-sm text-gray-600">Hackathons</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{totalWins}</p>
                <p className="text-sm text-gray-600">Wins</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">
                  {totalBadges}
                </p>
                <p className="text-sm text-gray-600">Badges</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  #{currentRank}
                </p>
                <p className="text-sm text-gray-600">Global Rank</p>
              </CardContent>
            </Card>
          </div>

          {/* Featured Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Projects</CardTitle>
              <CardDescription>Your best hackathon submissions</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {projects.map(project => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {project.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        from {project.hackathon}
                      </p>
                    </div>
                    {project.rank && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        #{project.rank}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.map(tech => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  {project.score && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Score</span>
                        <span className="font-medium">{project.score}/100</span>
                      </div>
                      <Progress value={project.score} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Github className="w-3 h-3 mr-1" />
                      Code
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Demo
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Technologies</CardTitle>
              <CardDescription>
                Your technical expertise across different domains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map(skill => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">
                          {skill.name}
                        </span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {skill.category}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {skill.level}%
                      </span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Achievements</CardTitle>
              <CardDescription>Your latest badges and awards</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {achievement.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Timeline</CardTitle>
              <CardDescription>Your recent hackathon activity</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Submitted AI Chatbot</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Joined AI Challenge</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Won Web3 Builder Fest</p>
                    <p className="text-xs text-gray-500">3 weeks ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Portfolio Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                Share Portfolio
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Github className="w-4 h-4 mr-2" />
                Export to GitHub
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Award className="w-4 h-4 mr-2" />
                View All Badges
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
