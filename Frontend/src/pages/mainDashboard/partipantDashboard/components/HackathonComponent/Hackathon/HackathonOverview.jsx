"use client";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/CommonUI/card";
import { Badge } from "../../../../../../components/CommonUI/badge";
import { Building, MapPin, Target, Award, Users, AlertCircle, CheckCircle, Globe, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../../components/DashboardUI/avatar";
import { Button } from "../../../../../../components/CommonUI/button";

export default function HackathonOverview({ hackathon, sectionRef, user, onShowParticipants }) {
  // Defensive: default arrays and strings
  const requirements = Array.isArray(hackathon.requirements) ? hackathon.requirements : [];
  const organizer = hackathon.organizer || '';
  const tags = Array.isArray(hackathon.tags) ? hackathon.tags : [];
  const teamSize = hackathon.teamSize || {};
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <section ref={sectionRef} className="space-y-6 max-w-5xl mx-auto">
      {/* Main Container Card */}
      <Card className="shadow-none hover:shadow-none">
        {/* Section Header */}
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-1 h-8 bg-indigo-500 rounded-full"></div>
            Overview & Requirements
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 my-4">
              <h3 className="text-xl font-semibold text-gray-900">Details</h3>
            </div>
            <div className="">
              <p className="text-gray-700 leading-relaxed text-lg">
                {hackathon.description || 'Join us for an exciting hackathon experience!'}
              </p>
            </div>
          </div>
            <hr />
          {/* Organizer Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
           
              <h3 className="text-xl font-semibold text-gray-900">Organizer</h3>
            </div>
            <div className="">
              <div className="flex items-center gap-6">
                <Avatar className="w-10 h-10 border-2 border-indigo-200">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="text-lg font-semibold bg-indigo-100 text-indigo-700">
                    {typeof organizer === 'string' && organizer.length > 0 ? organizer[0] : '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-xl text-gray-900">{organizer}</h4>
                  <p className="text-gray-600 text-sm">Event Organizer</p>
                </div>
                
                {/* Modern Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    aria-label="More options"
                  >
                    <svg 
                      className="w-5 h-5 text-gray-600" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div 
                      ref={dropdownRef}
                      className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1"
                    >
                      <button
                        onClick={() => {
                          // Handle website click
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
                      >
                        <Globe className="w-4 h-4 text-gray-500" />
                        Website
                      </button>
                      <button
                        onClick={() => {
                          // Handle contact click
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-150"
                      >
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        Contact
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <hr />
          {/* Requirements and What You'll Need Grid */}
          <div className="grid grid-cols-1  gap-8">
            {/* Requirements Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
               
                <h3 className="text-xl font-semibold text-gray-900">Requirements</h3>
              </div>
              <div className="">
                <ul className="space-y-4">
                  {requirements.length > 0 ? (
                    requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 leading-relaxed">{req}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">Open to all skill levels</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <hr />
            {/* What You'll Need Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
               
                <h3 className="text-xl font-semibold text-gray-900">What You'll Need</h3>
              </div>
              <div className="">
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="leading-relaxed">Laptop/Computer with development environment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="leading-relaxed">Stable internet connection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                    <span className="leading-relaxed">
                      Team of {teamSize.min || 1} to {teamSize.max || 4} members
                      {teamSize.allowSolo ? " (solo participation allowed)" : ""}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="leading-relaxed">GitHub account for code submission</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
