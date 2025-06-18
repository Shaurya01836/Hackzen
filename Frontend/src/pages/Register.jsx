import React from "react";
import { Github } from "lucide-react";
import GoogleIcon from "../components/common/GoogleIcon";

function Register() {
  return (
    <div className="bg-white px-10 py-10 rounded-2xl shadow-xl w-full max-w-4xl text-black space-y-6 max-h-[90vh] overflow-y-auto scroll-container">
      <h2 className="text-3xl font-bold text-center">Create Your Account</h2>
      <p className="text-center text-sm text-gray-600">Join the community</p>

      {/* Auth Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition w-full">
          <GoogleIcon className="w-6 h-6" />
          <span className="font-medium">Sign up with Google</span>
        </button>
        <button className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition w-full">
          <Github className="w-6 h-6" />
          <span className="font-medium">Sign up with GitHub</span>
        </button>
      </div>

      <div className="text-center text-gray-500 text-sm">
        — or sign up with details —
      </div>

      {/* Registration Form */}
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Name*</label>
          <input
            type="text"
            placeholder="John Doe"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email*</label>
          <input
            type="email"
            placeholder="john@example.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password*</label>
          <input
            type="password"
            placeholder=""
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            GitHub Username
          </label>
          <input
            type="text"
            placeholder="your-github-username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Profile Image URL
          </label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b0c3f]"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Skills*</label>
          <input
            type="text"
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
        <span className="text-[#1b0c3f] font-medium cursor-pointer hover:underline">
          Login
        </span>
      </p>
    </div>
  );
}

export default Register;
