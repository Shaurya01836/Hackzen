"use client"
import { useState } from "react"
import {
  ArrowLeft,
  Upload,
  Github,
  Linkedin,
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  GraduationCap,
  Users,
  Lightbulb,
  Code,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/CommonUI/card"
import { Button } from "../../../components/CommonUI/button"
import { Input } from "../../../components/CommonUI/input"
import { Label } from "../../../components/CommonUI/label"
import { Textarea } from "../../../components/CommonUI/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../../components/CommonUI/select"
import { Checkbox } from "../../../components/DashboardUI/checkbox"
import { Badge } from "../../../components/CommonUI/badge"
import { Progress } from "../../../components/DashboardUI/progress"


export function HackathonRegistration({ hackathon, onBack, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    collegeOrCompany: "",
    degreeOrRole: "",
    yearOfStudyOrExperience: "",
    teamName: "",
    teamCode: "",
    projectIdea: "",
    track: "",
    github: "",
    linkedin: "",
    resumeURL: "",
    heardFrom: "",
    acceptedTerms: false
  })

  const [errors, setErrors] = useState({})

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const tracks = [
    "Web Development",
    "AI/ML",
    "Blockchain",
    "Cybersecurity",
    "Open Innovation"
  ]

  const validateStep = step => {
    const newErrors = {}

    switch (step) {
      case 1:
        if (!formData.fullName.trim())
          newErrors.fullName = "Full name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email"
        }
        if (!formData.collegeOrCompany.trim())
          newErrors.collegeOrCompany = "College/Company is required"
        break
      case 2:
        // Optional fields, no validation needed
        break
      case 3:
        if (!formData.teamName.trim())
          newErrors.teamName = "Team name is required"
        if (!formData.track) newErrors.track = "Please select a track"
        break
      case 4:
        if (!formData.acceptedTerms)
          newErrors.acceptedTerms = "You must accept the terms and conditions"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async () => {
  if (!validateStep(currentStep)) return;

  setIsSubmitting(true);
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token"); // assuming you store JWT here

    if (!user || !token) {
  alert("You must be logged in to register.");
  return;
}

    const response = await fetch("http://localhost:3000/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
  hackathonId: hackathon._id,
  formData: sanitizedFormData
})

    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to register");

    onSuccess(); // success handler
  } catch (error) {
    console.error("Registration failed:", error);
  } finally {
    setIsSubmitting(false);
}
};

// Clean gender field before submitting
const sanitizedFormData = {
  ...formData,
  gender: formData.gender || undefined, // ✅ convert "" to undefined
};


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Personal Information
              </h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={e => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={e => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={e => handleInputChange("age", e.target.value)}
                  placeholder="Enter your age"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={value => handleInputChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="collegeOrCompany"
                  className="flex items-center gap-2"
                >
                  <Building className="w-4 h-4" />
                  College/Company *
                </Label>
                <Input
                  id="collegeOrCompany"
                  value={formData.collegeOrCompany}
                  onChange={e =>
                    handleInputChange("collegeOrCompany", e.target.value)
                  }
                  placeholder="Enter your college or company"
                  className={errors.collegeOrCompany ? "border-red-500" : ""}
                />
                {errors.collegeOrCompany && (
                  <p className="text-sm text-red-500">
                    {errors.collegeOrCompany}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Academic/Professional Details
              </h2>
              <p className="text-gray-600">
                Help us understand your background
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="degreeOrRole"
                  className="flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  Degree/Role
                </Label>
                <Input
                  id="degreeOrRole"
                  value={formData.degreeOrRole}
                  onChange={e =>
                    handleInputChange("degreeOrRole", e.target.value)
                  }
                  placeholder="e.g., Computer Science, Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearOfStudyOrExperience">
                  Year of Study/Experience
                </Label>
                <Input
                  id="yearOfStudyOrExperience"
                  type="number"
                  value={formData.yearOfStudyOrExperience}
                  onChange={e =>
                    handleInputChange("yearOfStudyOrExperience", e.target.value)
                  }
                  placeholder="e.g., 2 (years)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github" className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub Profile
                </Label>
                <Input
                  id="github"
                  value={formData.github}
                  onChange={e => handleInputChange("github", e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={e => handleInputChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="resumeURL" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Resume URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="resumeURL"
                    value={formData.resumeURL}
                    onChange={e =>
                      handleInputChange("resumeURL", e.target.value)
                    }
                    placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Team & Project Details
              </h2>
              <p className="text-gray-600">
                Tell us about your team and project idea
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="teamName" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team Name *
                  </Label>
                  <Input
                    id="teamName"
                    value={formData.teamName}
                    onChange={e =>
                      handleInputChange("teamName", e.target.value)
                    }
                    placeholder="Enter your team name"
                    className={errors.teamName ? "border-red-500" : ""}
                  />
                  {errors.teamName && (
                    <p className="text-sm text-red-500">{errors.teamName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamCode">Team Code (Optional)</Label>
                  <Input
                    id="teamCode"
                    value={formData.teamCode}
                    onChange={e =>
                      handleInputChange("teamCode", e.target.value)
                    }
                    placeholder="Enter team code to join existing team"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="track" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Track *
                </Label>
                <Select
                  value={formData.track}
                  onValueChange={value => handleInputChange("track", value)}
                >
                  <SelectTrigger
                    className={errors.track ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select your preferred track" />
                  </SelectTrigger>
                  <SelectContent>
                    {tracks.map(track => (
                      <SelectItem key={track} value={track}>
                        {track}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.track && (
                  <p className="text-sm text-red-500">{errors.track}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="projectIdea"
                  className="flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Project Idea (Optional)
                </Label>
                <Textarea
                  id="projectIdea"
                  value={formData.projectIdea}
                  onChange={e =>
                    handleInputChange("projectIdea", e.target.value)
                  }
                  placeholder="Briefly describe your project idea (max 500 characters)"
                  maxLength={500}
                  rows={4}
                />
                <p className="text-sm text-gray-500 text-right">
                  {formData.projectIdea.length}/500 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heardFrom">
                  How did you hear about this hackathon?
                </Label>
                <Select
                  value={formData.heardFrom}
                  onValueChange={value => handleInputChange("heardFrom", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Friends">Friends</SelectItem>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Review & Submit
              </h2>
              <p className="text-gray-600">
                Please review your information before submitting
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Registration Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Personal Info</p>
                    <p>{formData.fullName}</p>
                    <p>{formData.email}</p>
                    <p>{formData.collegeOrCompany}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Track & Team</p>
                    <p>Track: {formData.track}</p>
                    {formData.teamName && <p>Team: {formData.teamName}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">
                      Important Notes
                    </h3>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      <li>
                        Registration deadline: {hackathon.registrationDeadline}
                      </li>
                      <li>
                        You will receive a confirmation email after registration
                      </li>
                      <li>Team formation can be done after registration</li>
                      <li>
                        All communication will be through the provided email
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptedTerms"
                checked={formData.acceptedTerms}
                onCheckedChange={checked =>
                  handleInputChange("acceptedTerms", checked)
                }
                className={errors.acceptedTerms ? "border-red-500" : ""}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="acceptedTerms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the terms and conditions *
                </Label>
                <p className="text-xs text-muted-foreground">
                  By registering, you agree to the hackathon rules and code of
                  conduct.
                </p>
              </div>
            </div>
            {errors.acceptedTerms && (
              <p className="text-sm text-red-500">{errors.acceptedTerms}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Details
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Register for {hackathon.name}
                </h1>
                <p className="text-sm text-gray-500">
                  Step {currentStep} of {totalSteps}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-green-600 border-green-600"
            >
              {hackathon.status}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pb-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardContent className="p-8">{renderStep()}</CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} className="flex items-center gap-2">
                Next
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Submit Registration
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
