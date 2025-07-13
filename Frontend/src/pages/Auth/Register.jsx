import React, { useState } from "react";
import { Github } from "lucide-react";
import GoogleIcon from "../../components/common/GoogleIcon";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register({ onClose, onSwitchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get redirectTo from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirectTo');

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
        password: form.password
      });

      // Store token and user info using context
      login(res.data.user, res.data.token);

      // Call onClose if provided
      if (onClose) onClose();

      // Redirect based on profile completion
      if (!res.data.user.profileCompleted) {
        navigate("/complete-profile");
      } else if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    // Add redirectTo to Google OAuth URL if present
    const googleUrl = redirectTo 
      ? `http://localhost:3000/api/users/google?redirectTo=${encodeURIComponent(redirectTo)}`
      : "http://localhost:3000/api/users/google";
    window.location.href = googleUrl;
  };

  const handleGithubSignup = () => {
    // Add redirectTo to GitHub OAuth URL if present
    const githubUrl = redirectTo 
      ? `http://localhost:3000/api/users/github?redirectTo=${encodeURIComponent(redirectTo)}`
      : "http://localhost:3000/api/users/github";
    window.location.href = githubUrl;
  };

  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      // Fallback to direct navigation if smooth transition not available
      const loginUrl = redirectTo 
        ? `/?modal=login&redirectTo=${encodeURIComponent(redirectTo)}`
        : "/?modal=login";
      navigate(loginUrl);
    }
  };

  return (
    <div className="bg-white px-10 py-10 rounded-2xl shadow-xl w-full max-w-2xl text-black space-y-6 max-h-[90vh] overflow-y-auto scroll-container">
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
        — or sign up with email —
      </div>

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        {errorMsg && (
          <div className="text-red-600 text-sm font-medium">{errorMsg}</div>
        )}
        <div>
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
          href="#"
          onClick={handleSwitchToLogin}
          className="text-[#1b0c3f] font-medium hover:underline"
        >
          Login
        </a>
      </p>
    </div>
  );
}

export default Register;