"use client"
import { useState } from "react"
import {
  User,
  Settings,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Edit,
  MessageSquare
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../AdimPage/components/ui/card"
import { Button } from "../AdimPage/components/ui/button"
import { Badge } from "../AdimPage/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../AdimPage/components/ui/avatar"
import { Switch } from "../AdimPage/components/ui/switch"
import { Input } from "../AdimPage//components/ui/input"
import { Label } from "../AdimPage/components/ui/label"
import { Textarea } from "../AdimPage/components/ui/textarea"

export function ProfileSection({ userName, userEmail, userAvatar, onBack }) {
  const [currentView, setCurrentView] = useState("overview")
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Form states for edit profile
  const [editForm, setEditForm] = useState({
    name: userName,
    email: userEmail,
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio:
      "Passionate developer and hackathon enthusiast. Love building innovative solutions and collaborating with amazing teams.",
    website: "https://johndoe.dev",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe"
  })

  const initials = userName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  const renderHeader = () => (
    <div className="flex items-center gap-4 mb-6">
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
        <h1 className="text-2xl font-bold text-gray-800">
          {currentView === "overview" && "Profile Settings"}
          {currentView === "edit-profile" && "Edit Profile"}
          {currentView === "account-settings" && "Account Settings"}
          {currentView === "privacy-security" && "Privacy & Security"}
          {currentView === "help-support" && "Help & Support"}
        </h1>
        <p className="text-sm text-gray-500">
          {currentView === "overview" && "Manage your account and preferences"}
          {currentView === "edit-profile" && "Update your personal information"}
          {currentView === "account-settings" &&
            "Configure your account preferences"}
          {currentView === "privacy-security" &&
            "Manage your privacy and security settings"}
          {currentView === "help-support" && "Get help and support resources"}
        </p>
      </div>
    </div>
  )

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Info Card */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={userAvatar || "/placeholder.svg?height=96&width=96"}
              />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <CardTitle className="text-xl">{userName}</CardTitle>
              <CardDescription>{userEmail}</CardDescription>
              <div className="flex gap-2 mt-3 justify-center">
                <Badge variant="secondary">Participant</Badge>
                <Badge variant="outline">Organizer</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Profile Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-indigo-600">12</p>
              <p className="text-xs text-gray-500">Hackathons</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">3</p>
              <p className="text-xs text-gray-500">Wins</p>
            </div>
            <div>
              <p className="text-xl font-bold text-yellow-600">8</p>
              <p className="text-xs text-gray-500">Badges</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings and Actions */}
      <div className="lg:col-span-2 space-y-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account preferences and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium">
                      Push Notifications
                    </span>
                    <p className="text-xs text-gray-500">
                      Receive notifications about hackathons and updates
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium">Email Updates</span>
                    <p className="text-xs text-gray-500">
                      Get weekly summaries and important announcements
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailUpdates}
                  onCheckedChange={setEmailUpdates}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your profile and account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-start h-12"
                onClick={() => setCurrentView("edit-profile")}
              >
                <User className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium">Edit Profile</p>
                  <p className="text-xs text-gray-500">
                    Update your information
                  </p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-12"
                onClick={() => setCurrentView("account-settings")}
              >
                <Settings className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium">Account Settings</p>
                  <p className="text-xs text-gray-500">Privacy and security</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-12"
                onClick={() => setCurrentView("privacy-security")}
              >
                <Shield className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium">Privacy & Security</p>
                  <p className="text-xs text-gray-500">Manage your data</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-12"
                onClick={() => setCurrentView("help-support")}
              >
                <HelpCircle className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium">Help & Support</p>
                  <p className="text-xs text-gray-500">Get assistance</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full md:w-auto">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderEditProfile = () => (
    <div className="max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile photo</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={userAvatar || "/placeholder.svg?height=128&width=128"}
              />
              <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Edit className="w-3 h-3 mr-1" />
                Change
              </Button>
              <Button size="sm" variant="outline">
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={e =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={e =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={e =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editForm.location}
                    onChange={e =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={3}
                  value={editForm.bio}
                  onChange={e =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Add your social media and professional links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={editForm.website}
                  onChange={e =>
                    setEditForm({ ...editForm, website: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={editForm.github}
                  onChange={e =>
                    setEditForm({ ...editForm, github: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={editForm.linkedin}
                  onChange={e =>
                    setEditForm({ ...editForm, linkedin: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentView("overview")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAccountSettings = () => (
    <div className="max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Email Notifications</span>
                <p className="text-xs text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={emailUpdates}
                onCheckedChange={setEmailUpdates}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Push Notifications</span>
                <p className="text-xs text-gray-500">
                  Receive push notifications in browser
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">SMS Notifications</span>
                <p className="text-xs text-gray-500">
                  Receive important updates via SMS
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Preferences</CardTitle>
          <CardDescription>Customize your account experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Dark Mode</span>
              <p className="text-xs text-gray-500">
                Use dark theme across the platform
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Auto-save Drafts</span>
              <p className="text-xs text-gray-500">
                Automatically save your work
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button>Save Preferences</Button>
        <Button variant="outline" onClick={() => setCurrentView("overview")}>
          Back to Overview
        </Button>
      </div>
    </div>
  )

  const renderPrivacySecurity = () => (
    <div className="max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password & Authentication</CardTitle>
          <CardDescription>Manage your login credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Enable 2FA</span>
              <p className="text-xs text-gray-500">
                Secure your account with two-factor authentication
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={setTwoFactorEnabled}
            />
          </div>
          {twoFactorEnabled && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Two-factor authentication is enabled. You'll need your
                authenticator app to sign in.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control your data and privacy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Profile Visibility</span>
              <p className="text-xs text-gray-500">
                Make your profile visible to other users
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Activity Status</span>
              <p className="text-xs text-gray-500">Show when you're online</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button>Save Security Settings</Button>
        <Button variant="outline" onClick={() => setCurrentView("overview")}>
          Back to Overview
        </Button>
      </div>
    </div>
  )

  const renderHelpSupport = () => (
    <div className="max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">How do I join a hackathon?</span>
                <span className="transition group-open:rotate-180">↓</span>
              </summary>
              <div className="p-3 text-sm text-gray-600">
                To join a hackathon, browse the available events in your
                dashboard, click on the one you're interested in, and follow the
                registration process.
              </div>
            </details>
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">How do I submit my project?</span>
                <span className="transition group-open:rotate-180">↓</span>
              </summary>
              <div className="p-3 text-sm text-gray-600">
                Go to "My Submissions" in your participant panel, click "Submit
                Project", and provide your GitHub repository link, demo video,
                and project description.
              </div>
            </details>
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">
                  How do I organize a hackathon?
                </span>
                <span className="transition group-open:rotate-180">↓</span>
              </summary>
              <div className="p-3 text-sm text-gray-600">
                Switch to organizer view and click "Create New Hackathon". Fill
                in the event details, set up judging criteria, and publish your
                event.
              </div>
            </details>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>Get in touch with our support team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Email Support</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Get help via email within 24 hours
              </p>
              <Button variant="outline" size="sm">
                support@hackzen.com
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-green-500" />
                <span className="font-medium">Live Chat</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Chat with us in real-time
              </p>
              <Button variant="outline" size="sm">
                Start Chat
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>Helpful guides and documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-start">
              📚 User Guide
            </Button>
            <Button variant="outline" className="justify-start">
              🎥 Video Tutorials
            </Button>
            <Button variant="outline" className="justify-start">
              💡 Best Practices
            </Button>
            <Button variant="outline" className="justify-start">
              🔧 API Documentation
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentView("overview")}>
          Back to Overview
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex-1 space-y-6 p-6">
      {renderHeader()}

      {currentView === "overview" && renderOverview()}
      {currentView === "edit-profile" && renderEditProfile()}
      {currentView === "account-settings" && renderAccountSettings()}
      {currentView === "privacy-security" && renderPrivacySecurity()}
      {currentView === "help-support" && renderHelpSupport()}
    </div>
  )
}
