import React from "react";
import { Github } from "lucide-react";
import GoogleIcon from "../components/common/GoogleIcon";

function Register() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1b0c3f] to-[#0d061f] px-4 py-8">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-2xl text-black space-y-6">
        <h2 className="text-3xl font-bold text-center">Create Your Account</h2>
        <p className="text-center text-sm text-gray-600">Join the community</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name*</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b0c3f] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email*</label>
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b0c3f] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password*</label>
            <input
              type="password"
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b0c3f] outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GitHub Username</label>
            <input
              type="text"
              placeholder="your-github-username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b0c3f] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Profile Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b0c3f] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Skills*</label>
            <input
              type="text"
              placeholder="React, Node.js, MongoDB"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b0c3f] outline-none"
              required
            />
          </div>
        </div>

        {/* Auth Provider Buttons */}
        <div className="flex flex-col gap-4">
          <button className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition">
            <GoogleIcon className="w-6 h-6" />
            <span className="font-medium">Sign up with Google</span>
          </button>
          <button className="flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition">
            <Github className="w-6 h-6" />
            <span className="font-medium">Sign up with GitHub</span>
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#1b0c3f] hover:bg-[#2a1364] text-white font-semibold py-2 rounded-lg transition"
        >
          Create Account
        </button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <span className="text-[#1b0c3f] font-medium cursor-pointer hover:underline">
            Login
          </span>
        </p>
      </div>
    </section>
  );
}

export default Register;
