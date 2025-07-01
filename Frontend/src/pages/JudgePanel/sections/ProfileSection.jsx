"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/DashboardUI/avatar"
import { Button } from "../../../components/CommonUI/button"
import { LogOut, Mail, User, Lock } from "lucide-react"

export function ProfileSection() {
  return (
    <div className="animate-in fade-in-50 duration-500 max-w-lg mx-auto space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-blue-200">
            <AvatarImage src="/placeholder.svg?height=64&width=64" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
              JS
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">Dr. Jane Smith</CardTitle>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Mail className="h-4 w-4" />
              jane@example.com
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex gap-2 bg-transparent"
          >
            <User className="h-4 w-4" />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            className="w-full flex gap-2 bg-transparent"
          >
            <Lock className="h-4 w-4" />
            Change Password
          </Button>
          <Button variant="destructive" className="w-full flex gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
