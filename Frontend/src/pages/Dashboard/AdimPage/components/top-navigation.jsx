"use client"

import { Search, Bell, User, Moon, Sun } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/AdminButton"
import { Badge } from "./ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function TopNavigation() {

  return (
    <header className="h-16 bg-black/20 backdrop-blur-xl border-b border-purple-500/20 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search users, hackathons, submissions..."
          className="pl-10 bg-white/5 border-purple-500/20 text-white placeholder-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white hover:bg-white/5">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-black/90 backdrop-blur-xl border-purple-500/20">
            <div className="p-4">
              <h3 className="font-semibold text-white mb-2">Notifications</h3>
              <div className="space-y-3">
                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-white">New hackathon submission received</p>
                  <p className="text-xs text-gray-400 mt-1">3 minutes ago</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-sm text-white">User reported inappropriate content</p>
                  <p className="text-xs text-gray-400 mt-1">15 minutes ago</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <p className="text-sm text-white">Payment received: $299</p>
                  <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-400 hover:text-white hover:bg-white/5"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden md:block">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-xl border-purple-500/20">
            <DropdownMenuItem className="text-white hover:bg-white/5">My Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-white/5">Account Settings</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-purple-500/20" />
            <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
