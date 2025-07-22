"use client"
import { useState } from "react"
import { Button } from "../../components/CommonUI/button"
import { Card, CardContent } from "../../components/CommonUI/card"
import { Input } from "../../components/CommonUI/input"
import { Label } from "../../components/CommonUI/label"
import { Textarea } from "../../components/CommonUI/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/CommonUI/select"
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Trophy,
  Gavel,
  Code,
  Zap,
  Sparkles,
  Rocket,
  Brain,
  Check
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState(null)
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "prefer-not-to-say",
    country: "",
    city: "",
    bio: "",

    // Academic/Educational Information
    userType: "",
    domain: "",
    course: "",
    courseDuration: "",
    collegeName: "",
    courseSpecialization: "",
    currentYear: "",

    // Professional Information
    companyName: "",
    jobTitle: "",
    yearsOfExperience: "",

    // Skills & Interests (arrays)
    skills: "",
    interests: "",

    // Social Media & Professional Links
    website: "",
    linkedin: "",
    github: "",
    githubUsername: "",
    githubProfile: "",
    twitter: "",
    instagram: "",
    portfolio: "",
    telegram: "",
    discord: "",

    // Hackathon Preferences
    preferredHackathonTypes: "",
    teamSizePreference: "",

    // Organizer specific
    organization: "",
    position: "",
    experience_years: "",
    previous_events: "",
    motivation: "",

    // Judge specific
    company: "",
    job_title: "",
    expertise_areas: "",
    judging_experience: "",
    linkedin_judge: "",
    bio_judge: ""
  })

  const roles = [
    {
      id: "participant",
      title: "Join as Participant",
      description:
        "Compete in hackathons, build amazing projects, and win prizes",
      icon: Code,
      color: "bg-[#4F46E5]"
    },
    {
      id: "organizer",
      title: "Become an Organizer",
      description: "Host hackathons, manage events, and build communities",
      icon: Users,
      color: "bg-[#10B981]"
    },
    {
      id: "judge",
      title: "Serve as Judge",
      description:
        "Evaluate projects, mentor participants, and shape the future",
      icon: Gavel,
      color: "bg-[#8B5CF6]"
    }
  ]

  const getMaxSteps = () => {
    switch (selectedRole) {
      case "participant":
        return 8 // Role + 7 steps
      case "organizer":
        return 4 // Role + 3 steps
      case "judge":
        return 4 // Role + 3 steps
      default:
        return 2
    }
  }

  const getStepTitle = () => {
    if (currentStep === 1) return "Choose Your Role"

    const stepTitles = {
      participant: {
        2: "Basic Information",
        3: "Academic Details",
        4: "Course & Specialization",
        5: "Skills & Interests",
        6: "Professional Details",
        7: "Social & Professional Links",
        8: "Hackathon Preferences & Bio"
      },
      organizer: {
        2: "Basic Information",
        3: "Organization Details",
        4: "Experience & Motivation"
      },
      judge: {
        2: "Basic Information",
        3: "Professional Details",
        4: "Expertise & Bio"
      }
    }

    return stepTitles[selectedRole]?.[currentStep] || "Complete Profile"
  }

  const handleRoleSelect = role => {
    setSelectedRole(role)
  }

  const [validationErrors, setValidationErrors] = useState({})

  const getValidationErrors = () => {
    const errors = {}

    if (currentStep === 2) {
      if (!formData.firstName.trim())
        errors.firstName = "First name is required"
      if (!formData.lastName.trim()) errors.lastName = "Last name is required"
      if (!formData.email.trim()) errors.email = "Email is required"
      if (!formData.password.trim()) errors.password = "Password is required"
      if (!formData.confirmPassword.trim())
        errors.confirmPassword = "Please confirm your password"
      if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = "Passwords do not match"
      if (!formData.phone.trim()) errors.phone = "Phone number is required"
      if (!formData.country.trim()) errors.country = "Country is required"
    }

    if (currentStep === 3) {
      switch (selectedRole) {
        case "participant":
          if (!formData.collegeName.trim())
            errors.collegeName = "College name is required"
          if (!formData.userType.trim())
            errors.userType = "User type is required"
          break
        case "organizer":
          if (!formData.organization.trim())
            errors.organization = "Organization is required"
          if (!formData.position.trim())
            errors.position = "Position is required"
          break
        case "judge":
          if (!formData.company.trim()) errors.company = "Company is required"
          if (!formData.job_title.trim())
            errors.job_title = "Job title is required"
          if (!formData.yearsOfExperience.trim())
            errors.yearsOfExperience = "Experience is required"
          break
      }
    }

    if (currentStep === 4) {
      switch (selectedRole) {
        case "participant":
          if (!formData.course.trim()) errors.course = "Course is required"
          if (!formData.courseDuration.trim())
            errors.courseDuration = "Course duration is required"
          if (!formData.courseSpecialization.trim())
            errors.courseSpecialization = "Course specialization is required"
          break
        case "organizer":
          if (!formData.experience_years.trim())
            errors.experience_years = "Experience is required"
          if (!formData.motivation.trim())
            errors.motivation = "Motivation is required"
          break
        case "judge":
          if (!formData.expertise_areas.trim())
            errors.expertise_areas = "Expertise areas are required"
          if (!formData.judging_experience.trim())
            errors.judging_experience = "Judging experience is required"
          if (!formData.bio_judge.trim())
            errors.bio_judge = "Professional bio is required"
          break
      }
    }

    if (currentStep === 5) {
      switch (selectedRole) {
        case "participant":
          if (!formData.skills.trim()) errors.skills = "Skills are required"
          break
      }
    }

    return errors
  }

  const handleNext = () => {
    const errors = getValidationErrors()
    setValidationErrors(errors)

    if (Object.keys(errors).length === 0 && canProceed()) {
      const maxSteps = getMaxSteps()
      if (currentStep < maxSteps) {
        setCurrentStep(currentStep + 1)
        setValidationErrors({})
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const renderProgressBar = () => {
    if (currentStep === 1) return null

    const maxSteps = getMaxSteps() - 1
    const currentFormStep = currentStep - 1
    const progress = (currentFormStep / maxSteps) * 100

    return (
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>
            Step {currentFormStep} of {maxSteps}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#4F46E5] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )
  }

  const renderBasicInformation = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-[#111827] font-medium">
            First Name *
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={e => handleInputChange("firstName", e.target.value)}
            placeholder="John"
            className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
              validationErrors.firstName
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
          />
          {validationErrors.firstName && (
            <p className="text-red-500 text-sm">{validationErrors.firstName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-[#111827] font-medium">
            Last Name *
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={e => handleInputChange("lastName", e.target.value)}
            placeholder="Doe"
            className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
              validationErrors.lastName
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
          />
          {validationErrors.lastName && (
            <p className="text-red-500 text-sm">{validationErrors.lastName}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#111827] font-medium">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={e => handleInputChange("email", e.target.value)}
          placeholder="john@example.com"
          className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
            validationErrors.email
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          }`}
        />
        {validationErrors.email && (
          <p className="text-red-500 text-sm">{validationErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-[#111827] font-medium">
          Phone Number *
        </Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={e => handleInputChange("phone", e.target.value)}
          placeholder="Enter your phone number"
          className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
            validationErrors.phone
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : ""
          }`}
        />
        {validationErrors.phone && (
          <p className="text-red-500 text-sm">{validationErrors.phone}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#111827] font-medium">
            Password *
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={e => handleInputChange("password", e.target.value)}
            className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
              validationErrors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
          />
          {validationErrors.password && (
            <p className="text-red-500 text-sm">{validationErrors.password}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-[#111827] font-medium"
          >
            Confirm Password *
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={e => handleInputChange("confirmPassword", e.target.value)}
            className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
              validationErrors.confirmPassword
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
          />
          {validationErrors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-[#111827] font-medium">
            Gender
          </Label>
          <Select onValueChange={value => handleInputChange("gender", value)}>
            <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prefer-not-to-say">
                Prefer not to say
              </SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country" className="text-[#111827] font-medium">
            Country *
          </Label>
          <Input
            id="country"
            value={formData.country}
            onChange={e => handleInputChange("country", e.target.value)}
            placeholder="Enter your country"
            className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
              validationErrors.country
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
          />
          {validationErrors.country && (
            <p className="text-red-500 text-sm">{validationErrors.country}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city" className="text-[#111827] font-medium">
          City *
        </Label>
        <Input
          id="city"
          value={formData.city}
          onChange={e => handleInputChange("city", e.target.value)}
          placeholder="Enter your city"
          className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
        />
      </div>
    </div>
  )

  const renderParticipantStep = step => {
    switch (step) {
      case 3: // Academic Details
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="collegeName"
                className="text-[#111827] font-medium"
              >
                College/Institution Name *
              </Label>
              <Input
                id="collegeName"
                value={formData.collegeName}
                onChange={e => handleInputChange("collegeName", e.target.value)}
                placeholder="Poornima College of Engineering"
                className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
                  validationErrors.collegeName
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {validationErrors.collegeName && (
                <p className="text-red-500 text-sm">
                  {validationErrors.collegeName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="userType"
                  className="text-[#111827] font-medium"
                >
                  User Type *
                </Label>
                <Select
                  onValueChange={value => handleInputChange("userType", value)}
                >
                  <SelectTrigger
                    className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
                      validationErrors.userType
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School Student</SelectItem>
                    <SelectItem value="college">College Student</SelectItem>
                    <SelectItem value="fresher">Fresher</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.userType && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.userType}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="currentYear"
                  className="text-[#111827] font-medium"
                >
                  Current Year
                </Label>
                <Select
                  onValueChange={value =>
                    handleInputChange("currentYear", value)
                  }
                >
                  <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
                    <SelectValue placeholder="Select current year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st-year">1st Year</SelectItem>
                    <SelectItem value="2nd-year">2nd Year</SelectItem>
                    <SelectItem value="3rd-year">3rd Year</SelectItem>
                    <SelectItem value="4th-year">4th Year</SelectItem>
                    <SelectItem value="final-year">Final Year</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 4: // Course & Specialization
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course" className="text-[#111827] font-medium">
                Course *
              </Label>
              <Input
                id="course"
                value={formData.course}
                onChange={e => handleInputChange("course", e.target.value)}
                placeholder="B.Tech, B.E., BCA, etc."
                className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
                  validationErrors.course
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {validationErrors.course && (
                <p className="text-red-500 text-sm">
                  {validationErrors.course}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="courseDuration"
                  className="text-[#111827] font-medium"
                >
                  Course Duration *
                </Label>
                <Select
                  onValueChange={value =>
                    handleInputChange("courseDuration", value)
                  }
                >
                  <SelectTrigger
                    className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
                      validationErrors.courseDuration
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="2-years">2 Years</SelectItem>
                    <SelectItem value="3-years">3 Years</SelectItem>
                    <SelectItem value="4-years">4 Years</SelectItem>
                    <SelectItem value="5-years">5 Years</SelectItem>
                    <SelectItem value="6-years">6 Years</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.courseDuration && (
                  <p className="text-red-500 text-sm">
                    {validationErrors.courseDuration}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain" className="text-[#111827] font-medium">
                  Domain
                </Label>
                <Select
                  onValueChange={value => handleInputChange("domain", value)}
                >
                  <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="computer-science">
                      Computer Science
                    </SelectItem>
                    <SelectItem value="information-technology">
                      Information Technology
                    </SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="artificial-intelligence">
                      Artificial Intelligence
                    </SelectItem>
                    <SelectItem value="machine-learning">
                      Machine Learning
                    </SelectItem>
                    <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="web-development">
                      Web Development
                    </SelectItem>
                    <SelectItem value="mobile-development">
                      Mobile Development
                    </SelectItem>
                    <SelectItem value="game-development">
                      Game Development
                    </SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="courseSpecialization"
                className="text-[#111827] font-medium"
              >
                Course Specialization *
              </Label>
              <Input
                id="courseSpecialization"
                value={formData.courseSpecialization}
                onChange={e =>
                  handleInputChange("courseSpecialization", e.target.value)
                }
                placeholder="Computer Science, Information Technology, etc."
                className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
                  validationErrors.courseSpecialization
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {validationErrors.courseSpecialization && (
                <p className="text-red-500 text-sm">
                  {validationErrors.courseSpecialization}
                </p>
              )}
            </div>
          </div>
        )

      case 5: // Skills & Interests
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-[#111827] font-medium">
                Technical Skills *
              </Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={e => handleInputChange("skills", e.target.value)}
                placeholder="JavaScript, Python, React, etc. (comma separated)"
                className={`border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] ${
                  validationErrors.skills
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
              />
              {validationErrors.skills && (
                <p className="text-red-500 text-sm">
                  {validationErrors.skills}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests" className="text-[#111827] font-medium">
                Interests
              </Label>
              <Input
                id="interests"
                value={formData.interests}
                onChange={e => handleInputChange("interests", e.target.value)}
                placeholder="AI, Web Development, Blockchain, etc. (comma separated)"
                className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
              />
            </div>
          </div>
        )

      case 6: // Professional Details
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="companyName"
                  className="text-[#111827] font-medium"
                >
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={e =>
                    handleInputChange("companyName", e.target.value)
                  }
                  placeholder="Your current company"
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="jobTitle"
                  className="text-[#111827] font-medium"
                >
                  Job Title
                </Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={e => handleInputChange("jobTitle", e.target.value)}
                  placeholder="Software Developer, Student, etc."
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="yearsOfExperience"
                className="text-[#111827] font-medium"
              >
                Years of Experience
              </Label>
              <Select
                onValueChange={value =>
                  handleInputChange("yearsOfExperience", value)
                }
              >
                <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="2-3">2-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 7: // Social & Professional Links
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website" className="text-[#111827] font-medium">
                  Website
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={e => handleInputChange("website", e.target.value)}
                  placeholder="https://your-website.com"
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="linkedin"
                  className="text-[#111827] font-medium"
                >
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={e => handleInputChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github" className="text-[#111827] font-medium">
                  GitHub Profile
                </Label>
                <Input
                  id="github"
                  value={formData.github}
                  onChange={e => handleInputChange("github", e.target.value)}
                  placeholder="https://github.com/username"
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="githubUsername"
                  className="text-[#111827] font-medium"
                >
                  GitHub Username
                </Label>
                <Input
                  id="githubUsername"
                  value={formData.githubUsername}
                  onChange={e =>
                    handleInputChange("githubUsername", e.target.value)
                  }
                  placeholder="username"
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio" className="text-[#111827] font-medium">
                Portfolio Website
              </Label>
              <Input
                id="portfolio"
                value={formData.portfolio}
                onChange={e => handleInputChange("portfolio", e.target.value)}
                placeholder="https://your-portfolio.com"
                className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitter" className="text-[#111827] font-medium">
                  Twitter/X
                </Label>
                <Input
                  id="twitter"
                  value={formData.twitter}
                  onChange={e => handleInputChange("twitter", e.target.value)}
                  placeholder="@username"
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="instagram"
                  className="text-[#111827] font-medium"
                >
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={e => handleInputChange("instagram", e.target.value)}
                  placeholder="@username"
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="telegram"
                  className="text-[#111827] font-medium"
                >
                  Telegram
                </Label>
                <Input
                  id="telegram"
                  value={formData.telegram}
                  onChange={e => handleInputChange("telegram", e.target.value)}
                  placeholder="@username"
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discord" className="text-[#111827] font-medium">
                  Discord
                </Label>
                <Input
                  id="discord"
                  value={formData.discord}
                  onChange={e => handleInputChange("discord", e.target.value)}
                  placeholder="username#1234"
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
            </div>
          </div>
        )

      case 8: // Hackathon Preferences & Bio
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="preferredHackathonTypes"
                className="text-[#111827] font-medium"
              >
                Preferred Hackathon Types
              </Label>
              <Input
                id="preferredHackathonTypes"
                value={formData.preferredHackathonTypes}
                onChange={e =>
                  handleInputChange("preferredHackathonTypes", e.target.value)
                }
                placeholder="web-development, ai-ml, blockchain, etc. (comma separated)"
                className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="teamSizePreference"
                className="text-[#111827] font-medium"
              >
                Team Size Preference
              </Label>
              <Select
                onValueChange={value =>
                  handleInputChange("teamSizePreference", value)
                }
              >
                <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo</SelectItem>
                  <SelectItem value="2-3">2-3 members</SelectItem>
                  <SelectItem value="4-5">4-5 members</SelectItem>
                  <SelectItem value="6+">6+ members</SelectItem>
                  <SelectItem value="any">Any size</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-[#111827] font-medium">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={e => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself, your interests, and what you hope to achieve..."
                className="min-h-[120px] border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] resize-none"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderOrganizerStep = step => {
    switch (step) {
      case 3: // Organization Details
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="organization"
                  className="text-[#111827] font-medium"
                >
                  Organization *
                </Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={e =>
                    handleInputChange("organization", e.target.value)
                  }
                  placeholder="Company or University"
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="position"
                  className="text-[#111827] font-medium"
                >
                  Position/Title *
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={e => handleInputChange("position", e.target.value)}
                  placeholder="Event Manager, Professor, etc."
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
            </div>
          </div>
        )

      case 4: // Experience & Motivation
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="experience_years"
                className="text-[#111827] font-medium"
              >
                Years of Event Experience *
              </Label>
              <Select
                onValueChange={value =>
                  handleInputChange("experience_years", value)
                }
              >
                <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="2-3">2-3 years</SelectItem>
                  <SelectItem value="4-5">4-5 years</SelectItem>
                  <SelectItem value="5+">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="motivation"
                className="text-[#111827] font-medium"
              >
                Why do you want to organize hackathons? *
              </Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={e => handleInputChange("motivation", e.target.value)}
                placeholder="Share your motivation and goals..."
                className="min-h-[120px] border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] resize-none"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderJudgeStep = step => {
    switch (step) {
      case 3: // Professional Details
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-[#111827] font-medium">
                  Company *
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={e => handleInputChange("company", e.target.value)}
                  placeholder="Your current company"
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="job_title"
                  className="text-[#111827] font-medium"
                >
                  Job Title *
                </Label>
                <Input
                  id="job_title"
                  value={formData.job_title}
                  onChange={e => handleInputChange("job_title", e.target.value)}
                  placeholder="Senior Developer, CTO, etc."
                  className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="yearsOfExperience"
                className="text-[#111827] font-medium"
              >
                Years of Professional Experience *
              </Label>
              <Select
                onValueChange={value =>
                  handleInputChange("yearsOfExperience", value)
                }
              >
                <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="2-3">2-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 4: // Expertise & Bio
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="expertise_areas"
                className="text-[#111827] font-medium"
              >
                Areas of Expertise *
              </Label>
              <Input
                id="expertise_areas"
                value={formData.expertise_areas}
                onChange={e =>
                  handleInputChange("expertise_areas", e.target.value)
                }
                placeholder="Web Development, AI/ML, Mobile Apps, etc."
                className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="judging_experience"
                className="text-[#111827] font-medium"
              >
                Previous Judging Experience *
              </Label>
              <Select
                onValueChange={value =>
                  handleInputChange("judging_experience", value)
                }
              >
                <SelectTrigger className="border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]">
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No previous experience</SelectItem>
                  <SelectItem value="1-3">1-3 events</SelectItem>
                  <SelectItem value="4-10">4-10 events</SelectItem>
                  <SelectItem value="10+">10+ events</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio_judge" className="text-[#111827] font-medium">
                Professional Bio *
              </Label>
              <Textarea
                id="bio_judge"
                value={formData.bio_judge}
                onChange={e => handleInputChange("bio_judge", e.target.value)}
                placeholder="Brief description of your background and expertise..."
                className="min-h-[120px] border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] resize-none"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-4 mb-6">
          {roles.map(role => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id

            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                  isSelected
                    ? "border-[#10B981] shadow-md bg-[#10B981]/5"
                    : "border-gray-200 hover:border-[#4F46E5]/30"
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-6">
                    <div
                      className={`w-10 h-10 ${role.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-[#111827]">
                          {role.title}
                        </h3>
                        {isSelected && (
                          <div className="w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-[#6B7280] text-sm">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )
    }

    if (currentStep === 2) {
      return renderBasicInformation()
    }

    switch (selectedRole) {
      case "participant":
        return renderParticipantStep(currentStep)
      case "organizer":
        return renderOrganizerStep(currentStep)
      case "judge":
        return renderJudgeStep(currentStep)
      default:
        return null
    }
  }

  const canProceed = () => {
    if (currentStep === 1) return selectedRole !== null

    if (currentStep === 2) {
      return (
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.password.trim() !== "" &&
        formData.confirmPassword.trim() !== "" &&
        formData.phone.trim() !== "" &&
        formData.country.trim() !== "" &&
        formData.password === formData.confirmPassword
      )
    }

    if (currentStep === 3) {
      switch (selectedRole) {
        case "participant":
          return (
            formData.collegeName.trim() !== "" &&
            formData.userType.trim() !== ""
          )
        case "organizer":
          return (
            formData.organization.trim() !== "" &&
            formData.position.trim() !== ""
          )
        case "judge":
          return (
            formData.company.trim() !== "" &&
            formData.job_title.trim() !== "" &&
            formData.yearsOfExperience.trim() !== ""
          )
        default:
          return true
      }
    }

    if (currentStep === 4) {
      switch (selectedRole) {
        case "participant":
          return (
            formData.course.trim() !== "" &&
            formData.courseDuration.trim() !== "" &&
            formData.courseSpecialization.trim() !== ""
          )
        case "organizer":
          return (
            formData.experience_years.trim() !== "" &&
            formData.motivation.trim() !== ""
          )
        case "judge":
          return (
            formData.expertise_areas.trim() !== "" &&
            formData.judging_experience.trim() !== "" &&
            formData.bio_judge.trim() !== ""
          )
        default:
          return true
      }
    }

    if (currentStep === 5 && selectedRole === "participant") {
      return formData.skills.trim() !== ""
    }

    return true
  }

  const isLastStep = () => {
    return currentStep === getMaxSteps()
  }

  const navigate = useNavigate()
  const { login } = useAuth()
  const [step, setStep] = useState(1) // 1: form, 2: verify code
  const [code, setCode] = useState("")
  const [emailForCode, setEmailForCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const MySwal = withReactContent(Swal)

  // On last step, handle registration
  const handleRegister = async () => {
    setErrorMsg("")
    setSuccessMsg("")
    setLoading(true)
    try {
      // 1. Register user (name, email, password)
      const name = `${formData.firstName} ${formData.lastName}`.trim()
      const res = await axios.post("http://localhost:3000/api/users/register", {
        name,
        email: formData.email,
        password: formData.password
      })
      setEmailForCode(formData.email)
      setSuccessMsg(res.data.message || "Verification code sent to your email.")
      // Show SweetAlert2 popup for code entry
      await showVerificationPopup()
    } catch (err) {
      // If the error is 'Verification code already sent', show the popup anyway
      const msg = err.response?.data?.message || "Registration failed. Please try again."
      setErrorMsg(msg)
      if (msg.includes("Verification code already sent")) {
        setEmailForCode(formData.email)
        await showVerificationPopup()
      }
    } finally {
      setLoading(false)
    }
  }

  // Show SweetAlert2 popup for code entry
  const showVerificationPopup = async () => {
    let verified = false
    let error = ""
    while (!verified) {
      const { value: code } = await MySwal.fire({
        title: "Enter Verification Code",
        input: "text",
        inputLabel: "A 6-digit code was sent to your email.",
        inputPlaceholder: "000000",
        inputAttributes: {
          maxlength: 6,
          autocapitalize: "off",
          autocorrect: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Verify & Create Account",
        cancelButtonText: "Cancel",
        inputValidator: (value) => {
          if (!value || value.length !== 6) {
            return "Please enter the 6-digit code."
          }
        },
        didOpen: () => {
          if (error) {
            MySwal.showValidationMessage(error)
          }
        }
      })
      if (!code) break // User cancelled
      setLoading(true)
      try {
        await handleVerifyCode(code)
        verified = true
      } catch (err) {
        error = err?.message || "Verification failed. Please try again."
        MySwal.showValidationMessage(error)
      } finally {
        setLoading(false)
      }
    }
  }

  // Handle verification code (now takes code as argument)
  const handleVerifyCode = async (code) => {
    setErrorMsg("")
    setSuccessMsg("")
    // setLoading(true) // handled in showVerificationPopup
    try {
      // 2. Verify code
      const res = await axios.post("http://localhost:3000/api/users/verify-registration", {
        email: emailForCode?.trim() || formData.email?.trim(),
        code: String(code).trim().padStart(6, "0")
      })
      // 3. Complete profile
      const user = res.data.user
      const token = res.data.token
      // Prepare profile fields
      const profileFields = {
        phone: formData.phone,
        gender: formData.gender,
        userType: formData.userType,
        domain: formData.domain,
        course: formData.course,
        courseDuration: formData.courseDuration,
        collegeName: formData.collegeName,
        country: formData.country,
        city: formData.city,
        courseSpecialization: formData.courseSpecialization,
        companyName: formData.companyName,
        jobTitle: formData.jobTitle,
        yearsOfExperience: formData.yearsOfExperience,
        currentYear: formData.currentYear,
        skills: formData.skills,
        interests: formData.interests,
        github: formData.github,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        instagram: formData.instagram,
        portfolio: formData.portfolio,
        telegram: formData.telegram,
        preferredHackathonTypes: formData.preferredHackathonTypes,
        teamSizePreference: formData.teamSizePreference || "any",
        bio: formData.bio,
        // Add any other fields as needed
        profileCompleted: true
      }
      await axios.put(
        `http://localhost:3000/api/users/${user._id}/complete-profile`,
        profileFields,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // 4. Update AuthContext and redirect
      await login({ ...user, profileCompleted: true }, token)
      navigate("/dashboard")
    } catch (err) {
      throw new Error(err.response?.data?.message || "Verification failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden h-[750px]">
        <div className="flex h-full">
          {/* Left Column - Branding */}
          <div className="w-1/2 bg-gradient-to-br from-[#4F46E5] via-[#8B5CF6] to-[#10B981] relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative z-10 flex flex-col justify-center items-center h-full p-12 text-white">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Zap className="w-7 h-7" />
                  </div>
                  <h1 className="text-4xl font-bold">HackZen</h1>
                </div>
                <p className="text-xl text-white/90 mb-2">
                  Where Innovation Meets Opportunity
                </p>
                <p className="text-white/80">
                  Join the ultimate hackathon platform and turn your ideas into
                  reality
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 max-w-sm w-full">
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Rocket className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Build & Innovate</h3>
                    <p className="text-sm text-white/80">
                      Create groundbreaking projects
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Compete & Win</h3>
                    <p className="text-sm text-white/80">
                      Earn recognition and prizes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Learn & Grow</h3>
                    <p className="text-sm text-white/80">
                      Connect with brilliant minds
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="w-1/2 bg-white flex flex-col">
            <div className="h-full flex flex-col p-8">
              {/* Header */}
              <div className="mb-6 flex-shrink-0">
                {currentStep > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-lg mb-4"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                <h2 className="text-3xl font-bold text-[#111827] mb-2">
                  {currentStep === 1 ? "Create a new account" : getStepTitle()}
                </h2>
                <p className="text-[#6B7280]">
                  {currentStep === 1
                    ? "Join HackZen and choose your role to get started"
                    : `Complete your ${selectedRole} profile`}
                </p>
              </div>

              {/* Progress Bar */}
              {renderProgressBar()}

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6">
                {renderStepContent()}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 space-y-4">
                {Object.keys(validationErrors).length > 0 && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    Please fill in all required fields to continue.
                  </div>
                )}
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                    {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {successMsg}
                  </div>
                )}
                {step === 2 ? (
                  <></>
                ) : (
                  <Button
                    onClick={
                      isLastStep()
                        ? handleRegister
                        : handleNext
                    }
                    disabled={loading || !canProceed()}
                    className="w-full bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white font-medium py-3 h-12 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : isLastStep() ? (
                      <>
                        Create Account
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}

                {currentStep === 1 && step === 1 && (
                  <div className="text-center text-sm text-[#6B7280]">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-[#4F46E5] hover:text-[#4F46E5]/80 font-medium"
                    >
                      Login
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
