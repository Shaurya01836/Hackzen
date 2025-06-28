"use client";
import { Search, Bell, User } from "lucide-react";
import { Input } from "../../../components/CommonUI/input";
import { Button } from "../../../components/CommonUI/button";
import { Badge } from "../../../components/CommonUI/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/AdminUI/dropdown-menu";

export function TopNavigation() {
  return (
    <header className="py-3 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
        <Input
          placeholder="Search users, hackathons, submissions..."
          className="pl-10 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 border border-gray-300 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-200"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-600 hover:text-black hover:bg-gray-100"
            >
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 bg-white border border-gray-200 shadow-lg"
          >
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Notifications
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-purple-100 rounded-lg border border-purple-200">
                  <p className="text-sm text-gray-800">
                    New hackathon submission received
                  </p>
                  <p className="text-xs text-gray-500 mt-1">3 minutes ago</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-800">
                    User reported inappropriate content
                  </p>
                  <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-800">
                    Payment received: $299
                  </p>
                  <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
