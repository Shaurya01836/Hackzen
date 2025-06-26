"use client";
import React from "react";
import { BoxReveal } from "../Magic UI/BoxReveal";
import { InteractiveHoverButton } from "../Magic UI/HoverButton";
import { Link } from "react-router-dom";

function Header() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-screen py-20">
        {/* Left Side: Main Content */}
        <div className="w-full lg:w-3/5 flex flex-col space-y-12">
          {/* Badge */}
          <BoxReveal boxColor="#6366f1" duration={0.3}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium border border-indigo-200 w-fit">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
              Live Platform • Trusted by 10K+ Developers
            </div>
          </BoxReveal>

          {/* Main Headline */}
          <BoxReveal boxColor="#6366f1" duration={0.5}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Build the{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 bg-clip-text text-transparent animate-gradient">
                Future
              </span>{" "}
              of Tech
              <div className="flex items-center mt-4">
                <span className="text-slate-600">One</span>
                <div className="mx-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg text-3xl lg:text-4xl font-bold shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  Hack
                </div>
                <span className="text-slate-600">at a Time</span>
              </div>
            </h1>
          </BoxReveal>

          {/* Subtitle */}
          <BoxReveal boxColor="#6366f1" duration={0.5}>
            <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-2xl">
              Join thousands of innovators building breakthrough solutions. From
              idea to deployment, we provide the platform where
              <span className="font-semibold text-indigo-600">
                {" "}
                extraordinary happens
              </span>
              .
            </p>
          </BoxReveal>

          {/* Stats */}
          <BoxReveal boxColor="#6366f1" duration={0.5}>
            <div className="flex flex-wrap gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600">500+ Active Projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600">50+ Partner Companies</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600">$2M+ in Prizes</span>
              </div>
            </div>
          </BoxReveal>

          {/* CTA Buttons */}
          <BoxReveal boxColor="#6366f1" duration={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="dashboard/explore-hackathons">
                <InteractiveHoverButton className="bg-[#1b0c3f] hover:bg-[#2d1a5f] text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all duration-300 w-full sm:w-auto text-center border-2 border-transparent hover:border-indigo-200 group">
                  <span className="flex items-center justify-center space-x-2">
                    <span>View Hackathons</span>
                  </span>
                </InteractiveHoverButton>
              </Link>
            </div>
          </BoxReveal>
        </div>

        {/* Right Side: Enhanced Floating Tech Cards */}
        <div className="w-full lg:w-2/5 flex items-center justify-center mt-16 lg:mt-0">
          <div className="relative w-[500px] h-[500px]">
            {/* AI/ML Card */}
            <div className="absolute top-[15%] left-[64%] glassmorphism rounded-xl p-4 shadow-xl animate-float animation-delay-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                <div className="text-xs font-mono text-gray-700">AI/ML</div>
              </div>
              <div className="mt-2 flex space-x-1">
                <div className="w-8 h-1 bg-gradient-to-r from-green-300 to-emerald-400 rounded"></div>
                <div className="w-4 h-1 bg-gradient-to-r from-emerald-300 to-green-400 rounded"></div>
              </div>
            </div>

            {/* Blockchain Card */}
            <div className="absolute top-[35%] left-[35%] glassmorphism rounded-xl p-4 shadow-xl animate-float animation-delay-1000">
              <div className="text-2xl mb-2 animate-bounce">🔗</div>
              <div className="text-xs font-mono text-gray-700">Blockchain</div>
              <div className="mt-1 flex space-x-1">
                <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full"></div>
              </div>
            </div>

            {/* Web3 Card */}
            <div className="absolute bottom-[45%] left-[65%] glassmorphism rounded-xl p-4 shadow-xl animate-float animation-delay-1500">
              <div className="text-2xl mb-2">🌐</div>
              <div className="text-xs font-mono text-gray-700">Web3</div>
              <div className="mt-1">
                <div className="w-10 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Cloud Computing Card */}
            <div className="absolute top-[10%] left-[38%] glassmorphism rounded-xl p-3 shadow-xl animate-float-reverse animation-delay-500">
              <div className="flex items-center space-x-2">
                <div className="text-lg">☁️</div>
                <div className="text-xs font-mono text-gray-700">Cloud</div>
              </div>
              <div className="mt-1 flex space-x-1">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-sky-300 to-blue-400 rounded-full"></div>
              </div>
            </div>

            {/* IoT Card */}
            <div className="absolute bottom-[25%] left-[78%] glassmorphism rounded-xl p-3 shadow-xl animate-wiggle animation-delay-2500">
              <div className="text-lg mb-1">📡</div>
              <div className="text-xs font-mono text-gray-700">IoT</div>
              <div className="mt-1 grid grid-cols-2 gap-1">
                <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
              </div>
            </div>

            {/* Data Science Card */}
            <div className="absolute top-[35%] -right-[8%] glassmorphism rounded-xl p-3 shadow-xl animate-float-reverse animation-delay-3500">
              <div className="text-lg mb-1">📊</div>
              <div className="text-xs font-mono text-gray-700">Data Sci</div>
              <div className="mt-1 flex space-x-1">
                <div className="w-2 h-4 bg-gradient-to-t from-indigo-300 to-purple-400 rounded"></div>
                <div className="w-2 h-2 bg-gradient-to-t from-purple-300 to-pink-400 rounded"></div>
                <div className="w-2 h-3 bg-gradient-to-t from-pink-300 to-rose-400 rounded"></div>
              </div>
            </div>

            {/* Mobile Dev Card */}
            <div className="absolute bottom-[22%] left-[50%] glassmorphism rounded-xl p-3 shadow-xl animate-float animation-delay-4000">
              <div className="text-lg mb-1">📱</div>
              <div className="text-xs font-mono text-gray-700">Mobile</div>
              <div className="mt-1 flex space-x-1">
                <div className="w-4 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded"></div>
                <div className="w-2 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 rounded"></div>
              </div>
            </div>

            {/* AR/VR Card */}
            <div className="absolute top-[8%] -right-[6%] glassmorphism rounded-xl p-3 shadow-xl animate-wiggle animation-delay-4500">
              <div className="text-lg mb-1">🥽</div>
              <div className="text-xs font-mono text-gray-700">AR/VR</div>
              <div className="mt-1">
                <div className="w-8 h-1 bg-gradient-to-r from-violet-400 to-purple-500 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-32 right-32 hidden xl:block">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 animate-fade-in-up animation-delay-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              1,247 hackers online
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Header;
