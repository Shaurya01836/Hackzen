"use client"
import { useState } from "react"
import {
  ArrowLeft,
  Save,
  Upload,
  Github,
  Globe,
  Plus,
  X,
  Video,
  LinkIcon,
  Users,
  Calendar
} from "lucide-react"
import { Button } from "../../../components/CommonUI/button"
import { Input } from "../../../components/CommonUI/input"
import { Badge } from "../../../components/CommonUI/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/CommonUI/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/CommonUI/tabs"
import { Label } from "../../../components/CommonUI/label"
import { RichTextEditor } from "./RichTextEditor"

const categories = [
  "AI/ML",
  "Blockchain",
  "Web Development",
  "Mobile App",
  "IoT",
  "Gaming",
  "FinTech",
  "HealthTech",
  "EdTech",
  "Other"
]

const FIELD_LIMITS = {
  title: 100,
  description: 5000,
  githubLink: 200,
  websiteLink: 200,
  socialLink: 200,
  customCategory: 50,
  videoFile: 100 * 1024 * 1024, // 100MB
  logoFile: 2 * 1024 * 1024 // 2MB
}

export default function ProjectSubmission({
  hackathonName = "HackZen 2024",
  teamLeaderName = "Nitin Jain",
  onBack,
  onSave
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    logo: null,
    githubLink: "",
    websiteLink: "",
    demoVideoType: "upload",
    demoVideoFile: null,
    demoVideoLink: "",
    socialLinks: [""],
    category: "",
    customCategory: "",
    status: "draft"
  })

  const [logoPreview, setLogoPreview] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = e => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > FIELD_LIMITS.logoFile) {
        alert("Logo file size must be less than 2MB")
        return
      }
      setFormData(prev => ({ ...prev, logo: file }))
      const reader = new FileReader()
      reader.onload = e => setLogoPreview(e.target?.result)
      reader.readAsDataURL(file)
    }
  }

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, ""]
    }))
  }

  const removeSocialLink = index => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }))
  }

  const updateSocialLink = (index, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) =>
        i === index ? value : link
      )
    }))
  }

  const isIncomplete =
    !formData.title || !formData.description || !formData.category

  const getStatusBadge = () => {
    const statusConfig = {
      draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
      submitted: {
        label: "Submitted",
        className: "bg-yellow-100 text-yellow-800"
      },
      reviewed: {
        label: "Reviewed",
        className: "bg-purple-100 text-purple-800"
      }
    }
    const config = statusConfig[formData.status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const handleSave = () => {
    onSave?.(formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div className="flex items-center gap-3">
                  {isIncomplete && (
                    <Badge variant="destructive">Incomplete Project</Badge>
                  )}
                  <Button
                    onClick={handleSave}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700"
                  >
                    Project Title * ({formData.title.length}/
                    {FIELD_LIMITS.title})
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter your project title"
                    value={formData.title}
                    onChange={e => {
                      if (e.target.value.length <= FIELD_LIMITS.title) {
                        handleInputChange("title", e.target.value)
                      }
                    }}
                    className="mt-1"
                    maxLength={FIELD_LIMITS.title}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Project Description (Vision) *
                  </Label>
                  <div className="mt-1">
                    <RichTextEditor
                      value={formData.description}
                      onChange={value =>
                        handleInputChange("description", value)
                      }
                      placeholder="Describe your project vision and what problem it solves..."
                      maxLength={FIELD_LIMITS.description}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Logo */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Project Logo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    {logoPreview ? (
                      <img
                        src={logoPreview || "/placeholder.svg"}
                        alt="Logo preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="logo" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Upload className="w-4 h-4" />
                        Upload Logo
                      </div>
                    </Label>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Project Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label
                    htmlFor="github"
                    className="text-sm font-medium text-gray-700"
                  >
                    GitHub Repository *
                  </Label>
                  <div className="relative mt-1">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="github"
                      placeholder="https://github.com/username/repo"
                      value={formData.githubLink}
                      onChange={e => {
                        if (e.target.value.length <= FIELD_LIMITS.githubLink) {
                          handleInputChange("githubLink", e.target.value)
                        }
                      }}
                      className="pl-10"
                      maxLength={FIELD_LIMITS.githubLink}
                    />
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="website"
                    className="text-sm font-medium text-gray-700"
                  >
                    Website Link (Optional)
                  </Label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="website"
                      placeholder="https://yourproject.com"
                      value={formData.websiteLink}
                      onChange={e => {
                        if (e.target.value.length <= FIELD_LIMITS.websiteLink) {
                          handleInputChange("websiteLink", e.target.value)
                        }
                      }}
                      className="pl-10"
                      maxLength={FIELD_LIMITS.websiteLink}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Video */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Demo Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={formData.demoVideoType}
                  onValueChange={value =>
                    handleInputChange("demoVideoType", value)
                  }
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload Video</TabsTrigger>
                    <TabsTrigger value="link">Paste Link</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="mt-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Label htmlFor="video" className="cursor-pointer">
                        <div className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          MP4, MOV up to 100MB
                        </div>
                      </Label>
                      <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file && file.size > FIELD_LIMITS.videoFile) {
                            alert("Video file size must be less than 100MB")
                            return
                          }
                          handleInputChange("demoVideoFile", file)
                        }}
                        className="hidden"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="link" className="mt-4">
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        value={formData.demoVideoLink}
                        onChange={e =>
                          handleInputChange("demoVideoLink", e.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="https://twitter.com/username"
                      value={link}
                      onChange={e => {
                        if (e.target.value.length <= FIELD_LIMITS.socialLink) {
                          updateSocialLink(index, e.target.value)
                        }
                      }}
                      maxLength={FIELD_LIMITS.socialLink}
                    />
                    {formData.socialLinks.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeSocialLink(index)}
                        className="shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addSocialLink}
                  className="w-full flex items-center gap-2 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                  Add Social Link
                </Button>
              </CardContent>
            </Card>

            {/* Category */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Category *
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={formData.category}
                  onValueChange={value => handleInputChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.category === "Other" && (
                  <Input
                    placeholder="Enter custom category"
                    value={formData.customCategory}
                    onChange={e => {
                      if (
                        e.target.value.length <= FIELD_LIMITS.customCategory
                      ) {
                        handleInputChange("customCategory", e.target.value)
                      }
                    }}
                    maxLength={FIELD_LIMITS.customCategory}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Team & Hackathon Info */}
          <div className="space-y-6">
            {/* Team Info */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Team Leader
                    </Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{teamLeaderName}</div>
                      <div className="text-sm text-gray-500">Leader</div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Team Members
                    </Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
                      Add team members to collaborate on this project
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hackathon Info */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Hackathon Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-gradient-to-r from-yellow-50 to-purple-50 rounded-lg border border-yellow-200">
                  <div className="font-medium text-gray-900">
                    {hackathonName}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Submission deadline: March 15, 2024
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Status */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Project Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  {getStatusBadge()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Save Button */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <span className="text-sm text-gray-500">
              Last saved: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <Button
            onClick={handleSave}
            size="lg"
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Edit
          </Button>
        </div>
      </div>
    </div>
  )
}
