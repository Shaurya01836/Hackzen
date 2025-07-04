"use client";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Building2,
  Users,
  ExternalLink,
  FileText,
  CheckCircle,
  X,
  Clock,
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
import { useAuth } from "../../../context/AuthContext";

export function OrganizationHub() {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [myOrgInfo, setMyOrgInfo] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [orgDetails, setOrgDetails] = useState(null);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const { token, refreshUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

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
  
      // Check if it's a resubmission or new application
      const isResubmission = response.status === 200 && data.message?.includes("resubmitted");
      alert(isResubmission ? "✅ Application resubmitted successfully!" : "✅ Application submitted successfully!");
  
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
      // Refresh user info and organization details after submission
      await refreshUser();
      setLoadingOrg(true);
      
      // Try to fetch organization details
      const refreshResponse = await fetch("http://localhost:3000/api/organizations/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setOrgDetails(refreshData);
      } else {
        // If no organization found, clear the details to show the application form again
        setOrgDetails(null);
      }
      setLoadingOrg(false);
      
      // Refresh application status to get the latest status
      await refreshApplicationStatus();
    } catch (error) {
      alert("❌ Submission failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchOrg = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingOrg(false);
        return;
      }
      try {
        await refreshUser(); // Refresh user info after mount
        const response = await fetch("http://localhost:3000/api/organizations/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setOrgDetails(data);
        }
      } catch (err) {
        console.error("Error fetching organization:", err);
      } finally {
        setLoadingOrg(false);
      }
    };
    fetchOrg();
    
    // Also fetch application status on mount
    refreshApplicationStatus();
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      refreshApplicationStatus();
    }, 30000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const fetchMyApplicationStatus = async () => {
    setLoadingStatus(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/organizations/my-application", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("No application found");
      const data = await response.json();
      setMyOrgInfo({
        status: data.status,
        contactPerson: data.contactPerson,
        organizationName: data.organizationName,
        rejectedAt: data.rejectedAt,
        createdAt: data.createdAt,
        // ...other fields
      });
      setShowStatusModal(true);
    } catch (error) {
      alert("❌ Failed to fetch status: " + error.message);
    } finally {
      setLoadingStatus(false);
    }
  };

  // Function to refresh application status without showing modal
  const refreshApplicationStatus = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3000/api/organizations/my-application", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setMyOrgInfo({
          status: data.status,
          contactPerson: data.contactPerson,
          organizationName: data.organizationName,
          rejectedAt: data.rejectedAt,
          createdAt: data.createdAt,
        });
      }
    } catch (error) {
      console.error("Failed to refresh application status:", error);
    }
  };

  // Start editing
  const startEdit = () => {
    setEditFormData(orgDetails);
    setEditMode(true);
  };

  // Handle edit input changes
  const handleEditChange = (field, value) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle support needs change
  const handleEditSupportNeedsChange = (option, checked) => {
    setEditFormData((prev) => ({
      ...prev,
      supportNeeds: checked
        ? [...(prev.supportNeeds || []), option]
        : (prev.supportNeeds || []).filter(item => item !== option),
    }));
  };

  // Submit the edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/organizations/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });
      if (!res.ok) throw new Error("Failed to update organization");
      setEditMode(false);
      await refreshUser();
      setLoadingOrg(true);
      const refreshResponse = await fetch("http://localhost:3000/api/organizations/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setOrgDetails(refreshData);
      }
      setLoadingOrg(false);
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  // Application form overlay (unchanged)
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

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Header */}
      <header className="w-full  px-8 py-6 mb-0">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Organization Hub</h1>
          <p className="text-base text-gray-600">
            Manage your organization, track your application, and connect with the Web3 ecosystem.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start w-full px-2 md:px-8 py-8">
        <div className="w-full flex flex-col gap-8">
          {/* Quick Actions & Stats */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Quick Actions Card (50%) */}
            <div className="w-full md:w-1/2 flex">
              <Card className="flex-1 max-w-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Apply for Organizer
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={fetchMyApplicationStatus}
                  >
                    Check My Application
                  </Button>
                </CardContent>
              </Card>
            </div>
            {/* Stats Cards (50%) */}
            <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-4">
              {/* Status Card */}
              <Card className="flex-1 flex flex-col items-center justify-center py-4 max-w-full">
                <div className="flex flex-col items-center">
                  {orgDetails?.approved ? (
                    <CheckCircle className="w-8 h-8 mb-2 text-green-500" />
                  ) : (
                    <Clock className="w-8 h-8 mb-2 text-yellow-500" />
                  )}
                  <CardHeader className="p-0 pb-1 text-center">
                    <CardTitle className="text-base font-semibold">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 text-center">
                    <span className={`text-base font-semibold ${orgDetails?.approved ? "text-green-600" : "text-yellow-600"}`}>
                      {orgDetails
                        ? orgDetails.approved
                          ? "Approved"
                          : "Pending"
                        : "N/A"}
                    </span>
                  </CardContent>
                </div>
              </Card>
              {/* Type Card */}
              <Card className="flex-1 flex flex-col items-center justify-center py-4 max-w-full">
                <div className="flex flex-col items-center">
                  <Building2 className="w-8 h-8 mb-2 text-indigo-500" />
                  <CardHeader className="p-0 pb-1 text-center">
                    <CardTitle className="text-base font-semibold">Type</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 text-center">
                    <span className="text-base font-semibold">
                      {orgDetails?.organizationType || "N/A"}
                    </span>
                  </CardContent>
                </div>
              </Card>
              {/* Support Needs Card */}
              <Card className="flex-1 flex flex-col items-center justify-center py-4 max-w-full">
                <div className="flex flex-col items-center">
                  <Users className="w-8 h-8 mb-2 text-purple-500" />
                  <CardHeader className="p-0 pb-1 text-center">
                    <CardTitle className="text-base font-semibold">Support Needs</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 text-center">
                    <span className="text-base font-semibold">
                      {orgDetails?.supportNeeds?.length ?? 0}
                    </span>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>

          {/* My Organization */}
          <Card className="w-full shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">My Organization</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOrg ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-lg">Loading organization details...</p>
                  </div>
                </div>
              ) : editMode ? (
                <form onSubmit={handleEditSubmit} className="space-y-4 max-w-2xl mx-auto">
                  <div>
                    <Label>Organization Name</Label>
                    <Input
                      value={editFormData?.name || ""}
                      onChange={e => handleEditChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Contact Person</Label>
                    <Input
                      value={editFormData?.contactPerson || ""}
                      onChange={e => handleEditChange("contactPerson", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={editFormData?.email || ""}
                      onChange={e => handleEditChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Organization Type</Label>
                    <Select
                      value={editFormData?.organizationType || ""}
                      onValueChange={value => handleEditChange("organizationType", value)}
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
                  <div>
                    <Label>Support Needs</Label>
                    <div className="flex flex-wrap gap-2">
                      {supportOptions.map(option => (
                        <label key={option} className="flex items-center gap-2">
                          <Checkbox
                            checked={editFormData?.supportNeeds?.includes(option)}
                            onCheckedChange={checked =>
                              handleEditSupportNeedsChange(option, checked)
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <Textarea
                      value={editFormData?.purpose || ""}
                      onChange={e => handleEditChange("purpose", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input
                      value={editFormData?.website || ""}
                      onChange={e => handleEditChange("website", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>GitHub</Label>
                    <Input
                      value={editFormData?.github || ""}
                      onChange={e => handleEditChange("github", e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button type="submit" className="bg-indigo-600 text-white">Save</Button>
                    <Button type="button" variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                  </div>
                </form>
              ) : orgDetails ? (
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="w-20 h-20 bg-indigo-600 rounded-lg flex items-center justify-center mb-4 md:mb-0">
                    <span className="text-white font-bold text-3xl">
                      {orgDetails.name ? orgDetails.name.charAt(0).toUpperCase() : "O"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                      <h4 className="text-2xl font-bold text-gray-900">{orgDetails.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        orgDetails.approved ? "bg-green-100 text-green-700" : 
                        orgDetails.rejected ? "bg-red-100 text-red-700" : 
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {orgDetails.approved ? "Approved" : 
                         orgDetails.rejected ? "Rejected" : 
                         "Pending"}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {orgDetails.purpose || "No description available"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Contact Person:</span>
                        <p className="font-medium">{orgDetails.contactPerson}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{orgDetails.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <p className="font-medium">{orgDetails.organizationType}</p>
                      </div>
                    
                      {orgDetails.website && (
                        <div>
                          <span className="text-gray-500">Website:</span>
                          <p className="font-medium">
                            <a 
                              href={orgDetails.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              {orgDetails.website}
                            </a>
                          </p>
                        </div>
                      )}
                      {orgDetails.github && (
                        <div>
                          <span className="text-gray-500">GitHub:</span>
                          <p className="font-medium">
                            <a 
                              href={orgDetails.github} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              {orgDetails.github}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                    {orgDetails.supportNeeds && orgDetails.supportNeeds.length > 0 && (
                      <div className="mt-4">
                        <span className="text-gray-500 text-sm">Support Needs:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {orgDetails.supportNeeds.map((need, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {need}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button className="mt-6" onClick={startEdit}>Edit</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Nothing Here</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Apply to become an organizer to see your organization
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Application Status Modal (unchanged) */}
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
                  <div className={`w-3 h-3 rounded-full ${
                    myOrgInfo.status === "approved"
                      ? "bg-green-500"
                      : myOrgInfo.status === "rejected"
                      ? "bg-red-500"
                      : "bg-yellow-400"
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {myOrgInfo.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      Submitted by {myOrgInfo.contactPerson}
                    </p>
                  </div>
                </div>

                {myOrgInfo.status === "approved" ? (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Organization:</span>
                      <span className="font-medium">
                        {myOrgInfo.organizationName}
                      </span>
                    </div>
                  </div>
                ) : myOrgInfo.status === "rejected" ? (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-red-600">
                    <p>Your application was rejected.</p>
                    {myOrgInfo.rejectedAt && (
                      <p className="mt-1 text-xs text-gray-500">
                        Rejected on {new Date(myOrgInfo.rejectedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-yellow-600">
                    <p>Your application is under review.</p>
                    {myOrgInfo.createdAt && (
                      <p className="mt-1 text-xs text-gray-500">
                        Submitted on {new Date(myOrgInfo.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

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