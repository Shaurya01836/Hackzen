"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card";
import { Badge } from "../../../components/CommonUI/badge";
import { Button } from "../../../components/CommonUI/button";
import {
  Users,
  Target,
  FileText,
  UserCheck,
  DollarSign,
  Headphones,
  TrendingUp,
  PieChartIcon as RechartsPieChart,
} from "lucide-react";
import {
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
} from "recharts";

const dashboardStats = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12%",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    badge: "Live",
  },
  {
    title: "Active Hackathons",
    value: "23",
    change: "+3",
    icon: Target,
    color: "from-blue-500 to-blue-600",
    badge: "Running",
  },
  {
    title: "Total Submissions",
    value: "1,456",
    change: "+89",
    icon: FileText,
    color: "from-green-500 to-green-600",
    badge: "Today",
  },
  {
    title: "Mentors Online",
    value: "127",
    change: "+5",
    icon: UserCheck,
    color: "from-yellow-500 to-yellow-600",
    badge: "Live",
  },
  {
    title: "Revenue This Month",
    value: "$24,890",
    change: "+18%",
    icon: DollarSign,
    color: "from-emerald-500 to-emerald-600",
    badge: "USD",
  },
  {
    title: "Support Tickets",
    value: "8",
    change: "-2",
    icon: Headphones,
    color: "from-red-500 to-red-600",
    badge: "Pending",
  },
];

const chartData = [
  { month: "Jan", hackathons: 12 },
  { month: "Feb", hackathons: 19 },
  { month: "Mar", hackathons: 15 },
  { month: "Apr", hackathons: 25 },
  { month: "May", hackathons: 22 },
  { month: "Jun", hackathons: 30 },
];

const pieData = [
  { name: "Participants", value: 8500, color: "#8B5CF6" },
  { name: "Organizers", value: 2800, color: "#3B82F6" },
  { name: "Mentors", value: 1200, color: "#10B981" },
  { name: "Judges", value: 347, color: "#F59E0B" },
];

export function Dashboard() {
  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 text-black">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Full Analytics
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className=""
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-700 border-purple-200"
                  >
                    {stat.badge}
                  </Badge>
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card className="">
          <CardHeader>
            <CardTitle className=" flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
              Hackathons Created Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
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
                <Line
                  type="monotone"
                  dataKey="hackathons"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: "#8B5CF6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center">
              <RechartsPieChart className="w-5 h-5 mr-2 text-blue-400" />
              User Roles Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
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
      </div>
    </div>
  );
}
