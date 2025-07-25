"use client";
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

  return (
    <section ref={sectionRef} className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">
        Overview & Requirements
      </h2>
      
      {/* Full Width Content */}
      <div className="space-y-6">
        {/* Description - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>About This Hackathon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed text-lg">{hackathon.description || ''}</p>
          </CardContent>
        </Card>

        {/* Organizer Info - Full Width with Better Layout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Organizer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                <AvatarFallback className="text-xl">{typeof organizer === 'string' && organizer.length > 0 ? organizer[0] : '?'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-xl">{organizer}</h3>
                <p className="text-gray-600 text-lg">Event Organizer</p>
                <div className="flex gap-3 mt-3">
                  <Button size="sm" variant="outline">
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements and What You'll Need - Side by Side Grid */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {requirements.length > 0 ? (
                  requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Open to all skill levels</span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                What You'll Need
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  Laptop/Computer with development environment
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  Stable internet connection
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  Team of {teamSize.min || 1} to {teamSize.max || 4} members
                  {teamSize.allowSolo ? " (solo participation allowed)" : ""}
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  GitHub account for code submission
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information Section - Full Width */}
        {tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Technologies & Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}