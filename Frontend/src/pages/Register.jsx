import React, { useState } from "react";
import { Github } from "lucide-react";
import GoogleIcon from "../components/common/GoogleIcon";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    githubUsername: "",
    profileImage: "",
    skills: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:3000/api/users/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        githubUsername: form.githubUsername,
        profileImage: form.profileImage,
        skills: form.skills.split(",").map(skill => skill.trim())
      });

      // Store token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:3000/api/users/google";
  };

  const handleGithubSignup = () => {
    window.location.href = "http://localhost:3000/api/users/github";
  };

  return (
    <div className="bg-white px-10 py-10 rounded-2xl shadow-xl w-full max-w-4xl text-black space-y-6 max-h-[90vh] overflow-y-auto scroll-container">
      <h2 className="text-3xl font-bold text-center">Create Your Account</h2>
      <p className="text-center text-sm text-gray-600">Join the community</p>

      {/* Auth Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition w-full"
        >
          <GoogleIcon className="w-6 h-6" />
          <span className="font-medium">Sign up with Google</span>
        </button>
        <button
          onClick={handleGithubSignup}
          className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition w-full"
        >
          <Github className="w-6 h-6" />
          <span className="font-medium">Sign up with GitHub</span>
        </button>
      </div>

      <div className="text-center text-gray-500 text-sm">
        — or sign up with details —
      </div>

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {errorMsg && (
          <div className="col-span-2 text-red-600 text-sm font-medium">{errorMsg}</div>
        )}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Name*</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email*</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password*</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="********"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GitHub Username</label>
          <input
            type="text"
            name="githubUsername"
            value={form.githubUsername}
            onChange={handleChange}
            placeholder="your-github-username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Profile Image URL</label>
          <input
            type="url"
            name="profileImage"
            value={form.profileImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Skills*</label>
          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]"
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-[#1b0c3f] hover:bg-[#2a1364] text-white font-semibold py-2 rounded-lg transition"
          >
            Create Account
          </button>
        </div>
      </form>

      <p className="text-sm text-center text-gray-500">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-[#1b0c3f] font-medium hover:underline"
        >
          Login
        </a>
      </p>
    </div>
  );
}

export default Register;
