"use client";
import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Users,
  ExternalLink,
  FileText,
  CheckCircle,
  X,
} from "lucide-react"
import { Button } from "../../../components/CommonUI/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/CommonUI/card";
import { Input } from "../../../components/CommonUI/input";
import { Label } from "../../../components/CommonUI/label";
import { Textarea } from "../../../components/CommonUI/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/CommonUI/select";
import { Checkbox } from "../../../components/DashboardUI/checkbox";

export function OrganizationHub() {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [myOrgInfo, setMyOrgInfo] = useState(null);
const [loadingStatus, setLoadingStatus] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    whatsapp: "",
    telegram: "",
    organizationType: "",
    supportNeeds: [],
    purpose: "",
    website: "",
    github: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const organizationTypes = ["Ecosystem", "Company", "University", "Other"];
  const supportOptions = [
    "Run a Hackathon",
    "Sponsor a Hackathon",
    "Promote Developer Tooling",
    "Mentorship Opportunities",
    "Collaborate on Events",
    "Feature Us on the Platform",
    "Other",
  ];

  const organizations = [
    {
      name: "Cryptify",
      description: "Making Crypto Disappear",
      members: "4+",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RSHq3lKmTNFYmCWXFV16f36K5mSEGM.png",
      type: "BlockChain",
    },
    {
      name: "HackZen",
      description: "From 0 to Next 🔝",
      members: "11+",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RSHq3lKmTNFYmCWXFV16f36K5mSEGM.png",
      type: "Platform",
    },
    {
      name: "AyurHerb",
      description: "Step into Nature",
      members: "2+",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RSHq3lKmTNFYmCWXFV16f36K5mSEGM.png",
      type: "HealthCare",
    },
  ];

  const applicationStatus = {
    submitted: true,
    status: "Under Review",
    submittedDate: "December 20, 2024",
    reviewDate: "Expected by December 27, 2024",
    organizationName: "TechCorp Solutions",
    contactPerson: "John Smith",
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleSupportNeedsChange = (option, checked) => {
    setFormData((prev) => ({
      ...prev,
      supportNeeds: checked
      ? [...prev.supportNeeds, option]
      : prev.supportNeeds.filter((item) => item !== option),
    }));
  };
  
  const validateEmail = (email) => {
    const disallowedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "protonmail.com",
    ];
    const domain = email.split("@")[1];
    return !disallowedDomains.includes(domain);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.name || !formData.contactPerson || !formData.email || !formData.organizationType) {
      alert("Please fill in all required fields.");
      return;
    }
  
    if (!validateEmail(formData.email)) {
      alert("Please use an official organization email address.");
      return;
    }
  
    if (formData.supportNeeds.length === 0) {
      alert("Please select at least one support need.");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You're not logged in. Please log in to submit the application.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const response = await fetch("http://localhost:3000/api/organizations/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
  const contentType = response.headers.get("content-type");
  let data = {};
  
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    throw new Error("Server error: " + text.substring(0, 100));
  }
      if (!response.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  
      alert("✅ Application submitted successfully!");
  
      setShowApplicationForm(false);
      setFormData({
        name: "",
        contactPerson: "",
        email: "",
        whatsapp: "",
        telegram: "",
        organizationType: "",
        supportNeeds: [],
        purpose: "",
        website: "",
        github: "",
      });
    } catch (error) {
      alert("❌ Submission failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
const fetchMyApplicationStatus = async () => {
  setLoadingStatus(true);
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3000/api/organizations/my", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const contentType = response.headers.get("content-type");
    let data = {};

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      throw new Error("Server error: " + text.substring(0, 100));
    }

    if (!response.ok) throw new Error(data.message || "Something went wrong.");

    // ✅ Set modal state
    setMyOrgInfo({
      status: data.applicationStatus || "Under Review",
      contactPerson: data.contactPerson,
      organizationName: data.name,
      reviewDate: "3-5 days",
    });
    setShowStatusModal(true);
  } catch (error) {
    alert("❌ Failed to fetch status: " + error.message);
  } finally {
    setLoadingStatus(false);
  }
};





  // Application form layout (like Create Hackathon page)
  if (showApplicationForm) {
    return (
      <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        {/* Header */}
        <div className=" border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowApplicationForm(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Organization Hub
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Apply for Organizer
              </h1>
              <p className="text-sm text-gray-600">
                Set up your organization profile with all the necessary details
              </p>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Essential details about your organization
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Organization Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          maxLength={80}
                          required
                          placeholder="Enter organization name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) =>
                            handleInputChange("contactPerson", e.target.value)
                          }
                          maxLength={80}
                          required
                          placeholder="Enter contact person name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Official Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                        placeholder="contact@yourorganization.com"
                      />
                      <p className="text-xs text-gray-500">
                        Please use an official organization email (not Gmail,
                        Yahoo, etc.)
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="organizationType">
                          Organization Type *
                        </Label>
                        <Select
                          value={formData.organizationType}
                          onValueChange={(value) =>
                            handleInputChange("organizationType", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {organizationTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={(e) =>
                            handleInputChange("website", e.target.value)
                          }
                          placeholder="https://yourorganization.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <Input
                          id="whatsapp"
                          value={formData.whatsapp}
                          onChange={(e) =>
                            handleInputChange("whatsapp", e.target.value)
                          }
                          placeholder="+1234567890"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telegram">Telegram</Label>
                        <Input
                          id="telegram"
                          value={formData.telegram}
                          onChange={(e) =>
                            handleInputChange("telegram", e.target.value)
                          }
                          placeholder="@username"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github">GitHub Organization</Label>
                      <Input
                        id="github"
                        value={formData.github}
                        onChange={(e) =>
                          handleInputChange("github", e.target.value)
                        }
                        placeholder="https://github.com/yourorganization"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Support Needs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Support Needs
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      What kind of support are you looking for?
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {supportOptions.map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={option}
                            checked={formData.supportNeeds.includes(option)}
                            onCheckedChange={(checked) =>
                              handleSupportNeedsChange(option, checked)
                            }
                          />
                          <Label htmlFor={option} className="text-sm">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Purpose & Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Purpose & Goals
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Tell us more about your organization
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Organization Purpose</Label>
                      <Textarea
                        id="purpose"
                        value={formData.purpose}
                        onChange={(e) =>
                          handleInputChange("purpose", e.target.value)
                        }
                        maxLength={1000}
                        rows={5}
                        placeholder="Describe your organization's purpose, goals, and what you hope to achieve..."
                      />
                      <p className="text-xs text-gray-500">
                        {formData.purpose.length}/1000 characters
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Settings & Preview */}
              <div className="space-y-6">
                {/* Application Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Application Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Organization Type</Label>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        {formData.organizationType || "Not selected"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Support Needs</Label>
                      <div className="p-2 bg-gray-50 rounded text-sm min-h-[60px]">
                        {formData.supportNeeds.length > 0
                          ? formData.supportNeeds.join(", ")
                          : "None selected"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-sm">Draft</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <p className="text-sm text-gray-600">
                      How your organization will appear
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">
                            {formData.name
                              ? formData.name.charAt(0).toUpperCase()
                              : "O"}
                          </span>
                        </div>
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {formData.organizationType || "Type"}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {formData.name || "Organization Name"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {formData.purpose
                          ? formData.purpose.substring(0, 100) + "..."
                          : "Organization description will appear here..."}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        <span>Pending Approval</span>
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
                      onClick={handleSubmit}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                    <Button variant="outline" className="w-full">
                      Save as Draft
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Organization Hub page (unchanged)
  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Organization Hub
            </h1>
            <p className="text-sm text-gray-600">
              Connect with leading Web3 ecosystems
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/*  Hero Section */}
          <Card className="mb-8">
            <CardHeader className="pb-0">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Organization Hub
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex-1 max-w-2xl">
                  <p className="text-gray-600 text-lg mb-6">
                    Discover and connect with leading Web3 ecosystems on
                    HackZen. From Layer 1 and Layer 2 blockchains to DeFi,
                    GameFi, and infrastructure protocols, explore a diverse
                    range of ecosystems shaping the decentralized future.
                  </p>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setShowApplicationForm(true)}
                      className="font-medium px-6"
                    >
                      Apply for Organizer
                    </Button>
                    <Button
                      variant="outline"
                      className="px-6"
                     onClick={fetchMyApplicationStatus}

                    >
                      Check My Application
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <img
                    src="https://www.hackquest.io/images/layout/hackathon_cover.png"
                    alt="Organization Hub Illustration"
                    className="w-80 h-80 object-contain"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Organization Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              My Organization
            </h3>
            <Card>
              <CardContent className="flex items-center justify-center py-16 pt-8">
                <div className="text-center">
                  <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Nothing Here</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Apply to become an organizer to see your organization
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Organizations Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              All Organizations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">
                          {org.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {org.members}
                      </div>
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {org.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {org.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {org.type}
                      </span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Application Status Modal */}
     {showStatusModal && myOrgInfo && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 rounded-lg shadow-xl max-w-md w-full mx-4">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Application Status
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowStatusModal(false)}
            className="p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">
                {myOrgInfo.status}
              </p>
              <p className="text-sm text-gray-600">
                Submitted by {myOrgInfo.contactPerson}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Organization:</span>
              <span className="font-medium">
                {myOrgInfo.organizationName}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Contact Person:</span>
              <span className="font-medium">
                {myOrgInfo.contactPerson}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Expected Review:</span>
              <span className="font-medium">
                {myOrgInfo.reviewDate || "3-5 days"}
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              We'll notify you via email once your application is reviewed.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => setShowStatusModal(false)}
            className="px-6"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );

}