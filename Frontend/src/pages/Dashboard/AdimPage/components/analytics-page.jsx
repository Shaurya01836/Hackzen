"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Users, Target, DollarSign, Download, Calendar } from "lucide-react"

const monthlyData = [
  { month: "Jan", users: 1200, hackathons: 12, revenue: 15000, submissions: 450 },
  { month: "Feb", users: 1800, hackathons: 19, revenue: 22000, submissions: 680 },
  { month: "Mar", users: 2400, hackathons: 15, revenue: 18000, submissions: 520 },
  { month: "Apr", users: 3200, hackathons: 25, revenue: 35000, submissions: 890 },
  { month: "May", users: 2800, hackathons: 22, revenue: 28000, submissions: 750 },
  { month: "Jun", users: 3800, hackathons: 30, revenue: 42000, submissions: 1200 },
]

const userGrowthData = [
  { month: "Jan", newUsers: 450, totalUsers: 8500 },
  { month: "Feb", newUsers: 680, totalUsers: 9180 },
  { month: "Mar", newUsers: 520, totalUsers: 9700 },
  { month: "Apr", newUsers: 890, totalUsers: 10590 },
  { month: "May", newUsers: 750, totalUsers: 11340 },
  { month: "Jun", newUsers: 1200, totalUsers: 12540 },
]

const categoryData = [
  { name: "AI/ML", value: 35, color: "#8B5CF6" },
  { name: "Web Dev", value: 28, color: "#3B82F6" },
  { name: "Mobile", value: 18, color: "#10B981" },
  { name: "Blockchain", value: 12, color: "#F59E0B" },
  { name: "IoT", value: 7, color: "#EF4444" },
]

const engagementData = [
  { day: "Mon", sessions: 1200, duration: 45 },
  { day: "Tue", sessions: 1800, duration: 52 },
  { day: "Wed", sessions: 1600, duration: 48 },
  { day: "Thu", sessions: 2200, duration: 58 },
  { day: "Fri", sessions: 2800, duration: 62 },
  { day: "Sat", sessions: 2400, duration: 55 },
  { day: "Sun", sessions: 1900, duration: 49 },
]

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-purple-500/20 text-white hover:bg-white/5">
            <Calendar className="w-4 h-4 mr-2" />
            Last 6 Months
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold text-white">12,847</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18.2% from last month
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Hackathons</p>
                <p className="text-2xl font-bold text-white">123</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +25% from last month
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">$160K</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +32% from last month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. Engagement</p>
                <p className="text-2xl font-bold text-white">4.2h</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                T
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Overview */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart className="w-5 h-5 mr-2 text-purple-400" />
              Monthly Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Bar dataKey="hackathons" fill="#8B5CF6" name="Hackathons" />
                <Bar dataKey="submissions" fill="#3B82F6" name="Submissions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              User Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Area type="monotone" dataKey="totalUsers" stroke="#10B981" fill="url(#colorUsers)" strokeWidth={2} />
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              Hackathon Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Engagement */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-yellow-400" />
              Weekly Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(168, 85, 247, 0.3)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <h3 className="text-green-300 font-semibold mb-2">Top Performing Category</h3>
              <p className="text-white text-lg">AI/ML Hackathons</p>
              <p className="text-gray-400 text-sm">35% of all events, 4.8★ avg rating</p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h3 className="text-blue-300 font-semibold mb-2">Peak Activity Day</h3>
              <p className="text-white text-lg">Friday</p>
              <p className="text-gray-400 text-sm">2,800 sessions, 62min avg duration</p>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <h3 className="text-purple-300 font-semibold mb-2">User Retention</h3>
              <p className="text-white text-lg">78%</p>
              <p className="text-gray-400 text-sm">30-day retention rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
