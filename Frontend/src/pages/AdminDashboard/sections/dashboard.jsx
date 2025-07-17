"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card";
import { RCard, RCardContent, RCardHeader, RCardTitle } from "../../../components/CommonUI/RippleCard";
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
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

const initialDashboardStats = [
  {
    title: "Total Users",
    value: "Loading...",
    change: "+0%",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    badge: "Live",
  },
  {
    title: "Active Hackathons",
    value: "Loading...",
    change: "+0",
    icon: Target,
    color: "from-blue-500 to-blue-600",
    badge: "Running",
  },
  {
    title: "Total Submissions",
    value: "Loading...",
    change: "+0",
    icon: FileText,
    color: "from-green-500 to-green-600",
    badge: "Today",
  },
  {
    title: "Mentors Online",
    value: "Loading...",
    change: "+0",
    icon: UserCheck,
    color: "from-yellow-500 to-yellow-600",
    badge: "Live",
  },
  {
    title: "Revenue This Month",
    value: "Loading...",
    change: "+0%",
    icon: DollarSign,
    color: "from-emerald-500 to-emerald-600",
    badge: "USD",
  },
  {
    title: "Support Tickets",
    value: "Loading...",
    change: "+0",
    icon: Headphones,
    color: "from-red-500 to-red-600",
    badge: "Pending",
  },
];

export function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState(initialDashboardStats);
  const [chartData, setChartData] = useState([
    { month: "Jan", hackathons: 0 },
    { month: "Feb", hackathons: 0 },
    { month: "Mar", hackathons: 0 },
    { month: "Apr", hackathons: 0 },
    { month: "May", hackathons: 0 },
    { month: "Jun", hackathons: 0 },
  ]);
  const [pieData, setPieData] = useState([
    { name: "Participants", value: 0, color: "#8B5CF6" },
    { name: "Organizers", value: 0, color: "#3B82F6" },
    { name: "Mentors", value: 0, color: "#10B981" },
    { name: "Judges", value: 0, color: "#F59E0B" },
  ]);
  const [chartType, setChartType] = useState("area"); // 'area', 'line', 'bar'

  useEffect(() => {
    fetchStats();
    fetchCharts();
  }, []);

  const fetchStats = async () => {
    let totalUsers = "N/A";
    let activeHackathons = "N/A";
    let totalSubmissions = "N/A";
    let submissionChange = "+0%";
    try {
      // Fetch total users
      const userStatsResponse = await fetch('/api/users/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (userStatsResponse.ok) {
        const userStats = await userStatsResponse.json();
        totalUsers = userStats.totalUsers?.toLocaleString() || "N/A";
      }
    } catch (e) {
      totalUsers = "N/A";
    }
    try {
      // Fetch active hackathons
      const hackathonStatsResponse = await fetch('/api/hackathons/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (hackathonStatsResponse.ok) {
        const hackathonStats = await hackathonStatsResponse.json();
        activeHackathons = hackathonStats.activeHackathons?.toString() || "N/A";
      }
    } catch (e) {
      activeHackathons = "N/A";
    }
    try {
      // Fetch total submissions
      const submissionStatsResponse = await fetch('/api/submission-form/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (submissionStatsResponse.ok) {
        const submissionStats = await submissionStatsResponse.json();
        totalSubmissions = submissionStats.totalSubmissions?.toLocaleString() || "N/A";
        submissionChange = submissionStats.submissionGrowthPercentage || "+0%";
      }
    } catch (e) {
      totalSubmissions = "N/A";
      submissionChange = "+0%";
    }
    setDashboardStats(prev => prev.map((stat, idx) => {
      if (idx === 0) return { ...stat, value: totalUsers };
      if (idx === 1) return { ...stat, value: activeHackathons };
      if (idx === 2) return { ...stat, value: totalSubmissions, change: submissionChange };
      return stat;
    }));
  };

  const fetchCharts = async () => {
    try {
      // Fetch line chart data
      const lineRes = await fetch('/api/hackathons/admin/monthly-stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (lineRes.ok) {
        let lineData = await lineRes.json();
        // Ensure last 12 months are always present
        const now = new Date();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const months = [];
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push(monthNames[d.getMonth()]);
        }
        const dataMap = {};
        lineData.forEach(d => { dataMap[d.month] = d.hackathons; });
        lineData = months.map(m => ({ month: m, hackathons: dataMap[m] || 0 }));
        setChartData(lineData);
      }
    } catch (e) {
      // leave as default
    }
    try {
      // Fetch user role breakdown for pie chart
      const pieRes = await fetch('/api/users/admin/role-breakdown', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (pieRes.ok) {
        const pieDataRaw = await pieRes.json();
        // Always show all roles in the same order
        const roleOrder = ["Participants", "Organizers", "Mentors", "Judges"];
        const pieDataFull = roleOrder.map(role => {
          const found = pieDataRaw.find(p => p.name === role);
          return found || { name: role, value: 0, color: pieData.find(p => p.name === role)?.color || "#ccc" };
        });
        setPieData(pieDataFull);
      }
    } catch (e) {
      // leave as default
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 text-black">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Full Analytics
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <RCard
              key={index}
              className=""
            >
              <RCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <RCardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </RCardTitle>
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
              </RCardHeader>
              <RCardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {stat.change} from last month
                </p>
              </RCardContent>
            </RCard>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line/Area/Bar Chart with selector */}
        <Card className="">
          <CardHeader>
            <CardTitle className=" flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-400" />
              Hackathons Created Over Time
            </CardTitle>
            <div className="mt-2">
              <label className="mr-2 font-medium text-sm">Chart Type:</label>
              <select
                value={chartType}
                onChange={e => setChartType(e.target.value)}
                className="border rounded px-2 py-1 text-sm bg-white text-black"
              >
                <option value="area">Area</option>
                <option value="line">Line</option>
                <option value="bar">Bar</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "area" && (
                <AreaChart data={chartData}>
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
                  <Area
                    type="monotone"
                    dataKey="hackathons"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.2}
                    strokeWidth={3}
                    dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: "#8B5CF6", strokeWidth: 2 }}
                  />
                </AreaChart>
              )}
              {chartType === "line" && (
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
              )}
              {chartType === "bar" && (
                <BarChart data={chartData}>
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
                  <Bar dataKey="hackathons" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center">
              <RechartsPieChart className="w-5 h-5 mr-2 text-indigo-400" />
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
