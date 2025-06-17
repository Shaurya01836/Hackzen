"use client"
import {
  ArrowLeft,
  BarChart3,
  Download,
  Settings,
  Users,
  Trophy,
  MessageSquare,
  Award,
  FileText,
  Calendar
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
import { Progress } from "../../AdimPage/components/ui/progress"

const analyticsData = {
  totalEvents: 12,
  activeEvents: 3,
  totalParticipants: 1247,
  totalSubmissions: 892,
  averageRating: 4.7,
  completionRate: 78,
  monthlyGrowth: 23,
  topPerformingEvent: "AI Innovation Challenge"
}

const recentActivity = [
  {
    id: 1,
    action: "New participant registered",
    event: "AI Innovation Challenge",
    time: "2 minutes ago",
    type: "registration"
  },
  {
    id: 2,
    action: "Project submitted",
    event: "Cybersecurity Challenge",
    time: "15 minutes ago",
    type: "submission"
  },
  {
    id: 3,
    action: "Judge assigned",
    event: "Web3 Builder Fest",
    time: "1 hour ago",
    type: "judging"
  },
  {
    id: 4,
    action: "Announcement sent",
    event: "All Events",
    time: "2 hours ago",
    type: "communication"
  }
]

const quickActions = [
  {
    title: "Export Participant Data",
    description: "Download CSV of all participant information",
    icon: Download,
    action: "export-participants",
    category: "Data Management"
  },
  {
    title: "Generate Analytics Report",
    description: "Create comprehensive event performance report",
    icon: BarChart3,
    action: "analytics-report",
    category: "Analytics"
  },
  {
    title: "Bulk Send Certificates",
    description: "Send completion certificates to winners",
    icon: Award,
    action: "send-certificates",
    category: "Awards"
  },
  {
    title: "Schedule Announcement",
    description: "Create and schedule future announcements",
    icon: MessageSquare,
    action: "schedule-announcement",
    category: "Communication"
  },
  {
    title: "Manage Judges",
    description: "Add, remove, or assign judges to events",
    icon: Users,
    action: "manage-judges",
    category: "Event Management"
  },
  {
    title: "Prize Distribution",
    description: "Manage and distribute prizes to winners",
    icon: Trophy,
    action: "prize-distribution",
    category: "Awards"
  },
  {
    title: "Event Templates",
    description: "Create reusable templates for future events",
    icon: FileText,
    action: "event-templates",
    category: "Templates"
  },
  {
    title: "Calendar Integration",
    description: "Sync events with external calendar systems",
    icon: Calendar,
    action: "calendar-sync",
    category: "Integration"
  }
]

export function OrganizerTools({ onBack }) {
  const getActivityIcon = type => {
    switch (type) {
      case "registration":
        return <Users className="w-4 h-4 text-blue-500" />
      case "submission":
        return <FileText className="w-4 h-4 text-green-500" />
      case "judging":
        return <Award className="w-4 h-4 text-purple-500" />
      case "communication":
        return <MessageSquare className="w-4 h-4 text-orange-500" />
      default:
        return <Settings className="w-4 h-4 text-gray-500" />
    }
  }

  const groupedActions = quickActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = []
    }
    acc[action.category].push(action)
    return acc
  }, {})

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
          <h1 className="text-2xl font-bold text-gray-800">Organizer Tools</h1>
          <p className="text-sm text-gray-500">
            Advanced tools and analytics for event management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Analytics Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Analytics Overview
              </CardTitle>
              <CardDescription>
                Key metrics across all your events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {analyticsData.totalEvents}
                  </p>
                  <p className="text-sm text-gray-600">Total Events</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {analyticsData.totalParticipants}
                  </p>
                  <p className="text-sm text-gray-600">Participants</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {analyticsData.totalSubmissions}
                  </p>
                  <p className="text-sm text-gray-600">Submissions</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">
                    {analyticsData.averageRating}
                  </p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion Rate</span>
                    <span>{analyticsData.completionRate}%</span>
                  </div>
                  <Progress
                    value={analyticsData.completionRate}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Monthly Growth</span>
                    <span>+{analyticsData.monthlyGrowth}%</span>
                  </div>
                  <Progress
                    value={analyticsData.monthlyGrowth}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions by Category */}
          <Tabs defaultValue="data" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="awards">Awards</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>

            <TabsContent value="data" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedActions["Data Management"]?.map(action => (
                  <Card
                    key={action.action}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <action.icon className="w-8 h-8 text-purple-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-medium">{action.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {action.description}
                          </p>
                          <Button
                            size="sm"
                            className="mt-3 bg-purple-500 hover:bg-purple-600"
                          >
                            Execute
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedActions["Analytics"]?.map(action => (
                  <Card
                    key={action.action}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <action.icon className="w-8 h-8 text-purple-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-medium">{action.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {action.description}
                          </p>
                          <Button
                            size="sm"
                            className="mt-3 bg-purple-500 hover:bg-purple-600"
                          >
                            Execute
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="awards" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedActions["Awards"]?.map(action => (
                  <Card
                    key={action.action}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <action.icon className="w-8 h-8 text-purple-600 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-medium">{action.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {action.description}
                          </p>
                          <Button
                            size="sm"
                            className="mt-3 bg-purple-500 hover:bg-purple-600"
                          >
                            Execute
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="management" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(groupedActions["Event Management"] || [])
                  .concat(groupedActions["Communication"] || [])
                  .concat(groupedActions["Templates"] || [])
                  .concat(groupedActions["Integration"] || [])
                  .map(action => (
                    <Card
                      key={action.action}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <action.icon className="w-8 h-8 text-purple-600 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-medium">{action.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {action.description}
                            </p>
                            <Button
                              size="sm"
                              className="mt-3 bg-purple-500 hover:bg-purple-600"
                            >
                              Execute
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>
                Latest events across your hackathons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map(activity => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.event}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
              <CardDescription>Platform health and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Platform Status</span>
                <Badge className="bg-green-500">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response Time</span>
                <span className="text-sm font-medium">142ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Users</span>
                <span className="text-sm font-medium">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Server Load</span>
                <div className="flex items-center gap-2">
                  <Progress value={35} className="w-16 h-2" />
                  <span className="text-sm">35%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">New Registrations</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Submissions</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reviews Completed</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Messages Sent</span>
                <span className="font-medium">156</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
