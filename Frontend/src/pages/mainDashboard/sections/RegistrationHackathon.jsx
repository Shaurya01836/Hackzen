"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
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
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Clock,
  Award,
  Shield
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
import { useToast } from "../../../hooks/use-toast"

function generateTeamCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function HackathonRegistration({ hackathon, onBack, onSuccess }) {
  const { user } = useAuth()
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
    teamDescription: "",
    teamCode: generateTeamCode(),
    projectIdea: "",
    track: "",
    github: "",
    linkedin: "",
    resumeURL: "",
    heardFrom: "",
    acceptedTerms: false
  })

  const [errors, setErrors] = useState({})
  const [hasAutoFilled, setHasAutoFilled] = useState(false)
  const { toast } = useToast()

  // Auto-fill form with user data and previous registration data when component loads
  useEffect(() => {
    const fetchAndAutoFill = async () => {
      if (user) {
        // First, auto-fill with basic user data
        let autoFillData = {
          fullName: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          collegeOrCompany: user.collegeOrCompany || "",
          degreeOrRole: user.degreeOrRole || "",
          yearOfStudyOrExperience: user.yearOfStudyOrExperience || "",
          github: user.github || "",
          linkedin: user.linkedin || ""
        };

        let hasPreviousData = false;

        // Then, try to fetch previous registration data
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("http://localhost:3000/api/registration/last-registration", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.hasPreviousRegistration && data.formData) {
              hasPreviousData = true;
              // Merge previous registration data with user data
              // Prefer user data for basic fields, but use previous registration data for additional fields
              autoFillData = {
                ...autoFillData,
                age: data.formData.age || "",
                gender: data.formData.gender || "",
                resumeURL: data.formData.resumeURL || "",
                heardFrom: data.formData.heardFrom || "",
                // Keep user's basic info but use previous registration data for other fields
                fullName: user.name || data.formData.fullName || "",
                email: user.email || data.formData.email || "",
                phone: user.phone || data.formData.phone || "",
                collegeOrCompany: user.collegeOrCompany || data.formData.collegeOrCompany || "",
                degreeOrRole: user.degreeOrRole || data.formData.degreeOrRole || "",
                yearOfStudyOrExperience: user.yearOfStudyOrExperience || data.formData.yearOfStudyOrExperience || "",
                github: user.github || data.formData.github || "",
                linkedin: user.linkedin || data.formData.linkedin || ""
              };
            }
          }
        } catch (error) {
          console.log("Could not fetch previous registration data:", error);
        }

        setFormData(prev => ({
          ...prev,
          ...autoFillData
        }));

        // Set flag to show auto-fill message
        if (hasPreviousData) {
          setHasAutoFilled(true);
          toast({
            title: "Auto-fill Applied",
            description: "Your previous registration details have been auto-filled. You can modify any field if needed.",
            duration: 3000
          });
        }
      }
    };

    fetchAndAutoFill();
  }, [user])

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const tracks = [
    "Web Development",
    "AI/ML",
    "Blockchain",
    "Cybersecurity",
    "Open Innovation"
  ]

  const steps = [
    { id: 1, title: "Personal Info", icon: User, description: "Basic information" },
    { id: 2, title: "Background", icon: GraduationCap, description: "Academic & professional" },
    { id: 3, title: "Team & Project", icon: Users, description: "Team details & ideas" },
    { id: 4, title: "Review", icon: CheckCircle, description: "Final confirmation" }
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
        console.error("You must be logged in to register.");
        return;
      }

      console.log("Submitting registration with data:", {
        hackathonId: hackathon._id,
        formData: formData
      });

      const response = await fetch("http://localhost:3000/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hackathonId: hackathon._id,
          formData
        })
      });

      const data = await response.json();
      console.log("Registration response:", data);

      if (!response.ok) {
        if (data.message && data.message.includes("Already registered")) {
          console.log("Already registered, treating as success");
          onSuccess(); // treat as success
          return;
        }
        throw new Error(data.message || "Failed to register");
      }

      // Show success message with team information
      if (data.team) {
        console.log("Team created successfully:", data.team);
        toast({
          title: "Registration Successful!",
          description: `Your team \"${data.team.name}\" has been created. Team code: ${data.team.teamCode}`,
          duration: 3000
        });
      } else {
        console.log("No team data in response");
        toast({
          title: "Registration Successful!",
          description: "You have successfully registered in the hackathon!",
          duration: 3000
        });
      }

      onSuccess(); // success handler
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        title: "Registration Failed",
        description: error.message,
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 py-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Personal Information
              </h2>
              <p className="text-gray-600 text-lg">Let's start with your basic details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={e => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className={`h-12 text-base ${errors.fullName ? "border-red-500 focus:border-red-500" : ""} ${hasAutoFilled && formData.fullName ? "border-blue-300 bg-blue-50" : ""}`}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className={`h-12 text-base ${errors.email ? "border-red-500 focus:border-red-500" : ""} ${hasAutoFilled && formData.email ? "border-blue-300 bg-blue-50" : ""}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={e => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className={`h-12 text-base ${hasAutoFilled && formData.phone ? "border-blue-300 bg-blue-50" : ""}`}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="age" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={e => handleInputChange("age", e.target.value)}
                  placeholder="Enter your age"
                  className={`h-12 text-base ${hasAutoFilled && formData.age ? "border-blue-300 bg-blue-50" : ""}`}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={value => handleInputChange("gender", value)}
                >
                  <SelectTrigger className={`h-12 text-base ${hasAutoFilled && formData.gender ? "border-blue-300 bg-blue-50" : ""}`}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="collegeOrCompany" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  College/Company *
                </Label>
                <Input
                  id="collegeOrCompany"
                  value={formData.collegeOrCompany}
                  onChange={e => handleInputChange("collegeOrCompany", e.target.value)}
                  placeholder="Enter your college or company"
                  className={`h-12 text-base ${errors.collegeOrCompany ? "border-red-500 focus:border-red-500" : ""} ${hasAutoFilled && formData.collegeOrCompany ? "border-blue-300 bg-blue-50" : ""}`}
                />
                {errors.collegeOrCompany && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.collegeOrCompany}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8 py-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <GraduationCap className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Academic & Professional Background
              </h2>
              <p className="text-gray-600 text-lg">Help us understand your experience level</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="degreeOrRole" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Degree/Role
                </Label>
                <Input
                  id="degreeOrRole"
                  value={formData.degreeOrRole}
                  onChange={e => handleInputChange("degreeOrRole", e.target.value)}
                  placeholder="e.g., Computer Science, Software Engineer"
                  className={`h-12 text-base ${hasAutoFilled && formData.degreeOrRole ? "border-blue-300 bg-blue-50" : ""}`}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="yearOfStudyOrExperience" className="text-sm font-semibold text-gray-700">
                  Year of Study/Experience
                </Label>
                <Input
                  id="yearOfStudyOrExperience"
                  type="number"
                  value={formData.yearOfStudyOrExperience}
                  onChange={e => handleInputChange("yearOfStudyOrExperience", e.target.value)}
                  placeholder="e.g., 2 (years)"
                  className={`h-12 text-base ${hasAutoFilled && formData.yearOfStudyOrExperience ? "border-blue-300 bg-blue-50" : ""}`}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="github" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub Profile
                </Label>
                <Input
                  id="github"
                  value={formData.github}
                  onChange={e => handleInputChange("github", e.target.value)}
                  placeholder="https://github.com/username"
                  className={`h-12 text-base ${hasAutoFilled && formData.github ? "border-blue-300 bg-blue-50" : ""}`}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="linkedin" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={e => handleInputChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className={`h-12 text-base ${hasAutoFilled && formData.linkedin ? "border-blue-300 bg-blue-50" : ""}`}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8 py-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Team & Project Details
              </h2>
              <p className="text-gray-600 text-lg">Tell us about your team and project idea</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="teamName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Team Name *
                  </Label>
                  <Input
                    id="teamName"
                    value={formData.teamName}
                    onChange={e => handleInputChange("teamName", e.target.value)}
                    placeholder="Enter your team name"
                    className={`h-12 text-base ${errors.teamName ? "border-red-500 focus:border-red-500" : ""}`}
                  />
                  {errors.teamName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.teamName}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="track" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Track *
                  </Label>
                  <Select
                    value={formData.track}
                    onValueChange={value => handleInputChange("track", value)}
                  >
                    <SelectTrigger className={`h-12 text-base ${errors.track ? "border-red-500 focus:border-red-500" : ""}`}>
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
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.track}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Team Information</span>
                </div>
                <p className="text-sm text-blue-700">
                  This hackathon allows teams of <strong>{hackathon.teamSize?.min || 1} to {hackathon.teamSize?.max || 4} members</strong>
                  {hackathon.teamSize?.allowSolo ? ' (solo participation allowed)' : ''}.
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="teamDescription" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Team Description (Optional)
                </Label>
                <Textarea
                  id="teamDescription"
                  value={formData.teamDescription}
                  onChange={e => handleInputChange("teamDescription", e.target.value)}
                  placeholder="Describe your team's goals, skills, and what you hope to achieve"
                  maxLength={300}
                  rows={3}
                  className="text-base resize-none"
                />
                <p className="text-sm text-gray-500 text-right">
                  {formData.teamDescription.length}/300 characters
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="projectIdea" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Project Idea (Optional)
                </Label>
                <Textarea
                  id="projectIdea"
                  value={formData.projectIdea}
                  onChange={e => handleInputChange("projectIdea", e.target.value)}
                  placeholder="Briefly describe your project idea"
                  maxLength={500}
                  rows={4}
                  className="text-base resize-none"
                />
                <p className="text-sm text-gray-500 text-right">
                  {formData.projectIdea.length}/500 characters
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="heardFrom" className="text-sm font-semibold text-gray-700">
                  How did you hear about this hackathon?
                </Label>
                <Select
                  value={formData.heardFrom}
                  onValueChange={value => handleInputChange("heardFrom", value)}
                >
                  <SelectTrigger className="h-12 text-base">
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
          <div className="space-y-8 py-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Review & Submit
              </h2>
              <p className="text-gray-600 text-lg">Please review your information before submitting</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-100 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">College/Company:</span>
                    <span className="font-medium">{formData.collegeOrCompany}</span>
                  </div>
                  {formData.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-100 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="w-5 h-5 text-green-600" />
                    Team & Project
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Team Name:</span>
                    <span className="font-medium">{formData.teamName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Track:</span>
                    <span className="font-medium">{formData.track}</span>
                  </div>
                  {formData.teamDescription && (
                    <div>
                      <span className="text-gray-600">Description:</span>
                      <p className="font-medium text-xs mt-1">{formData.teamDescription}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-800 text-lg mb-3">
                      Important Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-700">Registration deadline: {hackathon.registrationDeadline}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-700">Team size: {hackathon.teamSize?.min || 1} to {hackathon.teamSize?.max || 4} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-700">Confirmation email will be sent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-700">Team will be created automatically</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Checkbox
                id="acceptedTerms"
                checked={formData.acceptedTerms}
                onCheckedChange={checked => handleInputChange("acceptedTerms", checked)}
                className={`${errors.acceptedTerms ? "border-red-500" : ""} data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 data-[state=checked]:text-white`}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="acceptedTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I accept the terms and conditions *
                </Label>
                <p className="text-xs text-gray-600">
                  By registering, you agree to the hackathon rules and code of conduct.
                </p>
              </div>
            </div>
            {errors.acceptedTerms && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.acceptedTerms}
              </p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 z-50 overflow-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-10">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="flex items-center gap-2 hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Register for {hackathon.name}
                  </h1>
                  <p className="text-xs text-gray-500">
                    Step {currentStep} of {totalSteps}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                {hackathon.status}
              </Badge>
            </div>

            {/* Simple Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600 min-w-[60px]">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">{renderStep()}</CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 h-12"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button 
                onClick={handleNext} 
                className="flex items-center gap-2 px-6 py-3 h-12 bg-indigo-600 hover:bg-indigo-700"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
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