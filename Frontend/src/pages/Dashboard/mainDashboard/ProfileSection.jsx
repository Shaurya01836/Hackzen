"use client";

import { useState } from "react";
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
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../AdimPage/components/ui/card";
import { Button } from "../AdimPage/components/ui/button";
import { Badge } from "../AdimPage/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../AdimPage/components/ui/avatar";
import { Switch } from "../AdimPage/components/ui/switch";
import { Input } from "../AdimPage/components/ui/input";
import { Label } from "../AdimPage/components/ui/label";
import { Textarea } from "../AdimPage/components/ui/textarea";

export function ProfileSection({ userName, userEmail, userAvatar}) {
  const [currentView, setCurrentView] = useState("overview");
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [editForm, setEditForm] = useState({
    name: userName,
    email: userEmail,
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio:
      "Passionate developer and hackathon enthusiast. Love building innovative solutions and collaborating with amazing teams.",
    website: "https://johndoe.dev",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
  });

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
    
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          {currentView === "overview" && "Profile Settings"}
          {currentView === "edit-profile" && "Edit Profile"}
          {currentView === "account-settings" && "Account Settings"}
          {currentView === "privacy-security" && "Privacy & Security"}
          {currentView === "help-support" && "Help & Support"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
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
  );

 const renderOverview = () => (
  <div className="flex flex-col gap-6 w-full">
    {/* Profile Info Card */}
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={userAvatar || "/placeholder.svg"} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <CardTitle className="text-xl">{userName}</CardTitle>
            <CardDescription>{userEmail}</CardDescription>
            <div className="flex gap-2 mt-3 justify-center flex-wrap">
              <Badge variant="secondary">Participant</Badge>
              <Badge variant="outline">Organizer</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around text-center">
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

    {/* Account Settings */}
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Account Settings
        </CardTitle>
        <CardDescription>
          Manage your account preferences and notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-gray-500">
                Receive updates about events and submissions
              </p>
            </div>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">Email Updates</p>
              <p className="text-xs text-gray-500">
                Get weekly insights and reports
              </p>
            </div>
          </div>
          <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} />
        </div>
      </CardContent>
    </Card>

  

    {/* Danger Zone */}
    <Card className="w-full border-red-300 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-600">Danger Zone</CardTitle>
        <CardDescription>
          Irreversible actions for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </CardContent>
    </Card>
  </div>
);

 const renderEditProfile = () => (
  <div className="w-full flex flex-col gap-6">
    {/* Profile Picture Section */}
    <Card className="w-full">
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
        <div className="flex gap-2 flex-wrap justify-center">
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

    {/* Personal Information Section */}
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
          <div className="w-full sm:w-[48%]">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={editForm.name}
              onChange={e =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
          </div>
          <div className="w-full sm:w-[48%]">
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
          <div className="w-full sm:w-[48%]">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={editForm.phone}
              onChange={e =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
            />
          </div>
          <div className="w-full sm:w-[48%]">
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

    {/* Social Links Section */}
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
        <CardDescription>
          Add your social media and professional links
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="w-full">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={editForm.website}
            onChange={e =>
              setEditForm({ ...editForm, website: e.target.value })
            }
          />
        </div>
        <div className="w-full">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            value={editForm.github}
            onChange={e =>
              setEditForm({ ...editForm, github: e.target.value })
            }
          />
        </div>
        <div className="w-full">
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

    {/* Save + Cancel Actions */}
    <div className="flex flex-col sm:flex-row gap-3 justify-start">
      <Button className="flex items-center gap-2 w-full sm:w-auto">
        <Save className="w-4 h-4" />
        Save Changes
      </Button>
      <Button
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => setCurrentView("overview")}
      >
        Cancel
      </Button>
    </div>
  </div>
);

 const renderAccountSettings = () => (
  <div className="w-full flex flex-col gap-6">
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {[
          {
            label: "Email Notifications",
            desc: "Receive notifications via email",
            value: emailUpdates,
            setter: setEmailUpdates,
          },
          {
            label: "Push Notifications",
            desc: "Receive push notifications in browser",
            value: notifications,
            setter: setNotifications,
          },
          {
            label: "SMS Notifications",
            desc: "Receive important updates via SMS",
            value: false,
            setter: () => {},
          },
        ].map(({ label, desc, value, setter }) => (
          <div className="flex items-center justify-between" key={label}>
            <div>
              <span className="text-sm font-medium">{label}</span>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <Switch checked={value} onCheckedChange={setter} />
          </div>
        ))}
      </CardContent>
    </Card>

    <Card className="w-full">
      <CardHeader>
        <CardTitle>Account Preferences</CardTitle>
        <CardDescription>Customize your account experience</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium">Dark Mode</span>
            <p className="text-xs text-gray-500">Use dark theme across the platform</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium">Auto-save Drafts</span>
            <p className="text-xs text-gray-500">Automatically save your work</p>
          </div>
          <Switch defaultChecked />
        </div>
      </CardContent>
    </Card>

    <div className="flex flex-col sm:flex-row gap-3">
      <Button className="w-full sm:w-auto">Save Preferences</Button>
      <Button
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => setCurrentView("overview")}
      >
        Back to Overview
      </Button>
    </div>
  </div>
);

 const renderPrivacySecurity = () => (
  <div className="w-full flex flex-col gap-6">
    {/* Password Section */}
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Password & Authentication</CardTitle>
        <CardDescription>Manage your login credentials</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {[
          { id: "current-password", label: "Current Password", type: showPassword ? "text" : "password" },
          { id: "new-password", label: "New Password", type: "password" },
          { id: "confirm-password", label: "Confirm New Password", type: "password" },
        ].map(({ id, label, type }) => (
          <div key={id} className="relative">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} type={type} placeholder={`Enter ${label.toLowerCase()}`} />
            {id === "current-password" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-6 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            )}
          </div>
        ))}
        <Button className="flex items-center gap-2 w-full sm:w-auto">
          <Lock className="w-4 h-4" />
          Update Password
        </Button>
      </CardContent>
    </Card>

    {/* 2FA Section */}
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>Add an extra layer of security to your account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium">Enable 2FA</span>
            <p className="text-xs text-gray-500">Secure your account with two-factor authentication</p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={setTwoFactorEnabled}
          />
        </div>
        {twoFactorEnabled && (
          <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
            2FA is enabled. Use your authenticator app to sign in.
          </div>
        )}
      </CardContent>
    </Card>

    {/* Privacy Settings */}
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Control your data and visibility</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {[
          { label: "Profile Visibility", desc: "Make your profile visible to other users", defaultChecked: true },
          { label: "Activity Status", desc: "Show when you're online", defaultChecked: false },
        ].map(({ label, desc, defaultChecked }) => (
          <div className="flex items-center justify-between" key={label}>
            <div>
              <span className="text-sm font-medium">{label}</span>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <Switch defaultChecked={defaultChecked} />
          </div>
        ))}
      </CardContent>
    </Card>

    <div className="flex flex-col sm:flex-row gap-3">
      <Button className="w-full sm:w-auto">Save Security Settings</Button>
      <Button
        variant="outline"
        className="w-full sm:w-auto"
        onClick={() => setCurrentView("overview")}
      >
        Back to Overview
      </Button>
    </div>
  </div>
);

  const renderHelpSupport = () => (
  <div className="w-full flex flex-col gap-6">
    {/* FAQ */}
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>Find answers to common questions</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {[
          ["How do I join a hackathon?", "Browse events, click one, and follow registration steps."],
          ["How do I submit my project?", "Go to My Submissions > Submit Project > fill GitHub, video, description."],
          ["How do I organize a hackathon?", "Switch to organizer view > Create Hackathon > fill and publish."]
        ].map(([q, a]) => (
          <details key={q} className="group border rounded-md">
            <summary className="flex justify-between items-center p-3 cursor-pointer bg-gray-50">
              <span className="font-medium">{q}</span>
              <span className="transition group-open:rotate-180">↓</span>
            </summary>
            <div className="p-3 text-sm text-gray-600">{a}</div>
          </details>
        ))}
      </CardContent>
    </Card>

    {/* Support Channels */}
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contact Support</CardTitle>
        <CardDescription>Reach out to us for help</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 border rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Email Support</span>
          </div>
          <p className="text-sm text-gray-600">Get a reply within 24 hours</p>
          <Button variant="outline" size="sm">support@hackzen.com</Button>
        </div>
        <div className="flex-1 border rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-500" />
            <span className="font-medium">Live Chat</span>
          </div>
          <p className="text-sm text-gray-600">Chat with us live</p>
          <Button variant="outline" size="sm">Start Chat</Button>
        </div>
      </CardContent>
    </Card>

    {/* Resources */}
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resources</CardTitle>
        <CardDescription>Helpful guides and docs</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {["📚 User Guide", "🎥 Video Tutorials", "💡 Best Practices", "🔧 API Docs"].map(txt => (
          <Button key={txt} variant="outline" className="justify-start w-full">
            {txt}
          </Button>
        ))}
      </CardContent>
    </Card>

    <Button
      variant="outline"
      className="w-full sm:w-auto"
      onClick={() => setCurrentView("overview")}
    >
      Back to Overview
    </Button>
  </div>
);


  return (
  <div className="min-h-screen bg-gradient-to-b from-slate-50 via-purple-50 to-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
    <div className="max-w-6xl mx-auto space-y-10">
      {renderHeader()}

      <div className="flex flex-col gap-8">
        {/* Horizontal Tab Navigation */}
        <div className="flex flex-wrap gap-2 justify-start">
          <Button
            variant={currentView === "overview" ? "default" : "outline"}
            onClick={() => setCurrentView("overview")}
          >
            Overview
          </Button>
          <Button
            variant={currentView === "edit-profile" ? "default" : "outline"}
            onClick={() => setCurrentView("edit-profile")}
          >
            Edit Profile
          </Button>
          <Button
            variant={currentView === "account-settings" ? "default" : "outline"}
            onClick={() => setCurrentView("account-settings")}
          >
            Account Settings
          </Button>
          <Button
            variant={currentView === "privacy-security" ? "default" : "outline"}
            onClick={() => setCurrentView("privacy-security")}
          >
            Privacy & Security
          </Button>
          <Button
            variant={currentView === "help-support" ? "default" : "outline"}
            onClick={() => setCurrentView("help-support")}
          >
            Help & Support
          </Button>
        </div>

        {/* View Renderer */}
        <div className="flex-1 space-y-6">
          {currentView === "overview" && renderOverview()}
          {currentView === "edit-profile" && renderEditProfile()}
          {currentView === "account-settings" && renderAccountSettings()}
          {currentView === "privacy-security" && renderPrivacySecurity()}
          {currentView === "help-support" && renderHelpSupport()}
        </div>
      </div>
    </div>
  </div>
);

}
