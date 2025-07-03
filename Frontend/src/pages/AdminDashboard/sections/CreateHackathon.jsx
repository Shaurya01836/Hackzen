"use client"

import { useState } from "react"
import { useAuth } from "../../../context/AuthContext"; // adjust path if needed

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card"
import { Button } from "../../../components/CommonUI/button"
import { Input } from "../../../components/CommonUI/input"
import { Label } from "../../../components/CommonUI/label"
import { Textarea } from "../../../components/CommonUI/textarea"
import {
  Select,SelectContent,SelectItem,SelectTrigger,SelectValue
} from "../../../components/CommonUI/select"
import { Badge } from "../../../components/CommonUI/badge"
import { Separator } from "../../../components/CommonUI/separator"
import { Calendar } from "../../../components/AdminUI/calendar"
import { Popover, PopoverContent,PopoverTrigger
} from "../../../components/AdminUI/popover"
import { X, CalendarIcon, Plus, Minus, Trophy,Users,Clock,MapPin,Target,Sparkles,Save,ArrowLeft,FileText,Award,Settings,Upload,ImageIcon,Loader2,Check,AlertCircle,Locate, IndianRupee, AudioWaveform
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "../../../lib/utils"

const categories = ["Artificial Intelligence","Fintech","Healthcare","Gaming","EdTech","Social Impact","Open Innovation","Other"
]
const difficultyLevels = ["Beginner", "Intermediate", "Advanced"]
const modes = ["online", "offline", "hybrid"]

export function CreateHackathonForm({ onBack }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficultyLevel: "",
    location: "",
    startDate: null,
    endDate: null,
    registrationDeadline: null,
    submissionDeadline: null,
    maxParticipants: 100,
    teamSize: {
      min: 1,
      max: 4,
      allowSolo: true,
    },
    problemStatements: [""],
    requirements: [""],
    perks: [""],
    tags: [],
    mode: "online",
    prizePool: {
      amount: "",
      currency: "USD",
      breakdown: ""
    },
    images: { 
      banner: null, 
      logo: null, 
      gallery: [] 
    }
  })

  const [currentTag, setCurrentTag] = useState("")
  const [uploadStates, setUploadStates] = useState({
    banner: { uploading: false, error: null },
    logo: { uploading: false, error: null },
    gallery: { uploading: false, error: null }
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleTeamSizeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      teamSize: {
        ...prev.teamSize,
        [field]: field === 'min' ? Number(value) : Number(value),
        allowSolo: field === 'min' ? Number(value) === 1 : prev.teamSize.min === 1
      }
    }))
  }
const removeImage = (type, index = null) => {
  if (type === "gallery" && index !== null) {
    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        gallery: prev.images.gallery.filter((_, i) => i !== index)
      }
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        [type]: null
      }
    }));
  }
};
  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item))
    }))
  }

  const addArrayItem = field => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag("")
    }
  }

  const removeTag = tagToRemove => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Cloudinary upload function



const handleFileSelect = async (file, type) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await fetch("http://localhost:3000/api/uploads/image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}` // 🛡️ Your login token
      },
      body: formData
    });

    const data = await res.json();

    // Update formData.images
    setFormData((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [type]: data // { url, publicId, width, height }
      }
    }));
  } catch (err) {
    console.error("Upload error:", err);
    alert("Image upload failed");
  }
};



const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const res = await fetch("http://localhost:3000/api/hackathons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // ✅ Auth token
      },
body: JSON.stringify({
  ...formData,
  images: {
    banner: formData.images.banner || { url: "", publicId: "" },
    logo: formData.images.logo || { url: "", publicId: "" },
    gallery: formData.images.gallery || []
  },
  difficulty: formData.difficultyLevel,
  teamSize: formData.teamSize,
  problemStatements: formData.problemStatements.filter(ps => ps.trim()),
  requirements: formData.requirements.filter(r => r.trim()),
  perks: formData.perks.filter(p => p.trim()),
  tags: formData.tags,
  status: "upcoming"
})

    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create hackathon");
    }

    await res.json();
    
    // Show success message for 3 seconds
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      onBack(); // Go back to previous page after 3 seconds
    }, 3000);
    
  } catch (error) {
    const text = await error?.response?.text?.();
    console.error("❌ Raw error text:", text);
    console.error("❌ Submission failed:", error);
    alert(`Error: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  const DatePicker = ({ date, onDateChange, placeholder }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-white/5 border-purple-500/20 text-black hover:bg-white/10",
            !date && "text-gray-600"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-black/90 backdrop-blur-xl border-purple-500/20">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
          className="text-white"
        />
      </PopoverContent>
    </Popover>
  )

const ImageUploadCard = ({
  title,
  description,
  type,
  currentImage,
  multiple = false
}) => (
  <div className="border border-purple-500/20 rounded-lg p-4 bg-white/5">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h4 className="text-black font-medium">{title}</h4>
        <p className="text-gray-800 text-sm">{description}</p>
      </div>
      {uploadStates[type]?.uploading && (
        <Loader2 className="w-5 h-5 animate-spin text-purple-700" />
      )}
    </div>

    {/* Upload Area */}
    <div className="space-y-3">
      <label
        htmlFor={`upload-${type}`}
        className={cn(
          "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200",
          uploadStates[type]?.uploading
            ? "border-purple-500/50 bg-purple-500/10"
            : "border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/5"
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-2 text-purple-400" />
          <p className="text-sm text-black">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-black">PNG, JPG, GIF up to 5MB</p>
        </div>
        <input
          id={`upload-${type}`}
          type="file"
          className="hidden"
          accept="image/*"
          multiple={multiple}
          onChange={e => {
            const file = e.target.files[0]
            if (file) handleFileSelect(file, type) // ✅ Use backend upload function
          }}
          disabled={uploadStates[type]?.uploading}
        />
      </label>

      {/* Error Display */}
      {uploadStates[type]?.error && (
        <div className="flex items-center text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          {uploadStates[type].error}
        </div>
      )}

      {/* Current Image Display */}
      {type !== "gallery" && currentImage && (
        <div className="relative">
          <img
            src={currentImage.url || "/placeholder.svg"}
            alt={title}
            className="w-full h-32 object-cover rounded-lg border border-purple-500/20"
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => removeImage(type)}
          >
            <X className="w-3 h-3" />
          </Button>
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
            <Check className="w-4 h-4 text-green-400" />
          </div>
        </div>
      )}

      {/* Gallery Images Display */}
      {type === "gallery" && formData.images.gallery.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {formData.images.gallery.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.url || "/placeholder.svg"}
                alt={`Gallery ${index + 1}`}
                className="w-full h-20 object-cover rounded border border-purple-500/20"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-5 w-5"
                onClick={() => removeImage("gallery", index)}
              >
                <X className="w-2 h-2" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-gray-400 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-black flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-purple-600" />
              Create New Hackathon
            </h1>
            <p className="text-gray-600 mt-1">
              Fill out all the details to create an amazing hackathon experience
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              🎉 Hackathon Created Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              Your hackathon has been successfully created and submitted for admin approval.
            </p>
            <p className="text-sm text-blue-800">
              Once admin approves, it will appear in the explore section for participants.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting back in a few seconds...
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <FileText className="w-5 h-5 mr-2 black" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label
                  htmlFor="title"
                  className="text-black flex items-center"
                >
                  <Sparkles className="w-4 h-4 mr-2 text-purple-700" />
                  Hackathon Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => handleInputChange("title", e.target.value)}
                  placeholder="Enter an exciting hackathon title..."
                  className="bg-white/5 border-purple-500/20 text-black placeholder-gray-700 mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-black">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={value => handleInputChange("category", value)}
                >
                  <SelectTrigger className="bg-white/5 border-purple-500/20 text-black mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                    {categories.map(category => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="text-white hover:bg-white/5"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty" className="text-black">
                  Difficulty Level *
                </Label>
                <Select
                  value={formData.difficultyLevel}
                  onValueChange={value =>
                    handleInputChange("difficultyLevel", value)
                  }
                >
                  <SelectTrigger className="bg-white/5 border-purple-500/20 text-black mt-2">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                    {difficultyLevels.map(level => (
                      <SelectItem
                        key={level}
                        value={level}
                        className="text-white hover:bg-white/5"
                      >
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description" className="text-black">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe your hackathon, its goals, and what participants can expect..."
                  className="bg-white/5 border-purple-500/20 text-black placeholder-gray-800 resize-none mt-2"
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images & Media */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-pink-500" />
              Images & Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploadCard
                title="Banner Image"
                description="Main banner for your hackathon (recommended: 1200x600px)"
                type="banner"
                currentImage={formData.images.banner}
              />
              <ImageUploadCard
                title="Logo"
                description="Hackathon logo (recommended: 400x400px)"
                type="logo"
                currentImage={formData.images.logo}
              />
            </div>
            <div>
              <ImageUploadCard
                title="Gallery Images"
                description="Additional images to showcase your hackathon"
                type="gallery"
                currentImage={null}
                multiple={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-700" />
              Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label
                  htmlFor="mode"
                  className="text-black flex items-center"
                >
                  <MapPin className="w-4 h-4 mr-2 text-blue-700" />
                  Mode
                </Label>
                <Select
                  value={formData.mode}
                  onValueChange={value => handleInputChange("mode", value)}
                >
                  <SelectTrigger className="bg-white/5 border-purple-500/20 text-black mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                    {modes.map(mode => (
                      <SelectItem
                        key={mode}
                        value={mode}
                        className="text-white hover:bg-white/5 capitalize"
                      >
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className="text-black flex items-center">
                  <Locate className="w-4 h-4 mr-2 text-green-600" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={e => handleInputChange("location", e.target.value)}
                  placeholder="Virtual, New York, etc."
                  className="bg-white/5 border-purple-500/20 text-black placeholder-gray-600 mt-2"
                />
              </div>

              <div>
                <Label
                  htmlFor="maxParticipants"
                  className="text-black flex items-center"
                >
                  <Users className="w-4 h-4 mr-2 text-green-500" />
                  Max Participants
                </Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={e =>
                    handleInputChange(
                      "maxParticipants",
                      Number.parseInt(e.target.value)
                    )
                  }
                  className="bg-white/5 border-purple-500/20 text-black mt-2"
                />
              </div>
            </div>

            <Separator className="bg-purple-500/20" />

            {/* Team Size Configuration */}
            <div>
              <Label className="text-black flex items-center mb-3">
                <Users className="w-4 h-4 mr-2 text-purple-600" />
                Team Size Configuration
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="teamSizeMin" className="text-black text-sm">
                    Minimum Team Size *
                  </Label>
                  <Select
                    value={formData.teamSize.min.toString()}
                    onValueChange={(value) => handleTeamSizeChange('min', value)}
                  >
                    <SelectTrigger className="bg-white/5 border-purple-500/20 text-black mt-2">
                      <SelectValue placeholder="Min size" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                      {[1, 2, 3, 4, 5].map((size) => (
                        <SelectItem key={size} value={size.toString()} className="text-white hover:bg-white/5">
                          {size} {size === 1 ? "member (Solo)" : "members"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="teamSizeMax" className="text-black text-sm">
                    Maximum Team Size *
                  </Label>
                  <Select
                    value={formData.teamSize.max.toString()}
                    onValueChange={(value) => handleTeamSizeChange('max', value)}
                  >
                    <SelectTrigger className="bg-white/5 border-purple-500/20 text-black mt-2">
                      <SelectValue placeholder="Max size" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
                        <SelectItem 
                          key={size} 
                          value={size.toString()} 
                          disabled={size < formData.teamSize.min}
                          className="text-white hover:bg-white/5"
                        >
                          {size} {size === 1 ? "member" : "members"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-medium text-purple-700">Team Size Range</p>
                    <p className="text-lg font-bold text-purple-600">
                      {formData.teamSize.min === formData.teamSize.max
                        ? `${formData.teamSize.min} ${formData.teamSize.min === 1 ? "member" : "members"}`
                        : `${formData.teamSize.min} - ${formData.teamSize.max} members`}
                    </p>
                    {formData.teamSize.allowSolo && (
                      <p className="text-xs text-green-600 mt-1">✓ Solo participation allowed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-purple-500/20" />

            {/* Problem Statements */}
            <div>
              <Label className="text-black flex items-center mb-3">
                <Target className="w-4 h-4 mr-2 text-orange-600" />
                Problem Statements
              </Label>
              {formData.problemStatements.map((statement, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <Input
                    value={statement}
                    onChange={e =>
                      handleArrayChange(
                        "problemStatements",
                        index,
                        e.target.value
                      )
                    }
                    placeholder={`Problem statement ${index + 1}...`}
                    className="bg-white/5 border-purple-500/20 text-black placeholder-gray-600"
                  />
                  {formData.problemStatements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        removeArrayItem("problemStatements", index)
                      }
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem("problemStatements")}
                className="border-purple-500/20 text-purple-300 hover:bg-purple-500/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Problem Statement
              </Button>
            </div>

            {/* Requirements */}
            <div>
              <Label className="text-black flex items-center mb-3 block">
              <AudioWaveform className="w-4 h-4 mr-2 text-orange-600" />
                Requirements</Label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <Input
                    value={requirement}
                    onChange={e =>
                      handleArrayChange("requirements", index, e.target.value)
                    }
                    placeholder={`Requirement ${index + 1}...`}
                    className="bg-white/5 border-purple-500/20 text-white placeholder-gray-400"
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                      size="icon"
                      onClick={() => removeArrayItem("requirements", index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem("requirements")}
                className="border-purple-500/20 text-purple-300 hover:bg-purple-500/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Requirement
              </Button>
            </div>

            {/* Perks */}
            <div>
              <Label className="text-black flex items-center mb-3">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-600" />
                Perks & Benefits
              </Label>
              {formData.perks.map((perk, index) => (
                <div key={index} className="flex gap-2 mb-3">
                  <Input
                    value={perk}
                    onChange={e =>
                      handleArrayChange("perks", index, e.target.value)
                    }
                    placeholder={`Perk ${index + 1}...`}
                    className="bg-white/5 border-purple-500/20 text-white placeholder-gray-400"
                  />
                  {formData.perks.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("perks", index)}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => addArrayItem("perks")}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Perk
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dates & Timeline */}
        <Card >
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-600" />
              Dates & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-black mb-2 block">Start Date *</Label>
                <DatePicker
                  date={formData.startDate}
                  onDateChange={date => handleInputChange("startDate", date)}
                  placeholder="Select start date"
                />
              </div>

              <div>
                <Label className="text-black mb-2 block">End Date *</Label>
                <DatePicker
                  date={formData.endDate}
                  onDateChange={date => handleInputChange("endDate", date)}
                  placeholder="Select end date"
                />
              </div>

              <div>
                <Label className="text-black mb-2 block">
                  Registration Deadline *
                </Label>
                <DatePicker
                  date={formData.registrationDeadline}
                  onDateChange={date =>
                    handleInputChange("registrationDeadline", date)
                  }
                  placeholder="Select registration deadline"
                />
              </div>

              <div>
                <Label className="black mb-2 block">
                  Submission Deadline
                </Label>
                <DatePicker
                  date={formData.submissionDeadline}
                  onDateChange={date =>
                    handleInputChange("submissionDeadline", date)
                  }
                  placeholder="Select submission deadline"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black ">Tags</CardTitle>
          </CardHeader>
          <CardContent className="pt-1 space-y-4">
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={e => setCurrentTag(e.target.value)}
                placeholder="Add a tag..."
                className="bg-white/5 border-purple-500/20 text-black placeholder-gray-600"
                onKeyPress={e =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button
                type="button"
                onClick={addTag}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  className="bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prize Pool */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Prize Pool
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label
                  htmlFor="prizeAmount"
                  className="text-black flex items-center"
                >
                  <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
                  Prize Amount
                </Label>
                <Input
                  id="prizeAmount"
                  type="number"
                  value={formData.prizePool.amount}
                  onChange={e =>
                    handleInputChange("prizePool.amount", e.target.value)
                  }
                  placeholder="10000"
                  className="bg-white/5 border-purple-500/20 text-black placeholder-gray-600 mt-2"
                />
              </div>

              <div>
                <Label htmlFor="currency" className="text-black flex items-center">
                  <IndianRupee className="w-4 h-4 mr-2 text-yellow-600" />
                  Currency
                </Label>
                <Select
                  value={formData.prizePool.currency}
                  onValueChange={value =>
                    handleInputChange("prizePool.currency", value)
                  }
                >
                  <SelectTrigger className="bg-white/5 border-purple-500/20 text-black mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-xl border-purple-500/20">
                    <SelectItem
                      value="USD"
                      className="text-white hover:bg-white/5"
                    >
                      USD
                    </SelectItem>
                    <SelectItem
                      value="EUR"
                      className="text-white hover:bg-white/5"
                    >
                      EUR
                    </SelectItem>
                    <SelectItem
                      value="GBP"
                      className="text-white hover:bg-white/5"
                    >
                      GBP
                    </SelectItem>
                    <SelectItem
                      value="INR"
                      className="text-white hover:bg-white/5"
                    >
                      INR
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="prizeBreakdown" className="text-black">
                Prize Breakdown
              </Label>
              <Textarea
                id="prizeBreakdown"
                value={formData.prizePool.breakdown}
                onChange={e =>
                  handleInputChange("prizePool.breakdown", e.target.value)
                }
                placeholder="1st Place: $5000, 2nd Place: $3000, 3rd Place: $2000..."
                className="bg-white/5 border-purple-500/20 text-black placeholder-gray-600 resize-none mt-2"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Hackathon
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
