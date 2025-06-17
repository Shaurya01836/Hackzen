"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
} from "recharts"
import { DollarSign, TrendingUp, CreditCard, Target, Download, Calendar } from "lucide-react"

const revenueData = [
  { month: "Jan", subscription: 15000, ads: 3500, premium: 2800, total: 21300 },
  { month: "Feb", subscription: 18200, ads: 4200, premium: 3400, total: 25800 },
  { month: "Mar", subscription: 16800, ads: 3800, premium: 3100, total: 23700 },
  { month: "Apr", subscription: 22500, ads: 5100, premium: 4200, total: 31800 },
  { month: "May", subscription: 20100, ads: 4600, premium: 3800, total: 28500 },
  { month: "Jun", subscription: 25800, ads: 6200, premium: 5100, total: 37100 },
]

const revenueSourceData = [
  { name: "Subscriptions", value: 68, color: "#8B5CF6", amount: "$128,400" },
  { name: "Advertisements", value: 22, color: "#3B82F6", amount: "$41,600" },
  { name: "Premium Features", value: 10, color: "#10B981", amount: "$18,900" },
]

const transactions = [
  {
    id: 1,
    type: "Subscription",
    customer: "TechCorp Inc.",
    amount: "$2,499",
    plan: "Enterprise Annual",
    date: "2024-01-21",
    status: "Completed",
  },
  {
    id: 2,
    type: "Advertisement",
    customer: "StartupHub",
    amount: "$850",
    plan: "Banner Ad - 30 days",
    date: "2024-01-20",
    status: "Completed",
  },
  {
    id: 3,
    type: "Premium",
    customer: "Individual User",
    amount: "$49",
    plan: "Pro Monthly",
    date: "2024-01-20",
    status: "Completed",
  },
  {
    id: 4,
    type: "Subscription",
    customer: "GreenTech Ventures",
    amount: "$999",
    plan: "Business Annual",
    date: "2024-01-19",
    status: "Pending",
  },
  {
    id: 5,
    type: "Advertisement",
    customer: "HealthTech Alliance",
    amount: "$1,200",
    plan: "Sponsored Event",
    date: "2024-01-18",
    status: "Completed",
  },
]

export function RevenuePage() {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Failed":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "Subscription":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "Advertisement":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "Premium":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Revenue & Ads Management</h1>
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

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">$188,900</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +24.5% from last period
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
                <p className="text-gray-400 text-sm">Monthly Recurring</p>
                <p className="text-2xl font-bold text-white">$25,800</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18.2% MoM growth
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ad Revenue</p>
                <p className="text-2xl font-bold text-white">$41,600</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +32% from last period
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
                <p className="text-gray-400 text-sm">Avg. Transaction</p>
                <p className="text-2xl font-bold text-white">$847</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% increase
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                $
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
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
                  dataKey="total"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="subscription"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="ads"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Sources */}
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              Revenue Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueSourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {revenueSourceData.map((entry, index) => (
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
            <div className="mt-4 space-y-2">
              {revenueSourceData.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: source.color }} />
                    <span className="text-gray-300 text-sm">{source.name}</span>
                  </div>
                  <span className="text-white font-semibold">{source.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-black/20 backdrop-blur-xl border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-purple-400" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-500/20">
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300">Customer</TableHead>
                <TableHead className="text-gray-300">Plan/Service</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-purple-500/20 hover:bg-white/5">
                  <TableCell>
                    <Badge className={getTypeColor(transaction.type)}>{transaction.type}</Badge>
                  </TableCell>
                  <TableCell className="text-white font-medium">{transaction.customer}</TableCell>
                  <TableCell className="text-gray-300">{transaction.plan}</TableCell>
                  <TableCell className="text-green-400 font-semibold">{transaction.amount}</TableCell>
                  <TableCell className="text-gray-300">{transaction.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
