"use client"
import { useState } from "react"
import { useAuth } from "../../../../context/AuthContext"; // adjust path if needed
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Users,
  FileText,
  Save,
  X,
  Upload,
  Loader2,
  Check,
  AlertCircle
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../../AdimPage/components/ui/card"
import { Button } from "../../AdimPage/components/ui/button"
import { Input } from "../../AdimPage/components/ui/input"
import { Label } from "../../AdimPage/components/ui/label"
import { Textarea } from "../../AdimPage/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../AdimPage/components/ui/select"
import { Badge } from "../../AdimPage/components/ui/badge"
import { Separator } from "../../AdimPage/components/ui/separator"
import { Alert, AlertDescription } from "../../AdimPage/components/ui/alert"

export function CreateHackathon({ onBack }) {
  const { user, token } = useAuth(); // Using AuthContext instead of localStorage
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    problemStatements: [""],
    status: "upcoming",
    maxParticipants: 100,
    registrationDeadline: "",
    submissionDeadline: "",
    category: "",
    difficulty: "Beginner",
    difficultyLevel: "Beginner", // Added for backend compatibility
    location: "",
    mode: "online", // Added mode field
    prizePool: {
      amount: "",
      currency: "USD",
      breakdown: ""
    },
    requirements: [""],
    perks: [""],
    tags: [],
    images: {
      banner: null,
      logo: null,
      gallery: []
    }
  })

  const [currentTag, setCurrentTag] = useState("")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadStates, setUploadStates] = useState({
    banner: { uploading: false, error: null },
    logo: { uploading: false, error: null },
    gallery: { uploading: false, error: null }
  })

  const categories = [
    "Artificial Intelligence",
    "Fintech",
    "Healthcare",
    "Gaming",
    "EdTech",
    "Social Impact",
    "Open Innovation",
    "Blockchain",
    "Cybersecurity",
    "Sustainability",
    "Mobile Development",
    "Web Development",
    "IoT",
    "Data Science",
    "DevOps",
    "Other"
  ]

  const modes = ["online", "offline", "hybrid"]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required"
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      newErrors.endDate = "End date must be after start date"
    }

    if (!formData.registrationDeadline) {
      newErrors.registrationDeadline = "Registration deadline is required"
    }

    if (
      formData.registrationDeadline &&
      formData.startDate &&
      new Date(formData.registrationDeadline) >= new Date(formData.startDate)
    ) {
      newErrors.registrationDeadline =
        "Registration deadline must be before start date"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Image upload function from first file
  const handleFileSelect = async (file, type) => {
    if (!file) return;

    setUploadStates(prev => ({
      ...prev,
      [type]: { uploading: true, error: null }
    }));

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const res = await fetch("http://localhost:3000/api/uploads/image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: uploadFormData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      // Update formData.images
      setFormData((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          [type]: data // { url, publicId, width, height }
        }
      }));

      setUploadStates(prev => ({
        ...prev,
        [type]: { uploading: false, error: null }
      }));
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStates(prev => ({
        ...prev,
        [type]: { uploading: false, error: err.message }
      }));
    }
  };

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

  // Updated submit function with proper backend integration
  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validateForm()) return;

    setIsSubmitting(true);

    try {
      if (!token) {
        alert("You must be logged in to create a hackathon.");
        return;
      }

      const response = await fetch("http://localhost:3000/api/hackathons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          difficulty: formData.difficulty, // match backend schema
          difficultyLevel: formData.difficulty, // ensure compatibility
          problemStatements: formData.problemStatements.filter(ps => ps.trim()),
          requirements: formData.requirements.filter(r => r.trim()),
          perks: formData.perks.filter(p => p.trim()),
          tags: formData.tags,
          status: isDraft ? "draft" : formData.status,
          // Convert string dates to proper format if needed
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
          registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : null,
          submissionDeadline: formData.submissionDeadline ? new Date(formData.submissionDeadline).toISOString() : null,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create hackathon");
      }

      const data = await response.json();
      alert(isDraft ? "✅ Hackathon saved as draft!" : "✅ Hackathon created successfully!");
      onBack(); // Redirect to CreatedHackathons
    } catch (error) {
      console.error("❌ Submission failed:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addProblemStatement = () => {
    setFormData({
      ...formData,
      problemStatements: [...formData.problemStatements, ""]
    })
  }

  const removeProblemStatement = index => {
    setFormData({
      ...formData,
      problemStatements: formData.problemStatements.filter(
        (_, i) => i !== index
      )
    })
  }

  const updateProblemStatement = (index, value) => {
    const updated = [...formData.problemStatements]
    updated[index] = value
    setFormData({ ...formData, problemStatements: updated })
  }

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, ""]
    })
  }

  const removeRequirement = index => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    })
  }

  const updateRequirement = (index, value) => {
    const updated = [...formData.requirements]
    updated[index] = value
    setFormData({ ...formData, requirements: updated })
  }

  const addPerk = () => {
    setFormData({
      ...formData,
      perks: [...formData.perks, ""]
    })
  }

  const removePerk = index => {
    setFormData({
      ...formData,
      perks: formData.perks.filter((_, i) => i !== index)
    })
  }

  const updatePerk = (index, value) => {
    const updated = [...formData.perks]
    updated[index] = value
    setFormData({ ...formData, perks: updated })
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()]
      })
      setCurrentTag("")
    }
  }

  const removeTag = tagToRemove => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  // Image upload component
  const ImageUploadCard = ({ title, description, type, currentImage, multiple = false }) => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Upload Area */}
        <div className="space-y-3">
          <label
            htmlFor={`upload-${type}`}
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
              uploadStates[type]?.uploading
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploadStates[type]?.uploading ? (
                <Loader2 className="w-8 h-8 mb-2 text-purple-400 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
              )}
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
            </div>
            <input
              id={`upload-${type}`}
              type="file"
              className="hidden"
              accept="image/*"
              multiple={multiple}
              onChange={e => {
                const file = e.target.files[0]
                if (file) handleFileSelect(file, type)
              }}
              disabled={uploadStates[type]?.uploading}
            />
          </label>

          {/* Error Display */}
          {uploadStates[type]?.error && (
            <div className="flex items-center text-red-500 text-sm">
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
                className="w-full h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => removeImage(type)}
              >
                <X className="w-3 h-3" />
              </Button>
              <div className="absolute bottom-2 left-2 bg-green-500 rounded-full p-1">
                <Check className="w-3 h-3 text-white" />
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
                    className="w-full h-20 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 h-5 w-5 p-0"
                    onClick={() => removeImage("gallery", index)}
                  >
                    <X className="w-2 h-2" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

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
          Back to Created Hackathons
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Create New Hackathon
          </h1>
          <p className="text-sm text-gray-500">
            Set up your hackathon event with all the necessary details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Essential details about your hackathon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Hackathon Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter hackathon title..."
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your hackathon, its goals, and what participants can expect..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={value =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger
                      className={errors.category ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black shadow-lg rounded-md border">
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={value =>
                      setFormData({ ...formData, difficulty: value, difficultyLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black shadow-lg rounded-md border">
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="mode">Mode</Label>
                  <Select
                    value={formData.mode}
                    onValueChange={value =>
                      setFormData({ ...formData, mode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black shadow-lg rounded-md border">
                      {modes.map(mode => (
                        <SelectItem key={mode} value={mode} className="capitalize">
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={e =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Virtual, San Francisco, CA, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="prizeAmount">Prize Amount</Label>
                  <Input
                    id="prizeAmount"
                    type="number"
                    value={formData.prizePool.amount}
                    onChange={e =>
                      setFormData({ 
                        ...formData, 
                        prizePool: { ...formData.prizePool, amount: e.target.value }
                      })
                    }
                    placeholder="10000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="prizeBreakdown">Prize Breakdown</Label>
                <Textarea
                  id="prizeBreakdown"
                  value={formData.prizePool.breakdown}
                  onChange={e =>
                    setFormData({ 
                      ...formData, 
                      prizePool: { ...formData.prizePool, breakdown: e.target.value }
                    })
                  }
                  placeholder="1st Place: $5000, 2nd Place: $3000, 3rd Place: $2000..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images & Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                Images & Media
              </CardTitle>
              <CardDescription>
                Upload images to make your hackathon more attractive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploadCard
                  title="Banner Image"
                  description="Main banner (1200x600px recommended)"
                  type="banner"
                  currentImage={formData.images.banner}
                />
                <ImageUploadCard
                  title="Logo"
                  description="Hackathon logo (400x400px recommended)"
                  type="logo"
                  currentImage={formData.images.logo}
                />
              </div>
              <ImageUploadCard
                title="Gallery Images"
                description="Additional showcase images"
                type="gallery"
                currentImage={null}
                multiple={true}
              />
            </CardContent>
          </Card>

          {/* Dates and Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Dates & Deadlines
              </CardTitle>
              <CardDescription>
                Set important dates for your hackathon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={e =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={e =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registrationDeadline">
                    Registration Deadline *
                  </Label>
                  <Input
                    id="registrationDeadline"
                    type="datetime-local"
                    value={formData.registrationDeadline}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        registrationDeadline: e.target.value
                      })
                    }
                    className={
                      errors.registrationDeadline ? "border-red-500" : ""
                    }
                  />
                  {errors.registrationDeadline && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.registrationDeadline}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="submissionDeadline">
                    Submission Deadline
                  </Label>
                  <Input
                    id="submissionDeadline"
                    type="datetime-local"
                    value={formData.submissionDeadline}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        submissionDeadline: e.target.value
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Problem Statements */}
          <Card>
            <CardHeader>
              <CardTitle>Problem Statements</CardTitle>
              <CardDescription>
                Define the challenges participants will work on
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.problemStatements.map((statement, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={statement}
                    onChange={e =>
                      updateProblemStatement(index, e.target.value)
                    }
                    placeholder={`Problem statement ${index + 1}...`}
                    rows={2}
                    className="flex-1"
                  />
                  {formData.problemStatements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeProblemStatement(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addProblemStatement}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Problem Statement
              </Button>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>
                What participants need to know or have
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={requirement}
                    onChange={e => updateRequirement(index, e.target.value)}
                    placeholder={`Requirement ${index + 1}...`}
                    className="flex-1"
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addRequirement}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Requirement
              </Button>
            </CardContent>
          </Card>

          {/* Perks */}
          <Card>
            <CardHeader>
              <CardTitle>Perks & Benefits</CardTitle>
              <CardDescription>
                What participants will get from joining
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.perks.map((perk, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={perk}
                    onChange={e => updatePerk(index, e.target.value)}
                    placeholder={`Perk ${index + 1}...`}
                    className="flex-1"
                  />
                  {formData.perks.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePerk(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addPerk}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Perk
              </Button>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add relevant tags to help participants find your hackathon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a tag and press Enter..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  disabled={!currentTag.trim()}
                >
                  Add Tag
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      maxParticipants: Number.parseInt(e.target.value) || 0
                    })
                  }
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={value =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black shadow-lg rounded-md border">
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                How your hackathon will appear to participants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h3 className="font-medium">
                  {formData.title || "Hackathon Title"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.description ||
                    "Hackathon description will appear here..."}
                </p>
                <div className="flex gap-2 mt-2">
                  {formData.category && (
                    <Badge variant="outline">{formData.category}</Badge>
                  )}
                  <Badge variant="outline">{formData.difficulty}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Creating..." : "Create Hackathon"}
              </Button>
              <Button
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                variant="outline"
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Separator />
              <Button onClick={onBack} variant="outline" className="w-full">
                Cancel
              </Button>
            </CardContent>
          </Card>

          {/* Help */}
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Tip:</strong> You can save your hackathon as a draft and
              continue editing later. Required fields are marked with an
              asterisk (*).
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
