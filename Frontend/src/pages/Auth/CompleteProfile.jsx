import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const userTypes = [
  { value: "school", label: "School Student" },
  { value: "college", label: "College Student" },
  { value: "fresher", label: "Fresher" },
  { value: "professional", label: "Professional" },
];

const domains = [
  "engineering", "computer-science", "information-technology", "data-science", "artificial-intelligence", "machine-learning", "cybersecurity", "web-development", "mobile-development", "game-development", "design", "business", "management", "finance", "marketing", "law", "medicine", "pharmacy", "nursing", "architecture", "arts", "humanities", "social-sciences", "education", "agriculture", "environmental-science", "other"
];

const courseDurations = ["1-year", "2-years", "3-years", "4-years", "5-years", "6-years", "other"];
const yearsOfExperience = ["0-1", "1-2", "2-3", "3-5", "5-10", "10+"];
const currentYears = ["1st-year", "2nd-year", "3rd-year", "4th-year", "final-year", "other"];
const hackathonTypes = ["web-development", "mobile-app", "ai-ml", "blockchain", "iot", "game-dev", "design", "social-impact", "fintech", "healthtech", "edtech", "other"];
const teamSizes = ["solo", "2-3", "4-5", "6+", "any"];

export default function CompleteProfile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  // Debug: Check what's in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("🔍 Debug - Stored user from localStorage:", storedUser);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("🔍 Debug - Parsed user:", parsedUser);
        console.log("🔍 Debug - Parsed user._id:", parsedUser._id);
      } catch (err) {
        console.error("❌ Error parsing stored user:", err);
      }
    }
    console.log("🔍 Debug - User from AuthContext:", user);
  }, [user]);
  
  const [form, setForm] = useState({
    phone: "",
    gender: "prefer-not-to-say",
    userType: "",
    domain: "",
    course: "",
    courseDuration: "",
    collegeName: "",
    country: "",
    city: "",
    courseSpecialization: "",
    companyName: "",
    jobTitle: "",
    yearsOfExperience: "",
    currentYear: "",
    skills: "",
    interests: "",
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    portfolio: "",
    preferredHackathonTypes: "",
    teamSizePreference: "any",
    bio: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("🔍 Debug - Token from localStorage:", token);
      console.log("🔍 Debug - Token type:", typeof token);
      console.log("🔍 Debug - Token length:", token ? token.length : 0);
      console.log("🔍 Debug - Token starts with 'eyJ':", token ? token.startsWith('eyJ') : false);
      console.log("🔍 Debug - Token contains dots:", token ? (token.split('.').length - 1) : 0);
      
      console.log("🔍 Debug - User object:", user);
      console.log("🔍 Debug - User._id:", user?._id);
      console.log("🔍 Debug - User.id:", user?.id);
      
      if (!user?._id) {
        console.error("❌ User._id is undefined!");
        setError("User ID not found. Please try logging in again.");
        return;
      }
      
      const res = await axios.put(
        `http://localhost:3000/api/users/${user._id}/complete-profile`,
        { ...form, profileCompleted: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      login(res.data, token);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ CompleteProfile error:", err);
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600">Please fill in the required details to continue to your dashboard</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Required Fields Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Required Information</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input 
              name="phone" 
              value={form.phone} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
            <select 
              name="gender" 
              value={form.gender} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="prefer-not-to-say">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Type *</label>
            <select 
              name="userType" 
              value={form.userType} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your user type</option>
              {userTypes.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Domain *</label>
            <select 
              name="domain" 
              value={form.domain} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your domain</option>
              {domains.map((d) => <option key={d} value={d}>{d.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
            <input 
              name="course" 
              value={form.course} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Computer Science, Engineering"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Duration</label>
            <select 
              name="courseDuration" 
              value={form.courseDuration} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select duration</option>
              {courseDurations.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">College/University Name *</label>
            <input 
              name="collegeName" 
              value={form.collegeName} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your college/university name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
            <input 
              name="country" 
              value={form.country} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your country"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input 
              name="city" 
              value={form.city} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your city"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Specialization *</label>
            <input 
              name="courseSpecialization" 
              value={form.courseSpecialization} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Software Engineering, Data Science"
            />
          </div>

          {/* Optional Fields Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 mt-8">Additional Information (Optional)</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input 
              name="companyName" 
              value={form.companyName} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your company name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input 
              name="jobTitle" 
              value={form.jobTitle} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your job title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
            <select 
              name="yearsOfExperience" 
              value={form.yearsOfExperience} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select experience</option>
              {yearsOfExperience.map((y) => <option key={y} value={y}>{y} years</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Year</label>
            <select 
              name="currentYear" 
              value={form.currentYear} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select year</option>
              {currentYears.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
            <input 
              name="skills" 
              value={form.skills} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., JavaScript, Python, React"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests (comma separated)</label>
            <input 
              name="interests" 
              value={form.interests} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., AI, Web Development, Blockchain"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile</label>
            <input 
              name="github" 
              value={form.github} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://github.com/username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
            <input 
              name="linkedin" 
              value={form.linkedin} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
            <input 
              name="twitter" 
              value={form.twitter} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://twitter.com/username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
            <input 
              name="instagram" 
              value={form.instagram} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://instagram.com/username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio</label>
            <input 
              name="portfolio" 
              value={form.portfolio} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://your-portfolio.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Hackathon Types (comma separated)</label>
            <input 
              name="preferredHackathonTypes" 
              value={form.preferredHackathonTypes} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., web-development, ai-ml, blockchain"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Size Preference</label>
            <select 
              name="teamSizePreference" 
              value={form.teamSizePreference} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {teamSizes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea 
              name="bio" 
              value={form.bio} 
              onChange={handleChange} 
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
        
        <div className="flex justify-center pt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 min-w-[200px]"
          >
            {loading ? "Saving..." : "Save & Continue to Dashboard"}
          </button>
        </div>
      </form>
    </div>
  );
} 