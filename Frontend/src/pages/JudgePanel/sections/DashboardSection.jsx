"use client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../../components/CommonUI/card"
import { Badge } from "../../../components/CommonUI/badge"
import { Button } from "../../../components/CommonUI/button"
import { Progress } from "../../../components/DashboardUI/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "../../../components/CommonUI/chart"
import {
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Eye,
  Star,
  Award,
  Calendar,
  Target
} from "lucide-react"

const dashboardStats = [
  {
    title: "Submissions Assigned",
    value: "24",
    change: "+3 from yesterday",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    trend: "up"
  },
  {
    title: "Reviewed Count",
    value: "12",
    change: "+5 today",
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    trend: "up"
  },
  {
    title: "Time Remaining",
    value: "2d 14h",
    change: "Until deadline",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    trend: "neutral"
  },
  {
    title: "Average Score",
    value: "7.8",
    change: "+0.3 this week",
    icon: Star,
    color: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    trend: "up"
  }
]

const trackData = [
  { name: "AI/ML", value: 8, color: "#3B82F6" },
  { name: "Web Dev", value: 6, color: "#10B981" },
  { name: "Mobile", value: 4, color: "#F59E0B" },
  { name: "IoT", value: 3, color: "#EF4444" },
  { name: "Blockchain", value: 3, color: "#8B5CF6" }
]

const scoreDistribution = [
  { range: "9-10", count: 3 },
  { range: "8-9", count: 5 },
  { range: "7-8", count: 8 },
  { range: "6-7", count: 4 },
  { range: "5-6", count: 2 }
]

const recentActivity = [
  {
    id: 1,
    action: "Reviewed",
    project: "EcoTrack - Carbon Monitor",
    score: 8.5,
    time: "2 hours ago",
    status: "completed"
  },
  {
    id: 2,
    action: "Started Review",
    project: "AI Study Buddy",
    score: null,
    time: "4 hours ago",
    status: "in-progress"
  },
  {
    id: 3,
    action: "Reviewed",
    project: "HealthConnect Telemedicine",
    score: 7.2,
    time: "1 day ago",
    status: "completed"
  }
]

export function DashboardSection() {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Enhanced Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/50"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
              <div>
                <CardTitle className="text-sm font-semibold text-gray-600 mb-1">
                  {stat.title}
                </CardTitle>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor} shadow-sm`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-center gap-2 text-sm">
                {stat.trend === "up" && (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                )}
                <span className="text-gray-600">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Progress Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Review Progress
            </CardTitle>
            <CardDescription>
              Your judging progress across all tracks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Overall Progress</span>
                <span className="text-sm text-gray-500 font-mono">
                  12/24 (50%)
                </span>
              </div>
              <Progress value={50} className="h-3 bg-gray-100" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {trackData.map(track => (
                <div key={track.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{track.name}</span>
                    <span className="text-gray-500">
                      {track.value} projects
                    </span>
                  </div>
                  <Progress
                    value={(track.value / 8) * 100}
                    className="h-2"
                    style={{
                      background: `linear-gradient(to right, ${track.color}20, ${track.color}10)`
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Highest Score</div>
                <div className="text-xl font-bold text-blue-600">9.2</div>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Reviews Today</div>
                <div className="text-xl font-bold text-emerald-600">5</div>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-xl font-bold text-orange-600">12</div>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Track Distribution</CardTitle>
            <CardDescription>Projects by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Projects",
                  color: "hsl(var(--chart-1))"
                }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trackData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {trackData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Your scoring patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-2))"
                }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest judging activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      activity.status === "completed"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {activity.status === "completed" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {activity.action} - {activity.project}
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {activity.score && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700"
                    >
                      Score: {activity.score}
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-blue-50 bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
